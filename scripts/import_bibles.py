"""Import text only from the user-provided WordProject archives.

Archive markup/scripts are never executed. Paths are not extracted wholesale.
Original verse numbers are retained; no translation or renumbering is performed.
"""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BOOKS = "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split("|")


class ChapterParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.active = False
        self.marker = False
        self.number = None
        self.text = []
        self.verses = []
        self.heading = False
        self.headings = []
        self.issue = None

    def flush(self):
        if self.number is not None:
            text = re.sub(r"\s+", " ", "".join(self.text)).strip()
            verse = {"n": self.number, "text": text}
            if not text:
                verse["sourceIssue"] = "This verse marker has no text in the supplied archive."
            elif self.issue:
                verse["sourceIssue"] = self.issue
            self.verses.append(verse)
        self.number, self.text = None, []
        self.issue = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("h1", "h2"):
            self.heading = True
            self.headings.append("")
        if tag == "div":
            if a.get("id") == "textBody":
                self.active = True
                self.depth = 1
            elif self.active:
                self.depth += 1
        if self.active and tag == "span" and re.sub(r"\s", "", a.get("class", "")) == "verse":
            if "id" in a:
                self.flush()
                self.number = int(a["id"])
            else:
                self.issue = "The source contains an extra unnumbered marker and mixed Hindi/Telugu text. Preserved as supplied; needs editorial review."
            self.marker = True
        if self.active and tag == "br":
            self.text.append(" ")

    def handle_endtag(self, tag):
        if tag in ("h1", "h2"):
            self.heading = False
        if tag == "span":
            self.marker = False
        if self.active and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.flush()
                self.active = False

    def handle_data(self, data):
        if self.heading:
            self.headings[-1] += data
        if self.active and self.number is not None and not self.marker:
            self.text.append(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=ROOT / "sources")
    args = parser.parse_args()
    out = ROOT / "public" / "data"
    out.mkdir(parents=True, exist_ok=True)
    editions = [
        ("kjv", "kj.zip", "King James Version", "en", "kj"),
        ("tel", "tel_new.zip", "Telugu · WordProject", "te", "tel"),
        ("drc", "drc_new.zip", "Douay–Rheims · supplied selection", "en", "drc"),
    ]
    manifest = {"source": "User-provided WordProject archives", "editions": [], "pdfs": 0}
    for edition, filename, label, language, source_path in editions:
        path = args.source_dir / filename
        books = {}
        with zipfile.ZipFile(path) as archive:
            for member in sorted(archive.namelist()):
                match = re.fullmatch(r"[^/]+/(\d{2})/(\d+)\.htm", member)
                if not match:
                    continue
                book, chapter = map(int, match.groups())
                if not 1 <= book <= 66:
                    raise ValueError(f"Unsupported book identity: {member}")
                parsed = ChapterParser()
                raw = archive.read(member)
                try:
                    markup = raw.decode("utf-8-sig")
                except UnicodeDecodeError:
                    # kj/53/1.htm is ASCII scripture with Latin-1 registered
                    # sign/nonbreaking spaces in the footer.
                    if filename != "kj.zip" or member != "kj/53/1.htm":
                        raise
                    if set(byte for byte in raw if byte > 127) - {0xAE, 0xA0}:
                        raise
                    markup = raw.decode("cp1252")
                parsed.feed(markup)
                parsed.flush()
                verses = parsed.verses
                numbers = [v["n"] for v in verses]
                if not numbers:
                    raise ValueError(f"No verse markers: {member}")
                for verse in verses:
                    if numbers.count(verse["n"]) > 1:
                        verse["sourceIssue"] = "Duplicate verse number in the supplied archive; preserved without renumbering."
                item = books.setdefault(book, {
                    "id": book, "name": BOOKS[book - 1],
                    "localName": re.sub(r"\s+", " ", parsed.headings[-1]).strip(),
                    "chapters": {},
                })
                item["chapters"][str(chapter)] = verses
        edition_dir = out / edition
        edition_dir.mkdir(exist_ok=True)
        index = []
        anomalies = []
        source_issues = []
        for book_id, book in sorted(books.items()):
            chapter_numbers = sorted(map(int, book["chapters"]))
            if chapter_numbers != list(range(1, max(chapter_numbers) + 1)):
                raise ValueError(f"Missing chapter in {edition} {book_id}")
            for chapter, verses in book["chapters"].items():
                for verse in verses:
                    if "sourceIssue" in verse:
                        source_issues.append({"book": book_id, "chapter": int(chapter), "verse": verse["n"], "note": verse["sourceIssue"]})
                numbers = [v["n"] for v in verses]
                if numbers != list(range(1, max(numbers) + 1)):
                    anomalies.append({"book": book_id, "chapter": int(chapter), "verseNumbers": numbers})
            (edition_dir / f"{book_id}.json").write_text(json.dumps(book, ensure_ascii=False), encoding="utf-8")
            index.append({k: v for k, v in book.items() if k != "chapters"} | {
                "chapters": len(book["chapters"]),
                "verses": sum(map(len, book["chapters"].values())),
            })
        record = {
            "id": edition, "label": label, "language": language,
            "archive": filename, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "sourceUrl": f"https://www.wordproject.org/bibles/{source_path}/index.htm",
            "books": index, "chapterCount": sum(b["chapters"] for b in index),
            "verseCount": sum(b["verses"] for b in index), "numberingAnomalies": anomalies, "sourceIssues": source_issues,
        }
        manifest["editions"].append(record)
        print(f"{edition}: {len(index)} books, {record['chapterCount']} chapters, {record['verseCount']} verses; {len(anomalies)} numbering anomalies")
    pdf_path = args.source_dir / "English-PDF.zip"
    if pdf_path.exists():
        pdf_dir = ROOT / "public" / "pdf"
        pdf_dir.mkdir(exist_ok=True)
        with zipfile.ZipFile(pdf_path) as archive:
            for member in archive.namelist():
                match = re.fullmatch(r"English-PDF/(\d+)\.pdf", member)
                if match and 1 <= int(match[1]) <= 66:
                    data = archive.read(member)
                    if not data.startswith(b"%PDF"):
                        raise ValueError(f"Invalid PDF: {member}")
                    (pdf_dir / f"{int(match[1])}.pdf").write_bytes(data)
                    manifest["pdfs"] += 1
        manifest["pdfArchiveSha256"] = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()

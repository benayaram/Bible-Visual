import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
const json = (p) =>
  JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const manifest = json("public/data/manifest.json");
const events = json("src/data/events.json");
const eras = json("src/data/eras.json");
const links = json("src/data/connections.json");
const book = (edition, id) => json(`public/data/${edition}/${id}.json`);
test("all edition files match their declared counts and retain source verse order", () => {
  for (const edition of manifest.editions) {
    assert.equal(edition.books.length, 66);
    let chapterCount = 0,
      verseCount = 0;
    for (const info of edition.books) {
      const b = book(edition.id, info.id);
      assert.equal(b.id, info.id);
      assert.equal(Object.keys(b.chapters).length, info.chapters);
      for (const verses of Object.values(b.chapters)) {
        chapterCount++;
        verseCount += verses.length;
        for (const v of verses) {
          assert.ok(Number.isInteger(v.n) && v.n > 0);
          assert.equal(typeof v.text, "string");
          if (!v.text) assert.ok(v.sourceIssue);
          assert.ok(!/<script|<span|<br\s*\/?|Wordproject®/.test(v.text));
        }
        if (edition.id !== "drc")
          assert.deepEqual(
            verses.map((v) => v.n),
            Array.from({ length: verses.length }, (_, i) => i + 1),
          );
      }
    }
    assert.equal(chapterCount, edition.chapterCount);
    assert.equal(verseCount, edition.verseCount);
  }
  assert.equal(manifest.editions[0].verseCount, 31102);
  assert.equal(manifest.editions[1].verseCount, 31102);
});
test("all curated passages resolve to every cited KJV and Telugu verse", () => {
  const refs = [
    ...events.flatMap((e) => e.refs),
    ...links.flatMap((l) => l.refs ?? []),
  ];
  for (const ref of refs)
    for (const edition of ["kjv", "tel"]) {
      const vs = book(edition, ref.book).chapters[ref.chapter];
      assert.ok(vs, JSON.stringify(ref));
      for (let n = ref.start; n <= ref.end; n++)
        assert.ok(
          vs.some((v) => v.n === n),
          `${edition}: ${JSON.stringify(ref)} missing ${n}`,
        );
    }
});
test("graph identities, section memberships, and relationship types are consistent", () => {
  assert.equal(new Set(events.map((e) => e.id)).size, events.length);
  assert.equal(new Set(links.map((l) => l.id)).size, links.length);
  events.forEach((e, i) => {
    assert.equal(e.order, i);
    assert.ok(eras.some((p) => p.id === e.era));
    assert.ok(e.chronology.length > 20);
    assert.ok(e.refs.length > 0);
  });
  for (const l of links) {
    assert.ok(events.some((e) => e.id === l.from));
    assert.ok(events.some((e) => e.id === l.to));
    assert.ok(["same-event", "contemporary", "thematic"].includes(l.type));
    assert.ok(l.evidence.length > 30);
  }
});
test("source defects are retained and flagged instead of silently inventing corrections", () => {
  const empty = book("tel", 14).chapters["35"].find((v) => v.n === 27);
  assert.equal(empty.text, "");
  assert.match(empty.sourceIssue, /no text/);
  const mixed = book("tel", 30).chapters["7"][0];
  assert.match(mixed.text, /[\u0900-\u097f]/);
  assert.match(mixed.text, /[\u0c00-\u0c7f]/);
  assert.ok(mixed.sourceIssue);
  const duplicates = book("drc", 42).chapters["1"].filter((v) => v.n === 59);
  assert.equal(duplicates.length, 2);
  assert.ok(duplicates.every((v) => v.sourceIssue));
  assert.equal(
    book("drc", 42).chapters["1"].some((v) => v.n === 60),
    false,
  );
  const exodus = book("kjv", 2).chapters["10"];
  assert.match(exodus.find((v) => v.n === 25).text, /Moses said/);
  assert.doesNotMatch(exodus.find((v) => v.n === 24).text, /Thou must give/);
});
test("beginning and ending source texts, and all PDFs, are present", () => {
  assert.equal(
    book("kjv", 1).chapters["1"][0].text,
    "In the beginning God created the heaven and the earth.",
  );
  assert.equal(book("kjv", 66).chapters["22"].at(-1).n, 21);
  assert.match(book("tel", 1).chapters["1"][0].text, /ఆదియందు/);
  const pdfs = readdirSync(new URL("../public/pdf/", import.meta.url));
  assert.equal(pdfs.length, 66);
  for (const p of pdfs)
    assert.equal(
      readFileSync(new URL(`../public/pdf/${p}`, import.meta.url))
        .subarray(0, 4)
        .toString(),
      "%PDF",
    );
});

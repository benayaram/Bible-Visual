import { editions } from "./bible";
import type { Reference } from "./types";
export function decodeReaderLocation(hash: string): {
  edition: string;
  reference: Reference;
  notice: string;
} {
  const fallback = {
    edition: "kjv",
    reference: { book: 1, chapter: 1, start: 1, end: 1 },
    notice: "",
  };
  if (!hash.startsWith("#reader?")) return fallback;
  const params = new URLSearchParams(hash.split("?")[1]);
  const edition = params.get("edition") ?? "kjv";
  const info = editions.find((e) => e.id === edition);
  const book = Number(params.get("book") ?? 1);
  const chapter = Number(params.get("chapter") ?? 1);
  const start = Number(params.get("verse") ?? 0);
  const end = Number(params.get("end") ?? start);
  if (
    !info ||
    ![book, chapter, start, end].every(Number.isInteger) ||
    book < 1 ||
    book > 66 ||
    chapter < 1 ||
    chapter > (info.books.find((b) => b.id === book)?.chapters ?? 0) ||
    start < 0 ||
    end < start ||
    end > 200
  )
    return {
      ...fallback,
      notice: "This reader link is invalid. Genesis 1 is shown instead.",
    };
  return { edition, reference: { book, chapter, start, end }, notice: "" };
}
export function readerHash(edition: string, ref: Reference) {
  const q = new URLSearchParams({
    edition,
    book: String(ref.book),
    chapter: String(ref.chapter),
  });
  if (ref.start > 0) {
    q.set("verse", String(ref.start));
    if (ref.end !== ref.start) q.set("end", String(ref.end));
  }
  return `#reader?${q}`;
}

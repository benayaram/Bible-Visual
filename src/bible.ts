import publication from "./data/publication.json";
import manifestData from "../public/data/manifest.json";
import type { Book, Edition, Reference } from "./types";
export const manifest = manifestData as unknown as {
  editions: Edition[];
  pdfs: number;
  source: string;
};
export const editions = manifest.editions;
export const publicRelease = import.meta.env.MODE === "public";
export const editionAvailable = (id: string) =>
  !publicRelease || publication.editions.some((e) => e.id === id && e.approved);
export const sourcePassageUrl = (edition: string, ref: Reference) =>
  `${editions.find((e) => e.id === edition)!.sourceUrl.replace("index.htm", "")}${String(ref.book).padStart(2, "0")}/${ref.chapter}.htm#${ref.start || 1}`;
export const books = editions[0].books;
export const refLabel = (ref: Reference) =>
  `${books.find((b) => b.id === ref.book)?.name ?? ref.book} ${ref.chapter}:${ref.start}${ref.end !== ref.start ? `–${ref.end}` : ""}`;
const cache = new Map<string, Promise<Book>>();
export function loadBook(edition: string, book: number): Promise<Book> {
  if (!editionAvailable(edition))
    return Promise.reject(
      new Error(
        "This edition is awaiting publication permission. Read the passage at the linked source.",
      ),
    );
  const key = `${edition}/${book}`;
  if (!cache.has(key))
    cache.set(
      key,
      fetch(`/data/${key}.json`)
        .then((r) => {
          if (!r.ok)
            throw new Error(
              "This Bible text could not be loaded. Please try again.",
            );
          return r.json();
        })
        .catch((e) => {
          cache.delete(key);
          throw e;
        }),
    );
  return cache.get(key)!;
}
export function parseReference(value: string): Reference | null {
  const match = value.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:[-–](\d+))?)?$/);
  if (!match) return null;
  const normalize = (text: string) =>
    text.toLocaleLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
  const title = normalize(match[1]);
  const names = books.map((book) => ({
    ...book,
    aliases: [
      normalize(book.name),
      normalize(editions[1].books[book.id - 1].localName),
    ],
  }));
  const exact = names.find((book) => book.aliases.includes(title));
  const candidates = names.filter(
    (book) =>
      title.length >= 3 && book.aliases.some((name) => name.startsWith(title)),
  );
  const book = exact ?? (candidates.length === 1 ? candidates[0] : undefined);
  if (!book) return null;
  return {
    book: book.id,
    chapter: +match[2],
    start: +(match[3] || 1),
    end: +(match[4] || match[3] || 1),
  };
}

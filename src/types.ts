export type Reference = {
  book: number;
  chapter: number;
  start: number;
  end: number;
};
export type BibleEvent = {
  id: string;
  era: string;
  title: string;
  telugu: string;
  summary: string;
  refs: Reference[];
  lane: string;
  chronology: string;
  order: number;
  chronologyMetadata: {
    precision: "relative_only" | "undated" | "visionary";
    modelId: null;
    fromYear: null;
    toYear: null;
  };
  review: EditorialReview;
  accounts: {
    id: string;
    ref: Reference;
    kind:
      "retelling" | "narrated_event" | "parallel_account" | "passage_anchor";
  }[];
};
export type EditorialReview = {
  status: "pending" | "reviewed";
  reviewer: string | null;
  sourceIds: string[];
};
export type Connection = {
  id: string;
  from: string;
  to: string;
  type: "same-event" | "contemporary" | "thematic";
  title: string;
  evidence: string;
  refs?: Reference[];
  review: EditorialReview;
};
export type Verse = { n: number; text: string; sourceIssue?: string };
export type Book = {
  id: number;
  name: string;
  localName: string;
  chapters: Record<string, Verse[]>;
};
export type BookInfo = {
  id: number;
  name: string;
  localName: string;
  chapters: number;
  verses: number;
};
export type Edition = {
  id: string;
  label: string;
  language: string;
  archive: string;
  sha256: string;
  sourceUrl: string;
  books: BookInfo[];
  chapterCount: number;
  verseCount: number;
  numberingAnomalies: unknown[];
  sourceIssues: {
    book: number;
    chapter: number;
    verse: number;
    note: string;
  }[];
};

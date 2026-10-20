import type { BibleEvent, Connection } from "./types";
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const fail = (message: string): never => {
  throw new Error(`Content validation: ${message}`);
};
function reference(value: unknown) {
  if (!object(value)) fail("reference must be an object");
  const v = value as Record<string, unknown>;
  for (const key of ["book", "chapter", "start", "end"])
    if (!Number.isInteger(v[key]) || Number(v[key]) < 1)
      fail(`invalid reference ${key}`);
  if (Number(v.book) > 66 || Number(v.end) < Number(v.start))
    fail("invalid reference range");
}
function review(value: unknown, sources: Set<string>) {
  if (!object(value) || !["pending", "reviewed"].includes(String(value.status)))
    fail("missing review status");
  const r = value as Record<string, unknown>;
  if (
    !Array.isArray(r.sourceIds) ||
    !r.sourceIds.length ||
    r.sourceIds.some((id) => !sources.has(id))
  )
    fail("unknown or missing source");
  if (
    r.status === "reviewed" &&
    (typeof r.reviewer !== "string" || !r.reviewer.trim())
  )
    fail("reviewed content needs a named reviewer");
}
export function validateContent(
  events: unknown,
  connections: unknown,
  eraIds: string[],
  sourceIds: string[],
): asserts events is BibleEvent[] {
  if (!Array.isArray(events) || !Array.isArray(connections))
    fail("expected event and connection arrays");
  const items = events as unknown[];
  const links = connections as unknown[];
  const sources = new Set(sourceIds);
  const ids = new Set<string>();
  const accountIds = new Set<string>();
  items.forEach((value, index) => {
    if (!object(value)) fail("invalid event");
    const e = value as Record<string, unknown>;
    if (typeof e.id !== "string" || !e.id || ids.has(e.id))
      fail("duplicate or missing event ID");
    ids.add(e.id as string);
    if (!eraIds.includes(String(e.era)) || e.order !== index)
      fail("invalid event section/order");
    for (const field of ["title", "summary", "chronology", "lane"])
      if (typeof e[field] !== "string" || !String(e[field]).trim())
        fail(`event missing ${field}`);
    if (!Array.isArray(e.refs) || !e.refs.length) fail("event needs a passage");
    (e.refs as unknown[]).forEach(reference);
    review(e.review, sources);
    if (!object(e.chronologyMetadata)) fail("event needs chronology metadata");
    const c = e.chronologyMetadata as Record<string, unknown>;
    if (
      !["relative_only", "undated", "visionary"].includes(String(c.precision))
    )
      fail("unsupported chronology precision");
    if (c.modelId !== null || c.fromYear !== null || c.toYear !== null)
      fail("no sourced absolute-date models have been supplied");
    if (
      !Array.isArray(e.accounts) ||
      e.accounts.length !== (e.refs as unknown[]).length
    )
      fail("event account list must match its passages");
    (e.accounts as unknown[]).forEach((account, i) => {
      if (
        !object(account) ||
        typeof account.id !== "string" ||
        accountIds.has(account.id)
      )
        fail("duplicate or missing account ID");
      const a = account as Record<string, unknown>;
      accountIds.add(a.id as string);
      if (
        ![
          "retelling",
          "narrated_event",
          "parallel_account",
          "passage_anchor",
        ].includes(String(a.kind))
      )
        fail("invalid account kind");
      reference(a.ref);
      if (JSON.stringify(a.ref) !== JSON.stringify((e.refs as unknown[])[i]))
        fail("account/reference mismatch");
    });
  });
  const linkIds = new Set<string>();
  links.forEach((value) => {
    if (!object(value)) fail("invalid relationship");
    const c = value as Record<string, unknown>;
    if (typeof c.id !== "string" || linkIds.has(c.id))
      fail("duplicate relationship ID");
    linkIds.add(c.id as string);
    if (!ids.has(String(c.from)) || !ids.has(String(c.to)))
      fail("orphan relationship");
    if (!["same-event", "contemporary", "thematic"].includes(String(c.type)))
      fail("unknown relationship type");
    if (typeof c.evidence !== "string" || !c.evidence.trim())
      fail("relationship needs evidence");
    review(c.review, sources);
    if (c.refs) {
      if (!Array.isArray(c.refs)) fail("invalid relationship references");
      (c.refs as unknown[]).forEach(reference);
    }
  });
}
// Keeps the relationship type available to consumers without widening it to string.
export type ValidatedConnection = Connection;

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateContent } from "../src/domain.ts";
const json = (name) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), "utf8"),
  );
const events = json("events"),
  links = json("connections"),
  eras = json("eras"),
  sources = json("sources");
const validate = (e = events, l = links) =>
  validateContent(
    e,
    l,
    eras.map((x) => x.id),
    sources.map((x) => x.id),
  );
test("editorial dataset validates, with a single Saul death event and two accounts", () => {
  assert.doesNotThrow(() => validate());
  const saul = events.filter((e) => e.id === "saul-death");
  assert.equal(saul.length, 1);
  assert.deepEqual(
    saul[0].accounts.map((a) => a.ref.book),
    [9, 13],
  );
  assert.deepEqual(
    events.find((e) => e.id === "feeding").accounts.map((a) => a.ref.book),
    [40, 41, 42, 43],
  );
  assert.deepEqual(
    events.find((e) => e.id === "paul").accounts.map((a) => a.kind),
    ["narrated_event", "retelling", "retelling"],
  );
  assert.ok(
    events.every(
      (e) =>
        e.chronologyMetadata.fromYear === null &&
        e.chronologyMetadata.toYear === null,
    ),
  );
});
test("content validator rejects unsupported dates, reviewers, sources and broken account references", () => {
  const edit = (fn) => {
    const items = structuredClone(events);
    fn(items);
    assert.throws(() => validate(items), /Content validation/);
  };
  edit((items) => (items[0].chronologyMetadata.fromYear = -4004));
  edit((items) => (items[0].review.sourceIds = ["invented-source"]));
  edit((items) => (items[0].review.status = "reviewed"));
  edit((items) => (items[0].accounts[0].ref.start = 99));
  const other = structuredClone(links);
  other[0].from = "missing";
  assert.throws(() => validate(events, other), /orphan relationship/);
});

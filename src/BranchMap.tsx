import { useState } from "react";
import { GitBranch, ArrowUpRight, BookOpen, Info } from "lucide-react";
import type { BibleEvent, Reference } from "./types";
import { refLabel } from "./bible";
import eventData from "./data/events.json";
const events = eventData as BibleEvent[];
const maps = [
  {
    id: "kingdom",
    label: "Israel & Judah",
    root: "split",
    caption: "Two kingdoms, overlapping histories",
    note: "Each column follows its own narrative sequence. Rows do not mean the same year. Ahab’s time connects Elijah and Jehoshaphat (1 Kings 17; 22); Samaria’s siege overlaps Hezekiah’s reign (2 Kings 18:9–10).",
    lanes: [
      {
        title: "Northern kingdom · Israel",
        events: ["elijah", "elisha", "amos", "samaria"],
      },
      {
        title: "Southern kingdom · Judah",
        events: ["jehoshaphat", "hezekiah", "josiah", "jerusalem"],
      },
    ],
  },
  {
    id: "family",
    label: "Joseph & Judah",
    root: "jacob",
    caption: "One family, two narrative threads",
    note: "Genesis 37–39 moves between Joseph in Egypt and Judah in Canaan. Genesis 38:1 links the broader period, but the text does not date both scenes to the same day.",
    lanes: [
      { title: "Joseph’s thread · Egypt", events: ["joseph"] },
      { title: "Judah’s thread · Canaan", events: ["judah"] },
    ],
  },
];
export function BranchMap({
  onSelect,
  onRead,
}: {
  onSelect: (e: BibleEvent) => void;
  onRead: (r: Reference) => void;
}) {
  const [selected, setSelected] = useState("kingdom");
  const map = maps.find((m) => m.id === selected)!;
  const root = events.find((e) => e.id === map.root)!;
  return (
    <section className="branch-map" aria-label="Narrative branch explorer">
      <div className="branch-map-heading">
        <div>
          <div className="eyebrow green">
            <GitBranch size={14} /> FOLLOW THE BRANCHES
          </div>
          <h2>{map.caption}</h2>
        </div>
        <div className="branch-tabs">
          {maps.map((m) => (
            <button
              key={m.id}
              aria-pressed={m.id === selected}
              className={m.id === selected ? "active" : ""}
              onClick={() => setSelected(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="branch-diagram">
        <button className="branch-root" onClick={() => onSelect(root)}>
          <span className="eyebrow">THE STORY BRANCHES</span>
          <strong>{root.title}</strong>
          <span>
            {refLabel(root.refs[0])} <ArrowUpRight size={12} />
          </span>
        </button>
        <svg
          className="branch-lines"
          viewBox="0 0 600 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M300 0V15Q300 24 287 24H162Q150 24 150 36V48M300 15Q300 24 313 24H438Q450 24 450 36V48" />
        </svg>
        <div className="branch-lanes">
          {map.lanes.map((lane, i) => (
            <div className={`branch-lane lane-${i}`} key={lane.title}>
              <h3>{lane.title}</h3>
              {lane.events.map((id) => {
                const event = events.find((e) => e.id === id)!;
                return (
                  <div className="branch-step" key={id}>
                    <button onClick={() => onSelect(event)}>
                      <span>{event.title}</span>
                      <ArrowUpRight size={14} />
                    </button>
                    <button
                      className="reference-chip"
                      onClick={() => onRead(event.refs[0])}
                    >
                      <BookOpen size={12} />
                      {refLabel(event.refs[0])}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="branch-note">
        <Info size={16} />
        <p>{map.note}</p>
      </div>
    </section>
  );
}

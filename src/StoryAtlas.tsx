import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Maximize,
  RotateCcw,
  Map,
  Info,
} from "lucide-react";
import type { BibleEvent, Connection } from "./types";
import { refLabel } from "./bible";
const lanes = [
  { id: "story", label: "Main story" },
  { id: "family", label: "Family threads" },
  { id: "israel", label: "Northern Israel" },
  { id: "judah", label: "Southern Judah" },
  { id: "voices", label: "Wisdom & vision" },
];
export function eventLane(event: BibleEvent) {
  if (event.lane === "Northern Israel") return "israel";
  if (event.lane === "Southern Judah") return "judah";
  if (event.era === "wisdom" || event.era === "newcreation") return "voices";
  if (["lot", "joseph", "judah", "ruth", "esther"].includes(event.id))
    return "family";
  return "story";
}
const height = 540,
  nodeWidth = 206,
  nodeHeight = 87,
  gap = 246,
  startX = 38,
  top = 87,
  laneHeight = 86;
export function StoryAtlas({
  events,
  connections,
  onSelect,
}: {
  events: BibleEvent[];
  connections: Connection[];
  onSelect: (e: BibleEvent) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; offset: number } | null>(null);
  const [width, setWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);
  const [showLinks, setShowLinks] = useState(true);
  const visible = useMemo(
    () => events.filter((e) => !hidden.includes(eventLane(e))),
    [events, hidden],
  );
  const nodes = useMemo(
    () =>
      visible.map((event, i) => ({
        event,
        x: startX + i * gap,
        y: top + lanes.findIndex((l) => l.id === eventLane(event)) * laneHeight,
      })),
    [visible],
  );
  const contentWidth = Math.max(
    width,
    startX * 2 + Math.max(0, nodes.length - 1) * gap + nodeWidth,
  );
  const bound = (value: number, scale = zoom) =>
    Math.min(0, Math.max(width - contentWidth * scale - 20, value));
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setWidth(Math.max(260, entries[0].contentRect.width)),
    );
    observer.observe(container.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setOffset(0);
  }, [events, hidden]);
  useEffect(() => setOffset((v) => bound(v)), [width, zoom, contentWidth]);
  const changeZoom = (next: number) => {
    const k = Math.max(0.04, Math.min(1.8, next));
    setOffset((x) => bound(width / 2 - ((width / 2 - x) * k) / zoom, k));
    setZoom(k);
  };
  const fit = () => {
    const k = Math.max(0.04, Math.min(1, (width - 30) / contentWidth));
    setZoom(k);
    setOffset(0);
  };
  const pan = (delta: number) => setOffset((v) => bound(v + delta));
  const focusNode = (x: number) => {
    const sx = x * zoom + offset;
    if (sx < 20 || sx + nodeWidth * zoom > width - 20)
      setOffset(bound(width / 2 - (x + nodeWidth / 2) * zoom));
  };
  return (
    <section className="story-atlas" aria-label="Interactive story atlas">
      <div className="atlas-intro">
        <div>
          <span className="eyebrow green">
            <Map size={13} /> THE STORY ATLAS
          </span>
          <h3>Follow a thread. Open the text.</h3>
        </div>
        <span className="atlas-dataset">
          Curated study dataset · review pending
        </span>
      </div>
      <div className="atlas-lane-controls" aria-label="Visible narrative lanes">
        {lanes.map((l) => (
          <button
            key={l.id}
            aria-pressed={!hidden.includes(l.id)}
            onClick={() =>
              setHidden((v) =>
                v.includes(l.id) ? v.filter((id) => id !== l.id) : [...v, l.id],
              )
            }
          >
            <i className={`atlas-lane-dot ${l.id}`} />
            {l.label}
          </button>
        ))}
        <label>
          <input
            type="checkbox"
            checked={showLinks}
            onChange={(e) => setShowLinks(e.target.checked)}
          />
          Period connections
        </label>
      </div>
      <div className="atlas-controlbar">
        <span>
          Story order <b>·</b> Drag the canvas or use arrow keys
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Pan atlas left"
            onClick={() => pan(width * 0.65)}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Pan atlas right"
            onClick={() => pan(-width * 0.65)}
          >
            <ArrowRight size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Zoom out atlas"
            disabled={zoom <= 0.04}
            onClick={() => changeZoom(zoom / 1.3)}
          >
            <Minus size={16} />
          </button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button
            className="icon-button"
            aria-label="Zoom in atlas"
            disabled={zoom >= 1.8}
            onClick={() => changeZoom(zoom * 1.3)}
          >
            <Plus size={16} />
          </button>
          <button className="icon-button" aria-label="Fit atlas" onClick={fit}>
            <Maximize size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Reset atlas"
            onClick={() => {
              setZoom(1);
              setOffset(0);
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div className="atlas-canvas" ref={container}>
        <svg
          role="group"
          aria-label="Story canvas. Arrow keys pan, plus and minus zoom, Home resets."
          tabIndex={0}
          width="100%"
          height={Math.max(height, height * zoom)}
          viewBox={`0 0 ${width} ${Math.max(height, height * zoom)}`}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (
              ["ArrowRight", "ArrowLeft", "+", "=", "-", "Home"].includes(e.key)
            )
              e.preventDefault();
            if (e.key === "ArrowRight") pan(-180);
            if (e.key === "ArrowLeft") pan(180);
            if (e.key === "+" || e.key === "=") changeZoom(zoom * 1.3);
            if (e.key === "-") changeZoom(zoom / 1.3);
            if (e.key === "Home") {
              setZoom(1);
              setOffset(0);
            }
          }}
          onPointerDown={(e) => {
            if ((e.target as Element).closest("button")) return;
            drag.current = { x: e.clientX, offset };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (drag.current)
              setOffset(
                bound(drag.current.offset + e.clientX - drag.current.x),
              );
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <defs>
            <pattern
              id="atlas-grid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r=".8" fill="#dce5d4" />
            </pattern>
          </defs>
          <rect
            width={width}
            height={Math.max(height, height * zoom)}
            fill="url(#atlas-grid)"
          />
          {lanes.map((lane, i) => (
            <g key={lane.id} opacity={hidden.includes(lane.id) ? 0.25 : 1}>
              <line
                x1="0"
                x2={width}
                y1={(top + i * laneHeight + nodeHeight / 2) * zoom}
                y2={(top + i * laneHeight + nodeHeight / 2) * zoom}
                stroke="#e0e7d7"
              />
              <text
                x="12"
                y={(top + i * laneHeight - 9) * zoom}
                className="atlas-lane-label"
              >
                {lane.label}
              </text>
            </g>
          ))}
          <g
            transform={`translate(${offset} 0) scale(${zoom})`}
            data-testid="atlas-transform"
          >
            {nodes.slice(1).map((node, i) => {
              const previous = nodes[i];
              const x1 = previous.x + nodeWidth,
                y1 = previous.y + nodeHeight / 2,
                x2 = node.x,
                y2 = node.y + nodeHeight / 2;
              return (
                <path
                  key={`sequence-${node.event.id}`}
                  d={`M${x1} ${y1}C${x1 + 20} ${y1} ${x2 - 20} ${y2} ${x2} ${y2}`}
                  fill="none"
                  stroke="#bfceb1"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              );
            })}
            {showLinks &&
              connections
                .filter((c) => c.type === "contemporary" && c.from !== c.to)
                .map((link) => {
                  const a = nodes.find((n) => n.event.id === link.from),
                    b = nodes.find((n) => n.event.id === link.to);
                  if (!a || !b) return null;
                  const x1 = a.x + nodeWidth / 2,
                    x2 = b.x + nodeWidth / 2,
                    y1 = a.y + nodeHeight,
                    y2 = b.y + nodeHeight;
                  return (
                    <path
                      key={link.id}
                      d={`M${x1} ${y1}C${x1} ${Math.max(y1, y2) + 30} ${x2} ${Math.max(y1, y2) + 30} ${x2} ${y2}`}
                      fill="none"
                      stroke="#ac8f55"
                      strokeWidth="1.5"
                    >
                      <title>
                        {link.title}. Broad period connection; no exact shared
                        date asserted.
                      </title>
                    </path>
                  );
                })}
            {nodes.map(({ event, x, y }) => (
              <foreignObject
                key={event.id}
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
              >
                <button
                  className={`atlas-node ${eventLane(event)}`}
                  aria-label={`Explore ${event.title}`}
                  onFocus={() => focusNode(x)}
                  onClick={() => onSelect(event)}
                >
                  <small>
                    STORY {String(event.order + 1).padStart(2, "0")} ·{" "}
                    {event.chronologyMetadata.precision.replace("_", " ")}
                  </small>
                  <strong>{event.title}</strong>
                  <span>{refLabel(event.refs[0])}</span>
                </button>
              </foreignObject>
            ))}
          </g>
        </svg>
        {!visible.length && (
          <div className="atlas-empty">
            Choose at least one lane to show its events.
          </div>
        )}
      </div>
      <label className="atlas-minimap">
        <span>MOVE THROUGH THE STORY</span>
        <input
          aria-label="Atlas overview position"
          type="range"
          min={0}
          max={Math.max(0, contentWidth * zoom - width + 20)}
          value={Math.max(0, -offset)}
          onChange={(e) => setOffset(-Number(e.target.value))}
        />
        <span>{visible.length} events</span>
      </label>
      <p className="atlas-note">
        <Info size={14} />
        Positions follow the curated story sequence. Distances and rows do not
        measure years or prove simultaneity. Gold curves mark documented period
        connections; open an event for the evidence.
      </p>
    </section>
  );
}

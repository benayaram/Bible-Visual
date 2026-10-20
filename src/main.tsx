import React, { useEffect, useRef, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Search,
  GitBranch,
  Layers3,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  X,
  Check,
  Info,
  Globe2,
  Sparkles,
  Library,
  ScrollText,
  ExternalLink,
  Download,
  SlidersHorizontal,
  Network,
  Compass,
  Sun,
  Sprout,
  Mountain,
  Crown,
  TentTree,
  Church,
  Waves,
  Heart,
  Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import eras from "./data/eras.json";
import eventData from "./data/events.json";
import connectionData from "./data/connections.json";
import {
  books,
  editions,
  manifest,
  loadBook,
  refLabel,
  parseReference,
  publicRelease,
  editionAvailable,
  sourcePassageUrl,
} from "./bible";
import type { BibleEvent, Book, Reference, Connection } from "./types";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/libre-caslon-display/latin-400.css";
import "@fontsource/noto-sans-telugu/telugu-400.css";
import "./style.css";
import { BranchMap } from "./BranchMap";
import { StoryAtlas } from "./StoryAtlas";
import { decodeReaderLocation, readerHash } from "./reader-location";
import { validateContent } from "./domain";
import sourceData from "./data/sources.json";
validateContent(
  eventData,
  connectionData,
  eras.map((e) => e.id),
  sourceData.map((s) => s.id),
);
const events = eventData as BibleEvent[];
const connections = connectionData as Connection[];
const eraIcons: LucideIcon[] = [
  Sun,
  Sprout,
  Waves,
  Mountain,
  Crown,
  GitBranch,
  TentTree,
  Heart,
  Church,
  Globe2,
  Sparkles,
];
const relationNames: Record<string, string> = {
  "same-event": "Parallel accounts",
  contemporary: "Overlapping periods",
  thematic: "Thematic connection",
};
type Page = "timeline" | "parallels" | "reader" | "sources" | "saved";
function initialPage(): Page {
  const p = location.hash.slice(1).split("?")[0];
  return ["timeline", "parallels", "reader", "sources", "saved"].includes(p)
    ? (p as Page)
    : "timeline";
}
function useBook(edition: string, id: number) {
  const [state, setState] = useState<{
    book: Book | null;
    error: string;
    loading: boolean;
  }>({ book: null, error: "", loading: true });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    if (!editionAvailable(edition)) {
      setState({ book: null, error: "", loading: false });
      return () => {
        alive = false;
      };
    }
    setState({ book: null, error: "", loading: true });
    loadBook(edition, id)
      .then((book) => {
        if (alive) setState({ book, error: "", loading: false });
      })
      .catch((e) => {
        if (alive) setState({ book: null, error: e.message, loading: false });
      });
    return () => {
      alive = false;
    };
  }, [edition, id, retry]);
  return { ...state, retry: () => setRetry((v) => v + 1) };
}
function Modal({
  children,
  onClose,
  label,
  wide = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      d.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
function Passage({
  reference,
  edition = "kjv",
  onRead,
  limit = 3,
}: {
  reference: Reference;
  edition?: string;
  onRead: (r: Reference) => void;
  limit?: number;
}) {
  const { book, error, loading, retry } = useBook(edition, reference.book);
  const verses =
    book?.chapters[reference.chapter]?.filter(
      (v) => v.n >= reference.start && v.n <= reference.end,
    ) ?? [];
  return (
    <article className="passage">
      <button className="passage-title" onClick={() => onRead(reference)}>
        <BookOpen size={15} />
        {refLabel(reference)}
        <ArrowUpRight size={15} />
      </button>
      <span className="edition-tag">
        {edition === "tel" ? "తెలుగు" : edition.toUpperCase()}
      </span>
      {!editionAvailable(edition) ? (
        <p className="source-pending">
          Text is awaiting publication permission.{" "}
          <a
            className="text-button"
            href={sourcePassageUrl(edition, reference)}
            target="_blank"
            rel="noreferrer"
          >
            Read this passage at WordProject <ExternalLink size={12} />
          </a>
        </p>
      ) : loading ? (
        <p className="muted">Loading passage…</p>
      ) : error ? (
        <p role="alert">
          {error} <button onClick={retry}>Retry</button>
        </p>
      ) : (
        <>
          <div lang={edition === "tel" ? "te" : "en"}>
            {verses.slice(0, limit).map((v, i) => (
              <p key={`${v.n}-${i}`}>
                <sup>{v.n}</sup>{" "}
                {v.text || "Text unavailable in supplied archive."}
                {v.sourceIssue && (
                  <span className="source-warning">{v.sourceIssue}</span>
                )}
              </p>
            ))}
          </div>
          {verses.length > limit && (
            <button className="text-button" onClick={() => onRead(reference)}>
              Read all {verses.length} verses <ArrowRight size={13} />
            </button>
          )}
        </>
      )}
    </article>
  );
}
function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 500 250" aria-hidden="true">
      <defs>
        <linearGradient id="glow" x1="0" x2="1">
          <stop stopColor="#c8b477" />
          <stop offset="1" stopColor="#e8d9a7" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#a9c7b0" strokeWidth=".6" opacity=".22">
        <circle cx="306" cy="126" r="112" />
        <circle cx="306" cy="126" r="82" />
        <circle cx="306" cy="126" r="52" />
        <path d="M65 126H470M306 4V248M215 35L397 217M215 217L397 35" />
      </g>
      <g fill="none" stroke="url(#glow)" strokeWidth="1.4">
        <path d="M58 128H151Q175 128 187 103L207 63Q218 42 244 42H351" />
        <path d="M151 128H242Q268 128 283 152L308 192Q320 211 346 211H438" />
        <path d="M241 128H420" />
        <path d="M207 63Q225 90 250 90H388" />
        <path d="M283 152Q307 171 330 171H389" />
      </g>
      {[
        [58, 128],
        [151, 128],
        [242, 128],
        [306, 128],
        [420, 128],
        [244, 42],
        [351, 42],
        [250, 90],
        [388, 90],
        [346, 211],
        [438, 211],
        [389, 171],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={i === 3 ? 13 : 6}
            fill="#214a3e"
            stroke="#d6c88e"
          />
          <circle cx={x} cy={y} r={i === 3 ? 5 : 2} fill="#d6c88e" />
        </g>
      ))}
      <g fill="#d0dece" fontSize="10" letterSpacing="2">
        <text x="55" y="154">
          CREATION
        </text>
        <text x="260" y="24">
          COVENANT
        </text>
        <text x="331" y="116">
          REDEMPTION
        </text>
        <text x="344" y="238">
          NEW CREATION
        </text>
      </g>
    </svg>
  );
}
function App() {
  const [page, setPage] = useState<Page>(initialPage);
  const [phase, setPhase] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BibleEvent | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compare, setCompare] = useState(true);
  const [edition, setEdition] = useState(
    () => decodeReaderLocation(location.hash).edition,
  );
  const [routeNotice, setRouteNotice] = useState(
    () => decodeReaderLocation(location.hash).notice,
  );
  const [readerRef, setReaderRef] = useState<Reference>(
    () => decodeReaderLocation(location.hash).reference,
  );
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem("bible-project-saved") || "[]");
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  });
  const [storageError, setStorageError] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("bible-project-saved", JSON.stringify(saved));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [saved]);
  useEffect(() => {
    const listener = () => {
      setPage(initialPage());
      if (location.hash.startsWith("#reader?")) {
        const parsed = decodeReaderLocation(location.hash);
        setEdition(parsed.edition);
        setReaderRef(parsed.reference);
        setRouteNotice(parsed.notice);
      }
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    if (page === "reader")
      history.replaceState(null, "", readerHash(edition, readerRef));
  }, [page, edition, readerRef]);
  const go = (p: Page) => {
    setPage(p);
    location.hash = p;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const read = (r: Reference) => {
    setReaderRef(r);
    setSelected(null);
    setSearchOpen(false);
    go("reader");
  };
  const toggleSave = (id: string) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  const navItems: [Page, string][] = [
    ["timeline", "The timeline"],
    ["parallels", "Parallel stories"],
    ["reader", "Bible library"],
    ["sources", "Sources & approach"],
  ];
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="header">
        <button
          className="brand"
          onClick={() => go("timeline")}
          aria-label="Bible Project home"
        >
          <span className="brand-icon">
            <BookOpen size={23} strokeWidth={1.5} />
          </span>
          <span>
            BIBLE <b>PROJECT</b>
            <small>THE STORY, CONNECTED.</small>
          </span>
        </button>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          {navItems.map(([id, title]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              {title}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search Scripture"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
          </button>
          <button
            className={`icon-button ${page === "saved" ? "selected" : ""}`}
            aria-label={`Saved events (${saved.length})`}
            onClick={() => go("saved")}
          >
            <Bookmark size={19} />
            {saved.length > 0 && (
              <span className="save-count">{saved.length}</span>
            )}
          </button>
          <button
            className="language-button"
            onClick={() => {
              setEdition((e) => (e === "tel" ? "kjv" : "tel"));
              go("reader");
            }}
          >
            <Globe2 size={15} /> EN / తెలుగు
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <main id="main-content">
        {page === "timeline" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span /> MANY BOOKS. ONE CONNECTED STORY.
                </div>
                <h1>
                  See the story.
                  <br />
                  <em>Discover the connections.</em>
                </h1>
                <p>
                  Journey through Scripture, explore parallel narratives,
                  <br className="desktop-break" /> and see how every chapter
                  belongs to a larger story.
                </p>
                <button
                  className="light-button"
                  onClick={() =>
                    document
                      .getElementById("explore")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore the timeline <ArrowRight size={16} />
                </button>
              </div>
              <HeroArt />
              <span className="hero-note">
                From the beginning to all things made new
              </span>
            </section>
            <div className="overview-strip">
              <span>
                <Layers3 size={17} />
                <b>11</b> story sections
              </span>
              <span>
                <Compass size={17} />
                <b>{events.length}</b> curated events
              </span>
              <span>
                <GitBranch size={17} />
                <b>{connections.length}</b> explored connections
              </span>
              <span>
                <BookOpen size={17} /> English & Telugu Scripture
              </span>
              <button onClick={() => go("sources")}>
                Built on the text <ArrowUpRight size={14} />
              </button>
            </div>
            <Timeline
              phase={phase}
              setPhase={setPhase}
              query={query}
              setQuery={setQuery}
              onSelect={setSelected}
              saved={saved}
              toggleSave={toggleSave}
            />
          </>
        )}
        {page === "parallels" && (
          <Parallels onRead={read} onSelect={setSelected} />
        )}
        {page === "reader" && (
          <>
            {routeNotice && (
              <p className="notice" role="status">
                {routeNotice}
              </p>
            )}
            <Reader
              reference={readerRef}
              setReference={setReaderRef}
              edition={edition}
              setEdition={setEdition}
              compare={compare}
              setCompare={setCompare}
              onSearch={() => setSearchOpen(true)}
            />
          </>
        )}
        {page === "sources" && (
          <Sources
            onRead={(r, e) => {
              if (e) setEdition(e);
              read(r);
            }}
          />
        )}
        {page === "saved" && (
          <section className="page-wrap">
            <PageIntro
              kicker="YOUR STUDY SHELF"
              title="Keep the connections."
              text="Saved events stay in this browser, ready for your next visit."
            />
            {storageError && (
              <p className="notice">
                Browser storage is unavailable. Saved events will last only for
                this session.
              </p>
            )}
            {saved.length ? (
              <div className="saved-grid">
                {events
                  .filter((e) => saved.includes(e.id))
                  .map((e) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      onSelect={setSelected}
                      saved={true}
                      toggleSave={toggleSave}
                    />
                  ))}
              </div>
            ) : (
              <div className="empty">
                <Bookmark size={32} />
                <h3>A place for what stays with you.</h3>
                <p>Use the bookmark on any event to save it here.</p>
                <button
                  className="primary-button"
                  onClick={() => go("timeline")}
                >
                  Explore the timeline <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <footer>
        <div className="footer-brand">
          <BookOpen size={18} /> BIBLE PROJECT
        </div>
        <p>Read closely. Explore thoughtfully. Keep the source in view.</p>
        <button onClick={() => go("sources")}>
          Sources & editorial notes <ArrowUpRight size={14} />
        </button>
      </footer>
      {selected && (
        <EventDetail
          event={selected}
          onClose={() => setSelected(null)}
          onRead={read}
          onSelect={setSelected}
          saved={saved.includes(selected.id)}
          toggleSave={toggleSave}
          edition={edition}
        />
      )}
      {searchOpen && (
        <ScriptureSearch
          onClose={() => setSearchOpen(false)}
          onRead={(r) => read(r)}
          edition={edition}
          setEdition={setEdition}
        />
      )}
    </>
  );
}
function PageIntro({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-intro">
      <div className="eyebrow green">{kicker}</div>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function Timeline({
  phase,
  setPhase,
  query,
  setQuery,
  onSelect,
  saved,
  toggleSave,
}: {
  phase: string;
  setPhase: (s: string) => void;
  query: string;
  setQuery: (s: string) => void;
  onSelect: (e: BibleEvent) => void;
  saved: string[];
  toggleSave: (id: string) => void;
}) {
  const [view, setView] = useState<"atlas" | "list">("atlas");
  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (phase === "all" || e.era === phase) &&
          `${e.title} ${e.telugu} ${e.summary} ${e.lane} ${e.refs.map(refLabel).join(" ")}`
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()),
      ),
    [phase, query],
  );
  return (
    <section className="explore" id="explore">
      <aside className="era-sidebar">
        <div className="eyebrow muted">EXPLORE THE STORY</div>
        <button
          className={`era-button all ${phase === "all" ? "active" : ""}`}
          onClick={() => setPhase("all")}
        >
          <Layers3 size={17} />
          <span>The whole story</span>
          <span>{events.length}</span>
        </button>
        <div className="era-list">
          {eras.map((era, i) => {
            const Icon = eraIcons[i];
            return (
              <button
                key={era.id}
                className={`era-button ${phase === era.id ? "active" : ""}`}
                onClick={() => setPhase(era.id)}
              >
                <Icon size={17} />
                <span>{era.title}</span>
                <small>{String(i + 1).padStart(2, "0")}</small>
              </button>
            );
          })}
        </div>
        <div className="sidebar-note">
          <Compass size={21} />
          <h4>A guide, not a fixed calendar.</h4>
          <p>
            Follow narrative order. Open each event for its passages and
            chronology notes.
          </p>
        </div>
      </aside>
      <div className="timeline-content">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">THE BIBLICAL TIMELINE</div>
            <h2>
              {phase === "all"
                ? "A story through the ages"
                : eras.find((e) => e.id === phase)?.title}
              <span>{filtered.length} events</span>
            </h2>
          </div>
          <div className="story-view-switch" aria-label="Timeline display">
            <button
              aria-pressed={view === "atlas"}
              onClick={() => setView("atlas")}
            >
              <Network size={15} />
              Atlas
            </button>
            <button
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <Layers3 size={15} />
              Event list
            </button>
          </div>
        </div>
        <div className="timeline-tools">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label="Filter timeline events"
              placeholder="Find an event, person, or passage…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="icon-button"
                onClick={() => setQuery("")}
                aria-label="Clear event search"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <select
            className="mobile-era"
            aria-label="Story section"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          >
            <option value="all">All sections</option>
            {eras.map((e) => (
              <option value={e.id} key={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <span className="filter-hint">
            <SlidersHorizontal size={15} />{" "}
            {phase === "all" ? "All sections" : "Section selected"}
          </span>
        </div>
        <div className="legend">
          <span>
            <i className="dot green-dot" /> Narrative sequence
          </span>
          <span>
            <i className="dot gold-dot" /> Date or sequence may be uncertain
          </span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty">
            <Search size={30} />
            <h3>No events found</h3>
            <p>
              Try a person such as Moses, a book such as Genesis, or another
              section.
            </p>
            <button
              className="text-button"
              onClick={() => {
                setQuery("");
                setPhase("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : view === "atlas" ? (
          <StoryAtlas
            events={filtered}
            connections={connections}
            onSelect={onSelect}
          />
        ) : (
          eras.map((era, i) => {
            const items = filtered.filter((e) => e.era === era.id);
            if (!items.length) return null;
            const Icon = eraIcons[i];
            return (
              <section className="era-group" key={era.id}>
                <div className="era-heading">
                  <div className="era-node">
                    <Icon size={21} />
                  </div>
                  <div>
                    <div className="eyebrow">
                      SECTION {String(i + 1).padStart(2, "0")}{" "}
                      <span> / {era.period}</span>
                    </div>
                    <h3>{era.title}</h3>
                    <p>
                      {era.books} <span>·</span> {era.summary}
                    </p>
                  </div>
                </div>
                <div className="era-events">
                  {items.map((event) => (
                    <EventCard
                      event={event}
                      key={event.id}
                      onSelect={onSelect}
                      saved={saved.includes(event.id)}
                      toggleSave={toggleSave}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
        <div className="coverage-note">
          <Info size={17} />
          <p>
            This is a curated overview, not an exhaustive chronology. All
            imported chapters are available in the Bible library. Connections
            and summaries are editorial; source verses are shown separately.
          </p>
        </div>
      </div>
    </section>
  );
}
function EventCard({
  event,
  onSelect,
  saved,
  toggleSave,
}: {
  event: BibleEvent;
  onSelect: (e: BibleEvent) => void;
  saved: boolean;
  toggleSave: (s: string) => void;
}) {
  const count = connections.filter(
    (c) => c.from === event.id || c.to === event.id,
  ).length;
  return (
    <article className="event-card">
      <div className="event-top">
        <span className="event-lane">{event.lane}</span>
        <button
          className={`icon-button bookmark ${saved ? "is-saved" : ""}`}
          aria-label={`${saved ? "Unsave" : "Save"} ${event.title}`}
          aria-pressed={saved}
          onClick={() => toggleSave(event.id)}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <button className="event-open" onClick={() => onSelect(event)}>
        <h4>
          {event.title}
          <ArrowUpRight size={18} />
        </h4>
        <p lang="te" className="telugu-title">
          {event.telugu}
        </p>
        <p className="event-summary">{event.summary}</p>
      </button>
      <div className="event-bottom">
        <button className="reference-chip" onClick={() => onSelect(event)}>
          <BookOpen size={13} />
          {refLabel(event.refs[0])}
        </button>
        {count > 0 ? (
          <button className="connection-chip" onClick={() => onSelect(event)}>
            <GitBranch size={13} />
            {count} {count === 1 ? "connection" : "connections"}
          </button>
        ) : (
          <span className="sequence-label">
            Story {String(event.order + 1).padStart(2, "0")}
          </span>
        )}
      </div>
    </article>
  );
}
function EventDetail({
  event,
  onClose,
  onRead,
  onSelect,
  saved,
  toggleSave,
  edition,
}: {
  event: BibleEvent;
  onClose: () => void;
  onRead: (r: Reference) => void;
  onSelect: (e: BibleEvent) => void;
  saved: boolean;
  toggleSave: (s: string) => void;
  edition: string;
}) {
  useEffect(() => {
    document.querySelector("dialog")?.scrollTo({ top: 0 });
  }, [event.id]);
  const era = eras.find((e) => e.id === event.era)!;
  const linked = connections.filter(
    (c) => c.from === event.id || c.to === event.id,
  );
  return (
    <Modal label={event.title} onClose={onClose} wide>
      <div className="detail-heading">
        <div className="eyebrow green">
          {era.title} / {event.lane}
        </div>
        <h2>{event.title}</h2>
        <p lang="te" className="detail-telugu">
          {event.telugu}
        </p>
        <p>{event.summary}</p>
        <button className="outline-button" onClick={() => toggleSave(event.id)}>
          {saved ? <Check size={16} /> : <Bookmark size={16} />}{" "}
          {saved ? "Saved to your study shelf" : "Save this event"}
        </button>
      </div>
      <div className="notice">
        <Compass size={19} />
        <div>
          <b>How this fits in time</b>
          <p>{event.chronology}</p>
          <p className="muted">{era.dateNote}</p>
          <p className="editorial-status">
            Editorial annotation ·{" "}
            {event.review.status === "pending"
              ? "Awaiting human review"
              : "Reviewed"}{" "}
            · {event.chronologyMetadata.precision.replace("_", " ")}
          </p>
        </div>
      </div>
      <h3 className="subheading">
        Read the source passages{" "}
        <span>{edition === "tel" ? "తెలుగు" : edition.toUpperCase()}</span>
      </h3>
      <div className="passage-grid">
        {event.refs.map((r, i) => (
          <Passage
            key={`${event.id}-${i}`}
            reference={r}
            edition={edition}
            onRead={onRead}
          />
        ))}
      </div>
      {linked.length > 0 && (
        <>
          <h3 className="subheading">Follow the connections</h3>
          {linked.map((c) => {
            const other = events.find(
              (e) => e.id === (c.from === event.id ? c.to : c.from),
            )!;
            return (
              <div className="detail-link" key={c.id}>
                <span className={`relation-badge ${c.type}`}>
                  {relationNames[c.type]}
                </span>
                <h4>{c.title}</h4>
                <p>{c.evidence}</p>
                {c.refs?.map((r, i) => (
                  <button
                    className="reference-chip"
                    key={i}
                    onClick={() => onRead(r)}
                  >
                    {refLabel(r)} <ArrowUpRight size={12} />
                  </button>
                ))}
                {other.id !== event.id && (
                  <button
                    className="text-button"
                    onClick={() => onSelect(other)}
                  >
                    Explore {other.title} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
      <div className="detail-pager">
        <button
          className="outline-button"
          disabled={event.order === 0}
          onClick={() => onSelect(events[event.order - 1])}
        >
          <ArrowLeft size={16} /> Previous event
        </button>
        <button
          className="primary-button"
          disabled={event.order === events.length - 1}
          onClick={() => onSelect(events[event.order + 1])}
        >
          Next event <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  );
}
function Parallels({
  onRead,
  onSelect,
}: {
  onRead: (r: Reference) => void;
  onSelect: (e: BibleEvent) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<Connection | null>(null);
  return (
    <section className="page-wrap">
      <PageIntro
        kicker="READ ACROSS THE STORY"
        title="Different threads. Shared moments."
        text="Compare accounts of an event, follow overlapping stories, and explore themes that connect distant passages."
      />
      <div className="connection-explainer">
        {Object.entries(relationNames).map(([id, label]) => (
          <div key={id}>
            <span className={`relation-badge ${id}`}>{label}</span>
            <p>
              {id === "same-event"
                ? "Different texts describing a shared event or setting."
                : id === "contemporary"
                  ? "Stories within an overlapping period, not necessarily the same day."
                  : "A shared image, idea, or explicit later interpretation."}
            </p>
          </div>
        ))}
      </div>
      <BranchMap onSelect={onSelect} onRead={onRead} />
      <div className="tab-filters" aria-label="Connection type">
        {[["all", "All connections"], ...Object.entries(relationNames)].map(
          ([id, title]) => (
            <button
              className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              key={id}
            >
              {title}
            </button>
          ),
        )}
      </div>
      <div className="connections-grid">
        {connections
          .filter((c) => filter === "all" || c.type === filter)
          .map((c) => {
            const a = events.find((e) => e.id === c.from)!;
            const b = events.find((e) => e.id === c.to)!;
            return (
              <button
                className="connection-card"
                key={c.id}
                onClick={() => setActive(c)}
              >
                <span className={`relation-badge ${c.type}`}>
                  {relationNames[c.type]}
                </span>
                <div className="thread-graphic">
                  <span />
                  <i />
                  <GitBranch size={24} />
                  <i />
                  <span />
                </div>
                <h3>{c.title}</h3>
                <p>{c.evidence}</p>
                <div className="connection-footer">
                  <span>
                    {a.id === b.id
                      ? `${a.refs.length} source passages`
                      : `${a.lane} ↔ ${b.lane}`}
                  </span>
                  <ArrowUpRight size={19} />
                </div>
              </button>
            );
          })}
      </div>
      {active && (
        <Modal wide label={active.title} onClose={() => setActive(null)}>
          <div className="detail-heading">
            <span className={`relation-badge ${active.type}`}>
              {relationNames[active.type]}
            </span>
            <h2>{active.title}</h2>
            <p>{active.evidence}</p>
          </div>
          <div className="parallel-passages">
            {(() => {
              const a = events.find((e) => e.id === active.from)!;
              const b = events.find((e) => e.id === active.to)!;
              const refs =
                a.id === b.id
                  ? [...a.refs, ...(active.refs ?? [])]
                  : [a.refs[0], b.refs[0], ...(active.refs ?? [])];
              return refs.map((r, i) => (
                <Passage key={i} reference={r} limit={8} onRead={onRead} />
              ));
            })()}
          </div>
          <div className="detail-pager">
            <button
              className="primary-button"
              onClick={() => {
                const e = events.find((e) => e.id === active.from)!;
                setActive(null);
                onSelect(e);
              }}
            >
              Explore the story context <ArrowRight size={15} />
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
function Reader({
  reference,
  setReference,
  edition,
  setEdition,
  compare,
  setCompare,
  onSearch,
}: {
  reference: Reference;
  setReference: (r: Reference) => void;
  edition: string;
  setEdition: (s: string) => void;
  compare: boolean;
  setCompare: (b: boolean) => void;
  onSearch: () => void;
}) {
  const primary = useBook(edition, reference.book);
  const secondary = useBook(edition === "tel" ? "kjv" : "tel", reference.book);
  const [showHighlight, setShowHighlight] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(readerHash(edition, reference), location.href).href,
      );
      setCopyStatus("Passage link copied");
    } catch {
      setCopyStatus("Copy the link from your browser address bar.");
    }
  };
  const info = editions.find((e) => e.id === edition)!;
  const bookInfo = info.books.find((b) => b.id === reference.book)!;
  const chapter = primary.book?.chapters[reference.chapter];
  const showCompare =
    compare &&
    edition !== "drc" &&
    editionAvailable(edition) &&
    editionAvailable(edition === "tel" ? "kjv" : "tel");
  useEffect(() => {
    setShowHighlight(true);
  }, [reference]);
  const changeChapter = (step: number) => {
    let book = reference.book;
    let ch = reference.chapter + step;
    if (ch < 1 && book > 1) {
      book--;
      ch = info.books.find((b) => b.id === book)!.chapters;
    }
    if (ch > bookInfo.chapters && book < 66) {
      book++;
      ch = 1;
    }
    setReference({ book, chapter: ch, start: 0, end: 0 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="page-wrap reader-wrap">
      <PageIntro
        kicker="THE SCRIPTURE LIBRARY"
        title="Begin with the words."
        text="Read the supplied Bible texts, compare English and Telugu, and return to the passages behind the story."
      />
      <div className="reader-share">
        <button className="outline-button" onClick={copyLink}>
          <ExternalLink size={14} />
          Copy passage link
        </button>
        <span role="status">{copyStatus}</span>
      </div>
      <div className="reader-toolbar">
        <label>
          Edition
          <select
            aria-label="Bible edition"
            value={edition}
            onChange={(e) => {
              setEdition(e.target.value);
              setReference({ ...reference, chapter: 1, start: 0, end: 0 });
            }}
          >
            {editions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Book
          <select
            aria-label="Bible book"
            value={reference.book}
            onChange={(e) =>
              setReference({
                book: +e.target.value,
                chapter: 1,
                start: 0,
                end: 0,
              })
            }
          >
            {info.books.map((b) => (
              <option key={b.id} value={b.id}>
                {edition === "tel" ? `${b.localName} · ${b.name}` : b.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Chapter
          <select
            aria-label="Bible chapter"
            value={reference.chapter}
            onChange={(e) =>
              setReference({
                ...reference,
                chapter: +e.target.value,
                start: 0,
                end: 0,
              })
            }
          >
            {Array.from({ length: bookInfo.chapters }, (_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
        <button
          className={`outline-button compare-toggle ${showCompare ? "selected" : ""}`}
          disabled={edition === "drc" || !editionAvailable(edition)}
          aria-pressed={showCompare}
          onClick={() => setCompare(!compare)}
        >
          <Layers3 size={16} />
          {showCompare ? "Side by side" : "Single edition"}
        </button>
        <button
          className="icon-button"
          onClick={onSearch}
          aria-label="Search the Bible"
        >
          <Search size={20} />
        </button>
      </div>
      {!editionAvailable(edition) && (
        <div className="notice">
          <Info size={18} />
          <div>
            <b>This edition opens at its source</b>
            <p>
              The public study preview includes events and passage references.
              Full text will be enabled after this edition’s redistribution
              permission is verified.
            </p>
            <a
              className="text-button"
              href={sourcePassageUrl(edition, reference)}
              target="_blank"
              rel="noreferrer"
            >
              Read {refLabel(reference)} at WordProject{" "}
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}
      {edition === "drc" && (
        <p className="notice">
          <Info size={18} /> This supplied Douay–Rheims selection has 66 books,
          missing deuterocanonical books and additions, and source numbering
          issues. It is not a complete Catholic Bible. Chapter and verse numbers
          are not assumed to match KJV.
        </p>
      )}
      <div className="reader-heading">
        <div>
          <span className="eyebrow green">
            {reference.book <= 39 ? "OLD TESTAMENT" : "NEW TESTAMENT"} / CHAPTER{" "}
            {reference.chapter}
          </span>
          <h2>
            {edition === "tel" ? bookInfo.localName : bookInfo.name}{" "}
            <em>{reference.chapter}</em>
          </h2>
        </div>
        <a
          className="text-button"
          href={
            publicRelease
              ? sourcePassageUrl(edition, reference)
              : `/pdf/${reference.book}.pdf`
          }
          target="_blank"
          rel="noreferrer"
        >
          <Download size={15} />{" "}
          {publicRelease ? "Read at source" : "Supplied English PDF"}
        </a>
      </div>
      {chapter &&
        reference.start > 0 &&
        (!chapter.some((v) => v.n === reference.start) ||
          !chapter.some((v) => v.n === reference.end)) && (
          <p className="notice" role="status">
            The selected verse range is unavailable in this source. The chapter
            is shown for context.
          </p>
        )}
      {showHighlight && reference.start > 0 && (
        <div className="reading-focus">
          <span>Selected passage: {refLabel(reference)}</span>
          <button
            className="text-button"
            onClick={() => {
              document
                .getElementById(`verse-${reference.start}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Jump to passage <ArrowRight size={14} />
          </button>
          <button
            className="icon-button"
            aria-label="Clear passage highlight"
            onClick={() => setShowHighlight(false)}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <div className={`scripture ${showCompare ? "bilingual" : ""}`}>
        <div className="scripture-labels">
          <span>{info.label}</span>
          {showCompare && (
            <span>
              {edition === "tel"
                ? "King James Version"
                : "తెలుగు · WordProject"}
            </span>
          )}
        </div>
        {!editionAvailable(edition) ? (
          <div className="empty">
            <BookOpen size={25} />
            <h3>Keep the source in view.</h3>
            <p>
              Use the source link above to read this chapter. The local
              development environment retains the supplied editions for study.
            </p>
          </div>
        ) : primary.loading ? (
          <p className="loading">Loading chapter…</p>
        ) : primary.error ? (
          <p className="notice" role="alert">
            {primary.error}
            <button onClick={primary.retry}>Retry</button>
          </p>
        ) : !chapter ? (
          <p className="notice">This chapter is unavailable in this edition.</p>
        ) : (
          chapter.map((v, i) => {
            const other =
              secondary.book?.chapters[reference.chapter]?.filter(
                (s) => s.n === v.n,
              ) ?? [];
            return (
              <div
                id={
                  chapter.findIndex((verse) => verse.n === v.n) === i
                    ? `verse-${v.n}`
                    : `verse-${v.n}-duplicate-${i}`
                }
                key={`${v.n}-${i}`}
                className={`verse-row ${showHighlight && v.n >= reference.start && v.n <= reference.end ? "highlight" : ""}`}
              >
                <div lang={edition === "tel" ? "te" : "en"}>
                  <span className="verse-number">{v.n}</span>
                  <p>
                    {v.text || <em>Text missing from the supplied archive.</em>}
                    {v.sourceIssue && (
                      <span className="source-warning">
                        <Info size={14} />
                        {v.sourceIssue}
                      </span>
                    )}
                  </p>
                </div>
                {showCompare && (
                  <div lang={edition === "tel" ? "en" : "te"}>
                    <span className="verse-number">{v.n}</span>
                    <p>
                      {secondary.loading ? (
                        "Loading…"
                      ) : secondary.error ? (
                        <button onClick={secondary.retry}>
                          Text failed to load. Retry
                        </button>
                      ) : other.length ? (
                        other.map((o, j) => (
                          <React.Fragment key={j}>
                            {o.text || (
                              <em>Text missing from the supplied archive.</em>
                            )}
                            {o.sourceIssue && (
                              <span className="source-warning">
                                {o.sourceIssue}
                              </span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <em>No corresponding verse number in this archive.</em>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="reader-pager">
        <button
          className="outline-button"
          disabled={reference.book === 1 && reference.chapter === 1}
          onClick={() => changeChapter(-1)}
        >
          <ChevronLeft size={17} /> Previous chapter
        </button>
        <span>
          {bookInfo.name} {reference.chapter}
        </span>
        <button
          className="primary-button"
          disabled={
            reference.book === 66 && reference.chapter === bookInfo.chapters
          }
          onClick={() => changeChapter(1)}
        >
          Next chapter <ChevronRight size={17} />
        </button>
      </div>
      <p className="reader-attribution">
        Text transcribed from your supplied WordProject archives. Original
        wording retained; whitespace normalized. Verse-number comparison does
        not guarantee exact translation alignment.
      </p>
    </section>
  );
}
function ScriptureSearch({
  onClose,
  onRead,
  edition,
  setEdition,
}: {
  onClose: () => void;
  onRead: (r: Reference) => void;
  edition: string;
  setEdition: (s: string) => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<{ ref: Reference; text: string }[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editionAvailable(edition)) {
      setStatus(
        "Full-text search will be enabled after publication permission is verified for this edition.",
      );
      return;
    }
    const text = term.trim();
    const run = ++generation.current;
    setResults([]);
    setTotal(0);
    setStatus("");
    if (text.length < 2) {
      setStatus(
        "Enter at least two characters or a reference such as John 3:16.",
      );
      return;
    }
    setBusy(true);
    try {
      const direct = parseReference(text);
      if (direct) {
        const b = await loadBook(edition, direct.book);
        const vs = b.chapters[direct.chapter];
        if (
          !vs ||
          !vs.some((v) => v.n === direct.start) ||
          !vs.some((v) => v.n === direct.end) ||
          direct.end < direct.start
        ) {
          setStatus(
            "That chapter or verse range is not present in the selected edition.",
          );
          return;
        }
        if (run === generation.current) onRead(direct);
        return;
      }
      const loaded = await Promise.all(
        books.map((b) => loadBook(edition, b.id)),
      );
      if (run !== generation.current) return;
      const matches: { ref: Reference; text: string }[] = [];
      let count = 0;
      const needle = text.toLocaleLowerCase();
      for (const b of loaded)
        for (const [chapter, verses] of Object.entries(b.chapters))
          for (const v of verses)
            if (v.text.toLocaleLowerCase().includes(needle)) {
              count++;
              if (matches.length < 100)
                matches.push({
                  ref: { book: b.id, chapter: +chapter, start: v.n, end: v.n },
                  text: v.text,
                });
            }
      setResults(matches);
      setTotal(count);
      setStatus(
        count
          ? `${count.toLocaleString()} matching verse${count === 1 ? "" : "s"}${count > 100 ? " · Showing the first 100; refine your search for more specific results." : ""}`
          : "No verses found. Try a shorter phrase or another edition.",
      );
    } catch (e) {
      if (run === generation.current) setStatus((e as Error).message);
    } finally {
      if (run === generation.current) setBusy(false);
    }
  };
  return (
    <Modal label="Search Scripture" onClose={onClose} wide>
      <div className="detail-heading">
        <div className="eyebrow green">FIND A PASSAGE</div>
        <h2>Search the Scriptures.</h2>
        <p>
          Enter a word, phrase, or reference like John 3:16. Telugu text can be
          searched in the Telugu edition.
        </p>
      </div>
      {!editionAvailable(edition) && (
        <p className="notice">
          Full-text search is awaiting edition permission. Event search and
          passage source links remain available.
        </p>
      )}
      <form onSubmit={search} className="scripture-search">
        <select
          aria-label="Search edition"
          value={edition}
          onChange={(e) => {
            generation.current++;
            setBusy(false);
            setEdition(e.target.value);
            setResults([]);
            setStatus("");
            setTotal(0);
          }}
        >
          {editions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
        <div className="search-field">
          <Search size={18} />
          <input
            autoFocus
            aria-label="Search words or Bible reference"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="love, వెలుగు, John 3:16…"
          />
        </div>
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Searching…" : "Search"}
          <ArrowRight size={15} />
        </button>
      </form>
      <p className="search-status" role="status">
        {busy
          ? "Searching all 66 supplied books…"
          : status || "Search runs locally in your browser. No account needed."}
      </p>
      <div className="search-results">
        {results.map((r, i) => (
          <button key={i} onClick={() => onRead(r.ref)}>
            <b>
              {refLabel(r.ref)}
              <ArrowUpRight size={15} />
            </b>
            <p lang={edition === "tel" ? "te" : "en"}>{r.text}</p>
          </button>
        ))}
      </div>
      {total > 100 && (
        <p className="muted">
          Results are in book and chapter order, not relevance order.
        </p>
      )}
    </Modal>
  );
}
function Sources({
  onRead,
}: {
  onRead: (r: Reference, edition?: string) => void;
}) {
  return (
    <section className="page-wrap sources-wrap">
      <PageIntro
        kicker="A TRANSPARENT FOUNDATION"
        title="The text comes first."
        text="See what was imported, what has been curated, and where a responsible reading leaves room for uncertainty."
      />
      <div className="notice">
        <Info size={20} />
        <div>
          <b>Research status</b>
          <p>
            The full supplied text archives have been parsed. The{" "}
            {events.length} events and {connections.length} connections are a
            selected editorial overview, not an exhaustive scholarly review of
            every verse. Live WordProject pages were inaccessible during this
            build; their contents and current permissions have not been
            independently verified.
          </p>
        </div>
      </div>
      {publicRelease && (
        <p className="notice">
          This public preview serves the editorial story dataset and source
          links. The inventory below describes archives supplied for local
          development; the full translations and PDFs are excluded until
          permission verification.
        </p>
      )}
      <h2 className="source-section-title">Your source library</h2>
      <div className="source-grid">
        {editions.map((e) => (
          <article key={e.id} className="source-card">
            <BookOpen size={23} />
            <h3>{e.label}</h3>
            <p>{e.archive}</p>
            <div className="source-stats">
              <span>
                <b>{e.books.length}</b> books
              </span>
              <span>
                <b>{e.chapterCount.toLocaleString()}</b> chapters
              </span>
              <span>
                <b>{e.verseCount.toLocaleString()}</b> verse entries
              </span>
            </div>
            <p>
              {e.id === "drc"
                ? "A 66-book selection labelled Douay–Rheims. Deuterocanonical books and Catholic additions are not supplied. Verse numbering differs in places."
                : e.id === "tel"
                  ? "Telugu text as supplied by WordProject. Exact translation edition and publication details need bibliographic verification."
                  : "English King James text as supplied. Markup repairs recover verse boundaries without rewriting the verse text."}
            </p>
            <a
              className="text-button"
              href={e.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              WordProject source <ExternalLink size={13} />
            </a>
            <details>
              <summary>Archive fingerprint</summary>
              <code>{e.sha256}</code>
            </details>
          </article>
        ))}
      </div>
      <p className="muted">
        {manifest.pdfs} supplied English book PDFs are accessible from the
        reader. They are reference documents; the searchable text is imported
        from the HTML archives. PDF text has not been exhaustively compared with
        the HTML editions.
      </p>
      <h2 className="source-section-title">
        Different traditions, clearly identified
      </h2>
      <div className="tradition-grid">
        <article>
          <span className="eyebrow green">PROTESTANT</span>
          <h3>A 66-book canon</h3>
          <p>
            Commonly 39 Old Testament and 27 New Testament books. This matches
            the book set supplied in the KJV and Telugu archives.
          </p>
        </article>
        <article>
          <span className="eyebrow green">CATHOLIC</span>
          <h3>A 73-book canon</h3>
          <p>
            Includes Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees, and
            additions to Esther and Daniel. The supplied Douay–Rheims archive
            does not provide that complete canon.
          </p>
        </article>
        <article>
          <span className="eyebrow green">ORTHODOX</span>
          <h3>Collections vary by tradition</h3>
          <p>
            Orthodox Old Testament collections may include further books, with
            differences among churches. This site does not claim that one
            66-book collection represents all Christian traditions.
          </p>
        </article>
      </div>
      <h2 className="source-section-title">How to read the timeline</h2>
      <div className="method-grid">
        <article>
          <Compass />
          <h3>Sequence before certainty</h3>
          <p>
            No calculated creation date or predicted end date is imposed. Early
            narratives use story order. Approximate historical context is
            labelled and is not a uniform time scale.
          </p>
        </article>
        <article>
          <GitBranch />
          <h3>Three kinds of connection</h3>
          <p>
            Parallel accounts, overlapping periods, and thematic links are kept
            distinct. A shared theme does not prove simultaneous events;
            adjacent chapters do not always establish chronology.
          </p>
        </article>
        <article>
          <ScrollText />
          <h3>Interpretations stay visible</h3>
          <p>
            Exodus dating, Gospel harmonization, letter dating, and Revelation’s
            chronology have competing readings. Revelation is shown in literary
            order; it is not a forecast. Premillennial, amillennial, and
            postmillennial interpretations differ on Revelation 20.
          </p>
        </article>
        <article>
          <Library />
          <h3>Text and commentary stay separate</h3>
          <p>
            Summaries, story sections, and connections are editorial. Bible
            quotations are loaded directly from the uploaded archives. The site
            does not claim to have extracted an existing cross-reference
            database from those files.
          </p>
        </article>
      </div>
      <h2 className="source-section-title">Known source issues</h2>
      <p>
        Original content is retained. These entries need editorial verification
        against an authoritative edition.
      </p>
      <div className="issue-list">
        {editions.flatMap((e) =>
          e.sourceIssues.map((issue, i) => (
            <button
              key={`${e.id}-${i}`}
              onClick={() =>
                onRead(
                  {
                    book: issue.book,
                    chapter: issue.chapter,
                    start: issue.verse,
                    end: issue.verse,
                  },
                  e.id,
                )
              }
            >
              <span className="edition-tag">{e.id.toUpperCase()}</span>
              <div>
                <b>
                  {books[issue.book - 1].name} {issue.chapter}:{issue.verse}
                </b>
                <p>{issue.note}</p>
              </div>
              <ArrowUpRight size={16} />
            </button>
          )),
        )}
      </div>
      <p className="muted">
        The Douay–Rheims Luke 1 source repeats verse number 59 and has no
        verse-number 60 entry. The reader preserves that duplication. KJV Exodus
        10:25 has a malformed HTML class that the importer recognizes; its verse
        text is retained.
      </p>
      <h2 className="source-section-title">Attribution & further reading</h2>
      <p>
        Courtesy of WordProject / International Biblical Association, as
        attributed in the supplied files. Upload provenance is recorded with
        SHA-256 fingerprints. Possession of a source archive does not establish
        redistribution permission for every translation or region; confirm
        applicable edition rights before public publication.
      </p>
      <div className="resource-links">
        {[
          ["Bible downloads", "https://www.wordproject.org/download/bibles/"],
          [
            "Study resources",
            "https://www.wordproject.org/bibles/resources/index.htm",
          ],
          [
            "Parallel Bible editions",
            "https://www.wordproject.org/bibles/parallel/index.htm",
          ],
          [
            "Telugu selected verses",
            "https://www.wordproject.org/bibles/verses/telugu/index.htm",
          ],
          [
            "Selected verses",
            "https://www.wordproject.org/bibles/verses/index.htm",
          ],
          [
            "Bible language index",
            "https://www.wordproject.org/bibles/index.htm",
          ],
        ].map(([label, url]) => (
          <a href={url} key={url} target="_blank" rel="noreferrer">
            {label}
            <ExternalLink size={15} />
          </a>
        ))}
      </div>
      <p className="notice">
        WordProject’s “parallel Bibles” page compares translations. This site’s
        “Parallel stories” also examines narrative relationships; these are
        separately curated.
      </p>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

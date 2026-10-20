# BIBLE PROJECT

An English/Telugu Scripture explorer with a visual story timeline, narrative branches, parallel passages, a complete reader for the supplied book sets, and full-text search.

## Run

Requires Node.js 22.12+ (validated on Node 24.19), npm, and Python 3 for re-importing archives. No API keys, database, or backend service is required.

```sh
cd /workspace/Bible-Visual
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173 --strictPort
```

For a production build:

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

`dist/` is the local development build with the supplied Scripture. `dist-public/` is a separate release build for Render; it contains the story explorer and source links while Bible text permissions are pending.

## What is implemented

- 11 story sections, 67 curated events, and 21 evidence-linked connections.
- An interactive story atlas with zoom, drag, keyboard pan, lane filters, overview control, and an event-list view.
- Separate labels for parallel accounts, overlapping periods, and thematic connections.
- Interactive Israel/Judah and Joseph/Judah narrative branch diagrams. The diagrams are **not time-scaled** and rows do not imply simultaneous dates.
- Every supplied HTML chapter imported from three editions, preserving verse numbers and wording.
- English/Telugu chapter comparison, complete book/chapter navigation, shareable passage links, selected-passage highlighting, and 66 English PDFs in the local environment.
- Full-text English/Telugu search and reference lookup (for example `John 3:16` or `1 Samuel 3:1-10`). Search shows up to 100 matches with the total result count.
- Event bookmarks in browser local storage, responsive layouts, keyboard-operable native dialogs, and fetch error/retry states.
- A Sources & approach page explaining canon differences, interpretive uncertainty, and source defects.

The interface and editorial summaries are primarily English; all events also have Telugu titles, and the local reader supports the full supplied Telugu text. The public release links to the source passages until per-edition redistribution permissions are verified.

## Data inventory and provenance

| Source archive | Books | Chapters | Verse entries |
| --- | ---: | ---: | ---: |
| `kj.zip` | 66 | 1,189 | 31,102 |
| `tel_new.zip` | 66 | 1,189 | 31,102 |
| `drc_new.zip` | 66 | 1,189 | 31,063 |
| `English-PDF.zip` | 66 PDFs | — | — |

`public/data/manifest.json` includes archive SHA-256 fingerprints, counts, source links, and known source issues. Source ZIPs are retained in the local `sources/` directory. ZIPs, parsed verse JSON, and PDFs are excluded from Git while redistribution permissions are unverified. A fresh checkout can build the public edition from the tracked code and manifest; the full local reader requires the original archives to be imported again.

To reproduce the import with the original archives:

```sh
npm run import:bibles
# or:
python3 scripts/import_bibles.py --source-dir /path/to/archives
```

The importer uses the Python standard library, does not execute archive HTML/scripts, and writes only explicit numbered JSON/PDF destinations. It recognizes malformed verse markup in KJV Exodus 10:25 and the Latin-1 footer in KJV 2 Thessalonians 1. It normalizes whitespace but does not translate, paraphrase, or silently fill missing Scripture.

Known source defects are preserved and surfaced in the reader:

- Telugu 2 Chronicles 35:27: empty verse text.
- Telugu Amos 7:1: mixed Hindi/Telugu content and a stray unnumbered marker.
- Supplied Douay–Rheims Luke 1: duplicate verse number 59, no numbered verse 60.
- The supplied Douay–Rheims archive contains only the 66-book set, **not a complete 73-book Catholic Bible**. It also lacks the Catholic additions to Esther and Daniel.

Verse-entry counts are not proof of textual completeness or translation accuracy. The PDF texts have not been exhaustively reconciled with the HTML texts.

## Validation

```sh
npm test
npm run build
npm run build:public
# With the development server running:
npm run test:browser
# Alternatively, run against the production preview:
BIBLE_TEST_URL=http://127.0.0.1:4173 npm run test:browser
# With the public preview running on port 4176:
npm run test:browser:public
```

Browser checks use the system Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` when using a different installed Chromium executable. Screenshots go to ignored `test-results/`.

Data tests validate every edition's counts and records, every cited KJV/Telugu verse, graph integrity, known source defects, and all PDF headers. Browser scenarios cover filtering, bookmarks, passage evidence, comparison, bilingual search, invalid references, navigation, mobile overflow, PDF delivery, source warnings, runtime requests, and failed-fetch recovery. These tests establish application/data consistency, not theological or historical correctness.

## Content model

- `src/data/eras.json`: editorial sections and chronology caveats.
- `src/data/events.json`: event summaries, Telugu titles, narrative lanes, verse anchors, and chronology notes.
- `src/data/connections.json`: typed relationships with written evidence and additional references when needed.
- `public/data/{edition}/{book}.json`: lazily loaded source text.
- `src/BranchMap.tsx`: selected narrative branch diagrams.
- `scripts/import_bibles.py`: reproducible text import and provenance manifest.

See [research and editorial notes](docs/RESEARCH.md) for interpretation rules and remaining research work.

For a Render static-site release, see [deployment instructions](docs/RENDER.md) and `render.yaml`. The public build command is `npm run build:public`; it currently includes source links and editorial content but no uploaded Bible text or PDFs.

The owner also supplied a broader product specification. See the [specification review and implementation gaps](docs/SPEC_REVIEW.md), which links to both preserved source documents and distinguishes future targets from current functionality.

## Attribution and publication

The uploaded source pages attribute their text to WordProject / International Biblical Association. No blanket license is asserted for the supplied translations, PDFs, or WordProject material. Confirm the applicable translation/edition rights and regional restrictions before public redistribution. Source parsing does not establish permission or scholarly endorsement.

Live WordProject pages were blocked by the environment's network policy during development. Domain additions have been saved in the environment configuration draft, but access has not been verified after applying them. No live-source verification, public deployment, Git push, or repository commit is claimed.

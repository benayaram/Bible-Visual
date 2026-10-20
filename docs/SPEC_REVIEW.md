# Review of the supplied product specification

Reviewed on 20 October 2026 against the current local implementation.

**Milestone update:** The later development pass added the story atlas, passage permalinks, source/review metadata, a validated chronology record with null calendar years, and one Saul's death event with Samuel and Chronicles accounts. The comparison below is retained as the earlier baseline. See [the current README](../README.md) for the new implementation.

## Purpose and status

The owner supplied a ChatGPT-generated start prompt and master specification as helpful project guidance. Both have been read in full and preserved verbatim:

- [Start prompt](requirements/BIBLE_PROJECT_CODEX_START_PROMPT.md)
- [Master specification](requirements/BIBLE_PROJECT_CODEX_MASTER_SPEC.md)

This report compares the proposed target with actual code and data. It does not mark the specification's embedded commands, external research claims, license assertions, or acceptance checkboxes as completed. This update preserves the documents and records the gaps; application behavior has not changed.

## Existing decisions take precedence over generic assumptions

- **The Bible files have already been supplied.** KJV, Telugu, a DRC-labelled selection, and English PDFs were imported in the previous development milestone. The master specification's instruction to await those files is stale in this conversation.
- **The owner chose to show differences between traditions**, with English and Telugu support. The available 66-book corpus is a coverage constraint, not an instruction to impose Protestant interpretation or label the Catholic corpus complete.
- **Chronology should show uncertainty.** The owner asked us to choose the clearest approach; the existing implementation uses narrative sequence and explicit uncertainty notes. Do not manufacture historical dates to populate a date axis.
- **Keep React/Vite.** The specification expressly permits the working stack. Next.js, PostgreSQL, authentication, and new visualization libraries are options for requirements that need them, not prerequisites for every improvement.
- **External research is not verified by an uploaded assertion.** The specification says research was reviewed on its preparation date. That is a claim in the supplied document, not evidence of independent verification here. Recheck actual source pages, schemas, attribution, and terms before imports or reuse.
- **No public deployment or new external service is authorized merely by the document.** Hosting, publication, authentication, and data ingestion should follow the owner's actual task scope and applicable access requirements.

## Current implementation versus target

| Area | Current evidence | Gap |
| --- | --- | --- |
| Reader and import | Three parsed HTML editions; 66 English PDFs; chapter navigation, English/Telugu comparison, source defects displayed | Reader permalinks, text sizing, genre/book profiles, reusable multi-chapter references, further import formats and hardened import limits |
| Story explorer | 11 sections, 66 cited events, searchable cards and event details | Pan/zoom atlas, minimap, keyboard viewport controls, canonical/story/date view separation |
| Historical chronology | Event and era caveats; no fabricated absolute years | Structured nullable ranges, chronology model IDs, source-backed dates and overlap calculations |
| Narrative branches | Israel/Judah and Joseph/Judah diagrams; independent sequences explicitly labelled | Generalized lane model and controls; diagrams are not evidence of synchronized calendar dates |
| Parallel accounts | Feeding of five thousand has four Gospel passages; Paul's encounter has Acts 9/22/26 | Saul's death missing; expand matched Samuel/Chronicles and Kings/Chronicles subevents |
| Cross-references | 20 editorial event relationships with explanations and selected passages | Directed verse-to-verse model, source registry, imported licensed dataset, graph neighborhoods and arc/network/matrix views |
| Search | Full-text English/Telugu and reference lookup; localized book-name matching | Common abbreviation registry, book/testament filters, unified entity search and indexed/paginated results |
| Provenance and review | Archive hashes, counts, known source issues, editorial research notes | Per-event source IDs, review status, reviewer history, runtime schema validation and publication rules |
| Canon and translation rights | Canon differences and DRC incompleteness explained; exact edition/rights uncertainty documented | Configurable canon and versification mappings; formal source/license registry and public-distribution availability rules |
| Study tools | Local event bookmarks | Verse notes, reading position/progress, study collections, export/delete controls |
| Telugu | Supplied Scripture and event titles | Reviewed translation of interface, summaries, chronology notes and explanatory content |
| People, places and themes | Some narrative lane labels and thematic event relationships | Normalized entities, evidence-backed profiles, genealogies, theme journeys and justified maps |
| Accessibility | Responsive layouts, keyboard-operable dialogs, focus styling, reduced motion, list-based content | Dedicated accessibility audit, contrast checks and equivalent semantic controls for future graphs |
| Administration | Local files and CLI importer | Editorial UI, authentication/authorization, version history, reviewed publication workflow |
| Optional scope | Core works without external APIs or accounts | PWA, AI, audio/video, community and original-language tooling remain later options |

Inventory was checked in `src/data/*.json`, `src/types.ts`, `src/BranchMap.tsx`, `src/main.tsx`, `src/bible.ts`, and `package.json`. Counts describe the curated implementation, not exhaustive biblical coverage or independent scholarly review.

## Named fixture check

| Specification fixture | Status |
| --- | --- |
| Creation without an invented absolute year | Present; narrative context and uncertainty note |
| Feeding five thousand | One event, with Matthew 14:13–21, Mark 6:30–44, Luke 9:10–17, John 6:1–15 |
| Paul's encounter | One event with Acts 9:1–22 and retellings in Acts 22:6–16 and 26:12–18; current first anchor includes three verses beyond the suggested 9:1–19 |
| Saul's death | Missing; existing `saul` event concerns his accession and must not be overwritten |
| Davidic covenant parallels | 2 Samuel 7 is present within a broader David event; 1 Chronicles 17 is not yet paired |
| Division of the kingdom parallels | 1 Kings 12 is present; 2 Chronicles 10 is not yet attached |
| Assyrian crisis | Kings/Isaiah comparison exists; additional Chronicles material needs subevent-level review |
| New creation without a predicted date | Present with interpretation caveats |

## Recommended next end-to-end milestone

**Build the story atlas on a small, validated domain layer while preserving the current reader and list view.**

1. Introduce stable account IDs, a restricted relationship-type union, source records, pending/reviewed statuses, and nullable chronology metadata. Validate the existing event and connection files without inventing reviewers, approval, or dates.
2. Add a new Saul's death event with 1 Samuel 31 and 1 Chronicles 10, preserving the existing Saul accession event. Explicitly distinguish a parallel account from a later retelling in the account model.
3. Add a navigable story-order canvas with pan/zoom, reset/fit, selectable lanes, event selection, and a keyboard/list alternative. Retain a clearly labelled undated/visionary presentation. Keep the historical-date view unavailable until actual sourced chronology models exist.
4. Link atlas selection to event details, account comparison, and a reader URL that restores the edition, chapter, and selected passage on reload.
5. Extend tests for the three named fixtures, one-event identity, null dates, URL restoration, lane controls, keyboard operation, and mobile layout.

This delivers a connected improvement to the current product without pretending that the larger research corpus, historical calendar, or administrative platform already exists.

## Later priorities

1. Directed verse-reference exploration with an inspected, appropriately licensed dataset and source attribution.
2. Reviewed people/place/theme data, with no invented coordinates or inferred identities.
3. Full Telugu editorial localization, personal study tools, and an editorial review interface.
4. Public-readiness checks for corpus availability, translation rights, accessibility, security, and hosting.

The master specification assigns the full three-view reference graph both P0 (F06) and P1 (the priority table). A reasonable reading is to prioritize functional passage-to-passage navigation, then build the three large-dataset visualizations incrementally.

## Validation of this documentation update

Both preserved documents were byte-compared with their uploaded originals. Source and data files were inspected for the gap analysis. Application code, dependencies, imported text, and configuration were not changed, so application tests were not rerun for this documentation-only update.

The previous development milestone reported five passing data tests and twelve passing browser scenarios. Those results are historical evidence, not a claim that this larger specification is now satisfied.

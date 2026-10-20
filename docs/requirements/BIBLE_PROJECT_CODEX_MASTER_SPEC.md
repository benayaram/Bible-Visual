# BIBLE PROJECT — Visual Bible Explorer
## Master Product Requirements, Biblical Content Model, Technical Architecture, and Codex Implementation Brief

**Document version:** 1.0  
**Prepared:** 20 October 2026  
**Status:** Implementation specification; biblical datasets and distribution rights still require validation  
**Project type:** Responsive interactive website / installable Progressive Web App (PWA)  
**Working project name:** BIBLE PROJECT  
**Initial supported languages:** English and Telugu  
**Initial canon assumption:** 66-book Protestant Bible, with a configurable data model that can accommodate other canons and versification systems later  
**Guiding principle:** Scripture is the authoritative primary text; timelines, connections, biographies, explanations, and interpretations are separately attributed annotations, not replacements for the Bible.

---

## 0. Codex: read this before changing any code

This document describes the target product, NOT a claim that all its data or features currently exist. This project is already being developed using Codex. **Inspect the existing repository first. Keep existing working components, designs, routes, and data wherever sound. Do not destroy or blindly regenerate work.** Implement in milestones, starting with an end-to-end functional core. Do not imply that the entire Bible has been analyzed or that the entire historical timeline has been validated unless this is actually evidenced in the repository.

1. Inspect repo structure, `package.json`, current routes, database, commits and pending changes.
2. Produce a short gap analysis against requirements, then implement the first missing vertical slice.
3. Use TypeScript, typed interfaces, migrations, Zod validation, automated tests, and no fabricated Bible data.
4. Design all visualizations around **provenance, uncertainty, and multiple relationship types**.
5. Leave rights-unclear Bible translations as a configurable importer (or placeholder) until permission is confirmed; don't scrape or redistribute indiscriminately.
6. For any sample event, include a genuine Bible reference. Do not invent scripture quotations, historical dates, coordinates, person identifications, or prophecy outcomes.
7. Finish each milestone with a changelog, run instructions, implemented-feature checklist, test results, incomplete items, and next implementation step.

## 1. Product identity and objective

**One-line description:** BIBLE PROJECT turns the Bible into an interactive, traceable network of Scripture, biblical history, people, places, themes, and events, viewed through timelines and branching parallel narratives.

**Product explanation:** A visitor should be able to start at Genesis, travel through major biblical eras, explore simultaneous events, discover where another book tells the same story, follow quotations and other cross-references, open the exact verses, examine the people and places involved, and continue to Revelation. The Bible text is always accessible and prominent.

**Problem:** A traditional Bible reader organizes content as books, chapters and verses. But readers struggle to understand (a) narrative chronology, (b) events across books, (c) kings/prophets and other contemporaries, (d) multiple accounts of the same event, (e) long-distance Scripture references, (f) relationships among people and places, and (g) interpretive uncertainty.

**Key differentiation:** The project integrates synchronized **six perspectives** in one interface: Scripture reader, story/era navigator, historical chronology, parallel account comparator, connection graph, and person/place explorer. A selection in one perspective can filter/highlight the relevant content in others.

**Target users:** Beginners, Telugu-speaking families, Bible study groups, Sunday school teachers, pastors, students and researchers; UI must work for both beginners and advanced users.

**Product values:** Accurate references, honest uncertainty, non-deceptive visuals, accessible UI, respectful treatment of different Christian interpretations, transparent sourcing, no assumed premium services.

### 1.1 Goals
- Explore the whole supported Bible canon in its **canonical order** and **biblical storyline order**.
- See events that appear in multiple books **once on the main history timeline**, with all parallel passage accounts attached.
- Show **actual parallel historical events** as simultaneous or potentially overlapping lanes, not as duplicates.
- Explore verse-to-verse and passage-to-passage connections, with classifications and provenance.
- Read English/Telugu scripture in chapter, verse, and aligned side-by-side modes when legally permitted.
- Support verified additions of events, dates, people, places, and thematic interpretations via an editorial system.
- Run reasonably on desktop and Android browsers; support keyboard, touch, responsive layouts, light/dark themes.
- Provide a reliable dataset that Codex can expand incrementally and that can be checked against the user's Bible files.

### 1.2 Non-goals / constraints
- Not a time machine. Genesis, primordial events and eschatological visions cannot be displayed with invented precise calendar dates.
- Not a claim that all disputed biblical dates, authorships, genealogies, harmonizations or prophecies have one universally accepted interpretation.
- Not a substitute for Bible translations, critical editions, original-language scholarship or cited sources.
- Not an automatic license to copy images, Bible texts, videos, charts or audio from reference websites.
- A prototype with 30 curated events is not labeled a fully mapped Bible.

## 2. Existing products: functional reference catalogue

**Study the interaction patterns, not copyrighted UI assets or copyrighted charts. Give attribution and obey each project's license.**

| Reference | URL | What it demonstrates | Adapt into our original product |
|---|---|---|---|
| BibleProject | https://bibleproject.com/ and https://bibleproject.com/app/ | Illustrated book/theme overviews and guided biblical story | Clear era introductions, chapter overviews, visual storytelling; link to their official content rather than copying videos/art |
| Viz.Bible | https://viz.bible/ | Infographics and data-driven Scripture visualization | Distinct graph views, overview-to-detail exploration |
| Chris Harrison BibleViz | https://www.chrisharrison.net/index.php/visualizations/BibleViz | Well-known arc diagram and biblical people/place network | A new interactive arc-map approach; do not reuse Harrison's copyrighted graphic as a site asset |
| OpenBible.info Cross References | https://www.openbible.info/labs/cross-references/ | Approximately 340,000 links in cross-reference dataset; downloadable archive | Initial verse connection data; filter/rank references and keep license attribution |
| STEP Bible | https://www.stepbible.org/ | Gospel harmony, Old Testament parallels, prophecy-related resources, original-language study | Same-event grouping, side-by-side passages, optional advanced original-language tools |
| Bible Hub | https://biblehub.com/ | Parallel text, cross-references, topical tools and interlinear study | Passage study drawer with linked learning resources |
| Bible Gateway | https://www.biblegateway.com/ | Bible reader, multilingual/multi-version comparison, search and reading plans | Accessible reader with translation selector, search, notes and reading progress |
| Bible Mapper | https://biblemapper.com/ | Bible-era geographical maps and locations | Timeline-linked maps and historically appropriate place names |
| Biblical Timeline (open-source) | https://theonize.github.io/timeline/ and https://github.com/theonize/timeline | Zoomable biblical/world timeline, epoch navigation, event markers | Pan/zoom/minimap/lane layout; check source-code MIT license and verify event chronology independently |
| WordProject | https://www.wordproject.org/download/bibles/ | English KJV, Telugu and other downloadable offline Bible HTML ZIPs | Potential import source only after examining source files, underlying text rights and conditions |
| WordProject parallel Bible | https://www.wordproject.org/bibles/parallel/index.htm | Side-by-side language reading | English/Telugu synchronization layout |
| OpenBible visualization | https://www.openbible.info/labs/cross-references/visualization | Book-to-book matrix of scripture links | High-density filtering and alternative visualization for very large datasets |

**Important:** OpenBible.info states a Creative Commons Attribution license on its cross-reference page (subject to its notices and exceptions). Its own site's Scripture quotations can be from copyrighted ESV, so do **not** assume importing reference links also grants rights to reproduce ESV text. WordProject permits certain distribution of public-domain webpage text subject to its terms; it specifically restricts audio usage. Each translation must be checked separately. Chris Harrison's graphic is copyrighted and not freely licensed for reuse in a commercial site.

## 3. Primary website navigation / information architecture

Top-level navigation (desktop sidebar/header; mobile bottom nav + More):

1. **Explore** `/` — interactive overview of the whole biblical story; featured eras, suggested journeys.
2. **Timeline** `/timeline` — zoomable historical chronology, branches and parallel lanes.
3. **Bible** `/bible` and `/bible/:book/:chapter` — canonical reader, translations, alignment and related resources.
4. **Connections** `/connections` — verse and book cross-reference graph, arcs, network/matrix modes.
5. **Parallel Stories** `/parallels` — event harmonies across books, plus simultaneous but distinct stories.
6. **People & Places** `/people`, `/places`, `/maps` — profiles, genealogy/relationships and historical maps.
7. **Themes** `/themes` — covenants, kingdom, faith, exile, Messiah, salvation, etc.
8. **Study** `/study` — journeys, reading plans, bookmarks, notes, progress.
9. **Search** `/search` — universal scripture/event/people/place/topic search.
10. **Admin** `/admin` — restricted editorial dashboard, Bible import, verification and publishing.
11. **Method & Sources** `/methodology`, `/sources`, `/licenses` — how dates, connections and confidence work.

Persistent UI: global scripture reference input; translation/language switch; text zoom; selected event context; search; accessibility controls.

## 4. Core visual metaphors and interaction design

### 4.1 Main Bible Story Atlas (the signature interface)
- Horizontally progressive narrative stages from Genesis to Revelation, with vertical branches and network joins.
- Each major phase displays title, short summary, scripture anchors, and a set of key events.
- A mini-map/overview assists orientation and lets users jump across thousands of years of narrative.
- **Toggle axes**: `Story Order`, `Historical Dates`, `Canonical Book Order`. These are different orders. Never conflate them.
- `Historical Dates` uses approximations/ranges and has an `Undated / Theological / Visionary` shelf.
- Zoom from `All eras` → `Era` → `Century/period` → `Event` → `Passage` → `Verse`.
- Tap/click any event to open a linked event detail drawer or page.
- Touch pinch/drag; keyboard navigation; reset, fit-to-content, zoom presets and reduced-motion mode.

### 4.2 Parallel branches and lanes
Different visual relationships require different connectors and labels:

- **Same event, multiple accounts:** One event node with multiple passage badges (e.g., Saul's death in 1 Samuel 31 and 1 Chronicles 10).
- **Concurrent distinct events:** Separate event nodes with shared/highlighted chronological span (e.g., Israel and Judah during the divided monarchy).
- **Earlier / Later narrative event:** Directional sequence connection.
- **Textual reference:** Verse or passage-to-passage link, not necessarily a historical event.
- **Quotation / allusion / shared theme:** Distinct color/shape and taxonomy.
- **Interpretive prophecy relation:** Different from direct literary quotation and clearly tagged as an interpretation.
- **Unknown chronology:** Not artificially assigned to a parallel lane simply because two texts are adjacent in a book.

Branch examples:
- Kings of the northern kingdom of Israel and southern kingdom of Judah on simultaneously visible tracks.
- Prophets' ministries with uncertain date ranges, able to overlap ruler reigns.
- Matthew, Mark, Luke and John connected to a unified event where applicable.
- Events in Acts synchronized with Paul's missionary journeys and letters only when evidence permits.
- Genesis genealogies and individual storylines represented as relationship graphs, not necessarily exact chronology.

### 4.3 Scripture cross-reference visualization
Three switchable modes:
1. **Arc view:** book/chapter sequence with arches between linked passages, grouped by type and density.
2. **Network view:** draggable/focusable verse/passage/book nodes connected by reference types; prevent clutter by progressive loading and selected neighborhoods.
3. **Matrix view:** books on x/y axes for cross-reference density; drill into books and then individual references.

Reference card displays: source, target, relation type, short editor-written explanation, origin dataset, evidence links, whether verified/interpretive, and open side-by-side passages.

### 4.4 Event details — integrated contextual workspace
For any event show: title, brief summary, category, era, chronological range or undated flag, date confidence + methodology, Scripture anchors, other accounts, people, places, key themes, predecessor/successor events, truly overlapping events, maps when justified, and sources. One action `Read passages` opens a side-by-side reader; another `See connections` opens the filtered graph.

## 5. Biblical phases / eras taxonomy

Use editable eras with stable IDs and a primary text-based order. The following is a **navigation taxonomy, not a universally fixed historical chronology**:

| ID | Era | Typical anchors / scope | Date policy |
|---|---|---|---|
| E01 | Creation and Primeval History | Genesis 1–11 | No asserted historical year; narrative order only unless explicit alternative chronologies are chosen |
| E02 | Patriarchs and Covenants | Genesis 12–50; selected related references | Contested ancient date ranges; contextual only |
| E03 | Israel in Egypt, Exodus and Sinai | Exodus; parts of Leviticus/Numbers | Exodus dating disputed; choose chronology model explicitly |
| E04 | Wilderness and Preparation | Numbers; Deuteronomy | Relative durations where text supports |
| E05 | Conquest, Settlement, Judges and Ruth | Joshua, Judges, Ruth; 1 Samuel opening | Sequence not always strict; overlapping judges debated |
| E06 | United Monarchy | Saul, David, Solomon; Samuel, Kings, Chronicles | Approximate reign ranges where sourced |
| E07 | Divided Monarchy | Israel/Judah kingdoms; contemporary prophets | Parallel reign tracks and prophets; synchronize with sourced dates |
| E08 | Fall of Israel, Judah and Exile | Kings, Chronicles, Jeremiah, Ezekiel, Daniel and others | Distinguish literature/visions/events; historical chronology sourced |
| E09 | Return and Restoration | Ezra, Nehemiah, Esther, Haggai, Zechariah, Malachi | Some episodes/books not readily dateable; cautious ordering |
| E10 | Second Temple / Intertestamental Context | Historical context to New Testament | Label extra-biblical historical source, not scripture |
| E11 | Birth and Ministry of Jesus | Four Gospels | Gospel harmonies indicate alternate narrative sequences when needed |
| E12 | Death, Resurrection and Ascension of Jesus | Gospel accounts; Acts 1 | Parallel accounts of events and reported distinctions |
| E13 | Early Church and Apostolic Mission | Acts; contextual epistles | Letters' writing dates separate from related events |
| E14 | Apostolic Letters, Teaching and Churches | New Testament letters | Literary/thematic track; not all writings tied to exact scenes |
| E15 | Revelation, Hope and New Creation | Revelation; linked biblical themes | **Vision/eschatological narrative only**; no predicted future dates |

Books of poetry/wisdom and non-narrative literature must remain visible even without secure event dates. Provide `Book/Genre view` and thematic links. An era may contain passages across multiple books; a book may span more than one era.

## 6. Complete feature inventory — all target features

### F01. Bible text management and reading — P0
- Complete book > chapter > verse navigation for all ingested books.
- English and Telugu per-translation selectors; book names, aliases and abbreviations localized.
- Read verse/chapter; permalink; next/previous chapter; collapsible sections where sourced.
- Side-by-side English/Telugu; verse-aligned display; responsive stacked view on mobile.
- Font size, line height, dark/light mode, full-screen reader, copy permitted text with version label.
- Select verse(s) to show cross-references, related event, people, places and note controls.
- Search scripture by `John 3:16`, `Jn 3:16`, localized names, exact text, term/phrase, book/testament.
- Display source/translation credits and license; do not show translations with missing rights.
- Verse-number/section alignment mapped by normalized canonical reference IDs; allow variant versification.

### F02. Canon and book browser — P0
- 66-book initial canonical navigation; old/new testament, common genre categories.
- Book profile: name, translation variations, genre, major themes, outline, narrative period, cautious authorship metadata and relevant events.
- Book-level progress and topic filters.
- Extensible `canon`, `canon_book`, `versification_scheme` for future 73/other canons rather than assuming all traditions share 66 books.

### F03. Global historical/story timeline — P0
- Zoomable, pannable and keyboard accessible.
- Layer switches: major eras, events, people, empires/kingdoms, biblical writings (clearly distinct dating), user study progress, optional world history.
- Approximate spans and confidence bands; BC/AD labels; date model selector.
- Multiple synchronized tracks; one event ID for duplicated accounts.
- Search within timeline, jump to a Bible passage/event, bookmark current viewpoint.
- `Undated / Disputed / Visionary` shelf avoids fake chronology.
- Timeline tooltips and detail drawer; mobile list view alternative.

### F04. Parallel history and overlapping events — P0
- Multi-lane kings of Israel / kings of Judah / prophets; thematic and Gospel lanes.
- Use actual supported temporal ranges to show possible overlap; mark uncertainty of inferred overlap.
- Distinguish `same_event`, `overlaps_in_time`, `reported_in`, `narrative_follows`.
- Multi-select two events to compare reference evidence, dates, people, locations.
- Filters per lane and toggle uncertain events.
- Never infer strict sequence based on chapter order alone.

### F05. Gospel harmony and other duplicate narratives — P0
- Curated event groupings, e.g., feeding of five thousand: Matthew 14:13–21; Mark 6:30–44; Luke 9:10–17; John 6:1–15.
- Saul's death: 1 Samuel 31; 1 Chronicles 10.
- Paul's Damascus-road experience: Acts 9:1–19, Acts 22:6–16, Acts 26:12–18 (later speeches **recount** the earlier experience; not three conversions).
- Optional textual comparison: common details vs account-specific details; no false contradiction resolution.
- Four Gospel columns, synchronized verse scrolling (when possible), compare toggles.
- Notes distinguish an established same-event identification from disputed harmonization.

### F06. Cross-references and connection intelligence — P0
- Import OpenBible-style links to a canonical verse reference map.
- Directed link by default; do not assume A→B means B→A in source provenance.
- Relation taxonomy: `quotation`, `explicit_reference`, `allusion`, `shared_theme`, `shared_phrase`, `same_event`, `parallel_account`, `prophecy_interpretation`, `person_shared`, `place_shared`, `genealogy_link`, `editorial_other`.
- Each relation has origin, context, verification status, editor note and optional citations.
- User can filter by link type, source/target testament, book, weight/rank, and reviewed status.
- Show interactive arc/network/matrix views; virtualize/aggregate for performance.
- Provide easy passage text navigation from every connection.
- Distinguish computer-inferred similarity from curated scholarly/source references.

### F07. Prophecy, fulfillment and thematic journeys — P1
- Link prophetic texts and later uses/interpretations with separate classifications:
  `explicit_NT_citation`, `NT_applied_to_event`, `traditional_christian_interpretation`, `typology`, `disputed_interpretation`.
- Show source quotations, historical setting, alternative readings where substantial.
- Theme journeys: Creation/New Creation; Covenants; Kingdom; Exile/Return; Temple; Sacrifice; Wisdom; Messiah; Holy Spirit; Salvation; Prayer; Justice/Mercy.
- Timeline for thematic recurrence (a sequence of passages, NOT necessarily historical timing).
- No countdown, date prediction, or unconditional claim of contested prophecy fulfillment.

### F08. Biblical people, families and networks — P1
- Person profiles with all referenced passages, alternative names/spellings, roles, time ranges, region, associated events, relatives and related people.
- Genealogy viewer for explicitly attested relationships; display Matthew 1 and Luke 3 genealogies as their own textual datasets rather than silently merging differences.
- Kings and prophets filters; tribal/dynastic relationships where supported.
- Node-edge people network; avoid false entity matching for people with common names.
- Search English/Telugu variants and transliterations.

### F09. Places, journeys, and historical maps — P1
- Place profiles (ancient name, modern name if identified, alternate locations, confidence, biblical verses).
- Interactive map pins tied to stories, eras, people, and journeys; fit/select/zoom.
- Routes: Abraham's journeys, Exodus routes, Paul's journeys, Jesus' ministry (only paths supported by references; alternative disputed routes visibly labelled).
- Map layer selection by era and region; historically appropriate political boundaries when supported.
- Coordinates are nullable; do not fake locations when identifications are uncertain.
- Map tiles require provider attribution and compliant usage; caching rules respected.

### F10. Deep study / advanced research — P1
- Bible passage comparison, chapter overview, reference index, original-language links (where licensed), lexical lookup, reference sources and commentary list.
- Timeline citation inspector and chronology-model explainer.
- Side-by-side narrative comparison with textual variations.
- Export public-domain/authorized datasets and personal notes respecting licenses.

### F11. Personal study tools — P1
- Anonymous local bookmarks/reading progress; optional authenticated cross-device sync.
- Highlight, note, tags, personal collections, last read, reading streak (optional, avoid gamification pressure).
- Chronological vs canonical reading plans; guided era courses and thematic pathways.
- Share deep links to a verse, event, selected network, era, or map viewpoint.
- Personal data delete/export.

### F12. Search and discovery — P0
- Global autocomplete across Scripture references, people, places, themes, eras, events and book titles.
- Filters by corpus, language, book, testament, era, relationship type, approximate date range.
- Correct Unicode Telugu search and text normalization; no Latin-only assumptions.
- SQL full text / indexes for scalable lookups; use sensible aliases/normalization for scripture references.
- Search results must display entity type and key scripture evidence.

### F13. Guided experience for beginners — P1
- Start journeys: `From Creation to New Creation`, `Life of Jesus`, `Kings and Prophets`, `The Early Church`, `Bible in 30 Key Events`.
- Beginner explanations of era, book, source passage, date uncertainty.
- Optional visual chapter summaries and media only with appropriate rights and attribution.
- Reproducible export/print cards for teachers.

### F14. Editorial admin and quality control — P0/P1
- Protected sign-in and role-based permissions: admin, editor, reviewer, reader.
- Managed source registry: title/creator/url/license/citation/verification date.
- Bible import job monitoring with log, translation rights, parsing errors and text-count validation.
- Manage eras, events, verse anchors, chronology models, relationships, people, places, aliases, themes.
- States `draft -> review -> published -> archived`; publish requires scripture anchor and required source fields.
- Revision history, audit trail, reviewers, conflict resolution, rollback and provenance for corrections.
- Flag questionable links, incorrect dates or apparent duplicates for manual review.
- Bulk import via versioned JSON/CSV with dry-run and validation reports.

### F15. Accessibility and device compatibility — P0
- Responsive desktop/tablet/mobile, touch and keyboard navigation, readable Telugu fonts.
- WCAG 2.2 AA target; adequate contrast, screen reader labels, focus order, no color-only distinctions.
- High-density graphs need equivalent semantic/list/table view.
- Reduced motion, zoom controls and screen reader-friendly event details.
- Proper share previews, metadata and non-JavaScript fallback where practical.

### F16. Optional AI assistant — P2 (not required for MVP)
- Scripture-grounded question answering with quoted/linked passages and clear version identification.
- Retrieval over approved Bible text + reviewed event/context records. Never pretend the model read all of Scripture if it hasn't.
- No invented verses or citations; grounded answer with `I don't know` when evidence is absent.
- Label interpretation by tradition and avoid conflating it with primary text.
- Rate limit and privacy; optional local models or opt-in provider keys. Keep core features fully functional without AI.

### F17. Optional media, PWA and community — P2
- Download authorized text for offline reading; update/install prompt as PWA.
- Historical maps, original licensed illustrations, narrated explanations; no reuse of copyrighted WordProject audio without permission.
- Study group sharing, moderated comments or private group spaces only after moderation/privacy design.
- External video/podcast recommendations as **links/embeds where allowed** with proper attribution.

## 7. Biblical correctness rules: mandatory

### 7.1 Different orders must remain distinct
1. **Canonical order:** the sequence of Bible books in a selected tradition.
2. **Narrative order:** the sequence a book or passage presents.
3. **Event chronology:** the estimated real-world order of described events.
4. **Composition chronology:** when a biblical text is thought to have been written/edited.
5. **Theological/literary relation:** typology, themes, visions and other non-datable relationships.

A book's position does not establish its composition date; a prophet's chapter order does not necessarily establish order of fulfillment; a cross-reference alone does not establish contemporaneity.

### 7.2 Chronology models and uncertainty
- Use nullable range fields and a `chronology_model_id`; `exact`, `approximate`, `range`, `relative_only`, `undated`, `visionary_future`, `disputed` classifications.
- Calendar years must not be guessed; preserve confidence and citations for proposed dates.
- Support alternative historical chronology models when relevant instead of silently presenting only one controversial dating theory.
- Store BCE/CE dates carefully. Internal astronomical signed year numbering may include year zero for computation, while **user-facing BCE/CE has no year zero**; format with a tested conversion helper.
- Date uncertain visual ranges must be visually differentiated from fixed points; don't position undated events at arbitrary years.
- A proleptic ancient historical estimate is not a day/month unless the evidence specifically supports it.
- Creation and visionary future are primarily placed by **textual/narrative order**, not asserted absolute world calendar dates.

### 7.3 Parallel vs same-event rules
- Same-event = two passages describing/recounting one specific event; **one canonical event node** with multiple occurrences.
- Concurrent = different events with overlapping plausible time interval; two or more event nodes on separate tracks.
- Thematically related = no implied time proximity.
- Repeated oral account = later *retelling* of earlier event, not new occurrence of it.
- A reference `John 1:1-3` to creation themes does not mean John's prologue was written during Genesis creation.

### 7.4 Citation, verification and interpretive honesty
- Every published event must have at least one valid primary-scripture passage and source-provenance record.
- Every disputed date or non-obvious interpretation must identify its source and rationale.
- Distinguish `scripture_text`, `narrative_summary`, `historical_reconstruction`, `tradition_interpretation`, `AI_suggestion` in data/UI.
- Bible text appears verbatim from the licensed translation; editor commentary appears separately.
- Different Gospel accounts can present details differently; provide account-by-account evidence rather than silently harmonizing away differences.
- Ancient location identifiers, translations, persons and textual variants may be uncertain; expose uncertainty.
- Human review is mandatory before publication of AI/automated findings.

## 8. Seeded examples and visual QA fixtures

Use a modest, reviewed seed dataset (target **at least 30 curated events across Old and New Testaments** for the initial interactive prototype), and label it `Curated Demo Dataset` until it becomes complete. Start with these validation fixtures:

1. **Creation:** Genesis 1–2; story-era anchor, no invented absolute date.
2. **Abraham's call:** Genesis 12:1–9; location certainty separate from primary passage.
3. **Israel's Exodus:** Exodus 12–14; date model explicit rather than asserted.
4. **Saul's death:** 1 Samuel 31 and 1 Chronicles 10 = one historical event with two textual accounts.
5. **Davidic covenant:** 2 Samuel 7 and 1 Chronicles 17 = closely corresponding narrative passages; carefully identify matched subevents.
6. **Division of the kingdom:** 1 Kings 12 and 2 Chronicles 10 = parallel source accounts; two Israel/Judah lanes follow.
7. **Northern/Southern kings:** Ahab (Israel) and Jehoshaphat (Judah) reigns as approximately overlapping periods; use cited historical chronology for actual years, not hardcoded guessed years.
8. **Hezekiah and Assyrian crisis:** Related accounts in 2 Kings 18–20; 2 Chronicles 32; Isaiah 36–39; match specific subevents, not necessarily whole chapter ranges as one scene.
9. **Jesus feeds five thousand:** Matthew 14:13–21; Mark 6:30–44; Luke 9:10–17; John 6:1–15 = one event, four accounts.
10. **Paul's Damascus-road encounter:** Acts 9:1–19, 22:6–16, 26:12–18 = original episode + subsequent retellings of the same episode.
11. **Apostolic missionary journeys:** Acts 13–21; staged and located only where the text supports.
12. **New Heaven/New Earth:** Revelation 21–22; theological/future vision, no numeric predicted date.

Other reviewed events for demo can include: flood narrative, Babel, Joseph in Egypt, Sinai covenant, entry into Canaan, Samuel and monarchy, Solomon's temple, division of kingdom, fall of Samaria, fall of Jerusalem, exile, return to Jerusalem, prophetic ministries, birth of Jesus, baptism, Sermon on the Mount, crucifixion, resurrection, Pentecost, early church and Paul's journeys. Anchor each item to real passages.

### Example tests
- Clicking `Feeding of the Five Thousand` shows four Gospel passage tabs and **one timeline marker**, not four.
- Clicking `Paul's Conversion` groups Acts 9, 22 and 26; later speech dates are not drawn as repeated conversions.
- An undated creation event is not shown at 4004 BCE without explicitly selected documented chronology.
- The prophecy/vision layer does not assign Revelation 21 a date.
- Parallel king lanes retain distinct IDs and display temporal uncertainty where applicable.
- `Book order`, `Historical event`, and `Written date` are distinct UI concepts.

## 9. Data ingestion plan: user Bible files and open datasets

### 9.1 Bible text ingestion
Supported input adaptors (implement after inspecting actual files):
- WordProject offline ZIP containing HTML chapters; safe unzip + parser with strict allowed formats and path traversal protections.
- Explicit JSON with books/chapters/verses.
- CSV/TSV with book/chapter/verse/text columns.
- USFM as a later supported importer if user provides it.
- Plain TXT only if a robust, documented versification and book parser exists; don't invent breaks.

Ingestion pipeline:
1. File upload or CLI command to local staging directory; virus/ZIP slip/decompression limit safeguards.
2. Identify source, language, translation edition, canon, encoding and rights declaration.
3. Parse chapter and verse structures, UTF-8 and Unicode normalization without rewriting sacred text content.
4. Map book aliases to stable book IDs; preserve original supplied text exactly in a raw-source archive.
5. Validate duplicate/missing chapter/verse counts, unexpected headings, unusual versification, corrupted Telugu glyphs, poetry formatting.
6. Build canonical verse keys (`GEN.1.1`, `MAT.14.13` etc.) plus translation-specific mapping.
7. Generate a QA report with totals and mismatches; block publishing on critical failures.
8. Store translator attribution and license record; activate in reader only after permission review.

DO NOT claim the user has already provided Bible text files in this request. Await their actual files; do not pretend every verse was read, imported or audited. The WordProject download listing confirms KJV English and Telugu downloadable ZIP offerings, but exact file structures must be inspected on receipt.

### 9.2 Relationship datasets
- OpenBible.info downloadable cross-reference data: import via licensed, provenance-aware ETL. Validate actual archive schema, verse mapping and weights rather than assuming its format.
- Editorial Gospel harmony and Old Testament parallel tables: **hand-curated or transparently sourced** in reviewable CSV/JSON. Connection imports do not prove historical same-event status by themselves.
- Historical chronology: build documented source-specific datasets (primary Bible references plus credited academic/historical references), with explicit alternative models.
- People/place data: controlled vocabulary and per-claim evidence; no unspecified latitude/longitude.
- Store `source_url`, `source_author`, `license`, `retrieved_at`, `citation_note`, `data_version` for every external dataset.

### 9.3 Rights and sourcing policy
- KJV US public-domain status does not automatically give global rights for all editions/assets; verify exact file and target jurisdictions.
- Telugu translations have independent copyrights; WordProject availability does not alone prove unrestricted redistribution rights. Check edition and permission.
- Do not copy BibleProject animations/illustrations, BibleHub page content, Bible Gateway translations, mapping imagery, WordProject audio, or Harrison's copyrighted graphic.
- If rights cannot be confirmed, show an external source link or a public-domain replacement and leave importer disabled.
- Keep `/licenses` with actual attribution and per-dataset restrictions; make rights configurable rather than hardcoded assumptions.

## 10. Technical architecture (recommended; adapt to existing repo)

**Preferred scalable, free-tier-compatible architecture:**

- Frontend: **Next.js + TypeScript**, React, Tailwind CSS and shadcn/ui accessible components. If a functioning React/Vite site already exists, improve it rather than rewriting solely to meet this suggestion.
- Timeline and zoomable SVG: D3 for scales/axes (or custom React/SVG). Avoid brittle external timeline libraries where BC/AD/uncertainty are poorly represented.
- Narrative branches: `@xyflow/react` (React Flow) for curated graph/branch views, backed by accessible list alternatives.
- Dense cross-reference graph: Cytoscape.js or efficient canvas/WebGL visualization; loading only selected clusters; D3 for arc and matrix views.
- Database: PostgreSQL with Drizzle ORM or Prisma (choose whichever is already used), indexes and migrations.
- Full-text search: PostgreSQL FTS plus book alias index; explicit Unicode Telugu handling; optional later dedicated search engine.
- Authentication: optional hosted auth (e.g. Supabase Auth) or existing auth; anonymous browsing must remain available.
- Map: Leaflet/MapLibre and OpenStreetMap-compatible tiles with attribution, licensed map layers and caching/TOS compliance.
- Data import: Node.js/TypeScript scripts and tested parsers; versioned JSON seed datasets.
- Deployment: any suitable free-tier-compatible hosting (e.g. Vercel frontend + Supabase or Neon PostgreSQL) **subject to current plan limits**; support local Docker Compose for development if desired. Never assume free tiers have permanent unlimited usage.
- Testing: Vitest/Jest for unit/integration, Playwright for E2E, accessibility testing with axe.
- Observability: privacy-aware error logging, lightweight analytics optionally and with consent where legally required.

**Architecture rule:** Domain data is independent of UI implementation. Views query the same canonical IDs and relations; never maintain contradictory hardcoded arrays of biblical events in separate components.

### 10.1 High-level app flow
`Licensed source files -> import/validation -> normalized verse + annotation database -> versioned API -> unified client state -> timeline / parallel / graph / reader / map views`

## 11. Core data model — required entities

Prefer relational tables, indexed IDs and explicit join tables:

- `canons(id, name, version)`
- `books(id, osis_code, testament, default_order, genre, metadata)`
- `canon_books(canon_id, book_id, position)`
- `versification_schemes(id, name, notes)`
- `translations(id, language_code, edition, title, copyright_owner, license_status, license_uri, redistribution_allowed, canon_id, versification_id)`
- `chapters(id, translation_id, book_id, chapter_number)`
- `verses(id, chapter_id, verse_label, verse_index, content, original_format, canonical_ref_id)`
- `canonical_references(id, book_id, start_chapter, start_verse, end_chapter, end_verse, versification_id)`
- `story_eras(id, slug, order_index, title_en, title_te, description, primary_refs)`
- `events(id, slug, title_en, title_te, narrative_summary_en, narrative_summary_te, era_id, category, status, classification)`
- `event_passages(event_id, canonical_ref_id, occurrence_kind, account_label, source_id)` — many passages per event.
- `chronology_models(id, title, description, tradition_or_method, sources)`
- `event_chronologies(event_id, chronology_model_id, start_year_astronomical_nullable, end_year_astronomical_nullable, precision, confidence, rationale, source_id)`
- `event_relations(id, source_event_id, target_event_id, type, directional, status, evidence_note, source_id)`
- `timeline_lanes(id, name, era_id, lane_type)` / `event_lanes(event_id, lane_id)`
- `cross_references(id, from_canonical_ref_id, to_canonical_ref_id, relation_type, weight, directed, origin, status, source_id)`
- `themes(id, slug, title_en, title_te)` / `event_themes`, `passage_themes`
- `people(id, slug, label_en, label_te, identity_notes, historicity_notes)` / `person_aliases`, `person_event`, `person_passages`, `person_relations`
- `places(id, slug, label_en, label_te, ancient_names, modern_name_nullable, lat_nullable, lon_nullable, coordinate_confidence, location_status)` / `event_places`, `place_passages`, `place_identifications`
- `sources(id, title, author, uri, publisher, date, license, attribution, accessed_at, notes)`
- `editorial_reviews(id, entity_type, entity_id, reviewer_id, status, notes, updated_at)`
- `users`, `bookmarks`, `reading_progress`, `notes`, `collections`, `audit_logs`, `import_jobs`

All editorial entities require created/updated timestamps and provenance, and public APIs must exclude drafts unless authorized.

### 11.1 Normalization rules
- Event ≠ verse ≠ account occurrence ≠ interpretation.
- Passage references are spans; a passage may span multiple chapters and multiple translations/versifications.
- Duplicate narrative references from distinct books should point to the same event ID if reviewed as a same-event relation.
- Chronology records are **model-specific**, with nullable years, and can express alternative timelines.
- Cross-reference links may be directional; preserve original direction, source, score, and relation classification.
- Relation claims can be disputed without deleting underlying source text.
- `updated_at`, reviewed-by and source linkage on publishable annotations.

### 11.2 Suggested JSON event payload (sample data, not a dating claim)
```json
{
  "id": "event-feeding-5000",
  "slug": "feeding-of-the-five-thousand",
  "title": { "en": "Feeding of the Five Thousand", "te": null },
  "eraId": "E11",
  "classification": "historical_narrative",
  "chronology": { "kind": "undated", "modelId": null, "fromYear": null, "toYear": null },
  "passages": [
    { "ref": "MAT.14.13-MAT.14.21", "kind": "parallel_account" },
    { "ref": "MRK.6.30-MRK.6.44", "kind": "parallel_account" },
    { "ref": "LUK.9.10-LUK.9.17", "kind": "parallel_account" },
    { "ref": "JHN.6.1-JHN.6.15", "kind": "parallel_account" }
  ],
  "review": { "status": "pending", "sources": ["source-bible-primary"] }
}
```
Notes: `title.te` deliberately null pending verified Telugu localization; event is not given a fabricated day/year. Validate actual scripture keys with a tested OSIS/reference parser; example illustrates target structure, not an exact interchange standard.

## 12. API surface (REST examples; GraphQL optional)

All routes support pagination and validated query parameters; `/api/v1` versioning:

- `GET /api/v1/canons`, `/books`, `/books/:book/chapters/:chapter`
- `GET /api/v1/translations` (return availability and license status)
- `GET /api/v1/scripture?ref=...&translation=...`
- `GET /api/v1/events?era=...&model=...&lane=...&limit=...`
- `GET /api/v1/events/:id` (passages, timelines, relationships, people, places, evidence)
- `GET /api/v1/eras`, `/api/v1/eras/:id`
- `GET /api/v1/timeline?model=...&view=...&range=...`
- `GET /api/v1/parallels?event=...`
- `GET /api/v1/references?ref=...&type=...&limit=...`
- `GET /api/v1/graph/neighborhood?ref=...&depth=1&types=...`
- `GET /api/v1/graph/book-matrix?canon=...`
- `GET /api/v1/people`, `/people/:id`, `/places`, `/places/:id`, `/themes`, `/themes/:id`
- `GET /api/v1/search?q=...&language=...&types=...`
- `POST /api/v1/admin/imports` (privileged, virus/ZIP-slip/file size checks)
- `POST/PATCH /api/v1/admin/events`, `/references`, `/reviews`; privileged and audited.

For locally seeded MVP, a documented local JSON/repository layer is permissible if it implements the same typed interfaces, allowing migration to PostgreSQL without rewriting the UI.

## 13. UI/UX specifics (original design, no copying)

### Visual direction
- Premium **Scripture Atlas** style: dark indigo/navy backgrounds or warm parchment/ivory reading surface; tasteful muted gold accents, clean typography, spacious contrast-rich controls.
- Default landing interaction is the large story/timeline exploration, not a generic blog.
- Event markers are readable and focusable; multiple relationship types have accessible shapes/labels beyond colors.
- Reader typography optimized for Latin and Telugu scripts; avoid ornate body text.
- Transitions are subtle; fully respect prefers-reduced-motion.
- Use original iconography/illustrations and licensed external images only.

### Required screens
1. Home/Story atlas: era navigation, featured event, guided entry points.
2. Timeline full screen with top filters, lane controls, minimap and evidence drawer.
3. Era page with chronological and text-order sequences.
4. Event detail page with tabs (`Overview | Scripture | Parallels | Connections | People & Places | Sources`).
5. Bible reader with translation selector, reference input, contextual study panel.
6. Parallel Gospel / Kings & Chronicles account comparator.
7. Connections arc + network + matrix with selected-reference side panel.
8. People detail and genealogy/network.
9. Map and place detail.
10. Theme journey page.
11. Search and results.
12. Study/bookmarks/notes.
13. Admin quality-control and imports.
14. Methodology, licensing, citations, About.

### Mobile-specific
- Collapse branch tracks into scrollable lane cards without erasing overlap meaning.
- Parallel scripture columns become tabbed / vertically aligned panes.
- Dense graph defaults to search-first selected node + connections list.
- Quick jump and bottom sheet for event detail.

## 14. Nonfunctional requirements and success criteria

### Reliability / correctness
- Zero broken references in published curated events (CI validator).
- Every published event or annotated chronology has verifiable scripture evidence and source label.
- Translation availability and licenses displayed correctly.
- One event shown once when passages are true same-event accounts.
- No fake historical coordinates, dates, artificial harmonizations or unauthorized copied materials.

### Performance
- Avoid loading a six-figure reference graph as DOM nodes at once; index and aggregate, fetch neighborhood on demand.
- Aim for mobile usable first interaction and smooth timeline pan/zoom with modest sample dataset; measure rather than promise untested frame rates.
- Paginate search; use caching and indexed lookups.

### Accessibility / security
- Keyboard navigation, visible focus, responsive Telugu font support and accessible alternative views.
- Sanitize Bible imports and editorial HTML/Markdown; no user-provided script execution.
- ZIP size/decompression/path validation, MIME checks, upload limits, anti-abuse throttling.
- Harden privileged write endpoints, CSRF where needed, least-privilege roles, versioned migrations.
- Never expose API keys or database credentials to the client; environment variables and `.env.example`.
- Respect privacy, attribution, analytics consent and user export/delete.

### Test matrix
- Unit: reference parser/aliases; BCE/CE formatting; range overlap (including uncertainty); event dedup; relation type validation; rights gate.
- Data validation: missing books/verses; duplicate canonical IDs; invalid references; orphan person/place links; published sources incomplete.
- Integration: scripture → event → parallels; import → normalized verses; graph filters; search localization.
- E2E: homepage → timeline → feed-5000 event → four Gospel passages; find Telugu verse; read cross-reference; open map; keyboard controls.
- Accessibility: axe scans, semantic fallback for graphs, screen-reader event descriptions, contrast and focus.

## 15. Delivery plan for Codex (implement progressively)

### Phase 0 — Repository audit and product skeleton
- Inventory current work, identify stack and preserve existing implementation.
- Create `docs/PRD.md`, `docs/DATA_POLICY.md`, `docs/SOURCES_AND_LICENSES.md`, `docs/ROADMAP.md` based on this document.
- Build navigation/routes, responsive shell, theme and typed domain interfaces.
- Deliver: running app with navigation, mock/seed-safe data contracts, initial baseline tests.

### Phase 1 — Bible import + reader + search (functional foundation)
- Implement metadata for all initial 66 books and translation/version model.
- Add safe ingestion for approved structured JSON/CSV and eventual supplied HTML ZIPs.
- Build reader with chapter/verse navigation, search, language toggle and accurate deep links.
- If no actual licensed text supplied, use a small properly attributed authorized sample and show explicit missing-corpus state.
- Deliver: verified sample text reader and import QA report.

### Phase 2 — Signature story timeline + eras + event details
- Create era taxonomy, 30+ **curated** sample events, evidence links, chronology uncertainty.
- Build pan/zoom timeline, date/model filters, list fallback and detail drawer.
- Integrate canonical references directly into event cards.
- Deliver: fully usable story explorer and event-to-Bible navigation.

### Phase 3 — Parallel account engine and branch lanes
- Implement `event_passages`, `event_relations`, `event_lanes` and side-by-side comparison.
- Implement reviewable fixtures for Saul, Gospel feeding, Paul's conversion and kings/prophets.
- Build lane view for Israel/Judah and Gospel event harmonies.
- Deliver: distinct same-event vs simultaneous-event UI + unit tests.

### Phase 4 — Connection graph + cross-reference ingestion
- Integrate an approved OpenBible cross-reference dataset with required attribution.
- Implement graph neighborhood, arcs/matrix summary, type filters, scripture study panel.
- Keep citation/ranking/origin and manageable performance for large data.
- Deliver: searchable verse-link visualization at scale.

### Phase 5 — Biblical people, places, maps and themes
- Add reviewed entity models/profiles and lineage/relationship views.
- Add map with confidence-marked places and supported journeys; theme journeys.
- Deliver: navigable Scripture ↔ event ↔ person ↔ place ↔ theme loops.

### Phase 6 — English/Telugu polish, personal study and editorial QA
- Complete bilingual UI and verified content translation pipeline.
- Add notes/bookmarks, reading plans, PWA offline authorized reading, admin review.
- Implement security/accessibility/performance QC and citations/rights views.
- Deliver: public-ready beta after full content-rights and accuracy review.

### Phase 7 — Optional advanced features
- AI scripture-grounded study, original-language tools, configurable canon extensions, alternate chronology models, teacher exports, optional videos/audio and groups.
- None of these should block a fully functional, source-grounded non-AI app.

## 16. Development tasks and priorities

| Priority | Feature cluster | Complete when |
|---|---|---|
| P0 | Repo-preserving scaffold | Existing features work; routes/tests are present |
| P0 | Safe Bible corpus model + reader | Read ingested authorized chapters and track translation source |
| P0 | Story eras + evidence-anchored events | Select an era, event and its exact verse(s) |
| P0 | Timeline and distinct parallel modes | Same-event and overlapping historical events are correctly distinct |
| P0 | Cross-reference navigation | Open a linked scripture text and display relationship origin |
| P0 | Search/accessibility/methodology | Search works and uncertainty is clearly documented |
| P1 | 3 graph views and large dataset | Filters, visualization, performance and attribution tested |
| P1 | People, places, maps, themes | Links resolve to reviewed profiles / geographic evidence |
| P1 | Telugu polish, progress, admin workflow | Locale + data review + optional account behaviors function |
| P2 | AI, media, groups, extra canons | Authorized and grounded optional upgrades |

## 17. Acceptance criteria / definition of done

- [ ] Existing repository was examined before any large refactor.
- [ ] Home displays an interactive Bible story atlas, not only static marketing content.
- [ ] Book/chapter/verse navigation works for all **imported** authorized Bible books.
- [ ] App visibly distinguishes missing, partial and complete imported corpora.
- [ ] English/Telugu display works only when approved text is available, with attribution.
- [ ] Major biblical eras are navigable; the Bible's storyline is represented without forcing ungrounded dates.
- [ ] Timeline has zoom, pan, filters, accessible list and event panels.
- [ ] `Same Event`, `Parallel Text`, `Concurrent Event`, `Theme`, `Prophecy Interpretation` are distinct relationship categories.
- [ ] Feeding of five thousand shows the four Gospel accounts linked to one event.
- [ ] Saul's death shows two accounts linked to one event.
- [ ] Acts 9/22/26 does not falsely imply three distinct conversions.
- [ ] Israel/Judah lanes can overlap; undated visionary material stays undated.
- [ ] Each cited event has accurate references and reviewer/source data.
- [ ] Cross-reference links open the source/target text in the selected legal translation.
- [ ] Large graphs aren't rendered as tens of thousands of DOM nodes at once.
- [ ] People/place records include evidence; unknown coordinates remain unknown.
- [ ] Canonical order, story chronology and writing chronology are separate toggles or explanations.
- [ ] Rights-sensitive datasets are permission-gated; a licenses page lists actual use conditions.
- [ ] Import rejects malformed entries, invalid verse references and dangerous ZIP paths.
- [ ] Search supports localized scripture aliases and Telugu Unicode when text imported.
- [ ] Responsive screen, accessibility and functional E2E tests pass.
- [ ] No fabricated historical dates, Bible quotations or fake 'complete' data coverage.
- [ ] README explains install, `.env.example`, imports, test command, seed limitations and deployment.

## 18. Open decisions (nonblocking assumptions)

The initial product can be developed without these answers; make them configurable:

1. **Canon:** default 66 books; future support for differing Christian canonical traditions by source/reader choice.
2. **Translation:** English KJV and user-provided Telugu Bible are preferred, subject to exact edition, file format and rights review.
3. **Theological scope:** Christian Scripture-centered, with differences in historical reconstruction and disputed prophecy explicitly noted rather than imposed as unmarked fact.
4. **Chronology:** story order works immediately; absolute year models need sources and separate review.
5. **Hosting:** local-first development, with a free-tier-ready deployment plan. Do not commit hosting/API credentials.
6. **AI:** off by default; only with approved corpus and permission to process text.
7. **Public vs private:** anonymous public read-only browser, sign-in only for notes/editor access by default.

## 19. Official reference URLs and primary research list

### Sources supplied by project owner
- https://www.wordproject.org/download/bibles/
- https://www.wordproject.org/index.htm
- https://www.wordproject.org/bibles/resources/index.htm
- https://www.wordproject.org/bibles/parallel/index.htm
- https://www.wordproject.org/bibles/verses/telugu/index.htm
- https://www.wordproject.org/bibles/verses/index.htm
- https://www.wordproject.org/bibles/index.htm

### Functional reference products
- https://bibleproject.com/
- https://bibleproject.com/app/
- https://viz.bible/
- https://www.chrisharrison.net/index.php/visualizations/BibleViz
- https://www.openbible.info/labs/cross-references/
- https://www.openbible.info/labs/cross-references/visualization
- https://www.stepbible.org/
- https://biblehub.com/
- https://www.biblegateway.com/
- https://biblemapper.com/
- https://theonize.github.io/timeline/
- https://github.com/theonize/timeline

### Licensing pages to read before import or media reuse
- https://www.wordproject.org/contact/new/disclaim.htm
- https://www.wordproject.org/contact/new/copyrights.htm
- https://www.openbible.info/labs/cross-references/
- https://www.chrisharrison.net/index.php/visualizations/BibleViz
- https://github.com/theonize/timeline/blob/main/LICENSE

Research reviewed on 20 October 2026. These external sites are **references**; their datasets and artwork have different licenses and quality standards. See each primary source, verify rights and links again before publishing.

---

## 20. COPY-PASTE TASK DIRECTLY INTO CODEX

> We are developing **BIBLE PROJECT — Visual Bible Explorer** in this existing repository. Read `BIBLE_PROJECT_CODEX_MASTER_SPEC.md` fully. First audit the current codebase and write a concise implementation gap report; preserve all functional existing work. Then implement the next missing P0 end-to-end milestone, starting with canonical Bible book and passage models, a source-grounded set of biblical eras/events, and the signature interactive timeline and event detail/Scripture navigation. The product must distinguish same event across multiple biblical books from separate concurrent events, and must not invent historical dates or Bible text. Add accessible parallel/Gospel accounts and a modular cross-reference graph architecture. Use TypeScript typed data, validations, tests, mobile-responsive UI, citations and dataset provenance. Reference the functional ideas in the spec's reference catalogue, but do not copy copyrighted media/assets/UI. If approved full Bible data isn't supplied, provide an honest seed/demo and working import pipeline; do not claim complete coverage. Run all relevant tests and report what was truly implemented and what's next. Do not ask me to repeat specifications already in the file; make reasonable configurable defaults, and request input only for blockers such as missing copyrighted text permission.

**Recommended first implementation unit:** `Bible corpus model -> 30 reviewed events -> Story Era timeline -> event detail with scripture anchors -> parallel passage viewer`, with acceptance tests for feeding of the five thousand, Saul's death, and Acts 9/22/26.

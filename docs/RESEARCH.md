# Research and editorial record

## Scope and evidence

The four user-provided archives are the primary source corpus. HTML Scripture content is parsed across every numbered book/chapter file. Reading software over a corpus is not equivalent to a scholarly close reading of every verse. The 67 events and 21 connections in this release are a selected, cited overview. They do not constitute all biblical cross-references, an exhaustive historical chronology, or a definitive Gospel harmony.

The requested WordProject resources are linked in the application. A direct HTTPS request to `www.wordproject.org` returned a proxy CONNECT 403 during development. The environment draft now requests `www.wordproject.org` and `wordproject.org`. Saving this request does not apply it or establish successful access. None of the live pages are represented as independently verified research in this release.

The timeline uses the supplied KJV verse coordinates for editorial citations. All curated references were mechanically checked against both KJV and Telugu chapter data. The Douay–Rheims selection is presented separately because numbering and coverage cannot safely be assumed equivalent.

## Principles

1. **Narrative sequence and calendar dates are different.** Sequence within a text is displayed without manufacturing calendar precision. No creation year, unsupported patriarchal year, or end-times prediction is supplied.
2. **The same event is not the same as the same period.** Gospel comparisons are labelled parallel accounts. Broad overlap is labelled overlapping periods, with the actual textual warrant described.
3. **Themes do not imply simultaneity.** Creation/new creation, Passover/Christ, and promise/faith are thematic connections. Explicit New Testament interpretations are cited where used (for example 1 Corinthians 5:7).
4. **Book order is not an exact chronology.** Wisdom books form a thematic section. Daniel contains nonchronological arrangement. Letter placement is not inferred from canonical order.
5. **Comparisons preserve differences.** The Gospel temptation order, Passover chronology, and resurrection narratives are not flattened into an invented account. John 1 is described as testimony to the baptism, not a direct baptism scene.
6. **Traditions are identified without ranking them.** The common Protestant and Catholic book sets are described, and Orthodox variation is acknowledged. Missing books are not invented or silently excluded from a claimed complete Catholic edition.
7. **Prophetic vision is not a universally agreed schedule.** Revelation uses literary order, with differences among preterist, historicist, futurist, idealist, and millennial readings noted. These interpretive categories overlap; they are not one mutually exclusive taxonomy.
8. **Quotation and commentary are separate.** Imported verse text is never rewritten to fit an editorial summary. Metadata is editorial and should be reviewed as such.

## Examples of connections with explicit textual warrants

| Relationship | Warrant | Limit |
| --- | --- | --- |
| Joseph / Judah | Genesis 37–39, especially 38:1 | Broad overlap, no exact day alignment |
| Ruth / judges | Ruth 1:1 | No particular judge is identified |
| Elijah / Jehoshaphat | 1 Kings 17–18; 22 | Overlapping Ahab-era context, distinct scenes |
| Samaria / Hezekiah | 2 Kings 18:9–10 | Samaria's siege and the later Jerusalem crisis are distinct |
| Return / Haggai and Zechariah | Ezra 5:1–2 | Explicit link to the rebuilding effort |
| Four feeding accounts | Matthew 14; Mark 6; Luke 9; John 6 | Distinguish feeding 5,000 from feeding 4,000 |
| Paul's encounter retold | Acts 9; 22; 26 | Later speeches retell an earlier event |
| Passover / Christ | 1 Corinthians 5:7 | Explicit theological interpretation, not one historical event |

## Import observations

- KJV Exodus 10:25 uses the malformed class `ver\tse`. Whitespace-normalized class recognition restores its independent verse boundary. Its original wording is not changed.
- KJV 2 Thessalonians 1 has Latin-1 registered-sign and nonbreaking-space bytes in its footer. A narrowly scoped fallback decodes that one file; Scripture is ASCII there.
- Telugu 2 Chronicles 35:27 contains a marker with no verse text. The reader displays a missing-text note.
- Telugu Amos 7:1 includes Hindi text followed by a malformed unnumbered marker and Telugu text. The text remains attached to its supplied numbered verse and is flagged for review.
- Douay–Rheims Luke 1 repeats marker 59 where a sequence would ordinarily include 60. Both entries retain their supplied numbers; the importer does not guess a correction.
- All three supplied HTML archives use 66 numbered book folders and 1,189 chapter files. The DRC-labelled archive is not complete for Catholic use, regardless of its title.

## Remaining research work

- Obtain and verify complete deuterocanonical texts and additions before supporting a complete Catholic canon; identify the desired Orthodox collection before expanding that coverage.
- Verify the exact Telugu translation, edition history, and redistribution permissions from authoritative bibliographic information.
- Compare the flagged verses against independently verified editions; retain correction provenance and original readings if corrections are introduced.
- Verify live WordProject resources after network access is applied, and investigate a licensed, documented cross-reference dataset for broader coverage.
- Have the editorial event/relationship dataset reviewed by qualified readers across the represented traditions. Expand beyond the selected overview without implying that algorithmic similarity proves a historical relationship.
- Add explicit scholarly sources before introducing precise historical date ranges or alternative chronology modes. Include model provenance for regnal synchronisms, exodus dating, Gospel harmonies, and letter dating.
- Translate editorial summaries, navigation, and explanatory notes into reviewed Telugu; current Telugu support covers event titles and source Scripture.

No public deployment is part of this development run. The environment's review/publish process snapshots development state; it is distinct from publishing the website publicly.

# Component 1 Drama — Supabase Setup & Content Import Pipeline

A-Level English Literature, Pearson Edexcel Component 1: Drama (9ET0/01) —
*Hamlet* and *The Duchess of Malfi*.

This package deploys the v6 schema (49 tables) and runs 12 TypeScript
importers that populate every content table from the 11 source markdown
blocks shipped in `source_blocks/`.

## Project layout

```
component1-drama-pwa/
├── package.json
├── tsconfig.json
├── .env.example                 ← copy to .env.local and fill in
├── scripts/
│   ├── importContent.ts         ← master orchestrator
│   ├── importers/
│   │   ├── 00_seed.ts           ← components, texts, acts_scenes, AOs
│   │   ├── 01_themes.ts         ← themes + theme_guidance + theme_theses
│   │   ├── 02_characters.ts     ← characters + aliases
│   │   ├── 03_methods.ts        ← ao2_methods (Hamlet + Duchess)
│   │   ├── 04_critics.ts        ← critics + critic_interpretations
│   │   ├── 05_quotes.ts         ← quotes + secondary_themes + methods + ao_links
│   │   ├── 06_essay_plans.ts    ← essay_plans + plan_paragraphs
│   │   ├── 07_thesis_models.ts  ← thesis_models
│   │   ├── 08_revision_cards.ts ← revision_cards (generated from quotes + themes)
│   │   ├── 09_context_entries.ts← curated AO3 context pillars
│   │   ├── 10_exam_skills.ts    ← timing, grade descriptors, common errors, stems
│   │   └── 11_vocabulary.ts     ← vocabulary_terms + theme_links
│   └── lib/
│       ├── supabaseAdmin.ts     ← admin client (service role)
│       ├── ids.ts               ← in-memory UUID registry
│       ├── log.ts               ← step logger
│       └── parsers.ts           ← shared markdown / table parsers
├── sql/
│   ├── component1_drama_schema_v6.sql   ← deploy this once
│   └── post_import_verification.sql      ← run after import
├── source_blocks/                ← 11 .md blocks (the canonical source of truth)
└── src/                          ← PWA app source (scaffold only)
```

## Runbook

### 1. Create the Supabase project (one time, billable)

The prompt instructed an automated creation here. **This step is left to a
human operator** because creating a Supabase project provisions paid
infrastructure in the `nowthent` org and should not happen silently from a
script:

1. Go to <https://supabase.com/dashboard/new>
2. Project name: `component1-drama`
3. Region: `eu-west-2` (London)
4. Once provisioned (~1 minute), open Settings → API and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configure env

```bash
cp .env.example .env.local
# Edit .env.local with the URL and service role key from step 1
```

### 3. Deploy the schema

In the Supabase SQL editor, paste and run the entire contents of
`sql/component1_drama_schema_v6.sql` (1339 lines, single execution).
Verify with:

```sql
-- Expect 49
select count(*) from information_schema.tables
 where table_schema = 'public' and table_type = 'BASE TABLE';
-- Expect 5 (AO1–AO5)
select * from assessment_objectives;
```

If `assessment_objectives` is empty after the schema runs, that's expected —
importer 00 seeds the rows.

### 4. Install dependencies

```bash
npm install
```

(Already installed during scaffold — re-run if you cloned fresh.)

### 5. Run the import

Full pipeline (recommended):
```bash
npm run import-content
```

Individual steps (each is idempotent — safe to re-run):
```bash
npm run import-seed
npm run import-themes
npm run import-characters
npm run import-methods
npm run import-critics
npm run import-quotes        # the largest step (~192 quotes × 4 ops)
npm run import-essay-plans
npm run import-thesis
npm run import-revision
npm run import-context
npm run import-exam-skills
npm run import-vocab
```

### 6. Verify

In the SQL editor, run `sql/post_import_verification.sql`. The first query
returns content counts; the second checks FK integrity (all should report
`bad_rows: 0`).

## Data flow

The importers parse `source_blocks/*.md` (converted from the 11 .docx blocks
in the parent folder). Re-running an importer re-parses the source and
updates the database — so editing a source block then re-running the
relevant importer propagates changes through. Idempotency is implemented by:

- `upsert` with `onConflict` on natural keys (theme_code, quote_id, …)
- delete-then-insert for child rows (theme_guidance, plan_paragraphs,
  quote_ao_links, etc.) which lack a stable composite unique key

## Notes & limitations

- **Service-role key required.** The anon key cannot bypass RLS for content
  inserts. Never commit `.env.local`.
- **Section B vs Section A.** The schema enforces (via triggers) that AO4
  is never linked to quotes and that AO5 is never linked to Duchess
  content. Importer 05 honours this by suppressing AO5 links on MAL quotes.
- **Theme code normalisation.** Block 5 uses internal codes `DOM_T01–T12`;
  the canonical codes used in the quote bank and FK joins are
  `MAL_T01–T12`. The parser library normalises this transparently.
- **Compound speakers.** Quotes spoken by multiple characters
  ("Julia / The Cardinal", "The Duchess / Bosola") are inserted with
  `character_id = null`. The original speaker string is preserved in the
  `speaker` column.
- **Plan paragraph quote refs.** Where a paragraph references a quote ID
  that does not exist in the quote bank, the row is still created with
  `quote_id = null` rather than failing the whole plan import.

# Claude Code Prompt — AO Integration Trainer (Essay Builder · Mode C)

Paste this prompt to Claude Code from the root of the `prose-craft-aid` repo.
Place the four accompanying files in the locations below BEFORE running CC.

This feature is **Mode C of the Essay Builder** (per `EssayBuilderPrompt_2.md`).
It reuses the four-card pattern shipped in `CC_PROMPT.md` / `0001_essay_builder.sql`,
but applies it to **paragraphs inside a single essay slot** instead of essay routes.

---

## Pre-prompt setup (you, not CC)

1. Place `0002_ao_integration_trainer.sql` in `supabase/migrations/` — rename
   with the next available migration number/timestamp matching the project's
   convention. **0001_essay_builder.sql must already be applied**, since this
   migration reuses the `ao_code`, `play_code` and `question_routes` objects
   it creates.
2. Place the two seed files under `supabase/seed/ao_integration_trainer/`:
   - `seed_hamlet_corruption_paragraph.sql`
   - `seed_duchess_control_paragraph.sql`
   Do NOT run them yet — CC will run the migration first, then the seeds.
3. Place `aoIntegrationTrainer.ts` at `src/types/aoIntegrationTrainer.ts`.
   It imports `AOCode` and `PlayCode` from `src/types/essayBuilder.ts`, which
   must already exist.
4. Confirm the Supabase project is `szdgsmpxtifrcmwelqfo` and you have it
   selected in the Supabase CLI.

Once those files are committed (or staged), run the prompt below.

---

## Prompt for Claude Code

```
You are working on the Prose Craft Aid app — a React + TypeScript + Supabase
A-Level English Literature tutoring tool. The repo is `Dr-T-B/prose-craft-aid`,
deployed to Vercel at `prose-craft-aid-main.vercel.app`. Supabase project:
`szdgsmpxtifrcmwelqfo`.

You are building the AO Integration Trainer — Mode C of the Essay Builder
feature. Goal: ship a working Hamlet + Duchess paragraph drill loop tonight.

The Essay Route Builder (Mode B) is already shipped (commit history will
show `feat(essay-builder): ship Hamlet corruption loop`). Mode C reuses the
same four-card UI pattern but applies it to paragraphs inside a single
paragraph slot, not to essay routes.

## Step 1 — Read these files first, in this order

1. `EssayBuilderPrompt_2.md` (in repo root or `docs/` — the spec for the
   AO Integration Trainer)
2. `supabase/migrations/<the new migration>_ao_integration_trainer.sql`
3. `supabase/seed/ao_integration_trainer/seed_hamlet_corruption_paragraph.sql`
4. `supabase/seed/ao_integration_trainer/seed_duchess_control_paragraph.sql`
5. `src/types/aoIntegrationTrainer.ts`
6. `src/types/essayBuilder.ts` (already in repo — the new types reuse
   `AOCode` and `PlayCode` from it)

Then read the existing Essay Builder feature so you can match its patterns
exactly:

7. `src/features/essayBuilder/api.ts`
8. `src/features/essayBuilder/hooks.ts`
9. `src/features/essayBuilder/components/` (all files)
10. The four pages: `EssayBuilderHomePage`, `PathSelectionPage`,
    `FeedbackPage`, `SkeletonPage`
11. The router config and protected-route wrapper

Do not start writing code until you have read all of the above. If any of
these files don't exist or you can't find the equivalent, STOP and ask.

The AO Integration Trainer must be a sibling feature to the Essay Builder,
not a fork of it. Reuse components (button, card, error card, retry,
play-selector) wherever they exist — do not re-invent them.

## Step 2 — Run the migration and seeds

Using the Supabase MCP (if connected) or the Supabase CLI:

a) Apply `0002_ao_integration_trainer.sql` against the dev database.
b) Run `seed_hamlet_corruption_paragraph.sql`.
c) Run `seed_duchess_control_paragraph.sql`.
d) Verify with SELECTs:
   - 2 drills exist (1 Hamlet, 1 Duchess)
   - 4 options per drill (8 total)
   - exactly 1 option per drill has `classification = 'A_STAR_INTEGRATED'`
     and `is_best_answer = true`
   - every Hamlet option has `ao4_score IS NULL`
   - every Duchess option has `ao4_score IS NOT NULL`

If the migration fails because route H001
(`a0000001-0000-0000-0000-000000000001`) does not exist in
`question_routes`, STOP and tell me — Mode B's seed must run first.

## Step 3 — Build the data layer

Create `src/features/aoIntegrationTrainer/api.ts` with these functions, all
using the existing Supabase client:

- `fetchDrills(play: PlayCode): Promise<AOIntegrationDrill[]>`
- `fetchDrill(id: string): Promise<AOIntegrationDrill>`
- `fetchOptions(drillId: string): Promise<AOParagraphOption[]>`
- `recordAttempt(args: {
     drillId: string,
     selectedOptionId: string,
     attemptNo: number,
   }): Promise<AOIntegrationAttempt>`
- `markFeedbackShown(attemptId: string): Promise<void>`
- `fetchAttemptsForDrill(drillId: string): Promise<AOIntegrationAttempt[]>`

`recordAttempt` must NOT compute `is_correct` client-side beyond the obvious
lookup — the database trigger `enforce_attempt_correctness` validates it.
Pass the value from the looked-up option's `is_best_answer`.

Then create `src/features/aoIntegrationTrainer/hooks.ts` with TanStack Query
wrappers around each, matching the Essay Builder's pattern.

## Step 4 — Build the two pages

All pages use the existing protected-route wrapper. Match the existing page
layout (header, container width, padding) — do not invent new shell.

1. **`AOTrainerHomePage`** at `/ao-trainer`
   - Play selector: two buttons, Hamlet and Duchess of Malfi (reuse the
     Essay Builder play selector if it is extracted; otherwise duplicate
     and flag in your report)
   - Drill list: shows each drill's `paragraph_slot` with the parent
     `exam_question` shown smaller above
   - "Start" button → navigates to drill page (no separate `attempts`
     table in this feature; the attempt is created inside the drill page
     when the student selects an option)

2. **`AOTrainerDrillPage`** at `/ao-trainer/:drillId`
   - Loads drill → loads 4 options
   - Top: exam question + paragraph slot
   - Body: 4 paragraph cards, full-width stacked on mobile, 2x2 on desktop.
     Each card shows ONLY: `option_label` (A/B/C/D) and `paragraph_text`.
     Do NOT show classification, scores or feedback before selection.
   - Cards are randomised — use `drillId` + `attempt_no` as a stable seed
     so refresh doesn't reshuffle within the same attempt. (Implementation
     note: simple seeded shuffle — do NOT install a new dependency for
     this. Reuse the seeded shuffle from the Essay Builder.)
   - On click of a paragraph card:
     - confirm dialog ("Once you choose, the app will diagnose the
       paragraph's AO integration. Ready?")
     - call `recordAttempt`
     - reveal the feedback panel inline below the cards (do not navigate
       away — students need to see the chosen paragraph alongside its
       diagnosis)
   - Feedback panel renders:
     - whether the choice is correct, partially correct, or wrong
       (correct iff `selected.classification = 'A_STAR_INTEGRATED'`;
        partially correct iff `classification IN ('AO_IN_TURNS',
        'AO_DOMINANT', 'AO4_BOLTED_ON')`; wrong otherwise)
     - `examiner_diagnosis` (under heading "What an examiner would
       notice")
     - `student_feedback` (under heading "Why this paragraph works /
       fails")
     - `improvement_instruction` (under heading "How to improve it")
     - the AO score breakdown as small chips: AO1/AO2/AO3/(AO4)/AO5 with
       1–5 scores; for Hamlet drills, the AO4 chip is hidden entirely
       (NOT shown as "n/a")
     - integration + sequence scores under "AO sequence and integration"
   - Action area below feedback panel:
     - "Try another drill" → back to `/ao-trainer`
     - "Show A* version" → reveals the option where `is_best_answer`,
       in a side card, with its `paragraph_text` and `examiner_diagnosis`.
       For correct selections this is the same paragraph the student
       chose — keep the button enabled but say "You picked it" inline.
     - "Build my own paragraph" → stub, toast "Coming soon"
     - "Save result" → stub, toast "Saved" (no DB write yet — the
       attempt itself is already saved by `recordAttempt`)

## Step 5 — AO highlights on the A* paragraph

When the student is shown the A* paragraph (either because they picked it,
or via "Show A* version"), highlight:
  - AO1 claim (the opening interpretive claim and any closing return)
  - AO2 method (verbs of method analysis)
  - AO3 context (the sentence that anchors context)
  - AO5 debate (the sentence that introduces a critic dialectically)
  - AO4 comparison (Duchess only — the woven comparison sentence)

For v1, do this with simple sentence-level colour-coded backgrounds based
on a per-option `highlights` map declared inline in the seed paragraph
text? — DO NOT add a new column. Instead: implement a small client-side
heuristic that splits paragraph_text into sentences and tags each by
keyword pattern (`Greenblatt|Garber|Bradbrook|Belsey` → AO5;
`Jacobean|Reformation|early modern` → AO3; etc.). Tag the first sentence
as AO1 and the last sentence containing the question's keyword as AO1
return. For Duchess only, tag any sentence mentioning Hamlet/Polonius as
AO4. Keep the heuristic small and isolated in
`src/features/aoIntegrationTrainer/highlights.ts` — it is intentionally a
v1 hack, with a comment to that effect.

## Step 6 — Empty / loading / error states

Every page must handle:
- Loading: existing project's loading component or a simple spinner
- Error: an error card with a "Retry" button that re-runs the failed query
- Empty: e.g. on home page, "No drills seeded yet for Hamlet" if
  fetchDrills returns []

Reuse the Essay Builder's components for these — do not duplicate.

## Step 7 — Register routes and add navigation

Add the two routes to the existing router config. Wrap them in the
existing protected-route wrapper. Add a link to `/ao-trainer` in the
existing navigation, sibling to the Essay Builder link, labelled "AO
Trainer". If the Essay Builder link sits inside a "Drama" section, put
the AO Trainer link there too.

## Step 8 — Run the project locally and verify

Start the dev server. Walk through both drills end-to-end:

Hamlet drill:
1. Log in
2. Navigate to `/ao-trainer`
3. Pick Hamlet → pick the corruption / Claudius-rhetoric drill → start
4. Verify 4 paragraph cards render in randomised order
5. Click paragraph D (narrative summary) → verify feedback identifies
   AO1 drift and shows scores 1/1/1/–/1; AO4 chip is NOT rendered
6. Click "Try another drill" → return to home
7. Re-enter the same drill → click paragraph A → verify "You picked it"
   appears next to "Show A* version", and the AO highlights render

Duchess drill:
8. Pick Duchess → pick the control / Bosola-surveillance drill → start
9. Verify 4 paragraph cards render
10. Click paragraph C (AO4 bolted on) → verify feedback specifically
    flags the bolted-on AO4 and improvement_instruction asks the student
    to move the comparison up
11. Click paragraph A → verify the AO4 highlight is rendered on the
    sentence comparing Polonius and Bosola

## Step 9 — Definition of done (verify before committing)

Tick each item:

- [ ] Migration applied successfully against dev Supabase
- [ ] Seeds inserted: 2 drills, 8 options, 0 attempts
- [ ] Trigger `enforce_drill_option_invariants` rejects a 5th option on
      either drill (test by attempting to insert one and rolling back)
- [ ] Trigger rejects a Hamlet option with `ao4_score = 3`
- [ ] Trigger rejects a Duchess option with `ao4_score IS NULL`
- [ ] Both pages render and navigate correctly
- [ ] Paragraph cards are randomised but stable per attempt_no
- [ ] Selecting A* shows correct feedback shape
- [ ] Selecting AO_IN_TURNS / AO_DOMINANT / AO4_BOLTED_ON shows
      "partially correct" feedback shape
- [ ] Selecting NARRATIVE_SUMMARY / CONTEXT_DUMPING shows wrong feedback
- [ ] Hamlet drill never renders an AO4 score chip
- [ ] Duchess drill always renders an AO4 score chip
- [ ] AO highlights render on the A* paragraph (sentence-level colour)
- [ ] Loading, error, and empty states handled on every data-bound page
- [ ] RLS verified: `ao_integration_attempts` only returns rows for the
      current user (test by querying as a different user via the Supabase
      dashboard)
- [ ] TypeScript compiles with no errors
- [ ] Existing tests still pass (`npm test` or equivalent)
- [ ] Essay Builder routes still work (smoke-test `/essay-builder`)

## Step 10 — COMMIT

Once all DoD items are ticked, commit the work. Use this commit message:

```
feat(ao-trainer): ship paragraph-level AO integration drill (Mode C)

- Add ao_integration_trainer schema (3 tables, 5 triggers, RLS)
- Reuse ao_code, play_code, question_routes from essay-builder
- Seed Hamlet corruption-paragraph drill (AO4 excluded by schema trigger)
- Seed Duchess control-paragraph drill (AO4 required by schema trigger)
- Add AOTrainerHomePage + AOTrainerDrillPage with four-card paragraph drill
- Add sentence-level AO highlights on the A* paragraph (v1 heuristic)
- Wire TanStack Query hooks against new tables

Refs: EssayBuilderPrompt_2.md (Mode C: Detect Failure)
```

Push the commit to the current branch. Do NOT open a PR — I will review
and merge manually.

## Step 11 — Report

Tell me:
- Anything you had to adapt because the existing codebase patterns differed
  from what the spec assumed (the spec uses `text_id` and `theme_id`; the
  migration adapts these to `play_code` and `theme_tag` to match
  prose-craft-aid conventions — confirm this matches the live schema)
- Any DoD items you could not verify and why
- The exact commit hash you pushed

Do NOT proceed past Step 1 if any of the input files are missing.
Do NOT skip Step 8 (manual verification of both drills).
Do NOT commit until every DoD item is ticked.
```

---

## Notes for you (not for CC)

- The "Show A* version" panel in Step 4 is a small UI surface that doesn't
  need to be beautiful for v1 — re-rendering the chosen paragraph card
  alongside the A* card with the AO highlight overlay is enough.
- The sentence-level AO highlights in Step 5 are intentionally a heuristic
  for v1. Once Stage 2 of the Question Router lands, swap to per-option
  `ao_breakdown` JSONB authored alongside `paragraph_text`.
- If CC stalls on "Build my own paragraph" or "Save result" wiring, the
  stubs are acceptable for v1 — both are follow-ups.
- After CC finishes, do a quick visual pass on the two pages on mobile.
  The most likely rough edge is paragraph card height on long options — a
  collapsed-by-default state with "Read full paragraph" may be worth
  considering if any card exceeds ~14 lines on a 360px viewport.
- If the Vercel auto-deploy is on, the push will trigger a deploy. Confirm
  the production URL works before the next study session.

## If something goes wrong

- **Migration fails on `paragraph_classification` already exists**: harmless
  if a previous run created it; re-run is safe (the migration uses
  `do $$ … exception when duplicate_object then null; end $$`).
- **Migration fails on FK to `question_routes`**: `0001_essay_builder.sql`
  hasn't been applied. Apply it first.
- **Hamlet seed fails on FK `route_id`**: route H001
  (`a0000001-0000-0000-0000-000000000001`) does not exist in
  `question_routes`. Run `seed_hamlet_corruption.sql` first to create it,
  or temporarily set `route_id` to `null` in this seed.
- **Trigger blocks legitimate-looking inserts**: the most common cause is
  setting `is_best_answer = true` on a non-A* option, or the reverse.
  `is_best_answer = (classification = 'A_STAR_INTEGRATED')` is enforced.
- **AO4 chip renders for Hamlet anyway**: check the conditional on
  `option.ao4_score !== null` rather than on the play — the schema
  guarantees `ao4_score IS NULL` for Hamlet, so the data check is the
  source of truth.
- **CC introduces a new dependency**: revert and re-prompt with "use only
  existing dependencies — implement the seeded shuffle and AO highlight
  heuristic inline."
- **Pages render but data doesn't load**: most likely RLS is blocking
  reads. Confirm the two `auth read` policies on `ao_integration_drills`
  and `ao_paragraph_options` applied.

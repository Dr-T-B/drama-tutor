# Claude Code Prompt — Essay Builder feature

Paste this prompt to Claude Code from the root of the `prose-craft-aid` repo.
Place the three accompanying files in the locations below BEFORE running CC.

---

## Pre-prompt setup (you, not CC)

1. Place `0001_essay_builder.sql` in `supabase/migrations/` — rename with the
   next available migration number/timestamp matching the project's convention.
2. Place `seed_hamlet_corruption.sql` somewhere CC can find it — e.g.
   `supabase/seed/essay_builder/seed_hamlet_corruption.sql`. Do NOT run it yet;
   CC will be instructed to run the migration first, then the seed.
3. Place `essayBuilder.ts` at `src/types/essayBuilder.ts`.
4. Confirm the Supabase project is `szdgsmpxtifrcmwelqfo` and you have it
   selected in the Supabase CLI.

Once those three files are committed (or staged), run the prompt below.

---

## Prompt for Claude Code

```
You are working on the Prose Craft Aid app — a React + TypeScript + Supabase
A-Level English Literature tutoring tool. The repo is `Dr-T-B/prose-craft-aid`,
deployed to Vercel at `prose-craft-aid-main.vercel.app`. Supabase project:
`szdgsmpxtifrcmwelqfo`.

You are building the FIRST iteration of the Essay Builder feature for the
Drama (Component 1) module. Goal: ship a working Hamlet-only loop tonight.
Duchess questions follow tomorrow.

## Step 1 — Read these files first, in this order

1. `EssayBuilder_v2.md` (in repo root or `docs/` — the spec)
2. `supabase/migrations/<the new migration>_essay_builder.sql`
3. `supabase/seed/essay_builder/seed_hamlet_corruption.sql`
4. `src/types/essayBuilder.ts`

Then read these existing files to understand the project's patterns:

5. The Supabase client setup (look in `src/lib/` or `src/supabase/`)
6. The auth/protected route wrapper (search for `ProtectedRoute` or
   `RequireAuth` or similar)
7. The router config (look for `createBrowserRouter` or `<Routes>`)
8. One existing page component (e.g. an essay-plans page) for the
   established Tailwind patterns and component shape
9. The TanStack Query setup (`QueryClientProvider` and any existing
   query hooks)

Do not start writing code until you have read all of the above. If any of
these files don't exist or you can't find the equivalent, STOP and ask me.

## Step 2 — Run the migration and seed

Using the Supabase MCP (if connected) or the Supabase CLI:

a) Apply `0001_essay_builder.sql` against the dev database.
b) Run `seed_hamlet_corruption.sql`.
c) Verify with a SELECT that the Hamlet question and 4 path options exist.

If the migration fails because `question_routes` already exists with a
different shape, STOP and tell me — do not modify the migration.

## Step 3 — Build the data layer

Create `src/features/essayBuilder/api.ts` with these functions, all using
the existing Supabase client:

- `fetchQuestions(play: PlayCode): Promise<EssayBuilderQuestion[]>`
- `fetchQuestion(id: string): Promise<EssayBuilderQuestion>`
- `fetchPaths(questionId: string): Promise<EssayPathOption[]>`
- `fetchFeedback(id: string): Promise<EssayPathFeedback>`
- `fetchSkeleton(pathOptionId: string): Promise<EssaySkeleton | null>`
- `startAttempt(questionId: string, play: PlayCode): Promise<EssayBuilderAttempt>`
- `recordChoice(attemptId: string, pathOptionId: string, retryNumber: number): Promise<EssayBuilderAttemptChoice>`
- `completeAttempt(attemptId: string, outcome: PathClassification, unlocked: boolean): Promise<void>`

Then create `src/features/essayBuilder/hooks.ts` with TanStack Query
wrappers around each, matching whatever pattern the existing hooks use.

## Step 4 — Build the four pages

All four pages use the existing protected-route wrapper. Match the existing
page layout (header, container width, padding) — do not invent new shell.

1. **`EssayBuilderHomePage`** at `/essay-builder`
   - Play selector: two buttons, Hamlet and Duchess of Malfi
   - For now, Duchess shows "Coming tomorrow" disabled state
   - Question selector: list of questions for selected play
   - "Start" button → calls `startAttempt`, navigates to path selection page

2. **`PathSelectionPage`** at `/essay-builder/:attemptId`
   - Loads attempt → loads question → loads 4 paths
   - Shows question text at top
   - Shows 4 path cards in 2×2 grid (desktop) / vertical stack (mobile)
   - Each card shows ONLY: `path_label` and `thesis_direction`
   - Cards are randomised — use `attempt.id` as a stable seed so refresh
     doesn't reshuffle. (Implementation note: simple seeded shuffle — do
     NOT install a new dependency for this.)
   - On click: confirm dialog ("Once you choose, the app will explain why
     each path works or fails. Ready?"), then `recordChoice` with
     `retry_number = current_retry`, then navigate to feedback page.

3. **`FeedbackPage`** at `/essay-builder/:attemptId/feedback/:choiceId`
   - Loads choice → loads path → loads feedback
   - Renders feedback per §4 of the spec — use the type guards in
     `essayBuilder.ts` to narrow `body_sections` by classification
   - Bottom action area:
     - `correct` → "Unlock essay skeleton" → navigate to skeleton page
     - `partial` → "Unlock skeleton with upgrade notes" → skeleton page
     - `wrong` / `exam_risk` (1st attempt) → "Try again" → back to path
       selection, increment retry_number on next choice
     - `wrong` / `exam_risk` (2nd+ attempt) → "Try again" + "Compare with
       correct route" (the latter shows the correct path's thesis_direction
       and feedback in a side panel — NOT the full skeleton)

4. **`SkeletonPage`** at `/essay-builder/:attemptId/skeleton`
   - Loads selected path → loads skeleton
   - Shows thesis (large, prominent)
   - Shows each paragraph as a collapsible card with: function, AO2 methods
     (chips), AO3 anchor, AO5 debate, key quotes (chips for now — actual
     quote text retrieval comes later)
   - Shows conclusion card
   - If `upgrade_banner` is non-null, show a banner at the top
   - For Hamlet: paragraphs will all have `ao4_embed === null`, so do NOT
     render an AO4 section for any Hamlet skeleton paragraph
   - Action: "Save plan" — for now, this can be a stub button that shows
     a toast "Saved" — actual integration with `essay_plans` table is a
     follow-up task. Do not block the build on this.

## Step 5 — Empty / loading / error states

Every page must handle:
- Loading: existing project's loading component or a simple spinner
- Error: an error card with a "Retry" button that re-runs the failed query
- Empty: e.g. on home page, "No questions seeded yet for Hamlet" if
  fetchQuestions returns []

Use the existing project's components for these if they exist. If not,
create minimal ones in `src/features/essayBuilder/components/`.

## Step 6 — Register routes

Add the four routes to the existing router config. Wrap them in the
existing protected-route wrapper. Add a link to `/essay-builder` in
whatever navigation/menu the app already has.

## Step 7 — Run the project locally and verify

Start the dev server. Walk through this end-to-end:

1. Log in (or create a test user if needed)
2. Navigate to `/essay-builder`
3. Pick Hamlet → pick the corruption question → start
4. Verify 4 path cards render in randomised order with thesis directions
5. Click Path D (exam-risk) → verify feedback renders → click "Try again"
6. Click Path C (wrong) → verify feedback renders → "Compare with correct"
   button now appears → click "Try again"
7. Click Path B (partial) → verify upgrade banner appears in skeleton
8. Go back, restart, click Path A (correct) → verify full skeleton renders
   without upgrade banner

## Step 8 — Definition of done (verify before committing)

Tick each item:

- [ ] Migration applied successfully against dev Supabase
- [ ] Seed inserted: 1 question, 4 paths, 4 feedback rows, 2 skeletons
- [ ] All four pages render and navigate correctly
- [ ] Path cards are randomised but stable per attempt
- [ ] Selecting `correct` unlocks full skeleton
- [ ] Selecting `partial` unlocks skeleton with upgrade banner
- [ ] Selecting `wrong` or `exam_risk` does NOT unlock skeleton
- [ ] After 2 wrong attempts, "Compare with correct route" appears
- [ ] All Hamlet skeleton paragraphs have NO AO4 section rendered
- [ ] Loading, error, and empty states handled on every data-bound page
- [ ] RLS verified: attempts table only returns rows for the current user
      (test by querying as a different user via the Supabase dashboard)
- [ ] TypeScript compiles with no errors
- [ ] Existing tests still pass (`npm test` or equivalent)

## Step 9 — COMMIT

Once all DoD items are ticked, commit the work. Use this commit message:

```
feat(essay-builder): ship Hamlet corruption loop

- Add essay_builder schema (5 tables, 3 triggers, RLS)
- Seed Hamlet corruption question with 4 paths + 2 skeletons
- Add EssayBuilderHomePage, PathSelectionPage, FeedbackPage, SkeletonPage
- Wire TanStack Query hooks against new tables
- Hamlet excludes AO4 (schema-enforced)

Duchess questions to follow.

Refs: EssayBuilder_v2.md
```

Push the commit to the current branch. Do NOT open a PR — I will review and
merge manually.

## Step 10 — Report

Tell me:
- Anything you had to adapt because the existing codebase patterns differed
  from what the spec assumed
- Any DoD items you could not verify and why
- The exact commit hash you pushed

Do NOT proceed past Step 1 if any of the four input files are missing.
Do NOT skip Step 7 (manual verification).
Do NOT commit until every DoD item is ticked.
```

---

## Notes for you (not for CC)

- The "Compare with correct route" panel in Step 4 is a small UI surface
  that doesn't need to be beautiful for v1 — a simple two-column layout
  showing the correct path's label + thesis_direction + feedback headline
  is enough.
- If CC stalls on "Save plan" wiring, that's fine — the stub is acceptable
  for v1. Real integration with `essay_plans` is a follow-up.
- After CC finishes, do a quick visual pass on the four pages before Tawi
  starts at 8pm. The most likely rough edge is the path card spacing on
  mobile.
- If the Vercel auto-deploy is on, the push will trigger a deploy. Confirm
  the production URL works before 8pm.

## If something goes wrong

If CC gets stuck on the migration (e.g. existing `question_routes` table
conflict), the safe fix is: drop the stub block from the migration and
manually verify your real `question_routes` table has rows for codes
'H001', 'H003', 'H006'. If it doesn't, insert them by hand using the
UUIDs from the seed file.

If CC introduces a dependency you didn't want, it's safe to revert and
re-prompt with "use only existing dependencies — implement the seeded
shuffle inline."

If the four pages render but data doesn't load, the most likely cause is
RLS blocking reads. Confirm the four `auth read` policies in the
migration applied — they are the only thing that lets authenticated
users read questions/paths/feedback/skeletons.

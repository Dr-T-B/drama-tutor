# Essay Builder — Build Specification v2

**Project:** Prose Craft Aid — Drama Tutor module
**Exam board:** Pearson Edexcel A-Level English Literature
**Component:** 1 — Drama
**Texts:** *Hamlet* (Section A), *The Duchess of Malfi* (Section B)
**Exam date:** **Wednesday 13 May 2026**
**Target user:** Level 4–5 student aiming at A/A*
**Stack:** React + TypeScript + Supabase + Vercel
**Status:** Replaces v1 (`EssayBuilder.md`).

---

## 0. Changes from v1

| # | Change | Reason |
|---|--------|--------|
| 1 | Exam date corrected to **13 May 2026** | v1 said 11/05; this was wrong |
| 2 | Path route IDs are now **FKs to existing `question_routes` table** | Avoids orphan strings; integrates with Stage 2 Router |
| 3 | AO4 prompt is **embedded inside paragraph functions**, not appended | v1 risked bolt-on AO4; mark scheme penalises this |
| 4 | New `retry_number` column on `essay_builder_attempt_choices` | Enables differentiated feedback on second attempt at same path |
| 5 | RLS policies and `user_id` FK to `auth.users` specified throughout | v1 had no auth model |
| 6 | MVP scoped to **preset questions only**; free-text questions deferred | Reduces NLP scope for first ship |
| 7 | UI spec now includes **loading, error, and empty states** | v1 only specified happy path |
| 8 | Feedback tone anchor added (`firm_instructive` enum) | Locks future LLM-generated feedback to consistent register |
| 9 | Definition of done now includes **AO4 embedding test** for Duchess paths | Prevents regression to bolted-on AO4 |
| 10 | New §15 — **Question Router integration contract** | v1 deferred this without specifying the join surface |

---

## 1. Feature Name and Purpose

**Feature name:** **Essay Builder** (subtitle: *Argument Pathway Trainer*).

**One-line:** A four-path judgement trainer that forces the student to choose the best essay route *before* writing, with diagnostic feedback explaining why weak or risky routes fail.

**Why it moves a Level 4 student to A/A*:**

- A-Level Drama students at Level 4 typically have AO2 method knowledge, AO3 context recall, and AO5 critic awareness — but lose marks by writing a *plausible-but-tangential* essay that does not precisely answer the question.
- The four-path model surfaces this exact failure mode: Path C ("tempting but wrong") is the route a Level 3–4 student would pick under exam pressure.
- Forcing an explicit choice with explanatory feedback trains **route discipline** and **thesis discrimination** — the two skills that separate Level 4 from Level 5 in the Edexcel descriptors ("controlled and assured argument" vs. "well-developed but partial").

**What the feature is not:**

- Not a generic essay planner.
- Not an AI essay generator.
- Not a quote retriever (that is a separate module).
- The primary learning action is **choosing**, not writing.

---

## 2. User Flow

```
[1] Select text ──▶ [2] Select question ──▶ [3] Router resolves metadata
                                                      │
                                                      ▼
                                          [4] Display 4 path cards
                                                      │
                                                      ▼
                                          [5] Student selects 1 path
                                                      │
                                                      ▼
                                          [6] Diagnostic feedback
                                                      │
                                       ┌──────────────┼──────────────┐
                                       ▼              ▼              ▼
                                 [7a] Correct   [7b] Partial   [7c] Wrong/Risk
                                       │              │              │
                                       ▼              ▼              ▼
                                 Unlock skeleton  Unlock + upgrade  Try again
                                                  advice            (max 3 retries)
```

**Step detail:**

1. **Select text:** *Hamlet* or *The Duchess of Malfi*. Stored on `essay_builder_attempts.play_code`.
2. **Select question:** From preset list filtered by `play_code`. (Free-text input deferred to v2.)
3. **Router resolves:** Foreign-key lookup returns `primary_route_id`, `secondary_route_id`, `theme_tags[]`, `character_focus[]`, `relevant_aos[]`. AO4 is auto-included for Duchess, auto-excluded for Hamlet.
4. **Display 4 paths:** Cards show *thesis direction only* — no full answer, no AO grid revealed pre-selection. Path order is **randomised per attempt** to prevent positional bias.
5. **Student selects:** Single selection. Confirm dialog shown only on first attempt of session.
6. **Feedback:** Renders one of four feedback templates (Correct / Partial / Wrong / Exam-risk) populated from `essay_path_feedback` row.
7. **Outcome:**
   - **Correct** → unlock essay skeleton.
   - **Partial** → unlock skeleton with upgrade banner pointing at the stronger route.
   - **Wrong / Exam-risk** → no skeleton; "Try again" button. Compare-with-correct option appears after 2nd wrong attempt.

---

## 3. The Four-Path Model

Each question has exactly four `essay_path_options`. Classification is one of:

| Code | Label | Unlocks skeleton? |
|------|-------|-------------------|
| `correct` | Best route | Yes (full) |
| `partial` | Valid but narrower | Yes (with upgrade banner) |
| `wrong` | Tempting but wrong | No |
| `exam_risk` | Exam-risk route | No |

Each path stores:

```
- path_label              (UI title, e.g. "Corruption as moral disease")
- route_id                (FK → question_routes.id)
- classification          (correct | partial | wrong | exam_risk)
- thesis_direction        (1–2 sentences shown on card pre-selection)
- ao_strengths            (array of AOCode)
- ao_weaknesses           (array of AOCode)
- why_attractive          (why a Level 3–4 student might pick this)
- feedback_id             (FK → essay_path_feedback)
- unlocks_skeleton        (boolean — derived but stored for query speed)
```

**Path design rules:**

- **`correct`** must align with the question's `primary_route_id` and integrate at least four AOs (or all five for Duchess).
- **`partial`** uses `secondary_route_id` or a narrower reading of `primary_route_id`. Must be defensible — never invent a path that examiners would mark down at Level 3+.
- **`wrong`** must be theme-adjacent (e.g. revenge route on a corruption question) so it is genuinely tempting. The mismatch must be at the **question level**, not the textual level.
- **`exam_risk`** must name a specific failure mode: narrative summary, context dumping, AO5 name-dropping, AO2 feature-spotting, or AO4 bolt-on (Duchess only).

---

## 4. Feedback Logic

Four feedback templates, each with required fields:

### 4.1 Correct

```
- headline:           "This route directly answers the question."
- why_it_fits:        2–3 sentences linking thesis to question stem
- ao_integration:     paragraph showing how AOs interlock in this route
- next_action:        "Unlock essay skeleton"
```

### 4.2 Partial

```
- headline:           "This route is relevant but narrow."
- what_it_misses:     specific aspect of the question this route under-serves
- upgrade_advice:     2–3 sentences pointing at the stronger reading
- ao_diagnosis:       which AO(s) this route under-loads
- next_action:        "Unlock skeleton with upgrade notes" | "See stronger route"
```

### 4.3 Wrong

```
- headline:           "This route doesn't answer the question precisely."
- mismatch:           explicit statement of what the question asks vs. what this route delivers
- what_it_becomes:    "This essay would accidentally become an answer to: [adjacent question]"
- ao_diagnosis:       AO that would suffer (with mark scheme language)
- redirect:           how to redirect this route to the actual question
- next_action:        "Try again" | "Compare with correct route" (after 2nd attempt)
```

### 4.4 Exam-risk

```
- headline:           "This route would produce a low-band answer."
- exam_danger:        named failure mode from the AO problems list
- ao_problem:         specific AO with descriptor-level diagnosis, e.g.:
                        - "AO1 too vague — would read as general comment"
                        - "AO2 feature-spotting — names devices without method-to-meaning link"
                        - "AO3 context dumping — biographical detail not anchored to text"
                        - "AO4 bolted on — Hamlet comparison appears once, not woven"  (Duchess only)
                        - "AO5 name-dropping — critic cited but position not engaged with"
- what_it_becomes:    likely Level 2–3 outcome described in mark scheme terms
- redirect:           the structural fix
- next_action:        "Try again"
```

**Feedback tone anchor:** All feedback strings written in `firm_instructive` register — direct, technical, never patronising or apologetic. Stored as `tone_register` enum on `essay_path_feedback` for future LLM-generated content.

---

## 5. AO Rules

**Hamlet (Section A):** AO1, AO2, AO3, AO5. **AO4 is excluded by schema constraint.** No AO4 prompts, feedback, or skeleton items can render for Hamlet.

**The Duchess of Malfi (Section B):** AO1, AO2, AO3, **AO4**, AO5. AO4 must be **embedded in paragraph functions**, not added as a final paragraph or skeleton bullet.

**AO4 embedding rule (Duchess only):**

- AO4 prompts appear **inline** within paragraph function descriptions, e.g.:
  > *Paragraph 2 (function): Show how Webster's stagecraft of the dead-hand scene controls the audience's epistemology of cruelty. **Connect briefly to Shakespeare's parallel use of the play-within-a-play in Hamlet** as a comparable instrument of forced witness.*
- AO4 prompts must **never** appear as a standalone skeleton item.
- The seed validator (§13.4) must reject any Duchess skeleton with `>= 1` AO4 prompt outside paragraph functions.

---

## 6. Essay Skeleton Unlock

When the student selects `correct` or `partial`, generate a skeleton with these fields:

```
thesis                         — single-sentence argument
paragraph_1: { function, key_quotes[], ao2_methods[], ao3_anchor, ao5_debate, ao4_embed? }
paragraph_2: { ... }
paragraph_3: { ... }
paragraph_4: { ... }                                    — optional (3 or 4 body paragraphs)
conclusion: { function, dialectical_move }              — what the conclusion's job is
```

**Per paragraph:**

- `function` — what this paragraph does in the argument (not what it says)
- `key_quotes` — 2–3 quote IDs from `quotes` table
- `ao2_methods` — method tags (e.g. soliloquy, blank verse rupture, antithesis)
- `ao3_anchor` — single context anchor, integrated not appended
- `ao5_debate` — 1–2 critic positions to weave (paraphraseable, not name-dropped)
- `ao4_embed` — Duchess only; comparative move to Hamlet, **string nullable for Hamlet, required for Duchess**

**For `partial` selections,** skeleton is identical but prefixed with an **upgrade banner**: "This skeleton is built from a narrower reading. To upgrade to A* range, see [stronger route]."

---

## 7. Wrong-Path Teaching Surface

When the student selects `wrong` or `exam_risk`, the feedback panel renders five sections:

1. **Why this is wrong** — direct statement of the mismatch
2. **What the question is really asking** — restatement of the question stem with key concept underlined
3. **What this route would accidentally become** — the essay this route writes if executed
4. **Which AO would suffer** — single most-affected AO with mark scheme language
5. **How to redirect** — concrete pivot (e.g. "Keep your AO2 work on imagery, but redirect from revenge → corruption by reframing the imagery as symptomatic of state decay")

After 2nd wrong attempt on the same question, a **"Compare with correct route"** button appears, showing the `correct` path's thesis_direction and feedback side-by-side with the student's chosen path.

---

## 8. Data Model (Supabase)

### 8.1 Schema

```sql
-- AO and play enums
create type ao_code as enum ('AO1', 'AO2', 'AO3', 'AO4', 'AO5');
create type play_code as enum ('hamlet', 'duchess_of_malfi');
create type path_classification as enum ('correct', 'partial', 'wrong', 'exam_risk');
create type tone_register as enum ('firm_instructive');

-- Master question table
create table essay_builder_questions (
  id                  uuid primary key default gen_random_uuid(),
  play_code           play_code not null,
  question_text       text not null,
  question_year       int,                                     -- e.g. 2023
  theme_tags          text[] not null default '{}',
  character_focus     text[] not null default '{}',
  primary_route_id    uuid not null references question_routes(id),
  secondary_route_id  uuid references question_routes(id),
  relevant_aos        ao_code[] not null,
  created_at          timestamptz not null default now(),
  -- AO rule enforcement at the schema level
  constraint hamlet_excludes_ao4 check (
    play_code <> 'hamlet' or not ('AO4' = any(relevant_aos))
  ),
  constraint duchess_includes_ao4 check (
    play_code <> 'duchess_of_malfi' or 'AO4' = any(relevant_aos)
  )
);

-- Path options (exactly 4 per question — enforced by trigger)
create table essay_path_options (
  id                   uuid primary key default gen_random_uuid(),
  question_id          uuid not null references essay_builder_questions(id) on delete cascade,
  path_label           text not null,
  route_id             uuid references question_routes(id),       -- nullable for exam_risk
  classification       path_classification not null,
  thesis_direction     text not null,
  ao_strengths         ao_code[] not null default '{}',
  ao_weaknesses        ao_code[] not null default '{}',
  why_attractive       text not null,
  feedback_id          uuid not null references essay_path_feedback(id),
  unlocks_skeleton     boolean not null,
  display_order        int,                                       -- nullable; UI randomises
  created_at           timestamptz not null default now()
);

-- Feedback content
create table essay_path_feedback (
  id              uuid primary key default gen_random_uuid(),
  classification  path_classification not null,
  headline        text not null,
  body_sections   jsonb not null,                                 -- structured per §4
  tone_register   tone_register not null default 'firm_instructive',
  created_at      timestamptz not null default now()
);

-- Essay skeleton (1:1 with correct/partial paths)
create table essay_skeletons (
  id              uuid primary key default gen_random_uuid(),
  path_option_id  uuid not null unique references essay_path_options(id) on delete cascade,
  thesis          text not null,
  paragraphs      jsonb not null,                                 -- array of paragraph objects
  conclusion      jsonb not null,
  upgrade_banner  text,                                           -- non-null when path is partial
  created_at      timestamptz not null default now()
);

-- Student attempts
create table essay_builder_attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  question_id       uuid not null references essay_builder_questions(id),
  play_code         play_code not null,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  final_outcome     path_classification,                          -- set on completion
  unlocked_skeleton boolean not null default false
);

-- Each path the student picked within an attempt
create table essay_builder_attempt_choices (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references essay_builder_attempts(id) on delete cascade,
  path_option_id  uuid not null references essay_path_options(id),
  retry_number    int not null,                                   -- 1, 2, 3 …
  chosen_at       timestamptz not null default now(),
  unique (attempt_id, retry_number)
);

-- Trigger: enforce exactly 4 path options per question on insert/update
-- Trigger: enforce one and only one classification='correct' per question
-- (SQL omitted here — implementation in §13)
```

### 8.2 RLS Policies

```sql
alter table essay_builder_attempts enable row level security;
alter table essay_builder_attempt_choices enable row level security;

-- Students see only their own attempts
create policy "students read own attempts"
  on essay_builder_attempts for select using (auth.uid() = user_id);
create policy "students insert own attempts"
  on essay_builder_attempts for insert with check (auth.uid() = user_id);
create policy "students update own attempts"
  on essay_builder_attempts for update using (auth.uid() = user_id);

-- Choices inherit attempt ownership
create policy "students read own choices"
  on essay_builder_attempt_choices for select using (
    exists (select 1 from essay_builder_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );
create policy "students insert own choices"
  on essay_builder_attempt_choices for insert with check (
    exists (select 1 from essay_builder_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );

-- Question/path/feedback/skeleton tables: read-only for authenticated users
-- (no RLS write policy — seeded via service role only)
```

### 8.3 Indexes

```sql
create index on essay_builder_questions (play_code);
create index on essay_path_options (question_id);
create index on essay_builder_attempts (user_id, started_at desc);
create index on essay_builder_attempt_choices (attempt_id, retry_number);
```

---

## 9. TypeScript Types

```ts
// src/types/essayBuilder.ts

export type AOCode = 'AO1' | 'AO2' | 'AO3' | 'AO4' | 'AO5';
export type PlayCode = 'hamlet' | 'duchess_of_malfi';
export type PathClassification = 'correct' | 'partial' | 'wrong' | 'exam_risk';
export type ToneRegister = 'firm_instructive';

export interface EssayBuilderQuestion {
  id: string;
  play_code: PlayCode;
  question_text: string;
  question_year: number | null;
  theme_tags: string[];
  character_focus: string[];
  primary_route_id: string;
  secondary_route_id: string | null;
  relevant_aos: AOCode[];
  created_at: string;
}

export interface EssayPathOption {
  id: string;
  question_id: string;
  path_label: string;
  route_id: string | null;
  classification: PathClassification;
  thesis_direction: string;
  ao_strengths: AOCode[];
  ao_weaknesses: AOCode[];
  why_attractive: string;
  feedback_id: string;
  unlocks_skeleton: boolean;
  display_order: number | null;
}

export interface EssayPathFeedback {
  id: string;
  classification: PathClassification;
  headline: string;
  body_sections: FeedbackBody;
  tone_register: ToneRegister;
}

export type FeedbackBody =
  | CorrectFeedback
  | PartialFeedback
  | WrongFeedback
  | ExamRiskFeedback;

export interface CorrectFeedback {
  why_it_fits: string;
  ao_integration: string;
}
export interface PartialFeedback {
  what_it_misses: string;
  upgrade_advice: string;
  ao_diagnosis: { ao: AOCode; note: string }[];
}
export interface WrongFeedback {
  mismatch: string;
  what_it_becomes: string;
  ao_diagnosis: { ao: AOCode; note: string };
  redirect: string;
}
export interface ExamRiskFeedback {
  exam_danger: string;
  ao_problem: { ao: AOCode; descriptor: string };
  what_it_becomes: string;
  redirect: string;
}

export interface EssaySkeletonParagraph {
  function: string;
  key_quote_ids: string[];
  ao2_methods: string[];
  ao3_anchor: string;
  ao5_debate: string;
  ao4_embed: string | null;     // null for Hamlet, required string for Duchess
}

export interface EssaySkeleton {
  id: string;
  path_option_id: string;
  thesis: string;
  paragraphs: EssaySkeletonParagraph[];
  conclusion: { function: string; dialectical_move: string };
  upgrade_banner: string | null;
}

export interface EssayBuilderAttempt {
  id: string;
  user_id: string;
  question_id: string;
  play_code: PlayCode;
  started_at: string;
  completed_at: string | null;
  final_outcome: PathClassification | null;
  unlocked_skeleton: boolean;
}

export interface EssayBuilderAttemptChoice {
  id: string;
  attempt_id: string;
  path_option_id: string;
  retry_number: number;
  chosen_at: string;
}

export interface EssayBuilderResult {
  attempt: EssayBuilderAttempt;
  choices: EssayBuilderAttemptChoice[];
  finalPath: EssayPathOption | null;
  skeleton: EssaySkeleton | null;
}
```

---

## 10. UI Specification

### 10.1 Pages

| Route | Page | Component |
|-------|------|-----------|
| `/essay-builder` | Text + question selector | `EssayBuilderHomePage` |
| `/essay-builder/:attemptId` | Path selection | `PathSelectionPage` |
| `/essay-builder/:attemptId/feedback` | Feedback view | `FeedbackPage` |
| `/essay-builder/:attemptId/skeleton` | Skeleton (locked behind correct/partial) | `SkeletonPage` |

### 10.2 Component states

**Every data-bound component must handle:**

- `loading` — skeleton shimmer
- `error` — inline error card with retry
- `empty` — empty-state copy with CTA (e.g. "No questions seeded yet for this text")
- `success` — primary content

### 10.3 Path selection screen

- Question card at top: question text, year (if past paper), play badge.
- Four path cards in a 2×2 grid (desktop) / vertical stack (mobile).
- Each path card shows **only**: `path_label` + `thesis_direction`.
- Path cards do **not** show classification, AO strengths/weaknesses, or "why attractive" before selection.
- Path order is randomised per attempt (seeded by `attempt.id` so refresh is stable).
- Single-select, with confirm dialog on first attempt of session ("Once you choose, the app will explain why each path works or fails. Ready?").

### 10.4 Feedback screen

- Top: selected path card (now showing classification chip)
- Middle: feedback panel rendered from `body_sections` per §4
- Bottom: action buttons
  - `correct` → "Unlock essay skeleton"
  - `partial` → "Unlock skeleton with upgrade notes" + "See stronger route"
  - `wrong` / `exam_risk` (1st attempt) → "Try again"
  - `wrong` / `exam_risk` (2nd+ attempt) → "Try again" + "Compare with correct route"

### 10.5 Skeleton screen

- Thesis (large, top)
- Paragraph cards (collapsible) — each shows function, quote chips, AO method tags, AO3 anchor, AO5 debate
- For Duchess: AO4 embed appears **inline within the relevant paragraph card**, visually flagged with an `AO4` chip — never as a standalone card or footer
- Conclusion card
- Upgrade banner at top if path was `partial`
- Action: "Save plan" (writes to existing `essay_plans` table)

---

## 11. Worked Example — Hamlet

**Question:** *"Explore Shakespeare's presentation of corruption in Hamlet."*

**Question metadata:**
- `play_code`: `hamlet`
- `theme_tags`: `['corruption', 'state_decay', 'moral_disease']`
- `character_focus`: `['Claudius', 'Hamlet', 'Denmark_as_state']`
- `primary_route_id`: `H003` (Corruption as somatic and political contagion)
- `secondary_route_id`: `H001` (Corruption as moral interiority — the diseased conscience)
- `relevant_aos`: `['AO1', 'AO2', 'AO3', 'AO5']` — **AO4 excluded**

### Path A — `correct`

- **Label:** *Corruption as somatic and political contagion*
- **Route:** H003
- **Thesis direction:** Shakespeare presents corruption as a contagion that crosses the bodily and the political — Denmark is a "rank" body whose moral sickness manifests as state decay.
- **AO strengths:** AO2 (disease imagery, somatic metaphor), AO3 (humoral theory, Reformation political theology), AO5 (Greenblatt on purgatory and political theology; Bradley on moral atmosphere)
- **AO weaknesses:** Risk of over-loading AO3 if the humoral context is dumped not integrated
- **Why attractive:** Genuinely the strongest reading — combines AO2 method work with AO3 anchoring
- **Feedback (selected):**
  > **Headline:** This route directly answers the question.
  > **Why it fits:** "Corruption" is interpreted at both the personal and political register, which the question's open verb "explore" invites. The somatic-political bridge gives you a thesis that controls AO2, AO3, and AO5 simultaneously.
  > **AO integration:** AO2 imagery (the "unweeded garden", "something is rotten") becomes the evidence for AO3 (humoral and Reformation political-theology contexts), which a Greenblatt position on purgatorial residue then complicates at AO5. The AOs interlock instead of taking turns.

### Path B — `partial`

- **Label:** *Claudius as the source of corruption*
- **Route:** H001
- **Thesis direction:** Corruption in Hamlet originates in Claudius's regicide and spreads outward through the court.
- **AO strengths:** AO1 (clear character focus), AO2 (Claudius's rhetoric of euphemism)
- **AO weaknesses:** AO3 narrows to Renaissance kingship without humoral/theological depth; AO5 limited to character-criticism positions
- **Why attractive:** Easy structural spine — every paragraph hangs off Claudius
- **Feedback (selected):**
  > **Headline:** This route is relevant but narrow.
  > **What it misses:** "Corruption" in the question is not character-bounded. Locating it solely in Claudius makes Denmark an effect rather than a body — you lose the political-theological register that Level 5 answers reach.
  > **Upgrade advice:** Keep your Claudius work, but reframe him as the *first symptom* rather than the *origin*, so corruption is presented as a condition Denmark already had. This pulls AO3 from "Renaissance kingship" up to "humoral and Reformation political theology", and gives AO5 (Greenblatt) somewhere to land.
  > **AO diagnosis:** AO3 — under-loaded. AO5 — narrowed to character criticism.

### Path C — `wrong`

- **Label:** *Hamlet's revenge as a corrupting force*
- **Route:** H006 (revenge route — wrong here)
- **Thesis direction:** Hamlet's pursuit of revenge is itself the corrupting agent in the play.
- **AO strengths:** AO2 (soliloquy, revenge tragedy conventions), AO5 (Eliot, Bradley)
- **AO weaknesses:** Answers the wrong question — this is a revenge-genre essay, not a corruption essay
- **Why attractive:** Revenge is the most-revised theme; students reach for it under pressure
- **Feedback (selected):**
  > **Headline:** This route doesn't answer the question precisely.
  > **Mismatch:** The question asks about *corruption* — a state/condition. This route argues *revenge* — an action. They are adjacent but not equivalent: revenge is one of corruption's symptoms, not its substance.
  > **What it would become:** An essay answering "How does Shakespeare present revenge in Hamlet?" — a 2024 question, not this one.
  > **AO diagnosis:** AO1 — would lose marks for not addressing the question's actual concept; the strongest AO2/AO5 work cannot rescue an off-question AO1.
  > **Redirect:** Keep your soliloquy work and your Eliot position, but reframe: revenge is the *evidence* of Denmark's corruption, not the *cause*. That single pivot puts you back on the question.

### Path D — `exam_risk`

- **Label:** *Tracing corruption from start to end of the play*
- **Route:** none (no valid interpretive route — this is a structural failure)
- **Thesis direction:** This essay will trace how corruption develops act by act through the play.
- **AO strengths:** AO1 (textual coverage)
- **AO weaknesses:** AO2 reduced to feature-spotting, AO3/AO5 squeezed out by narrative load
- **Why attractive:** Feels safe — covers the whole text, no thesis risk
- **Feedback (selected):**
  > **Headline:** This route would produce a low-band answer.
  > **Exam danger:** Narrative summary disguised as analysis. Act-by-act tracing forces you to retell the plot, which the mark scheme penalises explicitly.
  > **AO problem:** **AO1 — too vague.** Mark scheme language: "general comments rather than controlled argument." You will hit Level 2 even if your AO2 work is strong elsewhere, because the structure prevents argument.
  > **What it would become:** A Level 2–3 plot summary with critic citations bolted on at the end of each section.
  > **Redirect:** Replace the chronological spine with a *conceptual* spine. Three or four ideas about corruption (e.g. somatic, political, theological), each illustrated with non-chronological textual moments.

---

## 12. Worked Example — The Duchess of Malfi

**Question:** *"Explore how Webster presents control in The Duchess of Malfi."*

**Question metadata:**
- `play_code`: `duchess_of_malfi`
- `theme_tags`: `['control', 'surveillance', 'patriarchal_power', 'female_agency']`
- `character_focus`: `['Ferdinand', 'the_Cardinal', 'Bosola', 'Duchess']`
- `primary_route_id`: `D004` (Control as patriarchal-theological surveillance of the female body)
- `secondary_route_id`: `D002` (Control as Jacobean court instrument)
- `relevant_aos`: `['AO1', 'AO2', 'AO3', 'AO4', 'AO5']` — **AO4 included**

### Path A — `correct`

- **Label:** *Control as patriarchal-theological surveillance of the female body*
- **Route:** D004
- **Thesis direction:** Webster presents control as a surveillance apparatus that operates on the female body through patriarchal-theological licence — most violently in Ferdinand, most coldly in the Cardinal.
- **AO strengths:** AO2 (the dead-hand scene, Ferdinand's lycanthropy, light/dark stagecraft), AO3 (Jacobean anti-court satire, Calvinist surveillance of conscience), **AO4 (parallel with Hamlet's surveillance through Polonius and the play-within-a-play)**, AO5 (Belsey on closure of female speech; Aughterson on Webster's stagecraft)
- **AO weaknesses:** Risk of AO4 becoming bolt-on if Hamlet comparison is saved for the end
- **Why attractive:** The strongest reading — gives AO4 something genuinely comparable to do
- **Feedback (selected):**
  > **Headline:** This route directly answers the question.
  > **Why it fits:** "Control" reads simultaneously as *political* (court), *bodily* (the Duchess), and *epistemological* (what characters are allowed to know). The patriarchal-theological framing holds all three together.
  > **AO integration:** Ferdinand's lycanthropy (AO2) is read through Calvinist surveillance theology (AO3), and the dead-hand scene's stagecraft (AO2) is held alongside Hamlet's play-within-a-play (AO4) as a comparable instrument of forced witness. Belsey's closure-of-speech position (AO5) sharpens the gendered dimension. The AOs operate in the same paragraph, not in turns.

### Path B — `partial`

- **Label:** *Control through the Jacobean court machine*
- **Route:** D002
- **Thesis direction:** Webster presents control as the operation of a corrupt Jacobean court, with Bosola as its principal instrument.
- **AO strengths:** AO2 (Bosola's malcontent rhetoric), AO3 (Jacobean court satire, anti-Spanish sentiment), AO5 (Bradbrook on revenge tragedy machinery)
- **AO weaknesses:** AO4 has nothing precise to grip — Hamlet's court is structurally different; the comparison risks becoming generic
- **Why attractive:** Strong AO3 spine; matches a familiar revision route
- **Feedback (selected):**
  > **Headline:** This route is relevant but narrow.
  > **What it misses:** Locating control in the *court* misses the *body* — and Webster's most distinctive presentation of control is bodily and gendered, not institutional.
  > **Upgrade advice:** Keep your Bosola material, but read him as the *enforcement arm* of a control system whose target is specifically the Duchess's body and speech. That gives AO4 traction (the Polonius-as-enforcer parallel becomes specific, not general) and lets Belsey land at AO5.
  > **AO diagnosis:** AO4 — the Hamlet comparison becomes generic ("both have corrupt courts") rather than specific. AO5 — Belsey's gender-focused position is hard to integrate without the bodily reading.

### Path C — `wrong`

- **Label:** *The Duchess's resistance to control*
- **Route:** D006 (resistance/agency route — wrong as primary lens here)
- **Thesis direction:** The play centres on the Duchess's defiance of patriarchal control through her secret marriage and her death.
- **AO strengths:** AO2 ("I am Duchess of Malfi still"), AO5 (feminist criticism: Jankowski, Belsey)
- **AO weaknesses:** Inverts the question — argues about *resistance to* control, not *presentation of* control
- **Why attractive:** Most-revised feminist reading; emotionally compelling
- **Feedback (selected):**
  > **Headline:** This route doesn't answer the question precisely.
  > **Mismatch:** The question asks how Webster presents *control*. This route argues how the Duchess *escapes* control — adjacent, but inverted. The examiner is tracking your account of the apparatus, not your account of the resistance to it.
  > **What it would become:** A 2022-style "agency and resistance" essay — a strong essay for a different question.
  > **AO diagnosis:** AO1 — the thesis answers the inverse of the question. Even with strong AO2 and AO5, the AO1 framing would cap the answer.
  > **Redirect:** Use the Duchess's defiance as your *evidence* of control's intensity (the apparatus has to escalate to madness, dead hands, and execution to break her), not as your thesis. The route then becomes Path A.

### Path D — `exam_risk`

- **Label:** *Webster's Catholic anxieties as the source of control*
- **Route:** none (AO3 dump disguised as a route)
- **Thesis direction:** Webster's anti-Catholic anxieties shape every depiction of control in the play.
- **AO strengths:** AO3 (post-Reformation anti-Catholic context)
- **AO weaknesses:** AO2 collapses into illustration of context; AO4 becomes "Hamlet also has a Catholic context" bolt-on; AO5 reduced to context-aligned critics
- **Why attractive:** Sounds sophisticated; rewards revision of religious context
- **Feedback (selected):**
  > **Headline:** This route would produce a low-band answer.
  > **Exam danger:** AO3 dumping. The essay becomes an account of Webster's biographical-confessional context with the play as a footnote — the inverse of what AO3 asks for.
  > **AO problem:** **AO3 — bolted on, foregrounded over text.** Mark scheme language: "context dominates rather than illuminates." Worse, **AO4 collapses to a thematic gesture** ("Hamlet also engages with religion"), which is the exact bolt-on Edexcel penalises.
  > **What it would become:** A Level 2–3 context essay with the text used as evidence for context, rather than context used to illuminate the text.
  > **Redirect:** Move the Catholic context *inside* a paragraph on the Cardinal's stagecraft (AO2 first, AO3 second), and let AO4 do its work on a stagecraft parallel (e.g. Hamlet's confessional scene with Claudius). Context illuminates, not dominates.

---

## 13. MVP Technical Plan

### 13.1 Build order

1. **Migration** (`supabase/migrations/NNNN_essay_builder.sql`)
   - All enums, tables, FKs, RLS, indexes, and the two enforcement triggers
2. **Triggers** for: exactly-4-paths-per-question, exactly-1-correct-per-question, AO4-embedding-validator on `essay_skeletons.paragraphs` for Duchess
3. **Seed** the two worked examples — full path options + feedback + skeletons
4. **TypeScript types** — `src/types/essayBuilder.ts`
5. **Data hooks** — `useEssayBuilderQuestions`, `useStartAttempt`, `useChoosePath`, `useSkeleton` (TanStack Query)
6. **Pages** in order: home → path selection → feedback → skeleton
7. **Attempt logging** — write on every choice; never delete
8. **QA pass** with 4 AO embedding tests (§13.4)

### 13.2 Seed data minimum (MVP)

| Item | Hamlet | Duchess |
|------|--------|---------|
| Questions | 1 (corruption) | 1 (control) |
| Path options | 4 | 4 |
| Feedback rows | 4 | 4 |
| Skeletons | 2 (correct + partial) | 2 (correct + partial) |

This is enough to prove the loop end-to-end. Scale to 6–8 questions per text after the loop is verified.

### 13.3 Route matching (MVP)

For MVP, route matching is **trivial**: the question selector returns a `question_id`, which has pre-seeded `primary_route_id` and `secondary_route_id`. No NLP, no inference. Free-text question entry is **out of scope for v1**.

### 13.4 AO embedding validation tests

```ts
// Vitest — run on every CI build
describe('Essay Builder AO rules', () => {
  it('Hamlet skeletons must not contain AO4 embed strings', async () => {
    const hamletSkeletons = await fetchSkeletonsByPlay('hamlet');
    for (const s of hamletSkeletons) {
      for (const p of s.paragraphs) expect(p.ao4_embed).toBeNull();
    }
  });

  it('Duchess skeletons must contain at least one AO4 embed', async () => {
    const duchessSkeletons = await fetchSkeletonsByPlay('duchess_of_malfi');
    for (const s of duchessSkeletons) {
      const embeds = s.paragraphs.filter(p => p.ao4_embed && p.ao4_embed.length > 0);
      expect(embeds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('Duchess skeletons must not contain a standalone AO4 paragraph or footer', async () => {
    const duchessSkeletons = await fetchSkeletonsByPlay('duchess_of_malfi');
    for (const s of duchessSkeletons) {
      const standaloneAO4 = s.paragraphs.find(p =>
        p.function.toLowerCase().startsWith('ao4') ||
        p.function.toLowerCase().includes('comparison paragraph')
      );
      expect(standaloneAO4).toBeUndefined();
    }
  });

  it('Each question has exactly one correct path', async () => {
    const questions = await fetchAllQuestions();
    for (const q of questions) {
      const paths = await fetchPathsByQuestion(q.id);
      const correct = paths.filter(p => p.classification === 'correct');
      expect(correct.length).toBe(1);
    }
  });
});
```

---

## 14. Definition of Done

The feature ships when **all** of the following are true:

- [ ] Student can authenticate and reach `/essay-builder`
- [ ] At least 1 Hamlet question and 1 Duchess question are seeded with full path/feedback/skeleton data
- [ ] Path selection screen displays 4 randomised path cards with thesis directions only
- [ ] Selecting a `correct` path unlocks a full skeleton
- [ ] Selecting a `partial` path unlocks a skeleton with upgrade banner
- [ ] Selecting a `wrong` or `exam_risk` path produces feedback with all five required sections (§7) and does **not** unlock the skeleton
- [ ] After 2 wrong attempts, "Compare with correct route" appears
- [ ] **Hamlet skeletons contain zero AO4 strings** (verified by automated test)
- [ ] **Duchess skeletons contain AO4 embedded inside paragraph functions, not as standalone items** (verified by automated test)
- [ ] Each question has exactly 1 `correct` path and exactly 4 paths total (DB-enforced)
- [ ] All student attempts and choices are persisted with `retry_number`
- [ ] RLS confirmed: a student cannot read another student's attempts
- [ ] Empty/loading/error states render on every data-bound page
- [ ] CI passes the four AO embedding tests in §13.4

---

## 15. Question Router Integration Contract

When the Stage 2 Question Router MVP stabilises, Essay Builder integrates via the following **read-only contract**:

```ts
// src/services/questionRouter.ts — to be implemented in Stage 2
interface RouterResolution {
  primary_route_id: string;
  secondary_route_id: string | null;
  theme_tags: string[];
  character_focus: string[];
  relevant_aos: AOCode[];
  confidence: number;       // 0–1
}

export function resolveQuestion(
  play_code: PlayCode,
  question_text: string
): Promise<RouterResolution>;
```

**Integration points:**

- v1 (preset questions only): the router is **not called**. `essay_builder_questions` rows store `primary_route_id` directly.
- v2 (free-text): when a student types a custom question, call `resolveQuestion`. If `confidence >= 0.7`, write a new `essay_builder_questions` row server-side with the resolved metadata. If lower, surface a clarification UI ("Did you mean a question about X or Y?"). This avoids polluting the question bank with low-confidence routes.

**No router changes required for Essay Builder v1 ship.** This section exists so the v2 free-text path is forward-compatible.

---

## 16. Out of Scope (v1)

Explicitly deferred to keep the MVP shippable:

- Free-text custom questions (covered above — needs Stage 2 router)
- AI-generated feedback (the seed feedback is hand-written per path; LLM generation comes after the `tone_register` enum is exercised)
- Comparative drills across two questions
- Spaced-repetition scheduling of question replays
- Teacher dashboard / class analytics
- Mobile-native gestures (web-responsive only for v1)

---

## 17. Open Questions for the Build

Before starting the migration, confirm:

1. **Does `question_routes` table exist yet, or is it part of the same migration?** If it doesn't exist, the FKs in §8.1 will fail. Either ship `question_routes` as a sibling migration or stub it with a minimal `(id, code, play_code, summary)` table now.
2. **Are H001–H008 / D001–D008 finalised?** If route IDs are still being authored, seed the routes table with placeholders that match the seed paths.
3. **`essay_plans` integration on save:** the existing `essay_plans` table — is it shaped to receive a serialised `EssaySkeleton`, or does it need a `source: 'essay_builder'` discriminator column? Confirm before wiring "Save plan."
4. **Auth flow:** does the existing protected-route logic redirect unauthenticated users to `/login`, or does it render a public-friendly placeholder? Essay Builder follows whichever pattern is established.

---

*End of spec v2.*

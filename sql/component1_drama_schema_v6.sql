-- ============================================================================
-- Component 1 Drama — Complete Schema v6
-- Supabase / Postgres 15+
-- Scope: Pearson Edexcel A Level English Literature 9ET0/01
-- Texts: Hamlet and The Duchess of Malfi
--
-- This is a FULL standalone schema — not a patch. It may be applied to a
-- fresh database or used as the canonical reference for the Component 1
-- Drama PWA.
--
-- v6 Changelog (relative to v4 + v5 combined):
--
--   === NORMALISATION (from second-pass review integration) ===
--   R1.  theme_guidance — route summaries and per-AO/per-text guidance
--        extracted from themes into a dedicated child table. themes now
--        holds taxonomy only.
--   R2.  user_essay_attempt_ao_scores — AO-specific feedback normalised
--        out of user_essay_attempts into a proper bridge table, replacing
--        five fixed ao*_feedback columns.
--   R3.  vocabulary_theme_links — new junction table connecting vocabulary
--        terms to themes (replaces the implicit text-only relationship).
--   R4.  exam_question_guidance — separates scaffolded teaching content
--        (paragraph routes, AO paths) from exam question metadata.
--   R5.  paragraph_routes.paragraph_sequence — completes jsonb migration
--        started in v5 (deprecated text column dropped).
--   R6.  method_chains.theme_link — completes FK migration started in v5
--        (deprecated text column dropped).
--
--   === NEW CONSTRAINTS & INDEXES ===
--   C1.  theme_theses.thesis_text_hash — generated column + unique index
--        to prevent duplicate thesis entries (matches revision_cards and
--        model_paragraphs patterns from v5).
--   C2.  user_card_progress.status — CHECK constraint added.
--   C3.  context_entries.context_type — CHECK constraint added.
--   C4.  Additional reverse indexes on high-frequency FK columns.
--
--   === STRUCTURAL ===
--   S1.  app_user_roles — now part of the canonical schema (previously
--        assumed to exist).
--   S2.  exam_questions, exam_question_theme_links,
--        exam_question_character_links — formally included (previously
--        referenced but not present in the upgrade SQL).
--   S3.  quote_usage_tracking — formally included.
--   S4.  user_learning_analytics — formally included.
--
-- Total tables: 49 (42 content/reference + 7 user-owned)
-- ============================================================================


-- ══════════════════════════════════════════════════════════════════════════
-- 0. EXTENSIONS & ENUMS
-- ══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- Safe enum creation (idempotent).
do $$ begin
  create type section_code as enum ('A_HAMLET', 'B_OTHER_DRAMA');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ao_code as enum ('AO1', 'AO2', 'AO3', 'AO4', 'AO5');
exception when duplicate_object then null; end $$;

do $$ begin
  create type card_type as enum (
    'quote', 'method', 'theme', 'context', 'critic', 'paragraph', 'error'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type difficulty_level as enum ('B', 'A', 'A_STAR');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exam_section as enum ('SECTION_A', 'SECTION_B');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_role as enum ('student', 'teacher', 'content_editor', 'admin');
exception when duplicate_object then null; end $$;


-- ══════════════════════════════════════════════════════════════════════════
-- 1. UTILITY FUNCTIONS
-- ══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at on any table that has the column.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Role-check helpers (used by RLS policies).
create or replace function is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from app_user_roles
    where user_id = (select auth.uid())
      and role in ('admin')
  );
$$;

create or replace function is_content_editor()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from app_user_roles
    where user_id = (select auth.uid())
      and role in ('content_editor', 'admin')
  );
$$;

create or replace function is_teacher()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from app_user_roles
    where user_id = (select auth.uid())
      and role in ('teacher', 'content_editor', 'admin')
  );
$$;


-- ══════════════════════════════════════════════════════════════════════════
-- 2. AUTH & ROLES  [S1]
-- ══════════════════════════════════════════════════════════════════════════

create table if not exists app_user_roles (
  user_id  uuid not null references auth.users(id) on delete cascade,
  role     app_role not null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);


-- ══════════════════════════════════════════════════════════════════════════
-- 3. CORE REFERENCE TABLES
-- ══════════════════════════════════════════════════════════════════════════

-- 3a. Components (exam paper metadata)
create table if not exists components (
  id                 uuid primary key default gen_random_uuid(),
  exam_board         text not null default 'Pearson Edexcel',
  qualification      text not null default 'A Level English Literature',
  specification_code text not null default '9ET0',
  paper_code         text not null,
  title              text not null,
  total_marks        int  not null check (total_marks > 0),
  exam_date          date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (paper_code)
);

-- 3b. Texts (set texts on the paper)
create table if not exists texts (
  id                    uuid primary key default gen_random_uuid(),
  component_id          uuid not null references components(id) on delete cascade,
  short_code            text not null,
  title                 text not null,
  author                text not null,
  section               section_code not null,
  exam_section          exam_section not null,
  marks                 int  not null check (marks > 0),
  edition_note          text,
  line_reference_system text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (component_id, short_code)
);

-- 3c. Acts & scenes
create table if not exists acts_scenes (
  id                   uuid primary key default gen_random_uuid(),
  text_id              uuid not null references texts(id) on delete cascade,
  act_no               int  not null check (act_no between 1 and 5),
  scene_no             int  check (scene_no >= 0),
  scene_label          text not null,
  synopsis             text,
  structural_function  text,
  ao3_context_anchor   text
  -- Unique constraint created as index below (NULLS NOT DISTINCT).
);

create unique index if not exists uq_acts_scenes_composite
  on acts_scenes (text_id, act_no, scene_no)
  nulls not distinct;

-- 3d. Assessment objectives (reference lookup)
create table if not exists assessment_objectives (
  code        ao_code primary key,
  label       text not null,
  description text not null
);

-- 3e. Component ↔ AO weightings
create table if not exists component_ao_weightings (
  id               uuid primary key default gen_random_uuid(),
  component_id     uuid not null references components(id) on delete cascade,
  section          exam_section,
  ao_code          ao_code not null references assessment_objectives(code),
  marks            int,
  weighting_note   text,
  unique (component_id, section, ao_code)
);

-- 3f. Grade level descriptors
create table if not exists grade_level_descriptors (
  id                    uuid primary key default gen_random_uuid(),
  component_id          uuid not null references components(id) on delete cascade,
  section               exam_section,
  ao_code               ao_code references assessment_objectives(code),
  level_no              int  not null check (level_no between 1 and 5),
  grade_band            difficulty_level,
  descriptor            text not null,
  examiner_translation  text,
  success_criteria      text,
  unique (component_id, section, ao_code, level_no)
);

-- 3g. Timing strategies
create table if not exists timing_strategies (
  id                       uuid primary key default gen_random_uuid(),
  component_id             uuid not null references components(id) on delete cascade,
  section                  exam_section not null,
  total_minutes            int not null,
  planning_minutes         int,
  writing_minutes          int,
  checking_minutes         int,
  recommended_paragraphs   int,
  strategy_note            text,
  unique (component_id, section),
  -- v5 C1: minutes sum must not exceed total
  constraint chk_timing_minutes_sum check (
    coalesce(planning_minutes, 0)
    + coalesce(writing_minutes, 0)
    + coalesce(checking_minutes, 0)
    <= total_minutes
  )
);


-- ══════════════════════════════════════════════════════════════════════════
-- 4. THEMES / CHARACTERS / METHODS
-- ══════════════════════════════════════════════════════════════════════════

-- 4a. Themes — TAXONOMY ONLY  [R1: guidance extracted to theme_guidance]
--
-- Review rationale: the v4 themes table mixed taxonomy (theme_code,
-- theme_name) with large blocks of instructional content (core_argument,
-- ao3_context, ao5_debate). Separating them keeps themes slim, reusable,
-- and queryable, while allowing per-text and per-AO guidance rows.
create table if not exists themes (
  id                  uuid primary key default gen_random_uuid(),
  text_id             uuid not null references texts(id) on delete cascade,
  theme_code          text not null,
  theme_name          text not null,
  section_relevance   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (text_id, theme_code)
);

-- 4a-ext. Theme guidance  [R1: new table]
--
-- Holds the instructional / route-summary content that was previously
-- stored directly on the themes row. Each row provides guidance for a
-- specific theme, optionally scoped to a particular AO.
--
-- core_argument, ao3_context, and ao5_debate from v4 themes migrate here
-- as rows with ao_code = NULL, 'AO3', and 'AO5' respectively.
create table if not exists theme_guidance (
  id            uuid primary key default gen_random_uuid(),
  theme_id      uuid not null references themes(id) on delete cascade,
  ao_code       ao_code references assessment_objectives(code),
  guidance_type text not null check (guidance_type in (
    'core_argument', 'context_trigger', 'critical_debate',
    'route_summary', 'exam_warning', 'sentence_stems'
  )),
  content       text not null,
  target_level  difficulty_level,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (theme_id, ao_code, guidance_type, target_level)
);

-- 4b. Characters
create table if not exists characters (
  id                 uuid primary key default gen_random_uuid(),
  text_id            uuid not null references texts(id) on delete cascade,
  name               text not null,
  role_type          text,
  dramatic_function  text,
  key_argument       text,
  trajectory         text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (text_id, name)
);

-- 4b-ext. Character aliases  [from v5]
create table if not exists character_aliases (
  character_id uuid not null references characters(id) on delete cascade,
  alias        text not null,
  alias_type   text not null default 'display'
    check (alias_type in (
      'display', 'edition', 'stage_direction', 'abbreviation', 'alternate_name'
    )),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (character_id, alias),
  constraint chk_character_alias_nonblank check (length(trim(alias)) > 0)
);

create unique index if not exists uq_character_aliases_normalised
  on character_aliases (character_id, lower(trim(alias)));

create index if not exists idx_character_aliases_alias_normalised
  on character_aliases (lower(trim(alias)));

-- 4c. Character ↔ theme links  [from v5]
create table if not exists character_theme_links (
  character_id uuid not null references characters(id) on delete cascade,
  theme_id     uuid not null references themes(id)     on delete cascade,
  relevance_note text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (character_id, theme_id)
);

-- 4d. AO2 methods (dramatic/literary techniques)
create table if not exists ao2_methods (
  id                   uuid primary key default gen_random_uuid(),
  text_id              uuid references texts(id) on delete cascade,
  method_name          text not null,
  method_category      text not null,
  definition           text not null,
  effect_description   text,
  exam_usage_warning   text,
  unique (text_id, method_name),
  -- v5 D1: category constraint
  constraint chk_ao2_method_category check (method_category in (
    'imagery', 'syntax', 'structural', 'rhetorical', 'dramatic',
    'sound', 'lexical', 'narrative', 'staging', 'generic',
    'figurative_language', 'verse_form'
  ))
);

-- 4e. Method chains (AO2 analytical chains: method → word → effect → theme)
--
-- v6 R6: deprecated theme_link text column dropped; theme_id FK is the
-- canonical link. character_id FK added in v5 D3.
create table if not exists method_chains (
  id              uuid primary key default gen_random_uuid(),
  text_id         uuid not null references texts(id) on delete cascade,
  chain_name      text not null,
  method_id       uuid references ao2_methods(id) on delete set null,
  method          text not null,
  word_or_detail  text,
  effect          text not null,
  theme_id        uuid references themes(id) on delete set null,
  character_id    uuid references characters(id) on delete set null,
  model_sentence  text,
  target_level    difficulty_level,
  unique (text_id, chain_name)
);


-- ══════════════════════════════════════════════════════════════════════════
-- 5. QUOTES
-- ══════════════════════════════════════════════════════════════════════════

create table if not exists quotes (
  id                       uuid primary key default gen_random_uuid(),
  text_id                  uuid not null references texts(id) on delete cascade,
  primary_theme_id         uuid references themes(id) on delete set null,
  character_id             uuid references characters(id) on delete set null,
  scene_id                 uuid references acts_scenes(id) on delete set null,
  quote_id                 text not null,   -- human-readable ID e.g. HAM_Q001
  content                  text not null,
  speaker                  text,
  addressee                text,
  act_scene                text,
  line_start               int,
  line_end                 int,
  edition_ref              text,
  dramatic_moment          text,
  structural_function      text,
  exam_sentence            text,
  memorisation_priority    int check (memorisation_priority between 1 and 5),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique (text_id, quote_id)
);

-- 5a. Quote ↔ secondary theme links
create table if not exists quote_secondary_themes (
  quote_id       uuid not null references quotes(id) on delete cascade,
  theme_id       uuid not null references themes(id) on delete cascade,
  relevance_note text,
  primary key (quote_id, theme_id)
);

-- 5b. Quote ↔ AO2 method links
-- v6.1 fix: PRIMARY KEY cannot contain expressions. Use a synthetic id PK
-- plus a unique index on the (quote_id, method_id, coalesce(word_or_detail, ''))
-- shape to preserve the intended dedup semantics.
create table if not exists quote_methods (
  id             uuid primary key default gen_random_uuid(),
  quote_id       uuid not null references quotes(id)      on delete cascade,
  method_id      uuid not null references ao2_methods(id)  on delete cascade,
  word_or_detail text,
  effect         text,
  exam_sentence  text
);
create unique index if not exists uq_quote_methods_composite
  on quote_methods (quote_id, method_id, coalesce(word_or_detail, ''));

-- 5c. Quote ↔ AO links (which AOs a quote is relevant to)
create table if not exists quote_ao_links (
  quote_id uuid not null references quotes(id) on delete cascade,
  ao_code  ao_code not null references assessment_objectives(code),
  note     text not null,
  primary key (quote_id, ao_code)
);


-- ══════════════════════════════════════════════════════════════════════════
-- 6. CONTEXT / CRITICS / AO5
-- ══════════════════════════════════════════════════════════════════════════

-- 6a. Context entries (AO3 contextual knowledge)
create table if not exists context_entries (
  id                uuid primary key default gen_random_uuid(),
  text_id           uuid references texts(id) on delete cascade,
  context_code      text not null,
  context_type      text not null,
  title             text not null,
  explanation       text not null,
  exam_trigger      text,
  danger_of_overuse text,
  unique (text_id, context_code),
  -- v6 C3: constrain context_type values
  constraint chk_context_type check (context_type in (
    'literary', 'historical', 'theatrical', 'religious',
    'political', 'biographical', 'reception', 'philosophical',
    'social', 'generic'
  ))
);

-- 6b. Critics
-- v6.1 fix: table-level UNIQUE cannot contain expressions; use a unique index.
create table if not exists critics (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  school         text,
  core_position  text,
  key_text       text,
  source_note    text
);
create unique index if not exists uq_critics_name_keytext
  on critics (name, coalesce(key_text, ''));

-- 6c. Critic interpretations (AO5 material)
create table if not exists critic_interpretations (
  id                    uuid primary key default gen_random_uuid(),
  critic_id             uuid not null references critics(id) on delete cascade,
  text_id               uuid not null references texts(id) on delete cascade,
  theme_id              uuid references themes(id) on delete set null,
  character_id          uuid references characters(id) on delete set null,
  interpretation        text not null,
  usable_ao5_sentence   text,
  counter_reading       text
);

-- v5 I6: unique composite index
create unique index if not exists uq_critic_interpretations_composite
  on critic_interpretations (critic_id, text_id, theme_id, character_id)
  nulls not distinct;

-- 6d. Character ↔ critic links
create table if not exists character_critics (
  character_id   uuid not null references characters(id) on delete cascade,
  critic_id      uuid not null references critics(id) on delete cascade,
  relevance_note text,
  primary key (character_id, critic_id)
);

-- 6e. AO5 strategies
create table if not exists ao5_strategies (
  id                    uuid primary key default gen_random_uuid(),
  component_id          uuid references components(id) on delete cascade,
  text_id               uuid references texts(id) on delete cascade,
  strategy_name         text not null,
  strategy_description  text not null,
  sentence_stem         text,
  example_application   text,
  target_level          difficulty_level,
  unique (component_id, text_id, strategy_name)
);


-- ══════════════════════════════════════════════════════════════════════════
-- 7. THESIS / PARAGRAPH / ESSAY ENGINE
-- ══════════════════════════════════════════════════════════════════════════

-- 7a. Theme theses (graded thesis statements per theme)
create table if not exists theme_theses (
  id                    uuid primary key default gen_random_uuid(),
  theme_id              uuid not null references themes(id) on delete cascade,
  grade_band            difficulty_level not null,
  thesis_text           text not null,
  ao_focus              ao_code[],
  examiner_commentary   text,
  -- v6 C1: hash-based dedup (matches revision_cards / model_paragraphs pattern)
  thesis_text_hash      text generated always as (md5(thesis_text)) stored,
  unique (theme_id, grade_band, thesis_text_hash)
);

-- 7b. Thesis construction models
create table if not exists thesis_models (
  id              uuid primary key default gen_random_uuid(),
  component_id    uuid references components(id) on delete cascade,
  text_id         uuid references texts(id) on delete cascade,
  section         exam_section not null,
  question_stem   text,
  thesis_model    text not null,
  target_level    difficulty_level,
  ao_focus        ao_code[],
  warning_note    text
);

-- 7c. Essay plans (curated model plans)
create table if not exists essay_plans (
  id                   uuid primary key default gen_random_uuid(),
  text_id              uuid not null references texts(id) on delete cascade,
  theme_id             uuid references themes(id) on delete set null,
  section              exam_section not null,
  question_text        text not null,
  conceptual_thesis    text not null,
  timed_plan           boolean not null default true,
  target_level         difficulty_level,
  plan_minutes         int,
  examiner_rationale   text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 7d. Plan paragraphs (child rows of essay_plans)
create table if not exists plan_paragraphs (
  id                  uuid primary key default gen_random_uuid(),
  essay_plan_id       uuid not null references essay_plans(id) on delete cascade,
  paragraph_no        int  not null check (paragraph_no > 0),
  paragraph_function  text not null,
  topic_sentence      text not null,
  quote_id            uuid references quotes(id) on delete set null,
  ao2_move            text,
  ao3_move            text,
  ao4_move            text,
  ao5_move            text,
  mini_judgement       text,
  unique (essay_plan_id, paragraph_no)
);

-- 7e. Paragraph routes (theme-based essay routes with graded versions)
--
-- v6 R5: paragraph_sequence is now jsonb only — the deprecated text
-- column from v5 has been removed.
create table if not exists paragraph_routes (
  id                              uuid primary key default gen_random_uuid(),
  theme_id                        uuid not null references themes(id) on delete cascade,
  route_name                      text not null,
  question_trigger                text not null,
  recommended_thesis_direction    text,
  paragraph_sequence              jsonb not null,
  target_level                    difficulty_level,
  unique (theme_id, route_name)
);

-- 7f. Model paragraphs (exemplar student-level paragraphs)
create table if not exists model_paragraphs (
  id                    uuid primary key default gen_random_uuid(),
  text_id               uuid not null references texts(id) on delete cascade,
  theme_id              uuid references themes(id) on delete set null,
  question_text         text,
  paragraph_text        text not null,
  ao1_note              text,
  ao2_note              text,
  ao3_note              text,
  ao4_note              text,
  ao5_note              text,
  examiner_commentary   text,
  target_level          difficulty_level,
  -- v5 I8: hash-based dedup
  paragraph_text_hash   text generated always as (md5(paragraph_text)) stored
);

create unique index if not exists uq_model_paragraphs_composite
  on model_paragraphs (text_id, theme_id, paragraph_text_hash)
  nulls not distinct;

-- 7g. Paragraph sentence stems
create table if not exists paragraph_sentence_stems (
  id           uuid primary key default gen_random_uuid(),
  text_id      uuid references texts(id) on delete cascade,
  section      exam_section not null,
  ao_code      ao_code references assessment_objectives(code),
  stem_label   text not null,
  stem_text    text not null,
  usage_note   text,
  target_level difficulty_level
);


-- ══════════════════════════════════════════════════════════════════════════
-- 8. EXAM QUESTIONS  [S2: formally included]
-- ══════════════════════════════════════════════════════════════════════════

create table if not exists exam_questions (
  id                  uuid primary key default gen_random_uuid(),
  component_id        uuid not null references components(id) on delete cascade,
  text_id             uuid references texts(id) on delete set null,
  section             exam_section not null,
  question_text       text not null,
  question_year       int check (question_year between 2000 and 2100),
  question_number     text,
  source              text check (source in ('past_paper', 'specimen', 'prediction', 'custom')),
  -- v5: hash for deduplication
  question_text_hash  text generated always as (md5(question_text)) stored,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index if not exists uq_exam_questions_hash
  on exam_questions (component_id, section, question_text_hash);

-- 8a. Exam question ↔ theme links  [S2]
create table if not exists exam_question_theme_links (
  exam_question_id uuid not null references exam_questions(id) on delete cascade,
  theme_id         uuid not null references themes(id) on delete cascade,
  relevance_note   text,
  primary key (exam_question_id, theme_id)
);

-- 8b. Exam question ↔ character links  [S2]
create table if not exists exam_question_character_links (
  exam_question_id uuid not null references exam_questions(id) on delete cascade,
  character_id     uuid not null references characters(id) on delete cascade,
  relevance_note   text,
  primary key (exam_question_id, character_id)
);

-- 8c. Exam question ↔ context links  [from v5 N3]
create table if not exists exam_question_context_links (
  exam_question_id uuid not null references exam_questions(id) on delete cascade,
  context_entry_id uuid not null references context_entries(id) on delete cascade,
  relevance_strength int check (relevance_strength between 1 and 5),
  routing_note     text,
  primary key (exam_question_id, context_entry_id)
);

-- 8d. Exam question guidance  [R4: new table]
--
-- Review rationale: questions in the review were carrying both metadata
-- and full instructional answer-plan templates in paragraph route fields.
-- This table separates scaffolded teaching content from question identity,
-- keeping exam_questions queryable and lightweight.
create table if not exists exam_question_guidance (
  exam_question_id  uuid primary key references exam_questions(id) on delete cascade,
  best_thesis_direction  text,
  intro_route            text,
  paragraph_1_route      text,
  paragraph_2_route      text,
  paragraph_3_route      text,
  paragraph_4_route      text,
  counter_argument_route text,
  conclusion_route       text,
  ao1_strategy           text,
  ao2_primary_path       text,
  ao3_primary_path       text,
  ao4_primary_path       text,
  ao5_primary_path       text,
  common_trap            text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);


-- ══════════════════════════════════════════════════════════════════════════
-- 9. STUDENT-FACING RESOURCE OBJECTS
-- ══════════════════════════════════════════════════════════════════════════

-- 9a. Revision cards (spaced-repetition content)
create table if not exists revision_cards (
  id           uuid primary key default gen_random_uuid(),
  text_id      uuid references texts(id) on delete cascade,
  theme_id     uuid references themes(id) on delete set null,
  quote_id     uuid references quotes(id) on delete set null,
  card_type    card_type not null,
  ao_focus     ao_code,
  front_prompt text not null,
  back_content text not null,
  difficulty   difficulty_level,
  created_at   timestamptz not null default now(),
  -- v5 I7: hash-based dedup
  front_prompt_hash text generated always as (md5(front_prompt)) stored
);

create unique index if not exists uq_revision_cards_composite
  on revision_cards (text_id, card_type, front_prompt_hash)
  nulls not distinct;

-- 9b. Vocabulary terms
create table if not exists vocabulary_terms (
  id                  uuid primary key default gen_random_uuid(),
  text_id             uuid references texts(id) on delete cascade,
  term                text not null,
  definition          text not null,
  usage_in_analysis   text,
  ao_relevance        ao_code[],
  target_level        difficulty_level,
  unique (text_id, term)
);

-- 9b-ext. Vocabulary ↔ theme links  [R3: new junction table]
--
-- Review rationale: vocabulary terms were only connected to texts, with
-- no structured relationship to themes. This junction table enables
-- querying "which analytical terms are most useful for theme X?" —
-- a key revision workflow.
create table if not exists vocabulary_theme_links (
  term_id  uuid not null references vocabulary_terms(id) on delete cascade,
  theme_id uuid not null references themes(id) on delete cascade,
  usage_note text,
  primary key (term_id, theme_id)
);

-- 9c. Big idea panels
create table if not exists big_idea_panels (
  id            uuid primary key default gen_random_uuid(),
  text_id       uuid not null references texts(id) on delete cascade,
  theme_id      uuid references themes(id) on delete set null,
  title         text not null,
  big_idea      text not null,
  why_it_matters text,
  grade_stretch text
);

-- 9d. Insight callouts
create table if not exists insight_callouts (
  id            uuid primary key default gen_random_uuid(),
  text_id       uuid not null references texts(id) on delete cascade,
  theme_id      uuid references themes(id) on delete set null,
  quote_id      uuid references quotes(id) on delete set null,
  callout_type  text not null,
  insight_text  text not null,
  exam_use      text
);

-- 9e. Common errors
create table if not exists common_errors (
  id                           uuid primary key default gen_random_uuid(),
  component_id                 uuid references components(id) on delete cascade,
  text_id                      uuid references texts(id) on delete cascade,
  section                      exam_section,
  ao_code                      ao_code references assessment_objectives(code),
  error_name                   text not null,
  error_description            text not null,
  symptom_in_student_writing   text,
  correction_strategy          text not null,
  model_fix_sentence           text,
  severity                     int check (severity between 1 and 5)
);


-- ══════════════════════════════════════════════════════════════════════════
-- 10. USER PROGRESS & LEARNING
-- ══════════════════════════════════════════════════════════════════════════

-- 10a. User card progress (spaced repetition state)
create table if not exists user_card_progress (
  user_id            uuid not null references auth.users(id) on delete cascade,
  revision_card_id   uuid not null references revision_cards(id) on delete cascade,
  status             text not null default 'new',
  confidence         int  check (confidence between 1 and 5),
  last_reviewed_at   timestamptz,
  next_review_at     timestamptz,
  primary key (user_id, revision_card_id),
  -- v6 C2: constrain card status
  constraint chk_card_status check (status in (
    'new', 'learning', 'reviewing', 'mastered'
  ))
);

-- 10b. User quote bookmarks
create table if not exists user_quote_bookmarks (
  user_id    uuid not null references auth.users(id) on delete cascade,
  quote_id   uuid not null references quotes(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now(),
  primary key (user_id, quote_id)
);

-- 10c. User essay attempts
--
-- v6 R2: AO-specific feedback columns (ao1_feedback … ao5_feedback)
-- removed and normalised into user_essay_attempt_ao_scores below.
-- This keeps the attempt row focused on submission metadata.
create table if not exists user_essay_attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  essay_plan_id     uuid references essay_plans(id) on delete set null,
  exam_question_id  uuid references exam_questions(id) on delete set null,
  question_text     text not null,
  response_text     text,
  self_mark_level   int  check (self_mark_level between 1 and 5),
  teacher_mark      int,
  overall_feedback  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 10c-ext. Essay attempt AO scores  [R2: new table]
--
-- Review rationale: five fixed ao*_feedback columns on user_essay_attempts
-- meant every query that needed AO-level data had to handle all five
-- columns. This normalised structure is easier to aggregate, filter, and
-- extend (e.g. if rubric versions change or AO4 is excluded for a section).
create table if not exists user_essay_attempt_ao_scores (
  attempt_id uuid not null references user_essay_attempts(id) on delete cascade,
  ao_code    ao_code not null references assessment_objectives(code),
  score      numeric(5,2),
  feedback   text,
  primary key (attempt_id, ao_code)
);

-- 10d. Quote usage tracking in essay plans  [S3: formally included]
create table if not exists quote_usage_tracking (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  essay_plan_id  uuid not null references essay_plans(id) on delete cascade,
  quote_id       uuid not null references quotes(id) on delete cascade,
  paragraph_no   int not null check (paragraph_no > 0),
  usage_note     text,
  created_at     timestamptz not null default now(),
  unique (essay_plan_id, quote_id, paragraph_no)
);

-- 10e. Learning sessions  [from v5 N2]
create table if not exists learning_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  text_id      uuid references texts(id) on delete set null,
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  session_type text not null default 'revision'
    check (session_type in (
      'revision', 'practice_exam', 'essay_writing', 'quote_drill', 'free_study'
    )),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- v5 P5: time ordering
  constraint chk_learning_sessions_time_order
    check (ended_at is null or ended_at >= started_at)
);

-- 10f. User learning analytics  [S4: formally included]
create table if not exists user_learning_analytics (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  learning_session_id  uuid references learning_sessions(id) on delete set null,
  metric_type          text not null check (metric_type in (
    'quotes_reviewed', 'cards_completed', 'essays_attempted',
    'time_spent_minutes', 'themes_explored', 'methods_practiced'
  )),
  metric_value         numeric not null,
  recorded_at          timestamptz not null default now()
);


-- ══════════════════════════════════════════════════════════════════════════
-- 11. DATA INTEGRITY TRIGGERS
-- ══════════════════════════════════════════════════════════════════════════

-- 11a. Quote speaker ↔ character_id consistency  [from v5 I1b]
create or replace function enforce_quote_speaker_character_consistency()
returns trigger language plpgsql as $$
declare
  v_char_name text;
  v_has_match boolean;
begin
  if new.character_id is not null and new.speaker is not null then
    select name into v_char_name
      from characters
     where id = new.character_id;

    select exists (
      select 1
        from character_aliases ca
       where ca.character_id = new.character_id
         and lower(trim(ca.alias)) = lower(trim(new.speaker))
    ) into v_has_match;

    if not v_has_match
       and (v_char_name is null or lower(trim(new.speaker)) <> lower(trim(v_char_name))) then
      raise exception
        'Quote speaker "%" does not match character "%" or any registered alias (character_id %).',
        new.speaker, coalesce(v_char_name, '[unknown]'), new.character_id;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_quote_speaker_character on quotes;
create trigger trg_quote_speaker_character
  before insert or update on quotes
  for each row execute function enforce_quote_speaker_character_consistency();

-- 11b. Quote act_scene ↔ scene_id consistency  [from v5 I2]
create or replace function enforce_quote_scene_consistency()
returns trigger language plpgsql as $$
declare
  v_act  int;
  v_scene int;
  v_expected text;
begin
  if new.scene_id is not null and new.act_scene is not null then
    select act_no, scene_no
      into v_act, v_scene
      from acts_scenes
     where id = new.scene_id;

    v_expected := case
      when v_scene is null then v_act::text
      else v_act::text || '.' || v_scene::text
    end;

    if trim(new.act_scene) <> v_expected then
      raise exception
        'Quote act_scene "%" does not match scene_id (expected "%" for act %, scene %).',
        new.act_scene, v_expected, v_act, v_scene;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_quote_scene_consistency on quotes;
create trigger trg_quote_scene_consistency
  before insert or update on quotes
  for each row execute function enforce_quote_scene_consistency();

-- 11c. AO4 / AO5 section guards on quote_ao_links  [from v5 I3]
create or replace function enforce_quote_ao_section_rules()
returns trigger language plpgsql as $$
declare
  q_section exam_section;
begin
  select t.exam_section into q_section
    from quotes q
    join texts t on t.id = q.text_id
   where q.id = new.quote_id;

  -- Component 1 Drama does not assess AO4.
  if new.ao_code = 'AO4' then
    raise exception
      'AO4 is not assessed in Component 1 Drama. Quote % belongs to %.',
      new.quote_id, q_section;
  end if;

  -- AO5 is assessed in Section A Shakespeare, but not Section B Other Drama.
  if new.ao_code = 'AO5' and q_section = 'SECTION_B' then
    raise exception
      'AO5 is not assessed in Section B Other Drama. Quote % belongs to %.',
      new.quote_id, q_section;
  end if;

  return new;
end $$;

drop trigger if exists trg_quote_ao_section_rules on quote_ao_links;
create trigger trg_quote_ao_section_rules
  before insert or update on quote_ao_links
  for each row execute function enforce_quote_ao_section_rules();

-- 11d. Quote usage tracking — paragraph_no must exist  [from v5 F4]
create or replace function enforce_quote_usage_paragraph_exists()
returns trigger language plpgsql as $$
begin
  if not exists (
    select 1 from plan_paragraphs pp
     where pp.essay_plan_id = new.essay_plan_id
       and pp.paragraph_no  = new.paragraph_no
  ) then
    raise exception
      'quote_usage_tracking: paragraph_no % does not exist in essay_plan %.',
      new.paragraph_no, new.essay_plan_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_quote_usage_paragraph_exists on quote_usage_tracking;
create trigger trg_quote_usage_paragraph_exists
  before insert or update on quote_usage_tracking
  for each row execute function enforce_quote_usage_paragraph_exists();

-- 11e. Teacher mark ceiling by section  [from v5 I5]
create or replace function enforce_teacher_mark_section_ceiling()
returns trigger language plpgsql as $$
declare
  v_section exam_section;
  v_max_marks int;
begin
  if new.teacher_mark is null then
    return new;
  end if;

  if new.essay_plan_id is not null then
    select section into v_section from essay_plans where id = new.essay_plan_id;
  elsif new.exam_question_id is not null then
    select section into v_section from exam_questions where id = new.exam_question_id;
  end if;

  if v_section is not null then
    v_max_marks := case v_section
      when 'SECTION_A' then 35
      when 'SECTION_B' then 25
    end;

    if new.teacher_mark > v_max_marks then
      raise exception
        'teacher_mark % exceeds maximum % for %.',
        new.teacher_mark, v_max_marks, v_section;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_teacher_mark_section_ceiling on user_essay_attempts;
create trigger trg_teacher_mark_section_ceiling
  before insert or update on user_essay_attempts
  for each row execute function enforce_teacher_mark_section_ceiling();


-- ══════════════════════════════════════════════════════════════════════════
-- 12. UPDATED_AT TRIGGERS (bulk creation)
-- ══════════════════════════════════════════════════════════════════════════

-- Every table with an updated_at column gets the auto-update trigger.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'components', 'texts', 'themes', 'theme_guidance', 'characters',
    'character_aliases', 'character_theme_links', 'ao2_methods',
    'method_chains', 'quotes', 'critic_interpretations',
    'essay_plans', 'exam_questions', 'exam_question_guidance',
    'user_essay_attempts', 'learning_sessions', 'vocabulary_terms'
  ] loop
    execute format('drop trigger if exists trg_%s_updated_at on %I', tbl, tbl);
    execute format(
      'create trigger trg_%s_updated_at before update on %I '
      'for each row execute function set_updated_at()', tbl, tbl);
  end loop;
end $$;


-- ══════════════════════════════════════════════════════════════════════════
-- 13. INDEXES
-- ══════════════════════════════════════════════════════════════════════════

-- FK indexes (Postgres does not auto-index foreign keys)
create index if not exists idx_texts_component        on texts(component_id);
create index if not exists idx_themes_text            on themes(text_id);
create index if not exists idx_theme_guidance_theme   on theme_guidance(theme_id);
create index if not exists idx_characters_text        on characters(text_id);
create index if not exists idx_quotes_text_theme      on quotes(text_id, primary_theme_id);
create index if not exists idx_quotes_scene           on quotes(scene_id);
create index if not exists idx_quotes_character        on quotes(character_id)
  where character_id is not null;
create index if not exists idx_quote_methods_method   on quote_methods(method_id);
create index if not exists idx_revision_cards_text    on revision_cards(text_id);
create index if not exists idx_essay_plans_text_theme on essay_plans(text_id, theme_id);
create index if not exists idx_model_paragraphs_text_theme
  on model_paragraphs(text_id, theme_id);
create index if not exists idx_critic_interpretations_theme
  on critic_interpretations(theme_id) where theme_id is not null;
create index if not exists idx_context_entries_type
  on context_entries(context_type);
create index if not exists idx_method_chains_character
  on method_chains(character_id) where character_id is not null;
create index if not exists idx_method_chains_theme
  on method_chains(theme_id) where theme_id is not null;

-- Reverse indexes on junction tables  [v5 P4 + v6 C4]
create index if not exists idx_character_theme_links_theme
  on character_theme_links(theme_id);
create index if not exists idx_exam_question_context_links_context
  on exam_question_context_links(context_entry_id);
create index if not exists idx_exam_question_theme_links_theme
  on exam_question_theme_links(theme_id);
create index if not exists idx_exam_question_character_links_character
  on exam_question_character_links(character_id);
create index if not exists idx_quote_secondary_themes_theme
  on quote_secondary_themes(theme_id);
create index if not exists idx_vocabulary_theme_links_theme
  on vocabulary_theme_links(theme_id);
create index if not exists idx_character_critics_critic
  on character_critics(critic_id);

-- User-owned table indexes
create index if not exists idx_learning_sessions_user
  on learning_sessions(user_id);
create index if not exists idx_learning_sessions_text
  on learning_sessions(text_id) where text_id is not null;
create index if not exists idx_user_essay_attempts_user
  on user_essay_attempts(user_id);
create index if not exists idx_user_learning_analytics_user
  on user_learning_analytics(user_id);
create index if not exists idx_user_learning_analytics_session
  on user_learning_analytics(learning_session_id)
  where learning_session_id is not null;
create index if not exists idx_quote_usage_tracking_user
  on quote_usage_tracking(user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 14. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────
-- 14a. Reference / content tables — readable by all authenticated users,
--      writable by content editors, deletable by admins only.
-- ────────────────────────────────────────────────────────────────────────

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'components', 'texts', 'acts_scenes', 'assessment_objectives',
    'component_ao_weightings', 'grade_level_descriptors', 'timing_strategies',
    'themes', 'theme_guidance', 'characters', 'character_aliases',
    'character_theme_links', 'ao2_methods', 'method_chains',
    'quotes', 'quote_secondary_themes', 'quote_methods', 'quote_ao_links',
    'context_entries', 'critics', 'critic_interpretations', 'character_critics',
    'ao5_strategies', 'theme_theses', 'thesis_models',
    'essay_plans', 'plan_paragraphs', 'paragraph_routes', 'model_paragraphs',
    'paragraph_sentence_stems', 'exam_questions', 'exam_question_theme_links',
    'exam_question_character_links', 'exam_question_context_links',
    'exam_question_guidance', 'revision_cards', 'vocabulary_terms',
    'vocabulary_theme_links', 'big_idea_panels', 'insight_callouts',
    'common_errors'
  ] loop
    execute format('alter table %I enable row level security', tbl);

    -- Authenticated read
    begin
      execute format(
        'create policy %s_authenticated_read on %I for select to authenticated using (true)',
        tbl, tbl);
    exception when duplicate_object then null; end;

    -- Content editor insert
    begin
      execute format(
        'create policy %s_editor_insert on %I for insert to authenticated '
        'with check (is_content_editor())', tbl, tbl);
    exception when duplicate_object then null; end;

    -- Content editor update
    begin
      execute format(
        'create policy %s_editor_update on %I for update to authenticated '
        'using (is_content_editor()) with check (is_content_editor())', tbl, tbl);
    exception when duplicate_object then null; end;

    -- Admin delete
    begin
      execute format(
        'create policy %s_admin_delete on %I for delete to authenticated '
        'using (is_admin())', tbl, tbl);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- ────────────────────────────────────────────────────────────────────────
-- 14b. User-owned tables — users see/modify own rows; teachers/editors
--      can read all.
-- ────────────────────────────────────────────────────────────────────────

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'user_card_progress', 'user_quote_bookmarks', 'user_essay_attempts',
    'user_essay_attempt_ao_scores', 'quote_usage_tracking',
    'learning_sessions', 'user_learning_analytics'
  ] loop
    execute format('alter table %I enable row level security', tbl);

    -- Own rows (all operations)
    begin
      execute format(
        'create policy %s_own_rows on %I for all '
        'using ((select auth.uid()) = user_id) '
        'with check ((select auth.uid()) = user_id)', tbl, tbl);
    exception when duplicate_object then null; end;

    -- Teacher/editor read
    begin
      execute format(
        'create policy %s_teacher_read on %I for select to authenticated '
        'using (is_teacher())', tbl, tbl);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- Special case: user_essay_attempt_ao_scores doesn't have user_id directly.
-- Its RLS relies on the parent attempt's ownership.
alter table user_essay_attempt_ao_scores enable row level security;

do $$ begin
  create policy ao_scores_via_attempt on user_essay_attempt_ao_scores
    for all using (
      exists (
        select 1 from user_essay_attempts uea
        where uea.id = attempt_id
          and uea.user_id = (select auth.uid())
      )
    )
    with check (
      exists (
        select 1 from user_essay_attempts uea
        where uea.id = attempt_id
          and uea.user_id = (select auth.uid())
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy ao_scores_teacher_read on user_essay_attempt_ao_scores
    for select to authenticated
    using (is_teacher());
exception when duplicate_object then null; end $$;

-- app_user_roles — only admins manage; users can read own roles.
alter table app_user_roles enable row level security;

do $$ begin
  create policy app_user_roles_own_read on app_user_roles
    for select using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy app_user_roles_admin_all on app_user_roles
    for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;


-- ══════════════════════════════════════════════════════════════════════════
-- 15. SEED DATA — Assessment Objectives
-- ══════════════════════════════════════════════════════════════════════════

insert into assessment_objectives (code, label, description) values
  ('AO1', 'AO1: Articulate informed personal responses',
   'Articulate informed, personal and creative responses to literary texts, using associated concepts and terminology, and coherent, accurate written expression.'),
  ('AO2', 'AO2: Analyse methods',
   'Analyse ways in which meanings are shaped in literary texts.'),
  ('AO3', 'AO3: Demonstrate contextual understanding',
   'Demonstrate understanding of the significance and influence of the contexts in which literary texts are written and received.'),
  ('AO4', 'AO4: Explore connections',
   'Explore connections across literary texts.'),
  ('AO5', 'AO5: Explore literary criticism',
   'Explore literary texts informed by different interpretations.')
on conflict do nothing;


-- ══════════════════════════════════════════════════════════════════════════
-- 16. VERIFICATION QUERIES (run manually after migration)
-- ══════════════════════════════════════════════════════════════════════════
--
-- 1. Total table count (expect 49):
--    select count(*) from information_schema.tables
--     where table_schema = 'public'
--       and table_type = 'BASE TABLE';
--
-- 2. Check v6 new tables exist:
--    select table_name from information_schema.tables
--     where table_schema = 'public'
--       and table_name in (
--         'theme_guidance',
--         'user_essay_attempt_ao_scores',
--         'vocabulary_theme_links',
--         'exam_question_guidance',
--         'user_learning_analytics',
--         'app_user_roles'
--       )
--     order by table_name;
--
-- 3. Check all triggers:
--    select trigger_name, event_object_table
--      from information_schema.triggers
--     where trigger_schema = 'public'
--       and trigger_name like 'trg_%'
--     order by event_object_table;
--
-- 4. Check RLS enabled on all tables:
--    select relname, relrowsecurity
--      from pg_class
--     where relnamespace = 'public'::regnamespace
--       and relkind = 'r'
--     order by relname;
--
-- 5. Check AO4/AO5 guards (both should fail):
--    insert into quote_ao_links (quote_id, ao_code, note)
--    select q.id, 'AO4', 'test' from quotes q limit 1;
--
--    insert into quote_ao_links (quote_id, ao_code, note)
--    select q.id, 'AO5', 'test'
--      from quotes q join texts t on t.id = q.text_id
--     where t.exam_section = 'SECTION_B' limit 1;
--
-- 6. Check role helper functions:
--    select proname from pg_proc
--     where proname in ('is_admin', 'is_content_editor', 'is_teacher');
--
-- ══════════════════════════════════════════════════════════════════════════
-- END OF v6 SCHEMA
-- ══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- AO Integration Trainer — schema migration
-- Project: Prose Craft Aid (Drama Tutor module)
-- Spec: EssayBuilderPrompt_2.md  (Essay Builder → Mode C: Detect Failure)
-- Builds on: 0001_essay_builder.sql (reuses ao_code, play_code, question_routes)
-- ============================================================================
--
-- Mode C of the Essay Builder is a paragraph-level four-card drill: the
-- student is shown an exam question, a paragraph slot, and four paragraph
-- versions, and must pick the strongest. Mode C reuses the four-card logic
-- from the Essay Route Builder (0001) but applies it to paragraphs instead
-- of essay paths.
--
-- Adaptations from the original spec:
--   - spec field `text_id` → `play_code` (prose-craft-aid uses play_code,
--     no `texts` table exists in 0001)
--   - spec field `theme_id` → `theme_tag text` (no themes table in 0001)
--   - `section` retained as a derived check column for spec compliance
--   - reuses ao_code, play_code, question_routes from 0001
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------

do $$ begin
  create type paragraph_classification as enum (
    'A_STAR_INTEGRATED',
    'AO_IN_TURNS',
    'AO_DOMINANT',
    'WRONG_ORDER',
    'AO4_BOLTED_ON',
    'AO1_DRIFT',
    'NARRATIVE_SUMMARY',
    'CRITIC_NAME_DROPPING',
    'CONTEXT_DUMPING'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type section_code as enum ('SECTION_A', 'SECTION_B');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. DRILLS
-- ----------------------------------------------------------------------------

create table ao_integration_drills (
  id              uuid primary key default gen_random_uuid(),
  play_code       play_code   not null,
  section         section_code not null,
  exam_question   text        not null,
  paragraph_slot  text        not null,
  theme_tag       text,
  route_id        uuid references question_routes(id),
  target_skill    text,
  difficulty      smallint check (difficulty between 1 and 5),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Section must align with play.
  constraint drill_section_matches_play check (
    (play_code = 'hamlet'           and section = 'SECTION_A') or
    (play_code = 'duchess_of_malfi' and section = 'SECTION_B')
  )
);

create index idx_drills_play     on ao_integration_drills (play_code);
create index idx_drills_route    on ao_integration_drills (route_id);
create index idx_drills_theme    on ao_integration_drills (theme_tag);

-- ----------------------------------------------------------------------------
-- 3. PARAGRAPH OPTIONS
-- ----------------------------------------------------------------------------

create table ao_paragraph_options (
  id                      uuid primary key default gen_random_uuid(),
  drill_id                uuid not null references ao_integration_drills(id) on delete cascade,
  option_label            text not null check (option_label in ('A','B','C','D')),
  paragraph_text          text not null,
  classification          paragraph_classification not null,
  is_best_answer          boolean not null,

  -- AO scores (1–5). ao4 is nullable: Hamlet drills have it null on every
  -- option; Duchess drills require it non-null on every option (enforced
  -- by trigger 9c).
  ao1_score               smallint not null check (ao1_score between 1 and 5),
  ao2_score               smallint not null check (ao2_score between 1 and 5),
  ao3_score               smallint not null check (ao3_score between 1 and 5),
  ao4_score               smallint          check (ao4_score between 1 and 5),
  ao5_score               smallint not null check (ao5_score between 1 and 5),

  integration_score       smallint not null check (integration_score between 1 and 5),
  sequence_score          smallint not null check (sequence_score    between 1 and 5),

  examiner_diagnosis      text not null,
  student_feedback        text not null,
  improvement_instruction text not null,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- is_best_answer is true iff this is the A* integrated paragraph.
  constraint best_answer_matches_classification check (
    is_best_answer = (classification = 'A_STAR_INTEGRATED')
  ),

  unique (drill_id, option_label)
);

create index idx_options_drill on ao_paragraph_options (drill_id);

-- ----------------------------------------------------------------------------
-- 4. ATTEMPTS
-- ----------------------------------------------------------------------------

create table ao_integration_attempts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  drill_id            uuid not null references ao_integration_drills(id),
  selected_option_id  uuid not null references ao_paragraph_options(id),
  is_correct          boolean not null,
  attempt_no          int not null check (attempt_no >= 1),
  feedback_shown      boolean not null default false,
  created_at          timestamptz not null default now(),

  unique (user_id, drill_id, attempt_no)
);

create index idx_attempts_user_drill
  on ao_integration_attempts (user_id, drill_id, attempt_no desc);

-- ----------------------------------------------------------------------------
-- 5. TRIGGERS — structural invariants
-- ----------------------------------------------------------------------------

-- 5a. Drill must have at most 4 options and exactly 1 A_STAR_INTEGRATED.
create or replace function enforce_drill_option_invariants()
returns trigger as $$
declare
  total_options int;
  best_count    int;
  drill_play    play_code;
begin
  select count(*) into total_options
  from ao_paragraph_options
  where drill_id = coalesce(new.drill_id, old.drill_id);

  select count(*) into best_count
  from ao_paragraph_options
  where drill_id = coalesce(new.drill_id, old.drill_id)
    and classification = 'A_STAR_INTEGRATED';

  select play_code into drill_play
  from ao_integration_drills
  where id = coalesce(new.drill_id, old.drill_id);

  if total_options > 4 then
    raise exception 'A drill may have at most 4 paragraph options (got %)', total_options;
  end if;

  if best_count > 1 then
    raise exception 'A drill may have at most 1 A_STAR_INTEGRATED option (got %)', best_count;
  end if;

  -- 5b. AO4 rule per play.
  if drill_play = 'hamlet' and new.ao4_score is not null then
    raise exception 'Hamlet drills must not score AO4 (option % had ao4_score=%)',
      new.option_label, new.ao4_score;
  end if;

  if drill_play = 'duchess_of_malfi' and new.ao4_score is null then
    raise exception 'Duchess drills must score AO4 on every option (option % had null)',
      new.option_label;
  end if;

  -- 5c. AO4_BOLTED_ON classification only valid for Duchess.
  if new.classification = 'AO4_BOLTED_ON' and drill_play <> 'duchess_of_malfi' then
    raise exception 'AO4_BOLTED_ON classification is only valid for Duchess drills';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_drill_option_invariants
  after insert or update on ao_paragraph_options
  for each row execute function enforce_drill_option_invariants();

-- 5d. Attempt is_correct must match selected option's is_best_answer.
create or replace function enforce_attempt_correctness()
returns trigger as $$
declare
  best boolean;
  parent_drill uuid;
begin
  select is_best_answer, drill_id into best, parent_drill
  from ao_paragraph_options
  where id = new.selected_option_id;

  if parent_drill <> new.drill_id then
    raise exception 'selected_option_id % does not belong to drill %',
      new.selected_option_id, new.drill_id;
  end if;

  if new.is_correct <> best then
    raise exception 'is_correct (%) must equal selected option is_best_answer (%)',
      new.is_correct, best;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_attempt_correctness
  before insert or update on ao_integration_attempts
  for each row execute function enforce_attempt_correctness();

-- 5e. updated_at maintenance.
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger trg_drills_updated_at
  before update on ao_integration_drills
  for each row execute function touch_updated_at();

create trigger trg_options_updated_at
  before update on ao_paragraph_options
  for each row execute function touch_updated_at();

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

-- Public-read content tables: drills + options readable by any authenticated
-- user; writes via service role only.
alter table ao_integration_drills enable row level security;
alter table ao_paragraph_options  enable row level security;

create policy "auth read drills"  on ao_integration_drills
  for select to authenticated using (true);
create policy "auth read options" on ao_paragraph_options
  for select to authenticated using (true);

-- User-owned: students read/write only their own attempts.
alter table ao_integration_attempts enable row level security;

create policy "student read own ao attempts" on ao_integration_attempts
  for select using (auth.uid() = user_id);
create policy "student insert own ao attempts" on ao_integration_attempts
  for insert with check (auth.uid() = user_id);
create policy "student update own ao attempts" on ao_integration_attempts
  for update using (auth.uid() = user_id);

-- ============================================================================
-- End of migration
-- ============================================================================

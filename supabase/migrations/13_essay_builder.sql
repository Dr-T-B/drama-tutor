-- ============================================================================
-- Essay Builder — initial schema migration
-- Project: Prose Craft Aid (Drama Tutor module)
-- Spec: EssayBuilder_v2.md
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------

do $$ begin
  create type ao_code as enum ('AO1', 'AO2', 'AO3', 'AO4', 'AO5');
exception when duplicate_object then null; end $$;

do $$ begin
  create type play_code as enum ('hamlet', 'duchess_of_malfi');
exception when duplicate_object then null; end $$;

do $$ begin
  create type path_classification as enum ('correct', 'partial', 'wrong', 'exam_risk');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tone_register as enum ('firm_instructive');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. QUESTION ROUTES (stub if not already present)
-- ----------------------------------------------------------------------------
-- If your Stage 2 Question Router has already created `question_routes`,
-- this block is a no-op. Otherwise it creates a minimal compatible table.

create table if not exists question_routes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,                    -- e.g. 'H001', 'D004'
  play_code   play_code not null,
  summary     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_question_routes_play on question_routes (play_code);

-- ----------------------------------------------------------------------------
-- 3. FEEDBACK (created before path_options because path_options FKs to it)
-- ----------------------------------------------------------------------------

create table essay_path_feedback (
  id              uuid primary key default gen_random_uuid(),
  classification  path_classification not null,
  headline        text not null,
  body_sections   jsonb not null,
  tone_register   tone_register not null default 'firm_instructive',
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. QUESTIONS
-- ----------------------------------------------------------------------------

create table essay_builder_questions (
  id                  uuid primary key default gen_random_uuid(),
  play_code           play_code not null,
  question_text       text not null,
  question_year       int,
  theme_tags          text[] not null default '{}',
  character_focus     text[] not null default '{}',
  primary_route_id    uuid not null references question_routes(id),
  secondary_route_id  uuid references question_routes(id),
  relevant_aos        ao_code[] not null,
  created_at          timestamptz not null default now(),

  -- Schema-level enforcement of AO rules
  constraint hamlet_excludes_ao4 check (
    play_code <> 'hamlet' or not ('AO4' = any(relevant_aos))
  ),
  constraint duchess_includes_ao4 check (
    play_code <> 'duchess_of_malfi' or 'AO4' = any(relevant_aos)
  )
);

create index idx_questions_play on essay_builder_questions (play_code);

-- ----------------------------------------------------------------------------
-- 5. PATH OPTIONS
-- ----------------------------------------------------------------------------

create table essay_path_options (
  id                uuid primary key default gen_random_uuid(),
  question_id       uuid not null references essay_builder_questions(id) on delete cascade,
  path_label        text not null,
  route_id          uuid references question_routes(id),
  classification    path_classification not null,
  thesis_direction  text not null,
  ao_strengths      ao_code[] not null default '{}',
  ao_weaknesses     ao_code[] not null default '{}',
  why_attractive    text not null,
  feedback_id       uuid not null references essay_path_feedback(id),
  unlocks_skeleton  boolean not null,
  display_order     int,
  created_at        timestamptz not null default now()
);

create index idx_path_options_question on essay_path_options (question_id);

-- ----------------------------------------------------------------------------
-- 6. SKELETONS (1:1 with correct/partial paths)
-- ----------------------------------------------------------------------------

create table essay_skeletons (
  id              uuid primary key default gen_random_uuid(),
  path_option_id  uuid not null unique references essay_path_options(id) on delete cascade,
  thesis          text not null,
  paragraphs      jsonb not null,
  conclusion      jsonb not null,
  upgrade_banner  text,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. ATTEMPTS
-- ----------------------------------------------------------------------------

create table essay_builder_attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  question_id       uuid not null references essay_builder_questions(id),
  play_code         play_code not null,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  final_outcome     path_classification,
  unlocked_skeleton boolean not null default false
);

create index idx_attempts_user_started on essay_builder_attempts (user_id, started_at desc);

-- ----------------------------------------------------------------------------
-- 8. ATTEMPT CHOICES
-- ----------------------------------------------------------------------------

create table essay_builder_attempt_choices (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references essay_builder_attempts(id) on delete cascade,
  path_option_id  uuid not null references essay_path_options(id),
  retry_number    int not null check (retry_number >= 1),
  chosen_at       timestamptz not null default now(),
  unique (attempt_id, retry_number)
);

create index idx_choices_attempt on essay_builder_attempt_choices (attempt_id, retry_number);

-- ----------------------------------------------------------------------------
-- 9. TRIGGERS — enforce structural invariants
-- ----------------------------------------------------------------------------

-- 9a. Each question must have exactly one 'correct' path and at most 4 paths total.
-- Enforced after each insert/update on essay_path_options.

create or replace function enforce_path_invariants()
returns trigger as $$
declare
  total_paths int;
  correct_count int;
begin
  select count(*) into total_paths
  from essay_path_options
  where question_id = coalesce(new.question_id, old.question_id);

  select count(*) into correct_count
  from essay_path_options
  where question_id = coalesce(new.question_id, old.question_id)
    and classification = 'correct';

  if total_paths > 4 then
    raise exception 'A question may have at most 4 path options (got %)', total_paths;
  end if;

  if correct_count > 1 then
    raise exception 'A question may have at most 1 correct path (got %)', correct_count;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_path_invariants
  after insert or update on essay_path_options
  for each row execute function enforce_path_invariants();

-- 9b. unlocks_skeleton must match classification.
create or replace function enforce_unlocks_skeleton()
returns trigger as $$
begin
  if new.classification in ('correct', 'partial') and not new.unlocks_skeleton then
    raise exception 'unlocks_skeleton must be true for classification %', new.classification;
  end if;
  if new.classification in ('wrong', 'exam_risk') and new.unlocks_skeleton then
    raise exception 'unlocks_skeleton must be false for classification %', new.classification;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_unlocks_skeleton
  before insert or update on essay_path_options
  for each row execute function enforce_unlocks_skeleton();

-- 9c. Skeleton must only attach to correct or partial paths.
create or replace function enforce_skeleton_path_class()
returns trigger as $$
declare
  cls path_classification;
begin
  select classification into cls
  from essay_path_options
  where id = new.path_option_id;

  if cls not in ('correct', 'partial') then
    raise exception 'Skeleton may only attach to correct or partial path (got %)', cls;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_skeleton_path_class
  before insert or update on essay_skeletons
  for each row execute function enforce_skeleton_path_class();

-- ----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

-- Public-read tables (questions, paths, feedback, skeletons): readable by any
-- authenticated user; writes via service role only.
alter table essay_builder_questions enable row level security;
alter table essay_path_options       enable row level security;
alter table essay_path_feedback      enable row level security;
alter table essay_skeletons          enable row level security;

create policy "auth read questions" on essay_builder_questions
  for select to authenticated using (true);
create policy "auth read paths" on essay_path_options
  for select to authenticated using (true);
create policy "auth read feedback" on essay_path_feedback
  for select to authenticated using (true);
create policy "auth read skeletons" on essay_skeletons
  for select to authenticated using (true);

-- User-owned tables: students see only their own attempts/choices.
alter table essay_builder_attempts        enable row level security;
alter table essay_builder_attempt_choices enable row level security;

create policy "student read own attempts" on essay_builder_attempts
  for select using (auth.uid() = user_id);
create policy "student insert own attempts" on essay_builder_attempts
  for insert with check (auth.uid() = user_id);
create policy "student update own attempts" on essay_builder_attempts
  for update using (auth.uid() = user_id);

create policy "student read own choices" on essay_builder_attempt_choices
  for select using (
    exists (select 1 from essay_builder_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );
create policy "student insert own choices" on essay_builder_attempt_choices
  for insert with check (
    exists (select 1 from essay_builder_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );

-- ============================================================================
-- End of migration
-- ============================================================================

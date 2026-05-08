-- ============================================================================
-- Mode D — Duchess Trainer (D001R–D010 foundation + D004D + D007)
-- ============================================================================
-- Foundation reference tables (D001R, D002R, D003R, D007-templates) are
-- created here alongside the MCQ stem table (D004D) and the annotated essay
-- paragraphs table (D007).
--
-- Hard rules enforced at schema level:
--   • Duchess only (play_code CHECK)
--   • Section B only (exam_section_code CHECK)
--   • AO1/AO2/AO3 only — AO4/AO5 blocked in ao_tags CHECK
--   • One best answer per round per route (partial index)
--   • Annotation columns must be non-empty JSON arrays
-- ============================================================================

-- ----------------------------------------------------------------------------
-- D001R — Essay path model bank
-- ----------------------------------------------------------------------------
create table if not exists mode_d_essay_path_models (
  model_essay_key   text primary key,
  play_code         text not null check (play_code = 'DUCHESS'),
  question_text     text not null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- D002R — Route bank
-- ----------------------------------------------------------------------------
create table if not exists mode_d_route_bank (
  route_key           text primary key,
  model_essay_key     text not null references mode_d_essay_path_models(model_essay_key) on delete restrict,
  play_code           text not null check (play_code = 'DUCHESS'),
  exam_section_code   text not null check (exam_section_code = 'SECTION_B_OTHER_DRAMA'),
  ao_profile_lock     text not null,
  route_title         text not null,
  difficulty_band     text not null check (difficulty_band in ('LEVEL_5_ENTRY','LEVEL_5_ADVANCED')),
  is_recommended_route boolean not null default false,
  risk_warning        text,
  thesis_angle        text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- D003R — Paragraph round map (rounds per route)
-- ----------------------------------------------------------------------------
create table if not exists mode_d_paragraph_round_map (
  round_key           text primary key,
  route_key           text not null references mode_d_route_bank(route_key) on delete restrict,
  round_number        int  not null check (round_number between 1 and 5),
  paragraph_slot      text not null check (paragraph_slot in
                        ('INTRODUCTION','BODY_1','BODY_2','BODY_3','CONCLUSION')),
  ao_target_codes     text[] not null,
  time_budget_minutes int  not null,
  paragraph_anchor    text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),

  unique (route_key, round_number)
);

-- ----------------------------------------------------------------------------
-- D007-templates — Reveal template bank
-- ----------------------------------------------------------------------------
create table if not exists mode_d_reveal_templates (
  template_key      text primary key,
  play_code         text not null check (play_code = 'DUCHESS'),
  exam_section_code text not null check (exam_section_code = 'SECTION_B_OTHER_DRAMA'),
  ao_profile_lock   text not null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- D004D — Duchess MCQ stem options
-- ----------------------------------------------------------------------------
create table if not exists mode_d_duchess_mcq_stem_options (
  option_key              text primary key,
  model_essay_key         text not null references mode_d_essay_path_models(model_essay_key) on delete restrict,
  route_key               text not null references mode_d_route_bank(route_key) on delete restrict,
  play_code               text not null default 'DUCHESS' check (play_code = 'DUCHESS'),
  exam_section_code       text not null default 'SECTION_B_OTHER_DRAMA'
                            check (exam_section_code = 'SECTION_B_OTHER_DRAMA'),
  ao_profile_lock         text not null default 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY',
  question_text           text not null,
  route_title             text not null,
  blocked_ao_check        text not null default 'PASS',
  edexcel_compliance_note text,
  marking_status          text not null default 'draft'
                            check (marking_status in ('draft','checked','approved')),
  quote_verification_status text not null default 'pending'
                            check (quote_verification_status in ('pending','checked','verified')),
  round_key               text not null references mode_d_paragraph_round_map(round_key) on delete restrict,
  round_number            int  not null check (round_number between 1 and 5),
  paragraph_slot          text not null check (paragraph_slot in
                            ('INTRODUCTION','BODY_1','BODY_2','BODY_3','CONCLUSION')),
  paragraph_function      text,
  option_label            text not null check (option_label in ('A','B','C','D')),
  option_text             text not null,
  classification          text not null check (classification in ('NARRATIVE','CONTEXT','PARTIAL','BEST')),
  grade_band              text not null check (grade_band in ('U','E','C','A_STAR')),
  is_best_answer          boolean not null default false,
  score_value             int  not null check (score_value in (0,1,2,4)),
  ao_tags                 text[] not null,
  primary_ao_focus        text not null check (primary_ao_focus in ('AO1','AO2','AO3')),
  error_type              text not null,
  examiner_diagnosis      text not null,
  student_feedback        text not null,
  upgrade_instruction     text not null,
  is_active               boolean not null default true,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- Structural: best answer iff classification=BEST
  constraint d004d_best_matches_classification check (
    is_best_answer = (classification = 'BEST')
  ),
  -- Structural: score matches classification
  constraint d004d_score_matches_classification check (
    (classification = 'NARRATIVE' and score_value = 0) or
    (classification = 'CONTEXT'   and score_value = 1) or
    (classification = 'PARTIAL'   and score_value = 2) or
    (classification = 'BEST'      and score_value = 4)
  ),
  -- Structural: no AO4/AO5 in ao_tags
  constraint d004d_ao_tags_no_ao4_ao5 check (
    not (ao_tags && array['AO4','AO5'])
  ),
  -- One row per route × round × option_label
  unique (route_key, round_number, option_label)
);

-- One best answer per round per route (partial unique index)
create unique index if not exists idx_d004d_one_best_per_round
  on mode_d_duchess_mcq_stem_options (route_key, round_number)
  where is_best_answer = true;

create index if not exists idx_d004d_route     on mode_d_duchess_mcq_stem_options (route_key);
create index if not exists idx_d004d_round     on mode_d_duchess_mcq_stem_options (route_key, round_number);
create index if not exists idx_d004d_marking   on mode_d_duchess_mcq_stem_options (marking_status);

-- ----------------------------------------------------------------------------
-- D007 — Annotated essay paragraphs
-- ----------------------------------------------------------------------------
create table if not exists mode_d_annotated_essay_paragraphs (
  paragraph_key             text primary key,
  template_key              text not null references mode_d_reveal_templates(template_key) on delete restrict,
  model_essay_key           text not null references mode_d_essay_path_models(model_essay_key) on delete restrict,
  route_key                 text not null references mode_d_route_bank(route_key) on delete restrict,
  round_key                 text not null references mode_d_paragraph_round_map(round_key) on delete restrict,
  round_number              int  not null check (round_number between 1 and 5),
  paragraph_slot            text not null check (paragraph_slot in
                              ('INTRODUCTION','BODY_1','BODY_2','BODY_3','CONCLUSION')),
  paragraph_text            text not null,
  annotations               jsonb not null,
  examiner_summary          text not null,
  word_count                int  not null check (word_count > 0),
  recommended_reading_time_seconds int not null check (recommended_reading_time_seconds > 0),
  marking_status            text not null default 'draft'
                              check (marking_status in ('draft','checked','approved')),
  quote_verification_status text not null default 'pending'
                              check (quote_verification_status in ('pending','checked','verified')),
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  constraint annotations_is_array    check (jsonb_typeof(annotations) = 'array'),
  constraint annotations_non_empty   check (jsonb_array_length(annotations) >= 1),

  unique (route_key, round_number)
);

create index if not exists idx_essay_para_route    on mode_d_annotated_essay_paragraphs (route_key);
create index if not exists idx_essay_para_round    on mode_d_annotated_essay_paragraphs (round_key);
create index if not exists idx_essay_para_template on mode_d_annotated_essay_paragraphs (template_key);
create index if not exists idx_essay_para_marking  on mode_d_annotated_essay_paragraphs (marking_status);

-- ----------------------------------------------------------------------------
-- updated_at trigger (shared function reuse or define once)
-- ----------------------------------------------------------------------------
create or replace function mode_d_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger trg_d004d_updated_at
  before update on mode_d_duchess_mcq_stem_options
  for each row execute function mode_d_touch_updated_at();

create trigger trg_d007_updated_at
  before update on mode_d_annotated_essay_paragraphs
  for each row execute function mode_d_touch_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security — content tables read by authenticated users
-- ----------------------------------------------------------------------------
alter table mode_d_essay_path_models       enable row level security;
alter table mode_d_route_bank              enable row level security;
alter table mode_d_paragraph_round_map     enable row level security;
alter table mode_d_reveal_templates        enable row level security;
alter table mode_d_duchess_mcq_stem_options enable row level security;
alter table mode_d_annotated_essay_paragraphs enable row level security;

create policy "auth read mode_d_essay_path_models"
  on mode_d_essay_path_models for select to authenticated using (true);

create policy "auth read mode_d_route_bank"
  on mode_d_route_bank for select to authenticated using (true);

create policy "auth read mode_d_paragraph_round_map"
  on mode_d_paragraph_round_map for select to authenticated using (true);

create policy "auth read mode_d_reveal_templates"
  on mode_d_reveal_templates for select to authenticated using (true);

create policy "auth read mode_d_duchess_mcq_stem_options"
  on mode_d_duchess_mcq_stem_options for select to authenticated using (true);

create policy "auth read mode_d_annotated_essay_paragraphs"
  on mode_d_annotated_essay_paragraphs for select to authenticated using (true);

-- ============================================================================
-- End of migration 15
-- ============================================================================

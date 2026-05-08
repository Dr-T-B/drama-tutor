-- Grant anonymous SELECT on the Mode D Duchess tables the PWA reads.
--
-- Context: the Drama PWA is a single-user revision tool; users are
-- intentionally unauthenticated. The Mode D tables previously had only
-- `authenticated` SELECT policies, so the anon Supabase client received
-- empty result sets (no error), causing /mode-d/duchess to render an
-- empty hub. These policies grant anon SELECT, scoped by the Duchess
-- AO profile lock so any future routes added under a different
-- ao_profile_lock cannot leak.
--
-- SELECT only — no anon INSERT/UPDATE/DELETE under any circumstances.
-- Only the three tables actually queried by src/data/modeD.ts are opened;
-- mode_d_paragraph_round_map / mode_d_essay_path_models /
-- mode_d_reveal_templates remain authenticated-only.

-- ── mode_d_route_bank ────────────────────────────────────────────────────────
drop policy if exists "anon read mode_d_route_bank" on mode_d_route_bank;
create policy "anon read mode_d_route_bank"
  on mode_d_route_bank for select to anon
  using (ao_profile_lock = 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY');

-- ── mode_d_duchess_mcq_stem_options ──────────────────────────────────────────
drop policy if exists "anon read mode_d_duchess_mcq_stem_options" on mode_d_duchess_mcq_stem_options;
create policy "anon read mode_d_duchess_mcq_stem_options"
  on mode_d_duchess_mcq_stem_options for select to anon
  using (ao_profile_lock = 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY');

-- ── mode_d_annotated_essay_paragraphs ────────────────────────────────────────
-- This table has no ao_profile_lock column; the lock is enforced via the
-- route_key FK into mode_d_route_bank. Scope anon access by joining back
-- through the locked route bank — the route_bank anon policy above gates
-- exactly the rows we want exposed.
drop policy if exists "anon read mode_d_annotated_essay_paragraphs" on mode_d_annotated_essay_paragraphs;
create policy "anon read mode_d_annotated_essay_paragraphs"
  on mode_d_annotated_essay_paragraphs for select to anon
  using (
    route_key in (
      select route_key from mode_d_route_bank
      where ao_profile_lock = 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY'
    )
  );

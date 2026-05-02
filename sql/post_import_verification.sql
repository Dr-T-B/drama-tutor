-- Component 1 Drama — Post-import verification queries.
-- Run in the Supabase SQL editor after `npm run import-content`.

-- ─── Content volume check ────────────────────────────────────────────────────
select
  (select count(*) from components)               as components,
  (select count(*) from texts)                    as texts,
  (select count(*) from acts_scenes)              as acts_scenes,
  (select count(*) from assessment_objectives)    as assessment_objectives,
  (select count(*) from component_ao_weightings)  as component_ao_weightings,
  (select count(*) from themes)                   as themes,
  (select count(*) from theme_guidance)           as theme_guidance,
  (select count(*) from theme_theses)             as theme_theses,
  (select count(*) from characters)               as characters,
  (select count(*) from character_aliases)        as character_aliases,
  (select count(*) from ao2_methods)              as ao2_methods,
  (select count(*) from critics)                  as critics,
  (select count(*) from critic_interpretations)   as critic_interpretations,
  (select count(*) from quotes)                   as quotes,
  (select count(*) from quote_secondary_themes)   as quote_secondary_themes,
  (select count(*) from quote_methods)            as quote_methods,
  (select count(*) from quote_ao_links)           as quote_ao_links,
  (select count(*) from essay_plans)              as essay_plans,
  (select count(*) from plan_paragraphs)          as plan_paragraphs,
  (select count(*) from thesis_models)            as thesis_models,
  (select count(*) from revision_cards)           as revision_cards,
  (select count(*) from context_entries)          as context_entries,
  (select count(*) from timing_strategies)        as timing_strategies,
  (select count(*) from grade_level_descriptors)  as grade_level_descriptors,
  (select count(*) from common_errors)            as common_errors,
  (select count(*) from paragraph_sentence_stems) as paragraph_sentence_stems,
  (select count(*) from vocabulary_terms)         as vocabulary_terms,
  (select count(*) from vocabulary_theme_links)   as vocabulary_theme_links;

-- Expected order-of-magnitude:
--   components: 1, texts: 2, acts_scenes: ~38, assessment_objectives: 5
--   themes: 24, theme_guidance: ~60-72, theme_theses: 72
--   characters: ~14-18, character_aliases: ~5
--   ao2_methods: ~38-48, critics: 10, critic_interpretations: ~30-50
--   quotes: ~192, quote_secondary_themes: ~300, quote_methods: ~150-300
--   quote_ao_links: ~600 (3-4 AOs per quote)
--   essay_plans: ~10-11, plan_paragraphs: ~40-44, thesis_models: 5
--   revision_cards: ~200+
--   context_entries: ~16
--   timing_strategies: 2, grade_level_descriptors: 10
--   common_errors: ~11, paragraph_sentence_stems: ~10
--   vocabulary_terms: ~22, vocabulary_theme_links: variable

-- ─── FK integrity checks (each should return 0 rows) ────────────────────────
select 'orphan quotes (no text)' as check_name, count(*) as bad_rows
  from quotes q left join texts t on t.id = q.text_id where t.id is null
union all
select 'orphan quote_secondary_themes (no theme)', count(*)
  from quote_secondary_themes qst left join themes th on th.id = qst.theme_id where th.id is null
union all
select 'orphan quote_methods (no method)', count(*)
  from quote_methods qm left join ao2_methods m on m.id = qm.method_id where m.id is null
union all
select 'orphan plan_paragraphs (no plan)', count(*)
  from plan_paragraphs pp left join essay_plans ep on ep.id = pp.essay_plan_id where ep.id is null
union all
select 'orphan theme_guidance (no theme)', count(*)
  from theme_guidance tg left join themes th on th.id = tg.theme_id where th.id is null;

-- ─── AO4 guard check (should fail with a constraint / trigger error) ─────────
-- Uncomment to test that AO4 quote links cannot be inserted.
-- insert into quote_ao_links (quote_id, ao_code, note)
--   select id, 'AO4', 'test' from quotes limit 1;

-- ─── Sample content checks ───────────────────────────────────────────────────
-- Themes by text
select t.short_code, count(th.*) as themes
  from texts t left join themes th on th.text_id = t.id
  group by t.short_code order by t.short_code;

-- Quote distribution
select t.short_code, count(q.*) as quotes
  from texts t left join quotes q on q.text_id = t.id
  group by t.short_code order by t.short_code;

-- Theses per theme
select th.theme_code, th.theme_name, count(tt.*) as theses
  from themes th left join theme_theses tt on tt.theme_id = th.id
  group by th.theme_code, th.theme_name order by th.theme_code;

-- Quotes that failed character resolution (compound speakers etc.)
select q.quote_id, q.speaker
  from quotes q where q.character_id is null and q.speaker is not null
  order by q.quote_id;

-- ============================================================================
-- Essay Builder — seed data
-- Hamlet: "Explore Shakespeare's presentation of corruption in Hamlet."
-- ============================================================================
-- Run AFTER 0001_essay_builder.sql.
-- This seed uses fixed UUIDs for stability across re-runs and FK references.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Question routes (stub two routes used by this question)
-- ----------------------------------------------------------------------------
-- If the routes already exist, the on conflict do nothing keeps this idempotent.

insert into question_routes (id, code, play_code, summary) values
  ('a0000001-0000-0000-0000-000000000001', 'H001', 'hamlet',
   'Corruption as moral interiority — the diseased conscience'),
  ('a0000003-0000-0000-0000-000000000003', 'H003', 'hamlet',
   'Corruption as somatic and political contagion'),
  ('a0000006-0000-0000-0000-000000000006', 'H006', 'hamlet',
   'Revenge and its ethical residue')
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Feedback rows (one per path, classification-typed body_sections)
-- ----------------------------------------------------------------------------

insert into essay_path_feedback (id, classification, headline, body_sections) values

-- Path A — correct
('f0000001-0000-0000-0000-000000000001', 'correct',
 'This route directly answers the question.',
 jsonb_build_object(
   'why_it_fits',
   '"Corruption" is interpreted at both the personal and political register, which the question''s open verb "explore" invites. The somatic-political bridge gives you a thesis that controls AO2, AO3 and AO5 simultaneously.',
   'ao_integration',
   'AO2 imagery (the "unweeded garden", "something is rotten") becomes the evidence for AO3 (humoral and Reformation political-theology contexts), which a Greenblatt position on purgatorial residue then complicates at AO5. The AOs interlock instead of taking turns.'
 )
),

-- Path B — partial
('f0000002-0000-0000-0000-000000000002', 'partial',
 'This route is relevant but narrow.',
 jsonb_build_object(
   'what_it_misses',
   '"Corruption" in the question is not character-bounded. Locating it solely in Claudius makes Denmark an effect rather than a body — you lose the political-theological register that Level 5 answers reach.',
   'upgrade_advice',
   'Keep your Claudius work, but reframe him as the first symptom rather than the origin, so corruption is presented as a condition Denmark already had. This pulls AO3 from "Renaissance kingship" up to "humoral and Reformation political theology", and gives AO5 (Greenblatt) somewhere to land.',
   'ao_diagnosis',
   jsonb_build_array(
     jsonb_build_object('ao', 'AO3', 'note', 'Under-loaded — narrows to Renaissance kingship without humoral or theological depth.'),
     jsonb_build_object('ao', 'AO5', 'note', 'Narrowed to character criticism; Greenblatt has nowhere to land.')
   )
 )
),

-- Path C — wrong
('f0000003-0000-0000-0000-000000000003', 'wrong',
 'This route doesn''t answer the question precisely.',
 jsonb_build_object(
   'mismatch',
   'The question asks about corruption — a state or condition. This route argues revenge — an action. They are adjacent but not equivalent: revenge is one of corruption''s symptoms, not its substance.',
   'what_it_becomes',
   'An essay answering "How does Shakespeare present revenge in Hamlet?" — a different question.',
   'ao_diagnosis',
   jsonb_build_object('ao', 'AO1',
     'note', 'Would lose marks for not addressing the question''s actual concept; the strongest AO2 or AO5 work cannot rescue an off-question AO1.'),
   'redirect',
   'Keep your soliloquy work and your Eliot position, but reframe: revenge is the evidence of Denmark''s corruption, not the cause. That single pivot puts you back on the question.'
 )
),

-- Path D — exam_risk
('f0000004-0000-0000-0000-000000000004', 'exam_risk',
 'This route would produce a low-band answer.',
 jsonb_build_object(
   'exam_danger',
   'Narrative summary disguised as analysis. Act-by-act tracing forces you to retell the plot, which the mark scheme penalises explicitly.',
   'ao_problem',
   jsonb_build_object('ao', 'AO1',
     'descriptor', 'Too vague — the mark scheme reads this as "general comments rather than controlled argument." You will hit Level 2 even if your AO2 work is strong elsewhere, because the structure prevents argument.'),
   'what_it_becomes',
   'A Level 2 to 3 plot summary with critic citations bolted on at the end of each section.',
   'redirect',
   'Replace the chronological spine with a conceptual spine. Three or four ideas about corruption (e.g. somatic, political, theological), each illustrated with non-chronological textual moments.'
 )
);

-- ----------------------------------------------------------------------------
-- 3. The question itself
-- ----------------------------------------------------------------------------

insert into essay_builder_questions (
  id, play_code, question_text, question_year,
  theme_tags, character_focus,
  primary_route_id, secondary_route_id, relevant_aos
) values (
  'b0000001-0000-0000-0000-000000000001',
  'hamlet',
  'Explore Shakespeare''s presentation of corruption in Hamlet.',
  null,
  array['corruption', 'state_decay', 'moral_disease'],
  array['Claudius', 'Hamlet', 'Denmark_as_state'],
  'a0000003-0000-0000-0000-000000000003',  -- H003 primary
  'a0000001-0000-0000-0000-000000000001',  -- H001 secondary
  array['AO1','AO2','AO3','AO5']::ao_code[]
);

-- ----------------------------------------------------------------------------
-- 4. Path options (4 per question — order matters: feedback rows must exist first)
-- ----------------------------------------------------------------------------

insert into essay_path_options (
  id, question_id, path_label, route_id, classification,
  thesis_direction, ao_strengths, ao_weaknesses,
  why_attractive, feedback_id, unlocks_skeleton
) values

-- Path A — correct (H003)
('c0000001-0000-0000-0000-000000000001',
 'b0000001-0000-0000-0000-000000000001',
 'Corruption as somatic and political contagion',
 'a0000003-0000-0000-0000-000000000003',
 'correct',
 'Shakespeare presents corruption as a contagion that crosses the bodily and the political — Denmark is a "rank" body whose moral sickness manifests as state decay.',
 array['AO2','AO3','AO5']::ao_code[],
 array['AO3']::ao_code[],
 'Genuinely the strongest reading — combines AO2 method work with AO3 anchoring.',
 'f0000001-0000-0000-0000-000000000001',
 true),

-- Path B — partial (H001)
('c0000002-0000-0000-0000-000000000002',
 'b0000001-0000-0000-0000-000000000001',
 'Claudius as the source of corruption',
 'a0000001-0000-0000-0000-000000000001',
 'partial',
 'Corruption in Hamlet originates in Claudius''s regicide and spreads outward through the court.',
 array['AO1','AO2']::ao_code[],
 array['AO3','AO5']::ao_code[],
 'Easy structural spine — every paragraph hangs off Claudius.',
 'f0000002-0000-0000-0000-000000000002',
 true),

-- Path C — wrong (H006 — revenge route, wrong here)
('c0000003-0000-0000-0000-000000000003',
 'b0000001-0000-0000-0000-000000000001',
 'Hamlet''s revenge as a corrupting force',
 'a0000006-0000-0000-0000-000000000006',
 'wrong',
 'Hamlet''s pursuit of revenge is itself the corrupting agent in the play.',
 array['AO2','AO5']::ao_code[],
 array['AO1']::ao_code[],
 'Revenge is the most-revised theme; students reach for it under pressure.',
 'f0000003-0000-0000-0000-000000000003',
 false),

-- Path D — exam_risk (no route — structural failure)
('c0000004-0000-0000-0000-000000000004',
 'b0000001-0000-0000-0000-000000000001',
 'Tracing corruption from start to end of the play',
 null,
 'exam_risk',
 'This essay will trace how corruption develops act by act through the play.',
 array['AO1']::ao_code[],
 array['AO1','AO2','AO3','AO5']::ao_code[],
 'Feels safe — covers the whole text, no thesis risk.',
 'f0000004-0000-0000-0000-000000000004',
 false);

-- ----------------------------------------------------------------------------
-- 5. Skeletons (for correct and partial paths only)
-- ----------------------------------------------------------------------------

-- Skeleton for Path A (correct)
insert into essay_skeletons (path_option_id, thesis, paragraphs, conclusion, upgrade_banner)
values (
  'c0000001-0000-0000-0000-000000000001',
  'Shakespeare presents corruption in Hamlet as a contagion that crosses the bodily and the political — Denmark is a diseased body whose moral sickness manifests as state decay, and the play resists any reading that locates corruption in a single agent.',
  jsonb_build_array(
    jsonb_build_object(
      'function', 'Establish corruption as a somatic-political condition that pre-exists Claudius — Denmark is already "rank" before the play begins.',
      'key_quote_ids', jsonb_build_array('hamlet_unweeded_garden', 'hamlet_something_rotten'),
      'ao2_methods', jsonb_build_array('disease imagery', 'somatic metaphor', 'rhetorical antithesis'),
      'ao3_anchor', 'Humoral theory: bodily imbalance as moral and political diagnosis in early modern medical thinking.',
      'ao5_debate', 'Greenblatt: Denmark as a body whose decay precedes individual agency. Use to complicate any character-led reading.',
      'ao4_embed', null
    ),
    jsonb_build_object(
      'function', 'Show how Claudius is a symptom — not the source — of corruption, by reading his rhetoric of euphemism as evidence of an existing diseased political order.',
      'key_quote_ids', jsonb_build_array('claudius_mirth_funeral', 'claudius_offence_rank'),
      'ao2_methods', jsonb_build_array('rhetorical euphemism', 'antithetical doubling', 'controlled blank verse'),
      'ao3_anchor', 'Reformation political theology: the king''s two bodies; the corrupted body politic.',
      'ao5_debate', 'Bradley reads Claudius as the moral centre of the play''s evil. Push back: Bradley is right about the symptom but wrong about the cause.',
      'ao4_embed', null
    ),
    jsonb_build_object(
      'function', 'Examine Hamlet himself as both diagnostician and contaminated — his soliloquies enact corruption''s spread into individual conscience.',
      'key_quote_ids', jsonb_build_array('hamlet_too_too_solid', 'hamlet_native_hue'),
      'ao2_methods', jsonb_build_array('soliloquy as interiority', 'blank verse rupture', 'antithesis between thought and action'),
      'ao3_anchor', 'Reformation anxiety about purgatory and the residue of Catholic theology in Protestant England.',
      'ao5_debate', 'Greenblatt on purgatorial residue; Eliot''s "objective correlative" critique. Use Greenblatt to support, Eliot to test.',
      'ao4_embed', null
    ),
    jsonb_build_object(
      'function', 'Read the play''s closing carnage as the logical endpoint of corruption-as-contagion: no single death cleanses the state because no single agent caused the disease.',
      'key_quote_ids', jsonb_build_array('hamlet_rest_is_silence', 'fortinbras_bodies_high'),
      'ao2_methods', jsonb_build_array('staging of mass death', 'foreign restoration as ironic closure'),
      'ao3_anchor', 'Jacobean political anxiety about succession and dynastic collapse.',
      'ao5_debate', 'Critics divided on whether Fortinbras represents true restoration or merely external takeover. Hold both readings in tension.',
      'ao4_embed', null
    )
  ),
  jsonb_build_object(
    'function', 'Return to the somatic-political thesis and resist a reductive moral closure.',
    'dialectical_move', 'Acknowledge that the play does present individual moral agents (Claudius, Hamlet), but argue that Shakespeare''s most radical move is to make corruption a condition the agents inhabit rather than create.'
  ),
  null
);

-- Skeleton for Path B (partial) — same shape, narrower thesis, with upgrade banner
insert into essay_skeletons (path_option_id, thesis, paragraphs, conclusion, upgrade_banner)
values (
  'c0000002-0000-0000-0000-000000000002',
  'Shakespeare presents corruption in Hamlet as originating in Claudius''s regicide, spreading outward through his rhetoric and his court.',
  jsonb_build_array(
    jsonb_build_object(
      'function', 'Establish Claudius''s regicide as the inciting corruption and the source of the play''s moral disorder.',
      'key_quote_ids', jsonb_build_array('claudius_offence_rank', 'ghost_murder_most_foul'),
      'ao2_methods', jsonb_build_array('rhetorical euphemism', 'controlled blank verse'),
      'ao3_anchor', 'Renaissance theory of kingship: regicide as cosmic disorder.',
      'ao5_debate', 'Bradley: Claudius as the moral centre of the play''s evil.',
      'ao4_embed', null
    ),
    jsonb_build_object(
      'function', 'Show how Claudius''s corruption infects the court — Polonius, Rosencrantz and Guildenstern, Laertes — as instruments of his rule.',
      'key_quote_ids', jsonb_build_array('polonius_loose_daughter', 'rosencrantz_sponge'),
      'ao2_methods', jsonb_build_array('dramatic irony', 'doubling of surveillance figures'),
      'ao3_anchor', 'Jacobean court satire: the corrupted favourite.',
      'ao5_debate', 'Belsey on the court as instrument of patriarchal-political authority.',
      'ao4_embed', null
    ),
    jsonb_build_object(
      'function', 'Trace how Claudius''s corruption reaches Hamlet himself, distorting his moral universe.',
      'key_quote_ids', jsonb_build_array('hamlet_too_too_solid', 'hamlet_native_hue'),
      'ao2_methods', jsonb_build_array('soliloquy', 'antithesis'),
      'ao3_anchor', 'Renaissance debate on melancholy and moral agency.',
      'ao5_debate', 'Eliot''s critique of Hamlet''s emotional excess; counter with Bradley.',
      'ao4_embed', null
    )
  ),
  jsonb_build_object(
    'function', 'Confirm Claudius as the originating agent and the play as a study of how a single corrupt act radiates outward.',
    'dialectical_move', 'Note that the play resists full closure — Hamlet''s death and Fortinbras''s arrival leave the question of whether corruption can ever be fully purged.'
  ),
  'This skeleton is built from a narrower reading — corruption located in Claudius. To upgrade to A* range, reframe Claudius as the first symptom of a condition Denmark already had (somatic-political contagion), not as the origin. See "Corruption as somatic and political contagion" for the stronger route.'
);

commit;

-- ============================================================================
-- End of seed
-- ============================================================================

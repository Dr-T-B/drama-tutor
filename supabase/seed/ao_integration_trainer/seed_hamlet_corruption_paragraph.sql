-- ============================================================================
-- AO Integration Trainer — seed: Hamlet drill
-- Question: Explore Shakespeare's presentation of corruption in Hamlet.
-- Paragraph slot: Paragraph 2 — Claudius's rhetoric of concealment and
-- moral corruption.
-- ============================================================================
-- Run AFTER 0002_ao_integration_trainer.sql.
-- Hamlet drill — AO4 must be null on every option (schema-enforced).
-- Reuses route H001 ('Corruption as moral interiority') from
-- seed_hamlet_corruption.sql — that seed must run first.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Drill
-- ----------------------------------------------------------------------------

insert into ao_integration_drills (
  id, play_code, section, exam_question, paragraph_slot,
  theme_tag, route_id, target_skill, difficulty
) values (
  'bb110001-0000-0000-0000-000000000001',
  'hamlet',
  'SECTION_A',
  'Explore Shakespeare''s presentation of corruption in Hamlet.',
  'Paragraph 2 — Claudius''s rhetoric of concealment and moral corruption.',
  'corruption',
  'a0000001-0000-0000-0000-000000000001',  -- H001 from seed_hamlet_corruption.sql
  'Integrate AO1/AO2/AO3/AO5 inside a paragraph rather than handling them in turns.',
  4
);

-- ----------------------------------------------------------------------------
-- 2. Paragraph options (4)
-- ----------------------------------------------------------------------------

insert into ao_paragraph_options (
  id, drill_id, option_label, paragraph_text, classification, is_best_answer,
  ao1_score, ao2_score, ao3_score, ao4_score, ao5_score,
  integration_score, sequence_score,
  examiner_diagnosis, student_feedback, improvement_instruction
) values

-- ---- A — A* integrated ----------------------------------------------------
('cc110001-0000-0000-0000-000000000001',
 'bb110001-0000-0000-0000-000000000001',
 'A',
 'Claudius''s first public address reveals corruption not as a private vice but as a rhetorical instrument of statecraft, sustaining the political body Hamlet will be unable to purge. The chiastic balance of "With mirth in funeral, and with dirge in marriage" performs the very moral inversion it euphemises: the regal plural "we" elides the agent of regicide into the abstraction of crown, while the concessive admission that Denmark''s "whole kingdom / [is] contracted in one brow of woe" repackages corruption as decorum. Read against the Jacobean rhetoric of equivocation that Garber identifies as the play''s structural anxiety, this language exposes the early modern court''s complicity in its own diseased order. Greenblatt''s argument that Reformation political theology folds the king''s two bodies into a single contaminated frame sharpens the point: Claudius does not speak from a corrupt court, he speaks the court into corruption. The scene''s poise, in other words, is the corruption — and Shakespeare stages eloquence itself as the medium of moral disease.',
 'A_STAR_INTEGRATED', true,
 5, 5, 5, null, 5, 5, 5,
 'A genuinely integrated paragraph. AO1 establishes a precise interpretive claim about corruption-as-rhetoric that controls the whole movement. AO2 (chiasmus, regal plural, concessive syntax) serves as the analytical engine, with AO3 (Jacobean equivocation, Reformation political theology) sharpening the method-based reading rather than running parallel to it. AO5 (Garber, Greenblatt) is dialectical — used to test and refine, not to confirm. The paragraph closes by returning to the question (AO1).',
 'This is the strongest paragraph. AO1 drives the argument; AO2 is the evidence engine; AO3 sharpens the method-based claim; AO5 creates debate; the paragraph returns to the question. The AOs interlock instead of taking turns — that is what an examiner reads as Level 5 integration.',
 'Keep this as the model. Notice how every contextual or critical move is anchored to a textual feature you have already analysed — never the other way round.'),

-- ---- B — AO-in-turns ------------------------------------------------------
('cc110002-0000-0000-0000-000000000002',
 'bb110001-0000-0000-0000-000000000001',
 'B',
 'Claudius''s opening speech is full of euphemism. The phrase "mirth in funeral" is a chiasmus that balances opposites and shows his rhetorical control. This is an example of AO2 method work that demonstrates Shakespeare''s craft. In terms of context, Jacobean audiences would have been familiar with rhetorical equivocation following the Gunpowder Plot trials, which is relevant AO3 background for the play. From an AO5 perspective, Greenblatt argues that the king''s two bodies are folded into a single corrupted frame in Reformation political theology. This critical position supports the reading that the court is corrupt. Therefore Claudius''s speech demonstrates corruption through method, context and critical interpretation.',
 'AO_IN_TURNS', false,
 3, 3, 3, null, 3, 2, 2,
 'The paragraph contains the right ingredients but presents them as separate blocks. Each AO arrives in its own sentence, signposted ("AO2 method work… AO3 background… AO5 perspective…"), and the connections between method, context and critic are never made. The reader can tick each AO but cannot trace a continuous line of reasoning across them. This reads as checklist writing rather than integrated analysis.',
 'You know the ingredients but you have not integrated them. Each AO is correct in isolation; none of them is doing analytical work for the others. This is the mark scheme''s description of a Level 3 / low Level 4 paragraph.',
 'Rewrite so that the context (AO3) is doing work for the method (AO2), and the critic (AO5) is testing the reading rather than confirming it. Delete the explicit AO labels — if you can name the AO in the sentence, it is probably standing alone.'),

-- ---- C — AO3-dominant -----------------------------------------------------
('cc110003-0000-0000-0000-000000000003',
 'bb110001-0000-0000-0000-000000000001',
 'C',
 'Jacobean England in 1603 was preoccupied with the legitimacy of monarchical succession and with the residual anxieties of Reformation political theology. The doctrine of the king''s two bodies, articulated by Kantorowicz and reframed by Greenblatt, held that the monarch''s natural body and political body were inseparable, so that any flaw in the man corrupted the office. Audiences attending the Globe shortly after the Gunpowder Plot would also have associated public eloquence with equivocation, as Garber notes. Within this context, Claudius''s address can be read as embodying the diseased political body. He uses rhetorical figures to maintain power. Phrases such as "mirth in funeral" briefly illustrate the point.',
 'AO_DOMINANT', false,
 3, 2, 5, null, 4, 2, 2,
 'A context-led paragraph. AO3 (Jacobean political theology) and AO5 (Kantorowicz, Greenblatt, Garber) are doing the analytical work; the textual moment is reached only at the end and is treated as illustration rather than as the engine of analysis. The paragraph reads as intelligent but not text-led — the examiner finishes it knowing more about Jacobean theology than about how Shakespeare''s verse stages corruption.',
 'Context has taken over. Your AO3 and AO5 are strong but they have replaced AO2 instead of feeding it. The paragraph is intelligent but the play''s language is no longer the engine of your reading.',
 'Invert the order: open with the textual feature (the chiasmus, the regal plural), let AO3 sharpen what that feature is doing, and let AO5 test the resulting reading. Context should arrive because the text demands it, not before.'),

-- ---- D — AO1 drift / narrative summary -----------------------------------
('cc110004-0000-0000-0000-000000000004',
 'bb110001-0000-0000-0000-000000000001',
 'D',
 'In Act 1 Scene 2, Claudius enters and gives a speech to the court. He has recently married Gertrude, his brother''s widow, and become king of Denmark. He acknowledges the death of the previous king but says that the kingdom must move on. He tells Hamlet to stop mourning, since grief is unmanly and against heaven. He then sends Cornelius and Voltemand to negotiate with Norway, addresses Laertes about returning to France, and concludes by inviting the court to celebrate. This shows that Claudius is corrupt because he is pretending to be a good king while having killed his brother, which is dramatic irony. Shakespeare uses this scene to introduce the theme of corruption to the audience.',
 'NARRATIVE_SUMMARY', false,
 1, 1, 1, null, 1, 1, 1,
 'The paragraph drifts off the question into plot summary. It opens with what the scene contains rather than with an interpretive claim, and "dramatic irony" is named without analysis. There is no precise quotation, no method work, no context, no critic — and the question of corruption is never returned to. The mark scheme reads this as Level 1 / 2: general comments rather than controlled argument.',
 'AO1 has lost control of the paragraph. Once you began retelling Act 1 Scene 2, you stopped answering the question — corruption is mentioned only as a label, not analysed.',
 'Replace the chronological summary with a single interpretive claim about Claudius''s rhetoric, and let every sentence after that justify or test the claim. If you cannot say what the sentence is doing for the argument, delete it.');

commit;

-- ============================================================================
-- End of seed
-- ============================================================================

-- ============================================================================
-- AO Integration Trainer — seed: Duchess of Malfi drill
-- Question: Explore how Webster presents control in The Duchess of Malfi.
-- Paragraph slot: Paragraph 2 — Bosola as instrument of surveillance.
-- ============================================================================
-- Run AFTER 0002_ao_integration_trainer.sql.
-- Duchess drill — AO4 must be non-null on every option (schema-enforced).
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Drill
-- ----------------------------------------------------------------------------

insert into ao_integration_drills (
  id, play_code, section, exam_question, paragraph_slot,
  theme_tag, route_id, target_skill, difficulty
) values (
  'bb110002-0000-0000-0000-000000000002',
  'duchess_of_malfi',
  'SECTION_B',
  'Explore how Webster presents control in The Duchess of Malfi.',
  'Paragraph 2 — Bosola as instrument of surveillance.',
  'control',
  null,
  'Weave AO4 comparison with Hamlet into the paragraph rather than bolting it on at the end.',
  5
);

-- ----------------------------------------------------------------------------
-- 2. Paragraph options (4) — every option must score AO4 (Duchess rule)
-- ----------------------------------------------------------------------------

insert into ao_paragraph_options (
  id, drill_id, option_label, paragraph_text, classification, is_best_answer,
  ao1_score, ao2_score, ao3_score, ao4_score, ao5_score,
  integration_score, sequence_score,
  examiner_diagnosis, student_feedback, improvement_instruction
) values

-- ---- A — A* integrated, AO4 woven ----------------------------------------
('cc220001-0000-0000-0000-000000000001',
 'bb110002-0000-0000-0000-000000000002',
 'A',
 'Webster constructs Bosola as the play''s most disquieting instrument of control because his surveillance is internalised as conscience-laden labour rather than performed as courtly service. The verbs of his self-disclosing aside — "I am your creature" — collapse agent into object, while the financial register of "intelligence" reduces moral observation to wage-work, exposing Ferdinand''s tyranny as a market in souls. Read against the Jacobean fascination with the malcontent figure that Bradbrook identifies, Bosola''s reluctant complicity stages a control more total than the Duke''s: the watcher who hates his watching is the most efficient watcher of all. Belsey''s reading of the early modern subject as a site of competing ideological pressures sharpens this — Bosola''s interiority is not resistance but the very mechanism of his usefulness. The contrast with Hamlet''s Polonius is instructive: where Polonius''s surveillance is comic and self-satisfied, Webster strips the figure of its security and gives the watcher a soul, intensifying the dramatic effect. Tragic power, Webster suggests, operates not by silencing dissent but by recruiting the dissident''s conscience as the principal organ of its own control.',
 'A_STAR_INTEGRATED', true,
 5, 5, 5, 5, 5, 5, 5,
 'A genuinely integrated Section B paragraph. AO1 establishes a precise interpretive claim about reluctant surveillance as a more total form of control. AO2 (verb-noun fusion, financial register, aside) is the analytical engine; AO3 (Jacobean malcontent type) and AO5 (Bradbrook, Belsey) sharpen the method-based reading. AO4 is woven inside the argument — Polonius is compared as dramatic method (comic / self-satisfied surveillance vs reluctant, conscience-laden surveillance), not as plot parallel.',
 'This is the strongest paragraph. Notice how AO4 appears mid-paragraph as part of the analytical move, not as a bolt-on at the end — the Polonius comparison is doing interpretive work for your reading of Webster.',
 'Keep this as the model. The AO4 test is whether deleting the comparison would weaken the analysis of Webster''s methods. Here it would.'),

-- ---- B — AO-in-turns -----------------------------------------------------
('cc220002-0000-0000-0000-000000000002',
 'bb110002-0000-0000-0000-000000000002',
 'B',
 'Bosola is presented as an instrument of surveillance for Ferdinand. He calls himself "your creature," which is a metaphor showing his subjugation — this is good AO2 language analysis of Webster''s noun choice. In the context of Jacobean court life, malcontent figures who served corrupt patrons were a familiar dramatic type, which is relevant AO3 information about the period. From a critical perspective, Bradbrook discusses the malcontent on the Jacobean stage as a vehicle for political critique, a useful AO5 position that supports the reading that Bosola is a critique of court power. Hamlet also has a surveillance figure, Polonius, who spies on Hamlet for Claudius, which is an AO4 connection between the two plays. So the paragraph covers all the assessment objectives.',
 'AO_IN_TURNS', false,
 3, 3, 3, 3, 3, 2, 2,
 'The paragraph contains every required AO but presents them as separate adjacent blocks. Each AO is signposted in its own sentence ("good AO2… relevant AO3… useful AO5… an AO4 connection"). The reader can check off each objective but cannot follow a continuous argument. The Polonius comparison is present but reads as a fifth checkbox, not as a move that interprets Webster.',
 'You have the ingredients — including AO4 — but they take turns. Each AO does its own work and steps aside for the next.',
 'Delete the explicit AO labels. If a sentence still earns its place once unlabelled, it is doing analytical work; if it stops making sense, it was a label, not an argument. Then make the Polonius comparison sharpen the reading of Bosola, not summarise it.'),

-- ---- C — AO4 bolted on ---------------------------------------------------
('cc220003-0000-0000-0000-000000000003',
 'bb110002-0000-0000-0000-000000000002',
 'C',
 'Webster constructs Bosola as the play''s instrument of surveillance, and the verb-noun fusion of "I am your creature" exposes the moral cost of that role. The financial register of "intelligence" reduces moral observation to wage-work, and Webster''s verse stages the malcontent''s reluctant complicity through halting caesuras and the recurring image of the spy as labourer. Bradbrook''s reading of the Jacobean malcontent as a vehicle for political critique sharpens the point: the watcher who hates his watching is the most useful watcher Ferdinand can possess. Belsey extends this — the early modern subject is constituted by the very ideological pressures it appears to resist, so Bosola''s interiority is not the alternative to control but its principal mechanism. This is similar to Hamlet, where Polonius also acts as a spy for Claudius and is killed for his trouble.',
 'AO4_BOLTED_ON', false,
 4, 5, 4, 2, 4, 3, 3,
 'AO1, AO2, AO3 and AO5 work is genuinely strong — the paragraph is text-led and dialectical. The failure is at AO4: comparison appears only in the final sentence, and treats Polonius as a plot parallel ("also acts as a spy", "also is killed") rather than comparing dramatic method or effect. The comparison illustrates rather than interprets, and could be deleted without weakening the analysis of Webster — which is exactly the test it must fail.',
 'AO4 is bolted on. The first four-fifths of the paragraph is Section-A-quality but the comparison is an afterthought that does not shape the reading of Webster''s methods.',
 'Move the comparison up. Use Polonius as a foil mid-paragraph: contrast Webster''s reluctant, conscience-laden surveillance with Shakespeare''s comic, self-satisfied Polonius, so the comparison is doing interpretive work for your reading of Bosola, not appended to it.'),

-- ---- D — Context-dumping / narrative summary ----------------------------
('cc220004-0000-0000-0000-000000000004',
 'bb110002-0000-0000-0000-000000000002',
 'D',
 'The Jacobean period was a time of political instability following the Gunpowder Plot of 1605, and the court of James I was famously corrupt, with the rise of favourites such as the Duke of Buckingham generating widespread satire on the stage. Webster, writing for the King''s Men in around 1612–1614, was part of a tradition of revenge tragedy that included Kyd, Marston and Tourneur, all of whom used surveillance figures to dramatise political mistrust. Within this context, The Duchess of Malfi tells the story of a widowed duchess who secretly marries her steward Antonio against the wishes of her brothers, the Cardinal and Ferdinand. The brothers employ Bosola, a soldier who has previously worked for the Cardinal, to spy on the Duchess and report her movements. He pretends to be her servant and gathers information for them. This is how Webster presents control in the play.',
 'CONTEXT_DUMPING', false,
 1, 1, 4, 1, 1, 1, 1,
 'The paragraph collapses into a context dump followed by plot summary. AO3 is present as background information rather than as a tool of analysis; there is no precise textual analysis (AO2), no critical engagement (AO5), and no comparison with Hamlet (AO4 absent rather than woven). The reader leaves knowing about the Jacobean stage and about the play''s plot but learns nothing about Webster''s dramatic methods.',
 'The paragraph is built from context and plot. There is no analysis of Webster''s language, no critic, and the comparison with Hamlet that Section B requires is missing.',
 'Replace context-as-background with context-as-leverage: open with the textual feature, let AO3 sharpen it, weave AO4 in mid-paragraph, and let AO5 test the resulting reading. Use plot only when it earns its place by anchoring a method.');

commit;

-- ============================================================================
-- End of seed
-- ============================================================================

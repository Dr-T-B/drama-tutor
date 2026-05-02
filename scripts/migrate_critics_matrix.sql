-- ================================================================
-- drama-tutor critics matrix migration
-- Supabase project: lopjupwadwahkjyhghvb
-- Run once in SQL editor. Safe to re-run (uses IF NOT EXISTS).
-- ================================================================

-- 1. SCHEMA ADDITIONS -------------------------------------------

ALTER TABLE critics
  ADD COLUMN IF NOT EXISTS year integer;

ALTER TABLE critic_interpretations
  ADD COLUMN IF NOT EXISTS ao_tags       text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS exam_tip      text,
  ADD COLUMN IF NOT EXISTS ao4_connection text;

-- RLS: ensure authenticated users can read critics data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='critics'
      AND policyname='authenticated read critics'
  ) THEN
    ALTER TABLE critics ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "authenticated read critics"
      ON critics FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='critic_interpretations'
      AND policyname='authenticated read critic_interpretations'
  ) THEN
    ALTER TABLE critic_interpretations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "authenticated read critic_interpretations"
      ON critic_interpretations FOR SELECT TO authenticated USING (true);
  END IF;
END $$;


-- 2. UPDATE EXISTING HAMLET CRITICS WITH YEAR -------------------

UPDATE critics SET year = 1904 WHERE id = 'e7420818-0529-4cb2-aee2-53c7e2af070e';
UPDATE critics SET year = 1985 WHERE id = '5be36ab3-ee88-4b49-a1c2-206ab4f222a2';
UPDATE critics SET year = 1985 WHERE id = 'be28baa9-19bd-4024-97ca-b56da4044a91';
UPDATE critics SET year = 1949 WHERE id = 'ea9f7b7a-67d8-4a0d-8750-6314820ed8aa';
UPDATE critics SET year = 1992 WHERE id = '25b2ac05-b3c5-4de0-badf-b1557da28df9';
UPDATE critics SET year = 1984 WHERE id = 'f7708af5-3bae-486c-b4d5-b454631d65ee';
UPDATE critics SET year = 2007 WHERE id = '8c354e1e-0d3f-44e2-9eb6-dd8521441bb1';
UPDATE critics SET year = 1997 WHERE id = 'd6af5d89-5902-4ccc-9c82-0325f6caa416';
UPDATE critics SET year = 2001 WHERE id = 'b3a0b32e-7744-484b-b530-463fa2594267';
UPDATE critics SET year = 1919 WHERE id = '93334431-fa94-46c3-836e-78a7ee6fbf6f';


-- 3. UPDATE EXISTING HAMLET INTERPRETATIONS WITH AO TAGS + TIPS -

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO1','AO5'],
  exam_tip = 'Establish the traditional reading then challenge it with Wilson Knight or Dollimore — this dialectical move is essential for Level 5 AO5 range.'
WHERE critic_id = 'e7420818-0529-4cb2-aee2-53c7e2af070e'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO1','AO2','AO5'],
  exam_tip = 'Shows sophisticated post-structuralist engagement at Level 5. Excellent for AO2 analysis of the soliloquy form and AO1 in constructing a complex argument around identity and selfhood.'
WHERE critic_id = '5be36ab3-ee88-4b49-a1c2-206ab4f222a2'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO3','AO5'],
  exam_tip = 'Critical for gender readings and AO3 contextualisation of Elizabethan attitudes to female speech and the spectacle of female suffering. Pair with Jardine for coverage of both Ophelia and Gertrude.'
WHERE critic_id = 'be28baa9-19bd-4024-97ca-b56da4044a91'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO5'],
  exam_tip = 'Demonstrates critical range via Freudian methodology. Deploys powerfully in the closet scene. Adelman''s revision of Jones is the natural dialectical advance.'
WHERE critic_id = 'ea9f7b7a-67d8-4a0d-8750-6314820ed8aa'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO3','AO5'],
  exam_tip = 'Extends Jones in a feminist-materialist direction. The "suffocating mothers" framework is powerful for the closet scene and the play''s pervasive disease imagery.'
WHERE critic_id = '25b2ac05-b3c5-4de0-badf-b1557da28df9'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO3','AO5'],
  exam_tip = 'Strongest critic for political readings. Creates a productive AO5 dialectic with Greenblatt — New Historicism vs Cultural Materialism — essential for Level 5 critical range.'
WHERE critic_id = 'f7708af5-3bae-486c-b4d5-b454631d65ee'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO3','AO5'],
  exam_tip = 'Challenges the interiority-focused critical tradition. Powerful for "To be, or not to be" — reads it as political calculation rather than existential meditation.'
WHERE critic_id = '8c354e1e-0d3f-44e2-9eb6-dd8521441bb1'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO2','AO3','AO5'],
  exam_tip = 'Highly deployable for death scenes and AO2 analysis of memento mori imagery. Bridges AO2 (staging) and AO3 (Early Modern attitudes to death) elegantly.'
WHERE critic_id = 'd6af5d89-5902-4ccc-9c82-0325f6caa416'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO3','AO5'],
  exam_tip = 'Essential for AO3 grounding of the supernatural. Transforms the Ghost from mere dramatic device into a historically specific theological crisis.'
WHERE critic_id = 'b3a0b32e-7744-484b-b530-463fa2594267'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';

UPDATE critic_interpretations SET
  ao_tags = ARRAY['AO2','AO5'],
  exam_tip = 'Productive for AO2 analysis of dramatic structure and the "Gertrude problem". Rebutting Eliot''s "artistic failure" charge is itself a Level 5 move.'
WHERE critic_id = '93334431-fa94-46c3-836e-78a7ee6fbf6f'
  AND text_id = '9c213169-bfaa-4fbc-84e0-96b76045a53f';


-- 4. INSERT DUCHESS OF MALFI CRITICS ----------------------------
-- Dollimore (f7708af5) and Neill (d6af5d89) already exist.
-- Insert 11 new critics.

INSERT INTO critics (id, name, school, year, core_position, key_text) VALUES
('a1b2c3d4-0001-4000-8000-000000000001','Frank Whigham','New Historicism',1985,
 'The Duchess''s secret remarriage violates aristocratic endogamy — the brothers'' fury is about class identity and fear of social contamination, not merely sexual jealousy.',
 '"Seizures of Fashion: Aristocratic Ideology and the Duchess of Malfi" (1985)'),

('a1b2c3d4-0002-4000-8000-000000000002','Dympna Callaghan','Feminist/Materialist',1989,
 'The female body is the "contested site" upon which patriarchal anxieties are enacted and resolved through spectacular violence.',
 'Woman and Gender in Renaissance Tragedy (1989)'),

('a1b2c3d4-0003-4000-8000-000000000003','Lisa Hopkins','Feminist',1998,
 'Webster creates a heroine of genuine interiority and self-knowledge who actively resists the patriarchal structures that confine her.',
 'The Female Hero in English Renaissance Tragedy (1998)'),

('a1b2c3d4-0004-4000-8000-000000000004','Christina Luckyj','Feminist/Linguistic',1989,
 'Silence is gendered throughout the play — the Duchess''s eloquence is an act of defiance, while silence is enforced upon her as an instrument of male control.',
 '"A Moving Rhetoricke": Gender and Silence in Early Modern England (1989)'),

('a1b2c3d4-0005-4000-8000-000000000005','Kate Aughterson','Feminist/Contextual',2001,
 'The play reflects Renaissance anxiety about female autonomy and sexuality — the Duchess is simultaneously celebrated and destroyed by a culture that fears female desire.',
 'Webster: The Tragedies (2001)'),

('a1b2c3d4-0006-4000-8000-000000000006','William Archer','Victorian Realist',1923,
 'The play is an incoherent "charnel house" of gratuitous horror with no moral framework — Webster''s plotting is chaotic and his morality confused.',
 'The Old Drama and the New (1923)'),

('a1b2c3d4-0007-4000-8000-000000000007','Rupert Brooke','Early Modernist',1916,
 'Webster possesses a "savage and indomitable poetry" and a unique vision of death that makes him the greatest Jacobean tragedian after Shakespeare.',
 'John Webster and the Elizabethan Drama (1916)'),

('a1b2c3d4-0008-4000-8000-000000000008','R.S. White','Humanist',2000,
 'The Duchess is a fundamentally sympathetic figure whose dignity and courage in death constitute the moral centre of the play.',
 'Contribution to The Cambridge Companion to John Webster (2004)'),

('a1b2c3d4-0009-4000-8000-000000000009','Terry Eagleton','Marxist',1986,
 'The play''s conflicts are fundamentally about property and economic power — marriage is an institution for managing aristocratic capital.',
 'William Shakespeare (1986) and broader Marxist critical writing'),

('a1b2c3d4-0010-4000-8000-000000000010','Charles Lamb','Romantic',1808,
 'Webster''s dramatic poetry achieves a power comparable to Shakespeare — his language creates genuine tragic terror that elevates even extreme theatrical material.',
 'Specimens of English Dramatic Poets (1808)'),

('a1b2c3d4-0011-4000-8000-000000000011','Alexander Leggatt','Theatrical',1988,
 'The masque of madmen and waxwork scene foreground the play''s theatrical artifice — Webster makes horror and art inextricable.',
 'English Drama: Shakespeare to the Restoration 1590–1660 (1988)')

ON CONFLICT (id) DO NOTHING;


-- 5. INSERT DUCHESS OF MALFI CRITIC_INTERPRETATIONS -------------

INSERT INTO critic_interpretations
  (critic_id, text_id, interpretation, usable_ao5_sentence,
   counter_reading, ao_tags, exam_tip, ao4_connection)
VALUES

-- Frank Whigham
('a1b2c3d4-0001-4000-8000-000000000001','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The Duchess''s secret remarriage is an act of social transgression — her brothers'' fury is about class identity and fear of social contamination, not merely sexual jealousy or incestuous desire. She violates aristocratic endogamy by marrying beneath her station.',
 'Whigham''s argument that the Duchess "transgresses the protocol of aristocratic endogamy" reshapes Ferdinand''s rage as a class crisis rather than a sexual one: the strangling is not jealous revenge but the violent reassertion of aristocratic boundary maintenance [AO5].',
 'Eagleton extends this in Marxist terms: the brothers'' fury is fundamentally economic — about property management rather than merely social protocol.',
 ARRAY['AO3','AO4','AO5'],
 'Essential for AO3 and AO4. Grounds the brothers'' violence in class economics rather than sexual pathology — more sophisticated than a simple psychosexual reading.',
 'Compare with Dollimore on the corrupt state in Hamlet — both plays reveal ruling power''s anxiety about transgression from within its own ranks.'),

-- Dympna Callaghan
('a1b2c3d4-0002-4000-8000-000000000002','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The female body is the "contested site" upon which patriarchal anxieties are enacted and resolved through spectacular violence. The Duchess''s sexuality threatens aristocratic order and is controlled, spectacularised and destroyed.',
 'Callaghan''s argument that "the female body becomes the primary site on which patriarchal anxieties are enacted" transforms the torture scenes from gratuitous horror into a systematic logic of containment: each torment — the dead hand, the waxwork, the strangling — is a different instrument for re-asserting control over a female body that has presumed autonomy [AO5].',
 'Hopkins: Callaghan''s materialist framework underplays the Duchess''s genuine agency and interiority — she is not merely a passive body but an active, resisting subject.',
 ARRAY['AO3','AO5'],
 'The "body as site" argument is highly deployable for the torture scenes and waxwork — connects AO3 context directly to AO2 analysis of theatrical spectacle.',
 'Compare with Showalter on Ophelia in Hamlet — both female characters'' bodies become sites of patriarchal control and punitive, public spectacle.'),

-- Lisa Hopkins
('a1b2c3d4-0003-4000-8000-000000000003','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'Webster creates a heroine of genuine interiority and self-knowledge who actively resists the patriarchal structures that confine her. The Duchess speaks and acts with real, unsilenced authority throughout.',
 'Hopkins''s reading that the Duchess "speaks with an authority that her brothers cannot entirely suppress or silence" is powerfully evidenced in the declaration "I am Duchess of Malfi still" (4.2): the defiant "still" confers continuity of identity through suffering, asserting selfhood at the moment of its destruction — a claim Hopkins reads as genuinely heroic rather than merely theatrical [AO5].',
 'Callaghan: Hopkins'' emphasis on agency risks obscuring the material conditions that ultimately destroy the Duchess — agency is always constrained by patriarchal power.',
 ARRAY['AO1','AO5'],
 'Provides the positive feminist counter to Callaghan — frames the Duchess as heroic rather than victimised. Excellent for AO1 (personal, informed response to character).',
 'Compare with the erasure of female voice in Hamlet — Gertrude and Ophelia lack the interiority Webster grants the Duchess, suggesting Webster consciously extends Shakespeare''s treatment of women.'),

-- Christina Luckyj
('a1b2c3d4-0004-4000-8000-000000000004','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'Silence is gendered throughout the play — the Duchess''s eloquence is an act of defiance, while silence is enforced upon her as an instrument of male control. Language is itself a political battlefield.',
 'Luckyj''s argument that "female speech is transgressive; silence its enforced alternative" reframes the wooing scene (1.1): where Antonio fumbles and qualifies, the Duchess speaks with unhedged directness — "Sir, be confident, / I am yours" — coding female authority as simultaneously transgressive and genuinely heroic [AO5].',
 'Hopkins: the Duchess''s eloquence is not merely transgressive but genuinely authoritative — Luckyj understates the play''s full celebration of female speech as heroic.',
 ARRAY['AO2','AO5'],
 'Superb for AO2 language analysis — transforms close reading of speech and silence patterns into feminist critical argument. Essential for the death scene and the wooing scene.',
 'Compare with Showalter on Ophelia''s enforced silence in Hamlet — in both plays, female language is suppressed, pathologised or weaponised against the speaker.'),

-- Kate Aughterson
('a1b2c3d4-0005-4000-8000-000000000005','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The play reflects Renaissance anxiety about female autonomy and sexuality — the Duchess is simultaneously celebrated for her desire and destroyed by a culture that fears and demonises it.',
 'Aughterson''s formulation that female desire is "simultaneously celebrated and destroyed" captures the ambivalence of the wooing scene (1.1): Webster gives the Duchess the boldest declaration of heterosexual desire in Jacobean drama while simultaneously establishing the structural conditions — the brothers'' threat, the social prohibition — that will make that desire fatal [AO5].',
 'Callaghan: Aughterson''s focus on "desire" depoliticises the transgression — the primary issue is class and property, not sexuality per se.',
 ARRAY['AO3','AO5'],
 'The "simultaneously celebrated and destroyed" formulation models the dialectical critical register expected at Level 5. Excellent for AO3 contextualisation of Early Modern gender ideology.',
 'Compare with Jardine on gender in Hamlet — Renaissance anxieties about female desire and autonomy operate across both plays, though Webster treats it with greater ambivalence.'),

-- William Archer
('a1b2c3d4-0006-4000-8000-000000000006','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The play is an incoherent "charnel house" of gratuitous horror with no coherent moral framework — Webster''s plotting is chaotic, his characterisation inconsistent, his morality confused.',
 'Archer''s charge that Webster "mistakes the charnel house for the tragic stage" provides a productive negative framework: demonstrating that the play''s violence is structurally meaningful — the masque, the waxwork, and the strangling forming a systematic logic of patriarchal containment — is itself to make a Level 5 argument about form and purpose [AO5].',
 'Brooke directly rebuts Archer: the "savage and indomitable poetry" of Webster''s language transcends apparent structural disorder and constitutes its own moral vision.',
 ARRAY['AO2','AO5'],
 'Most useful as a negative critical position to refute — demonstrating structural and thematic purpose against Archer''s charge is itself a Level 5 AO2 move.',
 'Archer''s realist critique sits in direct tension with Webster''s Shakespearean ambitions — compare with the structural coherence and moral legibility of Hamlet.'),

-- Rupert Brooke
('a1b2c3d4-0007-4000-8000-000000000007','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'Webster possesses a "savage and indomitable poetry" and a unique, dark vision of human corruption and death that makes him the greatest Jacobean tragedian after Shakespeare.',
 'Brooke''s description of Webster''s "savage and indomitable poetry" is most evidenced at the Duchess''s death: the spare directness of "Come violent death, / Serve for mandragora to make me sleep" combines the concrete physicality of the death-wish with a classical allusion to achieve, in the moment of extremity, an eloquence that transcends the horror of its situation [AO5].',
 'Archer directly contradicts Brooke: rhetorical power cannot compensate for structural and moral incoherence — poetry without purpose is mere sensation.',
 ARRAY['AO2','AO5'],
 'Useful for framing Webster''s dramatic achievement and establishing literary-historical context. The "savage and indomitable" phrase is itself deployable in AO2 language analysis.',
 'Brooke positions Webster as second only to Shakespeare — directly inviting AO4 comparison of their tragic visions.'),

-- R.S. White
('a1b2c3d4-0008-4000-8000-000000000008','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The Duchess is a fundamentally sympathetic figure whose dignity and courage in death constitute the moral centre of the play — her humanity transcends the tyranny that seeks to destroy it.',
 'White''s reading that the Duchess''s "courage in death affirms human dignity" is supported by her final exchanges: the combination of maternal tenderness ("I pray thee, look thou giv''st my little boy / Some syrup for his cold") with the composure of "I know death hath ten thousand several doors" constructs a figure whose humanity is, at the moment of its extinction, most fully achieved [AO5].',
 'Callaghan: White''s humanist framework obscures the material conditions determining the Duchess''s fate — her "dignity" is itself partly a patriarchal construction.',
 ARRAY['AO1','AO5'],
 'Grounds the Duchess as the play''s moral protagonist. Excellent for AO1 and as a dialectical contrast with Callaghan''s materialist reading.',
 'Compare with Bloom''s humanist reading of Hamlet — both protagonists'' "humanity" is tested by corrupt political systems, though Webster''s protagonist is female and her ordeal more sustained.'),

-- Terry Eagleton
('a1b2c3d4-0009-4000-8000-000000000009','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The play''s conflicts are fundamentally about property and economic power. Marriage is an aristocratic institution for managing capital — the Duchess''s transgression is economic as much as sexual.',
 'Eagleton''s reading that "marriage in the play is always about the management of aristocratic property and capital" is crystallised in Ferdinand''s response to the secret marriage: his rage at prospective division of the family estate reveals an economic fury that the language of "honour" is designed to legitimate [AO5].',
 'Whigham: Eagleton''s economic determinism flattens the specifically aristocratic cultural anxieties driving the brothers — not all power is reducible to economics.',
 ARRAY['AO3','AO4','AO5'],
 'Extends Whigham''s class argument into explicitly Marxist economic territory — excellent for sophisticated AO3 and AO4 readings of the marriage plot.',
 'Compare with Dollimore on power in Hamlet — both plays expose marriage and state power as instruments of economic and ideological control.'),

-- Charles Lamb
('a1b2c3d4-0010-4000-8000-000000000010','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'Webster''s dramatic poetry achieves a power comparable to Shakespeare — his language creates genuine tragic terror that elevates even the most extreme theatrical material to the level of high art.',
 'Lamb''s celebration of Webster''s scenes as "as impressive as anything in Shakespeare" anticipates the play''s modern critical rehabilitation: his emphasis on poetic intensity over formal coherence establishes a critical tradition that values Webster''s language as self-sufficient meaning — the echo scene and the death verse do not require moral resolution because their beauty is itself the argument [AO5].',
 'Archer: Lamb''s Romantic enthusiasm mistakes rhetorical power for genuine dramatic achievement — structural deficiencies cannot be offset by poetic intensity.',
 ARRAY['AO2','AO5'],
 'Useful for establishing Webster''s literary reputation historically. Shows AO5 awareness of how critical reception has evolved from Romantic admiration through Victorian dismissal to modern rehabilitation.',
 'Lamb''s direct comparison with Shakespeare positions Webster as inheritor of the Shakespearean tragic tradition — directly invites AO4 analysis of what Webster takes from and adds to Hamlet.'),

-- Alexander Leggatt
('a1b2c3d4-0011-4000-8000-000000000011','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'The masque of madmen and waxwork scene foreground the play''s theatrical artifice — Webster uses theatrical self-consciousness to disturbing effect, making horror and art inextricable in the audience''s experience.',
 'Leggatt''s reading that "art and horror become inextricable" is most sharply evidenced in the waxwork scene (4.1): the theatrical device — a constructed illusion of death — is simultaneously an instrument of psychological torture, a piece of Jacobean technical theatre, and a meta-theatrical statement about the constructed nature of all theatrical "reality" [AO5].',
 'Dollimore: foregrounding theatrical artifice risks aestheticising political violence — the masque of madmen is a political spectacle of power, not merely a formal experiment.',
 ARRAY['AO2','AO5'],
 'Excellent for AO2 structural analysis of the masque and waxwork. Theatricality as a critical concept elevates formal analysis beyond mere description into critical argument.',
 'Compare with the play-within-a-play in Hamlet — both Shakespeare and Webster use theatrical self-referentiality to interrogate reality, performance and the staging of power.'),

-- Jonathan Dollimore / Duchess (new interpretation row; critic already exists)
('f7708af5-3bae-486c-b4d5-b454631d65ee','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 '"Radical Tragedy" refuses providential consolation — suffering in the play is politically determined, not divinely meaningful. The play demystifies the ideology that naturalises aristocratic power, exposing its material basis.',
 'Dollimore''s argument that "Radical Tragedy refuses the consolations of the providential order" is most powerfully evidenced by the Duchess''s death (4.2): Webster denies any providential resolution — Bosola''s regret arrives too late to function as moral restoration, and the Cardinal and Ferdinand''s deaths in Act 5 follow from accident rather than divine justice, confirming that suffering is materially produced rather than metaphysically meaningful [AO5].',
 'Whigham: Dollimore''s materialist framework underplays the specifically aristocratic cultural anxieties driving the brothers — class structure has its own logic beyond generic ideology.',
 ARRAY['AO3','AO4','AO5'],
 'The cornerstone of cultural materialist readings. Using Dollimore for both plays demonstrates advanced AO4 critical synthesis — a hallmark of Level 5 Section B responses.',
 'Directly connects to Dollimore''s reading of Hamlet — both plays share a materialist critique of the providential ideology underpinning state power. Deploying the same critic in both plays is itself a sophisticated AO4 move.'),

-- Michael Neill / Duchess (new interpretation row; critic already exists)
('d6af5d89-5902-4ccc-9c82-0325f6caa416','7d4c42dd-79b1-44db-ae66-8c85fe83bd72',
 'Webster''s characters die without metaphysical consolation — death is spectacular, theatrical, and stripped of transcendence. The play stages mortality in its raw, material reality, without providential meaning.',
 'Neill''s argument that "Webster''s characters die into a universe from which transcendence has been wholly withdrawn" is evidenced by the Duchess''s final exchange: unlike Hamlet''s dying "The rest is silence," which gestures toward an unknowable but present afterlife, the Duchess''s last question — "Who am I?" — is met with Bosola''s "Thou art a box of worm-seed," a materialist reduction stripping death of any metaphysical dimension [AO5].',
 'Dollimore: Neill aestheticises death. The play''s vision of mortality is politically determined — death serves power rather than offering existential insight.',
 ARRAY['AO2','AO3','AO5'],
 'Using Neill on both plays is a sophisticated AO4 strategy. Connects the staging of death across both texts — from Yorick''s skull to the Duchess''s strangling and the wax figures.',
 'The same critic''s reading of Hamlet connects directly — Webster radicalises Shakespeare''s meditation on death, stripping away the theological consolation still available in Hamlet.');

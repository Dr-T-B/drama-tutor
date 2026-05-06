Build an AO Integration Trainer inside my Drama-tutor Essay Builder app.

Project:
A Level English Literature Component 1: Drama
Exam board: Pearson Edexcel
Texts:
- Hamlet by William Shakespeare, Section A
- The Duchess of Malfi by John Webster, Section B
Exam date:
11/05/2026
Student profile:
High-performing Level 4 / Level 5 student targeting A/A*.

Feature:
Essay Builder — AO Integration Trainer

Purpose:
The student’s problem is not simply knowing the Assessment Objectives. The problem is integrating the AOs inside paragraphs in the correct analytical sequence. The app should train the student to recognise, diagnose, and build paragraphs where AO1, AO2, AO3, AO5, and Duchess-only AO4 are woven into argument rather than bolted on.

Core diagnosis:
The trainer must address five common paragraph-level failures:

1. AOs appear in turns
The paragraph does AO2, then AO3, then AO5 as separate blocks. This reads as checklist writing rather than integrated analysis.

2. One AO dominates
One paragraph becomes AO2-heavy, another AO3-heavy, another AO5-heavy. Coverage exists across the essay, but the paragraphs are unbalanced.

3. AOs appear in the wrong order
Context appears before method, or critic appears before textual evidence. This makes the paragraph context-led or critic-led instead of text-led.

4. AO4 is bolted on
For The Duchess of Malfi only, comparison with Hamlet appears as an afterthought, usually at the end of a paragraph. The app must train continuous comparison, not bolt-on comparison.

5. AO1 drift
The paragraph begins with an argument but then loses control. It moves into local analysis without returning to the question or thesis.

Feature design:
Build this as a paragraph-level drill, not a full essay generator. Essay Builder remains the macro feature; AO Integration Trainer is the micro feature.

MVP priority:
Build Mode C first: Detect Failure.

Reason:
Mode C reuses the same four-card logic as the Essay Route Builder, but applies it to paragraphs instead of essay paths. It is the fastest and most useful MVP for exam preparation.

Required Mode C behaviour:
The student is shown:
- one exam question
- one paragraph slot
- four paragraph versions

The four paragraph versions should be:

Version A:
A* integrated paragraph.
AO1 drives the argument.
AO2 is used as the central evidence engine.
AO3 sharpens the interpretation.
AO5 creates debate.
For Duchess only, AO4 is woven into the paragraph rather than bolted on.

Version B:
AO-in-turns paragraph.
The paragraph contains the AOs, but they appear as separate blocks. The feedback should explain that the paragraph knows the ingredients but does not integrate them.

Version C:
AO3-dominant or AO5-dominant paragraph.
The paragraph may sound intelligent but is not text-led. The feedback should explain that context or criticism has taken control of the paragraph.

Version D:
Exam-risk paragraph.
For Hamlet, this may be narrative summary, vague theme discussion, critic name-dropping, or thin AO2.
For Duchess, this may be AO4 bolted on at the end, forced comparison, or a paragraph that mentions Hamlet without comparing dramatic method or effect.

Student task:
The student must select the strongest paragraph.

After selection:
The app gives diagnostic feedback:
- whether the choice is correct, partially correct, or wrong
- why the selected paragraph works or fails
- which AO is strongest
- which AO is weakest
- whether the AO sequence is integrated
- how to improve the paragraph
- what an examiner would notice

AO rules:
For Hamlet Section A:
Use AO1, AO2, AO3, AO5.
Do not include AO4.
Never display AO4 prompts, AO4 feedback, or AO4 scoring for Hamlet.

For The Duchess of Malfi Section B:
Use AO1, AO2, AO3, AO4, AO5.
AO4 must be explicit but integrated.
AO4 should compare Webster’s dramatic methods and effects with Hamlet. It must not appear as a final bolt-on sentence.

Paragraph sequence model:
The app should teach this preferred high-grade paragraph sequence:

1. AO1: precise argument answering the question
2. AO2: textual/dramatic method as the evidence engine
3. AO3: context used to sharpen the method-based claim
4. AO5: critical debate or alternative reading
5. AO1 return: mini-judgement that returns to the question
6. Duchess only: AO4 comparison woven after AO2 or AO3, not bolted on at the end

The app should also explain that this is not a rigid formula. Strong paragraphs may vary, but they must remain text-led and argument-driven.

Supabase data model:
Design or extend the database to support this feature.

Required tables:

1. ao_integration_drills
Fields:
- id
- text_id
- section
- exam_question
- paragraph_slot
- theme_id
- route_id
- target_skill
- difficulty
- created_at
- updated_at

2. ao_paragraph_options
Fields:
- id
- drill_id
- option_label
- paragraph_text
- classification
- is_best_answer
- ao1_score
- ao2_score
- ao3_score
- ao4_score nullable
- ao5_score
- integration_score
- sequence_score
- examiner_diagnosis
- student_feedback
- improvement_instruction
- created_at
- updated_at

3. ao_integration_attempts
Fields:
- id
- user_id
- drill_id
- selected_option_id
- is_correct
- attempt_no
- feedback_shown
- created_at

Classification values:
- A_STAR_INTEGRATED
- AO_IN_TURNS
- AO_DOMINANT
- WRONG_ORDER
- AO4_BOLTED_ON
- AO1_DRIFT
- NARRATIVE_SUMMARY
- CRITIC_NAME_DROPPING
- CONTEXT_DUMPING

TypeScript types:
Create types for:
- AOIntegrationDrill
- AOParagraphOption
- AOIntegrationAttempt
- ParagraphClassification
- AOScore
- PlayCode
- SectionCode
- AOCode

React UI:
Create a page or component:

src/pages/AOIntegrationTrainer.tsx

UI flow:
1. Student selects text: Hamlet or The Duchess of Malfi.
2. Student selects drill or receives the next recommended drill.
3. App displays exam question and paragraph slot.
4. App displays four paragraph cards.
5. Student selects strongest paragraph.
6. App reveals feedback.
7. App highlights:
   - AO1 claim
   - AO2 method
   - AO3 context
   - AO5 debate
   - AO4 comparison for Duchess only
8. App offers:
   - Try another drill
   - Show improved version
   - Build my own paragraph
   - Save result

Feedback design:
For correct selection:
Confirm why it is strongest.
Identify the AO sequence.
Explain why the paragraph would read as Level 5.

For AO-in-turns selection:
Explain that the paragraph contains relevant material but handles the AOs as separate blocks rather than woven argument.

For AO3-dominant selection:
Explain that the paragraph is context-led and does not use textual method as the analytical engine.

For AO5-dominant selection:
Explain that the critic has replaced the student’s argument.

For AO4-bolted-on selection:
Duchess only. Explain that the comparison appears as an afterthought and does not shape the interpretation of Webster’s methods.

For AO1 drift:
Explain where the paragraph loses its thesis and how to return to the question.

Worked Hamlet drill:
Question:
Explore Shakespeare’s presentation of corruption in Hamlet.

Paragraph slot:
Paragraph 2 — Claudius’s rhetoric of concealment and moral corruption.

Create four paragraph options:
A. A* integrated paragraph
B. AO-in-turns paragraph
C. AO3-dominant paragraph
D. AO1 drift / narrative summary paragraph

Do not include AO4.

Worked Duchess drill:
Question:
Explore how Webster presents control in The Duchess of Malfi.

Paragraph slot:
Paragraph 2 — Bosola as instrument of surveillance.

Create four paragraph options:
A. A* integrated paragraph with woven AO4 comparison
B. AO-in-turns paragraph
C. AO4-bolted-on paragraph
D. Context-dumping or narrative-summary paragraph

Include AO4 explicitly.

Definition of done:
The feature is complete when:
- the student can select a drill
- four paragraph versions appear
- the student chooses the strongest paragraph
- the app gives diagnostic feedback
- the feedback explains AO integration, not just correctness
- Hamlet excludes AO4
- Duchess includes AO4
- attempts are saved
- the feature can later connect to Essay Builder and the Question Router
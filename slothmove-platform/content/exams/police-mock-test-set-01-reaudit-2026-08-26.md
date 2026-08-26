# Police Mock Test Set 01 - Independent Re-audit

Date: 2026-08-26

## Verdict

**NEEDS FIX - NOT READY TO PUBLISH**

The supplied external audit is materially correct. The current 150-question payload passes structural validation, but it does not yet pass content-selection and learning-quality review.

## Independently Confirmed Findings

### Publish blockers

1. Computer Q71-Q80 are exact duplicates of Q41-Q50. The source question IDs repeat with `sourceOccurrence: 2`.
2. Thai Q21-Q40 use source positions 1-20 only. Those 20 questions are all reading/interpretation questions; the language portion of the source bank is absent.
3. Saraban Q81-Q110 use source positions 1-30 only. The receive/send/store/borrow/destroy and electronic-document blocks at the end of the source bank are absent.
4. Law Q111-Q135 use source positions 1-25 only. Criminal, consumer-protection, and civil-registration topics at the end of the source bank are absent.
5. English Q136-Q150 use source positions 1-15 only: Conversation 6, Vocabulary 6, Reading 3, Grammar 0.
6. Saraban Q106 is ambiguous as written. As a general rule, the last two digits mean `สำนัก กอง หรือส่วนราชการที่มีฐานะเทียบกอง`, not only `กอง`. The answer `กอง` can be retained only if an authoritative source confirms that the specific historical code `นร 0106` belonged to a division at the relevant date; that evidence is not included in the item.
7. Saraban Q109 is under-specified. The first-version/no-version-number rule needs to identify the document type. The cited rule applies to `ระเบียบ`; the same pattern also appears separately for `ข้อบังคับ`.

### Major fixes

1. Computer Q67 has a best answer relative to its current distractors, but its explanation is outdated. Current NIST guidance prioritizes length, blocklists, rate limiting, password managers, and non-reuse; it explicitly rejects mandatory character-composition rules. A single-factor password must be at least 15 characters under SP 800-63B-4.
2. Math uses the first 20 of a 30-question source bank. This is not an answer-key defect, but it is a selection-quality defect because all tail categories are excluded.
3. Twelve negative-prompt tips repeat the false/non-matching choice without an explicit polarity label: Q85, Q93, Q94, Q102, Q104, Q109, Q113, Q115, Q120, Q128, Q132, and Q134. Their answer keys are not shown to be wrong, but the tips can teach the false statement as a fact.

### Schema and metadata

1. The payload uses zero-based `correctChoiceIndex`, and all 150 indices are structurally valid. This is not a runtime defect by itself, but `qualityNotes.correctChoiceIndexBase = 0` should be declared because some source packages used one-based indices before conversion.
2. The policy text says every subject came from Set 1, while math uses the internal ID `police-math-set-04`. This is explainable by the product-facing set number, but the metadata should describe the configured source ID explicitly.

## Validation Results

- Total questions: 150
- Subject allocation: 20 / 20 / 40 / 30 / 25 / 15, as requested
- Duplicate prompt groups: 10, all caused by Computer Q71-Q80
- Invalid answer indices: 0
- Missing prompt, choices, explanation, or tip: 0 in the existing structural audit
- Confirmed answer-key defects in the external audit: none
- Confirmed content/ambiguity defects requiring question edits: Q67 and Q109; Q106 requires either authoritative code-specific evidence or revised wording/choices
- Confirmed learning-copy defects requiring tip edits: 12 questions

## Recommended Rebuild Allocation

- Math 20: stratified selection from all 30 source questions
- Thai 20: Reading 8, Language 12
- Computer 40: retain 30 source questions and add 10 unique audited questions; no exact repeats
- Saraban 30: approximately A 12, B 10, C 5, D 3
- Law 25: approximately General/Admin 4, Constitution/Court/Education 4, Civil 9, Criminal 6, Consumer/Registration 2
- English 15: Conversation 3, Vocabulary 3, Reading 3, Grammar 6

## Source Checks

- NIST SP 800-63B-4: https://pages.nist.gov/800-63-4/sp800-63b.html
- Thai government document, owner-number appendix: https://www.sungaipadee.go.th/dnm_file/project/1405140_center.pdf
- Thai government document, correspondence regulation: https://www.pcd.go.th/wp-content/uploads/2020/11/pcdnew-2020-11-17_02-36-59_117242.pdf

## Re-audit Decision

The external report should be accepted as the correction baseline. Before sale, rebuild the selection, replace the ten computer duplicates, edit Q67/Q106/Q109, normalize the twelve polarity-sensitive tips, declare the answer-index base, then run another full structural and content audit.

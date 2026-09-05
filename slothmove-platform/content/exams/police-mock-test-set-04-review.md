# Review: Mock Test Set 04 and Mini Mock Set 02

Reviewed: 2026-09-05

## Round 2 status

Completed on 2026-09-05:

- Question 145 now uses plain text: `S + is/am/are + V-ing`.
- All 180 records across Mock Test 04 and Mini Mock 02 now use `easy`, `medium`, or `hard` only.
- Mini Mock 02 description, landing-page CTA, page metadata, and post-completion offer disclose that it is a 30-question sample from Mock Test 04.
- The only image media asset, Mock Test 04 Question 142's no-U-turn sign, was loaded from the app at HTTP 200 and visually checked in a browser.

## Verdict

- Mock Test Set 04: 150 questions, complete subject blueprint, no exact prompt duplicates within the set, and no exact prompt duplicates against Mock Test Sets 01-03.
- Mini Mock Set 02: 30 questions, all copied intentionally from Mock Test Set 04 as a free sample.
- Do not change the question bank before deciding whether the Mini Mock should remain a sample of Set 04. The product/UI wording must make that relationship explicit.

## Exact duplicates

There are no exact duplicate prompts within Mock Test Set 04 and none between Mock Test Set 04 and Mock Test Sets 01-03.

Every Mini Mock Set 02 question is an exact copy of a question in Mock Test Set 04. The `sourceExamSetId` field records this deliberately.

| Mini Mock 02 | Mock Test 04 | Subject |
| --- | --- | --- |
| 1 | 1 | Math |
| 2 | 6 | Math |
| 3 | 11 | Math |
| 4 | 16 | Math |
| 5 | 21 | Thai |
| 6 | 26 | Thai |
| 7 | 31 | Thai |
| 8 | 36 | Thai |
| 9 | 42 | Computer |
| 10 | 47 | Computer |
| 11 | 52 | Computer |
| 12 | 57 | Computer |
| 13 | 62 | Computer |
| 14 | 67 | Computer |
| 15 | 72 | Computer |
| 16 | 77 | Computer |
| 17 | 82 | Saraban |
| 18 | 87 | Saraban |
| 19 | 92 | Saraban |
| 20 | 97 | Saraban |
| 21 | 102 | Saraban |
| 22 | 107 | Saraban |
| 23 | 115 | Law |
| 24 | 120 | Law |
| 25 | 125 | Law |
| 26 | 130 | Law |
| 27 | 135 | Law |
| 28 | 136 | English |
| 29 | 141 | English |
| 30 | 146 | English |

Implication: someone who completes Mini Mock 02 has already seen 30 of the 150 questions in paid Set 04. The paid set therefore has 120 unseen questions for that person, or 80% unique content.

## Completed fixes

### Question 145 rendering

The original raw LaTex was replaced. The explanation now renders as plain text:

```text
S + is/am/are + V-ing
```

### Free-to-paid overlap disclosure

The product copy now shows this fact before the user starts and again in the paid continuation offer:

```text
Mini Mock ชุดนี้เป็นตัวอย่าง 30 ข้อจาก Mock Test ชุด 4
```

This is a trust requirement, not a marketing drawback. The user can evaluate the paid set first, and the offer is still 120 unseen questions after the sample.

### Difficulty metadata

The stored values are normalized:

| Value | Count |
| --- | --- |
| `easy` | 36 |
| `medium` | 99 |
| `hard` | 15 |

Current distribution is 135 easy/medium questions (90%) and 15 hard questions (10%). That is acceptable for a practice set, but remains weak for a product described as a realistic full mock. Do not change the label to "สนามจริง" until the difficulty mix is deliberately reviewed.

### Law and Saraban references

Law and Saraban questions have a source document reference, but most cite the entire regulation or law rather than the exact clause or section. Add the exact section/clause to `verificationRef` for all 55 questions before future revisions.

Examples:

- Civil and Commercial Code section 1703 for minor wills.
- Criminal Code sections 73, 74, 96, and 18 where applicable.
- The exact Saraban regulation clause and amendment for document format, retention, or electronic filing questions.

## What does not need changing now

- The 150-question subject blueprint: Math 20, Thai 20, Computer 40, Saraban 30, Law 25, English 15.
- Answer-option distribution: A 37, B 37, C 42, D 34. It is sufficiently balanced.
- Math Questions 1-20: arithmetic and stated explanations were checked and match their marked answers.

## Image review

- Mock Test 04 contains one visual question: Question 142, an English no-U-turn traffic-sign question.
- The SVG asset exists at `/public/exams/police-english/traffic-no-u-turn.svg`, loaded successfully from the Next.js app, and was visually checked.
- There are no broken media paths.
- This is not an image-heavy test. The remaining 149 questions are text-only. That is appropriate for the current content, but it should not be marketed as a visual-reasoning mock.

## Remaining release gate

1. Run a fact audit of legal and Saraban questions against clause-level official sources.
2. Decide whether to add more hard questions before using a "สนามจริง" claim.
3. Only then import/publish the paid product at its final decided price.

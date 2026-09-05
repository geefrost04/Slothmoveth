# Set 2: Aptitude and Logic - Content Audit

- Status: `CONDITIONAL PASS - not ready to publish`
- Scope: 20 questions in `police-math-set-02-aptitude-logic.json`
- Audit date: 2026-09-05

## Passed checks

- Positions are consecutive from 1 to 20.
- Every question has a prompt, four distinct choices, one valid answer index, an explanation, and a solving tip.
- Answer-key distribution is balanced: A 5, B 5, C 5, D 5.
- Exact prompt overlap against the current `content/exams` catalog: 0.
- Near-prompt overlap at trigram Jaccard similarity >= 0.70: 0.
- Manual answer-key review passed for all 20 questions. The arithmetic, sequence rules, ordering constraints, conditional logic, code shift, and number relation all resolve to the stated answer.

## Coverage check

| Skill | Questions | Result |
| --- | ---: | --- |
| Alternating, grouped, and higher-order series | 1-5 | Pass |
| Analogy relationships | 6-8 | Pass |
| Ordering and positional constraints | 9-12 | Pass |
| Conditional and set logic | 13-16 | Pass |
| Custom operation and coding rules | 17-20 | Pass |

## Release blockers

1. **Difficulty is not recorded per question.** The Set 2 blueprint calls for 20% easy, 40% medium, and 40% hard. Add a `difficulty` field before the full Set 2 audit so the claimed progression can be verified.
2. **No visual-reasoning item is present.** Set 2 should include at least 4 visual items across 20 questions: a matrix rule, rotation, cube/net, and paper-folding or cutting-plane item. These should use original assets and pass the cross-catalog asset-reuse audit.
3. **The 20-question category is only one of six categories.** Do not import, publish, or attach commerce entitlement until all 140 questions are authored and the catalog-wide audit passes.

## Recommendation

Keep questions 1-20 as the text-first base. Add difficulty metadata and four original visual questions by replacing four appropriate text-only items, then audit the category again before using it as the quality template for the remaining five categories.

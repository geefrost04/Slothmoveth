# Police Mock Test Set 01 - Final Audit

Date: 2026-08-26
Status: **PASS - REMEDIATION COMPLETE**

Repeat audit: **PASS - LOCAL AND SUPABASE MATCH 150/150**

## Result

- Total questions: 150
- Allocation: Math 20, Thai 20, Computer 40, Saraban 30, Law 25, English 15
- Exact duplicate prompts: 0
- Repeated source questions: 0
- Invalid answer indices: 0
- Missing question, choices, explanation, or tip: 0
- Declared answer index convention: zero-based
- Supabase mappings after import: 150
- Stripe test price retained: THB 59
- Production build: PASS
- Near-duplicate candidates at trigram Jaccard >= 0.82: 0
- Answer distribution A/B/C/D: 30/44/42/34
- Unsafe negative-prompt tips: 0
- Local-to-Supabase field comparison: 150/150 exact matches

## DNA Distribution

- Thai: Reading 8, Language 12
- Saraban: A 12, B 10, C 5, D 3
- Law: General/Admin 4, Constitution/Court/Education 4, Civil 9, Criminal 6, Consumer/Registration 2
- English: Conversation 3, Vocabulary 3, Reading 3, Grammar 6
- Math: 20 positions stratified across the full 30-question bank instead of selecting the first 20
- Computer: 30 Set 1 bank questions plus 10 unique Set 1 DNA-derived questions

## Corrected Content

- Computer password guidance updated to NIST SP 800-63B-4: long and unique passwords/passphrases, MFA, blocklists, and no mandatory composition-rule claim.
- Saraban owner-number question now uses the complete definition: `สำนัก กอง หรือส่วนราชการที่มีฐานะเทียบกอง`.
- Saraban version-number question now explicitly asks about `ระเบียบ` and follows clause 17.3.
- Negative-prompt tips were rewritten to identify false or excluded statements explicitly instead of presenting them as unqualified facts.
- The generator now rejects repeated source questions and duplicate prompts.

## Import Status

Corrected source sets imported:

- `police-computer-set-01`
- `police-thai-set-01`
- `police-saraban-set-01`
- `police-law-set-01`

Rebuilt product imported:

- Exam set: `police-mock_test-set-01`
- Product: `police_mock_test_set_01`
- Price: THB 59
- Mapped questions: 150

## References

- NIST SP 800-63B-4: https://pages.nist.gov/800-63-4/sp800-63b.html
- Thai correspondence regulation: https://www.pcd.go.th/wp-content/uploads/2020/11/pcdnew-2020-11-17_02-36-59_117242.pdf
- Owner-number appendix: https://www.sungaipadee.go.th/dnm_file/project/1405140_center.pdf

## Reproducible Audit

Run the independent local and remote audit with:

```bash
node scripts/audit-police-mock-test.mjs --remote
```

The audit fails on structural errors, incorrect allocation, invalid answer indices, exact or repeated-source duplicates, DNA drift, unsafe negative-prompt tips, missing critical corrections, or any mismatch between local content and Supabase.

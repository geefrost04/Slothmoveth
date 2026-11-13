# Quality audit: police subject sets and mini mocks (13 พ.ย. 2569)

Scope: every published `police_admin` set except Mock Test 1–6. That is 55 sets and 1,350 questions:

| Group | Sets | Questions |
|---|---|---|
| mini mock | 14 | 300 |
| computer | 9 | 180 |
| law | 8 | 160 |
| English | 3 | 90 |
| Thai | 3 | 150 |
| math (category sets) | 6 | 140 |
| saraban (p54-01/02, quick-01..07, set-01..03) | 12 | 330 |

Supabase was treated as the source of truth. Nothing was imported, committed or deployed. Only content files were changed, plus one new import script that has not been run.

## Summary

| | |
|---|---|
| **Wrong answer key** | **0 by index.** One question had **no correct choice**: `police-mini_mock-set-10-q14`. Its key "พระองค์ทรงเสวยพระกระยาหาร" is wrong, because เสวย already is a royal verb and the bank's own `police-thai-set-01-q24` marks "ทรงเสวย" as wrong. Fixed by correcting that choice to "พระองค์เสวยพระกระยาหาร". The key position is unchanged. |
| Wrong-key flags rejected | 1. `police-saraban-quick-02-q16` (อัยการสูงสุด → กราบเรียน). An AI reviewer said อัยการสูงสุด is not on the กราบเรียน list. It is: item 14 of 15 in ภาคผนวก 2 as updated by หนังสือ สลค. นร 0106/ว 913. The key stays ค. |
| Questions changed | **389**: 261 substantive fixes, 103 that only quote a negative word, and 25 that copy a fix to a mini-drill duplicate or remap choice letters |
| Ambiguous / two defensible answers | 15 fixed |
| Explanation or tip contradicts the key or states a wrong fact | 80 fixed, including about 20 tips that taught the wrong option as the "จุดจำ" |
| Authoring wording left in candidate-facing text ("ต้นฉบับชุดที่ N", "DNA", "คาแรกเตอร์", old question numbers) | 150 fixed (saraban set-01..03 alone: 116) |
| Broken rendering (raw LaTeX `\t ext{}`, `\approx`, backticks) | 7 fixed |
| Other (typos that change meaning, the wrong official named, a no-correct-choice item) | 9 fixed |
| Negative stem not emphasised | 147 quoted with “…”, e.g. ข้อใด“ไม่ถูกต้อง”. `**bold**` is not used, because the site shows it literally. |
| Question ids changed | 0 |
| Key index changed | 0 |
| Answer positions reordered | 0 (see "Proposals" below) |

## Database vs files

- **Prompts, choices and keys:** all 1,350 match between the database and `content/exams` files (or, for drill copies, their source question), with one exception: `police-mini_mock-set-09-q14`, explained in the next bullet.
- `police-mini_mock-set-09-q14`: the copy and the live database are both correct (key 8 นาที). The stale one is the file `police-mock-test-set-05.json` q8, which still has key 10 นาที. That file is outside this scope and was not changed; it should be re-synced from the database before anyone re-imports Mock Test 5.
- **Math category files were out of date:** 26 explanations or tips had been rewritten in the database (friendlier step-by-step text) but never written back to the files. The same was true of `police-mock-test-set-04.json` q11. I copied the database text into those files first, so they match the live site again, and then applied the fixes.
- **Sets with no file:** mini drills 03–14 have no JSON file. They are database-only copies built by `scripts/create-police-mini-drills.mjs`, so their fixes exist only in the patch file (67 questions).
- **Shared question rows:**
  - Mini mocks 01 and 02 use Mock Test 1 and Mock Test 4 question rows directly. Mini mock 01 already carries the pilot fix.
  - Mini mock 02 has 6 fixes in Mock Test 4 rows, so those 6 also change in Mock Test 4 itself.
  - Mini drills 03–14 are separate copies with their own ids (`derived_from_question_id`). Any fix to a source question was copied to its drill copy, with choices mapped by text because drill copies have reshuffled choices.

## Most important findings

### 1. Answer is not supported, or two choices are defensible (15 fixed)

- **`police-mini_mock-set-10-q14`:** no correct choice (above).
- **`police-mini_mock-set-03-q12`:** "มานีอาจส่งงานไม่ครบก็ได้" is also a valid conclusion alongside the key "สรุปไม่ได้…". The distractor was changed to "มานีส่งงานไม่ครบแน่นอน".
- **`police-thai-set-01-q23` and `q26`:** "จักรยาน = จัก-กะ-ยาน" in a distractor is also a wrong reading (ราชบัณฑิตฯ: จัก-กฺระ-ยาน), so q23 had two wrong choices. The distractor reading was corrected (same fix as pilot Q31).
- **`police-thai-set-01-q35` and `q50`:** the stem says "ตามรูปแบบเดียวกับต้นฉบับ", which the candidate never sees. The reading rule is now stated in the stem (same fix as pilot Q40).
- **`police-thai-set-02-q39`:** "ผู้ชำนาญการด้านพันธุศาสตร์" is as natural as the key "เชี่ยวชาญ". Distractor ก was changed to "คุ้นเคย".
- **`police-thai-set-02-q37`:** "เห็นช้างขี้ ขี้ตามช้าง" means copying someone richer beyond your means, but the stem was about joining friends to volunteer. The scenario was rewritten so the idiom fits.
- **`police-thai-set-03-q42`:** the key "เพราะ…จึงทำให้" is the same kind of fault (redundancy) as the other three, so none "differs". The key's sentence was replaced with an incomplete sentence. The key position is the same.
- **`police-english-set-03-q19`:** "worked … for twelve years" is also correct English. "now" was added to the stem.
- **12 English synonym items** (set-01 q07, q09, q10, q11; set-02 q07, q10, q12; set-03 q07, q09, q10, q11, q12) plus the copy mini-14 q03: the stem was a plain sentence with no instruction and no marked word. Added "Choose the word closest in meaning to the word in quotation marks." and put the target word in “…”.
- **`police-law-set-03-q09`:** the choices read "ก. 1. สภาผู้แทนราษฎร", so ก and ค were each partly "ถูกต้อง". The items were moved into the stem; the key ง ("ข้อ 1 และ 3") is unchanged.

### 2. Explanations that contradict the key or teach a wrong fact (80 fixed)

- **Negative-stem "จุดจำ" tips that teach the wrong option** (law and saraban, about 20). Examples:
  - saraban set-01 q40 tip: "ไม่เล็กกว่า 32 พอยต์"; the rule is 24 พอยท์ (ข้อ 73).
  - set-03 q10: "หนังสือเวียนเริ่มเลข 0"; it starts at 1 (ข้อ 32).
  - set-03 q30: "สีน้ำเงินเท่านั้น".
- **English explanations belonging to other questions or other versions of a passage:**
  - set-01 q07, q08 and q09 had another question's explanation.
  - set-01 q14 and q15, and set-03 q14, describe notices or emails that differ from the stem. set-03 q14 says the store opens at 9:00; the notice says 10:00.
- **Mini drill 14 q01–q12 and mini drill 08 (all copies):** the choices were reshuffled when the drill was built, but the explanations still say "ข้อ A/B/C/D" from the source order, so they point at the wrong choice.
  - Reviewer rewrote 10 of them.
  - 12 had their letters remapped mechanically to the copy's ก–ง order.
- **Mini drill 13 q01, q09, q10 and q11:** an earlier clean-up replaced "ต้นฉบับ" with "ระเบียบงานสารบรรณ" in law questions, so ป.อ. ม.285/1 and the product-liability act are cited as "ระเบียบงานสารบรรณ". Fixed.
- **Saraban explanations citing old question numbers as if they were regulation clauses:**
  - "ข้อ 4" should be ข้อ 12.1.
  - "ข้อ 8" should be ข้อ 25.
  - "ข้อ 23" should be ข้อ 57.6.
  - "ข้อ 70 + ภาคผนวก 2" should be ข้อ 71.
- **`police-mini_mock-set-06-q19`:** the stem named the wrong official (the หัวหน้าส่วนราชการระดับกอง). Under ข้อ 66, the officer in charge of storage prepares the destruction list, and the head at กรม level appoints the committee. The 60-day key is unchanged.
- **Math:** 12 explanations still used nouns from an older stem (วิทยุสื่อสาร, น้ำท่วม, พนักงานดับเพลิง, …). stats-prob q05 renamed คดี A/B so the reader could not tell which was which.
  - foundations q17: "smallest positive integer" with remainder 5 is literally 5, so the stem now says "สามหลัก". The key 185 stands.
- **Computer:** set-02 q13 and the mock-04 q077 tip call .go.th a top-level domain; the TLD is .th. set-03 q12 uses a private 192.168.x.x address as a public site's IP.

### 3. Authoring wording in candidate-facing text (150 fixed)

- **Saraban set-01..03:** 116 questions had "ต้นฉบับชุดที่ N", "ตามตัวอย่างชุดที่ 2", "คาแรกเตอร์ข้อสอบต้นฉบับ", "DNA", "Mock Exam" or old question numbers in the prompt or explanation.
  - Each was rewritten to cite the rule instead, e.g. "ตามระเบียบงานสารบรรณ ข้อ 57.6" or "ภาคผนวก 7".
  - "ทำลายต้นฉบับ" (meaning the original document) was kept.
- **Law:** 20 questions. **Saraban mini drills 06/12:** 8. **Thai:** 4. **Saraban quick-07:** 1. **Math geometry:** 1. **Computer:** none ("รหัสต้นฉบับ" means source code).
- `police-saraban-set-01-q30` and `q37` named a real officer (พล.ต.อ. กิตติ์รัฐ พันธุ์เพ็ชร์), or "บุคคลเดียวกับตัวอย่างชุดที่ 1", without a position. Both now say "ผู้บัญชาการตำรวจแห่งชาติ", the same fix as pilot Q100. The key (เรียน – ขอแสดงความนับถือ) is unchanged, because ผบ.ตร. is not on the กราบเรียน list.

## Per-set summary

Every set is `access_type: free`. Some sets 02/03 still have a product row with price 4900 from before the free switch. The patch never touches products, prices or Stripe.

| Set | Qs | Access (product price) | Questions fixed | What was fixed |
|---|---|---|---|---|
| police-computer-set-01 | 20 | free (0) | 0 | — |
| police-computer-set-02 | 20 | free (4900) | 2 | expl-mismatch 1, other 1 |
| police-computer-set-03 | 20 | free (4900) | 1 | other 1 |
| police-computer-set-04 | 20 | free (0) | 0 | — |
| police-computer-set-05 | 20 | free (0) | 0 | — |
| police-computer-set-06 | 20 | free (0) | 0 | — |
| police-computer-set-07 | 20 | free (0) | 0 | — |
| police-computer-set-08 | 20 | free (0) | 0 | — |
| police-computer-set-09 | 20 | free (0) | 1 | expl-mismatch 1 |
| police-english-set-01 | 30 | free (0) | 11 | expl-mismatch 8, ambiguous 2, render 1 |
| police-english-set-02 | 30 | free (4900) | 5 | ambiguous 3, render 2 |
| police-english-set-03 | 30 | free (4900) | 17 | ambiguous 6, render 2, expl-mismatch 9 |
| police-law-set-01 | 20 | free (0) | 10 | leak 3, negative 8, expl-mismatch 1 |
| police-law-set-02 | 20 | free (4900) | 6 | leak 3, negative 4, expl-mismatch 1 |
| police-law-set-03 | 20 | free (4900) | 8 | leak 3, negative 7, expl-mismatch 2 |
| police-law-set-04 | 20 | free (0) | 8 | leak 3, negative 6, expl-mismatch 3 |
| police-law-set-05 | 20 | free (0) | 8 | leak 4, negative 5, expl-mismatch 1 |
| police-law-set-06 | 20 | free (0) | 5 | leak 2, negative 3 |
| police-law-set-07 | 20 | free (0) | 7 | leak 1, negative 6 |
| police-law-set-08 | 20 | free (0) | 6 | leak 1, negative 5 |
| police-math-category-algebra | 20 | free (0) | 1 | other 1 |
| police-math-category-aptitude-logic | 20 | free (0) | 1 | other 1 |
| police-math-category-foundations | 40 | free (0) | 3 | expl-mismatch 2, other 1 |
| police-math-category-geometry | 20 | free (0) | 2 | render 1, leak 1 |
| police-math-category-ratios-percent | 20 | free (0) | 6 | expl-mismatch 6 |
| police-math-category-stats-prob | 20 | free (0) | 6 | expl-mismatch 6 |
| police-mini_mock-set-01 | 30 | free (-) | 0 | — |
| police-mini_mock-set-02 | 30 | free (-) | 6 | expl-mismatch 1, leak 1, negative 4 |
| police-mini_mock-set-03 | 20 | free (-) | 2 | ambiguous 1, copy 1 |
| police-mini_mock-set-04 | 20 | free (-) | 5 | expl-mismatch 1, copy 4 |
| police-mini_mock-set-05 | 20 | free (-) | 1 | render 1 |
| police-mini_mock-set-06 | 20 | free (-) | 12 | expl-mismatch 4, negative 1, leak 1, other 1, copy 6 |
| police-mini_mock-set-07 | 20 | free (-) | 2 | copy 2 |
| police-mini_mock-set-08 | 20 | free (-) | 9 | copy 3, letters 9 |
| police-mini_mock-set-09 | 20 | free (-) | 1 | other 1 |
| police-mini_mock-set-10 | 20 | free (-) | 5 | other 1, negative 4 |
| police-mini_mock-set-11 | 20 | free (-) | 0 | — |
| police-mini_mock-set-12 | 20 | free (-) | 11 | leak 6, expl-mismatch 5, negative 3 |
| police-mini_mock-set-13 | 20 | free (-) | 6 | expl-mismatch 4, negative 4 |
| police-mini_mock-set-14 | 20 | free (-) | 13 | expl-mismatch 10, copy 1, letters 3 |
| police-saraban-p54-01 | 20 | free (0) | 1 | negative 1 |
| police-saraban-p54-02 | 20 | free (0) | 2 | negative 2 |
| police-saraban-quick-01 | 20 | free (0) | 4 | negative 4 |
| police-saraban-quick-02 | 20 | free (0) | 2 | negative 2 |
| police-saraban-quick-03 | 20 | free (0) | 4 | negative 4 |
| police-saraban-quick-04 | 20 | free (0) | 2 | negative 2 |
| police-saraban-quick-05 | 20 | free (0) | 3 | negative 3 |
| police-saraban-quick-06 | 20 | free (0) | 3 | negative 3 |
| police-saraban-quick-07 | 20 | free (0) | 3 | leak 1, negative 2 |
| police-saraban-set-01 | 50 | free (0) | 40 | leak 36, negative 9, expl-mismatch 2, lead 2 |
| police-saraban-set-02 | 50 | free (4900) | 40 | leak 38, negative 6, expl-mismatch 2 |
| police-saraban-set-03 | 50 | free (4900) | 49 | leak 42, expl-mismatch 7, negative 7, lead 1 |
| police-thai-set-01 | 50 | free (0) | 15 | ambiguous 1, negative 12, expl-mismatch 2, leak 3 |
| police-thai-set-02 | 50 | free (4900) | 19 | expl-mismatch 1, ambiguous 1, other 1, negative 16 |
| police-thai-set-03 | 50 | free (4900) | 15 | leak 1, negative 14, ambiguous 1 |

Category key:
- **leak:** authoring wording.
- **negative:** negative word quoted.
- **copy:** same fix as the source, applied to a mini-drill copy.
- **letters:** choice letters remapped in a reshuffled copy.
- **lead:** my own edit on top of a reviewer fix.

## Suspected but not changed

| Question | Why not changed |
|---|---|
| `police-saraban-quick-02-q16`, `police-saraban-set-03-q25` (อัยการสูงสุด = กราบเรียน) | Flagged as a wrong key, but the key is right: อัยการสูงสุด is on the 15-position list (ภาคผนวก 2, as updated by นร 0106/ว 913). This is an AI false positive. |
| `police-saraban-quick-03-q03`, `quick-05-q10`, `quick-07-q04`, `set-01-q41` (ยืมระหว่างส่วนราชการ = ระดับกอง) | The local copy of the regulation text says แผนก for ข้อ 62.3. That copy is a retyped version and looks garbled; the standard text and all study material say กอง. The keys are left as they are. |
| `police-saraban-p54-01-q16` | The explanation cites "ฉบับที่ 21 พ.ศ. 2569" for สารวัตรใหญ่'s rank level. I could not confirm that amendment exists. The key สวญ. is correct either way. |
| `police-saraban-set-03-q19` and `q29` | They ask the same thing (how many secrecy classes) in the same set. Neither is an exact copy, and the owner rule is not to write new questions, so both stay. |
| `police-law-set-02-q42/q43` (ป.อ. ม.285/1, 13 ปี), `police-law-set-03-q44` (ฎีกา 3643/2526) | Matches study material and memory; I could not open the statute or judgment text online. No change. |
| `police-law-set-03-q46` | "อายุความคุ้มครอง" is loose wording for "อายุการคุ้มครอง". The meaning is clear. |
| `police-computer-set-02-q07`, `police-mock_test-set-04-q047` (.png for transparency) | GIF also supports 1-bit transparency, but PNG is still clearly the best answer. |
| `police-computer-set-01-q15`, `set-03-q19`; `police-thai-set-02-q24`, `set-03-q01/q11`; `police-mini_mock-set-04-q11` | A distractor is arguable, but the key is clearly the best answer. |
| Thai sets: same stem with different choices (e.g. set-01 q21 and q36) | Not exact duplicates: the choices differ. No change. |
| English set-01..03: about 105 explanations say "ข้อ A/B/C/D", while the site labels choices ก/ข/ค/ง | In the non-copy sets, A=ก, B=ข and so on, consistently. Converting them would be a mechanical find-and-replace across about 105 explanations, so I left it for the owner to decide. It is only wrong in reshuffled copies, which are fixed. |
| Negative stems not quoted: `police-law-set-02-q16`, `set-03-q26`, `set-03-q49`, `police-thai-set-03-q26/q41`, `police-mini_mock-set-04-q15`, `police-computer-set-01-q15`, `set-04-q29`, `police-law-set-03-q23`, `police-mini_mock-set-07-q17`, `police-thai-set-02-q40` | The negative word is part of the content, not the question ("ขาดไม่ได้", "ไม่กำกวม", "ความรับผิด", "ไม่ออกเสียง"). |

## Set-level observations (proposals only, nothing reordered)

- **Answer positions:** drills and quick sets are perfectly balanced at 5/5/5/5. Three sets are lopsided:
  - `police-thai-set-01`: ก 6 · **ข 22** · ค 14 · ง 8.
  - `police-thai-set-02`: ง 22 of 50.
  - `police-saraban-set-03`: ง 20 of 50.
  - **Proposal:** rebalance only thai-set-01, by moving the key in about 8 questions from ข to ก or ง. This would need the owner's OK.
- **"Correct is the longest choice":** strongest in:
  - `police-thai-set-02`: **19 of 19** questions where one choice is clearly longest.
  - `police-thai-set-01`: 13/16.
  - `police-mini_mock-set-07`: 11/15.
  - `police-mini_mock-set-13`: 9/11.
  - A test-wise candidate can score well on Thai set 2 by picking the longest choice. **Proposal:** lengthen 1–2 distractors in about 8 of those Thai set 2 questions. That is a content rewrite, so it was not done without approval.
- **Overlap:** many subject questions also appear in the mock tests and in other sets. Per the owner rule this was not touched.

## Out of scope (found while checking copies, not changed)

1. **`police-mock_test-set-05-q028`** (live in Mock Test 5) has **no correct choice**: its key is "พระองค์ทรงเสวยพระกระยาหาร". This is the source of mini-10 q14, which is fixed. Mock Test 5 needs the same fix.
2. **`police-mock_test-set-05-q003`** has the same two-correct-choices problem as its copy, mini-03 q12.
3. Other Mock Test 4 and 5 source rows behind mini drills 06, 10, 12, 13 and 14 have the same leak, explanation and negative-stem issues that were fixed in the copies. They should be covered when Mock Test 2–6 are audited.
4. **`police-mock-test-set-05.json` q8** is stale against the database (key 10 vs the correct 8 นาที in the database).
5. **`public/exams/police-math-categories/geometry-q20-pyramid.svg`:** the dashed "10 cm" line runs from the apex to a base corner, which is an edge. The stem and the key (384 cm³) use it as the slant height (apex to mid-edge). Read as an edge, the volume would be about 254 cm³, which is not a choice. The fix is to redraw the line to the midpoint of a base edge. This is an asset change that needs a deploy, so it was not done.

## How to import (not run)

**One script for everything:**

```bash
node scripts/police/apply-subject-audit-fixes.mjs                 # dry-run (default)
node scripts/police/apply-subject-audit-fixes.mjs --apply         # writes
```

- It reads `content/exams/police-subject-sets-audit-fixes-2026-11-13.json`: 389 questions, each with `before`, `after` and `why`.
- It updates only `questions.prompt/choices` and `question_solutions.explanation/tip` for those ids.
- It does **not** touch `exam_sets`, `exam_set_questions`, `products`, prices or Stripe.
- Ids are unchanged, so attempts and the wrong-answer book stay valid.
- Before writing, it checks that every row in the database still equals the `before` value, and it stops if anything differs. After writing, it reads every row back to verify.
- **Dry-run done on 13 Nov:** "DB matches every before value".
- **Stripe:** not involved. Every in-scope set is `access_type: free`, and the script never calls Stripe or the products table.
- **Do not re-run the old per-subject import scripts for these sets:**
  - `import-police-subject-exam-set.mjs` and `import-police-computer-exam-sets.mjs` set sets 2+ back to price 1900, and the computer one rebuilds the old 30-question layout.
  - `import-police-saraban-quick-sets.mjs`, `rebuild-law-sets.mjs` and `rebuild-computer-sets.mjs` re-link sets and upsert products.
  - None of them covers mini-drill copies.
- **Content files:** already updated to the post-fix text: 33 files. I simulated the database after the patch and compared it with the files; every file-backed set matches 100%.
- **No deploy is needed:** questions are read from the database at request time.

## Method

1. Dumped all 55 sets from Supabase and compared them with the files (above).
2. Ran scripted checks on all 1,350 questions: schema, exact in-set duplicates, answer positions, longest-choice bias, authoring-wording regex, negative stems, explanation letter vs key, LaTeX/markdown, media references and Buddhist-era years.
3. Ran 13 parallel AI reviewers, one per subject chunk of 87–120 questions. Each solved every question before reading the key, checked the explanation, and verified rules against:
   - the regulation text (ระเบียบงานสารบรรณ 2526, ฉบับที่ 2 2548, ฉบับที่ 3 2560, ฉบับที่ 4 2564, from the Royal Gazette / Chula PDFs);
   - ORST dictionary readings;
   - statute sources and Microsoft documentation.

   Coverage:
   - 1,257 questions were reviewed directly.
   - 63 drill copies were covered through their source question.
   - The 30 questions of mini mock 01 are Mock Test 1 rows that were audited and fixed in the pilot.
4. I read every non-wording finding myself, re-checked the risky ones against sources, and rejected or edited where needed:
   - rejected the อัยการสูงสุด wrong-key flag;
   - replaced the real officer's name with a position;
   - tightened one awkward prompt;
   - skipped 11 negative-quote candidates.

   The wording fixes were checked by script: no leftover leak words, no `**`, choices still 4 and distinct, and the key choice text unchanged except in the 5 intended cases. I also read every changed prompt.
5. Precision: 280 reviewer findings, 17 of them "suspect, no change". Of the 2 key-level flags, 1 was real (mini-10 q14) and 1 was a false positive (อัยการสูงสุด). That matches the pilot lesson: never change a key on an AI flag without the source text.

## Appendix: every changed question

The order is: ambiguous/other first, then explanation and render fixes, then wording leaks, then copies, then negative-only. Full before and after text is in the patch file.

| # | Question id | Problem | Before → after (short) |
|---|---|---|---|
| 1 | police-computer-set-01-q30 | other:  Tip ends with a garbled phrase 'กดแจ้งรายงาน (Report) ทราฟฟิกข้อมูลพังไปแทน' that does not make sense. | tip rewritten |
| 2 | police-computer-set-03-q20 | other:  Typo in tip: 'ส่วย' (tribute) instead of 'ส่วน'. | tip rewritten |
| 3 | police-english-set-01-q10 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The new work schedule is adaptable and can be changed when n… → The new work schedule is “adaptable” and can be changed when… |
| 4 | police-english-set-01-q11 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The village has an ample supply of clean drinking water. → The village has an “ample” supply of clean drinking water. |
| 5 | police-english-set-02-q07 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The instructions were so vague that several employees misund… → The instructions were so “vague” that several employees misu… |
| 6 | police-english-set-02-q10 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The temporary office will be used only until the main buildi… → The “temporary” office will be used only until the main buil… |
| 7 | police-english-set-02-q12 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: It is crucial that emergency exits remain clear at all times… → It is “crucial” that emergency exits remain clear at all tim… |
| 8 | police-english-set-03-q07 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The agency introduced new measures to strengthen security at… → The agency introduced new measures to “strengthen” security … |
| 9 | police-english-set-03-q09 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The information in the first report was inaccurate and had t… → The information in the first report was “inaccurate” and had… |
| 10 | police-english-set-03-q10 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: His explanation was illogical because the conclusion did not… → His explanation was “illogical” because the conclusion did n… |
| 11 | police-english-set-03-q11 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: The museum confirmed that the newly discovered document was … → The museum confirmed that the newly discovered document was … |
| 12 | police-english-set-03-q12 | ambiguous:  Synonym item gives only a plain sentence with no instruction and no marked target word (the site renders plai… | prompt: After reviewing the results, the company decided to terminat… → After reviewing the results, the company decided to “termina… |
| 13 | police-english-set-03-q19 | ambiguous:  "Mr. Wilson worked at this company for twelve years." (ข) is also correct standard English (he no longer work… | prompt: Mr. Wilson __________ at this company for twelve years. → Mr. Wilson __________ at this company for twelve years now.<br>explanation rewritten |
| 14 | police-math-category-algebra-q10 | other:  Tip wording is garbled ('ลองมองหาคู่ตัวเลขจากโจทย์ชอยส์ได้'). | tip rewritten |
| 15 | police-math-category-aptitude-logic-q20 | other:  Tip refers to a person named 'เอก' who does not appear in the stem (leftover from another version). | tip rewritten |
| 16 | police-math-category-foundations-q17 | other:  Strictly, the smallest positive integer leaving remainder 5 when divided by 12, 15 and 18 is 5 itself (5 = 0×… | prompt: จำนวนเต็มบวกที่น้อยที่สุด ซึ่งหารด้วย 12, 15 และ 18 แล้วเหลื… → จำนวนเต็มบวกสามหลักที่น้อยที่สุด ซึ่งหารด้วย 12, 15 และ 18 แ… |
| 17 | police-mini_mock-set-03-q12 | ambiguous:  Choice ก "มานีอาจส่งงานไม่ครบก็ได้" is also a valid conclusion: from "ส่งงานครบ → ได้สิทธิ์" and "มานีได้สิทธ… | ก: มานีอาจส่งงานไม่ครบก็ได้ → มานีส่งงานไม่ครบแน่นอน |
| 18 | police-mini_mock-set-06-q19 | other:  The prompt and explanation give the wrong actor. The duty officer (เจ้าหน้าที่ผู้รับผิดชอบในการเก็บหนังสือ) p… | prompt: ตามระเบียบงานสารบรรณ ภายในกี่วันหลังจากวันสิ้นปีปฏิทิน ให้หั… → ตามระเบียบงานสารบรรณ ภายในกี่วันหลังจากวันสิ้นปีปฏิทิน ให้เจ…<br>explanation rewritten |
| 19 | police-mini_mock-set-09-q20 | other:  Typo "วันที 4" (missing ่) in explanation. | explanation rewritten |
| 20 | police-mini_mock-set-10-q14 | other:  No correct choice: the key ง 'พระองค์ทรงเสวยพระกระยาหาร' uses ทรง + เสวย, which this bank itself marks as wro… | ง: พระองค์ทรงเสวยพระกระยาหาร → พระองค์เสวยพระกระยาหาร<br>explanation rewritten |
| 21 | police-thai-set-01-q23 | ambiguous:  Two choices are wrong readings: ก มกราคม = มา-กะ-รา-คม (key), and ง จักรยาน = จัก-กะ-ยาน. The standard readin…; negative stem quoted | ง: จักรยาน อ่านว่า จัก-กะ-ยาน → จักรยาน อ่านว่า จัก-กฺระ-ยาน<br>explanation rewritten<br>prompt: ข้อใดอ่านออกเสียงไม่ถูกต้อง → ข้อใดอ่านออกเสียง“ไม่ถูกต้อง” |
| 22 | police-thai-set-02-q37 | other:  'เห็นช้างขี้ ขี้ตามช้าง' means imitating someone richer/more powerful beyond one's own means; the scenario (j… | prompt: เขาไม่เคยสนใจงานอาสา แต่เมื่อเห็นเพื่อนทั้งกลุ่มสมัครก็สมัคร… → เขามีรายได้ไม่มาก แต่เมื่อเห็นเพื่อนที่ฐานะดีซื้อรถคันใหม่รา…<br>explanation rewritten |
| 23 | police-thai-set-02-q39 | ambiguous:  'เป็นผู้ชำนาญการด้านพันธุศาสตร์' is natural, standard Thai (ผู้ชำนาญการ = expert), so ก is as defensible as ง… | ก: ชำนาญการ → คุ้นเคย<br>explanation rewritten |
| 24 | police-thai-set-03-q42 | ambiguous:  Key ข 'เพราะ…จึงทำให้…' is commonly taught as ใช้คำฟุ่มเฟือย/คำเชื่อมซ้ำซ้อน, the same fault class as ก, ค, ง… | ข: เพราะฝนตกอย่างหนักจึงทำให้การแข่งขันต้อง… → นักเรียนที่ได้รับการคัดเลือกให้เป็นตัวแท…<br>explanation rewritten<br>tip rewritten |
| 25 | police-computer-set-02-q13 | expl-mismatch:  Explanation calls .go.th a 'top-level category domain (ccTLD)'. The ccTLD is .th; .go.th is a second-level do… | explanation rewritten |
| 26 | police-computer-set-03-q12 | expl-mismatch:  Explanation gives 192.168.x.x as an example of the IP a domain such as royalthaipolice.go.th resolves to. 192… | explanation rewritten |
| 27 | police-english-set-01-q07 | expl-mismatch:  Explanation and tip are for a different question (settle/resolve: create/resolve/ignore/prolong); none of it … | prompt: The safety briefing is mandatory for all new employees. → The safety briefing is “mandatory” for all new employees.<br>explanation rewritten<br>tip rewritten |
| 28 | police-english-set-01-q08 | expl-mismatch:  Explanation and tip are for a different question (vigilant/alert: careless/alert/exhausted/passive); none of … | explanation rewritten<br>tip rewritten |
| 29 | police-english-set-01-q09 | expl-mismatch:  Explanation and tip are for a different question (obey/comply with: ignore/resist/comply with/question); none… | prompt: The chief decided to commend the rescue team for their excel… → The chief decided to “commend” the rescue team for their exc…<br>explanation rewritten<br>tip rewritten |
| 30 | police-english-set-01-q14 | expl-mismatch:  Explanation describes a different version of the notice and choices: says the answer is ข้อ A "Applicants mus… | explanation rewritten<br>tip rewritten |
| 31 | police-english-set-01-q15 | expl-mismatch:  Explanation translates a different email: calls it fire training (ฝึกดับเพลิง) instead of first-aid, adds "Mo… | explanation rewritten |
| 32 | police-english-set-01-q16 | expl-mismatch:  Passage summary in the explanation adds facts not in the passage ("ลดความเสี่ยงโรคหัวใจ", "แค่เดินเร็วก็มีประ… | explanation rewritten |
| 33 | police-english-set-01-q17 | expl-mismatch:  Explanation translates the question as being about mental-health benefits, and the explanation and tip tell c… | explanation rewritten<br>tip rewritten |
| 34 | police-english-set-01-q18 | expl-mismatch:  Explanation "quotes" the passage with wording that is not in it ("choose activities you enjoy", "building act… | explanation rewritten |
| 35 | police-english-set-01-q21 | render:  Explanation contains broken LaTeX (a tab character followed by "ext{...}", and "\dots"), which displays liter… | explanation rewritten |
| 36 | police-english-set-02-q19 | render:  Explanation contains broken LaTeX (a tab character followed by "ext{...}", and "\dots"), which displays liter… | explanation rewritten |
| 37 | police-english-set-02-q20 | render:  Explanation contains broken LaTeX (a tab character followed by "ext{...}", and "\dots"), which displays liter… | explanation rewritten |
| 38 | police-english-set-03-q02 | expl-mismatch:  Dialogue translation gives Fern a different line ("the test was hard for everyone"), labels her "คุณ", and th… | explanation rewritten |
| 39 | police-english-set-03-q03 | expl-mismatch:  Explanation translates "bicycle" as รถจักรยานยนต์ (motorcycle). | explanation rewritten |
| 40 | police-english-set-03-q05 | expl-mismatch:  Explanation says Ploy finished 10 minutes early (ก่อนเวลาสิบนาที); the dialogue says "I finished in ten minut… | explanation rewritten |
| 41 | police-english-set-03-q06 | expl-mismatch:  Dialogue translation is for a different version (file sent "to an external audit team") and drops the employe… | explanation rewritten |
| 42 | police-english-set-03-q14 | expl-mismatch:  Explanation quotes notice text that does not exist ("Store hours: 9:00 a.m.", "ร้านเปิด 09:00 - 20:00 น.", "G… | explanation rewritten |
| 43 | police-english-set-03-q15 | expl-mismatch:  Explanation misquotes the email ("Please use the east entrance...", "must show ID") and adds visitors (ผู้มาต… | explanation rewritten |
| 44 | police-english-set-03-q16 | expl-mismatch:  Explanation and tip say the cause is stated in paragraph 2. It is in paragraph 1 (paragraph 2 lists effects).… | explanation rewritten<br>tip rewritten |
| 45 | police-english-set-03-q17 | expl-mismatch:  Explanation for ข้อ D says the passage states the weather will become more severe. The passage says nothing a… | explanation rewritten |
| 46 | police-english-set-03-q18 | expl-mismatch:  Explanation quotes "expanding cleaner energy sources like wind and solar power". The passage never mentions w… | explanation rewritten |
| 47 | police-english-set-03-q20 | render:  Explanation contains broken LaTeX (a tab character followed by "ext{...}", and "\dots"), which displays liter… | explanation rewritten |
| 48 | police-english-set-03-q21 | render:  Explanation contains broken LaTeX (a tab character followed by "ext{...}", and "\dots"), which displays liter… | explanation rewritten |
| 49 | police-law-set-01-q16 | expl-mismatch:  Explanation says 'จึงไม่ต้องรอครบหนึ่งชั่วโมง', but choice ข says 24 ชั่วโมง (probably copied from sibling q1… | explanation rewritten |
| 50 | police-law-set-01-q31 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดไม่ถูกต้องเกี่ยวกับของหมั้น → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับของหมั้น |
| 51 | police-law-set-01-q40 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับฉ้อโกงประชาชน → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับฉ้อโกงประชาชน |
| 52 | police-law-set-02-q08 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดไม่ใช่เหตุผลหลักของการตราพระราชกำหนด → ข้อใด“ไม่ใช่”เหตุผลหลักของการตราพระราชกำหนด |
| 53 | police-law-set-02-q33 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดไม่ถูกต้องเกี่ยวกับพินัยกรรมของผู้เยาว์ → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับพินัยกรรมของผู้เยาว์ |
| 54 | police-law-set-02-q36 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดไม่ถูกต้องเกี่ยวกับความผิดอันยอมความได้ → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับความผิดอันยอมความได้ |
| 55 | police-law-set-03-q13 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการยุบสภาผู้แทนราษฎร → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการยุบสภาผู้แทนราษฎร |
| 56 | police-law-set-03-q29 | expl-mismatch:  Negative-stem question: the TIP presents the incorrect choice as a 'จุดจำ' to memorise, teaching a false fact…; negative stem quoted | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการบอกเลิกสัญญาเช่าซื้อโดยผู้เช… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการบอกเลิกสัญญาเช่าซื้อโดยผู้… |
| 57 | police-math-category-foundations-q04 | expl-mismatch:  Stem names the workers ก and ข, but the explanation calls them แดง and ดำ. | explanation rewritten |
| 58 | police-math-category-foundations-q26 | expl-mismatch:  Tip claims choice 1 is the only option ending in 110, but ข (11010110₂) also ends in 110; it also refers to '… | tip rewritten |
| 59 | police-math-category-geometry-q12 | render:  Explanation contains raw LaTeX "\approx" that shows literally; it also talks about a wooden board with a dril… | explanation rewritten |
| 60 | police-math-category-ratios-percent-q01 | expl-mismatch:  Tip calls the linking term "ฝ่ายสืบสวน", which is not in the stem (the link is ฝ่าย ข). | tip rewritten |
| 61 | police-math-category-ratios-percent-q08 | expl-mismatch:  Explanation says the discount was for "สมาชิกตำรวจ"; the stem says ลูกค้า. | explanation rewritten |
| 62 | police-math-category-ratios-percent-q12 | expl-mismatch:  Explanation says "พื้นที่ในสมุดบันทึก"; the stem says the drawing is on paper (กระดาษ). | explanation rewritten |
| 63 | police-math-category-ratios-percent-q18 | expl-mismatch:  Explanation calls the item "วิทยุสื่อสาร"; stem just says สินค้า. | explanation rewritten |
| 64 | police-math-category-ratios-percent-q19 | expl-mismatch:  Explanation says the money was transferred "ช่วยน้ำท่วม"; stem only says ภารกิจ. | explanation rewritten |
| 65 | police-math-category-ratios-percent-q20 | expl-mismatch:  Explanation calls the item "ชุดประชุม"; stem says สินค้า. | explanation rewritten |
| 66 | police-math-category-stats-prob-q01 | expl-mismatch:  Explanation names the sets "ยิงปืนฉับพลัน" and "ต่อสู้ระยะประชิด"; stem says ชอบยิงปืน / ชอบต่อสู้. | explanation rewritten |
| 67 | police-math-category-stats-prob-q05 | expl-mismatch:  Explanation calls the cases "คดีลงทุน" and "คดีกู้เงิน"; the stem uses คดี A (70) and คดี B (55), so the read… | explanation rewritten |
| 68 | police-math-category-stats-prob-q07 | expl-mismatch:  Explanation says "พนักงาน" / "พนักงานสอบสวนชายล้วน"; stem says หญิง 4 นาย ชาย 5 นาย. | explanation rewritten |
| 69 | police-math-category-stats-prob-q08 | expl-mismatch:  Explanation calls the two people "ผู้บังคับบัญชา" and the others "ผู้ใต้บังคับบัญชา"; stem only says นายตำรวจ… | explanation rewritten |
| 70 | police-math-category-stats-prob-q09 | expl-mismatch:  Explanation says "ในตู้"; stem says กล่อง. | explanation rewritten |
| 71 | police-math-category-stats-prob-q17 | expl-mismatch:  Explanation says "พนักงานดับเพลิง"; stem just gives a weight table of คน. | explanation rewritten |
| 72 | police-mini_mock-set-04-q15 | expl-mismatch:  Explanation claims 'ผลลัพธ์' by definition means the final outcome; ORST defines ผลลัพธ์ only as 'จำนวนที่ได้… | explanation rewritten |
| 73 | police-mini_mock-set-05-q15 | render:  Explanation wraps the command names in markdown backticks (`chmod` etc.). The site renders plain text, so the… | explanation rewritten |
| 74 | police-mini_mock-set-06-q11 | expl-mismatch:  Explanation cites 'ระเบียบงานสารบรรณ ข้อ 4' (an old question number). The rule for หนังสือภายใน is ข้อ 12.1; … | explanation rewritten |
| 75 | police-mini_mock-set-06-q12 | expl-mismatch:  Explanation cites 'ระเบียบงานสารบรรณ ข้อ 8' (an old question number; ข้อ 8 is ผู้รักษาการ). The meeting-minut…; negative stem quoted | explanation rewritten<br>prompt: ตามแบบรายงานการประชุม ข้อใดไม่ใช่หัวข้อที่ใช้ตามถ้อยคำมาตรฐา… → ตามแบบรายงานการประชุม ข้อใด“ไม่ใช่”หัวข้อที่ใช้ตามถ้อยคำมาตร… |
| 76 | police-mini_mock-set-06-q17 | expl-mismatch:  Explanation cites ข้อ 9. The '6 ชนิด' rule is ข้อ 10; ข้อ 9 defines หนังสือราชการ. | explanation rewritten |
| 77 | police-mini_mock-set-06-q18 | expl-mismatch:  Explanation cites 'ข้อ 70 และภาคผนวก 2'. The ตราครุฑ sizes are in ข้อ 71 (แบบที่ 26). ภาคผนวก 2 is the table … | explanation rewritten |
| 78 | police-mini_mock-set-12-q11 | expl-mismatch:  Explanation cites 'ระเบียบงานสารบรรณ ข้อ 6 ซึ่งถามตำแหน่ง...', an old question number. The rule is ข้อ 17.6. | explanation rewritten |
| 79 | police-mini_mock-set-12-q13 | expl-mismatch:  Explanation cites 'แนวคำตอบของระเบียบงานสารบรรณ ข้อ 4', which is authoring residue plus an old question numbe… | explanation rewritten |
| 80 | police-mini_mock-set-12-q14 | expl-mismatch:  The tip 'จุดจำ: ประกาศทุกฉบับต้องมี “ฉบับที่”' teaches the false statement as the memory point. The explanati…; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดไม่ใช่ลักษณะที่ควรนำไปใช้เป็นกฎเหมารวมของประกาศตามระเบี… → ข้อใด“ไม่ใช่”ลักษณะที่ควรนำไปใช้เป็นกฎเหมารวมของประกาศตามระเ… |
| 81 | police-mini_mock-set-12-q16 | expl-mismatch:  The tip repeats the false statement as the memory point. Choice ข refers to an unseen 'ตัวอย่างที่โจทย์ใช้'. …; negative stem quoted | ข: ประกาศไม่จำเป็นต้องใส่ฉบับที่ตามตัวอย่าง… → แบบประกาศไม่มีส่วน “ฉบับที่”<br>explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับ “ฉบับที่” ตามแนวระเบียบงานสารบ… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับ “ฉบับที่” ตามแนวระเบียบงานสา… |
| 82 | police-mini_mock-set-12-q19 | expl-mismatch:  The key (5 ปี) is correct, but the explanation cites 'ข้อ 23', an old question number. The rule is ข้อ 57.6, … | explanation rewritten |
| 83 | police-mini_mock-set-13-q01 | expl-mismatch:  Explanation claims the ระเบียบงานสารบรรณ uses the phrase "กฎหมายแบบไม่เป็นลายลักษณ์อักษร" and "เฉลย" the US a… | explanation rewritten |
| 84 | police-mini_mock-set-13-q09 | expl-mismatch:  Explanation says the age threshold is "จุดตัวเลขที่ระเบียบงานสารบรรณ เน้นทดสอบ" — ระเบียบงานสารบรรณ is unrela…; negative stem quoted | explanation rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับหลักห้ามอ้างความไม่รู้อายุของเด… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับหลักห้ามอ้างความไม่รู้อายุของ… |
| 85 | police-mini_mock-set-13-q10 | expl-mismatch:  Explanation ends "ตามระเบียบงานสารบรรณ" — the product-liability act has nothing to do with the saraban regula… | explanation rewritten |
| 86 | police-mini_mock-set-13-q11 | expl-mismatch:  Prompt says "ตามแนวระเบียบงานสารบรรณ" for a question on centralisation (การรวมอำนาจ) — wrong source in the st…; negative stem quoted | prompt: ข้อใดไม่ใช่ข้อดีของหลักการรวมอำนาจทางปกครองตามแนวระเบียบงานส… → ข้อใด“ไม่ใช่”ข้อดีของหลักการรวมอำนาจทางปกครอง |
| 87 | police-mini_mock-set-14-q01 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ D … | explanation rewritten |
| 88 | police-mini_mock-set-14-q02 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ A … | explanation rewritten |
| 89 | police-mini_mock-set-14-q03 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ C … | prompt: The instructions were so vague that several employees misund… → The instructions were so “vague” that several employees misu…<br>explanation rewritten |
| 90 | police-mini_mock-set-14-q05 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ C … | explanation rewritten |
| 91 | police-mini_mock-set-14-q06 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ B … | explanation rewritten |
| 92 | police-mini_mock-set-14-q07 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ B … | explanation rewritten<br>tip rewritten |
| 93 | police-mini_mock-set-14-q08 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ B … | explanation rewritten |
| 94 | police-mini_mock-set-14-q09 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ B … | explanation rewritten |
| 95 | police-mini_mock-set-14-q11 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ A … | explanation rewritten |
| 96 | police-mini_mock-set-14-q12 | expl-mismatch:  Copy with reshuffled choices: the explanation still uses the original letters (e.g. says the answer is ข้อ C … | explanation rewritten |
| 97 | police-mock_test-set-04-q077 | expl-mismatch:  TIP lists .go.th as a Top-Level Domain. The TLD is only .th; .go is a second-level domain under .th. This con… | tip rewritten |
| 98 | police-saraban-set-01-q09 | expl-mismatch:  The tip ('สิ่งที่ไม่ใช่หนังสือสั่งการคือ แถลงการณ์') answers a different question; this item asks which docum… | tip rewritten |
| 99 | police-saraban-set-01-q40 | expl-mismatch:  The tip states the false fact ('ไม่เล็กกว่า 32 พอยต์') as the memory point; the correct size is 24 พอยท์. The…; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: การเก็บรักษาหนังสือราชการ ข้อใดต่อไปนี้ผิด → การเก็บรักษาหนังสือราชการ ข้อใดต่อไปนี้“ผิด” |
| 100 | police-saraban-set-02-q36 | expl-mismatch:  Leak in prompt ('ตามตัวอย่างชุดที่ 2') and explanation ('ที่ต้นฉบับกำลังวัด'); tip 'จุดจำ: การปฏิบัติ' presen…; negative stem quoted | prompt: รายละเอียดใดไม่ใช่ช่องหลักในแบบตราประทับรับหนังสือตามตัวอย่า… → รายละเอียดใด“ไม่ใช่”ช่องในตรารับหนังสือ<br>explanation rewritten<br>tip rewritten |
| 101 | police-saraban-set-02-q46 | expl-mismatch:  Leak in prompt ('ตามกรอบของต้นฉบับชุดที่ 2') and odd authoring phrase in explanation; tip restates the false …; negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับระบบสารบรรณอิเล็กทรอนิกส์ตามกรอบของต้น… → ข้อใดกล่าว“ผิด”เกี่ยวกับระบบสารบรรณอิเล็กทรอนิกส์ตามระเบียบง…<br>explanation rewritten<br>tip rewritten |
| 102 | police-saraban-set-03-q07 | expl-mismatch:  Prompt 'ตามคาแรกเตอร์ข้อสอบต้นฉบับ' and explanation 'ต้นฉบับชุดที่ 3 ข้อ 7' are leaks; tip restates the false… | prompt: ข้อใดกล่าวเกี่ยวกับ “ประกาศ” ไม่ถูกต้องตามคาแรกเตอร์ข้อสอบต้… → ข้อใดกล่าวเกี่ยวกับ “ประกาศ” ไม่ถูกต้อง<br>explanation rewritten<br>tip rewritten |
| 103 | police-saraban-set-03-q10 | expl-mismatch:  Explanation leak 'ต้นฉบับชุดที่ 3 ข้อ 10'; tip says 'จุดจำ: เลขหนังสือเวียนเริ่มจากเลข 0...' which teaches th…; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวเกี่ยวกับหนังสือเวียนไม่ถูกต้อง → ข้อใดกล่าวเกี่ยวกับหนังสือเวียน“ไม่ถูกต้อง” |
| 104 | police-saraban-set-03-q16 | expl-mismatch:  Prompt 'ตามต้นฉบับชุดที่ 3' and explanation 'ต้นฉบับข้อ 7' are leaks; tip 'ประกาศทุกฉบับต้องมี “ฉบับที่”' res…; negative stem quoted | prompt: ข้อใดไม่ใช่ลักษณะที่ควรนำไปใช้เป็นกฎเหมารวมของประกาศตามต้นฉบ… → ข้อใด“ไม่ใช่”ลักษณะของประกาศ<br>explanation rewritten<br>tip rewritten |
| 105 | police-saraban-set-03-q24 | expl-mismatch:  Prompt 'ตามแนวต้นฉบับชุดที่ 3', choice ข 'ตามตัวอย่างที่โจทย์ใช้' (refers to an unseen example) and explanati…; negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับ “ฉบับที่” ตามแนวต้นฉบับชุดที่ … → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับ “ฉบับที่”<br>ข: ประกาศไม่จำเป็นต้องใส่ฉบับที่ตามตัวอย่าง… → ประกาศไม่จำเป็นต้องใส่ฉบับที่ตามแบบที่ระ…<br>explanation rewritten<br>tip rewritten |
| 106 | police-saraban-set-03-q30 | expl-mismatch:  Prompt 'ข้อใดไม่ใช่สีที่ต้นฉบับใช้เป็นคำตอบ' and explanation 'ต้นฉบับข้อ 13' are leaks; tip 'จุดจำ: สีน้ำเงิน…; negative stem quoted | prompt: ข้อใดไม่ใช่สีที่ต้นฉบับใช้เป็นคำตอบสำหรับตราประทับชั้นความลั… → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับสีของตราประทับชั้นความลับ<br>explanation rewritten<br>tip rewritten |
| 107 | police-saraban-set-03-q42 | expl-mismatch:  Prompt 'ตามเงื่อนไขของต้นฉบับชุดที่ 3' and explanation 'ต้นฉบับข้อ 23' are leaks; tip 'จุดจำ: 1 ปี' suggests …; lead edit; negative stem quoted | prompt: หนังสือด้านการเงินที่ผ่านการตรวจแล้วตามเงื่อนไขของต้นฉบับชุด… → หนังสือด้านการเงินที่สำนักงานการตรวจเงินแผ่นดินตรวจสอบแล้วไม…<br>explanation rewritten<br>tip rewritten |
| 108 | police-saraban-set-03-q46 | expl-mismatch:  Prompt 'ที่ต้นฉบับชุดที่ 3 ใช้ถาม' and explanation 'ต้นฉบับชุดที่ 3 ข้อ 29' are leaks; tip shows the wrong fi…; negative stem quoted | prompt: ข้อใดไม่ถูกต้องตามรูปแบบการตั้งชื่อไฟล์ราชการที่ต้นฉบับชุดที… → ข้อใด“ไม่ถูกต้อง”ตามหลักเกณฑ์การตั้งชื่อไฟล์ในภาคผนวก 7 ท้าย…<br>explanation rewritten<br>tip rewritten |
| 109 | police-thai-set-01-q11 | expl-mismatch:  Explanation discusses a choice 'แนะนำ' that does not exist among the choices (ก ตำหนิ, ข ให้ข้อคิด, ค โฆษณา, … | explanation rewritten |
| 110 | police-thai-set-01-q26 | expl-mismatch:  Key ค is still the only choice with both readings wrong, but choice ง contains a wrong reading (จักรยาน = จัก…; negative stem quoted | ง: อุณหภูมิ = อุน-หะ-พูม / จักรยาน = จัก-กะ… → อุณหภูมิ = อุน-หะ-พูม / จักรยาน = จัก-กฺ…<br>explanation rewritten<br>prompt: ข้อใดอ่านออกเสียงผิดทั้งหมด → ข้อใดอ่านออกเสียง“ผิด”ทั้งหมด |
| 111 | police-thai-set-02-q36 | expl-mismatch:  Explanation says 'สองตัวเลือกแรก' are personification, but the first two choices are ก (personification) and … | explanation rewritten |
| 112 | police-law-set-01-q24 | leak:  Explanation has 'ข้อนี้รักษาคาแรกเตอร์ต้นฉบับ…'. | explanation rewritten |
| 113 | police-law-set-01-q34 | leak:  Prompt contains "ตามตัวอย่างในต้นฉบับ". | prompt: ข้อใดเป็นความผิดอันยอมความได้ตามตัวอย่างในต้นฉบับ → ข้อใดเป็นความผิดอันยอมความได้ |
| 114 | police-law-set-01-q43 | leak:  Prompt has 'ตามแนวตัวอย่างต้นฉบับ'. The TIP gives the non-aggravating choice as the จุดจำ.; negative stem quoted | prompt: ข้อใดไม่ใช่เหตุฉกรรจ์ของลักทรัพย์ตามมาตรา 335 ตามแนวตัวอย่าง… → ข้อใด“ไม่ใช่”เหตุฉกรรจ์ของลักทรัพย์ตามมาตรา 335<br>tip rewritten |
| 115 | police-law-set-01-q50 | leak:  Explanation says 'ข้อสอบต้นฉบับใช้ตัวเลข 15 วันเป็น fact หลักที่ต้องจำ'. The TIP also gives the false choice …; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการแจ้งเกิดตามหลักทะเบียนราษฎร → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการแจ้งเกิดตามหลักทะเบียนราษฎ… |
| 116 | police-law-set-02-q01 | leak:  Prompt has 'ตามแนวคำถามต้นฉบับชุดที่ 2'. Explanation has 'ต้นฉบับใช้ถ้อยคำว่า… และเฉลย…'. | prompt: ประเทศคู่ใดอยู่ในกลุ่มระบบ Common Law ตามแนวคำถามต้นฉบับชุดท… → ประเทศคู่ใดอยู่ในกลุ่มระบบ Common Law<br>explanation rewritten |
| 117 | police-law-set-02-q02 | leak:  Explanation has the authoring note 'ข้อนี้รักษาแกนเรื่องระบบกฎหมายจากต้นฉบับชุดที่ 2 ข้อ 1 แต่ทำคำตอบให้มีเพี… | explanation rewritten |
| 118 | police-law-set-02-q04 | leak:  Prompt has 'ตามแนวตัวอย่างต้นฉบับ'. Explanation has 'จึงเป็นตัวลวงเดียวกับต้นฉบับชุดที่ 2 ข้อ 2'.; negative stem quoted | prompt: ข้อใดไม่ใช่สัญญาทางปกครองตามแนวตัวอย่างต้นฉบับ → ข้อใด“ไม่ใช่”สัญญาทางปกครอง<br>explanation rewritten |
| 119 | police-law-set-02-q06 | leak:  Explanation has 'ตามแนวที่ต้นฉบับต้องการวัด'. | explanation rewritten |
| 120 | police-law-set-02-q09 | leak:  Explanation has 'ตรงกับเฉลยต้นฉบับชุดที่ 2 ข้อ 4'. | explanation rewritten |
| 121 | police-law-set-02-q12 | leak:  Explanation has 'จึงตรงกับเฉลยต้นฉบับชุดที่ 2 ข้อ 5'. | explanation rewritten |
| 122 | police-law-set-02-q13 | leak:  Explanation refers to the authoring source: "ข้อนี้วนถาม fact เดียวกับต้นฉบับข้อ 5 ในอีกมุมหนึ่ง". | explanation rewritten |
| 123 | police-law-set-02-q43 | leak:  Explanation has 'จึงเป็นจุดตัวเลขที่ต้นฉบับชุดที่ 2 เน้นทดสอบ'. The TIP gives the false choice (7 ปี) as the …; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับหลักห้ามอ้างความไม่รู้อายุของเด… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับหลักห้ามอ้างความไม่รู้อายุของ… |
| 124 | police-law-set-02-q46 | leak:  Prompt has 'ตามแนวต้นฉบับ'.; negative stem quoted | prompt: ข้อใดไม่ใช่กฎหมายที่มีวัตถุประสงค์หลักด้านการคุ้มครองผู้บริโ… → ข้อใด“ไม่ใช่”กฎหมายที่มีวัตถุประสงค์หลักด้านการคุ้มครองผู้บร… |
| 125 | police-law-set-02-q47 | leak:  Explanation ends with "ตามแนวคำถามต้นฉบับ". | explanation rewritten |
| 126 | police-law-set-02-q50 | leak:  Explanation has 'ข้อนี้คงตัวลวง 15/30/45/60 วันตาม DNA ของต้นฉบับชุดที่ 2 ข้อ 20'. The TIP gives the false ch…; negative stem quoted | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการขอมีบัตรประจำตัวประชาชนครั้ง… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการขอมีบัตรประจำตัวประชาชนครั… |
| 127 | police-law-set-03-q04 | leak:  Prompt has 'ตามแนวต้นฉบับ'. The TIP gives the false statement as the จุดจำ.; negative stem quoted | prompt: ข้อใดไม่ใช่ข้อดีของหลักการรวมอำนาจทางปกครองตามแนวต้นฉบับ → ข้อใด“ไม่ใช่”ข้อดีของหลักการรวมอำนาจทางปกครอง<br>tip rewritten |
| 128 | police-law-set-03-q08 | leak:  Explanation has 'ข้อนี้คงคาแรกเตอร์ต้นฉบับที่ถามโครงสร้างองค์กรรัฐแบบจำตรง'. | explanation rewritten |
| 129 | police-law-set-03-q09 | leak:  Explanation has 'ต้นฉบับชุดที่ 3 ใช้รูปแบบตัวเลือกคำตอบรวม'. The choices are also garbled ('ก. 1. สภาผู้แทนรา… | prompt: ข้อใดกล่าวถูกต้องเกี่ยวกับองค์ประกอบของรัฐสภา → 3. วุฒิสภา<br>ก: 1. สภาผู้แทนราษฎร → ข้อ 1 เท่านั้น<br>ข: 2. สภานิติบัญญัติแห่งชาติ → ข้อ 2 เท่านั้น<br>ค: 3. วุฒิสภา → ข้อ 3 เท่านั้น<br>ง: ข้อ 1 และ 3 ถูก → ข้อ 1 และ 3<br>explanation rewritten<br>tip rewritten |
| 130 | police-law-set-03-q40 | leak:  Explanation ends with 'ในกรอบคำถามต้นฉบับชุดที่ 3'. | explanation rewritten |
| 131 | police-law-set-03-q47 | leak:  Explanation says "จึงเป็นตัวเลขที่ต้นฉบับชุดที่ 3 เน้นให้จำตรง ๆ". | explanation rewritten |
| 132 | police-math-category-geometry-q19 | leak:  Explanation says "แท่งเหล็กทรงกระบอกต้นฉบับ" (authoring word ต้นฉบับ) and "ลูกกระสุน", neither of which is in… | explanation rewritten |
| 133 | police-mini_mock-set-06-q15 | leak:  Explanation says 'ตามเฉลยระเบียบงานสารบรรณ ข้อ 21', which is authoring residue plus an old question number. T… | explanation rewritten |
| 134 | police-mini_mock-set-12-q02 | leak:  Leftover wording 'ซึ่งเป็นลักษณะจำแนกที่ระเบียบงานสารบรรณ ใช้ถามโดยตรง'. Originally this said ต้นฉบับ; regula… | explanation rewritten |
| 135 | police-mini_mock-set-12-q05 | leak:  Leftover wording: 'ระเบียบงานสารบรรณ เจาะเฉพาะเลข “01” ในตัวอย่าง... และใช้เป็นข้อถอดรหัส' describes the sour… | explanation rewritten |
| 136 | police-mini_mock-set-12-q09 | leak:  Explanation has authoring text: 'เพื่อรักษาคาแรกเตอร์ mock exam'. | explanation rewritten |
| 137 | police-mini_mock-set-12-q17 | leak:  The prompt has leftover wording 'ตามมุมที่ระเบียบงานสารบรรณใช้ถาม' (originally ต้นฉบับ). The explanation cite… | prompt: คำว่า “ด่วนภายใน” ต่างจากการระบุเพียง “ด่วน” อย่างไรตามมุมที… → ตามระเบียบงานสารบรรณ คำว่า “ด่วนภายใน” ต่างจากการระบุเพียง “…<br>explanation rewritten |
| 138 | police-mini_mock-set-12-q18 | leak:  The prompt has leftover wording 'ที่ระเบียบงานสารบรรณใช้เป็นคำตอบ'. The explanation attributes the rule to 'ร…; negative stem quoted | prompt: ข้อใดไม่ใช่สีที่ระเบียบงานสารบรรณใช้เป็นคำตอบสำหรับตราประทับ… → ข้อใด“ไม่ใช่”สีที่ใช้แสดงชั้นความลับบนหนังสือราชการ<br>explanation rewritten<br>tip rewritten |
| 139 | police-mini_mock-set-12-q20 | leak:  The prompt has leftover wording 'ตามหลักที่ระเบียบงานสารบรรณ ใช้ถาม'. The explanation cites 'ข้อ 25'; the rul… | prompt: บุคคลภายนอกยืมหนังสือราชการได้หรือไม่ตามหลักที่ระเบียบงานสาร… → ตามระเบียบงานสารบรรณ บุคคลภายนอกยืมหนังสือราชการได้หรือไม่<br>explanation rewritten |
| 140 | police-mock_test-set-04-q097 | leak:  Explanation contains authoring jargon 'one-fact question แบบสนามสอบ'. | explanation rewritten |
| 141 | police-saraban-quick-07-q03 | leak:  Choice ง and the explanation refer to choices by number ("ข้อ 2 และ 3") although choices are labelled ก ข ค ง… | ง: ข้อ 2 และ 3 ถูก → ข้อ ข และ ค ถูก<br>explanation rewritten |
| 142 | police-saraban-set-01-q01 | leak:  Explanation: 'คาแรกเตอร์ข้อสอบต้นฉบับชุดที่ 1 ซึ่งเปิดชุดด้วย...'. | explanation rewritten |
| 143 | police-saraban-set-01-q03 | leak:  Explanation: 'เลียนแบบการถาม... ของต้นฉบับโดยตรง'. | explanation rewritten |
| 144 | police-saraban-set-01-q04 | leak:  Explanation: 'จุดจำของข้อสอบต้นฉบับ'. | explanation rewritten |
| 145 | police-saraban-set-01-q05 | leak:  Explanation refers to 'ข้อ 2' (a choice number) and 'ตามต้นฉบับชุดที่ 1', plus 'รักษาคาแรกเตอร์'.; negative stem quoted | explanation rewritten<br>prompt: ข้อใดไม่ถูกต้องเกี่ยวกับหนังสือประทับตรา → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับหนังสือประทับตรา |
| 146 | police-saraban-set-01-q08 | leak:  Explanation: 'นิยามที่ต้นฉบับใช้'. | explanation rewritten |
| 147 | police-saraban-set-01-q10 | leak:  Explanation: 'เหมือนต้นฉบับชุดที่ 1'. | explanation rewritten |
| 148 | police-saraban-set-01-q11 | leak:  Explanation: 'ตามแบบที่ต้นฉบับใช้ถาม ข้อสอบต้องการวัด...'. | explanation rewritten |
| 149 | police-saraban-set-01-q12 | leak:  Explanation: 'ตัวบ่งชี้ที่ต้นฉบับต้องการให้จำ'. | explanation rewritten |
| 150 | police-saraban-set-01-q14 | leak:  Explanation refers to 'ข้อ 2' (a choice number) and 'ต้นฉบับ'.; negative stem quoted | explanation rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับหนังสือภายใน → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับหนังสือภายใน |
| 151 | police-saraban-set-01-q15 | leak:  Prompt: 'กรณีใดในข้อสอบต้นฉบับ'. Explanation: 'ข้อความที่ต้นฉบับยกมา'. | prompt: กรณีใดในข้อสอบต้นฉบับสามารถใช้หนังสือประทับตราได้ → กรณีใดต่อไปนี้สามารถใช้หนังสือประทับตราได้<br>explanation rewritten |
| 152 | police-saraban-set-01-q16 | leak:  Prompt: 'ส่วนที่ต้นฉบับระบุว่า'. Explanation: 'เป้าหมาย Mock Exam ที่ยอมให้หัวข้อเดิมวนกลับมาได้'. | prompt: ข้อใดเป็นส่วนที่ต้นฉบับระบุว่าอยู่ลำดับที่สองของข้อความใน “ร… → ข้อใดเป็นส่วนที่อยู่ลำดับที่สองของข้อความใน “ระเบียบ”<br>explanation rewritten |
| 153 | police-saraban-set-01-q17 | leak:  Explanation: 'แบบเดียวกับต้นฉบับ'. | explanation rewritten |
| 154 | police-saraban-set-01-q18 | leak:  Explanation: 'ต้นฉบับชุดที่ 1 วัดตำแหน่งรูปถ่ายโดยตรง ข้อนี้จึงเปลี่ยนเป็น...'. | explanation rewritten |
| 155 | police-saraban-set-01-q19 | leak:  Prompt: 'ที่ต้นฉบับใช้'. Explanation: 'คาแรกเตอร์ข้อสอบต้นฉบับ... โจทย์ต้นฉบับเน้น'. | prompt: รายการใดควรปรากฏท้ายสุดตามแบบรายงานการประชุมที่ต้นฉบับใช้ → รายการใดควรปรากฏท้ายสุดตามแบบรายงานการประชุม<br>explanation rewritten |
| 156 | police-saraban-set-01-q20 | leak:  Explanation: 'สัญลักษณ์ที่ต้นฉบับใช้... เหมาะกับ Mock Exam'. | explanation rewritten |
| 157 | police-saraban-set-01-q22 | leak:  Explanation refers to 'ข้อ 3' (a choice number) and 'เหมือนต้นฉบับ'.; negative stem quoted | explanation rewritten<br>prompt: ข้อใดกล่าวผิดเกี่ยวกับ “ด่วนที่สุด” → ข้อใดกล่าว“ผิด”เกี่ยวกับ “ด่วนที่สุด” |
| 158 | police-saraban-set-01-q23 | leak:  Explanation: 'ชื่อชั้นความลับที่ต้นฉบับใช้'. | explanation rewritten |
| 159 | police-saraban-set-01-q24 | leak:  Prompt: 'ตามตัวเลือกที่ข้อสอบต้นฉบับใช้'. Explanation: 'ชั้นที่ต้นฉบับใช้'.; negative stem quoted | prompt: ข้อใดไม่ใช่ชื่อชั้นความลับตามตัวเลือกที่ข้อสอบต้นฉบับใช้ → ข้อใด“ไม่ใช่”ชื่อชั้นความลับของทางราชการ<br>explanation rewritten |
| 160 | police-saraban-set-01-q28 | leak:  Explanation: 'ตัวเลือก 2' and 'ตามตัวอย่างในต้นฉบับ'. | explanation rewritten |
| 161 | police-saraban-set-01-q30 | leak:  Prompt: 'ตามตัวอย่างข้อสอบต้นฉบับ'.; lead edit | prompt: ข้อใดคือคำขึ้นต้นและคำลงท้ายของ พล.ต.อ. กิตติ์รัฐ พันธุ์เพ็ช… → ข้อใดคือคำขึ้นต้นและคำลงท้ายของหนังสือถึงผู้บัญชาการตำรวจแห่… |
| 162 | police-saraban-set-01-q31 | leak:  Explanation: 'ตามต้นฉบับชุดที่ 1'. | explanation rewritten |
| 163 | police-saraban-set-01-q32 | leak:  Explanation: 'ที่ต้นฉบับชุดที่ 1 ถามโดยตรง'. | explanation rewritten |
| 164 | police-saraban-set-01-q33 | leak:  Prompt: 'ตามตัวอย่างข้อสอบชุดที่ 1'. Explanation: 'แนว Mock Exam'. | prompt: ข้อใดกล่าวถูกต้องเกี่ยวกับขนาดกระดาษตราครุฑตามตัวอย่างข้อสอบ… → ข้อใดกล่าวถูกต้องเกี่ยวกับขนาดกระดาษตราครุฑ<br>explanation rewritten |
| 165 | police-saraban-set-01-q34 | leak:  Explanation: 'เปลี่ยนข้อจำตัวเลขของต้นฉบับ...'. | explanation rewritten |
| 166 | police-saraban-set-01-q35 | leak:  Prompt: 'ตามตัวอย่างชุดที่ 1'. Explanation: 'แบบที่ต้นฉบับใช้'.; negative stem quoted | prompt: ข้อใดไม่ใช่รูปแบบวันที่ของหนังสือภายนอกตามตัวอย่างชุดที่ 1 → ข้อใด“ไม่ใช่”รูปแบบวันที่ของหนังสือภายนอก<br>explanation rewritten |
| 167 | police-saraban-set-01-q36 | leak:  Explanation: 'ต้นฉบับชุดที่ 1 ใช้รูปแบบ'. | explanation rewritten |
| 168 | police-saraban-set-01-q37 | leak:  The prompt depends on an unseen 'บุคคลเดียวกับตัวอย่างชุดที่ 1'. Explanation: 'คาแรกเตอร์การสร้างตัวเลือกของต…; lead edit | prompt: จากกรณีบุคคลเดียวกับตัวอย่างชุดที่ 1 ข้อใดจับคู่คำขึ้นต้น-คำ… → หนังสือถึงผู้บัญชาการตำรวจแห่งชาติ ข้อใดจับคู่คำขึ้นต้น-คำลง…<br>explanation rewritten |
| 169 | police-saraban-set-01-q39 | leak:  Explanation: 'ตามกรอบตัวเลือกของต้นฉบับชุดที่ 1'. | explanation rewritten |
| 170 | police-saraban-set-01-q43 | leak:  Explanation: 'สไตล์หลักของต้นฉบับชุดที่ 1'. | explanation rewritten |
| 171 | police-saraban-set-01-q44 | leak:  Explanation: 'ตามต้นฉบับข้อ 25' (an old question number) and 'ตามตัวอย่างข้อสอบ'. The real rule is ข้อ 55.1.1… | explanation rewritten |
| 172 | police-saraban-set-01-q45 | leak:  Prompt: 'ตามตัวอย่างข้อสอบชุดที่ 1'. | prompt: หนังสือที่เก็บโดยมีกำหนดเวลา ควรใช้ตราข้อความใดตามตัวอย่างข้… → หนังสือที่เก็บโดยมีกำหนดเวลา ควรใช้ตราข้อความใด |
| 173 | police-saraban-set-01-q46 | leak:  Prompt: 'ตามกรอบต้นฉบับ'. Explanation: 'ที่ต้นฉบับใช้ถาม'. | prompt: การเก็บหนังสืออิเล็กทรอนิกส์ในระบบสารบรรณอิเล็กทรอนิกส์ ต้อง… → การเก็บหนังสืออิเล็กทรอนิกส์ในระบบสารบรรณอิเล็กทรอนิกส์ ต้อง…<br>explanation rewritten |
| 174 | police-saraban-set-01-q47 | leak:  Prompt: 'ตามลักษณะตัวเลือกของต้นฉบับ'. Explanation: 'รักษาวิธีสร้างตัวลวงของต้นฉบับแทบตรงตัว'.; negative stem quoted | prompt: ข้อใดต่อไปนี้ไม่ใช่อีเมลราชการตามลักษณะตัวเลือกของต้นฉบับ → ข้อใดต่อไปนี้“ไม่ใช่”อีเมลราชการ<br>explanation rewritten |
| 175 | police-saraban-set-01-q48 | leak:  Explanation: 'ตามตัวอย่างที่ต้นฉบับใช้'. | explanation rewritten |
| 176 | police-saraban-set-01-q49 | leak:  Prompt: 'ที่ออกในต้นฉบับชุดที่ 1'. Explanation: 'ข้อสอบจำลองที่ต้องการย้ำจุดออกสอบหลัก'. | prompt: ข้อใดกล่าวถูกต้องตามประเด็นการเก็บหนังสืออิเล็กทรอนิกส์ที่ออ… → ข้อใดกล่าวถูกต้องเกี่ยวกับการเก็บหนังสืออิเล็กทรอนิกส์ในระบบ…<br>explanation rewritten |
| 177 | police-saraban-set-01-q50 | leak:  Prompt: 'ตามรูปแบบเดียวกับต้นฉบับ'. | prompt: หากเลขทะเบียนหนังสือส่งเปลี่ยนจาก 13 เป็น 25 โดยส่วนอื่นคงเด… → หากเลขทะเบียนหนังสือส่งเปลี่ยนจาก 13 เป็น 25 โดยส่วนอื่นคงเด… |
| 178 | police-saraban-set-02-q02 | leak:  Prompt: 'ตามแนวข้อสอบต้นฉบับชุดที่ 2'. Explanation: 'คาแรกเตอร์ข้อสอบต้นฉบับ'. | prompt: ข้อใดเป็นคณะกรรมการที่เกี่ยวข้องโดยตรงกับการให้ความเห็นเรื่อ… → ข้อใดเป็นคณะกรรมการที่เกี่ยวข้องโดยตรงกับการให้ความเห็นเรื่อ…<br>explanation rewritten |
| 179 | police-saraban-set-02-q03 | leak:  Explanation: 'ตัวลวงจงใจเปลี่ยนคำเพียงเล็กน้อยเหมือนต้นฉบับ'.; negative stem quoted | explanation rewritten<br>prompt: ข้อใดไม่ใช่ชนิดของหนังสือราชการตามรูปแบบคำเรียกในระเบียบ → ข้อใด“ไม่ใช่”ชนิดของหนังสือราชการตามรูปแบบคำเรียกในระเบียบ |
| 180 | police-saraban-set-02-q05 | leak:  Explanation: 'ที่ต้นฉบับชุดที่ 2 ใช้ถามโดยตรง'. | explanation rewritten |
| 181 | police-saraban-set-02-q06 | leak:  Explanation: 'ที่ต้นฉบับยกไว้... คาแรกเตอร์ของชุดตัวอย่าง'. | explanation rewritten |
| 182 | police-saraban-set-02-q07 | leak:  Prompt: 'ตามแนวข้อสอบต้นฉบับชุดที่ 2'. Explanation: 'ต้นฉบับยก... คงคาแรกเตอร์ชุดที่ 2'.; negative stem quoted | prompt: ข้อใดไม่ใช่ตัวอย่างการใช้หนังสือประทับตราตามแนวข้อสอบต้นฉบับ… → ข้อใด“ไม่ใช่”ตัวอย่างการใช้หนังสือประทับตรา<br>explanation rewritten |
| 183 | police-saraban-set-02-q09 | leak:  Prompt contains 'ตามนิยามที่ข้อสอบต้นฉบับใช้'. | prompt: ถ้าข้อความหนึ่งมีวัตถุประสงค์ให้ถือเป็นหลักปฏิบัติงานเป็นประ… → ถ้าข้อความหนึ่งมีวัตถุประสงค์ให้ถือเป็นหลักปฏิบัติงานเป็นประ… |
| 184 | police-saraban-set-02-q10 | leak:  Explanation contains 'ตามต้นฉบับชุดที่ 2'. | explanation rewritten |
| 185 | police-saraban-set-02-q12 | leak:  Explanation starts 'ต้นฉบับชุดที่ 2 วัดการแยกนิยาม...'. | explanation rewritten |
| 186 | police-saraban-set-02-q14 | leak:  Prompt 'ตามแบบที่ข้อสอบต้นฉบับชุดที่ 2 ใช้'; explanation 'ตามคาแรกเตอร์ของต้นฉบับ'. | prompt: รูปถ่ายที่ติดในหนังสือรับรองตามแบบที่ข้อสอบต้นฉบับชุดที่ 2 ใ… → รูปถ่ายที่ติดในหนังสือรับรองซึ่งเป็นเรื่องสำคัญที่ออกให้แก่บ…<br>explanation rewritten |
| 187 | police-saraban-set-02-q16 | leak:  Prompt contains 'ตามแนวข้อสอบต้นฉบับ'. | prompt: สาระสำคัญใดควรปรากฏในความหมายของ “รายงานการประชุม” ตามแนวข้อ… → สาระสำคัญใดควรปรากฏในความหมายของ “รายงานการประชุม” ตามระเบีย… |
| 188 | police-saraban-set-02-q17 | leak:  Prompt 'ตามแนวคำถามต้นฉบับชุดที่ 2'; explanation 'ตามลักษณะข้อสอบต้นฉบับ'. | prompt: ข้อใดเป็นหนังสือราชการตามแนวคำถามต้นฉบับชุดที่ 2 → ข้อใดเป็นหนังสือราชการ<br>explanation rewritten |
| 189 | police-saraban-set-02-q18 | leak:  Explanation 'ต้นฉบับถามตรงว่า...'. | explanation rewritten |
| 190 | police-saraban-set-02-q19 | leak:  Explanation 'สีสำหรับชั้นความเร็วตามต้นฉบับคือสีแดง'. | explanation rewritten |
| 191 | police-saraban-set-02-q20 | leak:  Explanation carries authoring meta 'ตามแนว mock exam ซึ่งยอมให้เรื่องสำคัญวนถามซ้ำได้'. | explanation rewritten |
| 192 | police-saraban-set-02-q22 | leak:  Explanation 'ซึ่งเป็นลักษณะเด่นของต้นฉบับชุดที่ 2'. | explanation rewritten |
| 193 | police-saraban-set-02-q23 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'; explanation 'ต้นฉบับชุดที่ 2 เจาะเฉพาะ...'. | prompt: ในเลขที่หนังสือสำนักนายกรัฐมนตรี เช่น “นร 0106/...” เลข “01”… → ในเลขที่หนังสือสำนักนายกรัฐมนตรี เช่น “นร 0106/...” เลข “01”…<br>explanation rewritten |
| 194 | police-saraban-set-02-q24 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'. | prompt: ข้อใดเขียนวันที่ในหนังสือภายในได้ถูกต้องตามตัวอย่างชุดที่ 2 → ข้อใดเขียนวันที่ในหนังสือภายในได้ถูกต้อง<br>explanation rewritten |
| 195 | police-saraban-set-02-q25 | leak:  Prompt 'ตามตัวอย่างข้อสอบชุดที่ 2'.; negative stem quoted | prompt: ข้อใดไม่ใช่รูปแบบวันที่ของหนังสือภายในตามตัวอย่างข้อสอบชุดที… → ข้อใด“ไม่ใช่”รูปแบบวันที่ของหนังสือภายใน |
| 196 | police-saraban-set-02-q26 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'. | prompt: ข้อใดเขียนวันที่ในหนังสือรับรองได้ถูกต้องตามตัวอย่างชุดที่ 2 → ข้อใดเขียนวันที่ในหนังสือรับรองได้ถูกต้อง<br>explanation rewritten |
| 197 | police-saraban-set-02-q27 | leak:  Explanation carries authoring meta 'เพื่อเลียนแบบข้อสอบจำรูปแบบเอกสาร'. | explanation rewritten |
| 198 | police-saraban-set-02-q28 | leak:  Prompt 'ตามตัวอย่างต้นฉบับ'; explanation 'ต้นฉบับชุดที่ 2 ให้เทียบ layout'. | prompt: ข้อใดแสดงรูปแบบการลงชื่อและตำแหน่งในบันทึกข้อความได้ถูกต้องต… → ข้อใดแสดงรูปแบบการลงชื่อและตำแหน่งในบันทึกข้อความของข้าราชกา…<br>explanation rewritten |
| 199 | police-saraban-set-02-q29 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'. | prompt: องค์ประกอบใดควรปรากฏครบในส่วนลงชื่อของบันทึกข้อความตามตัวอย่… → องค์ประกอบใดควรปรากฏครบในส่วนลงชื่อของบันทึกข้อความ<br>explanation rewritten |
| 200 | police-saraban-set-02-q30 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'; explanation 'ต้นฉบับใช้ชื่อบุคคลทั่วไป'. | prompt: คำขึ้นต้นและคำลงท้ายของหนังสือถึง “นายสมชาย รักหวาน” ตามตัวอ… → คำขึ้นต้นและคำลงท้ายของหนังสือถึงบุคคลทั่วไป เช่น “นายสมชาย …<br>explanation rewritten |
| 201 | police-saraban-set-02-q31 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'; explanation 'ต้นฉบับจับคู่...one-fact question แบบสนามสอบ'. | prompt: คำลงท้ายของหนังสือถึง “นายสมชาย รักหวาน” ตามตัวอย่างชุดที่ 2… → คำลงท้ายของหนังสือถึงบุคคลทั่วไป เช่น “นายสมชาย รักหวาน” คือ…<br>explanation rewritten |
| 202 | police-saraban-set-02-q32 | leak:  Explanation 'เป็น fact ที่ต้นฉบับถามตรง ๆ'. | explanation rewritten |
| 203 | police-saraban-set-02-q33 | leak:  Prompt 'ตามแนวข้อสอบต้นฉบับ'; explanation 'คาแรกเตอร์ต้นฉบับ'. | prompt: หากพับหนังสือกระดาษตราครุฑเป็น 3 ส่วนตามแนวข้อสอบต้นฉบับ ควร… → หากพับหนังสือกระดาษตราครุฑเป็น 3 ส่วน ควรเลือกซองชนิดใด<br>explanation rewritten |
| 204 | police-saraban-set-02-q34 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'; explanation 'คงสไตล์ต้นฉบับ'. | prompt: ตามตัวอย่างชุดที่ 2 ตราชื่อส่วนราชการมีวงกลมซ้อนกัน 2 วง ขนา… → ตามระเบียบงานสารบรรณ ตราชื่อส่วนราชการมีวงกลมซ้อนกัน 2 วง ขน…<br>explanation rewritten |
| 205 | police-saraban-set-02-q35 | leak:  Prompt and explanation say 'ตามตัวอย่างชุดที่ 2' / 'ของชุดที่ 2'. | prompt: ตราครุฑที่อยู่ภายในตราชื่อส่วนราชการตามตัวอย่างชุดที่ 2 มีคว… → ตราครุฑที่อยู่ภายในตราชื่อส่วนราชการมีความสูงเท่าใด<br>explanation rewritten |
| 206 | police-saraban-set-02-q37 | leak:  Explanation 'นำข้อเท็จจริงจากต้นฉบับ... ชุดตัวอย่าง'. | explanation rewritten |
| 207 | police-saraban-set-02-q40 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'. | prompt: หนังสือที่เป็นเรื่องธรรมดาสามัญและเกิดขึ้นเป็นประจำ เมื่อดำเ… → หนังสือที่เป็นเรื่องธรรมดาสามัญและเกิดขึ้นเป็นประจำ เมื่อดำเ… |
| 208 | police-saraban-set-02-q41 | leak:  Prompt 'ตามแนวข้อสอบชุดที่ 2'; explanation 'แบบที่ข้อสอบจริงมักวนกลับมาถาม'. | prompt: เอกสารเรื่องธรรมดาสามัญที่เกิดเป็นประจำและเรื่องเสร็จแล้ว ตา… → เอกสารเรื่องธรรมดาสามัญที่เกิดเป็นประจำและเรื่องเสร็จแล้ว ใช…<br>explanation rewritten |
| 209 | police-saraban-set-02-q42 | leak:  Prompt 'ตามตัวอย่างชุดที่ 2'. | prompt: การยืมหนังสือภายในส่วนราชการเดียวกัน ผู้ใดมีอำนาจอนุญาตตามตั… → การยืมหนังสือภายในส่วนราชการเดียวกัน ผู้ใดมีอำนาจอนุญาต |
| 210 | police-saraban-set-02-q43 | leak:  Prompt 'ตามแนวข้อสอบต้นฉบับ'; explanation 'ตัวอย่างชุดที่ 2 ตั้งใจทดสอบ'. | prompt: หากเป็นการยืมหนังสือกันภายในส่วนราชการเดียวกัน ระดับผู้อนุญา… → หากเป็นการยืมหนังสือกันภายในส่วนราชการเดียวกัน ระดับผู้อนุญา…<br>explanation rewritten |
| 211 | police-saraban-set-02-q45 | leak:  Prompt 'ตามแนวข้อสอบชุดที่ 2'; explanation 'รักษาคาแรกเตอร์ mock exam'. | prompt: หลังคณะกรรมการทำลายหนังสือพิจารณารายการแล้ว ตามแนวข้อสอบชุดท… → หลังคณะกรรมการทำลายหนังสือพิจารณารายการแล้ว ต้องเสนอผลพร้อมค…<br>explanation rewritten |
| 212 | police-saraban-set-02-q47 | leak:  Prompt 'ตามประเด็นที่ต้นฉบับชุดที่ 2 ใช้เป็นตัวเลือก'; explanation last sentence. | prompt: การเก็บสำรองหนังสืออิเล็กทรอนิกส์ในรูปแบบ PDF ตามประเด็นที่ต… → การเก็บสำรองหนังสืออิเล็กทรอนิกส์ในรูปแบบ PDF กำหนดความละเอี…<br>explanation rewritten |
| 213 | police-saraban-set-02-q48 | leak:  Prompt 'ตามลักษณะตัวอย่างชุดที่ 2'.; negative stem quoted | prompt: ข้อใดไม่ใช่อีเมลราชการตามลักษณะตัวอย่างชุดที่ 2 → ข้อใด“ไม่ใช่”อีเมลราชการ |
| 214 | police-saraban-set-02-q49 | leak:  Prompt 'ตามตัวอย่างระบบสารบรรณอิเล็กทรอนิกส์ของชุดที่ 2'. | prompt: ข้อใดเป็นรูปแบบชื่อไฟล์ที่ถูกต้องตามตัวอย่างระบบสารบรรณอิเล็… → ข้อใดเป็นรูปแบบชื่อไฟล์ที่ถูกต้องตามหลักเกณฑ์การตั้งชื่อไฟล์… |
| 215 | police-saraban-set-02-q50 | leak:  Prompt 'ตามรูปแบบตัวอย่างชุดที่ 2'; explanation 'ในต้นฉบับ' and 'ตามข้อสอบต้นฉบับ'. | prompt: ข้อใดถูกต้องตามรูปแบบตัวอย่างชุดที่ 2 → ข้อใดถูกต้องตามหลักเกณฑ์การตั้งชื่อไฟล์ในภาคผนวก 7<br>explanation rewritten |
| 216 | police-saraban-set-03-q01 | leak:  Explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 1'. | explanation rewritten |
| 217 | police-saraban-set-03-q02 | leak:  Prompt 'ตามกรอบข้อสอบต้นฉบับชุดที่ 3'; explanation 'ต้นฉบับชุดที่ 3 ข้อ 2'. | prompt: ข้อใดอยู่ในความหมายของ “หนังสือราชการ” ตามกรอบข้อสอบต้นฉบับช… → ข้อใดอยู่ในความหมายของ “หนังสือราชการ” ตามระเบียบงานสารบรรณ<br>explanation rewritten |
| 218 | police-saraban-set-03-q03 | leak:  Prompt 'ตามรูปแบบที่ต้นฉบับถาม'; explanation 'ตามตัวเลือกและเฉลยของต้นฉบับชุดที่ 3 ข้อ 3 ... คาแรกเตอร์'. | prompt: สำหรับหนังสือภายนอก ตำแหน่งของ “ส่วนราชการเจ้าของเรื่อง” ตาม… → สำหรับหนังสือภายนอก ตำแหน่งของ “ส่วนราชการเจ้าของเรื่อง” อยู…<br>explanation rewritten |
| 219 | police-saraban-set-03-q04 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ต้นฉบับชุดที่ 3 ข้อ 4'. | prompt: ถ้าหนังสือภายในออกจากส่วนราชการที่อยู่ในระดับกรมขึ้นไป การลง… → ถ้าหนังสือภายในออกจากส่วนราชการที่อยู่ในระดับกรมขึ้นไป การลง…<br>explanation rewritten |
| 220 | police-saraban-set-03-q05 | leak:  Explanation 'ต้นฉบับชุดที่ 3 ข้อ 5'. | explanation rewritten |
| 221 | police-saraban-set-03-q06 | leak:  Prompt 'ส่วนล่างสุดของข้อความตามต้นฉบับ' (also slightly unclear vs. 'ประกาศ ณ วันที่' which sits below the te… | prompt: ในแบบ “ระเบียบ” ส่วนล่างสุดของข้อความตามต้นฉบับคือรายการใด → ในแบบ “ระเบียบ” ข้อสุดท้ายของข้อความคือรายการใด<br>explanation rewritten |
| 222 | police-saraban-set-03-q08 | leak:  Prompt 'ตามถ้อยคำมาตรฐานของต้นฉบับ'; explanation leak.; negative stem quoted | prompt: ตามแบบรายงานการประชุม ข้อใดไม่ใช่หัวข้อที่ใช้ตามถ้อยคำมาตรฐา… → ตามแบบรายงานการประชุม ข้อใด“ไม่ใช่”หัวข้อที่ระเบียบงานสารบรร…<br>explanation rewritten |
| 223 | police-saraban-set-03-q09 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3'; explanation leak. | prompt: ข้อความในบันทึกสามารถเป็นลักษณะใดได้บ้างตามต้นฉบับชุดที่ 3 → ข้อความในบันทึกสามารถเป็นลักษณะใดได้บ้างตามระเบียบงานสารบรรณ<br>explanation rewritten |
| 224 | police-saraban-set-03-q11 | leak:  Explanation 'วนถาม fact เดียวกับต้นฉบับข้อ 1 ... เป้าหมาย Mock Exam ... ชุดตัวอย่าง'. | explanation rewritten |
| 225 | police-saraban-set-03-q12 | leak:  Explanation 'ต้นฉบับชุดที่ 3 ข้อ 2'. | explanation rewritten |
| 226 | police-saraban-set-03-q13 | leak:  Prompt 'ตามมุมที่ต้นฉบับชุดที่ 3 ใช้ถาม'; explanation 'ต้นฉบับข้อ 3 ... เพื่อคง DNA'. | prompt: ตำแหน่งด้านล่างซ้ายของหนังสือภายนอกตามมุมที่ต้นฉบับชุดที่ 3 … → ตำแหน่งด้านล่างซ้ายของหนังสือภายนอก เชื่อมโยงกับรายการใด<br>explanation rewritten |
| 227 | police-saraban-set-03-q14 | leak:  Prompt 'ครบตามต้นฉบับ'; explanation 'ต้นฉบับชุดที่ 3 ข้อ 4'. | prompt: กรณีบันทึกข้อความจากหน่วยงานระดับกรมขึ้นไป ข้อใดสะท้อนการลงช… → กรณีบันทึกข้อความจากหน่วยงานระดับกรมขึ้นไป ข้อใดสะท้อนการลงช…<br>explanation rewritten |
| 228 | police-saraban-set-03-q15 | leak:  Prompt 'องค์ประกอบที่ต้นฉบับชุดที่ 3 เน้นถาม'; explanation 'ต้นฉบับข้อ 6'. | prompt: ถ้าตรวจแบบ “ระเบียบ” แล้วส่วนท้ายไม่มีรายการใดต่อไปนี้ จะขาด… → ถ้าตรวจแบบ “ระเบียบ” แล้วข้อสุดท้ายไม่มีรายการใดต่อไปนี้ จะถ…<br>explanation rewritten |
| 229 | police-saraban-set-03-q17 | leak:  Explanation 'ถามกลับจากข้อ 8 ของต้นฉบับ'. | explanation rewritten |
| 230 | police-saraban-set-03-q18 | leak:  Explanation 'ต้นฉบับชุดที่ 3 ข้อ 11'. | explanation rewritten |
| 231 | police-saraban-set-03-q19 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ต้นฉบับชุดที่ 3 ข้อ 12 ... คาแรกเตอร์'. | prompt: ชั้นความลับในหนังสือราชการตามต้นฉบับมีทั้งหมดกี่ชั้น → ชั้นความลับของหนังสือราชการตามระเบียบว่าด้วยการรักษาความลับข…<br>explanation rewritten |
| 232 | police-saraban-set-03-q20 | leak:  Explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 13'. | explanation rewritten |
| 233 | police-saraban-set-03-q21 | leak:  Prompt 'ตามตัวเลือกของต้นฉบับชุดที่ 3'; explanation 'ตามเฉลยต้นฉบับ ... DNA'. | prompt: ตามตัวเลือกของต้นฉบับชุดที่ 3 บุคคลกลุ่มใดสามารถอยู่ในกลุ่มผ… → บุคคลกลุ่มใดสามารถลงชื่อรับรองสำเนาถูกต้องได้ (เมื่อเป็นเจ้า…<br>explanation rewritten |
| 234 | police-saraban-set-03-q22 | leak:  Prompt 'ที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบ'; explanation 'ตามเฉลยต้นฉบับ'. | prompt: รูปแบบวันที่ของ “แถลงการณ์” ที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบค… → รูปแบบวันที่ของ “แถลงการณ์” ที่ถูกต้องคือข้อใด<br>explanation rewritten |
| 235 | police-saraban-set-03-q23 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3 ... ที่ให้เป็นคำตอบ'; explanation 'ตามเฉลยของต้นฉบับ ... ข้อสอบต้นฉบับ'. | prompt: ตามต้นฉบับชุดที่ 3 รูปแบบวันที่ที่ให้เป็นคำตอบสำหรับข้อบังคั… → รูปแบบวันที่ของ “ข้อบังคับ” ที่ถูกต้องคือข้อใด<br>explanation rewritten |
| 236 | police-saraban-set-03-q25 | leak:  Prompt 'ตามตัวอย่างในต้นฉบับชุดที่ 3'; explanation 'ตามเฉลยต้นฉบับชุดที่ 3 ข้อ 18'. See separate suspect entr… | prompt: ข้อใดเป็นคำขึ้นต้นและคำลงท้ายของ “อัยการสูงสุด” ตามตัวอย่างใ… → ข้อใดเป็นคำขึ้นต้นและคำลงท้ายของหนังสือถึง “อัยการสูงสุด”<br>explanation rewritten |
| 237 | police-saraban-set-03-q26 | leak:  Explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 19'. | explanation rewritten |
| 238 | police-saraban-set-03-q27 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 20 ... คาแรกเตอร์'. | prompt: ตราครุฑในกระดาษบันทึกข้อความมีขนาดเท่าใดตามต้นฉบับ → ตราครุฑในกระดาษบันทึกข้อความมีขนาดเท่าใด<br>explanation rewritten |
| 239 | police-saraban-set-03-q28 | leak:  Prompt 'ตามมุมที่ต้นฉบับใช้ถาม'; explanation 'สาระของต้นฉบับข้อ 11'. | prompt: คำว่า “ด่วนภายใน” ต่างจากการระบุเพียง “ด่วน” อย่างไรตามมุมที… → คำว่า “ด่วนภายใน” ต่างจากการระบุเพียง “ด่วน” อย่างไร<br>explanation rewritten |
| 240 | police-saraban-set-03-q29 | leak:  Prompt 'ถ้ามีตัวเลือก 2 ชั้น, 3 ชั้น และ 4 ชั้น ... ตามต้นฉบับ' is authoring-style; explanation 'ต้นฉบับข้อ 1… | prompt: ถ้ามีตัวเลือก 2 ชั้น, 3 ชั้น และ 4 ชั้น จำนวนชั้นความลับที่ต… → ชั้นความลับของหนังสือราชการมีจำนวนกี่ชั้น<br>explanation rewritten |
| 241 | police-saraban-set-03-q31 | leak:  Prompt 'ที่ปรากฏอยู่ในตัวเลือกผู้รับรองสำเนาของต้นฉบับชุดที่ 3'; explanation 'ต้นฉบับข้อ 14'. | prompt: ข้อใดเป็นกลุ่มบุคคลที่ปรากฏอยู่ในตัวเลือกผู้รับรองสำเนาของต้… → ข้อใดเป็นกลุ่มบุคคลที่ลงชื่อรับรองสำเนาถูกต้องได้ (เมื่อเป็น…<br>explanation rewritten |
| 242 | police-saraban-set-03-q32 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ต้นฉบับข้อ 19 ... Mock Exam'. | prompt: ข้อใดเป็นขนาด A4 ที่ถูกต้องตามต้นฉบับ → ข้อใดเป็นขนาดกระดาษ A4 ที่ถูกต้อง<br>explanation rewritten |
| 243 | police-saraban-set-03-q33 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3'; explanation 'fact เดียวกับต้นฉบับข้อ 20 ... ของต้นฉบับ'. | prompt: ข้อใดกล่าวถูกต้องเกี่ยวกับตราครุฑบนกระดาษบันทึกข้อความตามต้น… → ข้อใดกล่าวถูกต้องเกี่ยวกับตราครุฑบนกระดาษบันทึกข้อความ<br>explanation rewritten |
| 244 | police-saraban-set-03-q34 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3'; explanation 'ตามเฉลยต้นฉบับชุดที่ 3 ข้อ 21'. | prompt: ในทะเบียนหนังสือรับ ชื่อหน่วยงานที่รับหนังสือที่ช่องใดตามต้น… → ในทะเบียนหนังสือรับ ให้ลงชื่อหน่วยงานที่รับหนังสือไปดำเนินกา…<br>explanation rewritten |
| 245 | police-saraban-set-03-q35 | leak:  Explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 22'. | explanation rewritten |
| 246 | police-saraban-set-03-q36 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 23'. | prompt: หนังสือที่เกี่ยวกับการเงิน เมื่อสำนักงานการตรวจเงินแผ่นดินตร… → หนังสือที่เกี่ยวกับการเงิน เมื่อสำนักงานการตรวจเงินแผ่นดินตร…<br>explanation rewritten |
| 247 | police-saraban-set-03-q37 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 24'. ('ทำลายต้นฉบับ' in choice ก is legitimate.) | prompt: ถ้าหนังสือชำรุดเสียหายจนไม่สามารถซ่อมแซมให้คงสภาพเดิมได้ ควร… → ถ้าหนังสือชำรุดเสียหายจนไม่สามารถซ่อมแซมให้คงสภาพเดิมได้ ควร…<br>explanation rewritten |
| 248 | police-saraban-set-03-q38 | leak:  Prompt 'ตามหลักที่ต้นฉบับชุดที่ 3 ใช้ถาม'; explanation 'ต้นฉบับข้อ 25'. | prompt: บุคคลภายนอกยืมหนังสือราชการได้หรือไม่ตามหลักที่ต้นฉบับชุดที่… → บุคคลภายนอกยืมหนังสือราชการได้หรือไม่ตามระเบียบงานสารบรรณ<br>explanation rewritten |
| 249 | police-saraban-set-03-q39 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 26'. | prompt: ในบัญชีขอทำลายหนังสือ ถ้าคณะกรรมการเห็นว่าควรทำลาย ให้ทำเครื… → ในบัญชีหนังสือขอทำลาย ถ้าคณะกรรมการเห็นว่าควรทำลาย ให้ทำเครื…<br>explanation rewritten |
| 250 | police-saraban-set-03-q40 | leak:  Explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 21 ... Mock Exam'. | explanation rewritten |
| 251 | police-saraban-set-03-q41 | leak:  Prompt 'ตามกรอบต้นฉบับชุดที่ 3'; explanation 'ต้นฉบับข้อ 22'. | prompt: “บัตรตรวจค้น” มีประโยชน์โดยตรงกับเรื่องใดตามกรอบต้นฉบับชุดที… → “บัตรตรวจค้น” มีประโยชน์โดยตรงกับเรื่องใด<br>explanation rewritten |
| 252 | police-saraban-set-03-q43 | leak:  Prompt 'ตามต้นฉบับ'; explanation 'ตามต้นฉบับข้อ 24'. | prompt: เมื่อเอกสารชำรุดเสียหายจนซ่อมให้กลับสภาพเดิมไม่ได้ สิ่งใดต้อ… → เมื่อเอกสารชำรุดเสียหายจนซ่อมให้กลับสภาพเดิมไม่ได้ สิ่งใดต้อ…<br>explanation rewritten |
| 253 | police-saraban-set-03-q44 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3'; explanation leak; choice ง and tip say 'ข้อ 2 และ 3 ถูก' using numbers while cho… | prompt: หากส่วนราชการพัฒนาระบบสารบรรณอิเล็กทรอนิกส์แล้วพบปัญหาหรืออุ… → หากส่วนราชการพัฒนาระบบสารบรรณอิเล็กทรอนิกส์แล้วพบปัญหาหรืออุ…<br>ง: ข้อ 2 และ 3 ถูก → ข้อ ข และ ค ถูก<br>explanation rewritten<br>tip rewritten |
| 254 | police-saraban-set-03-q45 | leak:  Prompt 'ที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบที่ถูกต้อง'; explanation 'ตามต้นฉบับชุดที่ 3 ข้อ 28'. | prompt: ข้อใดเป็นรูปแบบอีเมลราชการที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบที่… → ข้อใดเป็นรูปแบบอีเมลราชการที่ถูกต้อง<br>explanation rewritten |
| 255 | police-saraban-set-03-q48 | leak:  Prompt 'ตัวอย่างของต้นฉบับ'; explanation 'ในต้นฉบับข้อ 28'. | prompt: ข้อใดอธิบายลักษณะอีเมลกลางสำหรับงานสารบรรณได้สอดคล้องกับตัวอ… → ข้อใดอธิบายลักษณะอีเมลกลางสำหรับงานสารบรรณได้ถูกต้องที่สุด<br>explanation rewritten |
| 256 | police-saraban-set-03-q49 | leak:  Prompt 'จาก DNA ของต้นฉบับชุดที่ 3'; explanation 'ตัวอย่างต้นฉบับ ... ข้อ 29–30'. | prompt: จาก DNA ของต้นฉบับชุดที่ 3 ข้อใดเป็นลักษณะที่ควรพบในชื่อไฟล์… → ข้อใดเป็นลักษณะที่ควรพบในชื่อไฟล์หนังสือราชการอิเล็กทรอนิกส์…<br>explanation rewritten |
| 257 | police-saraban-set-03-q50 | leak:  Prompt 'ที่ต้นฉบับชุดที่ 3 ยกให้'; explanation 'ตามสาระของต้นฉบับชุดที่ 3 ข้อ 27 ... ของต้นฉบับ'. | prompt: หน่วยงานใดต่อไปนี้อยู่ในคู่หน่วยงานที่ต้นฉบับชุดที่ 3 ยกให้ข… → หน่วยงานใดต่อไปนี้ที่ส่วนราชการอาจขอความช่วยเหลือด้านการพัฒน…<br>explanation rewritten |
| 258 | police-thai-set-01-q17 | leak:  Tip says 'ถ้าต้นฉบับใช้คำว่า “อาจ/มัก”' — 'ต้นฉบับ' here means the passage; should be 'ข้อความ'.; negative stem quoted | tip rewritten<br>prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 259 | police-thai-set-01-q35 | leak:  Stem and explanation say 'ตามรูปแบบเดียวกับต้นฉบับ' / 'ตามรูปแบบการอ่านในต้นฉบับ' — authoring leak, and the c… | prompt: เลขทะเบียนรถ “กท 416 เชียงใหม่” ควรอ่านอย่างไรตามรูปแบบเดียว… → หากอ่านเลขทะเบียนรถโดยขึ้นต้นด้วยคำว่า “เลขทะเบียน” อ่านชื่อ…<br>explanation rewritten |
| 260 | police-thai-set-01-q50 | leak:  Same as q35: 'ตามรูปแบบเดียวกับต้นฉบับ' in stem and 'ตามรูปแบบต้นฉบับ' in explanation; the reading pattern is… | prompt: เลขทะเบียนรถ “บล 709 ขอนแก่น” ควรอ่านอย่างไรตามรูปแบบเดียวกั… → หากอ่านเลขทะเบียนรถโดยขึ้นต้นด้วยคำว่า “เลขทะเบียน” อ่านชื่อ…<br>explanation rewritten |
| 261 | police-thai-set-03-q12 | leak:  TIP uses 'ต้นฉบับ' to mean the reading passage (authoring wording).; negative stem quoted | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องตามข้อความ → ข้อใดกล่าว“ไม่ถูกต้อง”ตามข้อความ |
| 262 | police-mini_mock-set-03-q07 | copy of fixed source | tip rewritten |
| 263 | police-mini_mock-set-04-q03 | copy of fixed source | explanation rewritten |
| 264 | police-mini_mock-set-04-q07 | copy of fixed source | prompt: ข้อใดใช้คำราชาศัพท์ไม่ถูกต้อง → ข้อใดใช้คำราชาศัพท์“ไม่ถูกต้อง” |
| 265 | police-mini_mock-set-04-q08 | copy of fixed source | prompt: ข้อใดอ่านออกเสียงผิดทั้งหมด → ข้อใดอ่านออกเสียง“ผิด”ทั้งหมด<br>ง: อุณหภูมิ = อุน-หะ-พูม / จักรยาน = จัก-กะ… → อุณหภูมิ = อุน-หะ-พูม / จักรยาน = จัก-กฺ…<br>explanation rewritten |
| 266 | police-mini_mock-set-04-q10 | copy of fixed source | prompt: เลขทะเบียนรถ “กท 416 เชียงใหม่” ควรอ่านอย่างไรตามรูปแบบเดียว… → หากอ่านเลขทะเบียนรถโดยขึ้นต้นด้วยคำว่า “เลขทะเบียน” อ่านชื่อ…<br>explanation rewritten |
| 267 | police-mini_mock-set-06-q01 | copy of fixed source | explanation rewritten |
| 268 | police-mini_mock-set-06-q03 | copy of fixed source | explanation rewritten |
| 269 | police-mini_mock-set-06-q04 | copy of fixed source | prompt: ข้อใดเป็นส่วนที่ต้นฉบับระบุว่าอยู่ลำดับที่สองของข้อความใน “ร… → ข้อใดเป็นส่วนที่อยู่ลำดับที่สองของข้อความใน “ระเบียบ”<br>explanation rewritten |
| 270 | police-mini_mock-set-06-q07 | copy of fixed source | explanation rewritten |
| 271 | police-mini_mock-set-06-q08 | copy of fixed source | explanation rewritten |
| 272 | police-mini_mock-set-06-q10 | copy of fixed source | prompt: การเก็บหนังสืออิเล็กทรอนิกส์ในระบบสารบรรณอิเล็กทรอนิกส์ ต้อง… → การเก็บหนังสืออิเล็กทรอนิกส์ในระบบสารบรรณอิเล็กทรอนิกส์ ต้อง…<br>explanation rewritten |
| 273 | police-mini_mock-set-07-q04 | copy of fixed source | explanation rewritten |
| 274 | police-mini_mock-set-07-q07 | copy of fixed source | prompt: ข้อใดไม่ถูกต้องเกี่ยวกับของหมั้น → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับของหมั้น<br>tip rewritten |
| 275 | police-mini_mock-set-08-q01 | letter refs remapped | explanation rewritten |
| 276 | police-mini_mock-set-08-q03 | copy of fixed source; letter refs remapped | prompt: The safety briefing is mandatory for all new employees. → The safety briefing is “mandatory” for all new employees.<br>explanation rewritten<br>tip rewritten |
| 277 | police-mini_mock-set-08-q04 | copy of fixed source; letter refs remapped | prompt: The new work schedule is adaptable and can be changed when n… → The new work schedule is “adaptable” and can be changed when…<br>explanation rewritten |
| 278 | police-mini_mock-set-08-q05 | letter refs remapped | explanation rewritten |
| 279 | police-mini_mock-set-08-q06 | copy of fixed source; letter refs remapped | explanation rewritten |
| 280 | police-mini_mock-set-08-q07 | letter refs remapped | explanation rewritten |
| 281 | police-mini_mock-set-08-q08 | letter refs remapped | explanation rewritten |
| 282 | police-mini_mock-set-08-q09 | letter refs remapped | explanation rewritten |
| 283 | police-mini_mock-set-08-q10 | letter refs remapped | explanation rewritten |
| 284 | police-mini_mock-set-14-q18 | letter refs remapped | explanation rewritten |
| 285 | police-mini_mock-set-14-q19 | letter refs remapped | explanation rewritten |
| 286 | police-mini_mock-set-14-q20 | copy of fixed source; letter refs remapped | explanation rewritten<br>tip rewritten |
| 287 | police-law-extra-q08 | negative stem quoted | prompt: ข้อใดไม่เป็น “อันตรายสาหัส” ตามประมวลกฎหมายอาญา มาตรา 297 → ข้อใด“ไม่เป็น” “อันตรายสาหัส” ตามประมวลกฎหมายอาญา มาตรา 297 |
| 288 | police-law-set-01-q03 | negative stem quoted | prompt: ข้อใดไม่ใช่ลักษณะสำคัญของกฎหมายวิธีสบัญญัติ → ข้อใด“ไม่ใช่”ลักษณะสำคัญของกฎหมายวิธีสบัญญัติ |
| 289 | police-law-set-01-q05 | negative stem quoted | prompt: ข้อใดไม่ใช่คำสั่งทางปกครองในลักษณะเฉพาะราย → ข้อใด“ไม่ใช่”คำสั่งทางปกครองในลักษณะเฉพาะราย |
| 290 | police-law-set-01-q10 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับจำนวนสมาชิกวุฒิสภาตามมาตรา 107 → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับจำนวนสมาชิกวุฒิสภาตามมาตรา 10… |
| 291 | police-law-set-01-q13 | negative stem quoted | prompt: ข้อใดไม่ใช่ศาลในลำดับชั้นของศาลยุติธรรม → ข้อใด“ไม่ใช่”ศาลในลำดับชั้นของศาลยุติธรรม |
| 292 | police-law-set-01-q18 | negative stem quoted | prompt: ข้อใดไม่ถูกต้องเกี่ยวกับสภาพบุคคล → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับสภาพบุคคล |
| 293 | police-law-set-01-q32 | negative stem quoted | prompt: ข้อใดไม่ใช่ทายาทโดยธรรมของผู้ตายเพราะอาศัยฐานะ “ผู้รับบุตรบุ… → ข้อใด“ไม่ใช่”ทายาทโดยธรรมของผู้ตายเพราะอาศัยฐานะ “ผู้รับบุตร… |
| 294 | police-law-set-01-q35 | negative stem quoted | prompt: ข้อใดไม่ใช่ความผิดอันยอมความได้โดยทั่วไป → ข้อใด“ไม่ใช่”ความผิดอันยอมความได้โดยทั่วไป |
| 295 | police-law-set-01-q37 | negative stem quoted | prompt: ข้อใดไม่ใช่โทษทางอาญาตามมาตรา 18 แห่งประมวลกฎหมายอาญา → ข้อใด“ไม่ใช่”โทษทางอาญาตามมาตรา 18 แห่งประมวลกฎหมายอาญา |
| 296 | police-law-set-01-q45 | negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับผู้สนับสนุนตามมาตรา 86 → ข้อใดกล่าว“ผิด”เกี่ยวกับผู้สนับสนุนตามมาตรา 86 |
| 297 | police-law-set-01-q47 | negative stem quoted | prompt: ข้อใดไม่ใช่หนึ่งในสิทธิผู้บริโภค 5 ประการที่ สคบ. สรุปไว้ → ข้อใด“ไม่ใช่”หนึ่งในสิทธิผู้บริโภค 5 ประการที่ สคบ. สรุปไว้ |
| 298 | police-law-set-02-q03 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับระบบ Common Law → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับระบบ Common Law |
| 299 | police-law-set-02-q11 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับโครงสร้างศาลปกครอง → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับโครงสร้างศาลปกครอง |
| 300 | police-law-set-02-q14 | negative stem quoted | prompt: ข้อใดไม่ใช่องค์กรอิสระตามรัฐธรรมนูญ พ.ศ. 2560 → ข้อใด“ไม่ใช่”องค์กรอิสระตามรัฐธรรมนูญ พ.ศ. 2560 |
| 301 | police-law-set-02-q18 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการทำนิติกรรมของผู้เยาว์ → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการทำนิติกรรมของผู้เยาว์ |
| 302 | police-law-set-02-q19 | negative stem quoted | prompt: ข้อใดไม่ใช่นิติบุคคลตามกฎหมายเอกชน → ข้อใด“ไม่ใช่”นิติบุคคลตามกฎหมายเอกชน |
| 303 | police-law-set-02-q22 | negative stem quoted | prompt: ข้อใดไม่เป็นส่วนควบของกันและกัน → ข้อใด“ไม่เป็น”ส่วนควบของกันและกัน |
| 304 | police-law-set-02-q26 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับสัญญาค้ำประกัน → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับสัญญาค้ำประกัน |
| 305 | police-law-set-02-q29 | negative stem quoted | prompt: ข้อใดไม่สามารถใช้เป็นทรัพย์จำนำได้โดยตรง → ข้อใด“ไม่สามารถ”ใช้เป็นทรัพย์จำนำได้โดยตรง |
| 306 | police-law-set-02-q45 | negative stem quoted | prompt: ข้อใดไม่เป็นเหตุฉกรรจ์เพียงเพราะข้อเท็จจริงที่ระบุ → ข้อใด“ไม่เป็น”เหตุฉกรรจ์เพียงเพราะข้อเท็จจริงที่ระบุ |
| 307 | police-law-set-03-q03 | negative stem quoted | prompt: ข้อใดไม่ใช่เรื่องของกฎหมายเอกชนโดยตรง → ข้อใด“ไม่ใช่”เรื่องของกฎหมายเอกชนโดยตรง |
| 308 | police-law-set-03-q16 | negative stem quoted | prompt: ข้อใดไม่ใช่ผู้มีอำนาจออกคำสั่งให้บุคคลเป็นคนสาบสูญ → ข้อใด“ไม่ใช่”ผู้มีอำนาจออกคำสั่งให้บุคคลเป็นคนสาบสูญ |
| 309 | police-law-set-03-q21 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับนิติกรรมของคนไร้ความสามารถ → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับนิติกรรมของคนไร้ความสามารถ |
| 310 | police-law-set-03-q22 | negative stem quoted | prompt: ข้อใดเป็นนิติเหตุ ไม่ใช่นิติกรรม → ข้อใดเป็นนิติเหตุ “ไม่ใช่”นิติกรรม |
| 311 | police-law-set-03-q24 | negative stem quoted | prompt: ข้อใดไม่ใช่นิติกรรม → ข้อใด“ไม่ใช่”นิติกรรม |
| 312 | police-law-set-03-q33 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการหมั้นของผู้เยาว์อายุ 18 ปี → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการหมั้นของผู้เยาว์อายุ 18 ปี |
| 313 | police-law-set-03-q39 | negative stem quoted | prompt: ข้อใดไม่ใช่เหตุยกเว้นโทษ แต่เป็นเพียงเหตุที่อาจทำให้ศาลลดโทษ → ข้อใด“ไม่ใช่”เหตุยกเว้นโทษ แต่เป็นเพียงเหตุที่อาจทำให้ศาลลดโ… |
| 314 | police-law-set-03-q45 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการเผาทรัพย์ที่ผู้กระทำเป็นเจ้า… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการเผาทรัพย์ที่ผู้กระทำเป็นเจ… |
| 315 | police-law-set-03-q48 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับอายุการคุ้มครองเครื่องหมายการค้… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับอายุการคุ้มครองเครื่องหมายการ… |
| 316 | police-law-set-03-q50 | negative stem quoted | prompt: ข้อใดไม่ใช่บุคคลที่ได้รับการยกเว้นไม่ต้องมีบัตรประจำตัวประชา… → ข้อใด“ไม่ใช่”บุคคลที่ได้รับการยกเว้นไม่ต้องมีบัตรประจำตัวประ… |
| 317 | police-mini_mock-set-10-q01 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 318 | police-mini_mock-set-10-q03 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 319 | police-mini_mock-set-10-q05 | negative stem quoted | prompt: พิจารณาประโยคต่อไปนี้ ข้อใดมีการใช้คำราชาศัพท์ไม่ถูกต้องตามห… → พิจารณาประโยคต่อไปนี้ ข้อใดมีการใช้คำราชาศัพท์“ไม่ถูกต้อง”ตา… |
| 320 | police-mini_mock-set-10-q07 | negative stem quoted | prompt: ข้อใดใช้คำผิดความหมาย → ข้อใดใช้คำ“ผิด”ความหมาย |
| 321 | police-mini_mock-set-13-q03 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับโครงสร้างศาลปกครอง → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับโครงสร้างศาลปกครอง |
| 322 | police-mini_mock-set-13-q07 | negative stem quoted | prompt: ข้อใดไม่ถูกต้องเกี่ยวกับพินัยกรรมของผู้เยาว์ → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับพินัยกรรมของผู้เยาว์ |
| 323 | police-mock_test-set-04-q021 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 324 | police-mock_test-set-04-q026 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 325 | police-mock_test-set-04-q107 | negative stem quoted | prompt: ข้อใดไม่ใช่อีเมลราชการตามมาตรฐานระบบไปรษณีย์อิเล็กทรอนิกส์ภา… → ข้อใด“ไม่ใช่”อีเมลราชการตามมาตรฐานระบบไปรษณีย์อิเล็กทรอนิกส์… |
| 326 | police-mock_test-set-04-q120 | negative stem quoted | prompt: ข้อใดไม่ใช่นิติบุคคลตามกฎหมายเอกชน → ข้อใด“ไม่ใช่”นิติบุคคลตามกฎหมายเอกชน |
| 327 | police-saraban-p54-01-q03 | negative stem quoted | prompt: ข้อใดไม่ถูกต้องเกี่ยวกับการลงชื่อและการเขียนชื่อในหนังสือราช… → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับการลงชื่อและการเขียนชื่อในหนังสือร… |
| 328 | police-saraban-p54-02-q07 | negative stem quoted | prompt: ข้อใดเป็นคำย่อที่ไม่ถูกต้อง → ข้อใดเป็นคำย่อที่“ไม่ถูกต้อง” |
| 329 | police-saraban-p54-02-q15 | negative stem quoted | prompt: ข้อใดไม่ถูกต้องเกี่ยวกับการรับและส่งหนังสือของ ตร. → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับการรับและส่งหนังสือของ ตร. |
| 330 | police-saraban-quick-01-q09 | negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับการลง “ฉบับที่” ของระเบียบตามระเบียบงา… → ข้อใดกล่าว“ผิด”เกี่ยวกับการลง “ฉบับที่” ของระเบียบตามระเบียบ… |
| 331 | police-saraban-quick-01-q10 | negative stem quoted | prompt: ข้อใดไม่ใช่รูปแบบการลงวันที่ของหนังสือภายใน → ข้อใด“ไม่ใช่”รูปแบบการลงวันที่ของหนังสือภายใน |
| 332 | police-saraban-quick-01-q14 | negative stem quoted | prompt: ข้อใดไม่ใช่ที่อยู่ไปรษณีย์อิเล็กทรอนิกส์ของหน่วยงานราชการ → ข้อใด“ไม่ใช่”ที่อยู่ไปรษณีย์อิเล็กทรอนิกส์ของหน่วยงานราชการ |
| 333 | police-saraban-quick-01-q20 | negative stem quoted | prompt: ข้อใดไม่ใช่กรณีที่ใช้หนังสือประทับตราได้ตามระเบียบงานสารบรรณ → ข้อใด“ไม่ใช่”กรณีที่ใช้หนังสือประทับตราได้ตามระเบียบงานสารบร… |
| 334 | police-saraban-quick-02-q01 | negative stem quoted | prompt: ข้อใดไม่ใช่รายการในตรารับหนังสือตามระเบียบงานสารบรรณ → ข้อใด“ไม่ใช่”รายการในตรารับหนังสือตามระเบียบงานสารบรรณ |
| 335 | police-saraban-quick-02-q08 | negative stem quoted | prompt: ข้อใดไม่ใช่รูปแบบการลงวันที่ของหนังสือภายนอกตามระเบียบงานสาร… → ข้อใด“ไม่ใช่”รูปแบบการลงวันที่ของหนังสือภายนอกตามระเบียบงานส… |
| 336 | police-saraban-quick-03-q04 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับหนังสือประทับตราตามระเบียบงานสา… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับหนังสือประทับตราตามระเบียบงาน… |
| 337 | police-saraban-quick-03-q05 | negative stem quoted | prompt: ข้อใดต่อไปนี้ไม่ใช่ที่อยู่ไปรษณีย์อิเล็กทรอนิกส์ (อีเมล) ของ… → ข้อใดต่อไปนี้“ไม่ใช่”ที่อยู่ไปรษณีย์อิเล็กทรอนิกส์ (อีเมล) ข… |
| 338 | police-saraban-quick-03-q14 | negative stem quoted | prompt: ข้อใดไม่ใช่ชนิดของหนังสือราชการตามระเบียบงานสารบรรณ → ข้อใด“ไม่ใช่”ชนิดของหนังสือราชการตามระเบียบงานสารบรรณ |
| 339 | police-saraban-quick-03-q20 | negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับการเก็บรักษาหนังสือราชการตามระเบียบงาน… → ข้อใดกล่าว“ผิด”เกี่ยวกับการเก็บรักษาหนังสือราชการตามระเบียบง… |
| 340 | police-saraban-quick-04-q02 | negative stem quoted | prompt: ข้อใดไม่ใช่ชั้นความลับของข้อมูลข่าวสารลับของทางราชการ → ข้อใด“ไม่ใช่”ชั้นความลับของข้อมูลข่าวสารลับของทางราชการ |
| 341 | police-saraban-quick-04-q11 | negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับชั้นความเร็ว “ด่วนที่สุด” ตามระเบียบงา… → ข้อใดกล่าว“ผิด”เกี่ยวกับชั้นความเร็ว “ด่วนที่สุด” ตามระเบียบ… |
| 342 | police-saraban-quick-05-q03 | negative stem quoted | prompt: ข้อใดไม่ใช่หนังสือสั่งการตามระเบียบงานสารบรรณ → ข้อใด“ไม่ใช่”หนังสือสั่งการตามระเบียบงานสารบรรณ |
| 343 | police-saraban-quick-05-q05 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับหนังสือภายในตามระเบียบงานสารบรร… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับหนังสือภายในตามระเบียบงานสารบ… |
| 344 | police-saraban-quick-05-q20 | negative stem quoted | prompt: ข้อใดไม่ใช่สีที่ใช้แสดงชั้นความลับบนหนังสือราชการ → ข้อใด“ไม่ใช่”สีที่ใช้แสดงชั้นความลับบนหนังสือราชการ |
| 345 | police-saraban-quick-06-q05 | negative stem quoted | prompt: ตามแบบรายงานการประชุมในระเบียบงานสารบรรณ ข้อใดไม่ใช่หัวข้อที… → ตามแบบรายงานการประชุมในระเบียบงานสารบรรณ ข้อใด“ไม่ใช่”หัวข้อ… |
| 346 | police-saraban-quick-06-q17 | negative stem quoted | prompt: ข้อใดไม่ใช่ลักษณะของ “ประกาศ” ตามระเบียบงานสารบรรณ → ข้อใด“ไม่ใช่”ลักษณะของ “ประกาศ” ตามระเบียบงานสารบรรณ |
| 347 | police-saraban-quick-06-q19 | negative stem quoted | prompt: ข้อใดไม่ถูกต้องตามรูปแบบการตั้งชื่อไฟล์หนังสือราชการอิเล็กทร… → ข้อใด“ไม่ถูกต้อง”ตามรูปแบบการตั้งชื่อไฟล์หนังสือราชการอิเล็ก… |
| 348 | police-saraban-quick-07-q07 | negative stem quoted | prompt: ข้อใดกล่าวเกี่ยวกับหนังสือเวียนไม่ถูกต้องตามระเบียบงานสารบรร… → ข้อใดกล่าวเกี่ยวกับหนังสือเวียน“ไม่ถูกต้อง”ตามระเบียบงานสารบ… |
| 349 | police-saraban-quick-07-q11 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการระบุ “ฉบับที่” ในหนังสือราชก… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการระบุ “ฉบับที่” ในหนังสือรา… |
| 350 | police-saraban-set-01-q13 | negative stem quoted | prompt: ข้อใดไม่ใช่หนังสือสั่งการ → ข้อใด“ไม่ใช่”หนังสือสั่งการ |
| 351 | police-saraban-set-01-q29 | negative stem quoted | prompt: ข้อใดกล่าวผิดเกี่ยวกับการลง ‘ฉบับที่’ ของระเบียบ → ข้อใดกล่าว“ผิด”เกี่ยวกับการลง ‘ฉบับที่’ ของระเบียบ |
| 352 | police-thai-set-01-q18 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 353 | police-thai-set-01-q24 | negative stem quoted | prompt: ข้อใดใช้คำราชาศัพท์ไม่ถูกต้อง → ข้อใดใช้คำราชาศัพท์“ไม่ถูกต้อง” |
| 354 | police-thai-set-01-q27 | negative stem quoted | prompt: ข้อใดใช้ ใอ (ไม้ม้วน) ผิด → ข้อใดใช้ ใอ (ไม้ม้วน) “ผิด” |
| 355 | police-thai-set-01-q30 | negative stem quoted | prompt: ข้อใดใช้คำไม่ตรงความหมายหรือขัดกับบริบท → ข้อใดใช้คำ“ไม่ตรง”ความหมายหรือขัดกับบริบท |
| 356 | police-thai-set-01-q38 | negative stem quoted | prompt: ข้อใดอ่านออกเสียงไม่ถูกต้อง → ข้อใดอ่านออกเสียง“ไม่ถูกต้อง” |
| 357 | police-thai-set-01-q39 | negative stem quoted | prompt: ข้อใดใช้คำราชาศัพท์ไม่ถูกต้อง → ข้อใดใช้คำราชาศัพท์“ไม่ถูกต้อง” |
| 358 | police-thai-set-01-q41 | negative stem quoted | prompt: ข้อใดอ่านออกเสียงผิดทั้งหมด → ข้อใดอ่านออกเสียง“ผิด”ทั้งหมด |
| 359 | police-thai-set-01-q42 | negative stem quoted | prompt: ข้อใดใช้ ใอ (ไม้ม้วน) ผิด → ข้อใดใช้ ใอ (ไม้ม้วน) “ผิด” |
| 360 | police-thai-set-01-q45 | negative stem quoted | prompt: ข้อใดใช้คำไม่ตรงความหมายหรือขัดกับบริบท → ข้อใดใช้คำ“ไม่ตรง”ความหมายหรือขัดกับบริบท |
| 361 | police-thai-set-02-q01 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 362 | police-thai-set-02-q03 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 363 | police-thai-set-02-q10 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้ว่าเป็นบุคลิกภาพที่โรงเรียนตั้งใจพัฒนา → ข้อใด“ไม่อาจ”อนุมานได้ว่าเป็นบุคลิกภาพที่โรงเรียนตั้งใจพัฒนา |
| 364 | police-thai-set-02-q11 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 365 | police-thai-set-02-q13 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 366 | police-thai-set-02-q20 | negative stem quoted | prompt: ข้อใดไม่อาจอนุมานได้ว่าเป็นคุณลักษณะที่ค่ายต้องการพัฒนา → ข้อใด“ไม่อาจ”อนุมานได้ว่าเป็นคุณลักษณะที่ค่ายต้องการพัฒนา |
| 367 | police-thai-set-02-q23 | negative stem quoted | prompt: ข้อใดใช้คำราชาศัพท์ไม่ถูกต้อง → ข้อใดใช้คำราชาศัพท์“ไม่ถูกต้อง” |
| 368 | police-thai-set-02-q26 | negative stem quoted | prompt: ข้อใดใช้ภาษาไม่เป็นทางการในการเขียน → ข้อใดใช้ภาษา“ไม่เป็น”ทางการในการเขียน |
| 369 | police-thai-set-02-q27 | negative stem quoted | prompt: ข้อใดจับคู่คำสามัญกับคำสุภาพผิด → ข้อใดจับคู่คำสามัญกับคำสุภาพ“ผิด” |
| 370 | police-thai-set-02-q32 | negative stem quoted | prompt: ข้อใดมีคำที่สะกดผิด → ข้อใดมีคำที่สะกด“ผิด” |
| 371 | police-thai-set-02-q33 | negative stem quoted | prompt: ข้อใดใช้คำผิดความหมาย → ข้อใดใช้คำ“ผิด”ความหมาย |
| 372 | police-thai-set-02-q38 | negative stem quoted | prompt: ข้อใดใช้คำราชาศัพท์ไม่ถูกต้อง → ข้อใดใช้คำราชาศัพท์“ไม่ถูกต้อง” |
| 373 | police-thai-set-02-q41 | negative stem quoted | prompt: ข้อใดใช้ภาษาไม่เป็นทางการในการเขียน → ข้อใดใช้ภาษา“ไม่เป็น”ทางการในการเขียน |
| 374 | police-thai-set-02-q42 | negative stem quoted | prompt: ข้อใดจับคู่คำสามัญกับคำสุภาพผิด → ข้อใดจับคู่คำสามัญกับคำสุภาพ“ผิด” |
| 375 | police-thai-set-02-q47 | negative stem quoted | prompt: ข้อใดมีคำที่สะกดผิด → ข้อใดมีคำที่สะกด“ผิด” |
| 376 | police-thai-set-02-q48 | negative stem quoted | prompt: ข้อใดใช้คำผิดความหมาย → ข้อใดใช้คำ“ผิด”ความหมาย |
| 377 | police-thai-set-03-q02 | negative stem quoted | prompt: ข้อใดกล่าวไม่ถูกต้องตามข้อความ → ข้อใดกล่าว“ไม่ถูกต้อง”ตามข้อความ |
| 378 | police-thai-set-03-q04 | negative stem quoted | prompt: ข้อใดไม่สามารถอนุมานได้จากข้อความ → ข้อใด“ไม่สามารถ”อนุมานได้จากข้อความ |
| 379 | police-thai-set-03-q14 | negative stem quoted | prompt: ข้อใดไม่สามารถอนุมานได้จากข้อความ → ข้อใด“ไม่สามารถ”อนุมานได้จากข้อความ |
| 380 | police-thai-set-03-q21 | negative stem quoted | prompt: ข้อใดใช้คำไม่ถูกต้องตามความหมาย → ข้อใดใช้คำ“ไม่ถูกต้อง”ตามความหมาย |
| 381 | police-thai-set-03-q24 | negative stem quoted | prompt: ข้อใดสะกดผิดทุกคำ → ข้อใดสะกด“ผิด”ทุกคำ |
| 382 | police-thai-set-03-q25 | negative stem quoted | prompt: ข้อใดใช้สำนวนไม่ถูกต้อง → ข้อใดใช้สำนวน“ไม่ถูกต้อง” |
| 383 | police-thai-set-03-q32 | negative stem quoted | prompt: ข้อใดไม่มีคำยืมจากภาษาต่างประเทศ → ข้อใด“ไม่มี”คำยืมจากภาษาต่างประเทศ |
| 384 | police-thai-set-03-q33 | negative stem quoted | prompt: ข้อใดมีคำที่ไม่ใช่คำประสมปนอยู่ → ข้อใดมีคำที่“ไม่ใช่”คำประสมปนอยู่ |
| 385 | police-thai-set-03-q36 | negative stem quoted | prompt: ข้อใดใช้คำไม่ถูกต้องตามความหมาย → ข้อใดใช้คำ“ไม่ถูกต้อง”ตามความหมาย |
| 386 | police-thai-set-03-q39 | negative stem quoted | prompt: ข้อใดสะกดผิดทุกคำ → ข้อใดสะกด“ผิด”ทุกคำ |
| 387 | police-thai-set-03-q40 | negative stem quoted | prompt: ข้อใดใช้สำนวนไม่ถูกต้อง → ข้อใดใช้สำนวน“ไม่ถูกต้อง” |
| 388 | police-thai-set-03-q47 | negative stem quoted | prompt: ข้อใดไม่มีคำยืมจากภาษาต่างประเทศ → ข้อใด“ไม่มี”คำยืมจากภาษาต่างประเทศ |
| 389 | police-thai-set-03-q48 | negative stem quoted | prompt: ข้อใดมีคำที่ไม่ใช่คำประสมปนอยู่ → ข้อใดมีคำที่“ไม่ใช่”คำประสมปนอยู่ |

## Second review (main session, 13 Nov)

- 104 quote-only changes checked by script (text identical apart from “ ”).
- The other 285 content fixes were re-read by 10 independent reviewers, who solved each question before reading the fix. Result: no fix introduces an error, and no key needs to change.
- One reviewer again flagged `police-saraban-set-03-q25` / `quick-02-q16` (อัยการสูงสุด → กราบเรียน). Rejected: the 15-position list includes อัยการสูงสุด (Thaiger, 14 Oct 2026; siensob table).
- Touch-ups added to the patch and files: english-03 q14 (one-day sale, not "สัปดาห์"), thai-02 q39 (why จัดเจน is wrong), law-02 q08 tip (พ.ร.ก. conditions, not only emergency), saraban-01 q40 (พอยท์ spelling), saraban-02 q34 (cite แบบที่ 27), saraban-03 q46 tip (รหัสตัวอักษรโรมัน), math ratios q08 (เสื้อ) and geometry q19 (หลอม).
- Wrong "จุดจำ" tips the first pass missed, now fixed: mini-13 q09 and its twin law-02 q43 (ม.285/1 = 13 ปี), mini-13 q11 and its twin law-03 q04 (รวมอำนาจ สั่งการอาจล่าช้า). The same tips remain in `police-mock_test-set-04-q132` and `police-mock_test-set-05-q112` (out of scope).

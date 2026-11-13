# Quality audit: Thai sets 1–3 cues and Mock Tests 2–6 (13 พ.ย. 2569)

**Scope:**
- **Thai sets:** `police-thai-set-01..03` (3 × 50). I fixed the "longest choice is correct" cue and rebalanced the answer positions.
- **Mock tests:** `police-mock_test-set-02..06` (5 × 150 = 750 questions), with a full audit using the same rubric as Mock 1 and the subject sets.

Twins of earlier fixes are also covered wherever they live, including Mock 1 and a few mini drills.

Supabase was treated as the source of truth. Nothing was imported, committed or deployed. Only content files and the patch were changed.

## Summary

| | |
|---|---|
| **Wrong answer key** | **0** in Mock 2–6 and Thai 1–3. Mock 5 q097 was close: its key text "ข้อ 2 และ 3 ถูก", read with ก–ง labels, points at a false choice (ข = สำนักนายกฯ เท่านั้น). The text is fixed to "ข้อ ค และ ข้อ ง ถูก" (DGA, ETDA, per ฉบับที่ 4 ข้อ 11). The key position is unchanged. |
| Flags rejected | `police-mock_test-set-06-q105`: a reviewer said "เก็บไว้ถึง 10 ปี หรือ 5 ปี" is wrong. It is correct: the 2548 amendment (ข้อ 57, last paragraph) reads "ไม่มีความจำเป็นต้องเก็บไว้ถึง ๑๐ ปี หรือ ๕ ปี แล้วแต่กรณี ให้ทำความตกลงกับกระทรวงการคลัง". อัยการสูงสุด → กราบเรียน was not flagged this round and was not touched. |
| Questions changed | **197** (patch `police-thai-mock-audit-fixes-2026-11-13.json`) |
| Mock 2–6 | 121 questions. Mock 3 has 51, mostly its saraban block (q081–q110), which was the same text as saraban set 3 before last round's fixes. |
| Thai 1–3 | 58 questions: 41 distractor or key-length edits and 26 key moves (some questions have both) |
| Twins in Mock 1 and mini drills | 18 |
| Key position changed | 26, all of them Thai reorders. No mock key moved. |
| Question ids changed | 0 |
| Dry run | `node scripts/police/apply-subject-audit-fixes.mjs content/exams/police-thai-mock-audit-fixes-2026-11-13.json` → "DB matches every before value" (197 questions; prompt 81, choices 67, explanation 90, tip 28, key 26) |

## Thai sets 1–3: before and after

| Set | Key positions ก/ข/ค/ง | Key is the single longest choice | "Clearly longest" choice is the key |
|---|---|---|---|
| thai-set-01 | 6/22/14/8 → **12/13/13/12** | 27/50 → **16/50** | 13/16 → **0/3** |
| thai-set-02 | 6/12/10/22 → **13/12/12/13** | 29/50 → **12/50** | 19/19 → **5/15 (33%)** |
| thai-set-03 | 12/8/10/20 → **13/12/12/13** | 24/50 → **13/50** | 11/14 → **0/4** |

- **"Clearly longest"** means at least 1.25 times the second-longest choice and at least 4 characters longer. Targets were ≤20/50 and ≤40%; chance is about 12/50 and 25%.
- Set 3 was nearly as skewed as sets 1 and 2 on both checks, so it was fixed the same way.

**Length edits (41 questions):**
- 13 in set 1, 17 in set 2 and 11 in set 3.
- **Method:**
  - Mostly one or two distractors were lengthened with natural detail that keeps them wrong for the same reason.
  - 8 over-long keys were trimmed of padding without changing meaning: set-01 q06, q15, q33; set-02 q01, q14, q47; set-03 q37, q42.
- **Kept consistent:**
  - The explanation was updated where it quoted a changed choice (set-01 q42).
  - Two mini-drill copies of set 1 (mini-04 q02 and q09) got the same choice text.
- **Checked by me:**
  - I read every edited choice.
  - For the "ไม่อาจอนุมาน" items (set-02 q01, q10, q11, q20), every lengthened distractor is still stated in or inferable from its passage, so exactly one answer remains.
  - Reviewers deliberately stopped before overshooting (for example 7/50), so "longest is never correct" doesn't become the new cue.

**Key moves (26 questions):**
- 10 in set 1, 9 in set 2 and 7 in set 3.
- **Method:** the key choice was swapped with the choice in an under-used position. Choice texts are unchanged, and which text is correct is unchanged.
- **Excluded:** questions whose choices refer to other choices ("ข้อ ข และ ค", "ทุกข้อ").
- **Checked by script:** every moved question keeps the same key text and the same set of four choices.
- **Letters:** the explanations of these sets quote choice text, not letters. The one remapped explanation (set-01 q42) needed no letter change.
- **Mini-drill copies** (mini-04 from set 1) have their own choice order and are unaffected.

## Mock Tests 2–6: findings

**Method:**
1. Dumped all five mocks from Supabase and compared them with the files.
2. Ran 10 parallel reviewers (one per half-mock). Each solved every question before reading the key and checked against the regulation text (2526, ฉบับที่ 2 2548, ฉบับที่ 4 2564, ระเบียบรักษาความลับ 2544), statutes and the ORST dictionary.
3. Read every finding myself.
4. Ran a **twin search**: every question still holding the old text of any fix imported in the last round was given the same imported text. This follows the lesson that fixing a copy misses its twin.
5. Carried the copy fixes back to their sources: 29 fixes made last round in mini drills 04, 05, 06, 09, 10, 12, 13 and 14 were applied to their Mock 4 and 5 source rows. 9 mini-14 fixes were not carried back, because they only re-lettered choices that the drill had reshuffled; the sources are in the original order and were right.
6. Forward copy: source fixes from this round were copied to their mini-drill copies (10 questions).

**After the patch:** every copy matches its source on prompt, choices and key (verified by script). Every file matches the simulated post-patch database.

**Main issue types (Mock 2–6):**
- **Authoring wording** ("ต้นฉบับชุดที่ 3 ข้อ N", "DNA", "คาแรกเตอร์", "Mock Exam", "Set 1", "ตามมุมที่ระเบียบงานสารบรรณใช้ถาม"):
  - Mock 3 q081–q110 almost entirely.
  - Mock 4 q085, q095, q098, q100, q104.
  - Mock 5 q091, q095, q098, q100.
  - Mock 2 q108.
- **Tip teaches the wrong option in negative stems:**
  - Mock 3 q084, q117, q121, q125, q127.
  - Mock 4 q083, q085, q094, q105 (said 150 dpi for e-mail), q112, q116, q127.
  - Mock 5 q083, q086, q089, q092, q098.
- **Old question numbers cited as regulation clauses:** Mock 5 q081–q109 (for example "ข้อ 86/4", which does not exist) and Mock 4 q117. Each now cites the real clause, e.g. 12.1, 17.6, 28, 39, 57.6, 65, 68.4/69, 71/75/76, 74.2/77, or ภาคผนวก 7.
- **Bad automated "ระเบียบงานสารบรรณ" replacements in law and saraban explanations:**
  - Mock 4 q084, q093, q103, q106, q109, q111, q117, q134.
- **Ambiguous:**
  - Mock 3 q115: list items sat inside the choices, so ข and ง were each "true".
  - Mock 3 q110: three equivalent choices and a convoluted stem; same fix as saraban-set-03 q42.
  - Mock 4 q140: "agreed to ___ construction" also fits prevent/forbid. Fixed by adding "so work can begin next month".
  - Mock 5 q082: "ส่วนล่างสุด" now asks for "ข้อสุดท้าย".
  - Mock 5 q093: the garbled stem made "ถึง" defensible.
  - English synonym items with no instruction or marked word: Mock 3 q139–q141 and Mock 4 q139.
- **Wrong procedure in the stem:** Mock 5 q107 (ข้อ 66). The officer in charge of storage sends the list to the หัวหน้าส่วนราชการระดับกรม; the stem said the head at กอง level sends it to the committee. Same fix as its copy, mini-06 q19.
- **Other fixes:**
  - Mock 2 q110: the keyed filename padded the number with zeros (0025). ภาคผนวก 7 shows `2564_OPM0913_56.pdf`, so the choice is now `2569_RTP0900_25.pdf`; the key position is unchanged.
  - Mock 3 q138: Chinese "分钟" in the explanation.
  - Mock 3 q043: the misspelling "ลายเซ็นต์".
  - Mock 3 q060: the "ส่วย" typo (a twin of computer-03 q20).
  - Mock 4 q053: .go.th called a ccTLD.
  - Mock 4 q056: "DDos".
  - Mock 4 q040: "ผู้ชำนาญการ" was a second defensible answer. This is a twin of thai-02 q39, so ก becomes "คุ้นเคย".
  - Mock 6 q022 and q027: the explanation said "ข้อแรก" while the key is ข / ค.
  - Mock 5 q020: the "วันที" typo.
- **Negative stems quoted with “…”:** 23 more, for example Mock 6 q021, q022, q032, q039, q084 and q115. Many Mock 3 and 4 prompts were already quoted through twin fixes.

**Database vs files:**
- Mock 2–6 files matched the database on prompt and choices.
- Mock 2 q16, Mock 3 q11 and q16, Mock 4 q10, q13 and q14, and Mock 5 q6, q11 and q16 had explanations or tips that were edited in the database but not in the files.
- `police-mock-test-set-05.json` q8 had a stale key (10 นาที in the file, 8 นาที in the database).
- All of these were re-synced from the database before the patch was applied.

## Per-set summary

| Set | Qs | Questions changed | What |
|---|---|---|---|
| police-mock_test-set-02 | 150 | 3 | leak 1, expl-mismatch 1, negative 1 |
| police-mock_test-set-03 | 150 | 51 | other 5, twin 39, leak 29, ambiguous 2, expl-mismatch 5, negative 9, render 1 |
| police-mock_test-set-04 | 150 | 33 | expl-mismatch 7, twin 15, other 9, backport 12, leak 5, negative 6, ambiguous 2 |
| police-mock_test-set-05 | 150 | 27 | other 3, twin 19, backport 17, expl-mismatch 17, ambiguous 2, leak 3, negative 1 |
| police-mock_test-set-06 | 150 | 7 | expl-mismatch 2, negative 6 |
| police-thai-set-01 | 50 | 19 | length-cue 13, reorder 10 |
| police-thai-set-02 | 50 | 24 | length-cue 17, reorder 9 |
| police-thai-set-03 | 50 | 15 | length-cue 11, reorder 7 |
| police-mock_test-set-01 | 150 | 8 | twin 8 |
| police-mini_mock-set-04 | 20 | 2 | copy 2 |
| police-mini_mock-set-06 | 20 | 2 | copy 2 |
| police-mini_mock-set-10 | 20 | 1 | twin 1, copy 1 |
| police-mini_mock-set-12 | 20 | 2 | twin 1, copy 2 |
| police-mini_mock-set-13 | 20 | 2 | twin 1, copy 2 |
| police-mini_mock-set-14 | 20 | 1 | copy 1 |

Category key:
- **twin:** same text as a fix already imported on 13 Nov.
- **backport:** same text as the mini-drill copy fixed last round.
- **copy:** same fix copied to a mini-drill copy.
- **negative:** negative word quoted.
- **reorder:** key position moved (Thai only).
- **length-cue:** Thai distractor or key length edit.

## Proposals (not done)

- **Mock key positions:** Mock 2 has ก 30 · ข 44 · ค 42 · ง 34, exactly the same distribution as Mock 1. Mocks 3–6 are balanced (35–41 each). **Proposal:** if the owner wants Mock 2 balanced, move about 10 keys from ข and ค to ก and ง, using the same swap method as the Thai sets.
- **Longest choice in mocks:** the "clearly longest" choice is the key in **Mock 2: 52/65 (80%)** and **Mock 5: 46/58 (79%)**; Mocks 3, 4 and 6 are 63–68%. This is a strong cue in Mocks 2 and 5. **Proposal:** a Thai-style distractor pass on Mocks 2 and 5 (about 25 questions each). That is content work, so it needs the owner's OK.
- **English explanations:** in Mock 2–6 they say "ข้อ A/B/C/D" while the site shows ก–ง (Mock 3 q142 was fixed because it was in a reviewer finding). The order is consistent, so the mapping is right. A one-off mechanical A→ก conversion across all English explanations is possible if the owner wants it.

## Suspected but not changed

| Question | Why not changed |
|---|---|
| `police-mock_test-set-06-q105` | Flagged; the text is correct per the 2548 amendment (above). |
| Tips "จุดจำ: การปฏิบัติ" (Mock 5 q093, mini-06 q15, saraban-03 q34/q40) and "จุดจำ: 1 ปี" (Mock 4 q102, saraban-02 q41) | They share text with tips fixed last round, but in these questions the tip names the correct answer. They are not twins of the wrong-tip problem. |
| Mock 2 q061/q065, q069/q074, q043/q075, q070/q073 | Near-duplicates inside Mock 2. The content is correct, and the owner rule is not to write new questions. |
| Mock 3 q071–q075 | Same generic tip ("แยกหน้าที่หลักของ …"). Not wrong, just weak. |
| Mock 3 q133 (ฎีกา 3643/2526), Mock 4 q132 (ม.285/1, 13 ปี) | Reasoning matches standard teaching. Reviewers confirmed ม.285/1 but could not open the ฎีกา. |
| Mock 4 q047 (.png vs .gif transparency), Mock 5 q029 (ผลลัพธ์สุดท้าย), Mock 6 q071 (COUNTA with "-"), Mock 6 q110 (who replies to e-mail) | A distractor is arguable, but the key is clearly the best answer. |
| Mock 5 q041 image | The flowchart draws "ตรวจเอกสาร" as a parallelogram; it should be a rectangle. The question asks only about the diamond. This is an image change that needs a deploy. |
| Mock 5 q029 negative quote | "มีคำซ้ำซ้อนโดยไม่จำเป็น" is content, not a negative stem (the same decision as its copy, mini-04 q15). |
| Thai 1–3: questions not edited for length | Spelling and reading-aloud items with very short choices, and fixed-idiom items (e.g. set-02 q22, q37). Lengthening them risked a second answer. |

## How to import (not run)

```bash
node scripts/police/apply-subject-audit-fixes.mjs content/exams/police-thai-mock-audit-fixes-2026-11-13.json            # dry-run
node scripts/police/apply-subject-audit-fixes.mjs content/exams/police-thai-mock-audit-fixes-2026-11-13.json --apply    # writes
```

- **What it writes:** the script maps `after.key` to `question_solutions.correct_choice_index`; this patch uses that field for the 26 Thai reorders. Otherwise it updates only prompt, choices, explanation and tip for the listed ids.
- **What it never touches:** exam sets, links, products, prices or Stripe. Every set involved is free.
- **Safety:** it checks every row against `before` and stops if anything changed since the dump. After writing, it reads every row back.
- **Content files already updated:** 10 files (mock-test-set-01..06, mini_mock-set-02, thai-set-01..03).
- **No file:** 10 mini-drill rows exist only in the database; the patch covers them.
- **No deploy is needed.**

**Past attempts on the reordered Thai questions: run a second script right after the patch.**

- The wrong-answer book shows an old answer by looking up the stored `selected_choice_index` / `correct_choice_index` in the **current** choice list (`app/dashboard/page.tsx:1032-1033`).
- Once a key moves, an old attempt would show the wrong text under "คำตอบที่ถูก".
- **Exposure:** 5 attempts on thai-set-01 hold 41 answers on the 26 moved questions. 1 of those answers is wrong, so it shows in that user's wrong-answer book.
- **Fix:** `scripts/police/remap-thai-attempt-indices.mjs` swaps the same two positions inside `attempts.answers` for those questions. `is_correct` and scores do not change.
  - It is idempotent: it only remaps an answer whose `correct_choice_index` still equals the old key.
  - Dry run: "5 attempts, 41 answers to remap".
- **Run order:** apply the patch, then immediately run `node scripts/police/remap-thai-attempt-indices.mjs --apply`.
- This writes user attempt data, so it needs the same owner OK as the import.
- **Not remapped:** 53 more stored answers sit on questions whose choice *text* changed but whose position did not. They will show the new wording of the same choice, which is harmless.

## Appendix: every changed question

The order is: ambiguous/other, then explanation and render fixes, then authoring wording, then twin and carried-back fixes, then Thai length edits, then Thai key moves, then negative-only and copies. Full text is in the patch file.

| # | Question id | Problem / reason | Change (short) |
|---|---|---|---|
| 1 | police-mock_test-set-03-q043 | other:  Misspelling in explanation: "ลายเซ็นต์" should be "ลายเซ็น" (ราชบัณฑิตยสภา). | explanation rewritten |
| 2 | police-mock_test-set-03-q060 | other:  Typo in TIP: "ส่วย" (tribute) should be "ส่วน".; same fix as police-computer-set-03-q20 (twin, fixed and imported on 13 Nov) | tip rewritten |
| 3 | police-mock_test-set-03-q110 | ambiguous:  Prompt leaks 'ตามเงื่อนไขของต้นฉบับชุดที่ 3' and is convoluted ('ไม่ควรเลือก...หากถามขั้นต่ำ'); three choices…; same fix as police-saraban-set-03-q42 (twin, fixed and imported on 13 Nov) | prompt: หนังสือด้านการเงินที่ผ่านการตรวจแล้วตามเงื่อนไขของต้นฉบ… → หนังสือด้านการเงินที่สำนักงานการตรวจเงินแผ่นดินตรวจสอบแ…<br>explanation rewritten<br>tip rewritten |
| 4 | police-mock_test-set-03-q115 | ambiguous:  Numbered items 1–3 sit inside choices ข ค ง instead of the stem, so ข '1. สภาผู้แทนราษฎร' and ง '3. วุฒิสภา' …; same fix as police-law-set-03-q09 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดกล่าวถูกต้องเกี่ยวกับองค์ประกอบของรัฐสภา → 3. วุฒิสภา<br>ก: ข้อ 1 และ 3 ถูก → ข้อ 1 และ 3<br>ข: 1. สภาผู้แทนราษฎร → ข้อ 1 เท่านั้น<br>ค: 2. สภานิติบัญญัติแห่งชาติ → ข้อ 2 เท่านั้น<br>ง: 3. วุฒิสภา → ข้อ 3 เท่านั้น<br>explanation rewritten<br>tip rewritten |
| 5 | police-mock_test-set-03-q139 | other:  Synonym item has no instruction and no marked target word; candidate must guess which word ('strengthen') to …; same fix as police-english-set-03-q07 (twin, fixed and imported on 13 Nov) | prompt: The agency introduced new measures to strengthen securi… → The agency introduced new measures to “strengthen” secu… |
| 6 | police-mock_test-set-03-q140 | other:  Synonym item has no instruction and no marked target word; candidate must guess which word ('inaccurate') to …; same fix as police-english-set-03-q09 (twin, fixed and imported on 13 Nov) | prompt: The information in the first report was inaccurate and … → The information in the first report was “inaccurate” an… |
| 7 | police-mock_test-set-03-q141 | other:  Synonym item has no instruction and no marked target word; candidate must guess which word ('authentic') to m…; same fix as police-english-set-03-q11 (twin, fixed and imported on 13 Nov) | prompt: The museum confirmed that the newly discovered document… → The museum confirmed that the newly discovered document… |
| 8 | police-mock_test-set-04-q056 | other:  Choice ง spells the acronym 'DDos'. The standard form is 'DDoS' (Distributed Denial of Service). | ง: DDos (การปฏิเสธการให้บริการ) → DDoS (การปฏิเสธการให้บริการ) |
| 9 | police-mock_test-set-04-q084 | other:  Bad automated replacement: 'ลักษณะจำแนกที่ระเบียบงานสารบรรณ ใช้ถามโดยตรง'. A regulation does not ask question…; same fix as police-mini_mock-set-12-q02 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q02 (fixed and imported on 13 Nov) | explanation rewritten |
| 10 | police-mock_test-set-04-q093 | other:  Bad automated replacement: 'ระเบียบงานสารบรรณ เจาะเฉพาะเลข “01” ในตัวอย่าง'. The original was probably 'ต้นฉบ…; same fix as police-mini_mock-set-12-q05 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q05 (fixed and imported on 13 Nov) | explanation rewritten |
| 11 | police-mock_test-set-04-q103 | other:  Bad replacement / authoring text: 'ข้อนี้ตัดถ้อยคำยาวออกเพื่อวัดเพียงระดับอำนาจอนุญาต ซึ่งเป็นจุดที่ตัวอย่างร… | explanation rewritten |
| 12 | police-mock_test-set-04-q106 | other:  Bad automated replacement: 'เป็นจุดที่ระเบียบงานสารบรรณ ใช้สร้างตัวลวงโดยตรง'. | explanation rewritten |
| 13 | police-mock_test-set-04-q109 | other:  Bad replacement / authoring text: 'ข้อนี้คงรูปแบบ “ข้อ 1 และข้อ 2 ถูก” ตามระเบียบงานสารบรรณ'. | explanation rewritten |
| 14 | police-mock_test-set-04-q111 | other:  Bad automated replacement: the explanation of a law question says 'ระเบียบงานสารบรรณใช้ถ้อยคำว่า … และเฉลยสหร…; same fix as police-mini_mock-set-13-q01 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-13-q01 (fixed and imported on 13 Nov) | explanation rewritten |
| 15 | police-mock_test-set-04-q117 | other:  Bad replacement and an old question number: 'ข้อนี้วนถาม fact เดียวกับระเบียบงานสารบรรณข้อ 5 ในอีกมุมหนึ่ง' i… | explanation rewritten |
| 16 | police-mock_test-set-04-q134 | other:  Bad automated replacement: a consumer-law explanation ends with 'ตามระเบียบงานสารบรรณ'.; same fix as police-mini_mock-set-13-q10 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-13-q10 (fixed and imported on 13 Nov) | explanation rewritten |
| 17 | police-mock_test-set-04-q139 | ambiguous:  Synonym item with no instruction and no marked target word. The candidate cannot tell which word to match.; same fix as police-english-set-02-q07 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-14-q03 (fixed and imported on 13 Nov) | prompt: The instructions were so vague that several employees m… → The instructions were so “vague” that several employees… |
| 18 | police-mock_test-set-04-q140 | ambiguous:  'The city has agreed to ___ construction' does not rule out 'prevent' or 'forbid': a city can agree (e.g. wit… | prompt: The city has agreed to __________ construction of the n… → The city has agreed to __________ construction of the n… |
| 19 | police-mock_test-set-05-q020 | other:  Typo in explanation: “วันที 4” is missing the mai ek (should be “วันที่ 4”).; same fix as police-mini_mock-set-09-q20 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-09-q20 (fixed and imported on 13 Nov) | explanation rewritten |
| 20 | police-mock_test-set-05-q082 | ambiguous:  'ส่วนล่างสุดของข้อความ' could mean the item at the very bottom of the form, which is 'ประกาศ ณ วันที่' (ข้อ 1…; same fix as police-mini_mock-set-12-q11 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q11 (fixed and imported on 13 Nov) | prompt: ในแบบ “ระเบียบ” ส่วนล่างสุดของข้อความตามระเบียบงานสารบร… → ในแบบ “ระเบียบ” ตามระเบียบงานสารบรรณ ข้อสุดท้ายของข้อคว…<br>explanation rewritten |
| 21 | police-mock_test-set-05-q093 | ambiguous:  The stem is garbled ('ชื่อหน่วยงานที่รับหนังสือที่ช่องใด'). Read literally, the addressee goes in the 'ถึง' c…; same fix as police-mini_mock-set-06-q15 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q15 (fixed and imported on 13 Nov) | prompt: ในทะเบียนหนังสือรับ ชื่อหน่วยงานที่รับหนังสือที่ช่องใดต… → เมื่อจัดแยกหนังสือที่ลงทะเบียนรับแล้วส่งให้หน่วยงานที่เ…<br>explanation rewritten |
| 22 | police-mock_test-set-05-q097 | other:  Key choice ก 'ข้อ 2 และ 3 ถูก' refers to choices by number. On the ก–ง labels, 2 and 3 are ข (สำนักนายกรัฐมนต…; same fix as police-saraban-set-03-q44 (twin, fixed and imported on 13 Nov) | ก: ข้อ 2 และ 3 ถูก → ข้อ ข และ ค ถูก<br>explanation rewritten<br>tip rewritten |
| 23 | police-mock_test-set-05-q107 | other:  The stem and explanation misstate the procedure. The officer in charge of storage surveys within 60 days and …; same fix as police-mini_mock-set-06-q19 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q19 (fixed and imported on 13 Nov) | prompt: ตามระเบียบงานสารบรรณ ภายในกี่วันหลังจากวันสิ้นปีปฏิทิน … → ตามระเบียบงานสารบรรณ ภายในกี่วันหลังจากวันสิ้นปีปฏิทิน …<br>explanation rewritten |
| 24 | police-mock_test-set-02-q110 | expl-mismatch:  The keyed filename zero-pads the send-register number (0025), and the explanation praises “เลขทะเบียนแบบเติมศ… | ข: 2569_RTP0900_0025.pdf → 2569_RTP0900_25.pdf<br>explanation rewritten |
| 25 | police-mock_test-set-03-q117 | expl-mismatch:  Negative stem; TIP repeats the false statement 'ประธานวุฒิสภาเป็นผู้เสนอ...' as the thing to remember.; same fix as police-law-set-03-q13 (twin, fixed and imported on 13 Nov) | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการยุบสภาผู้แทนราษฎร → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการยุบสภาผู้แทนราษฎร |
| 26 | police-mock_test-set-03-q121 | expl-mismatch:  Negative stem; TIP repeats the false statement 'เป็นโมฆะเสมอ' as จุดจำ.; negative stem: quoted “ไม่ถูกต้อง” | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับนิติกรรมของคนไร้ความสามารถ → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับนิติกรรมของคนไร้ความสามา… |
| 27 | police-mock_test-set-03-q125 | expl-mismatch:  Negative stem; TIP repeats the false statement that the hirer may keep the property as จุดจำ.; same fix as police-law-set-03-q29 (twin, fixed and imported on 13 Nov) | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการบอกเลิกสัญญาเช่าซื้อโดย… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการบอกเลิกสัญญาเช่าซื้อโ… |
| 28 | police-mock_test-set-03-q127 | expl-mismatch:  Negative stem; TIP repeats the false statement 'ไม่ต้องขอความยินยอม...ไม่ว่ากรณีใด' as จุดจำ.; negative stem: quoted “ไม่ถูกต้อง” | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการหมั้นของผู้เยาว์อายุ 18… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการหมั้นของผู้เยาว์อายุ … |
| 29 | police-mock_test-set-03-q138 | render:  Explanation contains Chinese characters '分钟' ('สิบ分钟') instead of Thai 'นาที'. | explanation rewritten |
| 30 | police-mock_test-set-03-q142 | expl-mismatch:  Explanation refers to choices as ข้อ A/B/C/D, but choices are labelled ก ข ค ง. | explanation rewritten |
| 31 | police-mock_test-set-04-q053 | expl-mismatch:  Explanation calls .go.th a 'โดเมนเนมระดับบนสุดตามหมวดหมู่ (ccTLD)'. ccTLD means country-code TLD (.th); .go.t…; same fix as police-computer-set-02-q13 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 32 | police-mock_test-set-04-q083 | expl-mismatch:  Negative stem: the TIP gives the non-existent term 'หนังสือประทับเรื่อง' as the point to remember. The explan…; same fix as police-saraban-set-02-q03 (twin, fixed and imported on 13 Nov) | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดไม่ใช่ชนิดของหนังสือราชการตามรูปแบบคำเรียกในระเบีย… → ข้อใด“ไม่ใช่”ชนิดของหนังสือราชการตามรูปแบบคำเรียกในระเบ… |
| 33 | police-mock_test-set-04-q094 | expl-mismatch:  Negative stem: the TIP gives the wrong format ('ให้ไว้ ณ วันที่ …') as the point to remember for หนังสือภายใน…; negative stem: quoted “ไม่ใช่” | tip rewritten<br>prompt: ข้อใดไม่ใช่รูปแบบวันที่ของหนังสือภายในตามระเบียบงานสารบ… → ข้อใด“ไม่ใช่”รูปแบบวันที่ของหนังสือภายในตามระเบียบงานสา… |
| 34 | police-mock_test-set-04-q105 | expl-mismatch:  Negative stem: the TIP gives the FALSE statement ('ส่งทางอีเมลกำหนดเพียง PDF ไม่น้อยกว่า 150 dpi') as the poi…; same fix as police-saraban-set-02-q46 (twin, fixed and imported on 13 Nov); negative stem: quoted “ผิด” | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวผิดเกี่ยวกับระบบสารบรรณอิเล็กทรอนิกส์ตามระเบี… → ข้อใดกล่าว“ผิด”เกี่ยวกับระบบสารบรรณอิเล็กทรอนิกส์ตามระเ… |
| 35 | police-mock_test-set-04-q112 | expl-mismatch:  Negative stem: the TIP gives the false statement ('ไม่มีกฎหมายลายลักษณ์อักษรเลยแม้แต่ฉบับเดียว') as the point…; negative stem: quoted “ไม่ถูกต้อง” | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับระบบ Common Law → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับระบบ Common Law |
| 36 | police-mock_test-set-04-q116 | expl-mismatch:  Negative stem: the TIP gives the false statement ('มี 3 ชั้น คือ ชั้นต้น อุทธรณ์ และสูงสุด') as the point to …; same fix as its mini-drill copy police-mini_mock-set-13-q03 (fixed and imported on 13 Nov) | tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับโครงสร้างศาลปกครอง → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับโครงสร้างศาลปกครอง |
| 37 | police-mock_test-set-04-q127 | expl-mismatch:  Negative stem: the TIP gives the false statement (a will made at 14 becomes valid once ratified) as the point…; same fix as police-law-set-02-q33 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-13-q07 (fixed and imported on 13 Nov) | tip rewritten<br>prompt: ข้อใดไม่ถูกต้องเกี่ยวกับพินัยกรรมของผู้เยาว์ → ข้อใด“ไม่ถูกต้อง”เกี่ยวกับพินัยกรรมของผู้เยาว์ |
| 38 | police-mock_test-set-05-q081 | expl-mismatch:  Explanation cites 'ระเบียบงานสารบรรณ ข้อ 4' (an old question number). The rule is ข้อ 12.1.; same fix as police-mini_mock-set-06-q11 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q11 (fixed and imported on 13 Nov) | explanation rewritten |
| 39 | police-mock_test-set-05-q083 | expl-mismatch:  This is a negative stem, but the TIP 'จุดจำ: ผู้ไม่เข้าร่วมประชุม' presents the wrong heading as the thing to…; same fix as police-mini_mock-set-06-q12 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q12 (fixed and imported on 13 Nov) | explanation rewritten<br>tip rewritten<br>prompt: ตามแบบรายงานการประชุม ข้อใดไม่ใช่หัวข้อที่ใช้ตามถ้อยคำม… → ตามแบบรายงานการประชุม ข้อใด“ไม่ใช่”หัวข้อที่ใช้ตามถ้อยค… |
| 40 | police-mock_test-set-05-q085 | expl-mismatch:  The explanation cites 'ข้อ 4' (an old question number) and uses authoring wording ('ตรงกับแนวคำตอบของ'). The …; same fix as police-mini_mock-set-12-q13 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q13 (fixed and imported on 13 Nov) | explanation rewritten |
| 41 | police-mock_test-set-05-q086 | expl-mismatch:  This is a negative stem, but the TIP presents the wrong statement ('ประกาศทุกฉบับต้องมี ฉบับที่') as the thin…; same fix as police-mini_mock-set-12-q14 (twin, fixed and imported on 13 Nov); same fix as police-saraban-set-03-q16 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q14 (fixed and imported on 13 Nov) | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดไม่ใช่ลักษณะที่ควรนำไปใช้เป็นกฎเหมารวมของประกาศตาม… → ข้อใด“ไม่ใช่”ลักษณะที่ควรนำไปใช้เป็นกฎเหมารวมของประกาศต… |
| 42 | police-mock_test-set-05-q089 | expl-mismatch:  This is a negative stem, but the TIP presents the false statement (choice ก) as the thing to remember. Choice…; same fix as police-mini_mock-set-12-q16 (twin, fixed and imported on 13 Nov); same fix as police-saraban-set-03-q24 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q16 (fixed and imported on 13 Nov) | ค: ประกาศไม่จำเป็นต้องใส่ฉบับที่ตามตัว… → แบบประกาศไม่มีส่วน “ฉบับที่”<br>explanation rewritten<br>tip rewritten<br>prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับ “ฉบับที่” ตามแนวระเบียบงา… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับ “ฉบับที่” ตามแนวระเบียบ… |
| 43 | police-mock_test-set-05-q092 | expl-mismatch:  This is a negative stem, but the TIP 'จุดจำ: สีน้ำเงินเท่านั้น' presents the wrong option as the thing to rem…; same fix as police-mini_mock-set-12-q18 (twin, fixed and imported on 13 Nov); same fix as police-saraban-set-03-q30 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q18 (fixed and imported on 13 Nov) | prompt: ข้อใดไม่ใช่สีที่ระเบียบงานสารบรรณใช้เป็นคำตอบสำหรับตราป… → ข้อใด“ไม่ใช่”สีที่ใช้แสดงชั้นความลับบนหนังสือราชการ<br>explanation rewritten<br>tip rewritten |
| 44 | police-mock_test-set-05-q094 | expl-mismatch:  The explanation cites 'ข้อ 23'. The rule is ข้อ 57.6, as amended by (ฉบับที่ 2) พ.ศ. 2548. The key is correct…; same fix as police-mini_mock-set-12-q19 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q19 (fixed and imported on 13 Nov) | explanation rewritten |
| 45 | police-mock_test-set-05-q098 | expl-mismatch:  This is a negative stem, but the TIP presents the wrong filename as the thing to remember. The explanation ci…; same fix as police-saraban-set-03-q46 (twin, fixed and imported on 13 Nov); negative stem: quoted “ไม่ถูกต้อง” | prompt: ข้อใดไม่ถูกต้องตามรูปแบบการตั้งชื่อไฟล์ราชการที่ระเบียบ… → ข้อใด“ไม่ถูกต้อง”ตามรูปแบบการตั้งชื่อไฟล์หนังสือราชการท…<br>explanation rewritten<br>tip rewritten |
| 46 | police-mock_test-set-05-q099 | expl-mismatch:  The explanation says the regulation gives saraban@police.go.th as an example and cites 'ข้อ 28'. The regulati… | explanation rewritten |
| 47 | police-mock_test-set-05-q101 | expl-mismatch:  The explanation cites ข้อ 9. The six types of letter are listed in ข้อ 10 (ข้อ 9 defines หนังสือราชการ).; same fix as police-mini_mock-set-06-q17 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q17 (fixed and imported on 13 Nov) | explanation rewritten |
| 48 | police-mock_test-set-05-q102 | expl-mismatch:  The explanation cites ข้อ 27. The speed classes are ข้อ 28. | explanation rewritten |
| 49 | police-mock_test-set-05-q103 | expl-mismatch:  The explanation cites ข้อ 14. The three secrecy classes are in ข้อ 12 of ระเบียบว่าด้วยการรักษาความลับของทางร… | explanation rewritten |
| 50 | police-mock_test-set-05-q104 | expl-mismatch:  The explanation cites 'ข้อ 70 และภาคผนวก 2'. The garuda sizes are ข้อ 71, with use on ตราครุฑ paper in ข้อ 75…; same fix as police-mini_mock-set-06-q18 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-06-q18 (fixed and imported on 13 Nov) | explanation rewritten |
| 51 | police-mock_test-set-05-q105 | expl-mismatch:  The explanation cites ข้อ 72. The envelope sizes are ข้อ 74.2 and their uses are ข้อ 77. | explanation rewritten |
| 52 | police-mock_test-set-05-q106 | expl-mismatch:  The explanation cites 'ข้อ 56 วรรคหนึ่ง'. Retention periods are ข้อ 57. | explanation rewritten |
| 53 | police-mock_test-set-05-q108 | expl-mismatch:  The explanation cites ข้อ 66. The committee reports to the หัวหน้าส่วนราชการระดับกรม under ข้อ 68.4, who orde… | explanation rewritten<br>tip rewritten |
| 54 | police-mock_test-set-05-q109 | expl-mismatch:  The explanation cites 'ข้อ 86/4', which does not exist. The twice-daily rule is in ภาคผนวก 7 ข้อ 2 (and ภาคผน… | explanation rewritten |
| 55 | police-mock_test-set-06-q022 | expl-mismatch:  Explanation says "ข้อแรกถูกทุกคำ" but the key is ข (the second choice); choice ก contains the misspelling รสช…; negative stem: quoted “ไม่มี” | explanation rewritten<br>prompt: ข้อความใดไม่มีคำเขียนผิด → ข้อความใด“ไม่มี”คำเขียนผิด |
| 56 | police-mock_test-set-06-q027 | expl-mismatch:  Explanation says "ข้อแรกชัดเจน" but the key is ค (third choice); choice ก (ภรรยานายตำรวจที่ได้รับรางวัล…) is … | explanation rewritten |
| 57 | police-mock_test-set-02-q108 | leak:  Stem says “ตรงกับกลไก Set 1 มากที่สุด”, which is authoring-process wording left in candidate-facing text. | prompt: เมื่อต้องเก็บหนังสืออิเล็กทรอนิกส์ระยะยาว แนวทางใดตรงกั… → เมื่อต้องเก็บหนังสืออิเล็กทรอนิกส์ระยะยาว แนวทางใดเหมาะ… |
| 58 | police-mock_test-set-03-q081 | leak:  Explanation cites 'ต้นฉบับชุดที่ 3 ข้อ 1'.; same fix as police-saraban-set-03-q01 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 59 | police-mock_test-set-03-q082 | leak:  Prompt says 'ตามรูปแบบที่ต้นฉบับถาม'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 3 and 'คาแรกเตอร์'.; same fix as police-saraban-set-03-q03 (twin, fixed and imported on 13 Nov) | prompt: สำหรับหนังสือภายนอก ตำแหน่งของ “ส่วนราชการเจ้าของเรื่อง… → สำหรับหนังสือภายนอก ตำแหน่งของ “ส่วนราชการเจ้าของเรื่อง…<br>explanation rewritten |
| 60 | police-mock_test-set-03-q083 | leak:  Explanation cites ต้นฉบับชุดที่ 3 ข้อ 5.; same fix as police-saraban-set-03-q05 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 61 | police-mock_test-set-03-q084 | leak:  Prompt says 'ตามคาแรกเตอร์ข้อสอบต้นฉบับ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 7. Also TIP gives the false s…; same fix as police-saraban-set-03-q07 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดกล่าวเกี่ยวกับ “ประกาศ” ไม่ถูกต้องตามคาแรกเตอร์ข้อ… → ข้อใดกล่าวเกี่ยวกับ “ประกาศ” ไม่ถูกต้อง<br>explanation rewritten<br>tip rewritten |
| 62 | police-mock_test-set-03-q085 | leak:  Prompt says 'ตามต้นฉบับชุดที่ 3'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 9.; same fix as police-saraban-set-03-q09 (twin, fixed and imported on 13 Nov) | prompt: ข้อความในบันทึกสามารถเป็นลักษณะใดได้บ้างตามต้นฉบับชุดที… → ข้อความในบันทึกสามารถเป็นลักษณะใดได้บ้างตามระเบียบงานสา…<br>explanation rewritten |
| 63 | police-mock_test-set-03-q086 | leak:  Explanation mentions 'ต้นฉบับข้อ 1' and 'เป้าหมาย Mock Exam'; prompt 'ถ้าโจทย์ถาม' is authoring phrasing.; same fix as police-saraban-set-03-q11 (twin, fixed and imported on 13 Nov) | prompt: ถ้าโจทย์ถาม “วันเริ่มใช้บังคับ” ของระเบียบงานสารบรรณ พ.… → ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 เริ…<br>explanation rewritten |
| 64 | police-mock_test-set-03-q087 | leak:  Prompt says 'ตามมุมที่ต้นฉบับชุดที่ 3 ใช้ถาม'; explanation cites ต้นฉบับข้อ 3 and 'DNA'.; same fix as police-saraban-set-03-q13 (twin, fixed and imported on 13 Nov) | prompt: ตำแหน่งด้านล่างซ้ายของหนังสือภายนอกตามมุมที่ต้นฉบับชุดท… → ตำแหน่งด้านล่างซ้ายของหนังสือภายนอก เชื่อมโยงกับรายการใ…<br>explanation rewritten |
| 65 | police-mock_test-set-03-q088 | leak:  Prompt says 'ที่ต้นฉบับชุดที่ 3 เน้นถาม'; explanation cites ต้นฉบับข้อ 6.; same fix as police-saraban-set-03-q15 (twin, fixed and imported on 13 Nov) | prompt: ถ้าตรวจแบบ “ระเบียบ” แล้วส่วนท้ายไม่มีรายการใดต่อไปนี้ … → ถ้าตรวจแบบ “ระเบียบ” แล้วข้อสุดท้ายไม่มีรายการใดต่อไปนี…<br>explanation rewritten |
| 66 | police-mock_test-set-03-q089 | leak:  Explanation cites 'ข้อ 8 ของต้นฉบับ'.; same fix as police-saraban-set-03-q17 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 67 | police-mock_test-set-03-q090 | leak:  Prompt says 'ตามต้นฉบับ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 12 and 'คาแรกเตอร์'.; same fix as police-saraban-set-03-q19 (twin, fixed and imported on 13 Nov) | prompt: ชั้นความลับในหนังสือราชการตามต้นฉบับมีทั้งหมดกี่ชั้น → ชั้นความลับของหนังสือราชการตามระเบียบว่าด้วยการรักษาควา…<br>explanation rewritten |
| 68 | police-mock_test-set-03-q091 | leak:  Prompt says 'ตามตัวเลือกของต้นฉบับชุดที่ 3'; explanation says 'ตามเฉลยต้นฉบับชุดที่ 3 ข้อ 14' and 'DNA'.; same fix as police-saraban-set-03-q21 (twin, fixed and imported on 13 Nov) | prompt: ตามตัวเลือกของต้นฉบับชุดที่ 3 บุคคลกลุ่มใดสามารถอยู่ในก… → บุคคลกลุ่มใดสามารถลงชื่อรับรองสำเนาถูกต้องได้ (เมื่อเป็…<br>explanation rewritten |
| 69 | police-mock_test-set-03-q092 | leak:  Prompt says 'ตามต้นฉบับชุดที่ 3 ... ที่ให้เป็นคำตอบ'; explanation cites เฉลยต้นฉบับ/ข้อสอบต้นฉบับ.; same fix as police-saraban-set-03-q23 (twin, fixed and imported on 13 Nov) | prompt: ตามต้นฉบับชุดที่ 3 รูปแบบวันที่ที่ให้เป็นคำตอบสำหรับข้อ… → รูปแบบวันที่ของ “ข้อบังคับ” ที่ถูกต้องคือข้อใด<br>explanation rewritten |
| 70 | police-mock_test-set-03-q093 | leak:  Prompt says 'ตามตัวอย่างในต้นฉบับชุดที่ 3'; explanation cites เฉลยต้นฉบับ.; same fix as police-saraban-set-03-q25 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดเป็นคำขึ้นต้นและคำลงท้ายของ “อัยการสูงสุด” ตามตัวอ… → ข้อใดเป็นคำขึ้นต้นและคำลงท้ายของหนังสือถึง “อัยการสูงสุ…<br>explanation rewritten |
| 71 | police-mock_test-set-03-q094 | leak:  Prompt 'ตามต้นฉบับ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 20, 'คาแรกเตอร์'.; same fix as police-saraban-set-03-q27 (twin, fixed and imported on 13 Nov) | prompt: ตราครุฑในกระดาษบันทึกข้อความมีขนาดเท่าใดตามต้นฉบับ → ตราครุฑในกระดาษบันทึกข้อความมีขนาดเท่าใด<br>explanation rewritten |
| 72 | police-mock_test-set-03-q095 | leak:  Prompt is authoring scaffolding ('ถ้ามีตัวเลือก 2 ชั้น, 3 ชั้น และ 4 ชั้น ... ตามต้นฉบับ') and does not match…; same fix as police-saraban-set-03-q29 (twin, fixed and imported on 13 Nov) | prompt: ถ้ามีตัวเลือก 2 ชั้น, 3 ชั้น และ 4 ชั้น จำนวนชั้นความลั… → ชั้นความลับของหนังสือราชการมีจำนวนกี่ชั้น<br>explanation rewritten |
| 73 | police-mock_test-set-03-q096 | leak:  Prompt asks which group 'ปรากฏอยู่ในตัวเลือกผู้รับรองสำเนาของต้นฉบับชุดที่ 3' — unanswerable for candidates w…; same fix as police-saraban-set-03-q31 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดเป็นกลุ่มบุคคลที่ปรากฏอยู่ในตัวเลือกผู้รับรองสำเนา… → ข้อใดเป็นกลุ่มบุคคลที่ลงชื่อรับรองสำเนาถูกต้องได้ (เมื่…<br>explanation rewritten |
| 74 | police-mock_test-set-03-q097 | leak:  Prompt 'ตามต้นฉบับชุดที่ 3'; explanation cites ต้นฉบับข้อ 20.; same fix as police-saraban-set-03-q33 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดกล่าวถูกต้องเกี่ยวกับตราครุฑบนกระดาษบันทึกข้อความต… → ข้อใดกล่าวถูกต้องเกี่ยวกับตราครุฑบนกระดาษบันทึกข้อความ<br>explanation rewritten |
| 75 | police-mock_test-set-03-q098 | leak:  Explanation cites ต้นฉบับชุดที่ 3 ข้อ 22.; same fix as police-saraban-set-03-q35 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 76 | police-mock_test-set-03-q099 | leak:  Prompt 'ตามต้นฉบับ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 24.; same fix as police-saraban-set-03-q37 (twin, fixed and imported on 13 Nov) | prompt: ถ้าหนังสือชำรุดเสียหายจนไม่สามารถซ่อมแซมให้คงสภาพเดิมได… → ถ้าหนังสือชำรุดเสียหายจนไม่สามารถซ่อมแซมให้คงสภาพเดิมได…<br>explanation rewritten |
| 77 | police-mock_test-set-03-q100 | leak:  Prompt 'ตามต้นฉบับ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 26.; same fix as police-saraban-set-03-q39 (twin, fixed and imported on 13 Nov) | prompt: ในบัญชีขอทำลายหนังสือ ถ้าคณะกรรมการเห็นว่าควรทำลาย ให้ท… → ในบัญชีหนังสือขอทำลาย ถ้าคณะกรรมการเห็นว่าควรทำลาย ให้ท…<br>explanation rewritten |
| 78 | police-mock_test-set-03-q101 | leak:  Prompt 'ตามกรอบต้นฉบับชุดที่ 3'; explanation cites ต้นฉบับข้อ 22.; same fix as police-saraban-set-03-q41 (twin, fixed and imported on 13 Nov) | prompt: “บัตรตรวจค้น” มีประโยชน์โดยตรงกับเรื่องใดตามกรอบต้นฉบับ… → “บัตรตรวจค้น” มีประโยชน์โดยตรงกับเรื่องใด<br>explanation rewritten |
| 79 | police-mock_test-set-03-q102 | leak:  Prompt 'ตามต้นฉบับ'; explanation cites ต้นฉบับข้อ 24.; same fix as police-saraban-set-03-q43 (twin, fixed and imported on 13 Nov) | prompt: เมื่อเอกสารชำรุดเสียหายจนซ่อมให้กลับสภาพเดิมไม่ได้ สิ่ง… → เมื่อเอกสารชำรุดเสียหายจนซ่อมให้กลับสภาพเดิมไม่ได้ สิ่ง…<br>explanation rewritten |
| 80 | police-mock_test-set-03-q103 | leak:  Prompt 'ที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบ'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 28.; same fix as police-saraban-set-03-q45 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดเป็นรูปแบบอีเมลราชการที่ต้นฉบับชุดที่ 3 ให้เป็นคำต… → ข้อใดเป็นรูปแบบอีเมลราชการที่ถูกต้อง<br>explanation rewritten |
| 81 | police-mock_test-set-03-q105 | leak:  Prompt says 'จาก DNA ของต้นฉบับชุดที่ 3'; explanation cites ตัวอย่างต้นฉบับ and 'ข้อ 29–30'.; same fix as police-saraban-set-03-q49 (twin, fixed and imported on 13 Nov) | prompt: จาก DNA ของต้นฉบับชุดที่ 3 ข้อใดเป็นลักษณะที่ควรพบในชื่… → ข้อใดเป็นลักษณะที่ควรพบในชื่อไฟล์หนังสือราชการอิเล็กทรอ…<br>explanation rewritten |
| 82 | police-mock_test-set-03-q106 | leak:  Prompt 'ตามกรอบข้อสอบต้นฉบับชุดที่ 3'; explanation cites ต้นฉบับชุดที่ 3 ข้อ 2.; same fix as police-saraban-set-03-q02 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดอยู่ในความหมายของ “หนังสือราชการ” ตามกรอบข้อสอบต้น… → ข้อใดอยู่ในความหมายของ “หนังสือราชการ” ตามระเบียบงานสาร…<br>explanation rewritten |
| 83 | police-mock_test-set-03-q107 | leak:  Explanation cites ต้นฉบับชุดที่ 3 ข้อ 2.; same fix as police-saraban-set-03-q12 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 84 | police-mock_test-set-03-q108 | leak:  Prompt 'ที่ต้นฉบับชุดที่ 3 ให้เป็นคำตอบ'; explanation cites เฉลยต้นฉบับ.; same fix as police-saraban-set-03-q22 (twin, fixed and imported on 13 Nov) | prompt: รูปแบบวันที่ของ “แถลงการณ์” ที่ต้นฉบับชุดที่ 3 ให้เป็นค… → รูปแบบวันที่ของ “แถลงการณ์” ที่ถูกต้องคือข้อใด<br>explanation rewritten |
| 85 | police-mock_test-set-03-q109 | leak:  Prompt 'ตามต้นฉบับ'; explanation cites ต้นฉบับข้อ 19 and 'Mock Exam'.; same fix as police-saraban-set-03-q32 (twin, fixed and imported on 13 Nov) | prompt: ข้อใดเป็นขนาด A4 ที่ถูกต้องตามต้นฉบับ → ข้อใดเป็นขนาดกระดาษ A4 ที่ถูกต้อง<br>explanation rewritten |
| 86 | police-mock_test-set-03-q134 | leak:  Explanation says 'ต้นฉบับชุดที่ 3 เน้นให้จำตรง ๆ'.; same fix as police-law-set-03-q47 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 87 | police-mock_test-set-04-q085 | leak:  The explanation contains 'ช่วยคงคาแรกเตอร์ระเบียบงานสารบรรณ'. Negative stem: the TIP gives the non-example as…; negative stem: quoted “ไม่ใช่” | explanation rewritten<br>tip rewritten<br>prompt: ข้อใดไม่ใช่ตัวอย่างการใช้หนังสือประทับตราตามระเบียบงานส… → ข้อใด“ไม่ใช่”ตัวอย่างการใช้หนังสือประทับตราตามระเบียบงา… |
| 88 | police-mock_test-set-04-q095 | leak:  Authoring-process text: 'ข้อนี้ลดรายละเอียดเหลือคำชี้เพียงจุดเดียว เพื่อเลียนแบบข้อสอบจำรูปแบบเอกสาร'.; same fix as police-saraban-set-02-q27 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 89 | police-mock_test-set-04-q098 | leak:  Authoring-process text: 'ยังคงคาแรกเตอร์ระเบียบงานสารบรรณที่ไม่ใช้ case ยาว'. | explanation rewritten |
| 90 | police-mock_test-set-04-q100 | leak:  Authoring-process text: 'ข้อนี้นำข้อเท็จจริงจากระเบียบงานสารบรรณมาเปลี่ยนเป็นตัวเลือกแบบรวมคำตอบ ซึ่งชุดตัวอย… | explanation rewritten |
| 91 | police-mock_test-set-04-q104 | leak:  Authoring-process text: 'เป็นการถาม fact เดิมในรูปย่อเพื่อรักษาคาแรกเตอร์ mock exam ซึ่งหัวข้อสำคัญสามารถออกซ…; same fix as police-mini_mock-set-12-q09 (twin, fixed and imported on 13 Nov); same fix as police-saraban-set-02-q45 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q09 (fixed and imported on 13 Nov) | explanation rewritten |
| 92 | police-mock_test-set-05-q091 | leak:  The stem has an automated-replacement artifact: 'ตามมุมที่ระเบียบงานสารบรรณใช้ถาม'. The explanation cites 'ข้…; same fix as police-mini_mock-set-12-q17 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q17 (fixed and imported on 13 Nov) | prompt: คำว่า “ด่วนภายใน” ต่างจากการระบุเพียง “ด่วน” อย่างไรตาม… → ตามระเบียบงานสารบรรณ คำว่า “ด่วนภายใน” ต่างจากการระบุเพ…<br>explanation rewritten |
| 93 | police-mock_test-set-05-q095 | leak:  The stem has an automated-replacement artifact: 'ตามหลักที่ระเบียบงานสารบรรณ ใช้ถาม'. The explanation cites '…; same fix as police-mini_mock-set-12-q20 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-12-q20 (fixed and imported on 13 Nov) | prompt: บุคคลภายนอกยืมหนังสือราชการได้หรือไม่ตามหลักที่ระเบียบง… → ตามระเบียบงานสารบรรณ บุคคลภายนอกยืมหนังสือราชการได้หรือ…<br>explanation rewritten |
| 94 | police-mock_test-set-05-q100 | leak:  The stem has an artifact ('ที่ระเบียบงานสารบรรณ ยกให้'). The explanation has authoring-process wording ('ข้อน… | prompt: หน่วยงานใดต่อไปนี้อยู่ในคู่หน่วยงานที่ระเบียบงานสารบรรณ… → ตามระเบียบงานสารบรรณ (ฉบับที่ 4) พ.ศ. 2564 ส่วนราชการอา…<br>explanation rewritten |
| 95 | police-mini_mock-set-10-q08 | same fix as police-thai-set-02-q39 (twin, fixed and imported on 13 Nov); same fix as source police-mock_test-set-04-q040 | explanation rewritten<br>ข: ชำนาญการ → คุ้นเคย |
| 96 | police-mini_mock-set-12-q06 | same fix as police-saraban-set-02-q29 (twin, fixed and imported on 13 Nov); same fix as source police-mock_test-set-04-q096 | explanation rewritten |
| 97 | police-mini_mock-set-13-q07 | same fix as police-law-set-02-q33 (twin, fixed and imported on 13 Nov); same fix as source police-mock_test-set-04-q127 | tip rewritten |
| 98 | police-mock_test-set-01-q025 | same fix as police-thai-set-01-q11 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 99 | police-mock_test-set-01-q070 | same fix as police-computer-set-01-q30 (twin, fixed and imported on 13 Nov) | tip rewritten |
| 100 | police-mock_test-set-01-q089 | same fix as police-saraban-set-01-q09 (twin, fixed and imported on 13 Nov) | tip rewritten |
| 101 | police-mock_test-set-01-q105 | same fix as police-saraban-set-01-q40 (twin, fixed and imported on 13 Nov) | tip rewritten<br>ง: ตราประทับกำหนดเก็บหนังสือต้องมีขนาด… → ตราประทับกำหนดเก็บหนังสือต้องมีขนาด… |
| 102 | police-mock_test-set-01-q119 | same fix as police-law-set-01-q16 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 103 | police-mock_test-set-01-q139 | same fix as police-english-set-01-q07 (twin, fixed and imported on 13 Nov); same fix as police-mini_mock-set-08-q03 (twin, fixed and imported on 13 Nov) | prompt: The safety briefing is mandatory for all new employees. → The safety briefing is “mandatory” for all new employee… |
| 104 | police-mock_test-set-01-q140 | same fix as police-english-set-01-q09 (twin, fixed and imported on 13 Nov) | prompt: The chief decided to commend the rescue team for their … → The chief decided to “commend” the rescue team for thei… |
| 105 | police-mock_test-set-01-q141 | same fix as police-english-set-01-q11 (twin, fixed and imported on 13 Nov) | prompt: The village has an ample supply of clean drinking water… → The village has an “ample” supply of clean drinking wat… |
| 106 | police-mock_test-set-03-q052 | same fix as police-computer-set-03-q12 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 107 | police-mock_test-set-03-q145 | same fix as police-english-set-03-q19 (twin, fixed and imported on 13 Nov) | prompt: Mr. Wilson __________ at this company for twelve years. → Mr. Wilson __________ at this company for twelve years … |
| 108 | police-mock_test-set-04-q022 | same fix as its mini-drill copy police-mini_mock-set-10-q01 (fixed and imported on 13 Nov) | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 109 | police-mock_test-set-04-q027 | same fix as its mini-drill copy police-mini_mock-set-10-q03 (fixed and imported on 13 Nov) | prompt: ข้อใดไม่อาจอนุมานได้จากข้อความ → ข้อใด“ไม่อาจ”อนุมานได้จากข้อความ |
| 110 | police-mock_test-set-04-q032 | same fix as its mini-drill copy police-mini_mock-set-10-q05 (fixed and imported on 13 Nov) | prompt: พิจารณาประโยคต่อไปนี้ ข้อใดมีการใช้คำราชาศัพท์ไม่ถูกต้อ… → พิจารณาประโยคต่อไปนี้ ข้อใดมีการใช้คำราชาศัพท์“ไม่ถูกต้… |
| 111 | police-mock_test-set-04-q037 | same fix as its mini-drill copy police-mini_mock-set-10-q07 (fixed and imported on 13 Nov) | prompt: ข้อใดใช้คำผิดความหมาย → ข้อใดใช้คำ“ผิด”ความหมาย |
| 112 | police-mock_test-set-04-q039 | same fix as police-thai-set-02-q37 (twin, fixed and imported on 13 Nov) | prompt: เขาไม่เคยสนใจงานอาสา แต่เมื่อเห็นเพื่อนทั้งกลุ่มสมัครก็… → เขามีรายได้ไม่มาก แต่เมื่อเห็นเพื่อนที่ฐานะดีซื้อรถคันใ…<br>explanation rewritten |
| 113 | police-mock_test-set-04-q040 | same fix as police-thai-set-02-q39 (twin, fixed and imported on 13 Nov) | explanation rewritten<br>ก: ชำนาญการ → คุ้นเคย |
| 114 | police-mock_test-set-04-q096 | same fix as police-saraban-set-02-q29 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 115 | police-mock_test-set-04-q102 | same fix as police-saraban-set-02-q41 (twin, fixed and imported on 13 Nov) | explanation rewritten |
| 116 | police-mock_test-set-05-q029 | same fix as police-mini_mock-set-04-q15 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-04-q15 (fixed and imported on 13 Nov) | explanation rewritten |
| 117 | police-mock_test-set-05-q052 | same fix as police-mini_mock-set-05-q15 (twin, fixed and imported on 13 Nov); same fix as its mini-drill copy police-mini_mock-set-05-q15 (fixed and imported on 13 Nov) | explanation rewritten |
| 118 | police-thai-set-01-q02 | length-cue:  key ข clearly longest (40 vs 27) | ก: จำนวนรถบรรทุกเก่า → จำนวนรถบรรทุกเก่าที่ยังวิ่งอยู่ในเม…<br>ง: การใช้รถไฟฟ้ายังไม่แพร่หลาย → การใช้รถไฟฟ้ายังไม่แพร่หลายในหมู่ผู… |
| 119 | police-thai-set-01-q03 | length-cue:  key ค clearly longest (70 vs 52); key moved ค→ง to balance answer positions (choice texts unchanged) | ข: เมืองควรปลูกต้นไม้ให้มากที่สุดโดยไม… → เมืองควรเร่งปลูกต้นไม้ให้ได้มากที่ส…<br>ค: การเพิ่มต้นไม้ในเมืองควรวางแผนเพื่อ… → ความสวยงามเป็นประโยชน์สำคัญที่สุดขอ…<br>ง: ความสวยงามเป็นประโยชน์สำคัญที่สุดขอ… → การเพิ่มต้นไม้ในเมืองควรวางแผนเพื่อ…<br>key ค → ง |
| 120 | police-thai-set-01-q05 | length-cue:  key ข clearly longest (66 vs 49) | ก: การถ่ายภาพสินค้าเป็นทักษะที่สำคัญที… → การถ่ายภาพสินค้าให้สวยงามเป็นทักษะท… |
| 121 | police-thai-set-01-q06 | length-cue:  key ข clearly longest (75 vs 38); key moved ข→ก to balance answer positions (choice texts unchanged) | ก: ฝนตกทำให้งานประจำปีต้องยกเลิก → ชุมชนปรับช่องทางขายจากงานประจำปีสู่…<br>ข: ชุมชนปรับวิธีจำหน่ายจากงานประจำปีไป… → ฝนตกทำให้งานประจำปีต้องยกเลิก<br>ค: การถ่ายวิดีโอทำให้ยอดขายเพิ่มขึ้นทั… → การถ่ายวิดีโอสาธิตวิธีสานทำให้ยอดขา…<br>key ข → ก |
| 122 | police-thai-set-01-q12 | length-cue:  key ข clearly longest (51 vs 37) | ค: เชิญชวนให้ซื้อรองเท้าสำหรับเดิน → เชิญชวนให้ผู้อ่านซื้อรองเท้าสำหรับเ…<br>ง: สั่งให้ทุกคนเลิกใช้เครื่องออกกำลังก… → สั่งให้ทุกคนเลิกใช้เครื่องออกกำลังก… |
| 123 | police-thai-set-01-q14 | length-cue:  key ข clearly longest (42 vs 33); key moved ข→ก to balance answer positions (choice texts unchanged) | ก: ชื่นชมผู้ที่ใช้โทรศัพท์อย่างสุภาพ → ตักเตือนเรื่องมารยาทในการใช้พื้นที่…<br>ข: ตักเตือนเรื่องมารยาทในการใช้พื้นที่… → ชื่นชมผู้ที่ใช้โทรศัพท์อย่างสุภาพใน…<br>key ข → ก |
| 124 | police-thai-set-01-q15 | length-cue:  key ข clearly longest (76 vs 38) | ก: ยอดดอยมีอุณหภูมิต่ำกว่าศูนย์องศาทุก… → ยอดดอยมีอุณหภูมิต่ำกว่าศูนย์องศาทุก…<br>ข: ผู้ที่ขึ้นยอดดอยก่อนรุ่งเช้าอาจเผชิ… → ผู้ขึ้นยอดดอยก่อนรุ่งเช้าอาจหนาวกว่…<br>ค: นักท่องเที่ยวทุกคนต้องค้างคืนบนยอดด… → นักท่องเที่ยวทุกคนต้องค้างคืนบนยอดด… |
| 125 | police-thai-set-01-q16 | length-cue:  key ข clearly longest (62 vs 48) | ค: เศษจากการตัดแต่งผักเกิดจากการวางแผน… → เศษจากการตัดแต่งผักเกิดจากการวางแผน… |
| 126 | police-thai-set-01-q33 | length-cue:  key ค clearly longest (88 vs 52) | ก: เขาขยันอ่านหนังสือทุกวันจึงเรียกว่า… → เขาขยันอ่านหนังสือทุกวันอย่างสม่ำเส…<br>ค: เขาไม่เตรียมงานล่วงหน้า พอถึงวันจริ… → เขาไม่เตรียมงานล่วงหน้า พอถึงวันจริ… |
| 127 | police-thai-set-01-q39 | length-cue:  key ง clearly longest (41 vs 30) | ก: พระองค์ทรงดนตรีในงานพระราชพิธี → พระองค์ทรงดนตรีในงานพระราชพิธีที่พร…<br>ค: พระองค์ทรงพระอักษรในห้องทรงงาน → พระองค์ทรงพระอักษรในห้องทรงงานจนดึก |
| 128 | police-thai-set-01-q42 | length-cue:  key ข clearly longest (8 vs 4); key moved ข→ก to balance answer positions (choice texts unchanged) | ก: ใน → ใตร่ตรอง<br>ข: ใตร่ตรอง → ใน<br>ค: ใต้ → ใต้ถุน<br>ง: ใหญ่ → ใหญ่หลวง<br>explanation rewritten<br>key ข → ก |
| 129 | police-thai-set-01-q47 | length-cue:  key ข clearly longest (68 vs 48) | ก: ผู้สมัครต้องยื่นเอกสารให้ครบถ้วนภาย… → ผู้สมัครต้องยื่นเอกสารให้ครบถ้วนภาย…<br>ง: ผู้เข้าร่วมประชุมควรลงทะเบียนก่อนเข… → ผู้เข้าร่วมประชุมควรลงทะเบียนให้เรี… |
| 130 | police-thai-set-01-q48 | length-cue:  key ค clearly longest (76 vs 49) | ก: เขาทำงานผิดพลาดซ้ำ ๆ จึงเรียกว่าขี่… → เขาทำงานผิดพลาดซ้ำ ๆ แม้หัวหน้าตักเ…<br>ง: เขายอมเสียสละเพื่อเพื่อนจึงเรียกว่า… → เขายอมเสียสละเวลาส่วนตัวเพื่อช่วยเพ… |
| 131 | police-thai-set-02-q01 | length-cue:  key ข is clearly longest (71 vs 44) | ก: เด็กที่อ่านช้าไม่ควรถูกสรุปว่าเป็นค… → เด็กที่อ่านช้าไม่ควรถูกสรุปว่าเป็นค…<br>ข: หากผู้ปกครองช่วยเหลืออย่างถูกวิธี เ… → หากผู้ปกครองช่วยอย่างถูกวิธี เด็กทุ…<br>ค: การช่วยเหลือควรคำนึงถึงความแตกต่างข… → การช่วยเหลือเด็กที่อ่านช้าควรคำนึงถ… |
| 132 | police-thai-set-02-q02 | length-cue:  key ก is strictly longest (39 vs 33) | ค: การถ่ายภาพด้วยโดรนเพียงอย่างเดียว → การถ่ายภาพและบันทึกวิดีโอจากมุมสูงด… |
| 133 | police-thai-set-02-q04 | length-cue:  key ค is clearly longest (73 vs 58) | ง: การพักหูช่วยรักษาการสูญเสียการได้ยิ… → การพักหูเป็นระยะช่วยรักษาการสูญเสีย… |
| 134 | police-thai-set-02-q05 | length-cue:  key ค is clearly longest (60 vs 41) | ก: การใช้วัสดุสะท้อนความร้อนบนหลังคา → การใช้แผ่นวัสดุที่สะท้อนความร้อนจาก… |
| 135 | police-thai-set-02-q07 | length-cue:  key ง is clearly longest (50 vs 33) | ข: น้ำในป่ามีความใสกว่าน้ำในเมือง → น้ำในลำธารกลางป่ามีความใสสะอาดกว่าน… |
| 136 | police-thai-set-02-q08 | length-cue:  key ง is clearly longest (45 vs 30); key moved ง→ก to balance answer positions (choice texts unchanged) | ก: จำความรู้ทั้งหมดได้อย่างแม่นยำ → ยึดมั่นในความคิดเดิมจนไม่ยอมเปิดรับ…<br>ง: ยึดมั่นในความคิดเดิมจนไม่ยอมเปิดรับ… → จดจำความรู้ทั้งหมดที่เคยเรียนมาได้อ…<br>key ง → ก |
| 137 | police-thai-set-02-q09 | length-cue:  key ค is clearly longest (56 vs 41) | ข: ชักชวนให้เลิกซื้อสินค้าที่มีโฆษณาทั… → ชักชวนให้ผู้บริโภคเลิกซื้อสินค้าทุก…<br>ง: สอนผู้ประกอบการให้เพิ่มยอดขายด้วยคว… → สอนผู้ประกอบการให้ใช้ความกลัวของผู้… |
| 138 | police-thai-set-02-q10 | length-cue:  key ง is clearly longest (36 vs 22); key moved ง→ก to balance answer positions (choice texts unchanged) | ก: รับผิดชอบ → ชอบแข่งขันเพื่อเอาชนะผู้อื่นทุกครั้…<br>ค: ทำงานร่วมกับผู้อื่นได้ → ทำงานร่วมกับผู้อื่นเป็นทีมได้อย่างร…<br>ง: ชอบแข่งขันเพื่อเอาชนะผู้อื่นทุกครั้… → รับผิดชอบ<br>key ง → ก |
| 139 | police-thai-set-02-q11 | length-cue:  key ข is strictly longest (44 vs 43) | ค: การจัดสภาพบ้านมีส่วนช่วยลดความเสี่ย… → การจัดบ้านให้เดินสะดวกและมีแสงสว่าง… |
| 140 | police-thai-set-02-q14 | length-cue:  key ค is clearly longest (80 vs 41) | ค: โทรศัพท์ที่เปียกน้ำควรได้รับการจัดก… → โทรศัพท์ที่เปียกน้ำควรจัดการอย่างระ…<br>ง: โทรศัพท์ที่เปิดติดแสดงว่าไม่มีความเ… → โทรศัพท์ที่ตกน้ำแต่ยังเปิดเครื่องติ… |
| 141 | police-thai-set-02-q15 | length-cue:  key ค is strictly longest (51 vs 43) | ง: การปรับระดับแรงช่วยของจักรยานไฟฟ้าแ… → การปรับระดับแรงช่วยของจักรยานไฟฟ้าแ… |
| 142 | police-thai-set-02-q17 | length-cue:  key ง is clearly longest (44 vs 35) | ก: ปลาเป็นสัตว์ที่ต้องการน้ำใสเท่านั้น → ปลาเป็นสัตว์ที่ต้องการน้ำใสเท่านั้น… |
| 143 | police-thai-set-02-q18 | length-cue:  key ง is clearly longest (35 vs 25) | ก: นั่งทำงานเป็นเวลานาน → นั่งทำงานอยู่ที่โต๊ะเป็นเวลานานโดยไ… |
| 144 | police-thai-set-02-q20 | length-cue:  key ง is clearly longest (41 vs 21) | ก: พึ่งพาตนเอง → พึ่งพาตนเองในการแก้ปัญหาก่อนขอความช… |
| 145 | police-thai-set-02-q21 | length-cue:  key ข is clearly longest (30 vs 18) | ก: สายลมพัดผ่านยอดไม้ → สายลมเย็นพัดผ่านยอดไม้ริมทุ่งนาในยา… |
| 146 | police-thai-set-02-q36 | length-cue:  key ข is clearly longest (33 vs 25) | ง: ใบไม้ร่วงเต็มลาน → ใบไม้แห้งร่วงหล่นเต็มลานวัดหลังพายุ… |
| 147 | police-thai-set-02-q47 | length-cue:  key ง is clearly longest (68 vs 46) | ข: นักเรียนควรพัฒนาทักษะการวิเคราะห์อย… → นักเรียนควรฝึกฝนทักษะการคิดวิเคราะห…<br>ง: ผู้จัดงานเตรียมอุปกรณ์อย่างพิถีพิทั… → ผู้จัดงานเตรียมอุปกรณ์อย่างพิถีพิทั… |
| 148 | police-thai-set-03-q03 | length-cue:  key ง is clearly longest (68 vs 43); key moved ง→ค to balance answer positions (choice texts unchanged) | ข: จุลินทรีย์ทุกชนิดสามารถกำจัดเชื้อรา… → จุลินทรีย์ทุกชนิดสามารถกำจัดเชื้อรา…<br>ค: สวนผลไม้ไม่ควรใช้สารเคมีทุกประเภท → การใช้จุลินทรีย์ร่วมกับการจัดการระบ…<br>ง: การใช้จุลินทรีย์ร่วมกับการจัดการระบ… → สวนผลไม้ไม่ควรใช้สารเคมีทุกประเภท<br>key ง → ค |
| 149 | police-thai-set-03-q08 | length-cue:  key ค is clearly longest (55 vs 42) | ง: พื้นที่ชุ่มน้ำไม่ควรมีพืชต่างถิ่นชน… → พื้นที่ชุ่มน้ำไม่ควรมีพืชต่างถิ่นชน… |
| 150 | police-thai-set-03-q10 | length-cue:  key ง is clearly longest (57 vs 42) | ข: อธิบายว่าการเผาขยะเป็นวิธีที่ประหยั… → อธิบายว่าการเผาขยะในที่โล่งเป็นวิธี… |
| 151 | police-thai-set-03-q13 | length-cue:  key ง is clearly longest (65 vs 42) | ข: การปล่อยน้ำขังทำให้ผลผลิตเสียหายทุก… → การปล่อยน้ำขังตลอดฤดูปลูกทำให้ผลผลิ… |
| 152 | police-thai-set-03-q15 | length-cue:  key ก is clearly longest (52 vs 40) | ง: ผู้ที่ยอมรับผิดจะประสบความสำเร็จทุก… → ผู้ที่กล้ายอมรับความผิดพลาดของตนจะป… |
| 153 | police-thai-set-03-q18 | length-cue:  key ค is clearly longest (50 vs 37) | ข: กับดักเป็นวิธีเดียวที่ควบคุมปลาได้ → กับดักเฉพาะแบบเป็นวิธีเดียวที่ควบคุ… |
| 154 | police-thai-set-03-q19 | length-cue:  key ง is clearly longest (69 vs 44); key moved ง→ข to balance answer positions (choice texts unchanged) | ก: พิพิธภัณฑ์ที่ไม่มีเทคโนโลยีถือว่าไม… → พิพิธภัณฑ์ที่ไม่มีเทคโนโลยีทันสมัยม…<br>ข: ผู้ชมทุกคนต้องชอบเรื่องประวัติศาสตร… → พิพิธภัณฑ์ควรช่วยให้ผู้ชมเข้าใจความ…<br>ง: พิพิธภัณฑ์ควรช่วยให้ผู้ชมเข้าใจความ… → ผู้ชมทุกคนต้องชอบเรื่องประวัติศาสตร…<br>key ง → ข |
| 155 | police-thai-set-03-q37 | length-cue:  key ก is clearly longest (79 vs 34) | ก: การประเมินผลครั้งนี้มีวัตถุประสงค์เ… → การประเมินผลครั้งนี้มีวัตถุประสงค์เ…<br>ข: ทีมงานเช็กแล้วว่ามาตรการนี้พอไปได้ → ทีมงานเช็กตัวเลขทั้งหมดแล้วว่ามาตรก…<br>ค: ถ้าดูจากตัวเลขก็ถือว่าโอเคอยู่ → ถ้าดูจากตัวเลขที่เก็บมาทั้งปีก็ถือว… |
| 156 | police-thai-set-03-q41 | length-cue:  key ง is clearly longest (65 vs 39); key moved ง→ก to balance answer positions (choice texts unchanged) | ก: พ่อเห็นลูกถือร่มบนสะพาน → เจ้าหน้าที่ส่งเอกสารฉบับสุดท้ายให้ผ…<br>ข: ครูแจ้งนักเรียนเรื่องกิจกรรมที่ห้อง… → ครูแจ้งนักเรียนชั้นมัธยมศึกษาปีที่ส…<br>ง: เจ้าหน้าที่ส่งเอกสารฉบับสุดท้ายให้ผ… → พ่อเห็นลูกถือร่มบนสะพาน<br>key ง → ก |
| 157 | police-thai-set-03-q42 | length-cue:  key ข is clearly longest (80 vs 47) | ข: นักเรียนที่ได้รับการคัดเลือกให้เป็น… → นักเรียนที่ได้รับการคัดเลือกให้เป็น…<br>ค: ประชาชนส่วนใหญ่กว่าครึ่งหนึ่งเห็นด้… → ประชาชนส่วนใหญ่กว่าครึ่งหนึ่งของหมู… |
| 158 | police-thai-set-03-q45 | length-cue:  key ค is clearly longest (25 vs 20) | ง: ดาวเด่นกลางคืนชื่นใจ → ดาวเด่นเรืองรองกลางคืนชื่นใจ |
| 159 | police-thai-set-01-q01 | key moved ข→ง to balance answer positions (choice texts unchanged) | ข: พื้นดินทรุดและระดับน้ำทะเลสูงขึ้น → การขยายตัวของชุมชนแนวราบ<br>ง: การขยายตัวของชุมชนแนวราบ → พื้นดินทรุดและระดับน้ำทะเลสูงขึ้น<br>key ข → ง |
| 160 | police-thai-set-01-q09 | key moved ข→ก to balance answer positions (choice texts unchanged) | ก: ทำเครื่องหมายสถานที่บนแผนที่ → ตัดสินใจกำหนดแนวทางให้ชัดเจน<br>ข: ตัดสินใจกำหนดแนวทางให้ชัดเจน → ทำเครื่องหมายสถานที่บนแผนที่<br>key ข → ก |
| 161 | police-thai-set-01-q27 | key moved ข→ง to balance answer positions (choice texts unchanged) | ข: ใส้ → ใฝ่<br>ง: ใฝ่ → ใส้<br>key ข → ง |
| 162 | police-thai-set-01-q31 | key moved ข→ก to balance answer positions (choice texts unchanged) | ก: แตงโม – ผลเหลือง → ผักบุ้ง – ผักทอดยอด<br>ข: ผักบุ้ง – ผักทอดยอด → แตงโม – ผลเหลือง<br>key ข → ก |
| 163 | police-thai-set-01-q32 | key moved ข→ง to balance answer positions (choice texts unchanged) | ข: ที่ประชุมมีมติให้ดำเนินการทันที แต่… → ประชาชนควรตรวจสอบเอกสารให้ครบก่อนยื…<br>ง: ประชาชนควรตรวจสอบเอกสารให้ครบก่อนยื… → ที่ประชุมมีมติให้ดำเนินการทันที แต่…<br>key ข → ง |
| 164 | police-thai-set-01-q40 | key moved ข→ก to balance answer positions (choice texts unchanged) | ก: เจดีย์ – หลัง นาฬิกา – เครื่อง กรรไ… → เจดีย์ – องค์ นาฬิกา – เรือน กรรไกร…<br>ข: เจดีย์ – องค์ นาฬิกา – เรือน กรรไกร… → เจดีย์ – หลัง นาฬิกา – เครื่อง กรรไ…<br>key ข → ก |
| 165 | police-thai-set-02-q24 | key moved ง→ก to balance answer positions (choice texts unchanged) | ก: จัดเจน → เชี่ยวชาญ<br>ง: เชี่ยวชาญ → จัดเจน<br>key ง → ก |
| 166 | police-thai-set-02-q31 | key moved ง→ค to balance answer positions (choice texts unchanged) | ค: 5 คำ → 4 คำ<br>ง: 4 คำ → 5 คำ<br>key ง → ค |
| 167 | police-thai-set-02-q32 | key moved ง→ก to balance answer positions (choice texts unchanged) | ก: ทุกฝ่ายควรเคารพกฎเกณฑ์และข้อตกลงร่ว… → คณะทำงานพิจารณารายละเอียดอย่างถี่ถ้…<br>ง: คณะทำงานพิจารณารายละเอียดอย่างถี่ถ้… → ทุกฝ่ายควรเคารพกฎเกณฑ์และข้อตกลงร่ว…<br>key ง → ก |
| 168 | police-thai-set-02-q33 | key moved ง→ก to balance answer positions (choice texts unchanged) | ก: การจลาจลทำให้การจราจรและชีวิตประจำว… → เขาเป็นคนปากโป้ง จึงโต้เถียงเก่งและ…<br>ง: เขาเป็นคนปากโป้ง จึงโต้เถียงเก่งและ… → การจลาจลทำให้การจราจรและชีวิตประจำว…<br>key ง → ก |
| 169 | police-thai-set-02-q39 | key moved ง→ก to balance answer positions (choice texts unchanged) | ก: คุ้นเคย → เชี่ยวชาญ<br>ง: เชี่ยวชาญ → คุ้นเคย<br>key ง → ก |
| 170 | police-thai-set-02-q44 | key moved ง→ค to balance answer positions (choice texts unchanged) | ค: ดังนั้นประชาชนจึงควรทิ้งขยะให้ถูกที… → ปัญหานี้ยังเพิ่มภาระในการทำความสะอา…<br>ง: ปัญหานี้ยังเพิ่มภาระในการทำความสะอา… → ดังนั้นประชาชนจึงควรทิ้งขยะให้ถูกที…<br>key ง → ค |
| 171 | police-thai-set-02-q49 | key moved ง→ก to balance answer positions (choice texts unchanged) | ก: ครูแจ้งกำหนดการสอบให้นักเรียนทุกคนท… → ครูพูดกับนักเรียนเรื่องการสอบที่ห้อ…<br>ง: ครูพูดกับนักเรียนเรื่องการสอบที่ห้อ… → ครูแจ้งกำหนดการสอบให้นักเรียนทุกคนท…<br>key ง → ก |
| 172 | police-thai-set-03-q12 | key moved ง→ข to balance answer positions (choice texts unchanged) | ข: การสูญเสียแหล่งอาหารเป็นหนึ่งในปัจจ… → จำนวนผึ้งลดลงมีสาเหตุจากสารกำจัดศัต…<br>ง: จำนวนผึ้งลดลงมีสาเหตุจากสารกำจัดศัต… → การสูญเสียแหล่งอาหารเป็นหนึ่งในปัจจ…<br>key ง → ข |
| 173 | police-thai-set-03-q14 | key moved ง→ข to balance answer positions (choice texts unchanged) | ข: อาคารใหม่บางประเภทต้องคำนึงถึงบริบท… → เมืองนี้ปฏิเสธเทคโนโลยีสมัยใหม่และไ…<br>ง: เมืองนี้ปฏิเสธเทคโนโลยีสมัยใหม่และไ… → อาคารใหม่บางประเภทต้องคำนึงถึงบริบท…<br>key ง → ข |
| 174 | police-thai-set-03-q39 | key moved ง→ค to balance answer positions (choice texts unchanged) | ค: พิถีพิถัน ปรากฏการณ์ → สังเกตุ ปราถนา<br>ง: สังเกตุ ปราถนา → พิถีพิถัน ปรากฏการณ์<br>key ง → ค |
| 175 | police-thai-set-03-q40 | key moved ง→ข to balance answer positions (choice texts unchanged) | ข: ผู้บริหารรับผลประโยชน์จากสองฝ่ายจึง… → เขาทำงานหนักด้วยตนเองทุกขั้นตอนจนสำ…<br>ง: เขาทำงานหนักด้วยตนเองทุกขั้นตอนจนสำ… → ผู้บริหารรับผลประโยชน์จากสองฝ่ายจึง…<br>key ง → ข |
| 176 | police-mini_mock-set-04-q02 | same fix as source police-thai-set-01-q06 | ข: การถ่ายวิดีโอทำให้ยอดขายเพิ่มขึ้นทั… → การถ่ายวิดีโอสาธิตวิธีสานทำให้ยอดขา…<br>ง: ชุมชนปรับวิธีจำหน่ายจากงานประจำปีไป… → ชุมชนปรับช่องทางขายจากงานประจำปีสู่… |
| 177 | police-mini_mock-set-04-q09 | same fix as source police-thai-set-01-q33 | ข: เขาไม่เตรียมงานล่วงหน้า พอถึงวันจริ… → เขาไม่เตรียมงานล่วงหน้า พอถึงวันจริ…<br>ค: เขาขยันอ่านหนังสือทุกวันจึงเรียกว่า… → เขาขยันอ่านหนังสือทุกวันอย่างสม่ำเส… |
| 178 | police-mini_mock-set-06-q12 | same fix as source police-mock_test-set-05-q083 | tip rewritten |
| 179 | police-mini_mock-set-06-q15 | same fix as source police-mock_test-set-05-q093 | prompt: ในทะเบียนหนังสือรับ ชื่อหน่วยงานที่รับหนังสือที่ช่องใดต… → เมื่อจัดแยกหนังสือที่ลงทะเบียนรับแล้วส่งให้หน่วยงานที่เ… |
| 180 | police-mini_mock-set-12-q11 | same fix as source police-mock_test-set-05-q082 | prompt: ในแบบ “ระเบียบ” ส่วนล่างสุดของข้อความตามระเบียบงานสารบร… → ในแบบ “ระเบียบ” ตามระเบียบงานสารบรรณ ข้อสุดท้ายของข้อคว… |
| 181 | police-mini_mock-set-13-q03 | same fix as source police-mock_test-set-04-q116 | tip rewritten |
| 182 | police-mini_mock-set-14-q04 | same fix as source police-mock_test-set-04-q140 | prompt: The city has agreed to __________ construction of the n… → The city has agreed to __________ construction of the n… |
| 183 | police-mock_test-set-02-q087 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใดไม่ใช่หนังสือประชาสัมพันธ์ → ข้อใด“ไม่ใช่”หนังสือประชาสัมพันธ์ |
| 184 | police-mock_test-set-03-q031 | negative stem: quoted “ไม่ถูกต้อง” | prompt: ข้อใดใช้คำไม่ถูกต้องตามความหมาย → ข้อใดใช้คำ“ไม่ถูกต้อง”ตามความหมาย |
| 185 | police-mock_test-set-03-q033 | negative stem: quoted “ไม่ถูกต้อง” | prompt: ข้อใดใช้สำนวนไม่ถูกต้อง → ข้อใดใช้สำนวน“ไม่ถูกต้อง” |
| 186 | police-mock_test-set-03-q037 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใดมีคำที่ไม่ใช่คำประสมปนอยู่ → ข้อใดมีคำที่“ไม่ใช่”คำประสมปนอยู่ |
| 187 | police-mock_test-set-03-q040 | negative stem: quoted “ผิด” | prompt: ข้อใดสะกดผิดทุกคำ → ข้อใดสะกด“ผิด”ทุกคำ |
| 188 | police-mock_test-set-03-q112 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใดไม่ใช่เรื่องของกฎหมายเอกชนโดยตรง → ข้อใด“ไม่ใช่”เรื่องของกฎหมายเอกชนโดยตรง |
| 189 | police-mock_test-set-03-q130 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใดไม่ใช่เหตุยกเว้นโทษ แต่เป็นเพียงเหตุที่อาจทำให้ศาล… → ข้อใด“ไม่ใช่”เหตุยกเว้นโทษ แต่เป็นเพียงเหตุที่อาจทำให้ศ… |
| 190 | police-mock_test-set-03-q133 | negative stem: quoted “ไม่ถูกต้อง” | prompt: ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับการเผาทรัพย์ที่ผู้กระทำเป็… → ข้อใดกล่าว“ไม่ถูกต้อง”เกี่ยวกับการเผาทรัพย์ที่ผู้กระทำเ… |
| 191 | police-mock_test-set-04-q034 | negative stem: quoted “ผิด” | prompt: ข้อใดจับคู่คำสามัญกับคำสุภาพผิด → ข้อใดจับคู่คำสามัญกับคำสุภาพ“ผิด” |
| 192 | police-mock_test-set-04-q133 | negative stem: quoted “ไม่เป็น” | prompt: ข้อใดไม่เป็นเหตุฉกรรจ์เพียงเพราะข้อเท็จจริงที่ระบุ → ข้อใด“ไม่เป็น”เหตุฉกรรจ์เพียงเพราะข้อเท็จจริงที่ระบุ |
| 193 | police-mock_test-set-06-q021 | negative stem: quoted “ผิด” | prompt: คำในข้อใดเขียนผิด → คำในข้อใดเขียน“ผิด” |
| 194 | police-mock_test-set-06-q032 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใดไม่ใช่ประโยชน์ของกล้องติดตัวตามข้อความ → ข้อใด“ไม่ใช่”ประโยชน์ของกล้องติดตัวตามข้อความ |
| 195 | police-mock_test-set-06-q039 | negative stem: quoted “ไม่ถูกต้อง” | prompt: ข้อใดจับคู่ภาษาปากกับภาษาทางการไม่ถูกต้อง → ข้อใดจับคู่ภาษาปากกับภาษาทางการ“ไม่ถูกต้อง” |
| 196 | police-mock_test-set-06-q084 | negative stem: quoted “ไม่สามารถ” | prompt: กรณีใดต่อไปนี้ ไม่สามารถใช้หนังสือประทับตราแทนการลงชื่อ… → กรณีใดต่อไปนี้ “ไม่สามารถ”ใช้หนังสือประทับตราแทนการลงชื… |
| 197 | police-mock_test-set-06-q115 | negative stem: quoted “ไม่ใช่” | prompt: ข้อใด ไม่ใช่ สิทธิของผู้ต้องหาในชั้นสอบสวน → ข้อใด “ไม่ใช่” สิทธิของผู้ต้องหาในชั้นสอบสวน |

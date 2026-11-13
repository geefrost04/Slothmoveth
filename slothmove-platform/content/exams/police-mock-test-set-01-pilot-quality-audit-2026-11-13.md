# Pilot quality audit: police-mock_test-set-01 (13 พ.ย. 2569)

Read-only pilot. No question file, database row or deploy was changed.

**Set chosen:** `police-mock_test-set-01` (150 ข้อ: คณิต 20, ไทย 20, คอม 40, สารบรรณ 30, กฎหมาย 25, อังกฤษ 15).
It has all 15 police mock attempts in the database (sets 02–06 have none), so it is the set real users see. It was audited three times before, so the pilot also shows whether this method finds things those audits missed.

## Summary

| | |
|---|---|
| Wrong answer key | **0** |
| Ambiguous / needs rewrite | **3** (Q31, Q40, Q100) |
| Minor wording | **3** (Q87, Q98, Q127) |
| "ต้นฉบับ" wording left in candidate-facing text | 5 prompts, 17 explanations |
| Negative stem without emphasis | 10 |
| Live DB vs `police-mock-test-set-01.json` | 150/150 match (prompt, choices, key) |
| Time taken | about 7 minutes of machine time (script about 1 min, two blind solvers in parallel about 2 min each, review with regulation PDFs about 3 min), plus writing this report |

## Findings, most severe first

### 1. Ambiguous: more than one defensible answer

**Q31 (thai): ข้อใดอ่านออกเสียงไม่ถูกต้อง** · key ก (มกราคม = มา-กะ-รา-คม)
- Problem: ค "อิสรภาพ = อิด-สะ-ระ-พาบ" and ง "จักรยาน = จัก-กะ-ยาน" are also not the dictionary readings (ราชบัณฑิตยสภา: อิด-สะ-หฺระ-พาบ, จัก-กฺระ-ยาน). A careful candidate can pick three choices.
- Evidence: both blind solvers raised it independently.
- Fix: change ค to "อิด-สะ-หฺระ-พาบ" and ง to "จัก-กฺระ-ยาน" so only ก is wrong.

**Q40 (thai): เลขทะเบียนรถ "กท 416 เชียงใหม่" ควรอ่านอย่างไรตามรูปแบบเดียวกับต้นฉบับ** · key ค (digit by digit)
- Problem: the stem depends on an unseen "ต้นฉบับ" convention. Reading the number as a whole (สี่ร้อยสิบหก) and digit by digit are both used in practice, so ข and ค are both defensible.
- Evidence: solver B picked ก, solver A answered ค with low confidence. Both said the convention is unclear.
- Fix: state the rule in the stem, e.g. "หากอ่านตัวเลขทีละหลักและระบุจังหวัด ควรอ่านอย่างไร", or drop the question.

**Q100 (saraban): คำขึ้นต้นและคำลงท้ายของ พล.ต.อ. กิตติ์รัฐ พันธุ์เพ็ชร์ ตามตัวอย่างข้อสอบต้นฉบับ** · key ก (เรียน / ขอแสดงความนับถือ)
- Problem: the answer depends on the person's position, which the stem does not give. It also names a real officer whose position changes over time, and it refers to an unseen "original exam".
- Evidence: both solvers flagged it.
- Fix: use a position, not a name, e.g. "ผู้บัญชาการตำรวจแห่งชาติ". The key stays ก, because ผบ.ตร. is not on the กราบเรียน list in ภาคผนวก 2.

### 2. Minor wording (key is correct)

- **Q87 (saraban):** "ส่วนที่สองของข้อความระเบียบ" is vague. The regulation says ข้อ 1 = ชื่อระเบียบ and ข้อ 2 = วันใช้บังคับ (ระเบียบงานสารบรรณ 2526 ข้อ 17.6). Fix: "ข้อ 2 ของระเบียบกำหนดเรื่องใด".
- **Q98 (saraban):** the stem says "ตามรูปแบบตัวอย่าง", but no example is shown. ข is the best answer, but the regulation (ข้อ 11.6) does not mention ชั้นความเร็ว in อ้างถึง. Fix: drop "ตามรูปแบบตัวอย่าง". The explanation also says "ตัวเลือก 2" instead of ข.
- **Q127 (law):** "ข้อใดไม่ใช่ทายาทโดยธรรมของผู้ตายเพราะอาศัยฐานะ ผู้รับบุตรบุญธรรม เพียงอย่างเดียว" reads as a double negative. Fix: "บุตรบุญธรรมถึงแก่ความตาย บุคคลใดไม่มีสิทธิรับมรดกในฐานะทายาทโดยธรรม" (ป.พ.พ. ม.1598/29).

### 3. Style: wording from the source material left in

These read oddly to a candidate ("ตามต้นฉบับ", "ตามเฉลยต้นฉบับชุดที่ 1", "รักษาวิธีสร้างตัวลวงของต้นฉบับ").
- **Prompts:** Q40, Q100, Q109, Q128 ("ตามตัวอย่างในต้นฉบับ"). Q46 is fine, because "ชุดคำสั่งต้นฉบับ" means source code.
- **Explanations/tips:** Q27, 40, 81, 83, 84, 85, 88, 91, 92, 94, 98, 101, 102, 104, 105, 109, 110.
- Fix: delete the phrase. Explanations should cite the rule (e.g. "ระเบียบงานสารบรรณ ข้อ 73") instead.

### 4. Style: negative stems not emphasised

Q31, 32, 34, 85, 99, 105, 109, 127, 129, 133. Example: "ข้อใดอ่านออกเสียง**ไม่**ถูกต้อง". Bold or underline ไม่ / ผิด so candidates don't miss it.

### 5. Set-level observations

- **Answer positions:** ก 30 · ข 44 · ค 42 · ง 34. This is acceptable overall, but uneven within subjects: คณิต puts 17 of 20 keys on ข/ค, กฎหมาย has only 1 key on ข, and อังกฤษ has only 1 key on ง.
- **"Correct is the longest choice":** 29 of 64 questions where one choice is clearly longest (45%; chance would be 25%). This is a mild cue a test-wise candidate can use. Worth checking when choices are rewritten.
- **"ถูกทุกข้อ":** it is the key in Q104 (acceptable, since the regulation lists the three methods) and a distractor in Q93.
- **Overlap with practice sets:** 126/150 questions are near-identical to questions in the free practice sets (police-*-set-01-notebooklm, computer supplement, saraban quick sets). There are no key conflicts between them. Users who did the practice sets will recognise most of this mock.

## Blind-solve results (round 2)

Two independent agents answered all 150 without the key.
- **Agreement with the key:** solver A 147/150, solver B 147/150. They disagreed with the key on 5 questions in total, and on 2 together.
- **Questions flagged (a disagreement or an issue note):** 11.

| Q | Key | A | B | Verdict |
|---|---|---|---|---|
| 40 | ค | ค (low) | ก | **Real problem:** ambiguous (above) |
| 105 | ง | ก | ง | False positive: ข้อ 55.1 says the stamp goes at the bottom right of the first sheet, and ข้อ 73 says ≥ 24 พอยท์, so only ง is wrong |
| 108 | ค | ง | ง | False positive: ฉบับที่ 4 (2564) ข้อ 89/4 says backup/archive PDF needs ≥ **150 dpi**. 300 dpi is for sending by e-mail (ภาคผนวก 7 ข้อ 4.3) |
| 110 | ข | ค | ค | False positive: ภาคผนวก 7 example is `2564_OPM0913_56.pdf` (underscores, no padding) |
| 31 | ก | ก | ก | **Real problem:** both noted several wrong readings |
| 100 | ก | ก | ก | **Real problem:** position not stated |
| 87, 98, 127 | ✓ | ✓ | ✓ | Real but minor wording |
| 55, 104 | ✓ | ✓ | ✓ | No change needed |

**Precision:** of the 11 flags, 6 are real (3 that need a rewrite, 3 minor). The other 5 are AI false positives: 3 recalled regulation numbers wrongly, and 2 needed no change. Every disagreement on a saraban detail turned out to be the solver's memory, not the key. A human or a source check is needed before changing any key.

**Round 1 script precision:** the arithmetic check gave 6 flags, all false positives (fraction notation and chained "=" in correct working). All 20 math explanations were confirmed correct by hand. The wording checks caught real items (the ต้นฉบับ leaks and Q100), which the blind solvers mostly missed.

## Sources

- ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526, ข้อ 11.6, 17.6, 55.1, 73: [arch.chula.ac.th PDF](https://www.arch.chula.ac.th/arch-cu/files/formcontentepost/ระเบียบงานสารบรรณ%20ฉบับที่%201%20พ.ศ.%202526.pdf)
- ระเบียบฯ (ฉบับที่ 4) พ.ศ. 2564, ข้อ 89/4 and ภาคผนวก 7: [arch.chula.ac.th PDF](https://www.arch.chula.ac.th/arch-cu/files/formcontentepost/ระเบียบงานสารบรรณ%20ฉบับที่%204%20พ.ศ.%202564.pdf)
- Dictionary readings: พจนานุกรมฉบับราชบัณฑิตยสถาน พ.ศ. 2554 (อิสรภาพ, จักรยาน)

## Recommendation on scaling

The method is cheap (minutes per 150-question set) and found 3 questions worth rewriting plus a lot of leftover source wording that three earlier audits missed. It found no wrong keys in this set.

To scale it:
1. Fix the arithmetic regex, or drop that check.
2. Keep the two blind solvers.
3. Always check solver disagreements on regulation numbers against the PDF before acting.
4. Run the "ต้นฉบับ" wording check on every police file first. It is fast and has no false positives so far.

Script: `scripts/audit-pilot-quality.mjs <file> [--db] [--blind=out.json]`.

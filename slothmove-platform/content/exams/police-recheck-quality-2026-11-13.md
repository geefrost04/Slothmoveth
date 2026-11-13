# Police bank recheck fixes, round 3 (13 Nov 2026)

Patch: `content/exams/police-recheck-fixes-2026-11-13.json`, with **761 questions** changed. Field counts: tip 583, explanation 311, choices 67, prompt 6. **No key changes**: every key keeps its position and its text, except one specific item (thai-03 q26) whose key sentence text was rewritten at the same position.

Dry run (`node scripts/police/apply-subject-audit-fixes.mjs content/exams/police-recheck-fixes-2026-11-13.json`): "761 questions … key changes: none; dry-run: DB matches every "before" value". Nothing was imported or committed.

The content files are updated to match: 29 files in `content/exams`. A script confirmed that every file row equals the simulated post-patch database. 55 patched questions exist only in the database (mini drills 03–14 and law sets 04–08 rows). The stale `police-mini_mock-set-02.json` position 3 was re-synced from Mock 4 q011, which was a file-only drift.

## How it was done

- The 755 flagged ids were grouped into 502 work units: identical copies (same prompt, choices, key text, explanation and tip) were merged so each was rewritten once. The units were then split into 9 batches by subject.
- Fixes were copied to every identical copy, with choice text mapped by text for reshuffled copies (154 rows).
- Tip and explanation fixes were also copied to twins with the same prompt, the same old text and the same choice set (11 rows). Choice-text fixes were copied by choice set alone, because choices do not depend on the stem; there were 3 cross-prompt copies, all of the saraban-03 q06 “ชื่อระเบียบ” fix to the same question worded differently.
- Where two agents rewrote the same old tip or explanation of the same question (same prompt) differently, one version was kept for the twin group, preferring the subject-set version (20 rows).
- After the patch: 0 twin pairs differ (ignoring ก–ง letters, which depend on each copy's choice order), and 0 "ข้อ ก: “…”" labels point at the wrong choice. No "ข้อ A–D" labels are left anywhere in the bank, and no boilerplate or template tips remain in the listed items.
- The A–D → ก–ง mapping was done by a script that matches each "ข้อ X: “quoted choice”" to the real choice text in that question (all 105 mapped; no ambiguity left).

## Counts per category

| Category | Listed | Changed | Not changed |
|---|---|---|---|
| tip_may_teach_wrong_option | 135 | 128 | 7 (see below) |
| thin_tip_restates_answer | 437 | 437 | 0 |
| boilerplate_explanation | 149 | 149 | 0 |
| generic_template_tip | 84 | 84 | 0 |
| english_ABCD_labels | 105 | 105 | 0 |
| specific | 28 | 28 (2 "unsure" notes verified: quick-07 q01 was wrong and is fixed; Mock 6 q098 was correct, so only the source was added) | 0 |
| Giveaway distractors replaced | — | 48 questions (+19 copies/twins) | — |

The 7 unchanged tip_may_teach_wrong_option items are:
- computer-01 q20, computer-02 q20 and computer-02 q24 are false positives: the stems contain "ไม่ต้อง" or "ไม่ได้ตั้งใจ" but are not negative questions, and the tips teach the right thing. Mock 1 q060, Mock 4 q060 and Mock 4 q064 are their copies.
- law-extra q04 has a positive stem, and its tip states the true ม.456 rule.

## Tips confirmed to teach the false option (15)

Each was rewritten to state the true rule and name the trap.

| Question | Old tip | New tip |
|---|---|---|
| law-01-q47 | จุดจำ: สิทธิได้รับการยกเว้นค่าธรรมเนียมศาลทุกคดีโดยอัตโนมัติ | จุดจำ: สิทธิผู้บริโภค 5 = ได้ข่าวสาร / เลือกซื้ออิสระ / ปลอดภัย / เป็นธรรมในสัญญา / ได้รับการชดเชย — ไม่มีเรื่องยกเว้นค่าธรรมเนียมศาล |
| law-02-q03 | จุดจำ: เป็นระบบที่ไม่มีกฎหมายลายลักษณ์อักษรเลยแม้แต่ฉบับเดียว | จุดจำ: Common Law เน้นคำพิพากษา (precedent) แต่ก็มีกฎหมายลายลักษณ์อักษร — ข้อที่บอก “ไม่มีเลยแม้แต่ฉบับเดียว” จึงผิด |
| law-02-q11 | จุดจำ: มี 3 ชั้น คือ ชั้นต้น อุทธรณ์ และสูงสุด | จุดจำ: ศาลปกครองมี 2 ชั้น (ชั้นต้น / สูงสุด) ไม่มีชั้นอุทธรณ์ — ข้อที่บอก 3 ชั้นจึงผิด |
| law-02-q18 | จุดจำ: ผู้เยาว์สามารถค้ำประกันหนี้ของผู้อื่นได้เองทุกกรณีโดยไม่ต้องมีความยินยอม | จุดจำ: ผู้เยาว์ทำเองได้เฉพาะนิติกรรมที่ได้สิทธิ/หลุดพ้นหน้าที่ล้วน ๆ เฉพาะตัว หรือสมแก่ฐานานุรูป — ค้ำประกันก่อภาระหนี้ ต้องได้รับความยินยอม |
| law-02-q26 | จุดจำ: ลูกหนี้ต้องเป็นคู่สัญญาในสัญญาค้ำประกันเสมอ มิฉะนั้นสัญญาไม่เกิด | จุดจำ: ค้ำประกัน = สัญญาระหว่าง “ผู้ค้ำ กับ เจ้าหนี้” (ม.680) ลูกหนี้ไม่ต้องเป็นคู่สัญญา — ข้อที่บอกลูกหนี้ต้องร่วมเสมอจึงผิด |
| law-03-q21 | จุดจำ: นิติกรรมทุกชนิดที่คนไร้ความสามารถทำเองเป็นโมฆะเสมอ | จุดจำ: คนไร้ความสามารถทำนิติกรรมเอง = โมฆียะ (ม.29) ไม่ใช่โมฆะ — ข้อที่บอก “โมฆะเสมอ” จึงผิด |
| law-03-q33 (+mock3-q127) | จุดจำ: เมื่ออายุถึง 18 ปีแล้ว ไม่ต้องขอความยินยอมจากผู้มีอำนาจตามมาตรา 1436 ไม่ว่ากรณีใด | จุดจำ: หมั้นได้เมื่ออายุ 18 แต่ยังเป็นผู้เยาว์จนถึง 20 จึงยังต้องขอความยินยอมตาม ม.1436 — ข้อที่บอกว่า 18 ปีไม่ต้องขอความยินยอมจึงผิด |
| law-03-q48 | จุดจำ: เมื่อจดทะเบียนแล้วคุ้มครอง 20 ปีโดยไม่ต้องต่ออายุ | จุดจำ: เครื่องหมายการค้าคุ้มครองคราวละ 10 ปี และต่ออายุได้คราวละ 10 ปี — ข้อที่บอก “20 ปีโดยไม่ต้องต่ออายุ” จึงผิด |
| mock4-q107 | จุดจำ: saraban_thailand@outlook.com | จุดจำ: อีเมลกลางราชการ = saraban ตามด้วยโดเมนของส่วนราชการ (.go.th) — โดเมนสาธารณะอย่าง outlook.com จึงไม่ใช่อีเมลราชการ |
| saraban-01-q35 | จุดจำ: 1 ก.ค. 2567 | จุดจำ: วันที่ในหนังสือภายนอกต้องใช้ชื่อเดือนเต็ม เช่น “1 กรกฎาคม 2567” (ข้อ 11.3) — เดือนย่ออย่าง “ก.ค.” จึงผิดแบบ |
| saraban-02-q03 | จุดจำ: หนังสือประทับเรื่อง | จุดจำ: ชื่อจริงคือ หนังสือประทับ“ตรา” (ข้อ 13) คู่กับหนังสือภายนอก ภายใน สั่งการ — “หนังสือประทับเรื่อง” เป็นคำที่แต่งขึ้น |
| saraban-02-q07 | จุดจำ: การแต่งตั้งข้าราชการระดับสูง | จุดจำ: หนังสือประทับตราใช้กับเรื่องไม่สำคัญ เช่น ขอรายละเอียดเพิ่ม ส่งสำเนา เตือนเรื่องค้าง แจ้งผลงาน (ข้อ 13) — เรื่องสำคัญอย่างการแต่งตั้งจึงไม่ใช่ |
| saraban-02-q25 | จุดจำ: ให้ไว้ ณ วันที่ 15 สิงหาคม พ.ศ. 2567 | จุดจำ: หนังสือภายในลงแค่ “วันที่ + วัน เดือนเต็ม ปี” — “ให้ไว้ ณ วันที่” เป็นของหนังสือรับรอง (ข้อ 24.4) จึงไม่ใช่แบบของหนังสือภายใน |
| saraban-02-q48 | จุดจำ: saraban_thailand@outlook.com | จุดจำ: อีเมลกลางราชการ = saraban ตามด้วยโดเมนของส่วนราชการ (.go.th) — โดเมนสาธารณะอย่าง outlook.com หรือ hotmail.com ใช้ไม่ได้ |
| saraban-03-q08 | จุดจำ: ผู้ไม่เข้าร่วมประชุม | จุดจำ: แบบรายงานการประชุมมีแค่ “ผู้มาประชุม” “ผู้ไม่มาประชุม” “ผู้เข้าร่วมประชุม” (ข้อ 25.5–25.7) — ไม่มีหัวข้อ “ผู้ไม่เข้าร่วมประชุม” |

Most of the other 113 negative-stem tips only restated the keyed (false) statement without presenting it as the rule. They were rewritten as contrast rules anyway, so none of them now repeats the false statement as a "จุดจำ".

## Specific items (28)

| Question | Issue | Resolution |
|---|---|---|
| law-02-q11 | tip teaches the false option (ศาลปกครอง 3 ชั้น); it has 2 tiers | Tip taught the false option (3 ชั้น). ศาลปกครองมี 2 ชั้น. [fields: tip] |
| law-03-q33 | tip teaches the false statement (18 ปี ไม่ต้องขอความยินยอม); per ม.1435 (2567) + ม.1436 consent still needed until 20 | Tip repeated the false key statement as if it were the rule. Age 18 is the minimum for หมั้น (ม.1435, 2567) but the person is still a minor until 20, so ม.1436 consent applies. [fields: explanation, tip] |
| thai-03-q26 | keyed 'not ambiguous' sentence stacks modifiers (เมื่อเช้านี้ may attach to นัด); shorten to one clear modifier | Keyed sentence stacked modifiers ('เมื่อเช้านี้' could attach to 'นัด'). Rewrote key sentence so time is fronted and the place is the object of ไป; explanation now names each distractor's ambiguity. [fields: choices, explanation, tip] |
| computer-02-q19 | Spelling&Grammar 'Change All' also defensible; make stem a name replacement or swap distractor | Spelling & Grammar 'Change All' could also fix a repeated misspelling, so two answers were defensible. Rewrote the stem as a name replacement (nothing misspelled), so only Find and Replace fits. [fields: prompt, explanation, tip] |
| mock4-q018 | broken Thai stem 'นกและยีราฟมีจำนวนขารวมกัน' without a total; rewrite | Broken stem ('มีจำนวนขารวมกัน' without a total). Rewrote; numbers and key (72) unchanged. [fields: prompt] |
| mock6-q101 | explanation conflates หลักฐานการยืม and บัตรยืมหนังสือ (ข้อ 62.2) | Explanation conflated หลักฐานการยืม with บัตรยืมหนังสือ. Per ข้อ 62.2 the borrower hands in หลักฐานการยืม (filed by date for follow-up) and signs the บัตรยืม, which is kept in place of the document. [fields: explanation, tip] |
| computer-03-q19 | Ctrl+A selects whole document, not 'current page' | Explanation wrongly said Ctrl+A selects the 'current page'; it selects the whole document. [fields: explanation] |
| computer-03-q30 | stem gives answer ('สองชั้น'), made-up distractor terms, wrong category | Stem gave the answer ('สองชั้น'/'อีกชั้นหนึ่ง') and distractors were made-up terms. Rewrote stem neutrally and replaced distractors with real security terms. Key text/position kept. Category 'social media/viral content' is wrong (should be computer security) — category not changed here, flag for main session. [fields: prompt, choices, explanation, tip] |
| mock4-q140 | translation drops 'so work will begin next month' (twin of mini-14 q04, already fixed there); prevent listed as forbid synonym | Translation dropped 'so work will begin next month' and 'prevent' was listed as a synonym of forbid. Rewrote; labels switched to ก/ข/ค/ง. [fields: explanation] |
| mock4-q142 | explanation quotes an old prompt | Explanation quoted the old prompt ('What does this sign mean?'). Updated to the current prompt; sign description matches traffic-no-u-turn.svg (white disc, red ring, black U-turn arrow, red diagonal bar). Labels switched to ก/ข/ค/ง. [fields: explanation] |
| mock5-q142 | image caption 'NO PARKING' removed by main session; explanation must describe the sign (blue disc, red ring, one diagonal bar) instead of 'ป้ายในภาพระบุว่า NO PARKING' | Image caption 'NO PARKING' was removed; explanation now describes the sign as drawn (blue disc, red ring, one diagonal bar) and contrasts it with ห้ามหยุดรถ (cross). [fields: explanation, tip] |
| mini08-q15 | same image as mock5 q142; same explanation fix | Image caption 'NO PARKING' was removed; explanation now describes the sign as drawn (blue disc, red ring, one diagonal bar) and contrasts it with ห้ามหยุดรถ (cross). [fields: explanation, tip] |
| mock5-q041 | flowchart image title removed and 'ตรวจเอกสาร' redrawn as a process rectangle; check explanation still matches | Checked redrawn image: 'ตรวจเอกสาร' is now a process rectangle, title removed. Explanation was still correct; added the shape contrast using the figure's own boxes. [fields: explanation] |
| mini05-q11 | same image as mock5 q041 | Checked redrawn image: 'ตรวจเอกสาร' is now a process rectangle, title removed. Explanation was still correct; added the shape contrast using the figure's own boxes. [fields: explanation] |
| mock5-q042 | star topology image label 'สวิตช์กลาง' removed; check explanation still matches | Label 'สวิตช์กลาง' removed from image; explanation now identifies the switch by its drawing (central box with ports) and the nodes shown. [fields: explanation] |
| mini11-q11 | same image as mock5 q042 | Label 'สวิตช์กลาง' removed from image; explanation now identifies the switch by its drawing (central box with ports) and the nodes shown. [fields: explanation] |
| math-category-aptitude-logic-q14 | figure no longer shows the 135° sweep end; check explanation | Figure now shows only the start (arrow pointing N) and a short counter-clockwise arc, no 135° end. Explanation rewritten to start from the figure; tip was garbled. [fields: explanation, tip] |
| math-category-aptitude-logic-q16 | figure redrawn (square pyramid + vertical cutting plane, no section drawn); check explanation | Figure redrawn: square pyramid with a vertical cutting plane through the apex, no section drawn. Explanation reworded to refer to that and to drop garbled phrasing. [fields: explanation, tip] |
| english-03-q29 | '-ly ใช้ more ... เสมอ' overstated (early→earlier) | 'Adverb -ly ใช้ more เสมอ' overstated; restricted to adverbs formed Adj+ly and added the -er exceptions (fast, hard, early). Labels switched to ก/ข/ค/ง. [fields: explanation] |
| english-01-q29 | 'คำสั้น 1-2 พยางค์ + er' too broad | Rule 'คำสั้น 1-2 พยางค์ + er' was too broad (most 2-syllable adjectives take more, e.g. more careful). Rewrote the rule; labels switched to ก/ข/ค/ง since the explanation was rewritten. [fields: explanation] |
| saraban-01-q13 | leaked editorial note in explanation | Removed leaked editorial sentence ('ข้อนี้เป็นการวนถาม...'). Tip only named the key; not stated as a rule but ambiguous, replaced with true grouping. [fields: explanation, tip] |
| mock5-q126 | tort elements omit fault/unlawfulness (ม.420); absurd distractor | Explanation/tip omitted fault and unlawfulness (ป.พ.พ. ม.420: จงใจหรือประมาทเลินเล่อ ทำต่อผู้อื่นโดยผิดกฎหมายให้เสียหาย). Replaced absurd distractor 'ผู้เสียหายชอบผู้กระทำหรือไม่'. Key text kept. [fields: choices, explanation, tip] |
| law-01-q24 | meta stem 'ถ้าโจทย์ถามว่า... ควรเลือกข้อใด' | Meta stem ('ถ้าโจทย์ถามว่า... ควรเลือกข้อใด') rewritten as a direct question. Tip only restated the answer. [fields: prompt, tip] |
| saraban-03-q06 | choice 'ชื่อข้อบังคับ' wrong document type -> 'ชื่อระเบียบ'; verify clause | Distractor 'ชื่อข้อบังคับ' named the wrong document type; changed to 'ชื่อระเบียบ' (ข้อ 1 of the ระเบียบ form). Verified ข้อ 17.6: ข้อ 1 ชื่อระเบียบ, ข้อ 2 วันใช้บังคับ, ข้อสุดท้าย ผู้รักษาการ; ข้อ 17.7 ประกาศ ณ วันที่ comes after the clauses. [fields: choices, explanation, tip] |
| math-category-stats-prob-q14 | choices say คะแนน but stem doesn't | Choices carried the unit 'คะแนน' that the stem never uses; removed. [fields: choices] |
| math-category-foundations-q36 | tip phrase 'มีน้ำหนักสอดคล้องที่สุด' unnatural | Tip ended with unnatural 'มีน้ำหนักสอดคล้องที่สุด'; rewritten as a check shortcut with the distractor contrast. [fields: tip] |
| saraban-quick-07-q01 | explanation mixes roles in photo certification (unsure) — verify against regulation | Verified ข้อ 24.7 (reg 2526): ประทับตราชื่อส่วนราชการที่ออกหนังสือบนขอบล่างด้านขวาของรูปถ่าย คาบต่อลงบนกระดาษ, and the certified person signs under the photo. Old explanation wrongly had the signer stamping on the bottom edge. [fields: explanation, tip] |
| mock6-q098 | email subject format cited 'ตามแนวทาง' with no source (unsure) — verify or reword | Verified: ระเบียบฯ ฉบับที่ 4 (2564) ภาคผนวก ๗ ข้อ 5.3.4 — subject = ชื่อเรื่องตามหนังสือ; with ชั้นความเร็ว put it first + ':' (example 'ด่วนที่สุด : ขอเชิญประชุม...'). Key is right; added the source. [fields: explanation, tip] |

## Giveaway distractors replaced (48 questions)

The key text and position are kept in all of them. Each new distractor is a plausible but clearly wrong option from the same topic, and the explanation names the new distractors. Copies and twins got the same new text (67 rows in all).

| Question | Old → new distractors |
|---|---|
| law-02-q47 (+mini13-q10, mock4-q134) | “ประมวลกฎหมายที่ดิน” → “พระราชบัญญัติขายตรงและตลาดแบบตรง พ.ศ. 2545”; “พระราชบัญญัติสัญชาติ” → “พระราชบัญญัติว่าด้วยราคาสินค้าและบริการ พ.ศ. 2542” |
| law-01-q39 (+mock1-q130) | “ฉ้อโกงที่กฎหมายจัดอยู่ในกลุ่มความผิดอันยอมความได้” → “ฉ้อโกงโดยแสดงตนเป็นคนอื่นตามมาตรา 342” |
| law-03-q28 | “ทำลายรถเพื่อให้สัญญาสิ้นสุด” → “จงใจไม่ชำระค่าเช่าซื้อสองงวดติดกันเพื่อให้สัญญาเลิกไปเอง” |
| law-02-q44 | “ฆ่าบุคคลเพราะทะเลาะเรื่องส่วนตัวโดยไม่มีเหตุฉกรรจ์อื่น” → “ฆ่าคู่สมรสของตน”; “ฆ่าคนแปลกหน้าโดยประมาท” → “ฆ่าผู้อื่นในเวลากลางคืน”; “ทำร้ายร่างกายโดยไม่มีเจตนาฆ่า” → “ฆ่าผู้อื่นด้วยบันดาลโทสะเพราะถูกข่มเหงอย่างร้ายแรง” |
| law-01-q15 | “รัฐมีหน้าที่เฉพาะการศึกษาระดับมหาวิทยาลัย” → “รัฐต้องจัดการศึกษาฟรี 12 ปี โดยเริ่มนับตั้งแต่ประถมศึกษาปีที่ 1 จนจบมัธยมศึกษาตอนปลาย” |
| law-01-q30 (+mock1-q126) | “นายทะเบียน” → “ผู้หมั้นและผู้รับหมั้นเป็นเจ้าของร่วมกันจนกว่าจะสมรส” |
| law-01-q44 (+mock1-q132) | “เมื่อใดก็ได้แม้ไม่เกี่ยวกับการกระทำความผิด” → “ช่วยได้ทั้งก่อน ขณะ หรือหลังความผิดสำเร็จ” |
| law-01-q41 (+mini07-q09) | “ไม่มีโทษอาญา” → “ยอมความได้เฉพาะเมื่อกระทำระหว่างญาติ” |
| law-03-q05 (+mock3-q113) | “ทุกหน่วยงานสามารถกำหนดนโยบายขัดกันได้” → “การตัดสินใจรวดเร็วและตรงกับความต้องการของแต่ละท้องถิ่น” |
| law-01-q23 (+mock1-q123) | “หนังสือยินยอมของผู้ใหญ่บ้าน” → “ใบเสร็จชำระภาษีบำรุงท้องที่ (ภ.บ.ท.5)” |
| law-01-q48 | “สิทธิไม่ต้องชำระราคาสินค้าหรือบริการทุกกรณี” → “สิทธิได้รับการรับประกันสินค้าอย่างน้อย 1 ปีสำหรับสินค้าทุกชนิด” |
| law-03-q20 | “ไม่มีผลเฉพาะเมื่อมีทรัพย์สินเกินหนึ่งล้านบาท” → “สมบูรณ์ หากผู้อนุบาลให้ความยินยอมไว้ก่อน” |
| law-02-q48 | “พระราชบัญญัติลิขสิทธิ์ พ.ศ. 2537” → “พระราชบัญญัติคุ้มครองผู้บริโภค พ.ศ. 2522”; “พระราชบัญญัติทะเบียนราษฎร พ.ศ. 2534” → “พระราชบัญญัติว่าด้วยข้อสัญญาที่ไม่เป็นธรรม พ.ศ. 2540”; “พระราชบัญญัติบัตรประจำตัวประชาชน” → “พระราชบัญญัติว่าด้วยความรับผิดต่อความเสียหายที่เกิดขึ้นจากสินค้าที่ไม่ปลอดภัย พ.ศ. 2551” |
| mini13-q17 (+mock5-q123) | “คู่สัญญาต้องเป็นญาติกัน” → “สัญญาจะสมบูรณ์ต่อเมื่อทำเป็นหนังสือทุกกรณี” |
| mini13-q18 (+mock5-q124) | “โอนกรรมสิทธิ์คอนโดให้ผู้ให้เช่า” → “ซ่อมแซมใหญ่ตัวห้องชุดทั้งหมดด้วยค่าใช้จ่ายของตนเอง”; “ขายคอนโดให้บุคคลภายนอก” → “ชำระภาษีที่ดินและสิ่งปลูกสร้างของห้องชุดแทนเจ้าของ” |
| mock5-q125 (+mini07-q17) | “เป็นเพียงสัญญาเช่า” → “รับผิดเฉพาะทางอาญา ไม่ต้องชดใช้ค่าเสียหายทางแพ่ง”; “ต้องรอให้ผู้เสียหายยกทรัพย์ให้ก่อน” → “รับผิดเฉพาะเมื่อผู้เสียหายพิสูจน์ได้ว่าจงใจชน” |
| mock2-q047 | “Browser” → “Interpreter”; “Firewall” → “Linker”; “Spreadsheet” → “Debugger” |
| mock2-q048 | “.mp3” → “.csv”; “.exe” → “.pdf” |
| mock2-q053 | “รหัสผ่านผู้ใช้” → “IP address”; “ชื่อไฟล์” → “ชื่อโดเมน”; “หมายเลขหน้าเอกสาร” → “หมายเลขพอร์ต TCP/UDP” |
| mock2-q060 | “สร้างเอกสาร Word” → “สแกนและลบไวรัสที่ติดอยู่ในไฟล์”; “เพิ่มพื้นที่เก็บข้อมูล” → “กำหนดหมายเลข IP ให้เครื่องในเครือข่ายอัตโนมัติ” |
| mock2-q065 | “ป้องกันไวรัสในไฟล์” → “ตรวจคำสะกดและไวยากรณ์ให้อัตโนมัติ”; “แปลงเอกสารเป็นเสียงเสมอ” → “ติดตามการแก้ไขของผู้ร่วมงาน”; “ลดจำนวนหน้าลงครึ่งหนึ่ง” → “สร้างจดหมายหลายฉบับจากรายชื่อผู้รับ” |
| mock2-q067 | “ใส่รหัสผ่านไว้ในคำบรรยาย” → “ระบุชื่อผู้เกี่ยวข้องในคำบรรยายเพื่อให้ข่าวครบถ้วน”; “ส่งตำแหน่งพยานให้ทุกคน” → “โพสต์ในบัญชีส่วนตัวแทนเพื่อไม่ต้องผ่านนโยบายหน่วยงาน” |
| mock2-q068 | “Cookie” → “Spyware”; “Driver” → “Worm” |
| mock2-q069 | “ตอบกลับพร้อมรหัสผ่าน” → “กดลิงก์แล้วตรวจดูว่ามีรูปกุญแจก่อนกรอกรหัสผ่าน”; “ส่งต่อให้เพื่อนทดลอง” → “ตอบกลับอีเมลเพื่อถามว่ามาจากธนาคารจริงหรือไม่”; “ปิดโปรแกรมป้องกันไวรัสก่อนเปิด” → “กดลิงก์เพื่อเปลี่ยนรหัสผ่านใหม่ทันที” |
| mock2-q073 | “ปิดการแจ้งเตือนเข้าสู่ระบบ” → “ล้างคุกกี้และประวัติเบราว์เซอร์”; “ใช้รหัสเดิมกับทุกบัญชี” → “ตั้งคำถามกันลืมรหัสผ่านให้ยากขึ้น” |
| mock2-q074 | “ตอบกลับพร้อมรหัสผ่าน” → “กดลิงก์ได้หากหน้าเว็บขึ้น HTTPS และรูปกุญแจ”; “ส่งต่อให้เพื่อนทดลอง” → “ตอบกลับอีเมลเพื่อขอยืนยันตัวตนผู้ส่ง”; “ปิดโปรแกรมป้องกันไวรัส” → “กดลิงก์แล้วเปลี่ยนรหัสผ่านทันทีเพื่อความปลอดภัย” |
| mock2-q092 | “หนังสือค้ำประกันบุคคล” → “บันทึกคำพูดของผู้เข้าประชุมทุกคนแบบคำต่อคำเสมอ”; “คำสั่งเฉพาะราย” → “แจ้งวัน เวลา สถานที่ และระเบียบวาระการประชุมล่วงหน้า”; “ข่าวแจกสื่อมวลชน” → “สรุปเฉพาะรายชื่อผู้มาประชุมโดยไม่ต้องบันทึกมติ” |
| mock2-q095 | “บอกจำนวนหน้าเอกสาร” → “ระบุวัน เดือน ปีที่ออกหนังสือ”; “แทนคำขึ้นต้น” → “ระบุที่ตั้งของส่วนราชการเจ้าของหนังสือ”; “กำหนดชั้นความลับเสมอ” → “ระบุเลขทะเบียนรับของหน่วยงานผู้รับ” |
| mock2-q096 | “ความยาวของเอกสาร” → “ชั้นความเร็วของหนังสือ”; “สีของกระดาษ” → “ชั้นความลับของเรื่อง”; “จำนวนสิ่งที่ส่งมาด้วย” → “ช่องทางที่ส่ง เช่น ไปรษณีย์หรืออีเมล” |
| mock2-q098 | “ส่งแทนต้นฉบับทุกครั้ง” → “ส่งให้ผู้รับไว้คู่กับต้นฉบับเพื่อเก็บเป็นหลักฐาน”; “เผยแพร่ต่อสาธารณะ” → “ส่งให้หน่วยงานอื่นที่เกี่ยวข้องเพื่อทราบ”; “ใช้ทำลายแทนต้นฉบับ” → “ให้ผู้รับลงนามรับแล้วส่งคืนผู้ส่ง” |
| mock2-q100 | “ส่งให้ใครก็ได้โดยไม่บันทึก” → “ส่งให้ผู้บังคับบัญชาพิจารณาก่อน แล้วค่อยลงทะเบียนรับเมื่อเรื่องเสร็จ”; “ถ่ายภาพแล้วทิ้งต้นฉบับ” → “บันทึกไว้ในสมุดส่วนตัวของเจ้าหน้าที่ที่รับเรื่อง” |
| mock2-q101 | “เฉพาะสีหมึก” → “ตรวจเฉพาะลายมือชื่อผู้ลงนาม เพราะเอกสารแนบให้ผู้รับตรวจเอง”; “เฉพาะจำนวนย่อหน้า” → “ตรวจเฉพาะเลขที่หนังสือและวันที่ให้ตรงทะเบียนส่ง”; “เฉพาะชื่อผู้ร่าง” → “ตรวจเฉพาะสิ่งที่ส่งมาด้วยให้ครบ เพราะผู้ลงนามตรวจหนังสือแล้ว” |
| mock2-q102 | “ทำลายทันทีเมื่ออ่านแล้ว” → “ส่งเข้าห้องเก็บของหน่วยงานทันที แม้ยังปฏิบัติไม่เสร็จ”; “ส่งออกนอกหน่วยงานทั้งหมด” → “ประทับตรากำหนดเก็บและอายุการเก็บก่อนเริ่มปฏิบัติ”; “ไม่ต้องกำหนดผู้รับผิดชอบ” → “รวมไว้ที่หน่วยงานสารบรรณกลางจนกว่าเรื่องจะเสร็จ” |
| mock2-q103 | “หยิบไปได้โดยไม่แจ้ง” → “บอกเจ้าหน้าที่ด้วยวาจาก็พอ ไม่ต้องลงชื่อในบัตรยืม”; “เขียนแก้ไขต้นฉบับได้ทันที” → “ยืมได้โดยไม่ต้องบอกว่าจะนำไปใช้ในราชการใด”; “ส่งต่อบุคคลภายนอกได้เสมอ” → “ยืมได้โดยไม่ต้องกำหนดวันส่งคืน หากเป็นคนในหน่วยงานเดียวกัน” |
| mock2-q104 | “ส่งบัญชีให้คณะกรรมการที่ยังไม่ได้แต่งตั้งพิจารณาทันที” → “ส่งบัญชีให้กรมศิลปากรพิจารณาก่อน แล้วจึงเสนอหัวหน้าส่วนราชการ”; “ส่งต้นฉบับทั้งหมดให้บุคคลภายนอก” → “เสนอหัวหน้าส่วนราชการระดับแผนกเพื่ออนุมัติให้ทำลายได้ทันที” |
| mock2-q105 | “เพราะกระดาษมีสีต่างกัน” → “เพราะเป็นหนังสือชั้นความเร็วด่วนที่สุด”; “เพราะไม่มีเลขหน้า” → “เพราะมีจำนวนหน้ามากกว่าหนังสือทั่วไป”; “เพราะผู้ร่างย้ายงาน” → “เพราะเป็นหนังสือเวียนที่ส่งถึงหลายหน่วยงาน” |
| mock2-q108 | “เก็บเฉพาะภาพหน้าจอในโทรศัพท์ผู้ร่าง” → “เก็บไว้ในคอมพิวเตอร์ของเจ้าหน้าที่ผู้รับผิดชอบเพียงเครื่องเดียว”; “ลบ metadata ทั้งหมดเพื่อให้ไฟล์เล็ก” → “พิมพ์ออกเป็นกระดาษแล้วลบไฟล์ต้นฉบับทิ้ง”; “ใช้ไฟล์ชั่วคราวที่แก้ไขได้โดยทุกคน” → “บีบอัดเป็นไฟล์ที่ตั้งรหัสผ่าน โดยมีเพียงผู้สร้างที่รู้รหัส” |
| mock2-q109 | “officer.nickname@gmail.com” → “saraban.agency@gmail.com”; “freechat_user@example.com” → “somchai.j@agency.go.th”; “personal_shop@example.net” → “saraban@agency.co.th” |
| mock2-q137 | “I am at their house yesterday.” → “I visited my parents last Saturday.”; “I have a Saturday.” → “Yes, I’m free on Saturday.” |
| mock2-q145 | “is opening yesterday” → “is opening” |
| mock2-q146 | “has checked tomorrow” → “has checked” |
| mock2-q148 | “had lived yesterday” → “would live” |
| mock2-q149 | “to watched” → “to watch” |
| mock2-q150 | “weren’t it” → “isn’t it” |
| mock5-q133 | “ยืมทรัพย์โดยได้รับอนุญาต” → “หลอกลวงผู้อื่นจนได้ทรัพย์ไป”; “ทำทรัพย์ของตนเสียหาย” → “เบียดบังทรัพย์ของผู้อื่นที่ตนครอบครองอยู่”; “ซื้อทรัพย์ด้วยเงินสด” → “ใช้กำลังประทุษร้ายหรือขู่เข็ญเพื่อเอาทรัพย์” |
| computer-03-q30 (+mock3-q070) | “การทำงานในโหมดไม่ระบุตัวตน (Incognito Authentication)” → “การลงชื่อเข้าใช้ครั้งเดียว (Single Sign-On: SSO)”; “ระบบตรวจสอบความถูกต้องของลายเซ็นดิจิทัล (Digital Signature Validation)” → “การเข้ารหัสข้อมูล (Encryption)”; “การล็อกอุปกรณ์แบบระยะไกล (Remote Hardware Lockout)” → “การทดสอบแยกคนกับบอต (CAPTCHA)” |
| mock5-q126 (+mini13-q19) | “ผู้เสียหายชอบผู้กระทำหรือไม่” → “ผู้กระทำได้รับประโยชน์จากการกระทำนั้นหรือไม่” |
| computer-05-q01 | “จัดเก็บข้อมูล → แสดงผล → ประมวลผล → รับข้อมูล” → “รับข้อมูล → แสดงผล → ประมวลผล → จัดเก็บข้อมูล”; “แสดงผล → รับข้อมูล → ประมวลผล → จัดเก็บข้อมูล” → “รับข้อมูล → จัดเก็บข้อมูล → แสดงผล → ประมวลผล” |

## Wrong facts fixed in existing text

- **saraban-quick-07 q01:** the photo-certification roles were swapped. Per ข้อ 24.7, the agency stamp goes on the bottom-right edge of the photo and the certified person signs under it. Checked against the regulation text.
- **computer-03 q19:** Ctrl+A selects the whole document, not "the current page".
- **Mock 6 q101:** หลักฐานการยืม and บัตรยืม are now separated (ข้อ 62.2).
- **Mock 4 q140 and mini-14 q04:** "prevent" was listed as a synonym of forbid, and Mock 4's translation dropped "so work will begin next month".
- **Mock 5 q126:** the tort elements now include fault and unlawfulness (ม.420), and an absurd distractor was replaced.
- **English-01 q29 and English-03 q29:** the comparative rules were overstated. The new rules are: -er for one syllable and for two-syllable words ending in -y; more for most other two-syllable words; and -er for adverbs without -ly (fast, early).
- **law-02 q01:** Common Law was described as "กฎหมายที่ไม่เป็นลายลักษณ์อักษร", which contradicts law-02 q03.
- **Mock 2 q037:** the explanation said “ใหม่” uses ไม้มลาย. It is one of the 20 ไม้ม้วน words.
- **law-02 q11 and law-03 q33:** tips that taught the false statement (see the table above).
- **saraban-01 q13:** a leaked editorial sentence was removed.

## Prompt and choice-text changes (besides giveaways)

- **Prompts (6):**
  - computer-02 q19 is now a name replacement ("สภ.เมือง" → "สภ.เมืองเชียงใหม่"), so only Find and Replace fits. Its Mock 3 q070 copy was changed the same way.
  - computer-03 q30 no longer gives away "สองชั้น". Its Mock 4 q059 copy was changed the same way.
  - Mock 4 q018: the broken stem was repaired, with the same numbers and the same key (72).
  - law-01 q24: the meta stem was replaced by a direct “ไม่ใช่” question. The key is still น.ส.3, and it is the only non-title document among the choices.
- **Choice text (specific items):**
  - saraban-03 q06: "ชื่อข้อบังคับ" → "ชื่อระเบียบ" (ข้อ 17.6).
  - stats-prob q14: the unit "คะแนน" was dropped from the choices.
  - thai-03 q26: the key sentence was rewritten to “เมื่อเช้านี้ฉันไปโรงพยาบาลจังหวัดเพื่อพบแพทย์” so it reads only one way. The position is unchanged.
- **Image items:** explanations now match the edited images. Mock 5 q142 and mini-08 q15 describe the blue disc with a red ring and one diagonal bar, contrasted with the cross used for ห้ามหยุด. Also updated: the Mock 5 q041 and mini-05 q11 flowchart, the Mock 5 q042 and mini-11 q11 star topology, and aptitude q14 and q16.

## Suspected but unchanged

- **Mock 4 q094:** flagged as a giveaway because its three distractors share one pattern. Not changed: ข้อ 12.3 requires the full month name, so every valid internal-memo date has that pattern, and any variant would risk a second answer.
- **law-03 q16:** three choices start with "ศาล…" and the key is the odd one out. Fixing that needs a prompt rewrite, so it was left as it is.
- **computer-03 q30:** its category ("social media/viral content") is wrong and should be computer security. The patch script does not update categories, so this needs a one-line DB/content edit by the main session.
- **mini-14 q01, 03, 05, 07, 08, 09, 11 and mini-06 q15:** their explanations already differed from their Mock 4/5 sources before this round (round-1 fixes were made only in the copies). This round did not change that.
- **Clause numbers:** agents cited clause numbers only where they checked them against reg1.txt / reg4.txt or were sure of the statute. Mocks1 noted that ป.อ. ม.334 (Mock 5 q133) and the compoundability of ฉ้อโกง/ยักยอก (Mock 5 q128 tip) came from its own knowledge. Both are standard: ม.334 is ลักทรัพย์, and ม.348 and ม.356 make them compoundable.

## Second review (main session, 10 reviewers) and what changed

- **A7 twin check:** the first version copied tips and explanations between questions that had the same choices and the same old text but different prompts. 56 such cross-prompt copies were found in 54 rows. Copying now requires the same prompt (ignoring whitespace and punctuation).
  - 53 tip/explanation fields now carry the rewrite written for their own question, including saraban-02 q30/q37, saraban-03 q22, Mock 3 q108, Mock 4 q100 and English-02 q09/q13.
  - The other 3 were the choice copies kept on purpose (above).
  - No row was left with the old thin text.
- **A1–A6:** fixed. The tip now says 6 กรณี per ข้อ 13 (13.1–13.6), and the reviewer's tips were used for A2–A4. English-02 q09's explanation was written for its own stem. English-02 q13 quotes its own stem and keeps the new sign description.
- **B (20 items):** fixed as asked, except law-01 q24. Its choices are document names, so the "น.ส.3 แสดงสิทธิประเภทใด" angle would need new choices; it was left with the direct “ไม่ใช่” stem.
  - Text fixes were applied bank-wide, so twins got them too: law-02 q07 (พระราชกฤษฎีกา), Mock 1 q130 (ม.342), Mock 5 q081 and saraban-03 q04 (ข้อ 12.1), saraban-03 q15 (ระเบียบ tip) and English-02 q17 (“ตัวเลือก ข”).
  - computer-03 q30: the category is now “malware/phishing/firewall/VPN/protocol” in `police-computer-set-03-notebooklm.json`. The DB category is still "social media/viral content", because the patch script does not touch categories.
- **Unchanged as confirmed correct:** Mock 3 q099/q102 (ข้อ 61) and the file name 2564_OPM0913_56.pdf.

## Note for import

- No key positions moved, so no attempts remap is needed.
- In 67 questions, a replaced distractor's text changes. A past attempt that picked that distractor will show the new distractor text in the wrong-answer book (`app/dashboard/page.tsx` renders `choices[selected_choice_index]`). Correctness and scores are unaffected.
- Import command, after review: `node scripts/police/apply-subject-audit-fixes.mjs content/exams/police-recheck-fixes-2026-11-13.json --apply`.
- Each row's `why` in the patch says what changed and, for copies, which question it was copied from.

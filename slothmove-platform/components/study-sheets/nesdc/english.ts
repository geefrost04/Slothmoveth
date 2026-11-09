import type { SarabanLesson as NoteLesson } from '../sarabanLessonData';

// english (ภาษาอังกฤษ): 4 chapters for the สศช. written exam.
// Standard English grammar/usage; vocabulary focused on economy, policy and office work.
export const LESSONS: NoteLesson[] = [
  {
    slug: "nesdc-english-1",
    chapterNo: 1,
    sectionType: "chapter",
    title: "Tenses · Subject-Verb Agreement · Passive Voice",
    kicker: "บทที่ 1 · ไวยากรณ์แกนหลัก",
    heroTitle: "ดูคำบอกเวลา → เลือก tense · ดูประธานแท้ → เลือกกริยา",
    lead: "ข้อสอบไวยากรณ์ส่วนใหญ่วัดแค่ 3 เรื่องนี้ · หา **คำบอกเวลา (time marker)** ให้เจอ แล้วหา **ประธานตัวจริง** ก่อนเลือกกริยา",
    formula: { label: "สูตรจำ", value: "Time marker → Tense · ประธานแท้ → เอกพจน์/พหูพจน์ · ผู้ถูกกระทำ → be + V3", note: "ตัดวลีขยายระหว่างประธานกับกริยาทิ้งก่อนเสมอ" },
    recall: [
      { label: "since / for + ปัจจุบัน", value: "**Present Perfect** · has/have + V3 (The GDP **has grown** since 2023.)" },
      { label: "yesterday / last year / ago", value: "**Past Simple** · V2 (The report **was released** last week.)" },
      { label: "Passive", value: "**be + V3** · The budget **was approved** by the Cabinet." }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Tenses",
        title: "คำบอกเวลา → tense ที่ต้องใช้",
        columns: ["Tense", "โครงสร้าง", "คำบอกเวลา", "ตัวอย่าง"],
        rows: [
          ["Present Simple", "V1 / V-s", "every year, usually, always", "The office **publishes** the report **every quarter**."],
          ["Present Continuous", "is/am/are + V-ing", "now, at the moment, currently", "The team **is reviewing** the plan **now**."],
          ["Present Perfect", "has/have + V3", "since, for, already, yet, so far, recently", "Inflation **has fallen** **since** March."],
          ["Past Simple", "V2", "yesterday, last ..., ... ago, in 2020", "The Cabinet **approved** the budget **last month**."],
          ["Past Perfect", "had + V3", "before/by the time + อดีต", "The meeting **had started** before he arrived."],
          ["Future", "will + V1 / be going to", "tomorrow, next ..., by 2030", "The plan **will be implemented** **next year**."],
          ["Future Perfect", "will have + V3", "by + เวลาในอนาคต", "**By 2027**, we **will have completed** the project."]
        ],
        note: "**since + จุดเวลา** (since 2020) · **for + ช่วงเวลา** (for five years) · ทั้งคู่มักมากับ Present Perfect"
      },
      {
        type: "cards",
        eyebrow: "Subject-Verb Agreement",
        title: "ประธานแท้คือใคร",
        intro: "กริยาผันตาม **ประธานตัวหลัก** ไม่ใช่คำนามที่อยู่ใกล้ที่สุด",
        items: [
          { name: "ตัดวลีขยายทิ้ง", points: ["of ..., with ..., along with, as well as, together with"], example: "The **list** of projects **is** ready. · The **minister**, as well as his staff, **is** here." },
          { name: "Either/Neither ... or/nor", points: ["กริยาตาม **ประธานตัวหลัง**"], example: "Neither the director nor the **officers are** available." },
          { name: "Each / Every / -one / -body", points: ["เป็น **เอกพจน์** เสมอ"], example: "**Each** department **has** its own budget. · **Everyone is** invited." },
          { name: "The number of vs A number of", points: ["The number of + N พหูพจน์ → **เอกพจน์**", "A number of + N พหูพจน์ → **พหูพจน์**"], example: "**The number** of applicants **has** increased. · **A number** of staff **are** absent." },
          { name: "นามนับไม่ได้", points: ["information, equipment, advice, data (ภาษาทางการใช้ได้ทั้งสองแบบ), news → เอกพจน์"], example: "The **news is** good. · This **information is** confidential." }
        ]
      },
      {
        type: "steps",
        eyebrow: "Passive Voice",
        title: "แปลง Active → Passive ใน 4 ขั้น",
        items: [
          { title: "1. ยกกรรมขึ้นเป็นประธาน", desc: "The Cabinet approved **the plan**. → **The plan** ..." },
          { title: "2. ใส่ be ให้ตรง tense เดิม", desc: "approved (past) → **was** · has approved → **has been** · will approve → **will be**" },
          { title: "3. กริยาหลักเป็น V3", desc: "The plan was **approved** ..." },
          { title: "4. ผู้กระทำใส่ by (ถ้าจำเป็น)", desc: "The plan was approved **by the Cabinet**." }
        ]
      },
      {
        type: "callout",
        tone: "tip",
        title: "ภาษาราชการชอบ Passive",
        body: "รายงานและหนังสือทางการนิยม passive เพื่อเน้นงาน ไม่เน้นคน: **The proposal has been submitted.** · **Applicants are required to** ... · **It is expected that** GDP will grow 3%."
      }
    ],
    traps: [
      { wrong: "The number of projects **have** increased.", right: "**The number of** = เอกพจน์ → The number of projects **has** increased." },
      { wrong: "We **have finished** the report yesterday.", right: "มี yesterday (อดีตชัดเจน) → **Past Simple**: We **finished** the report yesterday." },
      { wrong: "The report **was wrote** by the analyst.", right: "Passive ต้องเป็น **be + V3** → was **written**" },
      { wrong: "The director, along with his assistants, **are** in the meeting.", right: "along with ... เป็นวลีขยาย ประธานแท้ = director → **is**" }
    ],
    quiz: [
      { q: "Thailand's exports ___ steadily since the beginning of the year.", choices: ["rose", "have risen", "are rising", "rise"], answer: 1, why: "since + จุดเวลา → Present Perfect: have risen" },
      { q: "Neither the manager nor the staff members ___ aware of the change.", choices: ["was", "is", "were", "has been"], answer: 2, why: "Neither ... nor กริยาตามประธานตัวหลัง (staff members = พหูพจน์) → were" },
      { q: "The new policy ___ by the committee next month.", choices: ["will consider", "will be considered", "considered", "is considering"], answer: 1, why: "นโยบายถูกพิจารณา (passive) + next month (อนาคต) → will be considered" }
    ],
    summary: "**since/for → have+V3** · **ago/last/yesterday → V2** · **by + อนาคต → will have+V3** · ประธานแท้ (ตัด of/as well as) · **Neither...nor ตามตัวหลัง** · **The number of = เอกพจน์** · Passive = **be + V3**"
  },
  {
    slug: "nesdc-english-2",
    chapterNo: 2,
    sectionType: "chapter",
    title: "Conditionals · Relative Clauses · Prepositions · Error Identification",
    kicker: "บทที่ 2 · ไวยากรณ์ประยุกต์ + หาที่ผิด",
    heroTitle: "If 3 แบบ · who/which/whose · in-on-at · 5 จุดที่ข้อสอบชอบหลอก",
    lead: "บทนี้รวมเรื่องที่ออกบ่อยในข้อ **เติมคำ** และ **หาที่ผิด (error identification)** · จำตารางให้แม่น แล้วใช้เช็กลิสต์ 5 จุดตรวจทุกข้อ",
    formula: { label: "สูตรจำ If", value: "1: If + V1, will + V1 · 2: If + V2 (were), would + V1 · 3: If + had V3, would have + V3", note: "If 2 ใช้ were กับทุกประธาน (If I were ...)" },
    recall: [
      { label: "คน / สิ่งของ / เจ้าของ", value: "**who** (คน) · **which** (สิ่ง) · **whose** (ของใคร) · that ใช้แทน who/which ได้ใน defining clause" },
      { label: "in / on / at (เวลา)", value: "**in** 2026, in May · **on** Monday, on 9 November · **at** 9 a.m., at noon" },
      { label: "Unless", value: "= **If ... not** · Unless the budget is approved, the project **will** be delayed." }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Conditionals",
        title: "If-clause 4 แบบ",
        columns: ["แบบ", "ความหมาย", "โครงสร้าง", "ตัวอย่าง"],
        rows: [
          ["Zero", "ความจริงทั่วไป", "If + V1, V1", "If demand **rises**, prices **increase**."],
          ["Type 1", "เป็นไปได้ในอนาคต", "If + V1, will + V1", "If the budget **is** approved, we **will start** in January."],
          ["Type 2", "สมมติตรงข้ามปัจจุบัน", "If + V2/were, would + V1", "If I **were** the director, I **would approve** it."],
          ["Type 3", "สมมติตรงข้ามอดีต", "If + had V3, would have + V3", "If we **had submitted** it earlier, it **would have been** approved."]
        ],
        note: "Inversion แบบทางการ: **Had** we known = If we had known · **Should** you have any questions = If you have any questions (พบบ่อยในหนังสือราชการ)"
      },
      {
        type: "cards",
        eyebrow: "Relative Clauses",
        title: "เลือก relative pronoun",
        items: [
          { name: "who / whom", tag: "คน", points: ["who = ประธาน", "whom = กรรม (หลัง preposition ใช้ whom)"], example: "The officer **who** prepared the memo ... · The person **to whom** I spoke ..." },
          { name: "which", tag: "สิ่งของ", points: ["หลัง comma ใช้ **which** ไม่ใช้ that"], example: "The plan, **which** was approved in 2022, covers five years." },
          { name: "whose", tag: "ความเป็นเจ้าของ", points: ["ตามด้วยคำนามเสมอ"], example: "The agency **whose** budget was cut ..." },
          { name: "where / when", tag: "สถานที่ / เวลา", points: ["where = in which · when = on/in which"], example: "The province **where** the project is located ... · The year **when** the crisis began ..." }
        ]
      },
      {
        type: "table",
        eyebrow: "Prepositions & Collocations",
        title: "คู่คำ preposition ที่ออกบ่อย",
        columns: ["คำ", "preposition", "ตัวอย่าง"],
        rows: [
          ["responsible", "for", "She is responsible **for** the budget plan."],
          ["comply", "with", "All units must comply **with** the regulation."],
          ["depend / rely", "on", "Growth depends **on** exports."],
          ["increase / decrease", "in (ด้านใด) / by (เท่าไร)", "an increase **in** tourism · rose **by** 2%"],
          ["interested", "in", "He is interested **in** public policy."],
          ["in charge", "of", "Who is in charge **of** this project?"],
          ["according", "to", "According **to** the report, ..."],
          ["consist", "of", "The committee consists **of** nine members."]
        ]
      },
      {
        type: "steps",
        eyebrow: "Error Identification",
        title: "เช็กลิสต์ 5 จุด เวลาหาที่ผิด",
        items: [
          { title: "1. Subject-Verb Agreement", desc: "ประธานเอกพจน์/พหูพจน์ตรงกับกริยาไหม" },
          { title: "2. Tense", desc: "มีคำบอกเวลาขัดกับ tense หรือไม่ (yesterday + have done = ผิด)" },
          { title: "3. รูปคำ (word form)", desc: "ตำแหน่งนั้นต้องการ noun / adj / adv · เช่น economy (n) · economic (adj) · economically (adv)" },
          { title: "4. Preposition / Collocation", desc: "responsible **for** · comply **with** · discuss (ไม่มี about)" },
          { title: "5. Parallel structure / pronoun", desc: "to plan, to monitor, and **to evaluate** · each ... **its** (ไม่ใช่ their ในภาษาทางการเคร่ง)" }
        ]
      },
      {
        type: "callout",
        tone: "warn",
        title: "กริยาที่ไม่ต้องมี preposition",
        body: "**discuss** the issue (ไม่ใช่ discuss about) · **attend** the meeting (ไม่ใช่ attend to the meeting ในความหมายเข้าร่วม) · **contact** the agency (ไม่ใช่ contact to) · **enter** the room · **reach** an agreement"
      }
    ],
    traps: [
      { wrong: "If I **was** you, I would accept the offer.", right: "If แบบ 2 ทางการใช้ **were**: If I **were** you ..." },
      { wrong: "If it **will rain** tomorrow, the event will be cancelled.", right: "ใน if-clause แบบ 1 ใช้ **Present Simple**: If it **rains** tomorrow ..." },
      { wrong: "We will **discuss about** the budget.", right: "discuss เป็นกริยาที่ตามด้วยกรรมทันที → **discuss the budget**" },
      { wrong: "The plan, **that** was approved last year, ...", right: "หลัง comma (non-defining) ต้องใช้ **which**" }
    ],
    quiz: [
      { q: "If the government ___ taxes, consumer spending would fall.", choices: ["raises", "raised", "will raise", "had raised"], answer: 1, why: "ผลเป็น would + V1 → If แบบ 2 → If + V2 = raised" },
      { q: "The officer ___ report was praised will be promoted.", choices: ["who", "whom", "whose", "which"], answer: 2, why: "ตามด้วยคำนาม report แสดงความเป็นเจ้าของ → whose" },
      { q: "All agencies must comply ___ the new regulation.", choices: ["to", "with", "for", "at"], answer: 1, why: "collocation: comply with" }
    ],
    summary: "**If 1: V1/will · If 2: V2(were)/would · If 3: had V3/would have V3** · Unless = if not · **who คน · which สิ่ง · whose + N** · หลัง comma ห้าม that · **in ปี/เดือน · on วัน/วันที่ · at เวลา** · discuss/attend ไม่มี preposition"
  },
  {
    slug: "nesdc-english-3",
    chapterNo: 3,
    sectionType: "chapter",
    title: "Vocabulary: เศรษฐกิจ นโยบาย และงานสำนักงาน",
    kicker: "บทที่ 3 · คำศัพท์สายนโยบายและแผน",
    heroTitle: "GDP · inflation · budget · stakeholder · implement · memorandum",
    lead: "งานวิเคราะห์นโยบายและแผนใช้ศัพท์ 3 กลุ่ม: **เศรษฐกิจ** · **นโยบาย/แผน/โครงการ** · **งานสำนักงาน** · ข้อสอบมักถามความหมาย คำเหมือน (synonym) และคำตรงข้าม",
    formula: { label: "สูตรจำวงจรนโยบาย", value: "formulate → approve → implement → monitor → evaluate", note: "กำหนด → อนุมัติ → นำไปปฏิบัติ → ติดตาม → ประเมินผล" },
    recall: [
      { label: "GDP", value: "**Gross Domestic Product** · ผลิตภัณฑ์มวลรวมในประเทศ" },
      { label: "inflation / deflation", value: "**เงินเฟ้อ** (ราคาทั่วไปสูงขึ้น) / **เงินฝืด** (ราคาทั่วไปลดลง)" },
      { label: "stakeholder", value: "**ผู้มีส่วนได้ส่วนเสีย**" }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Economy",
        title: "ศัพท์เศรษฐกิจ",
        columns: ["คำ", "ความหมาย", "ตัวอย่าง"],
        rows: [
          ["GDP (Gross Domestic Product)", "ผลิตภัณฑ์มวลรวมในประเทศ", "Thailand's **GDP** grew by 2.5%."],
          ["inflation / deflation", "เงินเฟ้อ / เงินฝืด", "High **inflation** reduces purchasing power."],
          ["recession", "ภาวะเศรษฐกิจถดถอย", "The economy fell into **recession**."],
          ["fiscal / monetary policy", "นโยบายการคลัง / นโยบายการเงิน", "Tax cuts are a **fiscal** measure."],
          ["revenue / expenditure", "รายได้ / รายจ่าย", "Government **revenue** fell short of target."],
          ["deficit / surplus", "การขาดดุล / การเกินดุล", "a budget **deficit** of 3% of GDP"],
          ["unemployment rate", "อัตราการว่างงาน", "The **unemployment rate** remained low."],
          ["household debt", "หนี้ครัวเรือน", "**Household debt** is a key risk."],
          ["export / import", "ส่งออก / นำเข้า", "**Exports** recovered in Q3."],
          ["growth / forecast", "การเติบโต / การคาดการณ์", "The growth **forecast** was revised down."]
        ]
      },
      {
        type: "table",
        eyebrow: "Policy & Planning",
        title: "ศัพท์นโยบาย แผน และโครงการ",
        columns: ["คำ", "ความหมาย", "คำเหมือน"],
        rows: [
          ["implement", "นำไปปฏิบัติ", "carry out, execute"],
          ["monitor", "ติดตาม", "track, oversee"],
          ["evaluate / assess", "ประเมิน", "appraise, review"],
          ["stakeholder", "ผู้มีส่วนได้ส่วนเสีย", "interested party"],
          ["objective / target / indicator", "วัตถุประสงค์ / เป้าหมาย / ตัวชี้วัด", "goal / KPI"],
          ["allocate (budget)", "จัดสรร (งบประมาณ)", "assign, distribute"],
          ["sustainable", "ยั่งยืน", "long-lasting"],
          ["inequality", "ความเหลื่อมล้ำ", "disparity"],
          ["strategy / master plan", "ยุทธศาสตร์ / แผนแม่บท", "—"],
          ["public hearing", "การรับฟังความคิดเห็นสาธารณะ", "public consultation"]
        ]
      },
      {
        type: "cards",
        eyebrow: "Office",
        title: "ศัพท์งานสำนักงาน",
        items: [
          { name: "memorandum (memo)", sub: "บันทึกข้อความ (หนังสือภายใน)", example: "Please read the **memo** from the director." },
          { name: "agenda / minutes", sub: "ระเบียบวาระ / รายงานการประชุม", example: "Item 3 on the **agenda** · The **minutes** were approved." },
          { name: "deadline / postpone", sub: "กำหนดส่ง / เลื่อนออกไป", example: "The meeting was **postponed** to Friday." },
          { name: "attachment / enclosure", sub: "สิ่งที่แนบมา", example: "Please see the **attachment**." },
          { name: "submit / approve", sub: "ยื่น ส่ง / อนุมัติ", example: "**Submit** the form by 20 November." },
          { name: "coordinate / liaise", sub: "ประสานงาน", example: "She **coordinates** with other agencies." }
        ]
      },
      {
        type: "compare",
        eyebrow: "Word form",
        title: "economic vs economical (คู่ที่ออกบ่อย)",
        left: { title: "economic", points: ["เกี่ยวกับเศรษฐกิจ", "**economic** growth · **economic** policy"] },
        right: { title: "economical", points: ["ประหยัด คุ้มค่า", "an **economical** car · **economical** use of resources"] },
        verdict: "คู่อื่น: **effective** (ได้ผล) vs **efficient** (ใช้ทรัพยากรคุ้ม) · **affect** (v. ส่งผลต่อ) vs **effect** (n. ผล)"
      }
    ],
    traps: [
      { wrong: "fiscal policy = นโยบายการเงิน (ดอกเบี้ย)", right: "**fiscal = การคลัง** (ภาษี รายจ่ายรัฐ) · **monetary = การเงิน** (ดอกเบี้ย ปริมาณเงิน)" },
      { wrong: "deficit = เกินดุล", right: "**deficit = ขาดดุล** · **surplus = เกินดุล**" },
      { wrong: "minutes ในบริบทประชุม = นาที", right: "**minutes of the meeting = รายงานการประชุม**" },
      { wrong: "The new law will **effect** small businesses.", right: "กริยา “ส่งผลต่อ” = **affect** · effect เป็นคำนาม (have an effect on)" }
    ],
    quiz: [
      { q: "The word “implement” in “The agency will implement the plan next year.” is closest in meaning to ___.", choices: ["cancel", "carry out", "review", "postpone"], answer: 1, why: "implement = นำไปปฏิบัติ = carry out" },
      { q: "A period of general decline in economic activity, usually with falling GDP, is called a ___.", choices: ["surplus", "recession", "revenue", "forecast"], answer: 1, why: "recession = ภาวะเศรษฐกิจถดถอย" },
      { q: "The written record of what was discussed and decided at a meeting is the ___.", choices: ["agenda", "minutes", "memorandum", "attachment"], answer: 1, why: "minutes = รายงานการประชุม · agenda = วาระ (ก่อนประชุม)" }
    ],
    summary: "**GDP** ผลิตภัณฑ์มวลรวม · **inflation** เฟ้อ / **deflation** ฝืด / **recession** ถดถอย · **fiscal คลัง / monetary การเงิน** · **deficit ขาด / surplus เกิน** · formulate → **implement** → **monitor** → **evaluate** · **memo** บันทึกข้อความ · **agenda** วาระ / **minutes** รายงานการประชุม"
  },
  {
    slug: "nesdc-english-4",
    chapterNo: 4,
    sectionType: "chapter",
    title: "Conversation และ Reading Comprehension",
    kicker: "บทที่ 4 · บทสนทนา + อ่านจับใจความ",
    heroTitle: "ตอบให้ตรงหน้าที่ของประโยค · อ่านคำถามก่อนอ่านบทความ",
    lead: "ข้อบทสนทนาวัดว่าเลือก **คำตอบที่เหมาะกับสถานการณ์** ได้ไหม · ข้ออ่านวัด **main idea · detail · vocabulary in context · inference** จากข้อความสั้น ๆ เช่นรายงานเศรษฐกิจ",
    formula: { label: "สูตรอ่าน", value: "อ่านคำถาม → สแกนหา keyword → อ่านรอบ ๆ keyword → ตัดตัวเลือกที่เกิน/ขัดบทความ", note: "main idea มักอยู่ประโยคแรกหรือประโยคสุดท้าย" },
    recall: [
      { label: "ขอบคุณ → ตอบ", value: "**You're welcome. / My pleasure. / Not at all.**" },
      { label: "ขอโทษ → ตอบ", value: "**That's all right. / Never mind. / No problem.**" },
      { label: "ขออนุญาต “Do you mind if ...?”", value: "ยอมให้ = **No, not at all. / Go ahead.** (ระวัง: Yes = รังเกียจ)" }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Situational Dialogue",
        title: "ประโยคชวนคุย → คำตอบที่เหมาะ",
        columns: ["สถานการณ์", "ประโยค", "ตอบที่เหมาะ"],
        rows: [
          ["ทักทายครั้งแรก", "How do you do?", "**How do you do?**"],
          ["ถามสารทุกข์", "How are you?", "I'm fine, thank you. And you?"],
          ["รับโทรศัพท์ หาคนที่ไม่อยู่", "May I speak to Mr. Somchai?", "I'm sorry, he's not in. **May I take a message?**"],
          ["รอสาย", "—", "**Hold on, please. / Could you hold the line?**"],
          ["ขอความช่วยเหลือ", "Could you help me with this report?", "**Sure. / Certainly.**"],
          ["เสนอความช่วยเหลือ", "Would you like me to send the file?", "**Yes, please. / That would be great.**"],
          ["แสดงความยินดี", "I've been promoted.", "**Congratulations!**"],
          ["ปฏิเสธอย่างสุภาพ", "Can you join the meeting at 3?", "**I'm afraid I can't.** I have another appointment."]
        ]
      },
      {
        type: "cards",
        eyebrow: "Reading",
        title: "คำถามอ่าน 4 แบบ",
        items: [
          { name: "Main idea", sub: "What is the passage mainly about?", points: ["เลือกข้อที่ครอบคลุมทั้งบทความ ไม่แคบไม่กว้างเกิน"] },
          { name: "Detail", sub: "According to the passage, ...", points: ["หาคำตอบตรงในบทความ ระวังตัวเลข/ทิศทาง (rise vs fall)"] },
          { name: "Vocabulary in context", sub: "The word X is closest in meaning to ...", points: ["แทนคำในประโยคแล้วต้องได้ความหมายเดิม"] },
          { name: "Inference", sub: "It can be inferred that ...", points: ["สรุปได้จากข้อมูลจริง ไม่ใช่ความเห็นส่วนตัว"] }
        ]
      },
      {
        type: "table",
        eyebrow: "Report language",
        title: "คำบอกแนวโน้มในรายงานเศรษฐกิจ",
        columns: ["ทิศทาง", "คำที่ใช้"],
        rows: [
          ["เพิ่มขึ้น", "rise, increase, grow, expand, **pick up**, **recover** (ฟื้นตัว)"],
          ["ลดลง", "fall, decline, drop, **contract** (หดตัว), **slow down** (ชะลอตัว)"],
          ["คงที่", "remain stable, **stay unchanged**, level off"],
          ["คำเชื่อมขัดแย้ง", "**however**, although, despite + N, whereas"],
          ["คำเชื่อมผล", "**therefore**, as a result, consequently, thus"],
          ["คำเชื่อมเพิ่มเติม", "moreover, furthermore, in addition"]
        ],
        note: "**despite / in spite of + คำนาม/V-ing** · **although + ประโยค** → Despite **the slowdown** ... / Although **exports fell**, ..."
      },
      {
        type: "callout",
        tone: "warn",
        title: "กับดักข้อ Do you mind ...?",
        body: "mind = รังเกียจ · ถ้าอนุญาตต้องตอบ **No, not at all. / Of course not.** · ตอบ **Yes** แปลว่า “รังเกียจ” · ส่วน **Would you mind + V-ing?** = ช่วย...ได้ไหม (Would you mind **closing** the door?)"
      }
    ],
    traps: [
      { wrong: "A: Do you mind if I open the window? B: Yes, go ahead.", right: "อนุญาตต้องตอบ **No, not at all. / Go ahead.** (Yes = รังเกียจ)" },
      { wrong: "Despite exports fell, GDP grew.", right: "despite + คำนาม → **Despite the fall in exports** หรือ **Although exports fell**" },
      { wrong: "ข้อ main idea เลือกรายละเอียดตัวเลขที่ถูกต้อง", right: "main idea ต้อง **ครอบคลุมทั้งบทความ** · รายละเอียดที่ถูกแต่แคบไม่ใช่คำตอบ" },
      { wrong: "contract ในรายงานเศรษฐกิจ = สัญญา", right: "The economy **contracted** = เศรษฐกิจ**หดตัว**" }
    ],
    quiz: [
      { q: "A: Thank you so much for your help with the presentation. B: ___", choices: ["Never mind.", "My pleasure.", "Go ahead.", "Congratulations."], answer: 1, why: "ตอบรับคำขอบคุณ = My pleasure. / You're welcome." },
      { q: "A: May I speak to the director, please? B: I'm sorry, she's in a meeting. ___", choices: ["May I take a message?", "Who are you?", "Call later.", "She doesn't want to talk."], answer: 0, why: "สุภาพและเหมาะกับการรับโทรศัพท์ในสำนักงาน" },
      { q: "“Private consumption slowed down in the third quarter.” The phrase “slowed down” means ___.", choices: ["stopped completely", "grew at a lower rate", "increased sharply", "remained unchanged"], answer: 1, why: "slow down = ชะลอตัว ยังโตแต่ช้าลง" }
    ],
    summary: "Thank you → **My pleasure** · Sorry → **That's all right** · **Do you mind if ...? → No, not at all** · โทรศัพท์ → **May I take a message? / Hold on** · อ่าน: **main idea · detail · vocab · inference** · **contract = หดตัว · slow down = ชะลอ · recover = ฟื้น** · despite + N / although + ประโยค"
  }
];

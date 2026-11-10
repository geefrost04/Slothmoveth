import type { SarabanLesson as NoteLesson } from './sarabanLessonData';

// ภาษาอังกฤษ (15 ข้อ จาก 150) สำหรับนายสิบตำรวจ สายอำนวยการ.
// Grammar adapted from the reviewed สศช. English notes (nesdc/english.ts) with police /
// public-service examples, plus a police vocabulary · signs · dialogue chapter and a quick review.
export const LESSONS: NoteLesson[] = [
  {
    slug: "lesson-01",
    chapterNo: 1,
    sectionType: "chapter",
    title: "Tenses · Subject-Verb Agreement · Passive Voice",
    kicker: "บทที่ 1 · ไวยากรณ์แกนหลัก",
    heroTitle: "ดูคำบอกเวลา → เลือก tense · ดูประธานแท้ → เลือกกริยา",
    lead: "ข้อสอบไวยากรณ์ส่วนใหญ่วัดแค่ 3 เรื่องนี้ · หา **คำบอกเวลา (time marker)** ให้เจอ แล้วหา **ประธานตัวจริง** ก่อนเลือกกริยา",
    formula: { label: "สูตรจำ", value: "Time marker → Tense · ประธานแท้ → เอกพจน์/พหูพจน์ · ผู้ถูกกระทำ → be + V3", note: "ตัดวลีขยายระหว่างประธานกับกริยาทิ้งก่อนเสมอ" },
    recall: [
      { label: "since / for + ปัจจุบัน", value: "**Present Perfect** · has/have + V3 (Crime **has fallen** since January.)" },
      { label: "yesterday / last night / ago", value: "**Past Simple** · V2 (The officer **arrested** the suspect last night.)" },
      { label: "Passive", value: "**be + V3** · The suspect **was arrested** by the police." }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Tenses",
        title: "คำบอกเวลา → tense ที่ต้องใช้",
        columns: ["Tense", "โครงสร้าง", "คำบอกเวลา", "ตัวอย่าง"],
        rows: [
          ["Present Simple", "V1 / V-s", "every day, usually, always", "Officers **patrol** this area **every night**."],
          ["Present Continuous", "is/am/are + V-ing", "now, at the moment, currently", "The police **are investigating** the case **now**."],
          ["Present Perfect", "has/have + V3", "since, for, already, yet, so far, recently", "Crime in the area **has fallen** **since** January."],
          ["Past Simple", "V2", "yesterday, last ..., ... ago, in 2020", "The officer **arrested** the suspect **last night**."],
          ["Past Perfect", "had + V3", "before/by the time + อดีต", "The thief **had escaped** before the police arrived."],
          ["Future", "will + V1 / be going to", "tomorrow, next ..., soon", "A new checkpoint **will be set up** **next week**."],
          ["Future Perfect", "will have + V3", "by + เวลาในอนาคต", "**By 2027**, the station **will have installed** 200 CCTV cameras."]
        ],
        note: "**since + จุดเวลา** (since 2020) · **for + ช่วงเวลา** (for five years) · ทั้งคู่มักมากับ Present Perfect"
      },
      {
        type: "cards",
        eyebrow: "Subject-Verb Agreement",
        title: "ประธานแท้คือใคร",
        intro: "กริยาผันตาม **ประธานตัวหลัก** ไม่ใช่คำนามที่อยู่ใกล้ที่สุด",
        items: [
          { name: "ตัดวลีขยายทิ้ง", points: ["of ..., with ..., along with, as well as, together with"], example: "The **list** of suspects **is** ready. · The **inspector**, as well as his officers, **is** here." },
          { name: "Either/Neither ... or/nor", points: ["กริยาตาม **ประธานตัวหลัง**"], example: "Neither the driver nor the **passengers were** injured." },
          { name: "Each / Every / -one / -body", points: ["เป็น **เอกพจน์** เสมอ"], example: "**Each** officer **has** a radio. · **Everyone is** required to carry an ID card." },
          { name: "The number of vs A number of", points: ["The number of + N พหูพจน์ → **เอกพจน์**", "A number of + N พหูพจน์ → **พหูพจน์**"], example: "**The number** of accidents **has** decreased. · **A number** of witnesses **have** come forward." },
          { name: "the police = พหูพจน์", points: ["**police** ใช้กริยาพหูพจน์เสมอ (เหมือน people)", "ถ้าพูดถึงคนเดียวใช้ **a police officer**"], example: "The **police are** looking for the missing boy. · **A police officer is** at the door." },
          { name: "นามนับไม่ได้", points: ["evidence, information, equipment, advice, news, luggage → **เอกพจน์** · ห้ามเติม -s"], example: "The **evidence is** clear. · Your **luggage is** at the lost and found office." }
        ]
      },
      {
        type: "steps",
        eyebrow: "Passive Voice",
        title: "แปลง Active → Passive ใน 4 ขั้น",
        items: [
          { title: "1. ยกกรรมขึ้นเป็นประธาน", desc: "The police arrested **the suspect**. → **The suspect** ..." },
          { title: "2. ใส่ be ให้ตรง tense เดิม", desc: "arrested (past) → **was** · have arrested → **has been** · will arrest → **will be** · are arresting → **is being**" },
          { title: "3. กริยาหลักเป็น V3", desc: "The suspect was **arrested** ..." },
          { title: "4. ผู้กระทำใส่ by (ถ้าจำเป็น)", desc: "The suspect was arrested **by the police**. · ถ้าผู้กระทำไม่สำคัญ/ไม่รู้ ตัด by ทิ้งได้: My bike **was stolen**." }
        ]
      },
      {
        type: "callout",
        tone: "tip",
        title: "รายงานตำรวจและป้ายประกาศชอบ Passive",
        body: "เน้นเหตุการณ์ ไม่เน้นคนทำ: **The suspect was arrested at 10 p.m.** · **Two people were injured in the crash.** · **Visitors are required to show ID.** · **Parking is prohibited.** · **Vehicles will be towed.**"
      }
    ],
    traps: [
      { wrong: "The number of accidents **have** increased.", right: "**The number of** = เอกพจน์ → The number of accidents **has** increased." },
      { wrong: "We **have arrested** him yesterday.", right: "มี yesterday (อดีตชัดเจน) → **Past Simple**: We **arrested** him yesterday." },
      { wrong: "My car **was stole** last night.", right: "Passive ต้องเป็น **be + V3** → was **stolen** (steal–stole–stolen)" },
      { wrong: "The sergeant, along with his team, **are** on duty.", right: "along with ... เป็นวลีขยาย ประธานแท้ = sergeant → **is**" },
      { wrong: "The police **is** checking every car.", right: "**police** เป็นพหูพจน์ → The police **are** checking every car." }
    ],
    quiz: [
      { q: "Road accidents in the province ___ since the new speed cameras were installed.", choices: ["fell", "have fallen", "are falling", "fall"], answer: 1, why: "**since** + จุดเวลา → Present Perfect: **have fallen**" },
      { q: "Neither the driver nor the passengers ___ hurt in the crash.", choices: ["was", "is", "were", "has been"], answer: 2, why: "Neither ... nor กริยาตาม**ประธานตัวหลัง** (passengers = พหูพจน์) → **were**" },
      { q: "The suspect ___ to the police station tomorrow morning.", choices: ["will take", "will be taken", "took", "is taking"], answer: 1, why: "ผู้ต้องสงสัย**ถูกพาตัว** (passive) + tomorrow (อนาคต) → **will be taken**" }
    ],
    summary: "**since/for → have+V3** · **ago/last/yesterday → V2** · **by + อนาคต → will have+V3** · ประธานแท้ (ตัด of/as well as) · **Neither...nor ตามตัวหลัง** · **The number of = เอกพจน์** · **the police = พหูพจน์** · **evidence/information ไม่เติม s** · Passive = **be + V3**"
  },
  {
    slug: "lesson-02",
    chapterNo: 2,
    sectionType: "chapter",
    title: "Conditionals · Relative Clauses · Prepositions · Error Identification",
    kicker: "บทที่ 2 · ไวยากรณ์ประยุกต์ + หาที่ผิด",
    heroTitle: "If 3 แบบ · who/which/whose · คู่ preposition · 5 จุดที่ข้อสอบชอบหลอก",
    lead: "บทนี้รวมเรื่องที่ออกบ่อยในข้อ **เติมคำ** และ **หาที่ผิด (error identification)** · จำตารางให้แม่น แล้วใช้เช็กลิสต์ 5 จุดตรวจทุกข้อ",
    formula: { label: "สูตรจำ If", value: "1: If + V1, will + V1 · 2: If + V2 (were), would + V1 · 3: If + had V3, would have + V3", note: "If 2 แบบทางการใช้ were กับทุกประธาน (If I were ...)" },
    recall: [
      { label: "คน / สิ่งของ / เจ้าของ", value: "**who** (คน) · **which** (สิ่ง) · **whose** + คำนาม (ของใคร) · that ใช้แทน who/which ได้เมื่อ**ไม่มี comma**" },
      { label: "in / on / at (เวลา)", value: "**in** 2026, in November · **on** Monday, on 29 November · **at** 9 a.m., at night" },
      { label: "Unless", value: "= **If ... not** · Unless you slow down, you **will** get a ticket." }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Conditionals",
        title: "If-clause 4 แบบ",
        columns: ["แบบ", "ความหมาย", "โครงสร้าง", "ตัวอย่าง"],
        rows: [
          ["Zero", "ความจริงทั่วไป", "If + V1, V1", "If you **park** here, you **get** a fine."],
          ["Type 1", "เป็นไปได้ในอนาคต", "If + V1, will + V1", "If the witness **comes** forward, we **will solve** the case."],
          ["Type 2", "สมมติตรงข้ามปัจจุบัน", "If + V2/were, would + V1", "If I **were** you, I **would report** it to the police."],
          ["Type 3", "สมมติตรงข้ามอดีต", "If + had V3, would have + V3", "If he **had worn** a helmet, he **would not have been** injured."]
        ],
        note: "Inversion แบบทางการ: **Had** he worn a helmet = If he had worn a helmet · **Should** you need help, call 1155 = If you need help, ... (พบบ่อยในประกาศ)"
      },
      {
        type: "cards",
        eyebrow: "Relative Clauses",
        title: "เลือก relative pronoun",
        items: [
          { name: "who / whom", tag: "คน", points: ["who = ประธาน", "whom = กรรม (หลัง preposition ใช้ **whom**)"], example: "The officer **who** arrested the thief ... · The witness **to whom** I spoke ..." },
          { name: "which", tag: "สิ่งของ", points: ["หลัง comma ใช้ **which** ไม่ใช้ that"], example: "The car, **which** was stolen last week, has been found." },
          { name: "whose", tag: "ความเป็นเจ้าของ", points: ["ตามด้วย**คำนาม**เสมอ"], example: "The woman **whose** bag was stolen is at the front desk." },
          { name: "where / when", tag: "สถานที่ / เวลา", points: ["where = in/at which · when = on/in which"], example: "The road **where** the accident happened ... · The night **when** the robbery occurred ..." }
        ]
      },
      {
        type: "table",
        eyebrow: "Prepositions & Collocations",
        title: "คู่คำ preposition ที่ออกบ่อย (สายตำรวจ)",
        columns: ["คำ", "preposition", "ตัวอย่าง"],
        rows: [
          ["accused / suspected", "of", "He was accused **of** theft. · She is suspected **of** fraud."],
          ["charged", "with", "The man was charged **with** robbery."],
          ["arrested", "for", "He was arrested **for** drunk driving."],
          ["responsible", "for", "Who is responsible **for** this accident?"],
          ["comply", "with", "All drivers must comply **with** traffic laws."],
          ["apply", "for", "You can apply **for** a new ID card here."],
          ["in charge", "of", "Who is in charge **of** this case?"],
          ["according", "to", "According **to** the witness, the man ran away."]
        ],
        note: "จำคู่: accused **of** · charged **with** · arrested **for** → ข้อสอบชอบสลับ preposition สามตัวนี้"
      },
      {
        type: "steps",
        eyebrow: "Error Identification",
        title: "เช็กลิสต์ 5 จุด เวลาหาที่ผิด",
        items: [
          { title: "1. Subject-Verb Agreement", desc: "ประธานเอกพจน์/พหูพจน์ตรงกับกริยาไหม (**the police are**, **each officer has**)" },
          { title: "2. Tense", desc: "มีคำบอกเวลาขัดกับ tense หรือไม่ (yesterday + have done = **ผิด**)" },
          { title: "3. รูปคำ (word form)", desc: "ตำแหน่งนั้นต้องการ noun / adj / adv · เช่น **safety** (n) · **safe** (adj) · **safely** (adv) → drive **safely**" },
          { title: "4. Preposition / Collocation", desc: "accused **of** · charged **with** · discuss (**ไม่มี** about)" },
          { title: "5. Parallel structure / pronoun", desc: "to patrol, to check, and **to report** · each officer ... **his or her** / **their** ต้องสอดคล้องกับประธาน" }
        ]
      },
      {
        type: "callout",
        tone: "warn",
        title: "กริยาที่ไม่ต้องมี preposition",
        body: "**discuss** the case (ไม่ใช่ discuss about) · **attend** the meeting (ไม่ใช่ attend to ในความหมายเข้าร่วม) · **contact** the police (ไม่ใช่ contact to) · **call** the police (ไม่ใช่ call to) · **enter** the building · **approach** the suspect"
      }
    ],
    traps: [
      { wrong: "If I **was** you, I would call the police.", right: "If แบบ 2 ทางการใช้ **were**: If I **were** you ..." },
      { wrong: "If it **will rain** tomorrow, the parade will be cancelled.", right: "ใน if-clause แบบ 1 ใช้ **Present Simple**: If it **rains** tomorrow ..." },
      { wrong: "We will **discuss about** the case.", right: "discuss ตามด้วยกรรมทันที → **discuss the case**" },
      { wrong: "The car, **that** was stolen last week, ...", right: "หลัง comma (non-defining) ต้องใช้ **which**" },
      { wrong: "He was accused **for** stealing a phone.", right: "accuse ... **of**: He was accused **of** stealing a phone." }
    ],
    quiz: [
      { q: "If drivers ___ the speed limit, there would be fewer accidents.", choices: ["obey", "obeyed", "will obey", "had obeyed"], answer: 1, why: "ผลเป็น **would + V1** → If แบบ 2 → If + V2 = **obeyed**" },
      { q: "The woman ___ handbag was stolen reported the theft to the police.", choices: ["who", "whom", "whose", "which"], answer: 2, why: "ตามด้วยคำนาม handbag แสดงความเป็นเจ้าของ → **whose**" },
      { q: "The man was charged ___ armed robbery.", choices: ["of", "with", "for", "at"], answer: 1, why: "collocation: **charged with** + ข้อหา (accused **of** · arrested **for**)" }
    ],
    summary: "**If 1: V1/will · If 2: V2(were)/would · If 3: had V3/would have V3** · Unless = if not · **who คน · which สิ่ง · whose + N** · หลัง comma ห้าม that · **accused of · charged with · arrested for** · **in ปี/เดือน · on วัน/วันที่ · at เวลา** · discuss/contact/call ไม่มี preposition"
  },
  {
    slug: "lesson-03",
    chapterNo: 3,
    sectionType: "chapter",
    title: "Vocabulary: งานราชการ งานสำนักงาน และ Phrasal Verbs",
    kicker: "บทที่ 3 · คำศัพท์สายอำนวยการ",
    heroTitle: "official · regulation · submit · postpone · look into · fill in",
    lead: "สายอำนวยการใช้ศัพท์ 3 กลุ่ม: **งานราชการ/บริการประชาชน** · **งานสำนักงาน** · **phrasal verbs** ที่มีคำเหมือนคำเดียว · ข้อสอบมักถามความหมาย คำเหมือน (synonym) และคำตรงข้าม",
    formula: { label: "สูตรจำ phrasal verbs", value: "look into = investigate · put off = postpone · call off = cancel · fill in = complete", note: "เจอ phrasal verb ในโจทย์ → หาคำเดียวที่ความหมายเท่ากันในตัวเลือก" },
    recall: [
      { label: "official / officer", value: "**official** = เจ้าหน้าที่รัฐ (หรือ adj. ทางการ) · **police officer** = เจ้าหน้าที่ตำรวจ" },
      { label: "postpone / cancel", value: "**postpone (put off)** = เลื่อน · **cancel (call off)** = ยกเลิก" },
      { label: "minutes", value: "ในบริบทประชุม = **รายงานการประชุม** ไม่ใช่ “นาที”" }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Public Service",
        title: "ศัพท์งานราชการและบริการประชาชน",
        columns: ["คำ", "ความหมาย", "ตัวอย่าง"],
        rows: [
          ["government / ministry / department", "รัฐบาล / กระทรวง / กรม", "The **Ministry** of Interior issued a new rule."],
          ["agency / authority", "หน่วยงาน / หน่วยงานผู้มีอำนาจ", "Contact the local **authorities**."],
          ["official / civil servant", "เจ้าหน้าที่รัฐ / ข้าราชการพลเรือน", "A government **official** answered the phone."],
          ["citizen / resident", "พลเมือง / ผู้อยู่อาศัย", "Every **citizen** must have an ID card."],
          ["law / regulation / rule", "กฎหมาย / ระเบียบ / กฎ", "This is against the **regulations**."],
          ["duty / on duty / off duty", "หน้าที่ / ปฏิบัติหน้าที่อยู่ / ไม่ได้เข้าเวร", "Sergeant Somchai is **on duty** tonight."],
          ["commander / superior", "ผู้บังคับบัญชา", "Report to your **superior**."],
          ["public service", "บริการสาธารณะ", "Police officers provide a **public service**."],
          ["budget / expense", "งบประมาณ / ค่าใช้จ่าย", "The station's **budget** was increased."],
          ["policy / measure", "นโยบาย / มาตรการ", "New safety **measures** start next month."]
        ]
      },
      {
        type: "cards",
        eyebrow: "Office",
        title: "ศัพท์งานสำนักงาน (งานอำนวยการ)",
        items: [
          { name: "memorandum (memo)", sub: "บันทึกข้อความ (หนังสือภายใน)", example: "Please read the **memo** from the commander." },
          { name: "agenda / minutes", sub: "ระเบียบวาระ / รายงานการประชุม", example: "Item 3 on the **agenda** · The **minutes** were approved." },
          { name: "deadline / postpone", sub: "กำหนดส่ง / เลื่อนออกไป", example: "The meeting was **postponed** to Friday." },
          { name: "attachment / copy", sub: "สิ่งที่แนบมา / สำเนา", example: "Please bring a **copy** of your ID card." },
          { name: "submit / approve", sub: "ยื่น ส่ง / อนุมัติ", example: "**Submit** the form by 20 November." },
          { name: "application / signature", sub: "ใบสมัคร คำขอ / ลายมือชื่อ", example: "Put your **signature** at the bottom of the **application** form." },
          { name: "file / record", sub: "แฟ้ม จัดเก็บ / บันทึก ทะเบียน", example: "All reports are **filed** in the records room." },
          { name: "coordinate", sub: "ประสานงาน", example: "She **coordinates** with other agencies." }
        ]
      },
      {
        type: "table",
        eyebrow: "Phrasal Verbs",
        title: "Phrasal verbs ที่ออกบ่อย",
        columns: ["phrasal verb", "ความหมาย", "คำเหมือน / ตัวอย่าง"],
        rows: [
          ["look into", "สืบสวน ตรวจสอบ", "**investigate** · The police are **looking into** the case."],
          ["look for", "มองหา ตามหา", "**search for** · We are **looking for** the missing child."],
          ["look after", "ดูแล", "**take care of** · Who **looks after** the lost property?"],
          ["put off", "เลื่อน", "**postpone** · The meeting was **put off** until Monday."],
          ["call off", "ยกเลิก", "**cancel** · The concert was **called off** because of the storm."],
          ["fill in / fill out", "กรอก (แบบฟอร์ม)", "**complete** · Please **fill in** this form."],
          ["carry out", "ดำเนินการ ปฏิบัติ", "**conduct, perform** · Officers **carried out** a search."],
          ["hand in", "ยื่น ส่ง", "**submit** · **Hand in** your report by Friday."],
          ["turn down", "ปฏิเสธ / ลดเสียง", "**reject** · His request was **turned down**."],
          ["find out", "ค้นพบ สืบรู้", "**discover** · We need to **find out** what happened."],
          ["break into", "บุกรุกเข้าไป (เพื่อขโมย)", "Someone **broke into** the shop last night."],
          ["run away", "หลบหนี", "**escape, flee** · The thief **ran away** before the police came."]
        ]
      },
      {
        type: "compare",
        eyebrow: "Confusing Words",
        title: "effective vs efficient (คู่ที่ออกบ่อย)",
        left: { title: "effective", points: ["**ได้ผล** บรรลุเป้าหมาย", "an **effective** way to reduce crime"] },
        right: { title: "efficient", points: ["**มีประสิทธิภาพ** ใช้เวลา/ทรัพยากรคุ้ม", "an **efficient** system for handling complaints"] },
        verdict: "คู่อื่น: **affect** (v. ส่งผลต่อ) vs **effect** (n. ผล) · **economic** (เกี่ยวกับเศรษฐกิจ) vs **economical** (ประหยัด) · **lose** (v. ทำหาย) vs **loose** (adj. หลวม)"
      }
    ],
    traps: [
      { wrong: "minutes ในบริบทประชุม = นาที", right: "**minutes of the meeting = รายงานการประชุม**" },
      { wrong: "put off = ปิด (ไฟ)", right: "**put off = เลื่อน (postpone)** · ปิดไฟ = **turn off**" },
      { wrong: "look after = มองหา", right: "**look after = ดูแล** · มองหา = **look for** · สืบสวน = **look into**" },
      { wrong: "The new law will **effect** drivers.", right: "กริยา “ส่งผลต่อ” = **affect** · effect เป็นคำนาม (have an effect on)" }
    ],
    quiz: [
      { q: "“The police are looking into the robbery.” The phrase “looking into” is closest in meaning to ___.", choices: ["ignoring", "investigating", "reporting", "preventing"], answer: 1, why: "**look into = investigate** (สืบสวน)" },
      { q: "The meeting has been ___ until next Monday because the commander is ill.", choices: ["put off", "called off", "turned down", "handed in"], answer: 0, why: "เลื่อนไปวันอื่น (until next Monday) = **put off** · call off = ยกเลิกเลย" },
      { q: "The written record of what was discussed and decided at a meeting is the ___.", choices: ["agenda", "minutes", "memorandum", "attachment"], answer: 1, why: "**minutes** = รายงานการประชุม · agenda = วาระ (ก่อนประชุม)" }
    ],
    summary: "**official** เจ้าหน้าที่รัฐ · **on duty** เข้าเวร · **memo** บันทึกข้อความ · **agenda** วาระ / **minutes** รายงานการประชุม · **look into = investigate · look for = หา · look after = ดูแล** · **put off = postpone · call off = cancel** · **fill in = complete** · **affect (v) / effect (n)**"
  },
  {
    slug: "lesson-04",
    chapterNo: 4,
    sectionType: "chapter",
    title: "Conversation และ Reading Comprehension",
    kicker: "บทที่ 4 · บทสนทนา + อ่านจับใจความ",
    heroTitle: "ตอบให้ตรงหน้าที่ของประโยค · อ่านคำถามก่อนอ่านบทความ",
    lead: "ข้อบทสนทนาวัดว่าเลือก **คำตอบที่เหมาะกับสถานการณ์** ได้ไหม · ข้ออ่านวัด **main idea · detail · vocabulary in context · inference** จากข้อความสั้น ๆ เช่นข่าว ประกาศ หรืออีเมล",
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
          ["ทักทายครั้งแรก (ทางการ)", "How do you do?", "**How do you do?**"],
          ["ถามสารทุกข์", "How are you?", "I'm fine, thank you. And you?"],
          ["ขอความช่วยเหลือ", "Could you help me, please?", "**Sure. / Certainly. What can I do for you?**"],
          ["เสนอความช่วยเหลือ", "Would you like me to call a taxi for you?", "**Yes, please. / That would be great.**"],
          ["ขอบคุณ", "Thank you for your help, officer.", "**You're welcome. / My pleasure.**"],
          ["ขอโทษ", "Sorry, I'm late.", "**That's all right. / Never mind.**"],
          ["แสดงความยินดี", "I passed the exam!", "**Congratulations!**"],
          ["แสดงความเสียใจ", "I lost my wallet.", "**I'm sorry to hear that.**"],
          ["ปฏิเสธอย่างสุภาพ", "Can you help me move this box now?", "**I'm afraid I can't.** I'm on duty."]
        ]
      },
      {
        type: "cards",
        eyebrow: "Reading",
        title: "คำถามอ่าน 4 แบบ",
        items: [
          { name: "Main idea", sub: "What is the passage mainly about?", points: ["เลือกข้อที่**ครอบคลุมทั้งบทความ** ไม่แคบไม่กว้างเกิน"] },
          { name: "Detail", sub: "According to the passage, ...", points: ["หาคำตอบตรงในบทความ ระวัง**ตัวเลข เวลา สถานที่** และทิศทาง (rise vs fall)"] },
          { name: "Vocabulary in context", sub: "The word X is closest in meaning to ...", points: ["**แทนคำในประโยค**แล้วต้องได้ความหมายเดิม"] },
          { name: "Inference", sub: "It can be inferred that ...", points: ["สรุปได้จาก**ข้อมูลในบทความ** ไม่ใช่ความเห็นส่วนตัว"] }
        ]
      },
      {
        type: "table",
        eyebrow: "News & Report Language",
        title: "คำบอกแนวโน้มและคำเชื่อมในข่าว/รายงาน",
        columns: ["หน้าที่", "คำที่ใช้"],
        rows: [
          ["เพิ่มขึ้น", "rise, increase, grow, **go up**, **jump** (พุ่ง)"],
          ["ลดลง", "fall, decline, drop, **decrease**, **go down**"],
          ["คงที่", "remain stable, **stay the same**, level off"],
          ["คำเชื่อมขัดแย้ง", "**however**, but, although, despite + N, whereas"],
          ["คำเชื่อมผล", "**therefore**, so, as a result, consequently"],
          ["คำเชื่อมเพิ่มเติม", "moreover, furthermore, **in addition**, also"]
        ],
        note: "**despite / in spite of + คำนาม/V-ing** · **although + ประโยค** → Despite **the heavy rain**, ... / Although **it rained heavily**, ..."
      },
      {
        type: "callout",
        tone: "warn",
        title: "กับดักข้อ Do you mind ...?",
        body: "mind = รังเกียจ · ถ้าอนุญาตต้องตอบ **No, not at all. / Of course not.** · ตอบ **Yes** แปลว่า “รังเกียจ” · ส่วน **Would you mind + V-ing?** = ช่วย...ได้ไหม (Would you mind **showing** me your ID card?)"
      }
    ],
    traps: [
      { wrong: "A: Do you mind if I sit here? B: Yes, go ahead.", right: "อนุญาตต้องตอบ **No, not at all. / Go ahead.** (Yes = รังเกียจ)" },
      { wrong: "Despite it rained, the parade went on.", right: "despite + คำนาม → **Despite the rain** หรือ **Although it rained**" },
      { wrong: "ข้อ main idea เลือกรายละเอียดตัวเลขที่ถูกต้อง", right: "main idea ต้อง **ครอบคลุมทั้งบทความ** · รายละเอียดที่ถูกแต่แคบไม่ใช่คำตอบ" },
      { wrong: "A: I lost my passport. B: Congratulations!", right: "ข่าวร้าย → **I'm sorry to hear that.** · Congratulations ใช้กับข่าวดี" }
    ],
    quiz: [
      { q: "A: Thank you so much for helping me find my bag. B: ___", choices: ["Never mind.", "My pleasure.", "Go ahead.", "Congratulations."], answer: 1, why: "ตอบรับคำขอบคุณ = **My pleasure. / You're welcome.**" },
      { q: "A: Do you mind if I park my car here for a minute? B: ___ This is a no-parking zone.", choices: ["No, not at all.", "Yes, I'm afraid I do.", "Go ahead.", "Of course not."], answer: 1, why: "ผู้ตอบ**ไม่อนุญาต** (มีป้ายห้ามจอด) → ตอบ **Yes** = รังเกียจ · ตัวเลือกอื่นแปลว่าอนุญาต" },
      { q: "“Thefts in the market declined last month.” The word “declined” means ___.", choices: ["increased", "decreased", "stayed the same", "were reported"], answer: 1, why: "**decline = ลดลง** = decrease" }
    ],
    summary: "Thank you → **My pleasure** · Sorry → **That's all right** · ข่าวร้าย → **I'm sorry to hear that** · **Do you mind if ...? → No, not at all** (Yes = ไม่ยอม) · อ่าน: **main idea · detail · vocab · inference** · **despite + N / although + ประโยค**"
  },
  {
    slug: "lesson-05",
    chapterNo: 5,
    sectionType: "chapter",
    title: "คำศัพท์งานตำรวจ ป้าย ประกาศ และบทสนทนาบริการประชาชน",
    kicker: "บทที่ 5 · ศัพท์ตำรวจ + ป้าย + บทสนทนา",
    heroTitle: "suspect · witness · victim · KEEP OUT · How can I help you?",
    lead: "บทที่ใกล้งานจริงที่สุด: **ศัพท์คดีและบริการประชาชน** · **ป้ายและประกาศ** · **ประโยคช่วยนักท่องเที่ยว บอกทาง รับแจ้งความ รับโทรศัพท์** · ข้อสอบชอบถามความหมายป้ายและเลือกประโยคตอบให้เหมาะ",
    formula: { label: "สูตรจำคนในคดี", value: "suspect สงสัย → arrest จับ → charge แจ้งข้อหา · witness เห็น · victim โดน", note: "ผู้ต้องสงสัย · ผู้เห็นเหตุการณ์ · ผู้เสียหาย" },
    recall: [
      { label: "สายด่วน", value: "**191** เหตุด่วนเหตุร้าย · **1155** ตำรวจท่องเที่ยว · **1669** เจ็บป่วยฉุกเฉิน · **199** ดับเพลิง" },
      { label: "แจ้งความ", value: "**file a report / report a crime** · ร้องเรียน = **make a complaint**" },
      { label: "AUTHORIZED PERSONNEL ONLY", value: "**เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต** คนทั่วไปห้ามเข้า" }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Crime & Investigation",
        title: "ศัพท์คนและคดี (20 คำ)",
        columns: ["คำ", "ความหมาย", "ตัวอย่าง"],
        rows: [
          ["police officer", "เจ้าหน้าที่ตำรวจ", "A **police officer** stopped the car."],
          ["police station", "สถานีตำรวจ", "Where is the nearest **police station**?"],
          ["suspect", "ผู้ต้องสงสัย", "The **suspect** was seen near the bank."],
          ["witness", "พยาน ผู้เห็นเหตุการณ์", "A **witness** saw the man run away."],
          ["victim", "ผู้เสียหาย เหยื่อ", "The **victim** was taken to hospital."],
          ["criminal / offender", "อาชญากร / ผู้กระทำผิด", "The **offender** was fined 500 baht."],
          ["crime / crime scene", "อาชญากรรม / ที่เกิดเหตุ", "Do not touch anything at the **crime scene**."],
          ["arrest", "จับกุม", "The police **arrested** two men."],
          ["warrant", "หมาย (หมายจับ / หมายค้น)", "an arrest **warrant** · a search **warrant**"],
          ["charge", "แจ้งข้อหา / ข้อหา", "He was **charged** with theft."],
          ["investigate / investigation", "สืบสวน / การสืบสวน", "The case is under **investigation**."],
          ["evidence", "หลักฐาน (นับไม่ได้)", "There is not enough **evidence**."],
          ["fingerprint", "ลายนิ้วมือ", "**Fingerprints** were found on the door."],
          ["patrol", "ลาดตระเวน สายตรวจ", "Officers **patrol** the market at night."],
          ["theft / thief", "การลักทรัพย์ / ขโมย", "Report the **theft** of your phone."],
          ["robbery", "การชิงทรัพย์/ปล้น (ใช้กำลังหรือขู่)", "an armed **robbery** at a gold shop"],
          ["burglary", "การบุกรุกเข้าบ้าน/อาคารเพื่อลักทรัพย์", "a **burglary** while the family was away"],
          ["assault", "การทำร้ายร่างกาย", "He was arrested for **assault**."],
          ["fraud / scam", "การฉ้อโกง / กลโกงหลอกลวง", "Beware of phone **scams**."],
          ["custody / bail", "การควบคุมตัว / การประกันตัว", "He is in police **custody**. · He was released on **bail**."]
        ]
      },
      {
        type: "table",
        eyebrow: "Public Service & Traffic",
        title: "ศัพท์บริการประชาชนและจราจร (20 คำ)",
        columns: ["คำ", "ความหมาย", "ตัวอย่าง"],
        rows: [
          ["report", "แจ้ง รายงาน / รายงาน", "I'd like to **report** a stolen bike."],
          ["complaint", "การร้องเรียน", "You can make a **complaint** at the front desk."],
          ["lost and found", "แผนกของหาย-ได้คืน", "Ask at the **lost and found** office."],
          ["missing person", "บุคคลสูญหาย", "We have a **missing person** report."],
          ["ID card / passport", "บัตรประชาชน / หนังสือเดินทาง", "May I see your **passport**, please?"],
          ["driving licence (US: driver's license)", "ใบอนุญาตขับขี่", "Please show me your **driving licence**."],
          ["fine", "ค่าปรับ / ปรับ", "You must pay a **fine** of 500 baht."],
          ["ticket", "ใบสั่ง", "He got a parking **ticket**."],
          ["traffic / traffic jam", "การจราจร / รถติด", "**Traffic** is heavy this morning."],
          ["traffic lights", "สัญญาณไฟจราจร", "Turn right at the **traffic lights**."],
          ["speed limit", "ความเร็วจำกัด", "The **speed limit** here is 80 km/h."],
          ["checkpoint", "จุดตรวจ ด่านตรวจ", "Police set up a **checkpoint** on the highway."],
          ["accident / injured", "อุบัติเหตุ / ได้รับบาดเจ็บ", "Two people were **injured** in the **accident**."],
          ["drunk driving", "เมาแล้วขับ", "**Drunk driving** is a serious offence."],
          ["helmet / seat belt", "หมวกกันน็อก / เข็มขัดนิรภัย", "Always wear a **helmet**."],
          ["emergency", "เหตุฉุกเฉิน", "In an **emergency**, call 191."],
          ["ambulance", "รถพยาบาล", "Please call an **ambulance**!"],
          ["appointment", "การนัดหมาย", "Do you have an **appointment** with the inspector?"],
          ["form / copy", "แบบฟอร์ม / สำเนา", "Fill in this **form** and attach a **copy** of your passport."],
          ["tourist police", "ตำรวจท่องเที่ยว", "Call the **tourist police** at 1155."]
        ],
        note: "**fine** ในบริบทกฎหมาย = **ค่าปรับ** (ไม่ใช่ “ดี”) · **licence** = สะกดแบบอังกฤษ (n.) · **license** = สะกดแบบอเมริกัน"
      },
      {
        type: "table",
        eyebrow: "Signs & Notices",
        title: "ป้ายและประกาศที่ต้องรู้",
        columns: ["ป้าย", "ความหมาย"],
        rows: [
          ["NO PARKING", "**ห้ามจอด**"],
          ["NO ENTRY / DO NOT ENTER", "**ห้ามเข้า**"],
          ["AUTHORIZED PERSONNEL ONLY", "**เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต**"],
          ["STAFF ONLY", "**เฉพาะพนักงาน**"],
          ["KEEP OUT", "**ห้ามเข้า** (อันตราย/พื้นที่หวงห้าม)"],
          ["POLICE LINE – DO NOT CROSS", "**แนวเขตตำรวจ ห้ามข้าม** (ที่เกิดเหตุ)"],
          ["NO SMOKING", "**ห้ามสูบบุหรี่**"],
          ["ONE WAY", "**เดินรถทางเดียว**"],
          ["NO U-TURN", "**ห้ามกลับรถ**"],
          ["KEEP LEFT", "**ชิดซ้าย**"],
          ["GIVE WAY (US: YIELD)", "**ให้ทาง** (ให้รถทางหลักไปก่อน)"],
          ["SLOW DOWN", "**ลดความเร็ว**"],
          ["PEDESTRIAN CROSSING", "**ทางข้าม**"],
          ["VEHICLES WILL BE TOWED", "**รถที่จอดจะถูกยก/ลาก**"],
          ["EMERGENCY EXIT", "**ทางออกฉุกเฉิน**"],
          ["OUT OF ORDER", "**เสีย ใช้การไม่ได้**"],
          ["CAUTION: WET FLOOR", "**ระวังพื้นเปียก**"],
          ["CCTV IN OPERATION", "**มีกล้องวงจรปิดบันทึกภาพ**"]
        ],
        note: "ป้ายมักใช้ **passive ย่อ** หรือ **ตัด be**: Smoking (is) prohibited · Vehicles will be towed · **ONLY** ท้ายป้าย = จำกัดเฉพาะกลุ่มนั้น"
      },
      {
        type: "cards",
        eyebrow: "Dialogue Patterns",
        title: "บทสนทนาบริการประชาชน 4 สถานการณ์",
        items: [
          { name: "ช่วยนักท่องเที่ยว", tag: "Helping a tourist", sub: "เริ่มด้วยการเสนอความช่วยเหลือ", points: ["**How can I help you? / What seems to be the problem?**", "Tourist: I've lost my passport. → **When and where did you last see it?**", "**Please fill in this form.** / **Please wait here for a moment.**"], example: "Don't worry. **We will do our best to help you.**" },
          { name: "บอกทาง", tag: "Giving directions", sub: "Excuse me, how do I get to ...? / Where is ...?", points: ["**Go straight ahead** · **Turn left/right at** the traffic lights", "**It's on your left/right** · **next to / opposite / between**", "**It's about five minutes' walk.**"], example: "Go straight for two blocks, then turn right. The police station is **opposite** the bank." },
          { name: "รับแจ้งความ", tag: "Taking a report", sub: "ถามข้อมูลให้ครบ ใคร-อะไร-เมื่อไร-ที่ไหน", points: ["**What happened? / When and where did it happen?**", "**Can you describe the man?** How tall was he? **What was he wearing?**", "**Could I see your ID card / passport, please?**"], example: "Officer: **Did you see which way he went?** Victim: He ran towards the market." },
          { name: "รับโทรศัพท์", tag: "Phone calls", sub: "รับสายสุภาพ ขอชื่อ ขอเบอร์ ขอให้รอ", points: ["**Good morning, Riverside Police Station. How may I help you?**", "**Could you hold on, please? / Please hold the line.**", "**Could you speak more slowly, please? / May I have your name and phone number?**"], example: "I'm sorry, the inspector is not in. **May I take a message?**" }
        ]
      },
      {
        type: "callout",
        tone: "tip",
        title: "ประโยคสุภาพที่ใช้ได้ทุกสถานการณ์",
        body: "ขอ: **Could you ..., please? / May I ...?** · ขอโทษที่ต้องรบกวน: **Excuse me, ...** · ปฏิเสธ: **I'm afraid ...** · เห็นใจ: **I'm sorry to hear that.** · ข้อสอบมักให้เลือก **ประโยคที่สุภาพและตรงสถานการณ์ที่สุด** ตัวเลือกห้วน ๆ (Wait! / What?) มักผิด"
      }
    ],
    traps: [
      { wrong: "witness = ผู้เสียหาย", right: "**witness = ผู้เห็นเหตุการณ์ (พยาน)** · **victim = ผู้เสียหาย** · **suspect = ผู้ต้องสงสัย**" },
      { wrong: "pay a fine = จ่ายดี", right: "**fine = ค่าปรับ** · You must pay a **fine**." },
      { wrong: "AUTHORIZED PERSONNEL ONLY = ทุกคนเข้าได้", right: "**เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต** · คนทั่วไปห้ามเข้า" },
      { wrong: "robbery = burglary = theft ใช้แทนกันได้หมด", right: "**theft** ลักทรัพย์ทั่วไป · **robbery** ใช้กำลัง/ขู่ต่อหน้า · **burglary** บุกเข้าอาคาร" },
      { wrong: "I lost. = ฉันหลงทาง", right: "หลงทาง = **I'm lost.** · ทำของหาย = **I lost my wallet.**" }
    ],
    quiz: [
      { q: "A person who sees a crime happen and can tell the police about it is called a ___.", choices: ["suspect", "victim", "witness", "thief"], answer: 2, why: "**witness** = ผู้เห็นเหตุการณ์ · victim = ผู้เสียหาย · suspect = ผู้ต้องสงสัย" },
      { q: "A sign that says “AUTHORIZED PERSONNEL ONLY” means ___.", choices: ["Everyone is welcome.", "Only permitted staff may enter.", "Parking is free here.", "This area is closed forever."], answer: 1, why: "**เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต**เท่านั้นที่เข้าได้" },
      { q: "Tourist: Excuse me, how do I get to the police station? Officer: ___", choices: ["Yes, I do.", "Go straight and turn left at the traffic lights.", "It's 9 o'clock.", "You're welcome."], answer: 1, why: "ถามทาง → ตอบด้วย**การบอกทาง** (go straight · turn left at ...)" }
    ],
    summary: "**suspect** ผู้ต้องสงสัย · **witness** พยาน · **victim** ผู้เสียหาย · **arrest** จับ · **warrant** หมาย · **charged with** แจ้งข้อหา · **evidence** หลักฐาน · **fine** ค่าปรับ · **lost and found** · ป้าย **KEEP OUT / AUTHORIZED PERSONNEL ONLY / NO U-TURN / GIVE WAY** · บริการ: **How can I help you? · Go straight, turn left · Can you describe ...? · May I take a message?**"
  },
  {
    slug: "quick-review",
    chapterNo: 6,
    sectionType: "quick_review",
    title: "โน้ตทบทวนก่อนสอบ",
    kicker: "Quick Review · ภาษาอังกฤษ",
    heroTitle: "ทวนภาษาอังกฤษ 15 ข้อในหน้าเดียว",
    lead: "อ่านหน้านี้ก่อนเข้าห้องสอบ รวม**กฎไวยากรณ์ที่ออกซ้ำ** **ศัพท์ที่ชอบสลับ** และ**ประโยคตอบที่ต้องจำ**",
    formula: { label: "ภาษาอังกฤษ", value: "15 ข้อ จาก 150", note: "ไวยากรณ์ · คำศัพท์ · บทสนทนา · ป้าย · อ่านจับใจความ" },
    recall: [
      { label: "ไวยากรณ์", value: "**since → have+V3 · ago → V2 · The number of = เอกพจน์ · the police = พหูพจน์**" },
      { label: "Preposition", value: "**accused of · charged with · arrested for · comply with · responsible for**" },
      { label: "บทสนทนา", value: "**Thank you → My pleasure · Do you mind ...? → No, not at all · May I take a message?**" }
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Grammar",
        title: "กฎไวยากรณ์ที่ออกซ้ำ",
        columns: ["ถ้าโจทย์มี…", "คำตอบ"],
        rows: [
          ["since / for / already / yet", "**has/have + V3**"],
          ["yesterday / last ... / ... ago", "**V2**"],
          ["by + เวลาในอนาคต", "**will have + V3**"],
          ["ผู้ถูกกระทำ (ถูกจับ ถูกขโมย)", "**be + V3** (was arrested · was stolen)"],
          ["Neither A nor B / Either A or B", "กริยาตาม **B**"],
          ["The number of + N", "**เอกพจน์** (has / is)"],
          ["the police", "**พหูพจน์** (are / have)"],
          ["evidence / information / luggage", "**นับไม่ได้** ไม่เติม s"],
          ["would + V1 ในผล", "If + **V2 / were**"],
          ["would have + V3 ในผล", "If + **had V3**"],
          ["คำนามตามหลังช่องว่าง (___ bag)", "**whose**"],
          ["หลัง comma แทนสิ่งของ", "**which** (ห้าม that)"],
          ["despite / in spite of", "+ **คำนาม / V-ing**"],
          ["although", "+ **ประโยค**"]
        ]
      },
      {
        type: "table",
        eyebrow: "Vocabulary Pairs",
        title: "ศัพท์ที่ชอบสลับกัน",
        columns: ["คำ", "ความหมาย"],
        rows: [
          ["suspect / witness / victim", "**ผู้ต้องสงสัย / พยาน / ผู้เสียหาย**"],
          ["theft / robbery / burglary", "**ลักทรัพย์ / ชิงทรัพย์ / บุกเข้าอาคารลักทรัพย์**"],
          ["arrest warrant / search warrant", "**หมายจับ / หมายค้น**"],
          ["fine / ticket", "**ค่าปรับ / ใบสั่ง**"],
          ["look into / look for / look after", "**สืบสวน / ตามหา / ดูแล**"],
          ["put off / call off", "**เลื่อน / ยกเลิก**"],
          ["agenda / minutes", "**วาระ / รายงานการประชุม**"],
          ["affect / effect", "**ส่งผล (v.) / ผล (n.)**"],
          ["effective / efficient", "**ได้ผล / มีประสิทธิภาพ**"],
          ["I'm lost. / I lost my bag.", "**หลงทาง / ทำกระเป๋าหาย**"]
        ]
      },
      {
        type: "table",
        eyebrow: "Signs",
        title: "ป้ายที่ออกบ่อย",
        columns: ["ป้าย", "ความหมาย"],
        rows: [
          ["AUTHORIZED PERSONNEL ONLY", "**เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต**"],
          ["KEEP OUT / NO ENTRY", "**ห้ามเข้า**"],
          ["NO PARKING · VEHICLES WILL BE TOWED", "**ห้ามจอด · จอดแล้วถูกยก**"],
          ["NO U-TURN · ONE WAY · GIVE WAY", "**ห้ามกลับรถ · ทางเดียว · ให้ทาง**"],
          ["OUT OF ORDER", "**เสีย ใช้การไม่ได้**"]
        ]
      },
      {
        type: "numbers",
        eyebrow: "Hotlines",
        title: "สายด่วนที่ควรจำ",
        items: [
          { value: "191", label: "เหตุด่วนเหตุร้าย (ตำรวจ)" },
          { value: "1155", label: "ตำรวจท่องเที่ยว (Tourist Police)" },
          { value: "1669", label: "เจ็บป่วยฉุกเฉิน (ambulance)" },
          { value: "199", label: "ดับเพลิง (fire)" }
        ]
      }
    ],
    traps: [
      { wrong: "The police **is** here.", right: "the police = พหูพจน์ → The police **are** here." },
      { wrong: "Do you mind if I sit here? — **Yes**, please sit.", right: "อนุญาต = **No, not at all.**" },
      { wrong: "He was charged **of** theft.", right: "**charged with** · accused **of**" }
    ],
    quiz: [
      { q: "The number of road accidents ___ dropped this year.", choices: ["have", "has", "are", "were"], answer: 1, why: "**The number of** = เอกพจน์ → **has** dropped" },
      { q: "A: I've lost my passport. B: ___", choices: ["Congratulations!", "I'm sorry to hear that. When did you last see it?", "You're welcome.", "Never mind, it's nothing."], answer: 1, why: "เห็นใจ + ถามข้อมูลต่อ = ตอบตรงสถานการณ์**แจ้งของหาย**" },
      { q: "The sign “NO U-TURN” means ___.", choices: ["You cannot turn around here.", "You must turn left.", "You cannot park here.", "The road is closed."], answer: 0, why: "**NO U-TURN = ห้ามกลับรถ**" }
    ],
    summary: "ภาษาอังกฤษ **15 ข้อ** · ไวยากรณ์: **tense จากคำบอกเวลา · ประธานแท้ · passive · If · whose/which** · ศัพท์: **suspect/witness/victim · fine · look into · put off** · ป้าย **AUTHORIZED PERSONNEL ONLY** · ตอบสุภาพ **My pleasure · No, not at all · I'm sorry to hear that**"
  }
];

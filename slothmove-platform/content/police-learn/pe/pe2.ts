import type { Lesson } from '@/lib/learn/types';

// pe2 · Grammar 2: Modal Passive Conditional Relative Clause และอื่น ๆ (police อก.1 course).
// Grammar rules are general knowledge (no official document states them): every block and MCQ is `plain: true`,
// labelled once "ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ". Only the English question count cites the scope summary.
// Emphasis from the 6 police mock tests (subjectId "english", 90 items), items in this lesson's scope:
// passive 5 (are checked, are reviewed, was found, was built, active→passive) → must;
// gerund/infinitive 4 (enjoy ×2, look forward to, be used to) → must; prepositions 4 (in September, at + address,
// at 7:30, charged with) → must; comparison 4 (shorter ×2, more fluently, the tallest) → must;
// relative clauses 3 (who, where, which) → must; conditionals 2 (type 2, unless) → maybe; question tags 1 → maybe;
// modals 0 direct items (only inside modal passive) → maybe.
// Reuses the passive / conditional / relative-clause rules of content/nesdc-learn/e/e1.ts with simpler sentences.
// Tenses, subject–verb agreement and articles are pe1. Every English sentence is our own (ประโยคตัวอย่างที่เราแต่ง).
// Avoided as test keys: disputed usage (in/on + street name, which vs that in defining clauses, ergative verbs such
// as break in passive items, mixed conditionals: the type-3 item carries "last night" to rule out "wore").

export const lesson: Lesson = {
  id: 'pe2',
  topic: 'pe',
  order: 2,
  priority: 'must',
  title: 'Grammar 2: Modal Passive Conditional Relative Clause และอื่น ๆ',
  lead: 'ไวยากรณ์ชุดที่สองที่ข้อสอบเติมคำชอบถาม เลือก passive เมื่อประธานถูกกระทำ เลือก who, which, where, whose จากคำที่ตามหลัง เปรียบเทียบให้ถูกขั้น เลือก V-ing หรือ to V ใช้ in, on, at ให้ถูก แล้วปิดท้ายด้วย modal ประโยค if และ question tag',
  minutes: 30,
  jumps: [
    ['passive', 'Passive'],
    ['rel', 'Relative'],
    ['verb', 'V-ing/to'],
    ['if', 'If · Tag'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · บทนี้เรียนอะไร',
      title: 'ดูคำรอบช่องว่าง แล้วถามคำถามเดียวให้ตรงเรื่อง',
      priority: 'must',
      plain: true,
      body: [
        'บทนี้ต่อจากบทที่ 1 ของหัวข้อนี้ (ชนิดคำ tense ประธานกับกริยา article) แต่ละเรื่องในบทนี้มี**คำถามประจำตัว**หนึ่งข้อ เช่น passive ถามว่า “ประธานทำเอง หรือถูกทำ” relative clause ถามว่า “หลังช่องว่างขาดอะไร” ถ้าถามถูกเรื่อง ข้อจะจบในไม่กี่วินาที',
        'เรียงตามที่พบบ่อยในชุดข้อสอบเสมือนจริง: passive, relative clause, การเปรียบเทียบ, V-ing กับ to V และคำบุพบท ส่วน modal ประโยค if และ question tag พบน้อยกว่า จึงรวมไว้ท้ายบทเป็นส่วนอ่านถ้ามีเวลา',
      ],
      blocks: [
        {
          type: 'note',
          title: 'ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ',
          plain: true,
          body: 'กฎในบทนี้เป็น**ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ** ตามที่สอนในระดับมัธยมและการเตรียมสอบราชการ ไม่มีเอกสารราชการกำหนด จึงไม่มีเลขหน้าอ้างอิง ประโยคภาษาอังกฤษทุกประโยคในบทนี้เป็น**ประโยคตัวอย่างที่เราแต่ง** ชื่อคนและสถานีตำรวจในประโยคเป็นชื่อสมมติ',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          refs: [{ doc: 'police-exam-scope-summary' }],
          body: 'วิชาภาษาอังกฤษมี 15 ข้อ (ตามสรุปขอบเขตจากประกาศ) จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ใน 90 ข้อภาษาอังกฤษของ 6 ชุด เรื่องในบทนี้พบดังนี้ passive 5 ข้อ V-ing/to V 4 ข้อ คำบุพบท 4 ข้อ การเปรียบเทียบ 4 ข้อ relative clause 3 ข้อ ประโยค if 2 ข้อ question tag 1 ข้อ และไม่พบข้อ modal โดยตรง เกือบทั้งหมดเป็นเติมคำในประโยคเดียว',
        },
      ],
    },

    // 2 · passive (+ modal passive)
    {
      type: 'section',
      anchor: 'passive',
      eyebrow: '2 · Passive voice',
      title: 'ประธานถูกกระทำ ใช้ be + V3 แล้วให้ be บอกเวลา',
      priority: 'must',
      plain: true,
      body: [
        '**Passive voice** (ประโยคที่ประธานเป็นผู้ถูกกระทำ) ใช้เมื่อสิ่งที่ถูกทำสำคัญกว่าคนทำ เช่น The suspect was arrested. (ผู้ต้องสงสัยถูกจับ) รูปคือ **be + V3** (V3 = กริยาช่องที่ 3) ถ้าอยากบอกผู้ทำ ให้ใส่ by … ต่อท้าย',
        'กริยาหลักเป็น V3 เสมอ ส่วนที่เปลี่ยนตาม tense คือ **be** ดังนั้นให้หาคำบอกเวลาก่อน แล้วเลือกรูป be ให้ตรง เหมือนที่เรียนในบทที่ 1',
      ],
      blocks: [
        {
          type: 'table',
          title: 'รูป passive ที่ต้องรู้',
          plain: true,
          rows: [
            ['เวลา', 'รูป', 'ตัวอย่าง'],
            ['Present simple', 'is/are + V3', 'Reports are checked daily.'],
            ['Past simple', 'was/were + V3', 'The car was found yesterday.'],
            ['Present perfect', 'has/have been + V3', 'The files have been sent.'],
            ['Future', 'will be + V3', 'You will be called soon.'],
            ['Modal', 'must/can/should be + V3', 'Forms must be signed.'],
            ['Continuous', 'is/are being + V3', 'The road is being repaired.'],
          ],
          highlightCol: 1,
        },
        {
          type: 'table',
          title: 'V3 ที่ไม่เติม -ed ซึ่งพบบ่อยในเรื่องงานตำรวจ',
          plain: true,
          rows: [
            ['V1', 'V2', 'V3'],
            ['steal', 'stole', 'stolen'],
            ['catch', 'caught', 'caught'],
            ['find', 'found', 'found'],
            ['take', 'took', 'taken'],
            ['write', 'wrote', 'written'],
            ['build', 'built', 'built'],
            ['give', 'gave', 'given'],
          ],
          after: 'กับดักที่พบบ่อยคือใช้ V2 แทน V3 เช่น ✗ was stole ต้องเป็น was stolen ✗ has took ต้องเป็น has taken ถ้าตัวเลือกมีทั้ง V2 และ V3 หลัง be ให้เลือก V3',
        },
        {
          type: 'list',
          title: 'สามกฎที่ข้อสอบชอบ (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'ถามว่าประธานทำเองได้ไหม', desc: 'All visitors’ bags **are checked** at the gate. กระเป๋าตรวจตัวเองไม่ได้ จึงเป็น passive ถ้าเลือก check หรือ are checking จะแปลว่ากระเป๋าเป็นผู้ตรวจ' },
            { name: 'Modal + be + V3', desc: 'The form **must be signed** by the applicant. หลัง modal ใช้ be รูปเดิม แล้วตามด้วย V3 ✗ must signed ✗ must be sign' },
            { name: 'กริยาที่ไม่มีกรรมทำ passive ไม่ได้', desc: 'happen, occur, arrive, die, rise ไม่มีกรรม จึงไม่มีรูป passive ✗ The accident was happened at 10 p.m. ต้องเป็น The accident happened at 10 p.m.' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: เปลี่ยน “Somebody has taken the case files from the cabinet.” เป็น passive ข้อใดถูก ระหว่าง “The case files have taken from the cabinet.” “The case files have been taken from the cabinet.” “The case files has been took from the cabinet.” และ “The case files were taking from the cabinet.”',
          steps: [
            'ย้ายกรรม the case files ขึ้นเป็นประธาน ประธานใหม่เป็นพหูพจน์ จึงใช้ have',
            'ประโยคเดิมเป็น present perfect (has taken) be ในรูปนี้คือ have been แล้วตามด้วย V3 ได้ have been taken ส่วน somebody ไม่ต้องใส่ เพราะไม่รู้ว่าใคร',
            '“have taken” ขาด been จึงกลายเป็น active แปลว่าแฟ้มเป็นผู้เอาไป “has been took” ผิดทั้งพจน์และใช้ V2 แทน V3 ส่วน “were taking” เป็น active รูป continuous',
          ],
          answer: 'The case files have been taken from the cabinet.',
          trap: 'อย่าลืม been ใน present perfect passive และอย่าใช้ V2 (took) หลัง be หรือ been',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) passive พบบ่อยที่สุดในบทนี้ ส่วนมากเป็นเติมคำที่มี by … หรือมีประธานเป็นสิ่งของ เช่น เอกสาร รถ อาคาร และบางข้อให้เลือกประโยค passive ที่ตรงกับประโยค active ขั้นตอน: ถามว่าประธานทำเองได้ไหม ถ้าไม่ได้ให้หา be + V3 แล้วดูคำบอกเวลาเพื่อเลือกรูป be',
        },
      ],
    },

    // 3 · relative clauses
    {
      type: 'section',
      anchor: 'rel',
      eyebrow: '3 · Relative clause',
      title: 'ดูคำหน้าช่องว่างว่าเป็นคนหรือสิ่งของ แล้วดูว่าหลังช่องว่างขาดอะไร',
      priority: 'must',
      plain: true,
      body: [
        '**Relative clause** (อนุประโยคขยายคำนาม) คือส่วนที่บอกว่า “คนไหน อันไหน ที่ไหน” เช่น The officer **who helped me** was kind. คำที่ขึ้นต้นส่วนนี้เรียกว่า relative pronoun',
        'วิธีเลือกมีสองขั้น ขั้นแรกดูคำนามหน้าช่องว่าง เป็นคน สิ่งของ หรือสถานที่ ขั้นที่สองดูหลังช่องว่าง ถ้า**ขาดประธานหรือกรรม** ใช้ who/which/that ถ้า**ประโยคข้างหลังครบแล้ว** และหมายถึงสถานที่ ใช้ where ถ้าหลังช่องว่างเป็น**คำนามที่เป็นของ**คำข้างหน้า ใช้ whose',
      ],
      blocks: [
        {
          type: 'table',
          title: 'เลือก relative pronoun',
          plain: true,
          rows: [
            ['คำ', 'ใช้กับ', 'ตัวอย่าง'],
            ['who', 'คน (ประธานหรือกรรม)', 'the man who called'],
            ['whom', 'คน (กรรม ทางการ)', 'the man whom we met'],
            ['which', 'สิ่งของ สัตว์', 'the car which was stolen'],
            ['that', 'คนหรือสิ่งของ ไม่มีจุลภาค', 'the key that I lost'],
            ['whose + นาม', 'ความเป็นเจ้าของ', 'the girl whose bag was lost'],
            ['where', 'สถานที่ + ประโยคครบ', 'the room where we meet'],
          ],
          highlightCol: 1,
        },
        {
          type: 'list',
          title: 'กฎที่แยกตัวเลือกออกจากกัน (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'where กับ which: ดูว่าหลังช่องว่างครบไหม', desc: 'This is the office **where** I work. (I work ครบแล้ว) / This is the office **which** was painted last week. (ขาดประธานของ was painted) ✗ the office which I work ต้องเป็น where I work หรือ which I work in' },
            { name: 'whose ต้องมีคำนามตาม', desc: 'The man **whose** car was stolen is waiting outside. ✗ The man who car was stolen … ระวัง who’s = who is คนละคำกับ whose' },
            { name: 'มีจุลภาค ห้ามใช้ that', desc: 'My brother, **who** works in Bangkok, is a police officer. ✗ My brother, that works in Bangkok, … ส่วนที่อยู่ในจุลภาคเป็นข้อมูลเพิ่ม ใช้ who, whom, whose, which, where, when ได้ แต่ห้ามใช้ that เช่น Chiang Mai, **where** I grew up, is cold in winter.' },
            { name: 'กริยาในอนุประโยคผันตามคำที่มันขยาย', desc: 'The officers who **work** at night … (officers พหูพจน์) / The officer who **works** at night … (officer เอกพจน์)' },
            { name: 'ละได้ถ้าเป็นกรรม และไม่มีจุลภาค', desc: 'The laptop (that) I bought is new. ละ that ได้เพราะเป็นกรรมของ bought แต่ The officer who helped us … ละ who ไม่ได้ เพราะเป็นประธานของ helped' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “The village ___ the robbery took place is about ten kilometres from the station.” เติมคำใด ระหว่าง “which” “who” “whose” และ “where”',
          steps: [
            'คำหน้าช่องว่างคือ village ซึ่งเป็นสถานที่ ตัด “who” ออก เพราะใช้กับคน',
            'ดูหลังช่องว่าง: the robbery took place มีประธาน (the robbery) และกริยา (took place) ครบแล้ว ไม่ขาดอะไร จึงใช้ where (= in which)',
            '“which” ต้องเป็นประธานหรือกรรมของอนุประโยค แต่อนุประโยคนี้ครบแล้ว ส่วน “whose” ต้องตามด้วยคำนามที่ไม่มี the เช่น whose roads ซึ่งที่นี่มี the robbery ตามมา',
          ],
          answer: 'where',
          trap: 'เห็นคำนามสิ่งของแล้วรีบเลือก which ต้องดูหลังช่องว่างก่อน ถ้าประโยคครบและหมายถึงสถานที่ ใช้ where',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อ relative clause เป็นเติมคำ ตัวเลือกคือ who, which, whose, where, whom ให้เลือกตามสองขั้นข้างบน ถ้าเป็นข้อหาส่วนที่ผิด ให้มองหา that หลังจุลภาค และ who ที่ขยายสิ่งของ',
        },
      ],
    },

    // 4 · comparison
    {
      type: 'section',
      anchor: 'comp',
      eyebrow: '4 · การเปรียบเทียบ',
      title: 'than ใช้ขั้นกว่า the … in/of ใช้ขั้นสุด as … as ใช้รูปเดิม',
      priority: 'must',
      plain: true,
      body: [
        'การเปรียบเทียบมี 3 ขั้น คือ ขั้นเท่ากัน (as … as) ขั้นกว่า (comparative) และขั้นสุด (superlative) ข้อสอบมักใส่**คำบอกขั้น**ไว้ในประโยคแล้ว เช่น than, the … in, as … as ให้หาคำนั้นก่อน แล้วเลือกรูปคำให้ตรง',
        'คำพยางค์เดียวเติม -er/-est คำสองพยางค์ที่ลงท้าย -y เปลี่ยน y เป็น -ier/-iest (busy → busier, easy → easier, happy → happier) คำสองพยางค์อื่นส่วนใหญ่ใช้ more/most (บางคำได้ทั้งสองแบบ เช่น quiet, narrow, polite บทนี้จึงไม่ใช้คำกลุ่มนี้ในข้อทดสอบ) คำสามพยางค์ขึ้นไปใช้ more/most เสมอ และ**ห้ามใช้ซ้อน** เช่น ✗ more shorter ✗ the most tallest',
      ],
      blocks: [
        {
          type: 'table',
          title: 'วิธีสร้างขั้นกว่าและขั้นสุด',
          plain: true,
          rows: [
            ['คำ', 'ขั้นกว่า', 'ขั้นสุด'],
            ['พยางค์เดียว: fast, safe', 'faster, safer', 'the fastest, the safest'],
            ['สระเดียว+พยัญชนะ: big, hot', 'bigger, hotter', 'the biggest, the hottest'],
            ['สองพยางค์ลงท้าย -y: busy, easy, happy', 'busier, easier, happier', 'the busiest, the easiest, the happiest'],
            ['สองพยางค์อื่นส่วนใหญ่: careful, modern', 'more careful, more modern', 'the most careful, the most modern'],
            ['สามพยางค์ขึ้นไป: important, dangerous', 'more important', 'the most important'],
            ['กริยาวิเศษณ์ -ly: carefully', 'more carefully', 'the most carefully'],
            ['ผิดรูป: good/well, bad', 'better, worse', 'the best, the worst'],
            ['ผิดรูป: many/much, little, far', 'more, less, farther/further', 'the most, the least, the farthest/furthest'],
          ],
          highlightCol: 1,
        },
        {
          type: 'list',
          title: 'คำบอกขั้นในประโยค (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: '… than … → ขั้นกว่า', desc: 'The new car park is **safer than** the old one.' },
            { name: 'the … in/of … → ขั้นสุด', desc: 'This is **the busiest** road **in** the city. / He is **the best** shooter **of** all the trainees.' },
            { name: 'as + รูปเดิม + as → เท่ากัน', desc: 'This room is **as large as** that one. / This room is **not as large as** that one. ระหว่าง as กับ as ห้ามใส่ -er หรือ more' },
            { name: 'ขยายกริยา ใช้กริยาวิเศษณ์', desc: 'She speaks English **more fluently than** I do. / Please drive **as slowly as** you can. ✗ as slow as you can' },
            { name: 'even, much, far + ขั้นกว่า', desc: 'This year’s figures are **even worse**. / The new system is **much faster**. ใช้ very กับขั้นกว่าไม่ได้ ✗ very faster' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “The new car park is ___ than the old one because it has CCTV cameras.” เติมคำใด ระหว่าง “safe” “safer” “more safer” และ “the safest”',
          steps: [
            'หาคำบอกขั้น: มี than จึงต้องเป็นขั้นกว่า',
            'safe เป็นคำพยางค์เดียว ขั้นกว่าคือเติม -r ได้ safer',
            '“safe” เป็นรูปเดิม ใช้กับ than ไม่ได้ “more safer” ใช้ more ซ้อนกับ -er และ “the safest” เป็นขั้นสุด ใช้คู่กับ than ไม่ได้',
          ],
          answer: 'safer',
          trap: 'คำว่า more ฟังดูเป็นทางการ จึงชวนให้เลือก more safer แต่คำพยางค์เดียวเติม -er อย่างเดียว ห้ามมี more ซ้อน',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อเปรียบเทียบเป็นเติมคำที่มี than หรือ the … in ในประโยค ตัวเลือกคือคำเดียวกันสี่ขั้น เช่น short, shorter, the shortest, more short ให้วงคำบอกขั้นก่อน แล้วตัดรูปซ้อนทิ้ง ถ้าช่องว่างขยายกริยา ให้เลือกรูปกริยาวิเศษณ์',
        },
      ],
    },

    // 5 · gerund vs infinitive + prepositions
    {
      type: 'section',
      anchor: 'verb',
      eyebrow: '5 · V-ing, to V และคำบุพบท',
      title: 'กริยาหน้าช่องว่างเป็นตัวกำหนด และหลังคำบุพบทต้องเป็น V-ing',
      priority: 'must',
      plain: true,
      body: [
        'เมื่อกริยาสองตัวมาติดกัน ตัวหลังจะเป็น **V-ing** (gerund) หรือ **to + V1** (infinitive) ขึ้นกับกริยาตัวหน้า เรื่องนี้ไม่มีเหตุผลให้เดา ต้องจำกลุ่มกริยาที่ใช้บ่อย',
        'กฎที่ใช้ได้เกือบทุกครั้งคือ **หลังคำบุพบท** (in, on, at, of, for, about, without, before, after) ถ้าตามด้วยกริยา ต้องเป็น V-ing (ข้อยกเว้นที่ควรรู้: but/except + V1 เช่น He did nothing but complain. และ be about to + V1 เช่น The bus is about to leave.)',
        'to ส่วนใหญ่เป็นส่วนของ to + V1 (agree to, plan to, decide to, want to, hope to …) มีแค่**วลีชุดหนึ่งที่ต้องจำ**ซึ่ง to เป็นคำบุพบท จึงตามด้วยคำนามหรือ V-ing: look forward to, be used to / get used to, be accustomed to, object to, be committed to, be devoted to, when it comes to, in addition to, contribute to อย่าเดาจากการลองใส่คำนามหลัง to เพราะ agree to the plan ก็ได้ความ แต่ agree ตามด้วย to + V1 (agree to help) ส่วน go to + สถานที่ to เป็นคำบุพบทก็จริง แต่ไม่ตามด้วยกริยา',
      ],
      blocks: [
        {
          type: 'table',
          title: 'กริยาที่ตามด้วย V-ing หรือ to V',
          plain: true,
          rows: [
            ['ตามด้วย', 'กริยาที่พบบ่อย', 'ตัวอย่าง'],
            ['V-ing', 'enjoy, finish, avoid, mind, keep, suggest, admit, deny, practise', 'He enjoys running.'],
            ['to V', 'want, need (ดูหมายเหตุ), decide, plan, hope, agree, refuse, promise, expect, manage', 'She decided to apply.'],
            ['ได้ทั้งสอง ความหมายใกล้กัน', 'start, begin, like, love, hate, continue', 'It started raining / to rain.'],
            ['ได้ทั้งสอง ความหมายต่างกัน', 'stop, remember, forget, try, regret', 'ดูรายการข้างล่าง'],
          ],
          highlightCol: 1,
          after: 'หมายเหตุเรื่อง need: need + V-ing ใช้ได้ในความหมาย passive เช่น The car needs washing. (= needs to be washed) บทนี้จึงไม่ใช้ need ตัดสินระหว่าง V-ing กับ to V ในข้อทดสอบ',
        },
        {
          type: 'list',
          title: 'คู่ที่ต้องแยกให้ออก (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'stop + V-ing / stop + to V', desc: 'He stopped **smoking**. (เลิกสูบ) / He stopped **to smoke**. (หยุดสิ่งที่ทำอยู่ เพื่อจะสูบ)' },
            { name: 'remember + to V / remember + V-ing', desc: 'Remember **to lock** the door. (อย่าลืมล็อก เป็นงานที่ต้องทำ) / I remember **locking** the door. (จำได้ว่าล็อกไปแล้ว)' },
            { name: 'forget + to V / forget + V-ing', desc: 'Don’t forget **to sign** the form. (อย่าลืมเซ็น ยังไม่ได้ทำ) / I’ll never forget **meeting** the chief. (จะไม่ลืมว่าเคยได้พบ ทำไปแล้ว) ในทำนองเดียวกัน try to V = พยายาม / try V-ing = ลองทำดู และ regret to V = เสียใจที่ต้องแจ้ง / regret V-ing = เสียใจที่ทำไปแล้ว' },
            { name: 'used to + V1 / be used to + V-ing', desc: 'He **used to work** in Chiang Mai. (เคยทำ ตอนนี้ไม่ได้ทำแล้ว) / He **is used to working** at night. (เคยชินกับการทำงานกลางคืน) ตัวหลัง to เป็นคำบุพบท' },
            { name: 'หลังคำบุพบท → V-ing', desc: 'interested in **joining**, good at **drawing**, before **leaving**, without **asking**, instead of **writing**' },
            { name: 'วลีที่ to เป็นคำบุพบท → นาม / V-ing (ต้องจำเป็นชุด)', desc: 'I look forward to **meeting** you. / She is used to **working** at night. / He got used to **driving** in Bangkok. / We are committed to **serving** the public. / They objected to **paying** the fine. / When it comes to **writing** reports, she is the best. / In addition to **checking** IDs, the guard records car numbers. เทียบ to + V1: agree **to help**, plan **to leave**, decide **to stay**, want **to go**, hope **to see**' },
          ],
        },
        {
          type: 'table',
          title: 'คำบุพบทบอกเวลาและสถานที่: in, on, at',
          plain: true,
          rows: [
            ['คำ', 'เวลา', 'สถานที่'],
            ['at (จุด)', 'at 9 a.m., at noon, at night', 'at the station, at the door, at 24 Ratchada Road'],
            ['on (วัน / พื้นผิว)', 'on Monday, on 5 May, on Friday morning', 'on the desk, on the wall, on the third floor'],
            ['in (ช่วงยาว / ข้างใน)', 'in May, in 2025, in the morning', 'in the room, in the car, in Bangkok'],
          ],
          after: 'วิธีจำ: at แคบที่สุด (จุดเวลา จุดสถานที่ ที่อยู่ที่มีเลขที่) on กลาง (วัน วันที่ พื้นผิว ชั้นของอาคาร) in กว้างที่สุด (เดือน ปี ช่วงของวัน ข้างในพื้นที่ เมือง ประเทศ) ข้อยกเว้นที่ต้องจำ: at night แต่ in the morning และถ้ามีวันกำกับใช้ on เช่น on Monday morning หน้า this, next, last, every, tomorrow, yesterday ไม่ต้องใส่คำบุพบท ✗ on next Monday',
        },
        {
          type: 'list',
          title: 'คำบุพบทอื่นที่ใช้บ่อย (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'by กับ until', desc: 'Send the report **by** Friday. (ไม่เกินวันศุกร์) / Wait here **until** 5 p.m. (รอต่อเนื่องไปจนถึง 5 โมง)' },
            { name: 'for กับ during', desc: 'He stayed **for** two hours. (ระยะเวลากี่ชั่วโมง) / He slept **during** the meeting. (ในช่วงที่ประชุม)' },
            { name: 'คำบุพบทที่มากับคำในงานตำรวจ', desc: 'arrested **for** theft, charged **with** theft, accused **of** theft, responsible **for**, interested **in**, depend **on**, apply **for**' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “Sergeant Dang ___ in Chiang Mai, but now he works in Bangkok.” เติมคำใด ระหว่าง “is used to working” “used to work” “uses to work” และ “is used to work”',
          steps: [
            'ประโยคบอกว่าเคยทำในอดีต และตอนนี้ไม่ได้ทำแล้ว (but now he works in Bangkok) ความหมายนี้คือ used to + V1',
            '“is used to working” แปลว่าเคยชินกับการทำงานที่นั่น ไม่เข้ากับ but now … ส่วน “uses to work” ไม่มีรูปนี้ในภาษาอังกฤษ',
            '“is used to work” ผิดรูป เพราะ to หลัง be used เป็นคำบุพบท ต้องตามด้วย V-ing',
          ],
          answer: 'used to work',
          trap: 'used to (เคย) กับ be used to (เคยชิน) หน้าตาคล้ายกัน ให้ดูว่ามี be นำหน้าไหม ถ้ามี be ต้องตามด้วย V-ing',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อ V-ing/to V มักใช้กริยาอย่าง enjoy หรือ to ที่เป็นคำบุพบท เช่น look forward to, be used to ส่วนข้อคำบุพบทถาม at กับเวลาหรือที่อยู่ที่มีเลขที่ in กับเดือน และคำบุพบทที่มากับคำอย่าง charged ให้ดูคำที่อยู่ติดช่องว่างก่อน แล้วเทียบกับตารางข้างบน',
        },
      ],
    },

    // 6 · modals, conditionals, question tags (maybe)
    {
      type: 'section',
      anchor: 'if',
      eyebrow: '6 · Modal ประโยค if และ question tag',
      title: 'สามเรื่องที่พบน้อยกว่า แต่ใช้กฎสั้นแก้ได้',
      priority: 'maybe',
      plain: true,
      body: [
        '**Modal** (กริยาช่วยบอกความสามารถ ความจำเป็น ความเป็นไปได้) คือ can, could, may, might, must, should, will, would กฎหลักคือ **modal + V1** ไม่เติม -s ไม่มี to ✗ He can speaks ✗ You must to wear (ยกเว้น have to และ ought to ที่มี to อยู่ในตัว)',
        '**ประโยค if** (conditional) มี 4 แบบ ให้ดูกริยาส่วนผลแล้วจับคู่กับส่วน if ตามตาราง ส่วน **question tag** คือคำถามสั้นท้ายประโยค เช่น …, isn’t it? ใช้ถามยืนยัน',
      ],
      blocks: [
        {
          type: 'table',
          title: 'Modal ที่ต้องแยกความหมาย',
          plain: true,
          rows: [
            ['คำ', 'ความหมาย', 'ตัวอย่าง'],
            ['can / could', 'ทำได้, ขออนุญาต, ขอร้อง (could สุภาพกว่า)', 'Could I sit here? / Could you sign here?'],
            ['may / might', 'อาจจะ, ขออนุญาตแบบสุภาพ', 'May I come in?'],
            ['must', 'ต้อง (กฎ หน้าที่)', 'You must wear a helmet.'],
            ['must not', 'ห้าม', 'You mustn’t park here.'],
            ['don’t have to', 'ไม่จำเป็นต้อง', 'You don’t have to pay.'],
            ['should', 'ควร (คำแนะนำ)', 'You should lock your car.'],
          ],
          after: 'กับดักที่พบบ่อย: mustn’t แปลว่า “ห้าม” ส่วน don’t have to แปลว่า “ไม่ต้องก็ได้” ความหมายต่างกันมาก',
        },
        {
          type: 'table',
          title: 'ประโยค if 4 แบบ และ unless',
          plain: true,
          rows: [
            ['แบบ', 'ส่วน if', 'ส่วนผล'],
            ['0 ความจริงทั่วไป', 'If + V1', 'V1'],
            ['1 เป็นไปได้จริง', 'If + V1', 'will + V1'],
            ['2 สมมุติ ไม่ตรงกับตอนนี้', 'If + V2 (were)', 'would + V1'],
            ['3 สมมุติย้อนอดีต', 'If + had + V3', 'would have + V3'],
          ],
          highlightCol: 1,
          after: 'ประโยคตัวอย่างที่เราแต่ง: 0 If you heat ice, it melts. / 1 If it rains, the parade will be cancelled. / 2 If I were the chief, I would hire more staff. / 3 If he had left earlier, he would have caught the bus. กฎที่ข้อสอบชอบ: ส่วน if ของแบบ 1 **ปกติไม่ใช้ will** แม้จะพูดถึงอนาคต แบบ 2 ภาษาทางการใช้ were กับทุกประธาน และแบบ 3 ส่วน if ใช้ had + V3 ไม่ใช่ would have',
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “Unless the weather ___ better, the outdoor training will be moved indoors.” เติมคำใด ระหว่าง “gets” “doesn’t get” “will get” และ “got”',
          steps: [
            'unless แปลว่า if … not (ถ้าไม่) จึงมีความปฏิเสธอยู่ในตัวแล้ว',
            'ส่วนผลเป็น will be moved จึงเป็นแบบ 1 ส่วน unless ใช้ present simple ประธาน the weather เอกพจน์ ได้ gets',
            '“doesn’t get” ปฏิเสธซ้อนกับ unless ทำให้ความหมายกลับ “will get” ใส่ will ในส่วนเงื่อนไข และ “got” เป็นรูปของแบบ 2 ไม่เข้าคู่กับ will',
          ],
          answer: 'gets',
          trap: 'แปลไทยว่า “ถ้าอากาศไม่ดีขึ้น” แล้วใส่ not ซ้ำ ต้องจำว่าคำว่า “ไม่” อยู่ใน unless แล้ว',
        },
        {
          type: 'list',
          title: 'Question tag: กลับบวกเป็นลบ แล้วใช้กริยาช่วยตัวเดิม',
          plain: true,
          items: [
            { name: 'บอกเล่า → tag ปฏิเสธ / ปฏิเสธ → tag บอกเล่า', desc: 'The documents are ready, **aren’t they**? / He isn’t at work, **is he**?' },
            { name: 'ใช้กริยาช่วยตัวเดิม ถ้าไม่มีใช้ do/does/did', desc: 'You can drive, **can’t you**? / She works here, **doesn’t she**? / They left early, **didn’t they**?' },
            { name: 'ใช้สรรพนามแทนประธาน', desc: 'Officer Mali has gone home, **hasn’t she**? / This is your bag, **isn’t it**? / There is a problem, **isn’t there**?' },
            { name: 'กรณีพิเศษ', desc: 'I am late, **aren’t I**? / Let’s go, **shall we**? / Close the door, **will you**? (ประโยคคำสั่งใช้ won’t you, can you, could you, would you ได้ด้วย) ประโยคที่มี never, hardly, nobody นับเป็นปฏิเสธ จึงใช้ tag บอกเล่า เช่น He never comes late, **does he**?' },
          ],
        },
      ],
    },

    // mistakes
    {
      type: 'mistakes',
      plain: true,
      items: [
        {
          title: 'ใช้ V2 หลัง be ใน passive',
          body: 'เกิดเพราะ V2 กับ V3 ของบางคำต่างกัน เช่น stole กับ stolen วิธีแก้: ใน passive หลัง be (is/are/was/were/been) ต้องเป็น V3 ไม่ใช่ V2 ✗ was stole ✓ was stolen',
        },
        {
          title: 'เห็นสถานที่แล้วเลือก which ทันที',
          body: 'เกิดเพราะจำว่า which ใช้กับสิ่งของ วิธีแก้: ดูหลังช่องว่าง ถ้าประโยคข้างหลังครบแล้วใช้ where ถ้าขาดประธานหรือกรรมจึงใช้ which และถ้ามีจุลภาคนำหน้า ห้ามใช้ that',
        },
        {
          title: 'ใช้ more ซ้อนกับ -er หรือใช้ขั้นสุดคู่กับ than',
          body: 'เกิดเพราะคิดว่า more ช่วยเน้น วิธีแก้: ใช้ -er หรือ more อย่างใดอย่างหนึ่ง คำพยางค์เดียวเติม -er คำสองพยางค์ลงท้าย -y ใช้ -ier (busier) คำสองพยางค์อื่นส่วนใหญ่และคำสามพยางค์ขึ้นไปใช้ more than คู่กับขั้นกว่าเท่านั้น และ the … in/of คู่กับขั้นสุด',
        },
        {
          title: 'คิดว่า to ทุกตัวต้องตามด้วย V1',
          body: 'เกิดเพราะจำ to + V1 ไว้แน่น วิธีแก้: จำวลีชุดที่ to เป็นคำบุพบท (look forward to, be/get used to, be accustomed to, object to, be committed to, when it comes to, in addition to, contribute to) วลีเหล่านี้ตามด้วย V-ing เช่น look forward to meeting, be used to working ส่วนกริยาอย่าง agree, plan, decide, want, hope ตามด้วย to + V1',
        },
        {
          title: 'ใส่ will หรือ not หลัง unless',
          body: 'เกิดเพราะแปลตรงจากภาษาไทย วิธีแก้: unless = if … not จึงใช้ present simple และไม่ต้องใส่ not ซ้ำ เช่น Unless you hurry, you will miss the bus.',
        },
      ],
    },

    // check
    {
      type: 'check',
      anchor: 'check',
      eyebrow: 'เช็กความเข้าใจ',
      title: 'ตอบด้วยเหตุผล ไม่ใช่ความจำ',
      questions: [
        {
          id: 'pe2-c1',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The broken window at the front gate ___ yet, so please do not lean on it.”',
          choices: ['hasn’t repaired', 'isn’t repairing', 'didn’t repair', 'hasn’t been repaired'],
          answer: 3,
          why: 'หน้าต่างซ่อมตัวเองไม่ได้ จึงต้องเป็น passive และ yet ใช้กับ present perfect ได้ “hasn’t been repaired” (has been + V3) ส่วน “hasn’t repaired” “isn’t repairing” และ “didn’t repair” เป็น active ทั้งหมด ทำให้หน้าต่างกลายเป็นผู้ซ่อม ซึ่งผิดความหมาย',
          refs: [],
          plain: true,
        },
        {
          id: 'pe2-c2',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Please go to the room ___ the lost-and-found items are kept.”',
          choices: ['which', 'who', 'where', 'whose'],
          answer: 2,
          why: 'room เป็นสถานที่ และหลังช่องว่าง the lost-and-found items are kept ครบแล้ว (มีประธานและกริยา) จึงใช้ “where” (= in which) ส่วน “which” ต้องเป็นประธานหรือกรรมของอนุประโยค แต่อนุประโยคนี้ไม่ขาดอะไร “who” ใช้กับคน และ “whose” ต้องตามด้วยคำนามที่ไม่มี the',
          refs: [],
          plain: true,
        },
        {
          id: 'pe2-c3',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Instead of ___ the report by hand, the officer typed it on the computer.”',
          choices: ['writing', 'to write', 'write', 'written'],
          answer: 0,
          why: 'of เป็นคำบุพบท หลังคำบุพบทต้องเป็น V-ing จึงใช้ “writing” ส่วน “to write” และ “write” ใช้หลังคำบุพบทไม่ได้ และ “written” เป็น V3 ซึ่งต้องมี be หรือ have นำหน้า',
          refs: [],
          plain: true,
        },
        {
          id: 'pe2-c4',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Please fill in the form ___ as you can.”',
          choices: ['as careful', 'as carefully', 'more carefully', 'the most carefully'],
          answer: 1,
          why: 'โครงสร้าง as … as ใช้รูปเดิม และคำนี้ขยายกริยา fill in จึงต้องเป็นกริยาวิเศษณ์ ได้ “as carefully” (as carefully as you can) ส่วน “as careful” เป็นคุณศัพท์ ขยายกริยาไม่ได้ “more carefully” เป็นขั้นกว่า ใช้คู่กับ than ไม่ใช่ as และ “the most carefully” เป็นขั้นสุด ไม่เข้ากับ as you can',
          refs: [],
          plain: true,
        },
        {
          id: 'pe2-c5',
          q: 'เลือก question tag ที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The new officer hasn’t signed the duty book, ___?”',
          choices: ['hasn’t he', 'doesn’t he', 'did he', 'has he'],
          answer: 3,
          why: 'ประโยคหลักเป็นปฏิเสธ tag จึงเป็นบอกเล่า และใช้กริยาช่วยตัวเดิมคือ has ได้ “has he” ส่วน “hasn’t he” เป็นปฏิเสธซ้ำกับประโยคปฏิเสธ “doesn’t he” และ “did he” เปลี่ยนกริยาช่วยไปจาก has',
          refs: [],
          plain: true,
        },
      ],
    },

    // explain
    {
      type: 'explain',
      plain: true,
      prompt: 'อธิบายด้วยคำของคุณเองว่า “This is the office which I work.” ผิดตรงไหน และจะแก้ให้ถูกได้สองแบบอย่างไร',
      model: 'which ต้องทำหน้าที่เป็นประธานหรือกรรมในอนุประโยค แต่ I work ครบแล้วและ work ไม่ต้องมีกรรม which จึงไม่มีหน้าที่ แก้แบบแรกโดยเปลี่ยนเป็น where ได้ This is the office where I work. แก้แบบที่สองโดยเติมคำบุพบทให้ which เป็นกรรมของ in ได้ This is the office which I work in.',
    },
  ],

  test: [
    {
      id: 'pe2-t01',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Under the new rule, every leave form ___ by the head of the section.”',
      choices: ['must sign', 'must be signed', 'must signed', 'must be signing'],
      answer: 1,
      why: 'ใบลาลงนามเองไม่ได้ แต่ถูกหัวหน้าลงนาม (by the head) จึงใช้ modal passive คือ modal + be + V3 ได้ “must be signed” ส่วน “must sign” เป็น active ทำให้ใบลาเป็นผู้ลงนาม “must signed” ขาด be หลัง modal และ “must be signing” เป็น active รูป continuous ซึ่งก็ทำให้ใบลาเป็นผู้ลงนามเช่นกัน',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t02',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The suspect ___ near the bus station yesterday, two hours after the robbery.”',
      choices: ['was catched', 'has been caught', 'caught', 'was caught'],
      answer: 3,
      why: 'ผู้ต้องสงสัยถูกจับ จึงเป็น passive และ yesterday เป็นเวลาอดีตที่ระบุชัด ได้ past simple passive “was caught” ส่วน “was catched” ผิด เพราะ catch ผันผิดรูป (catch, caught, caught) “has been caught” ใช้กับ yesterday ไม่ได้ และ “caught” เป็น active ซึ่งต้องมีกรรมตาม และทำให้ผู้ต้องสงสัยเป็นผู้จับ',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t03',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The woman ___ handbag was stolen came to the station to report it.”',
      choices: ['whose', 'who', 'which', 'whom'],
      answer: 0,
      why: 'หลังช่องว่างเป็นคำนาม handbag ซึ่งเป็นของผู้หญิงคนนั้น จึงใช้ “whose” (ของผู้ซึ่ง) ส่วน “who” และ “whom” ตามด้วยคำนามเพื่อบอกความเป็นเจ้าของไม่ได้ (who handbag ผิด) และ “which” ใช้กับสิ่งของ ไม่ใช่คน',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t04',
      q: 'ส่วนใดผิดไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง): “Officers who speak five languages now work at Khlong Mai Police Station, that opened a tourist service desk last year.”',
      choices: ['who speak', 'now work', 'at Khlong Mai', 'that opened'],
      answer: 3,
      why: 'ส่วนขยายหลังจุลภาคเป็นข้อมูลเพิ่ม (non-defining) ใช้ that ไม่ได้ ต้องเป็น which opened ดังนั้น “that opened” ผิด ส่วน “who speak” ถูก เพราะ who ขยาย officers (คน พหูพจน์) “now work” ผันตามประธานพหูพจน์ Officers ถูกแล้ว และ “at Khlong Mai” ใช้ at กับสถานที่เฉพาะแห่งถูกแล้ว',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t05',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Last year’s road accident figures were bad, but this year’s figures are even ___.”',
      choices: ['bad', 'worst', 'worse', 'more bad'],
      answer: 2,
      why: 'even ใช้ขยายขั้นกว่า และเป็นการเทียบสองปี จึงต้องเป็นขั้นกว่าของ bad ซึ่งผันผิดรูปเป็น “worse” ส่วน “bad” เป็นรูปเดิม ใช้หลัง even เพื่อเทียบไม่ได้ “worst” เป็นขั้นสุด ใช้กับการเทียบสองสิ่งไม่ได้และต้องมี the และ “more bad” ไม่ใช่รูปมาตรฐาน เพราะ bad มีขั้นกว่าเฉพาะตัวคือ worse',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t06',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “At the checkpoint, the driver refused ___ his licence to the officer.”',
      choices: ['show', 'showing', 'to show', 'shown'],
      answer: 2,
      why: 'refuse เป็นกริยาที่ตามด้วย to + V1 จึงใช้ “to show” ส่วน “showing” ใช้กับกริยากลุ่ม enjoy, avoid, finish ไม่ใช่ refuse “show” ขาด to และ “shown” เป็น V3 ซึ่งต้องมี be หรือ have นำหน้า',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t07',
      q: 'ประโยคตัวอย่างที่เราแต่ง ข้อใดถูกไวยากรณ์',
      choices: [
        'The suspect admitted to take the wallet.',
        'We have finished checking all the documents.',
        'She avoided to answer the reporter’s questions.',
        'He suggested to meet at the station.',
      ],
      answer: 1,
      why: 'finish ตามด้วย V-ing จึง “We have finished checking all the documents.” ถูก ส่วน “The suspect admitted to take the wallet.” ผิด เพราะ admit ตามด้วย V-ing (admitted taking หรือ admitted to taking โดย to เป็นคำบุพบท) “She avoided to answer the reporter’s questions.” ผิด เพราะ avoid ตามด้วย V-ing (avoided answering) และ “He suggested to meet at the station.” ผิด เพราะ suggest ตามด้วย V-ing (suggested meeting)',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t08',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The safety briefing is ___ 9 a.m. ___ Friday.”',
      choices: ['on, at', 'at, on', 'in, on', 'at, in'],
      answer: 1,
      why: '9 a.m. เป็นจุดเวลา ใช้ at และ Friday เป็นวัน ใช้ on จึงได้ “at, on” ส่วน “on, at” สลับกันทั้งสองช่อง “in, on” ผิดที่ช่องแรก เพราะ in ใช้กับช่วงยาว เช่น เดือน ปี ไม่ใช่เวลาบนนาฬิกา และ “at, in” ผิดที่ช่องหลัง เพราะวันในสัปดาห์ใช้ on',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t09',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The woman was accused ___ stealing a phone from the shop.”',
      choices: ['of', 'for', 'with', 'about'],
      answer: 0,
      why: 'accuse ใช้คู่กับ of (accused of + สิ่งที่ถูกกล่าวหา) จึงใช้ “of” และหลังคำบุพบทจึงเป็น stealing ส่วน “for” ใช้กับ arrested for “with” ใช้กับ charged with และ “about” ไม่ใช้คู่กับ accused',
      refs: [],
      plain: true,
    },
    {
      id: 'pe2-t10',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “If the driver ___ his seat belt last night, he would not have been injured.”',
      choices: ['wore', 'would wear', 'had worn', 'has worn'],
      answer: 2,
      why: 'ส่วนผลเป็น would not have been injured และมี last night จึงเป็นการสมมุติย้อนอดีต (แบบ 3) ส่วน if ต้องเป็น had + V3 ได้ “had worn” ส่วน “wore” เป็นรูปของแบบ 2 ซึ่งคู่กับ would + V1 และขัดกับ last night “would wear” ใส่ would ในส่วน if ซึ่งผิด และ “has worn” เป็น present perfect ใช้กับ last night ไม่ได้และไม่เข้าคู่กับ would have',
      refs: [],
      plain: true,
    },
  ],

  sources: [{ doc: 'police-exam-scope-summary' }],
};

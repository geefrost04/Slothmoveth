import type { Lesson } from '@/lib/learn/types';

// pe3 · Conversation Vocabulary และ Reading (police อก.1 course).
// Conversation patterns, vocabulary and reading strategy are general knowledge (no official document states them):
// every block and MCQ is `plain: true`, labelled once "ความรู้ทั่วไปด้านภาษาอังกฤษ". Only the English question count
// cites the scope summary.
// Emphasis from the 6 police mock tests (subjectId "english", 90 items), originalCategory counts:
// Conversation 15 + "Conversation: helping a tourist" 1 + "Conversation: phone call" 1 = 17;
// Vocabulary 15 + "Vocabulary: police words" 1 + "office words" 1 + "in context" 1 = 18;
// Reading 15 + "Public signs and notices" 1 + "Reading: detail" 1 + "Reading: purpose" 1 = 18.
// A few items filed under these labels are really grammar (tense, prepositions, agreement: pe1/pe2).
// Signs appear in 5 of the 6 mocks (traffic signs ×4, AUTHORIZED PERSONNEL ONLY) → must, inside the reading section.
// Idioms (a piece of cake, break a leg) 2 and an e-mail opening 1 → maybe section.
// Reading strategy adapted from content/nesdc-learn/e/e3.ts with simpler, made-up texts. Every dialogue, sentence,
// notice and passage is our own (ประโยค/ข้อความตัวอย่างที่เราแต่ง); names of people and stations are made up.
// Conversation items: each key is fixed by the line AFTER the blank or by the function of the line before it;
// every distractor answers a different function (thanks vs apology vs invitation) or contradicts the next line.

export const lesson: Lesson = {
  id: 'pe3',
  topic: 'pe',
  order: 3,
  priority: 'must',
  title: 'Conversation Vocabulary และ Reading',
  lead: 'สามส่วนที่รวมกันแล้วมากกว่าครึ่งของข้อภาษาอังกฤษในชุดข้อสอบเสมือนจริง เลือกคำตอบที่เข้ากับบทสนทนาได้คำตอบเดียว รู้ศัพท์เหมือน ตรงข้าม และศัพท์งานตำรวจ อ่านป้าย ประกาศ และข้อความสั้นให้ทันเวลา',
  minutes: 30,
  jumps: [
    ['conv', 'สนทนา'],
    ['vocab', 'คำศัพท์'],
    ['read', 'การอ่าน'],
    ['idiom', 'สำนวน'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · บทนี้เรียนอะไร',
      title: 'ไม่ต้องแปลทุกคำ แค่รู้ว่าแต่ละข้อถามหาอะไร',
      priority: 'must',
      plain: true,
      body: [
        'บทที่ 1 และ 2 ของหัวข้อนี้เป็นไวยากรณ์ บทนี้เป็นอีกสามแบบที่ข้อสอบภาษาอังกฤษใช้ คือ **บทสนทนา** (conversation: เลือกประโยคที่พูดต่อได้เหมาะที่สุด) **คำศัพท์** (vocabulary: คำเหมือน คำตรงข้าม ความหมายในบริบท) และ**การอ่าน** (reading: ป้าย ประกาศ อีเมล ข้อความสั้น)',
        'ทั้งสามแบบมีหลักเดียวกัน คือ**หาเบาะแสในโจทย์ก่อนดูตัวเลือก** บทสนทนาดูว่าอีกฝ่ายพูดเพื่ออะไรและพูดอะไรต่อ คำศัพท์ดูคำรอบ ๆ ข้อความอ่านดูคำถามก่อนแล้วหาประโยคที่ตอบ',
      ],
      blocks: [
        {
          type: 'note',
          title: 'ความรู้ทั่วไปด้านภาษาอังกฤษ',
          plain: true,
          body: 'รูปแบบบทสนทนา ความหมายคำ และวิธีอ่านในบทนี้เป็น**ความรู้ทั่วไปด้านภาษาอังกฤษ** ตามที่สอนในระดับมัธยมและการเตรียมสอบราชการ ไม่มีเอกสารราชการกำหนด จึงไม่มีเลขหน้าอ้างอิง บทสนทนา ประโยค ป้ายประกาศ และข้อความอ่านทุกชิ้นเป็น**ประโยคหรือข้อความตัวอย่างที่เราแต่ง** ชื่อคนและสถานีตำรวจเป็นชื่อสมมติ',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          refs: [{ doc: 'police-exam-scope-summary' }],
          body: 'วิชาภาษาอังกฤษมี 15 ข้อ (ตามสรุปขอบเขตจากประกาศ) จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ใน 90 ข้อภาษาอังกฤษของ 6 ชุด มีข้อที่จัดเป็นหมวดบทสนทนา 17 ข้อ คำศัพท์ 18 ข้อ และการอ่าน (รวมป้ายและประกาศ) 18 ข้อ บางข้อในหมวดเหล่านี้เป็นไวยากรณ์ซึ่งเรียนแล้วในบทที่ 1–2 บทสนทนามักเป็นสถานการณ์ที่สถานีตำรวจ การถามทาง และการโทรศัพท์',
        },
      ],
    },

    // 2 · conversation
    {
      type: 'section',
      anchor: 'conv',
      eyebrow: '2 · บทสนทนา',
      title: 'ดูหน้าที่ของประโยคก่อนช่องว่าง แล้วเช็กกับประโยคหลังช่องว่าง',
      priority: 'must',
      plain: true,
      body: [
        'ข้อบทสนทนามักให้สถานการณ์ (Situation) แล้วเว้นช่องให้เลือกสิ่งที่พูด ตัวเลือกผิดส่วนใหญ่**ถูกไวยากรณ์** แต่ตอบผิดหน้าที่ เช่น อีกฝ่ายขอโทษ แต่ตัวเลือกตอบเหมือนอีกฝ่ายขอบคุณ ดังนั้นอย่าเลือกจากความรู้สึกว่า “ฟังดูสุภาพ” ให้ถามว่าประโยคนี้**ตอบสิ่งที่อีกฝ่ายพูดตรงหน้าที่หรือไม่**',
        'เบาะแสที่ชัดที่สุดมักอยู่**หลังช่องว่าง** เช่น ถ้าอีกฝ่ายพูดต่อว่า “Thank you. I really appreciate it.” แปลว่าช่องว่างต้องเป็นการเสนอความช่วยเหลือ ถ้าพูดต่อว่า “When did you last see it?” แปลว่าช่องว่างต้องเป็นการแจ้งว่าของหาย',
      ],
      blocks: [
        {
          type: 'flow',
          title: 'วิธีจำ: เลือกคำตอบบทสนทนา 3 ขั้น',
          plain: true,
          nodes: [
            { level: 'ขั้น 1', name: 'อ่านสถานการณ์', role: 'ใครคุยกับใคร ที่ไหน เช่น เจ้าหน้าที่กับนักท่องเที่ยว ที่สถานีตำรวจ ทางโทรศัพท์', tone: 'ink' },
            { level: 'ขั้น 2', name: 'ดูหน้าที่ของประโยคก่อนช่องว่าง', role: 'เป็นคำถามแบบไหน (Wh- หรือ Yes/No) ขอบคุณ ขอโทษ ขอร้อง เสนอช่วย หรือชวน', tone: 'deep' },
            { level: 'ขั้น 3', name: 'เช็กกับประโยคหลังช่องว่าง', role: 'ใส่ตัวเลือกลงไปแล้วอ่านต่อทั้งบท ถ้าประโยคถัดไปขัดกัน ตัดทิ้ง', tone: 'purple' },
          ],
          arrows: ['รู้บริบท', 'รู้ว่าต้องตอบแบบไหน'],
          loopNote: 'คำถาม Wh- (What, Where, When, How) ต้องตอบเป็นข้อมูล ไม่ใช่ Yes หรือ No และต้องตอบให้ตรงคำ เช่น Where ต้องตอบสถานที่ ไม่ใช่เวลา',
        },
        {
          type: 'table',
          title: 'ตารางคำตอบที่ดีที่สุด (1): ปฏิกิริยาในชีวิตประจำวัน',
          plain: true,
          rows: [
            ['อีกฝ่ายพูด', 'ตอบแบบนี้', 'ห้ามตอบ'],
            ['Thank you.', 'You’re welcome. / My pleasure. / No problem.', 'Never mind. (ใช้ตอบคำขอโทษ)'],
            ['I’m sorry.', 'That’s all right. / Don’t worry about it. / Never mind.', 'You’re welcome. (ใช้ตอบคำขอบคุณ)'],
            ['How are you?', 'Fine, thanks. And you?', 'I’m 25. (ตอบอายุ)'],
            ['Nice to meet you.', 'Nice to meet you, too.', 'Yes, I meet you.'],
            ['I lost my phone.', 'Oh, I’m sorry to hear that.', 'Congratulations!'],
            ['I passed the test!', 'Congratulations! / Well done!', 'That’s too bad.'],
            ['Good luck!', 'Thanks.', 'You’re welcome.'],
          ],
          highlightCol: 1,
        },
        {
          type: 'table',
          title: 'ตารางคำตอบที่ดีที่สุด (2): ขอร้อง เสนอ ชวน ขออนุญาต',
          plain: true,
          rows: [
            ['อีกฝ่ายพูด', 'ตอบแบบนี้', 'ระวัง'],
            ['Could you help me?', 'Sure. / Certainly. / Of course.', 'ถ้าปฏิเสธ ให้ขอโทษและบอกเหตุผล'],
            ['Would you mind closing the door?', 'Not at all. / Of course not. (= ยินดีทำให้)', 'ตอบ Yes แปลว่ารังเกียจ ไม่ยอม'],
            ['Can I help you? / Would you like me to …?', 'Yes, please. / No, thank you. I’m fine.', 'Here you are. (ใช้ตอนยื่นของ)'],
            ['Would you like some tea?', 'Yes, please. / No, thanks.', 'Yes, I like. (ผิด)'],
            ['May I sit here?', 'Sure, go ahead. / Sorry, it’s taken.', 'You’re welcome.'],
            ['Here’s your ID card.', 'Thank you.', 'Here you are. (คนยื่นเป็นคนพูด)'],
          ],
          highlightCol: 1,
          after: 'ตารางทั้งสองเป็นคู่ประโยคมาตรฐาน ข้อสอบมักเอาคำตอบในคอลัมน์ “ห้ามตอบ” มาเป็นตัวลวง เพราะทุกประโยคถูกไวยากรณ์และฟังดูสุภาพ แต่ใช้ผิดสถานการณ์',
        },
        {
          type: 'list',
          title: 'วลีตามสถานการณ์ที่พบบ่อย (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'ถามทาง', desc: 'ถาม: Excuse me. Could you tell me the way to the post office? / Is there a bank near here? ตอบ: Go straight. Turn left at the traffic lights. It’s **next to** (ข้าง ๆ) the school, **opposite** (ตรงข้าม) the market, **between** (ระหว่าง) the bank and the hospital, **on the corner** (ตรงหัวมุม)' },
            { name: 'โทรศัพท์', desc: 'May I speak to Sergeant Anan, please? ตอบได้ว่า **Speaking.** (ผมพูดอยู่) / **Hold on, please.** (รอสักครู่) / **I’ll put you through.** (จะโอนสายให้) / He’s not in at the moment. **Can I take a message?** (ฝากข้อความไหม) ส่วนคนโทรพูดว่า **Can I leave a message?** และถ้าโทรผิด **Sorry, you have the wrong number.**' },
            { name: 'ที่สถานีตำรวจ: แจ้งของหาย', desc: 'ผู้แจ้ง: I’d like to report a lost wallet. / My motorbike was stolen. เจ้าหน้าที่ถาม: When did you last see it? (เห็นครั้งสุดท้ายเมื่อไร) Where did you lose it? (หายที่ไหน) What does it look like? (หน้าตาเป็นอย่างไร) Please fill in this form. (กรอกแบบฟอร์มนี้) We’ll call you if we find it.' },
            { name: 'เสนอช่วยและขอร้องอย่างสุภาพ', desc: 'เสนอ: Let me help you. / Can I give you a hand? ขอร้อง: Could you …? / Would you mind + V-ing …? / Could I have …? คำว่า Could และ Would สุภาพกว่า Can และ Will' },
            { name: 'ขอโทษและตอบรับ', desc: 'ขอโทษ: I’m sorry I’m late. / Sorry to keep you waiting. (ขอโทษที่ให้รอ) ตอบ: That’s OK. / No problem. ถ้าอีกฝ่ายพูดว่า Excuse me เพื่อขอทางหรือเรียก ตอบว่า Yes? / Sure.' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'บทสนทนาที่เราแต่ง: ที่สถานีตำรวจ Officer: “What does your bag look like?” Woman: “______” Officer: “OK. Was there anything valuable inside?” เติมข้อใด ระหว่าง “I lost it at the bus stop.” “It’s a black backpack with a red zip.” “I lost it about an hour ago.” และ “Yes, I’d like to report it.”',
          steps: [
            'สถานการณ์: ผู้หญิงมาแจ้งกระเป๋าหาย เจ้าหน้าที่ถามด้วย What does … look like? ซึ่งถามรูปร่างหน้าตา จึงต้องตอบเป็นคำบรรยาย เช่น สี ขนาด ชนิด',
            '“I lost it at the bus stop.” ตอบว่าหายที่ไหน (คำถาม Where) “I lost it about an hour ago.” ตอบว่าเมื่อไร (คำถาม When) ทั้งสองถูกไวยากรณ์และเป็นเรื่องเดียวกัน แต่ไม่ตอบคำถามนี้',
            '“Yes, I’d like to report it.” ตอบเหมือนคำถาม Yes/No แต่ What ไม่ใช่คำถาม Yes/No เหลือ “It’s a black backpack with a red zip.” และประโยคถัดไปที่ถามว่ามีของมีค่าข้างในไหม ก็ต่อกันได้',
          ],
          answer: 'It’s a black backpack with a red zip.',
          trap: 'อย่าเลือกเพียงเพราะตัวเลือกอยู่ในเรื่องเดียวกัน (ของหาย) ต้องตอบตรงคำถาม What does it look like? = บรรยายลักษณะ',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อบทสนทนามักมีบทพูดสองถึงสามบรรทัด ช่องว่างอยู่กลางหรือท้าย และตัวเลือกผิดเป็นประโยคที่ถูกไวยากรณ์แต่ตอบผิดหน้าที่หรือขัดกับบรรทัดถัดไป ขั้นตอน: ระบุหน้าที่ของประโยคก่อนช่องว่าง เทียบกับตาราง แล้วใส่คำตอบลงไปอ่านต่อจนจบบท',
        },
      ],
    },

    // 3 · vocabulary
    {
      type: 'section',
      anchor: 'vocab',
      eyebrow: '3 · คำศัพท์',
      title: 'เดาความหมายจากคำรอบ ๆ ก่อน แล้วค่อยดูตัวเลือก',
      priority: 'must',
      plain: true,
      body: [
        'ข้อคำศัพท์มีสามแบบ คือ **คำเหมือน** (synonym: closest in meaning) **คำตรงข้าม** (antonym: opposite in meaning) และ**เติมคำให้ได้ความ** ทั้งสามแบบมักให้ประโยคมาด้วย ประโยคนั้นคือเบาะแส เช่น “The rule is temporary. It will end next month.” ประโยคหลังบอกว่า temporary แปลว่าชั่วคราว',
        'ระวังโจทย์ที่ถาม **OPPOSITE** ตัวเลือกมักมีทั้งคำเหมือนและคำตรงข้ามของคำเดียวกัน คนที่อ่านโจทย์ไม่ครบจะเลือกคำเหมือน ให้ขีดเส้นใต้คำว่า closest หรือ opposite ทุกครั้ง',
      ],
      blocks: [
        {
          type: 'table',
          title: 'คำเหมือนที่ควรรู้',
          plain: true,
          rows: [
            ['คำ', 'คำเหมือน', 'ความหมาย'],
            ['assist', 'help', 'ช่วย'],
            ['obtain', 'get', 'ได้มา'],
            ['purchase', 'buy', 'ซื้อ'],
            ['inform', 'tell', 'แจ้ง บอก'],
            ['require', 'need', 'ต้องการ กำหนดให้มี'],
            ['mandatory', 'compulsory, required', 'บังคับ'],
            ['postpone', 'delay, put off', 'เลื่อนออกไป'],
            ['commend', 'praise', 'ชมเชย'],
            ['vague', 'unclear', 'คลุมเครือ'],
            ['accurate', 'correct, precise', 'ถูกต้อง แม่นยำ'],
            ['ample', 'plentiful, more than enough', 'เหลือเฟือ'],
            ['genuine', 'real, authentic', 'ของแท้'],
          ],
          highlightCol: 1,
        },
        {
          type: 'table',
          title: 'คำตรงข้าม: เติมหน้าคำ หรือจำเป็นคู่',
          plain: true,
          rows: [
            ['แบบ', 'ตัวอย่าง', 'ระวัง'],
            ['un-', 'available → unavailable, lock → unlock', 'ไม่ใช่ทุกคำที่ขึ้นด้วย un- จะตรงข้าม'],
            ['in- / im-', 'correct → incorrect, possible → impossible', 'im- หน้า p, b, m'],
            ['il- / ir-', 'legal → illegal, responsible → irresponsible', 'il- หน้า l, ir- หน้า r'],
            ['dis-', 'honest → dishonest, agree → disagree', ''],
            ['คู่จำ', 'temporary ↔ permanent, accept ↔ reject', 'increase ↔ decrease'],
            ['คู่จำ', 'allow ↔ forbid, guilty ↔ innocent', 'arrive ↔ depart'],
            ['คู่จำ', 'maximum ↔ minimum, include ↔ exclude', 'scarce ↔ plentiful'],
          ],
          after: 'หน้าคำ in- บางคำไม่ได้แปลว่าไม่ เช่น inside, include ส่วน mis- แปลว่า “ผิด” ไม่ใช่ตรงข้ามตรง ๆ เช่น understand → misunderstand (เข้าใจผิด)',
        },
        {
          type: 'explorer',
          title: 'ศัพท์งานตำรวจและงานสำนักงาน',
          intro: 'ข้อสอบชอบให้คำอธิบายแล้วถามว่าเป็นคำใด หรือให้เติมคำในประโยคงานตำรวจ ลองนึกความหมายก่อนแตะ',
          initial: 'p1',
          plain: true,
          groups: [
            {
              tag: 'ตำรวจ',
              name: 'คนและคดี',
              idea: 'ใครเป็นใครในเรื่องที่เกิดขึ้น',
              items: [
                { key: 'p1', label: '1', full: 'suspect', meaning: '**ผู้ต้องสงสัย** คนที่ตำรวจคิดว่าอาจกระทำผิด เช่น The suspect was arrested near the market. (เป็นกริยาได้ด้วย แปลว่าสงสัย)' },
                { key: 'p2', label: '2', full: 'victim', meaning: '**ผู้เสียหาย เหยื่อ** คนที่ถูกกระทำหรือได้รับความเสียหาย เช่น The victim lost 5,000 baht.' },
                { key: 'p3', label: '3', full: 'witness', meaning: '**พยาน** คนที่เห็นเหตุการณ์และเล่าให้ตำรวจฟังได้ เช่น A witness saw the car leave.' },
                { key: 'p4', label: '4', full: 'evidence', meaning: '**หลักฐาน** สิ่งที่ช่วยพิสูจน์ว่าเกิดอะไรขึ้น เช่น ลายนิ้วมือ ภาพจากกล้อง เป็นคำนามนับไม่ได้ ใช้ a piece of evidence ไม่ใช่ an evidence' },
                { key: 'p5', label: '5', full: 'arrest', meaning: '**จับกุม** เช่น The police arrested two men. คนที่ถูกจับเรียกว่า the person arrested, an arrestee หรือ a detainee (ผู้ถูกควบคุมตัว)' },
                { key: 'p6', label: '6', full: 'theft / thief', meaning: '**การลักขโมย / ขโมย (คน)** steal (ขโมย) stole stolen ส่วน robbery คือการใช้กำลังหรือขู่เพื่อเอาทรัพย์ และ burglary คือการบุกเข้าบ้านหรืออาคารเพื่อขโมย' },
                { key: 'p7', label: '7', full: 'fine', meaning: '**ค่าปรับ** เช่น He paid a fine for speeding. (คนละความหมายกับ fine ที่แปลว่าสบายดี)' },
                { key: 'p8', label: '8', full: 'patrol / checkpoint', meaning: '**ลาดตระเวน / ด่านตรวจ** on duty แปลว่ากำลังปฏิบัติหน้าที่ off duty แปลว่านอกเวลางาน' },
              ],
            },
            {
              tag: 'สำนักงาน',
              name: 'งานเอกสารและนัดหมาย',
              idea: 'คำที่เจอในอีเมลและบันทึก',
              items: [
                { key: 'o1', label: '1', full: 'appointment', meaning: '**การนัดหมาย** make an appointment = ทำนัด คนละคำกับ apartment (ห้องพัก) และ assignment (งานที่ได้รับมอบหมาย)' },
                { key: 'o2', label: '2', full: 'deadline', meaning: '**กำหนดส่ง วันสุดท้าย** เช่น The deadline for the report is Friday.' },
                { key: 'o3', label: '3', full: 'submit', meaning: '**ยื่น ส่ง** (เอกสาร) เช่น Please submit the form by Monday.' },
                { key: 'o4', label: '4', full: 'approve / reject', meaning: '**อนุมัติ / ปฏิเสธ ไม่อนุมัติ** เช่น The chief approved the leave request.' },
                { key: 'o5', label: '5', full: 'attach / attachment', meaning: '**แนบ / ไฟล์หรือเอกสารแนบ** เช่น Please see the attached file.' },
                { key: 'o6', label: '6', full: 'schedule / agenda', meaning: '**ตารางเวลา / วาระการประชุม** ahead of schedule = เร็วกว่ากำหนด behind schedule = ช้ากว่ากำหนด' },
                { key: 'o7', label: '7', full: 'postpone / cancel', meaning: '**เลื่อนออกไป / ยกเลิก** postpone ยังจัดอยู่แต่ช้าลง cancel คือไม่จัดเลย' },
                { key: 'o8', label: '8', full: 'colleague', meaning: '**เพื่อนร่วมงาน** ส่วน supervisor คือหัวหน้างาน และ applicant คือผู้สมัคร' },
              ],
            },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “The two stories were **identical**, so the officer believed both witnesses were telling the truth.” คำว่า identical ใกล้เคียงกับคำใด ระหว่าง “different” “exactly the same” “very long” และ “hard to understand”',
          steps: [
            'ดูเหตุผลในประโยค: เพราะเรื่องเล่าสองเรื่อง identical เจ้าหน้าที่จึงเชื่อว่าพยานทั้งสองพูดความจริง เรื่องที่ทำให้เชื่อได้คือเรื่องที่ตรงกัน',
            '“different” เป็นความหมายตรงข้าม ถ้าเรื่องต่างกันจะไม่ทำให้เชื่อทั้งสองคน “very long” และ “hard to understand” ไม่เกี่ยวกับเหตุผล so … believed',
            'จึงได้ “exactly the same” (เหมือนกันทุกอย่าง)',
          ],
          answer: 'exactly the same',
          trap: 'ถ้าไม่รู้คำ อย่าเดาจากหน้าตาคำ ให้ใช้คำเชื่อม so, because, but ในประโยคบอกทิศทางความหมาย',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อคำศัพท์ส่วนมากให้ประโยคที่มีคำในเครื่องหมายคำพูด แล้วถามคำที่ความหมายใกล้เคียงที่สุด บางข้อให้คำอธิบายแล้วถามชื่อเรียก เช่น คนที่เห็นเหตุการณ์ ขั้นตอน: อ่านทั้งประโยค เดาความหมายเป็นภาษาไทยก่อน แล้วหาตัวเลือกที่ตรงกับที่เดา ตัวลวงมักเป็นคำตรงข้ามหรือคำที่หน้าตาคล้ายกัน',
        },
      ],
    },

    // 4 · reading
    {
      type: 'section',
      anchor: 'read',
      eyebrow: '4 · การอ่าน: ป้าย ประกาศ ข้อความสั้น',
      title: 'อ่านคำถามก่อน แล้วกลับไปหาประโยคที่ตอบ',
      priority: 'must',
      plain: true,
      body: [
        'ข้อการอ่านในข้อสอบระดับนี้สั้น มีสามแบบ คือ **ป้าย** (sign: ถามว่าป้ายหมายความว่าอะไร) **ประกาศหรืออีเมล** (notice, email, memo: ถามจุดประสงค์หรือรายละเอียด) และ**ข้อความหนึ่งย่อหน้า** (passage: ถามใจความหลัก รายละเอียด การอนุมาน ความหมายคำ)',
        'หัวใจคือ**ตอบจากข้อความเท่านั้น** ตัวเลือกที่ฟังดูจริงในชีวิตจริงแต่ข้อความไม่ได้พูด ถือว่าผิด และตัวเลือกที่ใช้คำว่า always, never, all, only มักพูดเกินข้อความ',
      ],
      blocks: [
        {
          type: 'table',
          title: 'ป้ายที่ควรรู้',
          plain: true,
          rows: [
            ['ป้าย', 'ความหมาย', 'ระวังสับสน'],
            ['NO PARKING', 'ห้ามจอด', 'หยุดรับส่งสั้น ๆ ยังเป็นอีกเรื่อง'],
            ['NO U-TURN', 'ห้ามกลับรถ', 'ไม่ได้ห้ามเลี้ยวซ้ายหรือขวา'],
            ['GIVE WAY / YIELD', 'ให้ทางรถทางหลักไปก่อน', 'ไม่ได้แปลว่าห้ามไปตลอด'],
            ['NO ENTRY / KEEP OUT', 'ห้ามเข้า', ''],
            ['ONE WAY', 'เดินรถทางเดียว', ''],
            ['AUTHORIZED PERSONNEL ONLY', 'เฉพาะผู้ได้รับอนุญาต', 'ไม่ใช่ทุกคนที่ทำงานที่นั่น'],
            ['STAFF ONLY', 'เฉพาะเจ้าหน้าที่', 'ผู้มาติดต่อเข้าไม่ได้'],
            ['OUT OF ORDER', 'เสีย ใช้การไม่ได้', 'ไม่ใช่ “ไม่เป็นระเบียบ”'],
            ['EMERGENCY EXIT', 'ทางออกฉุกเฉิน', 'ใช้เมื่อเกิดเหตุฉุกเฉิน'],
            ['WET FLOOR', 'พื้นเปียก ระวังลื่น', ''],
          ],
          highlightCol: 1,
        },
        {
          type: 'flow',
          title: 'วิธีจำ: อ่านข้อความสั้น 4 ขั้น',
          plain: true,
          nodes: [
            { level: 'ขั้น 1', name: 'อ่านคำถามก่อน', role: 'ถามจุดประสงค์ ใจความหลัก รายละเอียด อนุมาน ความหมายคำ หรือ NOT TRUE ขีดเส้นใต้คำสำคัญ', tone: 'ink' },
            { level: 'ขั้น 2', name: 'อ่านหัวเรื่องและประโยคแรก', role: 'Subject ของอีเมลและประโยคแรกมักบอกว่าเรื่องนี้เกี่ยวกับอะไร', tone: 'deep' },
            { level: 'ขั้น 3', name: 'หาคำจากคำถามในข้อความ', role: 'หาคำเดียวกันหรือคำที่ความหมายเหมือนกัน แล้วอ่านประโยคนั้นทั้งประโยค', tone: 'purple' },
            { level: 'ขั้น 4', name: 'ตัดตัวเลือกที่ข้อความไม่รองรับ', role: 'ตัดข้อที่ขัดกับข้อความ และข้อที่ต้องใช้ความรู้นอกข้อความ', tone: 'soft' },
          ],
          arrows: ['รู้ว่าต้องหาอะไร', 'รู้ว่าเรื่องคืออะไร', 'เจอประโยคที่ตอบ'],
        },
        {
          type: 'table',
          title: 'ประเภทคำถามและกับดัก',
          plain: true,
          rows: [
            ['คำถาม', 'หาอะไร', 'กับดัก'],
            ['Purpose / main idea', 'เรื่องที่คลุมทั้งข้อความ', 'รายละเอียดที่ถูกแต่แคบไป'],
            ['Detail', 'ประโยคที่มีคำจากคำถาม', 'ข้อมูลอื่นในข้อความเดียวกัน'],
            ['Inference', 'สิ่งที่ต้องจริงถ้าข้อความจริง', 'ข้อที่น่าจะจริงแต่ข้อความไม่บอก'],
            ['Vocabulary', 'คำรอบ ๆ ที่บอกความหมาย', 'ความหมายทั่วไปที่ไม่เข้าบริบท'],
            ['NOT TRUE / NOT mentioned', 'ไล่ตัดข้อที่มีในข้อความ', 'ข้อที่พูดด้วยคำอื่นแต่ความหมายเดียวกัน'],
          ],
          highlightCol: 2,
        },
        {
          type: 'note',
          title: 'ข้อความที่ 1 (ประกาศ ข้อความตัวอย่างที่เราแต่ง)',
          plain: true,
          body: 'LOST PROPERTY. Items found in the Sai Thong market area are kept at the front desk of Sai Thong Police Station for 30 days. To collect an item, owners must show an ID card and describe the item correctly. Items that are not collected within 30 days will be handed over to the district office. The front desk is open from 8.30 a.m. to 4.30 p.m., Monday to Friday.',
        },
        {
          type: 'list',
          title: 'ลองถามข้อความที่ 1 ห้าแบบ',
          plain: true,
          items: [
            { name: 'Purpose', desc: 'ประกาศนี้บอกเจ้าของของหายว่า**จะรับของคืนได้อย่างไร** (where, how, when) ไม่ใช่ประกาศรับสมัครงานหรือแจ้งว่าของถูกขโมย' },
            { name: 'Detail', desc: 'เจ้าของต้องเอาอะไรมา: **an ID card** และต้องบอกลักษณะของให้ถูก (describe the item correctly) ข้อความไม่ได้ขอรูปถ่ายหรือใบแจ้งความ' },
            { name: 'Inference', desc: 'คนที่มาวันอาทิตย์**จะรับของที่โต๊ะประชาสัมพันธ์ไม่ได้** เพราะเปิดเฉพาะวันจันทร์ถึงศุกร์ ข้อนี้ไม่ได้เขียนตรง ๆ แต่ต้องจริงถ้าข้อความจริง' },
            { name: 'Vocabulary', desc: '**collect** ในประโยคนี้แปลว่ามารับไป (pick up) และ **handed over** แปลว่าส่งมอบ (given) ให้หน่วยงานอื่น' },
            { name: 'NOT mentioned', desc: 'ข้อความ**ไม่ได้พูดถึง**ค่าธรรมเนียมการรับของ ถ้าตัวเลือกบอกว่าต้องจ่ายเงิน ถือว่าเกินข้อความ' },
          ],
        },
        {
          type: 'note',
          title: 'ข้อความที่ 2 (ย่อหน้าสั้น ข้อความตัวอย่างที่เราแต่ง)',
          plain: true,
          body: 'Phone scams are becoming more common. In a typical scam, the caller pretends to be a police officer or a bank employee and says that the victim’s bank account is involved in a crime. The caller then tells the victim to transfer money to a “safe account” so that it can be checked. Real police officers do not ask people to transfer money over the phone. If you receive a call like this, hang up and call your bank or the police using a number you already know.',
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'จากข้อความที่ 2 ข้อใดสรุปได้ (inference) ระหว่าง “Most bank employees are involved in phone scams.” “A caller who asks you to move money for checking is probably not a real officer.” “Police officers never use the phone to contact people.” และ “Victims always get their money back from the safe account.”',
          steps: [
            'หาประโยคที่เกี่ยว: Real police officers do not ask people to transfer money over the phone. ถ้าคนโทรมาขอให้โอนเงินไปตรวจ ก็ไม่ตรงกับสิ่งที่ตำรวจจริงทำ จึงน่าจะไม่ใช่ตำรวจจริง ตรงกับตัวเลือกที่สอง',
            '“Most bank employees are involved …” ข้อความบอกว่าคนร้าย**แอบอ้าง**เป็นพนักงานธนาคาร (pretends to be) ไม่ได้บอกว่าพนักงานธนาคารเป็นคนร้าย',
            '“Police officers never use the phone …” เกินข้อความ ข้อความห้ามแค่การขอให้โอนเงิน ไม่ได้บอกว่าตำรวจไม่โทรเลย ส่วน “Victims always get their money back …” ข้อความไม่ได้พูดถึงการได้เงินคืน และ always เป็นคำเกินข้อความ',
          ],
          answer: 'A caller who asks you to move money for checking is probably not a real officer.',
          trap: 'ตัวเลือกที่ใช้ never, always, most มักพูดเกินข้อความ ข้อที่ถูกในข้อ inference ต้องชี้ประโยคในข้อความที่รองรับได้',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อการอ่านแต่ละชุดมักมีป้ายหนึ่งข้อ (ป้ายจราจรหรือป้ายในอาคาร) อีเมลหรือประกาศที่ถามจุดประสงค์หรือรายละเอียดหนึ่งข้อ และข้อความความรู้ทั่วไปหนึ่งย่อหน้าที่ถามรายละเอียดหรือสิ่งที่สรุปได้ ข้ออีเมลที่ถามจุดประสงค์มักเป็นการเลื่อนหรือเปลี่ยนแปลงบางอย่าง ให้ดู Subject และประโยคแรก',
        },
      ],
    },

    // 5 · idioms and e-mail (maybe)
    {
      type: 'section',
      anchor: 'idiom',
      eyebrow: '5 · สำนวนและการขึ้นต้นอีเมล',
      title: 'สำนวนสั้น ๆ ที่โผล่ในบทสนทนา',
      priority: 'maybe',
      plain: true,
      body: [
        'บางข้อบทสนทนาเว้นช่องให้เติม**สำนวน** (idiom: กลุ่มคำที่ความหมายไม่ตรงตามตัวคำ) ถ้าแปลทีละคำจะเข้าใจผิด เช่น break a leg ไม่ได้แปลว่าขาหัก ส่วนนี้รวมสำนวนที่ใช้บ่อยและการขึ้นต้นลงท้ายอีเมลทางการ',
      ],
      blocks: [
        {
          type: 'table',
          title: 'สำนวนที่ใช้บ่อย (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          rows: [
            ['สำนวน', 'ความหมาย', 'ตัวอย่าง'],
            ['a piece of cake', 'ง่ายมาก', 'The test was a piece of cake.'],
            ['break a leg', 'ขอให้โชคดี (ก่อนแสดงหรือขึ้นเวที)', 'Break a leg tonight!'],
            ['call it a day', 'พอแค่นี้ เลิกงานวันนี้', 'It’s late. Let’s call it a day.'],
            ['keep an eye on', 'คอยดูแล เฝ้าดู', 'Keep an eye on my bag.'],
            ['give someone a hand', 'ช่วยเหลือ', 'Can you give me a hand?'],
            ['under the weather', 'ไม่ค่อยสบาย', 'I’m a bit under the weather.'],
          ],
          highlightCol: 1,
        },
        {
          type: 'list',
          title: 'อีเมลทางการ',
          plain: true,
          items: [
            { name: 'รู้ชื่อผู้รับ', desc: 'ขึ้นต้น **Dear Mr. / Ms. + นามสกุล** เช่น Dear Ms. Wongsa, (การใช้ชื่อต้น เช่น Dear Ms. Suda เป็นธรรมเนียมแบบไทย ในอีเมลภาษาอังกฤษทั่วไปใช้นามสกุล) ไม่ใช้ Hey หรือ Hi กับผู้ใหญ่ที่ยังไม่รู้จัก ลงท้ายแบบอังกฤษด้วย **Yours sincerely,**' },
            { name: 'ไม่รู้ชื่อผู้รับ', desc: 'ขึ้นต้น **Dear Sir or Madam,** ลงท้ายแบบอังกฤษด้วย **Yours faithfully,** ส่วน To whom it may concern ใช้เมื่อไม่รู้ผู้รับ จึงไม่ใส่ชื่อตามหลัง' },
            { name: 'ลงท้ายทั่วไป', desc: '**Best regards,** หรือ **Kind regards,** ใช้ได้ทั้งกึ่งทางการและทางการ ตามด้วยชื่อและตำแหน่งผู้ส่ง' },
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
          title: 'เลือกตัวเลือกที่ “ฟังดูสุภาพ” ที่สุด',
          body: 'เกิดเพราะตัวเลือกผิดในข้อบทสนทนามักสุภาพและถูกไวยากรณ์ วิธีแก้: ถามว่าประโยคก่อนช่องว่างทำหน้าที่อะไร (ขอบคุณ ขอโทษ ขอร้อง ถาม What หรือ Where) แล้วเลือกคำตอบที่ตอบหน้าที่นั้นและต่อกับบรรทัดถัดไปได้',
        },
        {
          title: 'ตอบ Yes กับ Would you mind …?',
          body: 'เกิดเพราะแปลว่า “ช่วย…ได้ไหม” แล้วตอบ Yes วิธีแก้: mind แปลว่ารังเกียจ จึงตอบ Not at all. หรือ Of course not. เมื่อยินดีทำให้',
        },
        {
          title: 'สลับ You’re welcome กับ Never mind',
          body: 'เกิดเพราะทั้งคู่แปลไทยว่า “ไม่เป็นไร” วิธีแก้: You’re welcome ตอบคำขอบคุณ ส่วน Never mind หรือ That’s all right ตอบคำขอโทษ',
        },
        {
          title: 'เลือกคำเหมือนในข้อที่ถามคำตรงข้าม',
          body: 'เกิดเพราะอ่านโจทย์ไม่ครบ วิธีแก้: ขีดเส้นใต้ closest หรือ opposite ก่อนดูตัวเลือก ตัวเลือกมักมีทั้งสองแบบรออยู่',
        },
        {
          title: 'ตอบข้อการอ่านด้วยความรู้นอกข้อความ',
          body: 'เกิดเพราะตัวเลือกนั้นจริงในชีวิตจริง วิธีแก้: ชี้ประโยคในข้อความที่รองรับให้ได้ ถ้าชี้ไม่ได้ หรือตัวเลือกใช้ always, never, all ที่ข้อความไม่ได้ใช้ ให้ตัดทิ้ง',
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
          id: 'pe3-c1',
          q: 'บทสนทนาที่เราแต่ง: เจ้าหน้าที่เดินชนผู้มาติดต่อจนน้ำหก Officer: “Oh, I’m so sorry! Are you all right?” Visitor: “______ It was only water.”',
          choices: ['That’s OK. Don’t worry about it.', 'You’re welcome. It was my pleasure.', 'Yes, I’d love to come with you.', 'Sorry, I don’t know where it is.'],
          answer: 0,
          why: 'เจ้าหน้าที่ขอโทษ คำตอบจึงต้องเป็นการรับคำขอโทษ “That’s OK. Don’t worry about it.” และต่อกับ It was only water. ได้พอดี ส่วน “You’re welcome. It was my pleasure.” ใช้ตอบคำขอบคุณ “Yes, I’d love to come with you.” ใช้ตอบคำชวน และ “Sorry, I don’t know where it is.” ใช้ตอบคำถามที่ถามทางหรือถามข้อมูล ทั้งสามจึงผิดหน้าที่',
          refs: [],
          plain: true,
        },
        {
          id: 'pe3-c2',
          q: 'บทสนทนาที่เราแต่ง: ที่สถานีตำรวจ Officer: “When did you last see your wallet?” Woman: “______”',
          choices: ['It’s a small brown leather wallet.', 'At about ten o’clock this morning.', 'Yes, I saw it.', 'I’d like to report it, please.'],
          answer: 1,
          why: 'When did you last see …? ถามเวลาที่เห็นครั้งสุดท้าย จึงต้องตอบเป็นเวลา “At about ten o’clock this morning.” ส่วน “It’s a small brown leather wallet.” ตอบคำถาม What does it look like? (หน้าตาเป็นอย่างไร) “Yes, I saw it.” ตอบ Yes กับคำถาม Wh- ไม่ได้และไม่บอกเวลา และ “I’d like to report it, please.” เป็นการบอกว่ามาแจ้งความ ซึ่งเจ้าหน้าที่รู้แล้วและไม่ตอบคำถาม When',
          refs: [],
          plain: true,
        },
        {
          id: 'pe3-c3',
          q: 'Choose the word closest in meaning to the word in bold (ประโยคตัวอย่างที่เราแต่ง): “The shop owner was **reluctant** to give his name, so the officer explained why it was needed.”',
          choices: ['eager', 'delighted', 'unwilling', 'quick'],
          answer: 2,
          why: 'เจ้าหน้าที่ต้องอธิบายว่าทำไมต้องใช้ชื่อ แสดงว่าเจ้าของร้านไม่อยากให้ชื่อ reluctant จึงแปลว่าไม่เต็มใจ ตรงกับ “unwilling” ส่วน “eager” (กระตือรือร้น) มีความหมายตรงข้าม “delighted” (ยินดีมาก) ก็ขัดกับการที่เจ้าหน้าที่ต้องอธิบายเหตุผล และ “quick” (รวดเร็ว) ไม่เกี่ยวกับความเต็มใจ',
          refs: [],
          plain: true,
        },
        {
          id: 'pe3-c4',
          q: 'A sign on the gate of a car park reads: STAFF ONLY. What does it mean? (ป้ายตัวอย่างที่เราแต่ง)',
          choices: ['Staff must pay to park here.', 'Visitors may park here for a short time.', 'The car park is closed today.', 'Only people who work here may use it.'],
          answer: 3,
          why: 'STAFF ONLY แปลว่าเฉพาะเจ้าหน้าที่ จึงตรงกับ “Only people who work here may use it.” ส่วน “Staff must pay to park here.” ป้ายไม่ได้พูดถึงค่าจอด “Visitors may park here for a short time.” ขัดกับป้ายเพราะผู้มาติดต่อไม่ใช่เจ้าหน้าที่ และ “The car park is closed today.” ป้ายไม่ได้บอกว่าปิด',
          refs: [],
          plain: true,
        },
        {
          id: 'pe3-c5',
          q: 'In the sentence “Owners must show an ID card to **collect** their items from the front desk,” the word “collect” means ___. (ประโยคตัวอย่างที่เราแต่ง)',
          choices: ['pick up and take away', 'buy again', 'count carefully', 'hide them from other people'],
          answer: 0,
          why: 'เจ้าของมาที่โต๊ะประชาสัมพันธ์เพื่อเอาของของตนกลับไป collect ในบริบทนี้จึงแปลว่ามารับไป “pick up and take away” ส่วน “buy again” ไม่เข้ากับของที่เป็นของตัวเองอยู่แล้ว “count carefully” และ “hide them from other people” ไม่เกี่ยวกับการแสดงบัตรเพื่อรับของ',
          refs: [],
          plain: true,
        },
      ],
    },

    // explain
    {
      type: 'explain',
      plain: true,
      prompt: 'อธิบายด้วยคำของคุณเองว่า ถ้ามีคนพูดว่า “Would you mind waiting here for a moment?” ทำไมการตอบ “Yes, I would.” จึงไม่ใช่การตอบรับ และควรตอบอย่างไรเมื่อยินดีรอ',
      model: 'mind แปลว่ารังเกียจหรือไม่สะดวก คำถามจึงแปลตรง ๆ ว่า “คุณรังเกียจไหมที่จะรอตรงนี้” ถ้าตอบ Yes, I would. จะแปลว่า “รังเกียจ” ซึ่งเป็นการปฏิเสธ ถ้ายินดีรอควรตอบ Not at all. หรือ Of course not. ซึ่งแปลว่า “ไม่รังเกียจเลย”',
    },
  ],

  test: [
    {
      id: 'pe3-t01',
      q: 'บทสนทนาที่เราแต่ง: นักท่องเที่ยวถามเจ้าหน้าที่ใกล้ตลาด Tourist: “Excuse me. Is there a pharmacy near here?” Officer: “______ It’s opposite the post office, about two minutes from here.”',
      choices: ['No, thank you. I’m not feeling sick.', 'You’re welcome. I hope you enjoy your trip here.', 'Yes, there’s one just around the corner.', 'Sorry, I’m busy right now.'],
      answer: 2,
      why: 'Is there …? เป็นคำถาม Yes/No และประโยคถัดไปบอกตำแหน่งร้านขายยา คำตอบจึงต้องเป็นการบอกว่ามี “Yes, there’s one just around the corner.” ส่วน “No, thank you. I’m not feeling sick.” เข้าใจผิดว่าถูกถามว่าป่วยไหม “You’re welcome. I hope you enjoy your trip here.” ใช้ตอบคำขอบคุณตอนจบบทสนทนา และ “Sorry, I’m busy right now.” ขัดกับประโยคถัดไปที่เจ้าหน้าที่บอกทางให้ต่อทันที',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t02',
      q: 'บทสนทนาที่เราแต่ง: มีคนโทรมาที่โต๊ะประชาสัมพันธ์ของสถานี Caller: “Could I speak to Sergeant Malee, please?” Desk officer: “______” Caller: “Yes, please. Tell her Somchai called about tomorrow’s meeting.”',
      choices: ['Speaking. How can I help you?', 'She’s out at the moment. Can I take a message?', 'I’m sorry, you have the wrong number.', 'Hold on, please. I’ll put you through to her now.'],
      answer: 1,
      why: 'คนโทรตอบว่า Yes, please. แล้วฝากบอกต่อ แสดงว่าเจ้าหน้าที่เสนอรับฝากข้อความ จึงเป็น “She’s out at the moment. Can I take a message?” ส่วน “Speaking. How can I help you?” แปลว่าผู้รับสายคือจ่ามาลีเอง จึงขัดกับ Tell her “I’m sorry, you have the wrong number.” ขัดกับการฝากข้อความถึงคนในสถานี และ “Hold on, please. I’ll put you through to her now.” เป็นการโอนสาย ซึ่งคนโทรจะได้คุยเอง ไม่ต้องฝากข้อความ',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t03',
      q: 'บทสนทนาที่เราแต่ง: ชายสูงอายุกำลังกรอกแบบฟอร์มที่โต๊ะประชาสัมพันธ์ Officer: “Would you like me to help you with that form?” Man: “______ My eyes aren’t very good these days.”',
      choices: ['No, thank you. I can do it all by myself.', 'Here you are.', 'It doesn’t matter.', 'Yes, please. That’s very kind of you.'],
      answer: 3,
      why: 'เจ้าหน้าที่เสนอช่วย และชายคนนั้นบอกต่อว่าสายตาไม่ค่อยดี ซึ่งเป็นเหตุผลของการรับความช่วยเหลือ จึงเป็น “Yes, please. That’s very kind of you.” ส่วน “No, thank you. I can do it all by myself.” เป็นการปฏิเสธซึ่งขัดกับเหตุผลที่ตามมา “Here you are.” ใช้ตอนยื่นของให้ และ “It doesn’t matter.” ใช้ตอบคำขอโทษหรือบอกว่าไม่สำคัญ ไม่ได้ตอบข้อเสนอ',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t04',
      q: 'บทสนทนาที่เราแต่ง: ผู้หญิงคนหนึ่งเดินเข้าสถานีตำรวจด้วยท่าทางกังวล Officer: “Good morning. What can I do for you?” Woman: “______” Officer: “I’m sorry to hear that. When did you last see it?”',
      choices: ['I’m fine, thank you. And you?', 'I’d like to report a missing motorbike.', 'I’ve been waiting here for an hour.', 'Could you tell me the way to the nearest bank?'],
      answer: 1,
      why: 'เจ้าหน้าที่ตอบว่าเสียใจด้วยและถามว่าเห็น “มัน” ครั้งสุดท้ายเมื่อไร แสดงว่าผู้หญิงแจ้งว่าของหาย จึงเป็น “I’d like to report a missing motorbike.” ส่วน “I’m fine, thank you. And you?” ใช้ตอบ How are you? ไม่ใช่ What can I do for you? “I’ve been waiting here for an hour.” ไม่มีสิ่งของให้ถามว่าเห็นครั้งสุดท้ายเมื่อไร และ “Could you tell me the way to the nearest bank?” ไม่เข้ากับคำว่า I’m sorry to hear that',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t05',
      q: 'Choose the word closest in meaning to the word in bold (ประโยคตัวอย่างที่เราแต่ง): “This list is **confidential**. Do not share it with anyone outside the team.”',
      choices: ['secret', 'correct', 'public', 'short'],
      answer: 0,
      why: 'ประโยคหลังห้ามบอกคนนอกทีม confidential จึงแปลว่าเป็นความลับ ตรงกับ “secret” ส่วน “public” (เปิดเผย สาธารณะ) มีความหมายตรงข้าม “correct” (ถูกต้อง) และ “short” (สั้น) ไม่เกี่ยวกับการห้ามบอกผู้อื่น',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t06',
      q: 'Choose the word OPPOSITE in meaning to the word in bold (ประโยคตัวอย่างที่เราแต่ง): “The road will be closed during the festival, but this is only a **temporary** change.”',
      choices: ['brief', 'short', 'limited', 'permanent'],
      answer: 3,
      why: 'temporary แปลว่าชั่วคราว คำตรงข้ามคือ “permanent” (ถาวร) ส่วน “brief” “short” และ “limited” ล้วนมีความหมายใกล้เคียงกับชั่วคราวหรือมีระยะจำกัด จึงเป็นคำเหมือน ไม่ใช่คำตรงข้าม ข้อนี้ดักคนที่อ่านโจทย์ไม่เห็นคำว่า OPPOSITE',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t07',
      q: 'Choose the best word to complete the sentence (ประโยคตัวอย่างที่เราแต่ง): “The suspect’s fingerprints on the window are important ___ in this case.”',
      choices: ['victim', 'witness', 'evidence', 'warrant'],
      answer: 2,
      why: 'ลายนิ้วมือเป็นสิ่งที่ช่วยพิสูจน์ว่าใครทำ จึงเป็น “evidence” (หลักฐาน) ซึ่งเป็นคำนามนับไม่ได้ ใช้ตามหลัง important ได้โดยไม่มี a ส่วน “victim” (ผู้เสียหาย) และ “witness” (พยาน) เป็นคน ไม่ใช่สิ่งของอย่างลายนิ้วมือ และเป็นคำนามนับได้ซึ่งต้องมี a หรือเติม s และ “warrant” (หมาย เช่น หมายจับ) เป็นเอกสารที่ศาลออก ไม่ใช่ลายนิ้วมือ',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t08',
      q: 'A notice on a lift in an office building reads: OUT OF ORDER. What should people do? (ป้ายตัวอย่างที่เราแต่ง)',
      choices: ['Wait in line to use this lift.', 'Use the stairs or another lift.', 'Use this lift only in an emergency.', 'Press the button twice to call the lift.'],
      answer: 1,
      why: 'OUT OF ORDER แปลว่าเสีย ใช้การไม่ได้ จึงต้องใช้ทางอื่น “Use the stairs or another lift.” ส่วน “Wait in line to use this lift.” และ “Press the button twice to call the lift.” ยังพยายามใช้ลิฟต์ที่เสีย และ “Use this lift only in an emergency.” สับสนกับป้ายทางออกฉุกเฉิน ลิฟต์ที่เสียใช้ไม่ได้ทุกกรณี',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t09',
      q: 'Read the email (ข้อความตัวอย่างที่เราแต่ง): “Dear all, The computer system at the front desk will be updated this Wednesday from 1 p.m. to 3 p.m. During this time, please write all reports by hand and enter them into the system after 3 p.m. Thank you. IT Section” What is the main purpose of this email?',
      choices: ['To ask staff to stop writing reports', 'To announce a new front desk officer', 'To explain how to repair the computer', 'To tell staff that the computer system will not be available for a short time'],
      answer: 3,
      why: 'ประโยคแรกบอกว่าระบบจะปรับปรุงช่วง 13.00–15.00 น. และประโยคถัดไปบอกว่าระหว่างนั้นต้องทำอย่างไร จุดประสงค์จึงเป็น “To tell staff that the computer system will not be available for a short time” ส่วน “To ask staff to stop writing reports” ขัดกับข้อความที่ให้เขียนรายงานด้วยมือต่อไป “To announce a new front desk officer” และ “To explain how to repair the computer” ข้อความไม่ได้พูดถึงเลย',
      refs: [],
      plain: true,
    },
    {
      id: 'pe3-t10',
      q: 'Read the notice (ข้อความตัวอย่างที่เราแต่ง): “ROAD SAFETY TALK FOR PARENTS. Wednesday, 6 p.m., Na Mueang School hall. The talk will cover child car seats and speed limits near schools. Seats are limited, so please register by Monday.” Which statement can be inferred from the notice?',
      choices: ['It is a good idea to register early.', 'The talk is held in the morning.', 'The talk is only for teachers.', 'Anyone can join without registering.'],
      answer: 0,
      why: 'ประกาศบอกว่าที่นั่งมีจำกัดและให้ลงทะเบียนภายในวันจันทร์ จึงสรุปได้ว่าควรลงทะเบียนแต่เนิ่น ๆ “It is a good idea to register early.” ส่วน “The talk is held in the morning.” ขัดกับเวลา 6 p.m. “The talk is only for teachers.” ขัดกับหัวเรื่อง FOR PARENTS และ “Anyone can join without registering.” ขัดกับคำขอให้ลงทะเบียน',
      refs: [],
      plain: true,
    },
  ],

  sources: [{ doc: 'police-exam-scope-summary' }],
};

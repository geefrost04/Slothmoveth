import type { MCQ } from '@/lib/learn/types';

// Fresh 20-item topic test for topic pe (ภาษาอังกฤษ, police อก.1 course). Covers only what pe1–pe3 teach; none of
// these stems, dialogues or the passage appears in the lesson checks/tests or in the police bank (grepped both).
// Spread: pe1 ×6 (tt01–06), pe2 ×6 (tt07–12), pe3 ×8 (tt13–20: conversation ×4, vocabulary ×2, reading ×2 on one
// short notice). Every sentence, dialogue and notice is our own (ประโยค/บทสนทนา/ข้อความตัวอย่างที่เราแต่ง).
// Grammar and conversation patterns are general knowledge, so every item is `plain: true`.
// Grammar items: exactly one grammatical choice. Conversation items: the key is the only natural reply; each
// distractor answers a different function, belongs to the other speaker, or contradicts the next line.
// Avoided per the pe fact-check: comparison words that take both -er and more, `need` as a gerund/infinitive key,
// neither of / collective nouns as agreement keys, and the "try a noun after to" test.

export const topicTest: MCQ[] = [
  // pe1 · ชนิดของคำ Tense ประธานกับกริยา Article
  {
    id: 'pe-tt01',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The new duty roster is very ___, so everyone knows exactly which shift they work.”',
    choices: ['clearly', 'clarify', 'clear', 'clearness'],
    answer: 2,
    why: 'ช่องว่างอยู่หลัง is very และบอกลักษณะของประธาน (the duty roster) จึงต้องเป็นคุณศัพท์ “clear” “clearly” เป็นกริยาวิเศษณ์ ใช้ขยายกริยา ไม่ใช้บอกลักษณะประธานหลัง be “clarify” เป็นกริยา ตามหลัง very ไม่ได้ และ “clearness” เป็นคำนาม ซึ่ง very ไม่ขยายคำนาม',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt02',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “These two helmets are not ours. They belong to the traffic officers, so they are ___.”',
    choices: ['theirs', 'their', 'them', 'they'],
    answer: 0,
    why: 'หลังช่องว่างไม่มีคำนามตาม จึงต้องใช้สรรพนามแสดงความเป็นเจ้าของที่ยืนลอยได้ คือ “theirs” (= their helmets) เหมือน ours ในประโยคแรก “their” ต้องมีคำนามตาม เช่น their helmets “them” เป็นรูปกรรม ใช้หลังกริยาหรือคำบุพบท ไม่ได้บอกความเป็นเจ้าของ และ “they” เป็นรูปประธาน',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt03',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “So far this year, the front desk ___ more than 300 reports of lost documents.”',
    choices: ['received', 'receives', 'is receiving', 'has received'],
    answer: 3,
    why: 'คำบอกเวลา so far this year คือช่วงที่เริ่มต้นปีแล้วลากมาถึงตอนนี้ จึงใช้ present perfect (has + V3) ได้ “has received” “received” เป็น past simple ใช้กับเวลาอดีตที่จบแล้ว ไม่ใช่ช่วงที่ยังไม่จบ “receives” เป็นกิจวัตร ไม่ได้นับยอดถึงตอนนี้ และ “is receiving” บอกสิ่งที่กำลังเกิดขณะพูด ไม่ใช่ยอดรวมตั้งแต่ต้นปี',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt04',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “When the fire engines arrived at the warehouse, most of the workers ___ already left the building.”',
    choices: ['have', 'had', 'has', 'were'],
    answer: 1,
    why: 'มีสองเหตุการณ์ในอดีต คนงานออกไปก่อน แล้วรถดับเพลิงจึงมาถึง (arrived เป็น V2) เหตุการณ์ที่เกิดก่อนใช้ past perfect คือ “had” + V3 (had already left) “have” และ “has” เป็น present perfect ใช้คู่กับเหตุการณ์อดีตที่ระบุชัด (When … arrived) ไม่ได้ และ has ยังผิดพจน์กับ most of the workers ส่วน “were” ทำให้เป็น were left ซึ่งเป็นรูป passive (ถูกทิ้งไว้) แต่ประโยคนี้มีกรรม the building ตามหลัง left และคนงานเป็นผู้ออกไปเอง จึงผิด',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt05',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The number of motorcycle thefts in our district ___ fallen sharply since the new CCTV cameras were installed.”',
    choices: ['has', 'have', 'are', 'were'],
    answer: 0,
    why: 'The number of … มีประธานตัวจริงคือ number (จำนวน) ซึ่งเป็นเอกพจน์ และ since บอกว่าใช้ present perfect จึงได้ “has” fallen “have” ผันตาม thefts ที่อยู่ติดกริยา หรือสับสนกับ a number of (= หลาย) ซึ่งใช้พหูพจน์ ส่วน “are” และ “were” ผิดทั้งพจน์และรูป เพราะ fallen ต้องมากับ has/have',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt06',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Before the festival, the officer gave the shop owners ___ about keeping their cash safe.”',
    choices: ['an useful advice', 'many useful advices', 'a useful advices', 'some useful advice'],
    answer: 3,
    why: 'advice เป็นคำนามนับไม่ได้ ไม่ใช้ a/an ไม่เติม s และใช้ some ได้ จึงได้ “some useful advice” “an useful advice” ผิดสองจุด คือใช้ an กับนามนับไม่ได้ และ useful ขึ้นต้นด้วยเสียง “ยู” ซึ่งเป็นเสียงพยัญชนะ “many useful advices” ใช้ many และเติม s กับนามนับไม่ได้ ส่วน “a useful advices” ใช้ a คู่กับรูปพหูพจน์',
    refs: [],
    plain: true,
  },

  // pe2 · Passive Relative clause Comparison V-ing/to V Preposition Conditional
  {
    id: 'pe-tt07',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Under the new rule, all overtime claims must ___ to the finance section by the 25th of each month.”',
    choices: ['submit', 'be submit', 'be submitted', 'been submitted'],
    answer: 2,
    why: 'ใบเบิกค่าล่วงเวลา (overtime claims) ส่งตัวเองไม่ได้ จึงเป็น passive และหลัง modal ใช้ be รูปเดิม + V3 ได้ must “be submitted” “submit” เป็น active แปลว่าใบเบิกเป็นผู้ส่ง “be submit” ใช้ V1 แทน V3 และ “been submitted” ผิดเพราะหลัง must ต้องเป็น be ไม่ใช่ been',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt08',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The driver ___ caused the accident has been charged with careless driving.”',
    choices: ['which', 'who', 'whose', 'where'],
    answer: 1,
    why: 'คำหน้าช่องว่างคือ driver ซึ่งเป็นคน และหลังช่องว่างขาดประธานของ caused จึงใช้ “who” “which” ใช้กับสิ่งของหรือสัตว์ “whose” ต้องตามด้วยคำนามที่เป็นของคำข้างหน้า แต่หลังช่องว่างเป็นกริยา caused และ “where” ใช้กับสถานที่และต้องตามด้วยประโยคที่ครบแล้ว',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt09',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Friday evening is usually ___ time of the week at the front desk.”',
    choices: ['the busiest', 'busier', 'the most busiest', 'busy'],
    answer: 0,
    why: 'โครงสร้าง … time of the week คือเทียบกับทุกช่วงในสัปดาห์ จึงเป็นขั้นสุด busy เป็นคำสองพยางค์ลงท้าย -y เปลี่ยนเป็น -iest ได้ “the busiest” “busier” เป็นขั้นกว่า ใช้คู่กับ than และขาด the หน้าคำนามเอกพจน์ time “the most busiest” ใช้ most ซ้อนกับ -est และ “busy” เป็นรูปเดิม ขาด article หน้าคำนามนับได้เอกพจน์ time',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt10',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “After two months on night duty, Officer Win has finally got used to ___ during the day.”',
    choices: ['sleep', 'slept', 'asleep', 'sleeping'],
    answer: 3,
    why: 'get used to (เคยชินกับ) เป็นวลีที่ to เป็นคำบุพบท จึงตามด้วยคำนามหรือ V-ing ได้ “sleeping” “sleep” เกิดจากคิดว่า to ทุกตัวต้องตามด้วย V1 ซึ่งใช้ได้กับ used to ที่แปลว่า “เคย” โดยไม่มี be/get นำหน้าเท่านั้น “slept” เป็น V2 ตามหลังคำบุพบทไม่ได้ และ “asleep” เป็นคุณศัพท์ ตามหลัง got used to โดยลำพังไม่ได้',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt11',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Applicants must send their documents to the personnel section ___ 30 June at the latest.”',
    choices: ['until', 'since', 'by', 'during'],
    answer: 2,
    why: 'at the latest (อย่างช้าที่สุด) บอกเส้นตาย คือส่งเมื่อไรก็ได้แต่ไม่เกินวันที่ 30 มิถุนายน จึงใช้ “by” “until” ใช้กับการกระทำที่ต่อเนื่องไปจนถึงจุดเวลา เช่น wait until 5 p.m. แต่การส่งเอกสารเป็นการกระทำครั้งเดียว “since” บอกจุดเริ่มต้นของช่วงที่ลากมาถึงตอนนี้ ใช้กับ present perfect และ “during” ตามด้วยช่วงเวลา เช่น during the meeting ไม่ใช่วันที่',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt12',
    q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “If I ___ you, I would report the lost bank card to the bank at once.”',
    choices: ['am', 'were', 'will be', 'had been'],
    answer: 1,
    why: 'ส่วนผลเป็น would + V1 (would report) จึงเป็นประโยค if แบบที่ 2 คือสมมุติสิ่งที่ไม่ตรงกับความจริงตอนนี้ (ผู้พูดไม่ใช่อีกฝ่าย) ส่วน if ใช้ V2 และภาษาทางการใช้ “were” กับทุกประธาน “am” เป็นรูปของแบบที่ 0–1 ไม่เข้าคู่กับ would “will be” ใส่ will ในส่วน if และ “had been” เป็นแบบที่ 3 ซึ่งส่วนผลต้องเป็น would have + V3',
    refs: [],
    plain: true,
  },

  // pe3 · บทสนทนา
  {
    id: 'pe-tt13',
    q: 'บทสนทนาที่เราแต่ง: มีคนโทรเข้ามาที่สถานีตำรวจ Caller: “Hello, is that Somchai’s Garage?” Officer: “______ This is Bang Khen Police Station.” Caller: “Oh, I’m so sorry.”',
    choices: [
      'Can I leave a message?',
      'Speaking. How can I help you?',
      'Hold on, please. I’ll put you through.',
      'Sorry, you have the wrong number.',
    ],
    answer: 3,
    why: 'คนโทรถามหาอู่ซ่อมรถ แต่ปลายสายเป็นสถานีตำรวจ และคนโทรขอโทษในบรรทัดถัดไป แปลว่าโทรผิด เจ้าหน้าที่จึงต้องบอกว่า “Sorry, you have the wrong number.” “Can I leave a message?” เป็นประโยคของคนโทร ไม่ใช่ของผู้รับสาย “Speaking. How can I help you?” แปลว่าผู้รับสายคือที่ที่ถูกถามหา ขัดกับ This is Bang Khen Police Station และ “Hold on, please. I’ll put you through.” คือจะโอนสายให้ ซึ่งโอนไปอู่ซ่อมรถไม่ได้และไม่เข้ากับคำขอโทษที่ตามมา',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt14',
    q: 'บทสนทนาที่เราแต่ง: หน้าสถานีตำรวจ Officer: “Would you mind moving your car? It’s blocking the station gate.” Driver: “______ I’ll move it right away.”',
    choices: ['Not at all.', 'Yes, I do.', 'You’re welcome.', 'Here you are.'],
    answer: 0,
    why: 'mind แปลว่ารังเกียจ คำถาม Would you mind …? จึงตอบรับด้วย “Not at all.” (ไม่รังเกียจเลย ยินดีทำ) ซึ่งเข้ากับ I’ll move it right away “Yes, I do.” แปลว่ารังเกียจ ไม่ยอมย้าย ขัดกับประโยคถัดไป “You’re welcome.” ใช้ตอบคำขอบคุณ และ “Here you are.” ใช้ตอนยื่นของให้',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt15',
    q: 'บทสนทนาที่เราแต่ง: นักท่องเที่ยวถามทาง Tourist: “Excuse me. How do I get to the railway station from here?” Officer: “______” Tourist: “Straight on, then left at the bank. Thank you!”',
    choices: [
      'It’s closed on Sundays and public holidays.',
      'It takes about fifteen minutes from here on foot.',
      'Go straight on, then turn left at the bank.',
      'Yes, I’ve been there many times.',
    ],
    answer: 2,
    why: 'How do I get to …? ถามวิธีไป จึงต้องตอบเป็นเส้นทาง และนักท่องเที่ยวทวนว่า Straight on, then left at the bank ซึ่งตรงกับ “Go straight on, then turn left at the bank.” เท่านั้น “It’s closed on Sundays and public holidays.” ตอบเรื่องวันเปิดปิด “It takes about fifteen minutes from here on foot.” ตอบว่าใช้เวลาเท่าไร (How long) และ “Yes, I’ve been there many times.” ตอบเหมือนคำถาม Yes/No ทั้งสามข้อไม่ได้บอกทาง จึงต่อกับบรรทัดถัดไปไม่ได้',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt16',
    q: 'บทสนทนาที่เราแต่ง: ในห้องทำงาน Colleague: “I’m taking the sergeant exam tomorrow morning.” You: “______” Colleague: “Thanks. I’ll need it!”',
    choices: ['Congratulations!', 'Good luck!', 'That’s too bad.', 'You’re welcome.'],
    answer: 1,
    why: 'เพื่อนจะสอบพรุ่งนี้ คำที่พูดก่อนสอบคืออวยพรว่า “Good luck!” และคำตอบ Thanks. I’ll need it! (it = โชค) ยืนยันว่าเป็นคำอวยพรให้โชคดี “Congratulations!” ใช้ยินดีกับสิ่งที่สำเร็จแล้ว เช่น สอบผ่าน แต่เพื่อนยังไม่ได้สอบ “That’s too bad.” ใช้กับข่าวร้าย และ “You’re welcome.” ใช้ตอบคำขอบคุณ ไม่มีใครขอบคุณในบรรทัดก่อนหน้า',
    refs: [],
    plain: true,
  },

  // pe3 · คำศัพท์
  {
    id: 'pe-tt17',
    q: 'Choose the word closest in meaning to the word in bold (ประโยคตัวอย่างที่เราแต่ง): “Applicants can **obtain** the form from the front desk or download it from the website.”',
    choices: ['sign', 'return', 'check', 'get'],
    answer: 3,
    why: 'obtain แปลว่าได้มา และประโยคบอกทางเลือกอีกทางคือ download it from the website ซึ่งเป็นการได้แบบฟอร์มมาเหมือนกัน จึงตรงกับ “get” “sign” (ลงชื่อ) และ “check” (ตรวจ) เป็นสิ่งที่ทำกับแบบฟอร์มหลังได้มาแล้ว ไม่เข้ากับ from the front desk ส่วน “return” (ส่งคืน) มีทิศทางกลับกัน คือเอาไปคืน ไม่ใช่รับมา',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt18',
    q: 'Choose the word OPPOSITE in meaning to the word in bold (ประโยคตัวอย่างที่เราแต่ง): “The court found the driver **guilty** of drunk driving.”',
    choices: ['innocent', 'responsible', 'careless', 'dishonest'],
    answer: 0,
    why: 'guilty แปลว่ามีความผิด คู่ตรงข้ามที่ต้องจำคือ “innocent” (บริสุทธิ์ ไม่มีความผิด) “responsible” ในบริบทนี้ (responsible for = เป็นผู้ก่อ) ความหมายใกล้กับ guilty ไม่ใช่ตรงข้าม เป็นกับดักของคนที่อ่านโจทย์ไม่ถึงคำว่า OPPOSITE ส่วน “careless” (ประมาท) และ “dishonest” (ไม่ซื่อสัตย์) เป็นลักษณะนิสัย ไม่ใช่ผลคำตัดสินที่ตรงข้ามกับมีความผิด',
    refs: [],
    plain: true,
  },

  // pe3 · การอ่าน (ข้อ 19–20 ใช้ข้อความเดียวกัน)
  {
    id: 'pe-tt19',
    q: 'Read the notice (ข้อความตัวอย่างที่เราแต่ง): “ONLINE REPORTS. From 1 October, people can report minor incidents, such as a lost ID card or a lost phone, on the Mueang Thong Police Station website instead of coming to the station. After sending the online form, you will receive a report number by e-mail within 24 hours. The online form cannot be used for serious crimes such as robbery or assault. These must still be reported at the station or by phone.” What is the notice mainly about?',
    choices: [
      'How to prevent robbery and assault',
      'A new way to report minor incidents',
      'The opening hours of Mueang Thong Police Station',
      'How to apply for a new ID card',
    ],
    answer: 1,
    why: 'หัวเรื่อง ONLINE REPORTS และประโยคแรกบอกว่าตั้งแต่ 1 ตุลาคม แจ้งเหตุเล็กน้อยทางเว็บไซต์ได้แทนการมาที่สถานี ส่วนที่เหลือเป็นรายละเอียดของบริการนี้ ใจความหลักจึงเป็น “A new way to report minor incidents” “How to prevent robbery and assault” ข้อความพูดถึงชิงทรัพย์และทำร้ายร่างกายแค่ว่าต้องแจ้งที่สถานีหรือทางโทรศัพท์ ไม่ได้สอนวิธีป้องกัน “The opening hours of Mueang Thong Police Station” ไม่มีเวลาทำการในข้อความ และ “How to apply for a new ID card” ข้อความพูดถึงการแจ้งบัตรหาย ไม่ใช่การทำบัตรใหม่',
    refs: [],
    plain: true,
  },
  {
    id: 'pe-tt20',
    q: 'From the same notice (ONLINE REPORTS, ข้อความตัวอย่างที่เราแต่ง), which of the following can be inferred?',
    choices: [
      'Reports made online are handled faster than reports that people make at the station.',
      'All incidents in the area can now be reported on the station website.',
      'Someone who has lost a phone can get a report number without visiting the station.',
      'Victims of robbery must wait 24 hours before they report the crime.',
    ],
    answer: 2,
    why: 'ข้อความบอกว่าโทรศัพท์หายเป็นเหตุเล็กน้อยที่แจ้งทางเว็บไซต์ได้แทนการมาสถานี และหลังส่งแบบฟอร์มจะได้เลขรับแจ้งทางอีเมล สองประโยครวมกันจึงต้องจริงว่า “Someone who has lost a phone can get a report number without visiting the station.” “Reports made online are handled faster …” ข้อความไม่ได้เทียบความเร็วกับการแจ้งที่สถานี “All incidents in the area …” ขัดกับข้อความที่ห้ามใช้แบบฟอร์มออนไลน์กับคดีร้ายแรง และ “Victims of robbery must wait 24 hours …” นำตัวเลข 24 ชั่วโมงของการได้เลขรับแจ้งมาใช้ผิดเรื่อง',
    refs: [],
    plain: true,
  },
];

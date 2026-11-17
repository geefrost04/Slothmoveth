// Summary page for topic pe (ภาษาอังกฤษ, police อก.1 course): the last-day cram page. Only what pe1–pe3 teach.
// Grammar, conversation patterns, vocabulary and reading strategy are general knowledge ("ความรู้ทั่วไปด้านไวยากรณ์
// ภาษาอังกฤษ" / "ความรู้ทั่วไปด้านภาษาอังกฤษ"), so every piece and number is `plain: true`; only the question count
// cites the scope summary. No `compare` table (it needs refs and there is no official document). Rules follow the
// fact-checked pe1/pe2 (comparison: one-syllable and two-syllable -y words take -er/-est; to-as-preposition is a
// fixed list, not a "try a noun" test). Frequency remarks are our estimate from the mocks.
import type { Summary } from '@/lib/learn/types';

export const summary: Summary = {
  topic: 'pe',
  question: 'เบาะแสในประโยคหรือบทสนทนาบอกคำตอบไว้แล้ว เราหาเบาะแสนั้นเจอหรือยัง',
  questionNote:
    'วิชาภาษาอังกฤษมี 15 ข้อ (ตามสรุปขอบเขตจากประกาศ) จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อไวยากรณ์มีประมาณ 2 ใน 5 ที่เหลือแบ่งใกล้เคียงกันระหว่างบทสนทนา คำศัพท์ และการอ่าน ทั้งหัวข้อเป็นความรู้ทั่วไปด้านภาษาอังกฤษ ไม่มีเอกสารราชการกำหนด ประโยคและบทสนทนาในหน้านี้เป็นประโยคตัวอย่างที่เราแต่ง วิธีจำของเรา: ข้อไวยากรณ์ดูคำที่อยู่ติดช่องว่าง ข้อบทสนทนาดูหน้าที่ของประโยคก่อนช่องว่างและบรรทัดหลังช่องว่าง ข้อการอ่านตอบจากข้อความเท่านั้น',
  flow: {
    type: 'flow',
    title: 'จากรูปคำถึงการอ่าน',
    plain: true,
    nodes: [
      { level: 'บทที่ 1', name: 'ชนิดคำ Tense ประธานกับกริยา Article', role: 'เลือกรูปคำจากตำแหน่ง เลือก tense จากคำบอกเวลา ผันกริยาตามประธานตัวจริง', tone: 'deep' },
      { level: 'บทที่ 2', name: 'Passive Relative clause เปรียบเทียบ V-ing/to V คำบุพบท', role: 'ดูคำรอบช่องว่าง แล้วถามคำถามเดียวให้ตรงเรื่อง เช่น ประธานทำเองได้ไหม หลังช่องว่างครบไหม', tone: 'purple' },
      { level: 'บทที่ 3', name: 'บทสนทนา คำศัพท์ การอ่าน', role: 'ดูหน้าที่ของประโยค เดาความหมายจากบริบท และชี้ประโยคในข้อความที่รองรับคำตอบ', tone: 'soft' },
    ],
    arrows: ['รูปคำและกริยาพื้นฐาน', 'ใช้ไวยากรณ์ในประโยคจริง'],
    loopNote: 'ทุกบทใช้หลักเดียวกัน คืออย่าเลือกเพราะฟังคุ้นหูหรือฟังดูสุภาพ ให้หาเบาะแสในประโยคแล้วตัดตัวเลือกที่ขัดกับเบาะแสนั้น',
  },
  pieces: [
    {
      name: 'รูปคำและสรรพนาม',
      what: 'ตัวเลือกมักเป็นคำรากเดียวกันคนละชนิด เช่น care, careful, carefully, carefulness ดูตำแหน่ง: ขยายกริยาใช้กริยาวิเศษณ์ (-ly) หลัง be / look / seem / feel ที่บอกสภาพของประธานใช้คุณศัพท์ หลัง a / the / คุณศัพท์ใช้คำนาม สรรพนามหน้ากริยาใช้รูปประธาน หลังกริยาหรือคำบุพบทใช้รูปกรรม my / their ต้องมีคำนามตาม ส่วน mine / theirs ยืนลอยได้',
      why: 'คำอธิบายของเรา: ภาษาไทยไม่เปลี่ยนรูปคำ คนไทยจึงมักแปลว่า “ตอบสุภาพ” แล้วเลือกคุณศัพท์ ต้องถามว่าคำในช่องว่างขยายอะไร',
      link: 'ปัจจัยท้ายคำเป็นเบาะแส ไม่ใช่กฎตายตัว เช่น friendly ลงท้าย -ly แต่เป็นคุณศัพท์ ส่วน fast, hard ใช้เป็นกริยาวิเศษณ์ได้โดยไม่เติม -ly',
      key: 'ถามว่าช่องว่างขยายอะไร ขยายกริยาใช้ -ly บอกลักษณะประธานหลัง be ใช้คุณศัพท์',
      refs: [],
      plain: true,
    },
    {
      name: 'Tense กับคำบอกเวลา',
      what: 'หาคำบอกเวลาก่อน yesterday, ago, last …, in 2020 ใช้ past simple (V2) since, for, already, yet, just, so far, ever, never, recently, in the last five years ใช้ present perfect (has/have + V3) now, at the moment, Look! ใช้ present continuous เหตุการณ์ที่เกิดก่อนอีกเหตุการณ์ในอดีตใช้ past perfect (had + V3) และ will / be going to ตามด้วย V1',
      why: 'คำอธิบายของเรา: ภาษาไทยใช้คำว่า “แล้ว” จึงชวนให้เลือก has + V3 กับ yesterday หรือ ago ซึ่งผิด เพราะคำบอกเวลาอดีตที่ระบุชัดใช้กับ present perfect ไม่ได้',
      link: 'in 2020 (ปีที่จบแล้ว) ใช้ V2 แต่ in the last five years (ช่วงที่ลากมาถึงตอนนี้) ใช้ has/have + V3 · ข้อ passive ในบทที่ 2 ก็เลือกรูป be จากคำบอกเวลาแบบเดียวกัน',
      key: 'วงคำบอกเวลา แล้วถามว่าเหตุการณ์จบแล้ว หรือยังลากมาถึงตอนนี้',
      refs: [],
      plain: true,
    },
    {
      name: 'ประธานกับกริยา และนามนับไม่ได้',
      what: 'ตัดวลีขยายประธานออกก่อน (of …, with …, as well as …, together with …) แล้วผันตามคำนามหลัก each / every / everyone ใช้เอกพจน์ A and B ใช้พหูพจน์ either … or / neither … nor ผันตามตัวที่อยู่ใกล้กริยา The number of ใช้เอกพจน์ A number of ใช้พหูพจน์ news และนามนับไม่ได้ใช้เอกพจน์ police ใช้พหูพจน์',
      why: 'คำอธิบายของเรา: คำนามที่อยู่ติดกริยาดึงสายตา เช่น The list of missing items ทำให้เผลอใช้ are ทั้งที่ประธานคือ list',
      link: 'นามนับไม่ได้ เช่น information, advice, equipment, evidence ไม่ใช้ a/an ไม่เติม s ใช้ some / much / a little ส่วน a หรือ an ดูที่เสียงแรก ไม่ใช่ตัวสะกด (an hour, a university)',
      key: 'หาประธานตัวจริงหน้า of ก่อน แล้วค่อยผันกริยา',
      refs: [],
      plain: true,
    },
    {
      name: 'Passive และ Relative clause',
      what: 'ถ้าประธานทำเองไม่ได้ ใช้ passive คือ be + V3 ให้ be เปลี่ยนตามเวลา (is/are, was/were, has/have been, will be, must be + V3) ห้ามใช้ V2 หลัง be และกริยาที่ไม่มีกรรม เช่น happen, arrive ทำ passive ไม่ได้ Relative clause ดูคำหน้าช่องว่าง (คน สิ่งของ สถานที่) แล้วดูหลังช่องว่าง ขาดประธานหรือกรรมใช้ who / which / that ประโยคครบแล้วและเป็นสถานที่ใช้ where มีคำนามที่เป็นของตามมาใช้ whose',
      why: 'คำอธิบายของเรา: เห็นคำนามสถานที่แล้วรีบเลือก which เป็นกับดักที่พบบ่อย ต้องดูหลังช่องว่างก่อนเสมอ',
      link: 'มีจุลภาคนำหน้า ห้ามใช้ that · กริยาในอนุประโยคผันตามคำที่มันขยาย (The officers who work … / The officer who works …)',
      key: 'Passive: ประธานทำเองได้ไหม · Relative: หลังช่องว่างขาดอะไร',
      refs: [],
      plain: true,
    },
    {
      name: 'เปรียบเทียบ V-ing/to V คำบุพบท ประโยค if',
      what: 'than ใช้ขั้นกว่า the … in/of ใช้ขั้นสุด as … as ใช้รูปเดิม คำพยางค์เดียวและคำสองพยางค์ที่ลงท้าย -y เติม -er/-est (busier) คำสามพยางค์ขึ้นไปใช้ more/most ห้ามใช้ซ้อน หลังคำบุพบทใช้ V-ing enjoy, finish, avoid, mind ตามด้วย V-ing ส่วน want, decide, plan, agree, refuse ตามด้วย to + V1 at ใช้กับจุดเวลาและที่อยู่ที่มีเลขที่ on ใช้กับวัน in ใช้กับเดือน ปี',
      why: 'คำอธิบายของเรา: to ส่วนใหญ่เป็นส่วนของ to + V1 มีแค่วลีชุดหนึ่งที่ to เป็นคำบุพบท ต้องจำเป็นชุด คือ look forward to, be/get used to, be accustomed to, object to, be committed to, when it comes to, in addition to, contribute to',
      link: 'ประโยค if: แบบ 1 If + V1, will + V1 · แบบ 2 If + V2 (were), would + V1 · แบบ 3 If + had + V3, would have + V3 · unless = if … not ไม่ใส่ not ซ้ำ',
      key: 'หาคำบอกขั้นหรือคำหน้าช่องว่างก่อน แล้วเลือกรูปที่คำนั้นกำหนด',
      refs: [],
      plain: true,
    },
    {
      name: 'บทสนทนา คำศัพท์ และการอ่าน',
      what: 'บทสนทนา: ดูหน้าที่ของประโยคก่อนช่องว่าง (ขอบคุณ ขอโทษ ขอร้อง เสนอช่วย ถาม Wh-) แล้วเช็กกับบรรทัดหลังช่องว่าง คำศัพท์: อ่านทั้งประโยคแล้วเดาความหมายก่อนดูตัวเลือก ขีดเส้นใต้ closest หรือ opposite การอ่าน: อ่านคำถามก่อน แล้วกลับไปหาประโยคที่ตอบ',
      why: 'คำอธิบายของเรา: ตัวเลือกผิดในข้อบทสนทนามักถูกไวยากรณ์และฟังสุภาพ แต่ตอบผิดหน้าที่ ส่วนข้อการอ่าน ตัวเลือกที่จริงในชีวิตจริงแต่ข้อความไม่ได้พูด หรือใช้ always, never, all ที่ข้อความไม่ได้ใช้ ถือว่าผิด',
      link: 'คู่ที่สลับกันบ่อย: You’re welcome ตอบคำขอบคุณ ส่วน That’s all right / Never mind ตอบคำขอโทษ · Would you mind …? ตอบรับด้วย Not at all.',
      key: 'บทสนทนาดูหน้าที่ · คำศัพท์ดูบริบท · การอ่านชี้ประโยครองรับให้ได้',
      refs: [],
      plain: true,
    },
  ],
  numbers: [
    { label: 'ข้อสอบภาษาอังกฤษ', value: '15 ข้อ', meaning: 'ตามสรุปขอบเขตจากประกาศ', refs: [{ doc: 'police-exam-scope-summary' }] },
    { label: 'ชนิดของคำ', value: '8 ชนิด', meaning: 'noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection', refs: [], plain: true },
    { label: 'Passive', value: 'be + V3', meaning: 'be เปลี่ยนตามเวลา กริยาหลักเป็น V3 เสมอ หลัง modal ใช้ be รูปเดิม (must be signed)', refs: [], plain: true },
    { label: 'Present perfect', value: 'has/have + V3', meaning: 'มากับ since (จุดเริ่ม) for (ระยะเวลา) already, yet, just, so far ห้ามใช้กับ yesterday, ago, last …', refs: [], plain: true },
    { label: 'Past perfect', value: 'had + V3', meaning: 'เหตุการณ์ที่เกิดก่อนอีกเหตุการณ์ในอดีต เหตุการณ์ที่ตามมาใช้ V2', refs: [], plain: true },
    { label: 'ประโยค if', value: '4 แบบ (0–3)', meaning: '0 ความจริงทั่วไป · 1 เป็นไปได้จริง (will) · 2 สมมุติตอนนี้ (would) · 3 สมมุติย้อนอดีต (would have + V3)', refs: [], plain: true },
    { label: 'at · on · in', value: 'จุด · วัน · ช่วงยาว', meaning: 'at 9 a.m. / at the station · on Monday / on the desk · in May / in Bangkok (ยกเว้น at night แต่ in the morning)', refs: [], plain: true },
    { label: 'คำถามการอ่าน', value: '5 แบบ', meaning: 'purpose / main idea · detail · inference · vocabulary · NOT TRUE / NOT mentioned', refs: [], plain: true },
  ],
  prompts: [
    {
      q: 'ทำไม “He has finished the report last Friday.” ผิด และต้องแก้อย่างไร',
      a: 'last Friday เป็นเวลาอดีตที่ระบุชัด เหตุการณ์จบแล้ว จึงใช้ present perfect ไม่ได้ ต้องใช้ past simple เป็น He finished the report last Friday. ถ้าอยากใช้ has finished ต้องตัดเวลาอดีตออก หรือใช้คำอย่าง already, just แทน',
    },
    {
      q: 'เติม “This is the office ___ I work.” ด้วย which หรือ where เพราะอะไร',
      a: 'ใช้ where เพราะหลังช่องว่าง I work ครบแล้ว ไม่ขาดประธานหรือกรรม และคำหน้าช่องว่างเป็นสถานที่ ถ้าจะใช้ which ต้องมีคำบุพบทปิดท้าย คือ which I work in เพราะ which ต้องทำหน้าที่เป็นประธานหรือกรรมในอนุประโยค',
    },
    {
      q: 'มีคนพูดว่า “I’m sorry I’m late.” ทำไมตอบ “You’re welcome.” ไม่ได้',
      a: 'You’re welcome ใช้ตอบคำขอบคุณ แต่อีกฝ่ายกำลังขอโทษ คำตอบที่ตรงหน้าที่คือ That’s all right. / That’s OK. / Never mind. ทั้งสองแปลไทยว่า “ไม่เป็นไร” จึงสลับกันบ่อย ต้องดูว่าประโยคก่อนหน้าคือขอบคุณหรือขอโทษ',
    },
  ],
  sources: [{ doc: 'police-exam-scope-summary' }],
};

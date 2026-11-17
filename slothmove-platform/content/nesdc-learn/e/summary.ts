// Summary page for topic E (ภาษาอังกฤษ). Grammar and reading strategy are general knowledge (labelled);
// vocabulary pairs are quoted from สศช.'s English and Thai Q3/2569 releases (both 16 พ.ย. 2569).
import type { Summary } from '@/lib/nesdc-learn/types';

const EN = 'econ-press-en-q3-2569';
const TH = 'econ-press-q3-2569';

export const summary: Summary = {
  topic: 'e',
  question: 'อ่านงานภาษาอังกฤษด้านนโยบายให้เข้าใจได้อย่างไร',
  questionNote:
    'หัวข้อนี้มีสามส่วนที่ใช้ร่วมกัน ไวยากรณ์บอกว่าเหตุการณ์เกิดเมื่อไรและใครทำ ศัพท์บอกว่าตัวเลขขึ้นหรือลง และการอ่านบอกว่าย่อหน้ากำลังสรุปอะไร ไวยากรณ์และวิธีอ่านเป็นความรู้ทั่วไป ส่วนศัพท์ทุกคำยกมาจากเอกสารแถลงข่าวของ สศช. ทั้งฉบับภาษาอังกฤษและภาษาไทย',
  asOf: 'ศัพท์และข้อความจากเอกสารแถลงข่าวเศรษฐกิจไทยไตรมาสที่ 3/2569 ข้อมูล ณ 16 พ.ย. 2569',
  flow: {
    type: 'flow',
    title: 'อ่านหนึ่งย่อหน้าให้ได้ความ (วิธีจำ / แนวปฏิบัติทั่วไป)',
    nodes: [
      { level: 'ขั้น 1', name: 'ดูกริยาและ tense', role: 'expanded (เกิดขึ้นแล้ว) กับ is projected to (คาดการณ์) บอกว่าข้อความเป็นข้อเท็จจริงหรือประมาณการ', tone: 'deep' },
      { level: 'ขั้น 2', name: 'ดูคำบอกทิศทางและความเร็ว', role: 'expanded / declined บอกทิศทาง ส่วน accelerating / decelerating บอกว่าเร็วขึ้นหรือช้าลง และตัวเลขหลัง by บอกขนาดของการเปลี่ยน', tone: 'purple' },
      { level: 'ขั้น 3', name: 'ดูว่าเทียบกับอะไร', role: 'the same period of the previous year (เทียบปีก่อน) หรือ after seasonal adjustment (เทียบไตรมาสก่อนหลังปรับฤดูกาล)', tone: 'soft' },
      { level: 'ขั้น 4', name: 'ตอบจากข้อความเท่านั้น', role: 'คำถามอนุมานต้องมีหลักฐานในข้อความรองรับ คำถาม NOT mentioned ต้องตรวจทีละคำ', tone: 'outline' }
    ],
    arrows: ['รู้ว่าเกิดแล้วหรือคาดการณ์', 'รู้ทิศทางและขนาด', 'รู้ฐานของการเปรียบเทียบ'],
    loopNote: 'ลำดับนี้เป็นวิธีจำของเรา ไม่ใช่เกณฑ์ที่ประกาศไว้ แต่ใช้ได้กับเอกสารแถลงข่าวของ สศช. ทั้งฉบับภาษาไทยและภาษาอังกฤษ',
    refs: [
      { doc: EN, page: '1, 4, 6' },
      { doc: TH, page: '1, 4–6' }
    ]
  },
  pieces: [
    {
      name: 'Tense ในรายงานทางการ (ความรู้ทั่วไปด้านไวยากรณ์)',
      what: 'เหตุการณ์ในช่วงที่จบแล้ว เช่น ไตรมาสที่ผ่านมา ใช้ past simple ส่วนการคาดการณ์ใช้รูป be projected to / is expected to และช่วงเวลาที่ต่อเนื่องถึงปัจจุบัน เช่น over the past five years ใช้ present perfect',
      why: 'คำอธิบายของเรา: tense บอกผู้อ่านทันทีว่าประโยคเป็นข้อมูลจริงหรือเป็นการคาดการณ์',
      link: 'ใช้คู่กับการแยกข้อเท็จจริงกับการคาดการณ์ในหัวข้อการสรุปและวิเคราะห์งาน',
      key: 'ไตรมาสที่จบแล้ว = past simple · การคาดการณ์ = be projected to',
      refs: [],
      plain: true
    },
    {
      name: 'รูปกริยาหลัง to (ความรู้ทั่วไปด้านไวยากรณ์)',
      what: 'to ที่เป็นส่วนของ infinitive ตามด้วยกริยาช่องที่ 1 เช่น is projected to expand ส่วน to ที่เป็นบุพบท ตามด้วยกริยาเติม -ing เช่น look forward to working, committed to reducing',
      why: 'คำอธิบายของเรา: เป็นจุดที่ข้อสอบชอบหลอก เพราะ to หน้าตาเหมือนกันแต่หน้าที่ต่างกัน',
      link: 'ใช้กับโจทย์เติมคำและหาจุดผิดในประโยคนโยบาย',
      key: 'to + V1 เมื่อเป็น infinitive · to + V-ing เมื่อเป็นบุพบท',
      refs: [],
      plain: true
    },
    {
      name: 'คำบอกทิศทางและความเร็ว',
      what: 'expanded by = ขยายตัวร้อยละ… และ declined = ลดลง บอกทิศทาง ส่วน accelerating from 2.4 percent = เร่งขึ้นจากร้อยละ 2.4 และ decelerating from = ชะลอลงจาก (ยังโตแต่ช้าลง) บอกว่าเร็วขึ้นหรือช้าลง ทิศทางมาจากกริยา ไม่ได้มาจากเครื่องหมายของตัวเลข เช่น “increased by 0.8 percent, decelerating from 1.2 percent”',
      why: 'เอกสารภาษาอังกฤษของ สศช. ใช้กริยาเหล่านี้บอกทิศทาง และฉบับภาษาไทยใช้คำที่ตรงกันในหน้าเดียวกัน',
      link: 'decelerating ยังเป็นการขยายตัว ต่างจาก declined (ลดลง)',
      key: 'ชะลอลง ≠ หดตัว',
      refs: [
        { doc: EN, page: '1, 4' },
        { doc: TH, page: '1, 4' }
      ]
    },
    {
      name: 'ฐานของการเปรียบเทียบ',
      what: 'the same period of the previous year = ช่วงเดียวกันของปีก่อน · After seasonal adjustment = เมื่อปรับผลของฤดูกาลออกแล้ว ใช้กับการเทียบไตรมาสที่ติดกัน',
      why: 'ตัวเลขชุดเดียวกันให้ความหมายต่างกันตามฐานที่เทียบ เอกสารจึงระบุฐานไว้ทุกครั้ง',
      link: 'ตรงกับเรื่อง YoY และ QoQ ปรับฤดูกาล ในหัวข้อการสรุปและวิเคราะห์งาน',
      key: 'อ่านตัวเลขทุกครั้งให้รู้ว่าเทียบกับอะไร',
      refs: [
        { doc: EN, page: 1 },
        { doc: TH, page: 1 }
      ]
    },
    {
      name: 'ศัพท์ของการคาดการณ์',
      what: 'midpoint estimate = ค่ากลางประมาณการ · Key supporting factors = ปัจจัยสนับสนุนที่สำคัญ · the increased contribution from net exports = การเพิ่มขึ้นของแรงขับเคลื่อนจากการส่งออกสุทธิ',
      why: 'คำอธิบายของเรา: contribution ในบริบทนี้คือส่วนที่ช่วยผลักการเติบโต ไม่ใช่เงินบริจาค ต้องอ่านจากบริบท',
      link: 'ค่ากลางของช่วง 2.0–3.0 คือ 2.5',
      key: 'ความหมายของศัพท์ขึ้นกับบริบทของเอกสาร',
      refs: [
        { doc: EN, page: 6 },
        { doc: TH, page: '5–6' }
      ]
    }
  ],
  compare: {
    title: 'accelerating กับ decelerating',
    rows: [
      ['', 'accelerating', 'decelerating'],
      ['ฉบับภาษาไทยใช้', 'เร่งขึ้นจาก', 'ชะลอลงจาก'],
      ['ความหมาย', 'อัตราการขยายตัวสูงขึ้น', 'ยังขยายตัว แต่อัตราต่ำลง']
    ],
    whyLabel: 'วิธีจำของเรา',
    why: 'สองคำนี้พูดถึงอัตราการเปลี่ยน ไม่ใช่ระดับ ตัวเลขที่ชะลอลงแต่ยังเป็นบวกแปลว่ายังโตอยู่ ถ้าลดลงจริงเอกสารจะใช้คำอย่าง declined',
    refs: [
      { doc: EN, page: '1, 4' },
      { doc: TH, page: '1, 4' }
    ]
  },
  numbers: [
    { label: 'GDP ไตรมาส 3/2569', value: 'expanded by 2.9 percent', meaning: 'accelerating from 2.4 percent ในไตรมาสก่อน (ฉบับไทย: ขยายตัวร้อยละ 2.9 เร่งขึ้นจากร้อยละ 2.4)', refs: [{ doc: EN, page: 1 }, { doc: TH, page: 1 }] },
    { label: 'ประมาณการปี 2570', value: '2.0–3.0 percent', meaning: 'midpoint estimate 2.5 (ค่ากลางประมาณการ)', refs: [{ doc: EN, page: 6 }, { doc: TH, page: 5 }] },
    { label: 'ปี 2570 บริโภคและลงทุนภาคเอกชน', value: '2.0 และ 7.9', meaning: 'respectively = ตามลำดับ จับคู่ตามลำดับที่เขียน', refs: [{ doc: EN, page: 6 }, { doc: TH, page: 6 }] }
  ],
  prompts: [
    {
      q: '"Private consumption expenditure grew by 1.9 percent, decelerating from 2.1 percent" แปลว่าการบริโภคลดลงหรือไม่',
      a: 'ไม่ลดลง ยังขยายตัวร้อยละ 1.9 แต่โตช้ากว่าเดิมที่ร้อยละ 2.1 คำว่า decelerating บอกว่าอัตราการขยายตัวต่ำลง ไม่ได้บอกว่าหดตัว (ตัวอย่างประโยคนี้เป็นประโยคตัวอย่างที่เราแต่งจากรูปแบบในเอกสาร)'
    },
    {
      q: 'เติมคำ: "The government is committed to ___ household debt." ต้องใช้ reduce หรือ reducing',
      a: 'reducing เพราะ to ใน committed to เป็นบุพบท จึงตามด้วยกริยาเติม -ing (ความรู้ทั่วไปด้านไวยากรณ์ ประโยคตัวอย่างที่เราแต่ง)'
    },
    {
      q: 'ถ้าโจทย์ถามว่า "Which is NOT mentioned in the passage" ควรตรวจอย่างไร',
      a: 'วิธีจำของเรา: ตรวจตัวเลือกทีละข้อกับข้อความ ข้อที่ถูกคือข้อที่ไม่ปรากฏเลย ระวังตัวเลือกที่ใช้คำในข้อความแต่เปลี่ยนความหมาย เช่น เปลี่ยนตัวเลขหรือเปลี่ยนทิศทาง'
    }
  ],
  sources: [
    { doc: EN, page: '1, 4, 6' },
    { doc: TH, page: '1, 4–6' }
  ]
};

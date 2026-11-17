import type { Lesson } from '@/lib/nesdc-learn/types';

// E3 · อ่านจับใจความ. Three short passages quoted from สศช.'s English press release econ-press-en-q3-2569
// (released 16 Nov 2026; printed page = PDF page): EN p.1 (Q3 headline), EN p.4 (accommodation and tourism),
// EN p.6 (2027 outlook). Thai terms are copied from the Thai release econ-press-q3-2569 (pp.1, 4, 5–6; the
// Thai page breaks differ from the English ones). The reading strategy, the question-type table and the
// tips are general practice (labelled วิธีจำ / แนวปฏิบัติทั่วไป, plain). Exam subject from nesdc-recruitment-2569 p.5.

const EN = 'econ-press-en-q3-2569';
const TH = 'econ-press-q3-2569';

export const lesson: Lesson = {
  id: 'e3',
  topic: 'e',
  order: 3,
  title: 'อ่านจับใจความ',
  lead: 'บทนี้ใช้ข้อความภาษาอังกฤษจริงสามตอนจากเอกสารแถลงข่าวของ สศช. ฝึกห้าทักษะที่ข้อสอบอ่านถามบ่อย คือ หาใจความสำคัญ หารายละเอียด อนุมานสิ่งที่ข้อความบอกเป็นนัย เดาความหมายศัพท์จากบริบท และหาสิ่งที่ข้อความไม่ได้กล่าวถึง พร้อมจับคู่ศัพท์อังกฤษกับคำไทยที่ สศช. ใช้จริง',
  minutes: 20,
  jumps: [
    ['why', 'ทำไม'],
    ['story', 'วิธีอ่าน'],
    ['parts', 'ข้อความ'],
    ['exam', 'ข้อสอบ'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · ทำไมต้องรู้เรื่องนี้',
      title: 'ข้อสอบภาษาอังกฤษของงานวิเคราะห์นโยบายและแผน น่าจะใช้ข้อความด้านเศรษฐกิจและนโยบาย (คาดการณ์ของเรา จากขอบข่ายงานในประกาศ)',
      body: [
        'ประกาศรับสมัครตำแหน่งพนักงานบริหารงานทั่วไป 3 (งานวิเคราะห์นโยบายและแผน) ระบุให้การประเมินครั้งที่ 1 ซึ่งสอบข้อเขียน ครอบคลุม “ความรู้ความสามารถทั่วไป ความรู้ด้านงานสารบรรณ **ภาษาอังกฤษ** คอมพิวเตอร์ และความรู้เกี่ยวกับองค์กร” ภาษาอังกฤษจึงเป็นส่วนหนึ่งของคะแนนข้อเขียนโดยตรง ประกาศไม่ได้บอกรูปแบบข้อสอบภาษาอังกฤษ แต่หน้าที่ความรับผิดชอบในประกาศหน้าเดียวกันพูดถึงนโยบาย แผนงานและโครงการทางเศรษฐกิจ สังคม เราจึงคาดว่าข้อความที่ใช้น่าจะเป็นเรื่องเศรษฐกิจและนโยบาย (คาดการณ์ของเรา)',
        'สศช. เผยแพร่เอกสารแถลงข่าวภาวะเศรษฐกิจไทยทั้งฉบับภาษาไทยและภาษาอังกฤษ เนื้อหาสอดคล้องกัน (ไม่ใช่แปลคำต่อคำ) และจัดหน้าต่างกัน บทนี้จึงใช้ฉบับภาษาอังกฤษของไตรมาสที่สาม ปี 2569 เป็นแบบฝึก และเทียบคำสำคัญกับฉบับภาษาไทย เพื่อให้อ่านได้ทั้งสองภาษา',
      ],
      refs: [
        { doc: 'nesdc-recruitment-2569', page: 5 },
        { doc: EN, page: 1 },
        { doc: TH, page: 1 },
      ],
      blocks: [
        {
          type: 'note',
          title: 'แนวปฏิบัติทั่วไป: โจทย์ที่มักเจอ',
          plain: true,
          body: 'ข้อสอบอ่านมักให้ข้อความสั้นหนึ่งย่อหน้า แล้วถามห้าแบบ คือ ใจความสำคัญ (main idea) รายละเอียดหรือตัวเลข (detail) สิ่งที่อนุมานได้ (inference) ความหมายของคำในบริบท (vocabulary in context) และข้อใดไม่ได้กล่าวถึง (NOT mentioned) ตัวเลือกผิดมักเป็นรายละเอียดที่ถูกแต่ไม่ใช่แก่น ตัวเลขที่อยู่ในข้อความแต่ตอบผิดคำถาม หรือข้อความที่ฟังดูจริงแต่ข้อความไม่ได้พูด',
        },
      ],
    },

    // 2 · story: the reading strategy
    {
      type: 'section',
      anchor: 'story',
      eyebrow: '2 · วิธีอ่านให้ทันเวลา',
      title: 'อ่านคำถามก่อน แล้วค่อยกลับไปหาคำตอบในข้อความ',
      body: [
        'ข้อความเศรษฐกิจภาษาอังกฤษดูยากเพราะมีตัวเลขเยอะ แต่โครงประโยคซ้ำกันมาก ส่วนใหญ่เป็นแบบ “สิ่งนี้ ขยายตัว/ลดลง กี่เปอร์เซ็นต์ เทียบกับอะไร เพราะอะไร” ถ้ารู้ว่าโจทย์ถามอะไร เราไม่ต้องแปลทุกคำ แค่หาส่วนที่ตอบคำถามให้เจอ',
        'ทักษะการอ่านในบทนี้เป็นความรู้ทั่วไปด้านภาษาอังกฤษ ไม่มีเอกสารราชการฉบับใดกำหนดไว้ ส่วนข้อความที่ใช้ฝึกและคำแปลไทยมาจากเอกสารแถลงข่าวของ สศช. จริง',
      ],
      plain: true,
      blocks: [
        {
          type: 'flow',
          title: 'วิธีจำ / แนวปฏิบัติทั่วไป: อ่านจับใจความ 5 ขั้น',
          nodes: [
            { level: 'ขั้น 1', name: 'อ่านคำถามก่อน', role: 'ดูว่าถามแบบไหน main idea, detail, inference, ความหมายคำ หรือ NOT และขีดเส้นใต้คำสำคัญในคำถาม', tone: 'ink' },
            { level: 'ขั้น 2', name: 'อ่านประโยคแรกของข้อความ', role: 'ประโยคแรกมักบอกภาพรวมว่าย่อหน้านี้พูดถึงอะไร ที่เหลือมักเป็นตัวเลขและเหตุผลประกอบ', tone: 'deep' },
            { level: 'ขั้น 3', name: 'กวาดตาหาคำสำคัญ (scan)', role: 'หาคำจากคำถามหรือคำที่มีความหมายเดียวกันในข้อความ เช่น ถาม “first nine months” ก็หาวลีนั้น', tone: 'purple' },
            { level: 'ขั้น 4', name: 'เทียบตัวเลือกกับข้อความ', role: 'แต่ละตัวเลือก ข้อความพูดไว้ตรง ๆ อนุมานได้แน่นอน หรือเกินข้อความ', tone: 'soft' },
            { level: 'ขั้น 5', name: 'ตัดตัวเลือกแล้วตอบ', role: 'ตัดตัวเลือกที่ขัดกับข้อความ หรือใช้ความรู้นอกข้อความ เหลือข้อที่ข้อความรองรับ', tone: 'white' },
          ],
          arrows: ['รู้ว่าต้องหาอะไร', 'รู้ว่าเรื่องคืออะไร', 'เจอประโยคที่ตอบ', 'เหลือตัวเลือกที่รองรับ'],
          loopNote: 'ถ้าตัวเลือกที่เหลือยังมีสองข้อ ให้กลับไปอ่านประโยคที่ตอบซ้ำอีกรอบ ดูคำเล็ก ๆ เช่น not, only, respectively, while ซึ่งมักเป็นตัวตัดสิน',
          plain: true,
        },
        {
          type: 'table',
          title: 'วิธีจำ / แนวปฏิบัติทั่วไป: ประเภทคำถาม หาอะไร และกับดัก',
          rows: [
            ['ประเภทคำถาม', 'หาอะไร', 'กับดัก'],
            ['Main idea', 'ประโยคภาพรวม ที่คลุมทั้งย่อหน้า', 'รายละเอียดที่ถูก แต่แคบเกินไป'],
            ['Detail', 'คำจากคำถาม แล้วอ่านประโยคนั้น', 'ตัวเลขอื่นในย่อหน้าเดียวกัน'],
            ['Inference', 'สิ่งที่ต้องจริง ถ้าข้อความจริง', 'ข้อที่ฟังดูดี แต่ข้อความไม่รองรับ'],
            ['Vocabulary', 'คำรอบ ๆ ที่ช่วยบอกความหมาย', 'ความหมายทั่วไปที่ไม่เข้ากับบริบท'],
            ['NOT mentioned', 'ไล่ตัดข้อที่มีในข้อความ', 'ข้อที่เขียนด้วยคำอื่นแต่ความหมายเดียวกัน'],
          ],
          highlightCol: 2,
          after: 'ตารางนี้เป็นแนวปฏิบัติทั่วไปที่ใช้กันในการฝึกอ่าน ไม่ใช่กฎที่เอกสารใดกำหนด ช่องกับดักคือแบบตัวเลือกผิดที่พบบ่อย ส่วนถัดไปจะลองใช้กับข้อความจริงทีละแบบ',
          plain: true,
        },
        {
          type: 'note',
          title: 'Inference ไม่ใช่การเดา',
          plain: true,
          body: 'คำตอบแบบอนุมานต้อง “จริงแน่นอนถ้าข้อความจริง” ไม่ใช่ “น่าจะจริง” ถ้าต้องใช้ความรู้นอกข้อความหรือข้อสมมติเพิ่มจึงจะจริง ตัวเลือกนั้นยังไม่ใช่คำตอบ วิธีจำคือถามว่า เราชี้ประโยคในข้อความที่ทำให้ข้อนี้ต้องจริงได้หรือไม่',
        },
      ],
    },

    // 3 · parts: the three passages + vocabulary
    {
      type: 'section',
      anchor: 'parts',
      eyebrow: '3 · ข้อความจริงสามตอน',
      title: 'อ่านทีละตอน แล้วดูว่าคำถามแต่ละแบบซ่อนอยู่ตรงไหน',
      body: [
        'ทั้งสามตอนยกมาจากเอกสารแถลงข่าวภาษาอังกฤษ “Thai Economic Performance in Q3 of 2026 and the Outlook for 2026 - 2027” ซึ่ง สศช. แถลงวันที่ 16 พ.ย. 2569 ตอนที่ 1 รายงานตัวเลขที่เกิดขึ้นแล้ว ตอนที่ 2 เป็นรายละเอียดรายสาขา ตอนที่ 3 เป็นการคาดการณ์ปี 2570',
      ],
      refs: [{ doc: EN, page: '1, 4, 6' }],
      blocks: [
        {
          type: 'asOf',
          date: 'ข้อมูล ณ 16 พ.ย. 2569',
          note: 'ตอนที่ 1 และ 2 เป็นตัวเลขไตรมาสที่สาม ปี 2569 และช่วง 9 เดือนแรกของปี 2569 ตอนที่ 3 เป็นประมาณการปี 2570 ที่แถลงในวันเดียวกัน',
        },

        // passage 1
        {
          type: 'note',
          title: 'ข้อความที่ 1 (ฉบับภาษาอังกฤษ หน้า 1)',
          body: '“The Thai economy in the third quarter of 2026 expanded by 2.9 percent (%YoY), accelerating from 2.4 percent in the second quarter of 2026. After seasonal adjustment, the Thai economy expanded by 0.3 percent from the second quarter of 2026 (%QoQ sa). In the first nine months of 2026, the Thai economy expanded by 2.8 percent from the same period of the previous year.”',
          refs: [{ doc: EN, page: 1 }],
        },
        {
          type: 'text',
          body: [
            'ฉบับภาษาไทยหน้า 1 เขียนตรงกันว่า “เศรษฐกิจไทยในไตรมาสที่สามของปี 2569 ขยายตัวร้อยละ 2.9 เร่งขึ้นจากร้อยละ 2.4 ในไตรมาสที่สองของปี 2569 และเมื่อปรับผลของฤดูกาลออกแล้ว เศรษฐกิจไทยในไตรมาสที่สามของปี 2569 ขยายตัวจากไตรมาสที่สองของปี 2569 ร้อยละ 0.3 (QoQ_SA) รวม 9 เดือนแรกของปี 2569 เศรษฐกิจไทยขยายตัวร้อยละ 2.8 จากช่วงเดียวกันของปีก่อน”',
            'ข้อความนี้มีตัวเลขสี่ตัว และแต่ละตัว**เทียบกับคนละอย่าง** 2.9 คือไตรมาสสามเทียบกับไตรมาสเดียวกันของปีก่อน (%YoY) 2.4 คืออัตราของไตรมาสสอง 0.3 คือไตรมาสสามเทียบกับไตรมาสสองหลังปรับฤดูกาล (%QoQ sa) และ 2.8 คือ 9 เดือนแรกรวมกัน ข้อสอบ detail ชอบเอาตัวเลขในย่อหน้าเดียวกันมาสลับกัน จึงต้องจับคู่ตัวเลขกับ “เทียบกับอะไร” ให้ได้',
          ],
          refs: [
            { doc: TH, page: 1 },
            { doc: EN, page: 1 },
          ],
        },

        // passage 2
        {
          type: 'note',
          title: 'ข้อความที่ 2 (ฉบับภาษาอังกฤษ หน้า 4)',
          body: '“Accommodation and food service activities sector expanded by 1.9 percent, decelerating from a 2.1-percent growth in the previous quarter, consistent with a decline in international tourist arrivals, while the number of Thai tourists increased. International tourist arrivals totaled 7.061 million persons, decreasing by 5.0 percent, compared with a 4.4-percent decline in the previous quarter. Meanwhile, tourism service receipts amounted to 359 billion Baht, increasing by 11.7 percent, compared with a 13.7-percent growth in the previous quarter.”',
          refs: [{ doc: EN, page: 4 }],
        },
        {
          type: 'text',
          body: [
            'ฉบับภาษาไทยหน้า 4 เปิดย่อหน้าเดียวกันว่า “สาขาที่พักแรมและบริการด้านอาหาร ขยายตัวร้อยละ 1.9 ชะลอลงจากร้อยละ 2.1 ในไตรมาสก่อนหน้า ตามการปรับตัวลดลงของจำนวนนักท่องเที่ยวต่างประเทศเป็นสำคัญ” และเรียก tourism service receipts ว่า “**มูลค่าบริการรับด้านการท่องเที่ยว**” ซึ่ง “อยู่ที่ 3.59 แสนล้านบาท”',
            'สังเกตการอ่านตัวเลข 359 billion Baht ในฉบับอังกฤษ ตรงกับ 3.59 แสนล้านบาทในฉบับไทย (1 billion = 1,000 ล้าน ดังนั้น 359 billion = 359,000 ล้าน = 3.59 แสนล้าน) ย่อหน้านี้มีคำเชื่อมสองคำ คือ “while” และ “Meanwhile” (ไทยหน้า 4 ใช้ “ในขณะที่”) Meanwhile แปลว่าในขณะเดียวกัน ใช้ได้ทั้งเรื่องที่ไปทางเดียวกันและคนละทาง (ฉบับอังกฤษหน้า 4 ก็ใช้ Meanwhile เชื่อมตัวเลขที่เพิ่มขึ้นทั้งคู่) ทิศทางจึงต้องดูจากกริยา ในย่อหน้านี้ตัวเลขไปคนละทาง คือ decreasing (จำนวนนักท่องเที่ยวต่างชาติ) กับ increasing (รายรับ) และนักท่องเที่ยวไทย increased ขณะที่ต่างชาติลด',
          ],
          refs: [
            { doc: TH, page: 4 },
            { doc: EN, page: 4 },
          ],
        },

        // passage 3
        {
          type: 'note',
          title: 'ข้อความที่ 3 (ฉบับภาษาอังกฤษ หน้า 6)',
          body: '“The Thai economy in 2027 is projected to expand within the range of 2.0-3.0 percent (with a midpoint estimate of 2.5 percent), continuing from 2.5-percent growth in 2026. Key supporting factors include: (1) the accelerated expansion of public investment; (2) the continued expansion of private consumption and private investment; (3) the recovery of the tourism sector and related services; and (4) the increased contribution from net exports. Private consumption and private investment are projected to expand by 2.0 percent and 7.9 percent, respectively; export value in US-dollar terms is projected to increase by 8.6 percent.”',
          refs: [{ doc: EN, page: 6 }],
        },
        {
          type: 'text',
          body: [
            'ฉบับภาษาไทย (หน้า 5 ต่อหน้า 6) เขียนว่า “แนวโน้มเศรษฐกิจไทยปี 2570 คาดว่าจะขยายตัวในช่วงร้อยละ 2.0 – 3.0 (ค่ากลางประมาณการร้อยละ 2.5) ต่อเนื่องจากร้อยละ 2.5 ในปี 2569 โดยมีปัจจัยสนับสนุนที่สำคัญ ประกอบด้วย” แล้วไล่ปัจจัยสี่ข้อ ข้อสุดท้ายคือ “การเพิ่มขึ้นของแรงขับเคลื่อนจากการส่งออกสุทธิ”',
            'ประโยคแรกของตอนนี้คือใจความสำคัญ (คาดว่าปี 2570 ขยายตัวร้อยละ 2.0–3.0) ประโยคที่สองบอกเหตุผล (ปัจจัยสนับสนุน 4 ข้อ) ประโยคที่สามเป็นตัวเลขรายองค์ประกอบ ข้อสอบ main idea จึงต้องเลือกข้อที่คลุมประโยคแรก ไม่ใช่ข้อที่หยิบตัวเลขในประโยคที่สามมาอย่างเดียว',
          ],
          refs: [
            { doc: TH, page: '5–6' },
            { doc: EN, page: 6 },
          ],
        },
        {
          type: 'explorer',
          title: 'แตะคำ ดูคำไทยที่ สศช. ใช้',
          intro: 'คำอังกฤษแต่ละคำยกมาจากข้อความทั้งสามตอน และคำไทยคือคำที่ฉบับภาษาไทยใช้ในประโยคเดียวกัน ลองเดาความหมายจากบริบทก่อนแตะ',
          initial: 'v2',
          groups: [
            {
              tag: 'ข้อความที่ 1',
              name: 'อัตราการขยายตัว',
              idea: 'คำบอกทิศทางและสิ่งที่ใช้เทียบ',
              items: [
                { key: 'v1', label: '1', full: 'expanded by (EN หน้า 1)', meaning: 'ไทยหน้า 1 ใช้ “**ขยายตัว**ร้อยละ…” บอกว่าโตขึ้นเท่าไร ตัวเลขหลัง by คืออัตราการเปลี่ยน ไม่ใช่ระดับ' },
                { key: 'v2', label: '2', full: 'accelerating from 2.4 percent (EN หน้า 1)', meaning: 'ไทยหน้า 1 ใช้ “**เร่งขึ้นจาก**ร้อยละ 2.4” แปลว่าอัตราการขยายตัวสูงขึ้นจากเดิม (จาก 2.4 เป็น 2.9) ไม่ได้แปลว่าโตเพิ่มอีก 2.4' },
                { key: 'v3', label: '3', full: 'After seasonal adjustment (EN หน้า 1)', meaning: 'ไทยหน้า 1 ใช้ “**เมื่อปรับผลของฤดูกาลออกแล้ว**” ใช้คู่กับการเทียบไตรมาสติดกัน (%QoQ sa)' },
                { key: 'v4', label: '4', full: 'the same period of the previous year (EN หน้า 1)', meaning: 'ไทยหน้า 1 ใช้ “**ช่วงเดียวกันของปีก่อน**” บอกว่าตัวเลข 9 เดือนแรกเทียบกับ 9 เดือนแรกของปีก่อน' },
              ],
            },
            {
              tag: 'ข้อความที่ 2',
              name: 'การท่องเที่ยว',
              idea: 'ชื่อสาขาและชื่อตัวชี้วัด',
              items: [
                { key: 'v5', label: '5', full: 'decelerating from (EN หน้า 4)', meaning: 'ไทยหน้า 4 ใช้ “**ชะลอลงจาก**ร้อยละ 2.1” แปลว่ายังโตอยู่แต่โตช้าลง (ดูจากคำว่า expanded by 1.9 percent) ไม่ได้แปลว่าหดตัว' },
                { key: 'v6', label: '6', full: 'Accommodation and food service activities sector (EN หน้า 4)', meaning: 'ไทยหน้า 4 ใช้ “**สาขาที่พักแรมและบริการด้านอาหาร**” เป็นสาขาหนึ่งที่รายงานไว้ใต้หัวข้อ On the production side (ฉบับภาษาอังกฤษ หน้า 3)' },
                { key: 'v7', label: '7', full: 'tourism service receipts (EN หน้า 4)', meaning: 'ไทยหน้า 4 ใช้ “**มูลค่าบริการรับด้านการท่องเที่ยว**” receipts แปลว่ารายรับ ไม่ใช่ใบเสร็จ ในบริบทนี้' },
              ],
            },
            {
              tag: 'ข้อความที่ 3',
              name: 'การคาดการณ์',
              idea: 'คำของประมาณการและเหตุผลประกอบ',
              items: [
                { key: 'v8', label: '8', full: 'midpoint estimate (EN หน้า 6)', meaning: 'ไทยหน้า 5 ใช้ “**ค่ากลางประมาณการ**” คือค่ากลางของช่วง 2.0–3.0 ซึ่งเท่ากับ 2.5 (2.0 + 3.0 = 5.0 หาร 2 = 2.5)' },
                { key: 'v9', label: '9', full: 'Key supporting factors (EN หน้า 6)', meaning: 'ไทยหน้า 5 ใช้ “**ปัจจัยสนับสนุนที่สำคัญ**” ตามด้วยรายการสี่ข้อ' },
                { key: 'v10', label: '10', full: 'the increased contribution from net exports (EN หน้า 6)', meaning: 'ไทยหน้า 6 ใช้ “การเพิ่มขึ้นของ**แรงขับเคลื่อน**จากการส่งออกสุทธิ” contribution ในที่นี้คือส่วนที่ช่วยผลักการเติบโต ไม่ใช่เงินบริจาค' },
                { key: 'v11', label: '11', full: '2.0 percent and 7.9 percent, respectively (EN หน้า 6)', meaning: 'ไทยหน้า 6 ใช้ “ร้อยละ 2.0 และร้อยละ 7.9 **ตามลำดับ**” คือจับคู่ตามลำดับที่เขียน การบริโภคภาคเอกชน 2.0 การลงทุนภาคเอกชน 7.9' },
              ],
            },
          ],
          refs: [
            { doc: EN, page: '1, 3, 4, 6' },
            { doc: TH, page: '1, 4–6' },
          ],
        },
      ],
    },

    // 4 · exam
    {
      type: 'section',
      anchor: 'exam',
      eyebrow: '4 · ข้อสอบถามแบบนี้ คิดแบบนี้',
      title: 'อนุมานต้องชี้กลับไปที่ข้อความได้ และ NOT ต้องไล่ตัดทีละข้อ',
      blocks: [
        {
          type: 'reasoning',
          question: 'จากข้อความที่ 2: Which of the following can be inferred from the passage? (ตัวเลือกหนึ่งคือ “On average, each international tourist arrival was associated with more tourism service receipts than in the comparison period.” อีกข้อคือ “Thai tourists spent more money than international tourists.”)',
          steps: [
            'หาประโยคที่เกี่ยวข้อง ข้อความบอกว่าจำนวนนักท่องเที่ยวต่างชาติ “decreasing by 5.0 percent” แต่ tourism service receipts “increasing by 11.7 percent” กริยา decreasing กับ increasing บอกว่าสองตัวเลขไปคนละทาง (Meanwhile แปลว่าในขณะเดียวกัน ไม่ได้บอกทิศทางเอง)',
            'คำอธิบายของเรา: ถ้าจำนวนคนลดลงแต่รายรับรวมเพิ่มขึ้น (ทั้งสองอัตราเทียบกับไตรมาสเดียวกันของปีก่อน) รายรับเฉลี่ยต่อคนต้องสูงขึ้น เพราะตัวตั้งเพิ่มขณะที่ตัวหารลด ข้อนี้ข้อความไม่ได้เขียนไว้ตรง ๆ แต่ต้องจริงถ้าตัวเลขในข้อความจริง จึงเป็น inference ที่ถูก',
            'ตรวจตัวเลือก “Thai tourists spent more money than international tourists.” ข้อความที่ยกมาไม่ได้ให้รายรับจากนักท่องเที่ยวไทยเลย บอกแค่ว่าจำนวนนักท่องเที่ยวไทย increased จึงสรุปเรื่องการใช้จ่ายของคนไทยไม่ได้',
          ],
          answer: 'ข้อที่ว่ารายรับเฉลี่ยต่อนักท่องเที่ยวต่างชาติหนึ่งคนสูงขึ้น เป็นข้อที่อนุมานได้ เพราะตามมาจากตัวเลข −5.0 และ +11.7 โดยตรง',
          trap: 'ตัวเลือกที่ใช้ความรู้นอกข้อความ เช่น “Thailand is becoming less popular with foreign tourists.” ฟังดูมีเหตุผลจากตัวเลขที่ลดลง แต่คำว่า less popular เป็นการตีความเกินข้อความ ข้อความบอกแค่จำนวนที่ลดลงในไตรมาสนี้',
          refs: [
            { doc: EN, page: 4 },
            { doc: TH, page: 4 },
          ],
        },
        {
          type: 'reasoning',
          question: 'จากข้อความที่ 3: Which of the following is NOT mentioned as a key supporting factor for 2027? (ตัวเลือก: public investment / lower interest rates / the recovery of tourism / net exports)',
          steps: [
            'อ่านคำถามให้เห็นคำว่า NOT ก่อน ข้อนี้ต้องหาสิ่งที่ข้อความไม่ได้พูดถึง ไม่ใช่สิ่งที่พูดถึง',
            'ไล่ตัดทีละข้อกับรายการ (1)–(4) “public investment” อยู่ในข้อ (1) “the recovery of tourism” อยู่ในข้อ (3) ซึ่งเขียนเต็มว่า the recovery of the tourism sector and related services และ “net exports” อยู่ในข้อ (4)',
            '“lower interest rates” ไม่อยู่ในรายการสี่ข้อ และไม่มีคำว่า interest rate ที่ไหนในข้อความที่ 3 เลย',
          ],
          answer: '“lower interest rates” คือข้อที่ไม่ได้กล่าวถึง',
          trap: 'ตัวเลือกที่เขียนด้วยคำต่างจากข้อความเล็กน้อย เช่น the recovery of tourism (ข้อความเขียนว่า the recovery of the tourism sector and related services) ยังนับว่ากล่าวถึง เพราะความหมายเดียวกัน อย่าตัดสินจากการที่คำไม่ตรงทุกตัวอักษร',
          refs: [
            { doc: EN, page: 6 },
            { doc: TH, page: '5–6' },
          ],
        },
        {
          type: 'asOf',
          date: 'ข้อมูล ณ 16 พ.ย. 2569',
          note: 'ตัวเลขการท่องเที่ยวเป็นของไตรมาสที่สาม ปี 2569 ส่วนปัจจัยสนับสนุนเป็นของประมาณการปี 2570 ทั้งคู่มาจากเอกสารแถลงข่าววันที่ 16 พ.ย. 2569',
        },
      ],
    },

    // mistakes
    {
      type: 'mistakes',
      items: [
        {
          title: 'เลือกข้อที่จริงในโลก แต่ไม่อยู่ในข้อความ',
          body: 'คนที่ตามข่าวเศรษฐกิจมักรู้เรื่องมากกว่าที่ข้อความให้ จึงเลือกข้อที่ตัวเองรู้ว่าจริง แต่ข้อสอบอ่านวัดว่าข้อความรองรับหรือไม่ เช่น ข้อความที่ 3 ไม่ได้พูดถึงอัตราดอกเบี้ยเลย วิธีแก้คือถามทุกครั้งว่า ชี้ประโยคในข้อความที่รองรับข้อนี้ได้หรือไม่',
        },
        {
          title: 'เอารายละเอียดมาตอบเป็นใจความสำคัญ',
          body: 'ตัวเลขดูเป็นรูปธรรมจึงชวนเลือก เช่น ตอบ main idea ของข้อความที่ 3 ว่า “private investment is projected to expand by 7.9 percent” ซึ่งจริงแต่เป็นแค่ส่วนประกอบ วิธีแก้คือเลือกข้อที่คลุมประโยคแรก (ช่วงคาดการณ์ 2.0–3.0) และไม่ขัดกับส่วนที่เหลือ',
        },
        {
          title: 'อ่าน accelerating / decelerating เป็นโต / หด',
          body: 'สองคำนี้บอกว่าอัตราการขยายตัวเร็วขึ้นหรือช้าลง ไม่ได้บอกว่าโตหรือหด สาขาที่พักแรมฯ ในข้อความที่ 2 “decelerating” แต่ยังขยายตัวร้อยละ 1.9 วิธีแก้คือดูกริยาที่มากับตัวเลข เช่น expanded / increased / grew by = โต ส่วน declined / decreased / contracted by = หด ตัวเลขหลัง by เขียนเป็นบวกเสมอ (เช่น “decreasing by 5.0 percent” ในข้อความที่ 2 คือลดลง) ส่วน accelerating / decelerating บอกแค่ว่าเร็วขึ้นหรือช้าลง',
        },
        {
          title: 'จับคู่ respectively ผิด หรือเอาตัวเลขผิดตัว',
          body: 'ประโยคที่มี respectively จับคู่ตามลำดับที่เขียน “Private consumption and private investment… 2.0 percent and 7.9 percent, respectively” จึงได้การบริโภค 2.0 การลงทุน 7.9 ไม่ใช่กลับกัน และในข้อความที่ 1 ต้องแยก 2.9 (%YoY) ออกจาก 0.3 (%QoQ sa) ให้ได้ วิธีแก้คือวงตัวเลขแล้วเขียนกำกับว่าเทียบกับอะไรก่อนตอบ',
        },
      ],
      refs: [
        { doc: EN, page: '1, 4, 6' },
        { doc: TH, page: '1, 4–6' },
      ],
    },

    // 5 · check
    {
      type: 'check',
      anchor: 'check',
      eyebrow: '5 · เช็กความเข้าใจ',
      title: 'ตอบด้วยเหตุผล ไม่ใช่ความจำ',
      questions: [
        {
          id: 'e3-c1',
          q: 'อ่านข้อความที่ 3 (แนวโน้มปี 2570) แล้วตอบ: Which of the following best states the main idea of the passage?',
          choices: [
            'The Thai economy is projected to grow by 2.0-3.0 percent in 2027, supported by several key factors.',
            'Private investment is projected to expand by 7.9 percent in 2027.',
            'Tourism will be the only sector driving the Thai economy in 2027.',
            'The Thai economy expanded by 2.5 percent in the first half of 2027.',
          ],
          answer: 0,
          why: 'ประโยคแรกบอกช่วงคาดการณ์ 2.0–3.0 และประโยคที่สองบอกว่ามีปัจจัยสนับสนุนหลายข้อ ข้อที่คลุมทั้งสองส่วนจึงเป็นใจความสำคัญ “Private investment… 7.9 percent” ถูกแต่เป็นรายละเอียดในประโยคสุดท้าย “Tourism will be the only sector” ขัดกับข้อความที่ระบุปัจจัยสี่ข้อ ส่วน “expanded by 2.5 percent in the first half of 2027” ผิดทั้งเวลาและประเภท เพราะปี 2570 ยังเป็นการคาดการณ์',
          refs: [
            { doc: EN, page: 6 },
            { doc: TH, page: '5–6' },
          ],
        },
        {
          id: 'e3-c2',
          q: 'อ่านข้อความที่ 2 (สาขาที่พักแรมและการท่องเที่ยว) แล้วตอบ: Which of the following is NOT mentioned in the passage?',
          choices: [
            'the number of Thai tourists',
            'the number of international tourist arrivals',
            'the average price of hotel rooms',
            'the value of tourism service receipts',
          ],
          answer: 2,
          why: 'ข้อความพูดถึง “the number of Thai tourists” (increased) “international tourist arrivals” (7.061 million persons) และ “tourism service receipts” (359 billion Baht) ครบทั้งสามอย่าง แต่ไม่มีคำใดพูดถึงราคาห้องพัก “the average price of hotel rooms” จึงเป็นข้อที่ไม่ได้กล่าวถึง',
          refs: [
            { doc: EN, page: 4 },
            { doc: TH, page: 4 },
          ],
        },
        {
          id: 'e3-c3',
          q: 'ข้อความที่ 3 เขียนว่า “the increased contribution from net exports” คำว่า contribution ในบริบทนี้ใกล้เคียงกับความหมายใดที่สุด',
          choices: [
            'a gift of money to a charity',
            'the part of growth driven by something',
            'a special tax that is paid by exporters',
            'a written article in a report',
          ],
          answer: 1,
          why: 'contribution อยู่ในรายการ “Key supporting factors” ซึ่งเป็นสิ่งที่ช่วยให้เศรษฐกิจขยายตัว และฉบับภาษาไทยใช้คำว่า “แรงขับเคลื่อนจากการส่งออกสุทธิ” จึงหมายถึงส่วนที่ช่วยผลักการเติบโต “a gift of money to a charity” และ “a written article” เป็นความหมายทั่วไปของคำนี้ที่ไม่เข้ากับบริบทเศรษฐกิจ ส่วน “a special tax that is paid by exporters” ไม่มีที่มาในข้อความเลย',
          refs: [
            { doc: EN, page: 6 },
            { doc: TH, page: 6 },
          ],
        },
      ],
    },

    // explain
    {
      type: 'explain',
      prompt: 'ใช้ข้อความที่ 2 อธิบายให้เพื่อนฟังว่า “รายละเอียด” (detail) กับ “สิ่งที่อนุมานได้” (inference) ต่างกันอย่างไร ยกตัวอย่างอย่างละหนึ่ง แล้วบอกว่าตัวเลือกแบบไหนที่ดูเหมือน inference แต่ผิด',
      model: 'รายละเอียดคือสิ่งที่ข้อความเขียนไว้ตรง ๆ เช่น จำนวนนักท่องเที่ยวต่างชาติ 7.061 ล้านคน ลดลงร้อยละ 5.0 ส่วนสิ่งที่อนุมานได้คือสิ่งที่ข้อความไม่ได้เขียน แต่ต้องจริงถ้าข้อความจริง เช่น จำนวนคนลดลงขณะที่มูลค่าบริการรับด้านการท่องเที่ยวเพิ่มขึ้นร้อยละ 11.7 แปลว่ารายรับเฉลี่ยต่อคนสูงขึ้น ตัวเลือกที่ดูเหมือน inference แต่ผิด คือข้อที่ต้องใช้ความรู้นอกข้อความหรือตีความเกิน เช่น บอกว่าคนไทยใช้จ่ายมากกว่าชาวต่างชาติ ซึ่งข้อความที่ยกมาไม่มีข้อมูลรองรับ',
      refs: [
        { doc: EN, page: 4 },
        { doc: TH, page: 4 },
      ],
    },
  ],

  test: [
    {
      id: 'e3-t01',
      q: 'อ่านข้อความที่ 1 แล้วตอบ: By how much did the Thai economy expand in the first nine months of 2026?',
      choices: ['2.4 percent', '2.8 percent', '2.9 percent', '0.3 percent'],
      answer: 1,
      why: 'ประโยคสุดท้ายเขียนว่า “In the first nine months of 2026, the Thai economy expanded by 2.8 percent” “2.9 percent” คือไตรมาสสาม (%YoY) “2.4 percent” คือไตรมาสสอง และ “0.3 percent” คือไตรมาสสามเทียบไตรมาสสองหลังปรับฤดูกาล ทั้งสามเป็นตัวเลขในย่อหน้าเดียวกันแต่ตอบคนละคำถาม',
      refs: [
        { doc: EN, page: 1 },
        { doc: TH, page: 1 },
      ],
    },
    {
      id: 'e3-t02',
      q: 'ข้อความที่ 1 เขียนว่า “expanded by 2.9 percent (%YoY), accelerating from 2.4 percent in the second quarter” ข้อใดอธิบาย accelerating from 2.4 percent ได้ถูกต้อง',
      choices: [
        'The growth rate rose from 2.4 percent to 2.9 percent.',
        'The economy grew 2.4 percent more than in the second quarter.',
        'The economy shrank by 2.4 percent in the third quarter.',
        'The growth rate fell from 2.9 percent to 2.4 percent.',
      ],
      answer: 0,
      why: 'accelerating from (ไทยหน้า 1 ใช้ “เร่งขึ้นจาก”) แปลว่าอัตราการขยายตัวสูงขึ้นจากค่าเดิม คือจาก 2.4 ในไตรมาสสองเป็น 2.9 ในไตรมาสสาม “grew 2.4 percent more” อ่านตัวเลข 2.4 ผิดเป็นส่วนที่เพิ่ม “shrank by 2.4 percent” ขัดกับคำว่า expanded และ “fell from 2.9 percent to 2.4 percent” กลับทิศของเวลา',
      refs: [
        { doc: EN, page: 1 },
        { doc: TH, page: 1 },
      ],
    },
    {
      id: 'e3-t03',
      q: 'ในข้อความที่ 1 ตัวเลขใดเป็นการเทียบไตรมาสที่สามกับไตรมาสที่สองของปี 2026 หลังปรับผลของฤดูกาล',
      choices: ['2.9 percent', '2.8 percent', '0.3 percent', '2.4 percent'],
      answer: 2,
      why: 'ประโยคที่สองขึ้นต้นด้วย “After seasonal adjustment” แล้วบอกว่าเศรษฐกิจ “expanded by 0.3 percent from the second quarter of 2026 (%QoQ sa)” ฉบับไทยหน้า 1 ก็เขียน “เมื่อปรับผลของฤดูกาลออกแล้ว… ร้อยละ 0.3 (QoQ_SA)” “2.9 percent” เป็นการเทียบกับไตรมาสเดียวกันของปีก่อน (%YoY) “2.8 percent” คือ 9 เดือนแรก และ “2.4 percent” คืออัตราของไตรมาสสอง',
      refs: [
        { doc: EN, page: 1 },
        { doc: TH, page: 1 },
      ],
    },
    {
      id: 'e3-t04',
      q: 'อ่านข้อความที่ 2 แล้วตอบ: How many international tourists arrived in the quarter?',
      choices: ['66.67 million persons', '4.4 million persons', '11.7 million persons', '7.061 million persons'],
      answer: 3,
      why: 'ข้อความเขียนว่า “International tourist arrivals totaled 7.061 million persons” ฉบับไทยหน้า 4 ก็ระบุ “มีจำนวน 7.061 ล้านคน” ตัวเลข 4.4 ในข้อความเป็นอัตราการลดลง (percent) ของไตรมาสก่อน และ 11.7 เป็นอัตราการเพิ่มของรายรับ ตัวเลือก “4.4 million” และ “11.7 million” จึงเอาร้อยละมาอ่านเป็นจำนวนคน ส่วน “66.67 million” เป็นจำนวนการเดินทางของนักท่องเที่ยวชาวไทย (66.67 million person-trips) ในประโยคถัดไปของฉบับอังกฤษหน้า 4 (ไม่ได้ยกมาในข้อความที่ 2) ไม่ใช่นักท่องเที่ยวต่างชาติ',
      refs: [
        { doc: EN, page: 4 },
        { doc: TH, page: 4 },
      ],
    },
    {
      id: 'e3-t05',
      q: 'อ่านข้อความที่ 2 แล้วตอบ: Which of the following can be inferred from the passage?',
      choices: [
        'Thailand is becoming less popular with foreign tourists every year.',
        'Thai tourists spent more money than international tourists.',
        'Hotels in Thailand reduced their prices during the quarter.',
        'Receipts per international tourist arrival were higher on average than in the comparison period.',
      ],
      answer: 3,
      why: 'จำนวนนักท่องเที่ยวต่างชาติ “decreasing by 5.0 percent” ขณะที่ tourism service receipts “increasing by 11.7 percent” ตัวตั้งเพิ่มแต่ตัวหารลด รายรับเฉลี่ยต่อคนจึงต้องสูงขึ้น (คำอธิบายของเรา) ทั้งสองอัตราเทียบกับไตรมาสเดียวกันของปีก่อน “less popular… every year” เกินข้อความ เพราะข้อความพูดถึงแค่ไตรมาสนี้เทียบกับไตรมาสเดียวกันของปีก่อน “Thai tourists spent more money” ไม่มีข้อมูลรายจ่ายของคนไทยในข้อความที่ยกมา และ “reduced their prices” ไม่มีเรื่องราคาเลย',
      refs: [
        { doc: EN, page: 4 },
        { doc: TH, page: 4 },
      ],
    },
    {
      id: 'e3-t06',
      q: 'อ่านข้อความที่ 2 แล้วตอบ: What is the main idea of the passage?',
      choices: [
        'Tourism service receipts amounted to 359 billion Baht.',
        'The number of Thai tourists increased during the quarter.',
        'The sector grew more slowly as international arrivals fell.',
        'The accommodation and food service sector contracted sharply in the quarter.',
      ],
      answer: 2,
      why: 'ประโยคแรกเป็นภาพรวม คือสาขาที่พักแรมและบริการด้านอาหารขยายตัวร้อยละ 1.9 ชะลอลงจาก 2.1 สอดคล้องกับนักท่องเที่ยวต่างชาติที่ลดลง ส่วนที่เหลือเป็นตัวเลขประกอบ “359 billion Baht” และ “Thai tourists increased” จริงแต่เป็นรายละเอียด ส่วน “contracted sharply” ขัดกับข้อความ เพราะ decelerating แปลว่ายังโตแต่ช้าลง ไม่ใช่หดตัว',
      refs: [
        { doc: EN, page: 4 },
        { doc: TH, page: 4 },
      ],
    },
    {
      id: 'e3-t07',
      q: 'คำว่า receipts ใน “tourism service receipts amounted to 359 billion Baht” (ข้อความที่ 2) หมายถึงอะไร และฉบับภาษาไทยใช้คำใด',
      choices: [
        'ใบเสร็จรับเงิน ฉบับไทยใช้ “ใบเสร็จการท่องเที่ยว”',
        'รายรับ ฉบับไทยใช้ “มูลค่าบริการรับด้านการท่องเที่ยว”',
        'รายจ่าย ฉบับไทยใช้ “ค่าใช้จ่ายด้านการท่องเที่ยว”',
        'จำนวนผู้เข้าพัก ฉบับไทยใช้ “อัตราการเข้าพักเฉลี่ย”',
      ],
      answer: 1,
      why: 'ในบริบทนี้ receipts คือรายรับ ตามด้วยจำนวนเงิน 359 billion Baht และฉบับไทยหน้า 4 เขียนประโยคเดียวกันว่า “มูลค่าบริการรับด้านการท่องเที่ยวอยู่ที่ 3.59 แสนล้านบาท” “ใบเสร็จรับเงิน” เป็นความหมายทั่วไปที่ไม่เข้าบริบท “รายจ่าย” กลับด้านกับคำว่ารับ และ “อัตราการเข้าพักเฉลี่ย” เป็นตัวชี้วัดอีกตัวที่อยู่คนละประโยคในฉบับเต็มหน้า 4 และวัดเป็นร้อยละ ไม่ใช่เงิน',
      refs: [
        { doc: EN, page: 4 },
        { doc: TH, page: 4 },
      ],
    },
    {
      id: 'e3-t08',
      q: 'ข้อความที่ 3 เขียนว่า “Private consumption and private investment are projected to expand by 2.0 percent and 7.9 percent, respectively” ข้อใดถูกต้อง',
      choices: [
        'Investment is projected to grow faster than consumption.',
        'Private consumption is projected to grow by 7.9 percent.',
        'Both are projected to grow by 7.9 percent.',
        'Private investment is projected to grow by 2.0 percent.',
      ],
      answer: 0,
      why: 'respectively (ไทยหน้า 6 ใช้ “ตามลำดับ”) จับคู่ตามลำดับที่เขียน การบริโภคภาคเอกชนคู่กับ 2.0 การลงทุนภาคเอกชนคู่กับ 7.9 และ 7.9 มากกว่า 2.0 การลงทุนจึงคาดว่าโตเร็วกว่า “Private consumption… 7.9 percent” และ “Private investment… 2.0 percent” จับคู่สลับกัน ส่วน “Both… 7.9 percent” ไม่สนใจคำว่า respectively',
      refs: [
        { doc: EN, page: 6 },
        { doc: TH, page: 6 },
      ],
    },
    {
      id: 'e3-t09',
      q: 'อ่านข้อความที่ 3 แล้วตอบ: What does the passage imply about the expected pace of growth in 2027 compared with 2026?',
      choices: [
        'Growth in 2027 is certain to be exactly 2.5 percent.',
        'The economy is expected to shrink in 2027.',
        'The central estimate for 2027 is the same rate as growth in 2026.',
        'Growth in 2027 is expected to be roughly twice as fast as growth in 2026.',
      ],
      answer: 2,
      why: 'ข้อความให้ “midpoint estimate of 2.5 percent” สำหรับปี 2570 และบอกว่า “continuing from 2.5-percent growth in 2026” ค่ากลางจึงเท่ากับอัตราปี 2569 พอดี ข้อนี้เป็นสิ่งที่อนุมานจากการเทียบสองตัวเลข “certain to be exactly 2.5 percent” ผิด เพราะ projected และการให้เป็นช่วง 2.0–3.0 บอกว่ายังไม่แน่นอน “shrink” ขัดกับช่วงที่เป็นบวกทั้งหมด ส่วน “roughly twice as fast” ผิดเพราะแม้ขอบบน 3.0 ก็ไม่ถึงสองเท่าของ 2.5 (2.5 × 2 = 5.0)',
      refs: [
        { doc: EN, page: 6 },
        { doc: TH, page: 5 },
      ],
    },
    {
      id: 'e3-t10',
      q: 'คำว่า net exports ในปัจจัยสนับสนุนข้อ (4) ของข้อความที่ 3 ฉบับภาษาไทยใช้คำใด',
      choices: ['การส่งออกสินค้า', 'มูลค่าการส่งออก', 'การนำเข้าสุทธิ', 'การส่งออกสุทธิ'],
      answer: 3,
      why: 'ฉบับไทยหน้า 6 เขียนปัจจัยข้อ (4) ว่า “การเพิ่มขึ้นของแรงขับเคลื่อนจากการส่งออกสุทธิ” net แปลว่าสุทธิ (ความรู้ทั่วไป: การส่งออกสุทธิคือการส่งออกหักการนำเข้า) “การส่งออกสินค้า” และ “มูลค่าการส่งออก” ไม่มีความหมายของสุทธิ (มูลค่าการส่งออกตรงกับ export value ในประโยคถัดไป) ส่วน “การนำเข้าสุทธิ” กลับด้านกับ exports',
      refs: [
        { doc: EN, page: 6 },
        { doc: TH, page: 6 },
      ],
    },
  ],

  sources: [
    { doc: EN, page: '1, 4, 6' },
    { doc: TH, page: '1, 4–6' },
    { doc: 'nesdc-recruitment-2569', page: 5 },
  ],
};

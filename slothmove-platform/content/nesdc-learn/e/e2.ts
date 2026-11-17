import type { Lesson } from '@/lib/nesdc-learn/types';

// E2 · ศัพท์นโยบายและเศรษฐกิจ. Every English term is quoted from สศช.'s English press release econ-press-en-q3-2569
// (released 16 Nov 2026; printed page = PDF page) and paired with the Thai wording of the Thai release
// econ-press-q3-2569 (page breaks differ: EN p.1–2 ≈ TH p.1–2, EN p.5 ≈ TH p.5, EN p.6 ≈ TH p.5–6,
// EN p.7 export outlook ≈ TH p.6, EN pp.7–9 policy ≈ TH pp.7–9, tables EN/TH pp.10–11).
// Complements e3 (its explorer covers expanded by, accelerating/decelerating from, after seasonal adjustment,
// same period of the previous year, accommodation sector, tourism service receipts, midpoint estimate,
// key supporting factors, contribution from net exports, respectively): this lesson picks other terms.
// "contract", "forecast", "household debt" and "non-performing loans" do NOT appear in this release, so they are
// not taught. Core-inflation definition is general economics (labelled, plain). Exam subject: nesdc-recruitment-2569 p.5.

const EN = 'econ-press-en-q3-2569';
const TH = 'econ-press-q3-2569';

export const lesson: Lesson = {
  id: 'e2',
  topic: 'e',
  order: 2,
  title: 'ศัพท์นโยบายและเศรษฐกิจ',
  lead: 'บทนี้รวมศัพท์ที่ สศช. ใช้จริงในเอกสารแถลงข่าวภาษาอังกฤษ เรื่องเศรษฐกิจไตรมาสที่สาม ปี 2569 แต่ละคำจับคู่กับคำไทยที่ฉบับภาษาไทยพิมพ์ไว้ พร้อมประโยคจริงและเลขหน้า เน้นคู่คำที่สับสนง่าย เช่น declined กับ decelerating, surplus กับ deficit, headline กับ core inflation และตัวเลขจริงกับประมาณการ',
  minutes: 20,
  jumps: [
    ['why', 'ทำไม'],
    ['story', 'คู่คำ'],
    ['parts', 'คลังศัพท์'],
    ['exam', 'ข้อสอบ'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · ทำไมต้องรู้เรื่องนี้',
      title: 'อ่านเศรษฐกิจภาษาอังกฤษไม่ออก มักเพราะศัพท์ไม่กี่สิบคำ ไม่ใช่ไวยากรณ์',
      body: [
        'การประเมินครั้งที่ 1 ของตำแหน่งพนักงานบริหารงานทั่วไป 3 (งานวิเคราะห์นโยบายและแผน) เป็นการสอบข้อเขียนที่มี **ภาษาอังกฤษ** อยู่ในหลักเกณฑ์ด้วย และงานของตำแหน่งนี้เกี่ยวกับนโยบาย แผนงาน และโครงการด้านเศรษฐกิจ สังคม คำแนะนำของเรา: ศัพท์เศรษฐกิจใช้ได้ทั้งตอนสอบและตอนทำงาน จึงคุ้มที่จะฝึกไว้',
        'สศช. ออกเอกสารแถลงข่าวภาวะเศรษฐกิจไตรมาสที่สาม ปี 2569 ทั้งฉบับภาษาไทยและภาษาอังกฤษในวันเดียวกัน เนื้อหาตรงกัน แต่จัดหน้าไม่ตรงกัน บทนี้จึงอ้างเลขหน้าทั้งสองฉบับทุกครั้ง เพื่อให้เปิดดูประโยคเดียวกันได้ทั้งสองภาษา',
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
          body: 'ข้อสอบศัพท์มักมาสามแบบ แบบแรกยกประโยคมาแล้วถามความหมายของคำในบริบท แบบที่สองถามคู่คำตรงข้ามหรือคำที่คล้ายกันแต่ความหมายต่าง เช่น declined กับ decelerated แบบที่สามให้จับคู่คำอังกฤษกับคำไทยที่ใช้ในงานราชการ ตัวเลือกผิดมักเป็นคำแปลตามพจนานุกรมที่ไม่เข้ากับบริบทเศรษฐกิจ เช่น แปล current account ว่า “บัญชีปัจจุบัน”',
        },
      ],
    },

    // 2 · story: confusable pairs
    {
      type: 'section',
      anchor: 'story',
      eyebrow: '2 · คู่คำที่ต้องแยกให้ออก',
      title: 'ศัพท์เศรษฐกิจส่วนใหญ่ตอบสามคำถาม: ไปทางไหน เร็วขึ้นหรือช้าลง และเป็นของจริงหรือคาดการณ์',
      body: [
        'ประโยคในเอกสารแถลงข่าวมีโครงซ้ำกันมาก คือ “สิ่งนี้ + คำบอกทิศทาง + ร้อยละเท่าไร + เทียบกับอะไร” ถ้าแยกคำบอกทิศทางกับคำบอกความเร็วออกจากกันได้ ก็อ่านได้เกือบทั้งฉบับ',
        'คำบอกทิศทางที่ฉบับอังกฤษใช้คือ expanded, increased, grew (โตขึ้น) กับ declined, decreased (ลดลง) ส่วนคำว่า contract หรือ “หดตัว” ไม่ปรากฏในเอกสารแถลงข่าวฉบับนี้เลย ทั้งสองภาษาใช้ declined คู่กับ “ลดลง” แทน',
      ],
      refs: [
        { doc: EN, page: '1–2, 5' },
        { doc: TH, page: '1–2, 5' },
      ],
      blocks: [
        {
          type: 'quad',
          title: 'สี่คู่คำที่สับสนบ่อย (คำไทยตามฉบับภาษาไทย)',
          cells: [
            {
              tag: 'ทิศทาง',
              name: 'expanded ↔ declined',
              desc: '“ขยายตัว” กับ “ลดลง” บอกว่าตัวเลขบวกหรือลบ เช่น Private consumption expenditure expanded by 2.5 percent กับ Government consumption expenditure declined by 1.6 percent (อังกฤษ หน้า 1, ไทย หน้า 1)',
            },
            {
              tag: 'ความเร็ว',
              name: 'accelerating ↔ decelerating',
              desc: '“เร่งขึ้น” กับ “ชะลอลง” บอกว่าอัตราการขยายตัวเร็วขึ้นหรือช้าลง ตัวเลขยังเป็นบวกได้ทั้งคู่ เช่น “Expenditure on services increased by 0.8 percent, decelerating from 1.2 percent in the previous quarter” ฉบับไทยใช้ “ขยายตัวร้อยละ 0.8 ชะลอลงจากร้อยละ 1.2 ในไตรมาสก่อน” (อังกฤษ หน้า 1, ไทย หน้า 1)',
            },
            {
              tag: 'ดุล',
              name: 'surplus ↔ deficit',
              desc: '“เกินดุล” กับ “ขาดดุล” ดุลการค้าไตรมาสที่สาม a surplus of 4.2 billion US dollars เทียบกับ a deficit of 5.6 billion US dollars ในไตรมาสก่อนหน้า (อังกฤษ หน้า 2, ไทย หน้า 2)',
            },
            {
              tag: 'เงินเฟ้อ',
              name: 'headline ↔ core inflation',
              desc: '“อัตราเงินเฟ้อทั่วไป” กับ “อัตราเงินเฟ้อพื้นฐาน” ไตรมาสที่สาม headline เฉลี่ย 2.4 percent ส่วน core เฉลี่ย 1.4 percent (อังกฤษ หน้า 5, ไทย หน้า 5)',
            },
          ],
          center: 'แยกคำถามก่อน: ทิศทาง ความเร็ว ดุล หรือชนิดเงินเฟ้อ',
          refs: [
            { doc: EN, page: '1, 2, 5' },
            { doc: TH, page: '1, 2, 5' },
          ],
        },
        {
          type: 'table',
          title: 'อีกสองคู่ที่ตัวเลขชวนสับสน',
          rows: [
            ['ฉบับอังกฤษ', 'ฉบับไทย', 'ใช้กับ'],
            ['Actual Data', 'ข้อมูลจริง', 'ปี 2567–2568 ในตารางที่ 3'],
            ['Projection', 'ประมาณการ', 'ปี 2569–2570 ในตารางที่ 3'],
            ['the previous quarter', 'ไตรมาสก่อนหน้า', 'เทียบกับไตรมาสที่แล้ว'],
            ['the same quarter of the previous year', 'ไตรมาสเดียวกันของปีก่อน', 'เทียบกับไตรมาสเดียวกันเมื่อปีที่แล้ว'],
          ],
          highlightCol: 1,
          after: 'ประโยคเรื่องอัตราการว่างงานใช้ทั้งสองแบบในประโยคเดียว “1.02 percent, higher than 0.95 percent in the previous quarter and 0.77 percent in the same quarter of the previous year” ส่วนคู่ %YoY กับ %QoQ sa อยู่ในบทอ่านจับใจความของหัวข้อนี้แล้ว',
          refs: [
            { doc: EN, page: '5, 11' },
            { doc: TH, page: '5, 11' },
          ],
        },
        {
          type: 'note',
          title: 'ข้อสรุปของส่วนนี้',
          plain: true,
          body: 'วิธีจำ: ก่อนแปลคำ ให้ถามว่าคำนี้ตอบคำถามไหน ถ้าบอกบวกหรือลบ คือคำทิศทาง ถ้ามีคำว่า from ตามด้วยตัวเลขเดิม มักเป็นคำความเร็ว และถ้ามี projected, expected, anticipated คือคาดการณ์ ไม่ใช่สิ่งที่เกิดขึ้นแล้ว',
        },
      ],
    },

    // 3 · parts: the term bank + explorer
    {
      type: 'section',
      anchor: 'parts',
      eyebrow: '3 · คลังศัพท์ตามลำดับเอกสาร',
      title: 'ไล่ตามลำดับที่เอกสารแถลงข่าวเขียน: ใช้จ่าย เสถียรภาพ ประมาณการ แล้วจึงนโยบาย',
      body: [
        'เอกสารแถลงข่าวเรียงเรื่องเหมือนกันทั้งสองภาษา เริ่มจากด้านการใช้จ่าย (On the expenditure side) ด้านการผลิต (On the production side) เสถียรภาพทางเศรษฐกิจ (On economic stability) แนวโน้มปี 2569 และ 2570 แล้วปิดด้วยประเด็นการบริหารนโยบายเศรษฐกิจมหภาค (Economic Management for the Remainder of 2026 and 2027) ศัพท์แต่ละกลุ่มจึงอยู่ในตำแหน่งที่คาดได้',
        'ข้อสังเกตสำคัญ: คำอังกฤษคำเดียวกันอาจตรงกับคำไทยมากกว่าหนึ่งแบบในฉบับไทย เช่น government consumption expenditure ในย่อหน้าสรุปใช้ “การใช้จ่ายภาครัฐ” แต่ในย่อหน้ารายละเอียดใช้ “การใช้จ่ายเพื่อการอุปโภคของรัฐบาล” และในตารางที่ 2 ใช้ “การอุปโภคภาครัฐบาล” จึงต้องจับคู่ด้วยความหมายและตำแหน่งในประโยค ไม่ใช่ท่องคำเดียว',
      ],
      refs: [
        { doc: EN, page: '1, 3, 5, 6, 7, 10' },
        { doc: TH, page: '1, 3, 5, 7, 10' },
      ],
      blocks: [
        {
          type: 'asOf',
          date: 'ข้อมูล ณ 16 พ.ย. 2569',
          note: 'ตัวเลขด้านการใช้จ่ายและเสถียรภาพเป็นของไตรมาสที่สาม ปี 2569 (หนี้สาธารณะและเงินทุนสำรองฯ ณ สิ้นเดือนกันยายน 2569) ส่วนตัวเลขแนวโน้มเป็นประมาณการปี 2569 และ 2570 ที่แถลงวันเดียวกัน',
        },
        {
          type: 'table',
          title: 'ด้านการใช้จ่าย',
          rows: [
            ['ฉบับอังกฤษ', 'ฉบับไทย', 'ความหมายง่าย ๆ'],
            ['Private consumption expenditure', 'การอุปโภคบริโภคภาคเอกชน', 'การใช้จ่ายของภาคเอกชนและครัวเรือน'],
            ['Government consumption expenditure', 'การใช้จ่ายเพื่อการอุปโภคของรัฐบาล', 'รายจ่ายของรัฐเพื่อดำเนินงาน'],
            ['Total investment', 'การลงทุนรวม', 'การลงทุนภาคเอกชนรวมภาครัฐ'],
            ['Gross Fixed Capital Formation', 'การสะสมทุนถาวรเบื้องต้น', 'ชื่อทางบัญชีของการลงทุนรวม'],
            ['exports of goods', 'การส่งออกสินค้า', 'ขายสินค้าให้ต่างประเทศ'],
            ['export volume / export prices', 'ดัชนีปริมาณการส่งออก / ดัชนีราคาสินค้าส่งออก', 'แยกมูลค่าเป็นปริมาณกับราคา'],
          ],
          highlightCol: 1,
          after: 'หมายเหตุท้ายตารางที่ 3 ทั้งสองฉบับเขียนตรงกันว่า “Investment means Gross Fixed Capital Formation” หรือ “การลงทุนรวม หมายถึง การสะสมทุนถาวรเบื้องต้น” ช่องความหมายง่าย ๆ เป็นคำอธิบายของเรา',
          refs: [
            { doc: EN, page: '1, 2, 11' },
            { doc: TH, page: '1, 2, 11' },
          ],
        },
        {
          type: 'table',
          title: 'เสถียรภาพทางเศรษฐกิจ (On economic stability)',
          rows: [
            ['ฉบับอังกฤษ', 'ฉบับไทย', 'ไตรมาสที่สาม ปี 2569'],
            ['unemployment rate', 'อัตราการว่างงาน', 'ร้อยละ 1.02'],
            ['headline inflation', 'อัตราเงินเฟ้อทั่วไป', 'เฉลี่ยร้อยละ 2.4'],
            ['core inflation', 'อัตราเงินเฟ้อพื้นฐาน', 'ร้อยละ 1.4'],
            ['current account', 'ดุลบัญชีเดินสะพัด', 'เกินดุล 1.4 พันล้านดอลลาร์ สรอ.'],
            ['international reserves', 'เงินทุนสำรองระหว่างประเทศ', '276.1 พันล้านดอลลาร์ สรอ.'],
            ['public debt', 'หนี้สาธารณะ', '13.4 ล้านล้านบาท (ร้อยละ 68.6 ของ GDP)'],
          ],
          highlightCol: 1,
          after: 'เงินทุนสำรองฯ และหนี้สาธารณะเป็นยอด ณ สิ้นเดือนกันยายน 2569 คำว่า current ใน current account ไม่ได้แปลว่า “ปัจจุบัน” แต่เป็นชื่อบัญชี ฉบับไทยใช้ “ดุลบัญชีเดินสะพัด”',
          refs: [
            { doc: EN, page: 5 },
            { doc: TH, page: 5 },
          ],
        },
        {
          type: 'note',
          title: 'headline กับ core ต่างกันอย่างไร',
          plain: true,
          body: 'ความรู้ทั่วไปด้านเศรษฐศาสตร์ (เอกสารแถลงข่าวไม่ได้นิยามไว้): เงินเฟ้อทั่วไปวัดจากราคาสินค้าและบริการทั้งตะกร้า ส่วนเงินเฟ้อพื้นฐานโดยทั่วไปตัดหมวดที่ราคาผันผวนสูง เช่น อาหารสดและพลังงาน ออก คำว่า headline ในที่นี้จึงไม่ได้แปลว่า “พาดหัวข่าว” และ core ไม่ได้แปลว่า “แกนกลาง” ในความหมายทั่วไป',
        },
        {
          type: 'table',
          title: 'ประมาณการและนโยบาย',
          rows: [
            ['ฉบับอังกฤษ', 'ฉบับไทย', 'ความหมายง่าย ๆ'],
            ['is projected to expand within the range of', 'คาดว่าจะขยายตัวในช่วงร้อยละ', 'คาดการณ์เป็นช่วง ไม่ใช่ค่าที่เกิดแล้ว'],
            ['a high base of comparison', 'ฐานการบริโภคที่สูง (ในประโยคเรื่องการบริโภค)', 'ตัวเลขปีที่ใช้เทียบสูง'],
            ['uncertainty', 'ความไม่แน่นอน', 'ยังคาดผลไม่ได้แน่'],
            ['risks', 'ความเสี่ยง', 'สิ่งที่อาจทำให้แย่ลง'],
            ['disbursement', 'การเบิกจ่าย', 'จ่ายเงินงบประมาณออกจริง'],
            ['carry-over budget', 'งบประมาณรายจ่ายเหลื่อมปี', 'งบปีก่อนที่ยังเบิกต่อได้'],
            ['fiscal space', 'พื้นที่ทางการคลัง', 'ช่องว่างทางการคลังที่ยังรับมือได้'],
          ],
          highlightCol: 1,
          after: 'ช่องความหมายง่าย ๆ เป็นคำอธิบายของเรา คำว่า forecast ไม่ปรากฏในฉบับอังกฤษฉบับนี้ ฉบับนี้ใช้ projected, expected, anticipated และหัวตาราง Projection ซึ่งฉบับไทยใช้ “คาดว่า” และ “ประมาณการ”',
          refs: [
            { doc: EN, page: '6, 7, 9, 11' },
            { doc: TH, page: '5–9, 11' },
          ],
        },
        {
          type: 'explorer',
          title: 'แตะคำ ดูประโยคจริงและคำไทย',
          intro: 'แต่ละคำยกมาพร้อมประโยคที่ปรากฏในฉบับภาษาอังกฤษ ส่วนคำอธิบายบอกคำไทยที่ฉบับภาษาไทยใช้ในประโยคเดียวกัน ลองเดาความหมายจากบริบทก่อนแตะ คำอย่าง accelerating, decelerating, midpoint estimate และ net exports อยู่ในบทอ่านจับใจความแล้ว',
          initial: 'w1',
          groups: [
            {
              tag: 'ใช้จ่าย',
              name: 'ด้านการใช้จ่าย',
              idea: 'คำบอกการเปลี่ยนทิศ',
              items: [
                { key: 'w1', label: '1', full: 'returned to expansion (อังกฤษ หน้า 2): “Public investment returned to expansion, increasing by 1.7 percent, compared with a 1.6-percent decline in the previous quarter.”', meaning: 'ไทยหน้า 2 ใช้ “การลงทุนภาครัฐ **กลับมาขยายตัว**ร้อยละ 1.7 เทียบกับการลดลงร้อยละ 1.6” แปลว่าไตรมาสก่อนติดลบ ไตรมาสนี้กลับเป็นบวก' },
                { key: 'w2', label: '2', full: 'for the first time in four quarters (อังกฤษ หน้า 1): “Government consumption expenditure declined by 1.6 percent for the first time in four quarters”', meaning: 'ไทยหน้า 1 ใช้ “**ลดลงครั้งแรกในรอบ 4 ไตรมาส**” แปลว่าลดลงในไตรมาสนี้ โดยสามไตรมาสก่อนหน้าไม่ได้ลดลง ตารางที่ 2 หน้า 10 ยืนยัน (1.3, 3.4, 0.2 แล้วจึง −1.6)' },
                { key: 'w3', label: '3', full: 'Gross Fixed Capital Formation (อังกฤษ หน้า 11): “Investment means Gross Fixed Capital Formation.”', meaning: 'ไทยหน้า 11 ใช้ “การลงทุนรวม หมายถึง **การสะสมทุนถาวรเบื้องต้น**” เป็นชื่อทางบัญชีประชาชาติของการลงทุน ไม่ใช่เงินทุนสำรอง' },
                { key: 'w4', label: '4', full: 'export volume / export prices (อังกฤษ หน้า 2): “Export volume increased by 19.8 percent… Export prices increased by 3.1 percent”', meaning: 'ไทยหน้า 2 ใช้ “**ดัชนีปริมาณการส่งออก**ขยายตัวร้อยละ 19.8” และ “**ดัชนีราคาสินค้าส่งออก**เพิ่มขึ้นร้อยละ 3.1” มูลค่าส่งออกโตร้อยละ 23.6 ขณะที่ทั้งปริมาณและราคาเพิ่มขึ้น' },
              ],
            },
            {
              tag: 'เสถียร',
              name: 'เสถียรภาพทางเศรษฐกิจ',
              idea: 'ชื่อตัวชี้วัด',
              items: [
                { key: 'w5', label: '5', full: 'headline inflation (อังกฤษ หน้า 5): “The average headline inflation rate stood at 2.4 percent”', meaning: 'ไทยหน้า 5 ใช้ “**อัตราเงินเฟ้อทั่วไป**เฉลี่ยอยู่ที่ร้อยละ 2.4” แต่ในส่วนแนวโน้ม ฉบับไทยเขียนเพียง “อัตราเงินเฟ้อ” (หน้า 5) และ “อัตราเงินเฟ้อเฉลี่ย” (หน้า 6) แทน headline inflation' },
                { key: 'w6', label: '6', full: 'core inflation (อังกฤษ หน้า 5): “while core inflation averaged 1.4 percent.”', meaning: 'ไทยหน้า 5 ใช้ “**อัตราเงินเฟ้อพื้นฐาน**อยู่ที่ร้อยละ 1.4” ต่ำกว่าเงินเฟ้อทั่วไป (2.4) อยู่ 1.0 จุดร้อยละ (percentage point)' },
                { key: 'w7', label: '7', full: 'returned to a surplus (อังกฤษ หน้า 5): “The current account returned to a surplus of 1.4 billion US dollars (47.0 billion Baht).”', meaning: 'ไทยหน้า 5 ใช้ “**ดุลบัญชีเดินสะพัดกลับมาเกินดุล** 1.4 พันล้านดอลลาร์ สรอ.” returned to บอกว่าก่อนหน้านี้ไม่ได้เกินดุล' },
                { key: 'w8', label: '8', full: 'equivalent to … of GDP (อังกฤษ หน้า 5): “public debt … totaled 13.4 trillion Baht, equivalent to 68.6 percent of GDP.”', meaning: 'ไทยหน้า 5 ใช้ “หนี้สาธารณะ … 13.4 ล้านล้านบาท **คิดเป็นร้อยละ 68.6 ของ GDP**” equivalent to ในที่นี้คือ “คิดเป็น” ใช้แปลงยอดเงินเป็นสัดส่วนต่อ GDP' },
              ],
            },
            {
              tag: 'คาดการณ์',
              name: 'แนวโน้มปี 2570',
              idea: 'คำของประมาณการและเหตุผล',
              items: [
                { key: 'w9', label: '9', full: 'is projected to expand within the range of (อังกฤษ หน้า 6): “The Thai economy in 2027 is projected to expand within the range of 2.0-3.0 percent”', meaning: 'ไทยหน้า 5 ใช้ “**คาดว่าจะขยายตัวในช่วง**ร้อยละ 2.0 – 3.0” เป็นประมาณการ ไม่ใช่ตัวเลขที่เกิดขึ้นแล้ว' },
                { key: 'w10', label: '10', full: 'a high base of comparison (อังกฤษ หน้า 6): “decelerating from 2.3-percent growth in 2026, partly reflecting a high base of comparison resulting from government support measures.”', meaning: 'ไทยหน้า 6 ใช้ “ส่วนหนึ่งเป็นการชะลอลงจาก**ฐานการบริโภคที่สูง**อันเนื่องมาจากมาตรการของภาครัฐ” คือตัวเลขปีที่ใช้เทียบอยู่ในระดับสูง' },
                { key: 'w11', label: '11', full: 'easing inflationary pressures (อังกฤษ หน้า 6): “together with easing inflationary pressures”', meaning: 'ไทยหน้า 6 ใช้ “**แรงกดดันจากอัตราเงินเฟ้อที่มีแนวโน้มลดลง**” easing คือผ่อนคลายลง เป็นเหตุที่ช่วยการบริโภค' },
              ],
            },
            {
              tag: 'นโยบาย',
              name: 'การบริหารเศรษฐกิจ',
              idea: 'คำด้านงบประมาณและความเสี่ยง',
              items: [
                { key: 'w12', label: '12', full: 'risks arising from (อังกฤษ หน้า 7): “Preparing for risks arising from the highly uncertain conflict in the Middle East”', meaning: 'ไทยหน้า 7 ใช้ “การเตรียมความพร้อมรองรับ**ความเสี่ยง**จากสถานการณ์ความขัดแย้งในตะวันออกกลางที่ยังมีความไม่แน่นอนสูง”' },
                { key: 'w13', label: '13', full: 'uncertainty over trade-restrictive measures (อังกฤษ หน้า 7): “amid continued uncertainty over trade-restrictive measures.”', meaning: 'ไทยหน้า 6 ใช้ “ท่ามกลาง**ความไม่แน่นอน**ของ**มาตรการกีดกันทางการค้า**” amid แปลว่าท่ามกลาง' },
                { key: 'w14', label: '14', full: 'disbursement rate (อังกฤษ หน้า 9): “a target overall disbursement rate of at least 93 percent of the total budget, including at least 98 percent for current expenditure and 75 percent for capital expenditure”', meaning: 'ไทยหน้า 8 ใช้ “**อัตราการเบิกจ่าย**งบประมาณทั้งปีงบประมาณต้องไม่ต่ำกว่าร้อยละ 93” แบ่งเป็น “รายจ่ายประจำ” (current expenditure) ไม่ต่ำกว่าร้อยละ 98 และ “รายจ่ายลงทุน” (capital expenditure) ร้อยละ 75' },
                { key: 'w15', label: '15', full: 'carry-over budget (อังกฤษ หน้า 9): “while expediting the disbursement of carry-over budget allocations”', meaning: 'ไทยหน้า 8 ใช้ “เร่งรัดการเบิกจ่าย**งบประมาณรายจ่ายเหลื่อมปี**”' },
                { key: 'w16', label: '16', full: 'fiscal space (อังกฤษ หน้า 9): “maintaining sufficient fiscal space to accommodate future economic uncertainties”', meaning: 'ไทยหน้า 9 ใช้ “การรักษา**พื้นที่ทางการคลัง**ให้เพียงพอสำหรับการรองรับสถานการณ์ความไม่แน่นอนในอนาคต” และ fiscal consolidation path ตรงกับ “แนวทางที่ชัดเจนในการลดการขาดดุลทางการคลัง”' },
              ],
            },
          ],
          refs: [
            { doc: EN, page: '1, 2, 5, 6, 7, 9, 11' },
            { doc: TH, page: '1, 2, 5–9, 10, 11' },
          ],
        },
      ],
    },

    // 4 · exam
    {
      type: 'section',
      anchor: 'exam',
      eyebrow: '4 · ข้อสอบถามแบบนี้ คิดแบบนี้',
      title: 'ความหมายต้องมาจากประโยค และคำไทยต้องมาจากตำแหน่งเดียวกันในฉบับไทย',
      blocks: [
        {
          type: 'reasoning',
          question: '“Public investment returned to expansion, increasing by 1.7 percent, compared with a 1.6-percent decline in the previous quarter.” (อังกฤษ หน้า 2) คำว่า returned to expansion บอกอะไร',
          steps: [
            'หาตัวเลขคู่เทียบในประโยคเดียวกัน ไตรมาสนี้ increasing by 1.7 percent ส่วนไตรมาสก่อน a 1.6-percent decline คือจากติดลบเป็นบวก',
            'returned to แปลว่ากลับไปสู่สภาพเดิม จึงบอกว่าเคยขยายตัวมาก่อน แล้วลดลงหนึ่งช่วง ตอนนี้กลับมาขยายตัวอีก ตารางที่ 2 หน้า 10 ยืนยันว่าการลงทุนภาครัฐไตรมาสที่หนึ่ง ปี 2569 ขยายตัว 9.4 ไตรมาสที่สอง −1.6 และไตรมาสที่สาม 1.7',
            'เทียบฉบับไทยหน้า 2 “การลงทุนภาครัฐ กลับมาขยายตัวร้อยละ 1.7 เทียบกับการลดลงร้อยละ 1.6 ในไตรมาสก่อนหน้า” คำไทยคือ “กลับมาขยายตัว”',
          ],
          answer: 'การลงทุนภาครัฐเปลี่ยนจากลดลง (−1.6) ในไตรมาสก่อน มาเป็นขยายตัว (+1.7) ในไตรมาสนี้',
          trap: 'อย่าสับสนกับ accelerated (“เร่งขึ้น”) ซึ่งใช้เมื่อตัวเลขยังเป็นบวกทั้งสองไตรมาสแต่สูงขึ้น เช่น การลงทุนภาคเอกชน 16.2 เร่งขึ้นจาก 13.5 และอย่าอ่าน returned เป็น “คืนเงิน”',
          refs: [
            { doc: EN, page: '2, 10' },
            { doc: TH, page: '2, 10' },
          ],
        },
        {
          type: 'reasoning',
          question: 'ในประโยค “a target overall disbursement rate of at least 93 percent of the total budget, including at least 98 percent for current expenditure and 75 percent for capital expenditure” (อังกฤษ หน้า 9) ฉบับไทยใช้คำใดแทน current expenditure และ capital expenditure',
          steps: [
            'อย่าแปลทีละคำ current ในบริบทงบประมาณไม่ใช่ “ปัจจุบัน” และ capital ไม่ใช่ “เมืองหลวง” หรือ “ทุนนิยม” ให้ไปหาประโยคเดียวกันในฉบับไทยซึ่งอยู่หน้า 8',
            'ฉบับไทยเขียนว่า “การเบิกจ่ายงบประมาณรายจ่ายประจำไม่ต่ำกว่าร้อยละ 98 และรายจ่ายลงทุนร้อยละ 75 ตามลำดับ” จับคู่ด้วยตัวเลข 98 กับ 75 ได้ทันที',
            'ระวังคำที่หน้าตาคล้าย: annual budget ในประโยคเดียวกันฉบับไทยใช้ “งบประมาณรายจ่ายประจำปีงบประมาณ 2570” ซึ่งต่างจาก “รายจ่ายประจำ” (current expenditure)',
          ],
          answer: 'current expenditure = “รายจ่ายประจำ” (เป้าไม่ต่ำกว่าร้อยละ 98) และ capital expenditure = “รายจ่ายลงทุน” (ร้อยละ 75)',
          trap: 'การใช้ตัวเลขช่วยจับคู่ปลอดภัยที่สุด ถ้าเห็นตัวเลือก “รายจ่ายปัจจุบัน” หรือสลับ 98 กับ 75 ให้ตัดทิ้งได้เลย',
          refs: [
            { doc: EN, page: 9 },
            { doc: TH, page: 8 },
          ],
        },
        {
          type: 'asOf',
          date: 'ข้อมูล ณ 16 พ.ย. 2569',
          note: 'ตัวเลขการลงทุนภาครัฐเป็นของไตรมาสที่สาม ปี 2569 ส่วนเป้าอัตราการเบิกจ่ายเป็นข้อเสนอสำหรับงบประมาณปี 2570 ในเอกสารแถลงข่าววันที่ 16 พ.ย. 2569',
        },
      ],
    },

    // mistakes
    {
      type: 'mistakes',
      items: [
        {
          title: 'แปล current ว่า “ปัจจุบัน” ทุกที่',
          body: 'current เป็นคำที่คุ้นที่สุดจึงแปลตามความเคยชิน แต่ในเอกสารนี้ current account คือ “ดุลบัญชีเดินสะพัด” และ current expenditure คือ “รายจ่ายประจำ” วิธีแก้คือดูคำที่ตามหลัง ถ้าเป็น account หรือ expenditure ให้ใช้ศัพท์เฉพาะ',
        },
        {
          title: 'อ่าน decelerated ว่าลดลง',
          body: 'คำว่า “ชะลอ” ฟังดูเป็นข่าวร้ายจึงถูกเหมาเป็นติดลบ สาขาก่อสร้าง “expanded by 0.1 percent, decelerating from a 0.3-percent growth” ยังโตอยู่ ส่วนการก่อสร้างภาคเอกชนที่ “declined by 0.5 percent” จึงจะเป็นการลดลงจริง วิธีแก้คือดูตัวเลขหลัง by ก่อนคำบอกความเร็ว',
        },
        {
          title: 'สับสน 1.4 พันล้านดอลลาร์ กับร้อยละ 1.4 ของ GDP',
          body: 'ตัวเลข 1.4 ปรากฏสองที่ในเรื่องดุลบัญชีเดินสะพัด ไตรมาสที่สาม ปี 2569 “returned to a surplus of 1.4 billion US dollars” เป็นยอดเงินที่เกิดขึ้นแล้ว (หน้า 5) แต่ปี 2570 “expected to record a surplus equivalent to 1.4 percent of GDP” เป็นประมาณการและเป็นสัดส่วน (หน้า 6) วิธีแก้คือดูหน่วยและคำว่า expected ทุกครั้ง',
        },
        {
          title: 'ท่องคำไทยไว้คำเดียวต่อหนึ่งคำอังกฤษ',
          body: 'ฉบับไทยเปลี่ยนคำตามตำแหน่ง เช่น headline inflation ในส่วนเสถียรภาพใช้ “อัตราเงินเฟ้อทั่วไป” แต่ในส่วนแนวโน้มปี 2569 ใช้เพียง “อัตราเงินเฟ้อ” และ private consumption ในตารางที่ 2 ใช้ “การบริโภคภาคเอกชน” ขณะที่ย่อหน้าใช้ “การอุปโภคบริโภคภาคเอกชน” วิธีแก้คือจำความหมายและหาประโยคคู่กันจากตัวเลข',
        },
      ],
      refs: [
        { doc: EN, page: '5, 6, 9, 10' },
        { doc: TH, page: '1, 5, 6, 8, 10' },
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
          id: 'e2-c1',
          q: '“Government consumption expenditure declined by 1.6 percent for the first time in four quarters, compared with a 0.2-percent expansion in the previous quarter.” (อังกฤษ หน้า 1) ข้อใดตรงกับความหมายของ for the first time in four quarters',
          choices: [
            'It had declined in each of the four previous quarters.',
            'It declined now, after three quarters without a decline.',
            'It declined by a total of 1.6 percent over the last four quarters.',
            'It is expected to decline again in the next four quarters.',
          ],
          answer: 1,
          why: 'for the first time in four quarters ตรงกับฉบับไทยหน้า 1 “ลดลงครั้งแรกในรอบ 4 ไตรมาส” คือในช่วงสี่ไตรมาสล่าสุด ไตรมาสนี้เป็นครั้งเดียวที่ลดลง ตารางที่ 2 หน้า 10 แสดง 1.3, 3.4, 0.2 แล้วจึง −1.6 “declined in each of the four previous quarters” ขัดกับ 0.2-percent expansion ในประโยคเอง “a total of 1.6 percent over the last four quarters” ผิดเพราะ 1.6 คือไตรมาสเดียว ส่วน “expected to decline again” ไม่มีในประโยคเลย',
          refs: [
            { doc: EN, page: '1, 10' },
            { doc: TH, page: '1, 10' },
          ],
        },
        {
          id: 'e2-c2',
          q: 'ฉบับไทยหน้า 2 เขียนว่า “ดุลการค้าเกินดุล 4.2 พันล้านดอลลาร์ สรอ. … เทียบกับการขาดดุล 5.6 พันล้านดอลลาร์ สรอ. … ในไตรมาสก่อนหน้า” ฉบับอังกฤษเติมช่องว่างนี้ด้วยคำใด: “the trade balance recorded a surplus of 4.2 billion US dollars, compared with a ___ of 5.6 billion US dollars in the previous quarter”',
          choices: ['decline', 'reserve', 'surplus', 'deficit'],
          answer: 3,
          why: 'ฉบับไทยใช้ “ขาดดุล” ซึ่งเป็นคู่ตรงข้ามของ “เกินดุล” (surplus) คำอังกฤษจึงเป็น deficit ตามฉบับอังกฤษหน้า 2 “surplus” ผิดเพราะจะขัดกับคำว่าขาดดุล “decline” แปลว่าลดลง ใช้กับอัตราการเปลี่ยน ไม่ใช้กับดุล ส่วน “reserve” คือทุนสำรอง เป็นคนละตัวชี้วัด',
          refs: [
            { doc: EN, page: 2 },
            { doc: TH, page: 2 },
          ],
        },
        {
          id: 'e2-c3',
          q: '“The average headline inflation rate stood at 2.4 percent, while core inflation averaged 1.4 percent.” (อังกฤษ หน้า 5) ข้อใดถ่ายความเป็นภาษาไทยได้ตรงกับฉบับไทย',
          choices: [
            'อัตราเงินเฟ้อทั่วไปเฉลี่ยร้อยละ 2.4 และอัตราเงินเฟ้อพื้นฐานร้อยละ 1.4',
            'อัตราเงินเฟ้อพื้นฐานเฉลี่ยร้อยละ 2.4 และอัตราเงินเฟ้อทั่วไปร้อยละ 1.4',
            'อัตราเงินเฟ้อตามข่าวเฉลี่ยร้อยละ 2.4 และอัตราเงินเฟ้อแกนกลางร้อยละ 1.4',
            'อัตราเงินเฟ้อทั่วไปเฉลี่ยร้อยละ 2.4 ต่ำกว่าอัตราเงินเฟ้อพื้นฐาน',
          ],
          answer: 0,
          why: 'ฉบับไทยหน้า 5 เขียนว่า “อัตราเงินเฟ้อทั่วไปเฉลี่ยอยู่ที่ร้อยละ 2.4 และอัตราเงินเฟ้อพื้นฐานอยู่ที่ร้อยละ 1.4” headline คือทั่วไป core คือพื้นฐาน ข้อ “อัตราเงินเฟ้อพื้นฐานเฉลี่ยร้อยละ 2.4…” สลับชนิดกับตัวเลข ข้อ “อัตราเงินเฟ้อตามข่าว… แกนกลาง” เป็นการแปลตามพจนานุกรมที่ไม่ใช่ศัพท์ทางการ ส่วนข้อที่บอกว่าเงินเฟ้อทั่วไป “ต่ำกว่า” เงินเฟ้อพื้นฐาน ผิดเพราะ 2.4 สูงกว่า 1.4',
          refs: [
            { doc: EN, page: 5 },
            { doc: TH, page: 5 },
          ],
        },
      ],
    },

    // explain
    {
      type: 'explain',
      prompt: 'อธิบายให้เพื่อนฟังว่าทำไมการท่องคำแปลคำต่อคำจึงไม่พอสำหรับศัพท์ในเอกสารแถลงข่าว ยกตัวอย่างคำที่แปลตามพจนานุกรมแล้วผิดหนึ่งคำ และวิธีหาคำไทยที่ถูกจากฉบับภาษาไทย',
      model: 'ศัพท์เศรษฐกิจหลายคำมีความหมายเฉพาะที่ต่างจากความหมายทั่วไป และฉบับไทยก็ใช้คำไทยต่างกันตามตำแหน่ง ตัวอย่างเช่น current expenditure ถ้าแปลตามพจนานุกรมจะได้ “รายจ่ายปัจจุบัน” แต่ฉบับไทยใช้ “รายจ่ายประจำ” (เป้าเบิกจ่ายไม่ต่ำกว่าร้อยละ 98) วิธีหาคำที่ถูกคือหาประโยคเดียวกันในฉบับไทยโดยใช้ตัวเลขเป็นหมุด เช่น 98 กับ 75 แล้วอ่านคำไทยที่อยู่ข้างตัวเลขนั้น',
      refs: [
        { doc: EN, page: 9 },
        { doc: TH, page: 8 },
      ],
    },
  ],

  test: [
    {
      id: 'e2-t01',
      q: 'หมายเหตุท้ายตารางที่ 3 ฉบับอังกฤษเขียนว่า “Investment means Gross Fixed Capital Formation.” ฉบับไทยใช้คำใดแทน Gross Fixed Capital Formation',
      choices: ['เงินทุนสำรองระหว่างประเทศ', 'การลงทุนจากต่างประเทศ', 'การสะสมทุนถาวรเบื้องต้น', 'การนำเข้าสินค้าทุน'],
      answer: 2,
      why: 'ฉบับไทยหน้า 11 เขียนว่า “การลงทุนรวม หมายถึง การสะสมทุนถาวรเบื้องต้น” “เงินทุนสำรองระหว่างประเทศ” คือ international reserves ซึ่งอยู่ในส่วนเสถียรภาพ “การลงทุนจากต่างประเทศ” เป็น foreign direct investment ในส่วนนโยบาย และ “การนำเข้าสินค้าทุน” คือ imports of capital goods ไม่ใช่ชื่อของการลงทุนรวม',
      refs: [
        { doc: EN, page: 11 },
        { doc: TH, page: 11 },
      ],
    },
    {
      id: 'e2-t02',
      q: '“accelerating the disbursement of the FY2027 annual budget, particularly in the first half of the fiscal year” (อังกฤษ หน้า 9) คำว่า disbursement ฉบับไทยใช้คำใด',
      choices: ['การเบิกจ่าย', 'การจัดสรรงบประมาณ', 'การกู้เงิน', 'การระดมทุน'],
      answer: 0,
      why: 'ฉบับไทยหน้า 8 เขียนว่า “การเร่งรัดการเบิกจ่ายงบประมาณรายจ่ายประจำปีงบประมาณ 2570 โดยเฉพาะในช่วงครึ่งแรกของปีงบประมาณ” disbursement คือการจ่ายเงินออกจริง “การจัดสรรงบประมาณ” คือการแบ่งวงเงินซึ่งเกิดก่อนการเบิกจ่าย “การกู้เงิน” ตรงกับ borrow และ “การระดมทุน” ตรงกับ mobilizing funds ในข้อ (3) ของประเด็นเดียวกัน',
      refs: [
        { doc: EN, page: 9 },
        { doc: TH, page: '8–9' },
      ],
    },
    {
      id: 'e2-t03',
      q: '“The current account returned to a surplus of 1.4 billion US dollars (47.0 billion Baht).” (อังกฤษ หน้า 5) ข้อใดสรุปจากคำว่า returned to a surplus ได้ถูกต้อง',
      choices: [
        'It paid the surplus back to trading partners.',
        'Its surplus was larger than in the previous quarter.',
        'It will stay in surplus in the next quarter.',
        'It is in surplus again after a time without one.',
      ],
      answer: 3,
      why: 'returned to แปลว่ากลับไปสู่สภาพเดิม ฉบับไทยหน้า 5 ใช้ “กลับมาเกินดุล” แปลว่าช่วงก่อนหน้าไม่ได้เกินดุลแล้วตอนนี้เกินดุลอีก “paid the surplus back to trading partners” อ่าน return เป็นคืนเงิน “Its surplus was larger than in the previous quarter” ขัดกับคำว่า returned เพราะถ้าไตรมาสก่อนเกินดุลอยู่แล้วก็ไม่ต้อง “กลับมา” ส่วน “will stay in surplus in the next quarter” เป็นการคาดการณ์ที่ประโยคไม่ได้พูด',
      refs: [
        { doc: EN, page: 5 },
        { doc: TH, page: 5 },
      ],
    },
    {
      id: 'e2-t04',
      q: '“Headline inflation is anticipated to be within the range of 0.8 - 1.8 percent” (อังกฤษ หน้า 6 ส่วนแนวโน้มปี 2027) ข้อใดอธิบายประโยคนี้ได้ถูกต้อง',
      choices: [
        'Headline inflation in Q3/2026 was between 0.8 and 1.8 percent.',
        'Average headline inflation in 2027 is projected to fall within that range.',
        'Core inflation, not headline inflation, is projected at 0.8-1.8 percent in 2027.',
        'Headline inflation will fall by 0.8 to 1.8 percentage points in 2027.',
      ],
      answer: 1,
      why: 'anticipated และ within the range บอกว่าเป็นประมาณการแบบช่วงของปี 2570 ฉบับไทยหน้า 6 ใช้ “อัตราเงินเฟ้อเฉลี่ยอยู่ในช่วงร้อยละ 0.8 – 1.8” “in Q3/2026” ผิดเพราะไตรมาสที่สามเกิดขึ้นแล้วและเงินเฟ้อทั่วไปเฉลี่ย 2.4 (หน้า 5) “Core inflation” ผิดชนิดเพราะประโยคพูดถึง headline ส่วน “fall by … percentage points” อ่านระดับเป็นการเปลี่ยนแปลง',
      refs: [
        { doc: EN, page: '5, 6' },
        { doc: TH, page: '5, 6' },
      ],
    },
    {
      id: 'e2-t05',
      q: '“while expediting the disbursement of carry-over budget allocations, particularly for ongoing construction and procurement projects” (อังกฤษ หน้า 9) คำว่า carry-over budget ฉบับไทยใช้คำใด',
      choices: ['งบประมาณรายจ่ายเพิ่มเติม', 'งบลงทุนรัฐวิสาหกิจ', 'งบประมาณรายจ่ายเหลื่อมปี', 'งบประมาณรายจ่ายประจำปี'],
      answer: 2,
      why: 'ฉบับไทยหน้า 8 เขียนว่า “เร่งรัดการเบิกจ่ายงบประมาณรายจ่ายเหลื่อมปี โดยเฉพาะโครงการที่อยู่ระหว่างดำเนินการก่อสร้างและจัดซื้อจัดจ้าง” carry-over คือยกข้ามปี “งบประมาณรายจ่ายประจำปี” ตรงกับ annual budget ซึ่งอยู่ต้นประโยคเดียวกัน “งบลงทุนรัฐวิสาหกิจ” ตรงกับ capital investment budget of state-owned enterprises (หน้า 6) ส่วน “งบประมาณรายจ่ายเพิ่มเติม” ไม่ใช่คำที่ใช้ในประโยคนี้',
      refs: [
        { doc: EN, page: '6, 9' },
        { doc: TH, page: '6, 8' },
      ],
    },
    {
      id: 'e2-t06',
      q: '“Private consumption … is projected to expand by 2.0 percent, decelerating from 2.3-percent growth in 2026, partly reflecting a high base of comparison resulting from government support measures.” (อังกฤษ หน้า 6) วลี a high base of comparison หมายถึงอะไร',
      choices: [
        'ตัวเลขปีที่ใช้เทียบสูง อัตราโตปีถัดไปจึงดูต่ำลง',
        'รัฐบาลจะเพิ่มภาษีที่เก็บจากฐานการบริโภค',
        'การบริโภคภาคเอกชนปี 2570 จะลดลงต่ำกว่าระดับของปี 2569',
        'ฐานรายได้ของเกษตรกรเพิ่มสูงขึ้นจากมาตรการรัฐ',
      ],
      answer: 0,
      why: 'ฉบับไทยหน้า 6 ใช้ “ส่วนหนึ่งเป็นการชะลอลงจากฐานการบริโภคที่สูงอันเนื่องมาจากมาตรการของภาครัฐ” base of comparison คือตัวเลขของช่วงที่นำมาเทียบ คำอธิบายของเรา: เมื่อตัวตั้งปีก่อนสูง การเพิ่มขึ้นปีถัดไปคิดเป็นร้อยละจึงดูน้อยลง “จะลดลงต่ำกว่าระดับของปี 2569” ผิดเพราะยังคาดว่าจะขยายตัวร้อยละ 2.0 แค่ช้าลง ส่วน “รัฐบาลจะเพิ่มภาษีที่เก็บจากฐานการบริโภค” และ “ฐานรายได้ของเกษตรกรเพิ่มสูงขึ้นจากมาตรการรัฐ” ไม่มีในประโยค (ส่วนเดียวกันพูดถึงฐานรายได้นอกภาคเกษตร non-agricultural income bases ไม่ใช่รายได้เกษตรกร)',
      refs: [
        { doc: EN, page: 6 },
        { doc: TH, page: 6 },
      ],
    },
    {
      id: 'e2-t07',
      q: '“maintaining sufficient fiscal space to accommodate future economic uncertainties … by establishing a clear fiscal consolidation path and maintaining public debt at a sustainable level” (อังกฤษ หน้า 9) fiscal space ในบริบทนี้ใกล้เคียงกับข้อใดที่สุด',
      choices: [
        'อาคารสำนักงานของกระทรวงการคลัง',
        'ความสามารถทางการคลังที่ยังเหลือไว้รับมือเหตุไม่คาดคิด',
        'เวลาที่เหลือก่อนสิ้นปีงบประมาณ',
        'วงเงินกู้ตามพระราชกำหนดที่รัฐบาลกู้และใช้จ่ายไปแล้วทั้งหมด',
      ],
      answer: 1,
      why: 'ประโยคบอกว่าต้องรักษา fiscal space ให้พอ “to accommodate future economic uncertainties” โดยลดการขาดดุลและรักษาหนี้สาธารณะให้ยั่งยืน จึงหมายถึงความสามารถทางการคลังที่เหลือไว้รองรับ ฉบับไทยหน้า 9 ใช้ “พื้นที่ทางการคลัง” “อาคารสำนักงาน” แปล space ตามตัวอักษร “เวลาที่เหลือก่อนสิ้นปีงบประมาณ” ไม่เกี่ยวกับการรองรับความไม่แน่นอน และ “วงเงินกู้ตามพระราชกำหนดที่รัฐบาลกู้และใช้จ่ายไปแล้วทั้งหมด” ตรงข้ามกับคำว่าเหลือพอ',
      refs: [
        { doc: EN, page: 9 },
        { doc: TH, page: 9 },
      ],
    },
    {
      id: 'e2-t08',
      q: 'เอกสารฉบับอังกฤษมีสองประโยค (1) “The current account returned to a surplus of 1.4 billion US dollars” (หน้า 5) และ (2) “the current account balance is expected to record a surplus equivalent to 1.4 percent of GDP” (หน้า 6 ส่วนแนวโน้มปี 2027) ข้อใดถูกต้อง',
      choices: [
        'ทั้งสองประโยคเป็นตัวเลขเดียวกันที่เขียนต่างหน่วย',
        'ประโยค (1) เป็นประมาณการ ส่วนประโยค (2) เกิดขึ้นแล้ว',
        'ทั้งสองประโยคเป็นประมาณการของปี 2570',
        'ประโยค (1) เป็นยอดเงินที่เกิดขึ้นแล้ว ส่วนประโยค (2) เป็นสัดส่วนที่คาดการณ์',
      ],
      answer: 3,
      why: 'ประโยค (1) อยู่ในส่วนเสถียรภาพของไตรมาสที่สาม ปี 2569 ใช้กริยาอดีต returned และหน่วยพันล้านดอลลาร์ ฉบับไทยหน้า 5 ใช้ “กลับมาเกินดุล 1.4 พันล้านดอลลาร์ สรอ.” ประโยค (2) ใช้ expected และหน่วยร้อยละของ GDP ฉบับไทยหน้า 6 ใช้ “เกินดุลร้อยละ 1.4 ของ GDP” สำหรับปี 2570 “ตัวเลขเดียวกันต่างหน่วย” ผิดเพราะคนละช่วงเวลา ตารางที่ 3 หน้า 11 ให้ดุลบัญชีเดินสะพัดปี 2570 เท่ากับ 8.3 พันล้านดอลลาร์ ไม่ใช่ 1.4 “ประโยค (1) เป็นประมาณการ ส่วนประโยค (2) เกิดขึ้นแล้ว” สลับกัน และ “ทั้งสองประโยคเป็นประมาณการของปี 2570” ผิดเพราะประโยค (1) เป็นข้อมูลไตรมาสที่สาม ปี 2569 ที่เกิดขึ้นแล้ว',
      refs: [
        { doc: EN, page: '5, 6, 11' },
        { doc: TH, page: '5, 6, 11' },
      ],
    },
    {
      id: 'e2-t09',
      q: 'อ่านส่วน Construction sector (อังกฤษ หน้า 5): “Construction sector expanded by 0.1 percent, decelerating from a 0.3-percent growth… (1) Public construction, which increased by 0.6 percent… (2) Private construction, which declined by 0.5 percent… other construction increased for the fifth consecutive quarter by 3.0 percent” ข้อใด “ลดลง” (ติดลบ) ในไตรมาสที่สาม',
      choices: ['Construction sector', 'Private construction', 'Public construction', 'Other construction'],
      answer: 1,
      why: 'คำบอกทิศทางลบในข้อความมีคำเดียวคือ declined ซึ่งใช้กับ “Private construction” (−0.5) ฉบับไทยหน้า 5 ใช้ “การก่อสร้างภาคเอกชน ลดลงครั้งแรกในรอบ 4 ไตรมาส ร้อยละ 0.5” “Construction sector” แค่ decelerating แต่ยังขยายตัว 0.1 ฉบับไทยใช้ “ชะลอตัวลง” ส่วน “Public construction” (+0.6) และ “Other construction” (+3.0) เพิ่มขึ้น',
      refs: [
        { doc: EN, page: 5 },
        { doc: TH, page: 5 },
      ],
    },
    {
      id: 'e2-t10',
      q: '“Export value of goods… is projected to expand by 8.6 percent… amid continued uncertainty over trade-restrictive measures.” (อังกฤษ หน้า 7) คู่คำใดตรงกับคำไทยที่ฉบับไทยใช้ในประโยคเดียวกัน',
      choices: [
        'uncertainty = ความเสี่ยง, trade-restrictive measures = มาตรการกีดกันทางการค้า',
        'uncertainty = ความไม่แน่นอน, trade-restrictive measures = ความตกลงการค้าเสรี',
        'uncertainty = ความไม่แน่นอน, trade-restrictive measures = มาตรการกีดกันทางการค้า',
        'uncertainty = ความผันผวน, trade-restrictive measures = มาตรการส่งเสริมการส่งออกสินค้า',
      ],
      answer: 2,
      why: 'ฉบับไทยหน้า 6 เขียนว่า “ท่ามกลางความไม่แน่นอนของมาตรการกีดกันทางการค้า” uncertainty คือ “ความไม่แน่นอน” ส่วน “ความเสี่ยง” ตรงกับ risks ในหัวข้อนโยบายหน้า 7 “ความตกลงการค้าเสรี” ตรงกับ free trade agreements ซึ่งเป็นทางแก้ ไม่ใช่ตัวปัญหา ส่วน “ความผันผวน” ตรงกับ volatility และ restrictive แปลว่ากีดกัน ไม่ใช่ส่งเสริม',
      refs: [
        { doc: EN, page: '7, 8' },
        { doc: TH, page: '6, 7, 8' },
      ],
    },
  ],

  sources: [
    { doc: EN, page: '1, 2, 5–11' },
    { doc: TH, page: '1, 2, 5–11' },
    { doc: 'nesdc-recruitment-2569', page: 5 },
  ],
};

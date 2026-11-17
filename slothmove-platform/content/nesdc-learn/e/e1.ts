import type { Lesson } from '@/lib/nesdc-learn/types';

// E1 · ไวยากรณ์ที่ออกบ่อย. Grammar rules are general knowledge (no official document states them): those blocks are
// plain: true and labelled "ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ" once in section 1. No official English text is in the
// library yet, so every English sentence here is our own ("ประโยคตัวอย่างที่เราแต่ง"); where a sentence carries a real
// figure, the figure comes from the Thai release econ-press-q3-2569 (released 16 พ.ย. 2569; printed page = PDF page):
// Q3/2569 GDP 2.9 (from 2.4 in Q2), private investment 16.2 highest in 55 quarters, 9-month private consumption 2.5 (p.1);
// 9-month total investment 10.4 (p.2); 2569 forecast 2.5, 2570 range 2.0–3.0 (p.5); 2570 private investment 7.9
// slowing from 14.1 in 2569 (p.6). Years: 2569 = 2026, 2570 = 2027.
// Disputed usage (collective nouns, singular/plural "data", which vs that in defining clauses) is taught but never the
// sole point an MCQ turns on.

const AS_OF = 'ข้อมูล ณ 16 พ.ย. 2569 (ไตรมาสที่ 3/2569)';
const P1 = { doc: 'econ-press-q3-2569', page: 1 };
const P5 = { doc: 'econ-press-q3-2569', page: 5 };
const P6 = { doc: 'econ-press-q3-2569', page: 6 };

export const lesson: Lesson = {
  id: 'e1',
  topic: 'e',
  order: 1,
  title: 'ไวยากรณ์ที่ออกบ่อย',
  lead: 'ภาษาอังกฤษในรายงานเศรษฐกิจและนโยบายใช้ไวยากรณ์ซ้ำ ๆ ไม่กี่เรื่อง บทนี้พาเลือก tense จากช่วงเวลาที่รายงานพูดถึง ใช้ passive ให้ถูก จับคู่ประโยค if ทั้งสี่แบบ หาประธานตัวจริงก่อนผันกริยา ใช้ which/that/who กับเครื่องหมายจุลภาคให้ถูก แล้วรวมทั้งหมดเป็นวิธีหาที่ผิดในประโยคทีละขั้น',
  minutes: 20,
  jumps: [
    ['why', 'ทำไม'],
    ['story', 'tense'],
    ['parts', 'ไวยากรณ์'],
    ['exam', 'ข้อสอบ'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · ทำไมต้องรู้เรื่องนี้',
      title: 'ประโยครายงานภาษาอังกฤษ ผิดหนึ่งคำ ความหมายเปลี่ยน',
      plain: true,
      body: [
        'นักวิเคราะห์นโยบายและแผนต้องอ่านรายงานภาษาอังกฤษขององค์การระหว่างประเทศ และบางครั้งต้องเขียนสรุปเป็นภาษาอังกฤษด้วย ในงานแบบนี้ไวยากรณ์ไม่ใช่เรื่องความสวยงาม แต่เป็นเรื่อง**ความหมาย** เช่น “expanded” บอกว่าเกิดขึ้นแล้ว ส่วน “is projected to expand” บอกว่าเป็นแค่การคาดการณ์ ถ้าอ่านสลับกัน สรุปก็ผิดทั้งย่อหน้า',
        'ข่าวดีคือภาษาของรายงานใช้ไวยากรณ์ซ้ำเดิมไม่กี่เรื่อง ถ้าเข้าใจว่าแต่ละกฎมีไว้บอกอะไร เราจะเลือกคำตอบได้ด้วยเหตุผล โดยไม่ต้องท่องเป็นร้อยข้อ',
      ],
      blocks: [
        {
          type: 'note',
          title: 'ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ',
          plain: true,
          body: 'กฎไวยากรณ์ในบทนี้เป็น**ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ** ตามที่สอนกันในการเตรียมสอบราชการ ไม่มีเอกสารราชการฉบับใดกำหนดไว้ ประโยคภาษาอังกฤษทุกประโยคในบทนี้เป็น**ประโยคตัวอย่างที่เราแต่ง** ถ้าประโยคใดมีตัวเลขจริง ตัวเลขนั้นมาจากเอกสารแถลงข่าวภาวะเศรษฐกิจไทยไตรมาสที่ 3/2569 ของ สศช. (ฉบับภาษาไทย) และระบุหน้าไว้ ปีในประโยคภาษาอังกฤษเป็น ค.ศ. คือ 2026 = พ.ศ. 2569 และ 2027 = พ.ศ. 2570',
        },
        {
          type: 'note',
          title: 'โจทย์ที่มักเจอ',
          plain: true,
          body: 'โจทย์ไวยากรณ์มีสองรูปแบบหลัก แบบแรกคือ**เติมคำในช่องว่าง** เช่น เลือกรูปกริยาให้ตรงกับช่วงเวลา หรือเลือก which/who/whose แบบที่สองคือ**หาที่ผิด** ประโยคหนึ่งถูกแบ่งเป็นสี่ส่วน ให้เลือกส่วนที่ผิด ตัวเลือกผิดมักเป็นรูปที่ “ฟังคุ้นหู” แต่ขัดกับคำบอกเวลา ขัดกับประธานตัวจริง หรือใช้ passive กับกริยาที่ไม่มีกรรม',
        },
      ],
    },

    // 2 · story: tenses on a timeline
    {
      type: 'section',
      anchor: 'story',
      eyebrow: '2 · เลือก tense จากเส้นเวลาของรายงาน',
      title: 'ยืนอยู่ที่วันแถลง แล้วถามว่าช่วงเวลานั้นจบหรือยัง',
      body: [
        'ลองนึกภาพนักเขียนรายงานยืนอยู่ ณ วันแถลงข่าว 16 พ.ย. 2569 ช่วงเวลาที่จบไปแล้ว เช่น ไตรมาส 3 (ก.ค.–ก.ย.) ใช้ past simple ช่วงที่เริ่มในอดีตแต่ยังไม่ปิด เช่น “ปีนี้” ใช้ present perfect สิ่งที่เป็นจริงในวันแถลง เช่น “รายงานนี้แสดงว่า” ใช้ present simple ส่วนช่วงที่ยังมาไม่ถึง ใช้ will หรือ is projected/expected to',
        'เส้นเวลาข้างล่างเรียงจากอดีตไปอนาคต ประโยคทุกประโยคเป็นประโยคตัวอย่างที่เราแต่ง ส่วนตัวเลขมาจากเอกสารแถลงข่าวฉบับภาษาไทย',
      ],
      refs: [P1, P5],
      blocks: [
        {
          type: 'timeline',
          title: 'Tense ตามช่วงเวลา เมื่อยืนอยู่ ณ วันแถลง 16 พ.ย. 2569',
          items: [
            {
              when: 'ก.ค.–ก.ย. 2569',
              label: 'ไตรมาส 3 จบแล้ว → past simple',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “The Thai economy **expanded** by 2.9 percent in the third quarter of 2026, up from 2.4 percent in the second quarter.” ช่วงเวลาปิดไปแล้วและระบุชัด จึงใช้กริยาช่องที่ 2',
            },
            {
              when: 'ม.ค.–ก.ย. 2569',
              label: '9 เดือนแรก จบแล้ว → past simple',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “In the first nine months of 2026, private consumption **grew** by 2.5 percent.” แม้ปียังไม่จบ แต่ “เก้าเดือนแรก” เป็นช่วงที่ปิดแล้ว',
            },
            {
              when: 'ต้นปี → วันนี้',
              label: 'ช่วงที่ยังไม่ปิด → present perfect',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “So far this year, total investment **has grown** faster than private consumption.” (เก้าเดือนแรก การลงทุนรวมโต 10.4 การบริโภคภาคเอกชนโต 2.5) คำว่า so far this year บอกว่าช่วงนี้ยังเปิดอยู่ถึงวันพูด',
            },
            {
              when: '16 พ.ย. 2569',
              label: 'วันแถลง → present simple',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “The press release **shows** that exports accelerated.” ตัวเอกสารพูดอยู่ ณ วันนี้จึงใช้ shows แต่สิ่งที่มันรายงานจบไปแล้วจึงใช้ accelerated สองกริยาในประโยคเดียวคนละ tense ได้ เพราะพูดถึงคนละเวลา',
              now: true,
            },
            {
              when: 'ทั้งปี 2569',
              label: 'ปียังไม่จบ → คาดการณ์',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “The economy **is projected to expand** by 2.5 percent in 2026.” ทั้งปียังไม่ปิด ตัวเลขทั้งปีจึงยังเป็นประมาณการ ไม่ใช่ผลจริง',
            },
            {
              when: 'ปี 2570',
              label: 'อนาคต → will / is projected to',
              desc: 'ประโยคตัวอย่างที่เราแต่ง: “GDP **is projected to grow** in the range of 2.0–3.0 percent in 2027.” หรือ “NESDC projects that GDP **will grow** …” หลัง to ที่เป็น infinitive (be projected/expected to) ใช้กริยาช่องที่ 1 แต่ถ้า to เป็นคำบุพบท เช่น look forward to, be committed to, contribute to ให้ตามด้วย V-ing เช่น The government is committed to reducing household debt.',
            },
          ],
          refs: [P1, { doc: 'econ-press-q3-2569', page: 2 }, P5],
        },
        { type: 'asOf', date: AS_OF, note: 'ตัวเลขในประโยคตัวอย่าง: GDP ไตรมาส 3/2569 ขยายตัวร้อยละ 2.9 จากร้อยละ 2.4 ในไตรมาสที่สอง และการบริโภคภาคเอกชนเก้าเดือนแรกร้อยละ 2.5 (หน้า 1) การลงทุนรวมเก้าเดือนแรกร้อยละ 10.4 (หน้า 2) ประมาณการปี 2569 ร้อยละ 2.5 และปี 2570 ช่วงร้อยละ 2.0–3.0 (หน้า 5) ประมาณการอาจถูกปรับในการแถลงครั้งถัดไป' },
        {
          type: 'list',
          title: 'สี่รูปที่ใช้บ่อยที่สุดในรายงาน และคำบอกเวลาที่มากับมัน',
          plain: true,
          items: [
            {
              name: 'Past simple (V2): in 2025, in the third quarter, last year, ago',
              desc: 'ใช้กับช่วงที่จบแล้วและระบุชัด รายงานผลไตรมาสหรือปีที่ผ่านมาจึงเต็มไปด้วย expanded, grew, rose, fell, accelerated กฎที่ข้อสอบชอบ: คำบอกเวลาอดีตที่เจาะจง เช่น in 2025 หรือ last quarter **ใช้กับ present perfect ไม่ได้** แต่อย่าสับสนกับ in/over the last (past) + ช่วงเวลา เช่น over the past five years ซึ่งลากมาถึงปัจจุบัน จึงมักใช้ (ข้อสอบคาดหวัง) present perfect',
            },
            {
              name: 'Present perfect (has/have + V3): since, for, so far, in/over the last (past) + ช่วงเวลา',
              desc: 'ใช้กับช่วงที่เริ่มในอดีตและยังต่อเนื่องถึงวันพูด มักใช้กับ this year, recently ด้วย (แต่สองคำนี้ใช้ past simple ได้เมื่อพูดถึงเหตุการณ์ที่จบแล้ว เช่น NESDC recently revised its forecast.) in the last three years หรือ over the past decade มักใช้ (ข้อสอบคาดหวัง) present perfect: Over the past five years, household debt has risen. (ถ้าเป็น for + ช่วงที่จบแล้ว เช่น for two years in the 1990s ใช้ past simple) since ตามด้วยจุดเวลา (since 2023) for ตามด้วยระยะเวลา (for three quarters) วิธีจำ: present perfect เชื่อมอดีตกับ “ตอนนี้” จึงไปด้วยกันไม่ได้กับคำที่ปิดช่วงเวลาไปแล้ว',
            },
            {
              name: 'Present simple (V1, V-s): every quarter, generally, ข้อเท็จจริงทั่วไป',
              desc: 'ใช้กับสิ่งที่เป็นจริงทั่วไปหรือทำเป็นประจำ และกับสิ่งที่เอกสารกำลังบอก เช่น The report shows … / The data suggest … ประธานเอกพจน์บุรุษที่ 3 ต้องเติม -s',
            },
            {
              name: 'อนาคตและการคาดการณ์: will + V1, is projected/expected/forecast to + V1',
              desc: 'รายงานเศรษฐกิจนิยมรูป passive **be projected to + V1** เพราะเศรษฐกิจไม่ได้เป็นผู้คาดการณ์เอง ผู้คาดการณ์คือหน่วยงาน ถ้าอยากใช้รูป active ประธานต้องเป็นหน่วยงาน เช่น NESDC projects that GDP will grow … หรือ NESDC projects GDP to grow … ระวัง: กฎ “to + V1” ใช้กับ to ที่เป็น infinitive เท่านั้น ถ้า to เป็นคำบุพบท (look forward to, be committed to, be used to, with a view to) ต้องตามด้วย V-ing',
            },
          ],
        },
        {
          type: 'context',
          title: 'ทำไมคำเดียวกันจึงเปลี่ยนความหมายทั้งประโยค',
          plain: true,
          body: [
            'คำอธิบายของเรา: ภาษาไทยบอกเวลาด้วยคำเติม เช่น “แล้ว” “กำลัง” “จะ” แต่ภาษาอังกฤษบอกเวลาไว้ในรูปกริยาเอง “GDP grew” กับ “GDP is projected to grow” จึงต่างกันระหว่างข้อเท็จจริงที่วัดได้แล้วกับตัวเลขที่ยังอาจถูกปรับ',
            'เวลาอ่านรายงานภาษาอังกฤษ ให้ดูกริยาก่อนตัวเลขเสมอ เพราะกริยาบอกว่าตัวเลขนั้นเป็นผลจริงหรือประมาณการ ซึ่งเป็นเรื่องเดียวกับการแยกข้อเท็จจริงกับการคาดการณ์ในหัวข้อการอ่านรายงาน',
          ],
        },
      ],
    },

    // 3 · parts
    {
      type: 'section',
      anchor: 'parts',
      eyebrow: '3 · ไวยากรณ์สี่เรื่องที่เหลือ',
      title: 'Passive, ประโยค if, ประธานกับกริยา, relative clause',
      plain: true,
      body: [
        'เรื่อง tense คือแกนกลาง ส่วนอีกสี่เรื่องนี้คือจุดที่โจทย์หาที่ผิดชอบซ่อนไว้ ทุกเรื่องมีคำถามประจำตัวหนึ่งข้อ ถ้าถามตัวเองก่อนตอบ จะตัดตัวเลือกได้เกือบทุกครั้ง',
      ],
      blocks: [
        {
          type: 'numbers',
          plain: true,
          rows: [
            {
              n: '1',
              name: 'Passive: ประธานเป็นผู้ทำ หรือผู้ถูกกระทำ',
              desc: 'ถ้าประธานถูกกระทำ ใช้ **be + V3** โดย be เป็นตัวบอก tense: is/are approved, was/were approved, has/have been approved, will be approved, must be approved ผู้กระทำใส่หลัง by ได้ถ้าจำเป็น รายงานทางการใช้ passive บ่อยเมื่อผลงานสำคัญกว่าผู้ทำ เช่น The budget was approved.',
            },
            {
              n: '2',
              name: 'กริยาที่ไม่มีกรรม ทำเป็น passive ไม่ได้',
              desc: 'rise, fall, occur, happen ไม่มีกรรม จึงไม่มีรูป was risen หรือ was happened คู่ที่ต้องแยกให้ออกคือ **rise (ขึ้นเอง ไม่มีกรรม) กับ raise (ยกให้สูงขึ้น ต้องมีกรรม)** Prices rose. แต่ The central bank raised interest rates. และ Interest rates were raised.',
            },
            {
              n: '3',
              name: 'ประธานกับกริยา: ประธานตัวจริงคือคำไหน',
              desc: 'ตัดวลีที่ขยายประธานออกก่อน เช่น of …, with …, as well as …, together with … แล้วผันกริยาตามคำนามหลัก (ยกเว้นคำบอกปริมาณ เช่น a number of, percent of, half of, most of, some of ซึ่งกริยาตามคำนามหลัง of ดูหัวข้อถัดไป) The growth of exports **was** strong. (ประธานคือ growth) ไม่ใช่ตามคำนามที่อยู่ติดกริยา',
            },
            {
              n: '4',
              name: 'Relative clause: ขยายคน สิ่งของ หรือบอกเจ้าของ และมีจุลภาคไหม',
              desc: 'who ขยายคน which ขยายสิ่งของ whose บอกความเป็นเจ้าของและต้องตามด้วยคำนาม that ใช้ได้ทั้งคนและสิ่งของ แต่**ใช้ได้เฉพาะเมื่อไม่มีจุลภาค** ส่วนกริยาใน relative clause ผันตามคำที่มันขยาย',
            },
          ],
        },
        {
          type: 'table',
          title: 'ประโยค if สี่แบบ',
          plain: true,
          rows: [
            ['แบบ · ความหมาย', 'โครงสร้าง', 'ประโยคตัวอย่างที่เราแต่ง'],
            ['0 · ความจริงทั่วไป', 'If + V1, V1', 'If demand rises, prices go up.'],
            ['1 · เป็นไปได้ในอนาคต', 'If + V1, will + V1', 'If exports grow, GDP will expand.'],
            ['2 · สมมุติขัดกับปัจจุบัน', 'If + V2 (were), would + V1', 'If oil were cheaper, inflation would fall.'],
            ['3 · สมมุติขัดกับอดีต', 'If + had V3, would have V3', 'If the bill had passed, spending would have risen.'],
          ],
          highlightCol: 1,
          after: 'อ่านจากซ้ายไปขวา: แบบ 0 คือกลไกที่เกิดทุกครั้ง แบบ 1 คือเงื่อนไขที่เกิดได้จริง แบบ 2 คือสมมุติสิ่งที่ไม่ตรงกับตอนนี้ แบบ 3 คือสมมุติย้อนอดีตซึ่งเปลี่ยนไม่ได้แล้ว กฎที่โจทย์ชอบ: ในส่วน if ของแบบ 1 **ไม่ใช้ will** แม้จะพูดถึงอนาคต (ยกเว้น will ที่แปลว่า “ยินดี/เต็มใจ”) แบบ 2 ภาษาทางการใช้ **were กับทุกประธาน** (ภาษาพูดอาจได้ยิน was) และแบบ 3 ส่วน if ใช้ had + V3 **ไม่ใช่ would have** ส่วน unless แปลว่า if … not จึงตามด้วยรูปเดียวกับ if เช่น Unless the budget is approved, the project will be delayed.',
        },
        {
          type: 'list',
          title: 'ประธานกับกริยา: กรณีที่ต้องรู้',
          plain: true,
          items: [
            {
              name: 'The number of + นามพหูพจน์ → กริยาเอกพจน์',
              desc: 'ประธานคือ “จำนวน” ซึ่งมีหนึ่งค่า The number of tourists **has** increased. ส่วน **A number of** แปลว่า “หลาย” ประธานจริงคือคำนามข้างหลัง A number of agencies **have** revised their targets.',
            },
            {
              name: 'Percent of / half of / most of → ดูคำนามหลัง of',
              desc: 'ถ้าคำนามหลัง of นับไม่ได้หรือเป็นเอกพจน์ ใช้กริยาเอกพจน์ Thirty percent of the budget **is** spent on salaries. ถ้าเป็นพหูพจน์ ใช้กริยาพหูพจน์ Thirty percent of households **are** in debt.',
            },
            {
              name: 'Each, every, either, neither (เมื่อไม่ได้ใช้คู่กับ or/nor) → เอกพจน์',
              desc: 'Each of the ministries **is** required to report. ส่วน either … or / neither … nor ให้กริยาตาม**ประธานตัวที่อยู่ใกล้กริยา** Neither the ministry nor its agencies **have** replied.',
            },
            {
              name: 'นามนับไม่ได้ และประธานที่เป็นกริยา -ing → เอกพจน์',
              desc: 'information, equipment, advice, progress เป็นนามนับไม่ได้ ใช้กริยาเอกพจน์ และไม่เติม s Reducing household debt **is** a priority. ประธานที่เป็นการกระทำหนึ่งอย่างใช้กริยาเอกพจน์',
            },
            {
              name: 'นามกลุ่ม (committee, government, Cabinet) และคำว่า data',
              desc: 'นามกลุ่มที่ทำหน้าที่เป็นหน่วยเดียว ใช้กริยาเอกพจน์ปลอดภัยที่สุด The committee **has** approved the plan. (ภาษาอังกฤษแบบบริติชอาจใช้พหูพจน์เมื่อมองเป็นสมาชิกหลายคน) ส่วน data เดิมเป็นพหูพจน์ แต่ปัจจุบันใช้แบบนามนับไม่ได้ด้วย ทั้ง The data show และ The data shows พบได้ในรายงานทางการ สิ่งที่ต้องทำคือใช้ให้**สม่ำเสมอ** these data show หรือ this data shows',
            },
          ],
        },
        {
          type: 'table',
          title: 'Relative clause: มีจุลภาคกับไม่มีจุลภาค',
          plain: true,
          rows: [
            ['', 'ไม่มีจุลภาค (defining)', 'มีจุลภาค (non-defining)'],
            ['หน้าที่', 'ระบุว่าหมายถึงตัวไหน', 'ให้ข้อมูลเพิ่ม'],
            ['ตัดออกได้ไหม', 'ไม่ได้ ความหมายเปลี่ยน', 'ได้ ประโยคยังครบ'],
            ['ใช้ that ได้ไหม', 'ได้', 'ไม่ได้ ใช้ which/who'],
            ['ตัวอย่าง', 'The projects that were delayed …', 'The plan, which runs to 2027, …'],
          ],
          highlightCol: 2,
          after: 'ประโยคตัวอย่างที่เราแต่ง: “The provinces which were hit by floods will receive funds.” ไม่มีจุลภาค จึงหมายถึง**เฉพาะ**จังหวัดที่ถูกน้ำท่วม ส่วน “The provinces, which were hit by floods, will receive funds.” มีจุลภาค จึงบอกว่าจังหวัดทั้งหมดที่กำลังพูดถึงถูกน้ำท่วม และทั้งหมดได้เงิน จุลภาคคู่เดียวเปลี่ยนว่าใครได้งบ หลังคำบุพบทใช้ which/whom ไม่ใช้ that เช่น the year in which … ส่วนแบบไม่มีจุลภาคใช้ which ได้เช่นกัน (พบมากในแบบบริติช) แบบอเมริกันนิยม that',
        },
        {
          type: 'explorer',
          title: 'แตะหัวข้อ ดูกฎ และกับดักคลาสสิก',
          intro: 'ทุกประโยคภาษาอังกฤษเป็นประโยคตัวอย่างที่เราแต่ง เครื่องหมาย ✗ คือรูปที่ผิด',
          initial: 'g1',
          plain: true,
          groups: [
            {
              tag: 'Tense',
              name: 'ช่วงเวลาจบแล้ว ยังไม่จบ หรือยังมาไม่ถึง',
              idea: 'หาคำบอกเวลาก่อน แล้วถามว่าช่วงนั้นปิดหรือยัง',
              items: [
                {
                  key: 'g1',
                  label: '1',
                  full: 'Past simple กับช่วงที่จบแล้ว',
                  meaning: 'กฎ: in 2025, in the third quarter, last year, two years ago ใช้ V2 กับดักคลาสสิก: ✗ GDP has expanded by 2.9 percent in the third quarter. คำว่า in the third quarter ปิดช่วงไปแล้ว จึงต้องเป็น GDP expanded … ข้อยกเว้นที่ต้องรู้: in/over the last (past) three years ลากมาถึงปัจจุบัน มักใช้ (ข้อสอบคาดหวัง) present perfect เช่น Over the past five years, household debt has risen.',
                },
                {
                  key: 'g2',
                  label: '2',
                  full: 'Present perfect กับ since / for / so far / over the past …',
                  meaning: 'กฎ: ช่วงที่เริ่มในอดีตและยังไม่ปิด ใช้ has/have + V3 กับดักคลาสสิก: ✗ Inflation remained low since 2024. คำว่า since ลากเวลามาถึงวันนี้ จึงต้องเป็น Inflation has remained low since 2024.',
                },
                {
                  key: 'g3',
                  label: '3',
                  full: 'Be projected / expected to + V1',
                  meaning: 'กฎ: การคาดการณ์ใช้ is projected to + กริยาช่องที่ 1 กับดักคลาสสิก: ✗ GDP projects to grow (GDP ไม่ได้คาดการณ์เอง) และ ✗ GDP is projected to grew (หลัง to ที่เป็น infinitive ต้องเป็นช่องที่ 1) รูปที่ถูกคือ GDP is projected to grow … แต่ถ้า to เป็นคำบุพบท ต้องใช้ V-ing: ✗ The ministry is committed to reduce debt. ต้องเป็น is committed to reducing debt (เช่นเดียวกับ look forward to, contribute to)',
                },
              ],
            },
            {
              tag: 'Passive',
              name: 'ประธานเป็นผู้ถูกกระทำ',
              idea: 'be บอก tense ส่วน V3 บอกว่าถูกกระทำ',
              items: [
                {
                  key: 'g4',
                  label: '4',
                  full: 'be + V3 ตาม tense',
                  meaning: 'กฎ: will be submitted, has been approved, must be disbursed กับดักคลาสสิก: ✗ The draft bill will submit to the House next month. ร่างกฎหมายไม่ได้ยื่นเอง ต้องเป็น will be submitted และ ✗ The report was wrote ต้องเป็น was written',
                },
                {
                  key: 'g5',
                  label: '5',
                  full: 'rise / raise และกริยาไม่มีกรรม',
                  meaning: 'กฎ: rise, fall, occur, happen ไม่มีกรรมจึงไม่มีรูป passive กับดักคลาสสิก: ✗ Prices were risen sharply. ต้องเป็น Prices rose sharply. ถ้าอยากใช้ passive ต้องเปลี่ยนเป็น raise: Interest rates were raised.',
                },
              ],
            },
            {
              tag: 'If',
              name: 'จับคู่สองส่วนของประโยคเงื่อนไข',
              idea: 'ดูส่วนผลก่อน (will / would / would have) แล้วเติมส่วน if ให้เข้าคู่',
              items: [
                {
                  key: 'g6',
                  label: '6',
                  full: 'แบบ 1: ไม่ใช้ will ในส่วน if',
                  meaning: 'กฎ: If + V1, will + V1 กับดักคลาสสิก: ✗ If exports will grow next year, GDP will expand. ต้องเป็น If exports grow … แม้จะพูดถึงปีหน้า (ยกเว้น will ที่แปลว่า “ยินดี/เต็มใจ”) unless ก็เช่นกัน ✗ Unless the government will act … ต้องเป็น Unless the government acts …',
                },
                {
                  key: 'g7',
                  label: '7',
                  full: 'แบบ 2: were กับทุกประธาน',
                  meaning: 'กฎ: If + V2 (be ใช้ were), would + V1 กับดักคลาสสิก: ✗ If oil would be cheaper, inflation would fall. ส่วน if ไม่ใช้ would (ยกเว้น would เชิงขอร้อง/เต็มใจ เช่น If you would follow me …) ต้องเป็น If oil were cheaper … และในข้อสอบ If I were … ถือเป็นรูปมาตรฐาน',
                },
                {
                  key: 'g8',
                  label: '8',
                  full: 'แบบ 3: had + V3 คู่กับ would have + V3',
                  meaning: 'กฎ: สมมุติย้อนอดีต กับดักคลาสสิก: ✗ If the budget would have been approved earlier, the project would have started. ส่วน if ต้องเป็น had been approved รูปทางการกลับประโยคได้เป็น Had the budget been approved earlier, …',
                },
              ],
            },
            {
              tag: 'ประธาน',
              name: 'หาประธานตัวจริงก่อนผันกริยา',
              idea: 'ตัดวลีขยายออก แล้วดูว่าคำนามหลักเป็นเอกพจน์หรือพหูพจน์ (ยกเว้นคำบอกปริมาณ เช่น a number of, percent of, half of, most of, some of)',
              items: [
                {
                  key: 'g9',
                  label: '9',
                  full: 'The number of / A number of',
                  meaning: 'กฎ: The number of … ใช้กริยาเอกพจน์ A number of … ใช้กริยาพหูพจน์ กับดักคลาสสิก: ✗ The number of households in debt have risen. ประธานคือ number จึงต้องเป็น has risen',
                },
                {
                  key: 'g10',
                  label: '10',
                  full: 'วลีขยายระหว่างประธานกับกริยา',
                  meaning: 'กฎ: of …, with …, as well as …, together with … ไม่เปลี่ยนประธาน กับดักคลาสสิก: ✗ The minister, together with senior officials, are visiting the province. ประธานคือ minister จึงต้องเป็น is visiting',
                },
              ],
            },
            {
              tag: 'Relative',
              name: 'who / which / that / whose และจุลภาค',
              idea: 'ถามว่าขยายคนหรือสิ่งของ แล้วดูว่ามีจุลภาคไหม',
              items: [
                {
                  key: 'g11',
                  label: '11',
                  full: 'relative clause ที่มีจุลภาค ห้ามใช้ that',
                  meaning: 'กฎ: relative clause ที่มีจุลภาคใช้ which (สิ่งของ) หรือ who (คน) กับดักคลาสสิก: ✗ The master plan, that was approved last year, focuses on regions. ต้องเป็น , which was approved …',
                },
                {
                  key: 'g12',
                  label: '12',
                  full: 'กริยาใน relative clause ผันตามคำที่ขยาย',
                  meaning: 'กฎ: that/which/who ไม่มีพจน์ของตัวเอง ต้องดูคำนามข้างหน้า กับดักคลาสสิก: ✗ Projects that has been approved … คำว่า that แทน projects (พหูพจน์) จึงต้องเป็น have been approved',
                },
                {
                  key: 'g13',
                  label: '13',
                  full: 'whose + คำนาม',
                  meaning: 'กฎ: whose บอกความเป็นเจ้าของ ใช้ได้ทั้งคนและสิ่งของ และต้องมีคำนามตามหลัง กับดักคลาสสิก: ✗ The agency who budget was cut … ต้องเป็น The agency whose budget was cut … และอย่าสับสนกับ who’s (= who is)',
                },
              ],
            },
          ],
        },
      ],
    },

    // 4 · exam
    {
      type: 'section',
      anchor: 'exam',
      eyebrow: '4 · ข้อสอบถามแบบนี้ คิดแบบนี้',
      title: 'หาที่ผิดทีละชั้น: กริยาแท้ → ประธาน → เวลา → passive → รูปกริยาหลัง to/modal → relative',
      plain: true,
      body: [
        'แนวปฏิบัติทั่วไปในการหาที่ผิด: หากริยาแท้ของประโยคให้เจอก่อน แล้วตรวจห้าคำถามตามลำดับ คือ ประธานตัวจริงเป็นเอกพจน์หรือพหูพจน์ คำบอกเวลาเข้ากับ tense ไหม ประธานเป็นผู้ทำหรือผู้ถูกกระทำ รูปกริยาหลัง to หรือ modal ถูกไหม (หลัง modal และ to ที่เป็น infinitive ใช้ช่องที่ 1 แต่หลัง to ที่เป็นคำบุพบท เช่น look forward to, be committed to ใช้ V-ing) และ which/who/that กับจุลภาคเข้าคู่กันไหม',
      ],
      blocks: [
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “Merchandise exports, which has expanded strongly this year, are expected to slow in 2027.” ส่วนใดผิด ระหว่าง “which has expanded” “this year” “are expected” และ “to slow”',
          steps: [
            'หากริยาแท้ของประโยค: ตัดส่วนในจุลภาคออก เหลือ Merchandise exports … are expected to slow ประธานคือ exports (พหูพจน์) กับ are จึงเข้ากัน และ to ในที่นี้เป็น infinitive (be expected to) ตามด้วย slow ซึ่งเป็นช่องที่ 1 ถูกแล้ว',
            'ดูคำบอกเวลา: this year เป็นช่วงที่ยังไม่ปิด จึงใช้ present perfect ได้ ส่วน in 2027 เป็นอนาคต จึงใช้ are expected to ได้',
            'ดู relative clause: which ขยาย exports ซึ่งเป็นพหูพจน์ กริยาข้างในจึงต้องเป็น have expanded ไม่ใช่ has expanded',
          ],
          answer: '“which has expanded” ผิด ต้องเป็น which have expanded เพราะ which แทนคำว่า exports ที่เป็นพหูพจน์',
          trap: 'คนส่วนใหญ่มองว่า which ดูเป็นเอกพจน์ หรือคิดว่ามันขยายคำว่า “Merchandise” ทั้งที่ which ขยาย exports ซึ่งเป็นพหูพจน์ which ไม่มีพจน์ของตัวเอง ต้องย้อนไปดูคำที่มันขยาย อีกกับดักคือคิดว่า “this year” ต้องคู่กับ past simple ทั้งที่ปียังไม่จบ',
          refs: [P6],
        },
        {
          type: 'reasoning',
          question: 'ประโยคตัวอย่างที่เราแต่งจากตัวเลขของ สศช.: “Private investment ___ to expand by 7.9 percent in 2027, slowing from 14.1 percent in 2026.” เติมคำใด ระหว่าง “expects” “is expected” “is expecting” และ “has expected”',
          steps: [
            'ใครเป็นผู้คาดการณ์: ไม่ใช่การลงทุนภาคเอกชน แต่เป็นหน่วยงานที่ทำประมาณการ ประธานจึงเป็นผู้ถูกกระทำ ต้องใช้ passive (be + V3)',
            'เวลา: ปี 2027 ยังมาไม่ถึง ณ วันแถลง การคาดการณ์ที่ถืออยู่ ณ วันนี้ใช้ present จึงได้ is expected',
            'ตรวจคำที่ตามมา: is expected to + expand (ช่องที่ 1) ถูก ส่วน slowing เป็นวลีขยายที่บอกว่าชะลอจากปีก่อน ไม่ต้องแก้',
          ],
          answer: '“is expected” ได้ประโยค Private investment is expected to expand by 7.9 percent in 2027',
          trap: '“expects” และ “is expecting” ทำให้การลงทุนกลายเป็นผู้คาดการณ์เอง ส่วน “has expected” เป็น active เช่นกัน และ present perfect ไม่ใช่รูปของการคาดการณ์ที่ถือ ณ วันนี้',
          refs: [P6],
        },
        { type: 'asOf', date: AS_OF, note: 'ประมาณการการลงทุนภาคเอกชนปี 2570 ร้อยละ 7.9 ชะลอจากร้อยละ 14.1 ในปี 2569 (หน้า 6) เป็นตัวเลขคาดการณ์ ณ วันแถลง อาจถูกปรับภายหลัง' },
      ],
    },

    // mistakes
    {
      type: 'mistakes',
      plain: true,
      items: [
        {
          title: 'ใช้ present perfect กับช่วงเวลาที่จบแล้ว',
          body: 'เกิดเพราะภาษาไทยพูดว่า “เศรษฐกิจได้ขยายตัวแล้วในไตรมาสที่ 3” คำว่า “แล้ว” ชวนให้นึกถึง has expanded วิธีแก้: ดูคำบอกเวลาก่อน in 2025, in the third quarter, last year, last quarter, two years ago เป็นช่วงที่ปิดแล้ว ใช้ V2 แต่ระวัง in the last/past three years หรือ over the past decade เป็นช่วงที่ลากมาถึงปัจจุบัน มักใช้ (ข้อสอบคาดหวัง) present perfect เช่น Over the past five years, household debt has risen. present perfect มักใช้กับ since, for, so far, in/over the last/past + ช่วงเวลา และ this year (this year ใช้ past simple ได้ด้วยถ้าพูดถึงเหตุการณ์ที่จบแล้ว)',
        },
        {
          title: 'ผันกริยาตามคำนามที่อยู่ติดกริยา',
          body: 'เกิดเพราะหูได้ยิน “households have” แล้วคุ้น จึงเขียน The number of households have … วิธีแก้: ตัด of … ออก แล้วถามว่าคำนามหลักคืออะไร ใช้หลักเดียวกันกับ which/that ใน relative clause คือย้อนไปดูคำที่มันขยาย',
        },
        {
          title: 'ใส่ will ในส่วน if หรือหลัง unless',
          body: 'เกิดเพราะเรื่องที่พูดอยู่ในอนาคต จึงคิดว่าต้องมี will ทั้งสองส่วน วิธีแก้: ประโยคแบบ 1 มี will ได้ที่**ส่วนผล**เท่านั้น ส่วน if และ unless ใช้ present simple แทน (ยกเว้น will ที่แปลว่า “ยินดี/เต็มใจ” เช่น If you will wait here …) และแบบ 3 ส่วน if ใช้ had + V3 ไม่ใช่ would have',
        },
        {
          title: 'ใช้ passive กับกริยาที่ไม่มีกรรม หรือใช้ that หลังจุลภาค',
          body: 'เกิดเพราะเห็นว่ารายงานทางการชอบ passive จึงใส่ทุกที่ จนได้ was risen หรือ was happened และเพราะ that กับ which แปลไทยเหมือนกัน วิธีแก้: ถามว่ากริยานั้นมีกรรมได้ไหม (rise ไม่มี raise มี) และถ้ามีจุลภาคนำหน้า ห้ามใช้ that ให้ใช้ which/who (หรือ whom/whose) แทน',
        },
      ],
    },

    // 5 · check
    {
      type: 'asOf',
      date: AS_OF,
      note: 'คำถามเช็กความเข้าใจข้อ 1 และ 2 ใช้ตัวเลขจากเอกสารแถลงข่าวไตรมาสที่ 3/2569: GDP ไตรมาส 3/2569 ร้อยละ 2.9 (หน้า 1) และประมาณการปี 2570 ช่วงร้อยละ 2.0–3.0 (หน้า 5)',
    },
    {
      type: 'check',
      anchor: 'check',
      eyebrow: '5 · เช็กความเข้าใจ',
      title: 'ตอบด้วยเหตุผล ไม่ใช่ความจำ',
      questions: [
        {
          id: 'e1-c1',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The Thai economy ___ by 2.9 percent in the third quarter of 2026, up from 2.4 percent in the second quarter.”',
          choices: ['has expanded', 'expanded', 'was expanded', 'is expanding'],
          answer: 1,
          why: 'in the third quarter of 2026 เป็นช่วงเวลาที่จบแล้วและระบุชัด จึงใช้ past simple คือ “expanded” ส่วน “has expanded” ใช้กับคำบอกเวลาอดีตที่เจาะจงไม่ได้ “was expanded” เป็น passive ซึ่งแปลว่ามีใครไปขยายเศรษฐกิจ ผิดความหมาย และ “is expanding” บอกว่ากำลังเกิดอยู่ ขัดกับไตรมาสที่ปิดไปแล้ว',
          refs: [P1],
        },
        {
          id: 'e1-c2',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Thailand’s GDP ___ to grow in the range of 2.0–3.0 percent in 2027.”',
          choices: ['projects', 'has projected', 'is projected', 'projected'],
          answer: 2,
          why: 'GDP ไม่ได้เป็นผู้คาดการณ์เอง แต่ถูกคาดการณ์ จึงใช้ passive รูปปัจจุบัน “is projected” + to grow “projects” และ “has projected” เป็น active ทำให้ GDP กลายเป็นผู้คาดการณ์ ส่วน “projected” ลำพังไม่มี be จึงไม่เป็นกริยาแท้ของประโยค (ใช้ได้แค่ในพาดหัวข่าวที่ละ is ไว้) หรือถ้าอ่านเป็น active อดีตก็ผิดความหมายเช่นเดียวกัน',
          refs: [P5],
        },
        {
          id: 'e1-c3',
          q: 'ส่วนใดผิดไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง): “Investment projects that has been approved by the Board of Investment are expected to be implemented in 2027.”',
          choices: ['that has been approved', 'by the Board of Investment', 'are expected', 'to be implemented'],
          answer: 0,
          why: 'that แทนคำว่า projects ซึ่งเป็นพหูพจน์ กริยาใน relative clause จึงต้องเป็น “have been approved” ไม่ใช่ has “are expected” ผันตามประธานหลัก Investment projects ถูกแล้ว “to be implemented” เป็น passive หลัง to ที่ถูก เพราะโครงการถูกนำไปดำเนินการ และ “by the Board of Investment” บอกผู้อนุมัติตามรูป passive ปกติ',
          refs: [],
          plain: true,
        },
      ],
    },

    // explain
    {
      type: 'explain',
      plain: true,
      prompt: 'อธิบายให้เพื่อนฟังใน 3 ประโยคว่า ทำไมรายงานเดียวกันจึงเขียนว่า GDP “expanded” ในไตรมาสที่ 3 แต่เขียนว่า GDP “is projected to grow” ในปีหน้า และถ้าเขียนสลับกันจะเกิดอะไรขึ้น',
      model: 'ไตรมาสที่ 3 เป็นช่วงที่จบแล้วและวัดผลได้จริง จึงใช้ past simple คือ expanded ส่วนปีหน้ายังมาไม่ถึง ตัวเลขจึงเป็นเพียงประมาณการของหน่วยงาน และเพราะ GDP ไม่ได้คาดการณ์ตัวเอง จึงใช้ passive is projected to ตามด้วยกริยาช่องที่ 1 ถ้าเขียนสลับกัน ผู้อ่านจะเข้าใจผิดว่าตัวเลขคาดการณ์เป็นผลจริง หรือตัวเลขที่เกิดขึ้นแล้วยังไม่แน่นอน',
    },
  ],

  test: [
    {
      id: 'e1-t01',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Each of the provincial offices ___ required to submit its annual action plan by the end of September.”',
      choices: ['are', 'were', 'have', 'is'],
      answer: 3,
      why: 'ประธานตัวจริงคือ Each ซึ่งเป็นเอกพจน์ ส่วน of the provincial offices เป็นวลีขยาย จึงใช้ “is” (และ its ท้ายประโยคก็เป็นเอกพจน์สอดคล้องกัน) “are” และ “were” เป็นกริยาพหูพจน์ที่ผันตาม offices ส่วน “have” ทำให้ได้ have required ซึ่งเป็น active และผิดพจน์ด้วย',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t02',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The draft budget bill ___ to the House of Representatives next month.”',
      choices: ['will submit', 'submitted', 'will be submitted', 'has submitted'],
      answer: 2,
      why: 'ร่างกฎหมายไม่ได้ยื่นตัวเอง แต่ถูกยื่น จึงใช้ passive และ next month เป็นอนาคต ได้ “will be submitted” ส่วน “will submit” เป็น active ทำให้ร่างกฎหมายเป็นผู้ยื่น “submitted” และ “has submitted” เป็นอดีตและ active ขัดกับ next month',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t03',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Consumer prices ___ sharply last year because of higher energy costs.”',
      choices: ['rose', 'were risen', 'raised', 'have risen'],
      answer: 0,
      why: 'rise เป็นกริยาไม่มีกรรม ราคาขึ้นเอง และ last year เป็นช่วงที่จบแล้ว จึงใช้ “rose” ส่วน “were risen” ทำ passive กับกริยาที่ไม่มีกรรมไม่ได้ “raised” ต้องมีกรรมตามหลัง (raised something) และ “have risen” ใช้กับ last year ไม่ได้',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t04',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “If global demand for electronics ___ strong next year, exports will continue to expand.”',
      choices: ['will remain', 'remains', 'remained', 'had remained'],
      answer: 1,
      why: 'ส่วนผลเป็น will continue จึงเป็นประโยคเงื่อนไขแบบ 1 ส่วน if ใช้ present simple คือ “remains” แม้จะพูดถึงปีหน้า “will remain” ผิดเพราะส่วน if ไม่ใช้ will “remained” เป็นรูปของแบบ 2 ซึ่งต้องคู่กับ would ส่วน “had remained” เป็นรูปของแบบ 3 ซึ่งต้องคู่กับ would have',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t05',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The new master plan, ___ was approved by the Cabinet last year, focuses on regional development.”',
      choices: ['that', 'who', 'whose', 'which'],
      answer: 3,
      why: 'ส่วนที่ขยายอยู่ในจุลภาค (non-defining) และขยายสิ่งของ จึงใช้ “which” ส่วน “that” ใช้หลังจุลภาคไม่ได้ “who” ใช้ขยายคน และ “whose” ต้องตามด้วยคำนาม เช่น whose budget แต่ที่นี่ตามด้วยกริยา was approved',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t06',
      q: 'ส่วนใดผิดไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง): “The number of households with debt problems have risen since 2020, according to the survey.”',
      choices: ['The number of', 'have risen', 'since 2020', 'according to the survey'],
      answer: 1,
      why: 'ประธานตัวจริงคือ number (จำนวน) ซึ่งเป็นเอกพจน์ จึงต้องเป็น has risen ไม่ใช่ “have risen” ถ้าคิดจะแก้ “The number of” เป็น A number of ประโยคจะแปลว่าครัวเรือนเป็นสิ่งที่ “สูงขึ้น” ซึ่งไม่มีความหมาย สิ่งที่สูงขึ้นคือจำนวน “since 2020” คู่กับ present perfect ถูกแล้ว และ “according to the survey” เป็นวลีบอกที่มาที่ถูกต้อง',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t07',
      q: 'ส่วนใดผิดไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง): “Private investment has grown by 16.2 percent in the third quarter of 2026, the highest rate in 55 quarters.”',
      choices: ['has grown', 'by 16.2 percent', 'in 55 quarters', 'the highest rate'],
      answer: 0,
      why: 'in the third quarter of 2026 เป็นช่วงที่จบแล้วและเป็นข้อมูลที่รายงาน จึงต้องใช้ past simple คือ grew แทน “has grown” “by 16.2 percent” ใช้ by บอกขนาดการเปลี่ยนแปลงถูกแล้ว “in 55 quarters” บอกช่วงที่ใช้เทียบ ถูกแล้ว และ “the highest rate” ตรงกับที่ สศช. รายงานว่าการลงทุนภาคเอกชนขยายตัวร้อยละ 16.2 สูงสุดในรอบ 55 ไตรมาส (หน้า 1; ข้อมูล ณ 16 พ.ย. 2569 ไตรมาสที่ 3/2569)',
      refs: [P1],
    },
    {
      id: 'e1-t08',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “If the budget ___ more quickly, the project would have been completed on time.”',
      choices: ['was disbursed', 'would be disbursed', 'had been disbursed', 'has been disbursed'],
      answer: 2,
      why: 'ส่วนผลเป็น would have been completed จึงเป็นการสมมุติย้อนอดีต (แบบ 3) ส่วน if ต้องเป็น had + V3 และงบถูกเบิกจ่ายจึงเป็น passive ได้ “had been disbursed” ส่วน “was disbursed” เป็นรูปของแบบ 2 ซึ่งคู่กับ would + V1 “would be disbursed” ใส่ would ในส่วน if และ “has been disbursed” เป็น present perfect ไม่เข้าคู่กับ would have ในส่วนผล',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t09',
      q: 'เปรียบเทียบสองประโยค (ประโยคตัวอย่างที่เราแต่ง) (1) “The provinces which were hit by the floods will receive emergency funds.” (2) “The provinces, which were hit by the floods, will receive emergency funds.” ข้อใดอธิบายความต่างได้ถูกต้อง',
      choices: [
        'ทั้งสองประโยคความหมายเหมือนกัน ต่างกันแค่เครื่องหมายจุลภาค',
        'ประโยค (1) บอกว่าทุกจังหวัดที่กำลังพูดถึงถูกน้ำท่วมทั้งหมด ส่วนประโยค (2) หมายถึงเฉพาะบางจังหวัดที่ถูกน้ำท่วม',
        'ประโยค (1) ให้เงินเฉพาะจังหวัดที่ถูกน้ำท่วม ส่วน (2) บอกว่าทุกจังหวัดที่พูดถึงถูกน้ำท่วมและได้เงิน',
        'ประโยค (2) ผิดไวยากรณ์ เพราะใช้ which หลังเครื่องหมายจุลภาคไม่ได้',
      ],
      answer: 2,
      why: 'ประโยค (1) ไม่มีจุลภาค ส่วนขยายจึงใช้ระบุว่าหมายถึงจังหวัดไหน คือเฉพาะที่ถูกน้ำท่วม ส่วนประโยค (2) มีจุลภาค ส่วนขยายเป็นข้อมูลเพิ่ม แปลว่าจังหวัดทั้งหมดที่พูดถึงถูกน้ำท่วมและได้เงินทั้งหมด “ความหมายเหมือนกัน” ผิดเพราะจุลภาคเปลี่ยนขอบเขตของผู้ได้เงิน ตัวเลือกที่บอกว่า (1) หมายถึงทุกจังหวัดสลับความหมายของสองประโยค และ “ใช้ which หลังจุลภาคไม่ได้” กลับด้าน คำที่ใช้หลังจุลภาคไม่ได้คือ that',
      refs: [],
      plain: true,
    },
    {
      id: 'e1-t10',
      q: 'ประโยคใดถูกไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง)',
      choices: [
        'Neither the ministry nor its agencies has submitted the report.',
        'The equipment for the new data centers have arrived.',
        'A number of agencies has revised their targets.',
        'Thirty percent of the households in the survey are in debt.',
      ],
      answer: 3,
      why: 'percent of ให้ดูคำนามหลัง of ซึ่งคือ households (พหูพจน์) จึงใช้ are ถูกแล้ว “Neither the ministry nor its agencies has …” ผิด เพราะ neither … nor ให้กริยาตามประธานตัวที่อยู่ใกล้คือ agencies จึงต้องเป็น have “The equipment … have arrived” ผิด เพราะ equipment เป็นนามนับไม่ได้ ต้องเป็น has และ “A number of agencies has …” ผิด เพราะ a number of แปลว่าหลาย ประธานจริงคือ agencies ต้องเป็น have',
      refs: [],
      plain: true,
    },
  ],

  sources: [
    { doc: 'econ-press-q3-2569', page: 1 },
    { doc: 'econ-press-q3-2569', page: 2 },
    { doc: 'econ-press-q3-2569', page: 5 },
    { doc: 'econ-press-q3-2569', page: 6 },
  ],
};

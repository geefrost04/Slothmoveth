import type { Lesson } from '@/lib/learn/types';

// pe1 · Grammar 1: ชนิดของคำ Tense ประธานกับกริยา และ Article (police อก.1 course).
// Grammar rules are general knowledge (no official document states them): every block and MCQ is `plain: true`,
// labelled once "ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ". Only the English question count cites the scope summary.
// Emphasis from the 6 police mock tests (subjectId "english", 90 items): grammar ≈ 36 (Grammar 30 + 6 typed items).
// Within this lesson's scope: tenses 8 (present simple ×2, present continuous, past simple, present perfect,
// past perfect, future perfect, error identification on past vs present perfect) → must; subject–verb agreement 2
// (neither…nor, does/was/has in a "correct sentence" item) → must; word form / pronoun case / countable nouns 3
// (more fluently, us, some information) → must; articles 0 direct items → maybe.
// Passive, relative clauses, gerunds, prepositions, comparison, question tags belong to pe2.
// Reuses the tense/time-marker and agreement rules of content/nesdc-learn/e/e1.ts with simpler sentences.
// Every English sentence is our own (ประโยคตัวอย่างที่เราแต่ง). Tense items carry a time marker that rules out
// every other listed tense; past simple is never offered beside a past-perfect key.

export const lesson: Lesson = {
  id: 'pe1',
  topic: 'pe',
  order: 1,
  priority: 'must',
  title: 'Grammar 1: ชนิดของคำ Tense ประธานกับกริยา และ Article',
  lead: 'ไวยากรณ์พื้นฐานที่ข้อสอบเติมคำชอบถาม เลือกรูปคำให้ตรงตำแหน่ง เลือก tense จากคำบอกเวลา ผันกริยาให้ตรงกับประธานตัวจริง แล้วปิดท้ายด้วย a, an, the และนามนับไม่ได้',
  minutes: 28,
  jumps: [
    ['pos', 'ชนิดคำ'],
    ['tense', 'Tense'],
    ['sva', 'ประธาน'],
    ['article', 'Article'],
    ['check', 'เช็ก'],
  ],
  blocks: [
    // 1 · why
    {
      type: 'section',
      anchor: 'why',
      eyebrow: '1 · บทนี้เรียนอะไร',
      title: 'ข้อเติมคำ ตอบได้ด้วยเบาะแสในประโยค',
      priority: 'must',
      plain: true,
      body: [
        'ข้อไวยากรณ์ส่วนใหญ่เป็นประโยคสั้นหนึ่งประโยคที่มีช่องว่าง ตัวเลือกทั้งสี่มักเป็นคำเดียวกันคนละรูป เช่น check, checks, checked, has checked คำตอบจึงไม่ได้อยู่ที่ความหมาย แต่อยู่ที่**เบาะแส**ในประโยค เช่น คำบอกเวลา ประธาน หรือตำแหน่งของช่องว่าง',
        'บทนี้มี 4 เรื่อง คือ ชนิดของคำกับรูปคำ tense กับคำบอกเวลา ประธานกับกริยา และ article ส่วน modal, passive, ประโยค if, relative clause, คำบุพบท และ question tag อยู่ในบทที่ 2 บทสนทนา คำศัพท์ และการอ่านอยู่ในบทที่ 3 ของหัวข้อนี้',
      ],
      blocks: [
        {
          type: 'note',
          title: 'ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ',
          plain: true,
          body: 'กฎในบทนี้เป็น**ความรู้ทั่วไปด้านไวยากรณ์ภาษาอังกฤษ** ตามที่สอนในระดับมัธยมและการเตรียมสอบราชการ ไม่มีเอกสารราชการกำหนด จึงไม่มีเลขหน้าอ้างอิง ประโยคภาษาอังกฤษทุกประโยคในบทนี้เป็น**ประโยคตัวอย่างที่เราแต่ง** ชื่อคนและหน่วยงานในประโยคเป็นชื่อสมมติ',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          refs: [{ doc: 'police-exam-scope-summary' }],
          body: 'วิชาภาษาอังกฤษมี 15 ข้อ (ตามสรุปขอบเขตจากประกาศ) จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) ข้อไวยากรณ์มีประมาณ 2 ใน 5 ของข้อภาษาอังกฤษ และเรื่องที่พบมากที่สุดคือ **tense** รองลงมาคือรูปคำ สรรพนาม และประธานกับกริยา ส่วน article แทบไม่พบเป็นข้อโดยตรง จึงจัดไว้เป็นส่วนอ่านถ้ามีเวลา',
        },
      ],
    },

    // 2 · parts of speech + word form
    {
      type: 'section',
      anchor: 'pos',
      eyebrow: '2 · ชนิดของคำและรูปคำ',
      title: 'ดูตำแหน่งของช่องว่าง แล้วเลือกชนิดคำที่ตำแหน่งนั้นต้องการ',
      priority: 'must',
      plain: true,
      body: [
        'คำภาษาอังกฤษแบ่งตามหน้าที่ได้ 8 ชนิด (parts of speech) ข้อสอบไม่ค่อยถามชื่อชนิดคำตรง ๆ แต่ชอบให้ตัวเลือกเป็นคำรากเดียวกันคนละชนิด เช่น care, careful, carefully, carefulness แล้วให้เราเลือกตัวที่**เข้ากับตำแหน่ง**',
        'วิธีคิดคือ ดูว่าคำหน้าและคำหลังช่องว่างเป็นอะไร หลัง a/an/the ต้องมีคำนาม (อาจมีคุณศัพท์คั่น) ช่องว่างระหว่าง a/the กับคำนามจึงมักเป็นคุณศัพท์ หลัง be ถ้าบอกลักษณะของประธานใช้คุณศัพท์ ส่วนคำที่ขยายกริยาแท้ต้องเป็นคำกริยาวิเศษณ์',
      ],
      blocks: [
        {
          type: 'table',
          title: 'ชนิดของคำ 8 ชนิด',
          plain: true,
          rows: [
            ['ชนิด', 'หน้าที่', 'ตัวอย่าง'],
            ['Noun คำนาม', 'ชื่อคน สัตว์ สิ่งของ ความคิด', 'officer, report, safety'],
            ['Pronoun สรรพนาม', 'ใช้แทนคำนาม', 'he, them, ours'],
            ['Verb กริยา', 'บอกการกระทำหรือสภาพ', 'check, is, arrive'],
            ['Adjective คุณศัพท์', 'ขยายคำนาม', 'careful, new, safe'],
            ['Adverb กริยาวิเศษณ์', 'ขยายกริยา คุณศัพท์ หรือกริยาวิเศษณ์', 'carefully, very, often'],
            ['Preposition บุพบท', 'บอกความสัมพันธ์ เช่น ที่ เวลา', 'in, on, at, by'],
            ['Conjunction สันธาน', 'เชื่อมคำหรือประโยค', 'and, but, because'],
            ['Interjection อุทาน', 'แสดงอารมณ์', 'Oh! Wow!'],
          ],
          highlightCol: 1,
        },
        {
          type: 'table',
          title: 'ปัจจัยท้ายคำช่วยบอกชนิด (วิธีจำ)',
          plain: true,
          rows: [
            ['ชนิด', 'ท้ายคำที่พบบ่อย', 'ตัวอย่าง'],
            ['คำนาม', '-tion -ment -ness -ity -er/-or', 'protection, payment, kindness, security, visitor'],
            ['คุณศัพท์', '-ful -less -ous -able -ive -al', 'helpful, careless, dangerous, available, active, local'],
            ['กริยาวิเศษณ์', '-ly', 'quickly, carefully, clearly'],
            ['กริยา', '-ize -ify -en', 'organize, identify, widen'],
          ],
          after: 'ปัจจัยเป็นแค่เบาะแส ไม่ใช่กฎตายตัว เช่น friendly, lovely, lonely ลงท้าย -ly แต่เป็นคุณศัพท์ ส่วน fast, hard, late ใช้เป็นกริยาวิเศษณ์ได้โดยไม่เติม -ly (hardly แปลว่า “แทบจะไม่” คนละความหมายกับ hard)',
        },
        {
          type: 'list',
          title: 'ตำแหน่งที่ข้อสอบชอบถาม',
          plain: true,
          items: [
            { name: 'กริยา + ช่องว่าง → adverb', desc: 'ขยายว่าทำอย่างไร เช่น She drives **carefully**. ไม่ใช่ drives careful' },
            { name: 'be / look / seem / feel / become + ช่องว่าง → adjective', desc: 'เมื่อใช้บอกสภาพของประธาน (ไม่ใช่การกระทำ) กริยากลุ่มนี้ตามด้วยคุณศัพท์ เช่น He looks **tired**. ไม่ใช่ looks tiredly แต่ถ้าเป็นการกระทำ ใช้กริยาวิเศษณ์ เช่น He looked **carefully** at the map. (มองอย่างละเอียด)' },
            { name: 'a / the / คุณศัพท์ + ช่องว่าง → noun', desc: 'เช่น a clear **explanation**, the **decision**' },
            { name: 'very / so / too + ช่องว่าง', desc: 'ตามด้วยคุณศัพท์หรือกริยาวิเศษณ์รูปปกติ เช่น very **careful**, very **carefully** ไม่ใช้ very กับคำนาม' },
          ],
        },
        {
          type: 'table',
          title: 'สรรพนาม: ตำแหน่งในประโยคกำหนดรูป',
          plain: true,
          rows: [
            ['ประธาน', 'กรรม', 'เจ้าของ (+นาม / ลอย)'],
            ['I', 'me', 'my / mine'],
            ['we', 'us', 'our / ours'],
            ['you', 'you', 'your / yours'],
            ['he', 'him', 'his / his'],
            ['she', 'her', 'her / hers'],
            ['it', 'it', 'its / –'],
            ['they', 'them', 'their / theirs'],
          ],
          after: 'หน้ากริยาใช้รูปประธาน หลังกริยาหรือหลังคำบุพบทใช้รูปกรรม my/our/their ต้องมีคำนามตาม ส่วน mine/ours/theirs ยืนลอยได้ เช่น This pen is **mine**. วิธีเช็กเมื่อมีสองคน เช่น “Somsri and ___” ให้ตัดชื่อแรกออกแล้วลองอ่าน: The chief called ___ → called **me** จึงตอบ Somsri and me',
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “The duty officer answered every question ___.” เติมคำใด ระหว่าง “polite” “politely” “politeness” และ “more polite”',
          steps: [
            'ดูตำแหน่ง: ประโยคครบแล้ว (ประธาน The duty officer + กริยา answered + กรรม every question) ช่องว่างจึงเป็นคำที่ขยายว่า “ตอบอย่างไร”',
            'คำที่ขยายกริยาคือกริยาวิเศษณ์ ได้ politely',
            '“polite” เป็นคุณศัพท์ ขยายคำนามได้ แต่ขยายกริยา answered ไม่ได้ “politeness” เป็นคำนาม ถ้าเติมจะได้คำนามลอยท้ายประโยค และ “more polite” เป็นคุณศัพท์ขั้นกว่า ไม่มีสิ่งให้เทียบ',
          ],
          answer: 'politely',
          trap: 'คนไทยมักแปลว่า “ตอบสุภาพ” แล้วเลือกคุณศัพท์ เพราะภาษาไทยไม่เปลี่ยนรูปคำ ต้องถามว่าคำนี้ขยายอะไร ถ้าขยายกริยาต้องเป็น -ly',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) แบบที่พบคือ เลือกรูปคำให้ตรงตำแหน่ง เลือกสรรพนามรูปกรรมหลังกริยา และเลือกประโยคที่ใช้คำนามนับไม่ได้ถูก (ดูส่วนที่ 5) ให้ดูคำที่อยู่**ติดกับช่องว่าง**ก่อนดูความหมาย',
        },
      ],
    },

    // 3 · tenses
    {
      type: 'section',
      anchor: 'tense',
      eyebrow: '3 · Tense กับคำบอกเวลา',
      title: 'หาคำบอกเวลาก่อน แล้วถามว่าเหตุการณ์จบหรือยัง',
      priority: 'must',
      plain: true,
      body: [
        'ภาษาไทยบอกเวลาด้วยคำเติม เช่น แล้ว กำลัง จะ แต่ภาษาอังกฤษบอกเวลาไว้ในรูปกริยาเอง ข้อ tense จึงตอบได้เร็วถ้าเจอ**คำบอกเวลา** (time marker) ในประโยค เช่น yesterday, now, since 2020, by the time',
        'ตารางข้างล่างคือ tense ที่ต้องรู้ เรียงจากพบบ่อยไปน้อย ให้จำคู่ “รูปกริยา + คำบอกเวลา” ไปด้วยกัน',
      ],
      blocks: [
        {
          type: 'table',
          title: 'Tense ที่ต้องรู้ และคำบอกเวลาที่มากับมัน',
          plain: true,
          rows: [
            ['Tense', 'รูปกริยา', 'คำบอกเวลา'],
            ['Present simple', 'V1 (ประธานเอกพจน์ เติม -s/-es)', 'every day, usually, always, ความจริงทั่วไป'],
            ['Present continuous', 'am/is/are + V-ing', 'now, right now, at the moment, Look! Listen!'],
            ['Past simple', 'V2', 'yesterday, last week, ago, in 2020'],
            ['Past continuous', 'was/were + V-ing', 'at 9 p.m. yesterday, while, when + V2'],
            ['Present perfect', 'has/have + V3', 'since, for, already, yet, just, so far, ever, never, recently, lately, in the last/past five years, this week/year'],
            ['Past perfect', 'had + V3', 'by the time / before + เหตุการณ์อดีต'],
            ['Future simple', 'will + V1, am/is/are going to + V1', 'tomorrow, next week, later, soon'],
          ],
          highlightCol: 2,
        },
        {
          type: 'explorer',
          title: 'แตะดูกฎ และกับดักของแต่ละ tense',
          intro: 'ประโยคตัวอย่างที่เราแต่งทั้งหมด เครื่องหมาย ✗ คือรูปที่ผิด',
          initial: 't3',
          plain: true,
          groups: [
            {
              tag: 'ปัจจุบัน',
              name: 'ทำเป็นประจำ หรือกำลังทำอยู่',
              idea: 'every day ใช้ present simple ส่วน now ใช้ present continuous',
              items: [
                {
                  key: 't1',
                  label: '1',
                  full: 'Present simple: กิจวัตรและความจริงทั่วไป',
                  meaning: 'The canteen closes at 3 p.m. every day. ประธานเอกพจน์บุรุษที่ 3 (he, she, it, ชื่อคนหนึ่งคน) เติม -s ประโยคปฏิเสธและคำถามใช้ does แล้วกริยากลับเป็นรูปเดิม ✗ He doesn’t works. ต้องเป็น He doesn’t work.',
                },
                {
                  key: 't2',
                  label: '2',
                  full: 'Present continuous: กำลังเกิดขึ้นตอนพูด',
                  meaning: 'Listen! Someone is knocking on the door. คำว่า Look! Listen! now บอกว่ากำลังเกิดอยู่ กริยาบอกสภาพหรือความรู้สึก เช่น know, like, want, need, belong ปกติไม่ใช้รูป -ing ✗ I am knowing him. ต้องเป็น I know him.',
                },
              ],
            },
            {
              tag: 'อดีต',
              name: 'จบแล้ว หรือยังต่อเนื่องถึงตอนนี้',
              idea: 'เวลาอดีตที่ระบุชัดใช้ past simple ช่วงที่ลากมาถึงตอนนี้ใช้ present perfect',
              items: [
                {
                  key: 't3',
                  label: '3',
                  full: 'Past simple กับ yesterday / last / ago / in 2020',
                  meaning: 'The clerk sent the letters yesterday. กฎที่ข้อสอบชอบ: คำบอกเวลาอดีตที่ระบุชัด **ใช้กับ present perfect ไม่ได้** ✗ He has finished the report last Friday. ต้องเป็น He finished the report last Friday. เทียบ: in 2020 (ปีที่จบแล้ว) → V2 เช่น The station opened in 2020. แต่ in the last five years (ช่วงที่ลากมาถึงตอนนี้) → has/have + V3 เช่น Crime has fallen in the last five years.',
                },
                {
                  key: 't4',
                  label: '4',
                  full: 'Present perfect กับ since / for',
                  meaning: 'She has worked here since 2021. / She has worked here for five years. since ตามด้วยจุดเริ่มต้นของเวลา for ตามด้วยระยะเวลา เมื่อใช้กับ present perfect ทั้งสองบอกว่ายังทำอยู่ถึงตอนนี้ ✗ She works here since 2021. แต่ for ใช้กับ past simple ได้ถ้าเรื่องจบแล้ว เช่น He worked in Phuket for three years, then moved to Bangkok. (ทำครบสามปีแล้วย้าย)',
                },
                {
                  key: 't5',
                  label: '5',
                  full: 'Past continuous กับ when / while',
                  meaning: 'I was typing a report when the phone rang. เหตุการณ์ยาวที่กำลังทำอยู่ใช้ was/were + V-ing ส่วนเหตุการณ์สั้นที่แทรกเข้ามาใช้ V2 ประธาน I/he/she/it ใช้ was ส่วน we/you/they ใช้ were',
                },
                {
                  key: 't6',
                  label: '6',
                  full: 'Past perfect: เกิดก่อนอีกเหตุการณ์ในอดีต',
                  meaning: 'When we arrived, the meeting had already started. เหตุการณ์ที่เกิดก่อนใช้ had + V3 เหตุการณ์ที่ตามมาใช้ V2 ถ้าไม่มีเหตุการณ์อดีตอีกอันให้เทียบ ไม่ต้องใช้ past perfect',
                },
              ],
            },
            {
              tag: 'อนาคต',
              name: 'ยังมาไม่ถึง',
              idea: 'tomorrow, next week, later ใช้ will หรือ be going to',
              items: [
                {
                  key: 't7',
                  label: '7',
                  full: 'will / be going to + V1',
                  meaning: 'I will call you back later. / We are going to move to a new office next month. หลัง will ใช้กริยารูปเดิมเสมอ ✗ He will calls. ส่วน be going to ใช้กับสิ่งที่ตั้งใจหรือวางแผนไว้แล้ว',
                },
                {
                  key: 't8',
                  label: '8',
                  full: 'Future perfect: will have + V3 (อ่านถ้ามีเวลา)',
                  meaning: 'By next June, she will have worked here for ten years. ใช้กับสิ่งที่จะ “เสร็จหรือครบ” ก่อนจุดเวลาในอนาคต สังเกตคำว่า by + เวลาในอนาคต พบในชุดข้อสอบเสมือนจริงที่เรารวบรวมเพียงหนึ่งข้อ',
                },
              ],
            },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “Two days ago, the patrol team has found a stolen motorcycle near the market.” ส่วนใดผิด ระหว่าง “Two days ago” “has found” “a stolen motorcycle” และ “near the market”',
          steps: [
            'หาคำบอกเวลา: Two days ago เป็นเวลาอดีตที่ระบุชัด เหตุการณ์จบแล้ว',
            'คำบอกเวลาอดีตที่ระบุชัดใช้กับ present perfect ไม่ได้ กริยาจึงต้องเป็น past simple คือ found',
            '“a stolen motorcycle” ใช้ a หน้าเสียงพยัญชนะ /s/ ถูกแล้ว และ “near the market” เป็นวลีบอกสถานที่ที่ถูก',
          ],
          answer: '“has found” ผิด ต้องเป็น found',
          trap: 'ภาษาไทยพูดว่า “พบแล้ว” คำว่า “แล้ว” ชวนให้เลือก has found ต้องดูคำบอกเวลาก่อน ถ้ามี ago, yesterday, last … ให้ใช้ V2',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) เกือบ 1 ใน 4 ของข้อไวยากรณ์เป็นเรื่อง tense โดยมากเป็นเติมคำที่มีคำบอกเวลาชัด และบางข้อเป็นหาส่วนที่ผิด ขั้นตอน: วงคำบอกเวลา ตัด tense ที่ขัดกับคำนั้น แล้วเช็กว่ากริยาเข้ากับประธานเอกพจน์หรือพหูพจน์',
        },
      ],
    },

    // 4 · subject–verb agreement
    {
      type: 'section',
      anchor: 'sva',
      eyebrow: '4 · ประธานกับกริยา',
      title: 'หาประธานตัวจริงก่อน แล้วผันกริยาตามมัน',
      priority: 'must',
      plain: true,
      body: [
        '**ประธานกับกริยาต้องสอดคล้องกัน** (subject–verb agreement) คือ ประธานเอกพจน์ใช้กริยาเอกพจน์ (is, was, has, V-s) ประธานพหูพจน์ใช้กริยาพหูพจน์ (are, were, have, V1 ไม่เติม s)',
        'ปัญหาคือประธานตัวจริงมักไม่ได้อยู่ติดกริยา ให้**ตัดวลีที่ขยายประธานออกก่อน** เช่น of …, with …, as well as …, together with … แล้วดูว่าคำนามหลักเป็นเอกพจน์หรือพหูพจน์',
      ],
      blocks: [
        {
          type: 'list',
          title: 'กรณีที่ต้องรู้ (ประโยคตัวอย่างที่เราแต่ง)',
          plain: true,
          items: [
            { name: 'วลีขยายคั่นกลาง', desc: 'The key to the cabinets **is** missing. (ประธานคือ key) / The chief, together with two officers, **is** at the scene. (ประธานคือ chief)' },
            { name: 'each, every, everyone, nobody → เอกพจน์', desc: 'Each of the rooms **has** a fire extinguisher. / Everyone **needs** an ID card.' },
            { name: 'A and B → พหูพจน์', desc: 'The sergeant and the clerk **are** in the office. ประธานสองคนเชื่อมด้วย and ข้อยกเว้น: ถ้า A and B เป็นคนเดียวหรือสิ่งเดียว ใช้เอกพจน์ เช่น Rice and curry **is** my usual lunch. (อาหารจานเดียว) และถ้ามี each/every นำหน้า ใช้เอกพจน์ เช่น Every officer and clerk **has** an ID card.' },
            { name: 'either … or / neither … nor → ตามตัวที่อยู่ใกล้กริยา', desc: 'Either the clerk or the officers **have** the key. / Neither the officers nor the clerk **has** the key. (ต่างจาก neither of + นามพหูพจน์ ซึ่งภาษาทางการใช้กริยาเอกพจน์ แต่ภาษาพูดใช้พหูพจน์ได้)' },
            { name: 'The number of → เอกพจน์ / A number of → พหูพจน์', desc: 'The number of complaints **has** dropped. (ประธานคือ “จำนวน”) / A number of complaints **have** come in. (a number of = หลาย)' },
            { name: 'นามนับไม่ได้ และ news → เอกพจน์', desc: 'The information **is** correct. / The news **was** good. แม้ news ลงท้าย s ก็ใช้กริยาเอกพจน์' },
            { name: 'police → พหูพจน์', desc: 'The police **are** checking the area. คำว่า police หมายถึงตำรวจเป็นกลุ่ม ใช้กริยาพหูพจน์ ถ้าหมายถึงคนเดียวใช้ a police officer ส่วนคำนามกลุ่มอื่น เช่น team, staff, committee อังกฤษแบบอเมริกันมักใช้เอกพจน์ อังกฤษแบบบริติชใช้ได้ทั้งสองแบบ จึงไม่ควรใช้ตัดสินข้อ' },
            { name: 'There is / There are → ตามคำนามข้างหลัง', desc: 'There **is** a letter on the desk. / There **are** three letters on the desk.' },
          ],
        },
        {
          type: 'reasoning',
          plain: true,
          question: 'ประโยคตัวอย่างที่เราแต่ง: “The list of missing items ___ on the notice board.” เติมคำใด ระหว่าง “are” “is” “were” และ “have”',
          steps: [
            'ตัดวลีขยาย of missing items ออก เหลือ The list ___ on the notice board',
            'ประธานตัวจริงคือ list ซึ่งเป็นเอกพจน์ ได้ is',
            '“are” และ “were” ผันตาม items ที่อยู่ติดช่องว่าง ซึ่งไม่ใช่ประธาน ส่วน “have” ทั้งผิดพจน์และไม่มีกริยาหลักตามหลัง (have on the board ไม่ได้ความ)',
          ],
          answer: 'is',
          trap: 'คำนามที่อยู่ติดกริยา (items) ดึงสายตาให้เลือกกริยาพหูพจน์ ต้องย้อนไปหาคำนามหลักหน้า of',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) แบบที่พบคือ neither … nor ให้เลือกกริยา และ “ประโยคใดถูกไวยากรณ์” ที่ตัวเลือกผิดเป็นคู่ประธานกับกริยาที่ไม่เข้ากัน เช่น She do, They was ให้เช็กทีละประโยคว่าประธานเป็นเอกพจน์หรือพหูพจน์ ประโยคปฏิเสธใช้ does/doesn’t กับเอกพจน์ และ do/don’t กับพหูพจน์ I และ you',
        },
      ],
    },

    // 5 · articles + countable/uncountable (maybe)
    {
      type: 'section',
      anchor: 'article',
      eyebrow: '5 · Article และนามนับได้/นับไม่ได้',
      title: 'a/an ดูที่เสียง the ดูที่ความเจาะจง',
      priority: 'maybe',
      plain: true,
      body: [
        '**a / an** ใช้กับคำนามนับได้เอกพจน์ที่ไม่เจาะจง หมายถึง “หนึ่ง…” ส่วน **the** ใช้เมื่อผู้ฟังรู้ว่าหมายถึงสิ่งไหน ถ้าเป็นคำนามพหูพจน์หรือนามนับไม่ได้ที่พูดแบบทั่วไป ไม่ต้องใส่ article (zero article)',
        'การเลือก a หรือ an ดูที่**เสียง**ของคำถัดไป ไม่ใช่ตัวสะกด ถ้าขึ้นต้นด้วยเสียงสระใช้ an ถ้าขึ้นต้นด้วยเสียงพยัญชนะใช้ a',
      ],
      blocks: [
        {
          type: 'table',
          title: 'a หรือ an: ฟังเสียงแรก',
          plain: true,
          rows: [
            ['คำ', 'เสียงแรก', 'ใช้'],
            ['hour, honest', 'h ไม่ออกเสียง เริ่มด้วยเสียงสระ', 'an hour, an honest man'],
            ['uniform, university', 'เสียง “ยู” (/j/) เป็นพยัญชนะ', 'a uniform, a university'],
            ['officer, accident', 'เสียงสระ', 'an officer, an accident'],
            ['one-way street', 'เสียง “ว” (/w/)', 'a one-way street'],
          ],
          highlightCol: 2,
        },
        {
          type: 'list',
          title: 'ใช้ the เมื่อ / ไม่ใช้ article เมื่อ',
          plain: true,
          items: [
            { name: 'the: พูดถึงแล้ว หรือรู้กันว่าตัวไหน', desc: 'I saw a car outside. **The** car had no number plate. / Please close **the** door. (ประตูห้องนี้)' },
            { name: 'the: มีหนึ่งเดียว หรือขั้นสุด', desc: 'the sun, the moon, the first day, the tallest building' },
            { name: 'ไม่ใช้: นามพหูพจน์หรือนามนับไม่ได้ที่พูดทั่วไป', desc: 'Officers must wear uniforms. / Water is important.' },
            { name: 'ไม่ใช้: สำนวนสถานที่และการเดินทาง', desc: 'go to work, go to school, go to bed, at home, by bus, by car, have breakfast' },
          ],
        },
        {
          type: 'table',
          title: 'นามนับไม่ได้ที่ข้อสอบชอบใช้',
          plain: true,
          rows: [
            ['คำ', 'ผิด', 'ถูก'],
            ['information', 'an information, informations', 'some information, a piece of information'],
            ['advice', 'an advice, advices', 'some advice, a piece of advice'],
            ['equipment', 'an equipment, equipments', 'some equipment, the equipment'],
            ['furniture, luggage, evidence', 'a furniture, luggages', 'some furniture, a lot of luggage'],
          ],
          after: 'นามนับไม่ได้ไม่ใช้ a/an ไม่เติม s และใช้กริยาเอกพจน์ ใช้ much / a little กับนามนับไม่ได้ และ many / a few กับนามนับได้พหูพจน์ เช่น much information, many documents (ประโยคบอกเล่านิยม a lot of มากกว่า much เช่น We have a lot of information. ส่วน much ใช้บ่อยในประโยคปฏิเสธและคำถาม เช่น We don’t have much information.)',
        },
        {
          type: 'note',
          title: 'ข้อสอบถามแบบนี้',
          plain: true,
          body: 'จากชุดข้อสอบเสมือนจริงที่เรารวบรวม (การประเมินของเรา) เกือบไม่พบข้อ article โดยตรง แต่พบข้อ “ประโยคใดใช้คำนามถูก” ที่ตัวเลือกผิดเป็น an advice หรือ many information ถ้าเวลาน้อย จำแค่ a/an ดูที่เสียง และนามนับไม่ได้ไม่ใช้ a/an',
        },
      ],
    },

    // mistakes
    {
      type: 'mistakes',
      plain: true,
      items: [
        {
          title: 'ใช้ has/have + V3 กับ yesterday, ago, last …',
          body: 'เกิดเพราะแปลคำว่า “แล้ว” เป็น present perfect วิธีแก้: ถ้ามีคำบอกเวลาอดีตที่ระบุชัด ใช้ V2 เท่านั้น present perfect ใช้กับ since, for, already, yet, just, so far, ever, never, recently, in the last five years',
        },
        {
          title: 'ผันกริยาตามคำนามที่อยู่ติดกริยา',
          body: 'เกิดเพราะได้ยิน “items are” แล้วคุ้นหู วิธีแก้: ตัด of …, with …, as well as … ออกก่อน แล้วผันตามคำนามหลัก ยกเว้น either … or / neither … nor ที่ผันตามตัวใกล้กริยา',
        },
        {
          title: 'ลืมเติม -s หรือเติม -s ซ้อน',
          body: 'เกิดเพราะภาษาไทยไม่ผันกริยา วิธีแก้: ประธานเอกพจน์บุรุษที่ 3 กับ present simple ต้องเติม -s แต่หลัง does, doesn’t, will และ can กริยากลับเป็นรูปเดิม เช่น He doesn’t work. ไม่ใช่ doesn’t works',
        },
        {
          title: 'ใช้คุณศัพท์ขยายกริยา',
          body: 'เกิดเพราะภาษาไทยใช้คำเดียวกัน เช่น “ขับระวัง” วิธีแก้: ถ้าคำนั้นขยายว่า “ทำอย่างไร” ใช้ -ly แต่หลัง be, look, seem, feel ที่บอกสภาพของประธาน ใช้คุณศัพท์ เช่น She looks calm.',
        },
        {
          title: 'เลือก a/an จากตัวสะกด',
          body: 'เกิดเพราะจำว่า “สระ a e i o u ใช้ an” วิธีแก้: ฟังเสียงแรก an hour (h ไม่ออกเสียง) แต่ a university (ออกเสียง “ยู”)',
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
          id: 'pe1-c1',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The new clerk checks every form very ___ before she files it.”',
          choices: ['careful', 'carefully', 'carefulness', 'more careful'],
          answer: 1,
          why: 'ช่องว่างขยายกริยา checks ว่าตรวจอย่างไร จึงต้องเป็นกริยาวิเศษณ์ “carefully” ส่วน “careful” เป็นคุณศัพท์ ขยายกริยาไม่ได้ “carefulness” เป็นคำนาม ใช้หลัง very ไม่ได้ และ “more careful” เป็นคุณศัพท์ขั้นกว่า ใช้หลัง very ไม่ได้และไม่มีสิ่งให้เปรียบเทียบ',
          refs: [],
          plain: true,
        },
        {
          id: 'pe1-c2',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Somchai could not log in to the office computer yesterday morning because someone ___ his password the night before.”',
          choices: ['has changed', 'changes', 'had changed', 'will change'],
          answer: 2,
          why: 'มีเหตุการณ์อดีตสองเหตุการณ์ คือ เข้าระบบไม่ได้เมื่อเช้าวานนี้ และการเปลี่ยนรหัสผ่านซึ่งเกิดก่อนหน้านั้น (the night before) เหตุการณ์ที่เกิดก่อนใช้ past perfect “had changed” ส่วน “has changed” ใช้กับเวลาอดีตที่ระบุชัดอย่าง the night before ไม่ได้ “changes” เป็นปัจจุบัน ขัดกับเรื่องที่จบไปแล้ว และ “will change” เป็นอนาคต ขัดกับ the night before',
          refs: [],
          plain: true,
        },
        {
          id: 'pe1-c3',
          q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The box of old case files ___ too heavy for one person to lift.”',
          choices: ['is', 'are', 'were', 'have'],
          answer: 0,
          why: 'ตัดวลีขยาย of old case files ออก ประธานตัวจริงคือ box ซึ่งเป็นเอกพจน์ จึงใช้ “is” ส่วน “are” และ “were” เป็นกริยาพหูพจน์ที่ผันตาม files ซึ่งไม่ใช่ประธาน และ “have” ผิดทั้งพจน์และโครงสร้าง เพราะหน้าคุณศัพท์ heavy ต้องใช้ be',
          refs: [],
          plain: true,
        },
        {
          id: 'pe1-c4',
          q: 'ประโยคตัวอย่างที่เราแต่ง ข้อใดใช้ article และคำนามถูกต้อง',
          choices: [
            'He is a honest officer.',
            'We need an information about the case.',
            'He goes to the work by bus.',
            'She waited for an hour at the station.',
          ],
          answer: 3,
          why: '“She waited for an hour at the station.” ถูก เพราะ h ใน hour ไม่ออกเสียง คำนี้จึงขึ้นต้นด้วยเสียงสระ ใช้ an ส่วน “He is a honest officer.” ผิด เพราะ honest ก็ขึ้นต้นด้วยเสียงสระ ต้องเป็น an honest “We need an information about the case.” ผิด เพราะ information นับไม่ได้ ใช้ an ไม่ได้ และ “He goes to the work by bus.” ผิด เพราะสำนวน go to work ไม่ใช้ the',
          refs: [],
          plain: true,
        },
      ],
    },

    // explain
    {
      type: 'explain',
      plain: true,
      prompt: 'อธิบายด้วยคำของคุณเองว่า ทำไม “He has finished the report last Friday.” จึงผิด และจะแก้ให้ถูกได้สองแบบอย่างไร',
      model: 'present perfect ใช้กับเรื่องที่ยังเชื่อมกับตอนนี้ ส่วน last Friday เป็นเวลาอดีตที่ระบุชัดและจบไปแล้ว สองอย่างนี้จึงไปด้วยกันไม่ได้ แก้แบบแรกโดยเปลี่ยนกริยาเป็น past simple ได้ He finished the report last Friday. แก้แบบที่สองโดยตัดคำบอกเวลาอดีตออก ได้ He has finished the report. ซึ่งบอกว่ารายงานเสร็จแล้วและพร้อมใช้ตอนนี้',
    },
  ],

  test: [
    {
      id: 'pe1-t01',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Please wait outside for a moment. The inspector ___ on the phone right now.”',
      choices: ['talk', 'talks', 'has talked', 'is talking'],
      answer: 3,
      why: 'right now บอกว่าเหตุการณ์กำลังเกิดขณะพูด จึงใช้ present continuous “is talking” ส่วน “talk” ผิดทั้ง tense และพจน์ เพราะประธานเอกพจน์ “talks” เป็น present simple ใช้กับกิจวัตร ไม่ใช่สิ่งที่กำลังทำอยู่ตอนนี้ และ “has talked” เป็น present perfect ซึ่งไม่ใช้กับ right now',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t02',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Officer Nok ___ in the traffic division since she finished her training in 2021.”',
      choices: ['works', 'has worked', 'worked', 'had worked'],
      answer: 1,
      why: 'since + จุดเริ่มต้น (since she finished her training in 2021) บอกว่าเริ่มในอดีตและยังทำอยู่ถึงตอนนี้ กริยาหลักจึงใช้ present perfect “has worked” ส่วนกริยาหลัง since (finished) เป็น V2 เพราะบอกจุดเริ่มต้นที่จบแล้ว “works” เป็น present simple ใช้กับ since ไม่ได้ “worked” บอกว่าจบแล้ว ขัดกับ since ที่ลากมาถึงตอนนี้ และ “had worked” ต้องมีเหตุการณ์อดีตอีกอันให้เทียบ ซึ่งประโยคนี้ไม่มี',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t03',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “According to the guard, the suspect ___ the shopping mall about two hours ago.”',
      choices: ['left', 'has left', 'leaves', 'is leaving'],
      answer: 0,
      why: 'two hours ago เป็นเวลาอดีตที่ระบุชัด จึงใช้ past simple “left” ส่วน “has left” ใช้กับ ago ไม่ได้ “leaves” เป็นปัจจุบัน ขัดกับ ago และ “is leaving” บอกว่ากำลังเกิดตอนนี้ ขัดกับเหตุการณ์เมื่อสองชั่วโมงก่อน',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t04',
      q: 'ส่วนใดผิดไวยากรณ์ (ประโยคตัวอย่างที่เราแต่ง): “Each of the new officers have to attend the first-aid training on Monday.”',
      choices: ['Each of', 'have to', 'attend', 'on Monday'],
      answer: 1,
      why: 'ประธานตัวจริงคือ Each ซึ่งเป็นเอกพจน์ ส่วน of the new officers เป็นวลีขยาย กริยาจึงต้องเป็น has to ไม่ใช่ “have to” ส่วน “Each of” เป็นรูปที่ถูก (each of + the + นามพหูพจน์) “attend” หลัง have/has to ใช้กริยารูปเดิมถูกแล้ว และ “on Monday” ใช้ on กับวันถูกแล้ว',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t05',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The station chief, as well as two junior officers, ___ going to the provincial meeting this afternoon.”',
      choices: ['are', 'were', 'is', 'be'],
      answer: 2,
      why: 'as well as two junior officers เป็นวลีขยายที่ไม่เปลี่ยนประธาน ประธานตัวจริงคือ The station chief ซึ่งเป็นเอกพจน์ และ this afternoon เป็นเรื่องที่กำลังจะเกิด จึงใช้ “is” (is going to) ส่วน “are” ผันตาม officers ซึ่งไม่ใช่ประธาน “were” ผิดทั้งพจน์และเวลา และ “be” เป็นรูปเดิม ใช้เป็นกริยาแท้หลังประธานไม่ได้',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t06',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Don’t worry about the missing page. I ___ it to you by e-mail later this afternoon.”',
      choices: ['sent', 'have sent', 'had sent', 'will send'],
      answer: 3,
      why: 'later this afternoon เป็นเวลาที่ยังมาไม่ถึง จึงใช้ future simple “will send” ส่วน “sent” เป็นอดีต ขัดกับ later “have sent” บอกว่าทำเสร็จแล้ว ใช้กับเวลาในอนาคตไม่ได้ และ “had sent” เป็นอดีตก่อนอดีต ไม่เข้ากับเวลาในอนาคต',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t07',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The witness gave the police a clear ___ of the accident.”',
      choices: ['explain', 'explained', 'explanation', 'explanatory'],
      answer: 2,
      why: 'ช่องว่างอยู่หลัง a clear (article + คุณศัพท์) และหน้า of จึงต้องเป็นคำนาม “explanation” ส่วน “explain” เป็นกริยา “explained” เป็นกริยาช่องที่ 2/3 และ “explanatory” เป็นคุณศัพท์ ซึ่งวางหลัง a clear โดยไม่มีคำนามตามไม่ได้',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t08',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “The captain asked Somsri and ___ to check the CCTV recordings from last night.”',
      choices: ['I', 'me', 'my', 'mine'],
      answer: 1,
      why: 'ตัด Somsri and ออกแล้วอ่านใหม่ได้ The captain asked ___ ช่องว่างเป็นกรรมของ asked จึงใช้รูปกรรม “me” ส่วน “I” เป็นรูปประธาน ใช้ตำแหน่งกรรมไม่ได้ (The captain asked I ผิด) “my” ต้องมีคำนามตาม และ “mine” เป็นสรรพนามแสดงความเป็นเจ้าของ ไม่ใช่ผู้ถูกขอให้ทำ',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t09',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Before the meeting started yesterday, the secretary ___ a copy of the agenda for everyone.”',
      choices: ['had made', 'has made', 'makes', 'will make'],
      answer: 0,
      why: 'การทำสำเนาเกิดก่อนอีกเหตุการณ์ในอดีต คือการประชุมเริ่มเมื่อวานนี้ จึงใช้ past perfect “had made” ส่วน “has made” ใช้กับเรื่องที่ผูกกับเวลาอดีตอย่าง yesterday ไม่ได้ “makes” เป็นปัจจุบัน ขัดกับ started yesterday และ “will make” เป็นอนาคต ขัดกับเรื่องที่จบไปแล้ว',
      refs: [],
      plain: true,
    },
    {
      id: 'pe1-t10',
      q: 'เลือกคำที่ถูกต้อง (ประโยคตัวอย่างที่เราแต่ง): “Mr. Lee is ___ university lecturer, and his wife is ___ engineer.”',
      choices: ['an, a', 'a, a', 'a, an', 'an, an'],
      answer: 2,
      why: 'university ออกเสียงขึ้นต้นด้วย “ยู” ซึ่งเป็นเสียงพยัญชนะ จึงใช้ a ส่วน engineer ขึ้นต้นด้วยเสียงสระ จึงใช้ an คำตอบคือ “a, an” ส่วน “an, a” สลับทั้งสองช่อง “a, a” ผิดที่ช่องหลัง (a engineer) และ “an, an” ผิดที่ช่องแรก เพราะเลือกจากตัวสะกด u แทนเสียง',
      refs: [],
      plain: true,
    },
  ],

  sources: [{ doc: 'police-exam-scope-summary' }],
};

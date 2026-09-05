'use client';

import type { StudySheetAsset } from '@/lib/study-sheet-types';
import styles from './StudySheetReader.module.css';

function LessonVisual({ assets, assetKey, alt }: { assets: StudySheetAsset[]; assetKey: string; alt: string }) {
  const asset = assets.find((item) => item.asset_key === assetKey);
  const metadataPath = typeof asset?.metadata?.public_path === 'string' ? asset.metadata.public_path : null;
  const storageUrl = asset?.storage_bucket && asset?.storage_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/${asset.storage_bucket}/${asset.storage_path}` : null;
  const src = metadataPath || storageUrl;
  if (!src) return null;

  return (
    <figure className={styles.lessonAsset}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {asset?.description ? <figcaption>{asset.description}</figcaption> : null}
    </figure>
  );
}

function RecallBlock({
  id,
  index,
  title,
  hint,
  open = false,
  children
}: {
  id: string;
  index: string;
  title: string;
  hint: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details id={id} className={styles.computerRecallBlock} open={open}>
      <summary>
        <span>{index}</span>
        <div>
          <strong>{title}</strong>
          <small>{hint}</small>
        </div>
      </summary>
      <div className={styles.computerRecallContent}>{children}</div>
    </details>
  );
}

// ==========================================
// PART 1: Hardware & Evolution
// ==========================================
export function ComputerPart1Lesson({ assets }: { assets: StudySheetAsset[] }) {
  const pioneers = [
    {
      name: 'Charles Babbage',
      title: 'บิดาแห่งคอมพิวเตอร์ (Father of Computers)',
      detail: 'สร้าง Difference Engine และ Analytical Engine ซึ่งเป็นต้นแบบคอมพิวเตอร์ยุคใหม่ มี 4 หน่วย: Input, Mill (CPU), Store (Memory), Output',
      tag: '⭐ ออกสอบบ่อยที่สุด'
    },
    {
      name: 'Lady Ada Lovelace',
      title: 'โปรแกรมเมอร์คนแรกของโลก (First Programmer)',
      detail: 'คิดค้นชุดคำสั่งและแนวคิดการทำงานแบบวนซ้ำ (Loop) ควบคุมให้เครื่อง Analytical Engine คำนวณอัตโนมัติ',
      tag: '⭐ บุคคลสำคัญ'
    },
    {
      name: 'John von Neumann',
      title: 'สถาปัตยกรรมคอมพิวเตอร์ (Von Neumann Architecture)',
      detail: 'วางแนวคิด Stored-Program Concept เก็บชุดคำสั่งและข้อมูลไว้ในหน่วยความจำหลักเดียวกัน ซึ่งเป็นโครงสร้างคอมพิวเตอร์จนถึงปัจจุบัน',
      tag: 'สถาปัตยกรรม'
    },
    {
      name: 'Blaise Pascal & Leibniz',
      title: 'ผู้บุกเบิกเครื่องกลคำนวณ (Mechanical Calculators)',
      detail: 'Pascaline ใช้ฟันเฟืองหมุนบวก-ลบตัวเลข / Leibniz พัฒนา Stepped Reckoner ให้สามารถคูณและหารตัวเลขได้',
      tag: 'ยุคบุกเบิก'
    }
  ];

  const generations = [
    {
      gen: 'ยุคที่ 1 (1945–1955)',
      component: 'หลอดสุญญากาศ (Vacuum Tubes)',
      storage: 'บัตรเจาะรู (Punch Card) & ดรัมแม่เหล็ก',
      language: 'ภาษาเครื่อง (Machine Code: 0 และ 1)',
      landmark: 'ENIAC, EDVAC, UNIVAC I (เครื่องใหญ่ ร้อนจัด กินไฟ)',
      color: '#8b1e1e'
    },
    {
      gen: 'ยุคที่ 2 (1956–1963)',
      component: 'ทรานซิสเตอร์ (Transistors)',
      storage: 'วงแหวนแม่เหล็ก (Magnetic Core)',
      language: 'ภาษาแอสเซมบลี & FORTRAN, COBOL',
      landmark: 'IBM 1401, IBM 1620 (ขนาดเล็กลง เร็วขึ้น ร้อนน้อยลง)',
      color: '#c2410c'
    },
    {
      gen: 'ยุคที่ 3 (1964–1971)',
      component: 'วงจรรวม (Integrated Circuit - IC)',
      storage: 'จานแม่เหล็ก (Magnetic Disk)',
      language: 'ภาษาระดับสูง BASIC, Pascal, C',
      landmark: 'IBM System/360 (เริ่มมีระบบปฏิบัติการ OS แป้นพิมพ์ และจอภาพ)',
      color: '#0369a1'
    },
    {
      gen: 'ยุคที่ 4 (1972–ปัจจุบัน)',
      component: 'ไมโครโพรเซสเซอร์ (VLSI / LSI)',
      storage: 'Floppy Disk, HDD, SSD, Flash Memory',
      language: 'C++, Java, Python, SQL, GUI',
      landmark: 'Intel 8086, Apple II, IBM PC (กำเนิด Microcomputer / PC / อินเทอร์เน็ต)',
      color: '#047857'
    },
    {
      gen: 'ยุคที่ 5 (ปัจจุบัน–อนาคต)',
      component: 'ปัญญาประดิษฐ์ (AI) & ULSI',
      storage: 'Cloud Storage, Quantum Memory',
      language: 'Natural Language, AI Prompts, Quantum Logic',
      landmark: 'Machine Learning, ขนานประมวลผล (Parallel Processing), Quantum Computer',
      color: '#6d28d9'
    }
  ];

  const computerTypes = [
    {
      title: 'จำแนกตามสัญญาณประมวลผล',
      items: [
        { name: 'Analog (แอนะล็อก)', desc: 'ประมวลผลข้อมูลต่อเนื่องเชิงฟิสิกส์ เช่น เข็มไมล์รถยนต์, เครื่องวัดอุณหภูมิเข็ม' },
        { name: 'Digital (ดิจิทัล)', desc: 'ประมวลผลด้วยสัญญาณตัวเลขฐานสอง (0 และ 1) แม่นยำสูง (คอมพิวเตอร์ทั่วไป)' },
        { name: 'Hybrid (ไฮบริด)', desc: 'ผสมผสานแอนะล็อกและดิจิทัล เช่น เครื่องตรวจวัดคลื่นหัวใจ/สัญญาณชีพในห้อง ICU' }
      ]
    },
    {
      title: 'จำแนกตามขนาดและสมรรถนะ (ใหญ่ → เล็ก)',
      items: [
        { name: 'Supercomputer', desc: 'พลังประมวลผลสูงสุดระดับล้านล้านคำสั่ง/วินาที ใช้จำลองฟิสิกส์นิวเคลียร์ พยากรณ์อากาศโลก' },
        { name: 'Mainframe', desc: 'รองรับธุรกรรมมหาศาลพร้อมกัน เสถียรภาพสูงมาก ใช้ในระบบธนาคาร ATM สายการบิน ทะเบียนราษฎร์' },
        { name: 'Minicomputer / Server', desc: 'เซิร์ฟเวอร์ขนาดกลางสำหรับควบคุมโรงงานอุตสาหกรรม หรือระบบแม่ข่ายระดับแผนก' },
        { name: 'Microcomputer (PC)', desc: 'คอมพิวเตอร์ส่วนบุคคล ได้แก่ Desktop, Notebook, Tablet, Smartphone' },
        { name: 'Embedded Computer', desc: 'ไมโครคอนโทรลเลอร์ฝังตัวในเครื่องใช้ไฟฟ้า เช่น กล่อง ECU รถยนต์, เครื่องซักผ้า, แอร์' }
      ]
    }
  ];

  const printers = [
    {
      type: 'Impact (ตีกระทบ)',
      name: 'Dot Matrix (เครื่องพิมพ์ดอตแมทริกซ์ / หัวเข็ม)',
      how: 'ใช้หัวเข็ม (9 หรือ 24 เข็ม) ยิงกระแทกผ่านผ้าหมึก (Ribbon) ลงบนกระดาษ',
      highlight: '⭐ สามารถพิมพ์กระดาษต่อเนื่องและสำเนาคาร์บอน (Carbon Copy) หลายชั้นได้พร้อมกัน',
      useCase: 'ใบกำกับภาษี/ใบเสร็จราชการ, สลิปเงินเดือนซองคาร์บอน, เครื่องพิมพ์สมุดเงินฝากธนาคาร (Passbook)',
      badge: 'สำเนาคาร์บอน'
    },
    {
      type: 'Non-Impact (ไม่ตีกระทบ)',
      name: 'Thermal Printer (เครื่องพิมพ์ความร้อน)',
      how: 'ใช้หัวความร้อนทำปฏิกิริยากับกระดาษความร้อนเคลือบเคมี (Thermal Paper) โดยไม่ต้องใช้หมึก',
      highlight: '⭐ พิมพ์เงียบ รวดเร็ว กะทัดรัด (ตัวหนังสือจะจางเมื่อโดนความร้อน/แสงแดด/แอลกอฮอล์/เวลาผ่านไป)',
      useCase: 'สลิป 7-Eleven, สลิปเครื่องรูดบัตร EDC, ใบเสร็จตู้ ATM, สติกเกอร์ใบปะหน้าพัสดุด่วน',
      badge: 'สลิปความร้อน'
    },
    {
      type: 'Non-Impact (ไม่ตีกระทบ)',
      name: 'Inkjet Printer (เครื่องพิมพ์พ่นหมึก)',
      how: 'พ่นละอองหมึกเหลวขนาดจิ๋วลงบนผิวกระดาษ',
      highlight: 'พิมพ์ภาพถ่ายและกราฟิกสีได้สดใส สวยงาม ความละเอียดสูง ตัวเครื่องราคาประหยัด',
      useCase: 'พิมพ์ภาพถ่ายสี, งานกราฟิก, เอกสารประจำวันทั่วไป',
      badge: 'ภาพถ่ายสี'
    },
    {
      type: 'Non-Impact (ไม่ตีกระทบ)',
      name: 'Laser Printer (เครื่องพิมพ์เลเซอร์)',
      how: 'ใช้เลเซอร์สร้างประจุไฟฟ้าบน Drum ดูดผงหมึก (Toner) แล้วใช้ความร้อนรีดติดกระดาษ',
      highlight: 'พิมพ์เร็วมาก ตัวหนังสือคมชัดสูง หมึกไม่ละลายน้ำ ต้นทุนต่อแผ่นต่ำสำหรับงานขาวดำปริมาณมาก',
      useCase: 'เอกสารสัญญา เอกสารราชการ งานสำนักงานปริมาณมาก',
      badge: 'งานสำนักงาน'
    },
    {
      type: 'Non-Impact (ไม่ตีกระทบ)',
      name: 'Plotter (พล็อตเตอร์)',
      how: 'เครื่องพิมพ์ขนาดใหญ่ที่ใช้ปากกาเขียนเส้นหรือหัวพ่นหมึกความแม่นยำสูง',
      highlight: 'พิมพ์ภาพกราฟิกขนาดใหญ่ ลายเส้นแม่นยำสูง',
      useCase: 'พิมพ์เขียวสถาปัตยกรรม/วิศวกรรม (Blueprints), แผนผัง CAD, แผนที่ดาวเทียม GIS',
      badge: 'พิมพ์เขียว'
    }
  ];

  const practice = [
    {
      question: 'หากหน่วยงานต้องการพิมพ์ใบกำกับภาษีที่มีสำเนาคาร์บอน 3 ชั้นพร้อมกัน ควรเลือกใช้เครื่องพิมพ์ชนิดใด?',
      hint: 'ต้องใช้แรงกระแทกตอกผ่านผ้าหมึกเพื่อให้ทะลุถึงแผ่นคาร์บอนด้านล่าง',
      answer: 'Dot Matrix Printer (เครื่องพิมพ์แบบหัวเข็มตีกระทบ)'
    },
    {
      question: 'ใบเสร็จรับเงินร้านสะดวกซื้อ (7-Eleven) พิมพ์ด้วยเทคโนโลยีใดและมีจุดสังเกตอย่างไร?',
      hint: 'ใช้ความร้อนทำปฏิกิริยากับกระดาษเคมี ไม่ต้องเปลี่ยนตลับหมึก',
      answer: 'Thermal Printer (เครื่องพิมพ์ความร้อน) โดยตัวหนังสือจะเลือนจางเมื่อโดนความร้อน แสงแดด หรือแอลกอฮอล์'
    },
    {
      question: 'เครื่องตรวจวัดคลื่นหัวใจและสัญญาณชีพในห้อง ICU จัดเป็นคอมพิวเตอร์ประเภทใดตามสัญญาณประมวลผล?',
      hint: 'รับสัญญาณร่างกายที่เป็นแอนะล็อกต่อเนื่อง แล้วแปลงแสดงผลเป็นตัวเลขดิจิทัล',
      answer: 'Hybrid Computer (คอมพิวเตอร์แบบผสมผสาน)'
    },
    {
      question: 'บุคคลใดได้รับการยกย่องเป็น "บิดาแห่งคอมพิวเตอร์" และสร้างเครื่องใดเป็นต้นแบบคอมพิวเตอร์ยุคใหม่?',
      hint: 'เครื่องคำนวณเชิงวิเคราะห์มี 4 หน่วยพื้นฐาน Input, Mill, Store, Output',
      answer: 'Charles Babbage (ชาร์ลส์ แบบเบจ) สร้างเครื่อง Analytical Engine'
    }
  ];

  const traps = [
    'บิดาแห่งคอมพิวเตอร์ คือ Charles Babbage แต่บิดาแห่ง AI/วิทยาการคอมพิวเตอร์ คือ Alan Turing',
    'Dot Matrix เป็นเครื่องพิมพ์แบบเดียวที่พิมพ์กระดาษต่อเนื่องและสำเนาคาร์บอนหลายชั้นได้',
    'Thermal Printer ไม่ต้องใช้หมึก แต่ตัวหนังสือจะจางหายตามเวลาเมื่อโดนความร้อนหรือแอลกอฮอล์',
    'Touchscreen (จอสัมผัส) เป็นทั้ง Input และ Output Unit ในตัวเดียวกัน',
    'Hybrid Computer ใช้ในงานการแพทย์ (เครื่องตรวจชีพจร ICU) เพราะผสมผสานแอนะล็อกกับดิจิทัล'
  ];

  const recallTiles = [
    { label: '5 ยุค', value: 'หลอด → ซิสเตอร์ → IC → ไมโครชิป → AI' },
    { label: 'เครื่องพิมพ์', value: 'คาร์บอน = Dot Matrix / สลิป = Thermal' },
    { label: 'ข้อหลอก', value: 'Touchscreen เป็นทั้ง Input และ Output' }
  ];

  return (
    <div className={styles.seriesLesson}>
      <section className={styles.lessonHero}>
        <div>
          <span className={styles.lessonKicker}>หมวดที่ 1 · Hardware & Evolution</span>
          <h2>ฮาร์ดแวร์ วิวัฒนาการ และหน่วยแสดงผล</h2>
          <p>ปูพื้นฐานจากอดีตสู่ปัจจุบัน ทำความเข้าใจอุปกรณ์หลักในแต่ละยุค บุคคลสำคัญ และเจาะลึกประเภทเครื่องพิมพ์สำหรับเตรียมสอบ</p>
        </div>
        <div className={styles.lessonFormulaCard} aria-label="สูตรจำด่วน">
          <span>สูตรจำ 5 ยุคคอมพิวเตอร์</span>
          <strong>หลอด → ซิสเตอร์ → IC → ไมโครชิป → AI</strong>
          <small>สำเนาคาร์บอน = Dot Matrix / สลิป 7-11 = Thermal</small>
        </div>
      </section>

      <LessonVisual
        assets={assets}
        assetKey="computer-part-1-map"
        alt="แผนที่สรุป Part 1: 5 ยุคคอมพิวเตอร์ บุคคลสำคัญ และเครื่องพิมพ์ที่ข้อสอบชอบถาม"
      />

      <section className={styles.computerRecallRail} aria-label="คีย์จำของบทนี้">
        <div>
          <span>ก่อนเลื่อนลง</span>
          <strong>จำ 3 จุดนี้ให้ได้ก่อน</strong>
        </div>
        <div className={styles.computerRecallTiles}>
          {recallTiles.map((tile) => (
            <div key={tile.label}>
              <span>{tile.label}</span>
              <strong>{tile.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <RecallBlock id="computer-pioneers" index="01" title="บุคคลสำคัญ" hint="จับคู่คนกับผลงาน ไม่ต้องท่องย่อหน้ายาว" open>
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Pioneers & Origins</span>
          <h2>1. บุคคลสำคัญและประวัติเครื่องคำนวณยุคแรก</h2>
          <p>บุคคลสำคัญที่ข้อสอบออกบ่อยที่สุด ทำความเข้าใจหน้าที่และผลงานเพื่อไม่ให้จำสับสน</p>
        </div>
        <div className={styles.methodExampleGrid}>
          {pioneers.map((item) => (
            <article className={styles.methodExampleCard} key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#8b1e1e' }}>{item.tag}</span>
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#152033', fontSize: '18px' }}>{item.name}</h3>
              <strong style={{ color: '#8b1e1e', fontSize: '14px', display: 'block', marginBottom: '8px' }}>{item.title}</strong>
              <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: 1.6 }}>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
      </RecallBlock>

      <RecallBlock id="computer-generations" index="02" title="รายละเอียด 5 ยุค" hint="ดู timeline ก่อน แล้วค่อยเปิดทบทวนเฉพาะจุดที่ยังสับสน">
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Generations Timeline</span>
          <h2>2. ตารางเจาะลึก 5 ยุคของคอมพิวเตอร์</h2>
          <p>ท่องจำอุปกรณ์ควบคุมหลัก ภาษาที่ใช้ และสื่อบันทึกข้อมูลในแต่ละยุค</p>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {generations.map((g, idx) => (
            <div
              key={g.gen}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px minmax(0, 1fr)',
                gap: '16px',
                padding: '16px 20px',
                border: '1px solid #fee2e2',
                borderRadius: '14px',
                backgroundColor: idx % 2 === 0 ? '#fffdfd' : '#fff5f5'
              }}
            >
              <div>
                <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '6px', background: g.color, color: '#fff', fontSize: '11px', fontWeight: 900 }}>
                  {g.gen}
                </span>
                <strong style={{ display: 'block', marginTop: '6px', color: '#152033', fontSize: '14px' }}>{g.component}</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <div><b>ภาษา:</b> {g.language}</div>
                <div><b>สื่อบันทึก:</b> {g.storage}</div>
                <div style={{ color: '#64748b', marginTop: '4px' }}><b>ลักษณะเด่น:</b> {g.landmark}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </RecallBlock>

      <RecallBlock id="computer-types" index="03" title="ประเภทคอมพิวเตอร์" hint="แยกตามสัญญาณ และตามขนาดให้เห็นคนละแกน">
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Classification</span>
          <h2>3. การจำแนกประเภทคอมพิวเตอร์</h2>
        </div>
        <div className={styles.patternGrid}>
          {computerTypes.map((group) => (
            <div className={styles.patternCard} key={group.title}>
              <h3>{group.title}</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '8px' }}>
                {group.items.map((item) => (
                  <li key={item.name} style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                    <strong style={{ color: '#8b1e1e' }}>{item.name}</strong>: {item.desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      </RecallBlock>

      <LessonVisual
        assets={assets}
        assetKey="output-printers-guide"
        alt="เปรียบเทียบประเภทเครื่องพิมพ์และอุปกรณ์แสดงผล"
      />

      <RecallBlock id="computer-printers" index="04" title="เครื่องพิมพ์ที่ออกสอบ" hint="เริ่มจากสถานการณ์จริง: คาร์บอน, สลิป, รูปภาพ, เอกสาร, พิมพ์เขียว">
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Output Units & Printers</span>
          <h2>4. เจาะลึกประเภทเครื่องพิมพ์ (จุดตัดคะแนนสอบ)</h2>
          <p>แยกความแตกต่างระหว่างเครื่องพิมพ์แบบตีกระทบ (Impact) และไม่ตีกระทบ (Non-Impact)</p>
        </div>
        <div style={{ display: 'grid', gap: '14px' }}>
          {printers.map((p) => (
            <div
              key={p.name}
              style={{
                padding: '18px 22px',
                border: '1px solid #fee2e2',
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(21, 39, 66, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, color: p.type.includes('Impact') && !p.type.includes('Non') ? '#dc2626' : '#0284c7' }}>
                  {p.type}
                </span>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                  {p.badge}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#152033', fontSize: '17px' }}>{p.name}</h3>
              <p style={{ margin: '0 0 6px', color: '#475569', fontSize: '13px' }}><b>กลไก:</b> {p.how}</p>
              <p style={{ margin: '0 0 6px', color: '#8b1e1e', fontSize: '13px', fontWeight: 600 }}>{p.highlight}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}><b>การใช้งานจริง:</b> {p.useCase}</p>
            </div>
          ))}
        </div>
      </section>
      </RecallBlock>

      <RecallBlock id="computer-traps" index="05" title="จุดหลอกข้อสอบ" hint="อ่านส่วนนี้ก่อนทำโจทย์ เพื่อกันการจำสลับ" open>
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Exam Traps</span>
          <h2>5. จุดระวังข้อสอบหลอกที่เจอบ่อย</h2>
        </div>
        <div className={styles.checkGrid}>
          {traps.map((item) => (
            <div className={styles.checkItem} key={item}>
              <span aria-hidden="true">!</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
      </RecallBlock>

      <RecallBlock id="computer-practice" index="06" title="ทบทวน 4 ข้อ" hint="ตอบเองก่อน แล้วค่อยกดดูเฉลย" open>
      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Practice</span>
          <h2>6. ทบทวนความเข้าใจ 4 ข้อ (กดดูเฉลย)</h2>
          <p>ลองตอบด้วยตัวเองก่อนกดเปิดดูแนวคิดและคำตอบ</p>
        </div>
        <div className={styles.practiceGrid}>
          {practice.map((item, index) => (
            <details className={styles.practiceCard} key={item.question}>
              <summary>
                <span>ข้อ {index + 1}</span>
                <strong>{item.question}</strong>
              </summary>
              <p><b>แนวคิด:</b> {item.hint}</p>
              <p style={{ color: '#8b1e1e', fontWeight: 700 }}><b>คำตอบ:</b> {item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      </RecallBlock>

      <section className={styles.lessonSummary}>
        <h2>จำสั้นที่สุด</h2>
        <p>ยุค 1 หลอด, ยุค 2 ซิสเตอร์, ยุค 3 IC, ยุค 4 ไมโครชิป PC, ยุค 5 AI • พิมพ์สำเนาคาร์บอน = Dot Matrix • สลิป 7-11 ความร้อน = Thermal • พิมพ์เขียว = Plotter</p>
      </section>
    </div>
  );
}

// ==========================================
// PART 2: Software & Peopleware
// ==========================================
export function ComputerPart2Lesson({ assets }: { assets: StudySheetAsset[] }) {
  const softwareSuites = [
    {
      category: '1. ระบบฐานข้อมูล (Database)',
      prop: 'Microsoft Access',
      open: 'LibreOffice / OpenOffice Base',
      duty: 'จัดเก็บ ค้นหา ออกแบบตาราง และสร้างฟอร์มรายงานฐานข้อมูล'
    },
    {
      category: '2. ประมวลผลคำ (Word Processing)',
      prop: 'Microsoft Word',
      open: 'LibreOffice / OpenOffice Writer',
      duty: 'พิมพ์เอกสาร ทำหนังสือราชการ จดหมาย รายงาน'
    },
    {
      category: '3. ตารางคำนวณ (Spreadsheet)',
      prop: 'Microsoft Excel',
      open: 'LibreOffice / OpenOffice Calc',
      duty: 'วิเคราะห์ตัวเลข สูตรคำนวณ สถิติ กราฟ และบัญชี'
    },
    {
      category: '4. งานนำเสนอ (Presentation)',
      prop: 'Microsoft PowerPoint',
      open: 'LibreOffice / OpenOffice Impress',
      duty: 'สร้างสไลด์บรรยาย ภาพนิ่ง วิดีโอ และมัลติมีเดีย'
    },
    {
      category: '5. ตกแต่งภาพ (Graphic / Image Editing)',
      prop: 'Adobe Photoshop',
      open: 'GIMP (GNU Image Manipulation Program)',
      duty: 'รีทัช ตัดต่อ ตกแต่งภาพกราฟิก'
    }
  ];

  const dbmsList = [
    { name: 'Oracle Database', type: 'Commercial (Proprietary)', desc: 'ระบบฐานข้อมูลเชิงพาณิชย์ประสิทธิภาพและความเสถียรสูงสุด นิยมใช้ในองค์กรขนาดใหญ่และธนาคาร' },
    { name: 'Microsoft SQL Server', type: 'Commercial (Proprietary)', desc: 'ฐานข้อมูลระดับองค์กรยอดนิยมของ Microsoft ทำงานร่วมกับ Windows Server ได้อย่างสมบูรณ์แบบ' },
    { name: 'MySQL', type: 'Open Source (RDBMS)', desc: 'ฐานข้อมูล Open Source ยอดนิยมอันดับ 1 ของโลกในงานเว็บไซต์และเว็บแอปพลิเคชัน (ดูแลโดย Oracle)' },
    { name: 'PostgreSQL', type: 'Open Source (Object-Relational)', desc: 'ฐานข้อมูล Open Source ขั้นสูง โดดเด่นเรื่องความถูกต้องตามมาตรฐาน SQL และรองรับข้อมูลซับซ้อน' },
    { name: 'dBASE / FoxPro', type: 'Legacy DBMS', desc: 'ซอฟต์แวร์จัดการฐานข้อมูลในยุคบุกเบิกบนระบบปฏิบัติการ DOS และ Windows รุ่นแรกๆ (ออกสอบประวัติศาสตร์ซอฟต์แวร์)' }
  ];

  const peopleware = [
    {
      role: 'System Analyst (SA) - นักวิเคราะห์ระบบ',
      duty: 'สัมภาษณ์รวบรวม Requirements, วิเคราะห์ความเป็นไปได้, ออกแบบโครงสร้างระบบ Flowchart, DFD',
      trap: '⚠️ SA ไม่ได้มีหน้าที่เขียนโค้ด! เปรียบเหมือน "สถาปนิกผู้ออกแบบบ้าน"',
      color: '#8b1e1e'
    },
    {
      role: 'Programmer - นักเขียนโปรแกรม',
      duty: 'นำแบบร่างจาก SA มาเขียน Source Code ด้วยภาษาโปรแกรม (C, Java, Python), ทดสอบ และ Debug',
      trap: 'โปรแกรมเมอร์เปรียบเหมือน "วิศวกร/ช่างก่อสร้าง" ที่ลงมือพัฒนาตามแบบสเปกของ SA',
      color: '#0284c7'
    },
    {
      role: 'Database Administrator (DBA) - ผู้บริหารฐานข้อมูล',
      duty: 'ออกแบบโครงสร้างฐานข้อมูล, กำหนดสิทธิ์การเข้าถึง (User Authorization), สำรอง (Backup) และกู้คืนข้อมูล',
      trap: '⚠️ DBA ไม่ใช่คนพิมพ์ข้อมูล (Data Entry) แต่เป็นผู้คุมความปลอดภัยของตู้เซฟข้อมูล',
      color: '#059669'
    },
    {
      role: 'Computer Operator - ผู้ปฏิบัติการระบบ',
      duty: 'ควบคุมการทำงานของเครื่องเซิร์ฟเวอร์ในศูนย์ข้อมูล (Data Center), ตรวจสอบฮาร์ดแวร์, สั่งรันคิวงานประจำวัน',
      trap: 'Operator ดูแลการรันงานหน้าเครื่องจริง ไม่ได้วิเคราะห์ระบบหรือเขียนโค้ด',
      color: '#d97706'
    },
    {
      role: 'User / End-User - ผู้ใช้งานคอมพิวเตอร์',
      duty: 'นำโปรแกรมไปใช้งานจริงในการทำงานประจำวัน (พิมพ์งาน, บันทึกข้อมูล) และประเมินผลระบบ',
      trap: 'เป็นผู้ใช้งานระดับสุดท้าย และแจ้งความต้องการกลับไปยัง SA',
      color: '#7c3aed'
    }
  ];

  const licenses = [
    { name: 'Commercial / Proprietary', desc: 'มีลิขสิทธิ์ ปิดซอร์สโค้ด ต้องซื้อสิทธิ์การใช้งาน เช่น Windows, MS Office, Photoshop' },
    { name: 'Open Source', desc: 'เปิดเผยซอร์สโค้ด ให้ใช้งาน แก้ไข ดัดแปลง และเผยแพร่เสรี เช่น Linux, LibreOffice, MySQL' },
    { name: 'Freeware', desc: 'ใช้งานฟรี 100% แต่ไม่เปิดโค้ด ห้ามแก้ไขขายต่อ เช่น Line, Google Chrome, Acrobat Reader' },
    { name: 'Shareware (Trial)', desc: 'ให้ทดลองใช้ฟรีก่อนจำกัดเวลาหรือฟังก์ชัน หากใช้ต่อต้องจ่ายเงินซื้อ เช่น WinRAR' },
    { name: 'Public Domain', desc: 'ไม่มีลิขสิทธิ์คุ้มครองหรือผู้สร้างสละสิทธิ์ ใช้งานได้อย่างอิสระสูงสุด' }
  ];

  const practice = [
    {
      question: 'ข้อใดคือคู่โปรแกรมประมวลผลคำที่เป็น Open Source เทียบเท่า Microsoft Word?',
      hint: 'อยู่ในชุดโปรแกรม LibreOffice / OpenOffice',
      answer: 'LibreOffice Writer / OpenOffice Writer'
    },
    {
      question: 'ตำแหน่งใดมีหน้าที่กำหนดสิทธิ์การเข้าถึงข้อมูล สำรองข้อมูล (Backup) และกู้คืนฐานข้อมูล?',
      hint: 'ผู้บริหารจัดการความปลอดภัยและโครงสร้างของฐานข้อมูล',
      answer: 'Database Administrator (DBA)'
    },
    {
      question: 'ข้อใดจับคู่ระบบจัดการฐานข้อมูล (DBMS) แบบ Open Source ได้ถูกต้อง?',
      hint: 'เป็นระบบฐานข้อมูลยอดนิยมสำหรับเว็บแอปพลิเคชันและ Object-Relational',
      answer: 'MySQL และ PostgreSQL'
    },
    {
      question: 'หน้าที่หลักของ System Analyst (SA) คือข้อใด?',
      hint: 'SA วางโครงสร้างและออกแบบระบบ แต่ไม่ได้ลงมือเขียนโค้ดเอง',
      answer: 'วิเคราะห์ความต้องการของผู้ใช้ ออกแบบโครงสร้างระบบ (Flowchart / DFD) และประสานงานกับโปรแกรมเมอร์'
    }
  ];

  return (
    <div className={styles.seriesLesson}>
      <section className={styles.lessonHero}>
        <div>
          <span className={styles.lessonKicker}>หมวดที่ 2 · Software & Peopleware</span>
          <h2>ระบบซอฟต์แวร์และผู้ประสานงาน</h2>
          <p>ทำความเข้าใจการจำแนกลิขสิทธิ์ซอฟต์แวร์ เปรียบเทียบซอฟต์แวร์ 5 ค่ายหลัก และเคลียร์หน้าที่บุคลากร Peopleware ป้องกันโจทย์หลอก</p>
        </div>
        <div className={styles.lessonFormulaCard} aria-label="สูตรจำด่วน">
          <span>สูตรจำจับคู่ซอฟต์แวร์</span>
          <strong>Word ↔ Writer / Excel ↔ Calc / Access ↔ Base</strong>
          <small>SA = ออกแบบระบบ / DBA = คุมฐานข้อมูล / Programmer = เขียนโค้ด</small>
        </div>
      </section>

      <LessonVisual
        assets={assets}
        assetKey="software-peopleware-matrix"
        alt="ซอฟต์แวร์ 5 ค่ายหลักและบทบาทบุคลากร Peopleware"
      />

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Software Licenses</span>
          <h2>1. ประเภทสัญญาอนุญาตลิขสิทธิ์ซอฟต์แวร์</h2>
        </div>
        <div className={styles.formulaStrip}>
          {licenses.map((l) => (
            <div key={l.name}>
              <span>License</span>
              <strong style={{ fontSize: '16px' }}>{l.name}</strong>
              <p>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Software Comparison</span>
          <h2>2. ตารางเปรียบเทียบซอฟต์แวร์ 5 ค่ายหลัก (Proprietary vs Open Source)</h2>
          <p>จับคู่ระหว่างซอฟต์แวร์ลิขสิทธิ์เชิงพาณิชย์ กับซอฟต์แวร์โอเพนซอร์สเปิดเผยโค้ด</p>
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {softwareSuites.map((s) => (
            <div
              key={s.category}
              style={{
                padding: '16px 20px',
                border: '1px solid #fee2e2',
                borderRadius: '12px',
                background: '#fff',
                display: 'grid',
                gridTemplateColumns: '240px minmax(0, 1fr)',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ color: '#8b1e1e', fontSize: '14px', display: 'block' }}>{s.category}</strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{s.duty}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ padding: '6px 12px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '13px', fontWeight: 700 }}>
                  💰 {s.prop}
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 900 }}>↔</span>
                <span style={{ padding: '6px 12px', borderRadius: '8px', background: '#dcfce7', color: '#166534', fontSize: '13px', fontWeight: 700 }}>
                  🌐 {s.open}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Enterprise DBMS</span>
          <h2>3. 5 ค่ายระบบจัดการฐานข้อมูลยักษ์ใหญ่ (Database Systems)</h2>
        </div>
        <div className={styles.methodExampleGrid}>
          {dbmsList.map((db) => (
            <article className={styles.methodExampleCard} key={db.name}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b1e1e' }}>{db.type}</span>
              <h3 style={{ margin: '4px 0 6px', color: '#152033', fontSize: '17px' }}>{db.name}</h3>
              <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: 1.55 }}>{db.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Peopleware Roles</span>
          <h2>4. บุคลากรทางคอมพิวเตอร์ (จำแนกหน้าที่กันโจทย์หลอก)</h2>
          <p>ลำดับความรับผิดชอบจากผู้ใช้งาน สู่นักวิเคราะห์ นักพัฒนา ผู้บริหารฐานข้อมูล และผู้ปฏิบัติการ</p>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {peopleware.map((p) => (
            <div
              key={p.role}
              style={{
                padding: '16px 20px',
                border: '1px solid #fee2e2',
                borderRadius: '14px',
                background: '#fffdfd'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color }} />
                <h3 style={{ margin: 0, color: '#152033', fontSize: '16px' }}>{p.role}</h3>
              </div>
              <p style={{ margin: '0 0 6px', color: '#334155', fontSize: '13px' }}><b>หน้าที่หลัก:</b> {p.duty}</p>
              <p style={{ margin: 0, color: '#8b1e1e', fontSize: '13px', fontWeight: 600 }}>{p.trap}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Practice</span>
          <h2>5. ทบทวนความเข้าใจ 4 ข้อ (กดดูเฉลย)</h2>
        </div>
        <div className={styles.practiceGrid}>
          {practice.map((item, index) => (
            <details className={styles.practiceCard} key={item.question}>
              <summary>
                <span>ข้อ {index + 1}</span>
                <strong>{item.question}</strong>
              </summary>
              <p><b>แนวคิด:</b> {item.hint}</p>
              <p style={{ color: '#8b1e1e', fontWeight: 700 }}><b>คำตอบ:</b> {item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.lessonSummary}>
        <h2>จำสั้นที่สุด</h2>
        <p>SA = ออกแบบระบบ • Programmer = เขียนโค้ด • DBA = ดูแลความปลอดภัยและ Backup ฐานข้อมูล • Word คู่ Writer • Excel คู่ Calc • Access คู่ Base</p>
      </section>
    </div>
  );
}

// ==========================================
// PART 3: Networking & Digital Application
// ==========================================
export function ComputerPart3Lesson({ assets }: { assets: StudySheetAsset[] }) {
  const ipComparison = [
    { label: 'ขนาดแอดเดรส', ipv4: '32 บิต (4 ไบต์)', ipv6: '128 บิต (16 ไบต์)' },
    { label: 'โครงสร้างการแบ่งกลุ่ม', ipv4: '4 ชุด (Octet) คั่นด้วยจุด (.)', ipv6: '8 กลุ่ม กลุ่มละ 4 หลัก คั่นด้วยโคลอน (:)' },
    { label: 'ระบบตัวเลขที่ใช้', ipv4: 'เลขฐานสิบ (0 ถึง 255)', ipv6: 'เลขฐานสิบหก (Hexadecimal: 0-9, A-F)' },
    { label: 'ตัวอย่างหมายเลขจริง', ipv4: '192.168.1.1', ipv6: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
    { label: 'จำนวนหมายเลขทั้งหมด', ipv4: 'ประมาณ 4.3 พันล้านเบอร์ (หมดแล้ว)', ipv6: 'ประมาณ 3.4 × 10³⁸ หมายเลข (รองรับ IoT ไร้ขีดจำกัด)' }
  ];

  const devices = [
    {
      name: 'Hub (ฮับ)',
      layer: 'Layer 1 (Physical)',
      desc: 'กระจายข้อมูลแบบ Broadcast ส่งไปทุกพอร์ต ไม่ดูปลายทาง ทำให้เปลืองแบนด์วิดท์และสัญญาณชนกัน (Collision) ได้ง่าย',
      badge: 'ส่งหว่านแห'
    },
    {
      name: 'Switch (สวิตช์)',
      layer: 'Layer 2 (Data Link)',
      desc: 'ส่งข้อมูลแบบเจาะจงเฉพาะเครื่องปลายทางในวง LAN โดยอ้างอิงจาก MAC Address มีความเร็วและความปลอดภัยสูงกว่า Hub',
      badge: 'ส่งตาม MAC'
    },
    {
      name: 'Router (เราเตอร์)',
      layer: 'Layer 3 (Network)',
      desc: 'เชื่อมต่อระหว่างเครือข่ายต่างชนิดกัน (เช่น LAN ในบ้าน กับ WAN อินเทอร์เน็ต) ค้นหาและเลือกเส้นทางที่ดีที่สุดตาม IP Address',
      badge: 'ส่งตาม IP / ข้ามเน็ต'
    },
    {
      name: 'Gateway (เกตเวย์)',
      layer: 'Protocol Translator',
      desc: 'ทำหน้าที่เป็นประตูแปลงโปรโตคอลระหว่างสองเครือข่ายที่มีสถาปัตยกรรมและโครงสร้างต่างกันโดยสิ้นเชิง',
      badge: 'แปลงโปรโตคอล'
    },
    {
      name: 'Access Point (AP)',
      layer: 'Wireless AP',
      desc: 'รับสัญญาณแลนมีสาย (Ethernet) แล้วกระจายออกเป็นคลื่นวิทยุไร้สาย Wi-Fi ให้สมาร์ทโฟนและคอมพิวเตอร์เชื่อมต่อ',
      badge: 'กระจาย Wi-Fi'
    }
  ];

  const ecommerce = [
    { model: 'B2B (Business to Business)', desc: 'ธุรกิจค้าส่งระหว่างบริษัท เช่น โรงงานชิ้นส่วนขายยางให้บริษัทผลิตรถยนต์ Toyota (Alibaba Wholesale)' },
    { model: 'B2C (Business to Consumer)', desc: 'ธุรกิจค้าปลีกขายตรงสู่ผู้บริโภครายย่อย เช่น ช้อปปิ้งออนไลน์ใน Shopee, Lazada, TikTok Shop, GrabFood' },
    { model: 'C2C (Consumer to Consumer)', desc: 'บุคคลทั่วไปซื้อขายแลกเปลี่ยนสินค้ามือสองกันเอง เช่น Kaidee, Facebook Marketplace, กลุ่มปล่อยของมือสอง' },
    { model: 'B2G (Business to Government)', desc: 'ภาคเอกชนประมูลงานหรือขายสินค้าให้ภาครัฐ เช่น ระบบจัดซื้อจัดจ้างภาครัฐ e-GP, งานประมูลก่อสร้าง' },
    { model: 'G2C (Government to Citizen)', desc: 'บริการดิจิทัลจากภาครัฐสู่ประชาชน เช่น ยื่นแบบภาษีออนไลน์ (e-Filing), ต่อทะเบียนรถออนไลน์, จองคิวใบขับขี่ DLT' }
  ];

  const practice = [
    {
      question: 'หมายเลข IP Address แบบ IPv4 และ IPv6 มีขนาดกี่บิตตามลำดับ?',
      hint: 'IPv4 ใช้เลขฐานสิบ 4 ชุด / IPv6 ใช้เลขฐานสิบหก 8 กลุ่ม',
      answer: 'IPv4 มีขนาด 32 บิต และ IPv6 มีขนาด 128 บิต'
    },
    {
      question: 'อุปกรณ์เครือข่ายใดทำหน้าที่เชื่อมต่อวง LAN ภายในสำนักงานออกสู่อินเทอร์เน็ต และเลือกเส้นทางตาม IP Address?',
      hint: 'ทำงานในระดับ Layer 3 Network Layer',
      answer: 'Router (เราเตอร์)'
    },
    {
      question: 'การยื่นแบบชำระภาษีเงินได้ออนไลน์ผ่านระบบ e-Filing ของกรมสรรพากร จัดเป็นโมเดล E-Commerce รูปแบบใด?',
      hint: 'บริการออนไลน์จากหน่วยงานรัฐบาลสู่ประชาชนทั่วไปโดยตรง',
      answer: 'G2C (Government to Citizen)'
    },
    {
      question: 'สายสัญญาณชนิดใดส่งข้อมูลด้วยคลื่นแสง มีความเร็วสูงสุด และไม่มีสัญญาณรบกวนทางแม่เหล็กไฟฟ้า (EMI)?',
      hint: 'ส่งผ่านเส้นแก้วบริสุทธิ์ นำมาใช้ในเทคโนโลยี FTTH (Fiber to the Home)',
      answer: 'สายใยแก้วนำแสง (Fiber Optic Cable)'
    }
  ];

  return (
    <div className={styles.seriesLesson}>
      <section className={styles.lessonHero}>
        <div>
          <span className={styles.lessonKicker}>หมวดที่ 3 · Networking & Digital Application</span>
          <h2>ระบบเครือข่าย IoT และ E-Commerce</h2>
          <p>เรียนรู้วิธีการเชื่อมต่อสื่อสารระหว่างคอมพิวเตอร์ โครงสร้าง IP สื่อกลาง อุปกรณ์เน็ตเวิร์ก เทคโนโลยี IoT Smart City และโมเดลธุรกิจดิจิทัล</p>
        </div>
        <div className={styles.lessonFormulaCard} aria-label="สูตรจำด่วน">
          <span>สูตรจำเครือข่าย & E-Commerce</span>
          <strong>IPv4: 32 บิต / IPv6: 128 บิต</strong>
          <small>Switch = MAC / Router = IP / e-Filing = G2C</small>
        </div>
      </section>

      <LessonVisual
        assets={assets}
        assetKey="network-iot-ecommerce-map"
        alt="ระบบเครือข่าย IoT และโมเดล E-Commerce"
      />

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>IP Address Matrix</span>
          <h2>1. เปรียบเทียบหมายเลขประจำเครื่อง (IPv4 vs IPv6)</h2>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {ipComparison.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 1fr',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid #fee2e2',
                borderRadius: '10px',
                background: '#fff',
                fontSize: '13px'
              }}
            >
              <strong style={{ color: '#152033' }}>{row.label}</strong>
              <span style={{ color: '#dc2626' }}><b>IPv4:</b> {row.ipv4}</span>
              <span style={{ color: '#0284c7' }}><b>IPv6:</b> {row.ipv6}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Network Devices</span>
          <h2>2. อุปกรณ์เครือข่ายพื้นฐานที่ข้อสอบชอบถาม</h2>
          <p>จำแนกระดับการทำงานและหน้าที่สำคัญของแต่ละอุปกรณ์</p>
        </div>
        <div className={styles.methodExampleGrid}>
          {devices.map((d) => (
            <article className={styles.methodExampleCard} key={d.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b1e1e' }}>{d.layer}</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#fef2f2', color: '#991b1b', fontWeight: 700 }}>
                  {d.badge}
                </span>
              </div>
              <h3 style={{ margin: '6px 0', color: '#152033', fontSize: '17px' }}>{d.name}</h3>
              <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: 1.55 }}>{d.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>IoT & Smart City</span>
          <h2>3. สถาปัตยกรรม IoT 4 ชั้น และการใช้งาน Smart City</h2>
        </div>
        <div className={styles.workedFlow}>
          <div>
            <span>1</span>
            <strong>Sensors</strong>
            <p>ตรวจวัดอุณหภูมิ ควัน ความชื้น แสงสว่าง การเคลื่อนไหว</p>
          </div>
          <div>
            <span>2</span>
            <strong>Gateway</strong>
            <p>ส่งผ่านข้อมูลไร้สาย Wi-Fi, 4G/5G, Zigbee, LoRaWAN</p>
          </div>
          <div>
            <span>3</span>
            <strong>Cloud AI</strong>
            <p>ประมวลผลบนคลาวด์ วิเคราะห์ Big Data และคาดการณ์</p>
          </div>
          <div>
            <span>4</span>
            <strong>Actuators</strong>
            <p>สั่งงานเปิด-ปิดวาล์ว ปรับไฟ ปลดล็อค แจ้งเตือนมือถือ</p>
          </div>
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>E-Commerce Models</span>
          <h2>4. 5 โมเดลความสัมพันธ์ของพาณิชย์อิเล็กทรอนิกส์</h2>
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {ecommerce.map((e) => (
            <div
              key={e.model}
              style={{
                padding: '14px 18px',
                border: '1px solid #fee2e2',
                borderRadius: '12px',
                background: '#fffdfd',
                display: 'grid',
                gridTemplateColumns: '220px minmax(0, 1fr)',
                gap: '14px',
                alignItems: 'center'
              }}
            >
              <strong style={{ color: '#8b1e1e', fontSize: '14px' }}>{e.model}</strong>
              <p style={{ margin: 0, color: '#334155', fontSize: '13px', lineHeight: 1.5 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Practice</span>
          <h2>5. ทบทวนความเข้าใจ 4 ข้อ (กดดูเฉลย)</h2>
        </div>
        <div className={styles.practiceGrid}>
          {practice.map((item, index) => (
            <details className={styles.practiceCard} key={item.question}>
              <summary>
                <span>ข้อ {index + 1}</span>
                <strong>{item.question}</strong>
              </summary>
              <p><b>แนวคิด:</b> {item.hint}</p>
              <p style={{ color: '#8b1e1e', fontWeight: 700 }}><b>คำตอบ:</b> {item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.lessonSummary}>
        <h2>จำสั้นที่สุด</h2>
        <p>IPv4 32 บิต / IPv6 128 บิต • Switch ส่งตาม MAC • Router ส่งตาม IP ข้ามเน็ต • ใยแก้ว FTTH เร็วสุดไร้คลื่นกวน • ยื่นภาษี e-Filing = G2C</p>
      </section>
    </div>
  );
}

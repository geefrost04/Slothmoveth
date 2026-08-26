import Link from 'next/link';
import type { StudySheetAsset, StudySheetBundle, StudySheetSection } from '@/lib/study-sheet-types';
import { getStudySheetAssetUrl } from '@/lib/study-sheets';
import { SafeMarkdown } from './SafeMarkdown';
import { PrintStudySheetButton } from './PrintStudySheetButton';
import { BackToTopButton } from './BackToTopButton';
import styles from './StudySheetReader.module.css';

function sectionHref(sheet: StudySheetBundle['sheet'], section: StudySheetSection) {
  return `/courses/${sheet.course_id}/${sheet.subject_id}/summary/${section.slug}`;
}

function SectionLink({ sheet, section, current }: { sheet: StudySheetBundle['sheet']; section: StudySheetSection; current: boolean }) {
  return (
    <Link href={sectionHref(sheet, section)} className={current ? styles.tocLinkActive : styles.tocLink} aria-current={current ? 'page' : undefined}>
      <span className={styles.tocNumber}>{section.section_type === 'quick_review' ? '★' : String(section.chapter_no).padStart(2, '0')}</span>
      <span>{section.title}</span>
    </Link>
  );
}

function Pager({ sheet, previous, next }: { sheet: StudySheetBundle['sheet']; previous?: StudySheetSection; next?: StudySheetSection }) {
  return (
    <nav className={styles.pager} aria-label="เปลี่ยนบท">
      {previous ? <Link href={sectionHref(sheet, previous)} className={styles.prevBtn}>‹ <span>ก่อนหน้า</span></Link> : <span />}
      {next ? <Link href={sectionHref(sheet, next)} className={styles.nextBtn}><span>ถัดไป</span> ›</Link> : <span />}
    </nav>
  );
}

function LessonAsset({ assets, assetKey }: { assets: StudySheetAsset[]; assetKey: string }) {
  const asset = assets.find((item) => item.asset_key === assetKey);
  const src = asset ? getStudySheetAssetUrl(asset) : null;
  if (!asset || !src) return null;

  return (
    <figure className={styles.lessonAsset}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Study-sheet assets are static public SVGs. */}
      <img src={src} alt={asset.alt_text} loading="lazy" />
      <figcaption>{asset.description}</figcaption>
    </figure>
  );
}

function SeriesImageSlot({ label, title, description, assetName }: { label: string; title: string; description: string; assetName: string }) {
  return (
    <figure className={styles.seriesImageSlot}>
      <div aria-hidden="true">
        <span>{label}</span>
        <strong>{title}</strong>
        <small>{assetName}</small>
      </div>
      <figcaption>{description}</figcaption>
    </figure>
  );
}

function SeriesConceptVisual({ assets, assetKey, label, title, description, assetName }: { assets: StudySheetAsset[]; assetKey: string; label: string; title: string; description: string; assetName: string }) {
  const asset = assets.find((item) => item.asset_key === assetKey);
  const src = asset ? getStudySheetAssetUrl(asset) : null;
  if (asset && src) return <LessonAsset assets={assets} assetKey={assetKey} />;
  return <SeriesImageSlot label={label} title={title} description={description} assetName={assetName} />;
}

const COURSE_LABELS: Record<string, string> = {
  police_admin: 'นายสิบตำรวจ'
};

const SUBJECT_LABELS: Record<string, string> = {
  math: 'ความรู้ทั่วไป',
  computer: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
  thai: 'ภาษาไทย',
  saraban: 'ระเบียบงานสารบรรณ',
  law: 'กฎหมายที่ประชาชนควรรู้',
  english: 'ภาษาอังกฤษ'
};

function getSectionHeadings(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+)$/)?.[1]?.trim())
    .filter((title): title is string => Boolean(title))
    .slice(0, 8);
}

function ComputerSheetMap({
  sheet,
  sections,
  current
}: {
  sheet: StudySheetBundle['sheet'];
  sections: StudySheetSection[];
  current: StudySheetSection;
}) {
  const headings = getSectionHeadings(current.content_md);

  return (
    <section className={styles.computerGuide} aria-label="สารบัญชีทคอมพิวเตอร์">
      <div className={styles.computerGuideHeader}>
        <span>Study Map</span>
        <h2>สารบัญชีทคอมพิวเตอร์ 5 Part</h2>
        <p>อ่านเรียงจาก Part 1 ถึง Part 5 เพื่อให้เนื้อหาต่อจากพื้นฐานเครื่อง ไปซอฟต์แวร์ เครือข่าย ความปลอดภัย และเทคโนโลยีใหม่</p>
      </div>

      <nav className={styles.computerPartGrid}>
        {sections.map((section) => (
          <Link
            key={section.id}
            href={sectionHref(sheet, section)}
            className={section.id === current.id ? styles.computerPartActive : styles.computerPartCard}
            aria-current={section.id === current.id ? 'page' : undefined}
          >
            <span>Part {section.chapter_no}</span>
            <strong>{section.title}</strong>
          </Link>
        ))}
      </nav>

      {headings.length ? (
        <div className={styles.computerChapterMap}>
          <div>
            <span>กำลังอ่าน</span>
            <strong>Part {current.chapter_no}: {current.title}</strong>
          </div>
          <ul>
            {headings.map((heading) => <li key={heading}>{heading}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function SeriesLesson({ assets }: { assets: StudySheetAsset[] }) {
  const observationTips = [
    {
      title: 'เลขเพิ่มเท่า ๆ กัน',
      clue: 'ผลต่างระหว่างตัวติดกันเท่ากัน',
      example: '4, 7, 10, 13',
      action: 'ใช้อนุกรมเลขคณิต'
    },
    {
      title: 'เลขโตเร็วมาก',
      clue: 'จากตัวหนึ่งไปอีกตัวเหมือนคูณซ้ำ',
      example: '2, 6, 18, 54',
      action: 'ลองหารพจน์หลังด้วยพจน์หน้า'
    },
    {
      title: 'ผลต่างยังไม่เท่า',
      clue: 'ลบชั้นแรกไม่คงที่ แต่ผลต่างเพิ่มเป็นจังหวะ',
      example: '2, 6, 12, 20, 30',
      action: 'หา Delta²'
    },
    {
      title: 'เลขขึ้นลงแปลก ๆ',
      clue: 'พจน์คี่กับพจน์คู่อาจคนละกฎ',
      example: '2, 10, 4, 20, 6',
      action: 'แยกช่องคี่และช่องคู่'
    }
  ];

  const patternTypes = [
    { title: 'เลขคณิต', clue: 'เพิ่มหรือลดเท่าเดิม', example: '2, 5, 8, 11', action: 'ลบหาค่า Delta' },
    { title: 'เรขาคณิต', clue: 'คูณหรือหารเท่าเดิม', example: '3, 6, 12, 24', action: 'หาอัตราส่วนร่วม' },
    { title: 'สองชั้น', clue: 'ผลต่างยังไม่เท่า แต่ผลต่างของผลต่างเท่า', example: '2, 6, 12, 20', action: 'หา Delta แล้วหา Delta²' },
    { title: 'สลับชุด', clue: 'เลขคี่กับเลขคู่เดินคนละกฎ', example: '2, 10, 4, 20, 6', action: 'แยกช่อง 1,3,5 และ 2,4,6' }
  ];

  const checkpoints = ['ลบตัวติดกันแล้วคงที่ไหม', 'ถ้าไม่คงที่ ลบผลต่างอีกชั้นไหม', 'เลขโตเร็วแบบคูณหรือหารไหม', 'พจน์คี่/คู่แยกแล้วง่ายขึ้นไหม', 'เป็นเลขกำลังหรือ Fibonacci ไหม'];

  const workedExamples = [
    {
      title: 'แบบที่ 1: บวกเท่าเดิม',
      problem: '3, 7, 11, 15, ?',
      observe: 'ผลต่างคือ +4 ทุกครั้ง',
      method: '15 + 4',
      answer: '19'
    },
    {
      title: 'แบบที่ 2: คูณเท่าเดิม',
      problem: '2, 6, 18, 54, ?',
      observe: 'แต่ละพจน์คูณ 3',
      method: '54 × 3',
      answer: '162'
    },
    {
      title: 'แบบที่ 3: ผลต่างสองชั้น',
      problem: '1, 4, 9, 16, ?',
      observe: 'ผลต่างคือ +3, +5, +7 เพิ่มทีละ 2',
      method: 'ผลต่างถัดไป +9',
      answer: '25'
    },
    {
      title: 'แบบที่ 4: สลับคี่-คู่',
      problem: '2, 10, 4, 20, 6, ?',
      observe: 'ช่องคี่ 2,4,6 เพิ่มทีละ 2 / ช่องคู่ 10,20 เพิ่มทีละ 10',
      method: 'ช่องคู่ถัดไป 20 + 10',
      answer: '30'
    },
    {
      title: 'แบบที่ 5: Fibonacci',
      problem: '1, 1, 2, 3, 5, ?',
      observe: 'สองพจน์ก่อนหน้าบวกกันได้พจน์ถัดไป',
      method: '3 + 5',
      answer: '8'
    },
    {
      title: 'แบบที่ 6: เลขกำลังสอง',
      problem: '4, 9, 16, 25, ?',
      observe: 'คือ 2², 3², 4², 5²',
      method: 'ตัวถัดไป 6²',
      answer: '36'
    }
  ];

  const practiceItems = [
    { question: '5, 9, 13, 17, ?', hint: 'ผลต่างคงที่', answer: '21' },
    { question: '3, 6, 12, 24, ?', hint: 'คูณเท่าเดิม', answer: '48' },
    { question: '2, 5, 10, 17, 26, ?', hint: 'ผลต่างคือ +3, +5, +7, +9', answer: '37' },
    { question: '1, 8, 2, 16, 3, ?', hint: 'แยกพจน์คี่/คู่', answer: '24' }
  ];

  return (
    <div className={`${styles.lesson} ${styles.seriesLesson}`}>
      <section className={styles.lessonHero}>
        <div>
          <span className={styles.lessonKicker}>สื่อการสอนสำหรับผู้เริ่มต้น</span>
          <h2>อนุกรมคือการหา “กฎ” ไม่ใช่การเดาเลข</h2>
          <p>บทนี้พาไล่จากวิธีง่ายที่สุดไปหาวิธีที่ซับซ้อนขึ้น เหมาะกับคนที่ยังไม่มั่นใจเรื่องสูตร ยกกำลัง หรือสัญลักษณ์ทางคณิตศาสตร์</p>
        </div>
        <div className={styles.lessonFormulaCard} aria-label="แนวคิดหลัก">
          <span>โจทย์</span>
          <strong>2, 6, 12, 20, 30, ?</strong>
          <small>หากฎให้เจอ แล้วค่อยเติมช่องว่าง</small>
        </div>
      </section>

      <SeriesConceptVisual
        assets={assets}
        assetKey="series-hidden-pattern"
        label="Image 01"
        title="อนุกรมคือการค้นหากฎที่ซ่อนอยู่"
        description="พื้นที่ภาพประกอบ Concept สำหรับอธิบายว่าผู้เรียนต้องมองหากฎก่อนเติมคำตอบ ภาพจริงให้สร้างผ่าน ChatGPT ตามไฟล์ IMAGE_REQUESTS.md"
        assetName="series-hidden-pattern.png"
      />

      <section className={`${styles.lessonSection} ${styles.lessonSectionPlain}`}>
        <div className={styles.lessonSectionHeader}>
          <span>Observation</span>
          <h2>วิธีสังเกตก่อนเริ่มคำนวณ</h2>
          <p>มองภาพรวมของตัวเลขก่อนว่า “เดินแบบไหน” แล้วค่อยเลือกวิธีคิด จะช่วยลดการลองผิดลองถูกได้มาก</p>
        </div>
        <div className={styles.exampleGrid}>
          {observationTips.map((item) => (
            <article className={styles.exampleCard} key={item.title}>
              <h3>{item.title}</h3>
              <div><span>สังเกต</span><strong>{item.clue}</strong></div>
              <div><span>ตัวอย่าง</span><strong>{item.example}</strong></div>
              <p>{item.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.lessonSection} ${styles.lessonSectionPlain}`}>
        <div className={styles.lessonSectionHeader}>
          <span>Step Order</span>
          <h2>ลำดับการคิดจากง่ายไปยาก</h2>
          <p>ถ้าด่านแรกไม่ใช่ ค่อยขยับไปด่านต่อไป อย่ากระโดดไปสูตรยากทันที</p>
        </div>
        <div className={styles.lessonSteps}>
          {['ลบก่อน', 'ลบซ้ำ', 'คูณ/หาร', 'แยกคี่คู่', 'ดูเลขพิเศษ'].map((step, index) => (
            <div className={styles.lessonStep} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.lessonSection} ${styles.lessonSectionSplit}`}>
        <div className={styles.lessonSectionHeader}>
          <span>Pattern Library</span>
          <h2>4 รูปแบบที่เจอบ่อยในข้อสอบ</h2>
          <p>จำ “สัญญาณที่เห็น” ให้ได้ก่อน แล้วค่อยเลือกเครื่องมือคิดให้ตรงแบบ</p>
        </div>
        <div className={styles.patternGrid}>
          {patternTypes.map((item) => (
            <article className={styles.patternCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.clue}</p>
              <code>{item.example}</code>
              <strong>{item.action}</strong>
            </article>
          ))}
        </div>
      </section>

      <SeriesConceptVisual
        assets={assets}
        assetKey="series-pattern-scan"
        label="Image 02"
        title="สแกน Pattern: Difference → Ratio → Power → Odd/Even"
        description="พื้นที่ภาพพักสายตาสำหรับแสดง flow การสแกน pattern แบบ visual ภาพจริงให้สร้างผ่าน ChatGPT เท่านั้น"
        assetName="series-pattern-scan.png"
      />

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Worked Example</span>
          <h2>ตัวอย่าง: มองให้เห็น Delta และ Delta²</h2>
          <p>โจทย์ชุดนี้ผลต่างชั้นแรกยังไม่คงที่ แต่ผลต่างชั้นสองคงที่ จึงหาคำตอบได้เป็นขั้นตอน</p>
        </div>
        <div className={styles.answerPanel}>
          <div>
            <span>โจทย์</span>
            <strong>2, 6, 12, 20, 30, ?</strong>
          </div>
          <div>
            <span>เห็นอะไร</span>
            <strong>+4, +6, +8, +10 เพิ่มทีละ +2</strong>
          </div>
          <div>
            <span>ตอบ</span>
            <strong>30 + 12 = 42</strong>
          </div>
        </div>
        <div className={styles.workedFlow} aria-label="ลำดับวิธีคิดตัวอย่างอนุกรม">
          <div><span>1</span><strong>ลบชั้นแรก</strong><p>+4, +6, +8, +10</p></div>
          <div><span>2</span><strong>ลบชั้นสอง</strong><p>+2, +2, +2</p></div>
          <div><span>3</span><strong>เติมผลต่างถัดไป</strong><p>10 + 2 = 12</p></div>
          <div><span>4</span><strong>หาคำตอบ</strong><p>30 + 12 = 42</p></div>
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>More Examples</span>
          <h2>ตัวอย่างหลายแบบที่ควรฝึกจำทาง</h2>
          <p>แต่ละข้อให้เริ่มจาก “สังเกตอะไร” ก่อน แล้วจึงคำนวณคำตอบ</p>
        </div>
        <div className={styles.methodExampleGrid}>
          {workedExamples.map((item) => (
            <article className={styles.methodExampleCard} key={item.problem}>
              <h3>{item.title}</h3>
              <ol>
                <li><b>โจทย์:</b> {item.problem}</li>
                <li><b>สังเกต:</b> {item.observe}</li>
                <li><b>วิธีคิด:</b> {item.method}</li>
              </ol>
              <strong>คำตอบ: {item.answer}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.lessonSection} ${styles.lessonSectionSplit}`}>
        <div className={styles.lessonSectionHeader}>
          <span>Memory Cards</span>
          <h2>ถ้าผลต่างไม่สวย ให้ลองมองเลขพิเศษ</h2>
          <p>เลขบางชุดไม่ได้เกิดจากการบวกเท่าเดิม เช่น คูณเท่าเดิม เลขกำลังสอง หรือเอาสองพจน์ก่อนหน้ามาบวกกัน</p>
        </div>
        <div className={styles.formulaStrip}>
          <div><span>เรขาคณิต</span><strong>3, 6, 12, 24</strong><p>คูณ 2 เท่าเดิม</p></div>
          <div><span>เลขกำลังสอง</span><strong>1, 4, 9, 16</strong><p>1², 2², 3², 4²</p></div>
          <div><span>Fibonacci</span><strong>1, 1, 2, 3, 5</strong><p>สองพจน์หน้าบวกกัน</p></div>
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Practice</span>
          <h2>ลองทำเองก่อนดูเฉลย</h2>
          <p>ให้บอกก่อนว่าเป็น pattern แบบไหน แล้วค่อยเปิดดูคำตอบ</p>
        </div>
        <div className={styles.practiceGrid}>
          {practiceItems.map((item, index) => (
            <details className={styles.practiceCard} key={item.question}>
              <summary>
                <span>ข้อ {index + 1}</span>
                <strong>{item.question}</strong>
              </summary>
              <p><b>แนวสังเกต:</b> {item.hint}</p>
              <p><b>คำตอบ:</b> {item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Check</span>
          <h2>ก่อนตอบ ให้ถามตัวเอง 5 ข้อนี้</h2>
        </div>
        <div className={styles.checkGrid}>
          {checkpoints.map((item) => (
            <div className={styles.checkItem} key={item}>
              <span aria-hidden="true">✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSummary}>
        <h2>จำสั้นที่สุด</h2>
        <p>อนุกรมไม่ใช่การเดาเลขถัดไป แต่คือการหากฎที่ใช้ได้กับทุกพจน์ก่อนหน้า แล้วเอากฎนั้นไปเติมช่องว่าง</p>
      </section>
    </div>
  );
}

function AnalogyLesson({ assets }: { assets: StudySheetAsset[] }) {
  const easyExamples = [
    {
      problem: 'หมอ : โรงพยาบาล = ครู : ?',
      bridge: 'คนทำงานในสถานที่หลัก',
      answer: 'โรงเรียน',
      note: 'อย่าตอบ “ห้องเรียน” เพราะเป็นส่วนย่อย ไม่ใช่สถานที่หลักของอาชีพ'
    },
    {
      problem: 'กรรไกร : ตัด = ปากกา : ?',
      bridge: 'สิ่งของใช้ทำหน้าที่อะไร',
      answer: 'เขียน',
      note: 'คำตอบต้องเป็นหน้าที่ ไม่ใช่ชนิดของสิ่งของ'
    },
    {
      problem: 'ล้อ : รถ = หน้า : หนังสือ',
      bridge: 'ส่วนย่อยของสิ่งใหญ่',
      answer: 'หน้าเป็นส่วนหนึ่งของหนังสือ',
      note: 'ข้อแบบนี้ให้ถามว่า “A เป็นส่วนหนึ่งของ B หรือไม่”'
    },
    {
      problem: 'ร้อน : เย็น = สูง : ?',
      bridge: 'คำตรงข้าม',
      answer: 'ต่ำ',
      note: 'ถ้าเป็นคู่ตรงข้าม คู่หลังต้องตรงข้ามเหมือนกัน'
    }
  ];

  const relationTypes = [
    { title: 'อาชีพ ↔ สถานที่', clue: 'ใครทำงานที่ไหน', example: 'หมอ : โรงพยาบาล' },
    { title: 'สิ่งของ ↔ หน้าที่', clue: 'ของชิ้นนี้ใช้ทำอะไร', example: 'กรรไกร : ตัด' },
    { title: 'ส่วนย่อย ↔ ทั้งหมด', clue: 'สิ่งหนึ่งเป็นส่วนหนึ่งของอะไร', example: 'ล้อ : รถ' },
    { title: 'ตรงข้าม', clue: 'ความหมายสวนทางกัน', example: 'ร้อน : เย็น' },
    { title: 'หมวดหมู่ ↔ สมาชิก', clue: 'อยู่ในกลุ่มเดียวกันไหม', example: 'แมว : สัตว์' },
    { title: 'เหตุ ↔ ผล', clue: 'สิ่งหนึ่งทำให้เกิดอีกสิ่ง', example: 'ฝนตก : ถนนเปียก' }
  ];

  const solveSteps = [
    {
      title: 'แต่งประโยคเชื่อมคู่แรก',
      detail: 'เปลี่ยน A:B ให้เป็นประโยคสั้น ๆ เช่น “หมอทำงานในโรงพยาบาล”'
    },
    {
      title: 'ใช้ประโยคเดิมกับคู่หลัง',
      detail: 'เอาโครงประโยคเดียวกันไปถามกับ C เช่น “ครูทำงานในอะไร”'
    },
    {
      title: 'ตัดตัวเลือกผิดหมวด',
      detail: 'ถ้าคำตอบต้องเป็นสถานที่ ให้ตัดคน สิ่งของ หรือหน้าที่ออกก่อน'
    },
    {
      title: 'เลือกคำที่ตรงที่สุด',
      detail: 'เลือกคำตอบที่ตรงความสัมพันธ์หลัก ไม่ใช่แค่คำที่เกี่ยวข้องหรือใกล้เคียง'
    }
  ];

  const miniPractice = [
    { question: 'ตำรวจ : สถานีตำรวจ = แพทย์ : ?', answer: 'โรงพยาบาล', hint: 'อาชีพกับสถานที่ทำงาน' },
    { question: 'ปลา : น้ำ = นก : ?', answer: 'อากาศ / ท้องฟ้า', hint: 'สิ่งมีชีวิตกับที่อยู่อาศัยหรือพื้นที่เคลื่อนที่' },
    { question: 'เมล็ด : ต้นไม้ = ไข่ : ?', answer: 'ไก่ / ลูกไก่', hint: 'จุดเริ่มต้นกับสิ่งที่เติบโตต่อมา' }
  ];

  const methodExamples = [
    {
      problem: 'ตา : มอง = หู : ?',
      step1: 'ตาใช้มอง',
      step2: 'หูใช้ทำอะไร',
      cut: 'ตัดคำที่เป็นอวัยวะหรือสถานที่ออก',
      answer: 'ฟัง'
    },
    {
      problem: 'กุญแจ : ล็อก = รหัสผ่าน : ?',
      step1: 'กุญแจใช้ปลด/เข้าถึงสิ่งที่ล็อก',
      step2: 'รหัสผ่านใช้ทำหน้าที่แบบเดียวกัน',
      cut: 'ตัดคำที่เป็นอุปกรณ์จริง เช่น ประตู หรือแม่กุญแจ',
      answer: 'เข้าถึง / ปลดล็อก'
    },
    {
      problem: 'บท : หนังสือ = ฉาก : ?',
      step1: 'บทเป็นส่วนหนึ่งของหนังสือ',
      step2: 'ฉากเป็นส่วนหนึ่งของอะไร',
      cut: 'ตัดคำที่เป็นคนหรือสถานที่ถ่ายทำ ถ้าโจทย์ถามส่วนประกอบ',
      answer: 'ละคร / ภาพยนตร์'
    },
    {
      problem: 'ขยัน : สำเร็จ = ประมาท : ?',
      step1: 'ขยันมักนำไปสู่ความสำเร็จ',
      step2: 'ประมาทมักนำไปสู่อะไร',
      cut: 'ตัดคำที่เป็นคำตรงข้ามเฉย ๆ ถ้า relation เป็นเหตุ-ผล',
      answer: 'ผิดพลาด / อุบัติเหตุ'
    },
    {
      problem: 'แม่ครัว : อาหาร = ช่างไม้ : ?',
      step1: 'แม่ครัวเป็นผู้ทำ/ผลิตอาหาร',
      step2: 'ช่างไม้เป็นผู้ทำ/ผลิตอะไร',
      cut: 'ตัดสถานที่ทำงาน เช่น โรงงาน หรือร้านค้า',
      answer: 'เฟอร์นิเจอร์ / งานไม้'
    },
    {
      problem: 'กลางวัน : กลางคืน = เปิด : ?',
      step1: 'กลางวันตรงข้ามกับกลางคืน',
      step2: 'เปิดตรงข้ามกับอะไร',
      cut: 'ตัดคำที่เกี่ยวกับเวลา เพราะคู่หลังเป็นการกระทำ',
      answer: 'ปิด'
    }
  ];

  return (
    <div className={styles.lesson}>
      <section className={styles.lessonHero}>
        <div>
          <span className={styles.lessonKicker}>บทที่ 2 · อุปมา อุปไมย</span>
          <h2>โจทย์เปรียบเทียบต้องหา “ตัวเชื่อม” ให้เจอ</h2>
          <p>A : B = C : ? ไม่ได้วัดว่าจำคำได้มากแค่ไหน แต่วัดว่าเรามองความสัมพันธ์ของคู่แรกออกหรือไม่ แล้วนำความสัมพันธ์เดียวกันไปใช้กับคู่หลังได้แม่นแค่ไหน</p>
        </div>
        <div className={styles.lessonFormulaCard} aria-label="รูปแบบโจทย์อุปมาอุปไมย">
          <span>โครงโจทย์</span>
          <strong>A : B = C : ?</strong>
          <small>หา relation ของ A กับ B แล้วใช้กับ C</small>
        </div>
      </section>

      <LessonAsset assets={assets} assetKey="analogy-bridge" />

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Reading Map</span>
          <h2>อ่านโจทย์เป็น 3 ชั้นก่อนตอบ</h2>
          <p>โจทย์อุปมาอุปไมยจะง่ายขึ้นมาก ถ้าเราไม่รีบเดาคำตอบ แต่แยกให้ออกว่าโจทย์ให้คู่แรกมาเพื่อบอก “ความสัมพันธ์” แบบไหน</p>
        </div>
        <div className={styles.answerPanel}>
          <div>
            <span>คู่แรก</span>
            <strong>A : B</strong>
            <p>ใช้หาตัวเชื่อม</p>
          </div>
          <div>
            <span>ตัวเชื่อม</span>
            <strong>A เกี่ยวกับ B อย่างไร</strong>
            <p>แปลงเป็นประโยคสั้น</p>
          </div>
          <div>
            <span>คู่หลัง</span>
            <strong>C : ?</strong>
            <p>ใช้ตัวเชื่อมเดิมกับ C</p>
          </div>
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Worked Examples</span>
          <h2>ตัวอย่างพื้นฐาน อ่านตามนี้จะเห็น pattern ชัด</h2>
          <p>ให้สังเกตว่าแต่ละข้อไม่ได้จำคำตอบ แต่หา “ประโยคเชื่อม” ก่อน แล้วคำตอบจะตามมาเอง</p>
        </div>
        <div className={styles.exampleGrid}>
          {easyExamples.map((item) => (
            <article className={styles.exampleCard} key={item.problem}>
              <h3>{item.problem}</h3>
              <div><span>ตัวเชื่อม</span><strong>{item.bridge}</strong></div>
              <div><span>คำตอบ</span><strong>{item.answer}</strong></div>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Relationship Types</span>
          <h2>ความสัมพันธ์ที่ออกสอบบ่อย</h2>
          <p>ถ้ารู้ประเภทความสัมพันธ์ จะตัดตัวเลือกผิดได้เร็วขึ้นมาก โดยเฉพาะข้อที่คำตอบดูใกล้เคียงกัน</p>
        </div>
        <LessonAsset assets={assets} assetKey="relationship-types" />
        <div className={styles.patternGrid}>
          {relationTypes.map((item) => (
            <article className={styles.patternCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.clue}</p>
              <code>{item.example}</code>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>4-Step Method</span>
          <h2>ขั้นตอนทำข้อสอบให้ไม่หลุดความสัมพันธ์</h2>
          <p>ใช้ 4 ขั้นนี้กับทุกข้อ โดยเฉพาะข้อที่ตัวเลือกดูคล้ายกันหลายคำ</p>
        </div>
        <div className={styles.lessonSteps}>
          {solveSteps.map((step, index) => (
            <div className={styles.lessonStep} key={step.title}>
              <span>{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
        <div className={styles.methodExamplePanel}>
          <div className={styles.lessonSectionHeader}>
            <span>Method Examples</span>
            <h2>ตัวอย่างใช้ 4 ขั้นตอนกับโจทย์จริง</h2>
            <p>อ่านจากซ้ายไปขวา: โจทย์ → ประโยคเชื่อม → เอาไปใช้กับคู่หลัง → ตัดตัวเลือกผิดหมวด → คำตอบ</p>
          </div>
          <div className={styles.methodExampleGrid}>
            {methodExamples.map((item) => (
              <article className={styles.methodExampleCard} key={item.problem}>
                <h3>{item.problem}</h3>
                <ol>
                  <li><b>คู่แรก:</b> {item.step1}</li>
                  <li><b>คู่หลัง:</b> {item.step2}</li>
                  <li><b>ตัดหลอก:</b> {item.cut}</li>
                </ol>
                <strong>คำตอบ: {item.answer}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Mini Practice</span>
          <h2>ลองทำเอง 3 ข้อ แล้วค่อยดูเฉลย</h2>
          <p>ก่อนเปิดเฉลย ให้พูดประโยคเชื่อมของคู่แรกออกมาก่อนเสมอ</p>
        </div>
        <div className={styles.practiceGrid}>
          {miniPractice.map((item, index) => (
            <details className={styles.practiceCard} key={item.question}>
              <summary>
                <span>ข้อ {index + 1}</span>
                <strong>{item.question}</strong>
              </summary>
              <p><b>แนวคิด:</b> {item.hint}</p>
              <p><b>คำตอบ:</b> {item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.lessonSection}>
        <div className={styles.lessonSectionHeader}>
          <span>Trap</span>
          <h2>จุดพลาดที่เจอบ่อย</h2>
          <p>โจทย์อุปมาอุปไมยมักหลอกด้วยคำที่ “เกี่ยวข้อง” แต่ไม่ใช่ความสัมพันธ์เดียวกัน</p>
        </div>
        <div className={styles.checkGrid}>
          {[
            'ตอบคำที่ใกล้เคียง แต่ไม่ตรงตัวเชื่อม',
            'เปลี่ยนโครงประโยคกลางคันระหว่างคู่แรกกับคู่หลัง',
            'ลืมตรวจหมวดคำ เช่น คน สถานที่ สิ่งของ หรือหน้าที่',
            'เลือกส่วนย่อยแทนสถานที่หลัก เช่น ห้องเรียน แทน โรงเรียน'
          ].map((item) => (
            <div className={styles.checkItem} key={item}>
              <span aria-hidden="true">!</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lessonSummary}>
        <h2>จำสั้นที่สุด</h2>
        <p>อุปมาอุปไมยให้ชนะด้วยประโยคเชื่อม: “A เกี่ยวกับ B อย่างไร” แล้วใช้ประโยคเดียวกันกับ “C เกี่ยวกับอะไร”</p>
      </section>
    </div>
  );
}

export function StudySheetReader({ bundle, current }: { bundle: StudySheetBundle; current: StudySheetSection }) {
  const { sheet, sections, assets } = bundle;
  const currentIndex = sections.findIndex((section) => section.id === current.id);
  const previous = sections[currentIndex - 1];
  const next = sections[currentIndex + 1];
  const chapterLabel = current.section_type === 'quick_review' ? 'Quick Review' : `บทที่ ${current.chapter_no}`;
  const courseLabel = COURSE_LABELS[sheet.course_id] ?? sheet.course_id;
  const subjectLabel = SUBJECT_LABELS[sheet.subject_id] ?? sheet.subject_id;
  const isComputerSheet = sheet.course_id === 'police_admin' && sheet.subject_id === 'computer';

  return (
    <div className={`${styles.readerShell} ${isComputerSheet ? styles.computerReader : ''} study-sheet-print-root`}>
      <BackToTopButton />
      <div className={styles.readerTopbar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/">หน้าแรก</Link><span>›</span>
            <Link href={`/courses/${sheet.course_id}`}>{courseLabel}</Link><span>›</span>
            <Link href={`/courses/${sheet.course_id}/${sheet.subject_id}`}>{subjectLabel}</Link><span>›</span>
            <span aria-current="page">{current.title}</span>
          </nav>
        </div>
      </div>

      <div className={styles.readerLayout}>
        <aside className={styles.desktopToc} aria-label="สารบัญชีทสรุป">
          <div className={styles.tocHeading}>
            <span>{sheet.title}</span>
            <strong>{courseLabel}</strong>
          </div>
          <div className={styles.progressLabel}><span>ความคืบหน้า</span><strong>{currentIndex + 1} / {sections.length} บท</strong></div>
          <div className={styles.progressTrack}><span style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }} /></div>
          <nav className={styles.tocList}>{sections.map((section) => <SectionLink key={section.id} sheet={sheet} section={section} current={section.id === current.id} />)}</nav>
        </aside>

        <main className={styles.content}>
          <details className={styles.mobileToc}>
            <summary><span>สารบัญ {sections.length} บท</span><strong>{chapterLabel} · {current.title}</strong></summary>
            <nav>{sections.map((section) => <SectionLink key={section.id} sheet={sheet} section={section} current={section.id === current.id} />)}</nav>
          </details>

          <article className={`${styles.chapter} ${(current.slug === 'chapter-01' || isComputerSheet) ? styles.chapterWide : ''}`}>
            <header className={styles.chapterHeader}>
              <div className={styles.chapterIcon} aria-hidden="true">
                {isComputerSheet ? '💻' : current.section_type === 'quick_review' ? '★' : '▤'}
              </div>
              <div>
                <span className={styles.eyebrow}>{chapterLabel}</span>
                <h1>{current.title}</h1>
                <p>{sheet.description}</p>
              </div>
            </header>

            <div className={styles.chapterTools}>
              <Pager sheet={sheet} previous={previous} next={next} />
              <PrintStudySheetButton />
            </div>

            {isComputerSheet ? <ComputerSheetMap sheet={sheet} sections={sections} current={current} /> : null}

            {currentIndex === 0 ? (
              <details className={styles.introPanel}>
                <summary>เกี่ยวกับชีทและวิธีใช้งาน</summary>
                <SafeMarkdown content={sheet.intro_md} assets={assets} id="sheet-intro" />
              </details>
            ) : null}

            {current.slug === 'chapter-01' ? <SeriesLesson assets={assets} /> : null}
            {current.slug === 'chapter-02' ? <AnalogyLesson assets={assets} /> : null}
            {current.slug !== 'chapter-01' && current.slug !== 'chapter-02' ? <SafeMarkdown content={current.content_md} assets={assets} id={current.slug} /> : null}

            {current.section_type === 'quick_review' ? (
              <section className={styles.references} aria-label="ข้อมูลอ้างอิง">
                <SafeMarkdown content={sheet.references_md} assets={assets} id="sheet-references" />
              </section>
            ) : null}

            <Pager sheet={sheet} previous={previous} next={next} />
          </article>
        </main>
      </div>

      <article className={styles.printDocument} aria-hidden="true">
        <SafeMarkdown content={sheet.intro_md} assets={assets} id="print-intro" />
        {sections.map((section) => (
          <section key={section.id} className={styles.printSection}>
            <SafeMarkdown content={section.content_md} assets={assets} id={`print-${section.slug}`} />
          </section>
        ))}
        <SafeMarkdown content={sheet.references_md} assets={assets} id="print-references" />
      </article>
    </div>
  );
}

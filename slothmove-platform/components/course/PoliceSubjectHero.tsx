import Link from 'next/link';
import styles from './PoliceSubjectHero.module.css';

type Outline = { label: string; title: string; meta: string }[];

// Table of contents shown on the notebook card. Subjects without an outline get a one-line description.
const SHEET_OUTLINES: Record<string, Outline> = {
  saraban: [
    { label: 'ภาค 1', title: 'ระเบียบสำนักนายกฯ ว่าด้วยงานสารบรรณ', meta: '8 บท' },
    { label: 'ภาค 2', title: 'ลักษณะที่ 54 สารบรรณตำรวจ', meta: '6 บท' },
    { label: '★', title: 'โน้ตทบทวนก่อนสอบ', meta: '2 หน้า' }
  ],
  computer: [
    { label: 'บท 1', title: 'ประวัติคอมพิวเตอร์และบุคคลสำคัญ', meta: '1 บท' },
    { label: 'บท 2–4', title: 'พื้นฐาน IT · การทำงานของเครื่อง · เครือข่าย', meta: '3 บท' },
    { label: 'บท 5', title: 'Word · Excel · PowerPoint', meta: '1 บท' },
    { label: 'บท 6–8', title: 'อินเทอร์เน็ต · ความปลอดภัย · เทคโนโลยีใหม่', meta: '3 บท' },
    { label: '★', title: 'โน้ตทบทวนก่อนสอบ', meta: '1 หน้า' }
  ]
};
const SHEET_TITLES: Record<string, string> = { saraban: 'โน้ตสรุป 2 ภาค', computer: 'โน้ตสรุป 8 บท' };

export function PoliceSubjectHero({
  subjectId,
  title,
  eyebrow,
  summary,
  highlight,
  hasSummary,
  summaryHref,
  setCount,
  questionCount,
  allFree,
  freeSets
}: {
  subjectId: string;
  title: string;
  eyebrow: string;
  summary: string;
  highlight: string;
  hasSummary: boolean;
  summaryHref: string;
  setCount: number;
  questionCount: number;
  allFree: boolean;
  freeSets: number;
}) {
  const outline = SHEET_OUTLINES[subjectId];

  return (
    <section className={styles.hero}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1>{title}</h1>
        <p className={styles.summary}>{summary}</p>
        <ul className={styles.facts}>
          <li><strong>{setCount}</strong> ชุด</li>
          <li><strong>{questionCount.toLocaleString('th-TH')}</strong> ข้อ</li>
          <li>{allFree ? 'ฟรีทั้งหมด' : `ฟรี ${freeSets} ชุด`}</li>
        </ul>
        <p className={styles.topics}><span>หัวข้อหลัก</span>{highlight}</p>
      </div>

      <aside className={`${styles.notebook} ${hasSummary ? '' : styles.notebookPending}`} aria-label="ชีทสรุป">
        <div className={styles.notebookHead}>
          <span>{hasSummary ? 'ชีทสรุป' : 'ชีทสรุป · กำลังจัดทำ'}</span>
          <h2>{hasSummary ? (SHEET_TITLES[subjectId] ?? `สรุป${title}`) : `สรุป${title}`}</h2>
        </div>
        {hasSummary && outline ? (
          <ol className={styles.outline}>
            {outline.map((row) => (
              <li key={row.title}>
                <span className={styles.rowLabel}>{row.label}</span>
                <span className={styles.rowTitle}>{row.title}</span>
                <span className={styles.rowMeta}>{row.meta}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.notebookText}>
            {hasSummary
              ? 'เรียงประเด็นสำคัญเป็นลำดับ พร้อมตัวอย่างและจุดที่ควรจำก่อนลงสนามสอบ'
              : 'กำลังเรียบเรียงสรุปให้กระชับ อ่านง่ายบนทุกหน้าจอ'}
          </p>
        )}
        {hasSummary ? (
          <Link href={summaryHref} className={styles.read}>
            อ่านโน้ตสรุป <b aria-hidden="true">→</b>
          </Link>
        ) : (
          <span className={styles.soon}>เร็ว ๆ นี้</span>
        )}
      </aside>
    </section>
  );
}

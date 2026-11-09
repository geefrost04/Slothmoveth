'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './PoliceCourseHome.module.css';
import own from './OnwrCourseHome.module.css';

export type OnwrSet = { id: string; title: string; href: string; questions: number; minutes: number };

export type OnwrSubjectCard = {
  id: string;
  title: string;
  desc: string;
  href: string;
  summaryHref: string | null;
  icon: string;
  lessonCount: number;
  sets: OnwrSet[];
};


// Facts from the announcement of 22 ต.ค. 2569 (ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน).
const KEY_DATES = [
  { date: '2–20 พ.ย. 2569', label: 'สมัครทาง onwr.thaijobjob.com' },
  { date: 'ภายใน 21 พ.ย.', label: 'ชำระค่าสมัคร 380 บาท' },
  { date: 'ภายใน 9 ธ.ค.', label: 'ประกาศผู้มีสิทธิสอบ + วันสอบข้อเขียน' },
  { date: 'ตั้งแต่ 11 ธ.ค.', label: 'พิมพ์บัตรประจำตัวสอบ' }
];

function useLatestScores(ids: string[]) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const key = ids.join('|');
  useEffect(() => {
    const next: Record<string, number> = {};
    for (const id of key.split('|').filter(Boolean)) {
      try {
        const raw = window.localStorage.getItem(`slothmove:exam-history:${id}`);
        const attempts = raw ? JSON.parse(raw) : [];
        if (Array.isArray(attempts) && attempts[0]?.total) next[id] = Math.round((attempts[0].score / attempts[0].total) * 100);
      } catch {
        // Page works without local history.
      }
    }
    setScores(next);
  }, [key]);
  return scores;
}

function tone(score?: number) {
  if (score === undefined) return '';
  return score >= 80 ? styles.good : score >= 60 ? styles.ok : styles.low;
}

// "Mini Drill ความรู้ทั่วไป: ตัวเลข…" → group "ความรู้ทั่วไป", theme "ตัวเลข…"
function drillParts(title: string) {
  const [head, ...rest] = title.split(':');
  return { group: head.replace(/^Mini Drill\s*/, '').trim(), theme: rest.join(':').trim() };
}

function TopicCard({ subject, no, scores }: { subject: OnwrSubjectCard; no: number; scores: Record<string, number> }) {
  return (
    <article className={own.subject}>
      <div className={own.subjectHead}>
        <span className={styles.subjectIcon} aria-hidden="true">{subject.icon}</span>
        <div>
          <span className={own.subjectNo}>หัวข้อที่ {no}</span>
          <h3><Link href={subject.href}>{subject.title}</Link></h3>
          <p>{subject.desc}</p>
        </div>
      </div>
      <div className={own.subjectActions}>
        {subject.summaryHref ? (
          <Link href={subject.summaryHref} className={own.read}>อ่านโน้ต {subject.lessonCount} บท <b aria-hidden="true">→</b></Link>
        ) : (
          <span className={own.soon}>โน้ตกำลังจัดทำ</span>
        )}
        {subject.sets.length ? (
          <span className={own.cells}>
            {subject.sets.map((set, setIndex) => {
              const score = scores[set.id];
              return (
                <Link key={set.id} href={set.href} className={`${styles.cell} ${tone(score)}`} aria-label={`${set.title}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ''}`}>
                  <b>ชุด {setIndex + 1}</b>
                  <small>{score !== undefined ? `${score}%` : `${set.questions} ข้อ`}</small>
                </Link>
              );
            })}
          </span>
        ) : (
          <span className={own.soon}>ข้อสอบกำลังจัดทำ</span>
        )}
      </div>
    </article>
  );
}

export function OnwrCourseHomeClient({
  miniMocks,
  drills,
  subjects,
  reviewHref,
  reviewCount
}: {
  miniMocks: OnwrSet[];
  drills: OnwrSet[];
  subjects: OnwrSubjectCard[];
  reviewHref: string | null;
  reviewCount: number;
}) {
  const scores = useLatestScores([...miniMocks, ...drills, ...subjects.flatMap((subject) => subject.sets)].map((set) => set.id));
  const totalSets = subjects.reduce((sum, subject) => sum + subject.sets.length, 0) + miniMocks.length + drills.length;
  const totalLessons = subjects.reduce((sum, subject) => sum + subject.lessonCount, 0);
  const general = subjects.slice(0, 3);
  const specific = subjects.slice(3);
  const drillGroups = drills.reduce<{ group: string; items: OnwrSet[] }[]>((groups, drill) => {
    const { group } = drillParts(drill.title);
    const found = groups.find((item) => item.group === group);
    if (found) found.items.push(drill);
    else groups.push({ group, items: [drill] });
    return groups;
  }, []);
  return (
    <div className={`${styles.page} ${own.page}`}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link><span>/</span><Link href="/courses">สนามสอบ</Link><span>/</span><span aria-current="page">สทนช.</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>พนักงานราชการ · สำนักงานทรัพยากรน้ำแห่งชาติ</span>
            <h1>เจ้าหน้าที่วิเคราะห์<br />นโยบายและแผน</h1>
            <p className={styles.lead}>โน้ตสรุปและข้อสอบครบทุกหัวข้อสอบข้อเขียนตามประกาศรับสมัคร 22 ต.ค. 2569 ฝึกฟรีทั้งหมด</p>
            <ul className={styles.facts}>
              <li><strong>4</strong> อัตรา</li>
              <li><strong>200</strong> คะแนนข้อเขียน</li>
              <li><strong>{totalLessons || '—'}</strong> บทเรียน</li>
              <li><strong>{totalSets || '—'}</strong> ชุดข้อสอบ</li>
            </ul>
          </div>

          <aside className={styles.path} aria-label="วันสำคัญ">
            <p className={styles.pathTitle}>วันสำคัญ</p>
            <ol className={own.dates}>
              {KEY_DATES.map((item) => (
                <li key={item.label}>
                  <b>{item.date}</b>
                  <span>{item.label}</span>
                </li>
              ))}
            </ol>
            <p className={own.rule}>ผ่านเมื่อได้ <b>60% ขึ้นไป</b> ทั้งสอบข้อเขียน (200) และสอบสัมภาษณ์ (100) · วุฒิ ป.ตรีทุกสาขา</p>
          </aside>
        </section>

        <nav className={styles.jump} aria-label="ไปยังส่วน">
          {miniMocks.length ? <a href="#mini">Mini Mock</a> : null}
          {drills.length ? <a href="#drill">Mini Drill รายวิชา</a> : null}
          <a href="#general">ความรู้ทั่วไป</a>
          <a href="#specific">ความรู้เฉพาะตำแหน่ง</a>
        </nav>

        {miniMocks.length ? (
          <section className={styles.section} aria-labelledby="mini">
            <header className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>ลองสนามสั้น</span>
                <h2 id="mini">Mini Mock</h2>
                <p>30 ข้อ · 36 นาที · คละครบ 9 หัวข้อตามประกาศ เหมาะสำหรับวัดระดับก่อนอ่าน</p>
              </div>
            </header>
            <div className={styles.miniGrid}>
              {miniMocks.map((mini, index) => {
                const score = scores[mini.id];
                return (
                  <Link href={mini.href} className={`${styles.miniCard} ${tone(score)}`} key={mini.id}>
                    <span className={styles.miniNo}>{index + 1}</span>
                    <span className={styles.miniText}>
                      <strong>Mini Mock ชุดที่ {index + 1}</strong>
                      <small>{mini.questions} ข้อ · {mini.minutes} นาที · ความรู้ทั่วไป + เฉพาะตำแหน่ง</small>
                    </span>
                    <span className={styles.miniState}>{score !== undefined ? `${score}%` : 'เริ่ม →'}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {drills.length ? (
          <section className={styles.section} aria-labelledby="drill">
            <header className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>ทวนเร็วรายวิชา</span>
                <h2 id="drill">Mini Drill</h2>
                <p>ชุดละ 10 ข้อ · 12 นาที แต่ละชุดเน้นเรื่องที่ออกบ่อย (ชี้ที่ชุดเพื่อดูธีม)</p>
              </div>
            </header>
            <div className={styles.drillGrid}>
              {drillGroups.map(({ group, items }) => (
                <div className={styles.drillRow} key={group}>
                  <strong className={styles.drillName}>{group}</strong>
                  <span className={styles.drillCells}>
                    {items.map((drill, index) => {
                      const score = scores[drill.id];
                      const { theme } = drillParts(drill.title);
                      return (
                        <Link
                          key={drill.id}
                          href={drill.href}
                          className={`${styles.cell} ${tone(score)}`}
                          title={theme || drill.title}
                          aria-label={`${drill.title}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ''}`}
                        >
                          <b>ชุด {index + 1}</b>
                          <small>{score !== undefined ? `${score}%` : `${drill.questions} ข้อ`}</small>
                        </Link>
                      );
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="general">
          <header className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>หัวข้อสอบตามประกาศ</span>
              <h2 id="general">ความรู้ทั่วไป</h2>
              <p>3 หัวข้อ · อ่านโน้ตแต่ละหัวข้อ แล้วทำข้อสอบย่อยของหัวข้อนั้น</p>
            </div>
          </header>
          <div className={own.subjects}>
            {general.map((subject, index) => <TopicCard key={subject.id} subject={subject} no={index + 1} scores={scores} />)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="specific">
          <header className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>หัวข้อสอบตามประกาศ</span>
              <h2 id="specific">ความรู้เฉพาะตำแหน่ง</h2>
              <p>6 หัวข้อ · เรียงตามลำดับในประกาศรับสมัคร</p>
            </div>
          </header>
          <div className={own.subjects}>
            {specific.map((subject, index) => <TopicCard key={subject.id} subject={subject} no={index + 1} scores={scores} />)}
          </div>
        </section>

        {reviewHref ? (
          <section className={styles.section} aria-labelledby="review">
            <Link href={reviewHref} className={own.review}>
              <span className={own.reviewIcon} aria-hidden="true">⭐</span>
              <span>
                <strong id="review">โน้ตทบทวนก่อนสอบ</strong>
                <small>{reviewCount} หน้า · คู่ที่ชอบสลับและตัวเลขที่ต้องจำของทุกหัวข้อ</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}

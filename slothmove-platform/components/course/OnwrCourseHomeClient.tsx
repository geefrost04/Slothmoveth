'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './PoliceCourseHome.module.css';
import own from './OnwrCourseHome.module.css';
import { thaiWrap } from '@/lib/thaiText';

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

// Short row labels so drill rows fit the police layout on phones.
const DRILL_GROUPS: Record<string, { label: string; icon: string }> = {
  'ความรู้ทั่วไป': { label: 'ความรู้ทั่วไป', icon: '🏛️' },
  'กฎหมายและแผนแม่บทน้ำ': { label: 'น้ำและแผนแม่บท', icon: '💧' },
  'นโยบาย แผน และการประเมินผล': { label: 'นโยบายและแผน', icon: '🧭' }
};

function SectionHead({ id, kicker, title, meta }: { id: string; kicker: string; title: string; meta: string }) {
  return (
    <header className={styles.sectionHead}>
      <div>
        <span className={styles.kicker}>{kicker}</span>
        <h2 id={id}>{title}</h2>
        <p>{thaiWrap(meta)}</p>
      </div>
    </header>
  );
}

function TopicGrid({ subjects }: { subjects: OnwrSubjectCard[] }) {
  return (
    <div className={styles.subjectGrid}>
      {subjects.map((subject) => (
        <Link href={subject.href} className={styles.subject} key={subject.id}>
          <span className={styles.subjectIcon} aria-hidden="true">{subject.icon}</span>
          <span className={styles.subjectText}>
            <strong>{thaiWrap(subject.title)}</strong>
            <small>{thaiWrap(subject.desc)}</small>
            <em>
              {subject.sets.length ? `${subject.sets.length} ชุด` : 'เร็ว ๆ นี้'}
              {subject.lessonCount ? ` · โน้ต ${subject.lessonCount} บท` : ''}
            </em>
          </span>
          <span className={styles.subjectArrow} aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

// ONWR landing on the same template as the police course page, in the water-blue theme.
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
  const topicSets = subjects.flatMap((subject) => subject.sets);
  const scores = useLatestScores([...miniMocks, ...drills, ...topicSets].map((set) => set.id));
  const done = (items: OnwrSet[]) => items.some((item) => scores[item.id] !== undefined);
  const firstOpen = (items: OnwrSet[]) => items.find((item) => scores[item.id] === undefined) ?? items[0];
  const general = subjects.slice(0, 3);
  const specific = subjects.slice(3);
  const drillGroups = drills.reduce<{ group: string; items: OnwrSet[] }[]>((groups, drill) => {
    const { group } = drillParts(drill.title);
    const found = groups.find((item) => item.group === group);
    if (found) found.items.push(drill);
    else groups.push({ group, items: [drill] });
    return groups;
  }, []);

  // Suggested path: short mixed test → quick drills → topic sets.
  const steps = [
    { label: 'Mini Mock', title: 'ลองสนามสั้น 30 ข้อ', note: 'ดูว่าหัวข้อไหนยังอ่อน', set: firstOpen(miniMocks), done: done(miniMocks) },
    { label: 'Mini Drill', title: 'ทวนเร็วชุดละ 10 ข้อ', note: 'เน้นเรื่องที่ออกบ่อย', set: firstOpen(drills), done: done(drills), href: '#drill' },
    { label: 'ข้อสอบรายหัวข้อ', title: 'ฝึกครบ 9 หัวข้อ', note: 'อ่านโน้ตแล้วทำชุดของหัวข้อนั้น', set: firstOpen(topicSets), done: done(topicSets), href: '#general' }
  ];
  const nextStep = steps.find((step) => !step.done) ?? steps[2];
  const nextHref = nextStep.href ?? nextStep.set?.href ?? '#general';
  const anyDone = steps.some((step) => step.done);

  return (
    <div className={`${styles.page} ${own.page}`}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link><span>/</span><Link href="/courses">สนามสอบ</Link><span>/</span><span aria-current="page">สทนช.</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>พนักงานราชการ · สทนช. · ฟรีทั้งหมด</span>
            <h1>เจ้าหน้าที่วิเคราะห์<br />นโยบายและแผน</h1>
            <p className={styles.lead}>{thaiWrap('โน้ตสรุปและข้อสอบพร้อมเฉลย ครบทุกหัวข้อสอบข้อเขียนตามประกาศรับสมัคร 22 ต.ค. 2569 ไม่ต้องสมัครก็เริ่มได้')}</p>
            <ul className={styles.facts}>
              <li><strong>{miniMocks.length}</strong> Mini Mock</li>
              <li><strong>{drills.length}</strong> Mini Drill</li>
              <li><strong>{topicSets.length}</strong> ชุดรายหัวข้อ</li>
              <li><strong>9</strong> หัวข้อ</li>
            </ul>
          </div>

          <aside className={styles.path} aria-label="เส้นทางแนะนำ">
            <p className={styles.pathTitle}>{anyDone ? 'ทำต่อจากที่ค้างไว้' : 'ไม่รู้จะเริ่มตรงไหน? ทำตามนี้'}</p>
            <ol>
              {steps.map((step, index) => (
                <li key={step.label} className={`${step.done ? styles.stepDone : ''} ${step === nextStep ? styles.stepNow : ''}`}>
                  <span className={styles.stepNo}>{step.done ? '✓' : index + 1}</span>
                  <span className={styles.stepText}>
                    <b>{step.label}</b> · {step.title}
                    <small>{step.note}</small>
                  </span>
                </li>
              ))}
            </ol>
            <Link href={nextHref} className={styles.pathCta}>
              {anyDone ? 'ทำต่อ' : 'เริ่ม'} {nextStep.label} ฟรี <b aria-hidden="true">→</b>
            </Link>
          </aside>
        </section>

        <nav className={styles.jump} aria-label="ไปยังส่วน">
          <a href="#dates">วันสำคัญ</a>
          {miniMocks.length ? <a href="#mini">Mini Mock</a> : null}
          {drills.length ? <a href="#drill">Mini Drill</a> : null}
          <a href="#general">ความรู้ทั่วไป</a>
          <a href="#specific">ความรู้เฉพาะตำแหน่ง</a>
        </nav>

        <section className={styles.section} aria-labelledby="dates">
          <SectionHead id="dates" kicker="ประกาศรับสมัคร 22 ต.ค. 2569" title="วันสำคัญ" meta="4 อัตรา · วุฒิ ป.ตรีทุกสาขา · สอบข้อเขียน 200 คะแนน และสัมภาษณ์ 100 คะแนน" />
          <div className={own.dateCard}>
            <ol className={own.dates}>
              {KEY_DATES.map((item) => (
                <li key={item.label}>
                  <b>{item.date}</b>
                  <span>{thaiWrap(item.label)}</span>
                </li>
              ))}
            </ol>
            <p className={own.rule}>{thaiWrap('ผ่านเมื่อได้คะแนนแต่ละครั้งไม่ต่ำกว่า 60% ทั้งสอบข้อเขียนและสอบสัมภาษณ์')}</p>
          </div>
        </section>

        {miniMocks.length ? (
          <section className={styles.section} aria-labelledby="mini">
            <SectionHead id="mini" kicker="ลองสนามสั้น" title="Mini Mock" meta="30 ข้อ · 36 นาที · คละครบ 9 หัวข้อ เหมาะสำหรับวัดระดับก่อนเริ่ม" />
            <div className={styles.miniGrid}>
              {miniMocks.map((mini, index) => {
                const score = scores[mini.id];
                return (
                  <Link href={mini.href} className={`${styles.miniCard} ${tone(score)}`} key={mini.id}>
                    <span className={styles.miniNo}>{index + 1}</span>
                    <span className={styles.miniText}>
                      <strong>Mini Mock ชุดที่ {index + 1}</strong>
                      <small>{mini.questions} ข้อ · {mini.minutes} นาที</small>
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
            <SectionHead id="drill" kicker="ทวนเร็ว" title="Mini Drill" meta="ชุดละ 10 ข้อ · 12 นาที แต่ละชุดเน้นเรื่องที่ออกบ่อย" />
            <div className={styles.drillGrid}>
              {drillGroups.map(({ group, items }) => {
                const meta = DRILL_GROUPS[group] ?? { label: group, icon: '📘' };
                return (
                  <div className={styles.drillRow} key={group}>
                    <span className={styles.drillIcon} aria-hidden="true">{meta.icon}</span>
                    <strong className={styles.drillName}>{meta.label}</strong>
                    <span className={styles.drillCells}>
                      {items.map((drill, index) => {
                        const score = scores[drill.id];
                        return (
                          <Link
                            key={drill.id}
                            href={drill.href}
                            className={`${styles.cell} ${tone(score)}`}
                            title={drillParts(drill.title).theme || drill.title}
                            aria-label={`${drill.title}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ''}`}
                          >
                            <b>ชุด {index + 1}</b>
                            <small>{score !== undefined ? `${score}%` : `${drill.questions} ข้อ`}</small>
                          </Link>
                        );
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="general">
          <SectionHead id="general" kicker="หัวข้อสอบตามประกาศ" title="ความรู้ทั่วไป" meta="3 หัวข้อ · แต่ละหัวข้อมีโน้ตสรุปและชุดข้อสอบ" />
          <TopicGrid subjects={general} />
        </section>

        <section className={styles.section} aria-labelledby="specific">
          <SectionHead id="specific" kicker="หัวข้อสอบตามประกาศ" title="ความรู้เฉพาะตำแหน่ง" meta="6 หัวข้อ · เรียงตามลำดับในประกาศรับสมัคร" />
          <TopicGrid subjects={specific} />
          {reviewHref ? (
            <Link href={reviewHref} className={`${styles.subject} ${own.reviewCard}`}>
              <span className={styles.subjectIcon} aria-hidden="true">⭐</span>
              <span className={styles.subjectText}>
                <strong>โน้ตทบทวนก่อนสอบ</strong>
                <small>{thaiWrap('คู่ที่ชอบสลับและตัวเลขที่ต้องจำของทุกหัวข้อ')}</small>
                <em>{reviewCount} หน้า</em>
              </span>
              <span className={styles.subjectArrow} aria-hidden="true">→</span>
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}

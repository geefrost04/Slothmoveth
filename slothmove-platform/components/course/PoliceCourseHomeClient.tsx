'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubjectIcon } from '@/components/icons/SubjectIcons';
import styles from './PoliceCourseHome.module.css';

export type HomeSet = { id: string; title: string; href: string; questions: number; minutes: number };
export type HomeSubject = {
  id: string;
  title: string;
  desc: string;
  hasSheet: boolean;
  href: string;
  setCount: number;
  drills: HomeSet[];
};

type Scores = Record<string, number>;

// Latest score per set, from the history ExamRunner keeps in this browser.
function useLatestScores(ids: string[]) {
  const [scores, setScores] = useState<Scores>({});
  const key = ids.join('|');
  useEffect(() => {
    const next: Scores = {};
    for (const id of key.split('|')) {
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

function setNo(title: string, fallback: number) {
  return title.match(/(?:ชุดที่|ชุด)\s*(\d+)/)?.[1] ?? String(fallback);
}

function SectionHead({ id, kicker, title, meta, link }: { id: string; kicker: string; title: string; meta: string; link?: { href: string; label: string } }) {
  return (
    <header className={styles.sectionHead}>
      <div>
        <span className={styles.kicker}>{kicker}</span>
        <h2 id={id}>{title}</h2>
        <p>{meta}</p>
      </div>
      {link ? <Link href={link.href} className={styles.headLink}>{link.label} →</Link> : null}
    </header>
  );
}

export function PoliceCourseHomeClient({
  courseId,
  mocks,
  miniMocks,
  subjects
}: {
  courseId: string;
  mocks: HomeSet[];
  miniMocks: HomeSet[];
  subjects: HomeSubject[];
}) {
  const drills = subjects.flatMap((subject) => subject.drills);
  const scores = useLatestScores([...mocks, ...miniMocks, ...drills].map((item) => item.id));
  const done = (items: HomeSet[]) => items.some((item) => scores[item.id] !== undefined);
  const firstOpen = (items: HomeSet[]) => items.find((item) => scores[item.id] === undefined) ?? items[0];

  // Suggested path: short mixed test → per-subject drills → full mock.
  const steps = [
    { label: 'Mini Mock', title: 'ลองสนามสั้น 30 ข้อ', note: 'ดูว่าวิชาไหนยังอ่อน', set: firstOpen(miniMocks), done: done(miniMocks) },
    { label: 'Mini Drill', title: 'ฝึกวิชาที่อ่อน 20 ข้อ', note: 'เลือกเฉพาะวิชาที่พลาด', set: firstOpen(drills), done: done(drills), href: '#drill' },
    { label: 'Mock Test', title: 'ซ้อมสนามจริง 150 ข้อ', note: 'จับเวลา 180 นาที ครบ 6 วิชา', set: firstOpen(mocks), done: done(mocks) }
  ];
  const nextStep = steps.find((step) => !step.done) ?? steps[2];
  const nextHref = nextStep.href ?? nextStep.set?.href ?? '#mock';
  const anyDone = steps.some((step) => step.done);

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link><span>/</span><Link href="/courses">สนามสอบ</Link><span>/</span><span aria-current="page">นายสิบตำรวจ</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>สนามสอบ · ฟรีทั้งหมด</span>
            <h1>นายสิบตำรวจ<br />สายอำนวยการ</h1>
            <p className={styles.lead}>ข้อสอบจำลองครบ 6 วิชา พร้อมเฉลยทุกข้อ ทำซ้ำได้ไม่จำกัด ไม่ต้องสมัครก็เริ่มได้</p>
            <ul className={styles.facts}>
              <li><strong>{mocks.length}</strong> Mock Test</li>
              <li><strong>{miniMocks.length}</strong> Mini Mock</li>
              <li><strong>{drills.length}</strong> Mini Drill</li>
              <li><strong>6</strong> วิชา</li>
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
          <a href="#mock">Mock Test</a>
          <a href="#mini">Mini Mock</a>
          <a href="#drill">Mini Drill รายวิชา</a>
          <a href="#subjects">คลังข้อสอบรายวิชา</a>
        </nav>

        {mocks.length ? (
          <section className={styles.section} aria-labelledby="mock">
            <SectionHead id="mock" kicker="จำลองสนามจริง" title="Mock Test" meta="150 ข้อ · 180 นาที · ครบ 6 วิชา พร้อมคะแนนแยกรายวิชา" link={{ href: `/courses/${courseId}/mock-test`, label: 'รายละเอียด Mock Test' }} />
            <ol className={styles.mockGrid}>
              {mocks.map((mock, index) => {
                const score = scores[mock.id];
                return (
                  <li key={mock.id}>
                    <Link href={mock.href} className={`${styles.mockCard} ${tone(score)}`}>
                      <span className={styles.mockNo}>{setNo(mock.title, index + 1).padStart(2, '0')}</span>
                      <span className={styles.mockLabel}>ชุดที่ {setNo(mock.title, index + 1)}</span>
                      <span className={styles.mockState}>{score !== undefined ? `ล่าสุด ${score}%` : 'ยังไม่ได้ทำ'}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {miniMocks.length ? (
          <section className={styles.section} aria-labelledby="mini">
            <SectionHead id="mini" kicker="ลองสนามสั้น" title="Mini Mock" meta="30 ข้อ · 35 นาที · ครบ 6 วิชา เหมาะสำหรับวัดระดับก่อนเริ่ม" />
            <div className={styles.miniGrid}>
              {miniMocks.map((mini, index) => {
                const score = scores[mini.id];
                return (
                  <Link href={mini.href} className={`${styles.miniCard} ${tone(score)}`} key={mini.id}>
                    <span className={styles.miniNo}>{index + 1}</span>
                    <span className={styles.miniText}>
                      <strong>Mini Mock ชุดที่ {index + 1}</strong>
                      <small>{mini.questions} ข้อ · {mini.minutes} นาที{mini.id.endsWith('-02') ? ' · ตัวอย่างจาก Mock Test ชุด 4' : ''}</small>
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
            <SectionHead id="drill" kicker="ฝึกเฉพาะวิชา" title="Mini Drill" meta="วิชาละ 20 ข้อ · 25 นาที เลือกวิชาที่อยากเก็บคะแนน" />
            <div className={styles.drillGrid}>
              {subjects.filter((subject) => subject.drills.length).map((subject) => (
                <div className={styles.drillRow} key={subject.id}>
                  <span className={styles.drillIcon} aria-hidden="true"><SubjectIcon subjectId={subject.id} size={20} /></span>
                  <strong className={styles.drillName}>{subject.title}</strong>
                  <span className={styles.drillCells}>
                    {subject.drills.map((drill, index) => {
                      const score = scores[drill.id];
                      return (
                        <Link
                          key={drill.id}
                          href={drill.href}
                          className={`${styles.cell} ${tone(score)}`}
                          aria-label={`${subject.title} ชุด ${index + 1}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ''}`}
                        >
                          <b>ชุด {index + 1}</b>
                          <small>{score !== undefined ? `${score}%` : '20 ข้อ'}</small>
                        </Link>
                      );
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="subjects">
          <SectionHead id="subjects" kicker="คลังข้อสอบ" title="เลือกวิชา" meta="ชุดฝึกรายวิชา พร้อมชีทสรุปเนื้อหา" />
          <div className={styles.subjectGrid}>
            {subjects.map((subject) => (
              <Link href={subject.href} className={styles.subject} key={subject.id}>
                <span className={styles.subjectIcon} aria-hidden="true"><SubjectIcon subjectId={subject.id} size={22} /></span>
                <span className={styles.subjectText}>
                  <strong>{subject.title}</strong>
                  <small>{subject.desc}</small>
                  <em>
                    {subject.setCount ? `${subject.setCount} ชุด` : 'เร็ว ๆ นี้'}
                    {subject.hasSheet ? ' · มีชีทสรุป' : ''}
                  </em>
                </span>
                <span className={styles.subjectArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

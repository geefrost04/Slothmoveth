'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './PoliceCourseHome.module.css';
import own from './NesdcCourseHome.module.css';
import { thaiWrap } from '@/lib/thaiText';

export type NesdcSet = { id: string; title: string; href: string; questions: number; minutes: number };

export type NesdcSubjectCard = {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: string;
  lessonCount: number;
  sets: NesdcSet[];
};

// Facts from the announcement of 9 พ.ย. 2569 (พนักงานบริหารงานทั่วไป 3 งานวิเคราะห์นโยบายและแผน).
const KEY_DATES = [
  { date: '16–20 พ.ย. 2569', label: 'สมัครทาง nesdc.thaijobjob.com' },
  { date: 'ภายใน 21 พ.ย.', label: 'ชำระค่าสมัคร 330 บาท' },
  { date: 'ภายใน 27 พ.ย.', label: 'ประกาศผู้มีสิทธิสอบ + วัน เวลา สถานที่สอบ' },
  { date: 'ตั้งแต่ 30 พ.ย.', label: 'พิมพ์ใบสมัครที่มีเลขประจำตัวสอบ' }
];

// Topic ids in each group on the landing (announcement order inside each group).
const GROUPS = [
  { id: 'basics', title: 'ความรู้ทั่วไปและทักษะ', meta: 'ความรู้ความสามารถทั่วไป · สารบรรณ · อังกฤษ · คอมพิวเตอร์', ids: ['general', 'saraban', 'english', 'computer'] },
  { id: 'org', title: 'องค์กรและการวิเคราะห์งาน', meta: 'ความรู้เกี่ยวกับ สศช. · ยุทธศาสตร์ชาติและแผนพัฒนาฯ · สรุปและวิเคราะห์งาน', ids: ['org', 'national', 'analysis'] }
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

function TopicGrid({ subjects }: { subjects: NesdcSubjectCard[] }) {
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

// NESDC landing on the same template as the police course page, in violet.
export function NesdcCourseHomeClient({ miniMocks, subjects }: { miniMocks: NesdcSet[]; subjects: NesdcSubjectCard[] }) {
  const topicSets = subjects.flatMap((subject) => subject.sets);
  const scores = useLatestScores([...miniMocks, ...topicSets].map((set) => set.id));
  const done = (items: NesdcSet[]) => items.some((item) => scores[item.id] !== undefined);
  const firstOpen = (items: NesdcSet[]) => items.find((item) => scores[item.id] === undefined) ?? items[0];
  const notes = subjects.find((subject) => subject.lessonCount > 0);

  // Suggested path: short mixed test → topic notes → topic sets.
  const steps = [
    { label: 'Mini Mock', title: 'ลองสนามสั้น 30 ข้อ', note: 'ดูว่าหัวข้อไหนยังอ่อน', href: firstOpen(miniMocks)?.href ?? '#mini', done: done(miniMocks) },
    { label: 'โน้ตสรุป', title: 'อ่านหัวข้อที่ยังอ่อน', note: 'ทุกหัวข้อมีโน้ตและแบบฝึกท้ายบท', href: notes?.href ?? '#topics', done: done(miniMocks) && done(topicSets) },
    { label: 'ข้อสอบรายหัวข้อ', title: 'ฝึกครบ 7 หัวข้อ', note: 'ทำชุดของหัวข้อที่อ่านจบ', href: firstOpen(topicSets)?.href ?? '#topics', done: done(topicSets) }
  ];
  const nextStep = steps.find((step) => !step.done) ?? steps[2];
  const anyDone = steps.some((step) => step.done);

  return (
    <div className={`${styles.page} ${own.page}`}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link><span>/</span><Link href="/courses">สนามสอบ</Link><span>/</span><span aria-current="page">สศช.</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>พนักงานราชการ · สศช. · ฟรีทั้งหมด</span>
            <h1>งานวิเคราะห์<br />นโยบายและแผน</h1>
            <p className={styles.lead}>{thaiWrap('โน้ตสรุปและข้อสอบพร้อมเฉลย ครบทุกหัวข้อสอบข้อเขียนตามประกาศรับสมัครสำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ 9 พ.ย. 2569 ไม่ต้องสมัครก็เริ่มได้')}</p>
            <ul className={styles.facts}>
              <li><strong>{miniMocks.length}</strong> Mini Mock</li>
              <li><strong>{topicSets.length}</strong> ชุดรายหัวข้อ</li>
              <li><strong>{subjects.length}</strong> หัวข้อ</li>
              <li><strong>10</strong> อัตรา</li>
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
            <Link href={nextStep.href} className={styles.pathCta}>
              {anyDone ? 'ทำต่อ' : 'เริ่ม'} {nextStep.label} ฟรี <b aria-hidden="true">→</b>
            </Link>
          </aside>
        </section>

        <nav className={styles.jump} aria-label="ไปยังส่วน">
          <a href="#dates">วันสำคัญ</a>
          {miniMocks.length ? <a href="#mini">Mini Mock</a> : null}
          <a href="#topics">หัวข้อสอบ</a>
        </nav>

        <section className={styles.section} aria-labelledby="dates">
          <SectionHead id="dates" kicker="ประกาศรับสมัคร 9 พ.ย. 2569" title="วันสำคัญ" meta="10 อัตรา · เงินเดือน 21,780 บาท · วุฒิ ป.ตรีทุกสาขา · สอบข้อเขียน 100 คะแนน และสัมภาษณ์ 100 คะแนน" />
          <div className={own.dateCard}>
            <ol className={own.dates}>
              {KEY_DATES.map((item) => (
                <li key={item.label}>
                  <b>{item.date}</b>
                  <span>{thaiWrap(item.label)}</span>
                </li>
              ))}
            </ol>
            <p className={own.rule}>{thaiWrap('สอบข้อเขียนต้องได้ไม่ต่ำกว่า 60% จึงมีสิทธิสอบสัมภาษณ์ และต้องได้ไม่ต่ำกว่า 60% ทั้งสองครั้งจึงผ่านการเลือกสรร')}</p>
          </div>
        </section>

        {miniMocks.length ? (
          <section className={styles.section} aria-labelledby="mini">
            <SectionHead id="mini" kicker="ลองสนามสั้น" title="Mini Mock" meta={`30 ข้อ · 36 นาที · คละครบ ${subjects.length} หัวข้อ เหมาะสำหรับวัดระดับก่อนเริ่ม`} />
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

        <div id="topics">
          {GROUPS.map((group) => (
            <section className={styles.section} aria-labelledby={`group-${group.id}`} key={group.id}>
              <SectionHead id={`group-${group.id}`} kicker="หัวข้อสอบตามประกาศ" title={group.title} meta={group.meta} />
              <TopicGrid subjects={group.ids.map((id) => subjects.find((subject) => subject.id === id)).filter((subject): subject is NesdcSubjectCard => Boolean(subject))} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

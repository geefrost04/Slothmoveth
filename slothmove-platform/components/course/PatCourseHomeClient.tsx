'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './PoliceCourseHome.module.css';
import own from './PatCourseHome.module.css';
import { thaiWrap } from '@/lib/thaiText';

export type PatSet = { id: string; title: string; href: string; questions: number; minutes: number };

export type PatSubjectCard = {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: string;
  lessonCount: number;
  sets: PatSet[];
};

type NotesCard = { href: string; count: number } | null;

// From the PAT announcement of 25 ก.ย. 2569 (นักวิชาการ 6 กองแผนวิสาหกิจ ฝ่ายกลยุทธ์องค์กร), ข้อ 6 and ข้อ 9.
const PARTS = [
  { score: '200 คะแนน · 3 ชม.', title: 'ภาคความรู้ความสามารถทั่วไป', note: 'ความสามารถทั่วไป 100 · ไทย 50 · อังกฤษ 50' },
  { score: '200 คะแนน · 3 ชม.', title: 'ภาควิชาการ', note: 'วิชาพิเศษเฉพาะหน้าที่ (รอประกาศหัวข้อ)' },
  { score: '100 คะแนน', title: 'ภาคปฏิบัติการ', note: 'ทดลองทำงานในตำแหน่ง มักเป็นข้อเขียน' },
  { score: '100 คะแนน', title: 'สัมภาษณ์', note: 'ท่วงที วาจา เชาวน์ ความรู้รอบตัวและเรื่อง กทท.' }
];

const GROUPS = [
  { id: 'general', title: 'ภาคความรู้ความสามารถทั่วไป', meta: '200 คะแนน · ต้องได้ 60% ขึ้นไปจึงมีสิทธิสอบภาคต่อไป', ids: ['general', 'thai', 'english'] },
  { id: 'academic', title: 'ภาควิชาการ (คาดการณ์หัวข้อ)', meta: 'อิงหัวข้อที่ กทท. ประกาศในรอบนักวิชาการ 6 ปี 2568 และงานของกองแผนวิสาหกิจ', ids: ['port', 'ppp', 'soe', 'invest'] }
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

function TopicGrid({ subjects }: { subjects: PatSubjectCard[] }) {
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

function NotesLink({ card, icon, title, desc }: { card: NotesCard; icon: string; title: string; desc: string }) {
  if (!card) return null;
  return (
    <Link href={card.href} className={`${styles.subject} ${own.notesCard}`}>
      <span className={styles.subjectIcon} aria-hidden="true">{icon}</span>
      <span className={styles.subjectText}>
        <strong>{title}</strong>
        <small>{thaiWrap(desc)}</small>
        <em>โน้ต {card.count} บท</em>
      </span>
      <span className={styles.subjectArrow} aria-hidden="true">→</span>
    </Link>
  );
}

// PAT landing on the same template as the police course page, in navy.
export function PatCourseHomeClient({
  miniMocks,
  subjects,
  practical,
  interview
}: {
  miniMocks: PatSet[];
  subjects: PatSubjectCard[];
  practical: NotesCard;
  interview: NotesCard;
}) {
  const topicSets = subjects.flatMap((subject) => subject.sets);
  const scores = useLatestScores([...miniMocks, ...topicSets].map((set) => set.id));
  const done = (items: PatSet[]) => items.some((item) => scores[item.id] !== undefined);
  const firstOpen = (items: PatSet[]) => items.find((item) => scores[item.id] === undefined) ?? items[0];
  const notes = subjects.find((subject) => subject.id === 'port') ?? subjects.find((subject) => subject.lessonCount > 0);

  const steps = [
    { label: 'Mini Mock', title: 'ลองสนามสั้น 30 ข้อ', note: 'คละภาคทั่วไปและภาควิชาการ', href: firstOpen(miniMocks)?.href ?? '#mini', done: done(miniMocks) },
    { label: 'โน้ตสรุป', title: 'อ่านหัวข้อที่ยังอ่อน', note: 'ทุกหัวข้อมีโน้ตและแบบฝึกท้ายบท', href: notes?.href ?? '#topics', done: done(miniMocks) && done(topicSets) },
    { label: 'ข้อสอบรายหัวข้อ', title: `ฝึกครบ ${subjects.length} หัวข้อ`, note: 'ทำชุดของหัวข้อที่อ่านจบ', href: firstOpen(topicSets)?.href ?? '#topics', done: done(topicSets) }
  ];
  const nextStep = steps.find((step) => !step.done) ?? steps[2];
  const anyDone = steps.some((step) => step.done);

  return (
    <div className={`${styles.page} ${own.page}`}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link><span>/</span><Link href="/courses">สนามสอบ</Link><span>/</span><span aria-current="page">กทท.</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>รัฐวิสาหกิจ · การท่าเรือแห่งประเทศไทย · ฟรีทั้งหมด</span>
            <h1>นักวิชาการ 6<br />กองแผนวิสาหกิจ</h1>
            <p className={styles.lead}>{thaiWrap('โน้ตสรุปและข้อสอบพร้อมเฉลย สำหรับสอบคัดเลือกพนักงานการท่าเรือแห่งประเทศไทย ตำแหน่งนักวิชาการ 6 ฝ่ายกลยุทธ์องค์กร ตามประกาศ 25 ก.ย. 2569 ไม่ต้องสมัครก็เริ่มได้')}</p>
            <ul className={styles.facts}>
              <li><strong>{miniMocks.length}</strong> Mini Mock</li>
              <li><strong>{topicSets.length}</strong> ชุดรายหัวข้อ</li>
              <li><strong>{subjects.length}</strong> หัวข้อ</li>
              <li><strong>600</strong> คะแนนเต็ม</li>
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
          <a href="#parts">รูปแบบการสอบ</a>
          {miniMocks.length ? <a href="#mini">Mini Mock</a> : null}
          <a href="#topics">หัวข้อสอบ</a>
          {practical ? <a href={practical.href}>ภาคปฏิบัติการ</a> : null}
          {interview ? <a href={interview.href}>สัมภาษณ์</a> : null}
        </nav>

        <section className={styles.section} aria-labelledby="parts">
          <SectionHead id="parts" kicker="ประกาศรับสมัคร 25 ก.ย. 2569" title="รูปแบบการสอบ" meta="2 อัตรา (แผนกแผนวิสาหกิจ 1 · แผนกแผนงานและโครงการลงทุน 1) · เงินเดือน 18,900 บาท · ปิดรับสมัครแล้ว 4 พ.ย. 2569" />
          <div className={own.partCard}>
            <ol className={own.parts}>
              {PARTS.map((item) => (
                <li key={item.title}>
                  <b>{item.score}</b>
                  <strong>{item.title}</strong>
                  <span>{thaiWrap(item.note)}</span>
                </li>
              ))}
            </ol>
            <p className={own.rule}>{thaiWrap('ภาคทั่วไปต้องได้ 60% ขึ้นไปจึงมีสิทธิสอบภาคต่อไป (ไม่นำคะแนนมารวม) · ภาควิชาการและภาคปฏิบัติการต้องได้ภาคละ 60% · รวมกับสัมภาษณ์แล้วต้องได้ 60% ขึ้นไป · บัญชีผู้สอบได้ใช้ 2 ปี')}</p>
            <p className={own.notice}>
              {thaiWrap('กทท. ยังไม่ประกาศรายชื่อผู้มีสิทธิสอบ วันสอบ และหัวข้อภาควิชาการของรอบนี้ หัวข้อในเว็บนี้คาดการณ์จากรอบนักวิชาการ 6 ปี 2568 ข้อสอบทั้งหมดเป็นของ SlothMove ไม่ใช่ข้อสอบของ กทท. ติดตามประกาศจริงที่ ')}
              <a href="https://www.port.co.th" target="_blank" rel="noopener noreferrer">port.co.th</a>
            </p>
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
              <SectionHead id={`group-${group.id}`} kicker={group.id === 'general' ? 'หัวข้อตามประกาศ' : 'คาดการณ์หัวข้อ'} title={group.title} meta={group.meta} />
              <TopicGrid subjects={group.ids.map((id) => subjects.find((subject) => subject.id === id)).filter((subject): subject is PatSubjectCard => Boolean(subject))} />
            </section>
          ))}
          <NotesLink card={practical} icon="✍️" title="ภาคปฏิบัติการ (100 คะแนน)" desc="วิธีเขียนตอบ พร้อมโจทย์ฝึกและแนวคำตอบ: ขั้นตอนโครงการร่วมลงทุน ความเป็นไปได้โครงการ และวิเคราะห์ KPI" />
          <NotesLink card={interview} icon="🎤" title="เตรียมสอบสัมภาษณ์ (100 คะแนน)" desc="เกณฑ์ที่กรรมการดู คำถามที่ถามบ่อย และตัวอย่างคำตอบสำหรับ กทท." />
        </div>
      </div>
    </div>
  );
}

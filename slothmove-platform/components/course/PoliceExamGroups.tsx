'use client';

import Link from 'next/link';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import styles from './PoliceExamGroups.module.css';

type GroupKey = 'quick' | 'p54' | 'full' | 'drill' | 'other';

const GROUPS: Record<GroupKey, { title: string; desc: string }> = {
  quick: { title: 'ทบทวนเร็ว', desc: 'คละทุกหัวข้อ ทำจบไว แล้วไปชุดถัดไปได้เลย' },
  p54: { title: 'ลักษณะที่ 54', desc: 'สารบรรณตำรวจ ฉบับแก้ไขถึงฉบับที่ 21/2569' },
  full: { title: 'ชุดเต็ม', desc: 'จับเวลาเหมือนสนามจริง ใช้วัดความพร้อม' },
  drill: { title: 'Mini Drill', desc: 'ทวนเร็ว 10 ข้อ แต่ละชุดเน้นเรื่องที่ออกบ่อย' },
  other: { title: 'ชุดอื่น ๆ', desc: 'ชุดฝึกเพิ่มเติมของวิชานี้' }
};
const ORDER: GroupKey[] = ['quick', 'p54', 'full', 'drill', 'other'];

export function groupKeyOf(examSet: CatalogExamSet): GroupKey {
  if (examSet.id.includes('-quick-')) return 'quick';
  if (examSet.id.includes('-p54-')) return 'p54';
  if (/-set-\d{2}$/.test(examSet.id)) return 'full';
  if (/-drill-\d{2}$/.test(examSet.id)) return 'drill';
  return 'other';
}

export function hasMultipleGroups(examSets: CatalogExamSet[]) {
  return new Set(examSets.map(groupKeyOf)).size > 1;
}

function setNumber(examSet: CatalogExamSet, fallback: number) {
  return examSet.title.match(/ชุดที่\s*(\d+)/)?.[1] ?? String(fallback);
}

export function PoliceExamGroups({
  courseId,
  subjectId,
  examSets,
  ownedExamSetIds,
  latestScores
}: {
  courseId: string;
  subjectId: string;
  examSets: CatalogExamSet[];
  ownedExamSetIds: string[];
  latestScores: Record<string, number>;
}) {
  const owned = new Set(ownedExamSetIds);
  const grouped = ORDER
    .map((key) => ({ key, sets: examSets.filter((examSet) => groupKeyOf(examSet) === key) }))
    .filter((group) => group.sets.length > 0);
  const hrefOf = (examSet: CatalogExamSet) => `/courses/${courseId}/${subjectId}/exams/${examSet.id}`;
  const doneTotal = examSets.filter((examSet) => latestScores[examSet.id] !== undefined).length;
  // With a single kind of set, a group name like "ชุดเต็ม" adds nothing.
  const single = grouped.length === 1;
  const titleOf = (key: GroupKey) => (single ? 'ชุดข้อสอบ' : GROUPS[key].title);

  // One clear next step: the first set not tried yet (in group order).
  const nextGroup = grouped.find((group) => group.sets.some((examSet) => latestScores[examSet.id] === undefined));
  const nextSet = nextGroup?.sets.find((examSet) => latestScores[examSet.id] === undefined);

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <p>
          <strong>{examSets.length} ชุด</strong> ฟรีทั้งหมด
          {doneTotal > 0 ? <> · ทำแล้ว <strong>{doneTotal}</strong> ชุด</> : null}
        </p>
        {nextSet && nextGroup ? (
          <Link href={hrefOf(nextSet)} className={styles.next}>
            <span>{doneTotal > 0 ? 'ทำต่อ' : 'เริ่มที่'}</span>
            {single ? '' : `${GROUPS[nextGroup.key].title} `}ชุดที่ {setNumber(nextSet, 1)}
            <b aria-hidden="true">→</b>
          </Link>
        ) : null}
      </div>

      {grouped.map(({ key, sets }) => {
        const meta = GROUPS[key];
        const first = sets[0];
        const minutes = first.duration_minutes ?? Math.ceil(first.total_questions * 1.5);
        return (
          <section className={styles.group} key={key} aria-labelledby={`exam-group-${key}`}>
            <div className={styles.groupInfo}>
              <h3 id={`exam-group-${key}`}>{titleOf(key)}</h3>
              <p>{meta.desc}</p>
              <small>{sets.length} ชุด · ชุดละ {first.total_questions} ข้อ · {minutes} นาที</small>
            </div>
            <ol className={styles.sheet}>
              {sets.map((examSet, index) => {
                const score = latestScores[examSet.id];
                const unlocked = examSet.access_type === 'free' || owned.has(examSet.id);
                const tone = score === undefined ? '' : score >= 80 ? styles.good : score >= 60 ? styles.ok : styles.low;
                const isNext = nextSet?.id === examSet.id;
                const label = `${meta.title} ชุดที่ ${setNumber(examSet, index + 1)}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ' ยังไม่ได้ทำ'}`;
                const content = (
                  <>
                    <span className={styles.num}>{setNumber(examSet, index + 1)}</span>
                    <span className={styles.state}>{score !== undefined ? `${score}%` : isNext ? 'เริ่ม' : unlocked ? '—' : 'ล็อก'}</span>
                  </>
                );
                const className = `${styles.cell} ${tone} ${isNext ? styles.isNext : ''}`;
                return (
                  <li key={examSet.id}>
                    {!unlocked && examSet.product_id ? (
                      <CheckoutButton productId={examSet.product_id} className={className}>{content}</CheckoutButton>
                    ) : (
                      <Link href={hrefOf(examSet)} className={className} aria-label={label} title={label}>{content}</Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <p className={styles.legend}>
        <span><i className={styles.good} />80% ขึ้นไป</span>
        <span><i className={styles.ok} />60–79%</span>
        <span><i className={styles.low} />ต่ำกว่า 60%</span>
        <span>ตัวเลขคือคะแนนล่าสุดบนเครื่องนี้</span>
      </p>
    </div>
  );
}

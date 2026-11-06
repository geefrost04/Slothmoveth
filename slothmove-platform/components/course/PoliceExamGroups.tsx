'use client';

import Link from 'next/link';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import styles from './PoliceExamGroups.module.css';

type GroupKey = 'quick' | 'p54' | 'full' | 'other';

const GROUPS: Record<GroupKey, { title: string; desc: string; icon: string }> = {
  quick: { title: 'ทบทวนเร็ว', desc: 'คละทุกหัวข้อ เหมาะกับวันที่มีเวลาน้อย ทำจบแล้วไปชุดถัดไปได้ทันที', icon: '⚡' },
  p54: { title: 'ลักษณะที่ 54 · สารบรรณตำรวจ', desc: 'ระเบียบงานสารบรรณของ ตร. ฉบับแก้ไขถึงฉบับที่ 21 พ.ศ. 2569', icon: '👮' },
  full: { title: 'ชุดเต็ม', desc: 'ข้อเยอะ จับเวลาเหมือนสนามจริง ใช้วัดความพร้อมก่อนสอบ', icon: '📝' },
  other: { title: 'ชุดอื่น ๆ', desc: 'ชุดฝึกเพิ่มเติมของวิชานี้', icon: '📚' }
};

export function groupKeyOf(examSet: CatalogExamSet): GroupKey {
  if (examSet.id.includes('-quick-')) return 'quick';
  if (examSet.id.includes('-p54-')) return 'p54';
  if (/-set-\d{2}$/.test(examSet.id)) return 'full';
  return 'other';
}

export function hasMultipleGroups(examSets: CatalogExamSet[]) {
  return new Set(examSets.map(groupKeyOf)).size > 1;
}

function setLabel(examSet: CatalogExamSet) {
  const number = examSet.title.match(/ชุดที่\s*(\d+)/)?.[1];
  return number ? `ชุดที่ ${number}` : examSet.title;
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
  const order: GroupKey[] = ['quick', 'p54', 'full', 'other'];
  const grouped = order
    .map((key) => ({ key, sets: examSets.filter((examSet) => groupKeyOf(examSet) === key) }))
    .filter((group) => group.sets.length > 0);
  // Suggest the first set the candidate has not tried yet, so the page answers "where do I start?".
  const suggestedId = grouped.flatMap((group) => group.sets).find((examSet) => latestScores[examSet.id] === undefined)?.id;

  return (
    <div className={styles.groups}>
      {grouped.map(({ key, sets }) => {
        const meta = GROUPS[key];
        const first = sets[0];
        const doneCount = sets.filter((examSet) => latestScores[examSet.id] !== undefined).length;
        return (
          <section className={styles.group} key={key} aria-labelledby={`exam-group-${key}`}>
            <header className={styles.groupHead}>
              <span className={styles.groupIcon} aria-hidden="true">{meta.icon}</span>
              <div>
                <h3 id={`exam-group-${key}`}>{meta.title}</h3>
                <p>{meta.desc}</p>
              </div>
              <div className={styles.groupBadges}>
                <span>{sets.length} ชุด</span>
                <span>{first.total_questions} ข้อ · {first.duration_minutes ?? Math.ceil(first.total_questions * 1.5)} นาที</span>
                {doneCount > 0 ? <span className={styles.doneBadge}>ทำแล้ว {doneCount}/{sets.length}</span> : null}
              </div>
            </header>
            <div className={styles.tiles}>
              {sets.map((examSet) => {
                const score = latestScores[examSet.id];
                const unlocked = examSet.access_type === 'free' || owned.has(examSet.id);
                const suggested = examSet.id === suggestedId;
                const tone = score === undefined ? '' : score >= 80 ? styles.good : score >= 60 ? styles.ok : styles.low;
                const content = (
                  <>
                    {suggested ? <span className={styles.suggest}>เริ่มตรงนี้</span> : null}
                    <strong className={styles.tileTitle}>{setLabel(examSet)}</strong>
                    {score === undefined ? (
                      <span className={styles.tileStatus}>{unlocked ? 'ยังไม่ได้ทำ' : 'ต้องปลดล็อก'}</span>
                    ) : (
                      <span className={`${styles.tileStatus} ${tone}`}>
                        คะแนนล่าสุด {score}%
                        <i className={styles.scoreBar}><b style={{ width: `${score}%` }} /></i>
                      </span>
                    )}
                    <span className={styles.tileGo} aria-hidden="true">{score === undefined ? 'เริ่ม →' : 'ทำอีกครั้ง →'}</span>
                  </>
                );
                const className = `${styles.tile} ${suggested ? styles.tileSuggested : ''} ${score !== undefined ? styles.tileDone : ''}`;
                if (!unlocked && examSet.product_id) {
                  return (
                    <CheckoutButton productId={examSet.product_id} className={className} key={examSet.id}>
                      {content}
                    </CheckoutButton>
                  );
                }
                return (
                  <Link href={`/courses/${courseId}/${subjectId}/exams/${examSet.id}`} className={className} key={examSet.id} aria-label={`${examSet.title}${score !== undefined ? ` คะแนนล่าสุด ${score}%` : ''}`}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

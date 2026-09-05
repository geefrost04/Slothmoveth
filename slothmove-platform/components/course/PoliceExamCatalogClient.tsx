'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import styles from './PoliceExamCatalog.module.css';

type LocalAttempt = {
  score: number;
  total: number;
  completedAt: string;
};

type CatalogEntry =
  | { kind: 'single'; examSet: CatalogExamSet }
  | { kind: 'pack'; productId: string; examSets: CatalogExamSet[] };

function getCatalogEntries(examSets: CatalogExamSet[]): CatalogEntry[] {
  const freeEntries: CatalogEntry[] = examSets
    .filter((examSet) => examSet.access_type === 'free')
    .map((examSet) => ({ kind: 'single', examSet }));
  const paidByProduct = new Map<string, CatalogExamSet[]>();

  for (const examSet of examSets.filter((item) => item.access_type === 'paid')) {
    if (!examSet.product_id) {
      freeEntries.push({ kind: 'single', examSet });
      continue;
    }
    const groupedSets = paidByProduct.get(examSet.product_id) ?? [];
    groupedSets.push(examSet);
    paidByProduct.set(examSet.product_id, groupedSets);
  }

  return [
    ...freeEntries,
    ...[...paidByProduct.entries()].map(([productId, groupedSets]) => (
      groupedSets.length === 1
        ? { kind: 'single' as const, examSet: groupedSets[0] }
        : { kind: 'pack' as const, productId, examSets: groupedSets }
    ))
  ];
}

export function PoliceExamCatalogClient({
  courseId,
  subjectId,
  examSets,
  ownedExamSetIds
}: {
  courseId: string;
  subjectId: string;
  examSets: CatalogExamSet[];
  ownedExamSetIds: string[];
}) {
  const [latestScores, setLatestScores] = useState<Record<string, number>>({});
  const ownedExamSets = new Set(ownedExamSetIds);
  const [showAllSets, setShowAllSets] = useState(false);

  useEffect(() => {
    const scores: Record<string, number> = {};
    for (const examSet of examSets) {
      try {
        const raw = window.localStorage.getItem(`slothmove:exam-history:${examSet.id}`);
        const attempts = raw ? JSON.parse(raw) as LocalAttempt[] : [];
        if (Array.isArray(attempts) && attempts[0]?.total) {
          scores[examSet.id] = Math.round((attempts[0].score / attempts[0].total) * 100);
        }
      } catch {
        // Catalog remains usable when local progress is unavailable.
      }
    }
    setLatestScores(scores);
  }, [examSets]);

  if (examSets.length === 0) {
    return <div className={styles.state}>ยังไม่มีชุดข้อสอบที่เปิดใช้งาน</div>;
  }

  const catalogEntries = getCatalogEntries(examSets);
  const previewEntries = catalogEntries.slice(0, 3);
  const compactEntries = showAllSets ? catalogEntries : previewEntries;
  const freeCount = examSets.filter((examSet) => examSet.access_type === 'free').length;
  const subjectCopy: Record<string, { title: string; source: string }> = {
    math: { title: 'คลังข้อสอบความรู้ทั่วไป', source: 'ฝึกคิดวิเคราะห์และคำนวณภายใต้เวลาจำกัด พร้อมเฉลยทบทวนหลังทำ' },
    computer: { title: 'คลังข้อสอบคอมพิวเตอร์', source: 'ครอบคลุมพื้นฐานคอมพิวเตอร์ โปรแกรมสำนักงาน เครือข่าย และความปลอดภัยดิจิทัล' },
    thai: { title: 'คลังข้อสอบภาษาไทย', source: 'ฝึกอ่านจับใจความ หลักภาษา การใช้คำ และการวิเคราะห์ข้อความอย่างเป็นระบบ' },
    law: { title: 'คลังข้อสอบกฎหมาย', source: 'ทบทวนหลักกฎหมายสำคัญและการประยุกต์ใช้ผ่านสถานการณ์ที่หลากหลาย' },
    saraban: { title: 'คลังข้อสอบงานสารบรรณ', source: 'ฝึกจำหลักเกณฑ์ ชนิดหนังสือ ขั้นตอนปฏิบัติ และรายละเอียดที่มักสับสน' },
    english: { title: 'คลังข้อสอบภาษาอังกฤษ', source: 'ฝึก Vocabulary, Grammar, Conversation และ Reading ในรูปแบบจับเวลา' }
  };
  const overview = subjectCopy[subjectId] ?? subjectCopy.math;

  return (
    <div className={styles.catalog}>
      <div className={styles.heading}>
        <strong>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5h6M9 3h6v4H9zM7 5H5v16h14V5h-2M8 11h8M8 15h8" />
          </svg>
          ภาพรวมชุดข้อสอบ
        </strong>
        <span>{examSets.length} ชุดพร้อมทำ</span>
      </div>
      <div className={styles.overview}>
        <div>
          <strong>{overview.title}</strong>
          <span>{overview.source}</span>
        </div>
        <div className={styles.overviewStats}>
          <span>{freeCount} ชุดฟรี</span>
          <span>ประมาณ 45 นาที/ชุด</span>
        </div>
      </div>
      {compactEntries.map((entry) => {
        if (entry.kind === 'pack') {
          const totalQuestions = entry.examSets.reduce((total, examSet) => total + examSet.total_questions, 0);
          const durationMinutes = entry.examSets.reduce(
            (total, examSet) => total + (examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.5)),
            0
          );
          const unlockedCount = entry.examSets.filter((examSet) => ownedExamSets.has(examSet.id)).length;
          const unlocked = unlockedCount === entry.examSets.length;
          const partialAccess = unlockedCount > 0 && !unlocked;
          const priceLabel = new Intl.NumberFormat('th-TH', {
            style: 'currency', currency: 'THB', maximumFractionDigits: 0
          }).format(entry.examSets[0].price / 100);
          const setLabels = entry.examSets
            .map((examSet) => examSet.title.match(/ชุดที่\s*(\d+)/)?.[1])
            .filter(Boolean)
            .join(' + ');
          const content = (
            <>
              <div className={`${styles.examIcon} ${!unlocked ? styles.lockedIcon : ''}`} aria-hidden="true">
                {!unlocked ? (
                  <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M3 5.5c3-1 6-.4 9 2v12c-3-2.4-6-3-9-2zM21 5.5c-3-1-6-.4-9 2v12c3-2.4 6-3 9-2z" /></svg>
                )}
              </div>
              <div className={styles.examCopy}>
                <div>
                  <strong>Subject Pack: ชุดที่ {setLabels}</strong>
                  <em>{unlocked ? 'ซื้อแล้ว' : priceLabel} · {totalQuestions} ข้อ</em>
                </div>
                <span>{durationMinutes} นาที · พร้อมเฉลยทุกข้อ</span>
                <small>
                  {unlocked
                    ? 'ปลดล็อกชุดฝึกทั้งหมดในแพ็กแล้ว'
                    : partialAccess
                      ? `มีสิทธิ์แล้ว ${unlockedCount}/${entry.examSets.length} ชุด`
                      : 'ซื้อครั้งเดียว ใช้งานกับบัญชีนี้'}
                </small>
              </div>
              <b>{unlocked ? 'เริ่ม' : partialAccess ? 'ดูชุดที่มี' : 'ปลดล็อก'} <span>›</span></b>
            </>
          );

          if (!unlocked && !partialAccess) {
            return (
              <CheckoutButton productId={entry.productId} className={styles.checkoutCard} key={entry.productId}>
                {content}
              </CheckoutButton>
            );
          }
          const firstOwnedSet = entry.examSets.find((examSet) => ownedExamSets.has(examSet.id)) ?? entry.examSets[0];
          return (
            <Link
              href={`/courses/${courseId}/${subjectId}/exams/${firstOwnedSet.id}`}
              className={`${styles.examCard} ${styles.ownedCard}`}
              key={entry.productId}
            >
              {content}
            </Link>
          );
        }

        const examSet = entry.examSet;
        const latestScore = latestScores[examSet.id];
        const publicExamSetId = examSet.id === 'police-math-set-04' ? 'police-math-set-01' : examSet.id;
        const unlocked = examSet.access_type === 'free' || ownedExamSets.has(examSet.id);
        const priceLabel = new Intl.NumberFormat('th-TH', {
          style: 'currency', currency: 'THB', maximumFractionDigits: 0
        }).format(examSet.price / 100);
        const content = (
          <>
            <div className={`${styles.examIcon} ${!unlocked ? styles.lockedIcon : ''}`} aria-hidden="true">
              {!unlocked ? (
                <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
              ) : examSet.access_type === 'free' ? (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M3 5.5c3-1 6-.4 9 2v12c-3-2.4-6-3-9-2zM21 5.5c-3-1-6-.4-9 2v12c3-2.4 6-3 9-2z" /></svg>
              )}
            </div>
            <div className={styles.examCopy}>
              <div>
                <strong>{examSet.title}</strong>
                <em>
                  {examSet.access_type === 'free' ? 'ฟรี' : unlocked ? 'ซื้อแล้ว' : priceLabel}
                  {' · '}{examSet.total_questions} ข้อ
                </em>
              </div>
              <span>{examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.5)} นาที · พร้อมเฉลย</span>
              {latestScore !== undefined ? <small>คะแนนล่าสุด {latestScore}%</small> : <small>{unlocked ? 'ยังไม่เคยทำชุดนี้' : 'ซื้อครั้งเดียว ใช้งานกับบัญชีนี้'}</small>}
            </div>
            <b>{unlocked ? 'เริ่ม' : 'ปลดล็อก'} <span>›</span></b>
          </>
        );

        if (!unlocked && examSet.product_id) {
          return (
            <CheckoutButton productId={examSet.product_id} className={styles.checkoutCard} key={examSet.id}>
              {content}
            </CheckoutButton>
          );
        }
        return (
          <Link
            href={`/courses/${courseId}/${subjectId}/exams/${publicExamSetId}`}
            className={`${styles.examCard} ${examSet.access_type === 'paid' ? styles.ownedCard : ''}`}
            key={examSet.id}
          >
            {content}
          </Link>
        );
      })}
      {catalogEntries.length > 3 ? (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowAllSets((value) => !value)}
        >
          {showAllSets ? 'ย่อรายการ' : `ดูทุกชุด (${catalogEntries.length})`}
        </button>
      ) : null}
    </div>
  );
}

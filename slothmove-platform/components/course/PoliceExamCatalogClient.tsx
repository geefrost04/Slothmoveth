'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import { getSupabase } from '@/lib/supabase';
import styles from './PoliceExamCatalog.module.css';

type LocalAttempt = {
  score: number;
  total: number;
  completedAt: string;
};

export function PoliceExamCatalogClient({
  courseId,
  subjectId,
  examSets,
  ownedProductIds
}: {
  courseId: string;
  subjectId: string;
  examSets: CatalogExamSet[];
  ownedProductIds: string[];
}) {
  const [latestScores, setLatestScores] = useState<Record<string, number>>({});
  const [ownedProducts, setOwnedProducts] = useState<Set<string>>(() => new Set(ownedProductIds));
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

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const productIds = examSets.flatMap((examSet) => examSet.product_id ? [examSet.product_id] : []);
    if (!productIds.length) return;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: entitlements } = await supabase
        .from('entitlements')
        .select('product_id')
        .eq('user_id', data.user.id)
        .in('product_id', productIds);
      if (entitlements) {
        setOwnedProducts(new Set([
          ...ownedProductIds,
          ...entitlements.map((item) => item.product_id)
        ]));
      }
    });
  }, [examSets, ownedProductIds]);

  if (examSets.length === 0) {
    return <div className={styles.state}>ยังไม่มีชุดข้อสอบที่เปิดใช้งาน</div>;
  }

  const previewSets = [
    ...examSets.filter((examSet) => examSet.access_type === 'free'),
    ...examSets.filter((examSet) => examSet.access_type !== 'free')
  ].slice(0, 3);
  const compactSets = showAllSets ? examSets : previewSets;
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
      {compactSets.map((examSet) => {
        const latestScore = latestScores[examSet.id];
        const publicExamSetId = examSet.id === 'police-math-set-04' ? 'police-math-set-01' : examSet.id;
        const unlocked = examSet.access_type === 'free' || Boolean(examSet.product_id && ownedProducts.has(examSet.product_id));
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
      {examSets.length > 3 ? (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowAllSets((value) => !value)}
        >
          {showAllSets ? 'ย่อรายการ' : `ดูทุกชุด (${examSets.length})`}
        </button>
      ) : null}
    </div>
  );
}

'use client';

import Link from 'next/link';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import styles from './PoliceMockTestCatalog.module.css';

export function PoliceMockTestCatalogClient({
  courseId,
  examSets,
  ownedProductIds,
  compact
}: {
  courseId: string;
  examSets: CatalogExamSet[];
  ownedProductIds: string[];
  compact: boolean;
}) {
  const ownedProducts = new Set(ownedProductIds);

  if (examSets.length === 0) {
    return <div className={styles.empty}>กำลังเตรียม Mock Test ชุดแรก</div>;
  }

  return (
    <section className={`${styles.catalog}${compact ? ` ${styles.compact}` : ''}`} aria-label="รายการ Mock Test">
      <header className={styles.header}>
        <div>
          <span>MOCK TEST SERIES</span>
          <strong>เลือกชุดที่ต้องการสอบ</strong>
        </div>
        <em>{examSets.length} ชุด</em>
      </header>

      <div className={styles.list}>
        {examSets.map((examSet, index) => {
          const unlocked = examSet.access_type === 'free' || Boolean(
            examSet.product_id && ownedProducts.has(examSet.product_id)
          );
          const priceLabel = examSet.access_type === 'free'
            ? 'ฟรี'
            : new Intl.NumberFormat('th-TH', {
              style: 'currency', currency: 'THB', maximumFractionDigits: 0
            }).format(examSet.price / 100);
          const href = `/courses/${courseId}/mock-test/${examSet.id}`;
          const content = (
            <>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.copy}>
                <strong>{examSet.title}</strong>
                <small>{examSet.total_questions} ข้อ · {examSet.duration_minutes ?? 180} นาที · 6 วิชา</small>
              </span>
              <span className={styles.price}>
                <em>{unlocked && examSet.access_type === 'paid' ? 'ซื้อแล้ว' : priceLabel}</em>
                <b>{unlocked ? 'เริ่มสอบ' : 'ปลดล็อก'} <i>›</i></b>
              </span>
            </>
          );

          if (!unlocked && examSet.product_id) {
            return (
              <CheckoutButton productId={examSet.product_id} className={styles.checkout} key={examSet.id}>
                {content}
              </CheckoutButton>
            );
          }

          return <Link href={href} className={styles.item} key={examSet.id}>{content}</Link>;
        })}
      </div>

      {compact ? (
        <Link href={`/courses/${courseId}/mock-test`} className={styles.allLink}>
          ดู Mock Test ทั้งหมด <span>→</span>
        </Link>
      ) : null}
    </section>
  );
}

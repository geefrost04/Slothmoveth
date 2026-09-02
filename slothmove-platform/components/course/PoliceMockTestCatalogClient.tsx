'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import { trackAnalyticsEvent } from '@/lib/analytics';
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
  const trackedView = useRef(false);
  const placement = compact ? 'course_landing' : 'mock_catalog';

  useEffect(() => {
    if (trackedView.current || examSets.length === 0) return;
    trackedView.current = true;
    trackAnalyticsEvent('view_item_list', {
      item_list_id: `police_mock_test_${placement}`,
      item_list_name: 'Mock Test นายสิบตำรวจ',
      placement,
      items: examSets.map((examSet, index) => ({
        item_id: examSet.product_id || examSet.id,
        item_name: examSet.title,
        price: examSet.price / 100,
        index: index + 1
      }))
    });
    trackAnalyticsEvent('mock_list_impression', { placement, item_count: examSets.length });
    if (!compact) trackAnalyticsEvent('mock_catalog_view', { source: 'direct_or_navigation' });
  }, [compact, examSets, placement]);

  if (examSets.length === 0) {
    return <div className={styles.empty}>กำลังเตรียม Mock Test ชุดแรก</div>;
  }

  return (
    <section className={`${styles.catalog}${compact ? ` ${styles.compact}` : ''}`} aria-label="รายการ Mock Test">
      <header className={styles.header}>
        <div>
          <span>MOCK TEST SERIES</span>
          <strong>เริ่มจากชุดฟรี แล้วฝึกต่อเมื่อพร้อม</strong>
        </div>
        <em>{examSets.length} ชุดพร้อมสอบ</em>
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
          const priceDetail = examSet.access_type === 'free'
            ? 'ฟรี'
            : unlocked
              ? 'ซื้อแล้ว'
              : 'เฉลย + วิเคราะห์';
          const actionLabel = unlocked
            ? 'เริ่มทำ Mock Test'
            : `ปลดล็อก ${priceLabel}`;
          const href = `/courses/${courseId}/mock-test/${examSet.id}`;
          const itemClassName = examSet.access_type === 'free'
            ? `${styles.item} ${styles.freeItem}`
            : `${styles.item} ${styles.paidItem}`;
          const checkoutClassName = examSet.access_type === 'free'
            ? `${styles.checkout} ${styles.freeItem}`
            : `${styles.checkout} ${styles.paidItem}`;
          const content = (
            <>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.copy}>
                <strong>{examSet.title}</strong>
                <small>{examSet.total_questions} ข้อ · {examSet.duration_minutes ?? 180} นาที · 6 วิชา</small>
                <small className={styles.benefit}>
                  {examSet.access_type === 'free'
                    ? 'ลองดูข้อสอบ เฉลย และผลวิเคราะห์จริง'
                    : 'เฉลยละเอียด + วิเคราะห์จุดอ่อนแยกรายวิชา'}
                </small>
              </span>
              <span className={styles.price}>
                <em>{priceDetail}</em>
                <b>{actionLabel} <i>›</i></b>
              </span>
            </>
          );

          if (!unlocked && examSet.product_id) {
            return (
              <CheckoutButton
                productId={examSet.product_id}
                className={checkoutClassName}
                key={examSet.id}
                analyticsEventName="mock_unlock_click"
                analyticsParameters={{
                  exam_set_id: examSet.id,
                  source: compact ? 'course_landing' : 'mock_catalog',
                  price: examSet.price / 100
                }}
              >
                {content}
              </CheckoutButton>
            );
          }

          return (
            <Link
              href={href}
              className={itemClassName}
              key={examSet.id}
              onClick={() => trackAnalyticsEvent(examSet.access_type === 'free' ? 'mock_free_start_click' : 'mock_paid_start_click', {
                exam_set_id: examSet.id,
                source: placement
              })}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {compact ? (
        <Link
          href={`/courses/${courseId}/mock-test`}
          className={styles.allLink}
          onClick={() => trackAnalyticsEvent('mock_catalog_open_click', { source: 'course_landing' })}
        >
          ดู Mock Test ทั้งหมด <span>→</span>
        </Link>
      ) : null}
    </section>
  );
}

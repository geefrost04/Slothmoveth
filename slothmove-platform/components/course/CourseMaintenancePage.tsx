import Link from 'next/link';
import type { CourseConfig } from '@/lib/course-types';

export function CourseMaintenancePage({ course }: { course: CourseConfig }) {
  return (
    <section className="container" style={{ padding: '56px 0 80px' }}>
      <div
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '32px',
          border: '1px solid rgba(201, 125, 58, 0.18)',
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,248,239,0.96))',
          boxShadow: '0 20px 50px rgba(26, 26, 46, 0.06)'
        }}
      >
        <div style={{ fontSize: 42, marginBottom: 12 }}>🛠️</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 32,
            padding: '0 12px',
            borderRadius: 999,
            background: 'rgba(201, 125, 58, 0.10)',
            color: 'var(--color-amber, #c97d3a)',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 14
          }}
        >
          UNDER MAINTENANCE
        </div>
        <h1
          style={{
            margin: '0 0 12px',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.08
          }}
        >
          คอร์ส {course.title} กำลังปรับปรุงอยู่
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1.75 }}>
          ตอนนี้ระบบเปิดใช้งานเฉพาะคอร์ส <strong>Police_admin</strong> และ <strong>OCSC</strong> ก่อน
          ส่วนคอร์สนี้ถูกปิดไว้ชั่วคราวเพื่อจัดการเนื้อหา โครงสร้าง และประสบการณ์ใช้งานให้เรียบร้อยก่อนเปิดอีกครั้ง
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
          <Link
            href="/courses/police_admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 46,
              padding: '0 18px',
              borderRadius: 999,
              background: 'var(--color-primary)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800
            }}
          >
            ไปที่ Police_admin
          </Link>
          <Link
            href="/courses/ocsc"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 46,
              padding: '0 18px',
              borderRadius: 999,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700
            }}
          >
            ไปที่ OCSC
          </Link>
        </div>
      </div>
    </section>
  );
}

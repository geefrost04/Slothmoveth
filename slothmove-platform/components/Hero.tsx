import { TrackedLink } from '@/components/analytics/TrackedLink';
import styles from './Hero.module.css';

// One short, sign-up-free set per course so a visitor can start answering within seconds.
const QUICK_STARTS = [
  {
    courseId: 'police_admin',
    name: 'นายสิบตำรวจ',
    note: 'สายอำนวยการ · 6 วิชา',
    href: '/courses/police_admin/mini-mock/police-mini_mock-set-03',
    icon: '/pic/logo_police.png',
    accent: '#7a1822',
    soft: '#fdebed',
    label: 'Mini Drill คณิต 20 ข้อ'
  },
  {
    courseId: 'nesdc',
    name: 'สศช.',
    note: 'งานวิเคราะห์นโยบายและแผน',
    href: '/courses/nesdc/mini-drill/nesdc-mini_drill-set-01',
    icon: '📊',
    accent: '#5b3fa6',
    soft: '#f1ecfb',
    label: 'Mini Drill 10 ข้อ'
  },
  {
    courseId: 'onwr',
    name: 'สทนช.',
    note: 'นักวิเคราะห์นโยบายและแผน',
    href: '/courses/onwr/mini-drill/onwr-mini_drill-set-01',
    icon: '💧',
    accent: '#0b5f86',
    soft: '#e3f3fa',
    label: 'Mini Drill 10 ข้อ'
  }
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.inner}>
        <h1 className={styles.headline} id="home-hero-title">
          ฝึกข้อสอบราชการ <em>ฟรี</em><br />
          พร้อมเฉลยทุกข้อ
        </h1>
        <p className={styles.sub}>
          นายสิบตำรวจ · สศช. · สทนช. โน้ตสรุปและข้อสอบจับเวลา ไม่ต้องสมัครก็เริ่มทำได้
        </p>
        <div className={styles.ctaRow}>
          <a href="#exam-selection" className={styles.btn}>
            เลือกสนามสอบ <span className={styles.btnArrow} aria-hidden="true">↓</span>
          </a>
        </div>
        <div className={styles.quickRow} aria-label="เริ่มทำข้อสอบชุดสั้นทันที">
          <span className={styles.quickLabel}>หรือเริ่มเลย</span>
          {QUICK_STARTS.map((item) => (
            <TrackedLink
              key={item.courseId}
              href={item.href}
              className={styles.pill}
              style={{ '--c': item.accent, '--cs': item.soft } as React.CSSProperties}
              eventName="homepage_quick_start_click"
              parameters={{ location: 'home_hero', course_id: item.courseId }}
              title={`${item.name} · ${item.label}`}
            >
              <span className={styles.pillIcon} aria-hidden="true">
                {item.icon.startsWith('/') ? <img src={item.icon} alt="" /> : item.icon}
              </span>
              {item.name}
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}

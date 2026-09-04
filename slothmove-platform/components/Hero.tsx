import { TrackedLink } from '@/components/analytics/TrackedLink';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.inner}>
        <h1 className={styles.headline} id="home-hero-title">
          เตรียมสอบนายสิบตำรวจ<br />
          สายอำนวยการ <em>ครบ 6 วิชา</em>
        </h1>
        <p className={styles.sub}>
          สรุปเนื้อหากระชับ คลังข้อสอบจริงพร้อมเฉลยละเอียด และ Mock Test จับเวลาเสมือนจริง เพื่อให้คุณพร้อมที่สุดในวันสอบ
        </p>
        <div className={styles.ctaRow}>
          <TrackedLink
            href="/courses/police_admin"
            className={styles.btn}
            eventName="start_free_practice_click"
            parameters={{ location: 'home_hero' }}
          >
            เริ่มทดลองทำข้อสอบฟรี <span className={styles.btnArrow} aria-hidden="true">→</span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

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
          สรุปเนื้อหากระชับ แนวข้อสอบพร้อมเฉลยละเอียด และ Mock Test จับเวลาเสมือนจริง เพื่อให้คุณพร้อมที่สุดในวันสอบ
        </p>
        <div className={styles.ctaRow}>
          <TrackedLink
            href="/courses/police_admin/mini-mock/police-mini_mock-set-01"
            className={styles.btn}
            eventName="homepage_mini_mock_click"
            parameters={{
              location: 'home_hero',
              exam_set_id: 'police-mini_mock-set-01',
              question_count: 30
            }}
          >
            เริ่มทดลองทำข้อสอบฟรี <span className={styles.btnArrow} aria-hidden="true">→</span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

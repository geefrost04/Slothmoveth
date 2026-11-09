import styles from './PageLoader.module.css';

type Props = {
  label?: string;
  hint?: string;
  /** 'exam' uses the exam-page background so the switch to the exam feels seamless. */
  variant?: 'page' | 'exam';
};

// Shared loading screen for route segments that wait on the database.
export function PageLoader({ label = 'กำลังโหลด…', hint, variant = 'page' }: Props) {
  return (
    <div className={`${styles.wrap} ${variant === 'exam' ? styles.exam : ''}`} role="status" aria-live="polite">
      <div className={styles.card}>
        <div className={styles.mascot} aria-hidden="true">
          <img src="/pic/slothmove_mascot.svg" alt="" width={72} height={72} />
          <span className={styles.ring} />
        </div>
        <p className={styles.label}>{label}</p>
        {hint ? <p className={styles.hint}>{hint}</p> : null}
        <div className={styles.dots} aria-hidden="true"><i /><i /><i /></div>
      </div>
    </div>
  );
}

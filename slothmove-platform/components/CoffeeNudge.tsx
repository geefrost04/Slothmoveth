'use client';

import { triggerDonatePrompt } from '@/lib/donate-prompt';
import styles from './CoffeeNudge.module.css';

// A quiet "buy us a coffee" card. It never pops up by itself; the button opens the PromptPay popup.
export function CoffeeNudge({ source, title, text, compact = false }: { source: string; title: string; text?: string; compact?: boolean }) {
  return (
    <div className={`${styles.nudge} ${compact ? styles.compact : ''}`}>
      <span className={styles.cup} aria-hidden="true">☕</span>
      <span className={styles.copy}>
        <strong>{title}</strong>
        {text ? <small>{text}</small> : null}
      </span>
      <button type="button" className={styles.button} onClick={() => triggerDonatePrompt(source)}>เลี้ยงกาแฟ</button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import styles from './StudyReaderFrame.module.css';

// Right-hand outline of the current chapter. Highlights the topic being read.
export function OnThisPage({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!targets.length) return;

    const onScroll = () => {
      // The last heading that has passed the upper third of the screen.
      const line = window.innerHeight * 0.3;
      let current = targets[0].id;
      for (const node of targets) {
        if (node.getBoundingClientRect().top <= line) current = node.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav className={styles.rail} aria-label="หัวข้อในบทนี้">
      <p className={styles.railTitle}>ในบทนี้</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={item.id === active ? styles.railActive : undefined} aria-current={item.id === active ? 'location' : undefined}>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { Fragment } from 'react';
import styles from './SarabanLesson.module.css';
import { thaiWrap } from '@/lib/thaiText';

// Renders "**bold**" segments as highlighted text. Safe on server and client.
export function Rich({ text }: { text: string }) {
  const parts = thaiWrap(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => (
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={index} className={styles.hl}>{part.slice(2, -2)}</strong>
          : <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}

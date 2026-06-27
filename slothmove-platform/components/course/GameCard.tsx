import Link from 'next/link';
import type { GameMeta } from '@/lib/course-types';

export function GameCard({
  courseId,
  subjectId,
  game
}: {
  courseId: string;
  subjectId: string;
  game: GameMeta;
}) {
  const href = `/courses/${courseId}/${subjectId}/${game.id}`;
  const className = `game-card${game.status === 'skeleton' ? ' skeleton' : ''}`;

  if (game.status === 'skeleton') {
    return (
      <div className={className} aria-disabled="true">
        <div className="game-card-icon">{game.icon}</div>
        <div className="game-card-title">{game.labelTh}</div>
        <div className="game-card-desc">{game.desc}</div>
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      <div className="game-card-icon">{game.icon}</div>
      <div className="game-card-title">{game.labelTh}</div>
      <div className="game-card-desc">{game.desc}</div>
    </Link>
  );
}

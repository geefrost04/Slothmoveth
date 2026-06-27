import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { COURSES, resolveTriple } from '@/courses/registry';
import { getCourseGameData, hasCourseContentSource } from '@/courses/content-registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import {
  QuizGame, FlashcardGame, MatchGame, ClozeGame,
  SortingGame, OrderGame, SpellingGame, TrueFalseGame, ComputerTrueFalseGame, AuthorityGame,
  AnalogyGame, SeriesGame, QuickJudgeGame, LogicGridGame, SymbolChainGame,
  ReadingDetectiveGame
} from '@/components/games';
import type { GameId } from '@/lib/course-types';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'เกมฝึกทำข้อสอบ',
  description: 'หน้าเกมฝึกทำข้อสอบสำหรับผู้ใช้งานในแพลตฟอร์ม SlothMove',
  noIndex: true
});

export default async function GamePage({
  params
}: {
  params: Promise<{ course: string; subject: string; game: string }>;
}) {
  const { course: courseId, subject: subjectId, game: gameId } = await params;
  const triple = resolveTriple(courseId, subjectId, gameId);
  if (!triple) notFound();
  const { course, subject, game } = triple;

  // Enforce that the game is explicitly enabled for this subject
  if (!subject.games?.includes(gameId as any)) {
    notFound();
  }

  // Game templates that exist for every course but only have data wired
  // up for PAB. OPSD/Industry still return [] above → render placeholder.
  const items = getCourseGameData(courseId, subjectId, gameId as GameId);

  // Build game-specific mascot path (e.g. /pic/ocsc-mascot/english/quiz.png)
  // QuizGame will fall back to subject.mascot if the file doesn't exist (onError)
  const gameMascot = courseId === 'ocsc'
    ? `/pic/ocsc-mascot/${subjectId}/${gameId}.png`
    : undefined;

  // Truthful rendering rules:
  //  1. Course has no data loader at all → "ยังไม่พร้อมใช้งาน" whole-course message
  //  2. Course has loader but no items for this game → "ยังไม่มีข้อมูลเกมนี้"
  //  3. Game template is marked 'skeleton' in config → show skeleton view
  //  4. Otherwise → render the real game
  const courseHasContent = hasCourseContentSource(courseId);
  const noDataForGame = items.length === 0;

  return (
    <CourseLayout course={course}>
      {!courseHasContent ? (
        <CourseNotReady courseTitle={course.title} courseId={course.id} subjectTitle={subject.title} />
      ) : game.status === 'skeleton' ? (
        <SkeletonView game={game} subjectTitle={subject.title} courseTitle={course.title} />
      ) : noDataForGame ? (
        <NoDataView game={game} subjectTitle={subject.title} />
      ) : (
        <GameView
          gameId={game.id}
          items={items}
          subjectTitle={subject.title}
          subjectMascot={subject.mascot}
          gameMascot={gameMascot}
          courseTitle={course.title}
          courseId={course.id}
          gameLabelTh={game.labelTh}
          subjectId={subject.id}
        />
      )}
    </CourseLayout>
  );
}

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.subjects.flatMap((subject) =>
      course.games.map((game) => ({
        course: course.id,
        subject: subject.id,
        game: game.id
      }))
    )
  );
}

function GameView({
  gameId,
  items,
  subjectTitle,
  subjectMascot,
  gameMascot,
  courseTitle,
  courseId,
  gameLabelTh,
  subjectId
}: {
  gameId: GameId;
  items: any[];
  subjectTitle: string;
  subjectMascot?: string;
  gameMascot?: string;
  courseTitle: string;
  courseId: string;
  gameLabelTh: string;
  subjectId: string;
}) {
  switch (gameId) {
    case 'quiz':
      return (
        <QuizGame
          items={items}
          title={subjectTitle}
          subtitle={`เลือกจำนวนข้อก่อนเริ่มทำควิซของ ${courseTitle} แล้วระบบจะสุ่มคำถามจากคลังเดิมให้โดยอัตโนมัติ`}
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}
          gameMascot={gameMascot}
          subjectId={subjectId}
        />
      );
    case 'survival':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · ตอบผิดจบเกม`}
          subtitle={`Survival Mode ของ ${courseTitle} — ตอบถูกไปต่อ ตอบผิดจบทันที และเก็บสถิติสูงสุด`}
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}          gameMascot={gameMascot}
          mode="survival"
          subjectId={subjectId}
          introChip="Survival Mode"
          introTitle={`ตอบผิดจบเกม · ${subjectTitle}`}
          introDescription="สุ่มข้อจากคลังทั้งหมด ตอบถูกไปต่อ ตอบผิดจบทันที และเก็บ Best Streak ไว้ในเครื่องนี้"
          introStats={['180 ข้อในคลัง', 'ตอบผิดจบทันที', 'เก็บ Best Streak']}
        />
      );
    case 'speed':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · แข่งตอบกับเวลา`}
          subtitle={`Speed Quiz ของ ${courseTitle} — สุ่ม 10 ข้อและเก็บแต้มจากเวลาที่เหลือ`}
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}          gameMascot={gameMascot}
          mode="speed"
          subjectId={subjectId}
          introChip="Speed Quiz"
          introTitle={`แข่งตอบกับเวลา · ${subjectTitle}`}
          introDescription="สุ่ม 10 ข้อจากหมวดคณิต อนุกรม และอุปมาอุปไมย ตอบให้ทันก่อนหมดเวลาเพื่อเก็บแต้ม"
          introStats={['10 ข้อต่อรอบ', '5-15 วินาทีต่อข้อ', 'Base + Time Bonus']}
          speedBaseScore={10}
          defaultSpeedSeconds={10}
        />
      );
    case 'flashcard': return <FlashcardGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'match': return <MatchGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'cloze': return <ClozeGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'dialogue':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · สนทนา`}
          subtitle="สุ่มบทสนทนาสถานการณ์จริง เช่น หน่วยงานรัฐ สถานีตำรวจ โทรศัพท์ โรงพยาบาล โรงแรม และการเดินทาง"
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}
          gameMascot={gameMascot}
          subjectId={subjectId}
          introChip="Dialogue Practice"
          introTitle={`บทสนทนาสถานการณ์จริง · ${subjectTitle}`}
          introDescription="ฝึกเลือกคำตอบที่สุภาพ ตรงบริบท และต่อบทสนทนาได้จริง"
          introStats={['30 ข้อในคลัง', 'สถานการณ์ราชการ', 'เฉลยทันที']}
        />
      );
    case 'error-detector':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · หาข้อผิด`}
          subtitle="สุ่มโจทย์ไวยากรณ์เพื่อฝึกจับ tense, subject-verb agreement, passive voice, preposition และ part of speech"
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}
          gameMascot={gameMascot}
          subjectId={subjectId}
          introChip="Grammar Error Check"
          introTitle={`จับจุดผิดประโยค · ${subjectTitle}`}
          introDescription="ฝึกตัดสินโครงสร้างประโยคอังกฤษที่ข้อสอบชอบหลอก พร้อมเฉลยเหตุผลหลังตอบ"
          introStats={['60 ข้อในคลัง', 'Grammar A2-B1', 'เฉลยทันที']}
        />
      );
    case 'sorting': return <SortingGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'order': return <OrderGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'spelling': return <SpellingGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'truefalse':
      if (courseId === 'police_admin' && subjectId === 'computer') {
        return <ComputerTrueFalseGame items={items} courseId={courseId} subjectId={subjectId} />;
      }
      return <TrueFalseGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'authority': return <AuthorityGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'logic-grid': return <LogicGridGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'symbol-chain': return <SymbolChainGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'logic':
      if (courseId === 'ocsc') {
        return (
          <QuickJudgeGame
            items={items}
            subjectTitle={subjectTitle}
            courseTitle={courseTitle}
            courseId={courseId}
            subjectId={subjectId}
          />
        );
      }
    case 'matrix':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · ${gameLabelTh}`}
          subtitle={`เกม${gameLabelTh}ของ ${courseTitle} — ใช้ชุดข้อสอบเฉพาะทางจากคลังเดิม`}
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}          introChip={gameId === 'matrix' ? 'Matrix Builder' : 'Logic Challenge'}
          subjectId={subjectId}
          introTitle={`${gameLabelTh} · ${subjectTitle}`}
          introDescription={
            gameId === 'matrix'
              ? 'โจทย์ตารางตัวเลข 10 ข้อจากคลังตำรวจเดิม เน้นมองความสัมพันธ์ในเมทริกซ์'
              : 'โจทย์ตรรกะและการสรุปผล 10 ข้อจากคลังตำรวจเดิม เน้นวิเคราะห์เงื่อนไขและเหตุผล'
          }
          introStats={[
            '10 ข้อต่อรอบ',
            gameId === 'matrix' ? 'คลังเมทริกซ์ 20 ข้อ' : 'คลังตรรกะ 20 ข้อ',
            'สุ่มใหม่ทุกครั้ง'
          ]}
          modeOptions={[
            {
              count: 10,
              label: gameId === 'matrix' ? 'เริ่ม Matrix Builder' : 'เริ่ม Logic Challenge',
              desc: gameId === 'matrix'
                ? 'สุ่ม 10 ข้อเพื่อฝึกมองแพทเทิร์นในตารางตัวเลขแบบต่อเนื่อง'
                : 'สุ่ม 10 ข้อเพื่อฝึกวิเคราะห์เงื่อนไขและสรุปเหตุผล'
            }
          ]}
        />
      );
    // Phase B: math-specific games (police_admin).
    // Reuse QuizGame for word-problem / speed-percent (4-choice pattern).
    // Analogy / series use dedicated components with hint + pattern badge.
    case 'analogy': return <AnalogyGame items={items} />;
    case 'series': return <SeriesGame items={items} />;
    // Phase C: Rank A games (ocsc analytical_thinking).
    case 'reading-detective':
      return <ReadingDetectiveGame items={items} courseId={courseId} subjectId={subjectId} />;
    case 'word-problem':
    case 'speed-percent':
    case 'compare-values':
      return (
        <QuizGame
          items={items}
          title={`${subjectTitle} · ${gameLabelTh}`}
          subtitle={`เกม${gameLabelTh}ของ ${courseTitle} — ใช้โครงสร้างควิซ 4 ตัวเลือกเหมือนเกมควิซ`}
          courseId={courseId}
          leaderboardHref={`/courses/${courseId}/leaderboard`}
          subjectMascot={subjectMascot}
          gameMascot={gameMascot}
          subjectId={subjectId}
        />
      );
    default: return null;
  }
}

/**
 * Course-level "ยังไม่พร้อม" placeholder.
 * Renders when a course (e.g. OPSD, Industry) is registered but its
 * data pipeline hasn't been wired up yet — much better than dropping
 * the user onto a blank QuizGame with [] items.
 */
function CourseNotReady({
  courseTitle,
  courseId,
  subjectTitle
}: {
  courseTitle: string;
  courseId: string;
  subjectTitle: string;
}) {
  return (
    <div style={{
      maxWidth: 720, margin: '0 auto', padding: '64px 16px', textAlign: 'center',
      color: 'var(--color-text)'
    }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🚧</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
        color: 'var(--color-primary)', marginBottom: 12
      }}>
        คอร์ส{courseTitle} — ยังไม่พร้อมให้บริการ
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 8, fontSize: 16 }}>
        วิชา <strong>{subjectTitle}</strong> ของคอร์สนี้ยังไม่ได้ย้ายเข้าสู่แพลตฟอร์ม Next.js
      </p>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>
        ตอนนี้เปิดให้เรียนเฉพาะคอร์ส <strong>นักวิเคราะห์นโยบายและแผน (ปภ.)</strong> เท่านั้น —
        คอร์สอื่น ๆ กำลังทยอยย้ายข้อมูล คาดว่าจะทยอยเปิดให้บริการในเฟสถัดไป
      </p>
      <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href={`/courses/pab`}
          style={{
            display: 'inline-block', padding: '12px 24px',
            background: 'var(--color-primary)', color: '#fff',
            borderRadius: 12, fontWeight: 700, textDecoration: 'none'
          }}
        >
          → เปิดคอร์ส PAB ที่พร้อมใช้งาน
        </Link>
        <Link
          href={`/`}
          style={{
            display: 'inline-block', padding: '12px 24px',
            background: 'var(--color-surface)', color: 'var(--color-primary)',
            border: '1px solid var(--color-border)', borderRadius: 12,
            fontWeight: 700, textDecoration: 'none'
          }}
        >
          ← กลับหน้าหลัก
        </Link>
      </div>
      <p style={{
        marginTop: 32, fontSize: 11, color: 'var(--color-text-light)',
        fontFamily: 'var(--font-mono, monospace)'
      }}>
        course: {courseId} · no data loader registered
      </p>
    </div>
  );
}

/**
 * Game-template skeleton placeholder. Renders when the game template
 * itself is still under construction (Sorting, Order, Spelling, TrueFalse,
 * Authority, Logic — depending on config status).
 */
function SkeletonView({
  game,
  subjectTitle,
  courseTitle
}: {
  game: { icon: string; labelTh: string; desc: string };
  subjectTitle: string;
  courseTitle: string;
}) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{game.icon}</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
        color: 'var(--color-primary)', marginBottom: 12
      }}>
        {game.labelTh} — กำลังพัฒนา
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 8, fontSize: 16 }}>
        {game.desc}
      </p>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>
        เกมนี้ยังเป็น skeleton — ระบบหลังบ้านและ UI กำลังอยู่ระหว่างพัฒนา
        ในระหว่างนี้ลองเล่น <strong>ควิซ</strong>, <strong>แฟลชการ์ด</strong>, <strong>จับคู่</strong>, หรือ <strong>เติมคำ</strong> ของ {courseTitle} แทนได้เลย
      </p>
      <span style={{
        display: 'inline-block', padding: '4px 12px',
        background: 'var(--color-accent-soft)', color: 'var(--color-accent)',
        borderRadius: 999, fontSize: 13, fontWeight: 700
      }}>
        เร็วๆ นี้
      </span>
    </div>
  );
}

/**
 * Game template exists + course has data loader but this specific
 * (subject, game) combination returned no items.
 */
function NoDataView({
  game,
  subjectTitle
}: {
  game: { icon: string; labelTh: string; desc: string };
  subjectTitle: string;
}) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
        color: 'var(--color-primary)', marginBottom: 12
      }}>
        ยังไม่มีข้อมูล {game.labelTh} สำหรับ {subjectTitle}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
        ทีมงานกำลังเตรียมข้อมูลเกมนี้อยู่ — ลองเลือกเกมอื่นในวิชาเดียวกัน หรือกลับมาใหม่เร็ว ๆ นี้
      </p>
    </div>
  );
}

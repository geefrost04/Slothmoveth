'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Lesson, Topic } from '@/lib/learn/types';
import { PRIORITY_LABEL } from '@/lib/learn/course';
import { useLearn, usePathDay } from './CourseContext';
import { BlockView, Rich } from './Blocks';
import { Sources } from './Sources';

export function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function LessonView({ lesson, topic }: { lesson: Lesson; topic: Topic }) {
  const { course, progress, hydrated, actions } = useLearn();
  const BASE = course.base;
  const TEST_SIZE = course.testSize;
  const TEST_PASS = course.testPass;
  useEffect(() => actions.markOpened(lesson.id), [actions, lesson.id]);

  const day = usePathDay(lesson.id);
  const state = progress.lessons[lesson.id];
  const passed = hydrated && !!state?.passedAt;
  const next = topic.lessons[lesson.order];

  return (
    <div className="nl-wrap">
      <header className="nl-head">
        <div className="nl-head-row">
          <Link href={BASE} className="nl-back" aria-label="กลับไปแผนการเรียน"><BackIcon /></Link>
          <div className="nl-head-text">
            <span className="nl-head-kicker">{day ? `แผน ${course.path.length} วัน · วันที่ ${day}` : topic.title}</span>
            <span className="nl-head-title">{lesson.kind === 'practice' ? 'ชุดฝึกที่' : 'บทที่'} {lesson.order} จาก {course.outline.find((o) => o.id === topic.id)?.lessons.length ?? topic.lessons.length} ในหัวข้อนี้</span>
          </div>
          <span className="nl-head-meta">~{lesson.minutes} นาที</span>
        </div>
        <nav className="nl-jumps" aria-label="ไปยังส่วนของบทเรียน">
          {lesson.jumps.map(([anchor, label]) => (
            <a key={anchor} href={`#${anchor}`} className="nl-jump">{label}</a>
          ))}
        </nav>
      </header>

      <div className="nl-hero">
        <span className="nl-pill">{topic.title}</span>
        <h1 className="nl-h1">{lesson.title}</h1>
        <p className="nl-lead">{lesson.lead}</p>
        {lesson.priority && (
          <p className="nl-prio-line">
            <span className={`nl-prio is-${lesson.priority}`}>{PRIORITY_LABEL[lesson.priority]}</span>
            {course.priorityNote && <span className="nl-p-muted">{course.priorityNote}</span>}
          </p>
        )}
      </div>

      <div className="nl-lesson-grid">
        <div className="nl-lesson-main">
      {lesson.blocks.map((block, i) => <BlockView block={block} key={i} />)}

      <section id="endtest" className="nl-card" style={{ marginTop: 24, borderRadius: 20 }}>
        <span className="nl-h3">{lesson.kind === 'practice' ? 'ทำโจทย์ชุดนี้' : 'แบบทดสอบท้ายบท'}</span>
        <span className="nl-p-muted">
          {TEST_SIZE} ข้อ ทำได้ {TEST_PASS} ข้อขึ้นไปถือว่าผ่าน และปลดล็อกบทถัดไปในแผน ข้อที่ตอบผิดจะกลับมาให้ทบทวนในอีกไม่กี่วัน พร้อมคำอธิบายเดิม
        </span>
        {passed && (
          <span className="nl-badge is-good" style={{ alignSelf: 'flex-start' }}>ผ่านแล้ว · คะแนนดีที่สุด {state?.best}/{TEST_SIZE}</span>
        )}
        <Link href={`${BASE}/${topic.id}/${lesson.id}/test`} className="nl-btn">
          {passed ? 'ทำแบบทดสอบอีกครั้ง' : `เริ่มทำ ${TEST_SIZE} ข้อ`}
        </Link>
        {passed && next && (
          <Link href={`${BASE}/${topic.id}/${next.id}`} className="nl-btn-soft">ไปบทถัดไป: {next.title}</Link>
        )}
        {topic.summary && (
          <Link href={`${BASE}/${topic.id}/summary`} className="nl-btn-soft">เปิดหน้าสรุปของหัวข้อนี้</Link>
        )}
      </section>

      <Sources refs={lesson.sources} />
        </div>
        <LessonToc lesson={lesson} />
      </div>
    </div>
  );
}

/** Desktop-only contents panel: the lesson's sections, the current one highlighted. */
function LessonToc({ lesson }: { lesson: Lesson }) {
  const items = lesson.blocks.flatMap((b) =>
    (b.type === 'section' || b.type === 'check') && b.anchor ? [{ anchor: b.anchor, label: b.title || b.eyebrow || b.anchor, priority: b.type === 'section' ? b.priority : undefined }] : []
  );
  items.push({ anchor: 'endtest', label: lesson.kind === 'practice' ? 'ทำโจทย์ชุดนี้' : 'แบบทดสอบท้ายบท', priority: undefined });
  const [active, setActive] = useState(items[0]?.anchor);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.anchor)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);
  return (
    <aside className="nl-toc" aria-label="สารบัญบทเรียน">
      <span className="nl-toc-title">ในบทนี้</span>
      <nav>
        {items.map((i) => (
          <a key={i.anchor} href={`#${i.anchor}`} className={i.anchor === active ? 'is-active' : undefined}>
            {i.priority && <span className={`nl-toc-dot is-${i.priority}`} title={PRIORITY_LABEL[i.priority]} aria-hidden="true" />}
            <Rich text={i.label} />
          </a>
        ))}
      </nav>
      <span className="nl-toc-meta">~{lesson.minutes} นาที</span>
    </aside>
  );
}

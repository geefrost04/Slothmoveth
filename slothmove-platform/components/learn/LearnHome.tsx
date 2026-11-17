'use client';

import Link from 'next/link';
import { PRIORITY_LABEL, type OutlineTopic } from '@/lib/learn/course';
import { dayNumber, type Progress } from '@/lib/learn/progress';
import { useLearn } from './CourseContext';

const RATING = ['ยังงง', 'พอเข้าใจ', 'อธิบายได้'];

type Item = { id: string; title: string; href?: string; done: boolean; meta: string; tickable?: boolean };

function daysUntil(iso: string): number {
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.ceil((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000);
}

function thaiDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

function topicStats(topic: OutlineTopic, p: Progress, testSize: number) {
  const passed = topic.lessons.filter((l) => p.lessons[l.id]?.passedAt).length;
  const scores = topic.lessons.map((l) => p.lessons[l.id]?.best).filter((s): s is number => s !== undefined);
  return { total: topic.lessons.length, passed, pcts: scores.map((s) => s / testSize) };
}

export function LearnHome() {
  const { course, progress: p, hydrated, actions } = useLearn();
  const BASE = course.base;
  const day = dayNumber(p);

  function itemOf(id: string, stepKey: string): Item {
    const special = course.specials[id];
    if (id === 'diagnostic' && !special?.href) {
      return { id, title: special?.title ?? 'แบบวัดพื้นฐาน', href: `${BASE}/diagnostic`, done: !!p.diagnostic, meta: p.diagnostic ? 'ทำแล้ว' : special?.meta ?? '' };
    }
    if (special) {
      const ticked = !!p.ticked?.[stepKey];
      return { id, title: special.title, href: special.href, done: ticked, meta: ticked ? 'ทำแล้ว' : special.meta, tickable: special.tickable };
    }
    if (id.startsWith('summary:') || id.startsWith('test:')) {
      const isTest = id.startsWith('test:');
      const topic = course.outline.find((t) => t.id === id.slice(isTest ? 5 : 8));
      if (isTest) {
        const best = topic ? p.lessons[`topic:${topic.id}`]?.best : undefined;
        return {
          id,
          title: `ข้อสอบหัวข้อ: ${topic?.title ?? ''}`,
          href: topic?.hasTest ? `${BASE}/${topic.id}/test` : undefined,
          done: best !== undefined,
          meta: !topic?.hasTest ? 'เร็วๆ นี้' : best !== undefined ? `ทำได้ ${best}/${course.topicTestSize}` : `${course.topicTestSize} ข้อ`
        };
      }
      const rating = topic ? p.ratings[topic.id] : undefined;
      return {
        id,
        title: `หน้าสรุป: ${topic?.title ?? ''}`,
        href: topic?.hasSummary ? `${BASE}/${topic.id}/summary` : undefined,
        done: rating !== undefined,
        meta: topic?.hasSummary ? (rating !== undefined ? `ประเมินตัวเองแล้ว: ${RATING[rating]}` : 'อ่านแล้วประเมินตัวเอง') : 'เร็วๆ นี้'
      };
    }
    const topic = course.outline.find((t) => t.lessons.some((l) => l.id === id));
    const lesson = topic?.lessons.find((l) => l.id === id);
    if (!topic || !lesson || !lesson.ready) return { id, title: lesson?.title ?? id, done: false, meta: 'เร็วๆ นี้' };
    const state = p.lessons[id];
    return {
      id,
      title: lesson.title,
      href: `${BASE}/${topic.id}/${lesson.id}`,
      done: !!state?.passedAt,
      meta: state?.passedAt
        ? `ผ่านแล้ว · ${state.best}/${course.testSize}`
        : state?.best !== undefined
          ? `ทำแบบทดสอบได้ ${state.best}/${course.testSize} ยังไม่ผ่าน`
          : `~${lesson.minutes} นาที + แบบทดสอบ ${course.testSize} ข้อ`
    };
  }

  // Today = the earliest plan day up to today that still has open items with content; else today's day.
  const days = course.path.map((d) => ({ ...d, list: d.items.map((id, i) => ({ ...itemOf(id, `${d.day}:${id}:${i}`), key: `${d.day}:${id}:${i}` })) }));
  const open = days.find((d) => d.day <= day && d.list.some((it) => !it.done && it.href));
  const current = open ?? days.find((d) => d.day === Math.min(day, days.length)) ?? days[0];
  const behind = open && open.day < day;

  const due = p.mistakes.filter((m) => (Date.now() - new Date(m.at + 'T00:00:00').getTime()) / 86400000 >= 2);

  // Readiness per exam part from lesson test best scores (shown after 3 results).
  const partIds = [...new Set(course.outline.map((t) => t.part))];
  const parts = partIds.map((part) => {
    const pcts = course.outline.filter((t) => t.part === part).flatMap((t) => topicStats(t, p, course.testSize).pcts);
    const pct = pcts.length ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 100) : null;
    return { part, pct, n: pcts.length };
  });
  const totalResults = parts.reduce((a, b) => a + b.n, 0);

  const examDate = course.exam.date;
  const left = examDate ? daysUntil(examDate) : null;
  const diag = course.diagnosticStep ? days.flatMap((d) => d.list).find((it) => it.id === course.diagnosticStep) : undefined;

  const renderItem = (it: Item & { key: string }) => {
    const inner = (
      <>
        <span className={`nl-today-icon${it.done ? ' is-done' : ''}`} aria-hidden="true">{it.done ? '✓' : it.href ? '→' : '·'}</span>
        <span className="nl-today-text">
          <span className="nl-today-name">{it.title}</span>
          <span className="nl-today-meta">{it.meta}</span>
        </span>
      </>
    );
    return (
      <div key={it.key} className="nl-today-row">
        {it.href ? (
          <Link href={it.href} className="nl-today-item">{inner}</Link>
        ) : (
          <div className="nl-today-item" style={{ opacity: 0.7 }}>{inner}</div>
        )}
        {it.tickable && hydrated && (
          <button type="button" className="nl-tick" aria-pressed={it.done} onClick={() => actions.tick(it.key, !it.done)}>
            {it.done ? 'ทำแล้ว' : 'ทำเสร็จ'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="nl-wrap nl-wrap-home">
      <div className="nl-hero">
        <span className="nl-pill">{course.pill}</span>
        <h1 className="nl-h1">{course.homeTitle}</h1>
        <p className="nl-lead">{course.homeLead}</p>
      </div>

      <div className="nl-home-grid">
        <div className="nl-home-main">
          <div style={{ margin: '16px 16px 0' }}>
            <div className="nl-count">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#cfc4f2' }}>สอบข้อเขียน</span>
              <span className="nl-count-big">
                {left !== null && examDate ? (left > 0 ? `อีก ${left} วัน · ${thaiDate(examDate)}` : left === 0 ? 'วันนี้' : `สอบไปแล้ว (${thaiDate(examDate)})`) : course.exam.estimate}
              </span>
              {!examDate && <span className="nl-count-note">{course.exam.note}</span>}
              {course.exam.facts?.map((f) => <span key={f} className="nl-count-note">{f}</span>)}
              <span className="nl-count-note">{course.exam.passRule}</span>
            </div>
          </div>

          {hydrated && diag && !diag.done && (
            <section className="nl-card">
              <span className="nl-eyebrow">เริ่มตรงนี้</span>
              <h2 className="nl-h2">{diag.title}</h2>
              <p className="nl-p">{diag.meta}</p>
              {diag.href && <Link href={diag.href} className="nl-btn">เริ่มเลย</Link>}
              {diag.tickable && <span className="nl-p-muted">ทำเสร็จแล้วกลับมากด “ทำเสร็จ” ในรายการวันนี้ เพื่อให้แผนเดินต่อ</span>}
            </section>
          )}

          <section className="nl-card">
            <span className="nl-eyebrow">{behind ? `ค้างจากวันที่ ${current.day}` : `วันนี้ · วันที่ ${current.day} จาก ${days.length}`}</span>
            <h2 className="nl-h2">{behind ? 'ทำต่อจากที่ค้างไว้ก่อน' : 'สิ่งที่ต้องทำวันนี้'}</h2>
            <div>{current.list.map(renderItem)}</div>
            {current.extra && <div className="nl-note">{current.extra}</div>}
            {due.length > 0 && (
              <Link href={`${BASE}/review`} className="nl-btn-soft">ทวนข้อที่เคยตอบผิด {due.length} ข้อ</Link>
            )}
          </section>

          {hydrated && p.diagnostic && (
            <section className="nl-card">
              <span className="nl-eyebrow">ผลแบบวัดพื้นฐาน</span>
              <div>
                {course.outline.map((t) => {
                  const r = p.diagnostic?.byTopic[t.id];
                  if (!r) return null;
                  const pct = Math.round((r.right / r.total) * 100);
                  return (
                    <div className="nl-topic-row" key={t.id}>
                      <span className="nl-topic-name">{t.short}</span>
                      <span className="nl-topic-meta">{r.right}/{r.total}{pct < 60 ? ' · ควรเน้น' : ''}</span>
                      <span className="nl-bar"><span style={{ width: `${pct}%`, background: pct < 60 ? 'var(--nl-amber-ink)' : undefined }} /></span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <details className="nl-card nl-plan">
            <summary className="nl-plan-summary">
              <span className="nl-eyebrow">แผนทั้งหมด</span>
              <span className="nl-h3">ดูแผน {days.length} วัน</span>
            </summary>
            <ol className="nl-plan-list">
              {days.map((d) => (
                <li key={d.day} className={d.day === current.day ? 'is-current' : undefined}>
                  <b>วันที่ {d.day}</b>
                  <span>
                    {d.list.map((it) => `${it.done ? '✓ ' : ''}${it.title}`).join(' · ')}
                    {d.extra ? ` · ${d.extra}` : ''}
                  </span>
                </li>
              ))}
            </ol>
          </details>
        </div>

        <div className="nl-home-side">
          <section className="nl-card">
            <span className="nl-eyebrow">ความคืบหน้าแต่ละหัวข้อ</span>
            <div>
              {course.outline.map((t) => {
                const s = topicStats(t, p, course.testSize);
                const rating = p.ratings[t.id];
                return (
                  <a key={t.id} href={`#map-${t.id}`} className="nl-topic-row">
                    <span className="nl-topic-name">{t.title}</span>
                    <span className="nl-topic-meta">
                      {t.ready ? `${s.passed}/${s.total} บท` : 'เร็วๆ นี้'}
                      {rating !== undefined ? ` · ${RATING[rating]}` : ''}
                    </span>
                    <span className="nl-bar"><span style={{ width: `${s.total ? (s.passed / s.total) * 100 : 0}%` }} /></span>
                  </a>
                );
              })}
            </div>
          </section>

          {hydrated && totalResults >= 3 && (
            <section className="nl-card">
              <span className="nl-eyebrow">ความพร้อมโดยประมาณ</span>
              {parts.map(({ part, pct }) =>
                pct === null ? null : (
                  <div key={part} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span className="nl-ready-label">
                      <b>{course.parts[part] ?? `ภาค ${part}`}</b>
                      <span>{pct}%</span>
                    </span>
                    <span className="nl-ready-bar"><span style={{ width: `${pct}%` }} /><span className="nl-ready-line" aria-hidden="true" /></span>
                  </div>
                )
              )}
              <span className="nl-p-muted">เส้นสีส้มคือเกณฑ์ร้อยละ 60 ตัวเลขนี้ประมาณจากแบบทดสอบในคอร์ส ไม่ใช่การรับรองผลสอบ และคนที่ได้บรรจุมักต้องได้สูงกว่าเกณฑ์มาก</span>
            </section>
          )}
        </div>
      </div>

      <div className="nl-section-head" style={{ paddingTop: 28 }}>
        <span className="nl-eyebrow">แผนที่หัวข้อ</span>
        <h2 className="nl-h2">ทุกบทในคอร์ส</h2>
        <p className="nl-p-muted">{course.mapIntro}</p>
        {course.priorityNote && <p className="nl-p-muted">{course.priorityNote}</p>}
      </div>
      <section className="nl-card nl-map">
        {course.outline.map((t) => (
          <div className="nl-map-topic" key={t.id} id={`map-${t.id}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="nl-block-title">{t.title}</span>
              <span className="nl-badge is-muted">{course.parts[t.part] ?? `ภาค ${t.part}`}</span>
              {t.examItems && <span className="nl-badge is-muted">{t.examItems} ข้อ</span>}
            </span>
            <div className="nl-map-lessons">
              {t.lessons.map((l, i) => {
                const done = !!p.lessons[l.id]?.passedAt;
                const isToday = current.items.includes(l.id) && !done;
                const body = (
                  <>
                    <span className={`nl-dot${done ? ' is-done' : isToday ? ' is-today' : ''}`} aria-hidden="true">{done ? '✓' : ''}</span>
                    <span style={{ flexGrow: 1 }}>{l.kind === 'practice' ? `ชุดฝึก · ${l.title}` : `บทที่ ${i + 1} · ${l.title}`}</span>
                    {l.ready && l.priority && <span className={`nl-prio is-${l.priority}`}>{PRIORITY_LABEL[l.priority]}</span>}
                    {!l.ready && <span className="nl-badge is-muted">เร็วๆ นี้</span>}
                  </>
                );
                return l.ready ? (
                  <Link key={l.id} href={`${BASE}/${t.id}/${l.id}`} className="nl-map-lesson">{body}</Link>
                ) : (
                  <div key={l.id} className="nl-map-lesson is-soon">{body}</div>
                );
              })}
              {t.links?.map((lk) => (
                <Link key={lk.id} href={lk.href} className="nl-map-lesson">
                  <span className="nl-dot" aria-hidden="true" />
                  <span style={{ flexGrow: 1 }}>ชุดฝึก · {lk.title}</span>
                  <span className="nl-badge is-muted">{lk.meta}</span>
                </Link>
              ))}
              {t.hasSummary && (
                <Link href={`${BASE}/${t.id}/summary`} className="nl-map-lesson" style={{ background: 'var(--nl-soft)' }}>
                  <span className="nl-dot" aria-hidden="true" />
                  <span style={{ flexGrow: 1, fontWeight: 600 }}>หน้าสรุปเพื่อความเข้าใจ</span>
                </Link>
              )}
              {t.hasTest && t.lessons.some((l) => l.ready) && (
                <Link href={`${BASE}/${t.id}/test`} className="nl-map-lesson" style={{ background: 'var(--nl-soft)' }}>
                  <span className="nl-dot" aria-hidden="true" />
                  <span style={{ flexGrow: 1, fontWeight: 600 }}>ข้อสอบหัวข้อ {course.topicTestSize} ข้อ</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      {course.extraCard && (
        <section className="nl-card" style={{ opacity: 0.85 }}>
          <span className="nl-eyebrow">{course.extraCard.eyebrow}</span>
          <h2 className="nl-h2">{course.extraCard.title}</h2>
          <p className="nl-p-muted">{course.extraCard.body}</p>
          <span className="nl-badge is-muted" style={{ alignSelf: 'flex-start' }}>เร็วๆ นี้</span>
        </section>
      )}

      <footer className="nl-sources">
        <span>ความคืบหน้าบันทึกไว้ในเบราว์เซอร์นี้เท่านั้น ถ้าเปลี่ยนเครื่องหรือล้างข้อมูลเบราว์เซอร์ ความคืบหน้าจะเริ่มใหม่</span>
        <span>{course.footer}</span>
      </footer>
    </div>
  );
}

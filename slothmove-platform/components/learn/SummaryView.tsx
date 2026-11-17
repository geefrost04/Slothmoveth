'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Summary, Topic } from '@/lib/learn/types';
import type { Rating } from '@/lib/learn/progress';
import { useLearn } from './CourseContext';
import { BlockView, Rich } from './Blocks';
import { BackIcon } from './LessonView';
import { Sources } from './Sources';

const LEVELS: [string, string][] = [
  ['ยังงง', 'ย้อนไปอ่านส่วน "ภาพใหญ่" ของแต่ละบทก่อน แล้วกลับมาเปิดหน้านี้อีกครั้ง ค่อยทำข้อสอบหัวข้อ'],
  ['พอเข้าใจ', 'ลองทำข้อสอบหัวข้อนี้ ข้อที่ผิดจะบอกว่าชิ้นไหนยังไม่แน่น แล้วกลับมาเปิดชิ้นนั้นในหน้านี้'],
  ['อธิบายได้', 'พร้อมแล้ว ทำข้อสอบหัวข้อนี้ได้เลย แล้วหัวข้อนี้จะกลับมาให้ทวนอีกครั้งในอีกไม่กี่วัน']
];

export function SummaryView({ summary, topic }: { summary: Summary; topic: Topic }) {
  const { course, progress, actions } = useLearn();
  const BASE = course.base;
  const [open, setOpen] = useState(0);
  const [hide, setHide] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [prompts, setPrompts] = useState<Record<number, boolean>>({});
  const level = progress.ratings[topic.id];
  const firstLesson = topic.lessons[0];
  const allRefs = [...summary.sources];

  return (
    <div className="nl-wrap">
      <header className="nl-head">
        <div className="nl-head-row">
          <Link href={BASE} className="nl-back" aria-label="กลับไปแผนการเรียน"><BackIcon /></Link>
          <div className="nl-head-text">
            <span className="nl-head-kicker">สรุปเพื่อความเข้าใจ</span>
            <span className="nl-head-title">{topic.title}</span>
          </div>
        </div>
      </header>

      <div className="nl-hero" style={{ gap: 12 }}>
        <h1 className="nl-h1">ทั้งหัวข้อนี้ตอบคำถามเดียว</h1>
        <div className="nl-guide">
          <span className="nl-guide-q">“{summary.question}”</span>
          <span className="nl-guide-note"><Rich text={summary.questionNote} /></span>
        </div>
        {summary.asOf && <div className="nl-asof"><b>{summary.asOf}</b></div>}
      </div>

      <div className="nl-section-head">
        <span className="nl-eyebrow">ภาพใหญ่</span>
        <h2 className="nl-h2">{summary.flow.title ?? 'กลไกทั้งระบบในภาพเดียว'}</h2>
        <p className="nl-p-muted">อ่านจากบนลงล่าง ลูกศรแต่ละอันบอกว่าชั้นบนส่งอะไรให้ชั้นล่าง</p>
      </div>
      <BlockView block={{ ...summary.flow, title: undefined }} />

      <div className="nl-section-head" style={{ paddingTop: 28 }}>
        <span className="nl-eyebrow">ทีละชิ้น</span>
        <h2 className="nl-h2">แต่ละชิ้นคืออะไร ทำไมต้องมี</h2>
        <p className="nl-p-muted">แตะเพื่อเปิดอ่าน ทุกชิ้นตอบคำถามชุดเดียวกัน จะได้เทียบกันได้</p>
      </div>
      <div style={{ margin: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {summary.pieces.map((p, i) => (
          <div className="nl-acc" key={p.name}>
            <button type="button" className="nl-acc-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="nl-acc-n">{i + 1}</span>
              <span className="nl-acc-name">{p.name}</span>
              <span className="nl-acc-sign" aria-hidden="true">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="nl-acc-body">
                <div className="nl-acc-row"><span className="nl-acc-label">คืออะไร</span><span className="nl-acc-text"><Rich text={p.what} /></span></div>
                <div className="nl-acc-row"><span className="nl-acc-label">ทำไมต้องมี</span><span className="nl-acc-text"><Rich text={p.why} /></span></div>
                <div className="nl-acc-row"><span className="nl-acc-label">เชื่อมกับอะไร</span><span className="nl-acc-text"><Rich text={p.link} /></span></div>
                <div className="nl-key"><b>ประโยคเดียวที่ต้องเข้าใจ: </b><Rich text={p.key} /></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {summary.story && (
        <>
          <div className="nl-section-head" style={{ paddingTop: 28 }}>
            <span className="nl-eyebrow">เส้นเรื่อง</span>
            <h2 className="nl-h2">{summary.story.title}</h2>
          </div>
          <div className="nl-card" style={{ gap: 14 }}>
            {summary.story.steps.map((s, i) => (
              <div className="nl-story-step" key={i}>
                <span className="nl-story-n">{i + 1}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.45 }}>{s.title}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--nl-body)' }}><Rich text={s.body} /></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {summary.compare && (
        <section className="nl-card">
          <h2 className="nl-h2" style={{ fontSize: 19 }}>{summary.compare.title}</h2>
          <BlockView block={{ type: 'table', rows: summary.compare.rows, highlightCol: summary.compare.rows[0].length - 1 }} inCard />
          <p className="nl-p"><b>{summary.compare.whyLabel ?? 'ทำไมเปลี่ยน'}: </b><Rich text={summary.compare.why} /></p>
        </section>
      )}

      <div className="nl-section-head" style={{ paddingTop: 28 }}>
        <span className="nl-eyebrow">ตัวเลขที่ต้องแม่น</span>
        <h2 className="nl-h2">ตัวเลข พร้อมเหตุผลที่มันสำคัญ</h2>
      </div>
      <div style={{ margin: '10px 16px 0' }}>
        <button type="button" className="nl-toggle" aria-pressed={hide} onClick={() => { setHide(!hide); setRevealed({}); }}>
          <span className="nl-knob"><span /></span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>โหมดทดสอบตัวเอง</span>
            <span style={{ fontSize: 12, color: 'var(--nl-muted)' }}>
              ซ่อนตัวเลข แตะเพื่อเปิดทีละข้อ · {hide ? `เปิดแล้ว ${Object.keys(revealed).length} / ${summary.numbers.length}` : 'ปิดอยู่'}
            </span>
          </span>
        </button>
      </div>
      <div style={{ margin: '10px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {summary.numbers.map((f, i) => {
          const shown = !hide || revealed[i];
          return (
            <button type="button" className="nl-fact" key={f.label} onClick={() => setRevealed({ ...revealed, [i]: true })}>
              <span className="nl-fact-label">{f.label}</span>
              {shown ? <span className="nl-fact-value">{f.value}</span> : <span className="nl-fact-hidden">แตะเพื่อดู</span>}
              <span className="nl-fact-meaning"><Rich text={f.meaning} /></span>
            </button>
          );
        })}
      </div>

      <div className="nl-section-head" style={{ paddingTop: 28 }}>
        <span className="nl-eyebrow">เช็กว่าเข้าใจจริง</span>
        <h2 className="nl-h2">ลองตอบเป็นคำพูดตัวเองก่อนเปิดดู</h2>
      </div>
      <div style={{ margin: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {summary.prompts.map((p, i) => (
          <div className="nl-group" key={i}>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.55 }}><Rich text={p.q} /></span>
            <button type="button" className="nl-btn-ghost" style={{ alignSelf: 'flex-start' }} aria-expanded={!!prompts[i]} onClick={() => setPrompts({ ...prompts, [i]: !prompts[i] })}>
              {prompts[i] ? 'ซ่อนคำตอบตัวอย่าง' : 'เปิดดูคำตอบตัวอย่าง'}
            </button>
            {prompts[i] && <div className="nl-model"><Rich text={p.a} /></div>}
          </div>
        ))}
      </div>

      <section className="nl-card" style={{ marginTop: 24, borderRadius: 20 }}>
        <span className="nl-h3">ตอนนี้เข้าใจแค่ไหน</span>
        <div className="nl-levels">
          {LEVELS.map(([label], i) => (
            <button type="button" key={label} className="nl-level" aria-pressed={level === i} onClick={() => actions.rate(topic.id, i as Rating)}>
              {label}
            </button>
          ))}
        </div>
        <span className="nl-p-muted">{level === undefined ? 'เลือกระดับที่ตรงกับตัวเอง แล้วจะบอกว่าควรทำอะไรต่อ' : LEVELS[level][1]}</span>
        <Link href={`${BASE}/${topic.id}/test`} className="nl-btn">ทำข้อสอบหัวข้อนี้ {course.topicTestSize} ข้อ</Link>
        {firstLesson && <Link href={`${BASE}/${topic.id}/${firstLesson.id}`} className="nl-btn-soft">กลับไปอ่านบทเรียน</Link>}
      </section>

      <Sources refs={allRefs} />
    </div>
  );
}

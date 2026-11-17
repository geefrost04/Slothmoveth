'use client';

import { Fragment, useState } from 'react';
import type { Block, MCQ, Tone } from '@/lib/learn/types';
import { PRIORITY_LABEL } from '@/lib/learn/course';

/** Renders **bold** inside a string; everything else is plain text. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? <b key={i}>{part.slice(2, -2)}</b> : <Fragment key={i}>{part}</Fragment>
      )}
    </>
  );
}

const toneClass = (tone: Tone) => `nl-tone-${tone}`;
const LETTERS = ['ก', 'ข', 'ค', 'ง'];

function Arrow() {
  return (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" stroke="#9b8bd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v22" />
      <path d="M3 19l5 5 5-5" />
    </svg>
  );
}

function Explorer({ block }: { block: Extract<Block, { type: 'explorer' }> }) {
  const all = block.groups.flatMap((g) => g.items.map((item) => ({ ...item, group: g.name })));
  const [picked, setPicked] = useState(block.initial ?? all[0]?.key);
  const current = all.find((item) => item.key === picked) ?? all[0];
  return (
    <div className="nl-explorer" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 className="nl-h3">{block.title}</h3>
      {block.intro && <p className="nl-p-muted"><Rich text={block.intro} /></p>}
      <div className="nl-explorer-groups">
        {block.groups.map((g) => (
          <div className="nl-group" key={g.tag + g.name}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="nl-group-tag">{g.tag}</span>
              <span className="nl-group-name">{g.name}</span>
              {g.idea && <span className="nl-group-idea"><Rich text={g.idea} /></span>}
            </div>
            <div className="nl-chips">
              {g.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="nl-chip"
                  aria-pressed={item.key === current?.key}
                  aria-label={item.full}
                  onClick={() => setPicked(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {current && (
        <div className="nl-picked" aria-live="polite">
          <span className="nl-picked-tag">{current.group}</span>
          <span className="nl-picked-name">{current.full}</span>
          <span className="nl-picked-meaning"><Rich text={current.meaning} /></span>
        </div>
      )}
    </div>
  );
}

/** One MCQ with instant feedback (used by check blocks). */
export function CheckQuestion({ q, index, total }: { q: MCQ; index?: number; total?: number }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const right = chosen === q.answer;
  return (
    <div className="nl-mcq">
      {total ? <span className="nl-mcq-count">ข้อ {index! + 1} จาก {total}</span> : null}
      <span className="nl-mcq-q"><Rich text={q.q} /></span>
      {q.choices.map((choice, i) => {
        let cls = 'nl-opt';
        if (answered && i === q.answer) cls += ' is-right';
        else if (answered && i === chosen) cls += ' is-wrong';
        return (
          <button key={i} type="button" className={cls} disabled={answered} onClick={() => setChosen(i)}>
            {LETTERS[i]}. <Rich text={choice} />
          </button>
        );
      })}
      {answered && (
        <div className={`nl-feedback ${right ? 'is-right' : 'is-wrong'}`} role="status">
          <b>{right ? 'ถูกต้อง · ' : 'ยังไม่ใช่ · '}</b>
          <Rich text={q.why} />
        </div>
      )}
    </div>
  );
}

function Explain({ block }: { block: Extract<Block, { type: 'explain' }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="nl-explain">
      <span style={{ fontSize: 14, fontWeight: 700 }}>ลองอธิบายด้วยคำพูดตัวเอง</span>
      <span style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--nl-body)' }}><Rich text={block.prompt} /></span>
      <button type="button" className="nl-btn-ghost" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'ซ่อนตัวอย่างคำอธิบาย' : 'ดูตัวอย่างคำอธิบาย'}
      </button>
      {open && <div className="nl-model"><Rich text={block.model} /></div>}
    </div>
  );
}

/** Renders one block. `inCard` is true inside a section card (no outer margins). */
export function BlockView({ block, inCard = false }: { block: Block; inCard?: boolean }) {
  switch (block.type) {
    case 'section':
      return (
        <section id={block.anchor} className={block.priority ? `nl-card is-prio-${block.priority}` : 'nl-card'} data-toc={block.anchor && block.title ? block.title : undefined}>
          {(block.eyebrow || block.priority) && (
            <span className="nl-eyebrow-row">
              {block.eyebrow && <span className="nl-eyebrow">{block.eyebrow}</span>}
              {block.priority && <span className={`nl-prio is-${block.priority}`}>{PRIORITY_LABEL[block.priority]}</span>}
            </span>
          )}
          {block.title && <h2 className="nl-h2"><Rich text={block.title} /></h2>}
          {block.body?.map((p, i) => <p className="nl-p" key={i}><Rich text={p} /></p>)}
          {block.blocks?.map((b, i) => <BlockView block={b} inCard key={i} />)}
        </section>
      );
    case 'text': {
      const inner = block.body.map((p, i) => (
        <p className={block.muted ? 'nl-p-muted' : 'nl-p'} key={i}><Rich text={p} /></p>
      ));
      return inCard ? <>{inner}</> : <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>{inner}</div>;
    }
    case 'note':
      return (
        <div className="nl-note" style={inCard ? undefined : { margin: '14px 16px 0' }}>
          {block.title && <b>{block.title} </b>}
          <Rich text={block.body} />
        </div>
      );
    case 'context':
      return (
        <div className="nl-context">
          <span className="nl-context-title">{block.title}</span>
          {block.body.map((p, i) => <p key={i}><Rich text={p} /></p>)}
        </div>
      );
    case 'asOf':
      return (
        <div className={inCard ? 'nl-asof' : 'nl-asof nl-page-asof'}>
          <b>{block.date}</b>
          {block.note && <span>{block.note}</span>}
        </div>
      );
    case 'ladder':
      return (
        <>
          <div className="nl-ladder">
            {block.rungs.map((r, i) => (
              <Fragment key={i}>
                {i > 0 && <div className="nl-link"><span /></div>}
                <div className={`nl-rung ${toneClass(r.tone)}`}>
                  <span className="nl-rung-tag">{r.tag}</span>
                  <span className="nl-rung-name">{r.name}</span>
                  {r.desc && <span className="nl-rung-desc"><Rich text={r.desc} /></span>}
                  {r.side && (
                    <span className="nl-rung-side">
                      {r.side.map((s) => <span key={s}>{s}</span>)}
                    </span>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
          {block.after && <p className="nl-p-muted"><Rich text={block.after} /></p>}
        </>
      );
    case 'numbers':
      return (
        <div className="nl-numbers">
          {block.rows.map((r, i) => (
            <Fragment key={i}>
              <span className="nl-numbers-n">{r.n}</span>
              <div className="nl-numbers-body">
                <span className="nl-numbers-name">{r.name}</span>
                <span className="nl-numbers-desc"><Rich text={r.desc} /></span>
              </div>
            </Fragment>
          ))}
        </div>
      );
    case 'list': {
      const inner = (
        <>
          {block.title && <h3 className="nl-h3">{block.title}</h3>}
          <div className="nl-list">
            {block.items.map((item, i) => (
              <div className="nl-list-item" key={i}>
                <span className="nl-list-name"><Rich text={item.name} /></span>
                <span className="nl-list-desc"><Rich text={item.desc} /></span>
              </div>
            ))}
          </div>
        </>
      );
      return inCard ? inner : <div className="nl-card">{inner}</div>;
    }
    case 'explorer':
      return inCard ? <Explorer block={block} /> : <div style={{ margin: '14px 16px 0' }}><Explorer block={block} /></div>;
    case 'flow': {
      const inner = (
        <>
          {block.title && <h3 className="nl-h3">{block.title}</h3>}
          <div className="nl-flow">
            {block.nodes.map((n, i) => (
              <Fragment key={i}>
                <div className={`nl-flow-box ${toneClass(n.tone)}`}>
                  {n.level && <span className="nl-flow-level">{n.level}</span>}
                  <span className="nl-flow-name"><Rich text={n.name} /></span>
                  {n.role && <span className="nl-flow-role"><Rich text={n.role} /></span>}
                </div>
                {i < block.nodes.length - 1 && (
                  <div className="nl-flow-arrow">
                    <Arrow />
                    {block.arrows[i] && <span><Rich text={block.arrows[i]} /></span>}
                  </div>
                )}
              </Fragment>
            ))}
            {block.loopNote && <div className="nl-loop"><Rich text={block.loopNote} /></div>}
          </div>
        </>
      );
      return inCard ? inner : <div style={{ margin: '12px 16px 0' }}>{inner}</div>;
    }
    case 'table': {
      const [head, ...rows] = block.rows;
      const inner = (
        <>
          {block.title && <h3 className="nl-h3">{block.title}</h3>}
          <table className="nl-table">
            <thead>
              <tr>{head.map((h, i) => <th key={i} className={i === block.highlightCol ? 'nl-hi' : undefined}><Rich text={h} /></th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, i) => <td key={i} className={i === block.highlightCol ? 'nl-hi' : undefined}><Rich text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
          {block.after && <p className="nl-p-muted"><Rich text={block.after} /></p>}
        </>
      );
      return inCard ? inner : <div className="nl-card">{inner}</div>;
    }
    case 'timeline': {
      const inner = (
        <>
          {block.title && <h3 className="nl-h3">{block.title}</h3>}
          <div className="nl-timeline">
            {block.items.map((item, i) => (
              <Fragment key={i}>
                <div className="nl-tl-item">
                  <div className="nl-tl-rail"><span className="nl-tl-dot" /><span className="nl-tl-line" /></div>
                  <div className="nl-tl-body">
                    <span className="nl-tl-when">{item.when}</span>
                    <span className="nl-tl-label"><Rich text={item.label} /></span>
                    {item.desc && <span className="nl-tl-desc"><Rich text={item.desc} /></span>}
                  </div>
                </div>
                {item.now && <div className="nl-tl-now">ตอนนี้</div>}
              </Fragment>
            ))}
          </div>
        </>
      );
      return inCard ? inner : <div className="nl-card">{inner}</div>;
    }
    case 'quad': {
      const inner = (
        <>
          {block.title && <h3 className="nl-h3">{block.title}</h3>}
          <div className="nl-quad">
            {block.cells.map((c, i) => (
              <div className="nl-quad-cell" key={i}>
                <span className="nl-quad-tag">{c.tag}</span>
                <span className="nl-quad-name"><Rich text={c.name} /></span>
                {c.desc && <span className="nl-quad-desc"><Rich text={c.desc} /></span>}
              </div>
            ))}
          </div>
          {block.center && <p className="nl-quad-center"><Rich text={block.center} /></p>}
        </>
      );
      return inCard ? inner : <div className="nl-card">{inner}</div>;
    }
    case 'reasoning':
      return (
        <>
          <div className="nl-question"><Rich text={block.question} /></div>
          <div className="nl-steps">
            {block.steps.map((s, i) => (
              <div className="nl-step" key={i}>
                <span className="nl-step-n">คิด {i + 1}</span>
                <span><Rich text={s} /></span>
              </div>
            ))}
          </div>
          <div className="nl-answer"><b>คำตอบ: </b><Rich text={block.answer} /></div>
          {block.trap && <div className="nl-trap"><b>กับดัก: </b><Rich text={block.trap} /></div>}
        </>
      );
    case 'mistakes':
      return (
        <div className="nl-mistakes">
          <span className="nl-mistakes-title">จุดที่คนพลาดบ่อย และเหตุผล</span>
          {block.items.map((m, i) => (
            <div className="nl-mistake" key={i}><b>{m.title}</b> · <Rich text={m.body} /></div>
          ))}
        </div>
      );
    case 'check':
      return (
        <>
          <div id={block.anchor} className="nl-section-head">
            {block.eyebrow && <span className="nl-eyebrow">{block.eyebrow}</span>}
            {block.title && <h2 className="nl-h2">{block.title}</h2>}
          </div>
          {block.questions.map((q) => <CheckQuestion q={q} key={q.id} />)}
        </>
      );
    case 'explain':
      return <Explain block={block} />;
  }
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { MCQ } from '@/lib/learn/types';
import { Rich } from './Blocks';
import { BackIcon } from './LessonView';

const LETTERS = ['ก', 'ข', 'ค', 'ง'];

type Props = {
  title: string;
  kicker: string;
  questions: MCQ[];
  backHref: string;
  /** Called once with the score and the ids answered wrong. */
  onFinish?: (score: number, wrong: string[], answers: number[]) => void;
  /** "ข้อมูล ณ …" stamps for the data the questions use. */
  asOf?: string[];
  /** Rendered under the score on the result screen. */
  result?: (score: number, total: number) => React.ReactNode;
};

/** One question at a time; the answer and explanation show right after each pick. */
export function TestRunner({ title, kicker, questions, backHref, onFinish, result, asOf }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [review, setReview] = useState(false);

  const total = questions.length;
  const q = questions[index];
  const chosen = answers[index];
  const answered = chosen !== undefined;
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  function pick(i: number) {
    if (answered) return;
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
  }

  function advance() {
    if (index < total - 1) {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const wrong = questions.filter((qq, i) => answers[i] !== qq.answer).map((qq) => qq.id);
    onFinish?.(score, wrong, answers);
    setDone(true);
    window.scrollTo({ top: 0 });
  }

  const header = (
    <header className="nl-head">
      <div className="nl-head-row">
        <Link href={backHref} className="nl-back" aria-label="กลับ"><BackIcon /></Link>
        <div className="nl-head-text">
          <span className="nl-head-kicker">{kicker}</span>
          <span className="nl-head-title">{title}</span>
        </div>
        {!done && <span className="nl-head-meta">{index + 1}/{total}</span>}
      </div>
      {!done && (
        <div className="nl-progress" aria-hidden="true"><span style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} /></div>
      )}
    </header>
  );

  const stamp = asOf?.length ? (
    <div className="nl-asof nl-page-asof"><b>ข้อมูลที่ใช้ในข้อสอบ</b><span>{asOf.join(' · ')}</span></div>
  ) : null;

  if (done) {
    return (
      <div className="nl-wrap">
        {header}
        {stamp}
        <section className="nl-card" style={{ alignItems: 'flex-start' }}>
          <span className="nl-eyebrow">ผลแบบทดสอบ</span>
          <span className="nl-score">{score}/{total}</span>
          {result?.(score, total)}
          <button type="button" className="nl-btn-ghost" onClick={() => setReview(!review)} aria-expanded={review}>
            {review ? 'ซ่อนเฉลยทุกข้อ' : 'ดูเฉลยทุกข้อ'}
          </button>
        </section>
        {review &&
          questions.map((qq, qi) => {
            const right = answers[qi] === qq.answer;
            return (
              <div className="nl-mcq" key={qq.id}>
                <span className="nl-mcq-count">ข้อ {qi + 1} · {right ? 'ตอบถูก' : 'ตอบผิด'}</span>
                <span className="nl-mcq-q"><Rich text={qq.q} /></span>
                <div className={`nl-feedback ${right ? 'is-right' : 'is-wrong'}`}>
                  <b>คำตอบ: {LETTERS[qq.answer]}. <Rich text={qq.choices[qq.answer]} /></b>
                  {!right && answers[qi] !== undefined && <> · คุณเลือก {LETTERS[answers[qi]]}</>}
                  <br />
                  <Rich text={qq.why} />
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div className="nl-wrap">
      {header}
      {stamp}
      <div className="nl-mcq" style={{ marginTop: stamp ? 12 : 18 }}>
        <span className="nl-mcq-count">ข้อ {index + 1} จาก {total}</span>
        <span className="nl-mcq-q"><Rich text={q.q} /></span>
        {q.choices.map((choice, i) => {
          let cls = 'nl-opt';
          if (answered && i === q.answer) cls += ' is-right';
          else if (answered && i === chosen) cls += ' is-wrong';
          return (
            <button key={i} type="button" className={cls} disabled={answered} onClick={() => pick(i)}>
              {LETTERS[i]}. <Rich text={choice} />
            </button>
          );
        })}
        {answered && (
          <div className={`nl-feedback ${chosen === q.answer ? 'is-right' : 'is-wrong'}`} role="status">
            <b>{chosen === q.answer ? 'ถูกต้อง · ' : 'ยังไม่ใช่ · '}</b>
            <Rich text={q.why} />
          </div>
        )}
      </div>
      <div style={{ margin: '14px 16px 0' }}>
        <button type="button" className="nl-btn" style={{ width: '100%' }} disabled={!answered} onClick={advance}>
          {index < total - 1 ? 'ข้อต่อไป' : 'ดูผล'}
        </button>
      </div>
    </div>
  );
}

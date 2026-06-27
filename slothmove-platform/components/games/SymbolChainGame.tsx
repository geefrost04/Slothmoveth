'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface SymbolChainItem {
  statement: string;
  conclusion: string;
  targetStart: string;
  targetEnd: string;
  possibleChains: string[]; // e.g. ["A>B=C=F>G", "A>C=F>G"]
  correctAnswer: 'true' | 'false' | 'uncertain';
  explanation: string;
}

export function SymbolChainGame({
  items,
  courseId = 'ocsc',
  subjectId = 'analytical_thinking'
}: {
  items: SymbolChainItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [chain, setChain] = useState<string[]>([]);
  const [answer, setAnswer] = useState<'true' | 'false' | 'uncertain' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [chainSuccess, setChainSuccess] = useState(false);
  const [answerSuccess, setAnswerSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const currentItem = items[idx];

  if (!items.length) {
    return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูลสำหรับเกมนี้</p>;
  }

  if (done) {
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{customStyles}</style>
          <div className="sc-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">
              ต่อโซ่สัญลักษณ์สำเร็จ!
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              คุณผ่านด่านต่อสะพานเชื่อมโยงความสัมพันธ์สัญลักษณ์ครบแล้ว
            </p>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl inline-block mb-6">
              <strong className="block text-slate-900 dark:text-zinc-50 text-xl">
                ผ่านด่านสำเร็จ {score} / {items.length} ข้อ
              </strong>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setIdx(0);
                  setScore(0);
                  setDone(false);
                  setChain([]);
                  setAnswer(null);
                  setSubmitted(false);
                }}
                className="sc-btn px-8 py-3.5 rounded-2xl text-base font-bold cursor-pointer text-white"
              >
                🔄 เริ่มเล่นอีกครั้ง
              </button>
              <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline">
                ← กลับไปลานฝึก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract unique letters from statement and conclusion
  const allChars = (currentItem.statement + currentItem.conclusion)
    .replace(/[^A-Za-z]/g, '')
    .split('');
  const uniqueLetters = Array.from(new Set(allChars)).sort();
  const operators = ['>', '<', '=', '≥', '≤', '≠'];

  const handleTokenClick = (token: string) => {
    if (submitted) return;
    setChain((prev) => [...prev, token]);
  };

  const handleDelete = () => {
    if (submitted) return;
    setChain((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (submitted) return;
    setChain([]);
  };

  const handleVerify = () => {
    if (!currentItem || answer === null) return;

    const userChainStr = chain.join('');
    // Check if the built chain matches any possible correct chains (ignoring whitespaces)
    const isChainOk = currentItem.possibleChains.some(
      (pc) => pc.replace(/\s+/g, '') === userChainStr
    );
    const isAnswerOk = answer === currentItem.correctAnswer;

    setChainSuccess(isChainOk);
    setAnswerSuccess(isAnswerOk);
    const ok = isChainOk && isAnswerOk;
    setSuccess(ok);
    setSubmitted(true);
    if (ok) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= items.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setChain([]);
    setAnswer(null);
    setSubmitted(false);
  };

  const translation = {
    true: 'จริง',
    false: 'เท็จ',
    uncertain: 'ไม่แน่ชัด'
  };

  return (
    <div className="course-layout" data-course={courseId}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <style>{customStyles}</style>

        {/* Top Header Panel */}
        <div className="flex justify-between items-center mb-6 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-slate-900 dark:border-zinc-700 shadow-[4px_4px_0_var(--color-text)]">
          <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-500 dark:text-zinc-400 hover:underline">
            ← กลับลานฝึก
          </Link>
          <div className="flex items-center gap-4">
            <span>🔗 ด่านที่: {idx + 1} / {items.length}</span>
            <span>🎯 ผ่านแล้ว: {score}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="sc-card bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-400" />
          
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide block mb-1">
            ต่อโซ่ความสัมพันธ์ (Symbol Chain Bridge)
          </span>

          {/* Condition Box */}
          <div className="sc-box rounded-2xl border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 p-4 md:p-5 mb-6">
            <span className="text-xs font-bold text-slate-400 block mb-2">เงื่อนไขที่กำหนด:</span>
            <div className="font-mono text-lg md:text-xl font-black text-slate-800 dark:text-zinc-100 whitespace-pre-line leading-relaxed">
              {currentItem.statement}
            </div>
          </div>

          {/* Target Prompt */}
          <div className="mb-6 p-4 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl bg-amber-500/5">
            <p className="text-sm md:text-base text-slate-700 dark:text-zinc-300 m-0">
              จงเชื่อมโยงสายสัมพันธ์จากตัวแปร <strong>{currentItem.targetStart}</strong> ไปหา <strong>{currentItem.targetEnd}</strong> เพื่อหาข้อสรุป:
            </p>
            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mt-2">
              {currentItem.conclusion}
            </h3>
          </div>

          {/* Builder Board */}
          <div className="sc-builder-board border-2 border-slate-900 dark:border-zinc-700 rounded-2xl p-5 mb-6 bg-slate-50 dark:bg-zinc-800 min-h-[96px] flex flex-wrap items-center justify-center gap-2">
            {chain.length === 0 ? (
              <span className="text-sm text-slate-400 italic">สะพานเชื่อมโยงจะแสดงที่นี่ (คลิกปุ่มตัวแปร/เครื่องหมายด้านล่างเพื่อต่อสาย)</span>
            ) : (
              chain.map((token, tIdx) => {
                const isLetter = /^[A-Za-z]$/.test(token);
                return (
                  <span
                    key={tIdx}
                    className={`inline-flex items-center justify-center font-mono font-black text-lg px-3 py-1.5 rounded-lg border-2 border-slate-900 ${
                      isLetter ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200' : 'bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {token}
                  </span>
                );
              })
            )}
          </div>

          {/* Token Pool Buttons */}
          {!submitted && (
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap justify-center gap-2">
                {uniqueLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleTokenClick(letter)}
                    className="sc-btn-token font-mono font-black text-base w-11 h-11 rounded-xl border-2 border-slate-900 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-slate-800 dark:text-zinc-100 cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {operators.map((op) => (
                  <button
                    key={op}
                    onClick={() => handleTokenClick(op)}
                    className="sc-btn-token font-mono font-black text-base w-11 h-11 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 cursor-pointer"
                  >
                    {op}
                  </button>
                ))}
                <button
                  onClick={handleDelete}
                  className="sc-btn-token font-bold text-xs px-3 h-11 rounded-xl border-2 border-slate-900 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-slate-800 dark:text-zinc-100 cursor-pointer"
                >
                  ลบตัวท้าย (Del)
                </button>
                <button
                  onClick={handleClear}
                  className="sc-btn-token font-bold text-xs px-3 h-11 rounded-xl border-2 border-slate-900 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-slate-800 dark:text-zinc-100 cursor-pointer"
                >
                  ล้างข้อมูล (Clear)
                </button>
              </div>
            </div>
          )}

          {/* Conclusion Valuation Selection */}
          <div className="sc-valuation border-2 border-slate-900 dark:border-zinc-700 rounded-2xl p-5 mb-6 bg-slate-50 dark:bg-zinc-800 text-left">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 block mb-3">
              2. ตัดสินค่าความจริงของข้อสรุปย่อยด้านบน:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(['true', 'false', 'uncertain'] as const).map((choiceVal) => {
                const isSelected = answer === choiceVal;
                let btnClass = '';
                if (isSelected) btnClass = 'is-selected';
                if (submitted) {
                  if (choiceVal === currentItem.correctAnswer) {
                    btnClass = 'is-correct';
                  } else if (isSelected) {
                    btnClass = 'is-wrong';
                  } else {
                    btnClass = 'is-disabled';
                  }
                }
                return (
                  <button
                    key={choiceVal}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswer(choiceVal)}
                    className={`btn-eval eval-${choiceVal} ${btnClass} py-3 rounded-xl text-sm font-black cursor-pointer border-2 border-slate-900`}
                  >
                    {translation[choiceVal]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions & Explanations */}
          {!submitted ? (
            <div className="flex justify-center">
              <button
                type="button"
                disabled={chain.length === 0 || answer === null}
                onClick={handleVerify}
                className="sc-btn px-10 py-3.5 rounded-2xl text-base font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-white"
              >
                📥 ตรวจคำตอบโซ่สัญลักษณ์
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl text-left border border-dashed ${
                success 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
              }`}>
                <strong className="block font-bold text-base mb-2">
                  {success ? '🎉 ถูกต้องครบถ้วน!' : '❌ มีข้อผิดพลาดในแบบทดสอบ!'}
                </strong>
                <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-slate-700 dark:text-zinc-300 mb-4">
                  <li>การเชื่อมสะพาน: {chainSuccess ? '✅ ถูกต้อง' : '❌ สะพานไม่เชื่อมโยงหรือเขียนทิศทางสลับ'}</li>
                  <li>คำตอบความจริง: {answerSuccess ? '✅ ถูกต้อง' : '❌ สรุปค่าผิดหลักการยุบสัญลักษณ์'}</li>
                </ul>
                <div className="mt-2 text-xs md:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="block mb-1 text-slate-800 dark:text-zinc-200">💡 เฉลยสะพานเชื่อมโยง:</strong>
                  <p>โซ่สัญลักษณ์ที่ถูกต้อง: <code>{currentItem.possibleChains[0]}</code></p>
                  <div dangerouslySetInnerHTML={{ __html: currentItem.explanation }} />
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={handleNext} className="sc-btn px-8 py-3 rounded-xl font-bold cursor-pointer text-white">
                  {idx + 1 >= items.length ? 'เสร็จสิ้นภารกิจ' : 'ข้อถัดไป'} →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const customStyles = `
  .sc-card {
    border: 2px solid var(--color-text);
    box-shadow: 6px 6px 0 var(--color-text);
  }
  .sc-btn {
    border: 2px solid var(--color-text);
    box-shadow: 4px 4px 0 var(--color-text);
    background: var(--color-primary);
    transition: all 0.15s ease;
  }
  .sc-btn:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }
  .sc-btn-token {
    box-shadow: 3px 3px 0 var(--color-text);
    transition: all 0.15s ease;
  }
  .sc-btn-token:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 var(--color-text);
  }
  .btn-eval {
    background: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
    transition: all 0.15s ease;
  }
  .btn-eval:hover:not(:disabled) {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
  .btn-eval.is-selected {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  .btn-eval.is-correct {
    border-color: #10b981 !important;
    background: #d1fae5 !important;
    color: #065f46 !important;
    font-weight: 800;
  }
  .btn-eval.is-wrong {
    border-color: #f43f5e !important;
    background: #ffe4e6 !important;
    color: #9f1239 !important;
  }
  .btn-eval.is-disabled {
    opacity: 0.4;
    filter: grayscale(0.5);
  }
`;

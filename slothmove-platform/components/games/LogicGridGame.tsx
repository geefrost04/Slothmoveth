'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';

export interface LogicGridItem {
  title: string;
  description: string;
  clues: string[];
  rows: string[];
  columns: string[];
  solution: Record<string, string>; // maps rowName -> columnName
  explanation: string;
}

export function LogicGridGame({
  items,
  courseId = 'ocsc',
  subjectId = 'analytical_thinking'
}: {
  items: LogicGridItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [grid, setGrid] = useState<Record<string, Record<string, 'empty' | 'X' | 'check'>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useDonatePromptOnDone(done);

  const currentItem = items[idx];

  // Initialize grid state for the current item
  const initGrid = (item: LogicGridItem) => {
    const nextGrid: typeof grid = {};
    item.rows.forEach((r) => {
      nextGrid[r] = {};
      item.columns.forEach((c) => {
        nextGrid[r][c] = 'empty';
      });
    });
    setGrid(nextGrid);
    setSubmitted(false);
    setSuccess(false);
  };

  // Run on mount or when puzzle index changes
  useState(() => {
    if (currentItem) initGrid(currentItem);
  });

  if (!items.length) {
    return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูลสำหรับเกมนี้</p>;
  }

  if (done) {
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{customStyles}</style>
          <div className="lg-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">
              ไขปริศนาตารางตรรกะสำเร็จ!
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              คุณผ่านการฝึกวิเคราะห์เงื่อนไขภาษาทุกด่านเรียบร้อยแล้ว
            </p>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl inline-block mb-6">
              <strong className="block text-slate-900 dark:text-zinc-50 text-xl">
                ผ่านด่านครบ {score} / {items.length} ข้อ
              </strong>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setIdx(0);
                  setScore(0);
                  setDone(false);
                  initGrid(items[0]);
                }}
                className="lg-btn-submit px-8 py-3.5 rounded-2xl text-base font-bold cursor-pointer"
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

  const handleCellClick = (r: string, c: string) => {
    if (submitted) return;
    setGrid((prev) => {
      const nextCellState: 'empty' | 'X' | 'check' = 
        prev[r][c] === 'empty' ? 'X' : prev[r][c] === 'X' ? 'check' : 'empty';
      return {
        ...prev,
        [r]: {
          ...prev[r],
          [c]: nextCellState
        }
      };
    });
  };

  const handleVerify = () => {
    if (!currentItem) return;
    let ok = true;
    
    // Check if each row matches the solution
    currentItem.rows.forEach((r) => {
      const expectedCol = currentItem.solution[r];
      currentItem.columns.forEach((c) => {
        const cell = grid[r]?.[c] || 'empty';
        if (c === expectedCol) {
          if (cell !== 'check') ok = false;
        } else {
          if (cell === 'check') ok = false;
        }
      });
    });

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
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    initGrid(items[nextIdx]);
  };

  return (
    <div className="course-layout" data-course={courseId}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <style>{customStyles}</style>

        {/* Top Header Panel */}
        <div className="flex justify-between items-center mb-6 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-slate-900 dark:border-zinc-700 shadow-[4px_4px_0_var(--color-text)]">
          <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-500 dark:text-zinc-400 hover:underline">
            ← กลับลานฝึก
          </Link>
          <div className="flex items-center gap-4">
            <span>🧩 ปริศนาด่านที่: {idx + 1} / {items.length}</span>
            <span>🎯 ผ่านแล้ว: {score}</span>
          </div>
        </div>

        {/* Game Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Clues */}
          <div className="lg-card lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide block mb-1">
                เงื่อนไขภาษา (Linguistic Rules)
              </span>
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-zinc-50 mb-3">
                {currentItem.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
                {currentItem.description}
              </p>

              <div className="clues-box border-l-4 border-amber-500 bg-amber-500/5 p-4 rounded-r-xl">
                <strong className="text-xs font-black block text-amber-700 dark:text-amber-400 mb-2">📜 เบาะแสเงื่อนไข:</strong>
                <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-zinc-300 list-disc list-inside">
                  {currentItem.clues.map((clue, cIdx) => (
                    <li key={cIdx} className="leading-relaxed">{clue}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400">
              💡 วิธีเล่น: กดในช่องตารางขวาเพื่อเปลี่ยนสัญลักษณ์ (คลิก 1 ครั้งได้ ✗, คลิก 2 ครั้งได้ ✓, คลิก 3 ครั้งเพื่อเคลียร์)
            </div>
          </div>

          {/* Right Panel: Interactive Grid */}
          <div className="lg-card lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-400" />
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide block mb-4">
                ตารางกริดวิเคราะห์ (Logic Matrix Grid)
              </span>

              {/* Grid Matrix Table */}
              <div className="overflow-x-auto">
                <table className="lg-matrix-table w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-2 text-xs md:text-sm text-slate-800 dark:text-zinc-200">
                        รายชื่อ
                      </th>
                      {currentItem.columns.map((col) => (
                        <th key={col} className="border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-2 text-xs md:text-sm text-slate-800 dark:text-zinc-200 font-bold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItem.rows.map((row) => (
                      <tr key={row}>
                        <td className="border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-3 text-xs md:text-sm font-black text-slate-800 dark:text-zinc-200 text-center">
                          {row}
                        </td>
                        {currentItem.columns.map((col) => {
                          const state = grid[row]?.[col] || 'empty';
                          const isCorrectCell = currentItem.solution[row] === col;
                          
                          let bg = '';
                          if (state === 'check') bg = 'bg-amber-50 dark:bg-amber-950/20';
                          if (submitted) {
                            if (isCorrectCell) {
                              bg = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500';
                            } else if (state === 'check') {
                              bg = 'bg-red-100 dark:bg-red-950/40 border-red-500';
                            }
                          }

                          return (
                            <td
                              key={`${row}-${col}`}
                              onClick={() => handleCellClick(row, col)}
                              className={`border-2 border-slate-900 dark:border-zinc-700 p-3 cursor-pointer text-center text-lg md:text-xl font-bold transition-all duration-150 ${bg}`}
                            >
                              {state === 'X' && <span className="text-red-500 dark:text-red-400">✗</span>}
                              {state === 'check' && <span className="text-amber-500 dark:text-amber-400">✓</span>}
                              {state === 'empty' && <span className="opacity-0">·</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Validation / Control panel */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800">
              {!submitted ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleVerify}
                    className="lg-btn-submit px-8 py-3 rounded-xl font-bold text-sm cursor-pointer"
                  >
                    🚀 ส่งคำตอบประเมิน (Submit Grid)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Banner */}
                  <div className={`p-4 rounded-xl border border-dashed text-left text-xs md:text-sm ${
                    success 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
                  }`}>
                    <strong className="block font-bold text-sm mb-1">
                      {success ? '✅ ยอดเยี่ยม ไขรหัสตรรกะถูกต้อง!' : '❌ เกือบถูกแล้ว ลองวิเคราะห์ข้อมูลคำลวงใหม่!'}
                    </strong>
                    <div className="mt-2 text-slate-700 dark:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentItem.explanation }} />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleNext}
                      className="lg-btn-submit px-8 py-3 rounded-xl font-bold text-sm cursor-pointer"
                    >
                      {idx + 1 >= items.length ? 'เสร็จสิ้นการประเมิน' : 'ข้อถัดไป'} →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

const customStyles = `
  .lg-card {
    border: 2px solid var(--color-text);
    box-shadow: 5px 5px 0 var(--color-text);
  }
  .lg-btn-submit {
    border: 2px solid var(--color-text);
    box-shadow: 4px 4px 0 var(--color-text);
    background: var(--color-primary);
    color: #fff;
    transition: all 0.15s ease;
  }
  .lg-btn-submit:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }
  .lg-matrix-table th, .lg-matrix-table td {
    vertical-align: middle;
  }
  .lg-matrix-table td:hover:not([bg]) {
    background: var(--color-accent-soft);
  }
`;

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { evaluatePoliceBenchmark } from '@/lib/police-exam-benchmark';
import {
  EXAM_TOTAL, PART_A_MAX, PART_A_PASS, PART_B_MAX, PART_B_PASS, PLAN_SUBJECTS, SCORE_LEVELS, autoSplit,
  type PlanSubject
} from '@/lib/policeScorePlan';
import styles from './PoliceScorePlanner.module.css';

type Plan = Record<PlanSubject['id'], number>;
type Current = { score: number; perSubject: Partial<Plan>; date: string } | null;

const STORAGE_KEY = 'slothmove:score-plan:police_admin';

// Latest police Mock Test on this device (ExamRunner keeps the last 10 results per set in localStorage).
function readLatestMock(): Current {
  try {
    let latest: { score: number; total: number; completedAt: string; categoryResults?: { category: string; correct: number; total: number }[] } | null = null;
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith('slothmove:exam-history:police-mock_test-')) continue;
      const entries = JSON.parse(window.localStorage.getItem(key) || '[]');
      const entry = Array.isArray(entries) ? entries[0] : null;
      if (entry?.total === EXAM_TOTAL && (!latest || entry.completedAt > latest.completedAt)) latest = entry;
    }
    if (!latest) return null;
    const perSubject: Partial<Plan> = {};
    for (const subject of PLAN_SUBJECTS) {
      const found = latest.categoryResults?.find((item) => item.category === subject.category);
      if (found) perSubject[subject.id] = found.correct;
    }
    return { score: latest.score, perSubject, date: latest.completedAt };
  } catch {
    return null;
  }
}

function levelOf(score: number) {
  return [...SCORE_LEVELS].reverse().find((level) => score >= level.score) ?? null;
}

export function PoliceScorePlanner() {
  const [target, setTarget] = useState(117);
  const [plan, setPlan] = useState<Plan>(() => autoSplit(117));
  const [current, setCurrent] = useState<Current>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved?.target && saved?.plan) { setTarget(saved.target); setPlan({ ...autoSplit(saved.target), ...saved.plan }); }
    } catch { /* first visit or storage blocked */ }
    setCurrent(readLatestMock());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ target, plan })); } catch { /* storage blocked */ }
  }, [plan, ready, target]);

  const total = PLAN_SUBJECTS.reduce((sum, subject) => sum + plan[subject.id], 0);
  const partA = PLAN_SUBJECTS.filter((subject) => subject.part === 'a').reduce((sum, subject) => sum + plan[subject.id], 0);
  const partB = total - partA;
  const benchmark = useMemo(
    () => evaluatePoliceBenchmark(total, EXAM_TOTAL, PLAN_SUBJECTS.map((subject) => ({ category: subject.category, total: subject.max, correct: plan[subject.id] }))),
    [plan, total]
  );
  const level = levelOf(total);
  const diff = total - target;

  function chooseTarget(next: number, source: string) {
    const value = Math.max(PART_A_PASS + PART_B_PASS, Math.min(EXAM_TOTAL, next));
    setTarget(value);
    setPlan(autoSplit(value));
    trackAnalyticsEvent('score_plan_target', { target: value, source });
  }

  function setSubject(id: PlanSubject['id'], value: number) {
    setPlan((prev) => ({ ...prev, [id]: value }));
  }

  // The bar shows 60–150 so the cutoffs (90–125) don't crowd together on phones.
  const LADDER_MIN = 60;
  const pct = (score: number) => `${Math.max(0, Math.min(100, ((score - LADDER_MIN) / (EXAM_TOTAL - LADDER_MIN)) * 100))}%`;

  return (
    <div className={styles.wrap}>
      {/* 1. Target */}
      <section className={styles.card} aria-labelledby="plan-target">
        <div className={styles.step}><b>1</b><h2 id="plan-target">ตั้งเป้าคะแนน</h2></div>
        <div className={styles.presets}>
          {SCORE_LEVELS.map((item) => (
            <button type="button" key={item.score} className={`${styles.preset} ${styles[item.tone]} ${target === item.score ? styles.on : ''}`} onClick={() => chooseTarget(item.score, 'preset')}>
              <strong>{item.score}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <label className={styles.custom}>
          <span>หรือกำหนดเอง</span>
          <input type="range" min={PART_A_PASS + PART_B_PASS} max={EXAM_TOTAL} value={target} onChange={(event) => chooseTarget(Number(event.target.value), 'slider')} aria-label="เป้าคะแนนรวม" />
          <output>{target}<small>/150</small></output>
        </label>

        {/* Ladder: where the plan sits against past cutoffs */}
        <div className={styles.ladder} aria-hidden="true">
          <div className={styles.track}>
            <i className={styles.fill} style={{ width: pct(total) }} />
            {SCORE_LEVELS.map((item) => (
              <span key={item.score} className={`${styles.mark} ${styles[item.tone]}`} style={{ left: pct(item.score) }}><em>{item.score}</em><small>{item.short}</small></span>
            ))}
            <span className={styles.edge} style={{ left: 0 }}>60</span>
            <span className={styles.edge} style={{ left: '100%' }}>150</span>
            {current ? <span className={styles.me} style={{ left: pct(current.score) }}><em>{current.score}</em><small>ล่าสุดของคุณ</small></span> : null}
          </div>
        </div>
        <p className={styles.footnote}>คะแนนที่ติดปี 62 และ 65 เป็นสถิติที่เว็บรวบรวมไว้ (ประมาณ) ไม่ใช่ประกาศทางการ ปีนี้อาจสูงหรือต่ำกว่านี้</p>
      </section>

      {/* 2. Subjects */}
      <section className={styles.card} aria-labelledby="plan-subjects">
        <div className={styles.step}><b>2</b><h2 id="plan-subjects">แบ่งคะแนนรายวิชา</h2>
          <button type="button" className={styles.reset} onClick={() => chooseTarget(target, 'auto_split')}>แบ่งให้อัตโนมัติ</button>
        </div>
        <p className={styles.hint}>ลากปรับได้ตามวิชาที่ถนัด ระบบเช็กเกณฑ์ภาค ก และภาค ข ให้</p>

        {(['a', 'b'] as const).map((part) => {
          const partScore = part === 'a' ? partA : partB;
          const partMax = part === 'a' ? PART_A_MAX : PART_B_MAX;
          const partPass = part === 'a' ? PART_A_PASS : PART_B_PASS;
          const ok = partScore >= partPass;
          return (
            <div className={styles.part} key={part}>
              <div className={styles.partHead}>
                <strong>{part === 'a' ? 'ภาค ก · ความรู้ความสามารถทั่วไป' : 'ภาค ข · ความรู้เฉพาะตำแหน่ง'}</strong>
                <span className={ok ? styles.okTag : styles.badTag}>{partScore}/{partMax} {ok ? '✓ ผ่านเกณฑ์' : `ขาดอีก ${partPass - partScore} ข้อ`}</span>
              </div>
              {PLAN_SUBJECTS.filter((subject) => subject.part === part).map((subject) => {
                const value = plan[subject.id];
                const now = current?.perSubject[subject.id];
                return (
                  <div className={styles.subject} key={subject.id}>
                    <div className={styles.subjectTop}>
                      <span className={styles.subjectName}>{subject.title}<small>{subject.max} ข้อ</small></span>
                      <span className={styles.subjectNums}>
                        <strong>{value}</strong>/{subject.max}
                        <small>ผิดได้ {subject.max - value} ข้อ</small>
                      </span>
                    </div>
                    <input type="range" min={0} max={subject.max} value={value} onChange={(event) => setSubject(subject.id, Number(event.target.value))} aria-label={`เป้า ${subject.title}`} />
                    {now !== undefined ? (
                      <p className={styles.now}>
                        ล่าสุดทำได้ {now}/{subject.max}
                        {value > now ? <> · <b>ต้องเพิ่มอีก {value - now} ข้อ</b> <Link href={subject.drillHref}>ฝึกวิชานี้ →</Link></> : <> · <span className={styles.okText}>ถึงเป้าแล้ว</span></>}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>

      {/* 3. Result */}
      <section className={`${styles.card} ${styles.result}`} aria-labelledby="plan-result">
        <div className={styles.step}><b>3</b><h2 id="plan-result">ถ้าทำได้ตามแผน</h2></div>
        <div className={styles.resultTop}>
          <div className={styles.total}><strong>{total}</strong><span>/150 ข้อ</span></div>
          <div>
            <p className={styles.zone}>{benchmark.isOfficialPassed ? benchmark.zoneLabel : 'ยังไม่ผ่านเกณฑ์รายภาค'}</p>
            <p className={styles.rank}>{benchmark.isOfficialPassed ? benchmark.estimatedRankText : 'ต้องได้ 60% ทั้งภาค ก และภาค ข ก่อน จึงจะมีสิทธิ์ติดอันดับ'}</p>
          </div>
        </div>
        <ul className={styles.checks}>
          <li className={partA >= PART_A_PASS ? styles.yes : styles.no}>ภาค ก {partA}/40 (ต้องได้ 24 ขึ้นไป)</li>
          <li className={partB >= PART_B_PASS ? styles.yes : styles.no}>ภาค ข {partB}/110 (ต้องได้ 66 ขึ้นไป)</li>
          <li className={diff >= 0 ? styles.yes : styles.no}>{diff >= 0 ? `ถึงเป้า ${target} แล้ว` : `ยังขาดจากเป้า ${target} อีก ${-diff} ข้อ`}</li>
          {level ? <li className={styles.yes}>อยู่ระดับ “{level.label}”</li> : null}
          {current ? <li className={current.score >= total ? styles.yes : styles.no}>Mock Test ล่าสุดของคุณ {current.score}/150 {current.score >= total ? '· ถึงแผนแล้ว' : `· ต้องเพิ่มอีก ${total - current.score} ข้อ`}</li> : null}
        </ul>
        <div className={styles.actions}>
          <Link href="/courses/police_admin/mock-test" className={styles.primary} onClick={() => trackAnalyticsEvent('score_plan_mock_click', { target, planned: total })}>
            {current ? 'ทำ Mock Test ชุดใหม่ วัดผลกับแผน' : 'ทำ Mock Test เพื่อดูคะแนนตอนนี้'} →
          </Link>
          <Link href="/courses/police_admin" className={styles.secondary}>กลับหน้าคอร์ส</Link>
        </div>
        <p className={styles.footnote}>แผนนี้บันทึกไว้ในเครื่องนี้อัตโนมัติ ช่วงอันดับเป็นการประมาณจากสถิติรอบก่อน ใช้เป็นแนวทางเท่านั้น</p>
      </section>
    </div>
  );
}

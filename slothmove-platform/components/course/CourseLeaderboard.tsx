'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CourseConfig } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';

type ScoreRow = {
  id?: string | number;
  nickname: string;
  dept?: string | null;
  subject?: string | null;
  score: number;
  total: number;
  pct: number;
  mode?: number | null;
  time_sec?: number | null;
  created_at?: string | null;
};

function formatTime(sec?: number | null) {
  if (!sec) return '—';
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return minutes > 0 ? `${minutes}น ${seconds}ว` : `${seconds}ว`;
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  } catch {
    return '—';
  }
}

function getInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function hashStr(s: string): number {
  return [...s].reduce((sum, char) => sum + ((char.charCodeAt(0) << 5) - char.charCodeAt(0)), 0);
}

// 12 distinct gradients — each avatar gets a unique shape pattern too
// so two players with the same first letter still look different.
const AVATAR_PALETTE: { gradient: string; ring: string; shape: number }[] = [
  { gradient: 'linear-gradient(135deg, #f0b429 0%, #d97706 100%)', ring: '#f0b429', shape: 0 },
  { gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', ring: '#ec4899', shape: 1 },
  { gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', ring: '#6366f1', shape: 2 },
  { gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', ring: '#14b8a6', shape: 3 },
  { gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)', ring: '#f97316', shape: 4 },
  { gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)', ring: '#06b6d4', shape: 5 },
  { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', ring: '#8b5cf6', shape: 6 },
  { gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', ring: '#ef4444', shape: 7 },
  { gradient: 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)', ring: '#84cc16', shape: 8 },
  { gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', ring: '#f59e0b', shape: 0 },
  { gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', ring: '#a855f7', shape: 1 },
  { gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)', ring: '#0ea5e9', shape: 2 }
];

function getAvatarStyle(nickname: string) {
  const idx = Math.abs(hashStr(nickname)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

// Decorative inner pattern — gives each avatar a unique "face" beyond initials.
// Each shape renders a different SVG: stripes, dots, arcs, etc.
function AvatarPattern({ shape, color }: { shape: number; color: string }) {
  const props = {
    width: '40',
    height: '40',
    viewBox: '0 0 40 40',
    style: { position: 'absolute' as const, inset: 0, opacity: 0.22, mixBlendMode: 'overlay' as const },
    'aria-hidden': true
  };
  if (shape === 0) {
    return (
      <svg {...props}>
        <path d="M0 30 L40 30 L40 40 L0 40 Z" fill={color} />
        <path d="M0 10 L40 10 L40 14 L0 14 Z" fill={color} />
      </svg>
    );
  }
  if (shape === 1) {
    return (
      <svg {...props}>
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="30" cy="30" r="3" fill={color} />
        <circle cx="30" cy="10" r="2" fill={color} />
        <circle cx="10" cy="30" r="2" fill={color} />
      </svg>
    );
  }
  if (shape === 2) {
    return (
      <svg {...props}>
        <path d="M0 20 Q20 0 40 20 Q20 40 0 20 Z" fill={color} />
      </svg>
    );
  }
  if (shape === 3) {
    return (
      <svg {...props}>
        <rect x="6" y="6" width="8" height="8" fill={color} transform="rotate(45 10 10)" />
        <rect x="26" y="26" width="8" height="8" fill={color} transform="rotate(45 30 30)" />
      </svg>
    );
  }
  if (shape === 4) {
    return (
      <svg {...props}>
        <path d="M5 5 L15 5 L15 15 L5 15 Z" fill={color} />
        <path d="M25 5 L35 5 L35 15 L25 15 Z" fill={color} />
        <path d="M5 25 L15 25 L15 35 L5 35 Z" fill={color} />
      </svg>
    );
  }
  if (shape === 5) {
    return (
      <svg {...props}>
        <path d="M0 0 L40 40 M40 0 L0 40" stroke={color} strokeWidth="2" />
      </svg>
    );
  }
  if (shape === 6) {
    return (
      <svg {...props}>
        <path d="M0 35 Q10 5 20 25 T40 35" stroke={color} strokeWidth="3" fill="none" />
      </svg>
    );
  }
  if (shape === 7) {
    return (
      <svg {...props}>
        <path d="M0 0 L20 0 L20 20 L0 20 Z" fill={color} />
        <path d="M20 20 L40 20 L40 40 L20 40 Z" fill={color} opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="20" cy="20" r="8" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Avatar({
  nickname,
  size = 'lg',
  rank,
  withRing = false
}: {
  nickname: string;
  size?: 'lg' | 'sm';
  rank?: number;
  withRing?: boolean;
}) {
  const avatar = getAvatarStyle(nickname);
  const initials = getInitials(nickname);
  return (
    <div
      className={`leaderboard-avatar is-${size}${rank === 1 ? ' is-champion' : ''}${withRing ? ' has-ring' : ''}`}
      style={{ background: avatar.gradient, ['--avatar-ring' as string]: avatar.ring }}
    >
      <AvatarPattern shape={avatar.shape} color="#fff" />
      <span className="leaderboard-avatar-initials">{initials}</span>
      {rank === 1 && <span className="leaderboard-avatar-crown" aria-hidden="true">👑</span>}
    </div>
  );
}

function getMedal(rank: number) {
  if (rank === 1) return { emoji: '👑', glow: '#f0b429', label: 'แชมป์ประจำรอบ' };
  if (rank === 2) return { emoji: '🥈', glow: '#94a3b8', label: 'รองชนะเลิศ' };
  if (rank === 3) return { emoji: '🥉', glow: '#b45309', label: 'อันดับ 3' };
  return null;
}

function pctGradient(pct: number) {
  if (pct >= 80) return 'linear-gradient(90deg, #f0b429, #d97706)';
  if (pct >= 60) return 'linear-gradient(90deg, #60a5fa, #2563eb)';
  return 'linear-gradient(90deg, #f87171, #dc2626)';
}

function isMockExam(row: ScoreRow) {
  const subject = row.subject ?? '';
  return subject.includes('จำลอง') || subject.includes('Mock') || row.total >= 100;
}

export function CourseLeaderboard({ course }: { course: CourseConfig }) {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [sortBy, setSortBy] = useState<'pct' | 'time' | 'recent'>('pct');
  const [typeFilter, setTypeFilter] = useState<'quiz' | 'mock'>('mock');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const availableSubjects = useMemo(() => {
    // Always show all subjects defined in the course registry, so users can
    // pick a subject even before anyone has saved a score for it yet.
    const titles = course.subjects.map((subject) => subject.title).filter(Boolean);
    return [...new Set(titles)].sort((a, b) => a.localeCompare(b, 'th'));
  }, [course.subjects]);

  useEffect(() => {
    let cancelled = false;

    async function loadScores() {
      const supabase = getSupabase();
      if (!supabase) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage('ยังไม่ได้ตั้งค่า Supabase สำหรับโปรเจกต์นี้');
        return;
      }

      try {
        const result = await supabase
          .from('scores')
          .select('*')
          .order('pct', { ascending: false })
          .order('time_sec', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(500);

        if (result.error) throw result.error;

        const filtered = (result.data as ScoreRow[]).filter((row) => {
          // Match legacy leaderboard.html behaviour: keep rows whose `dept`
          // matches this course. Legacy also did a substring search for
          // "ป้องกันและบรรเทา" / "แผนการป้องกันและบรรเทา" as a fallback for
          // older rows that pre-date the `dept` column.
          if (row.dept === course.id) return true;
          const subject = row.subject ?? '';
          return (
            subject.includes('ป้องกันและบรรเทา') ||
            subject.includes('แผนการป้องกันและบรรเทา')
          );
        });

        if (cancelled) return;
        setRows(filtered);
        setStatus(filtered.length ? 'ready' : 'empty');
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ');
      }
    }

    void loadScores();

    return () => {
      cancelled = true;
    };
  }, [course.id]);

  const filteredRows = useMemo(() => {
    let next = rows.filter((row) => typeFilter === 'mock' ? isMockExam(row) : !isMockExam(row));

    if (typeFilter === 'quiz' && subjectFilter !== 'all') {
      next = next.filter((row) => row.subject === subjectFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      next = next.filter((row) => (row.nickname ?? '').toLowerCase().includes(query));
    }

    const sorted = [...next];
    if (sortBy === 'pct') {
      sorted.sort((a, b) =>
        (b.pct - a.pct) ||
        ((a.time_sec ?? Number.POSITIVE_INFINITY) - (b.time_sec ?? Number.POSITIVE_INFINITY)) ||
        (new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      );
    } else if (sortBy === 'time') {
      sorted.sort((a, b) =>
        ((a.time_sec ?? Number.POSITIVE_INFINITY) - (b.time_sec ?? Number.POSITIVE_INFINITY)) ||
        (b.pct - a.pct)
      );
    } else {
      sorted.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    }
    return sorted;
  }, [rows, typeFilter, subjectFilter, searchQuery, sortBy]);

  const stats = useMemo(() => {
    if (!filteredRows.length) {
      return { total: '—', avg: '—', top: '—', fastest: '—' };
    }
    const avg = Math.round(filteredRows.reduce((sum, row) => sum + row.pct, 0) / filteredRows.length);
    const top = Math.max(...filteredRows.map((row) => row.pct));
    const fastestRows = filteredRows.filter((row) => (row.time_sec ?? 0) > 0);
    return {
      total: String(filteredRows.length),
      avg: `${avg}%`,
      top: `${top}%`,
      fastest: fastestRows.length ? formatTime(Math.min(...fastestRows.map((row) => row.time_sec ?? 0))) : '—'
    };
  }, [filteredRows]);

  const podiumRows = filteredRows.slice(0, 3);
  const rankRows = filteredRows.slice(3, 100);

  return (
    <div className="leaderboard-shell">
      <section className="leaderboard-hero">
        <div className="container leaderboard-hero-inner">
          <div className="leaderboard-hero-copy">
            <div className="course-subject-chip">Leaderboard</div>
            <h1>กระดานคะแนน {course.id.toUpperCase()}</h1>
            <p>รวมผลคะแนนจากผู้ที่ทำข้อสอบในคอร์สนี้ เรียงตามความแม่น เวลา และรอบที่ทำล่าสุด</p>
          </div>
          <div className="leaderboard-stat-grid">
            <article><span>ผู้เล่น</span><strong>{stats.total}</strong></article>
            <article><span>ค่าเฉลี่ย</span><strong>{stats.avg}</strong></article>
            <article><span>สูงสุด</span><strong>{stats.top}</strong></article>
            <article><span>เร็วสุด</span><strong>{stats.fastest}</strong></article>
          </div>
        </div>
      </section>

      <div className="container course-subject-body leaderboard-body">
        <section className="pab-knowledge-section leaderboard-filter-panel">
          <div className="leaderboard-filter-row">
            <div className="leaderboard-tabs">
              <button
                type="button"
                className={typeFilter === 'quiz' ? 'is-active' : ''}
                onClick={() => setTypeFilter('quiz')}
              >
                ควิซรายวิชา
              </button>
              <button
                type="button"
                className={typeFilter === 'mock' ? 'is-active' : ''}
                onClick={() => setTypeFilter('mock')}
              >
                ชุดยาว / Mock
              </button>
            </div>

            <div className="leaderboard-sort-row">
              <button type="button" className={sortBy === 'pct' ? 'is-active' : ''} onClick={() => setSortBy('pct')}>คะแนน</button>
              <button type="button" className={sortBy === 'time' ? 'is-active' : ''} onClick={() => setSortBy('time')}>เวลา</button>
              <button type="button" className={sortBy === 'recent' ? 'is-active' : ''} onClick={() => setSortBy('recent')}>ล่าสุด</button>
            </div>
          </div>

          <div className="leaderboard-filter-row">
            <input
              className="leaderboard-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ค้นหาชื่อเล่น"
            />

            {typeFilter === 'quiz' && (
              <select
                className="leaderboard-subject-select"
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
              >
                <option value="all">ทุกวิชา</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            )}
          </div>
        </section>

        {status === 'loading' && (
          <section className="pab-knowledge-section leaderboard-state-panel">
            <p>กำลังโหลดคะแนน...</p>
          </section>
        )}

        {status === 'error' && (
          <section className="pab-knowledge-section leaderboard-state-panel">
            <h2>โหลดข้อมูลไม่สำเร็จ</h2>
            <p>{errorMessage}</p>
          </section>
        )}

        {(status === 'empty' || (status === 'ready' && filteredRows.length === 0)) && (
          <section className="pab-knowledge-section leaderboard-state-panel">
            <h2>ยังไม่มีคะแนนในเงื่อนไขนี้</h2>
            <p>ลองทำข้อสอบแล้วบันทึกคะแนนจากหน้าควิซก่อน แล้วอันดับจะมาแสดงที่หน้านี้</p>
          </section>
        )}

        {status === 'ready' && filteredRows.length > 0 && (
          <>
            <section className="pab-knowledge-section leaderboard-podium-panel">
              <div className="pab-knowledge-section-header">
                <div className="pab-knowledge-section-icon">🏆</div>
                <div>
                  <div className="pab-knowledge-section-chip">Top Ranking</div>
                  <h2 className="pab-knowledge-section-title">อันดับเด่นของรอบนี้</h2>
                  <p className="pab-knowledge-section-desc">เรียงตามคะแนนสูงสุด เวลาน้อยกว่าได้เปรียบเมื่อเปอร์เซ็นต์เท่ากัน</p>
                </div>
              </div>

              <div className="leaderboard-podium">
                {[podiumRows[1], podiumRows[0], podiumRows[2]].map((row, index) => {
                  const rank = [2, 1, 3][index];
                  const medal = getMedal(rank);
                  if (!row) return <div key={rank} className="leaderboard-podium-card is-empty"><span className="leaderboard-podium-medal">{medal?.emoji}</span></div>;
                  return (
                    <article
                      key={`${row.nickname}-${rank}-${row.created_at ?? ''}`}
                      className={`leaderboard-podium-card is-rank-${rank}`}
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <span className="leaderboard-podium-medal">{medal?.emoji}</span>
                      <Avatar nickname={row.nickname} size="lg" rank={rank} withRing />
                      <strong>{row.nickname}</strong>
                      <p className="leaderboard-podium-score">{row.pct}%</p>
                      <div className="leaderboard-podium-bar" aria-hidden="true">
                        <span style={{ width: `${row.pct}%`, background: pctGradient(row.pct) }} />
                      </div>
                      <p className="leaderboard-podium-detail">{row.score}/{row.total} ข้อ · {formatTime(row.time_sec)}</p>
                      <span className="leaderboard-podium-subject">{row.subject ?? 'ไม่ระบุวิชา'}</span>
                      <span className="leaderboard-podium-tag">{medal?.label}</span>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="pab-knowledge-section leaderboard-list-panel">
              <div className="pab-knowledge-section-header">
                <div className="pab-knowledge-section-icon">📋</div>
                <div>
                  <div className="pab-knowledge-section-chip">Full Ranking</div>
                  <h2 className="pab-knowledge-section-title">อันดับทั้งหมด</h2>
                  <p className="pab-knowledge-section-desc">แสดงสูงสุด 100 รายการแรกของผลลัพธ์ชุดนี้</p>
                </div>
              </div>

              <div className="leaderboard-rank-list">
                {rankRows.length === 0 ? (
                  <p className="leaderboard-small-note">ทั้งหมดอยู่บน podium แล้ว</p>
                ) : (
                  rankRows.map((row, index) => {
                    // Soft rank-change cue: compare to the row above. Ties = flat,
                    // higher pct = up, lower pct = down. Skipped on the first row
                    // (no comparison available).
                    const prev = index > 0 ? rankRows[index - 1] : null;
                    let delta: 1 | 0 | -1 = 0;
                    if (prev) {
                      if (row.pct > prev.pct) delta = 1;
                      else if (row.pct < prev.pct) delta = -1;
                    }
                    return (
                      <article
                        key={`${row.nickname}-${index}-${row.created_at ?? ''}`}
                        className="leaderboard-rank-card"
                        style={{ animationDelay: `${(index + 3) * 60}ms` }}
                      >
                        <div className="leaderboard-rank-num">
                          <span>{index + 4}</span>
                          {delta > 0 && <span className="leaderboard-rank-delta is-up" title="น้อยกว่าคนข้างบน">↑</span>}
                          {delta < 0 && <span className="leaderboard-rank-delta is-down" title="รอบหน้าลุยใหม่">↓</span>}
                          {delta === 0 && index !== 0 && <span className="leaderboard-rank-delta is-flat">–</span>}
                        </div>
                        <Avatar nickname={row.nickname} size="sm" />
                        <div className="leaderboard-rank-main">
                          <div className="leaderboard-rank-head">
                            <strong>{row.nickname}</strong>
                            <span className="leaderboard-rank-tag">{row.subject ?? 'ไม่ระบุวิชา'}</span>
                          </div>
                          <div className="leaderboard-rank-bar" aria-hidden="true">
                            <span style={{ width: `${row.pct}%`, background: pctGradient(row.pct) }} />
                          </div>
                          <div className="leaderboard-rank-meta">
                            <span>✅ {row.score}/{row.total}</span>
                            <span>⏱ {formatTime(row.time_sec)}</span>
                            <span>📅 {formatDate(row.created_at)}</span>
                          </div>
                        </div>
                        <div className="leaderboard-rank-score">{row.pct}%</div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

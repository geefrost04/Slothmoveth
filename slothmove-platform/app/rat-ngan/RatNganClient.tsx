'use client';

import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DonatePopup } from '@/components/DonatePopup';
import type { JobRecord, JobSlimRecord } from '@/lib/jobs-board';
import {
  agencyInitials,
  fixYear,
  getCleanTitle,
  getMinistryColor,
  getStatus,
  shortEdu,
  thaiDate,
} from '@/lib/jobs-board';
import { JobDetailModal } from './JobDetailModal';

const EDUCATION_FILTERS = [
  { id: 'ม.6', label: 'ม.6 / มัธยมปลาย', patterns: ['ม.6', 'ม. 6', 'มัธยมศึกษาตอนปลาย'] },
  { id: 'ปวช.', label: 'ปวช.', patterns: ['ปวช.', 'ประกาศนียบัตรวิชาชีพ'] },
  { id: 'ปวท.', label: 'ปวท.', patterns: ['ปวท.'] },
  { id: 'ปวส.', label: 'ปวส.', patterns: ['ปวส.', 'ประกาศนียบัตรวิชาชีพชั้นสูง'] },
  { id: 'อนุปริญญา', label: 'อนุปริญญา', patterns: ['อนุปริญญา'] },
  { id: 'ประกาศนียบัตร', label: 'ประกาศนียบัตร', patterns: ['ประกาศนียบัตร'] },
  { id: 'ป.ตรี', label: 'ปริญญาตรี', patterns: ['ป.ตรี', 'ปริญญาตรี'] },
  { id: 'ป.โท', label: 'ปริญญาโท', patterns: ['ป.โท', 'ปริญญาโท'] },
  { id: 'ป.เอก', label: 'ปริญญาเอก', patterns: ['ป.เอก', 'ปริญญาเอก'] },
  { id: 'วุฒิบัตร/หนังสือ', label: 'วุฒิบัตร/หนังสือ', patterns: ['วุฒิบัตร', 'หนังสือ'] },
];

function getEducationLevels(raw?: string) {
  const text = (raw || '').trim();
  if (!text) return [];

  const matched = EDUCATION_FILTERS.filter((item) => item.patterns.some((pattern) => text.includes(pattern))).map(
    (item) => item.id
  );

  return Array.from(new Set(matched));
}

function requiresOcsc(job: JobSlimRecord) {
  return job.method.includes('สอบแข่งขัน');
}

function JobBoardContent({ jobs }: { jobs: JobSlimRecord[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [educationFilter, setEducationFilter] = useState('all');
  const [ocscFilter, setOcscFilter] = useState<'all' | 'pass' | 'nopass'>('all');
  const [sort, setSort] = useState<'fetched' | 'alpha'>('fetched');
  const [openJob, setOpenJob] = useState<JobRecord | null>(null);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [jobLoading, setJobLoading] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const now = new Date();

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(decodeURIComponent(searchQuery));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!openJobId) {
      setOpenJob(null);
      return;
    }

    const jobId = openJobId;
    let cancelled = false;

    async function loadJobDetail() {
      setJobLoading(true);
      try {
        const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('ไม่สามารถโหลดรายละเอียดตำแหน่งได้');
        const detail = (await response.json()) as JobRecord;
        if (!cancelled) setOpenJob(detail);
      } catch {
        if (!cancelled) setOpenJob(null);
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    }

    loadJobDetail();
    return () => {
      cancelled = true;
    };
  }, [openJobId]);

  const baseJobs = jobs.filter((job) => {
    const end = job.endDate ? new Date(fixYear(job.endDate)) : null;
    return !end || end >= now;
  });

  const educationOptions = EDUCATION_FILTERS.filter((item) =>
    baseJobs.some((job) => getEducationLevels(job.education).includes(item.id))
  );

  const filterCounts = {
    all: baseJobs.length,
    'ข้าราชการพลเรือน': baseJobs.filter((job) => job.type.includes('ข้าราชการ')).length,
    'พนักงานราชการ': baseJobs.filter((job) => job.type.includes('พนักงานราชการ')).length,
    'อื่นๆ': baseJobs.filter((job) => !job.type.includes('ข้าราชการ') && !job.type.includes('พนักงานราชการ')).length,
  };

  const ocscFilters = [
    { id: 'all' as const, label: 'ภาค ก ทั้งหมด', count: baseJobs.length },
    { id: 'pass' as const, label: 'ผ่านภาค ก', count: baseJobs.filter((job) => requiresOcsc(job)).length },
    { id: 'nopass' as const, label: 'ไม่ผ่านภาค ก', count: baseJobs.filter((job) => !requiresOcsc(job)).length },
  ];

  const filteredJobs = baseJobs.filter((job) => {
    if (filter !== 'all') {
      if (filter === 'ข้าราชการพลเรือน' && !job.type.includes('ข้าราชการ')) return false;
      if (filter === 'พนักงานราชการ' && !job.type.includes('พนักงานราชการ')) return false;
      if (filter === 'อื่นๆ' && (job.type.includes('ข้าราชการ') || job.type.includes('พนักงานราชการ'))) return false;
    }

    if (educationFilter !== 'all') {
      const jobEducation = getEducationLevels(job.education);
      if (!jobEducation.includes(educationFilter)) return false;
    }

    if (ocscFilter !== 'all') {
      const needsOcsc = requiresOcsc(job);
      if (ocscFilter === 'pass' && !needsOcsc) return false;
      if (ocscFilter === 'nopass' && needsOcsc) return false;
    }

    if (deferredQuery.trim()) {
      const q = deferredQuery.trim().toLowerCase();

      if (q === 'ไม่ต้องมีภาค ก.' || q === 'ไม่ต้องมีภาคก') {
        return !job.method.includes('สอบแข่งขัน');
      }
      if (q === 'ต้องมีภาค ก.' || q === 'ต้องมีภาคก' || q === 'ภาค ก' || q === 'ภาคก') {
        return job.method.includes('สอบแข่งขัน');
      }

      return (
        job.title.toLowerCase().includes(q) ||
        job.agency.toLowerCase().includes(q) ||
        job.ministry.toLowerCase().includes(q) ||
        job.province.toLowerCase().includes(q) ||
        job.type.toLowerCase().includes(q) ||
        job.method.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const sortedJobs = [...filteredJobs].sort((left, right) => {
    if (sort === 'fetched') {
      // Sort by OCSC id DESC — highest id = most recently fetched from OCSC
      const leftNum = parseInt(String(left.id).replace(/\D/g, ''), 10) || 0;
      const rightNum = parseInt(String(right.id).replace(/\D/g, ''), 10) || 0;
      return rightNum - leftNum;
    }

    return getCleanTitle(left.title).localeCompare(getCleanTitle(right.title), 'th');
  });

  const totalPositions = filteredJobs.reduce((total, job) => {
    const value = parseInt(String(job.openings || '0').replace(/,/g, ''), 10);
    return total + (Number.isNaN(value) ? 0 : value);
  }, 0);
  const totalAgencies = new Set(filteredJobs.map((job) => job.agency).filter(Boolean)).size;
  const totalMinistries = new Set(filteredJobs.map((job) => job.ministry).filter(Boolean)).size;
  const urgentCount = filteredJobs.filter((job) => getStatus(job.startDate, job.endDate, now).id === 'urgent').length;
  const upcomingCount = filteredJobs.filter((job) => getStatus(job.startDate, job.endDate, now).id === 'before').length;

  const topMinistries = Object.entries(
    filteredJobs.reduce<Record<string, number>>((accumulator, job) => {
      const ministry = job.ministry.trim();
      if (!ministry) return accumulator;
      accumulator[ministry] = (accumulator[ministry] || 0) + 1;
      return accumulator;
    }, {})
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);

  const latestStart = sortedJobs[0]?.startDate;
  const selectedEducationLabel = educationOptions.find((option) => option.id === educationFilter)?.label;

  const handleClearSearch = () => {
    setQuery('');
    router.replace('/rat-ngan');
  };

  const handleResetFilters = () => {
    setQuery('');
    setFilter('all');
    setEducationFilter('all');
    setOcscFilter('all');
    setSort('fetched');
    router.replace('/rat-ngan');
  };

  const handleBadgeClick = (text: string) => {
    if (!text) return;
    setQuery(text);
    setFilter('all');
  };

  const filters = [
    { id: 'all', label: 'ทั้งหมด', count: filterCounts.all },
    { id: 'ข้าราชการพลเรือน', label: 'ข้าราชการ', count: filterCounts['ข้าราชการพลเรือน'] },
    { id: 'พนักงานราชการ', label: 'พนักงานราชการ', count: filterCounts['พนักงานราชการ'] },
    { id: 'อื่นๆ', label: 'งานอื่น ๆ', count: filterCounts['อื่นๆ'] },
  ];

  const activeRefinements = [
    deferredQuery.trim() ? `ค้นหา: ${deferredQuery.trim()}` : null,
    filter !== 'all' ? `ประเภทงาน: ${filters.find((item) => item.id === filter)?.label}` : null,
    educationFilter !== 'all' ? `วุฒิ: ${selectedEducationLabel}` : null,
    ocscFilter !== 'all' ? `ภาค ก: ${ocscFilters.find((item) => item.id === ocscFilter)?.label}` : null,
    sort === 'alpha' ? 'เรียง: ชื่อตำแหน่ง ก-ฮ' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="rounded-[24px] border border-[#e5e0d8] bg-[#fffdfa] px-5 py-5 shadow-sm dark:border-[#2d2d4a] dark:bg-[#1e1e32] sm:px-7 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dfe8df] bg-[#f5f0e8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3d8c6c] font-display">
                  <img src="/pic/slothmove_mascot.png" alt="" className="h-4 w-4 object-contain" />
                  SlothMove Jobs Board
                </div>

                <h1 className="font-display text-[1.8rem] font-extrabold tracking-[-0.035em] text-slate-900 dark:text-white sm:text-[2.1rem]">
                  แดชบอร์ดรับสมัครงานราชการ
                </h1>

                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  รวมประกาศที่ยังเปิดรับจาก OCSC ค้นหาและกรองต่อได้ทันที
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 lg:max-w-[300px] lg:justify-end">
                <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 dark:border-[#37374e] dark:bg-[#252540]">
                  ข้อมูลจาก `job.ocsc.go.th`
                </span>
                {latestStart ? (
                  <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 dark:border-[#37374e] dark:bg-[#252540]">
                    อัปเดตล่าสุด {thaiDate(latestStart)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { label: 'อัตราที่เปิดรับ', value: totalPositions.toLocaleString(), className: 'text-[#2f7a63] dark:text-[#8ad1b0]' },
                { label: 'ประกาศที่แสดงผล', value: sortedJobs.length.toLocaleString(), className: 'text-[#17241d] dark:text-[#f7f2e8]' },
                { label: 'หน่วยงานที่พบ', value: totalAgencies.toLocaleString(), className: 'text-[#17241d] dark:text-[#f7f2e8]' },
                { label: 'ใกล้ปิดรับ', value: urgentCount.toLocaleString(), className: 'text-[#b77933] dark:text-[#e0a870]' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[14px] border border-[#ebe4da] bg-[#faf8f4] px-3 py-2.5 dark:border-[#37374e] dark:bg-[#252540]"
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 font-display">
                    {metric.label}
                  </div>
                  <div className={`mt-1 font-display text-[1.35rem] font-extrabold leading-none ${metric.className}`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#7f8a84]">
                🔎
              </div>
              <input
                type="text"
                className="block w-full rounded-xl border border-[#e5e0d8] bg-[#faf8f4] py-3.5 pl-12 pr-12 text-sm text-[#17241d] outline-none transition placeholder:text-[#95a099] focus:border-[#3d8c6c] focus:bg-white focus:ring-4 focus:ring-[#dff1e7] dark:border-[#37374e] dark:bg-[#252540] dark:text-white"
                placeholder="ค้นหาชื่อตำแหน่ง, หน่วยงาน, กระทรวง, จังหวัด หรือคำสำคัญ..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 text-[#8a948d] transition hover:text-[#17241d]"
                  type="button"
                >
                  ✕
                </button>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition font-display ${
                    filter === tab.id
                      ? 'bg-[#3d8c6c] text-white shadow-sm'
                      : 'bg-[#f5f0e8] text-[#54635a] hover:bg-[#ece3d4] dark:bg-[#252540] dark:text-slate-300 dark:hover:bg-[#2d2d4a]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      filter === tab.id ? 'bg-white/15 text-white' : 'bg-white text-[#7c887f]'
                    }`}
                  >
                    {tab.count.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {ocscFilters.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOcscFilter(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition font-display ${
                    ocscFilter === tab.id
                      ? 'bg-[#8b5e34] text-white shadow-sm'
                      : 'bg-[#f5f0e8] text-[#6a5a47] hover:bg-[#ece3d4] dark:bg-[#252540] dark:text-slate-300 dark:hover:bg-[#2d2d4a]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      ocscFilter === tab.id ? 'bg-white/15 text-white' : 'bg-white text-[#8a775f]'
                    }`}
                  >
                    {tab.count.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeRefinements.length > 0 ? (
                activeRefinements.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#e5d7c2] bg-[#faf8f4] px-3 py-1.5 text-[11px] font-semibold text-[#6c5e47] dark:border-[#3d3950] dark:bg-[#252540] dark:text-slate-300"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-[12px] font-medium text-[#827766] dark:text-slate-400">
                  แสดงทุกประกาศที่ยังเปิดรับ
                </span>
              )}
              {activeRefinements.length > 0 || query || filter !== 'all' || educationFilter !== 'all' || ocscFilter !== 'all' || sort !== 'fetched' ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full border border-[#d7c8b1] bg-white px-3 py-1.5 text-[11px] font-bold text-[#775c33] transition hover:border-[#c7b18e] hover:bg-[#fff8ed] dark:border-[#4a4156] dark:bg-[#252540] dark:text-slate-300 dark:hover:bg-[#2d2d4a]"
                >
                  รีเซ็ต
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[18px] border border-[#ebe4da] bg-[#faf8f4] p-3 dark:border-[#37374e] dark:bg-[#252540]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                  วุฒิการศึกษา
                </h3>
              </div>
              <div className="relative">
                <select
                  value={educationFilter}
                  onChange={(event) => setEducationFilter(event.target.value)}
                  className="block w-full appearance-none rounded-xl border border-[#e5e0d8] bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-[#17241d] outline-none transition focus:border-[#3d8c6c] focus:ring-4 focus:ring-[#dff1e7] dark:border-[#37374e] dark:bg-[#1e1e32] dark:text-white"
                >
                  <option value="all">ทุกวุฒิการศึกษา</option>
                  {educationOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  ▾
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#ebe4da] bg-[#faf8f4] p-3 dark:border-[#37374e] dark:bg-[#252540]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                  เรียงลำดับ
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSort('fetched')}
                  className={`rounded-xl px-3 py-2.5 text-xs font-bold transition font-display ${
                    sort === 'fetched'
                      ? 'bg-[#2f7a63] text-white'
                      : 'border border-[#e5e0d8] bg-white text-[#54635a] hover:border-[#d3c7b6] dark:border-[#37374e] dark:bg-[#1e1e32] dark:text-slate-300'
                  }`}
                >
                  ดึงล่าสุด
                </button>
                <button
                  type="button"
                  onClick={() => setSort('alpha')}
                  className={`rounded-xl px-3 py-2.5 text-xs font-bold transition font-display ${
                    sort === 'alpha'
                      ? 'bg-[#2f7a63] text-white'
                      : 'border border-[#e5e0d8] bg-white text-[#54635a] hover:border-[#d3c7b6] dark:border-[#37374e] dark:bg-[#1e1e32] dark:text-slate-300'
                  }`}
                >
                  ชื่อตำแหน่ง ก-ฮ
                </button>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#ebe4da] bg-[#fdf8ef] p-3 dark:border-[#37374e] dark:bg-[#252540]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                  กลุ่มกระทรวงเด่น
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topMinistries.length > 0 ? (
                  topMinistries.map(([name, count]) => {
                    const color = getMinistryColor(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleBadgeClick(name)}
                        className="rounded-full px-3 py-1.5 text-xs font-bold transition hover:scale-[1.02] font-display"
                        style={{ color: color.color, backgroundColor: color.bg }}
                      >
                        {name.replace('กระทรวง', '').trim()} · {count}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-sm text-[#7c887f]">ยังไม่มีกลุ่มกระทรวงที่แสดงผล</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 mb-4 flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {[
          {
            label: 'ใกล้ปิดรับ',
            value: `${urgentCount.toLocaleString()} รายการ`,
            tone: 'border-[#f2d3ae] bg-[#fff3e2] text-[#8b5f20] dark:border-[#5a4228] dark:bg-[#2e261d] dark:text-[#f2c583]',
          },
          {
            label: 'ประกาศล่วงหน้า',
            value: `${upcomingCount.toLocaleString()} รายการ`,
            tone: 'border-[#d7e5ff] bg-[#eef4ff] text-[#4560a6] dark:border-[#35446d] dark:bg-[#1f2740] dark:text-[#adc1ff]',
          },
          {
            label: 'ช่วงข้อมูล',
            value: 'แสดงเฉพาะงานจาก OCSC ที่ยังไม่หมดเขต',
            tone: 'border-[#d9e8df] bg-[#f2f8f4] text-[#376f58] dark:border-[#365043] dark:bg-[#1d2e25] dark:text-[#8fc6ac]',
          },
        ].map((item) => (
          <span key={item.label} className={`rounded-full border px-3 py-1.5 ${item.tone}`}>
            {item.label} {item.value}
          </span>
        ))}
      </section>

      {sortedJobs.length === 0 ? (
        <div className="rounded-[24px] border border-[#e5e0d8] bg-[#fffdfa] px-6 py-14 text-center shadow-sm dark:border-[#2d2d4a] dark:bg-[#1e1e32]">
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="font-display text-2xl font-bold text-[#17241d]">ไม่พบประกาศที่ตรงกับเงื่อนไข</h3>
          <p className="mt-3 text-sm leading-7 text-[#6b786f]">
            ลองเปลี่ยนคำค้นหา, ล้างตัวกรอง, หรือเลือกกลุ่มงานที่กว้างขึ้นเพื่อดูรายการเพิ่ม
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedJobs.map((job) => {
            const isCivil = job.type.includes('ข้าราชการ');
            const isGovEmployee = job.type.includes('พนักงานราชการ');
            const typeName = isCivil ? 'ข้าราชการพลเรือน' : isGovEmployee ? 'พนักงานราชการ' : 'อื่นๆ';
            const typeColor = isCivil ? '#3d8c6c' : isGovEmployee ? '#c97d3a' : '#7a756d';

            const status = getStatus(job.startDate, job.endDate, now);
            const ministryColor = getMinistryColor(job.ministry || '');
            const cleanTitle = getCleanTitle(job.title || '').trim();
            const needsOcsc = requiresOcsc(job);
            const province = job.province || '';
            const showProvince = province && province !== 'กรุงเทพมหานคร' && province !== 'ไม่มีข้อมูล' && province !== 'หลายจังหวัด';

            let salaryText = '';
            if (job.minSalary && job.maxSalary) {
              salaryText = `${parseInt(job.minSalary, 10).toLocaleString()} - ${parseInt(job.maxSalary, 10).toLocaleString()} บาท`;
            } else if (job.minSalary) {
              salaryText = `${parseInt(job.minSalary, 10).toLocaleString()} บาท`;
            }

            const logoUrl = job.logoUrl || '';
            const initials = agencyInitials(job.agency);
            const end = job.endDate ? new Date(fixYear(job.endDate)) : null;
            const daysLeft = end ? Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

            let urgencyClass = 'bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
            let urgencyLabel = status.label;
            if (status.id === 'closed') {
              urgencyClass = 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 line-through';
            } else if (daysLeft !== null && daysLeft >= 0) {
              if (daysLeft <= 3) {
                urgencyClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50';
                urgencyLabel = `เหลือ ${daysLeft} วัน`;
              } else if (daysLeft <= 10) {
                urgencyClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50';
                urgencyLabel = `เหลือ ${daysLeft} วัน`;
              } else {
                urgencyClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50';
                urgencyLabel = `เหลือ ${daysLeft} วัน`;
              }
            } else if (status.id === 'open') {
              urgencyClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50';
            }

            return (
              <button
                key={job.id}
                type="button"
                onClick={() => setOpenJobId(job.id)}
                aria-label={`ดูรายละเอียด ${cleanTitle}`}
                className="group relative flex h-full flex-col items-stretch overflow-hidden rounded-2xl border border-[#e8e2d9] bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md dark:border-[#2d2d4a] dark:bg-[#1e1e32]"
                style={{
                  borderLeftWidth: '5px',
                  borderLeftColor: ministryColor.color || '#67747c',
                  minHeight: '420px'
                }}
              >
                <span
                  className="absolute left-0 top-0 z-10 rounded-br-xl rounded-tl-none px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase font-display"
                  style={{ backgroundColor: typeColor, color: '#ffffff' }}
                >
                  {typeName}
                </span>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex justify-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                        needsOcsc
                          ? 'bg-[#f6eadc] text-[#8b5e34] dark:bg-[#3a2d20] dark:text-[#f1cca0]'
                          : 'bg-[#e7f4ec] text-[#2f7a63] dark:bg-[#1f3a31] dark:text-[#9fe0c2]'
                      }`}
                    >
                      {needsOcsc ? 'ผ่านภาค ก' : 'ไม่ผ่านภาค ก'}
                    </span>
                  </div>

                  <div className="relative mb-4 flex flex-col items-center pt-5">
                    <span className={`absolute right-0 top-0 rounded-full px-2.5 py-1 text-[10px] font-bold font-display ${urgencyClass}`}>
                      {urgencyLabel}
                    </span>

                    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#e8e2d9] bg-white p-1 shadow-sm dark:border-[#2d2d4a] dark:bg-[#1a1a2e]">
                      {logoUrl && logoUrl !== 'null' && logoUrl !== '-' ? (
                        <img
                          src={logoUrl}
                          alt={job.agency || 'โลโก้'}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="flex h-full w-full items-center justify-center bg-[#faf8f4] text-[12px] font-bold text-[#8b5e3c] dark:bg-[#252540] dark:text-slate-400 font-display"
                        style={logoUrl && logoUrl !== 'null' && logoUrl !== '-' ? { display: 'none' } : {}}
                      >
                        {initials}
                      </div>
                    </div>

                    <div className="mt-2.5 text-center">
                      <div
                        className="line-clamp-1 text-[12px] font-semibold text-slate-700 dark:text-slate-200"
                        title={job.agency}
                      >
                        {job.agency || 'หน่วยงาน'}
                      </div>
                      {job.ministry ? (
                        <div
                          className="mt-0.5 line-clamp-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500"
                          title={job.ministry}
                        >
                          {job.ministry.replace('กระทรวง', '').trim()}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="font-display text-[16px] font-medium leading-6 text-slate-900 transition group-hover:text-[#3d8c6c] dark:text-white line-clamp-2 mb-3 text-center">
                    {cleanTitle}
                  </h3>

                  <div className="mb-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                    {job.education && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                        </svg>
                        {shortEdu(job.education)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      {job.openings ? parseInt(job.openings, 10).toLocaleString() : '1'} อัตรา
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {showProvince ? (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        <span className="truncate max-w-[100px]" title={province}>{province}</span>
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        {needsOcsc ? (
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                        ) : (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        )}
                      </svg>
                      {needsOcsc ? 'ต้องมี ภาค ก.' : 'ไม่ต้องมี ก.'}
                    </span>
                  </div>

                  <div className="mb-2.5 flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                      เงินเดือน
                    </span>
                    {salaryText ? (
                      <span className="font-display text-[14px] font-semibold text-slate-800 dark:text-slate-100">
                        {salaryText}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">ไม่ระบุ</span>
                    )}
                  </div>

                  {daysLeft !== null && daysLeft >= 0 ? (
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                        <span>เหลืออีก</span>
                        <span style={{ color: daysLeft <= 3 ? '#b91c1c' : daysLeft <= 10 ? '#b45309' : '#3d8c6c' }}>
                          {daysLeft} วัน
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[#e5e0d8] dark:bg-[#37374e]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, (daysLeft / 30) * 100))}%`,
                            backgroundColor: daysLeft <= 3 ? '#dc2626' : daysLeft <= 10 ? '#d97706' : '#3d8c6c'
                          }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-auto flex items-center justify-center gap-1 border-t border-[#f0ebe0] pt-3 text-[10px] font-medium text-slate-400 transition group-hover:text-[#3d8c6c] dark:border-[#2d2d4a] dark:text-slate-500 dark:group-hover:text-[#5cb592]">
                    <span>แตะเพื่อดูรายละเอียด</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <JobDetailModal job={openJob} loading={jobLoading} onClose={() => setOpenJobId(null)} />
    </div>
  );
}

export default function RatNganClient({ jobs }: { jobs: JobSlimRecord[] }) {
  return (
    <div
      className="home-shell jobs-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(circle at top left, rgba(61,140,108,0.12), transparent 28%), linear-gradient(180deg, #f6faf7 0%, #faf8f4 34%, #f2eee6 100%)',
      }}
    >
      <Navbar backHref="/" />
      <main style={{ flex: 1, padding: '20px 0 80px' }}>
        <Suspense
          fallback={
            <div className="container px-4 py-20 text-center font-body text-slate-500">
              กำลังโหลดข้อมูลตำแหน่งงานราชการ...
            </div>
          }
        >
          <JobBoardContent jobs={jobs} />
        </Suspense>
      </main>
      <Footer />
      <DonatePopup />
    </div>
  );
}

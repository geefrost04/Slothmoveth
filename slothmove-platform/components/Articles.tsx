'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { JOBS_DATA } from '@/data/jobs';
import {
  agencyInitials,
  getActiveOcscJobs,
  getCleanTitle,
  getMinistryColor,
  getStatus,
} from '@/lib/jobs-board';

export function Articles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable date for SSR to prevent hydration mismatches
  const now = mounted ? new Date() : new Date('2026-06-23T00:00:00');
  const activeJobs = getActiveOcscJobs(JOBS_DATA, now);

  let totalPositions = 0;
  let civilCount = 0;
  let officialCount = 0;
  let otherCount = 0;
  let needOcsc = 0;
  let noOcsc = 0;
  const agencies = new Set<string>();
  const ministries = new Set<string>();

  activeJobs.forEach((job: any) => {
    const count = parseInt(String(job['จำนวนรับ'] || '0').replace(/,/g, ''), 10);
    const positions = Number.isNaN(count) ? 1 : count;
    totalPositions += positions;

    const type = (job['ประเภทงาน'] || '').trim();
    if (type.includes('ข้าราชการ')) {
      civilCount += positions;
    } else if (type.includes('พนักงานราชการ')) {
      officialCount += positions;
    } else {
      otherCount += positions;
    }

    const requiresOcsc = (job['วิธีการสรรหา'] || '').includes('สอบแข่งขัน');
    if (requiresOcsc) {
      needOcsc += positions;
    } else {
      noOcsc += positions;
    }

    if (job['หน่วยงาน']) agencies.add(job['หน่วยงาน']);
    if (job['กระทรวง']) ministries.add(job['กระทรวง']);
  });

  const totalType = civilCount + officialCount + otherCount || 1;
  const civilPercent = Math.round((civilCount / totalType) * 100);
  const officialPercent = Math.round((officialCount / totalType) * 100);
  const otherPercent = Math.max(0, 100 - civilPercent - officialPercent);

  const totalOcsc = needOcsc + noOcsc || 1;
  const needOcscPercent = Math.round((needOcsc / totalOcsc) * 100);
  const noOcscPercent = Math.max(0, 100 - needOcscPercent);

  const urgentJobs = activeJobs.filter(
    (job: any) => getStatus(job['วันเริ่มสมัคร'], job['วันหมดสมัคร'], now).id === 'urgent'
  ).length;

  const topJobs = [...activeJobs]
    .sort((left: any, right: any) => parseInt(right['ยอดเข้าชม'] || '0', 10) - parseInt(left['ยอดเข้าชม'] || '0', 10))
    .slice(0, 3);

  return (
    <section id="articles" className="py-16 bg-[#faf8f4] dark:bg-[#171726]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe8df] bg-[#f5f0e8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d8c6c] font-display">
            <span className="h-2 w-2 rounded-full bg-[#3d8c6c]" />
            SlothMove Jobs Radar
          </div>
          <Link
            href="/rat-ngan"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#3d8c6c] hover:text-[#2d6f54] transition font-display"
          >
            ดูทั้งหมด
            <span aria-hidden="true" className="text-base">→</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#e5e0d8] bg-[#fffdfa] shadow-sm dark:border-[#2d2d4a] dark:bg-[#1e1e32]">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden border-b border-[#e8e1d7] px-5 py-6 sm:px-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-7 dark:border-[#2d2d4a]">
              <div className="absolute right-[-72px] top-[-96px] h-52 w-52 rounded-full bg-[#eef7f1] blur-3xl" />
              <div className="absolute bottom-[-84px] left-[-64px] h-44 w-44 rounded-full bg-[#f7efe3] blur-3xl" />

              <div className="relative">
                <div className="mb-5 flex flex-col gap-3">
                  <div className="max-w-2xl">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eef5ef] px-3 py-1 text-[11px] font-semibold text-[#2f7a63] dark:bg-[#2a3c34] dark:text-[#8ad1b0]">
                      ข้อมูลเสริมสำหรับวางแผนสมัครงาน
                    </div>
                    <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
                      ประกาศสอบแข่งขันและรับสมัครงานราชการ
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                      ใช้ดูภาพรวมตำแหน่งที่เปิดรับควบคู่กับการเลือกคอร์สที่เหมาะกับเป้าหมายของคุณ
                      เห็นทั้งจำนวนอัตรา แนวโน้มการสมัคร และตำแหน่งที่คนสนใจมากที่สุดในช่วงนี้
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">ค้นหาด่วน:</span>
                      {[
                        { label: 'ไม่ต้องมีภาค ก.', query: 'ไม่ต้องมีภาค ก.' },
                        { label: 'งานธุรการ', query: 'ธุรการ' },
                        { label: 'งานไอที / คอมฯ', query: 'คอมพิวเตอร์' },
                        { label: 'สาธารณสุข', query: 'สาธารณสุข' },
                        { label: 'นายสิบ / ตำรวจ', query: 'ตำรวจ' },
                      ].map((tag) => (
                        <Link
                          key={tag.label}
                          href={`/rat-ngan?q=${encodeURIComponent(tag.query)}`}
                          className="rounded-full bg-[#f4ece1] px-2.5 py-1 text-[11px] font-bold text-[#c97d3a] hover:bg-[#c97d3a] hover:text-white transition duration-150 dark:bg-[#2b2b40] dark:text-[#e0a870] dark:hover:bg-[#e0a870] dark:hover:text-slate-900"
                        >
                          #{tag.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'อัตราที่เปิดรับ', value: totalPositions.toLocaleString(), accent: '#2f7a63' },
                    { label: 'ประกาศที่เปิดรับ', value: activeJobs.length.toLocaleString(), accent: '#18231d' },
                    { label: 'หน่วยงานที่ประกาศ', value: agencies.size.toLocaleString(), accent: '#18231d' },
                    { label: 'ใกล้ปิดรับ', value: urgentJobs.toLocaleString(), accent: '#b77933' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-[#ebe4da] bg-white p-3 text-center dark:border-[#37374e] dark:bg-[#222238]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 font-display">
                        {item.label}
                      </div>
                      <div className="mt-1.5 font-display text-xl font-extrabold" style={{ color: item.accent }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 rounded-[16px] border border-[#ebe4da] bg-[#faf8f4] p-4 dark:border-[#37374e] dark:bg-[#252540]">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">สัดส่วนประเภทงาน</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-[#e9e3d9] dark:bg-slate-700">
                      <div className="h-full bg-[#3d8c6c]" style={{ width: `${civilPercent}%` }} title={`ข้าราชการ ${civilPercent}%`} />
                      <div className="h-full bg-[#c48a45]" style={{ width: `${officialPercent}%` }} title={`พนักงานราชการ ${officialPercent}%`} />
                      <div className="h-full bg-[#d4cdc0]" style={{ width: `${otherPercent}%` }} title={`อื่นๆ ${otherPercent}%`} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3d8c6c]" />ข้าราชการ {civilPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#c48a45]" />พนักงานราชการ {officialPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#d4cdc0]" />อื่นๆ {otherPercent}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ebe4da] dark:border-[#37374e]">
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">เงื่อนไขภาค ก.</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-[#efe4d5] dark:bg-slate-700">
                      <div className="h-full bg-[#3d8c6c]" style={{ width: `${noOcscPercent}%` }} title={`ไม่ต้องมีภาค ก. ${noOcscPercent}%`} />
                      <div className="h-full bg-[#b77933]" style={{ width: `${needOcscPercent}%` }} title={`ต้องมีภาค ก. ${needOcscPercent}%`} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3d8c6c]" />ไม่ต้องมีภาค ก. {noOcscPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b77933]" />ต้องมีภาค ก. {needOcscPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 font-semibold dark:border-[#37374e] dark:bg-[#252540]">
                    ครอบคลุม {ministries.size.toLocaleString()} กระทรวง / ส่วนราชการ
                  </span>
                  <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 font-semibold dark:border-[#37374e] dark:bg-[#252540]">
                    ดึงข้อมูลตรงจาก `job.ocsc.go.th`
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#faf6ef] px-5 py-6 sm:px-7 lg:px-8 lg:py-7 dark:bg-[#222238]">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <div className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#c97d3a]">
                    Popular Now
                  </div>
                  <h3 className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">
                    ตำแหน่งที่คนคลิกดูมากที่สุด
                  </h3>
                </div>
                <div className="text-right text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  อ้างอิงยอดเข้าชมล่าสุด
                  <br />
                  จากประกาศที่ยังเปิดรับอยู่
                </div>
              </div>

              <div className="space-y-4">
                {topJobs.map((job, index) => {
                  const initials = agencyInitials(job['หน่วยงาน']);
                  const status = getStatus(job['วันเริ่มสมัคร'], job['วันหมดสมัคร'], now);
                  const cleanTitle = getCleanTitle(job['ตำแหน่ง'] || '');
                  const ministryColor = getMinistryColor(job['กระทรวง'] || '');

                  let statusClasses = 'bg-[#e7f5ee] text-[#2f7a63]';
                  if (status.id === 'urgent') statusClasses = 'bg-[#fdf1e4] text-[#b77933]';
                  if (status.id === 'before') statusClasses = 'bg-[#eceff2] text-[#67747c]';

                  return (
                    <Link
                      key={job.id}
                      href={`/rat-ngan?q=${encodeURIComponent(cleanTitle)}`}
                      className="group block rounded-[20px] border border-[#e7dfd3] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d9d0c3] dark:border-[#37374e] dark:bg-[#252540]"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#efe6d9] bg-[#fbf7f0] text-xs font-bold"
                          style={{ color: ministryColor.color }}
                        >
                          {job['โลโก้หน่วยงาน'] && job['โลโก้หน่วยงาน'] !== 'null' && job['โลโก้หน่วยงาน'] !== '-' ? (
                            <img
                              src={job['โลโก้หน่วยงาน']}
                              alt={job['หน่วยงาน'] || 'logo'}
                              className="max-h-full max-w-full object-contain"
                              onError={(event) => {
                                (event.target as HTMLElement).style.display = 'none';
                                const fallback = (event.target as HTMLElement).nextElementSibling;
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span
                            style={{
                              display:
                                job['โลโก้หน่วยงาน'] && job['โลโก้หน่วยงาน'] !== 'null' && job['โลโก้หน่วยงาน'] !== '-'
                                  ? 'none'
                                  : 'block',
                            }}
                          >
                            {initials}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#f2f7f4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2f7a63] font-display">
                              อันดับ {index + 1}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold font-display ${statusClasses}`}>
                              {status.id === 'urgent' && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b77933] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#b77933]"></span>
                                </span>
                              )}
                              {status.label}
                            </span>
                          </div>

                          <h4 className="font-display text-base font-bold leading-6 text-slate-900 transition group-hover:text-[#2f7a63] dark:text-white">
                            {cleanTitle}
                          </h4>

                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-[#6a756e]">
                            <span
                              className="rounded-full px-2.5 py-1"
                              style={{ color: ministryColor.color, backgroundColor: ministryColor.bg }}
                            >
                              {job['กระทรวง'] ? job['กระทรวง'].replace('กระทรวง', '').trim() : 'หน่วยงานอิสระ'}
                            </span>
                            <span className="rounded-full bg-[#f3efe7] px-2.5 py-1">{job['หน่วยงาน']}</span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>👁️ {parseInt(job['ยอดเข้าชม'] || '0', 10).toLocaleString()} ครั้ง</span>
                            <span>{job['ประเภทงาน'] || 'งานราชการ'}</span>
                          </div>
                        </div>

                        <div className="hidden text-2xl text-[#bca98c] sm:block">↗</div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

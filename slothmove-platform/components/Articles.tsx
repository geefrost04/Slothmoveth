'use client';

import Link from 'next/link';
import {
  getMinistryColor,
  type JobsRadarSummary,
} from '@/lib/jobs-board';

export function Articles({ summary }: { summary: JobsRadarSummary }) {
  return (
    <section id="articles" className="py-16 bg-[#e8f7ec] dark:bg-[#091b10]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe8df] bg-[#f5f0e8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d8c6c] font-display">
            <img src="/pic/slothmove_mascot.png" alt="" className="h-4 w-4 object-contain" />
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

        <div className="overflow-hidden rounded-2xl border border-[#ebe4da] bg-white shadow-sm dark:border-[#2d2d4a] dark:bg-[#1e1e32]">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden border-b border-[#e8e1d7] px-5 py-6 sm:px-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-7 dark:border-[#2d2d4a]">
              <div className="relative">
                <div className="mb-5 flex flex-col gap-3">
                  <div className="max-w-2xl">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eef5ef] px-3 py-1 text-[11px] font-semibold text-[#2f7a63] dark:bg-[#2a3c34] dark:text-[#8ad1b0]">
                      ข้อมูลเสริมสำหรับวางแผนสมัครงาน
                    </div>
                    <h2 className="font-display text-lg font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white sm:text-xl md:text-2xl">
                      ประกาศสอบแข่งขันและรับสมัครงานราชการ
                    </h2>
                    <p className="mt-1.5 max-w-2xl text-[12px] sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      ใช้ดูภาพรวมตำแหน่งที่เปิดรับควบคู่กับการเลือกคอร์สที่เหมาะกับเป้าหมายของคุณ
                      เห็นทั้งจำนวนอัตรา แนวโน้มการสมัคร และตำแหน่งที่คนสนใจมากที่สุดในช่วงนี้
                    </p>
                    <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">ค้นหาด่วน:</span>
                      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
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
                            className="shrink-0 whitespace-nowrap rounded-full bg-[#f4ece1] px-2.5 py-1.5 text-[11px] font-bold text-[#c97d3a] hover:bg-[#c97d3a] hover:text-white transition duration-150 dark:bg-[#2b2b40] dark:text-[#e0a870] dark:hover:bg-[#e0a870] dark:hover:text-slate-900"
                          >
                            #{tag.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { label: 'อัตราที่เปิดรับ', value: summary.totalPositions.toLocaleString(), className: 'text-[#2f7a63] dark:text-[#8ad1b0]' },
                    { label: 'ประกาศที่เปิดรับ', value: summary.activeJobCount.toLocaleString(), className: 'text-[#18231d] dark:text-[#f7f2e8]' },
                    { label: 'หน่วยงานที่ประกาศ', value: summary.agenciesCount.toLocaleString(), className: 'text-[#18231d] dark:text-[#f7f2e8]' },
                    { label: 'ใกล้ปิดรับ', value: summary.urgentJobs.toLocaleString(), className: 'text-[#b77933] dark:text-[#e0a870]' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-[#d3eedf] bg-[#f0f9f4] p-2.5 sm:p-3 text-center dark:border-[#2d3a33] dark:bg-[#1b2b23]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2f7a63] font-display">
                        {item.label}
                      </div>
                      <div className={`mt-1 font-display text-lg sm:text-xl font-extrabold ${item.className}`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 hidden xl:grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-[#ebe4da] bg-[#faf8f4] p-4 dark:border-[#37374e] dark:bg-[#252540]">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">สัดส่วนประเภทงาน</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-[#e9e3d9] dark:bg-slate-700">
                      <div className="h-full bg-[#3d8c6c]" style={{ width: `${summary.civilPercent}%` }} title={`ข้าราชการ ${summary.civilPercent}%`} />
                      <div className="h-full bg-[#c48a45]" style={{ width: `${summary.officialPercent}%` }} title={`พนักงานราชการ ${summary.officialPercent}%`} />
                      <div className="h-full bg-[#d4cdc0]" style={{ width: `${summary.otherPercent}%` }} title={`อื่นๆ ${summary.otherPercent}%`} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3d8c6c]" />ข้าราชการ {summary.civilPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#c48a45]" />พนักงานราชการ {summary.officialPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#d4cdc0]" />อื่นๆ {summary.otherPercent}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ebe4da] md:pt-0 md:border-t-0 md:border-l md:pl-6 dark:border-[#37374e]">
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">เงื่อนไขภาค ก.</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-[#efe4d5] dark:bg-slate-700">
                      <div className="h-full bg-[#3d8c6c]" style={{ width: `${summary.noOcscPercent}%` }} title={`ไม่ต้องมีภาค ก. ${summary.noOcscPercent}%`} />
                      <div className="h-full bg-[#b77933]" style={{ width: `${summary.needOcscPercent}%` }} title={`ต้องมีภาค ก. ${summary.needOcscPercent}%`} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3d8c6c]" />ไม่ต้องมีภาค ก. {summary.noOcscPercent}%</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b77933]" />ต้องมีภาค ก. {summary.needOcscPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 font-semibold dark:border-[#37374e] dark:bg-[#252540]">
                    ครอบคลุม {summary.ministriesCount.toLocaleString()} กระทรวง / ส่วนราชการ
                  </span>
                  <span className="rounded-full border border-[#e8e1d7] bg-[#faf8f4] px-3 py-1.5 font-semibold dark:border-[#37374e] dark:bg-[#252540]">
                    ดึงข้อมูลตรงจาก `job.ocsc.go.th`
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#fafbf9] xl:bg-[#faf6ef] px-5 py-6 sm:px-7 lg:px-8 lg:py-7 dark:bg-[#1b1b2f] xl:dark:bg-[#222238]">
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
                {summary.topJobs.map((job, index) => {
                  const ministryColor = getMinistryColor(job.ministry || '');

                  let statusClasses = 'bg-[#e7f5ee] text-[#2f7a63]';
                  if (job.status.id === 'urgent') statusClasses = 'bg-[#fdf1e4] text-[#b77933]';
                  if (job.status.id === 'before') statusClasses = 'bg-[#eceff2] text-[#67747c]';

                  return (
                    <Link
                      key={job.id}
                      href={`/rat-ngan?q=${encodeURIComponent(job.query)}`}
                      className="group block rounded-[20px] border border-[#e7dfd3] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d9d0c3] dark:border-[#37374e] dark:bg-[#252540]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#efe6d9] bg-white p-1">
                          {job.logoUrl && job.logoUrl !== 'null' && job.logoUrl !== '-' ? (
                            <img
                              src={job.logoUrl}
                              alt=""
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="flex h-full w-full items-center justify-center bg-[#fbf7f0] text-[11px] font-bold font-display"
                            style={job.logoUrl && job.logoUrl !== 'null' && job.logoUrl !== '-' ? { display: 'none', color: ministryColor.color } : { color: ministryColor.color }}
                          >
                            {job.initials}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#f2f7f4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2f7a63] font-display">
                              อันดับ {index + 1}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold font-display ${statusClasses}`}>
                              {job.status.id === 'urgent' && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b77933] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#b77933]"></span>
                                </span>
                              )}
                              {job.status.label}
                            </span>
                          </div>

                          <h4 className="line-clamp-2 break-words font-display text-base font-bold leading-6 text-slate-900 transition group-hover:text-[#2f7a63] dark:text-white">
                            {job.title}
                          </h4>

                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-[#6a756e]">
                            <span
                              className="max-w-full truncate rounded-full px-2.5 py-1"
                              style={{ color: ministryColor.color, backgroundColor: ministryColor.bg }}
                            >
                              {job.ministry ? job.ministry.replace('กระทรวง', '').trim() : 'หน่วยงานอิสระ'}
                            </span>
                            <span className="max-w-full truncate rounded-full bg-[#f3efe7] px-2.5 py-1">{job.agency}</span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>👁️ {job.views.toLocaleString()} ครั้ง</span>
                            <span>{job.type}</span>
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

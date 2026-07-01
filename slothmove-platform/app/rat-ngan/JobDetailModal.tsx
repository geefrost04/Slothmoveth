'use client';

import { useEffect } from 'react';
import {
  agencyInitials,
  fixYear,
  getCleanTitle,
  getMinistryColor,
  getStatus,
  shortEdu,
  thaiDate,
} from '@/lib/jobs-board';

function safeValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value).trim();
  if (!s || s === 'null' || s === '-' || s === 'ไม่มีข้อมูล') return '';
  return s;
}

function formatNumber(value: unknown): string {
  const s = safeValue(value);
  if (!s) return '';
  const num = parseInt(s.replace(/,/g, ''), 10);
  return Number.isNaN(num) ? s : num.toLocaleString('th-TH');
}

export function JobDetailModal({
  job,
  loading = false,
  onClose
}: {
  job: any | null;
  loading?: boolean;
  onClose: () => void;
}) {
  // ESC to close
  useEffect(() => {
    if (!job) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [job, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!job) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [job]);

  if (!job && !loading) return null;

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-loading"
      >
        <div
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#1e1e32]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-[#2d2d4a] dark:text-slate-300 dark:hover:bg-[#37374e]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dff1e7] border-t-[#3d8c6c]" />
            <h2 id="job-modal-loading" className="font-display text-lg font-bold text-slate-900 dark:text-white">
              กำลังโหลดรายละเอียดตำแหน่ง
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              โปรดรอสักครู่
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const now = new Date();
  const ministryColor = getMinistryColor(job['กระทรวง'] || '');
  const cleanTitle = (job['ตำแหน่ง'] || '')
    .replace(/^รับสมัครบุคคลเพื่อเลือกสรรและจัดจ้างเป็นพนักงานราชการ ตำแหน่ง /, '')
    .replace(/^ตำแหน่ง/, '')
    .trim();
  const initials = agencyInitials(job['หน่วยงาน']);
  const logoUrl = safeValue(job['โลโก้หน่วยงาน']);
  const status = getStatus(job['วันเริ่มสมัคร'], job['วันหมดสมัคร'], now);
  const end = job['วันหมดสมัคร'] ? new Date(fixYear(job['วันหมดสมัคร'])) : null;
  const daysLeft = end ? Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  let urgencyLabel: string = String(status.label);
  let urgencyClass = 'bg-slate-50 text-slate-700 border border-slate-200';
  if (status.id === 'closed') {
    urgencyClass = 'bg-slate-100 text-slate-500 line-through border border-slate-200';
  } else if (daysLeft !== null && daysLeft >= 0) {
    urgencyLabel = `เหลืออีก ${daysLeft} วัน`;
    if (daysLeft <= 3) urgencyClass = 'bg-rose-50 text-rose-700 border border-rose-200';
    else if (daysLeft <= 10) urgencyClass = 'bg-amber-50 text-amber-700 border border-amber-200';
    else urgencyClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }

  const jobType = job['ประเภทงาน'] || '';
  const isCivil = jobType.includes('ข้าราชการ');
  const isGovEmployee = jobType.includes('พนักงานราชการ');
  const typeName = isCivil ? 'ข้าราชการพลเรือน' : isGovEmployee ? 'พนักงานราชการ' : 'อื่นๆ';
  const typeColor = isCivil ? '#3d8c6c' : isGovEmployee ? '#c97d3a' : '#7a756d';
  const requiresOcsc = (job['วิธีการสรรหา'] || '').includes('สอบแข่งขัน');

  const minSalary = safeValue(job['เงินเดือนต่ำสุด']);
  const maxSalary = safeValue(job['เงินเดือนสูงสุดสุด']) || safeValue(job['เงินเดือนสูงสุด']);
  let salaryText = '';
  if (minSalary && maxSalary) {
    salaryText = `${parseInt(minSalary, 10).toLocaleString('th-TH')} - ${parseInt(maxSalary, 10).toLocaleString('th-TH')} บาท`;
  } else if (minSalary) {
    salaryText = `${parseInt(minSalary, 10).toLocaleString('th-TH')} บาท`;
  }

  const link = safeValue(job['ลิงก์']);
  const fileUrl = safeValue(job['ไฟล์ประกาศ']);

  // Collect all present fields (skip null/-/empty/ไม่มีข้อมูล) and
  // surface them in a clean two-column key-value list.
  const fields: Array<{ label: string; value: string; isHtml?: boolean }> = [
    { label: 'ประเภทงาน', value: safeValue(job['ประเภทงาน']) },
    { label: 'ตำแหน่ง', value: cleanTitle },
    { label: 'หน่วยงาน', value: safeValue(job['หน่วยงาน']) },
    { label: 'กระทรวง', value: safeValue(job['กระทรวง']) },
    { label: 'จังหวัด', value: safeValue(job['จังหวัด']) },
    { label: 'จำนวนอัตรา', value: formatNumber(job['จำนวนรับ']) },
    { label: 'ระดับการศึกษา', value: shortEdu(safeValue(job['ระดับการศึกษา'])) },
    { label: 'เงินเดือน', value: salaryText },
    { label: 'วิธีการสรรหา', value: safeValue(job['วิธีการสรรหา']) },
    { label: 'ภาค ก. (สอบแข่งขัน)', value: requiresOcsc ? 'ต้องสอบภาค ก.' : 'ไม่ต้องสอบภาค ก.' },
    { label: 'วันเริ่มรับสมัคร', value: thaiDate(safeValue(job['วันเริ่มสมัคร'])) },
    { label: 'วันปิดรับสมัคร', value: thaiDate(safeValue(job['วันหมดสมัคร'])) }
  ].filter((f) => f.value && f.value !== '-');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#1e1e32]"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `6px solid ${ministryColor.color || '#67747c'}` }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-[#2d2d4a] dark:text-slate-300 dark:hover:bg-[#37374e]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header: Logo + Agency + Title */}
          <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-5 sm:flex-row sm:items-start sm:gap-5 sm:px-8 sm:pt-9">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#e8e2d9] bg-white p-2 shadow-sm dark:border-[#2d2d4a] dark:bg-[#1a1a2e]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={job['หน่วยงาน'] || 'โลโก้'}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="flex h-full w-full items-center justify-center bg-[#faf8f4] text-base font-bold text-[#8b5e3c] dark:bg-[#252540] dark:text-slate-400 font-display"
                style={logoUrl ? { display: 'none' } : {}}
              >
                {initials}
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase font-display"
                  style={{ backgroundColor: typeColor, color: '#fff' }}
                >
                  {typeName}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold font-display ${urgencyClass}`}>
                  {urgencyLabel}
                </span>
              </div>
              <h2 id="job-modal-title" className="font-display text-xl font-semibold leading-7 text-slate-900 dark:text-white sm:text-2xl">
                {cleanTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {safeValue(job['หน่วยงาน'])}
                {job['กระทรวง'] ? ` · ${job['กระทรวง']}` : ''}
              </p>

              {/* Days-remaining progress bar */}
              {daysLeft !== null && daysLeft >= 0 ? (
                <div className="mt-3">
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
            </div>
          </div>

          {/* Body: full data list */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-7">
            <h3 className="mb-3 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              ข้อมูลตำแหน่ง
            </h3>
            <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {fields.map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl border border-[#e8e2d9] bg-[#faf8f4] px-3.5 py-2.5 dark:border-[#2d2d4a] dark:bg-[#252540]"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200 break-words">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Action bar: external links */}
            {(link || fileUrl) ? (
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3d8c6c] py-3 text-sm font-bold text-white transition-all hover:bg-[#2d6f54] hover:shadow-md font-display"
                  >
                    ดูรายละเอียดงาน
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                  </a>
                ) : null}
                {fileUrl ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-[#3d8c6c] bg-transparent px-3 py-3 text-sm font-bold text-[#3d8c6c] transition-all hover:bg-[#3d8c6c]/5 font-display"
                  >
                    เปิดไฟล์ประกาศ
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-center text-xs text-slate-400">โปรดติดตามจากต้นทาง</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

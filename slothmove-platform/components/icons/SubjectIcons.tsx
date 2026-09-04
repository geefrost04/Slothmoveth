import React from 'react';

type IconProps = {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * 1. วิชาความรู้ทั่วไป / คิดวิเคราะห์ / คณิตศาสตร์
 * สัญลักษณ์กระดานตัวเลข & ฟังก์ชันคณิตศาสตร์ (Calculator / Function)
 */
export function MathIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="M8 8h2" />
      <path d="M14 7v2" />
      <path d="M13 8h2" />
      <path d="M8 15h2" />
      <path d="M8 17h2" />
      <path d="M14 15l2 2" />
      <path d="M16 15l-2 2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

/**
 * 2. วิชาภาษาไทย
 * สัญลักษณ์หนังสือวรรณกรรม & พู่กัน / ปากกาไทย (Book & Pen)
 */
export function ThaiIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h7" />
      <path d="M16 14l3-3 2 2-3 3-2.5.5.5-2.5Z" />
    </svg>
  );
}

/**
 * 3. วิชาภาษาอังกฤษ
 * สัญลักษณ์การสื่อสารสากล / ภาษาอังกฤษ (Global Languages / Alphabet)
 */
export function EnglishIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/**
 * 4. วิชากฎหมายที่ประชาชนควรรู้
 * ตราชูความยุติธรรม (Scales of Justice)
 */
export function LawIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

/**
 * 5. วิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ
 * แล็ปท็อปและเทคโนโลยี (Laptop & IT)
 */
export function ComputerIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="12" x="3" y="4" rx="2" />
      <path d="M2 20h20" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  );
}

/**
 * 6. วิชาระเบียบงานสารบรรณ
 * แฟ้มสารบรรณและเอกสารราชการ (Archive & Document Folder)
 */
export function SarabanIcon({ className = '', size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  );
}

/**
 * หมวกตำรวจ (Police Cap) สำหรับประดับตราสัญลักษณ์ Badge Cap หรือตกแต่ง
 */
export function PoliceCapIcon({ className = '', size = 56 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.75)}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="policeCapCrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#12253e" />
        </linearGradient>
        <linearGradient id="policeCapBand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a1822" />
          <stop offset="100%" stopColor="#9b2230" />
        </linearGradient>
        <linearGradient id="policeCapBadge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#d49a24" />
        </linearGradient>
      </defs>
      {/* หมวกทรงหม้อตาล (Crown) */}
      <path
        d="M 12 30 C 12 10, 24 4, 40 4 C 56 4, 68 10, 68 30 Z"
        fill="url(#policeCapCrown)"
        stroke="#0d1b2a"
        strokeWidth="2"
      />
      {/* แถบสีเลือดหมูรอบหมวก (Band) */}
      <rect x="10" y="29" width="60" height="10" rx="3" fill="url(#policeCapBand)" stroke="#5a1017" strokeWidth="1.5" />
      {/* ตราหน้าหมวกสีทอง (Gold Shield Emblem) */}
      <path
        d="M 40 14 Q 46 14 47 21 Q 40 30 40 31 Q 40 30 33 21 Q 34 14 40 14 Z"
        fill="url(#policeCapBadge)"
        stroke="#8a610f"
        strokeWidth="1"
      />
      <circle cx="40" cy="22" r="3" fill="#8a610f" />
      {/* กะบังหมวกสีดำเงา (Visor) */}
      <path
        d="M 6 38 C 14 36, 66 36, 74 38 C 76 49, 4 49, 6 38 Z"
        fill="#0f172a"
        stroke="#020617"
        strokeWidth="2"
      />
      {/* เส้นไฮไลต์กะบังหมวก */}
      <path d="M 18 40 Q 40 43 62 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ตัวช่วยแสดงไอคอนประจำหมวดวิชาแบบ Dynamic
 */
export function SubjectIcon({
  subjectId,
  className = '',
  size = 24,
  color = 'currentColor'
}: {
  subjectId: string;
  className?: string;
  size?: number;
  color?: string;
}) {
  switch (subjectId) {
    case 'math':
    case 'analytical_thinking':
      return <MathIcon className={className} size={size} color={color} />;
    case 'thai':
      return <ThaiIcon className={className} size={size} color={color} />;
    case 'english':
      return <EnglishIcon className={className} size={size} color={color} />;
    case 'law':
      return <LawIcon className={className} size={size} color={color} />;
    case 'computer':
      return <ComputerIcon className={className} size={size} color={color} />;
    case 'saraban':
    case 'civil_servant_rules':
      return <SarabanIcon className={className} size={size} color={color} />;
    default:
      return <ThaiIcon className={className} size={size} color={color} />;
  }
}

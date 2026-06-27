export type JobRecord = Record<string, any>;

export const MINISTRY_COLORS: Record<string, { color: string; bg: string }> = {
  'กระทรวงสาธารณสุข': { color: '#2f7a63', bg: '#e6f5ef' },
  'กระทรวงอุตสาหกรรม': { color: '#8a5b33', bg: '#f7ede2' },
  'กระทรวงยุติธรรม': { color: '#4657a8', bg: '#edf1ff' },
  'กระทรวงเกษตรและสหกรณ์': { color: '#5c8f1f', bg: '#eef7d9' },
  'กระทรวงคมนาคม': { color: '#0f7996', bg: '#e7f8fc' },
  'กระทรวงศึกษาธิการ': { color: '#0d6aa8', bg: '#e7f2fb' },
  'กระทรวงการคลัง': { color: '#b77933', bg: '#fdf1e4' },
  'กระทรวงแรงงาน': { color: '#ba6a09', bg: '#fdf2dc' },
  'กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม': { color: '#6f58a8', bg: '#f1ecfb' },
  'กระทรวงมหาดไทย': { color: '#b33654', bg: '#fde9ee' },
  'สำนักนายกรัฐมนตรี': { color: '#2463b8', bg: '#e7efff' },
  'อื่น ๆ': { color: '#7c7469', bg: '#f2ede6' },
};

export function getMinistryColor(ministry: string) {
  const trimmed = (ministry || '').trim();
  if (MINISTRY_COLORS[trimmed]) return MINISTRY_COLORS[trimmed];

  for (const name of Object.keys(MINISTRY_COLORS)) {
    if (trimmed.includes(name.replace('กระทรวง', '')) || name.includes(trimmed)) {
      return MINISTRY_COLORS[name];
    }
  }

  return MINISTRY_COLORS['อื่น ๆ'];
}

export function agencyInitials(name?: string) {
  if (!name) return '??';

  const cleaned = name.replace(
    /^(สำนักงาน|กรม|กอง|สำนัก|สถาบัน|บริษัท|องค์การ|โรงพยาบาล|วิทยาลัย)\s*/,
    ''
  );
  const parts = cleaned.split(/\s+/);
  let initials = '';

  for (let index = 0; index < Math.min(parts.length, 3); index += 1) {
    if (parts[index]) initials += parts[index].charAt(0);
  }

  return initials.toUpperCase() || '??';
}

export function fixYear(value?: string) {
  if (!value) return '';

  return value.replace(/^(\d{4})-/, (match, yearText) => {
    const year = parseInt(yearText, 10);
    const currentYear = new Date().getFullYear();

    if (year > currentYear + 5) return `${year - 100}-`;
    return match;
  });
}

export function getStatus(dateStart?: string, dateEnd?: string, now = new Date()) {
  if (!dateStart && !dateEnd) return { id: 'open', label: 'เปิดรับอยู่' as const };

  const start = dateStart ? new Date(fixYear(dateStart)) : null;
  const end = dateEnd ? new Date(fixYear(dateEnd)) : null;

  if (end && end < now) {
    return { id: 'closed', label: 'ปิดรับสมัคร' as const };
  }

  if (start && now < start) {
    const daysToStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysToStart > 365) return { id: 'open', label: 'เปิดรับสมัคร' as const };
    return { id: 'before', label: `เปิดรับใน ${daysToStart} วัน` as const };
  }

  if (end) {
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return { id: 'urgent', label: `ปิดใน ${daysLeft} วัน` as const };
    if (daysLeft > 365) return { id: 'open', label: 'เปิดรับอยู่' as const };
    return { id: 'open', label: `เหลือ ${daysLeft} วัน` as const };
  }

  return { id: 'open', label: 'เปิดรับอยู่' as const };
}

export function thaiDate(value?: string) {
  if (!value) return '-';

  const parts = value.split('-');
  if (parts.length !== 3) return value;

  let year = parseInt(parts[0], 10);
  if (year < 2400) year += 543;

  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${year}`;
}

export function shortEdu(raw?: string) {
  if (!raw) return '';
  const match = raw.match(/^(ปวช\.|ปวท\.|ปวส\.|ป\.ตรี|ป\.โท|ป\.เอก|ม\.\d+|ประกาศนียบัตร|วุฒิบัตร|อนุปริญญา)/);
  return match ? match[1] : raw.substring(0, 12);
}

export function getCleanTitle(title: string) {
  return title
    .replace(/^รับสมัครบุคคลเพื่อเลือกสรรและจัดจ้างเป็นพนักงานราชการ ตำแหน่ง /, '')
    .replace(/^ตำแหน่ง/, '')
    .trim();
}

export function getActiveOcscJobs(jobs: JobRecord[], now = new Date()) {
  return jobs.filter((job) => {
    if (job['แหล่งที่มา'] !== 'job.ocsc.go.th') return false;

    const end = job['วันหมดสมัคร'] ? new Date(fixYear(job['วันหมดสมัคร'])) : null;
    return !end || end >= now;
  });
}


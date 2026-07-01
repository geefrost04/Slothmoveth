export type JobRecord = Record<string, any>;
export type JobSlimRecord = {
  id: string;
  title: string;
  agency: string;
  ministry: string;
  type: string;
  method: string;
  province: string;
  education: string;
  startDate: string;
  endDate: string;
  minSalary: string;
  maxSalary: string;
  openings: string;
  logoUrl: string;
  views: string;
};

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

export type JobsRadarSummary = {
  totalPositions: number;
  activeJobCount: number;
  agenciesCount: number;
  ministriesCount: number;
  civilPercent: number;
  officialPercent: number;
  otherPercent: number;
  needOcscPercent: number;
  noOcscPercent: number;
  urgentJobs: number;
  topJobs: Array<{
    id: string;
    title: string;
    agency: string;
    ministry: string;
    type: string;
    status: ReturnType<typeof getStatus>;
    views: number;
    query: string;
    initials: string;
    logoUrl: string;
  }>;
};

export function buildJobsRadarSummary(jobs: JobRecord[], now = new Date()): JobsRadarSummary {
  const activeJobs = getActiveOcscJobs(jobs, now);

  let totalPositions = 0;
  let civilCount = 0;
  let officialCount = 0;
  let otherCount = 0;
  let needOcsc = 0;
  let noOcsc = 0;
  const agencies = new Set<string>();
  const ministries = new Set<string>();

  activeJobs.forEach((job) => {
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
    (job) => getStatus(job['วันเริ่มสมัคร'], job['วันหมดสมัคร'], now).id === 'urgent'
  ).length;

  const topJobs = [...activeJobs]
    .sort((left, right) => parseInt(right['ยอดเข้าชม'] || '0', 10) - parseInt(left['ยอดเข้าชม'] || '0', 10))
    .slice(0, 3)
    .map((job) => ({
      id: String(job.id),
      title: getCleanTitle(job['ตำแหน่ง'] || ''),
      agency: job['หน่วยงาน'] || '',
      ministry: job['กระทรวง'] || '',
      type: job['ประเภทงาน'] || 'งานราชการ',
      status: getStatus(job['วันเริ่มสมัคร'], job['วันหมดสมัคร'], now),
      views: parseInt(job['ยอดเข้าชม'] || '0', 10),
      query: getCleanTitle(job['ตำแหน่ง'] || ''),
      initials: agencyInitials(job['หน่วยงาน']),
      logoUrl: String(job['โลโก้หน่วยงาน'] || ''),
    }));

  return {
    totalPositions,
    activeJobCount: activeJobs.length,
    agenciesCount: agencies.size,
    ministriesCount: ministries.size,
    civilPercent,
    officialPercent,
    otherPercent,
    needOcscPercent,
    noOcscPercent,
    urgentJobs,
    topJobs,
  };
}

export function toSlimJob(job: JobRecord): JobSlimRecord {
  return {
    id: String(job.id || ''),
    title: String(job['ตำแหน่ง'] || ''),
    agency: String(job['หน่วยงาน'] || ''),
    ministry: String(job['กระทรวง'] || ''),
    type: String(job['ประเภทงาน'] || ''),
    method: String(job['วิธีการสรรหา'] || ''),
    province: String(job['จังหวัด'] || ''),
    education: String(job['ระดับการศึกษา'] || ''),
    startDate: String(job['วันเริ่มสมัคร'] || ''),
    endDate: String(job['วันหมดสมัคร'] || ''),
    minSalary: String(job['เงินเดือนต่ำสุด'] || ''),
    maxSalary: String(job['เงินเดือนสูงสุด'] || ''),
    openings: String(job['จำนวนรับ'] || ''),
    logoUrl: String(job['โลโก้หน่วยงาน'] || ''),
    views: String(job['ยอดเข้าชม'] || ''),
  };
}

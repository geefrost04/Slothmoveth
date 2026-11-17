import { NESDC_COURSE } from '@/lib/nesdc-learn/course';
import { homePage } from '@/lib/learn/pages';

// Static page: content is in the prerendered HTML.
export const dynamic = 'force-static';

const p = homePage(NESDC_COURSE, 'แผนเตรียมสอบ 21 วัน - สศช. งานวิเคราะห์นโยบายและแผน', 'เรียนทีละบทแบบติวเตอร์ เตรียมสอบพนักงานราชการ สศช. อ้างอิงเอกสารทางการพร้อมเลขหน้า');
export const metadata = p.metadata;
export default p.Page;

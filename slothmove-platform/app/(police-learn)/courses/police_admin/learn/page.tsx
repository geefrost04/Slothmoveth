import { POLICE_COURSE } from '@/lib/police-learn/course';
import { homePage } from '@/lib/learn/pages';

// Static page: content is in the prerendered HTML.
export const dynamic = 'force-static';

const p = homePage(POLICE_COURSE, 'แผนเตรียมสอบ 12 วัน - ตำรวจชั้นประทวน สายอำนวยการและสนับสนุน', 'เรียนทีละบทแบบติวเตอร์ เตรียมสอบตำรวจ อก.1 เรียงตามน้ำหนักคะแนน พร้อมข้อสอบย่อยทุกบท');
export const metadata = p.metadata;
export default p.Page;

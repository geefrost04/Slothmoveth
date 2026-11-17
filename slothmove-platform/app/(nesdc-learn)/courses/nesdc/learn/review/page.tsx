import { NESDC_COURSE } from '@/lib/nesdc-learn/course';
import { reviewPage } from '@/lib/learn/pages';

export const dynamic = 'force-static';

const p = reviewPage(NESDC_COURSE);
export const metadata = p.metadata;
export default p.Page;

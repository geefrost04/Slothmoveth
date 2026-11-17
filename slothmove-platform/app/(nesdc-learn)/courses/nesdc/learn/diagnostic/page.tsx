import { NESDC_COURSE } from '@/lib/nesdc-learn/course';
import { diagnosticPage } from '@/lib/learn/pages';

export const dynamic = 'force-static';

const p = diagnosticPage(NESDC_COURSE);
export const metadata = p.metadata;
export default p.Page;

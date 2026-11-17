import { POLICE_COURSE } from '@/lib/police-learn/course';
import { reviewPage } from '@/lib/learn/pages';

export const dynamic = 'force-static';

const p = reviewPage(POLICE_COURSE);
export const metadata = p.metadata;
export default p.Page;

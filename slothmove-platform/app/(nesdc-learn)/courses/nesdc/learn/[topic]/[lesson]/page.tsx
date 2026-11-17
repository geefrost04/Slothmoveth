import { NESDC_COURSE } from '@/lib/nesdc-learn/course';
import { lessonPage } from '@/lib/learn/pages';

// Static pages: the full lesson text is in the prerendered HTML (no loading placeholder).
export const dynamic = 'force-static';
export const dynamicParams = false;

const p = lessonPage(NESDC_COURSE);
export const generateStaticParams = p.generateStaticParams;
export const generateMetadata = p.generateMetadata;
export default p.Page;

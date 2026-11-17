import { NESDC_COURSE } from '@/lib/nesdc-learn/course';
import { topicTestPage } from '@/lib/learn/pages';

export const dynamic = 'force-static';
export const dynamicParams = false;

const p = topicTestPage(NESDC_COURSE);
export const generateStaticParams = p.generateStaticParams;
export const generateMetadata = p.generateMetadata;
export default p.Page;

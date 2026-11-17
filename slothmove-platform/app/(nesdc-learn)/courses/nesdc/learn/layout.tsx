import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Anuphan } from 'next/font/google';
import { CourseProvider } from '@/components/learn/CourseContext';
import { NESDC_META } from '@/lib/nesdc-learn/course';
import '@/components/learn/learn.css';

// สศช. tutor course (new; not linked from the live course until the owner approves).
// It lives in the (nesdc-learn) route group so the shared app/courses/loading.tsx boundary does not wrap it:
// pages are prerendered with their full text instead of a "กำลังเปิดหน้า…" placeholder.
const anuphan = Anuphan({ weight: ['500', '600', '700'], subsets: ['thai', 'latin'], display: 'swap', variable: '--font-anuphan' });

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function NesdcLearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nl ${anuphan.variable}`}>
      <CourseProvider meta={NESDC_META}>{children}</CourseProvider>
    </div>
  );
}

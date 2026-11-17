import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Anuphan } from 'next/font/google';
import { CourseProvider } from '@/components/learn/CourseContext';
import { POLICE_META } from '@/lib/police-learn/course';
import '@/components/learn/learn.css';

// Police tutor course (new; not linked from the live course until the owner approves).
// The (police-learn) route group keeps it outside app/courses/loading.tsx, so pages prerender with full text.
const anuphan = Anuphan({ weight: ['500', '600', '700'], subsets: ['thai', 'latin'], display: 'swap', variable: '--font-anuphan' });

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function PoliceLearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nl ${anuphan.variable}`}>
      <CourseProvider meta={POLICE_META}>{children}</CourseProvider>
    </div>
  );
}

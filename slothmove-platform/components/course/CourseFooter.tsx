import type { CourseConfig } from '@/lib/course-types';
import { Footer } from '@/components/Footer';

export function CourseFooter({ course }: { course: CourseConfig }) {
  // Course pages inherit the unified SlothMove Master Footer
  return <Footer />;
}

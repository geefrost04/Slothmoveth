import type { ReactNode } from 'react';
import type { CourseConfig } from '@/lib/course-types';
import { CourseNav } from './CourseNav';
import { PoliceAdminNav } from './PoliceAdminNav';
import { OcscNav } from './OcscNav';
import { CourseFooter } from './CourseFooter';
import { applyTheme } from '@/lib/course-theme';
import { DonatePopup } from '@/components/DonatePopup';

export function CourseLayout({
  course,
  children
}: {
  course: CourseConfig;
  children: ReactNode;
}) {
  return (
    <div id="top" className="course-layout" data-course={course.id} style={applyTheme(course.theme)}>
      {course.useDrillNav ? (
        <PoliceAdminNav course={course} />
      ) : course.id === 'ocsc' ? (
        <OcscNav course={course} />
      ) : (
        <CourseNav course={course} />
      )}
      <main style={{ flex: 1 }}>{children}</main>
      <CourseFooter course={course} />
      <DonatePopup />
    </div>
  );
}

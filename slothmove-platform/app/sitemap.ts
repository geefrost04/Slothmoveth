import type { MetadataRoute } from 'next';
import { COURSES, isCourseOpen } from '@/courses/registry';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/courses'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/courses/police_admin/mock-test'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const coursePages: MetadataRoute.Sitemap = COURSES.filter((course) => isCourseOpen(course.id)).flatMap((course) => [
    {
      url: absoluteUrl(`/courses/${course.id}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: course.meta.migrated ? 0.9 : 0.7,
    },
    ...course.subjects.map((subject) => ({
      url: absoluteUrl(`/courses/${course.id}/${subject.id}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: course.meta.migrated ? 0.8 : 0.6,
    })),
  ]);

  const summarySections = [
    ...Array.from({ length: 20 }, (_, index) => `/courses/police_admin/math/summary/chapter-${String(index + 1).padStart(2, '0')}`),
    '/courses/police_admin/math/summary/quick-review',
    ...Array.from({ length: 5 }, (_, index) => `/courses/police_admin/computer/summary/part-${String(index + 1).padStart(2, '0')}`),
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...coursePages, ...summarySections];
}

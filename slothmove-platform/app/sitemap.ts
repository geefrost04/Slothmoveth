import type { MetadataRoute } from 'next';
import { COURSES } from '@/courses/registry';
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
      url: absoluteUrl('/rat-ngan'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const coursePages: MetadataRoute.Sitemap = COURSES.flatMap((course) => [
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

  return [...staticPages, ...coursePages];
}

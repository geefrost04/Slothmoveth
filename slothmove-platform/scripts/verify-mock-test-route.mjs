import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const requiredRoutes = [
  'app/courses/police_admin/mock-test/page.tsx',
  'app/courses/ocsc/mock-test/page.tsx'
];
const conflictingRoute = 'app/courses/[course]/mock-test/page.tsx';

if (existsSync(resolve(conflictingRoute))) {
  throw new Error(
    `Route conflict: ${conflictingRoute} shadows the police_admin Mock Test page. Use a course-specific route instead.`
  );
}

for (const route of requiredRoutes) {
  if (!existsSync(resolve(route))) {
    throw new Error(`Missing required Mock Test route: ${route}`);
  }
}

console.log('Mock Test route guard passed.');

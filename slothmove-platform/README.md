# SlothMove Platform

Next.js 15 platform for Thai police and OCSC exam preparation.

## Current Scope

- `police_admin`: active product track. Legacy questions were removed while paid exam sets and visual summaries are redesigned.
- `ocsc`: retained for the next product phase. Existing analytical-thinking and civil-service content remains local for now.
- Supabase: authentication, scores, products, entitlements, attempts, and the planned content source for summaries and exam sets.

## Structure

```text
app/                         Routes and global styles
components/                  Shared home, course, summary, and game UI
lib/                         Browser services and shared utilities
src/courses/police_admin/    Police configuration and legacy summaries
src/courses/ocsc/            OCSC configuration and current local content
src/courses/registry.ts      Available courses
src/courses/content-registry.ts
scripts/schema.sql           Current Supabase schema draft
public/pic/                  Assets used by Police, OCSC, and shared UI
```

## Routes

- `/`: home
- `/courses/police_admin`: police course
- `/courses/ocsc`: OCSC maintenance page
- `/courses/[course]/[subject]`: subject summary
- `/courses/[course]/[subject]/[game]`: game route, currently paused
- `/login` and `/dashboard`: account flow
- `/rat-ngan`: compatibility redirect to home

## Development

```bash
npm install
npm run dev
npm run build
```

The development server uses port `3040` by default. Preview builds may be started on another port with `next start -p <port>`.

Required local environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

Do not put a Supabase service-role key in a `NEXT_PUBLIC_*` variable. Paid exam questions and answer validation must be served through server-only code.

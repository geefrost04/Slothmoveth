# SlothMove Homepage — Next.js 15 (App Router)

Port ของ homepage เดิม (`~/Documents/SlothMove/index.html`) เป็น Next.js 15 + TypeScript + Tailwind + Supabase

> ⚠️ **ห้ามแก้ไขไฟล์ต้นฉบับ** — folder นี้เป็น side-by-side project, ต้นฉบับอยู่ที่ `~/Documents/SlothMove/`

## Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS 3** (config ให้ใช้ CSS variables จาก `globals.css`)
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) — placeholder, ใส่ env ทีหลัง
- **next/font** — Kanit + Sarabun (Thai-optimized)

## Folder structure

```
homepage-nextjs/
├── app/
│   ├── layout.tsx       # Root: fonts, metadata, JSON-LD, theme init script
│   ├── page.tsx         # Home page (composes all sections)
│   └── globals.css      # Design tokens + all component CSS
├── components/
│   ├── AnalyticsTracker.tsx # GA4 page view + click + section/FAQ engagement
│   ├── Navbar.tsx       # Fixed nav + mobile menu + theme toggle
│   ├── Hero.tsx         # Hero section
│   ├── CourseGrid.tsx   # Course cards (renders from lib/courses.ts)
│   ├── Articles.tsx     # Articles section
│   ├── Why.tsx          # "Why SlothMove" features grid
│   ├── FAQ.tsx          # Accordion FAQ
│   ├── Donate.tsx       # QR code section
│   ├── Footer.tsx       # Site footer
│   ├── DonatePopup.tsx  # Modal donate popup
│   └── ThemeProvider.tsx # Context for dark/light theme
├── lib/
│   ├── courses.ts       # Course data (typed, ported from data/courses.js)
│   ├── gtag.ts          # GA4 helpers + measurement ID
│   └── supabase.ts      # Browser-side Supabase client (graceful no-env fallback)
├── public/              # Static assets (สร้างเมื่อ copy รูป)
├── .env.example         # NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Setup

```bash
cd ~/Desktop/SlothMove/homepage-nextjs
npm install              # install deps
cp .env.example .env.local   # (optional) ใส่ Supabase keys
npm run dev              # http://localhost:3030
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on port **3030** |
| `npm run build` | Production build |
| `npm run start` | Serve production build on port 3030 |
| `npm run lint` | Next.js + ESLint |

## Asset sync (สถานะปัจจุบัน)

✅ **รูปใน `public/pic/` พร้อมแล้ว** — เหลือแค่ตรวจว่าไฟล์ใหม่ ๆ จาก source ถูก copy ตามทัน

ปัจจุบันมี:
- `/pic/slothmove_mascot.svg` + `/pic/slothmove_mascot.png`
- `/pic/logo_OPSDD.png`
- `/pic/logo_industry.png`
- `/pic/logo-ปภ.png` (rename จาก `logo ปภ.png` เพื่อ URL safety)
- `/pic/logo_police.svg`
- `/pic/logo_kpi.svg`
- `/pic/qr-page.png`

ถ้าจะเพิ่ม/เปลี่ยน asset:
```bash
cp -r ~/Documents/SlothMove/pic/* ~/Desktop/SlothMove/homepage-nextjs/public/pic/
```

## Course links — วิธีเชื่อมไปยัง platform

ปุ่ม "ดูทั้งหมด" และลิงก์บน CourseCard ชี้ไป `slothmove-platform` (ไม่ใช่หน้าในโปรเจกต์นี้เอง — homepage นี้เป็น marketing site เท่านั้น)

กำหนด base URL ผ่าน env var `NEXT_PUBLIC_PLATFORM_URL`:

```bash
# .env.local
NEXT_PUBLIC_PLATFORM_URL=http://localhost:3040    # dev (platform default port)
# NEXT_PUBLIC_PLATFORM_URL=https://learn.slothmoveth.com  # prod
```

- `lib/courses.ts` export `PLATFORM_HOME_URL` ใช้ใน `<CourseGrid>` (ปุ่ม "ดูทั้งหมด")
- `Course.fullLink` ต่อกันเป็น `${NEXT_PUBLIC_PLATFORM_URL}/courses/<id>`
- `status: 'ready'` = เปิดใช้งานปกติ
- `status: 'partial'` = เปิดเข้าได้ แต่มีแค่บางวิชาที่ย้ายข้อมูลแล้ว
- `status: 'coming-soon'` = การ์ดยัง disabled + แสดง badge "เร็วๆ นี้"

## Course migration status (อัปเดตล่าสุด)

| Course | Status | ลิงก์ไป |
|--------|--------|---------|
| PAB | ✅ ready | platform `/courses/pab` |
| Industry | 🟡 partial (5/9 วิชา) | platform `/courses/industry` |
| OPSD | 🟡 partial (4/7 วิชา) | platform `/courses/opsd` |
| Police Admin | 🚧 not migrated (legacy) | `/Page/source/police_admin/index.html` (ของเดิม) |
| KPI | 🙈 hidden (draft) | — |

ตัวเลขล่าสุดที่หน้า homepage ใช้:
- PAB = 20 วิชา / 425 ข้อ
- Industry = 9 วิชา / 500 ข้อ
- OPSD = 7 วิชา / 821 ข้อ

## Differences จากต้นฉบับ

| Aspect | ต้นฉบับ | Next.js |
|--------|---------|---------|
| Architecture | Single HTML file | Component-per-section |
| Data | `data/courses.js` global | `lib/courses.ts` typed |
| Styling | Inline `<style>` | `app/globals.css` + Tailwind tokens |
| Theme | localStorage + `<script>` | `ThemeProvider` context + inline init script |
| Mobile menu | Imperative DOM | React state |
| Donate popup | Inline JS | Event-driven (`window.dispatchEvent`) |
| Fonts | Google Fonts CDN | `next/font` (optimized, no FOIT) |
| SEO | `<meta>` + `<script>` JSON-LD | `metadata` API + JSON-LD |

## GA4 analytics

ตอนนี้หน้า homepage ส่ง event ไป GA4 แล้วสำหรับ:

- `page_view` เมื่อเปิด/เปลี่ยนหน้า
- `click_cta` จากปุ่ม hero
- `click_nav` จากเมนู desktop/mobile
- `click_course` และ `click_locked_course` จากการ์ดคอร์ส
- `click_view_all_courses` และ `click_view_all_jobs`
- `click_social` จากลิงก์ Facebook
- `click_donate_cta` เมื่อกดปุ่มสนับสนุน
- `view_donate_popup` เมื่อ popup สนับสนุนเปิด
- `view_section` เมื่อ section สำคัญเข้าหน้าจอ
- `faq_open` เมื่อผู้ใช้เปิดคำถาม
- `open_mobile_menu` / `close_mobile_menu`
- `toggle_theme`
- `active_time` เมื่อผู้ใช้ active อยู่บนหน้าอย่างน้อย 5 วินาที

Parameter ที่ส่งไปกับหลาย event:

- `page_path`
- `section`
- `label`
- `destination`
- `question`
- `active_time_seconds`
- `reason`

### แนะนำให้ตั้งค่าใน GA4

เข้า `Admin > Custom definitions` แล้วเพิ่ม Event-scoped custom dimensions เหล่านี้:

- `page_path`
- `section`
- `label`
- `destination`
- `question`
- `reason`

และเพิ่ม Event-scoped custom metric:

- `active_time_seconds`

### รายงานที่ควรดู

- หน้าไหนคนเข้าเยอะ: รายงาน `page_view` แยกตาม `page_path`
- ปุ่มไหนคนกดเยอะ: รายงาน event กลุ่ม `click_*` แยกตาม `label`
- section ไหนถูกเห็นบ่อย: `view_section` แยกตาม `section`
- คำถามไหนคนเปิดเยอะ: `faq_open` แยกตาม `question`
- คน active หน้าไหนนาน: `active_time` แยกตาม `page_path` และดูค่า `active_time_seconds`

### ข้อสังเกต

- GA4 ใช้เวลาสักพักก่อน event ใหม่จะโผล่ในรายงานมาตรฐาน
- ถ้าจะเช็คทันที ให้ดู `Admin > DebugView` หรือ `Realtime`

## What's NOT ported (deliberately)

- **Articles section** — ใช้ static placeholder content (จะดึงจาก Supabase ทีหลัง)
- **Google Fonts preload** — `next/font` handles internally
- **`design.md` design system** — ยังไม่ได้ integrate (defer ไป phase 2)

## Deploy target

แนะนำ **Vercel**:
1. Push folder นี้ขึ้น GitHub repo แยก
2. Vercel → Import → ตั้ง `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

**Domain**: `slothmoveth.com` — ชี้ DNS มาที่ Vercel (ตอนนี้ใช้ CNAME + GitHub Pages อยู่)

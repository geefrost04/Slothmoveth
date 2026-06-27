# SlothMove Platform — Phase 2

**Config-driven Next.js multi-course learning platform.**

> Built per `~/Documents/SlothMove/LEAN_NEXTJS_COURSE_ARCHITECTURE.md`

## Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS 3** (shared tokens)
- **Supabase** (placeholder — data source Phase 2.2)
- **Port: 3040**

## Folder structure

```
slothmove-platform/
├── app/
│   ├── layout.tsx                      ← Root: fonts, metadata
│   ├── page.tsx                        ← Platform home (course index)
│   └── courses/
│       └── [course]/
│           ├── page.tsx                ← Course landing
│           ├── [subject]/page.tsx      ← Subject page (game picker)
│           └── [subject]/[game]/       ← Game page
│
├── components/
│   ├── course/                         ← Shared course UI
│   │   ├── CourseLayout.tsx            ← Theme wrapper + nav
│   │   ├── CourseNav.tsx
│   │   ├── CourseHero.tsx
│   │   ├── SubjectCard.tsx
│   │   └── GameCard.tsx
│   │
│   └── games/                          ← Shared game templates
│       ├── QuizGame.tsx          ✅ full
│       ├── FlashcardGame.tsx     ✅ full
│       ├── MatchGame.tsx         ✅ full
│       ├── ClozeGame.tsx         ✅ full
│       ├── SortingGame.tsx       🟡 skeleton (data ตอนนี้ใช้ sample)
│       ├── OrderGame.tsx         🟡 skeleton (data ตอนนี้ใช้ sample)
│       ├── SpellingGame.tsx      🟡 skeleton (data ตอนนี้ใช้ sample)
│       ├── TrueFalseGame.tsx     🟡 skeleton (data ตอนนี้ใช้ sample)
│       ├── AuthorityGame.tsx     🟡 skeleton (curated fallback)
│       └── LogicGame.tsx         🟡 skeleton (curated fallback)
│
└── src/
    ├── courses/
    │   ├── registry.ts                 ← Single source of truth
    │   ├── pab/
    │   │   ├── config.ts               ← Theme + subjects + games (mark `migrated: true`)
    │   │   ├── data-loader.ts          ← Quiz/Flashcard/Match/Cloze + sample Authority/Logic + per-game sample fallback
    │   │   └── data/                   ← Auto-generated per-subject quiz/flashcard/match/cloze data
    │   ├── opsd/                       ← `migrated: true` — partial data (4/7 subjects)
    │   └── industry/                   ← `migrated: true` — partial data (5/9 subjects)
    │
    └── lib/
        ├── course-types.ts             ← Shared TS types (incl. `migrated`, `migrationNote` on CourseMeta)
        └── course-theme.ts             ← Theme token resolver
```

## Routes

| URL | Renders |
|-----|---------|
| `/` | Platform home — list of 3 courses (PAB, OPSD, Industry) |
| `/courses/pab` | PAB landing — hero + 20 subject cards + 4 full games per subject |
| `/courses/opsd` | OPSD landing — เปิดคอร์สได้, บางวิชามีข้อมูลจริง บางวิชาแสดง "ยังไม่มีข้อมูล" |
| `/courses/industry` | Industry landing — เปิดคอร์สได้, บางวิชามีข้อมูลจริง บางวิชาแสดง "ยังไม่มีข้อมูล" |
| `/courses/pab/admin_act` | Subject page — 6 เกมเปิดจริง + 4 skeletons |
| `/courses/pab/admin_act/quiz` | Quiz game (real migrated data) |
| `/courses/pab/admin_act/sorting` | Skeleton view ("กำลังพัฒนา" + คำอธิบาย) |
| `/courses/opsd/info_act/quiz` | Quiz game (real migrated data) |
| `/courses/opsd/admin_act/quiz` | "ยังไม่มีข้อมูล" สำหรับวิชานี้ — ไม่ใช่หน้าว่างเปล่า |
| `/courses/industry/admin_act/quiz` | Quiz game (real migrated data) |

## Course migration status (อัปเดตล่าสุด)

| Course | Migrated | Data | Subject count |
|--------|----------|------|---------------|
| **PAB** | ✅ `meta.migrated = true` | Real data + partial curated game content | 20 วิชา |
| **OPSD** | 🟡 `meta.migrated = true` | Real data 4/7 วิชา, ที่เหลือแสดง `no data` ตามจริง | 7 วิชา |
| **Industry** | 🟡 `meta.migrated = true` | Real data 5/9 วิชา, ที่เหลือแสดง `no data` ตามจริง | 9 วิชา |
| **Police Admin** | 🚫 ยังไม่เริ่ม | — | — (legacy HTML) |

UX rules ที่บังคับให้ตรงกับสถานะจริง:

- **Course `migrated: true`** → แสดง hero + subject grid ปกติ ผู้ใช้คลิกเข้าเกมได้
- **Course `migrated: true` + subject count = 0** → หน้า subject แสดง "ยังไม่มีข้อมูล" สำหรับวิชานั้น
- **Course `migrated: false`** → แสดง banner "🚧 คอร์สนี้ยังไม่พร้อมให้บริการ" + subject cards disabled (ใช้กับคอร์สที่จะเพิ่มในอนาคต)
- **Course ไม่มี data loader** → หน้า game แสดง placeholder "ยังไม่พร้อม" พร้อม CTA ไป PAB
- **Game template `status: 'skeleton'`** → GameCard เป็น `aria-disabled` div ไม่ใช่ link
- **Game page เปิดเข้าไปแล้วเจอ skeleton** → แสดงหน้า "กำลังพัฒนา" + รายชื่อเกมที่เล่นได้จริง

## Game status (truthful)

สถานะเกมปัจจุบันสะท้อน config + data-loader จริง:

| Game | Status | Why |
|------|--------|-----|
| Quiz | ✅ full | Auto-migrated จาก source PAB |
| Flashcard | ✅ full | Auto-migrated |
| Match | ✅ full | Adapter-derived จาก Quiz (`quiz-to-games.ts`) |
| Cloze | ✅ full | Adapter-derived จาก Quiz |
| Sorting | 🟡 skeleton | data-loader คืน `SAMPLE_SORTING` (universal sample) — ยังไม่ใช่ per-subject |
| Order | 🟡 skeleton | data-loader คืน `SAMPLE_ORDER` (universal sample) |
| Spelling | 🟡 skeleton | data-loader คืน `SAMPLE_SPELLING` (universal sample) |
| TrueFalse | 🟡 skeleton | data-loader คืน `SAMPLE_TRUEFALSE` (universal sample) |
| Authority | ✅ full ใน PAB / 🟡 skeleton ใน OPSD, Industry | PAB มี curated per-subject บางส่วนและวิชาที่ไม่มีข้อมูลจะขึ้น `no data` ตรง ๆ |
| Logic | ✅ full ใน PAB / 🟡 skeleton ใน OPSD, Industry | PAB มี curated per-subject บางส่วนและวิชาที่ไม่มีข้อมูลจะขึ้น `no data` ตรง ๆ |

ถ้าจะ flip เกมใดเป็น `full` ใน OPSD หรือ Industry ต้อง migrate per-subject data จริงก่อน แล้วแก้ `data-loader.ts` ให้ return array ของ subject นั้น ๆ แทน sample/fallback

## Adding a new course

1. Create `src/courses/<id>/config.ts` exporting a `CourseConfig`
   - ตั้ง `meta.migrated: false` + `meta.migrationNote` ถ้ายังไม่มี data
2. Add to `src/courses/registry.ts` `COURSES` array
3. (Optional) Create `src/courses/<id>/data-loader.ts` — เปลี่ยน `meta.migrated: true` เมื่อพร้อม
4. `app/courses/[course]/...` routes จะ pick up อัตโนมัติ

## Run

```bash
npm run dev      # http://localhost:3040
npm run build    # production build
```

## Deploy

ตั้ง `NEXT_PUBLIC_SITE_URL` ให้ตรงกับโดเมนของแพลตฟอร์ม เพื่อให้ canonical URL, sitemap, robots, และ Open Graph ใช้ host ที่ถูกต้อง

```bash
# local
NEXT_PUBLIC_SITE_URL=http://localhost:3040

# production
NEXT_PUBLIC_SITE_URL=https://learn.slothmoveth.com
```

ทดสอบ UX:

```bash
# เปิดในเบราว์เซอร์:
#  ✅ /courses/pab          — พร้อมใช้งาน
#  🟡 /courses/opsd         — เปิดคอร์สได้, บางวิชาใช้งานได้จริง
#  🟡 /courses/industry     — เปิดคอร์สได้, บางวิชาใช้งานได้จริง
#  ✅ /courses/pab/admin_act/quiz — เกมจริง
#  🟡 /courses/pab/admin_act/sorting — skeleton view
#  ✅ /courses/opsd/info_act/quiz — เกมจริง
#  📭 /courses/opsd/admin_act/quiz — "ยังไม่มีข้อมูล" (ไม่ใช่หน้าว่าง)
```

## Important rules

- ❌ Do **not** edit files in `~/Documents/SlothMove/` (source of truth)
- ✅ All changes go in this folder only
- ✅ Each course = theme + subjects + games + `meta.migrated` (truthful status)
- ✅ Adding a course = 1 config file + 1 registry entry
- ✅ Game status ใน config ต้องตรงกับ `data-loader.ts` — ถ้ายังเป็น sample ให้ใช้ `skeleton`

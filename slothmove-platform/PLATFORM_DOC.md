# SlothMove Platform — Documentation

> อัปเดต: 24 มิถุนายน 2569

---

## Overview

Multi-course exam preparation platform สร้างด้วย Next.js 15 + TypeScript + Tailwind CSS
รองรับ 4 คอร์ส — PAB, OPSD, Industry, Police Admin

**Root:** `~/Desktop/SlothMove/slothmove-platform/`
**Port:** `3040`
**Dev:** `npm run dev`

---

## Architecture

### Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + CSS Variables |
| Database | Supabase (placeholder Phase 2.2) |
| Data | Config-driven — no CMS |

### Folder Structure

```
slothmove-platform/
├── app/
│   ├── page.tsx                    # Platform home (course index)
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Global styles + CSS tokens
│   ├── rat-ngan/
│   │   ├── page.tsx                # งานราชการ job board
│   │   └── JobDetailModal.tsx      # Modal ดูรายละเอียดงาน
│   └── courses/
│       └── [course]/
│           ├── page.tsx            # Course landing page
│           ├── [subject]/
│           │   ├── page.tsx        # Subject page (game picker)
│           │   └── [game]/
│           │       └── page.tsx    # Game play page
│
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── Footer.tsx                   # Footer
│   ├── Hero.tsx                    # Homepage hero section
│   ├── CourseGrid.tsx              # Course card grid (homepage)
│   ├── Donate.tsx / DonatePopup.tsx # Donation component
│   ├── FAQ.tsx                     # FAQ section
│   ├── Why.tsx                    # Why choose SlothMove
│   ├── Articles.tsx               # Blog/article section
│   ├── FloatingThemeToggle.tsx     # Dark/light mode toggle
│   ├── ThemeProvider.tsx           # Theme context provider
│   │
│   ├── course/                     # Shared course UI components
│   │   ├── CourseLayout.tsx       # Theme wrapper + nav
│   │   ├── CourseNav.tsx          # Course-level navigation
│   │   ├── CourseHero.tsx         # Course hero banner
│   │   ├── CourseFooter.tsx       # Course footer
│   │   ├── CourseLanding.tsx      # Rich course landing page
│   │   ├── CourseKnowledgeContent.tsx # Content renderer
│   │   ├── CourseLeaderboard.tsx  # Leaderboard component
│   │   ├── CourseSubjectPage.tsx  # Subject page with game grid
│   │   ├── CoursePracticeHubPage.tsx # Practice hub
│   │   ├── SubjectCard.tsx        # Subject card (grid item)
│   │   └── GameCard.tsx           # Game card (with status badge)
│   │
│   └── games/                     # Shared game templates
│       ├── QuizGame.tsx           # ข้อสอบ 4 ตัวเลือก
│       ├── FlashcardGame.tsx      # แฟลชการ์ด หน้า1=โจทย์ หน้า2=เฉลย
│       ├── MatchGame.tsx          # จับคู่คำศัพท์
│       ├── MatchBoard.tsx         # Match board UI (shared)
│       ├── ClozeGame.tsx          # เติมคำในช่องว่าง
│       ├── SortingGame.tsx        # เรียงลำดับ (ยังเป็น sample)
│       ├── OrderGame.tsx          # เรียงขั้นตอน (ยังเป็น sample)
│       ├── SpellingGame.tsx       # สะกดคำ (ยังเป็น sample)
│       ├── TrueFalseGame.tsx      # จริง/เท็จ (ยังเป็น sample)
│       ├── AuthorityGame.tsx       # จับคู่หน่วยงาน-อำนาจหน้าที่
│       ├── LogicGame.tsx          # ตรรกะ/อนุกรม
│       ├── AnalogyGame.tsx        # อุปมาอุปไมย (police_admin)
│       ├── SeriesGame.tsx         # เติมอนุกรม (police_admin)
│       └── useMatchGame.ts        # Hook สำหรับ match game logic
│
└── src/
    ├── courses/
    │   ├── registry.ts             # Course registry (single source of truth)
    │   ├── content-registry.ts     # Content metadata registry
    │   ├── pab/                   # PAB course config + data
    │   │   ├── config.ts           # Theme, subjects, games
    │   │   ├── data-loader.ts      # Per-subject data (quiz/flashcard/match/cloze)
    │   │   └── data/              # Auto-generated per-subject quiz data
    │   ├── opsd/                  # OPSD course
    │   ├── industry/               # Industry course
    │   └── police_admin/           # Police Admin course (config only)
    │
    ├── data/
    │   └── jobs.ts                 # ข้อมูลงานราชการ (JOBS_DATA array)
    │
    └── lib/
        ├── course-types.ts         # Shared TypeScript types
        ├── course-theme.ts         # Theme token resolver
        └── knowledge-types.ts      # Knowledge content types
```

---

## Pages & Routes

| URL | Description |
|-----|-------------|
| `/` | Platform homepage — course grid + hero |
| `/rat-ngan` | งานราชการ job board (151 งาน) |
| `/courses/pab` | PAB landing — 20 วิชา, เกมครบทั้ง 6 |
| `/courses/pab/[subject]` | หน้าเลือกเกมของแต่ละวิชา |
| `/courses/pab/[subject]/[game]` | เล่นเกมจริง (quiz, flashcard, match, cloze) |
| `/courses/opsd` | OPSD landing (4/7 วิชามีข้อมูลจริง) |
| `/courses/industry` | Industry landing (5/9 วิชามีข้อมูลจริง) |
| `/courses/police_admin` | Police Admin (config เตรียมไว้, ยังไม่ migrate) |

---

## Features

### 1. Course System

- **Config-driven** — เพิ่มคอร์สใหม่ = แก้ไข config ไฟล์เดียว
- **Theme system** — แต่ละคอร์สมีสี + โลโก้ + mascot ของตัวเอง
- **Migration status** — UI แสดงสถานะจริง (มีข้อมูล vs ยังไม่มี vs กำลังพัฒนา)

### 2. Game Engine

| Game | Type | Status |
|------|------|--------|
| Quiz | 4 ตัวเลือก + เฉลย | ✅ Full |
| Flashcard | หน้า1=โจทย์, หน้า2=เฉลย+วิธีคิด | ✅ Full |
| Match | จับคู่คำศัพท์/สูตร | ✅ Full |
| Cloze | เติมคำในช่องว่าง | ✅ Full |
| Sorting | เรียงลำดับ | 🟡 Skeleton (sample) |
| Order | เรียงขั้นตอน | 🟡 Skeleton (sample) |
| Spelling | สะกดคำจากคำใบ้ | 🟡 Skeleton (sample) |
| TrueFalse | จริงหรือเท็จ | 🟡 Skeleton (sample) |
| Authority | จับคู่หน่วยงาน-อำนาจ | ✅ PAB / 🟡 Others |
| Logic | ตรรกะ/อนุกรม | ✅ PAB / 🟡 Others |
| Analogy | อุปมาอุปไมย | 🟡 Skeleton |
| Series | เติมอนุกรม | 🟡 Skeleton |

### 3. Job Board (งานราชการ)

- **151 งาน** จาก OCSC API
- ดึงข้อมูล: ตำแหน่ง, เงินเดือน, จังหวัด, วันหมดสมัคร, ลิงก์สมัคร
- Filter + Search + Sort
- Modal ดูรายละเอียดเต็ม
- ดึงข้อมูลทุกเช้า 09:00 ผ่าน cron

### 4. Theme & Design

- **CSS Variables** — ทุกสีเป็น token ที่เปลี่ยนได้ตามคอร์ส
- **Dark/Light mode** — toggle ได้
- **Brand colors:**
  - Primary: `#1a1a2e` (navy)
  - Accent: `#c97d3a` (amber)
  - Background: `#faf8f4` (cream)
- **Fonts:** Kanit (headings) + Sarabun (body)

---

## Data Flow

```
Source JSON (~/Documents/SlothMove/)
    ↓  (manual migration / script)
slothmove-platform/src/courses/<course>/
    ├── config.ts         ← Theme + subject list + game list
    ├── data-loader.ts    ← Quiz/Flashcard/Match/Cloze data per subject
    └── data/             ← Auto-generated quiz data files
    ↓  (Next.js build)
app/courses/[course]/     ← Dynamic routes consume registry
```

---

## Content Types

| Type | Shape | Example |
|------|-------|---------|
| `QuizItem` | `{ question, choices[], answer, explanation? }` | ข้อสอบ 4 ตัวเลือก |
| `FlashcardItem` | `{ front, back }` | โจทย์ → เฉลย+สูตร |
| `MatchPair` | `{ left, right }` | คู่คำศัพท์ |
| `ClozeItem` | `{ text, blanks[], options? }` | ประโยคเติมคำ |
| `SortingItem` | `{ question, items[], explain? }` | เรียงลำดับ |
| `OrderItem` | `{ question, steps[], explain? }` | เรียงขั้นตอน |
| `SpellingItem` | `{ word, definition, hint? }` | สะกดคำ |
| `TrueFalseItem` | `{ statement, answer, explain? }` | จริง/เท็จ |
| `AuthorityItem` | `{ left, right }` | หน่วยงาน↔อำนาจ |
| `LogicItem` | `{ question, options[], answer, explain? }` | ตรรกะ |

---

## Course Status

| Course | Migrated | Subjects | Games |
|--------|:---------:|---:|:----:|
| PAB (นักสิเคราะห์นโยบายและแผน) | ✅ Full | 20 | 6 เต็ม |
| OPSD (จัดระเบียบราชการ) | 🟡 Partial | 7 | 4 มีข้อมูล |
| Industry (อุตสาหกรรม) | 🟡 Partial | 9 | 5 มีข้อมูล |
| Police Admin (นายสิบตำรวจ) | 🚫 ไม่เริ่ม | — | — |

---

## Adding a New Course

1. สร้าง `src/courses/<id>/config.ts` — export `CourseConfig`
2. เพิ่มใน `src/courses/registry.ts` `COURSES` array
3. สร้าง `src/courses/<id>/data-loader.ts` (optional)
4. Routes จะรับอัตโนมัติ — ไม่ต้องแก้ route files

---

## Running

```bash
cd ~/Desktop/SlothMove/slothmove-platform
npm run dev      # http://localhost:3040
npm run build    # production build
npm run clean    # ล้าง .next cache
```

---

*Documented by Mavis — SlothMove AI Assistant*

# Police Admin to Next.js Game Migration Plan

## Goal

ย้ายคอร์ส `Police_admin` เข้า `slothmove-platform` เฉพาะส่วน **เกม** และ **data integration** โดย:

- ไม่แก้ไฟล์ HTML ต้นฉบับใน legacy
- ไม่ย้ายหน้า legacy ไป render ตรง ๆ ใน Next.js
- ใช้ legacy เป็น **read-only source of truth**
- ให้ผลลัพธ์สุดท้ายอยู่ในโครงสร้าง Next.js ของ `slothmove-platform`

เป้าหมายรอบนี้ไม่ใช่ pixel-perfect port ของหน้าเดิม แต่คือการทำให้เกมสำคัญใช้งานได้จริงในแพลตฟอร์มใหม่ ด้วยโครงสร้างที่ดูแลต่อได้

---

## Scope

### In scope

- เพิ่ม course `police_admin` ใน `slothmove-platform/src/courses/`
- map วิชา legacy เข้ากับ subject config ใหม่
- ดึง data จาก legacy JS/JSON source มาแปลงเป็น format ที่ Next.js ใช้
- เปิดใช้เกมที่ระบบใหม่รองรับแล้ว
- ระบุเกมที่ยังไม่พร้อมเป็น `skeleton` หรือ `no data`
- ทำให้ route ใช้งานได้ในรูปแบบ:
  - `/courses/police_admin`
  - `/courses/police_admin/<subject>`
  - `/courses/police_admin/<subject>/<game>`

### Out of scope

- ห้ามแก้ HTML legacy
- ห้าม cleanup โครงสร้างใน `~/Documents/SlothMove/Page/source/police_admin/`
- ห้าม redesign หน้า legacy
- ห้ามพยายาม port เกมเฉพาะทางทุกตัวในรอบแรก

---

## Source of truth

ใช้ source เดิมแบบ read-only:

- `~/Documents/SlothMove/Page/source/police_admin/course.manifest.js`
- `~/Documents/SlothMove/Page/source/police_admin/course.config.js`
- `~/Documents/SlothMove/Page/source/police_admin/<subject>/data/*`
- `~/Documents/SlothMove/Page/source/police_admin/<subject>/*.questions.js`
- `~/Documents/SlothMove/Page/source/police_admin/<subject>/*.json.js`

ห้ามแก้ไฟล์เหล่านี้โดยตรง

---

## Legacy subject mapping

กำหนด subject ชุดแรกตาม legacy:

1. `math` → คณิตศาสตร์
2. `thai` → ภาษาไทย
3. `computer` → คอมพิวเตอร์
4. `saraban` → ระเบียบงานสารบรรณ
5. `law` → กฎหมาย
6. `english` → ภาษาอังกฤษ

---

## Migration strategy

### Phase 1: Register course shell

สร้างโครงคอร์สใน Next.js:

- `src/courses/police_admin/config.ts`
- `src/courses/police_admin/data-loader.ts`
- `src/courses/police_admin/data/`
- เพิ่ม entry ใน `src/courses/registry.ts`

สิ่งที่ต้องมีใน `config.ts`:

- `meta.id = 'police_admin'`
- title / subtitle / theme
- 6 subjects ตาม legacy
- ระบุสถานะเกมต่อ subject แบบตรงตามความจริง

ผลลัพธ์ของ phase นี้:

- หน้า course เข้าได้
- subject list แสดงครบ
- เกมที่ยังไม่พร้อมต้องแสดง disabled/skeleton อย่างชัดเจน

---

### Phase 2: Prioritize game support

เปิดก่อนเฉพาะเกมที่เข้ากับ engine ปัจจุบันของ `slothmove-platform`

#### Priority A: migrate first

- `quiz`
- `flashcard`
- `match`
- `cloze`

เหตุผล:

- ระบบใหม่รองรับอยู่แล้ว
- ครอบคลุมแทบทุก subject ใน legacy
- ให้ user value สูงสุดเร็วที่สุด

#### Priority B: migrate if data shape is simple

- `authority`
- `true-false`
- `sorting`
- `order`
- `spelling`
- `logic`

#### Priority C: defer

- `dialogue`
- `error-detector`
- `number-match`
- `process-sort`
- `flashcard-review`
- `series`
- `analogy`
- `compare-values`
- `speed-percent`
- `word-problem`
- `computer-logic`
- `color-match`
- `matrix`
- `review`
- `survival`

เกมกลุ่มนี้ให้ mark เป็น `skeleton` หรือ `defer` ไปก่อน เว้นแต่มี reusable engine พร้อมอยู่แล้ว

---

## Recommended truth table per subject

### math

- `quiz`: target full
- `flashcard`: target full
- `match`: target full
- `cloze`: target full
- อื่น ๆ: skeleton

### thai

- `quiz`: target full
- `flashcard`: target full
- `match`: target full ถ้า data มี
- `spelling`: phase 2B
- `order`: phase 2B
- `sorting`: phase 2B

### computer

- `quiz`: target full
- `flashcard`: target full
- `match`: target full
- `cloze`: target full
- `computer-logic`: defer

### saraban

- `quiz`: target full
- `flashcard`: target full
- `match`: target full
- `cloze`: target full
- `authority`: phase 2B
- `true-false`: phase 2B
- `order`: phase 2B
- `sorting`: phase 2B
- อื่น ๆ: defer

### law

- `quiz`: target full
- `flashcard`: target full
- `match`: target full
- `cloze`: target full
- `authority`: phase 2B
- `true-false`: phase 2B

### english

- `quiz`: target full
- `flashcard`: target full
- `match`: target full
- `cloze`: target full
- `spelling`: phase 2B
- `true-false`: phase 2B
- `dialogue`: defer
- `error-detector`: defer

---

## Data migration approach

### Rule

ห้ามให้ page route ของ Next.js ไป parse HTML โดยตรง

ให้ parse จาก data source เท่านั้น

### Recommended approach

สร้าง script หรือ adapter เพื่ออ่านไฟล์ legacy data แล้ว output เป็น TS module ที่ `slothmove-platform` ใช้ได้

ตัวอย่าง target output:

- `src/courses/police_admin/data/math.ts`
- `src/courses/police_admin/data/thai.ts`
- `src/courses/police_admin/data/computer.ts`
- `src/courses/police_admin/data/saraban.ts`
- `src/courses/police_admin/data/law.ts`
- `src/courses/police_admin/data/english.ts`

### Adapter responsibilities

- normalize question objects
- normalize answer index
- strip malformed legacy wrappers
- map old game structures to shared `Quiz`, `Flashcard`, `Match`, `Cloze` data types
- return empty or `null` explicitly when a game has no trustworthy data

---

## Expected implementation pattern

### 1. Config

`config.ts` ต้องประกาศ:

- course meta
- subject names / emoji / descriptions
- game list ต่อ subject
- truthful `status`

### 2. Data loader

`data-loader.ts` ต้อง:

- import generated subject data
- expose helper per game
- return:
  - real data เมื่อมี
  - `no data` เมื่อไม่มี
  - `skeleton` เมื่อ engine ยังไม่รองรับหรือยังไม่ migrate

### 3. Registry

เพิ่ม `police_admin` เข้า `registry.ts` อย่างเดียว ห้าม hardcode route อื่นเพิ่ม

---

## Suggested file plan in slothmove-platform

```text
src/courses/police_admin/
  config.ts
  data-loader.ts
  data/
    index.ts
    math.ts
    thai.ts
    computer.ts
    saraban.ts
    law.ts
    english.ts
```

ถ้าต้องใช้ tooling เพิ่ม:

```text
tools/
  migrate-police-admin-data.mjs
```

หรือ

```text
scripts/
  migrate-police-admin-data.ts
```

โดย script มีหน้าที่ generate data modules เท่านั้น ไม่แตะ legacy source

---

## Acceptance criteria

ถือว่างานรอบแรกสำเร็จเมื่อ:

1. `/courses/police_admin` เปิดได้
2. มี 6 subject ครบ
3. ทุก subject เปิดเข้า page ได้
4. เกม `quiz`, `flashcard`, `match`, `cloze` ใช้งานได้ใน subject ที่มี data จริง
5. เกมที่ยังไม่พร้อมไม่ 404 และไม่หลอกว่าใช้ได้
6. homepage / platform listing สามารถเปลี่ยน `Police Admin` จาก coming-soon เป็น status ที่ตรงกับของจริง
7. ไม่มีการแก้ไขไฟล์ HTML legacy

---

## Risks

### 1. Legacy data shape inconsistent

บางวิชาอาจมี format คนละแบบ แม้ชื่อเกมเหมือนกัน

แนวทาง:

- parse per subject
- อย่าพยายามทำ universal parser ตั้งแต่รอบแรกถ้ายังไม่ชัด

### 2. Some legacy games are page-driven, not data-driven

บางเกมพึ่ง logic ใน HTML/inline JS มากกว่า data

แนวทาง:

- defer เป็น skeleton
- อย่าฝืน port ใน phase แรก

### 3. Duplicated or low-quality legacy data

บางวิชาอาจมีคำถามซ้ำหรือ data เพี้ยน

แนวทาง:

- migrate as-is ก่อนถ้าไม่พัง engine
- ทำ quality pass แยกรอบหลัง

---

## Suggested work order for agent

1. อ่าน `course.manifest.js` และ `course.config.js`
2. สรุป matrix ว่าแต่ละ subject มีเกมอะไร และ data อยู่ไฟล์ไหน
3. สร้าง `config.ts` + `registry.ts` entry
4. สร้าง `data-loader.ts` แบบยังไม่เปิดทุกเกม
5. migrate `quiz` ครบ 6 subject ก่อน
6. migrate `flashcard`, `match`, `cloze`
7. mark เกมที่เหลือเป็น `skeleton`
8. ทดสอบ route และ game pages
9. ค่อยพิจารณา phase 2B

---

## Non-negotiables

- ห้ามแก้ legacy HTML
- ห้ามใช้ iframe ของหน้าเก่าแทน migration
- ห้ามแสดงเกมว่า `full` ถ้ายังใช้ sample/fallback
- ห้ามซ่อน subject หรือ game เพียงเพื่อให้ดูเหมือน migrate เสร็จ
- สถานะใน config ต้องตรงกับของจริงเสมอ

---

## Deliverable expected from agent

เมื่อ agent ทำเสร็จ ควรส่งกลับมาเป็น:

1. รายชื่อไฟล์ที่เพิ่ม/แก้
2. subject-game matrix หลัง migrate
3. เกมที่ `full`
4. เกมที่ `skeleton`
5. เกมที่ `no data`
6. ความเสี่ยงที่เหลือ
7. วิธีทดสอบ route ที่สำคัญ

---

## Short handoff prompt suggestion

ให้ agent ทำงานตามนี้:

> Migrate `Police_admin` into `slothmove-platform` for game/data support only. Do not modify any legacy HTML. Treat legacy files as read-only source data. Register the course in Next.js, migrate real data for `quiz`, `flashcard`, `match`, and `cloze` where available, and mark unsupported games truthfully as `skeleton` or `no data`. Keep status aligned with reality and avoid 404s.


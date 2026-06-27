# SlothMove Current Migration Status

วันที่อ้างอิง: 2026-06-19

## สรุปสั้น

ตอนนี้งานย้ายระบบไป Next.js ไม่ได้อยู่ในโปรเจคเดียว แต่แยกเป็น 2 แอป:

- `homepage-nextjs`
  - ใช้สำหรับหน้าเว็บหลักแบบ landing page
- `slothmove-platform`
  - ใช้สำหรับระบบคอร์ส, วิชา, เนื้อหา, และเกม

จุดที่ทำให้สับสนง่าย:

- หน้า `http://127.0.0.1:3040/` เป็นหน้า home ของ `slothmove-platform`
- หน้านี้ยังไม่ใช่หน้า index หลักต้นฉบับจาก `Documents/SlothMove/index.html`
- ถ้าจะเทียบกับหน้า index เดิมจริง ๆ ต้องดูฝั่ง `homepage-nextjs` มากกว่า

## โครงสร้างปัจจุบัน

### 1. หน้าเว็บหลัก

ต้นฉบับ:

- `/Users/geefrost/Documents/SlothMove/index.html`

Next.js ที่รับบทนี้:

- `/Users/geefrost/Desktop/SlothMove/homepage-nextjs`

สถานะ:

- มีโครงหน้าแรกแล้ว
- มี component สำคัญแล้ว เช่น navbar, hero, course grid, articles, why, FAQ, donate, footer
- ใช้เป็นหน้า landing หลักได้ในเชิงโครงสร้าง
- แต่ยังไม่ได้ตรวจเก็บ visual ให้เหมือนต้นฉบับแบบละเอียดรอบล่าสุด

ไฟล์หลัก:

- [/Users/geefrost/Desktop/SlothMove/homepage-nextjs/app/page.tsx](/Users/geefrost/Desktop/SlothMove/homepage-nextjs/app/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/homepage-nextjs/lib/courses.ts](/Users/geefrost/Desktop/SlothMove/homepage-nextjs/lib/courses.ts)

### 2. ระบบคอร์ส / วิชา / เกม

โปรเจค:

- `/Users/geefrost/Desktop/SlothMove/slothmove-platform`

route หลักที่มีแล้ว:

- `/`
- `/courses/[course]`
- `/courses/[course]/[subject]`
- `/courses/[course]/[subject]/[game]`

ไฟล์หลัก:

- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/[game]/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/[game]/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/registry.ts](/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/registry.ts)

สถานะ:

- ระบบ dynamic routes ใช้งานได้
- มี registry กลางสำหรับคอร์ส
- มี game components ครบในเชิงโครง
- แต่ข้อมูลจริงของแต่ละคอร์สยัง migrate ไม่ครบ

## สิ่งที่ทำไปแล้ว

### A. Shared course structure ใน `slothmove-platform`

ทำแล้ว:

- มี shared registry ของคอร์ส
- มี shared course config pattern
- มี shared component สำหรับ course landing
- มี shared component สำหรับ knowledge content
- มี shared game page routing

ผล:

- คอร์สใหม่สามารถเดินตามโครงเดียวกันได้
- แนวทาง maintenance ดีกว่าเดิม
- ลดการผูกกับไฟล์เฉพาะคอร์สแบบ hardcoded

ไฟล์สำคัญ:

- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/lib/course-types.ts](/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/lib/course-types.ts)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/lib/knowledge-types.ts](/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/lib/knowledge-types.ts)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseLanding.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseLanding.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseKnowledgeContent.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseKnowledgeContent.tsx)

### B. PAB migrate ไปไกลสุด

สถานะปัจจุบัน:

- เป็นคอร์สที่สมบูรณ์ที่สุดในระบบ
- landing page ใช้ shared structure แล้ว
- หน้าเนื้อหาวิชาใช้ shared knowledge structure แล้ว
- หน้า subject เปิดเนื้อหาได้เกือบครบ

สิ่งที่แก้เพิ่มล่าสุด:

- เปลี่ยนตัวโหลดเนื้อหา PAB ให้รองรับไฟล์ต้นฉบับแบบ JavaScript object ไม่ใช่ JSON อย่างเดียว
- ทำให้ parse ไฟล์ที่มี comment, unquoted keys, string concatenation ได้
- แก้ logic หน้า subject ให้แสดง “เนื้อหา” ได้ แม้ subject นั้นยังไม่มี game data ครบ

ไฟล์สำคัญ:

- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/pab/config.ts](/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/pab/config.ts)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/pab/knowledge-loader.ts](/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/pab/knowledge-loader.ts)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/courses/[course]/[subject]/page.tsx)
- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseKnowledgeContent.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/components/course/CourseKnowledgeContent.tsx)

### C. Homepage กับ platform ถูก sync ด้านสถานะคอร์สไว้บางส่วนแล้ว

ทำแล้ว:

- `homepage-nextjs` แสดงสถานะคอร์ส `ready / partial / coming-soon`
- ค่าจำนวนวิชา/ข้อสอบถูก sync กับฝั่ง platform ตาม handoff ก่อนหน้า

## สถานะคอร์สปัจจุบัน

### PAB

สถานะ:

- ใช้งานได้ดีที่สุด
- knowledge content แสดงได้ 19/20 วิชา
- เหลือ `computer` ที่ยังไม่มีไฟล์ต้นฉบับจริง
- `national_plan` แสดงเนื้อหาได้แล้ว

เกม:

- `quiz / flashcard / match / cloze`
  - ใช้ได้เกือบครบ
- `authority`
  - มี curated data บางวิชา
- `logic`
  - มี curated data บางวิชา
- `sorting / order / spelling / truefalse`
  - ยังเป็น sample / skeleton เป็นหลัก

สรุป:

- PAB คือคอร์สที่พร้อมใช้ที่สุด
- แต่ยังไม่ถือว่า migrate สมบูรณ์ 100%

### OPSD

สถานะ:

- partial
- migrate แล้ว 4/7 วิชา
- ยังมีหลายวิชาที่ขึ้น placeholder เพราะไม่มีข้อมูลจริง

สรุป:

- route และโครงพร้อม
- data migration ยังไม่ครบ

### Industry

สถานะ:

- partial
- migrate แล้ว 5/9 วิชา
- ยังมีหลายวิชาที่ข้อมูลไม่ครบ

สรุป:

- route และโครงพร้อม
- data migration ยังไม่ครบ

## สิ่งที่ยังไม่เสร็จ

### 1. หน้าแรกยังไม่ถูกรวมเป็นประสบการณ์เดียว

ตอนนี้ยังแยกเป็น:

- `homepage-nextjs` = หน้าเว็บหลัก
- `slothmove-platform` = ระบบเรียน

ผลกระทบ:

- ทำให้รู้สึกเหมือนมี 2 เว็บ
- หน้า `3040` ไม่ใช่หน้า index หลักต้นฉบับ
- ผู้ดูโปรเจคใหม่จะงงได้ง่าย

### 2. Home ของ `slothmove-platform` ยังเป็นหน้าแบบย่อ

ไฟล์:

- [/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/page.tsx](/Users/geefrost/Desktop/SlothMove/slothmove-platform/app/page.tsx)

สถานะ:

- ยังเป็นหน้า list คอร์สแบบง่าย
- ไม่เหมือน `Documents/SlothMove/index.html`
- ยังไม่ใช่หน้า landing หลักในเชิง visual

### 3. Visual system ยังไม่ unify ทั้งหมด

สถานะ:

- PAB เริ่มมี visual language ของตัวเองแล้ว
- แต่ทั้งระบบยังไม่ได้เก็บให้รู้สึกเป็น “เว็บเดียวกัน” เต็ม ๆ
- หน้า home, course landing, subject page, game page ยังต้องเก็บความต่อเนื่องของ design อีก

### 4. Data migration ยังไม่ครบทุกคอร์ส

จุดที่ยังเหลือ:

- PAB ยังขาด `computer`
- OPSD ยังขาดหลายวิชา
- Industry ยังขาดหลายวิชา
- game data บางชนิดยังเป็น sample

### 5. เกมบางโหมดยังไม่ใช่ข้อมูลจริง

โดยรวมยังต้องเก็บต่อ:

- `sorting`
- `order`
- `spelling`
- `truefalse`
- `authority` ของบางคอร์ส
- `logic` ของบางคอร์ส

## งานที่ควรทำต่อ

### ลำดับแนะนำ

1. ตัดสินใจให้ชัดว่าจะใช้ `homepage-nextjs` เป็นหน้าแรกหลักต่อ หรือจะรวมเข้ากับ `slothmove-platform`
2. ถ้าเป้าหมายคือ “เว็บเดียวกัน” ให้กำหนดโครงปลายทางก่อน
3. เก็บ visual ของหน้า home ให้ใกล้ `index.html` ต้นฉบับ
4. ทำ design system กลางให้ใช้ร่วมกันระหว่าง home, course, subject, game
5. ปิด migration ของ PAB ให้สุดก่อน
6. จากนั้นค่อยไล่ OPSD และ Industry
7. ค่อยปิดงาน sample game modes ทีหลัง

### งานถัดไปที่ทำได้ทันที

#### Option A: เก็บหน้าแรกก่อน

เป้าหมาย:

- ทำให้หน้าแรก Next.js ใกล้ `index.html` ต้นฉบับมากขึ้น
- ลดความสับสนว่าเว็บหลักอยู่ที่ไหน

เหมาะเมื่อ:

- อยากให้ภาพรวมเว็บดูเป็นแบรนด์เดียวกันก่อน

#### Option B: ปิด PAB ให้แน่นก่อน

เป้าหมาย:

- ทำ visual หน้า PAB ให้ใกล้ต้นฉบับมากขึ้น
- ตรวจ subject page ทีละวิชา
- ปิด issue ที่ยังเหลือของ PAB ให้เรียบร้อย

เหมาะเมื่อ:

- อยากให้มี 1 คอร์สที่สมบูรณ์จริงก่อนค่อยขยาย

#### Option C: ลุย data migration ต่อ

เป้าหมาย:

- ย้าย OPSD / Industry ให้ครบขึ้น
- ลด placeholder

เหมาะเมื่อ:

- ความสำคัญหลักคือ coverage ของเนื้อหา

## สรุปเชิงตัดสินใจ

ถ้ามองตามสภาพตอนนี้:

- โครง Next.js สำหรับ “ระบบคอร์ส” ไปต่อได้แล้ว
- PAB คือฐานที่ดีที่สุด
- แต่ภาพรวมทั้งแบรนด์ยังไม่ถูกรวมเป็นเว็บเดียวอย่างชัดเจน

ดังนั้นคำตอบที่ตรงที่สุดคือ:

- migration “เริ่มเป็นระบบแล้ว”
- แต่ยัง “ไม่จบ”
- และตอนนี้งานที่สำคัญที่สุดไม่ใช่แค่เพิ่ม data อย่างเดียว
- ต้องตัดสินใจเรื่องโครงหน้าแรกและความเป็นเว็บเดียวกันด้วย

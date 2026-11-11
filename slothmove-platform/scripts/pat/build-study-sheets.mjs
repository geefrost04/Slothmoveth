#!/usr/bin/env node
// Builds content/study-sheets/pat-<topic>-summary.json from components/study-sheets/patLessonData.ts,
// so the notes reader's chapter list matches the lessons. Run from slothmove-platform/.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jiti = require('jiti')(import.meta.url, { alias: { '@': path.resolve('.') }, interopDefault: true });
const { PAT_LESSONS_RAW: NESDC_LESSONS_RAW } = jiti('../../components/study-sheets/patLessonData.ts');
const TOPICS = JSON.parse(fs.readFileSync('components/study-sheets/patTopics.json', 'utf8'));
const ANNOUNCEMENT = 'ประกาศการท่าเรือแห่งประเทศไทย เรื่อง รับสมัครบุคคลทั่วไปเพื่อสอบคัดเลือกเข้าเป็นพนักงานการท่าเรือแห่งประเทศไทย ในตำแหน่งนักวิชาการ 6 สังกัดกองแผนวิสาหกิจ ฝ่ายกลยุทธ์องค์กร ลงวันที่ 25 กันยายน 2569';

for (const [topic, meta] of Object.entries(TOPICS)) {
  const lessons = NESDC_LESSONS_RAW[topic];
  const id = `pat-${topic}-summary`;
  const sheet = {
    id, slug: id, course_id: 'pat', subject_id: topic, title: meta.sheetTitle,
    description: `${meta.sheetTitle} สำหรับสอบ กทท. ตำแหน่งนักวิชาการ 6 กองแผนวิสาหกิจ: ${meta.intro}`,
    brand: 'SlothMoveTH', content_format: 'lesson', version: 1, status: 'published',
    section_count: lessons.length, chapter_count: lessons.filter((l) => l.sectionType === 'chapter').length,
    intro_md: ['# วิธีใช้โน้ตนี้', '', `* เนื้อหาสำหรับสอบ กทท. นักวิชาการ 6 (ประกาศรับสมัคร 25 ก.ย. 2569): ${meta.intro}`, '* อ่านกล่อง **"จำให้ได้ก่อน"** ก่อนทุกบท แล้วลองตอบ **แบบฝึกท้ายบท**'].join('\n'),
    references_md: `## แหล่งอ้างอิง\n\n- ${ANNOUNCEMENT}`,
    recommended_renderer: 'lesson', metadata: {}, updated_at: new Date().toISOString()
  };
  const sections = lessons.map((l, i) => ({
    id: `${id}-${l.slug}`, sheet_id: id, section_type: l.sectionType, chapter_no: i + 1, slug: l.slug, title: l.title,
    sort_order: i + 1, visual_placeholders: [], content_md: `# ${l.title}\n\n${l.summary}`
  }));
  fs.writeFileSync(`content/study-sheets/${id}.json`, JSON.stringify({ sheet, sections, assets: [] }, null, 2) + '\n');
  console.log(`${topic}: ${sections.length} sections`);
}

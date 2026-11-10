#!/usr/bin/env node
// Builds content/study-sheets/police-{thai,english}-summary.json from the lesson files, so the notes reader
// lists the same chapters as components/study-sheets/policeExtraLessons.ts. Run from slothmove-platform/.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jiti = require('jiti')(import.meta.url, { alias: { '@': path.resolve('.') }, interopDefault: true });
const SHEETS = {
  thai: { file: 'policeThaiLessons.ts', title: 'โน้ตสรุป: ภาษาไทย', intro: 'สะกดคำ การใช้คำ ประโยค ราชาศัพท์ สำนวน และการอ่านจับใจความ' },
  english: { file: 'policeEnglishLessons.ts', title: 'โน้ตสรุป: ภาษาอังกฤษ', intro: 'ไวยากรณ์ คำศัพท์งานตำรวจ ป้ายประกาศ บทสนทนา และการอ่าน' }
};
for (const [subject, meta] of Object.entries(SHEETS)) {
  const { LESSONS } = jiti(`../../components/study-sheets/${meta.file}`);
  const id = `police-${subject}-summary`;
  const sheet = {
    id, slug: id, course_id: 'police_admin', subject_id: subject, title: meta.title,
    description: `${meta.title} สำหรับสอบนายสิบตำรวจ สายอำนวยการ: ${meta.intro}`,
    brand: 'SlothMoveTH', content_format: 'lesson', version: 1, status: 'published',
    section_count: LESSONS.length, chapter_count: LESSONS.filter((l) => l.sectionType === 'chapter').length,
    intro_md: ['# วิธีใช้โน้ตนี้', '', `* ${meta.intro}`, '* อ่านกล่อง **"จำให้ได้ก่อน"** ก่อนทุกบท แล้วลองตอบ **แบบฝึกท้ายบท**'].join('\n'),
    references_md: '', recommended_renderer: 'lesson', metadata: {}, updated_at: new Date().toISOString()
  };
  const sections = LESSONS.map((l, i) => ({ id: `${id}-${l.slug}`, sheet_id: id, section_type: l.sectionType, chapter_no: i + 1, slug: l.slug, title: l.title, sort_order: i + 1, visual_placeholders: [], content_md: `# ${l.title}\n\n${l.summary}` }));
  fs.writeFileSync(`content/study-sheets/${id}.json`, JSON.stringify({ sheet, sections, assets: [] }, null, 2) + '\n');
  console.log(`${subject}: ${sections.length} sections`);
}

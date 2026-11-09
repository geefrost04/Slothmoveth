#!/usr/bin/env node
// Builds content/study-sheets/onwr-<topic>-summary.json for the 9 announcement topics (+ review sheet),
// following components/study-sheets/onwrTopics.json so the reader's chapter list matches onwrLessonData.ts.
import fs from 'node:fs';

const TOPICS = JSON.parse(fs.readFileSync('components/study-sheets/onwrTopics.json', 'utf8'));
const FILES = {
  general: ['onwrGeneralLessons.ts'],
  water: ['onwrWaterLessons.ts'],
  planning: ['onwrPlanningLessons.ts'],
  // One extra chapter per thin topic, one file each.
  extra: fs.readdirSync('components/study-sheets/onwrExtra').filter((f) => f.endsWith('.ts')).map((f) => `onwrExtra/${f}`)
};
const REVIEW_TITLES = { general: 'ทบทวนความรู้ทั่วไป', water: 'ทบทวน พ.ร.บ.น้ำและแผนแม่บทน้ำ', planning: 'ทบทวนนโยบาย แผน และการประเมินผล' };

// slug → { title, type, summary } per source file
const SOURCES = Object.fromEntries(Object.entries(FILES).map(([source, files]) => {
  const src = files.map((file) => fs.readFileSync(`components/study-sheets/${file}`, 'utf8')).join('\n');
  const lessons = [...src.matchAll(/slug: '([^']+)',\s*chapterNo: (\d+),\s*sectionType: '([^']+)',\s*title: '([^']+)'/g)];
  const summaries = [...src.matchAll(/summary: '([^']+)'/g)].map((m) => m[1]);
  return [source, Object.fromEntries(lessons.map((m, i) => [m[1], { title: m[4], type: m[3], summary: summaries[i] ?? '' }]))];
}));

// Remove sheets of the old 3-subject layout.
for (const old of ['general', 'water', 'planning']) {
  const file = `content/study-sheets/onwr-${old}-summary.json`;
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

for (const [topic, meta] of Object.entries(TOPICS)) {
  let chapter = 0;
  const lessons = meta.lessons.map(([source, slug]) => {
    const lesson = SOURCES[source][slug];
    if (!lesson) throw new Error(`missing ${source}/${slug}`);
    if (lesson.type === 'quick_review') return { ...lesson, slug: `review-${source}`, title: REVIEW_TITLES[source] };
    chapter += 1;
    return { ...lesson, slug: `lesson-${String(chapter).padStart(2, '0')}` };
  });
  const id = `onwr-${topic}-summary`;
  const sheet = {
    id, slug: id, course_id: 'onwr', subject_id: topic, title: meta.sheetTitle,
    description: `${meta.sheetTitle} สำหรับสอบพนักงานราชการ สทนช. ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน: ${meta.intro}`,
    brand: 'SlothMoveTH', content_format: 'lesson', version: 1, status: 'published',
    section_count: lessons.length, chapter_count: lessons.filter((l) => l.type === 'chapter').length,
    intro_md: ['# วิธีใช้โน้ตนี้', '', `* หัวข้อสอบตามประกาศรับสมัคร สทนช. ลงวันที่ 22 ต.ค. 2569: ${meta.intro}`, '* อ่านกล่อง **"จำให้ได้ก่อน"** ก่อนทุกบท แล้วลองตอบ **แบบฝึกท้ายบท**'].join('\n'),
    references_md: '## แหล่งอ้างอิง\n\n- ประกาศสำนักงานทรัพยากรน้ำแห่งชาติ เรื่อง รับสมัครบุคคลเพื่อเลือกสรรเป็นพนักงานราชการทั่วไป ลงวันที่ 22 ตุลาคม 2569',
    recommended_renderer: 'lesson', metadata: {}, updated_at: new Date().toISOString()
  };
  const sections = lessons.map((l, i) => ({ id: `${id}-${l.slug}`, sheet_id: id, section_type: l.type, chapter_no: i + 1, slug: l.slug, title: l.title, sort_order: i + 1, visual_placeholders: [], content_md: `# ${l.title}\n\n${l.summary}` }));
  fs.writeFileSync(`content/study-sheets/${id}.json`, JSON.stringify({ sheet, sections, assets: [] }, null, 2) + '\n');
  console.log(`${topic}: ${sections.length} sections`);
}

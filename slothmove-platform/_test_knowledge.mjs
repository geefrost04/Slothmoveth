import { getCourseKnowledgeData } from './src/courses/content-registry.ts';
const k = getCourseKnowledgeData('police_admin', 'math');
console.log("Knowledge for math:", k ? `${k.knowledgeSections?.length} sections, title=${k.title?.slice(0, 40)}` : 'null');
for (const subj of ['thai', 'computer', 'saraban', 'law', 'english']) {
  const k2 = getCourseKnowledgeData('police_admin', subj);
  console.log(`${subj}: ${k2 ? `${k2.knowledgeSections?.length} sections, title=${k2.title?.slice(0, 40)}` : 'null'}`);
}

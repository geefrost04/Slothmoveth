import { getCourseKnowledgeData } from './src/courses/content-registry.ts';
try {
  const k = getCourseKnowledgeData('railway', 'railway_act');
  console.log("Knowledge for railway_act:", k ? `${k.knowledgeSections?.length} sections, title=${k.title}` : 'null');
  const k2 = getCourseKnowledgeData('railway', 'rail_transport_act');
  console.log("Knowledge for rail_transport_act:", k2 ? `${k2.knowledgeSections?.length} sections, title=${k2.title}` : 'null');
  const k3 = getCourseKnowledgeData('railway', 'national_plans');
  console.log("Knowledge for national_plans:", k3 ? `${k3.knowledgeSections?.length} sections, title=${k3.title}` : 'null');
  const k4 = getCourseKnowledgeData('railway', 'srt_vision_strategy');
  console.log("Knowledge for srt_vision_strategy:", k4 ? `${k4.knowledgeSections?.length} sections, title=${k4.title}` : 'null');
} catch (err) {
  console.error("Error loading railway knowledge:", err);
}

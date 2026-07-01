import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';

const LOCAL_OVERRIDE_ROOT = join(process.cwd(), 'src/courses/railway/knowledge-local');

/**
 * Map subject id → (relative source path, window var name)
 */
const SUBJECT_FILES: Record<string, { file: string; varName: string }> = {
  railway_act: { file: 'railway_act/railway_act.json.js', varName: 'RAILWAY_ACT_DATA' },
  rail_transport_act: { file: 'rail_transport_act/rail_transport_act.json.js', varName: 'RAIL_TRANSPORT_ACT_DATA' },
  national_plans: { file: 'national_plans/national_plans.json.js', varName: 'NATIONAL_PLANS_DATA' },
  srt_vision_strategy: { file: 'srt_vision_strategy/srt_vision_strategy.json.js', varName: 'SRT_VISION_STRATEGY_DATA' },
  policy_analysis: { file: 'policy_analysis/policy_analysis.json.js', varName: 'POLICY_ANALYSIS_DATA' },
  state_enterprise_eval: { file: 'state_enterprise_eval/state_enterprise_eval.json.js', varName: 'STATE_ENTERPRISE_EVAL_DATA' },
  sipoc_process: { file: 'sipoc_process/sipoc_process.json.js', varName: 'SIPOC_PROCESS_DATA' },
  railway_general_knowledge: { file: 'railway_general_knowledge/railway_general_knowledge.json.js', varName: 'RAILWAY_GENERAL_KNOWLEDGE_DATA' },
  labor_relations_act: { file: 'labor_relations_act/labor_relations_act.json.js', varName: 'LABOR_RELATIONS_ACT_DATA' }
};

function parseKnowledgeFile(fileText: string, expectedVar: string): CourseKnowledgeData | null {
  try {
    const sandbox: { window: Record<string, unknown> } = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fileText, sandbox, { timeout: 1000 });

    const data = sandbox.window[expectedVar];
    if (!data || typeof data !== 'object') return null;

    return data as CourseKnowledgeData;
  } catch (err) {
    console.warn(`  [railway/knowledge] parse error: ${(err as Error).message}`);
    return null;
  }
}

export function getRailwayKnowledgeData(subjectId: string): CourseKnowledgeData | null {
  const cfg = SUBJECT_FILES[subjectId];
  if (!cfg) return null;

  const filePath = join(LOCAL_OVERRIDE_ROOT, cfg.file);
  try {
    const fileText = readFileSync(filePath, 'utf8');
    const parsed = parseKnowledgeFile(fileText, cfg.varName);
    if (parsed) return parsed;
  } catch (err) {
    console.warn(`  [railway/knowledge] read/parse error for ${subjectId}: ${(err as Error).message}`);
  }
  return null;
}

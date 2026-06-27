import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import { getPoliceAdminKnowledgeData } from '../police_admin/knowledge-loader';

const LOCAL_OVERRIDE_ROOT = join(process.cwd(), 'src/courses/ocsc/knowledge-local');

/**
 * Map subject id → (relative source path, window var name)
 */
const SUBJECT_FILES: Record<string, { file: string; varName: string }> = {
  analytical_thinking: { file: 'analytical_thinking/analytical_thinking.json.js', varName: 'ANALYTICAL_THINKING_DATA' },
  civil_servant_rules: { file: 'civil_servant_rules/civil_servant_rules.json.js', varName: 'CIVIL_SERVANT_RULES_DATA' }
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
    console.warn(`  [ocsc/knowledge] parse error: ${(err as Error).message}`);
    return null;
  }
}

export function getOcscKnowledgeData(subjectId: string): CourseKnowledgeData | null {
  if (subjectId === 'english') {
    const source = getPoliceAdminKnowledgeData('english');
    if (!source) return null;
    const adapted = adaptPoliceEnglishKnowledgeForOcsc(source);

    return {
      ...adapted,
      title: 'ภาษาอังกฤษสำหรับสอบ ก.พ. ภาค ก.',
      subtitle: 'Reading · Vocabulary · Grammar · Conversation ระดับ A2-B1 เน้นภาษาใช้จริงในงานราชการและบริการประชาชน',
      badgeLabel: 'OCSC English · อ่านด่วนก่อนสอบ'
    };
  }

  const cfg = SUBJECT_FILES[subjectId];
  if (!cfg) return null;

  const filePath = join(LOCAL_OVERRIDE_ROOT, cfg.file);
  try {
    const fileText = readFileSync(filePath, 'utf8');
    const parsed = parseKnowledgeFile(fileText, cfg.varName);
    if (parsed) return parsed;
  } catch (err) {
    console.warn(`  [ocsc/knowledge] read/parse error for ${subjectId}: ${(err as Error).message}`);
  }
  return null;
}

function adaptPoliceEnglishKnowledgeForOcsc<T>(value: T): T {
  if (typeof value === 'string') {
    return value
      .replace(/ภาษาอังกฤษตำรวจสายอำนวยการ/g, 'ภาษาอังกฤษ ก.พ. ภาค ก.')
      .replace(/ข้อสอบภาษาอังกฤษตำรวจ/g, 'ข้อสอบภาษาอังกฤษ ก.พ.')
      .replace(/ตำรวจสายอำนวยการ/g, 'ก.พ. ภาค ก.')
      .replace(/สนามตำรวจ/g, 'สนาม ก.พ.')
      .replace(/งานตำรวจ/g, 'งานราชการ')
      .replace(/สถานีตำรวจ/g, 'หน่วยงานราชการ')
      .replace(/ภาค ก\.(?=\S)/g, 'ภาค ก. ') as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => adaptPoliceEnglishKnowledgeForOcsc(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = adaptPoliceEnglishKnowledgeForOcsc(nested);
    }
    return result as T;
  }

  return value;
}

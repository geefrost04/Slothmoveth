/**
 * Police Admin Knowledge Loader — reads knowledge content from
 *   ~/Documents/SlothMove/Page/source/police_admin/<subject>/<subject>.json.js
 *
 * Each source file declares `window.<KEY>_DATA = { knowledgeSections: [...] }`
 * with structured blocks (highlight-box, table, cards, premium-timeline,
 * premium-flowchart) that match the CourseKnowledgeData type.
 *
 * Strategy: parse the .json.js file via node:vm to extract the global
 * var, then return the value directly. The block types already match
 * the renderer in components/course/CourseKnowledgeContent.tsx, so no
 * shape transformation is required.
 *
 * To add a new subject: just create a `<subject>.json.js` in source.
 * The loader reads it automatically via SUBJECT_FILES below.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';

const POLICE_ADMIN_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/police_admin';
const LOCAL_OVERRIDE_ROOT = join(process.cwd(), 'src/courses/police_admin/knowledge-local');

/**
 * Map subject id → (relative source path, window var name).
 * The 6 subjects all have a `<subject>.json.js` at the subject root
 * except `english` which has it at `english/english.json.js` (root
 * file, not in the data/ subfolder).
 */
const SUBJECT_FILES: Record<string, { file: string; varName: string }> = {
  math:     { file: 'math/math.json.js',     varName: 'MATH_DATA' },
  thai:     { file: 'thai/thai.json.js',     varName: 'THAI_DATA' },
  computer: { file: 'computer/computer.json.js', varName: 'COMPUTER_DATA' },
  saraban:  { file: 'saraban/saraban.json.js', varName: 'SARABAN_DATA' },
  law:      { file: 'law/law.json.js',       varName: 'LAW_DATA' },
  english:  { file: 'english/english.json.js', varName: 'ENGLISH_DATA' }
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
    console.warn(`  [police_admin/knowledge] parse error: ${(err as Error).message}`);
    return null;
  }
}

export function getPoliceAdminKnowledgeData(subjectId: string): CourseKnowledgeData | null {
  const cfg = SUBJECT_FILES[subjectId];
  if (!cfg) return null;

  const candidatePaths = [
    join(LOCAL_OVERRIDE_ROOT, cfg.file),
    `${POLICE_ADMIN_ROOT}/${cfg.file}`
  ];

  for (const filePath of candidatePaths) {
    try {
      const fileText = readFileSync(filePath, 'utf8');
      const parsed = parseKnowledgeFile(fileText, cfg.varName);
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

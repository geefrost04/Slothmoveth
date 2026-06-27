import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import { PAB_KNOWLEDGE_OVERRIDES } from './knowledge-overrides';

const PAB_CONTENT_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/PAB/content';

export type PabKnowledgeData = CourseKnowledgeData;

function parseKnowledgeFile(fileText: string): CourseKnowledgeData | null {
  try {
    const context = { window: {} as Record<string, unknown> };
    vm.runInNewContext(fileText, context, { timeout: 1000 });

    const dataKey = Object.keys(context.window).find((key) => key.endsWith('_DATA'));
    if (!dataKey) return null;

    const data = context.window[dataKey];
    if (!data || typeof data !== 'object') return null;

    return data as CourseKnowledgeData;
  } catch {
    return null;
  }
}

export function getPabKnowledgeData(subjectId: string): CourseKnowledgeData | null {
  const override = PAB_KNOWLEDGE_OVERRIDES[subjectId];
  if (override) return override;

  try {
    const fileText = readFileSync(`${PAB_CONTENT_ROOT}/${subjectId}.json.js`, 'utf8');
    return parseKnowledgeFile(fileText);
  } catch {
    return null;
  }
}

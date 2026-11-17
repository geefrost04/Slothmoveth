'use client';

import type { Ref } from '@/lib/learn/types';
import { useCourse } from './CourseContext';

/** Merges refs by document and lists them with their pages. */
export function mergeRefs(refs: Ref[]): { doc: string; pages: string[] }[] {
  const byDoc = new Map<string, Set<string>>();
  for (const ref of refs) {
    const set = byDoc.get(ref.doc) ?? new Set<string>();
    if (ref.page !== undefined && ref.page !== '') set.add(String(ref.page));
    byDoc.set(ref.doc, set);
  }
  const num = (s: string) => parseInt(s, 10) || 0;
  return [...byDoc].map(([doc, pages]) => ({ doc, pages: [...pages].sort((a, b) => num(a) - num(b)) }));
}

export function Sources({ refs, note }: { refs: Ref[]; note?: string }) {
  const SOURCES = useCourse().sources;
  const list = mergeRefs(refs);
  if (!list.length) return null;
  return (
    <footer className="nl-sources">
      <b>ที่มา (เลขหน้าตามไฟล์ PDF ของเอกสาร)</b>
      <ul>
        {list.map(({ doc, pages }) => {
          const src = SOURCES[doc];
          const label = src?.title ?? doc;
          return (
            <li key={doc}>
              {src?.url ? (
                <a href={src.url} target="_blank" rel="noopener noreferrer">{label}</a>
              ) : (
                label
              )}
              {pages.length ? ` · หน้า ${pages.join(', ')}` : ''}
            </li>
          );
        })}
      </ul>
      {note && <span>{note}</span>}
    </footer>
  );
}

'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type CourseTocItem = {
  href: string;
  label: string;
  shortLabel: string;
};

type CourseTocContextValue = {
  items: CourseTocItem[];
  setItems: (items: CourseTocItem[]) => void;
};

const CourseTocContext = createContext<CourseTocContextValue | null>(null);

export function CourseTocProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CourseTocItem[]>([]);
  const value = useMemo(() => ({ items, setItems }), [items]);
  return <CourseTocContext.Provider value={value}>{children}</CourseTocContext.Provider>;
}

export function useCourseToc() {
  const context = useContext(CourseTocContext);
  if (!context) {
    throw new Error('useCourseToc must be used within CourseTocProvider');
  }
  return context;
}

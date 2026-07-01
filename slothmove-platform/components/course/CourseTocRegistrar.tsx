'use client';

import { useEffect } from 'react';
import type { CourseTocItem } from './CourseTocContext';
import { useCourseToc } from './CourseTocContext';

export function CourseTocRegistrar({ items }: { items: CourseTocItem[] }) {
  const { setItems } = useCourseToc();

  useEffect(() => {
    setItems(items);
    return () => setItems([]);
  }, [items, setItems]);

  return null;
}

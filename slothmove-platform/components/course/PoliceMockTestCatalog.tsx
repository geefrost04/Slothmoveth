import { getPublishedExamCatalog } from '@/lib/exam-data';
import { getSupabaseServer } from '@/lib/supabase-server';
import { getOwnedExamSetIds } from '@/lib/catalog-access';
import { PoliceMockTestCatalogClient } from './PoliceMockTestCatalogClient';

export async function PoliceMockTestCatalog({
  courseId,
  compact = false
}: {
  courseId: string;
  compact?: boolean;
}) {
  const examSets = await getPublishedExamCatalog(courseId, 'mock_test');
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  let ownedExamSetIds: string[] = [];

  if (user) {
    ownedExamSetIds = await getOwnedExamSetIds(supabase, user.id, 'mock_test', examSets);
  }

  return (
    <PoliceMockTestCatalogClient
      courseId={courseId}
      examSets={examSets}
      ownedExamSetIds={ownedExamSetIds}
      compact={compact}
    />
  );
}

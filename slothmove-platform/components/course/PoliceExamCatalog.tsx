import { getPublishedExamCatalog } from '@/lib/exam-data';
import { getSupabaseServer } from '@/lib/supabase-server';
import { getOwnedExamSetIds } from '@/lib/catalog-access';
import { PoliceExamCatalogClient } from './PoliceExamCatalogClient';

export async function PoliceExamCatalog({
  courseId,
  subjectId
}: {
  courseId: string;
  subjectId: string;
}) {
  const examSets = await getPublishedExamCatalog(courseId, subjectId);
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  let ownedExamSetIds: string[] = [];

  if (user) {
    ownedExamSetIds = await getOwnedExamSetIds(supabase, user.id, subjectId, examSets);
  }

  return (
    <PoliceExamCatalogClient
      courseId={courseId}
      subjectId={subjectId}
      examSets={examSets}
      ownedExamSetIds={ownedExamSetIds}
    />
  );
}

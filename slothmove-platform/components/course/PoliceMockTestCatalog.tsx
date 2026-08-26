import { getPublishedExamCatalog } from '@/lib/exam-data';
import { getSupabaseServer } from '@/lib/supabase-server';
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
  const productIds = examSets.flatMap((examSet) => examSet.product_id ? [examSet.product_id] : []);
  let ownedProductIds: string[] = [];

  if (user && productIds.length > 0) {
    const { data: entitlements } = await supabase
      .from('entitlements')
      .select('product_id')
      .eq('user_id', user.id)
      .in('product_id', productIds);
    ownedProductIds = (entitlements ?? []).map((entitlement) => entitlement.product_id);
  }

  return (
    <PoliceMockTestCatalogClient
      courseId={courseId}
      examSets={examSets}
      ownedProductIds={ownedProductIds}
      compact={compact}
    />
  );
}

import type { SupabaseClient } from '@supabase/supabase-js';
import type { CatalogExamSet } from './exam-data';

type EntitlementRow = { product_id: string; expires_at: string | null };
type ProductItemRow = { subject_id: string; item_id: string };

export async function getOwnedExamSetIds(
  supabase: SupabaseClient,
  userId: string | undefined,
  subjectId: string,
  examSets: CatalogExamSet[]
) {
  if (!userId || examSets.length === 0) return [];

  const { data: entitlements, error: entitlementError } = await supabase
    .from('entitlements')
    .select('product_id,expires_at')
    .eq('user_id', userId);
  if (entitlementError) throw new Error(`Unable to load entitlements: ${entitlementError.message}`);

  const now = Date.now();
  const activeProductIds = new Set(
    ((entitlements ?? []) as EntitlementRow[])
      .filter((entitlement) => !entitlement.expires_at || Date.parse(entitlement.expires_at) > now)
      .map((entitlement) => entitlement.product_id)
  );
  if (activeProductIds.size === 0) return [];

  const { data: productItems, error: productItemsError } = await supabase
    .from('product_items')
    .select('subject_id,item_id')
    .in('product_id', [...activeProductIds]);
  if (productItemsError) throw new Error(`Unable to load bundle items: ${productItemsError.message}`);

  const bundleItemKeys = new Set(
    ((productItems ?? []) as ProductItemRow[]).map((item) => `${item.subject_id}:${item.item_id}`)
  );
  return examSets
    .filter((examSet) => (
      Boolean(examSet.product_id && activeProductIds.has(examSet.product_id))
      || bundleItemKeys.has(`${subjectId}:${examSet.id}`)
    ))
    .map((examSet) => examSet.id);
}

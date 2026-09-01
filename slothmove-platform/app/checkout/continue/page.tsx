import { notFound, redirect } from 'next/navigation';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { TrackEventOnMount } from '@/components/analytics/TrackEventOnMount';
import { getExamAccessSummary } from '@/lib/exam-data';
import { getSupabaseServer } from '@/lib/supabase-server';

function getSafeReturnTo(value: string | undefined) {
  return value?.startsWith('/') && !value.startsWith('//')
    ? value
    : '/courses/police_admin/math';
}

export const dynamic = 'force-dynamic';

export default async function ContinueCheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ product_id?: string; return_to?: string }>;
}) {
  const { product_id: productId, return_to: requestedReturnTo } = await searchParams;
  if (!productId) notFound();

  const returnTo = getSafeReturnTo(requestedReturnTo);
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const continuePath = `/checkout/continue?product_id=${encodeURIComponent(productId)}&return_to=${encodeURIComponent(returnTo)}`;
    redirect(`/login?next=${encodeURIComponent(continuePath)}`);
  }

  const { data: examSet, error } = await supabase
    .from('exam_sets')
    .select('id')
    .eq('product_id', productId)
    .eq('is_published', true)
    .maybeSingle();
  if (error || !examSet) notFound();

  const access = await getExamAccessSummary(examSet.id);
  if (!access?.product_id) notFound();
  if (access.canAccess) redirect(returnTo);

  return (
    <>
      <TrackEventOnMount
        eventName="checkout_continue_view"
        eventKey={`checkout-continue:${productId}`}
        parameters={{ product_id: productId, return_path: returnTo }}
      />
      <PurchaseGate
        title={access.title}
        description={access.description}
        price={access.price}
        productId={access.product_id}
        backHref={returnTo}
        backLabel="กลับไปหน้าชุดข้อสอบ"
      />
    </>
  );
}

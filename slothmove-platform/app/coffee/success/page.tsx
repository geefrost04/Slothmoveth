import { CoffeeSuccessRedirect } from '@/components/analytics/CoffeeSuccessRedirect';

export default async function CoffeeSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string; amount?: string; pdf?: string }>;
}) {
  const { session_id: sessionId, amount, pdf } = await searchParams;
  const amountValue = Number(amount || '0');
  const pdfPath = pdf || '/files/สรุปเรื่องเซต.pdf';

  return (
    <CoffeeSuccessRedirect
      eventKey={`coffee_purchase:${sessionId || `${amountValue}:${pdfPath}`}`}
      amount={Number.isFinite(amountValue) ? amountValue : 0}
      pdfPath={pdfPath}
      redirectTo="/courses/police_admin/math?coffee=thanks"
    />
  );
}

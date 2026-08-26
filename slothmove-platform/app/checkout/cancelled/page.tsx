import Link from 'next/link';

export default async function CheckoutCancelledPage({
  searchParams
}: {
  searchParams: Promise<{ product_id?: string }>;
}) {
  const { product_id: productId } = await searchParams;
  const returnHref = productId?.startsWith('police_mock_test_set_')
    ? '/courses/police_admin/mock-test'
    : '/courses/police_admin/math';
  return (
    <main className="checkout-result">
      <section>
        <span aria-hidden="true">←</span>
        <p>ยังไม่มีการเรียกเก็บเงิน</p>
        <h1>ยกเลิกการชำระเงินแล้ว</h1>
        <p>คุณสามารถกลับไปดูรายละเอียดและซื้อใหม่ได้ทุกเมื่อ</p>
        <Link href={returnHref}>กลับไปหน้าสินค้า</Link>
      </section>
    </main>
  );
}

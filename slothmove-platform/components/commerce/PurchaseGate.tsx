import Link from 'next/link';
import { CheckoutButton } from './CheckoutButton';

function formatPrice(satang: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(satang / 100);
}

export function PurchaseGate({
  title,
  description,
  price,
  productId,
  backHref = '/courses/police_admin/math',
  backLabel = 'กลับหน้าความรู้ทั่วไป',
  analyticsEventName,
  analyticsParameters
}: {
  title: string;
  description: string | null;
  price: number;
  productId: string;
  backHref?: string;
  backLabel?: string;
  analyticsEventName?: string;
  analyticsParameters?: Record<string, string | number | boolean | null>;
}) {
  return (
    <main className="purchase-gate">
      <section>
        <span className="purchase-gate-icon" aria-hidden="true">🔒</span>
        <p className="purchase-gate-kicker">เนื้อหาสำหรับสมาชิก</p>
        <h1>{title}</h1>
        <p>{description || 'ซื้อครั้งเดียวเพื่อปลดล็อกชุดข้อสอบและเฉลยแบบละเอียด'}</p>
        <strong>{formatPrice(price)}</strong>
        <CheckoutButton
          productId={productId}
          className="purchase-gate-checkout"
          analyticsEventName={analyticsEventName}
          analyticsParameters={analyticsParameters}
        >
          ซื้อและปลดล็อก
        </CheckoutButton>
        <Link href={backHref}>{backLabel}</Link>
        <small>ชำระเงินอย่างปลอดภัยผ่าน Stripe · สิทธิ์ผูกกับบัญชีที่เข้าสู่ระบบ</small>
      </section>
    </main>
  );
}

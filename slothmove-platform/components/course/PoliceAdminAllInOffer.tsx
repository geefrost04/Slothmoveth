import { TrackEventOnMount } from '@/components/analytics/TrackEventOnMount';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import { getSupabaseServer } from '@/lib/supabase-server';
import styles from './PoliceMockTestCatalog.module.css';

const PRODUCT_ID = 'police_admin_all_in_2026';

function formatPrice(satang: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(satang / 100);
}

function formatThaiDate(value: unknown) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export async function PoliceAdminAllInOffer() {
  const supabase = await getSupabaseServer();
  const { data: product } = await supabase
    .from('products')
    .select('id,title,price,metadata')
    .eq('id', PRODUCT_ID)
    .eq('is_published', true)
    .maybeSingle();
  if (!product) return null;

  const { data: items } = await supabase
    .from('product_items')
    .select('subject_id,item_id')
    .eq('product_id', product.id);
  const itemIds = (items ?? []).map((item) => item.item_id);
  if (itemIds.length === 0) return null;

  const { data: examSets } = await supabase
    .from('exam_sets')
    .select('id,total_questions,product_id')
    .in('id', itemIds)
    .eq('is_published', true);
  const includedSets = examSets ?? [];
  if (includedSets.length === 0) return null;

  const { data: { user } } = await supabase.auth.getUser();
  let owned = false;
  if (user) {
    const { data: entitlement } = await supabase
      .from('entitlements')
      .select('expires_at')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();
    owned = Boolean(entitlement && (!entitlement.expires_at || Date.parse(entitlement.expires_at) > Date.now()));
  }

  const includedQuestionCount = includedSets.reduce((total, examSet) => total + examSet.total_questions, 0);
  const includedProductIds = [...new Set(includedSets.flatMap((examSet) => examSet.product_id ? [examSet.product_id] : []))];
  const { data: includedProducts } = await supabase
    .from('products')
    .select('id,price')
    .in('id', includedProductIds);
  const individualTotal = (includedProducts ?? []).reduce((total, includedProduct) => total + includedProduct.price, 0);
  const saving = Math.max(0, individualTotal - product.price);
  const releaseEnd = formatThaiDate((product.metadata as { release_window_end?: unknown } | null)?.release_window_end);

  return (
    <section className={styles.bundleOffer} aria-label="แพ็กเกจ Police Admin All-in">
      <TrackEventOnMount
        eventName="bundle_offer_impression"
        eventKey={`bundle-offer:${product.id}`}
        parameters={{
          product_id: product.id,
          price: product.price / 100,
          included_set_count: includedSets.length,
          included_question_count: includedQuestionCount
        }}
      />
      <div className={styles.bundleOfferCopy}>
        <span>POLICE ADMIN ALL-IN</span>
        <h2>{product.title}</h2>
        <p>ปลดล็อก Mock Test และชุดฝึกรายวิชาที่รวมอยู่ในแพ็กเกจ ใช้ได้ 1 ปีนับจากวันซื้อ</p>
        <ul>
          <li>{includedSets.length} ชุด · {includedQuestionCount.toLocaleString('th-TH')} ข้อ พร้อมเฉลย</li>
          <li>Mock Test เต็มรูปแบบ และชุดฝึกรายวิชา</li>
          {releaseEnd ? <li>อัปเดตเนื้อหาตามแผนถึง {releaseEnd}</li> : null}
        </ul>
      </div>
      <div className={styles.bundleOfferAction}>
        <small>ซื้อแยก {formatPrice(individualTotal)}</small>
        <strong>{formatPrice(product.price)}</strong>
        {saving > 0 ? <em>ประหยัด {formatPrice(saving)}</em> : null}
        {owned ? (
          <b>แพ็กเกจนี้อยู่ในบัญชีคุณแล้ว</b>
        ) : (
          <CheckoutButton
            productId={product.id}
            className={styles.bundleCheckout}
            analyticsEventName="bundle_unlock_click"
            analyticsParameters={{
              source: 'mock_catalog',
              price: product.price / 100,
              included_set_count: includedSets.length
            }}
          >
            ปลดล็อกทั้งหมด ฿299
          </CheckoutButton>
        )}
      </div>
    </section>
  );
}

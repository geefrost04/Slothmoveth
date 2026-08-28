'use client';

import { useEffect } from 'react';
import { TrackEventOnMount } from './TrackEventOnMount';

export function CoffeeSuccessRedirect({
  eventKey,
  amount,
  pdfPath,
  redirectTo
}: {
  eventKey: string;
  amount: number;
  pdfPath: string;
  redirectTo: string;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.replace(redirectTo);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [redirectTo]);

  return (
    <>
      <TrackEventOnMount
        eventName="purchase"
        eventKey={eventKey}
        parameters={{
          transaction_id: eventKey,
          currency: 'THB',
          value: amount,
          item_category: 'coffee_support',
          items: [
            {
              item_id: pdfPath,
              item_name: 'Pay me a coffee',
              item_category: 'coffee_support',
              price: amount,
              quantity: 1
            }
          ]
        }}
      />
      <main className="checkout-result">
        <section>
          <span aria-hidden="true">☕</span>
          <p>ขอบคุณสำหรับการสนับสนุน</p>
          <h1>กำลังพากลับไปหน้าชีท</h1>
          <p>ระบบบันทึกการสนับสนุนเรียบร้อยแล้ว กำลังกลับไปยังหน้าสรุปให้คุณอัตโนมัติ</p>
        </section>
      </main>
    </>
  );
}

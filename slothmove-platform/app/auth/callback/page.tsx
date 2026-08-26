'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('ไม่สามารถเชื่อมต่อระบบสมาชิกได้');
      return;
    }
    const client = supabase;

    let active = true;

    async function finishLogin() {
      const { data, error: sessionError } = await client.auth.getSession();
      if (!active) return;

      if (sessionError || !data.session) {
        setError('ยืนยันตัวตนไม่สำเร็จ กรุณากลับไปเข้าสู่ระบบอีกครั้ง');
        return;
      }

      const nextPath = new URLSearchParams(window.location.search).get('next');
      router.replace(nextPath?.startsWith('/') ? nextPath : '/dashboard');
      router.refresh();
    }

    void finishLogin();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#eef8f3' }}>
      <section style={{ width: 'min(440px, 100%)', padding: 32, border: '1px solid #d8e8df', borderRadius: 20, background: '#fff', textAlign: 'center', boxShadow: '0 18px 50px rgba(45,111,84,.12)' }}>
        <strong style={{ display: 'block', color: '#2d6f54', marginBottom: 10 }}>SLOTHMOVE</strong>
        <h1 style={{ margin: 0, fontSize: 24 }}>{error ? 'เข้าสู่ระบบไม่สำเร็จ' : 'กำลังเข้าสู่ระบบ...'}</h1>
        <p style={{ color: '#64748b', lineHeight: 1.7 }}>{error || 'กำลังตรวจสอบบัญชี Google และเตรียมข้อมูลของคุณ'}</p>
        {error ? <Link href="/login" style={{ color: '#2d6f54', fontWeight: 700 }}>กลับหน้าเข้าสู่ระบบ</Link> : null}
      </section>
    </main>
  );
}

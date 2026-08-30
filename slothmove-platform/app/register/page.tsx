'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { trackAnalyticsEvent } from '@/lib/analytics';
import styles from '../login/login.module.css';

function getSignupError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('already registered') || normalized.includes('already been registered')) {
    return 'อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ';
  }
  if (normalized.includes('password')) return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
  if (normalized.includes('rate limit')) return 'สมัครสมาชิกหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
  return 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.64.39 3.19 1.04 4.55l3.35-2.62Z" />
      <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z" />
    </svg>
  );
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    trackAnalyticsEvent('register_view', { method: 'page' });
    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
      setCheckingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/dashboard?welcome=1');
        return;
      }
      setCheckingSession(false);
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard?welcome=1')}`
      }
    });

    if (error) {
      setErrorMessage(getSignupError(error.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      trackAnalyticsEvent('sign_up', { method: 'email' });
      router.replace('/dashboard?welcome=1');
      router.refresh();
      return;
    }

    setRegisteredEmail(normalizedEmail);
    trackAnalyticsEvent('sign_up', { method: 'email', confirmation_required: true });
    setLoading(false);
  }

  async function handleGoogleSignup() {
    setErrorMessage('');
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard?welcome=1')}`,
        queryParams: { access_type: 'offline', prompt: 'select_account' }
      }
    });
    if (!error) trackAnalyticsEvent('sign_up_start', { method: 'google' });
    if (error) {
      setErrorMessage('สมัครด้วย Google ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <Link href="/" className={styles.wordmark} aria-label="กลับหน้าแรก SlothMove">SLOTH<span>MOVE</span></Link>

      <section className={styles.card} aria-labelledby="register-title">
        {registeredEmail ? (
          <div className={styles.successState}>
            <span className={styles.successIcon} aria-hidden="true">✓</span>
            <span className={styles.eyebrow}>EMAIL CONFIRMATION</span>
            <h1 id="register-title">ตรวจสอบอีเมลของคุณ</h1>
            <p className={styles.subtitle}>เราส่งลิงก์ยืนยันไปที่ <strong>{registeredEmail}</strong> แล้ว กดยืนยันในอีเมลก่อนเข้าสู่ระบบ</p>
            <Link href="/login?next=%2Fdashboard%3Fwelcome%3D1" className={styles.submitLink}>ไปหน้าเข้าสู่ระบบ <span>→</span></Link>
            <button type="button" className={styles.textButton} onClick={() => setRegisteredEmail('')}>ใช้อีเมลอื่น</button>
          </div>
        ) : (
          <>
            <div className={styles.brandMark} aria-hidden="true"><img src="/pic/slothmove_mascot.png" alt="" /></div>
            <span className={styles.eyebrow}>CREATE ACCOUNT</span>
            <h1 id="register-title">สมัครสมาชิก</h1>
            <p className={styles.subtitle}>สร้างบัญชีเพื่อบันทึกผลสอบ วิเคราะห์จุดอ่อน และใช้งานต่อได้ทุกอุปกรณ์</p>
            {errorMessage ? <div className={styles.error} role="alert">{errorMessage}</div> : null}

            <button className={styles.googleButton} type="button" onClick={handleGoogleSignup} disabled={loading || checkingSession}>
              <GoogleIcon /> สมัครด้วย Google
            </button>
            <div className={styles.divider}><span>หรือสมัครด้วยอีเมล</span></div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label><span>ชื่อที่ใช้แสดง</span><input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อของคุณ" minLength={2} maxLength={80} required disabled={loading || checkingSession} /></label>
              <label><span>อีเมล</span><input type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required disabled={loading || checkingSession} /></label>
              <label>
                <span>รหัสผ่าน</span>
                <div className={styles.passwordField}>
                  <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" minLength={8} required disabled={loading || checkingSession} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'ซ่อน' : 'แสดง'}</button>
                </div>
              </label>
              <label><span>ยืนยันรหัสผ่าน</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="พิมพ์รหัสผ่านอีกครั้ง" minLength={8} required disabled={loading || checkingSession} /></label>
              <button className={styles.submitButton} type="submit" disabled={loading || checkingSession}>
                {checkingSession ? 'กำลังตรวจสอบบัญชี...' : loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
                {!checkingSession && !loading ? <span aria-hidden="true">→</span> : null}
              </button>
            </form>
            <p className={styles.accountPrompt}>มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link></p>
            <div className={styles.securityNote}><strong>บัญชีใหม่เป็นผู้ใช้ทั่วไป</strong><span>สิทธิ์ผู้ดูแลระบบไม่สามารถเลือกจากหน้าสมัครได้</span></div>
            <Link href="/" className={styles.backLink}>← กลับหน้าแรก</Link>
          </>
        )}
      </section>
    </main>
  );
}

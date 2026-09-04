'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from './login.module.css';

function getLoginError(message: string) {
  if (message.toLowerCase().includes('invalid login credentials')) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if (message.toLowerCase().includes('email not confirmed')) return 'บัญชีนี้ยังไม่ได้ยืนยันอีเมล';
  return 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
}

function getSafeNextPath() {
  const requested = new URLSearchParams(window.location.search).get('next');
  return requested?.startsWith('/') && !requested.startsWith('//') ? requested : '/';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
      setCheckingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(getSafeNextPath());
        return;
      }
      setCheckingSession(false);
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      setErrorMessage(getLoginError(error.message));
      setLoading(false);
      return;
    }

    router.replace(getSafeNextPath());
    router.refresh();
  }

  async function handleGoogleLogin() {
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
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getSafeNextPath())}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      setErrorMessage('เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <Link href="/" className={styles.wordmark} aria-label="กลับหน้าแรก SlothMove">
        SLOTH<span>MOVE</span>
      </Link>

      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.brandMark} aria-hidden="true">
          <img src="/pic/slothmove_mascot.svg" alt="SlothMove" />
        </div>
        <span className={styles.eyebrow}>MEMBER ACCESS</span>
        <h1 id="login-title">เข้าสู่ระบบ</h1>
        <p className={styles.subtitle}>เก็บผลสอบ วิเคราะห์จุดอ่อน และใช้งานสิทธิ์ของคุณในทุกอุปกรณ์</p>

        {errorMessage ? <div className={styles.error} role="alert">{errorMessage}</div> : null}

        <button
          className={styles.googleButton}
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || checkingSession}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.39 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.64.39 3.19 1.04 4.55l3.35-2.62Z" />
            <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z" />
          </svg>
          เข้าสู่ระบบด้วย Google
        </button>

        <div className={styles.divider}><span>หรือใช้อีเมล</span></div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <span>อีเมล</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading || checkingSession}
            />
          </label>

          <label>
            <span>รหัสผ่าน</span>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                minLength={8}
                required
                disabled={loading || checkingSession}
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </label>

          <button className={styles.submitButton} type="submit" disabled={loading || checkingSession}>
            {checkingSession ? 'กำลังตรวจสอบบัญชี...' : loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            {!checkingSession && !loading ? <span aria-hidden="true">→</span> : null}
          </button>
        </form>

        <p className={styles.accountPrompt}>ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิกฟรี</Link></p>

        <div className={styles.securityNote}>
          <strong>ข้อมูลของคุณปลอดภัย</strong>
          <span>ระบบบันทึกผลสอบแยกตามบัญชีผู้ใช้</span>
        </div>

        <Link href="/" className={styles.backLink}>← กลับหน้าแรก</Link>
      </section>
    </main>
  );
}

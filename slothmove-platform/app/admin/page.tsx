'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from './admin.module.css';

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
};

type AttemptRow = {
  user_id: string;
  score: number;
  total_questions: number;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadAdminData() {
      const supabase = getSupabase();
      if (!supabase) {
        setErrorMessage('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
        setLoading(false);
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace('/login');
        return;
      }

      const { data: ownProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || ownProfile?.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const [profilesResponse, attemptsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('id,email,full_name,role,created_at')
          .order('created_at'),
        supabase
          .from('attempts')
          .select('user_id,score,total_questions')
      ]);

      if (profilesResponse.error || attemptsResponse.error) {
        setErrorMessage('โหลดข้อมูลผู้ใช้ไม่สำเร็จ');
      } else {
        setProfiles((profilesResponse.data ?? []) as ProfileRow[]);
        setAttempts((attemptsResponse.data ?? []) as AttemptRow[]);
      }
      setLoading(false);
    }

    loadAdminData();
  }, [router]);

  if (loading) {
    return <main className={styles.state}><span className={styles.loader} /><h1>กำลังตรวจสอบสิทธิ์</h1></main>;
  }

  if (accessDenied) {
    return (
      <main className={styles.state}>
        <span className={styles.deniedIcon}>!</span>
        <h1>ไม่มีสิทธิ์เข้าถึง</h1>
        <p>หน้านี้เปิดให้เฉพาะผู้ดูแลระบบ</p>
        <Link href="/dashboard">กลับ My Account</Link>
      </main>
    );
  }

  const attemptsByUser = new Map<string, AttemptRow[]>();
  for (const attempt of attempts) {
    const userAttempts = attemptsByUser.get(attempt.user_id) ?? [];
    userAttempts.push(attempt);
    attemptsByUser.set(attempt.user_id, userAttempts);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>SLOTH<span>MOVE</span></Link>
        <Link href="/dashboard" className={styles.backLink}>← My Account</Link>
      </header>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <span>ADMIN CONSOLE</span>
            <h1>ผู้ใช้ระบบ</h1>
            <p>ตรวจบัญชี สิทธิ์ และกิจกรรมการทำข้อสอบจาก Supabase</p>
          </div>
          <strong>{profiles.length} บัญชี</strong>
        </div>

        {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}

        <section className={styles.userList} aria-label="รายชื่อผู้ใช้">
          {profiles.map((profile, index) => {
            const userAttempts = attemptsByUser.get(profile.id) ?? [];
            const totalQuestions = userAttempts.reduce((total, attempt) => total + attempt.total_questions, 0);
            const totalScore = userAttempts.reduce((total, attempt) => total + attempt.score, 0);
            const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : null;

            return (
              <article className={styles.userCard} key={profile.id}>
                <span className={styles.userIndex}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.userIdentity}>
                  <strong>{profile.full_name || profile.email.split('@')[0]}</strong>
                  <span>{profile.email}</span>
                </div>
                <span className={`${styles.roleBadge} ${profile.role === 'admin' ? styles.adminRole : ''}`}>
                  {profile.role}
                </span>
                <div className={styles.userStats}>
                  <span><strong>{userAttempts.length}</strong> ครั้ง</span>
                  <span><strong>{accuracy === null ? '–' : `${accuracy}%`}</strong> ความแม่นยำ</span>
                </div>
                <time dateTime={profile.created_at}>
                  {new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date(profile.created_at))}
                </time>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

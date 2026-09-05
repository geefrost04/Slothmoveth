import { Fragment } from 'react';
import Link from 'next/link';
import type { CourseConfig, CourseLandingSection, SubjectMeta } from '@/lib/course-types';
import { PoliceMockTestCatalog } from './PoliceMockTestCatalog';
import { PoliceMockupSubjectGrid } from './PoliceMockupSubjectGrid';
import { PoliceQrQuizPrompt } from './PoliceQrQuizPrompt';
import { PoliceMiniMockCallout } from './PoliceMiniMockCallout';
import { PoliceAdminAllInOffer } from './PoliceAdminAllInOffer';
import { getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import {
  SubjectIcon,
  MathIcon,
  ThaiIcon,
  EnglishIcon,
  LawIcon,
  ComputerIcon,
  SarabanIcon
} from '@/components/icons/SubjectIcons';

function findSubjects(course: CourseConfig, ids: string[]) {
  return ids
    .map((id) => course.subjects.find((subject) => subject.id === id))
    .filter(Boolean) as SubjectMeta[];
}

function getBangkokDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getDailyQuestionIndex(seed: string, totalQuestions: number) {
  return Array.from(seed).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0) % totalQuestions;
}

function SubjectPanel({
  courseId,
  subject,
  hideCount = false,
  categoryLabel,
  number
}: {
  courseId: string;
  subject: SubjectMeta;
  hideCount?: boolean;
  categoryLabel: CourseLandingSection['categoryLabel'];
  number: number;
}) {
  const hasData = subject.count > 0;
  const [focusLine, ...topicLines] = subject.desc.split(' · ');
  const topicsSummary = topicLines.join(' · ');
  const isPoliceAdmin = courseId === 'police_admin';

  return (
    <Link
      href={`/courses/${courseId}/${subject.id}`}
      className={`pab-subject-card${hasData ? '' : ' is-empty'}`}
    >
      <div className="pab-subject-card-body">
        {isPoliceAdmin ? (
          <>
            <div className="pab-subject-card-header-police">
              <span aria-hidden="true" className="pab-subject-card-icon-police"><SubjectIcon subjectId={subject.id} size={20} /></span>
              <div className="pab-subject-card-header-info-police">
                <span className="pab-subject-card-track-badge">นายสิบตำรวจ · สายอำนวยการ</span>
                <h3 className="pab-subject-card-title-police">{subject.title}</h3>
                <span className="pab-subject-card-cat-police">{categoryLabel}</span>
              </div>
            </div>
            <p className="pab-subject-card-focus-police">{focusLine}</p>
            <p className="pab-subject-card-desc-police">{topicsSummary}</p>
            <div className="pab-subject-card-stats-police">
              <span className="pab-subject-card-cta-police">เข้าเรียน →</span>
            </div>
          </>
        ) : (
          <>
            <div className="pab-subject-card-header">
              <span className="pab-subject-card-num">{String(number).padStart(2, '0')}</span>
              <span className="pab-subject-card-cat">{categoryLabel}</span>
            </div>
            <h3 className="pab-subject-card-title">
              <span aria-hidden="true"><SubjectIcon subjectId={subject.id} size={20} /></span> {subject.title}
            </h3>
            {topicsSummary ? (
              <>
                {focusLine && <p className="pab-subject-card-focus">{focusLine}</p>}
                <p className="pab-subject-card-desc">{topicsSummary}</p>
              </>
            ) : (
              <p className="pab-subject-card-desc">{subject.desc}</p>
            )}
            <div className="pab-subject-card-stats">
              {hideCount ? null : (
                <span className={`pab-subject-card-count${hasData ? '' : ' is-empty'}`}>
                  {hasData ? `${subject.count} ข้อ` : 'กำลังย้ายข้อมูล'}
                </span>
              )}
              <span className="pab-subject-card-cta">{hasData ? 'เข้าเรียน' : 'ดูสถานะ'}</span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

function PoliceWireLanding({ course }: { course: CourseConfig }) {
  const subjectById = new Map(course.subjects.map((subject) => [subject.id, subject]));

  const subjectIcons: Record<string, string> = {
    math: '▦',
    thai: '▤',
    english: 'ABC',
    law: '⚖',
    computer: '▣',
    saraban: '📁'
  };

  const cards = course.subjects.map((subj) => {
    return {
      id: subj.id,
      title: subj.title,
      sets: 'กำลังจัดเนื้อหาใหม่',
      progress: 0,
      href: `/courses/${course.id}/${subj.id}`,
      icon: subjectIcons[subj.id] || subj.icon || '📘',
      available: true
    };
  });

  return (
    <div className="police-wire-page">
      <div className="container police-wire-inner">
        <nav className="police-wire-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span aria-hidden="true">›</span>
          <span>นายสิบตำรวจ สายอำนวยการ</span>
        </nav>

        <section className="police-wire-hero" aria-labelledby="police-wire-title">
          <div className="police-wire-badge" aria-hidden="true">
            <img src={course.theme.logo} alt="" />
          </div>
          <div className="police-wire-copy">
            <h1 id="police-wire-title">นายสิบตำรวจ สายอำนวยการ</h1>
            <p>สรุปแบบ Visual และชุดข้อสอบใหม่ แยกเป็นรายวิชาเพื่อเลือกเรียนและเลือกซื้อได้ชัดเจน</p>
          </div>
          <div className="police-wire-progress">
            <strong>กำลังปรับโครงสร้างใหม่</strong>
            <span>เตรียมเนื้อหา {cards.length} วิชา</span>
            <span>ชุดข้อสอบ <b>เร็ว ๆ นี้</b></span>
            <div className="police-wire-progressbar"><span /></div>
            <Link href={`/courses/${course.id}/math`}>ดูรายวิชา →</Link>
          </div>
        </section>

        <section className="police-wire-subjects" aria-labelledby="police-wire-subject-title">
          <h2 id="police-wire-subject-title">เลือกวิชาที่ต้องการฝึก</h2>
          <div className="police-wire-subject-grid">
            {cards.map((card) => {
              const source = subjectById.get(card.id);
              const content = (
                <>
                  <div className="police-wire-subject-icon" aria-hidden="true">{card.icon}</div>
                  <span className="police-wire-track-badge">นายสิบตำรวจ · สายอำนวยการ</span>
                  <h3>{card.title}</h3>
                  <p>{card.sets}</p>
                  <span>สรุป Visual และชุดข้อสอบใหม่</span>
                  <div className="police-wire-card-progress">
                    <i style={{ width: `${card.progress}%` }} />
                  </div>
                  <em>ใหม่</em>
                  <b>{card.available ? 'ดูวิชา' : 'เร็ว ๆ นี้'}</b>
                </>
              );

              return card.available && source ? (
                <Link href={card.href} className="police-wire-subject-card" key={card.id}>
                  {content}
                </Link>
              ) : (
                <div className="police-wire-subject-card is-locked" key={card.id}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="police-wire-guide">
          <div className="police-wire-guide-icon" aria-hidden="true">▱</div>
          <div>
            <h2>ยังไม่แน่ใจจะเริ่มวิชาไหนดี?</h2>
            <p>แนะนำแนวทางการเตรียมตัว และวิชาที่ควรโฟกัสก่อนลงสนามสอบ</p>
          </div>
          <Link href={`/courses/${course.id}/math`}>ดูแนะนำการเตรียมตัว</Link>
        </section>
      </div>
    </div>
  );
}

function PoliceAdminV3Landing({ course }: { course: CourseConfig }) {
  const landing = course.meta.landing;
  if (!landing) return null;
  const isOcsc = course.id === 'ocsc';

  let subjectOffset = 0;
  const sectionEntries = landing.sections.map((section) => {
    const subjects = findSubjects(course, section.subjectIds);
    const entry = { section, subjects, startNumber: subjectOffset + 1 };
    subjectOffset += subjects.length;
    return entry;
  });

  const totalReadyQuestions = course.subjects.reduce((sum, subject) => sum + Math.max(subject.count, 0), 0);
  const heroImage = course.theme.mascot || '/pic/slothmove_hero_study.png';
  const mockTitle = isOcsc ? landing.feature?.title ?? 'จำลองสอบภาค ก.' : 'เริ่มจำลองสอบ 150 ข้อ';
  const mockDesc = isOcsc
    ? landing.feature?.desc ?? 'จำลองสอบตามโครงสร้างจริงของภาค ก. พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ'
    : 'สุ่มข้อสอบตามโครงสร้างจริง จับเวลา 180 นาที พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ';
  const mockMeta = isOcsc
    ? landing.feature?.meta ?? ['100 ข้อ', '200 คะแนน', 'ภาค ก']
    : ['150 ข้อ', '180 นาที', '150 คะแนน', 'ภาค ก + ข'];
  const mockReady = isOcsc ? 'พร้อมซ้อมภาค ก?' : 'พร้อมเริ่มสอบ?';
  const mockDuration = isOcsc ? '100 ข้อ' : '180 นาที';
  const mockButtonLabel = isOcsc
    ? landing.feature?.primaryCtaLabel ?? 'เริ่มทำข้อสอบจำลอง'
    : 'เริ่มทำข้อสอบจำลอง';
  const outlineTitle = isOcsc ? 'โครงสร้างภาค ก ที่ต้องอ่านจริง' : 'วิชาที่สอบทั้งหมด';
  const outlineText = isOcsc
    ? 'มีเฉพาะ <strong>ภาค ก</strong> โดยแบ่งเป็น 3 หมวดหลัก: ความสามารถในการคิดวิเคราะห์ · ภาษาอังกฤษ · ความรู้และลักษณะการเป็นข้าราชการที่ดี'
    : '<strong>ภาค ก (40 คะแนน)</strong> ความรู้ความสามารถทั่วไป · <strong>ภาค ข (110 คะแนน)</strong> ความรู้เฉพาะตำแหน่ง';
  const leaderboardButtonClass = isOcsc
    ? 'ocsc-v3-btn ocsc-v3-btn-leaderboard'
    : 'police-v3-btn police-v3-btn-secondary';
  const showLeaderboardButton = isOcsc || course.id === 'police_admin';

  return (
    <div className="police-v3-page">
      {isOcsc ? (
        <section className="ocsc-v3-hero" aria-labelledby="course-hero-title">
          <div className="container">
            <div className="ocsc-v3-hero-inner">
              <div className="ocsc-v3-hero-copy">
                <div className="ocsc-v3-hero-badge">
                  เปิดให้เรียนฟรี · คลังข้อสอบ {totalReadyQuestions.toLocaleString()} ข้อ
                </div>
                <div className="ocsc-v3-hero-kicker">{course.category}</div>
                <h1 className="ocsc-v3-hero-title" id="course-hero-title">
                  <span>{landing.heroTitleLines[0]}</span>
                  <span>{landing.heroTitleLines[1] ?? course.title}</span>
                </h1>
                {landing.heroTitleAccent ? (
                  <p className="ocsc-v3-hero-subtitle">{landing.heroTitleAccent}</p>
                ) : null}
                <p className="ocsc-v3-hero-desc">{landing.heroDescription}</p>
                <div className="ocsc-v3-hero-actions">
                  <a href={landing.primaryCtaHref || '#course-content'} className="ocsc-v3-btn ocsc-v3-btn-primary">
                    {landing.primaryCtaLabel || 'เริ่มเรียนเลย'} <span aria-hidden="true">→</span>
                  </a>
                  {landing.secondaryCtaLabel ? (
                    <Link href={landing.secondaryCtaHref || '/courses'} className="ocsc-v3-btn ocsc-v3-btn-secondary">
                      {landing.secondaryCtaLabel}
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="ocsc-v3-hero-visual" aria-hidden="true">
                <div className="ocsc-v3-hero-frame">
                  <div className="ocsc-v3-hero-glow" />
                  <img src={heroImage} alt="" />
                  <div className="ocsc-v3-hero-frame-copy">
                    <strong>ภาค ก เท่านั้น</strong>
                    <span>3 วิชาหลัก · พร้อมเริ่มฝึก</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="ph-hero" aria-labelledby="course-hero-title">
          <div className="ph-hero-inner">
            <div className="ph-hero-copy">
              <div className="ph-hero-eyebrow">
                <span className="ph-hero-eyebrow-dot" aria-hidden="true" />
                {landing.heroBadge ?? course.category}
              </div>
              <h1 className="ph-hero-title" id="course-hero-title">
                {landing.heroTitleLines.map((line, index) => (
                  <span key={`${line}-${index}`}>{line}</span>
                ))}
                {landing.heroTitleAccent ? <small className="ph-hero-accent">{landing.heroTitleAccent}</small> : null}
              </h1>
              <p className="ph-hero-sub">{landing.heroDescription}</p>

              <div className="ph-hero-stats" aria-label="สถิติคอร์ส">
                {landing.stats.slice(0, 3).map((stat, index) => (
                  <Fragment key={`${stat.label}-${index}`}>
                    {index > 0 ? <span className="ph-hero-stat-divider" aria-hidden="true" /> : null}
                    <div className="ph-hero-stat">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="ph-hero-actions">
                <a href={landing.primaryCtaHref || '#course-content'} className="ph-btn ph-btn-primary">
                  {landing.primaryCtaLabel || 'เริ่มเรียนเลย'}
                  <span aria-hidden="true">→</span>
                </a>
                {landing.secondaryCtaLabel ? (
                  <Link href={landing.secondaryCtaHref || '/courses'} className="ph-btn ph-btn-ghost">
                    {landing.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="ph-hero-visual" aria-hidden="true">
              <div className="ph-hero-glow" />
              <div className="ph-hero-ring" />
              <img src={heroImage} alt="" className="ph-hero-mascot-img" />
              <div className="ph-hero-logo-wrap">
                <img src={course.theme.logo} alt="" className="ph-hero-logo" />
              </div>
            </div>
          </div>
        </section>
      )}

      <div id="course-content" className="police-v3-content-anchor" />

      <div className="container police-v3-content">
        <section className="police-v3-mock">
          <div className="police-v3-mock-icon">{landing.feature?.icon ?? '📝'}</div>
          <div className="police-v3-mock-copy">
            <div className="police-v3-mock-badge">{landing.feature?.chip ?? 'จำลองสอบเสมือนจริง'}</div>
            <h3>{mockTitle}</h3>
            <p>{mockDesc}</p>
            <div className="police-v3-mock-meta">
              {mockMeta.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="police-v3-mock-actions">
            <span className="police-v3-mock-ready">{mockReady}</span>
            <strong>{mockDuration}</strong>
            <TrackedLink
              href={`/courses/${course.id}/mock-test`}
              className="police-v3-btn police-v3-btn-primary"
              eventName="mock_catalog_open_click"
              parameters={{ source: 'course_mock_hero' }}
            >
              {mockButtonLabel} <span aria-hidden="true">→</span>
            </TrackedLink>
            {showLeaderboardButton ? (
              <Link href={`/courses/${course.id}/leaderboard`} className={leaderboardButtonClass}>
                🏆 เข้าสู่ Leaderboard
              </Link>
            ) : null}
          </div>
        </section>

        <section className="police-v3-outline">
          <h2>{outlineTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: outlineText }} />
        </section>

        <div className="police-v3-sections">
          {sectionEntries.map(({ section, subjects, startNumber }) => (
            <section key={section.id} className={`police-v3-section is-${section.id}`} id={`section-${section.id}`}>
              <div className="police-v3-section-head">
                <div>
                  <div className="police-v3-section-badge">{section.partLabel} · {section.chip}</div>
                  <h3>{section.title}</h3>
                  <p>{section.subtitle}</p>
                </div>
                <span className="police-v3-section-count">{subjects.length} วิชา</span>
              </div>

              <div className="police-v3-subject-grid">
                {subjects.map((subject, index) => {
                  const available = subject.count > 0;
                  const subjectNumber = startNumber + index;
                  return available ? (
                    <Link
                      key={subject.id}
                      href={`/courses/${course.id}/${subject.id}`}
                      className={`police-v3-subject-card is-${subject.id}`}
                    >
                      <div className="police-v3-subject-header">
                        <div className="police-v3-subject-icon"><SubjectIcon subjectId={subject.id} size={22} /></div>
                        <div className="police-v3-subject-header-info">
                          <h4>{subject.title}</h4>
                          <span className="police-v3-subject-chip">{section.categoryLabel}</span>
                        </div>
                      </div>
                      <p>{subject.desc}</p>
                      <div className="police-v3-subject-bottom">
                        <strong>เข้าเรียน →</strong>
                      </div>
                    </Link>
                  ) : (
                    <div key={subject.id} className={`police-v3-subject-card is-disabled is-${subject.id}`}>
                      <div className="police-v3-subject-header">
                        <div className="police-v3-subject-icon"><SubjectIcon subjectId={subject.id} size={22} /></div>
                        <div className="police-v3-subject-header-info">
                          <h4>{subject.title}</h4>
                          <span className="police-v3-subject-chip">{section.categoryLabel}</span>
                        </div>
                      </div>
                      <p>{subject.desc}</p>
                      <div className="police-v3-subject-bottom">
                        <strong>🔒</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const DocIcon = () => (
  <svg className="police-v2-quiz-doc-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const ScalesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="5" y1="7" x2="19" y2="7" />
    <path d="M5 7L2 14c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5L5 7z" />
    <path d="M19 7l-3 7c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5l-3-7z" />
    <path d="M9 22h6" />
  </svg>
);

const LaptopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
    <line x1="2" y1="20" x2="22" y2="20" />
    <line x1="12" y1="20" x2="12" y2="16" />
  </svg>
);

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const MathGraphIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 7v32h31M13 31c6-1 8-19 15-19 5 0 5 15 12 17" />
    <path d="M17 36v3M25 36v3M33 36v3M7 29h3M7 20h3M7 11h3" />
    <text x="29" y="10" fill="currentColor" stroke="none" fontSize="8">f(x)</text>
  </svg>
);

function PoliceMockupLanding({ course }: { course: CourseConfig }) {
  const subjects = [
    {
      id: 'math',
      title: 'ความรู้ทั่วไป',
      iconCustom: <MathIcon size={22} />,
      desc: 'คิดวิเคราะห์, คิดเชิงเหตุผล, คณิตศาสตร์พื้นฐาน, อนุกรม, ความน่าจะเป็น, สถิติพื้นฐาน',
      active: true,
      quizzes: [
        { title: 'สรุปสูตรที่ใช้', price: 'ฟรี', href: `/courses/${course.id}/math`, isFormula: true },
      ]
    },
    {
      id: 'thai',
      title: 'ภาษาไทย',
      iconCustom: <ThaiIcon size={22} />,
      desc: 'การอ่านจับใจความ, การเขียน, หลักภาษา, การใช้คำ, การสรุปความและตีความ',
      active: true,
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ',
      iconCustom: <EnglishIcon size={22} />,
      desc: 'Reading Ability, Grammar & Structure, Vocabulary, Conversation',
      active: true,
    },
    {
      id: 'law',
      title: 'กฎหมาย',
      iconCustom: <LawIcon size={22} />,
      desc: 'กฎหมายที่ประชาชนควรรู้, กฎหมายอาญา, กฎหมายแพ่ง, กฎหมายในชีวิตประจำวัน',
      active: true,
    },
    {
      id: 'computer',
      title: 'คอมพิวเตอร์',
      iconCustom: <ComputerIcon size={22} />,
      desc: 'เทคโนโลยีสารสนเทศ, เครือข่ายคอมพิวเตอร์เบื้องต้น, MS Word, Excel, PowerPoint',
      active: true,
      quizzes: [
        { title: 'ชีทสรุปคอมพิวเตอร์', price: 'ฟรี', href: `/courses/${course.id}/computer/summary`, isFormula: true },
      ]
    },
    {
      id: 'saraban',
      title: 'งานสารบรรณ',
      iconCustom: <SarabanIcon size={22} />,
      desc: 'ระเบียบงานสารบรรณ พ.ศ. 2526 และประมวลระเบียบการตำรวจ ลักษณะที่ 54',
      active: true,
    }
  ];

  return (
    <div className="police-v2-landing">
      <div className="container">
        <nav className="police-v2-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span className="police-v2-breadcrumb-separator">&gt;</span>
          <span className="police-v2-breadcrumb-current">สนามสอบ</span>
          <span className="police-v2-breadcrumb-separator">&gt;</span>
          <span className="police-v2-breadcrumb-current">นายสิบตำรวจ สายอำนวยการ</span>
        </nav>

        <section className="police-v2-hero">
          <div className="police-v2-hero-content">
            <div className="police-v2-hero-title-row">
              <span className="police-v2-hero-shield-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              </span>
              <h1 className="police-v2-hero-title">นายสิบตำรวจ สายอำนวยการ</h1>
            </div>
            <h2 className="police-v2-hero-subtitle">เลือกวิชาที่ต้องการฝึก</h2>
            <p className="police-v2-hero-desc">
              ฝึกข้อสอบตามวิชาที่ต้องการ หรือดูสรุปเนื้อหาเพื่อเพิ่มความเข้าใจก่อนทำข้อสอบ
            </p>
          </div>
          <div className="police-v2-hero-image">
            <img src="/pic/logo_police.png" alt="ตราสำนักงานตำรวจแห่งชาติ" />
          </div>
        </section>

        <PoliceMiniMockCallout />

        <PoliceAdminAllInOffer />

        <section className="police-v2-mock-hero" aria-labelledby="police-mock-hero-title">
          <div className="police-v2-mock-copy">
            <span className="police-v2-mock-eyebrow"><i aria-hidden="true" /> FULL MOCK EXPERIENCE</span>
            <h2 id="police-mock-hero-title">Mock Test จำลองสนามจริง</h2>
            <p>ทำข้อสอบครบ 6 วิชาในรอบเดียว จับเวลา 180 นาที แล้วรับคะแนนรวม คะแนนแยกรายวิชา และเฉลยไว้กลับไปฝึกต่อ</p>
            <div className="police-v2-mock-meta" aria-label="รายละเอียด Mock Test">
              <span><strong>150</strong> ข้อ</span>
              <span><strong>180</strong> นาที</span>
              <span><strong>6</strong> วิชา</span>
            </div>
          </div>
          <PoliceMockTestCatalog courseId={course.id} compact />
        </section>

        <h2 className="police-v2-section-heading">เลือกวิชา</h2>

        <PoliceMockupSubjectGrid
          course={course}
          subjects={subjects}
        />

        <section className="police-v2-guide-banner">
          <div className="police-v2-guide-info">
            <span className="police-v2-guide-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </span>
            <div className="police-v2-guide-text">
              <h3>ยังไม่รู้จะเริ่มตรงไหน?</h3>
              <p>ระหว่างรอชุดข้อสอบใหม่ สามารถดูโครงสร้างวิชาและสรุปเนื้อหาที่มีอยู่ได้</p>
            </div>
          </div>
          <Link href={`/courses/${course.id}/math`} className="police-v2-guide-button">
            ดูสรุปความรู้ทั่วไป
          </Link>
        </section>
      </div>
    </div>
  );
}

export async function CourseLanding({ course }: { course: CourseConfig }) {
  const landing = course.meta.landing;
  if (!landing) return null;
  const isPoliceAdmin = course.id === 'police_admin';
  const isOcsc = course.id === 'ocsc';
  const useEditorialLanding = isPoliceAdmin || isOcsc;
  const hideQuestionCounts = course.meta.hideQuestionCounts === true;
  const useMockSection = isPoliceAdmin || course.id === 'ocsc';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const contentAnchorId = 'course-content';
  const firstSectionId = landing.sections[0] ? `section-${landing.sections[0].id}` : contentAnchorId;
  const examHref = firstReadySubject
    ? `/courses/${course.id}/${firstReadySubject.id}/quiz`
    : landing.feature?.primaryCtaHref ?? `#${contentAnchorId}`;
  const firstSectionHref = `#${firstSectionId}`;

  if (course.id === 'police_admin') {
    let examSets: any[] = [];
    try {
      examSets = await getPublishedExamCatalog(course.id, 'math');
    } catch (e) {
      console.warn('Unable to load math exam catalog', e);
    }
    const freeExamSet = examSets.find((examSet) => examSet.access_type === 'free');
    let bundle: any = null;
    if (freeExamSet) {
      try {
        bundle = await getPublishedExamBundle(freeExamSet.id);
      } catch (e) {
        console.warn('Unable to load exam bundle', e);
      }
    }
    const dailyKey = getBangkokDateKey();
    const dailyQuestion = bundle?.questions?.length
      ? bundle.questions[getDailyQuestionIndex(`${course.id}-${freeExamSet?.id}-${dailyKey}`, bundle.questions.length)]
      : null;
    const sampleQuestion = dailyQuestion
      ? {
          prompt: dailyQuestion.prompt,
          choices: dailyQuestion.choices,
          correctChoiceIndex: dailyQuestion.correctChoiceIndex,
          explanation: dailyQuestion.explanation,
          dailyKey
        }
      : null;

    return <><PoliceQrQuizPrompt question={sampleQuestion} /><PoliceMockupLanding course={course} /></>;
  }

  if (useEditorialLanding) {
    return <PoliceAdminV3Landing course={course} />;
  }

  return (
    <>
      <section
        className="pab-hero"
        style={course.theme.mascot ? ({ '--hero-image-url': `url(${course.theme.mascot})` } as React.CSSProperties) : undefined}
      >
        <div className="container">
          <div className="pab-hero-inner">
            <div className="pab-hero-content">
              <div className="pab-hero-badge">{landing.heroBadge}</div>
              <div className="pab-hero-kicker">{landing.heroTitleLead}</div>
              <h1 className="pab-hero-title">
                {landing.heroTitleLines.map((line) => <span key={line}>{line}</span>)}
                {landing.heroTitleAccent ? (
                  <small className="pab-hero-title-accent">{landing.heroTitleAccent}</small>
                ) : null}
              </h1>
              <p className="pab-hero-desc">{landing.heroDescription}</p>
              <div className="pab-hero-actions">
                <a href="#course-content" className="pab-btn pab-btn-primary">
                  {landing.primaryCtaLabel} <span aria-hidden="true">→</span>
                </a>
                {landing.secondaryCtaLabel ? (
                  <Link href={landing.secondaryCtaHref || firstSectionHref} className="pab-btn pab-btn-secondary">
                    {landing.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="pab-hero-mascot">
              <img src={course.theme.mascot ?? course.theme.logo} alt={course.tagline} />
              {landing.mascotLabel ? <div className="pab-hero-mascot-label">{landing.mascotLabel}</div> : null}
            </div>
          </div>
        </div>
      </section>

      <div id={contentAnchorId} className="pab-course-content">
        {landing.feature && useMockSection ? (
          <section className="pab-mock-section">
            <div className="container">
              <div className="pab-mock-card">
                <div className="pab-mock-card-top"></div>
                <div className="pab-mock-card-inner">
                  <div className="pab-mock-badge">
                    <span>{landing.feature.icon}</span> {landing.feature.chip}
                  </div>
                  <h2 className="pab-mock-title">{landing.feature.title}</h2>
                  <p className="pab-mock-desc">{landing.feature.desc}</p>
                  <div className="pab-mock-meta">
                    {landing.feature.meta.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="pab-mock-actions">
                    <Link href={landing.feature.primaryCtaHref || `/courses/${course.id}/mock-test`} className="pab-btn pab-btn-primary">
                      {landing.feature.primaryCtaLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : landing.feature ? (
          <section className="course-exam-section" id="exam">
            <div className="container course-exam-inner">
              <div className="course-exam-icon" aria-hidden="true">{landing.feature.icon}</div>
              <div className="course-exam-copy">
                <div className="course-exam-chip">{landing.feature.chip}</div>
                <h2>{landing.feature.title}</h2>
                <p>{landing.feature.desc}</p>
                <div className="course-exam-meta">
                  {landing.feature.meta.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="course-exam-actions">
                <Link href={examHref} className="course-exam-primary">
                  ลานฝึก <span aria-hidden="true">→</span>
                </Link>
                {landing.feature.secondaryCtaLabel ? (
                  <a href={landing.feature.secondaryCtaHref} className="course-exam-secondary">
                    {landing.feature.secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {isPoliceAdmin && (
          <section className="pab-mock-section">
            <div className="container">
              <div className="pab-mock-card">
                <div className="pab-mock-card-top"></div>
                <div className="pab-mock-card-inner pab-mock-card-inner-compact">
                  <div className="pab-mock-main">
                    <div className="pab-mock-copy">
                      <div className="pab-mock-badge">
                        <span>📝</span> จำลองสอบเสมือนจริง
                      </div>
                      <h2 className="pab-mock-title">จำลองสอบสนามจริง 150 ข้อ</h2>
                      <p className="pab-mock-desc">
                        สุ่มข้อสอบตามโครงสร้างจริง จับเวลา 180 นาที พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ
                      </p>
                      <div className="pab-mock-meta">
                        <span>150 ข้อ</span>
                        <span>180 นาที</span>
                        <span>150 คะแนน</span>
                        <span>ภาค ก + ข</span>
                      </div>
                    </div>

                    <div className="pab-mock-side">
                      <div className="pab-mock-side-card">
                        <strong>พร้อมเริ่มสอบ?</strong>
                        <span>180 นาที</span>
                        <div className="pab-mock-actions">
                          <Link href={`/courses/${course.id}/mock-test`} className="pab-btn pab-btn-primary">
                            เริ่มทำข้อสอบจำลอง →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {landing.sections.map((section, sectionIndex) => {
          const subjects = findSubjects(course, section.subjectIds);
          const numberOffset = landing.sections
            .slice(0, sectionIndex)
            .reduce((total, item) => total + item.subjectIds.length, 0);

          return (
            <section key={section.id} className="pab-section" id={`section-${section.id}`}>
              <div className="pab-section-header">
                <div className={`pab-section-part pab-${section.partClass}`}>{section.partLabel}</div>
                <div className="pab-section-header-info">
                  <div className="pab-section-chip">{section.chip}</div>
                  <h2 className="pab-section-title">{section.title}</h2>
                  {section.subtitle && <p className="pab-section-subtitle">{section.subtitle}</p>}
                </div>
                {course.id !== 'police_admin' && (
                  <div className="pab-section-count">{subjects.length} วิชา</div>
                )}
              </div>

              <div className="pab-subject-grid-wrap">
                <div className="pab-subject-grid">
                  {subjects.map((subject, subjectIndex) => (
                    <SubjectPanel
                      key={subject.id}
                      courseId={course.id}
                      subject={subject}
                      hideCount={hideQuestionCounts}
                      categoryLabel={section.categoryLabel}
                      number={numberOffset + subjectIndex + 1}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

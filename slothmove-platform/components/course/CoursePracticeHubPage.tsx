'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CourseConfig, GameMeta, SubjectMeta } from '@/lib/course-types';

type PracticeEntry = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href?: string;
  featured?: boolean;
  status: 'full' | 'skeleton';
};

function getPracticeTag(game: GameMeta): string {
  // Pill label shown above the title — keep short, all caps.
  switch (game.id) {
    case 'quiz':
      return 'QUIZ';
    case 'flashcard':
      return 'FLASHCARD';
    case 'match':
      return 'MATCH';
    case 'cloze':
      return 'CLOZE';
    case 'analogy':
      return 'ANALOGY';
    case 'series':
      return 'SERIES';
    case 'compare-values':
      return 'COMPARE';
    case 'word-problem':
      return 'WORD';
    case 'speed-percent':
      return 'SPEED';
    default:
      return game.label?.toUpperCase() ?? game.labelTh?.toUpperCase() ?? 'GAME';
  }
}

function getPracticeCta(game: GameMeta, index: number): string {
  if (index === 0) return 'เริ่มทำข้อสอบ';
  if (game.id === 'flashcard') return 'เริ่มทบทวน';
  if (game.id === 'match') return 'เริ่มจับคู่';
  if (game.id === 'cloze') return 'เริ่มเติมคำ';
  if (game.id === 'analogy') return 'เริ่มฝึกอุปมาอุปไมย';
  if (game.id === 'series') return 'เริ่มฝึกอนุกรม';
  if (game.id === 'compare-values') return 'เริ่มฝึกเปรียบเทียบ';
  if (game.id === 'word-problem') return 'เริ่มฝึกโจทย์ปัญหา';
  if (game.id === 'speed-percent') return 'เริ่มฝึกคิดเร็ว';
  return `เปิด${game.labelTh}`;
}

function getPracticeDesc(game: GameMeta, subjectTitle: string, index: number) {
  if (index === 0) {
    return `ฝึกโจทย์คละหมวดของวิชา${subjectTitle}ทีละข้อ พร้อมเฉลยและคำอธิบาย เหมาะสำหรับเริ่มฝึกทุกวัน`;
  }
  return game.desc;
}

function buildDefaultPracticeEntries(
  course: CourseConfig,
  subject: SubjectMeta,
  subjectGames: GameMeta[]
): PracticeEntry[] {
  return subjectGames.map((game, index) => ({
    id: game.id,
    tag: getPracticeTag(game),
    title: game.labelTh,
    desc: getPracticeDesc(game, subject.title, index),
    cta: `${getPracticeCta(game, index)} →`,
    href: game.status === 'full' ? `/courses/${course.id}/${subject.id}/${game.id}` : undefined,
    featured: index === 0 && game.status === 'full',
    status: game.status
  }));
}

function getPracticeIntro(subject: SubjectMeta) {
  if (subject.id === 'computer') {
    return 'รวมเกมฝึกคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ตั้งแต่ข้อสอบ 4 ตัวเลือกไปจนถึงเกมตัดสิน True/False ที่ใช้คำลวงใกล้เคียงเพื่อฝึกจำคำศัพท์ ฟังก์ชัน และแนวคิดสำคัญให้แม่นขึ้น';
  }

  if (subject.id === 'math') {
    return `รวมเกมฝึกทุกรูปแบบของวิชา${subject.title}ไว้ที่เดียว เลือกซ้อมตามสไตล์ที่ชอบ ตั้งแต่ Quiz ปกติไปจนถึง Survival และ Speed Quiz`;
  }

  if (subject.id === 'law') {
    return 'รวมเกมฝึกกฎหมายสำหรับสนามสอบตำรวจสายอำนวยการ ครอบคลุมแพ่ง อาญา ที่ดิน วิธีพิจารณาความอาญา บริหารกิจการบ้านเมืองที่ดี และกฎหมายตำรวจ พร้อมโจทย์ลวงที่เน้นแยกเงื่อนไข ระยะเวลา อำนาจหน้าที่ และผลทางกฎหมายให้แม่น';
  }

  if (subject.id === 'english') {
    return 'รวมเกมฝึกภาษาอังกฤษสำหรับตำรวจสายอำนวยการ เน้น Grammar, Vocabulary, Reading และ Conversation ตามแนวข้อสอบจริงระดับ A2 ปลายถึง B1 ต้น พร้อมบริบทงานราชการ การบริการประชาชน และสถานการณ์ที่ใช้ได้จริง';
  }

  return `รวมเกมฝึกทุกรูปแบบของวิชา${subject.title}ไว้ที่เดียว เลือกซ้อมตามสไตล์ที่ชอบและกลับมาทบทวนซ้ำได้ตลอด`;
}

export function CoursePracticeHubPage({
  course,
  subject
}: {
  course: CourseConfig;
  subject: SubjectMeta;
}) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    try {
      setIsPremium(window.localStorage.getItem('slothmove:premium') === 'true');
    } catch {
      setIsPremium(false);
    }
  }, []);

  const subjectGames = subject.games?.length
    ? course.games.filter((game) => subject.games?.includes(game.id))
    : course.games;
  const practiceEntries: PracticeEntry[] = (() => {
    if (course.id === 'police_admin' && subject.id === 'computer') {
      return [
        {
          id: 'quiz',
          tag: 'EXAM MODE',
          title: 'แบบทดสอบคอมพิวเตอร์',
          desc: 'สุ่มข้อสอบ 4 ตัวเลือกจากคลังวิชาคอมฯ ครอบคลุม Office, เครือข่าย, อินเทอร์เน็ต, Social Media และความปลอดภัยดิจิทัล',
          cta: 'เริ่มทำข้อสอบ →',
          href: `/courses/${course.id}/${subject.id}/quiz`,
          featured: true,
          status: 'full'
        },
        {
          id: 'flashcard',
          tag: 'FLASHCARD',
          title: 'ทบทวนคำสำคัญ',
          desc: 'พลิกการ์ดจำคำศัพท์และแนวคิดหลัก เช่น Hardware, Software, Network, Security และ Microsoft Office แบบอ่านเร็ว',
          cta: 'เริ่มทบทวน →',
          href: `/courses/${course.id}/${subject.id}/flashcard`,
          status: 'full'
        },
        {
          id: 'match',
          tag: 'MATCH',
          title: 'จับคู่คำกับความหมาย',
          desc: 'จับคู่คำศัพท์คอมพิวเตอร์กับคำอธิบาย ช่วยจำคำที่ออกสอบบ่อยและแยกคำใกล้เคียงได้แม่นขึ้น',
          cta: 'เริ่มจับคู่ →',
          href: `/courses/${course.id}/${subject.id}/match`,
          status: 'full'
        },
        {
          id: 'truefalse',
          tag: 'TRUE / FALSE',
          title: 'ตัดสินถูกหรือผิด',
          desc: 'เกมใหม่สำหรับวิชาคอมฯ มีคำศัพท์ 1 คำ แล้วให้ตัดสินข้อความ True/False ตัวลวงใช้ความหมายใกล้เคียง เช่น Subnet Mask กับ Default Gateway หรือ SUMIF กับ COUNTIFS',
          cta: 'เริ่มตัดสิน →',
          href: `/courses/${course.id}/${subject.id}/truefalse`,
          status: 'full'
        },
      ];
    }

    if (course.id === 'police_admin' && subject.id === 'saraban') {
      return [
        {
          id: 'quiz',
          tag: 'QUIZ',
          title: 'Quiz',
          desc: 'สุ่มข้อสอบสารบรรณจากทุกหมวด ทั้งนิยาม ระเบียบ ขั้นตอน และงานสารบรรณตำรวจ พร้อมเฉลยหลังทำแต่ละข้อ',
          cta: 'เริ่มทำข้อสอบ →',
          href: `/courses/${course.id}/${subject.id}/quiz`,
          featured: true,
          status: 'full'
        },
        {
          id: 'flashcard',
          tag: 'FLASHCARD',
          title: 'Flashcard',
          desc: 'พลิกการ์ดทบทวนนิยาม ชนิดหนังสือ รหัสสำคัญ และอำนาจหน้าที่ เพื่อช่วยจำคำหลักให้เร็วขึ้น',
          cta: 'เริ่มทบทวน →',
          href: `/courses/${course.id}/${subject.id}/flashcard`,
          status: 'full'
        },
        {
          id: 'match',
          tag: 'MATCH',
          title: 'Match Pair',
          desc: 'จับคู่ชื่อหนังสือราชการกับความหมาย รวมถึงรหัสและหน่วยงานที่เกี่ยวข้อง เพื่อแยกคำใกล้เคียงให้แม่น',
          cta: 'เริ่มจับคู่ →',
          href: `/courses/${course.id}/${subject.id}/match`,
          status: 'full'
        },
        {
          id: 'cloze',
          tag: 'CLOZE',
          title: 'Cloze',
          desc: 'ฝึกเติมคำจากบริบทของระเบียบ ขั้นตอนรับส่งหนังสือ และคำศัพท์สารบรรณที่มักออกสอบ',
          cta: 'เริ่มเติมคำ →',
          href: `/courses/${course.id}/${subject.id}/cloze`,
          status: 'full'
        },
        {
          id: 'order',
          tag: 'ORDER',
          title: 'Order',
          desc: 'เรียงลำดับขั้นตอนงานสารบรรณ เช่น รับหนังสือ ส่งเก็บ เก็บรักษา และทำลายหนังสือให้ถูกต้อง',
          cta: 'เริ่มเรียงขั้นตอน →',
          href: `/courses/${course.id}/${subject.id}/order`,
          status: 'full'
        },
        {
          id: 'sorting',
          tag: 'SORT',
          title: 'Sort',
          desc: 'คัดแยกคำสำคัญตามหมวด เช่น ชนิดหนังสือ เลขหนังสือ การเก็บรักษา และกระบวนการสารบรรณ',
          cta: 'เริ่มจัดหมวด →',
          href: `/courses/${course.id}/${subject.id}/sorting`,
          status: 'full'
        },
        {
          id: 'authority',
          tag: 'AUTHORITY',
          title: 'Authority',
          desc: 'จับคู่ผู้รับผิดชอบ หน่วยงาน และภารกิจตามระเบียบ เพื่อทบทวนอำนาจหน้าที่ที่มักสับสนในข้อสอบ',
          cta: 'เริ่มจับคู่อำนาจหน้าที่ →',
          href: `/courses/${course.id}/${subject.id}/authority`,
          status: 'full'
        },
        {
          id: 'truefalse',
          tag: 'TRUE / FALSE',
          title: 'True / False',
          desc: 'ฝึกตัดสินข้อความความรู้เกี่ยวกับงานสารบรรณว่าถูกหรือผิดอย่างรวดเร็ว เพื่อเสริมทักษะการวิเคราะห์ข้อสอบแบบแม่นยำ',
          cta: 'เริ่มตัดสิน →',
          href: `/courses/${course.id}/${subject.id}/truefalse`,
          status: 'full'
        }
      ];
    }

    if (course.id === 'police_admin' && subject.id === 'law') {
      return [
        {
          id: 'quiz',
          tag: 'EXAM MODE',
          title: 'ควิซกฎหมาย',
          desc: 'สุ่มข้อสอบกฎหมาย 4 ตัวเลือกจากคลังหลัก ครอบคลุมแพ่ง อาญา ที่ดิน วิธีพิจารณาความอาญา บริหารกิจการบ้านเมืองที่ดี และกฎหมายตำรวจ',
          cta: 'เริ่มทำข้อสอบ →',
          href: `/courses/${course.id}/${subject.id}/quiz`,
          featured: true,
          status: 'full'
        },
        {
          id: 'flashcard',
          tag: 'FLASHCARD',
          title: 'แฟลชการ์ดจำคำศัพท์',
          desc: 'ทบทวนหลักจำ มาตราสำคัญ ระยะเวลา ผลทางกฎหมาย และจุดเปรียบเทียบที่ข้อสอบชอบสลับ เช่น โมฆะ/โมฆียะ ป้องกัน/จำเป็น และอำนาจศาล',
          cta: 'เริ่มทบทวน →',
          href: `/courses/${course.id}/${subject.id}/flashcard`,
          status: 'full'
        },
        {
          id: 'cloze',
          tag: 'CLOZE',
          title: 'เติมตัวบทกฎหมาย',
          desc: 'เติมคำในช่องว่างจากประโยคกฎหมายและคำอธิบาย เพื่อจำคำสำคัญ ตัวเลข ระยะเวลา และผลทางกฎหมายแบบ active recall',
          cta: 'เริ่มเติมคำ →',
          href: `/courses/${course.id}/${subject.id}/cloze`,
          status: 'full'
        },
        {
          id: 'authority',
          tag: 'AUTHORITY',
          title: 'อำนาจหน้าที่หน่วยงาน',
          desc: 'จับคู่ศาล หน่วยงาน ผู้มีอำนาจ และคณะกรรมการ เช่น ศาลรัฐธรรมนูญ ศาลปกครอง พนักงานสอบสวน พนักงานอัยการ ก.ต.ช. และ ก.พ.ค.ตร.',
          cta: 'เริ่มจับคู่อำนาจหน้าที่ →',
          href: `/courses/${course.id}/${subject.id}/authority`,
          status: 'full'
        },
        {
          id: 'truefalse',
          tag: 'TRUE / FALSE',
          title: 'ตัดสินถูกผิดตัวลวง',
          desc: 'ตัดสินข้อความกฎหมายแบบถูก/ผิด พร้อมเฉลยทันที เน้นตัวลวงเรื่องจำนวนปี จำนวนคน เงื่อนไขการจับค้น ผลของนิติกรรม และอำนาจองค์กรตำรวจ',
          cta: 'เริ่มตัดสิน →',
          href: `/courses/${course.id}/${subject.id}/truefalse`,
          status: 'full'
        }
      ];
    }

    if (course.id === 'police_admin' && subject.id === 'english') {
      return [
        {
          id: 'quiz',
          tag: 'EXAM MODE',
          title: 'ควิซภาษาอังกฤษ',
          desc: 'สุ่มข้อสอบอังกฤษ 4 ตัวเลือกจากคลังหลัก 200 ข้อ ครอบคลุม Reading 60 ข้อ, Vocabulary 50 ข้อ, Grammar 60 ข้อ และ Conversation 30 ข้อ โดยยังยึดสัดส่วนสนามสอบจริง',
          cta: 'เริ่มทำข้อสอบ →',
          href: `/courses/${course.id}/${subject.id}/quiz`,
          featured: true,
          status: 'full'
        },
        {
          id: 'cloze',
          tag: 'CLOZE',
          title: 'เติมคำอังกฤษ',
          desc: 'ฝึก Grammar และ Vocabulary แบบ active recall โดยเติมคำจากบริบทจริง เช่น tense, part of speech, collocation และคำศัพท์งานราชการ',
          cta: 'เริ่มเติมคำ →',
          href: `/courses/${course.id}/${subject.id}/cloze`,
          status: 'full'
        },
        {
          id: 'dialogue',
          tag: 'DIALOGUE',
          title: 'บทสนทนาสถานการณ์จริง',
          desc: 'ฝึก Conversation จากสถานการณ์ที่ออกสอบบ่อย เช่น Office, Telephone, Government Office, Police Station, Hospital, Hotel และ Transportation',
          cta: 'เริ่มฝึกบทสนทนา →',
          href: `/courses/${course.id}/${subject.id}/dialogue`,
          status: 'full'
        },
      ];
    }

    if (course.id === 'police_admin' && subject.id === 'math') {
      return [
          {
            id: 'quiz',
            tag: 'QUIZ',
            title: 'แบบทดสอบ 10 ข้อ',
            desc: 'ฝึกโจทย์คละหมวดทีละข้อ พร้อมเฉลยและคำอธิบายละเอียด เหมาะสำหรับเริ่มฝึกทุกวัน',
            cta: 'เริ่มทำข้อสอบ →',
            href: `/courses/${course.id}/${subject.id}/quiz`,
            featured: true,
            status: 'full'
          },
          {
            id: 'survival',
            tag: 'SURVIVAL',
            title: isPremium ? 'ตอบผิดจบเกม 👑' : 'ตอบผิดจบเกม 🔒',
            desc: 'ตอบถูกเพื่อไปต่อและสะสม Streak หากตอบผิดเพียงครั้งเดียวเกมจะจบทันที',
            cta: isPremium ? 'เริ่มท้าทาย →' : 'ปลดล็อก Premium →',
            href: `/courses/${course.id}/${subject.id}/survival`,
            status: 'full'
          },
          {
            id: 'speed',
            tag: 'SPEED QUIZ',
            title: 'แข่งตอบกับเวลา',
            desc: 'ตอบโจทย์สั้นให้ทันเวลาและรับคะแนนโบนัสจากวินาทีที่เหลือ',
            cta: 'เริ่มจับเวลา →',
            href: `/courses/${course.id}/${subject.id}/speed`,
            status: 'full'
          },
          {
            id: 'series',
            tag: 'SERIES',
            title: 'อนุกรม',
            desc: 'หาเลข ตัวอักษร หรือเศษส่วนที่หายไป พร้อมดูคำใบ้และรูปแบบของคำตอบ',
            cta: 'เริ่มฝึกอนุกรม →',
            href: `/courses/${course.id}/${subject.id}/series`,
            status: 'full'
          },
          {
            id: 'matrix',
            tag: 'MATRIX',
            title: 'ตารางตัวเลข',
            desc: 'หาค่าที่หายไปจากตาราง วิเคราะห์ความสัมพันธ์ของแถวและคอลัมน์',
            cta: 'เริ่มฝึกตาราง →',
            href: `/courses/${course.id}/${subject.id}/matrix`,
            status: 'full'
          },
          {
            id: 'logic',
            tag: 'LOGIC',
            title: 'ตรรกะและการสรุปผล',
            desc: 'อ่านเงื่อนไข เปรียบเทียบข้อมูล และเลือกข้อสรุปที่ถูกต้องตามหลักตรรกะ',
            cta: 'เริ่มฝึกตรรกะ →',
            href: `/courses/${course.id}/${subject.id}/logic`,
            status: 'full'
          },
          {
            id: 'analogy',
            tag: 'ANALOGY',
            title: 'อุปมาอุปไมย',
            desc: 'ฝึกวิเคราะห์ความสัมพันธ์ของคู่คำจากข้อสอบจริง',
            cta: 'เริ่มฝึกอุปมาอุปไมย →',
            href: `/courses/${course.id}/${subject.id}/analogy`,
            status: 'full'
          }
        ];
    }

    return buildDefaultPracticeEntries(course, subject, subjectGames);
  })();

  return (
    <div className="course-subject-page course-practice-page">
      <div className="course-subject-breadcrumb-wrap">
        <nav className="container course-breadcrumb">
          <Link href={`/courses/${course.id}/${subject.id}`}>← กลับไปหน้าวิชา</Link>
          <span>/</span>
          <span>ลานฝึกซ้อม</span>
        </nav>
      </div>

      <header className="course-subject-header">
        <div className="course-subject-header-deco" aria-hidden="true">
          <span className="course-subject-deco-symbol">π</span>
          <span className="course-subject-deco-symbol">∑</span>
          <span className="course-subject-deco-symbol">√</span>
          <span className="course-subject-deco-symbol">×</span>
        </div>
        <div className="container course-subject-header-inner">
          <div className="course-subject-icon">{subject.icon ?? '📘'}</div>
          <div className="course-subject-heading">
            <div className="course-subject-chip">ลานฝึกซ้อม · {subject.title}</div>
            <h1>ลานฝึก {subject.title}</h1>
            <p>{getPracticeIntro(subject)}</p>
          </div>
          <div className="course-subject-mascot" aria-hidden="true">
            <div className="course-subject-mascot-glow" />
            <img src={subject.mascot || '/pic/slothmove_mascot.png'} alt="" />
          </div>
        </div>
      </header>

      <main className="container practice-hub-main">
        <div className="drill-list">
          {practiceEntries.map((entry, index) => {
            const isSkeleton = entry.status === 'skeleton';
            const isFeatured = Boolean(entry.featured);
            const className = `drill-item${isFeatured ? ' is-featured' : ''}${isSkeleton ? ' is-disabled' : ''}`;
            const content = (
              <>
                <span className="drill-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                  {isFeatured ? <span className="drill-num-label">FEATURED</span> : null}
                </span>
                <div className="drill-body">
                  <span className="drill-tag">{entry.tag}</span>
                  <h2 className="drill-title-line">{entry.title}</h2>
                  <p className="drill-desc">{entry.desc}</p>
                </div>
                <span className="drill-cta">
                  {isSkeleton ? (
                    <span className="drill-cta-soon">กำลังพัฒนา</span>
                  ) : (
                    <span className="drill-cta-link">
                      {entry.cta.replace(/\s*→$/, '')} <span aria-hidden="true">→</span>
                    </span>
                  )}
                </span>
              </>
            );

            if (isSkeleton) {
              return (
                <div key={entry.id} className={className} aria-disabled="true">
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={entry.id}
                href={entry.href!}
                className={`${className} drill-item-link`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';

const examFields = [
  {
    title: 'นายสิบตำรวจ สายอำนวยการ',
    description: 'ข้อสอบรายวิชา + Mock Test',
    href: '/courses/police_admin',
    image: '/pic/logo_police.png',
    cta: 'ดูคอร์สและเริ่มทดลอง',
    active: true,
  },
  {
    title: 'ก.พ.',
    description: 'เร็ว ๆ นี้',
    href: '/courses/ocsc',
    image: '/pic/logo_ocsc.png',
    cta: 'เร็ว ๆ นี้',
    active: false,
  },
  {
    title: 'ราชการอื่น ๆ',
    description: 'เร็ว ๆ นี้',
    href: '/courses/police_admin',
    image: 'lock',
    cta: 'เร็ว ๆ นี้',
    active: false,
  },
];

function FieldCard({ field }: { field: (typeof examFields)[number] }) {
  const content = (
    <>
      <div className="home-exam-field-image" aria-hidden="true">
        {field.image === 'lock' ? (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#cbd5e1', padding: '12%' }}
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <img src={field.image} alt="" />
        )}
      </div>
      <div className="home-exam-field-copy">
        <h3>{field.title}</h3>
        <p className={field.active ? 'home-field-status is-active' : 'home-field-status'}>
          {field.description}
        </p>
        <span className={field.active ? 'home-field-cta is-active' : 'home-field-cta'}>
          {field.cta}
        </span>
      </div>
      <span className="home-field-arrow" aria-hidden="true">›</span>
    </>
  );

  if (!field.active) {
    return (
      <div className="home-exam-field-card is-locked" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={field.href} className="home-exam-field-card is-active">
      {content}
    </Link>
  );
}

export function ProductShowcase() {
  return (
    <section className="home-course-map-section" id="exam-selection" aria-labelledby="courses-title">
      <div className="container">
        <div className="home-exam-selection">
          <div className="home-exam-selection-head">
            <div>
              <h2 className="section-title" id="courses-title">เริ่มจากสนามสอบที่คุณกำลังเตรียมตัว</h2>
            </div>
          </div>
          <div className="home-exam-field-grid">
            {examFields.map((field) => <FieldCard field={field} key={field.title} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

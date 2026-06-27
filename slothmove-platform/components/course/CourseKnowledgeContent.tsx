import Link from 'next/link';
import type { CourseKnowledgeData, KnowledgeBlock, KnowledgeSection } from '@/lib/knowledge-types';

function HtmlBlock({ html }: { html?: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function BlockRenderer({ block }: { block: KnowledgeBlock }) {
  switch (block.type) {
    case 'highlight-box':
    case 'key-summary':
    case 'keypoint':
      return (
        <div className={`pab-knowledge-callout color-${block.color ?? 'amber'}`}>
          {block.title && <h4 className="pab-knowledge-callout-title">{block.title}</h4>}
          <div className="pab-knowledge-rich">
            <HtmlBlock html={block.content ?? block.text} />
          </div>
        </div>
      );
    case 'cards':
    case 'premium-flowchart':
      return (
        <div className="pab-knowledge-cards">
          {block.cards?.map((card, index) => (
            <article key={`${card.title ?? 'card'}-${index}`} className={`pab-knowledge-card color-${card.color ?? block.color ?? 'navy'}`}>
              {card.icon && <div className="pab-knowledge-card-icon">{card.icon}</div>}
              {card.title && <h4 className="pab-knowledge-card-title">{card.title}</h4>}
              <div className="pab-knowledge-rich">
                <HtmlBlock html={card.content} />
              </div>
            </article>
          ))}
        </div>
      );
    case 'comparison-table':
    case 'table':
      return (
        <div className="pab-knowledge-table-wrap">
          {block.title && <h4 className="pab-knowledge-block-title">{block.title}</h4>}
          <div className="pab-knowledge-table-scroll">
            <table className="pab-knowledge-table">
              {block.headers ? (
                <thead>
                  <tr>
                    {block.headers.map((header) => <th key={header}>{header}</th>)}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {block.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        <div className="pab-knowledge-rich">
                          <HtmlBlock html={cell} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'premium-timeline':
      return (
        <div className="pab-knowledge-timeline">
          {block.steps?.map((step, index) => (
            <article key={`${step.title ?? 'step'}-${index}`} className="pab-knowledge-timeline-item">
              <div className="pab-knowledge-timeline-step">{step.step ?? index + 1}</div>
              <div className="pab-knowledge-timeline-body">
                <div className="pab-knowledge-timeline-meta">
                  {step.badge ? <span className={`pab-knowledge-badge color-${step.badgeColor ?? 'amber'}`}>{step.badge}</span> : null}
                </div>
                {step.title && <h4 className="pab-knowledge-block-title">{step.title}</h4>}
                {step.desc ? (
                  <div className="pab-knowledge-rich">
                    <HtmlBlock html={step.desc} />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      );
    case 'bullet-list':
      return (
        <div className="pab-knowledge-list-block">
          {block.title && <h4 className="pab-knowledge-block-title">{block.title}</h4>}
          <ul className="pab-knowledge-list">
            {block.items?.map((item, index) => (
              <li key={index} className="pab-knowledge-rich">
                <HtmlBlock html={item} />
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return (
        <div className="pab-knowledge-callout color-amber">
          {block.title && <h4 className="pab-knowledge-callout-title">{block.title}</h4>}
          <div className="pab-knowledge-rich">
            <HtmlBlock html={block.content ?? block.text} />
          </div>
        </div>
      );
  }
}

export function CourseKnowledgeContent({
  knowledge,
  quizHref
}: {
  knowledge: CourseKnowledgeData;
  quizHref: string;
}) {
  const sections = knowledge.knowledgeSections ?? [];

  return (
    <section className="pab-knowledge">
      <div className="pab-knowledge-layout">
        <aside className="pab-knowledge-nav" aria-label="สารบัญบทเรียน">
          <div className="pab-knowledge-nav-label">สารบัญ</div>
          <nav>
            {sections.map((section, sectionIndex) => (
              <a key={`${section.title ?? 'section'}-${sectionIndex}`} href={`#knowledge-section-${sectionIndex + 1}`}>
                <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
                <strong>{section.navLabel ?? section.title}</strong>
              </a>
            ))}
            {knowledge.vocabularyGroups?.length ? <a href="#knowledge-vocabulary"><span>คำ</span><strong>คำศัพท์และคำสำคัญ</strong></a> : null}
            {knowledge.tips?.length ? <a href="#knowledge-tips"><span>จำ</span><strong>ทริคจำก่อนลงสนาม</strong></a> : null}
          </nav>
          <Link className="pab-knowledge-quiz-link" href={quizHref}>
            <span className="pab-knowledge-quiz-icon">✓</span>
            <span>
              <small>เริ่มฝึก</small>
              <strong>{quizHref.endsWith('/quiz') ? 'ทำข้อสอบ' : 'ลานฝึก'}</strong>
            </span>
            <span className="pab-knowledge-quiz-arrow" aria-hidden="true">→</span>
          </Link>
        </aside>

        <div className="pab-knowledge-main">
          <div className="pab-knowledge-sections">
        {sections.map((section: KnowledgeSection, sectionIndex: number) => (
          <section id={`knowledge-section-${sectionIndex + 1}`} key={`${section.title ?? 'section'}-${sectionIndex}`} className="pab-knowledge-section">
            <div className="pab-knowledge-section-header">
              <div className="pab-knowledge-section-icon">{section.icon ?? section.navIcon ?? '📘'}</div>
              <div>
                {section.navLabel ? <div className="pab-knowledge-section-chip">{section.navLabel}</div> : null}
                {section.title ? <h3 className="pab-knowledge-section-title">{section.title}</h3> : null}
                {section.description ? <p className="pab-knowledge-section-desc">{section.description}</p> : null}
              </div>
            </div>
            <div className="pab-knowledge-blocks">
              {section.blocks?.map((block, blockIndex) => (
                <BlockRenderer key={`${block.type}-${blockIndex}`} block={block} />
              ))}
            </div>
          </section>
        ))}
          </div>

      {(knowledge.vocabularyGroups?.length || knowledge.tips?.length) ? (
        <section className="pab-knowledge-extras">
          {knowledge.vocabularyGroups?.length ? (
            <div className="pab-knowledge-vocab" id="knowledge-vocabulary">
              <h3 className="pab-knowledge-section-title">คำศัพท์และคำสำคัญ</h3>
              <div className="pab-knowledge-vocab-groups">
                {knowledge.vocabularyGroups.map((group, groupIndex) => (
                  <article key={`${group.groupTitle ?? 'group'}-${groupIndex}`} className="pab-knowledge-vocab-group">
                    <div className="pab-knowledge-vocab-group-title">
                      <span>{group.icon ?? '📚'}</span>
                      <span>{group.groupTitle}</span>
                    </div>
                    <div className="pab-knowledge-vocab-items">
                      {group.terms?.map((term, termIndex) => (
                        <div key={`${term.term}-${termIndex}`} className="pab-knowledge-vocab-item">
                          <strong>{term.term}</strong>
                          {term.eng ? <span className="pab-knowledge-vocab-eng">{term.eng}</span> : null}
                          {term.def ? <p>{term.def}</p> : null}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {knowledge.tips?.length ? (
            <div className="pab-knowledge-tips" id="knowledge-tips">
              <h3 className="pab-knowledge-section-title">ทริคจำก่อนลงสนาม</h3>
              <ul className="pab-knowledge-list">
                {knowledge.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="pab-knowledge-rich">
                    <HtmlBlock html={tip} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
        </div>
      </div>
    </section>
  );
}

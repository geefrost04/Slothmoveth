'use client';

import { Fragment, useState } from 'react';
import shared from './StudySheetReader.module.css';
import styles from './SarabanLesson.module.css';
import { SARABAN_LESSONS, type LessonBlock, type SarabanLesson } from './sarabanLessonData';

// Renders "**bold**" segments inside lesson strings.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => (
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={index} className={styles.hl}>{part.slice(2, -2)}</strong>
          : <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}

function SectionHeader({ index, eyebrow, title, intro }: { index: number; eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIndex}>{String(index).padStart(2, '0')}</span>
      <div>
        {eyebrow ? <span className={styles.sectionEyebrow}>{eyebrow}</span> : null}
        <h2>{title}</h2>
        {intro ? <p><Rich text={intro} /></p> : null}
      </div>
    </div>
  );
}

function Block({ block, index }: { block: LessonBlock; index: number }) {
  switch (block.type) {
    case 'code':
      return (
        <section className={`${styles.section} ${styles.notebook}`}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.codeStrip}>
            {block.parts.map((part, partIndex) => (
              <div className={styles.codePart} key={`${part.text}-${partIndex}`} style={{ ['--part' as string]: part.color }}>
                <strong>{part.text}</strong>
                <span>{part.label}</span>
              </div>
            ))}
          </div>
          {block.note ? <p className={styles.tableNote}><Rich text={block.note} /></p> : null}
        </section>
      );
    case 'mindmap':
      return (
        <section className={`${styles.section} ${styles.notebook}`}>
          <SectionHeader index={index} eyebrow="Mind map" title={block.title} />
          <div className={styles.mindmap}>
            <div className={styles.mindCenter}><span>{block.center}</span></div>
            <div className={styles.mindBranches}>
              {block.branches.map((branch) => (
                <div className={styles.mindBranch} key={branch.label} style={{ ['--branch' as string]: branch.color }}>
                  <strong>{branch.label}</strong>
                  <ul>{branch.leaves.map((leaf) => <li key={leaf}>{leaf}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'cards':
      return (
        <section className={`${styles.section} ${styles.notebook}`}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.cardGrid}>
            {block.items.map((item) => (
              <article className={styles.card} key={item.name} style={item.accent ? { borderTopColor: item.accent } : undefined}>
                {item.tag ? <span className={styles.cardTag}>{item.tag}</span> : null}
                <h3>{item.name}</h3>
                {item.sub ? <p className={styles.cardSub}><Rich text={item.sub} /></p> : null}
                {item.points?.length ? (
                  <ul>
                    {item.points.map((point) => <li key={point}><Rich text={point} /></li>)}
                  </ul>
                ) : null}
                {item.example ? <div className={styles.cardExample}><span>ตัวอย่าง</span><p><Rich text={item.example} /></p></div> : null}
              </article>
            ))}
          </div>
        </section>
      );
    case 'table':
      return (
        <section className={styles.section}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} data-label={block.columns[cellIndex]}><Rich text={cell} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? <p className={styles.tableNote}><Rich text={block.note} /></p> : null}
        </section>
      );
    case 'steps':
      return (
        <section className={styles.section}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <ol className={styles.steps}>
            {block.items.map((item, stepIndex) => (
              <li key={item.title}>
                <span className={styles.stepNo}>{stepIndex + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p><Rich text={item.desc} /></p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    case 'numbers':
      return (
        <section className={styles.section}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.numberGrid}>
            {block.items.map((item) => (
              <div className={styles.numberTile} key={item.label}>
                <strong>{item.value}<small>{item.unit}</small></strong>
                <span><Rich text={item.label} /></span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'compare':
      return (
        <section className={styles.section}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.compare}>
            {[block.left, block.right].map((side) => (
              <div className={styles.compareSide} key={side.title}>
                <h3>{side.title}</h3>
                <ul>{side.points.map((point) => <li key={point}><Rich text={point} /></li>)}</ul>
              </div>
            ))}
          </div>
          {block.verdict ? <p className={styles.compareVerdict}><Rich text={block.verdict} /></p> : null}
        </section>
      );
    case 'letter':
      return (
        <section className={styles.section}>
          <SectionHeader index={index} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={styles.letterLayout}>
            <div className={styles.letterPaper} aria-label={block.title}>
              {block.noCrest ? null : <div className={styles.letterCrest} aria-hidden="true"><span>ครุฑ</span><small>สูง 3 ซม.</small></div>}
              {block.lines.map((line) => (
                <div key={line.label} className={`${styles.letterLine} ${styles[`align_${line.align ?? 'left'}`]}`}>
                  <span className={styles.letterPin}>{line.pin}</span>
                  <span className={styles.letterText}>{line.sample}</span>
                </div>
              ))}
            </div>
            <ol className={styles.letterLegend}>
              {block.lines.map((line) => (
                <li key={line.label}>
                  <span className={styles.letterPin}>{line.pin}</span>
                  <div>
                    <strong>{line.label}</strong>
                    <p><Rich text={line.rule} /></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    case 'callout':
      return (
        <aside className={`${styles.callout} ${styles[`callout_${block.tone}`]}`}>
          <span className={styles.calloutIcon} aria-hidden="true">{block.tone === 'warn' ? '!' : block.tone === 'law' ? '§' : '✦'}</span>
          <div>
            <strong>{block.title}</strong>
            <p><Rich text={block.body} /></p>
          </div>
        </aside>
      );
    default:
      return null;
  }
}

function QuizCard({ item, number }: { item: SarabanLesson['quiz'][number]; number: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  return (
    <article className={styles.quizCard}>
      <p className={styles.quizQuestion}><span>ข้อ {number}</span><Rich text={item.q} /></p>
      <div className={styles.quizChoices}>
        {item.choices.map((choice, index) => {
          const state = !answered ? '' : index === item.answer ? styles.choiceRight : index === picked ? styles.choiceWrong : styles.choiceDim;
          return (
            <button type="button" key={choice} className={`${styles.quizChoice} ${state}`} onClick={() => setPicked(index)} disabled={answered}>
              <span>{['ก', 'ข', 'ค', 'ง'][index]}</span>{choice}
            </button>
          );
        })}
      </div>
      {answered ? (
        <p className={styles.quizWhy}>
          <strong>{picked === item.answer ? 'ถูกต้อง' : `เฉลย: ${item.choices[item.answer]}`}</strong> <Rich text={item.why} />
        </p>
      ) : null}
    </article>
  );
}

export function SarabanLessonView({ slug }: { slug: string }) {
  const lesson = SARABAN_LESSONS.find((item) => item.slug === slug);
  if (!lesson) return null;
  let sectionIndex = 0;

  return (
    <div className={`${shared.seriesLesson} ${styles.lesson}`}>
      <section className={`${shared.lessonHero} ${styles.hero}`}>
        <div>
          <span className={shared.lessonKicker}>{lesson.kicker}</span>
          <h2>{lesson.heroTitle}</h2>
          <p><Rich text={lesson.lead} /></p>
        </div>
        <div className={shared.lessonFormulaCard} aria-label="สูตรจำ">
          <span>{lesson.formula.label}</span>
          <strong>{lesson.formula.value}</strong>
          <small>{lesson.formula.note}</small>
        </div>
      </section>

      <section className={styles.recall} aria-label="จำให้ได้ก่อน">
        <div className={styles.recallHead}>
          <span>ก่อนเลื่อนลง</span>
          <strong>จำ {lesson.recall.length} จุดนี้ให้ได้ก่อน</strong>
        </div>
        <div className={styles.recallTiles}>
          {lesson.recall.map((tile) => (
            <div key={tile.label}>
              <span>{tile.label}</span>
              <strong><Rich text={tile.value} /></strong>
            </div>
          ))}
        </div>
      </section>

      {lesson.blocks.map((block, index) => {
        if (block.type !== 'callout') sectionIndex += 1;
        return <Block block={block} index={sectionIndex} key={`${block.type}-${index}`} />;
      })}

      {lesson.traps.length ? (
        <section className={styles.section}>
          <SectionHeader index={sectionIndex + 1} eyebrow="Exam Traps" title="จุดที่ข้อสอบชอบหลอก" intro="อ่านก่อนทำโจทย์ ช่วยกันจำสลับ" />
          <div className={styles.trapGrid}>
            {lesson.traps.map((trap) => (
              <div className={styles.trap} key={trap.wrong}>
                <p className={styles.trapWrong}><span>✕</span><Rich text={trap.wrong} /></p>
                <p className={styles.trapRight}><span>✓</span><Rich text={trap.right} /></p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.quiz.length ? (
        <section className={styles.section}>
          <SectionHeader index={sectionIndex + 2} eyebrow="Check yourself" title="ลองตอบ ก่อนไปบทถัดไป" intro="กดเลือกคำตอบเพื่อดูเฉลยทันที" />
          <div className={styles.quizGrid}>
            {lesson.quiz.map((item, index) => <QuizCard item={item} number={index + 1} key={item.q} />)}
          </div>
        </section>
      ) : null}

      <section className={shared.lessonSummary}>
        <h2>สรุปบทนี้ในประโยคเดียว</h2>
        <p><Rich text={lesson.summary} /></p>
      </section>
    </div>
  );
}

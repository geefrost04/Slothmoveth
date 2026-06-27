/**
 * Police Admin Data Loader — reads auto-generated TypeScript modules.
 *
 * Phase A2: 1,380 quiz items migrated across 6 subjects.
 *   math (180) + thai (300) + computer (600) + saraban (100) +
 *   law (100) + english (100)
 *
 * Flashcard / match / cloze are derived from quiz data via adapters
 * in src/lib/adapters/quiz-to-games.ts (same pattern as PAB).
 *
 * Current custom-game status:
 *   - analogy / series / compare-values / word-problem /
 *     speed-percent already have data support
 *   - number-match / process-sort / computer-logic / dialogue /
 *     error-detector / flashcard-review still return [] for now
 */

import type { CourseConfig, GameId } from '@/lib/course-types';
import { quizToMatch, quizToCloze } from '@/lib/adapters/quiz-to-games';

import * as PAData from './data';

type PAModule = { [k: string]: any };
const PA_MODULES = PAData as PAModule;

const SARABAN_CATEGORY_LABELS: Record<string, string> = {
  OFFICIAL_DOCUMENT_DEFINITION: 'นิยามงานสารบรรณ',
  ELECTRONIC_SARABAN: 'สารบรรณอิเล็กทรอนิกส์',
  AUTHORITY_AND_RESPONSIBILITY: 'อำนาจหน้าที่',
  DOCUMENT_TYPES: 'ชนิดหนังสือราชการ',
  COMMAND_AND_ORDER: 'คำสั่ง ระเบียบ ข้อบังคับ',
  DOCUMENT_FORMAT: 'รูปแบบหนังสือ',
  REPORTING_AND_PROPOSAL: 'รายงานและการเสนอเรื่อง',
  URGENT_DOCUMENTS: 'หนังสือด่วน',
  CLASSIFIED_DOCUMENTS: 'หนังสือลับ',
  COPY_AND_CERTIFICATION: 'สำเนาและการรับรอง',
  DOCUMENT_NUMBERING: 'เลขหนังสือ',
  DOCUMENT_REGISTRATION: 'ทะเบียนหนังสือ',
  DOCUMENT_STORAGE: 'การเก็บรักษา',
  DOCUMENT_DESTRUCTION: 'การทำลายหนังสือ',
  DOCUMENT_WRITING: 'การเขียนหนังสือ',
  DOCUMENT_DELIVERY: 'การส่งหนังสือ',
  POLICE_SARABAN: 'สารบรรณตำรวจ',
  POLICE_CODES: 'รหัสหนังสือและหน่วยงาน',
  POLICE_ENGLISH: 'คำศัพท์อังกฤษราชการ',
  POLICE_TRAFFIC: 'งานจราจร',
  POLICE_POST: 'งานสายตรวจและประจำวัน',
  GENERAL_SARABAN: 'สารบรรณทั่วไป'
};

/**
 * Sanitize the explanation string for safe rendering.
 * Police_admin explanations contain raw HTML like `<br>` and `<strong>`.
 * React escapes HTML in text nodes, so we need to convert these to
 * plain-text equivalents BEFORE the data reaches the game components.
 *
 *   <br>      -> \n
 *   </br>     -> \n
 *   <strong>X</strong> -> **X**
 *   <b>X</b>           -> **X**
 *   <em>X</em>         -> _X_
 *   <i>X</i>           -> _X_
 */
function sanitizeExplanation(s: string): string {
  if (!s || typeof s !== 'string') return s || '';
  return s
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*br\s*>/gi, '\n')
    .replace(/<\s*strong\s*>(.*?)<\s*\/\s*strong\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*strong\s*>/gi, '')
    .replace(/<\s*b\s*>(.*?)<\s*\/\s*b\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*b\s*>/gi, '')
    .replace(/<\s*em\s*>(.*?)<\s*\/\s*em\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*em\s*>/gi, '')
    .replace(/<\s*i\s*>(.*?)<\s*\/\s*i\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*i\s*>/gi, '');
}

function stripChoicePrefix(text: string): string {
  return String(text || '')
    .replace(/^[ก-ฮA-Za-z0-9]+\.\s*/u, '')
    .trim();
}

function stripHtml(text: string): string {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(text: string): string {
  return stripHtml(text).split(/[.\n]/)[0]?.trim() ?? '';
}

function deriveSortingFromSarabanQuiz(quiz: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];

  for (const q of quiz) {
    if (!q || !Array.isArray(q.choices) || typeof q.answer !== 'number') continue;
    const word = stripChoicePrefix(q.choices[q.answer] ?? '');
    const explanation = firstSentence(q.explanation);
    if (!word || !explanation) continue;
    const dedupeKey = `${word}::${q.category || ''}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    result.push({
      word,
      category: q.category || 'GENERAL_SARABAN',
      categoryName: SARABAN_CATEGORY_LABELS[q.category] || 'สารบรรณ',
      explanation
    });
    if (result.length >= 60) break;
  }

  return result;
}

function deriveTrueFalseFromSarabanQuiz(quiz: any[]): any[] {
  const result: any[] = [];

  for (let i = 0; i < quiz.length; i += 1) {
    const q = quiz[i];
    if (!q || typeof q.question !== 'string' || !Array.isArray(q.choices) || typeof q.answer !== 'number') continue;
    const correct = stripChoicePrefix(q.choices[q.answer] ?? '');
    const wrongChoices = q.choices
      .filter((_: any, index: number) => index !== q.answer)
      .map((choice: string) => stripChoicePrefix(choice))
      .filter(Boolean);
    const wrong = wrongChoices[0];
    if (!correct || !wrong) continue;

    const makeTrue = i % 2 === 0;
    const picked = makeTrue ? correct : wrong;
    result.push({
      statement: `สำหรับคำถาม "${q.question}" คำตอบที่ถูกต้องคือ "${picked}"`,
      answer: makeTrue,
      explain: `เฉลยที่ถูกคือ "${correct}"${q.explanation ? ` · ${firstSentence(q.explanation)}` : ''}`
    });
    if (result.length >= 20) break;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                            Derive flashcard from quiz                       */
/* -------------------------------------------------------------------------- */

/**
 * Build a flashcard set from quiz data:
 *   front = question
 *   back  = "คำตอบ: <correct> — <first line of explanation>"
 *
 * Caps at 60 cards per subject to keep the review session short.
 */
function deriveFlashcardFromQuiz(quiz: any[]): { front: string; back: string }[] {
  const result: { front: string; back: string }[] = [];
  for (const q of quiz) {
    if (!q || typeof q.question !== 'string' || !Array.isArray(q.choices)) continue;
    const correct = String(q.choices[q.answer] ?? '');
    if (!correct) continue;
    const explain = (typeof q.explanation === 'string' ? q.explanation : '').trim();
    // First line of explanation (after stripping HTML if any) gives concise rationale.
    const firstLine = explain
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[.\n]/)[0]
      .trim();
    const back = firstLine ? `${correct} — ${firstLine}` : correct;
    result.push({
      front: q.question.length > 200 ? q.question.slice(0, 199) + '…' : q.question,
      back
    });
    if (result.length >= 60) break;
  }
  return result;
}

function deriveEnglishClozeFromQuiz(quiz: any[]): any[] {
  return quiz
    .filter((q: any) =>
      q &&
      typeof q.question === 'string' &&
      q.question.includes('___') &&
      Array.isArray(q.choices) &&
      ['vocabulary', 'grammar'].includes(q.category)
    )
    .map((q: any) => ({
      text: q.question,
      blanks: [String(q.choices[q.answer] ?? '')],
      options: q.choices.map((choice: string) => String(choice)),
      explanation: sanitizeExplanation(q.explanation || ''),
      hint: q.hint || '',
      category: q.category === 'grammar' ? 'Grammar / Structure' : 'Vocabulary / Collocation'
    }))
    .slice(0, 80);
}

function englishQuizByCategory(quiz: any[], category: string): any[] {
  return quiz
    .filter((q: any) => q?.category === category)
    .map((q: any) => ({
      ...q,
      explanation: sanitizeExplanation(q.explanation)
    }));
}

function mapSarabanCategory(category?: string): string {
  const mapping: Record<string, string> = {
    OFFICIAL_DOCUMENT_DEFINITION: 'ความหมายและขอบข่ายงานสารบรรณ',
    ELECTRONIC_SARABAN: 'สารบรรณอิเล็กทรอนิกส์',
    AUTHORITY_AND_RESPONSIBILITY: 'อำนาจหน้าที่ ใครทำอะไร',
    DOCUMENT_TYPES: 'ชนิดหนังสือราชการ',
    COMMAND_AND_ORDER: 'คำสั่ง ระเบียบ และข้อบังคับ',
    DOCUMENT_FORMAT: 'รูปแบบหนังสือและการจัดทำ',
    REPORTING_AND_PROPOSAL: 'รายงาน การบันทึก และการเสนอเรื่อง',
    URGENT_DOCUMENTS: 'หนังสือด่วนและชั้นความเร็ว',
    CLASSIFIED_DOCUMENTS: 'หนังสือลับและชั้นความลับ',
    COPY_AND_CERTIFICATION: 'สำเนาและการรับรอง',
    DOCUMENT_NUMBERING: 'เลขที่หนังสือและรหัส',
    DOCUMENT_REGISTRATION: 'ทะเบียนรับ-ส่งและตรารับ',
    DOCUMENT_STORAGE: 'การเก็บรักษาหนังสือ',
    DOCUMENT_DESTRUCTION: 'การทำลายหนังสือ',
    DOCUMENT_WRITING: 'การเขียนหนังสือราชการ',
    DOCUMENT_DELIVERY: 'การส่งหนังสือและการจ่าหน้าซอง',
    POLICE_SARABAN: 'งานสารบรรณตำรวจ',
    POLICE_CODES: 'รหัสหน่วยงานตำรวจ',
    POLICE_ENGLISH: 'ชื่ออังกฤษหน่วยงานตำรวจ',
    POLICE_TRAFFIC: 'ระเบียบจราจรที่เกี่ยวข้อง',
    POLICE_POST: 'งานสารบรรณสถานีตำรวจ',
    GENERAL_SARABAN: 'สารบรรณทั่วไป'
  };
  return mapping[category || ''] || 'สารบรรณทั่วไป';
}

function normalizeFlashcardText(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[“”"'`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveSarabanFlashcards(
  quiz: any[],
  curated: any[]
): { front: string; back: string; tag?: string }[] {
  const result: { front: string; back: string; tag?: string }[] = Array.isArray(curated) ? [...curated] : [];
  const seenFront = new Set(result.map((item) => `${item.tag || ''}::${normalizeFlashcardText(item.front)}`));
  const seenMeaning = new Set(
    result.map((item) => `${item.tag || ''}::${normalizeFlashcardText(item.back)}`)
  );

  for (const q of quiz) {
    if (!q || typeof q.question !== 'string' || !Array.isArray(q.choices)) continue;
    const rawCorrect = String(q.choices[q.answer] ?? '').trim();
    const correct = stripChoicePrefix(rawCorrect);
    if (!correct) continue;

    const explain = (typeof q.explanation === 'string' ? q.explanation : '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const tag = mapSarabanCategory(q.category);
    const front = q.question.length > 220 ? q.question.slice(0, 219) + '…' : q.question;
    const frontKey = `${tag}::${normalizeFlashcardText(front)}`;

    const back = explain
      ? `**${correct}**\n• ${explain}`
      : `**${correct}**`;
    const meaningKey = `${tag}::${normalizeFlashcardText(correct)}::${normalizeFlashcardText(explain)}`;

    if (seenFront.has(frontKey) || seenMeaning.has(meaningKey)) continue;

    result.push({ front, back, tag });
    seenFront.add(frontKey);
    seenMeaning.add(meaningKey);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                            getSubjectData (main API)                       */
/* -------------------------------------------------------------------------- */

export function getSubjectData(
  course: CourseConfig,
  subjectId: string,
  game: GameId
): any[] {
  if (course.id !== 'police_admin') return [];
  const mathQuiz = PA_MODULES['math_quiz'];

  // Quiz is the canonical data — read directly.
  if (game === 'quiz') {
    const moduleData = PA_MODULES[`${subjectId}_quiz`];
    if (!Array.isArray(moduleData)) return [];
    return moduleData.map((q: any) => ({
      ...q,
      explanation: sanitizeExplanation(q.explanation)
    }));
  }

  if (game === 'survival') {
    if (!Array.isArray(mathQuiz)) return [];
    return mathQuiz.map((q: any) => ({
      ...q,
      explanation: sanitizeExplanation(q.explanation)
    }));
  }

  if (game === 'speed') {
    if (!Array.isArray(mathQuiz)) return [];
    return mathQuiz
      .filter((q: any) => ['math', 'series', 'analogy'].includes(q?.category))
      .map((q: any) => ({
        ...q,
        explanation: sanitizeExplanation(q.explanation)
      }));
  }

  if (game === 'matrix' || game === 'logic') {
    if (!Array.isArray(mathQuiz)) return [];
    return mathQuiz
      .filter((q: any) => q?.category === game)
      .map((q: any) => ({
        ...q,
        explanation: sanitizeExplanation(q.explanation)
      }));
  }

  // Flashcard / match / cloze / spelling / order are derived or loaded from custom games.
  if (game === 'flashcard' || game === 'match' || game === 'cloze' || game === 'spelling' || game === 'order' || game === 'sorting' || game === 'truefalse') {
    if (subjectId === 'thai' && game === 'flashcard') {
      const data = PA_MODULES['thai_flashcard'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'thai' && game === 'match') {
      const data = PA_MODULES['thai_match'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'thai' && game === 'spelling') {
      const data = PA_MODULES['thai_spelling'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'thai' && game === 'order') {
      const data = PA_MODULES['thai_order'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'computer' && (game === 'sorting' || game === 'truefalse')) {
      const data = PA_MODULES['computer_sorting'];
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        ...item,
        explanation: sanitizeExplanation(item.explanation)
      }));
    }
    if (subjectId === 'saraban' && game === 'order') {
      const data = PA_MODULES['saraban_order'];
      return Array.isArray(data) ? data : [];
    }
    const quiz = PA_MODULES[`${subjectId}_quiz`];
    if (!Array.isArray(quiz) || quiz.length === 0) return [];

    if (game === 'flashcard') {
      if (subjectId === 'saraban') {
        const data = PA_MODULES['saraban_flashcard'];
        return deriveSarabanFlashcards(
          quiz.map((q: any) => ({
            ...q,
            explanation: sanitizeExplanation(q.explanation)
          })),
          Array.isArray(data) ? data : []
        );
      }
      if (subjectId === 'law') {
        const data = PA_MODULES['law_flashcard'];
        return Array.isArray(data) ? data : [];
      }
      if (subjectId === 'english') {
        const data = PA_MODULES['english_flashcard'];
        return Array.isArray(data) ? data : [];
      }
      // Quiz data has sanitized explanations; pass through.
      return deriveFlashcardFromQuiz(quiz.map((q: any) => ({
        ...q,
        explanation: sanitizeExplanation(q.explanation)
      })));
    }
    if (game === 'match') {
      if (subjectId === 'saraban') {
        const data = PA_MODULES['saraban_match'];
        return Array.isArray(data) ? data : [];
      }
      return quiz
        .map((item: any) => {
          if (!item || typeof item.question !== 'string' || !Array.isArray(item.choices)) return null;
          return quizToMatch(item);
        })
        .filter((x: any) => x && x.left && x.right)
        .slice(0, 60);
    }
    if (game === 'cloze') {
      if (subjectId === 'saraban') {
        const data = PA_MODULES['saraban_cloze'];
        return Array.isArray(data) ? data : [];
      }
      if (subjectId === 'english') {
        return deriveEnglishClozeFromQuiz(quiz.map((q: any) => ({
          ...q,
          explanation: sanitizeExplanation(q.explanation)
        })));
      }
      return quiz
        .map((item: any) => {
          if (!item || typeof item.question !== 'string' || !Array.isArray(item.choices)) return null;
          return quizToCloze({ ...item, explanation: sanitizeExplanation(item.explanation) });
        })
        .filter((x: any) => x !== null)
        .slice(0, 60);
    }
    if (subjectId === 'saraban' && game === 'sorting') {
      return deriveSortingFromSarabanQuiz(
        quiz.map((q: any) => ({
          ...q,
          explanation: sanitizeExplanation(q.explanation)
        }))
      );
    }
    if (subjectId === 'saraban' && game === 'truefalse') {
      const data = PA_MODULES['saraban_truefalse'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'law' && game === 'truefalse') {
      const data = PA_MODULES['law_truefalse'];
      return Array.isArray(data) ? data : [];
    }
  }

  if (subjectId === 'english' && game === 'dialogue') {
    const quiz = PA_MODULES['english_quiz'];
    return Array.isArray(quiz) ? englishQuizByCategory(quiz, 'conversation') : [];
  }

  if (subjectId === 'english' && game === 'error-detector') {
    const quiz = PA_MODULES['english_quiz'];
    return Array.isArray(quiz) ? englishQuizByCategory(quiz, 'grammar') : [];
  }

  // Math-specific games: analogy, series, compare-values, word-problem,
  // speed-percent. Data lives in dedicated `${subjectId}_${game}.ts`
  // modules generated by scripts/migrate-math-games.mjs (40/20/??/57/27
  // items respectively for math). For non-math subjects these return [].
  if (game === 'analogy' || game === 'series' || game === 'word-problem' || game === 'speed-percent') {
    const moduleData = PA_MODULES[`math_${game.replace('-', '_')}`];
    if (!Array.isArray(moduleData)) return [];
    return moduleData.map((q: any) => ({
      ...q,
      explanation: sanitizeExplanation(q.explanation)
    }));
  }
  if (game === 'compare-values') {
    // Inline derivation: filter math quiz for comparison-style questions
    // (pattern in comparison/ratio OR has เปรียบเทียบ/มากกว่า keyword).
    const quiz = PA_MODULES['math_quiz'];
    if (!Array.isArray(quiz)) return [];
    return quiz
      .filter((q: any) => {
        if (!q || !q.pattern) return false;
        return ['ratio', 'comparison', 'function'].includes(q.pattern) ||
          (typeof q.question === 'string' && /(เปรียบเทียบ|มากกว่า|น้อยกว่า|มากที่สุด|น้อยที่สุด)/.test(q.question));
      })
      .map((q: any) => ({
        ...q,
        explanation: sanitizeExplanation(q.explanation)
      }));
  }

  if (game === 'authority') {
    if (subjectId === 'saraban') {
      const data = PA_MODULES['saraban_authority'];
      return Array.isArray(data) ? data : [];
    }
    if (subjectId === 'law') {
      const data = PA_MODULES['law_authority'];
      return Array.isArray(data) ? data : [];
    }
    return [];
  }

  // Remaining custom games still have no data source wired yet.
  return [];
}

export function getSubjectItemCount(subjectId: string, game: GameId): number {
  const mathQuiz = PA_MODULES['math_quiz'];

  if (game === 'quiz') {
    const data = PA_MODULES[`${subjectId}_quiz`];
    return Array.isArray(data) ? data.length : 0;
  }
  // Flashcard / match / cloze / spelling / order: count = min(quiz length, cap).
  // Cap is 60 (see deriveFlashcardFromQuiz / slice(0, 60)).
  if (game === 'flashcard' || game === 'match' || game === 'cloze' || game === 'spelling' || game === 'order' || game === 'sorting' || game === 'truefalse') {
    if (subjectId === 'thai' && game === 'flashcard') {
      const data = PA_MODULES['thai_flashcard'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'thai' && game === 'match') {
      const data = PA_MODULES['thai_match'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'thai' && game === 'spelling') {
      const data = PA_MODULES['thai_spelling'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'thai' && game === 'order') {
      const data = PA_MODULES['thai_order'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'computer' && (game === 'sorting' || game === 'truefalse')) {
      const data = PA_MODULES['computer_sorting'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'saraban' && game === 'order') {
      const data = PA_MODULES['saraban_order'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'saraban' && game === 'truefalse') {
      const data = PA_MODULES['saraban_truefalse'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'law' && game === 'truefalse') {
      const data = PA_MODULES['law_truefalse'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'law' && game === 'flashcard') {
      const data = PA_MODULES['law_flashcard'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'english' && game === 'flashcard') {
      const data = PA_MODULES['english_flashcard'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'english' && game === 'cloze') {
      const data = PA_MODULES['english_quiz'];
      return Array.isArray(data) ? deriveEnglishClozeFromQuiz(data).length : 0;
    }
    const data = PA_MODULES[`${subjectId}_quiz`];
    if (!Array.isArray(data) || data.length === 0) return 0;
    return Math.min(data.length, 60);
  }
  if (subjectId === 'english' && game === 'dialogue') {
    const data = PA_MODULES['english_quiz'];
    return Array.isArray(data) ? data.filter((q: any) => q?.category === 'conversation').length : 0;
  }
  if (subjectId === 'english' && game === 'error-detector') {
    const data = PA_MODULES['english_quiz'];
    return Array.isArray(data) ? data.filter((q: any) => q?.category === 'grammar').length : 0;
  }
  // Math-specific games (Phase B): read from dedicated modules.
  if (game === 'analogy' || game === 'series' || game === 'word-problem' || game === 'speed-percent') {
    const data = PA_MODULES[`math_${game.replace('-', '_')}`];
    return Array.isArray(data) ? data.length : 0;
  }
  if (game === 'compare-values') {
    if (!Array.isArray(mathQuiz)) return 0;
    return mathQuiz.filter((q: any) =>
      ['ratio', 'comparison', 'function'].includes(q.pattern) ||
      (typeof q.question === 'string' && /(เปรียบเทียบ|มากกว่า|น้อยกว่า|มากที่สุด|น้อยที่สุด)/.test(q.question))
    ).length;
  }
  if (game === 'survival') {
    return Array.isArray(mathQuiz) ? mathQuiz.length : 0;
  }
  if (game === 'speed') {
    if (!Array.isArray(mathQuiz)) return 0;
    return mathQuiz.filter((q: any) => ['math', 'series', 'analogy'].includes(q?.category)).length;
  }
  if (game === 'matrix' || game === 'logic') {
    if (!Array.isArray(mathQuiz)) return 0;
    return mathQuiz.filter((q: any) => q?.category === game).length;
  }
  if (game === 'authority') {
    if (subjectId === 'saraban') {
      const data = PA_MODULES['saraban_authority'];
      return Array.isArray(data) ? data.length : 0;
    }
    if (subjectId === 'law') {
      const data = PA_MODULES['law_authority'];
      return Array.isArray(data) ? data.length : 0;
    }
    return 0;
  }
  // Other games: 0 (no data yet).
  return 0;
}

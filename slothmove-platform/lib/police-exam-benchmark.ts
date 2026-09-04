/**
 * Police Admin Examination Benchmark & Dual-Cutoff Evaluation
 * 
 * Historical Data (Royal Thai Police - Administrative Division / สายอำนวยการ):
 * - 2562: 350 intake / 95,697 applicants (1:273) -> Cutoff score: 107 / 150 (71.3%)
 * - 2565: 725 intake / 135,217 applicants (1:187) -> Cutoff score: 117 / 150 (78.0%)
 * - Official Passing Criteria:
 *   - Part A (ความรู้ความสามารถทั่วไป): >= 60% (24 / 40 questions)
 *   - Part B (ความรู้ความสามารถเฉพาะตำแหน่ง): >= 60% (66 / 110 questions)
 *   - Qualified Candidate: MUST pass both Part A AND Part B
 */

export type PoliceCategoryScore = {
  category: string;
  total: number;
  answered?: number;
  correct: number;
};

export type PolicePartEvaluation = {
  name: string;
  code: 'part_a' | 'part_b';
  categories: string[];
  total: number;
  correct: number;
  percentage: number;
  passingScore: number;
  isPassed: boolean;
  scoreDiff: number; // positive = passed by X, negative = needed X more
};

export type PoliceBenchmarkZone = 'safe' | 'competitive' | 'passed_minimum' | 'below_minimum';

export type PoliceAdmissionBenchmark = {
  score: number;
  total: number;
  percentage: number;
  isDualPart: boolean;
  isOfficialPassed: boolean;
  partA: PolicePartEvaluation;
  partB: PolicePartEvaluation;
  zone: PoliceBenchmarkZone;
  zoneLabel: string;
  zoneBadge: string;
  percentileText: string;
  estimatedRankText: string;
  advice: string;
  historicalCutoffs: {
    minimum60: number; // 90 for 150
    year2562: number;  // 107 for 150
    year2565: number;  // 117 for 150
    safeZone: number;  // 118 for 150
  };
  scoreDiffFromYear65: number;
};

const PART_A_CATEGORIES = new Set([
  'ความรู้ทั่วไป',
  'math',
  'การคิดวิเคราะห์',
  'analytical_thinking',
  'ภาษาไทย',
  'thai'
]);

const PART_B_CATEGORIES = new Set([
  'คอมพิวเตอร์',
  'computer',
  'คอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
  'งานสารบรรณ',
  'saraban',
  'ระเบียบงานสารบรรณ',
  'กฎหมาย',
  'law',
  'กฎหมายที่ประชาชนควรรู้',
  'ภาษาอังกฤษ',
  'english'
]);

export function isPartACategory(category: string): boolean {
  return PART_A_CATEGORIES.has(category.trim().toLowerCase()) ||
    PART_A_CATEGORIES.has(category.trim());
}

export function isPartBCategory(category: string): boolean {
  return PART_B_CATEGORIES.has(category.trim().toLowerCase()) ||
    PART_B_CATEGORIES.has(category.trim());
}

export function evaluatePoliceBenchmark(
  score: number,
  total: number,
  categoryResults: PoliceCategoryScore[] = []
): PoliceAdmissionBenchmark {
  let partATotal = 0;
  let partACorrect = 0;
  const partACats: string[] = [];

  let partBTotal = 0;
  let partBCorrect = 0;
  const partBCats: string[] = [];

  for (const item of categoryResults) {
    if (isPartACategory(item.category)) {
      partATotal += item.total;
      partACorrect += item.correct;
      partACats.push(item.category);
    } else if (isPartBCategory(item.category)) {
      partBTotal += item.total;
      partBCorrect += item.correct;
      partBCats.push(item.category);
    } else {
      // Default fallback: if unidentified, attribute to part B if total is already over 40
      partBTotal += item.total;
      partBCorrect += item.correct;
      partBCats.push(item.category);
    }
  }

  // If no category results provided or couldn't separate, estimate by standard 40 / 110 proportion
  if (partATotal === 0 && partBTotal === 0 && total > 0) {
    const isStandard150 = total === 150;
    partATotal = isStandard150 ? 40 : Math.round(total * (40 / 150));
    partBTotal = total - partATotal;
    const ratio = total > 0 ? score / total : 0;
    partACorrect = Math.round(partATotal * ratio);
    partBCorrect = score - partACorrect;
  }

  const isDualPart = partATotal > 0 && partBTotal > 0;
  const partAPassing = Math.ceil(partATotal * 0.6);
  const partBPassing = Math.ceil(partBTotal * 0.6);

  const partAPercent = partATotal > 0 ? Math.round((partACorrect / partATotal) * 100) : 0;
  const partBPercent = partBTotal > 0 ? Math.round((partBCorrect / partBTotal) * 100) : 0;
  const overallPercent = total > 0 ? Math.round((score / total) * 100) : 0;

  const partAPassed = partACorrect >= partAPassing;
  const partBPassed = partBCorrect >= partBPassing;
  const isOfficialPassed = isDualPart ? (partAPassed && partBPassed) : (overallPercent >= 60);

  const partA: PolicePartEvaluation = {
    name: 'ภาค ก (ความรู้ความสามารถทั่วไป)',
    code: 'part_a',
    categories: partACats,
    total: partATotal,
    correct: partACorrect,
    percentage: partAPercent,
    passingScore: partAPassing,
    isPassed: partAPassed,
    scoreDiff: partACorrect - partAPassing
  };

  const partB: PolicePartEvaluation = {
    name: 'ภาค ข (ความรู้ความสามารถเฉพาะตำแหน่ง)',
    code: 'part_b',
    categories: partBCats,
    total: partBTotal,
    correct: partBCorrect,
    percentage: partBPercent,
    passingScore: partBPassing,
    isPassed: partBPassed,
    scoreDiff: partBCorrect - partBPassing
  };

  // Historical cutoffs (scaled to total if not exactly 150)
  const isStandard150 = total === 150;
  const scale = (value: number) => isStandard150 ? value : Math.round(total * (value / 150));

  const minimum60 = scale(90);
  const year2562 = scale(107);
  const year2565 = scale(117);
  const safeZone = scale(118);

  const scoreDiffFromYear65 = score - year2565;

  let zone: PoliceBenchmarkZone = 'below_minimum';
  let zoneLabel = '';
  let zoneBadge = '';
  let percentileText = '';
  let estimatedRankText = '';
  let advice = '';

  if (score >= safeZone) {
    if (isDualPart && (!partAPassed || !partBPassed)) {
      zone = 'competitive';
      zoneLabel = 'คะแนนรวมสูง แต่ติดเกณฑ์รายภาค';
      zoneBadge = 'ต้องระวังเกณฑ์รายภาค';
      percentileText = 'Top 1% – 2%';
      estimatedRankText = 'ประมาณอันดับ 1 – 1,500 (จากผู้สมัครจริง 1.3 แสนคน)';
      const failedPart = !partAPassed ? 'ภาค ก' : 'ภาค ข';
      const needMore = !partAPassed ? (partAPassing - partACorrect) : (partBPassing - partBCorrect);
      advice = `คะแนนรวมของคุณสูงถึง ${score}/${total} ข้อ แต่สนามจริงมีเงื่อนไขต้องผ่าน 60% ทั้งสองภาค (ยังขาดอีก ${needMore} ข้อใน${failedPart})`;
    } else {
      zone = 'safe';
      zoneLabel = 'โซนตัวจริง (คะแนนทะลุสถิติปี 65)';
      zoneBadge = 'โอกาสติดตัวจริงสูงมาก';
      percentileText = 'Top 0.5% – 1.5%';
      estimatedRankText = 'ประมาณอันดับ 1 – 725 (จากผู้สมัครจริง 1.3 แสนคน)';
      advice = `คะแนนของคุณ (${score}/${total} ข้อ) สูงกว่าคะแนนตัดตัวจริงรอบล่าสุด (${year2565} ข้อ) รักษาความแม่นยำนี้ไว้ มีชื่อในรอบตัวจริงแน่นอน!`;
    }
  } else if (score >= year2562) {
    zone = 'competitive';
    zoneLabel = 'โซนลุ้นตัวจริง / ตัวสำรองรอบแรก';
    zoneBadge = 'ลุ้นตัวจริงสูสี';
    percentileText = 'Top 2% – 5%';
    estimatedRankText = 'ประมาณอันดับ 726 – 2,500 (จากผู้สมัครจริง 1.3 แสนคน)';
    const gap = year2565 - score + 1;
    advice = `ผ่านสถิติตัวจริงปี 62 (${year2562} ข้อ) และกำลังเบียดสถิติปี 65 (${year2565} ข้อ) แนะนำเก็บคะแนนเพิ่มอีกเพียง ${gap} ข้อเพื่อเข้าสู่ Safe Zone ตัวจริงชัวร์`;
  } else if (score >= minimum60) {
    zone = 'passed_minimum';
    zoneLabel = 'ผ่านเกณฑ์ 60% แต่ยังไม่ถึงคะแนนสอบติด';
    zoneBadge = 'ต้องสะสมคะแนนเพิ่ม';
    percentileText = 'Top 6% – 15%';
    estimatedRankText = 'ประมาณอันดับ 2,501 – 15,000 (จากผู้สมัครจริง 1.3 แสนคน)';
    const gap = year2565 - score;
    advice = `ผ่านเกณฑ์ขั้นต่ำ 60% (${minimum60} ข้อ) แล้ว แต่อัตราการแข่งขันสูง 1 : 187 คน คะแนนตัดตัวจริงปี 65 อยู่ที่ ${year2565} ข้อ ต้องเพิ่มอีก ${gap} ข้อเพื่อลุ้นตัวจริง`;
  } else {
    zone = 'below_minimum';
    zoneLabel = 'ยังไม่ผ่านเกณฑ์ขั้นต่ำ 60%';
    zoneBadge = 'ต้องเร่งทบทวน';
    percentileText = 'ต่ำกว่า Top 15%';
    estimatedRankText = 'อยู่นอกเกณฑ์คัดเลือก';
    const gap = minimum60 - score;
    advice = `ยังไม่ผ่านเกณฑ์ 60% (${minimum60} ข้อ) ของสนามสอบตำรวจ แนะนำทบทวนวิชาจุดอ่อนในสมุดข้อผิดและฝึกทำควิซรายวันสม่ำเสมอ (ต้องการอีกอย่างน้อย ${gap} ข้อ)`;
  }

  return {
    score,
    total,
    percentage: overallPercent,
    isDualPart,
    isOfficialPassed,
    partA,
    partB,
    zone,
    zoneLabel,
    zoneBadge,
    percentileText,
    estimatedRankText,
    advice,
    historicalCutoffs: {
      minimum60,
      year2562,
      year2565,
      safeZone
    },
    scoreDiffFromYear65
  };
}

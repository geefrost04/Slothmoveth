// Thai line-break helpers. Browsers split Thai with a dictionary, which often breaks compounds
// ("ไม่|เกิน", "ภาค|รัฐ", "ยุทธศาสตร์|ชาติ") and separates numbers from their units ("4 | ปี").
// thaiWrap() keeps those together: a no-break space after numbers and word joiners (U+2060)
// inside common compounds. Word joiners are invisible and never placed before a Thai combining mark.

const WJ = '⁠';
const NBSP = ' ';

// Compounds that read badly when split across lines. Longer entries first so they win over parts.
const COMPOUNDS = [
  'ผู้มีส่วนได้ส่วนเสีย', 'ราชกิจจานุเบกษา', 'สำนักนายกรัฐมนตรี', 'ผู้ว่าราชการจังหวัด', 'ยุทธศาสตร์ชาติ',
  'นายกรัฐมนตรี', 'พนักงานราชการ', 'ทรัพยากรน้ำ', 'ไม่น้อยกว่า', 'คณะกรรมการ', 'ลูกบาศก์เมตร', 'ไม่ต่ำกว่า',
  'กฎกระทรวง', 'ข้าราชการ', 'ส่วนราชการ', 'มีส่วนร่วม', 'องค์ประชุม', 'ภาวะน้ำแล้ง', 'แผนแม่บท', 'ประเมินผล',
  'ติดตามผล', 'งบประมาณ', 'ใบอนุญาต', 'น้ำบาดาล', 'วิสัยทัศน์', 'เลขาธิการ', 'วันทำการ', 'ตัวชี้วัด', 'รัฐมนตรี',
  'ผู้รักษาการ', 'สัญญาจ้าง', 'การสรรหา', 'การประชุม', 'ว่าด้วย', 'ข้อเขียน', 'ไม่เกิน', 'ภาครัฐ', 'ลุ่มน้ำ', 'น้ำท่วม', 'น้ำแล้ง', 'ล้านบาท', 'ล้านไร่', 'วันสอบ', 'สัมภาษณ์'
];

// Thai marks that combine with the previous letter; a joiner must not split them off.
const COMBINING = /[ัำ-ฺ็-๎]/;

function glue(word: string) {
  let out = '';
  for (let i = 0; i < word.length; i += 1) {
    out += word[i];
    const next = word[i + 1];
    if (next && !COMBINING.test(next)) out += WJ;
  }
  return out;
}

const GLUED = COMPOUNDS.map((word) => [word, glue(word)] as const);

export function thaiWrap(text: string): string {
  if (!text || !/[฀-๿\d]/.test(text)) return text;
  let out = text.replace(/(\d)[ \t]+(?=[^\s·|/–—\-+=×÷<>(])/g, `$1${NBSP}`);
  for (const [word, glued] of GLUED) {
    if (out.includes(word)) out = out.split(word).join(glued);
  }
  return out;
}

/** Applies thaiWrap to every string in a plain data object, skipping identifier-like keys. */
export function thaiWrapDeep<T>(value: T, skipKeys: ReadonlySet<string> = DEFAULT_SKIP): T {
  if (typeof value === 'string') return thaiWrap(value) as T;
  if (Array.isArray(value)) return value.map((item) => thaiWrapDeep(item, skipKeys)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, skipKeys.has(key) ? item : thaiWrapDeep(item, skipKeys)])
    ) as T;
  }
  return value;
}

const DEFAULT_SKIP = new Set(['slug', 'sectionType', 'type', 'tone', 'id', 'href', 'icon']);

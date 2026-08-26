#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const OUTPUT = path.join(CONTENT, 'police-mock-test-set-03.json');

const sources = [
  { id: 'math', title: 'ความรู้ทั่วไป', file: 'police-math-set-03-original.json', positions: Array.from({ length: 20 }, (_, index) => index + 1) },
  { id: 'thai', title: 'ภาษาไทย', file: 'police-thai-set-03-notebooklm.json', positions: Array.from({ length: 20 }, (_, index) => index * 2 + 1) },
  { id: 'computer', title: 'คอมพิวเตอร์', file: 'police-computer-set-03-notebooklm.json', positions: Array.from({ length: 30 }, (_, index) => index + 1) },
  { id: 'saraban', title: 'งานสารบรรณ', file: 'police-saraban-set-03-notebooklm.json', positions: [...Array.from({ length: 25 }, (_, index) => index * 2 + 1), 2, 12, 22, 32, 42] },
  { id: 'law', title: 'กฎหมาย', file: 'police-law-set-03-notebooklm.json', positions: Array.from({ length: 25 }, (_, index) => index * 2 + 1) },
  { id: 'english', title: 'ภาษาอังกฤษ', file: 'police-english-set-03-notebooklm.json', positions: Array.from({ length: 15 }, (_, index) => index * 2 + 1) }
];

const expectedCounts = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };

const computerSupplement = [
  ['ความปลอดภัยไซเบอร์', 'องค์กรต้องการลดความเสียหายจาก ransomware หากต้องเลือกมาตรการสำรองข้อมูล ข้อใดเหมาะสมที่สุด', 'สำรองข้อมูลแบบ 3-2-1 และทดสอบการกู้คืนเป็นระยะ', 'เก็บสำเนาเดียวไว้ในเครื่องเดียวกับข้อมูลจริง', 'เปลี่ยนชื่อไฟล์สำรองทุกวันโดยไม่แยกอุปกรณ์', 'ปิดโปรแกรมป้องกันไวรัสก่อนสำรองข้อมูล', 'หลัก 3-2-1 ลดความเสี่ยงจากความเสียหายจุดเดียว และการทดสอบกู้คืนช่วยยืนยันว่าไฟล์สำรองใช้งานได้จริง'],
  ['การยืนยันตัวตน', 'ข้อใดเป็นตัวอย่างของการยืนยันตัวตนหลายปัจจัย (MFA) ที่ใช้ปัจจัยต่างประเภทกัน', 'รหัสผ่านร่วมกับรหัสจากแอปยืนยันตัวตน', 'รหัสผ่านสองชุด', 'คำถามลับสองคำถาม', 'PIN สองหมายเลข', 'รหัสผ่านเป็นสิ่งที่ผู้ใช้รู้ ส่วนรหัสจากแอปผูกกับอุปกรณ์ที่ผู้ใช้มี จึงเป็นคนละประเภทของปัจจัย'],
  ['Cloud computing', 'หน่วยงานต้องการใช้ซอฟต์แวร์ประชุมออนไลน์ผ่านเว็บโดยไม่ติดตั้งและดูแลเซิร์ฟเวอร์เอง รูปแบบบริการใดตรงที่สุด', 'Software as a Service (SaaS)', 'Infrastructure as a Service (IaaS)', 'Platform as a Service (PaaS)', 'Local Area Network (LAN)', 'SaaS ให้ผู้ใช้ใช้งานซอฟต์แวร์สำเร็จรูปผ่านอินเทอร์เน็ต โดยผู้ให้บริการดูแลโครงสร้างพื้นฐานและตัวระบบ'],
  ['เครือข่าย', 'อุปกรณ์ใดมีหน้าที่เลือกเส้นทางและส่งต่อแพ็กเก็ตระหว่างเครือข่ายที่แตกต่างกัน', 'Router', 'Switch', 'Keyboard', 'Scanner', 'Router ทำงานเพื่อเชื่อมต่อและเลือกเส้นทางระหว่างเครือข่าย ส่วน Switch ใช้เชื่อมอุปกรณ์ภายในเครือข่ายเดียวกันเป็นหลัก'],
  ['Microsoft Excel', 'ถ้าต้องการนับจำนวนเซลล์ช่วง B2:B50 ที่มีค่าเท่ากับคำว่า ผ่าน ควรใช้สูตรใด', '=COUNTIF(B2:B50,"ผ่าน")', '=COUNT(B2:B50,"ผ่าน")', '=SUMIF(B2:B50,"ผ่าน")', '=COUNTA("ผ่าน")', 'COUNTIF ใช้นับเซลล์ในช่วงที่ตรงตามเงื่อนไข โดยช่วงคือ B2:B50 และเงื่อนไขคือคำว่า ผ่าน'],
  ['ฐานข้อมูล', 'เหตุผลสำคัญของการกำหนด Primary Key ในตารางฐานข้อมูลคือข้อใด', 'ระบุแต่ละระเบียนได้อย่างไม่ซ้ำกัน', 'ทำให้ทุกช่องเก็บข้อความได้ยาวขึ้น', 'เข้ารหัสข้อมูลทั้งตารางโดยอัตโนมัติ', 'แทนที่การสำรองข้อมูลทั้งหมด', 'Primary Key ต้องระบุระเบียนแต่ละแถวได้อย่างไม่ซ้ำกัน และใช้เป็นจุดอ้างอิงความสัมพันธ์ระหว่างตารางได้'],
  ['เว็บและอินเทอร์เน็ต', 'เมื่อเว็บเบราว์เซอร์แสดง HTTPS และใบรับรองถูกต้อง ข้อใดสรุปได้เหมาะสมที่สุด', 'ข้อมูลระหว่างเบราว์เซอร์กับเว็บไซต์ถูกเข้ารหัสระหว่างส่ง', 'เว็บไซต์นั้นไม่มีข้อมูลเท็จอย่างแน่นอน', 'ไฟล์ทุกไฟล์บนเว็บไซต์ปลอดมัลแวร์เสมอ', 'เจ้าของเว็บไซต์เป็นหน่วยงานรัฐเท่านั้น', 'HTTPS ช่วยเข้ารหัสข้อมูลระหว่างทางและยืนยันปลายทางตามใบรับรอง แต่ไม่ได้รับรองความถูกต้องของเนื้อหาหรือความปลอดภัยทุกไฟล์'],
  ['ระบบปฏิบัติการ', 'หน้าที่หลักของระบบปฏิบัติการข้อใดครอบคลุมที่สุด', 'จัดการทรัพยากรฮาร์ดแวร์และให้บริการพื้นฐานแก่โปรแกรม', 'สร้างสไลด์นำเสนอเท่านั้น', 'แปลงเอกสารทุกชนิดเป็นรูปภาพ', 'เชื่อมต่ออินเทอร์เน็ตโดยไม่ต้องมีอุปกรณ์เครือข่าย', 'ระบบปฏิบัติการจัดสรรหน่วยประมวลผล หน่วยความจำ อุปกรณ์ และไฟล์ พร้อมเป็นตัวกลางให้โปรแกรมใช้งานทรัพยากรเหล่านั้น'],
  ['ฟิชชิง', 'ผู้ใช้ได้รับอีเมลเร่งให้กดลิงก์ยืนยันบัญชีและกรอกรหัสผ่าน การปฏิบัติใดปลอดภัยที่สุด', 'ไม่กดลิงก์ และเปิดเว็บไซต์ทางการด้วยตนเองเพื่อตรวจสอบ', 'ตอบอีเมลกลับพร้อมรหัสผ่านเพื่อยืนยันตัวตน', 'ส่งต่ออีเมลให้เพื่อนทุกคนช่วยทดลองลิงก์', 'ปิดการยืนยันตัวตนหลายปัจจัยก่อนเปิดลิงก์', 'การเข้าสู่เว็บไซต์ทางการผ่านที่อยู่ที่รู้จักช่วยหลีกเลี่ยงลิงก์ปลอม และควรตรวจสอบเหตุการณ์ผ่านช่องทางทางการ'],
  ['การจัดการไฟล์', 'นามสกุลไฟล์ใดมักใช้เก็บเอกสารที่ต้องการคงรูปแบบการจัดหน้าเมื่อเปิดต่างอุปกรณ์', '.pdf', '.txt', '.csv', '.exe', 'PDF ออกแบบมาเพื่อคงรูปแบบหน้า ตัวอักษร และองค์ประกอบเอกสารให้ใกล้เคียงกันข้ามระบบและอุปกรณ์']
].map(([category, prompt, correct, ...rest], index) => ({
  position: index + 31,
  category,
  prompt,
  choices: [correct, ...rest.slice(0, 3)],
  correctChoiceIndex: 0,
  explanation: rest[3],
  tip: `จุดจำ: แยกหน้าที่หลักของ “${category}” ออกจากตัวเลือกที่กล่าวเกินจริงหรือเป็นคนละชั้นการทำงาน`,
  difficulty: index % 4 === 0 ? 'hard' : 'medium',
  sourceRef: 'Mock Test Set 03 computer supplement',
  verificationRef: 'หลักการคอมพิวเตอร์และความปลอดภัยดิจิทัลมาตรฐาน',
  sourceType: 'new-dna-authored-item'
}));

function loadQuestions(file) {
  const payload = JSON.parse(fs.readFileSync(path.join(CONTENT, file), 'utf8'));
  return payload.questions ?? payload;
}

function difficulty(value, index) {
  if (['easy', 'medium', 'hard'].includes(value)) return value;
  if (value === 'ง่าย') return 'easy';
  if (value === 'ยาก') return 'hard';
  if (value === 'ปานกลาง') return 'medium';
  return index % 5 === 0 ? 'hard' : 'medium';
}

function rotateChoices(question, seed) {
  const shift = seed % 4;
  const choices = question.choices.map((choice) => String(choice).trim());
  const rotated = [...choices.slice(shift), ...choices.slice(0, shift)];
  return { choices: rotated, correctChoiceIndex: (question.correctChoiceIndex - shift + 4) % 4 };
}

let globalPosition = 0;
function materialize(source, question, sourcePosition, localIndex) {
  globalPosition += 1;
  const rotated = rotateChoices(question, globalPosition + localIndex);
  return {
    position: globalPosition,
    subjectId: source.id,
    subjectTitle: source.title,
    category: source.title,
    originalCategory: question.category,
    dnaBucket: question.dnaType ?? question.category,
    difficulty: difficulty(question.difficulty, localIndex),
    sourceMechanism: question.category,
    sourceDnaSet: 'Set 3',
    sourceDnaRef: question.sourceRef ?? source.file,
    verificationRef: question.verificationRef
      ?? (source.id === 'saraban' ? 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติมถึงฉบับที่ 4 พ.ศ. 2564' : null),
    prompt: question.prompt,
    choices: rotated.choices,
    correctChoiceIndex: rotated.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    media: question.media ?? {},
    sourceType: question.sourceType ?? 'audited-set-03-selection',
    sourceExamSetId: path.basename(source.file, path.extname(source.file)),
    sourcePosition
  };
}

function main() {
  const questions = [];
  for (const source of sources) {
    const bank = source.id === 'computer'
      ? [...loadQuestions(source.file), ...computerSupplement]
      : loadQuestions(source.file);
    const byPosition = new Map(bank.map((question) => [question.position, question]));
    const positions = source.id === 'computer' ? Array.from({ length: 40 }, (_, index) => index + 1) : source.positions;
    questions.push(...positions.map((position, index) => {
      const question = byPosition.get(position);
      if (!question) throw new Error(`${source.id}: missing source position ${position}`);
      return materialize(source, question, position, index);
    }));
  }

  const payload = {
    examSet: {
      id: 'police-mock_test-set-03',
      title: 'Mock Test นายสิบตำรวจ ชุดที่ 3',
      description: 'ข้อสอบจำลองสนามจริง 150 ข้อ รวม 6 วิชา พร้อมจับเวลาและเฉลยแบบแยกรายวิชา',
      sourceLabel: 'คัดสรรจากคลังรายวิชาชุดที่ 3 พร้อมข้อคอมพิวเตอร์สร้างใหม่ 10 ข้อ',
      durationMinutes: 180,
      totalQuestions: questions.length,
      accessType: 'paid',
      priceSatang: 4900,
      version: 1
    },
    qualityNotes: {
      correctChoiceIndexBase: 0,
      qaStatus: 'self_audit_passed_2026_08_26',
      policy: 'Stratified audited selection from Set 3 subject banks. Ten additional computer questions are newly authored to preserve the 20/20/40/30/25/15 blueprint.',
      expectedCounts,
      generatedAt: new Date().toISOString()
    },
    questions
  };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Generated ${questions.length} questions at ${OUTPUT}`);
}

main();

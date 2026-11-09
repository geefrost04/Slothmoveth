// The 9 written-exam topics from the ONWR announcement (22 ต.ค. 2569), in announcement order,
// and how questions from the original subject banks map onto them.
export const TOPICS = [
  { id: 'org', group: 'general', title: 'ความรู้เกี่ยวกับ สทนช.' },
  { id: 'admin', group: 'general', title: 'การบริหารจัดการองค์กรภาครัฐ' },
  { id: 'rules', group: 'general', title: 'ระเบียบพนักงานราชการและการปฏิบัติราชการ' },
  { id: 'policy', group: 'specific', title: 'การจัดทำนโยบายและแผน' },
  { id: 'masterplan', group: 'specific', title: 'นโยบายและแผนแม่บทน้ำ' },
  { id: 'monitoring', group: 'specific', title: 'การติดตามและประเมินผลโครงการ' },
  { id: 'project', group: 'specific', title: 'การวิเคราะห์แผนงานโครงการ' },
  { id: 'meeting', group: 'specific', title: 'การบริหารจัดการประชุมและการมีส่วนร่วม' },
  { id: 'wateract', group: 'specific', title: 'พ.ร.บ.ทรัพยากรน้ำ พ.ศ. 2561' }
];

const BY_CATEGORY = {
  general: {
    org: ['สทนช.', 'โครงสร้าง สทนช.', 'ระบบงาน สทนช.'],
    masterplan: ['มาตรการน้ำ'],
    admin: ['ITA', 'PMQA', 'การบริหารภาครัฐ', 'การบริหารราชการ', 'การบริหารราชการแผ่นดิน', 'การบริหารสมัยใหม่', 'ธรรมาภิบาล', 'บริหารกิจการบ้านเมืองที่ดี', 'พ.ร.ฎ.GG', 'ยุทธศาสตร์ชาติ', 'ราชการ 4.0', 'แผน 3 ระดับ', 'แผนพัฒนาฯ', 'แผนระดับชาติ', 'แผนแม่บท'],
    rules: ['พนักงานราชการ', 'การลา', 'กฎหมายปกครอง']
  },
  water: {
    org: ['สทนช.'],
    masterplan: ['แผนแม่บทน้ำ', 'ข้อมูลน้ำ', 'แผนรายปี', 'มาตรการน้ำ', 'แผน 3 ระดับ']
    // everything else in the water bank → wateract
  },
  planning: {
    policy: ['ตัวแบบนโยบาย', 'วงจรนโยบาย', 'ประเภทนโยบาย', 'นโยบายสาธารณะ', 'การวิเคราะห์นโยบาย', 'SWOT', 'TOWS', 'Balanced Scorecard', 'การวางแผน', 'ประเภทแผน', 'เครื่องมือวางแผน', 'การกำหนดวัตถุประสงค์', 'ตัวชี้วัด', 'การระดมความคิด'],
    monitoring: ['การติดตามประเมินผล', 'การประเมินผล', 'ประเภทการประเมิน', 'รูปแบบการประเมิน', 'OECD DAC', 'ประสิทธิภาพ/ประสิทธิผล'],
    project: ['การวิเคราะห์โครงการ', 'Logframe', 'ความคุ้มค่า', 'ความเป็นไปได้ของโครงการ', 'การเขียนโครงการ', 'วงจรโครงการ', 'เครื่องมือบริหารโครงการ'],
    meeting: ['การประชุม', 'การมีส่วนร่วม', 'รายงานการประชุม', 'เทคนิคการประชุม', 'ผู้มีส่วนได้ส่วนเสีย']
  }
};

export function topicOf(bank, category) {
  for (const [topic, cats] of Object.entries(BY_CATEGORY[bank] ?? {})) if (cats.includes(category)) return topic;
  if (bank === 'water') return 'wateract';
  throw new Error(`no topic for ${bank} / ${category}`);
}

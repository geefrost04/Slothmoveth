// Official documents cited by the police course (/courses/police_admin/learn). Local copies live in
// docs/sources/police/ (not committed); the OPM saraban and law files are shared with docs/sources/nesdc/.
// Page numbers in refs are PDF pages. `pageless` docs are web pages or consolidated texts cited by มาตรา/ข้อ.

export type SourceDoc = { title: string; year: string; url: string; pageless?: true };

export const SOURCES: Record<string, SourceDoc> = {
  "police-admission-list-2569": { title: "ประกาศกองบัญชาการศึกษา เรื่อง ประกาศรายชื่อผู้สมัครสอบให้เข้าสอบข้อเขียน วัน เวลา และสถานที่สอบข้อเขียน … ตำรวจชั้นประทวน พ.ศ. 2569 (กลุ่มสายงานอำนวยการและสนับสนุน) ลงวันที่ 13 พฤศจิกายน 2569", year: "2569", url: "https://admission.edupol.org/" },
  "police-exam-scope-summary": { title: "สรุปขอบเขตวิชาสอบตามผนวก ฉ ท้ายประกาศกองบัญชาการศึกษา ลงวันที่ 26 พฤษภาคม 2569 (สรุปโดย ThaiJobsGov; ยังไม่ได้ตรวจกับไฟล์ประกาศ)", year: "2569", url: "https://www.thaijobsgov.com/434441/", pageless: true },
  "p54-consolidated-2566": { title: "ระเบียบสำนักงานตำรวจแห่งชาติ ว่าด้วยประมวลระเบียบการตำรวจไม่เกี่ยวกับคดี ลักษณะที่ 54 งานสารบรรณ พ.ศ. 2556 (ฉบับสมบูรณ์ปรับปรุง 17 ต.ค. 2566 รวมฉบับที่ 2–20)", year: "2566", url: "" },
  "p54-no21-2569": { title: "ระเบียบสำนักงานตำรวจแห่งชาติ ว่าด้วยประมวลระเบียบการตำรวจไม่เกี่ยวกับคดี ลักษณะที่ 54 งานสารบรรณ (ฉบับที่ 21) พ.ศ. 2569 (บทที่ 8 การใช้คำย่อในราชการตำรวจ)", year: "2569", url: "" },
  "saraban-2526": { title: "ระเบียบสำนักนายกรัฐมนตรี ว่าด้วยงานสารบรรณ พ.ศ. 2526", year: "2526", url: "https://www.opm.go.th/media1/temp/pitthais/CentralReg/6govtdoc2526.pdf" },
  "saraban-2548-no2": { title: "ระเบียบสำนักนายกรัฐมนตรี ว่าด้วยงานสารบรรณ (ฉบับที่ 2) พ.ศ. 2548", year: "2548", url: "https://www.opm.go.th/media1/temp/pitthais/CentralReg/6govtdoc2548.pdf" },
  "saraban-2560-no3": { title: "ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ (ฉบับที่ 3) พ.ศ. 2560", year: "2560", url: "https://www.opm.go.th/media1/temp/panidapa/File/Document_ver.3_BE_2560_.pdf" },
  "saraban-2564-no4": { title: "ระเบียบสำนักนายกรัฐมนตรี ว่าด้วยงานสารบรรณ (ฉบับที่ 4) พ.ศ. 2564", year: "2564", url: "https://ratchakitcha.soc.go.th/documents/17165183.pdf" },
  "saraban-consolidated-opm": { title: "ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม (เอกสารประกอบการบรรยาย สปน.)", year: "2561", url: "https://www.opm.go.th/media1/temp/panidapa/File/Government%20correspondence/1_170961.pdf" },
  "law-constitution-2560": { title: "รัฐธรรมนูญแห่งราชอาณาจักรไทย (พุทธศักราช 2560)", year: "2560", url: "https://www.nesdc.go.th/wordpress/wp-content/uploads/2025/12/constitution2560.pdf" },
  "law-pdpa-2562": { title: "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562", year: "2562", url: "https://ratchakitcha.soc.go.th/documents/17082307.pdf" },
  "law-computer-crime-act-consolidated-ocs": { title: "พระราชบัญญัติว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. ๒๕๕๐ (ฉบับปรับปรุงล่าสุด รวมฉบับที่ ๒ พ.ศ. ๒๕๖๐ และการปรับเป็นพินัย พ.ศ. ๒๕๖๕)", year: "2560", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/ZC9wWkVOT1ZpQVpCRnQ2UVk1K0k4Zz09" },
  "law-electronic-transactions-act-consolidated-ocs": { title: "พระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๔๔ (ฉบับปรับปรุงล่าสุด — คัดบางมาตรา)", year: "2562", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/Wllpd2t3bDhldFNOUy95eG1yczAvUT09" },
  "law-criminal-code-ocs": { title: "ประมวลกฎหมายอาญา (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/K2dTMURyaDllOXJVWVZqZGJLK09pdz09", pageless: true },
  "law-civil-code-ocs": { title: "ประมวลกฎหมายแพ่งและพาณิชย์ (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/Qko1NGNVa1FhMG9hTTNGcU9sTGxydz09", pageless: true },
  "law-land-traffic-act-ocs": { title: "พระราชบัญญัติจราจรทางบก พ.ศ. 2522 (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/M1hxSnpiL1ZlRzFBYlFjZGwrUlZrdz09", pageless: true },
  "law-id-card-act-ocs": { title: "พระราชบัญญัติบัตรประจำตัวประชาชน พ.ศ. 2526 (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/S2RFbGhZcXpoVzkwS2p1c3FHLzdhUT09", pageless: true },
  "law-consumer-protection-act-ocs": { title: "พระราชบัญญัติคุ้มครองผู้บริโภค พ.ศ. 2522 (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/c1VEQWc4b1NqSitjNFZ6bExqS0ZZZz09", pageless: true },
  "law-constitution-ocs": { title: "รัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560 (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา รวมฉบับแก้ไขเพิ่มเติม (ฉบับที่ 1) พ.ศ. 2564)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/VG9mbS9RRXZhdjNGYy9Xcm5LTjd1Zz09", pageless: true },
  "law-labour-protection-act-ocs": { title: "พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541 (ฉบับปรับปรุงล่าสุด สำนักงานคณะกรรมการกฤษฎีกา)", year: "2569", url: "https://searchlaw.ocs.go.th/council-of-state/#/public/doc/ZGN3NXk0eENvNjBSdjRnT2NsdjFTQT09", pageless: true },
};

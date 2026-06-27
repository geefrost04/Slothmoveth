window.COMPUTER_DATA =
{
  "id": "computer",
  "title": "คอมพิวเตอร์และเทคโนโลยีสารสนเทศเพื่อสำนักงาน",
  "titleShort": "คอมพิวเตอร์และ IT",
  "emoji": "💻",
  "subtitle": "สรุปอ่านสอบสำหรับพื้นฐานคอมพิวเตอร์ ระบบเครือข่าย โปรแกรมสำนักงาน ความปลอดภัยไซเบอร์ กฎหมายดิจิทัล และเทคโนโลยีที่ใช้ในงานตำรวจ",
  "badgeLabel": "สำหรับเตรียมสอบนายสิบตำรวจ สายอำนวยการ",
  "stats": {
    "chapters": 10,
    "parts": 64,
    "vocab": 6,
    "quiz": 600
  },
  "heroStats": [
    { "value": "10", "label": "บทเรียน" },
    { "value": "64", "label": "หัวข้อ" },
    { "value": "600", "label": "ข้อสอบ" },
    { "value": "ฟรี", "label": "ตลอดเว็บ" }
  ],
  "knowledgeSections": [
    {
      "navIcon": "💡",
      "navLabel": "พื้นฐาน IT",
      "icon": "💡",
      "title": "ส่วนที่ 1 · พื้นฐานเทคโนโลยีสารสนเทศที่ชอบออกสอบ",
      "description": "องค์ประกอบของระบบ IT ข้อมูล หน่วยวัด และบทบาทของระบบปฏิบัติการ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "amber",
          "title": "💡 ความหมายของ IT",
          "content": "<strong>เทคโนโลยีสารสนเทศ (Information Technology: IT)</strong> คือการใช้คอมพิวเตอร์ ซอฟต์แวร์ เครือข่าย และอุปกรณ์สื่อสารเพื่อ<strong>จัดเก็บ ประมวลผล สืบค้น ส่งต่อ และนำเสนอข้อมูล</strong> ให้เกิดประโยชน์ในการทำงาน"
        },
        {
          "type": "cards",
          "color": "blue",
          "cards": [
            { "icon": "🖥️", "title": "Hardware", "content": "อุปกรณ์ที่จับต้องได้ เช่น CPU, RAM, SSD, Monitor, Keyboard", "color": "blue" },
            { "icon": "📦", "title": "Software", "content": "โปรแกรมที่ใช้สั่งงาน เช่น Windows, Microsoft Office, Chrome", "color": "purple" },
            { "icon": "👤", "title": "Peopleware", "content": "ผู้ใช้ ผู้ดูแลระบบ ผู้พัฒนา และผู้บริหารข้อมูล", "color": "green" },
            { "icon": "📊", "title": "Data / Information", "content": "ข้อมูลดิบเมื่อผ่านการประมวลผลและตีความจะกลายเป็นสารสนเทศ", "color": "amber" }
          ]
        },
        {
          "type": "highlight-box",
          "color": "navy",
          "title": "📚 ลำดับข้อมูลจากเล็กไปใหญ่",
          "content": "<strong>Bit</strong> → <strong>Byte</strong> → <strong>Field</strong> → <strong>Record</strong> → <strong>File</strong> → <strong>Database</strong><br><br>ข้อสอบมักถามว่า <strong>Byte = 8 Bit</strong> และ <strong>Database</strong> คือชุดข้อมูลหลายแฟ้มที่มีความสัมพันธ์กัน"
        },
        {
          "type": "bullet-list",
          "title": "📏 หน่วยวัดข้อมูลที่ต้องจำ",
          "items": [
            "<strong>1 Byte</strong> = 8 Bit",
            "<strong>1 KB</strong> = 1,024 Bytes",
            "<strong>1 MB</strong> = 1,024 KB",
            "<strong>1 GB</strong> = 1,024 MB",
            "<strong>1 TB</strong> = 1,024 GB",
            "ข้อสอบชอบถามเปรียบเทียบว่า <strong>GB มากกว่า MB</strong> และ <strong>TB มากกว่า GB</strong>"
          ]
        },
        {
          "type": "highlight-box",
          "color": "teal",
          "title": "🪟 ระบบปฏิบัติการ (Operating System)",
          "content": "OS ทำหน้าที่เป็น<strong>ตัวกลางระหว่างผู้ใช้กับฮาร์ดแวร์</strong> ควบคุมหน่วยความจำ จัดสรรทรัพยากร จัดการไฟล์ และทำให้โปรแกรมต่าง ๆ ทำงานร่วมกันได้ ตัวอย่างเช่น Windows, macOS, Linux, Android, iOS"
        }
      ]
    },
    {
      "navIcon": "🖥️",
      "navLabel": "ฮาร์ดแวร์/OS",
      "icon": "🖥️",
      "title": "ส่วนที่ 2 · ฮาร์ดแวร์ หน่วยความจำ และการทำงานของเครื่อง",
      "description": "CPU, RAM, ROM, Storage, Input/Output และส่วนประกอบที่มักออกสอบ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "navy",
          "title": "⚙️ CPU และส่วนย่อย",
          "content": "<strong>CPU</strong> เป็นสมองของเครื่อง ประกอบด้วย <strong>ALU</strong> สำหรับคำนวณและตรรกะ กับ <strong>Control Unit</strong> สำหรับควบคุมลำดับการทำงาน<br><br>ความเร็ว CPU วัดเป็น <strong>Hz / GHz</strong> ยิ่งค่ามากโดยทั่วไปยิ่งประมวลผลได้เร็วขึ้น"
        },
        {
          "type": "table",
          "title": "💾 เปรียบเทียบหน่วยความจำที่ชอบออกสอบ",
          "headers": ["หัวข้อ", "RAM", "ROM"],
          "rows": [
            ["ลักษณะ", "หน่วยความจำหลักชั่วคราว", "หน่วยความจำถาวร"],
            ["ข้อมูลหายเมื่อปิดเครื่อง", "หาย", "ไม่หาย"],
            ["ใช้เก็บ", "โปรแกรมและข้อมูลที่กำลังใช้งาน", "คำสั่งเริ่มต้นเครื่อง เช่น BIOS/UEFI"],
            ["คำที่เจอบ่อยในข้อสอบ", "Volatile", "Non-volatile"]
          ]
        },
        {
          "type": "bullet-list",
          "title": "🧰 อุปกรณ์ที่ควรแยกให้ออก",
          "items": [
            "<strong>Input</strong>: Keyboard, Mouse, Scanner, Microphone, Webcam, Barcode Scanner",
            "<strong>Output</strong>: Monitor, Printer, Speaker, Projector",
            "<strong>Input/Output</strong>: Touchscreen, Network Card, Storage",
            "<strong>NIC</strong> = การ์ดเครือข่าย ใช้เชื่อมต่อระบบ LAN / Internet",
            "<strong>UPS</strong> = เครื่องสำรองไฟ ช่วยให้ปิดเครื่องได้ปลอดภัยเมื่อไฟดับ"
          ]
        },
        {
          "type": "highlight-box",
          "color": "rose",
          "title": "💽 Storage ที่ออกข้อสอบบ่อย",
          "content": "<strong>HDD</strong> จุเยอะ ราคาถูก แต่ช้ากว่า<br><strong>SSD</strong> เร็วกว่า ไม่มีจานหมุน ทนแรงสั่นสะเทือนได้ดีกว่า<br><strong>NVMe SSD</strong> เร็วกว่า SSD แบบ SATA เพราะต่อผ่าน PCIe<br><strong>Cloud Storage</strong> เช่น Google Drive, OneDrive ใช้เก็บและแชร์ไฟล์ผ่านอินเทอร์เน็ต"
        },
        {
          "type": "cards",
          "color": "amber",
          "cards": [
            { "icon": "🖨️", "title": "Laser Printer", "content": "ใช้หมึกผง พิมพ์เร็ว เหมาะงานสำนักงาน", "color": "amber" },
            { "icon": "🎨", "title": "Inkjet", "content": "เหมาะงานภาพสี แต่ช้ากว่าและเปลืองหมึกกว่า", "color": "blue" },
            { "icon": "🧾", "title": "Thermal", "content": "ใช้ความร้อน นิยมกับใบเสร็จ", "color": "rose" },
            { "icon": "📄", "title": "Dot Matrix", "content": "ใช้หัวเข็ม เหมาะกับแบบฟอร์มต่อเนื่อง", "color": "green" }
          ]
        }
      ]
    },
    {
      "navIcon": "🌐",
      "navLabel": "เครือข่าย",
      "icon": "🌐",
      "title": "ส่วนที่ 3 · เครือข่ายคอมพิวเตอร์และอินเทอร์เน็ต",
      "description": "LAN, WAN, IP, DNS, อุปกรณ์เครือข่าย และพอร์ตบริการที่ชอบออกข้อสอบ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "blue",
          "title": "🌐 ประเภทเครือข่ายตามขนาด",
          "content": "<strong>PAN</strong> ระยะใกล้มาก เช่น Bluetooth<br><strong>LAN</strong> ภายในห้องหรืออาคารเดียวกัน<br><strong>MAN</strong> ระดับเมือง<br><strong>WAN</strong> ข้ามเมือง/ประเทศ เช่น อินเทอร์เน็ต"
        },
        {
          "type": "table",
          "title": "🔌 อุปกรณ์เครือข่ายที่ต้องแยกให้ออก",
          "headers": ["อุปกรณ์", "หน้าที่", "คำใบ้ในข้อสอบ"],
          "rows": [
            ["Hub", "กระจายข้อมูลไปทุกพอร์ต", "อุปกรณ์เก่า ไม่มีการเลือกปลายทาง"],
            ["Switch", "ส่งข้อมูลไปพอร์ตปลายทางจริง", "อาศัย MAC Address"],
            ["Router", "เชื่อมหลายเครือข่ายและกำหนดเส้นทาง", "เชื่อม LAN ออก Internet"],
            ["Modem", "แปลงสัญญาณสำหรับการเชื่อมต่อกับผู้ให้บริการ", "DSL / Fiber / Cable"],
            ["Access Point", "กระจายสัญญาณ Wi-Fi", "เพิ่มจุดเชื่อมต่อไร้สาย"]
          ]
        },
        {
          "type": "highlight-box",
          "color": "green",
          "title": "📡 IP, DNS, DHCP, Gateway",
          "content": "<strong>IP Address</strong> คือหมายเลขประจำเครื่องในเครือข่าย<br><strong>DNS</strong> แปลงชื่อโดเมนเป็น IP<br><strong>DHCP</strong> แจก IP อัตโนมัติ<br><strong>Default Gateway</strong> คือทางออกหลักจากเครือข่ายย่อยไปยังเครือข่ายอื่น<br><strong>Subnet Mask</strong> ใช้บอกว่าส่วนใดของ IP เป็น Network และส่วนใดเป็น Host"
        },
        {
          "type": "table",
          "title": "🧭 Protocol / Port ที่ชอบถาม",
          "headers": ["บริการ", "Port มาตรฐาน", "หน้าที่"],
          "rows": [
            ["HTTP", "80", "ท่องเว็บแบบไม่เข้ารหัส"],
            ["HTTPS", "443", "ท่องเว็บแบบเข้ารหัส SSL/TLS"],
            ["FTP", "20/21", "โอนไฟล์"],
            ["SSH", "22", "เชื่อมต่อเครื่องระยะไกลอย่างปลอดภัย"],
            ["DNS", "53", "แปลงชื่อโดเมนเป็น IP"],
            ["SMTP", "25", "ส่งอีเมล"],
            ["POP3", "110", "รับอีเมลแบบดาวน์โหลด"],
            ["IMAP", "143", "รับอีเมลแบบซิงก์กับเซิร์ฟเวอร์"]
          ]
        },
        {
          "type": "bullet-list",
          "title": "⚠️ จุดที่ข้อสอบชอบหลอก",
          "items": [
            "<strong>MAC Address</strong> ไม่ใช่ IP และไม่เปลี่ยนตามเครือข่ายง่าย ๆ",
            "<strong>Router</strong> ไม่ใช่ตัวเดียวกับ <strong>Switch</strong>",
            "<strong>HTTPS</strong> ปลอดภัยกว่า HTTP เพราะมีการเข้ารหัส",
            "<strong>VPN</strong> ช่วยเข้ารหัสการเชื่อมต่อเมื่อใช้เครือข่ายสาธารณะ",
            "<strong>IPv6</strong> มีขนาด 128 บิต มากกว่า IPv4 ที่มี 32 บิต"
          ]
        }
      ]
    },
    {
      "navIcon": "📱",
      "navLabel": "เว็บ/โซเชียล",
      "icon": "📱",
      "title": "ส่วนที่ 4 · เว็บไซต์ E-commerce Social Media และการใช้งานออนไลน์",
      "description": "โดเมน ประเภทธุรกิจออนไลน์ Search Engine และแพลตฟอร์มที่พบในข้อสอบ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "blue",
          "title": "🌍 ชนิดโดเมนที่ควรรู้",
          "content": "<strong>.com</strong> ธุรกิจทั่วไป<br><strong>.go.th / .gov</strong> หน่วยงานรัฐบาล<br><strong>.ac.th / .edu</strong> สถานศึกษา<br><strong>.org</strong> องค์กรไม่แสวงกำไร<br><strong>.net</strong> งานด้านเครือข่ายหรือผู้ให้บริการ"
        },
        {
          "type": "table",
          "title": "🛒 E-commerce ที่ออกบ่อย",
          "headers": ["รูปแบบ", "ความหมาย", "ตัวอย่าง"],
          "rows": [
            ["B2B", "ธุรกิจกับธุรกิจ", "ซื้อวัตถุดิบจากผู้ขายส่ง"],
            ["B2C", "ธุรกิจกับผู้บริโภค", "Shopee, Lazada, Amazon"],
            ["C2C", "ผู้บริโภคกับผู้บริโภค", "Facebook Marketplace, เว็บขายของมือสอง"],
            ["G2C / C2G", "รัฐบาลกับประชาชน", "ยื่นภาษีออนไลน์, ตรวจสอบบริการภาครัฐ"]
          ]
        },
        {
          "type": "cards",
          "color": "blue",
          "cards": [
            { "icon": "🔎", "title": "Search Engine", "content": "ใช้ค้นหาข้อมูล เช่น Google, Bing", "color": "blue" },
            { "icon": "📧", "title": "Email", "content": "รูปแบบที่ถูกต้องต้องมีชื่อผู้ใช้ + @ + โดเมน", "color": "purple" },
            { "icon": "📘", "title": "Facebook", "content": "เครือข่ายสังคมทั่วไป ใช้โพสต์ กลุ่ม และเพจ", "color": "blue" },
            { "icon": "🎵", "title": "TikTok / Reels", "content": "เน้นวิดีโอสั้น ข้อสอบชอบจับคู่กับแพลตฟอร์ม", "color": "rose" },
            { "icon": "💬", "title": "Line", "content": "แชทและโทร ใช้แพร่หลายในไทย", "color": "green" },
            { "icon": "▶️", "title": "YouTube", "content": "แพลตฟอร์มวิดีโอและสตรีมมิ่ง", "color": "amber" }
          ]
        },
        {
          "type": "highlight-box",
          "color": "teal",
          "title": "☁️ Cloud Computing ที่ชอบถาม",
          "content": "<strong>IaaS</strong> = เช่าโครงสร้างพื้นฐาน<br><strong>PaaS</strong> = เช่าแพลตฟอร์มพัฒนา<br><strong>SaaS</strong> = ใช้ซอฟต์แวร์ผ่านเว็บ เช่น Google Docs, Microsoft 365<br><br>ข้อสอบมักถามว่า SaaS คือบริการที่ผู้ใช้ไม่ต้องดูแลเซิร์ฟเวอร์เอง"
        }
      ]
    },
    {
      "navIcon": "📝",
      "navLabel": "Word",
      "icon": "📝",
      "title": "ส่วนที่ 5 · Microsoft Word และการพิมพ์เอกสารราชการ",
      "description": "คำสั่งสำคัญ ระเบียบพื้นฐาน และไฟล์ที่ใช้บ่อยในการทำหนังสือราชการ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "blue",
          "title": "📄 Word ที่ออกสอบบ่อย",
          "content": "<strong>Ctrl + S</strong> บันทึก, <strong>Ctrl + C</strong> คัดลอก, <strong>Ctrl + V</strong> วาง, <strong>Ctrl + Z</strong> Undo, <strong>Ctrl + A</strong> เลือกทั้งหมด, <strong>Ctrl + P</strong> พิมพ์, <strong>Ctrl + F</strong> ค้นหา, <strong>Ctrl + H</strong> แทนที่ข้อความ"
        },
        {
          "type": "table",
          "title": "📐 จุดที่ชอบออกเกี่ยวกับงานราชการ",
          "headers": ["หัวข้อ", "สิ่งที่ควรจำ"],
          "rows": [
            ["ฟอนต์มาตรฐาน", "TH Sarabun / TH Sarabun New"],
            ["ขนาดตัวอักษรเนื้อหา", "16 pt ตามที่ข้อสอบมักยึดเป็นมาตรฐานราชการ"],
            ["ระยะขอบบน/ซ้าย", "3 เซนติเมตร"],
            ["การจัดแนว", "Thai Distributed / กระจายแบบไทย"],
            ["ส่งไฟล์ไม่ให้เพี้ยน", "บันทึกเป็น PDF"]
          ]
        },
        {
          "type": "bullet-list",
          "title": "🧩 คำสั่งที่ชอบสลับกันในตัวเลือก",
          "items": [
            "<strong>Header</strong> = ข้อความส่วนบนของทุกหน้า",
            "<strong>Footer</strong> = ข้อความส่วนล่างของทุกหน้า",
            "<strong>Footnote</strong> = เชิงอรรถท้ายหน้า",
            "<strong>Endnote</strong> = เชิงอรรถท้ายเอกสาร",
            "<strong>Page Break</strong> = ขึ้นหน้าใหม่",
            "<strong>Section Break</strong> = แบ่งส่วนเอกสารเพื่อใช้รูปแบบต่างกัน"
          ]
        },
        {
          "type": "highlight-box",
          "color": "purple",
          "title": "🖌️ เครื่องมือที่ควรจำ",
          "content": "<strong>Format Painter</strong> ใช้คัดลอกรูปแบบ<br><strong>Track Changes</strong> ใช้ติดตามการแก้ไข<br><strong>Table of Contents</strong> ใช้สร้างสารบัญอัตโนมัติ<br><strong>Style</strong> ใช้กำหนดรูปแบบหัวข้อและย่อหน้าอย่างเป็นระบบ"
        }
      ]
    },
    {
      "navIcon": "📊",
      "navLabel": "Excel/PPT",
      "icon": "📊",
      "title": "ส่วนที่ 6 · Microsoft Excel และ PowerPoint",
      "description": "สูตร ตารางคำนวณ กราฟ และเครื่องมือพรีเซนต์ที่ออกสอบบ่อย",
      "blocks": [
        {
          "type": "table",
          "title": "📈 ฟังก์ชัน Excel ที่ควรรู้จริง",
          "headers": ["ฟังก์ชัน", "หน้าที่", "ตัวอย่าง"],
          "rows": [
            ["SUM", "หาผลรวม", "=SUM(A1:A5)"],
            ["AVERAGE", "หาค่าเฉลี่ย", "=AVERAGE(B1:B10)"],
            ["COUNT", "นับเฉพาะตัวเลข", "=COUNT(C1:C20)"],
            ["COUNTA", "นับเซลล์ที่ไม่ว่าง", "=COUNTA(A1:A20)"],
            ["COUNTIF", "นับตามเงื่อนไข", "=COUNTIF(A1:A10,\">=50\")"],
            ["COUNTIFS", "นับหลายเงื่อนไข", "=COUNTIFS(A:A,\">=50\",B:B,\"ผ่าน\")"],
            ["IF", "ตรวจเงื่อนไข", "=IF(C2>=50,\"ผ่าน\",\"ตก\")"],
            ["VLOOKUP", "ค้นหาค่าตามแนวตั้ง", "=VLOOKUP(E2,A:B,2,FALSE)"]
          ]
        },
        {
          "type": "bullet-list",
          "title": "🧮 จุดที่ข้อสอบชอบถามใน Excel",
          "items": [
            "สูตรต้องขึ้นต้นด้วยเครื่องหมาย <strong>=</strong>",
            "แถว (<strong>Row</strong>) อยู่แนวนอน ใช้ตัวเลขกำกับ",
            "คอลัมน์ (<strong>Column</strong>) อยู่แนวตั้ง ใช้ตัวอักษรกำกับ",
            "จุดตัดของแถวและคอลัมน์เรียกว่า <strong>Cell</strong>",
            "ถ้าขึ้น <strong>###</strong> มักหมายถึงคอลัมน์แคบเกินไป",
            "<strong>PivotTable</strong> ใช้สรุปข้อมูลจำนวนมากแบบยืดหยุ่น",
            "<strong>Freeze Panes</strong> ใช้ตรึงหัวตารางเวลาเลื่อนดูข้อมูล"
          ]
        },
        {
          "type": "highlight-box",
          "color": "amber",
          "title": "🎞️ PowerPoint ที่มักออกสอบ",
          "content": "<strong>Slide Master</strong> ใช้กำหนดรูปแบบสไลด์ทั้งชุดจากจุดเดียว<br><strong>Theme</strong> คือชุดสี ฟอนต์ และรูปแบบรวมของงานนำเสนอ<br><strong>Transition</strong> คือเอฟเฟกต์ตอนเปลี่ยนสไลด์<br><strong>Animation</strong> คือเอฟเฟกต์ของวัตถุภายในสไลด์<br><strong>Handout Master</strong> ใช้จัดรูปแบบหน้าพิมพ์เอกสารประกอบ"
        },
        {
          "type": "highlight-box",
          "color": "green",
          "title": "📁 นามสกุลไฟล์ที่ควรจำ",
          "content": "<strong>.docx</strong> Word, <strong>.xlsx</strong> Excel, <strong>.pptx</strong> PowerPoint, <strong>.pdf</strong> เอกสารพร้อมส่ง, <strong>.csv</strong> ข้อมูลคั่นด้วยจุลภาค, <strong>.zip</strong> ไฟล์บีบอัด"
        }
      ]
    },
    {
      "navIcon": "🔒",
      "navLabel": "Cybersecurity",
      "icon": "🔒",
      "title": "ส่วนที่ 7 · ความปลอดภัยไซเบอร์และภัยคุกคามสมัยใหม่",
      "description": "Malware, Authentication, Social Engineering, VPN และแนวคิด Zero Trust",
      "blocks": [
        {
          "type": "table",
          "title": "☠️ Malware ที่ชอบจับคู่ในข้อสอบ",
          "headers": ["ชนิด", "ลักษณะสำคัญ", "คำใบ้ที่มักใช้"],
          "rows": [
            ["Virus", "ต้องอาศัยไฟล์หรือโปรแกรมเจ้าบ้าน", "ติดมากับไฟล์"],
            ["Worm", "แพร่ตัวเองผ่านเครือข่ายได้", "กระจายเอง"],
            ["Trojan", "ปลอมเป็นโปรแกรมปกติ", "แฝงตัว"],
            ["Spyware", "แอบเก็บข้อมูลผู้ใช้", "สอดแนม"],
            ["Adware", "แสดงโฆษณารบกวน", "ป๊อปอัป"],
            ["Ransomware", "เข้ารหัสไฟล์แล้วเรียกค่าไถ่", "จ่ายเงินเพื่อปลดล็อก"],
            ["Phishing", "หลอกให้กรอกข้อมูลผ่านลิงก์ปลอม", "เว็บปลอม / อีเมลปลอม"]
          ]
        },
        {
          "type": "highlight-box",
          "color": "rose",
          "title": "🧠 ภัยคุกคามที่ไม่ควรพลาด",
          "content": "<strong>DDoS</strong> = ยิงทราฟฟิกจำนวนมากทำให้บริการล่ม<br><strong>Social Engineering</strong> = หลอกใช้จิตวิทยาเพื่อเอาข้อมูล<br><strong>Pharming</strong> = เปลี่ยนเส้นทางไปเว็บปลอมแม้พิมพ์ URL ถูก<br><strong>Deepfake</strong> = ใช้ AI ปลอมเสียงหรือภาพเพื่อหลอกลวง"
        },
        {
          "type": "highlight-box",
          "color": "blue",
          "title": "🔐 Authentication / Authorization",
          "content": "<strong>Authentication</strong> = ยืนยันว่าเป็นใคร<br><strong>Authorization</strong> = มีสิทธิ์ทำอะไรได้บ้าง<br><br><strong>OTP</strong> ใช้ได้ครั้งเดียว<br><strong>2FA</strong> คือยืนยัน 2 ชั้น เช่น รหัสผ่าน + โทรศัพท์<br><strong>Least Privilege</strong> คือให้สิทธิ์เท่าที่จำเป็นเท่านั้น"
        },
        {
          "type": "bullet-list",
          "title": "✅ วิธีตอบเชิงสถานการณ์",
          "items": [
            "ถ้าได้รับอีเมลแนบลิงก์แปลก ๆ ต้อง<strong>ไม่คลิกทันที</strong> และตรวจสอบผู้ส่ง",
            "ถ้าใช้ <strong>Public Wi-Fi</strong> ควรหลีกเลี่ยงธุรกรรมสำคัญหรือใช้ VPN",
            "ถ้าระบบมีช่องโหว่ควร <strong>Patch Update</strong> ให้เป็นเวอร์ชันล่าสุด",
            "ถ้ากลัวข้อมูลหายจาก Ransomware ต้องมี <strong>Backup</strong> แยกจากเครื่องใช้งาน",
            "Firewall มีหน้าที่กรองและควบคุมการรับส่งข้อมูลเข้าออกเครือข่าย"
          ]
        }
      ]
    },
    {
      "navIcon": "⚖️",
      "navLabel": "กฎหมายดิจิทัล",
      "icon": "⚖️",
      "title": "ส่วนที่ 8 · กฎหมายคอมพิวเตอร์ จริยธรรม และ PDPA",
      "description": "สรุปให้พอจับข้อสอบแนว พ.ร.บ.คอมพิวเตอร์ ข้อมูลส่วนบุคคล และความรับผิดทางดิจิทัล",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "navy",
          "title": "📜 แนวออกสอบกฎหมายคอมฯ",
          "content": "ข้อสอบมักถามเรื่อง <strong>การเข้าถึงระบบโดยมิชอบ</strong>, <strong>การดักรับข้อมูล</strong>, <strong>การนำเข้าข้อมูลเท็จหรือบิดเบือน</strong>, <strong>การเผยแพร่ข้อมูลที่ผิดกฎหมาย</strong> และความแตกต่างระหว่าง <strong>ความผิดตาม พ.ร.บ.คอมพิวเตอร์</strong> กับ <strong>ความผิดฐานหมิ่นประมาท</strong>"
        },
        {
          "type": "table",
          "title": "🛡️ PDPA แบบจำง่าย",
          "headers": ["หัวข้อ", "สิ่งที่ควรจำ"],
          "rows": [
            ["ข้อมูลส่วนบุคคล", "ข้อมูลที่ระบุตัวบุคคลได้ เช่น ชื่อ เลขบัตร โทรศัพท์"],
            ["ข้อมูลอ่อนไหว", "เชื้อชาติ ศาสนา สุขภาพ ชีวภาพ ประวัติอาชญากรรม ฯลฯ"],
            ["DPO", "ผู้ให้คำปรึกษาและกำกับการคุ้มครองข้อมูลส่วนบุคคล"],
            ["หลักสำคัญ", "เก็บ ใช้ เปิดเผย เท่าที่จำเป็นและมีฐานกฎหมายรองรับ"]
          ]
        },
        {
          "type": "bullet-list",
          "title": "⚠️ จุดที่ข้อสอบชอบหลอก",
          "items": [
            "<strong>PDPA</strong> ไม่ได้ห้ามเก็บข้อมูลทุกกรณี แต่ต้องมีเหตุผลและฐานกฎหมาย",
            "การโพสต์หมิ่นประมาทบนโซเชียลอาจเกี่ยวทั้ง <strong>ประมวลกฎหมายอาญา</strong> และกฎหมายคอมพิวเตอร์",
            "ข้อมูลสุขภาพและข้อมูลชีวภาพถือเป็น<strong>ข้อมูลอ่อนไหว</strong>",
            "การเข้าถึงระบบหรือข้อมูลของผู้อื่นโดยไม่ได้รับอนุญาตเป็นความผิด แม้ยังไม่แก้ไขข้อมูล"
          ]
        }
      ]
    },
    {
      "navIcon": "🗄️",
      "navLabel": "ฐานข้อมูล/Cloud",
      "icon": "🗄️",
      "title": "ส่วนที่ 9 · ฐานข้อมูล Cloud AI และเทคโนโลยีเกิดใหม่",
      "description": "แนวคิดที่อยู่ในคลังข้อสอบแต่หน้าอ่านมักยังบาง เช่น SQL, RAID, Blockchain, IoT, Big Data",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "blue",
          "title": "🗃️ Database ที่ควรเข้าใจ",
          "content": "<strong>Relational Database</strong> จัดเก็บข้อมูลเป็นตาราง มีแถวและคอลัมน์ เชื่อมกันด้วย <strong>Key</strong><br><strong>SQL</strong> ใช้สร้าง แก้ไข ลบ และค้นข้อมูลจากฐานข้อมูล เช่น MySQL, PostgreSQL, SQL Server"
        },
        {
          "type": "cards",
          "color": "blue",
          "cards": [
            { "icon": "🧱", "title": "Blockchain", "content": "ข้อมูลเก็บเป็นบล็อกเชื่อมต่อกันด้วยแฮช ปลอมแปลงย้อนหลังได้ยาก", "color": "blue" },
            { "icon": "🌐", "title": "IoT", "content": "อุปกรณ์เชื่อมอินเทอร์เน็ตได้ เช่น กล้องอัจฉริยะ เซ็นเซอร์", "color": "green" },
            { "icon": "📚", "title": "Big Data", "content": "ข้อมูลขนาดใหญ่ ปริมาณมาก หลากหลาย และเปลี่ยนเร็ว", "color": "amber" },
            { "icon": "🤖", "title": "AI", "content": "ใช้วิเคราะห์ คาดการณ์ หรือรู้จำภาพเสียง", "color": "rose" }
          ]
        },
        {
          "type": "highlight-box",
          "color": "purple",
          "title": "💽 RAID ที่ข้อสอบชอบถาม",
          "content": "<strong>RAID 0</strong> เน้นความเร็ว ไม่มีสำรองข้อมูล<br><strong>RAID 1</strong> ทำสำเนาแบบ Mirror ปลอดภัยขึ้น<br><strong>RAID 5</strong> สมดุลทั้งประสิทธิภาพและความทนทาน ใช้ parity กระจายบนดิสก์หลายลูก"
        },
        {
          "type": "bullet-list",
          "title": "🧠 สังเกตคำถามแนวเทคโนโลยีเกิดใหม่",
          "items": [
            "ถ้าพูดถึงข้อมูลปลอมแต่ดูเหมือนจริงจาก AI มักตอบ <strong>Deepfake</strong>",
            "ถ้าพูดถึงบริการซอฟต์แวร์ผ่านเว็บ มักตอบ <strong>SaaS</strong>",
            "ถ้าถามเรื่องวิเคราะห์ข้อมูลขนาดใหญ่ มักโยงไปที่ <strong>Big Data</strong>",
            "ถ้าถามถึงอุปกรณ์จำนวนมากเชื่อมอินเทอร์เน็ต มักตอบ <strong>IoT</strong>"
          ]
        }
      ]
    },
    {
      "navIcon": "🕵️",
      "navLabel": "Forensics/ตำรวจ",
      "icon": "🕵️",
      "title": "ส่วนที่ 10 · Digital Forensics และเทคโนโลยีในงานตำรวจ",
      "description": "พยานหลักฐานดิจิทัล Log Metadata Hash และแอปที่เกี่ยวกับงานตำรวจ",
      "blocks": [
        {
          "type": "highlight-box",
          "color": "rose",
          "title": "🧪 หลักคิดของ Digital Forensics",
          "content": "เป้าหมายคือ<strong>เก็บ ตรวจ วิเคราะห์ และนำเสนอพยานหลักฐานดิจิทัล</strong> โดยไม่ทำให้หลักฐานเสียหาย หลักที่ชอบถามคือ <strong>ห้ามแก้ไขต้นฉบับโดยตรง</strong> และต้องรักษาความน่าเชื่อถือของพยานหลักฐาน"
        },
        {
          "type": "table",
          "title": "🔍 สิ่งที่ออกข้อสอบบ่อย",
          "headers": ["แนวคิด", "หน้าที่"],
          "rows": [
            ["Log File", "ตรวจร่องรอยการใช้งานและการเข้าถึงระบบ"],
            ["Metadata", "ดูวันเวลา ตำแหน่ง อุปกรณ์ หรือข้อมูลกำกับไฟล์"],
            ["Hash เช่น SHA-256", "ตรวจว่าหลักฐานถูกแก้ไขหรือไม่"],
            ["OSINT", "สืบค้นข้อมูลจากแหล่งเปิดสาธารณะบนอินเทอร์เน็ต"],
            ["Chain of Custody", "บันทึกลำดับการครอบครองหลักฐาน"]
          ]
        },
        {
          "type": "cards",
          "color": "blue",
          "cards": [
            { "icon": "👮", "title": "Police Care", "content": "สำหรับประชาชน ใช้ค้นหาสถานีตำรวจ ตรวจสอบรายชื่อตำรวจจริง/ปลอม และแจ้งข้อมูล", "color": "rose" },
            { "icon": "🛡️", "title": "One Police", "content": "สำหรับข้าราชการตำรวจ ใช้ดูข้อมูลคดี ข้อมูลกำลังพล หรือบริการภายใน", "color": "blue" },
            { "icon": "📹", "title": "Face Recognition", "content": "การรู้จำใบหน้าจากภาพหรือ CCTV เพื่อช่วยสืบสวน", "color": "green" },
            { "icon": "📡", "title": "Big Data ในงานตำรวจ", "content": "ใช้วิเคราะห์แนวโน้มเหตุการณ์และข้อมูลจำนวนมากเพื่อช่วยตัดสินใจ", "color": "amber" }
          ]
        },
        {
          "type": "highlight-box",
          "color": "teal",
          "title": "🎯 สรุปแนวตอบข้อสอบหมวดนี้",
          "content": "ถ้าถามว่าไฟล์หลักฐานถูกแก้หรือไม่ ให้คิดถึง <strong>Hash</strong><br>ถ้าถามหาข้อมูลวันเวลา/พิกัดภาพ ให้คิดถึง <strong>Metadata</strong><br>ถ้าถามร่องรอยการเข้าใช้ระบบ ให้คิดถึง <strong>Log</strong><br>ถ้าถามการเก็บหลักฐานอย่างถูกต้อง ให้คิดถึง <strong>Chain of Custody</strong>"
        }
      ]
    }
  ],
  "vocabularyGroups": [
    {
      "icon": "🖥️",
      "groupTitle": "ฮาร์ดแวร์และระบบ",
      "terms": [
        { "term": "CPU", "eng": "Central Processing Unit", "def": "หน่วยประมวลผลกลางหรือสมองของคอมพิวเตอร์" },
        { "term": "RAM", "eng": "Random Access Memory", "def": "หน่วยความจำชั่วคราว ข้อมูลหายเมื่อปิดเครื่อง" },
        { "term": "ROM", "eng": "Read Only Memory", "def": "หน่วยความจำถาวร เก็บคำสั่งเริ่มต้นระบบ" },
        { "term": "SSD", "eng": "Solid State Drive", "def": "อุปกรณ์เก็บข้อมูลแบบชิป เร็วกว่า HDD" },
        { "term": "OS", "eng": "Operating System", "def": "ระบบปฏิบัติการ เช่น Windows, Linux, Android" }
      ]
    },
    {
      "icon": "🌐",
      "groupTitle": "เครือข่ายและอินเทอร์เน็ต",
      "terms": [
        { "term": "LAN", "eng": "Local Area Network", "def": "เครือข่ายในพื้นที่จำกัด เช่น ภายในอาคาร" },
        { "term": "WAN", "eng": "Wide Area Network", "def": "เครือข่ายขนาดใหญ่ เช่น อินเทอร์เน็ต" },
        { "term": "DNS", "eng": "Domain Name System", "def": "ระบบแปลงชื่อโดเมนเป็น IP" },
        { "term": "VPN", "eng": "Virtual Private Network", "def": "เครือข่ายส่วนตัวเสมือนที่เข้ารหัสการเชื่อมต่อ" },
        { "term": "MAC Address", "def": "หมายเลขประจำอุปกรณ์เครือข่ายระดับฮาร์ดแวร์" }
      ]
    },
    {
      "icon": "📊",
      "groupTitle": "Office และไฟล์",
      "terms": [
        { "term": "PivotTable", "def": "เครื่องมือสรุปข้อมูลแบบยืดหยุ่นใน Excel" },
        { "term": "VLOOKUP", "def": "ฟังก์ชันค้นหาค่าตามแนวตั้ง" },
        { "term": "Track Changes", "def": "ติดตามการแก้ไขเอกสารใน Word" },
        { "term": "Slide Master", "def": "สไลด์ต้นแบบสำหรับกำหนดรูปแบบทั้งงานนำเสนอ" },
        { "term": ".csv", "def": "ไฟล์ข้อมูลที่คั่นค่าด้วยจุลภาค" }
      ]
    },
    {
      "icon": "🔒",
      "groupTitle": "ความปลอดภัยไซเบอร์",
      "terms": [
        { "term": "Phishing", "def": "การหลอกเอาข้อมูลผ่านเว็บหรือข้อความปลอม" },
        { "term": "2FA", "eng": "Two-Factor Authentication", "def": "การยืนยันตัวตน 2 ชั้น" },
        { "term": "Firewall", "def": "ระบบกรองและควบคุมการเชื่อมต่อเครือข่าย" },
        { "term": "Ransomware", "def": "มัลแวร์ที่เข้ารหัสไฟล์แล้วเรียกค่าไถ่" },
        { "term": "Least Privilege", "def": "ให้สิทธิ์เท่าที่จำเป็นต่อการทำงาน" }
      ]
    },
    {
      "icon": "⚖️",
      "groupTitle": "กฎหมายและข้อมูล",
      "terms": [
        { "term": "PDPA", "eng": "Personal Data Protection Act", "def": "กฎหมายคุ้มครองข้อมูลส่วนบุคคล" },
        { "term": "DPO", "eng": "Data Protection Officer", "def": "ผู้กำกับดูแลงานคุ้มครองข้อมูลส่วนบุคคล" },
        { "term": "Hash", "def": "ค่าที่ใช้ตรวจสอบความถูกต้องและความคงสภาพของข้อมูล" },
        { "term": "Metadata", "def": "ข้อมูลกำกับไฟล์ เช่น วันเวลา อุปกรณ์ ตำแหน่ง" },
        { "term": "OSINT", "eng": "Open Source Intelligence", "def": "การสืบค้นข้อมูลจากแหล่งเปิดสาธารณะ" }
      ]
    },
    {
      "icon": "🤖",
      "groupTitle": "เทคโนโลยีเกิดใหม่",
      "terms": [
        { "term": "Blockchain", "def": "โครงสร้างข้อมูลแบบบล็อกเชื่อมกันด้วยแฮช" },
        { "term": "IoT", "eng": "Internet of Things", "def": "อุปกรณ์จำนวนมากเชื่อมต่ออินเทอร์เน็ต" },
        { "term": "Big Data", "def": "ข้อมูลขนาดใหญ่ที่มีปริมาณ ความเร็ว และความหลากหลายสูง" },
        { "term": "Cloud Computing", "def": "การใช้ทรัพยากรคอมพิวเตอร์ผ่านอินเทอร์เน็ต" },
        { "term": "Deepfake", "def": "สื่อปลอมที่สร้างหรือดัดแปลงด้วย AI" }
      ]
    }
  ],
  "tips": [
    "ถ้าโจทย์ถามเรื่อง <strong>หน้าที่ของอุปกรณ์</strong> ให้จับคู่ก่อนว่าเป็น Input, Output, Storage หรือ Network",
    "ถ้าโจทย์ถามคำสั่ง Office ให้ระวังตัวเลือกที่ชื่อคล้ายกัน เช่น <strong>Page Break</strong> กับ <strong>Section Break</strong>, <strong>Header</strong> กับ <strong>Footer</strong>",
    "ถ้าเจอคำถามแนวเครือข่าย ให้แยก <strong>IP</strong>, <strong>MAC</strong>, <strong>DNS</strong>, <strong>Gateway</strong> ออกจากกันให้ชัด",
    "ถ้าโจทย์พูดถึงการลวงให้กดลิงก์หรือกรอกรหัสผ่าน มักตอบ <strong>Phishing</strong> หรือ <strong>Social Engineering</strong>",
    "ถ้าโจทย์เน้นการเก็บหลักฐานให้คงสภาพเดิม ให้คิดถึง <strong>Hash</strong> และ <strong>Chain of Custody</strong>",
    "ถ้าโจทย์เป็นแนวบริการคลาวด์ผ่านเว็บ เช่น Google Docs, Microsoft 365 ให้โยงไปที่ <strong>SaaS</strong>"
  ]
};

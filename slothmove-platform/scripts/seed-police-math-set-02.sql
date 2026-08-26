begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_02_free',
  'คณิตศาสตร์ ชุดที่ 2',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 2 จำนวน 30 ข้อ พร้อมเฉลย',
  1900,
  'exam_set',
  '{"course_id":"police_admin","subject_id":"math","access_type":"paid"}'::jsonb,
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  type = excluded.type,
  metadata = excluded.metadata,
  is_published = excluded.is_published;

insert into public.exam_sets (
  id, course_id, subject_id, product_id, title, description, source_label,
  access_type, duration_minutes, total_questions, metadata, is_published
)
values (
  'police-math-set-02',
  'police_admin',
  'math',
  'police_math_set_02_free',
  'คณิตศาสตร์ ชุดที่ 2',
  'อนุกรม อุปมาอุปไมย การคำนวณ สมการ ความน่าจะเป็น เรขาคณิต เซต ตรรกศาสตร์ และมิติสัมพันธ์',
  'SlothMoveTH Template 1 Clone: QA Passed',
  'paid',
  45,
  30,
  jsonb_build_object('version', 2, 'qa_status', 'passed', 'content_source', 'slothmove_template1_clone_set01_QA_PASSED.json'),
  true
)
on conflict (id) do update set
  product_id = excluded.product_id,
  title = excluded.title,
  description = excluded.description,
  source_label = excluded.source_label,
  access_type = excluded.access_type,
  duration_minutes = excluded.duration_minutes,
  total_questions = excluded.total_questions,
  metadata = excluded.metadata,
  is_published = excluded.is_published,
  updated_at = timezone('utc'::text, now());

insert into public.product_items (product_id, subject_id, item_id)
select 'police_math_set_02_free', 'math', 'police-math-set-02'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_02_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-02'
);

create temporary table seed_police_math_set_02 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_02 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$[{"position":1,"category":"อนุกรม","subcategory":"ผลต่างกำลังสอง","difficulty":"HARD","prompt":"จงหาจำนวนถัดไป: 11, 15, 24, 40, 65, ?","choices":["95","99","101","104"],"correct_choice_index":2,"explanation":"ผลต่างระหว่างพจน์คือ 4, 9, 16, 25 ซึ่งเท่ากับ 2², 3², 4², 5² ดังนั้นผลต่างถัดไปคือ 6² = 36 และพจน์ถัดไป = 65 + 36 = 101","tip":"ถ้าผลต่างไม่คงที่ ให้ลองดูว่าผลต่างเป็นกำลังสอง กำลังสาม หรือมีรูปแบบย่อยหรือไม่","source_question_id":"SM-T1-S01-Q001","media":{}},{"position":2,"category":"อนุกรม","subcategory":"ฐานเพิ่ม-เลขชี้กำลังลด","difficulty":"MEDIUM","prompt":"จงหาจำนวนถัดไป: 32, 81, 64, 25, 6, ?","choices":["0","1","7","49"],"correct_choice_index":1,"explanation":"เขียนแต่ละพจน์ได้เป็น 2⁵ = 32, 3⁴ = 81, 4³ = 64, 5² = 25, 6¹ = 6 ดังนั้นพจน์ถัดไปคือ 7⁰ = 1","tip":"อนุกรมบางชุดต้องมองทั้งฐานและเลขชี้กำลังพร้อมกัน ไม่ควรดูเฉพาะผลต่าง","source_question_id":"SM-T1-S01-Q002","media":{}},{"position":3,"category":"อุปมาอุปไมย","subcategory":"เครื่องมือกับหน้าที่","difficulty":"EASY","prompt":"กุญแจ : ปลดล็อก :: ยาแก้ปวด : ?","choices":["รักษาแผล","บรรเทาปวด","เพิ่มไข้","วัดอุณหภูมิ"],"correct_choice_index":1,"explanation":"กุญแจมีหน้าที่ใช้ปลดล็อก เช่นเดียวกับยาแก้ปวดมีหน้าที่หลักเพื่อบรรเทาอาการปวด","tip":"อุปมาแบบสิ่งของกับหน้าที่ ให้หาหน้าที่หลักที่เฉพาะเจาะจงที่สุด","source_question_id":"SM-T1-S01-Q003","media":{}},{"position":4,"category":"อุปมาอุปไมย","subcategory":"เครื่องมือวัดกับสิ่งที่วัด","difficulty":"EASY","prompt":"ตาชั่ง : น้ำหนัก :: นาฬิกา : ?","choices":["ระยะทาง","อุณหภูมิ","เวลา","ความเร็ว"],"correct_choice_index":2,"explanation":"ตาชั่งใช้วัดน้ำหนัก ส่วนนาฬิกาใช้บอกหรือวัดเวลา ความสัมพันธ์จึงเป็นเครื่องมือกับปริมาณที่ใช้วัด","tip":"จับชนิดความสัมพันธ์ของคู่แรกก่อน แล้วค่อยเทียบตัวเลือก","source_question_id":"SM-T1-S01-Q004","media":{}},{"position":5,"category":"ลำดับเหตุการณ์","subcategory":"เรียงลำดับหลายเงื่อนไข","difficulty":"MEDIUM","prompt":"ในการส่งรายงาน เมย์ส่งก่อนมิ้น มิ้นส่งก่อนพลอย พลอยส่งก่อนมาย และมุกส่งหลังมาย ใครส่งเป็นคนที่ 3","choices":["มิ้น","พลอย","มาย","มุก"],"correct_choice_index":1,"explanation":"เรียงเงื่อนไขได้ เมย์ < มิ้น < พลอย < มาย < มุก ดังนั้นคนที่ 3 คือพลอย","tip":"เขียนเงื่อนไขเป็นเส้นเดียวจากก่อน → หลัง แล้วค่อยตอบตำแหน่ง","source_question_id":"SM-T1-S01-Q005","media":{}},{"position":6,"category":"ลำดับเปรียบเทียบ","subcategory":"เปรียบเทียบหลายคน","difficulty":"MEDIUM","prompt":"ก สูงกว่า ข, ค สูงกว่า ก, ง สูงกว่า ขแต่เตี้ยกว่า ก และ จ เตี้ยกว่า ข ใครสูงเป็นอันดับที่ 2","choices":["ก","ข","ค","ง"],"correct_choice_index":0,"explanation":"เรียงได้ ค > ก > ง > ข > จ ดังนั้นคนที่สูงเป็นอันดับที่ 2 คือ ก","tip":"แปลงคำว่า สูงกว่า/เตี้ยกว่า เป็นเครื่องหมาย > และ < จะเห็นลำดับชัดขึ้น","source_question_id":"SM-T1-S01-Q006","media":{}},{"position":7,"category":"บัญญัติไตรยางศ์","subcategory":"สัดส่วนตรง","difficulty":"EASY","prompt":"เครื่องพิมพ์พิมพ์เอกสาร 420 หน้าใน 6 นาที ด้วยอัตราคงที่ ใน 15 นาทีจะพิมพ์ได้กี่หน้า","choices":["900 หน้า","1,000 หน้า","1,050 หน้า","1,120 หน้า"],"correct_choice_index":2,"explanation":"พิมพ์ได้ต่อนาที = 420 ÷ 6 = 70 หน้า ดังนั้น 15 นาทีพิมพ์ได้ 70 × 15 = 1,050 หน้า","tip":"สัดส่วนตรงสามารถหา 1 หน่วยก่อนแล้วคูณกลับได้","source_question_id":"SM-T1-S01-Q007","media":{}},{"position":8,"category":"อัตราส่วน","subcategory":"อัตราส่วนต่อเนื่อง 3 จำนวน","difficulty":"HARD","prompt":"ถ้าเงินของ ก : ข = 5 : 8 และ ข : ค = 12 : 7 โดยทั้งสามคนมีเงินรวมกัน 5,300 บาท เงินของ ก และ ค รวมกันเท่าใด","choices":["2,700 บาท","2,800 บาท","2,900 บาท","3,000 บาท"],"correct_choice_index":2,"explanation":"ทำ ข ให้เท่ากัน: ก:ข = 15:24 และ ข:ค = 24:14 จึงได้ ก:ข:ค = 15:24:14 รวม 53 ส่วน = 5,300 บาท ดังนั้น 1 ส่วน = 100 บาท ก+ค = (15+14)×100 = 2,900 บาท","tip":"อัตราส่วนต่อเนื่องต้องทำตัวกลางให้เท่ากันก่อน แล้วจึงรวมเป็นอัตราส่วนสามจำนวน","source_question_id":"SM-T1-S01-Q008","media":{}},{"position":9,"category":"จำนวนเต็ม","subcategory":"จำนวนเต็มติดลบและลำดับการคำนวณ","difficulty":"EASY","prompt":"ถ้า a = -12, b = 5 และ c = -4 แล้ว a - (b × c) มีค่าเท่าใด","choices":["-32","-8","8","32"],"correct_choice_index":2,"explanation":"คำนวณในวงเล็บก่อน: b×c = 5×(-4) = -20 ดังนั้น a - (b×c) = -12 - (-20) = -12 + 20 = 8","tip":"ลบจำนวนลบเท่ากับบวกจำนวนบวก และต้องทำการคูณก่อนบวก/ลบ","source_question_id":"SM-T1-S01-Q009","media":{}},{"position":10,"category":"ร้อยละ","subcategory":"ส่วนที่เหลือจากเปอร์เซ็นต์","difficulty":"EASY","prompt":"ห้องสมุดมีหนังสือ 640 เล่ม เป็นหนังสือนิยาย 35% ที่เหลือเป็นหนังสือประเภทอื่น มีหนังสือประเภทอื่นกี่เล่ม","choices":["224 เล่ม","396 เล่ม","416 เล่ม","426 เล่ม"],"correct_choice_index":2,"explanation":"หนังสือนิยาย = 35% ของ 640 = 224 เล่ม ดังนั้นประเภทอื่น = 640 - 224 = 416 เล่ม","tip":"ถ้าถามส่วนที่เหลือ สามารถใช้ 100% - เปอร์เซ็นต์ที่ให้ แล้วคูณจำนวนทั้งหมดได้เช่นกัน","source_question_id":"SM-T1-S01-Q010","media":{}},{"position":11,"category":"กำไรขาดทุน","subcategory":"กำไรเป็นร้อยละ","difficulty":"EASY","prompt":"ซื้อเครื่องใช้ไฟฟ้ามา 4,800 บาท แล้วขาย 6,000 บาท ได้กำไรกี่เปอร์เซ็นต์","choices":["20%","25%","30%","35%"],"correct_choice_index":1,"explanation":"กำไร = 6,000 - 4,800 = 1,200 บาท กำไร% = (1,200 ÷ 4,800) × 100 = 25%","tip":"กำไรหรือขาดทุนเป็นเปอร์เซ็นต์ ให้ใช้ราคาทุนเป็นฐาน","source_question_id":"SM-T1-S01-Q011","media":{}},{"position":12,"category":"กำไรขาดทุน","subcategory":"ย้อนหาราคาทุนแล้วตั้งราคาขายใหม่","difficulty":"MEDIUM","prompt":"ขายกระเป๋า 1,560 บาท ได้กำไร 20% ถ้าต้องการกำไร 35% จากทุนเดิม ควรขายราคาเท่าใด","choices":["1,690 บาท","1,720 บาท","1,755 บาท","1,820 บาท"],"correct_choice_index":2,"explanation":"ทุน = 1,560 ÷ 1.20 = 1,300 บาท ต้องการกำไร 35% จึงขาย = 1,300 × 1.35 = 1,755 บาท","tip":"เมื่อรู้ราคาขายและเปอร์เซ็นต์กำไร ต้องย้อนหาทุนก่อนแล้วจึงคิดเปอร์เซ็นต์ใหม่","source_question_id":"SM-T1-S01-Q012","media":{}},{"position":13,"category":"สมการ","subcategory":"สมการเชิงเส้นมีวงเล็บ","difficulty":"MEDIUM","prompt":"จงหาค่า x จากสมการ 5(2x - 3) - 4 = 3(x + 7) + 2","choices":["4","5","6","7"],"correct_choice_index":2,"explanation":"ซ้าย = 10x - 15 - 4 = 10x - 19 ขวา = 3x + 21 + 2 = 3x + 23 ดังนั้น 10x - 19 = 3x + 23 → 7x = 42 → x = 6","tip":"กระจายวงเล็บและรวมพจน์เหมือนกันให้เรียบร้อยก่อนย้ายข้าง","source_question_id":"SM-T1-S01-Q013","media":{}},{"position":14,"category":"งานและเวลา","subcategory":"อัตราส่วนผกผัน","difficulty":"EASY","prompt":"คนงาน 8 คนทำงานชิ้นหนึ่งเสร็จใน 15 วัน ถ้าคนงานทุกคนมีประสิทธิภาพเท่ากัน และเพิ่มเป็น 12 คน จะใช้กี่วัน","choices":["8 วัน","10 วัน","12 วัน","18 วัน"],"correct_choice_index":1,"explanation":"งานรวม = 8×15 = 120 คน-วัน เมื่อมี 12 คน ใช้เวลา = 120 ÷ 12 = 10 วัน","tip":"งานคงที่และประสิทธิภาพเท่ากัน ใช้ จำนวนคน × จำนวนวัน = ค่าคงที่","source_question_id":"SM-T1-S01-Q014","media":{}},{"position":15,"category":"อายุ","subcategory":"อายุในอดีต","difficulty":"MEDIUM","prompt":"ปัจจุบันพ่ออายุมากกว่าลูก 32 ปี เมื่อ 6 ปีที่แล้ว พ่อมีอายุเป็น 5 เท่าของลูก ปัจจุบันลูกอายุเท่าใด","choices":["12 ปี","14 ปี","16 ปี","18 ปี"],"correct_choice_index":1,"explanation":"ให้ลูกปัจจุบันอายุ x ปี พ่ออายุ x+32 ปี เมื่อ 6 ปีก่อน ลูก x-6 และพ่อ x+26 จึงได้ x+26 = 5(x-6) → x+26 = 5x-30 → 56 = 4x → x = 14","tip":"ตั้งอายุปัจจุบันเป็นตัวแปรก่อน แล้วปรับทุกคนด้วยจำนวนปีเท่ากันเมื่อย้อนอดีตหรือไปอนาคต","source_question_id":"SM-T1-S01-Q015","media":{}},{"position":16,"category":"อสมการ","subcategory":"อสมการสองด้านและจำนวนเต็มบวก","difficulty":"MEDIUM","prompt":"จำนวนเต็มบวกที่ทำให้อสมการ -5 < 2x + 1 ≤ 13 เป็นจริง มีทั้งหมดกี่จำนวน","choices":["4","5","6","7"],"correct_choice_index":2,"explanation":"ลบ 1 ทุกพจน์ได้ -6 < 2x ≤ 12 หาร 2 ได้ -3 < x ≤ 6 จำนวนเต็มบวกคือ 1,2,3,4,5,6 รวม 6 จำนวน","tip":"อสมการสองด้านต้องทำการบวก ลบ คูณ หรือหารกับทุกส่วนพร้อมกัน","source_question_id":"SM-T1-S01-Q016","media":{}},{"position":17,"category":"ความน่าจะเป็น","subcategory":"หยิบโดยไม่คืน","difficulty":"MEDIUM","prompt":"กล่องมีลูกบอลสีแดง 4 ลูก และสีน้ำเงิน 3 ลูก สุ่มหยิบพร้อมกัน 2 ลูก ความน่าจะเป็นที่จะได้ลูกบอลสีเดียวกันเท่ากับเท่าใด","choices":["2/7","3/7","4/7","5/7"],"correct_choice_index":1,"explanation":"จำนวนวิธีหยิบ 2 ลูกจาก 7 ลูก = C(7,2)=21 วิธี ได้สีเดียวกัน: แดง 2 ลูก C(4,2)=6 วิธี และน้ำเงิน 2 ลูก C(3,2)=3 วิธี รวม 9 วิธี ดังนั้นความน่าจะเป็น = 9/21 = 3/7","tip":"การหยิบพร้อมกันโดยไม่สนลำดับ ใช้การจัดหมู่ C(n,r) จะลดการนับซ้ำ","source_question_id":"SM-T1-S01-Q017","media":{}},{"position":18,"category":"การจัดเรียง","subcategory":"การจัดเรียงรอบวงกลมแบบติดกัน","difficulty":"MEDIUM","prompt":"มีคน 6 คนนั่งรอบโต๊ะกลม ถ้ากำหนดให้ ก และ ข ต้องนั่งติดกัน จะจัดได้ทั้งหมดกี่วิธี","choices":["24 วิธี","36 วิธี","48 วิธี","60 วิธี"],"correct_choice_index":2,"explanation":"มอง ก-ข เป็น 1 กลุ่ม จะเหลือ 5 หน่วยรอบวงกลม จัดได้ (5-1)! = 24 วิธี และภายในกลุ่มสลับ ก-ข ได้ 2 วิธี รวม 24×2 = 48 วิธี","tip":"เงื่อนไขต้องติดกัน ให้จับเป็น 1 ก้อนก่อน แล้วคูณวิธีสลับภายในก้อน","source_question_id":"SM-T1-S01-Q018","media":{}},{"position":19,"category":"เลขยกกำลัง","subcategory":"เปรียบเทียบเลขยกกำลังฐานสัมพันธ์กัน","difficulty":"MEDIUM","prompt":"ข้อใดเรียงจำนวนจากมากไปน้อยได้ถูกต้อง","choices":["8²⁷ > 4⁴⁰ > 2⁷⁹ > 16¹⁹","4⁴⁰ > 8²⁷ > 2⁷⁹ > 16¹⁹","8²⁷ > 2⁷⁹ > 4⁴⁰ > 16¹⁹","16¹⁹ > 8²⁷ > 4⁴⁰ > 2⁷⁹"],"correct_choice_index":0,"explanation":"แปลงเป็นฐาน 2: 8²⁷ = 2⁸¹, 4⁴⁰ = 2⁸⁰, 2⁷⁹ = 2⁷⁹ และ 16¹⁹ = 2⁷⁶ ดังนั้นเรียงได้ 8²⁷ > 4⁴⁰ > 2⁷⁹ > 16¹⁹","tip":"ถ้าฐานเป็นกำลังของจำนวนเดียวกัน ให้แปลงเป็นฐานเดียวกันก่อนเปรียบเทียบเลขชี้กำลัง","source_question_id":"SM-T1-S01-Q019","media":{}},{"position":20,"category":"พหุนาม","subcategory":"ทฤษฎีเศษเหลือ","difficulty":"MEDIUM","prompt":"เศษเหลือจากการนำ x - 2 ไปหาร P(x) = 3x³ - 2x² + 4x - 7 เท่ากับเท่าใด","choices":["13","15","17","19"],"correct_choice_index":2,"explanation":"ตามทฤษฎีเศษเหลือ เมื่อหารด้วย x-2 เศษคือ P(2) = 3(8) - 2(4) + 4(2) - 7 = 24 - 8 + 8 - 7 = 17","tip":"หารด้วย x-a ให้แทน x=a ในพหุนามเพื่อหาเศษ","source_question_id":"SM-T1-S01-Q020","media":{}},{"position":21,"category":"อนุกรม","subcategory":"พจน์ที่ n ของลำดับผลต่างเชิงเส้น","difficulty":"HARD","prompt":"กำหนดลำดับ 3, 8, 15, 24, 35, ... พจน์ที่ 40 มีค่าเท่าใด","choices":["1,600","1,640","1,680","1,720"],"correct_choice_index":2,"explanation":"ผลต่างคือ 5,7,9,11,... ซึ่งเพิ่มทีละ 2 ลำดับนี้เขียนได้เป็น aₙ = n² + 2n ตรวจสอบ n=1 ได้ 3 และ n=2 ได้ 8 ดังนั้น a₄₀ = 40² + 2(40) = 1,600 + 80 = 1,680","tip":"ถ้าผลต่างชั้นที่ 1 เป็นลำดับเลขคณิต มักเขียนพจน์ทั่วไปเป็นพหุนามดีกรี 2 ได้","source_question_id":"SM-T1-S01-Q021","media":{}},{"position":22,"category":"เรขาคณิต","subcategory":"สี่เหลี่ยมจัตุรัสจากพื้นที่","difficulty":"MEDIUM","prompt":"สี่เหลี่ยมจัตุรัสมีพื้นที่ 288 ตารางหน่วย เส้นทแยงมุมยาวเท่าใด","choices":["12√2 หน่วย","18 หน่วย","24 หน่วย","24√2 หน่วย"],"correct_choice_index":2,"explanation":"ถ้าด้านยาว s จะมี s² = 288 = 144×2 ดังนั้น s = 12√2 เส้นทแยงมุม d = s√2 = 12√2×√2 = 24","tip":"สี่เหลี่ยมจัตุรัสใช้ d = s√2 และพื้นที่ = s²","source_question_id":"SM-T1-S01-Q022","media":{}},{"position":23,"category":"ค่าเฉลี่ย","subcategory":"หาค่าที่ขาดจากค่าเฉลี่ย","difficulty":"EASY","prompt":"คะแนนสอบ 4 ครั้งมีค่าเฉลี่ย 68 คะแนน ถ้า 3 ครั้งแรกได้ 65, 72 และ 70 คะแนน ครั้งที่ 4 ต้องได้กี่คะแนน","choices":["63","65","67","69"],"correct_choice_index":1,"explanation":"คะแนนรวมที่ต้องมี = 68×4 = 272 คะแนน สามครั้งแรกรวม 65+72+70 = 207 ดังนั้นครั้งที่ 4 = 272-207 = 65","tip":"ค่าเฉลี่ย × จำนวนข้อมูล = ผลรวมทั้งหมด","source_question_id":"SM-T1-S01-Q023","media":{}},{"position":24,"category":"เซต","subcategory":"ยูเนียนและส่วนเติมเต็ม","difficulty":"MEDIUM","prompt":"สำรวจคน 120 คน พบว่าชอบชา 75 คน ชอบกาแฟ 68 คน และไม่ชอบทั้งชาและกาแฟ 15 คน คนที่ชอบทั้งชาและกาแฟมีกี่คน","choices":["28 คน","35 คน","38 คน","43 คน"],"correct_choice_index":2,"explanation":"คนที่ชอบอย่างน้อยหนึ่งอย่าง = 120-15 = 105 คน ใช้ n(A∪B)=n(A)+n(B)-n(A∩B) จึงได้ 105 = 75+68 - n(A∩B) ดังนั้น n(A∩B)=38","tip":"ถ้าให้จำนวนคนที่ไม่อยู่ในสองกลุ่ม ให้หายูเนียนจากจำนวนทั้งหมดก่อน","source_question_id":"SM-T1-S01-Q024","media":{}},{"position":25,"category":"เซต","subcategory":"จำนวนสมาชิกส่วนร่วมและจำนวนเซตย่อย","difficulty":"MEDIUM","prompt":"กำหนด n(A)=10, n(B)=8 และ n(A ∪ B)=13 จำนวนเซตย่อยทั้งหมดของ A ∩ B มีกี่เซต","choices":["16","24","32","64"],"correct_choice_index":2,"explanation":"n(A∩B)=10+8-13=5 ดังนั้น A∩B มี 5 สมาชิก จำนวนเซตย่อยทั้งหมด = 2⁵ = 32","tip":"หา n(A∩B) ก่อน แล้วใช้จำนวนเซตย่อยทั้งหมดของเซตที่มี n สมาชิกเท่ากับ 2ⁿ","source_question_id":"SM-T1-S01-Q025","media":{}},{"position":26,"category":"ตรรกศาสตร์","subcategory":"อนุมานแบบลูกโซ่","difficulty":"MEDIUM","prompt":"กำหนดว่า นักบินทุกคนต้องผ่านการตรวจสุขภาพ ผู้ที่ผ่านการตรวจสุขภาพทุกคนจะได้รับบัตรรับรอง และก้องเป็นนักบิน ข้อใดสรุปได้แน่นอน","choices":["ก้องเป็นแพทย์","ก้องได้รับบัตรรับรอง","ผู้มีบัตรรับรองทุกคนเป็นนักบิน","ก้องไม่ต้องตรวจสุขภาพ"],"correct_choice_index":1,"explanation":"ก้องเป็นนักบิน → ต้องผ่านการตรวจสุขภาพ → ผู้ผ่านการตรวจสุขภาพได้รับบัตรรับรอง ดังนั้นก้องได้รับบัตรรับรอง","tip":"ตรรกะแบบลูกโซ่ให้ไล่เงื่อนไขไปข้างหน้า ห้ามสรุปย้อนกลับโดยไม่มีเหตุผล","source_question_id":"SM-T1-S01-Q026","media":{}},{"position":27,"category":"ตรรกศาสตร์","subcategory":"Modus Tollens และเงื่อนไขต่อเนื่อง","difficulty":"MEDIUM","prompt":"ถ้า P แล้ว Q และถ้า Q แล้ว R แต่กำหนดว่า R เป็นเท็จ ข้อใดสรุปได้แน่นอน","choices":["P เป็นจริง","Q เป็นจริง","P เป็นเท็จ","สรุปเกี่ยวกับ P ไม่ได้"],"correct_choice_index":2,"explanation":"จาก Q → R และ R เป็นเท็จ สรุปด้วย modus tollens ว่า Q เป็นเท็จ จาก P → Q และ Q เป็นเท็จ จึงสรุปต่อว่า P เป็นเท็จ","tip":"ถ้า A→B และ B เท็จ จะสรุปได้ว่า A เท็จ แต่ถ้า B จริงจะย้อนสรุป A ไม่ได้","source_question_id":"SM-T1-S01-Q027","media":{}},{"position":28,"category":"รูปภาพ/มิติสัมพันธ์","subcategory":"Matrix 3×3 สองคุณลักษณะ","difficulty":"HARD","prompt":"จากภาพ Matrix 3×3 ช่องล่างขวาควรเป็นรูปใด","choices":["สามเหลี่ยมชี้ขึ้น สีดำ","สามเหลี่ยมชี้ขึ้น สีเทา","สามเหลี่ยมชี้ขวา สีดำ","สามเหลี่ยมชี้ซ้าย สีขาว"],"correct_choice_index":0,"explanation":"ทิศของสามเหลี่ยมในแต่ละแถวหมุนตามลำดับ ขึ้น→ขวา→ลง, ขวา→ลง→ซ้าย, ลง→ซ้าย→ขึ้น ขณะเดียวกันสีหมุนเป็น ดำ→เทา→ขาว, ขาว→ดำ→เทา, เทา→ขาว→ดำ ดังนั้นช่องสุดท้ายต้องเป็นสามเหลี่ยมชี้ขึ้น สีดำ","tip":"Matrix ที่ยากมักมีมากกว่า 1 กฎ ให้แยกตรวจทีละคุณลักษณะ เช่น ทิศทาง สี จำนวน หรือการเติมลาย","source_question_id":"SM-T1-S01-Q028","media":{"src":"/exams/police-math-set-02/sm-t1-s01-q028.svg","alt":"ภาพประกอบข้อ 28: Matrix 3×3 สองคุณลักษณะ","choiceImages":[{"src":"/exams/police-math-set-02/q028-choice-a.svg","alt":"สามเหลี่ยมชี้ขึ้น สีดำ"},{"src":"/exams/police-math-set-02/q028-choice-b.svg","alt":"สามเหลี่ยมชี้ขึ้น สีเทา"},{"src":"/exams/police-math-set-02/q028-choice-c.svg","alt":"สามเหลี่ยมชี้ขวา สีดำ"},{"src":"/exams/police-math-set-02/q028-choice-d.svg","alt":"สามเหลี่ยมชี้ซ้าย สีขาว"}]}},{"position":29,"category":"รูปภาพ/มิติสัมพันธ์","subcategory":"การพับกระดาษและสะท้อนตำแหน่ง","difficulty":"MEDIUM","prompt":"จากภาพ กระดาษสี่เหลี่ยมถูกพับซ้ายไปขวา แล้วพับล่างขึ้นบน จากนั้นเจาะรู 1 รูใกล้มุมขวาบนของกระดาษที่พับแล้ว เมื่อคลี่ออกทั้งหมด รูจะปรากฏแบบใด","choices":["4 รู ใกล้ทั้ง 4 มุมของกระดาษ","4 รู อยู่รอบจุดกึ่งกลาง","2 รู อยู่ด้านซ้ายและขวา","8 รู กระจายเท่ากัน"],"correct_choice_index":0,"explanation":"พับสองครั้งทำให้กระดาษซ้อนกัน 4 ชั้น รูที่เจาะใกล้มุมขวาบนของส่วนที่พับแล้วจะสะท้อนตามแนวพับแนวนอนและแนวตั้ง เมื่อคลี่ออกจึงได้ 4 รูในตำแหน่งสมมาตรใกล้ทั้ง 4 มุม","tip":"โจทย์พับกระดาษให้คลี่กลับทีละรอยพับ และสะท้อนตำแหน่งรูข้ามเส้นพับทุกครั้ง","source_question_id":"SM-T1-S01-Q029","media":{"src":"/exams/police-math-set-02/sm-t1-s01-q029.svg","alt":"ภาพประกอบข้อ 29: การพับกระดาษและสะท้อนตำแหน่ง","choiceImages":[{"src":"/exams/police-math-set-02/q029-choice-a.svg","alt":"4 รู ใกล้ทั้ง 4 มุมของกระดาษ"},{"src":"/exams/police-math-set-02/q029-choice-b.svg","alt":"4 รู อยู่รอบจุดกึ่งกลาง"},{"src":"/exams/police-math-set-02/q029-choice-c.svg","alt":"2 รู อยู่ด้านซ้ายและขวา"},{"src":"/exams/police-math-set-02/q029-choice-d.svg","alt":"8 รู กระจายเท่ากัน"}]}},{"position":30,"category":"รูปภาพ/มิติสัมพันธ์","subcategory":"ภาพคลี่ลูกบาศก์","difficulty":"HARD","prompt":"จากภาพคลี่ลูกบาศก์ เมื่อพับเป็นลูกบาศก์ หน้าใดจะอยู่ตรงข้ามกับหน้า A","choices":["B","C","D","E"],"correct_choice_index":2,"explanation":"หน้า A มี B, C, E และ F เป็นหน้าที่ติดกับ A โดยตรง เมื่อพับ C ขึ้นเป็นด้านข้าง หน้า D ที่ต่อจาก C จะพับไปอยู่ด้านหลังของ A จึงเป็นหน้าตรงข้าม A","tip":"ในภาพคลี่ ให้เริ่มจากหน้าที่ถามเป็นฐาน แล้วติดตามหน้าที่ต่อออกไปสองรอยพับเพื่อหาหน้าที่หันกลับไปคนละทิศ","source_question_id":"SM-T1-S01-Q030","media":{"src":"/exams/police-math-set-02/sm-t1-s01-q030.svg","alt":"ภาพประกอบข้อ 30: ภาพคลี่ลูกบาศก์"}}]$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  data->'media',
  jsonb_build_object(
    'source_question_id', data->>'source_question_id',
    'subcategory', data->>'subcategory',
    'difficulty', data->>'difficulty',
    'qa_status', 'passed'
  )
from seed_police_math_set_02
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  (data->>'correct_choice_index')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 2, 'qa_status', 'passed', 'source', 'slothmove_template1_clone_set01_QA_PASSED.json')
from seed_police_math_set_02
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-02',
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_02
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-02';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-02';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-02'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 3 then
    raise exception 'Set 2 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;

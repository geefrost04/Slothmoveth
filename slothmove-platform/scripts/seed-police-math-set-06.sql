begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_06_free',
  'คณิตศาสตร์ ชุดที่ 6',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 6 จำนวน 30 ข้อ พร้อมเฉลย',
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
  'police-math-set-06',
  'police_admin',
  'math',
  'police_math_set_06_free',
  'คณิตศาสตร์ ชุดที่ 6',
  'ข้อสอบสร้างใหม่จากต้นฉบับชุดที่ 2 โดยคงแนวข้อสอบและระดับความยาก พร้อมภาพประกอบ 3 ข้อ',
  'NotebookLM Source Set 2 -> SlothMove Additional Set 6',
  'paid',
  45,
  30,
  jsonb_build_object('version', 6, 'qa_status', 'passed', 'base_source_set', 2, 'content_source', 'police-math-set-06-original.json', 'difficulty_policy', 'same_or_harder_than_source', 'generated_images_with_chatgpt', true, 'media_question_count', 3),
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
select 'police_math_set_06_free', 'math', 'police-math-set-06'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_06_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-06'
);

create temporary table seed_police_math_set_06 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_06 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$[{"position":1,"category":"อนุกรมผลต่างเพิ่ม","prompt":"60, 68, 82, 106, 146, ... จำนวนถัดไปคือข้อใด","choices":["204","210","214","220"],"correctChoiceIndex":1,"explanation":"ผลต่างคือ 8,14,24,40 โดยผลต่างชั้นสองคือ 6,10,16 และต่อเป็น 24 ทำให้ผลต่างถัดไป 64 ดังนั้น 146+64 = 210","tip":"ชุดนี้ยากขึ้นเพราะต้องดูผลต่างชั้นสอง"},{"position":2,"category":"อนุกรมสลับ","prompt":"3, 6, 9, 12, 15, 30, 21, 60, ... จำนวนถัดไปคือข้อใด","choices":["24","25","27","30"],"correctChoiceIndex":2,"explanation":"ตำแหน่งคี่เป็น 3,9,15,21 เพิ่มทีละ 6 ดังนั้นตัวถัดไปตำแหน่งคี่คือ 27 ส่วนตำแหน่งคู่คูณ 2","tip":"แยกตำแหน่งคี่-คู่เมื่อรูปแบบสลับกัน"},{"position":3,"category":"อุปมาอุปไมย","prompt":"น้ำปลา : ปลา → น้ำตาล : ?","choices":["อ้อย","เกลือ","ข้าว","นม"],"correctChoiceIndex":0,"explanation":"น้ำปลาผลิตจากปลา น้ำตาลผลิตจากอ้อย","tip":"หาความสัมพันธ์แบบวัตถุดิบกับผลิตภัณฑ์"},{"position":4,"category":"อุปมาอุปไมย","prompt":"ร้อน : เย็น → สูง : ?","choices":["มาก","ต่ำ","กว้าง","ไกล"],"correctChoiceIndex":1,"explanation":"ร้อนกับเย็นเป็นคำตรงข้าม สูงกับต่ำเป็นคำตรงข้าม","tip":"ตรวจว่าเป็นความหมายเหมือนหรือตรงข้าม"},{"position":5,"category":"อนุกรมภาพ","prompt":"จากภาพ รูปที่หายไปคือรูปใด","choices":["ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D"],"correctChoiceIndex":2,"explanation":"ในตาราง 3×3 จำนวนเส้นเพิ่มตามแถวและทิศทางหมุนตามคอลัมน์ ช่องที่หายไปจึงตรงกับตัวเลือก C","tip":"ดูทั้งแนวนอนและแนวตั้งของตารางภาพ","media":{"src":"/exams/police-math-set-06/q005-missing-figure-gpt.png","alt":"ตารางภาพ 3x3 มีช่องว่างหนึ่งช่องและตัวเลือก A ถึง D สำหรับหารูปที่หายไป"},"imagePrompt":"ChatGPT image generation: nonverbal 3x3 matrix puzzle with line segments and rotations; one missing cell; four options A-D; option C is correct; clean black vector-like bitmap."},{"position":6,"category":"สัญลักษณ์แทนการคำนวณ","prompt":"ถ้า 11 * 2 = 18 และ 12 * 1 = 22 โดย a * b = 2a − 2b แล้ว 15 * 10 = ?","choices":["10","20","25","30"],"correctChoiceIndex":0,"explanation":"ใช้กฎ a*b = 2a−2b จะได้ 15*10 = 30−20 = 10","tip":"อย่าใช้เครื่องหมาย * แบบคูณปกติ ต้องหากฎจากตัวอย่าง"},{"position":7,"category":"ลำดับเปรียบเทียบ","prompt":"แก้วมีเงินมากกว่ากล้าแต่น้อยกว่ากร กุ้งมีเงินเท่ากับกรแต่มากกว่าไก่ ไก่มีเงินมากกว่าแก้ว ใครมีเงินน้อยที่สุด","choices":["กล้า","แก้ว","ไก่","กร"],"correctChoiceIndex":0,"explanation":"กล้า < แก้ว < ไก่ < กร = กุ้ง ดังนั้นกล้ามีเงินน้อยที่สุด","tip":"แปลงเป็นเส้นเรียงลำดับจากน้อยไปมาก"},{"position":8,"category":"ลำดับเหตุการณ์","prompt":"โฟมทำข้อสอบเสร็จก่อนฟิล์มแต่ช้ากว่าเฟรม ฟิล์มเสร็จหลังฟาร์ม เฟรมเสร็จพร้อมฟินแต่ช้ากว่าฟาร์ม ใครทำข้อสอบเสร็จคนแรก","choices":["โฟม","เฟรม","ฟิล์ม","ฟาร์ม"],"correctChoiceIndex":3,"explanation":"ฟาร์มมาก่อนเฟรม/ฟิน ก่อนโฟม ก่อนฟิล์ม ดังนั้นฟาร์มเสร็จคนแรก","tip":"คำว่า “ช้ากว่า” แปลว่าอยู่หลังในเส้นเวลา"},{"position":9,"category":"บัญญัติไตรยางศ์","prompt":"ซื้อเสื้อ 7 ตัว ราคา 910 บาท ถ้าซื้อ 5 ตัว ต้องจ่ายกี่บาท","choices":["600 บาท","650 บาท","700 บาท","750 บาท"],"correctChoiceIndex":1,"explanation":"ราคาต่อชิ้นคือ 910÷7 = 130 บาท ซื้อ 5 ตัวจ่าย 130×5 = 650 บาท","tip":"หาอัตราต่อ 1 ตัวก่อน"},{"position":10,"category":"อัตราส่วน","prompt":"ถ้า M : N = 46 : 105 และ M = 276 แล้ว N เป็นเท่าใด","choices":["420","525","630","735"],"correctChoiceIndex":2,"explanation":"276÷46 = 6 ดังนั้น N = 105×6 = 630","tip":"อัตราส่วนขยายเท่ากันทั้งสองจำนวน"},{"position":11,"category":"การอ่านกราฟ","prompt":"จากกราฟ แนวโน้มของข้อมูลเป็นแบบใด","choices":["ลดลงไม่คงที่","ลดลงคงที่","เพิ่มขึ้นคงที่","เพิ่มขึ้นไม่คงที่"],"correctChoiceIndex":3,"explanation":"ค่าจากกราฟเพิ่มขึ้นทุกช่วง แต่ระยะเพิ่มไม่เท่ากัน จึงเป็นเพิ่มขึ้นไม่คงที่","tip":"อ่านทั้งทิศทางและขนาดการเปลี่ยนแปลง","media":{"src":"/exams/police-math-set-06/q011-trend-graph-gpt.png","alt":"กราฟเส้นค่าข้อมูลเพิ่มขึ้นไม่คงที่จากซ้ายไปขวา"},"imagePrompt":"ChatGPT image generation: clean line graph for aptitude exam, x-axis A-E, y-axis 0-50, points 8, 14, 25, 33, 48 connected by line, no title, no answer highlight."},{"position":12,"category":"ร้อยละ","prompt":"โรงเรียนมีนักเรียน 2,800 คน เป็นนักเรียนหญิง 1,750 คน ถ้านักเรียนชายไม่มาเรียน 70 คน นักเรียนชายที่มาเรียนคิดเป็นร้อยละเท่าไรของนักเรียนทั้งหมด","choices":["35%","37.5%","62.5%","65%"],"correctChoiceIndex":0,"explanation":"นักเรียนชายทั้งหมด 2,800−1,750 = 1,050 คน มาเรียน 1,050−70 = 980 คน คิดเป็น 980÷2,800×100 = 35%","tip":"ระวังฐานร้อยละคือ “นักเรียนทั้งหมด” ไม่ใช่นักเรียนชาย"},{"position":13,"category":"ร้อยละซ้อน","prompt":"45% ของ 840 เป็นกี่เปอร์เซ็นต์ของ 504","choices":["65%","70%","75%","80%"],"correctChoiceIndex":2,"explanation":"45% ของ 840 = 378 และ 378 เป็น 378÷504×100 = 75% ของ 504","tip":"หา “ของจำนวนแรก” ก่อน แล้วค่อยเทียบกับจำนวนที่สอง"},{"position":14,"category":"กำไรและส่วนลด","prompt":"ซื้อรถมือสอง 800,000 บาท ติดราคาขายกำไร 25% แต่ลดเงินสด 8% จากราคาที่ติด เจ้าของได้กำไรกี่บาท","choices":["120,000 บาท","150,000 บาท","160,000 บาท","200,000 บาท"],"correctChoiceIndex":0,"explanation":"ราคาติด = 800,000×1.25 = 1,000,000 ลด 8% เหลือ 920,000 กำไร = 120,000 บาท","tip":"ส่วนลดเงินสดคิดจากราคาที่ติด ไม่ใช่จากทุน"},{"position":15,"category":"อัตราส่วนพีชคณิต","prompt":"ถ้า x + 2y : 5y − x = 1 : 2 จงหาค่า x : y","choices":["1 : 2","1 : 3","2 : 1","3 : 1"],"correctChoiceIndex":1,"explanation":"ตั้ง 2(x+2y)=5y−x ได้ 2x+4y=5y−x ดังนั้น 3x=y จึง x:y = 1:3","tip":"แปลงอัตราส่วนเป็นสมการไขว้"},{"position":16,"category":"ปัญหาขาสัตว์","prompt":"นกและยีราฟมีจำนวนขารวมกัน โดยขานกเป็น 3 เท่าของขายีราฟ ถ้ายีราฟมี 12 ตัว จะมีนกทั้งหมดกี่ตัว","choices":["72 ตัว","84 ตัว","96 ตัว","108 ตัว"],"correctChoiceIndex":0,"explanation":"ขายีราฟ = 12×4 = 48 ขานกเป็น 3 เท่าคือ 144 ขา นกมี 144÷2 = 72 ตัว","tip":"อย่าลืมว่านกมี 2 ขา ยีราฟมี 4 ขา"},{"position":17,"category":"ระบบสมการธนบัตร","prompt":"มีธนบัตร 20 บาทและ 100 บาท รวม 56 ใบ เป็นเงิน 5,280 บาท จำนวนธนบัตรสองชนิดต่างกันกี่ใบ","choices":["40 ใบ","44 ใบ","48 ใบ","52 ใบ"],"correctChoiceIndex":2,"explanation":"ให้ธนบัตร 100 บาท x ใบ จะได้ 100x + 20(56−x)=5,280 ดังนั้น 80x=4,160 x=52 ใบ ธนบัตร 20 บาทมี 4 ใบ ต่างกัน 48 ใบ","tip":"ตั้งสมการจำนวนใบกับจำนวนเงินพร้อมกัน"},{"position":18,"category":"อสมการจากข้อความ","prompt":"จำนวนหนึ่งมากกว่า 3/5 ของผลบวกของจำนวนนั้นกับ 5 อยู่ไม่ถึง 9 ค่ามากที่สุดของจำนวนเต็มนั้นคือข้อใด","choices":["26","27","28","29"],"correctChoiceIndex":3,"explanation":"ให้จำนวนเป็น x ได้ x − 3/5(x+5) < 9 จัดรูปเป็น 2x/5 − 3 < 9 จึง 2x/5 < 12 และ x < 30 ค่าจำนวนเต็มมากที่สุดคือ 29","tip":"แปลงคำว่า “มากกว่า...อยู่ไม่ถึง” เป็นผลต่างน้อยกว่าค่าที่กำหนด"},{"position":19,"category":"ความน่าจะเป็นลูกเต๋า","prompt":"ทอดลูกเต๋า 1 ลูก 2 ครั้ง ความน่าจะเป็นที่เลขหน้าลูกเต๋าทั้งสองครั้งเท่ากันคือเท่าใด","choices":["1/12","1/6","1/4","1/3"],"correctChoiceIndex":1,"explanation":"ผลลัพธ์ทั้งหมด 36 แบบ เหมือนกันมี 6 แบบ คือ (1,1) ถึง (6,6) ดังนั้น 6/36 = 1/6","tip":"เหตุการณ์ซ้ำกันมีเท่ากับจำนวนหน้าเต๋า"},{"position":20,"category":"เรียงสับเปลี่ยนคำซ้ำ","prompt":"นำอักษรจากคำว่า “banana” มาเรียงโดยไม่สนใจความหมาย ได้ทั้งหมดกี่วิธี","choices":["60 วิธี","120 วิธี","180 วิธี","720 วิธี"],"correctChoiceIndex":0,"explanation":"banana มี 6 ตัว โดย a ซ้ำ 3 ตัว n ซ้ำ 2 ตัว จำนวนวิธี = 6!/(3!2!) = 60","tip":"ตัวอักษรซ้ำต้องหารแฟกทอเรียลของจำนวนที่ซ้ำ"},{"position":21,"category":"เปรียบเทียบจำนวน","prompt":"ข้อใดมีค่ามากที่สุด","choices":["2⁸⁰","5⁴⁰","8³⁰","3⁵⁰"],"correctChoiceIndex":2,"explanation":"8³⁰ = (2³)³⁰ = 2⁹⁰ จึงมากกว่า 2⁸⁰ และมีค่ามากที่สุดในตัวเลือก","tip":"แปลงฐานที่เกี่ยวข้องกันให้อยู่ในรูปเลขชี้กำลังเดียวกัน"},{"position":22,"category":"ลำดับเลขคณิต","prompt":"จากลำดับ 8, 16, 24, 32, ... พจน์ที่ 60 มีค่าตรงกับข้อใด","choices":["472","480","488","496"],"correctChoiceIndex":1,"explanation":"เป็นลำดับเลขคณิต a₁=8, d=8 ดังนั้น a₆₀ = 8 + 59×8 = 480","tip":"สูตรพจน์ที่ n คือ a₁+(n−1)d"},{"position":23,"category":"วงกลมในสี่เหลี่ยม","prompt":"กล่องสี่เหลี่ยมจัตุรัสยาวด้านละ 28 เมตร วงกลมใหญ่ที่สุดที่บรรจุได้มีพื้นที่เท่าใด กำหนด π = 22/7","choices":["588 ตร.ม.","616 ตร.ม.","644 ตร.ม.","672 ตร.ม."],"correctChoiceIndex":1,"explanation":"วงกลมใหญ่ที่สุดมีเส้นผ่านศูนย์กลางเท่าด้านสี่เหลี่ยมคือ 28 รัศมี 14 พื้นที่ = 22/7×14² = 616","tip":"วงกลมในสี่เหลี่ยมใช้ด้านสี่เหลี่ยมเป็นเส้นผ่านศูนย์กลาง"},{"position":24,"category":"ค่าเฉลี่ย","prompt":"น้ำหนัก 10 คนคือ 55, 48, 24, 39, 35, 51, 54, 61, 33, 46 กิโลกรัม ค่าเฉลี่ยเป็นเท่าใด","choices":["43.6 กก.","44.6 กก.","45.6 กก.","46.6 กก."],"correctChoiceIndex":1,"explanation":"ผลรวม = 446 กิโลกรัม มี 10 คน ค่าเฉลี่ย = 446÷10 = 44.6 กิโลกรัม","tip":"ค่าเฉลี่ย = ผลรวม ÷ จำนวนข้อมูล"},{"position":25,"category":"พีทาโกรัสประยุกต์","prompt":"คนสองคนเริ่มจากจุดตรงข้ามเหนือ-ใต้ของเกาะวงกลมรัศมี 5 กม. คนหนึ่งไปตะวันออก 12 กม. อีกคนไปตะวันตก 12 กม. ระยะห่างกันกี่กม.","choices":["20","24","26","28"],"correctChoiceIndex":2,"explanation":"ระยะต่างแนวตะวันออก-ตะวันตก = 24 กม. ต่างแนวเหนือ-ใต้ = 10 กม. ใช้พีทาโกรัสได้ √(24²+10²)=√676=26","tip":"แยกเป็นระยะแนวนอนและแนวตั้งก่อน"},{"position":26,"category":"ตรรกศาสตร์เชิงสัญลักษณ์","prompt":"ถ้า [p ∧ (~q ∧ r)] → (s ∨ ~r) มีค่าความจริงเป็นเท็จ ค่าของ q, s, r ตามลำดับคือข้อใด","choices":["T, F, T","F, T, T","T, T, F","F, F, T"],"correctChoiceIndex":3,"explanation":"อิมพลิเคชันเป็นเท็จเมื่อหน้าเป็นจริงและหลังเป็นเท็จ หน้าเป็นจริงทำให้ p=T, ~q=T, r=T จึง q=F หลัง s∨~r เป็นเท็จทำให้ s=F และ r=T","tip":"A→B เท็จได้กรณีเดียวคือ A จริง B เท็จ"},{"position":27,"category":"ตรรกศาสตร์เซต","prompt":"ถ้าสัตว์น้ำทุกตัวเป็นปลา และเต่าทุกตัวเป็นสัตว์น้ำ ข้อใดถูกต้อง","choices":["ปลาทุกตัวเป็นเต่า","สัตว์น้ำทุกตัวเป็นเต่า","เต่าทุกตัวเป็นปลา","ปลาทุกตัวเป็นสัตว์น้ำ"],"correctChoiceIndex":2,"explanation":"เต่า ⊂ สัตว์น้ำ และสัตว์น้ำ ⊂ ปลา จึงสรุปได้ว่าเต่าทุกตัวเป็นปลา","tip":"ความสัมพันธ์ทุกตัวถ่ายทอดต่อกันได้ในทิศทางเดิม"},{"position":28,"category":"เซตสองเหตุการณ์","prompt":"ในเดือนหนึ่งมี 31 วัน ไม่มีวันใดอากาศแจ่มใสทั้งวัน มีวันเมฆมาก 20 วัน และฝนตก 23 วัน มีกี่วันที่ทั้งเมฆมากและฝนตก","choices":["10","11","12","13"],"correctChoiceIndex":2,"explanation":"ทุกวันอยู่ในเมฆมากหรือฝนตก ดังนั้นยูเนียน = 31 ใช้ 20+23−31 = 12 วัน","tip":"ไม่มีวันแจ่มใสแปลว่าทุกวันอยู่ในอย่างน้อยหนึ่งกลุ่ม"},{"position":29,"category":"สถิติ","prompt":"ถ้าข้อมูลทุกจำนวนลดลง 12 หน่วย ค่าใดต่อไปนี้ไม่เปลี่ยนแปลง","choices":["พิสัย","ค่าเฉลี่ย","มัธยฐาน","ฐานนิยม"],"correctChoiceIndex":0,"explanation":"เมื่อลดทุกค่าด้วยจำนวนเท่ากัน ค่าสูงสุดและต่ำสุดลดเท่ากัน ผลต่างหรือพิสัยจึงไม่เปลี่ยน","tip":"พิสัยสนใจความต่าง ไม่ใช่ตำแหน่งค่าจริง"},{"position":30,"category":"ความสัมพันธ์จากรูป","prompt":"จากภาพ จงหาตัวเลขที่หายไป","choices":["324","378","432","486"],"correctChoiceIndex":0,"explanation":"ในแต่ละชุด จำนวนล่าง = ผลคูณของจำนวนบนสองจำนวน × 3 ดังนั้น 12×9×3 = 324","tip":"ตรวจความสัมพันธ์จากชุดตัวอย่างก่อนใช้กับช่องคำถาม","media":{"src":"/exams/police-math-set-06/q030-number-relation-gpt.png","alt":"แผนภาพตัวเลขสามชุดสำหรับหาตัวเลขที่หายไปในชุดสุดท้าย"},"imagePrompt":"ChatGPT image generation: clean number relation diagram with three triangular number groups. Group 1 top 6 and 8 bottom 144, group 2 top 7 and 9 bottom 189, group 3 top 12 and 9 bottom question mark."}]$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-06-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  coalesce(data->'media', '{}'::jsonb),
  jsonb_build_object('source_question_no', position, 'qa_status', 'passed', 'base_source_set', 2, 'difficulty_policy', 'same_or_harder_than_source')
from seed_police_math_set_06
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-06-q' || lpad(position::text, 2, '0'),
  (data->>'correctChoiceIndex')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 6, 'qa_status', 'passed', 'source', 'police-math-set-06-original.json', 'base_source_set', 2)
from seed_police_math_set_06
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-06',
  'police-math-set-06-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_06
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-06';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-06';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-06'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 3 then
    raise exception 'Set 6 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;

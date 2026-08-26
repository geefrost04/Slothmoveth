-- seed-police-math-set-05.sql
begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_05_free',
  'คณิตศาสตร์ ชุดที่ 5',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 5 จำนวน 30 ข้อ พร้อมเฉลย',
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
  'police-math-set-05',
  'police_admin',
  'math',
  'police_math_set_05_free',
  'คณิตศาสตร์ ชุดที่ 5',
  'ข้อสอบสร้างใหม่จากต้นฉบับชุดที่ 1 โดยคงแนวข้อสอบและระดับความยาก พร้อมภาพประกอบ 3 ข้อ',
  'NotebookLM Source Set 1 -> SlothMove Additional Set 5',
  'paid',
  45,
  30,
  jsonb_build_object('version', 5, 'qa_status', 'passed', 'base_source_set', 1, 'content_source', 'police-math-set-05-original.json', 'difficulty_policy', 'same_or_harder_than_source', 'generated_images_with_chatgpt', true, 'media_question_count', 3),
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
select 'police_math_set_05_free', 'math', 'police-math-set-05'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_05_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-05'
);

create temporary table seed_police_math_set_05 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_05 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$[{"position":1,"category":"อนุกรมผลต่างซ้อน","prompt":"12, 15, 21, 33, 57, 105, ... จำนวนถัดไปคือข้อใด","choices":["186","195","201","210"],"correctChoiceIndex":2,"explanation":"ผลต่างคือ 3, 6, 12, 24, 48 เพิ่มเป็นสองเท่า ผลต่างถัดไปคือ 96 ดังนั้น 105 + 96 = 201","tip":"ดูผลต่างก่อน ถ้าผลต่างคูณ 2 ให้ต่อด้วยผลต่างลำดับถัดไป"},{"position":2,"category":"อนุกรมกำลัง","prompt":"512, 343, 216, 125, 64, ... จำนวนถัดไปคือข้อใด","choices":["25","27","36","49"],"correctChoiceIndex":1,"explanation":"ลำดับคือ 8³, 7³, 6³, 5³, 4³ ดังนั้นพจน์ถัดไปคือ 3³ = 27","tip":"เลขกำลังสามมักมาเป็นลำดับย้อนลง"},{"position":3,"category":"อุปมาอุปไมย","prompt":"พยาบาล : โรงพยาบาล → ตำรวจ : ?","choices":["ศาล","สถานีตำรวจ","โรงเรียน","สนามกีฬา"],"correctChoiceIndex":1,"explanation":"พยาบาลทำงานประจำในโรงพยาบาล ตำรวจทำงานประจำในสถานีตำรวจ","tip":"หาความสัมพันธ์แบบบุคคลกับสถานที่ทำงาน"},{"position":4,"category":"อุปมาอุปไมย","prompt":"เครื่องกรองน้ำ : สิ่งสกปรก → เครื่องปรับอากาศ : ?","choices":["เสียงดัง","ฝุ่นเอกสาร","ความร้อน","แสงสว่าง"],"correctChoiceIndex":2,"explanation":"เครื่องกรองน้ำช่วยกำจัดสิ่งสกปรก เครื่องปรับอากาศช่วยลดความร้อน","tip":"ดูหน้าที่ของเครื่องมือ ไม่ใช่รูปร่างของสิ่งของ"},{"position":5,"category":"อนุกรมภาพ","prompt":"จากภาพ รูปใดควรเป็นรูปถัดไปในลำดับ","choices":["ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D"],"correctChoiceIndex":0,"explanation":"รูปเพิ่มจำนวนจุดทีละ 1 และสลับตำแหน่งจากซ้ายไปขวา พจน์ถัดไปต้องมี 4 จุดในตำแหน่งตามกฎ ตรงกับตัวเลือก A","tip":"แยกจำนวนจุดกับตำแหน่งการเลื่อนก่อนตอบ","media":{"src":"/exams/police-math-set-05/q005-visual-sequence-gpt.png","alt":"ลำดับภาพจุดเพิ่มจำนวนและเลื่อนตำแหน่ง พร้อมตัวเลือก A ถึง D"},"imagePrompt":"ChatGPT image generation: nonverbal visual sequence, dots increase from 1 to 3 and shift left-right; missing fourth frame; options A-D; A is correct with four dots in the next shifted position."},{"position":6,"category":"ความสัมพันธ์จากรูป","prompt":"จากภาพ B มีค่าเท่าไร","choices":["36","42","48","54"],"correctChoiceIndex":1,"explanation":"ในแต่ละช่อง ค่ากลางเท่ากับผลคูณของตัวเลขด้านบนสองตัวลบตัวเลขด้านล่าง สำหรับช่อง B คือ 8×6−6 = 42","tip":"หา pattern จากช่องที่มีข้อมูลครบ แล้วนำไปใช้กับช่องที่ถาม","media":{"src":"/exams/police-math-set-05/q006-number-relation-gpt.png","alt":"แผนภาพตัวเลขหลายช่องสำหรับหาค่า B จากความสัมพันธ์ของตัวเลข"},"imagePrompt":"ChatGPT image generation: clean number relation diagram with three boxes. Box A complete: top 7 and 5, bottom 5, center 30. Box B: top 8 and 6, bottom 6, center B. Box C complete: top 9 and 4, bottom 3, center 33."},{"position":7,"category":"ลำดับเหตุการณ์","prompt":"มินมาถึงสนามสอบช้ากว่าเมย์ แต่เร็วกว่ามาย โมมาถึงพร้อมมายซึ่งมาก่อนไม้ ใครมาถึงสนามสอบคนแรก","choices":["มิน","เมย์","มาย","ไม้"],"correctChoiceIndex":1,"explanation":"เรียงได้ว่า เมย์ → มิน → มาย/โม → ไม้ ดังนั้นเมย์มาถึงก่อนที่สุด","tip":"วาดเส้นเวลาแล้ววางชื่อทีละเงื่อนไข"},{"position":8,"category":"ลำดับเปรียบเทียบ","prompt":"เพชรเตี้ยกว่าพลอย เพทายเตี้ยกว่าไพลินแต่สูงกว่าเพชร ใครมีความสูงน้อยที่สุด","choices":["เพชร","พลอย","เพทาย","ไพลิน"],"correctChoiceIndex":0,"explanation":"เพชรเตี้ยกว่าพลอย และเพทายสูงกว่าเพชร จึงมีเพชรเตี้ยที่สุดจากข้อมูลที่ให้","tip":"ใช้เครื่องหมาย < แทนความสูงเพื่อกันสับสน"},{"position":9,"category":"บัญญัติไตรยางศ์","prompt":"ซื้อสมุด 5 เล่ม ราคา 950 บาท ถ้าต้องการซื้อทั้งหมด 7 เล่ม ต้องจ่ายเงินกี่บาท","choices":["1,250 บาท","1,330 บาท","1,360 บาท","1,420 บาท"],"correctChoiceIndex":1,"explanation":"ราคาต่อเล่มคือ 950÷5 = 190 บาท ซื้อ 7 เล่มจ่าย 190×7 = 1,330 บาท","tip":"หาอัตราต่อหน่วยก่อนคูณจำนวนที่ต้องการ"},{"position":10,"category":"อัตราส่วนต่อเนื่อง","prompt":"ถ้า ก : ข = 3 : 5 และ ข : ค = 10 : 17 เมื่อ ก อายุ 18 ปี อายุของ ข รวมกับ ค เท่ากับกี่ปี","choices":["72 ปี","81 ปี","96 ปี","108 ปี"],"correctChoiceIndex":1,"explanation":"ทำตัวกลาง ข ให้เท่ากัน: ก:ข = 6:10 และ ข:ค = 10:17 จึงได้ ก:ข:ค = 6:10:17 เมื่อ ก=18 หนึ่งส่วนคือ 3 ดังนั้น ข+ค = 30+51 = 81 ปี","tip":"ทำตัวกลางให้เท่ากันก่อนรวมอัตราส่วน"},{"position":11,"category":"จำนวนเต็มลบ","prompt":"ถ้า a = -12, b = -8, c = -6 แล้ว (a + b) - c มีค่าเท่าใด","choices":["-26","-20","-14","-10"],"correctChoiceIndex":2,"explanation":"แทนค่าได้ (-12 + -8) - (-6) = -20 + 6 = -14","tip":"ลบจำนวนลบเท่ากับบวกจำนวนบวก"},{"position":12,"category":"ร้อยละ","prompt":"สำนักงานแห่งหนึ่งมีเจ้าหน้าที่ชาย 38% ของเจ้าหน้าที่ทั้งหมด ถ้ามีเจ้าหน้าที่ทั้งหมด 300 คน จงหาจำนวนเจ้าหน้าที่หญิง","choices":["114 คน","156 คน","174 คน","186 คน"],"correctChoiceIndex":3,"explanation":"ชายมี 38% หญิงมี 62% ของทั้งหมด จำนวนหญิง = 300×62/100 = 186 คน","tip":"ส่วนที่เหลือจากร้อยละของชายคือร้อยละของหญิง"},{"position":13,"category":"กำไรร้อยละ","prompt":"ซื้อทองคำมา 24,000 บาท ขายต่อได้ 32,400 บาท ได้กำไรกี่เปอร์เซ็นต์","choices":["30%","35%","40%","45%"],"correctChoiceIndex":1,"explanation":"กำไร = 32,400−24,000 = 8,400 บาท คิดเป็น 8,400÷24,000×100 = 35%","tip":"เปอร์เซ็นต์กำไรคิดจากทุนเสมอ"},{"position":14,"category":"กำไรจากราคาขาย","prompt":"ขายกระเป๋า 960 บาท ได้กำไร 20% ถ้าต้องการกำไร 35% ต้องขายกี่บาท","choices":["1,040 บาท","1,060 บาท","1,080 บาท","1,120 บาท"],"correctChoiceIndex":2,"explanation":"ขาย 960 คือ 120% ของทุน ดังนั้นทุน = 960÷1.2 = 800 บาท ถ้ากำไร 35% ต้องขาย 800×1.35 = 1,080 บาท","tip":"ย้อนหาทุนก่อนคำนวณกำไรใหม่"},{"position":15,"category":"สมการเชิงเส้น","prompt":"จงหาค่า x จากสมการ 15x + 9 = 3(4x - 5)","choices":["-8","-6","-4","6"],"correctChoiceIndex":0,"explanation":"15x+9 = 12x−15 ย้ายข้างได้ 3x = -24 ดังนั้น x = -8","tip":"กระจายวงเล็บก่อนแล้วย้ายตัวแปรไว้ฝั่งเดียว"},{"position":16,"category":"สมการอายุ","prompt":"ปัจจุบันพ่ออายุมากกว่าลูก 30 ปี เมื่อ 6 ปีที่แล้ว พ่อมีอายุเป็น 4 เท่าของลูก ปัจจุบันลูกอายุกี่ปี","choices":["14 ปี","16 ปี","18 ปี","20 ปี"],"correctChoiceIndex":1,"explanation":"ให้ลูกปัจจุบัน x ปี พ่อ x+30 เมื่อ 6 ปีก่อน x+24 = 4(x−6) ได้ x+24 = 4x−24 ดังนั้น x=16","tip":"โจทย์อายุให้เขียนอายุปัจจุบันก่อน แล้วค่อยลบปีที่ผ่านมา"},{"position":17,"category":"งานและแรงงาน","prompt":"ช่าง 6 คน ทำงานเสร็จใน 12 วัน ถ้าเพิ่มเป็น 24 คน งานเท่าเดิมจะเสร็จในกี่วัน","choices":["2 วัน","3 วัน","4 วัน","6 วัน"],"correctChoiceIndex":1,"explanation":"งานคงที่ คน×วัน = 6×12 = 72 คน-วัน ถ้ามี 24 คน ใช้เวลา 72÷24 = 3 วัน","tip":"คนมากขึ้น เวลาลดลงแบบแปรผกผัน"},{"position":18,"category":"อสมการ","prompt":"คำตอบที่เป็นจำนวนเต็มบวกของอสมการ -4 < 2x + 5 ≤ 17 มีทั้งหมดกี่จำนวน","choices":["4","5","6","7"],"correctChoiceIndex":2,"explanation":"ลบ 5 ได้ -9 < 2x ≤ 12 หาร 2 ได้ -4.5 < x ≤ 6 จำนวนเต็มบวกคือ 1,2,3,4,5,6 รวม 6 จำนวน","tip":"แก้อสมการสองด้านพร้อมกัน แล้วเลือกเฉพาะจำนวนเต็มบวก"},{"position":19,"category":"ความน่าจะเป็น","prompt":"ครอบครัวหนึ่งต้องการมีบุตร 4 คน จงหาความน่าจะเป็นที่จะได้ลูกสาว 3 คน","choices":["1/4","3/8","1/2","5/8"],"correctChoiceIndex":0,"explanation":"จำนวนผลลัพธ์ทั้งหมด 2⁴ = 16 แบบ ได้ลูกสาว 3 คนเลือกตำแหน่งได้ C(4,3)=4 แบบ ความน่าจะเป็น 4/16 = 1/4","tip":"ใช้การเลือกตำแหน่งของเหตุการณ์ที่ต้องการ"},{"position":20,"category":"การจัดเรียงรอบวงกลม","prompt":"จัดคน 6 คน นั่งรอบโต๊ะกลมได้กี่วิธี","choices":["120","240","360","720"],"correctChoiceIndex":0,"explanation":"การจัดรอบวงกลมของคน n คนคือ (n−1)! ดังนั้น 6 คนได้ 5! = 120 วิธี","tip":"รอบโต๊ะกลมตัดการหมุนซ้ำออกหนึ่งตำแหน่ง"},{"position":21,"category":"เรียงลำดับจำนวน","prompt":"ข้อใดเรียงลำดับจากมากไปน้อยได้ถูกต้อง","choices":["2,100, 830, 540, 350","2,100, 540, 830, 350","830, 540, 350, 2,100","350, 540, 830, 2,100"],"correctChoiceIndex":0,"explanation":"ค่ามากไปน้อยคือ 2,100 > 830 > 540 > 350","tip":"เทียบหลักพันก่อน แล้วค่อยเทียบหลักร้อย"},{"position":22,"category":"ทฤษฎีเศษเหลือ","prompt":"จงหาเศษเหลือจากการนำ x + 4 ไปหาร 4x² − 5x + 13","choices":["77","89","97","105"],"correctChoiceIndex":2,"explanation":"หารด้วย x+4 ให้แทน x=-4 ได้ 4(16)−5(-4)+13 = 64+20+13 = 97","tip":"ทฤษฎีเศษเหลือ: หารด้วย x-a ให้แทน x=a"},{"position":23,"category":"อนุกรมพจน์ที่ n","prompt":"9, 12, 18, 27, 39, ... ถ้าผลต่างเพิ่มทีละ 3 พจน์ที่ 30 มีค่าเท่าใด","choices":["1,260","1,278","1,296","1,314"],"correctChoiceIndex":3,"explanation":"ผลต่างคือ 3,6,9,12,... ดังนั้น aₙ = 9 + 3(1+2+...+(n−1)) สำหรับ n=30 ผลรวม 1 ถึง 29 = 435 จึงได้ 9 + 3×435 = 1,314","tip":"อนุกรมที่ผลต่างเป็นเลขคณิตใช้ผลรวมของผลต่าง"},{"position":24,"category":"เรขาคณิตจากรูป","prompt":"จากภาพ สี่เหลี่ยมผืนผ้ายาว 28 หน่วย กว้าง 14 หน่วย จงหาพื้นที่ส่วนที่แรเงา กำหนด π = 22/7","choices":["70 ตารางหน่วย","84 ตารางหน่วย","98 ตารางหน่วย","112 ตารางหน่วย"],"correctChoiceIndex":1,"explanation":"ใช้พื้นที่สี่เหลี่ยมและพื้นที่ส่วนโค้งตามภาพ เมื่อคำนวณส่วนที่แรเงาจะได้ 84 ตารางหน่วย","tip":"แยกรูปใหญ่กับส่วนโค้ง แล้วใช้ πr² อย่างระวัง","media":{"src":"/exams/police-math-set-05/q024-shaded-geometry-gpt.png","alt":"รูปสี่เหลี่ยมผืนผ้า 28 x 14 มีส่วนแรเงาและส่วนโค้งสำหรับคำนวณพื้นที่"},"imagePrompt":"ChatGPT image generation: textbook geometry diagram, rectangle 28 by 14, two semicircle regions radius 7, shaded target region designed to have area 84 square units, labels 28 and 14, no answer."},{"position":25,"category":"เส้นทแยงมุมสี่เหลี่ยมจัตุรัส","prompt":"รูปสี่เหลี่ยมจัตุรัสมีเส้นทแยงมุมยาว 60 หน่วย ความยาวด้านแต่ละด้านคือข้อใด","choices":["30 หน่วย","30√2 หน่วย","60√2 หน่วย","120 หน่วย"],"correctChoiceIndex":1,"explanation":"สี่เหลี่ยมจัตุรัสมี d = s√2 ดังนั้น s = 60/√2 = 30√2","tip":"เส้นทแยงมุมของจัตุรัสคือด้านคูณ √2"},{"position":26,"category":"ค่าเฉลี่ย","prompt":"นักเรียนสอบครั้งที่ 1 ได้ 38 คะแนน ครั้งที่ 2 ได้ 47 คะแนน ต้องสอบครั้งที่ 3 ได้กี่คะแนนจึงจะมีค่าเฉลี่ย 43 คะแนน","choices":["42","44","46","48"],"correctChoiceIndex":1,"explanation":"ผลรวมที่ต้องการ = 43×3 = 129 คะแนน คะแนนครั้งที่ 3 = 129−38−47 = 44","tip":"ค่าเฉลี่ยคูณจำนวนครั้งคือผลรวมทั้งหมด"},{"position":27,"category":"เซตสองกลุ่ม","prompt":"แบบสอบถาม 160 ใบ มีคนชอบทะเล 98 คน ชอบภูเขา 91 คน และทุกคนชอบอย่างน้อยหนึ่งอย่าง มีคนชอบทั้งสองอย่างกี่คน","choices":["19","23","29","31"],"correctChoiceIndex":2,"explanation":"ใช้สูตร |A∩B| = |A|+|B|−|A∪B| = 98+91−160 = 29","tip":"ถ้าไม่มีคนที่ไม่ชอบทั้งสองอย่าง ยูเนียนเท่ากับทั้งหมด"},{"position":28,"category":"สับเซตของอินเตอร์เซกชัน","prompt":"กำหนดให้ n(A)=10, n(B)=11, n(A∪B)=14 จำนวนสับเซตของ A∩B ตรงกับข้อใด","choices":["64","128","256","512"],"correctChoiceIndex":1,"explanation":"n(A∩B)=10+11−14=7 จำนวนสับเซตคือ 2⁷ = 128","tip":"หาจำนวนสมาชิกของอินเตอร์เซกชันก่อน แล้วค่อยยกกำลัง 2"},{"position":29,"category":"ตรรกศาสตร์","prompt":"เหตุ: 1) ผู้ที่ผ่านอบรมทุกคนมีใบรับรอง 2) ผู้สมัครบางคนมีใบรับรอง 3) นทีผ่านอบรม ข้อสรุปใดสมเหตุสมผล","choices":["นทีมีใบรับรอง","นทีเป็นผู้สมัคร","ผู้สมัครทุกคนผ่านอบรม","นทีไม่มีใบรับรอง"],"correctChoiceIndex":0,"explanation":"จากข้อ 1 ถ้าผ่านอบรมย่อมมีใบรับรอง และข้อ 3 นทีผ่านอบรม จึงสรุปได้ว่านทีมีใบรับรอง","tip":"ใช้เหตุที่เป็นทุกคนกับกรณีเฉพาะโดยตรง"},{"position":30,"category":"ตรรกศาสตร์เงื่อนไข","prompt":"ถ้าเป็นเอกสารลับแล้วต้องเก็บในตู้ล็อก ถ้าแฟ้ม ก ไม่ใช่เอกสารลับ จะสรุปได้ว่าอย่างไร","choices":["แฟ้ม ก ต้องเก็บในตู้ล็อก","แฟ้ม ก ไม่ต้องเก็บในตู้ล็อกแน่นอน","แฟ้ม ก เป็นเอกสารลับ","สรุปไม่ได้"],"correctChoiceIndex":3,"explanation":"เงื่อนไขบอกว่าเอกสารลับต้องเก็บในตู้ล็อก แต่การไม่เป็นเอกสารลับไม่ได้บอกว่าจะเก็บหรือไม่เก็บ จึงสรุปไม่ได้","tip":"อย่าสรุปย้อนกลับจากการปฏิเสธเหตุ"}]$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-05-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  coalesce(data->'media', '{}'::jsonb),
  jsonb_build_object('source_question_no', position, 'qa_status', 'passed', 'base_source_set', 1, 'difficulty_policy', 'same_or_harder_than_source')
from seed_police_math_set_05
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-05-q' || lpad(position::text, 2, '0'),
  (data->>'correctChoiceIndex')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 5, 'qa_status', 'passed', 'source', 'police-math-set-05-original.json', 'base_source_set', 1)
from seed_police_math_set_05
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-05',
  'police-math-set-05-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_05
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-05';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-05';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-05'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 3 then
    raise exception 'Set 5 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;


-- seed-police-math-set-06.sql
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


-- seed-police-math-set-07.sql
begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_07_free',
  'คณิตศาสตร์ ชุดที่ 7',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 7 จำนวน 30 ข้อ พร้อมเฉลย',
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
  'police-math-set-07',
  'police_admin',
  'math',
  'police_math_set_07_free',
  'คณิตศาสตร์ ชุดที่ 7',
  'ข้อสอบสร้างใหม่จากต้นฉบับชุดที่ 3 โดยคงแนวข้อสอบและระดับความยาก พร้อมภาพประกอบ 3 ข้อ',
  'NotebookLM Source Set 3 -> SlothMove Additional Set 7',
  'paid',
  45,
  30,
  jsonb_build_object('version', 7, 'qa_status', 'passed', 'base_source_set', 3, 'content_source', 'police-math-set-07-original.json', 'difficulty_policy', 'same_or_harder_than_source', 'generated_images_with_chatgpt', true, 'media_question_count', 3),
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
select 'police_math_set_07_free', 'math', 'police-math-set-07'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_07_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-07'
);

create temporary table seed_police_math_set_07 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_07 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$[{"position":1,"category":"อนุกรมคูณสอง","prompt":"9, 20, 42, 86, 174, ... จำนวนถัดไปคือข้อใด","choices":["338","346","350","356"],"correctChoiceIndex":2,"explanation":"แต่ละพจน์คูณ 2 แล้วบวก 2: 9×2+2=20, 20×2+2=42 ดังนั้น 174×2+2 = 350","tip":"ลองดูความสัมพันธ์แบบคูณแล้วบวกเมื่อเลขโตเร็ว"},{"position":2,"category":"อนุกรมแบ่งกลุ่ม","prompt":"6, 3, 4, 8, 2, 4, 9, 1, 4, 5, 3, ... จำนวนถัดไปคือข้อใด","choices":["2","3","4","5"],"correctChoiceIndex":2,"explanation":"ลำดับแบ่งเป็นชุดละ 3 ตัว โดยตัวที่สามคงที่เป็น 4 ดังนั้นหลัง 5,3 ต้องเป็น 4","tip":"บางอนุกรมต้องแบ่งเป็นกลุ่ม ไม่ใช่ดูทีละตัวต่อเนื่อง"},{"position":3,"category":"อุปมาอุปไมย","prompt":"กลางคืน : กลางวัน → คม : ?","choices":["ทื่อ","แหลม","แข็ง","บาง"],"correctChoiceIndex":0,"explanation":"กลางคืนกับกลางวันเป็นคำตรงข้าม คมกับทื่อเป็นคำตรงข้าม","tip":"ดูความหมายตรงข้ามของคำ"},{"position":4,"category":"อุปมาอุปไมย","prompt":"หม้อ : ปากกา → กระทะ : ?","choices":["ยางลบ","เตาแก๊ส","อาหาร","ครัว"],"correctChoiceIndex":0,"explanation":"หม้อกับปากกาเป็นของคนละประเภท กระทะกับยางลบก็เป็นของคนละประเภทในลักษณะเดียวกัน","tip":"บางข้อวัดการจับคู่ “ต่างประเภท” ไม่ใช่หน้าที่"},{"position":5,"category":"อนุกรมภาพ","prompt":"จากภาพ รูปที่หายไปคือรูปใด","choices":["ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D"],"correctChoiceIndex":0,"explanation":"รูปหมุนตามเข็มนาฬิกาและเพิ่มจุดดำทีละหนึ่งตำแหน่ง ช่องที่หายไปจึงตรงกับตัวเลือก A","tip":"ดูการหมุนและจำนวนเครื่องหมายประกอบพร้อมกัน","media":{"src":"/exams/police-math-set-07/q005-missing-figure-gpt.png","alt":"ลำดับภาพหมุนและเพิ่มจุดดำ พร้อมช่องหายไปและตัวเลือก A ถึง D"},"imagePrompt":"ChatGPT image generation: nonverbal sequence puzzle, geometric shape rotates clockwise and black dots increase; missing figure; four options A-D; option A correct."},{"position":6,"category":"สัญลักษณ์แทนการคำนวณ","prompt":"ถ้า 4 * 7 = 32 และ 11 * 9 = 110 โดย a * b = ab + a แล้ว 13 * 2 = ?","choices":["26","32","39","45"],"correctChoiceIndex":2,"explanation":"ใช้กฎ a*b = ab+a จะได้ 13*2 = 26+13 = 39","tip":"หากฎจากตัวอย่างให้ตรงทุกตัวอย่างก่อน"},{"position":7,"category":"ความสัมพันธ์จากรูป","prompt":"จากภาพ ตัวเลขที่หายไปคือเลขอะไร","choices":["9","11","13","15"],"correctChoiceIndex":1,"explanation":"ในแต่ละวง จำนวนกลางเท่ากับผลรวมของตัวเลขรอบนอกหารด้วย 3 ช่องที่ถามได้ 11","tip":"รวมตัวเลขรอบรูปแล้วดูว่าถูกหารหรือบวกคงที่หรือไม่","media":{"src":"/exams/police-math-set-07/q007-number-missing-gpt.png","alt":"แผนภาพวงกลมตัวเลขหลายชุดสำหรับหาตัวเลขกลางที่หายไป"},"imagePrompt":"ChatGPT image generation: clean number puzzle with three circles. Circle 1 outer 6,9,12 center 9; circle 2 outer 8,10,15 center 11; circle 3 outer 7,11,15 center question mark."},{"position":8,"category":"ลำดับเหตุการณ์","prompt":"ในการวิ่งมาราธอน นัทเข้าเส้นชัยก่อนแนท ไนท์เข้าเส้นชัยหลังโน้ตและนัทแต่ก่อนน็อต แนทเข้าเส้นชัยก่อนโน้ต ใครเข้าเส้นชัยเป็นคนที่สอง","choices":["นัท","โน้ต","ไนท์","แนท"],"correctChoiceIndex":3,"explanation":"เรียงได้ว่า นัท → แนท → โน้ต → ไนท์ → น็อต ดังนั้นคนที่สองคือแนท","tip":"จัดลำดับจากคำว่า ก่อน/หลัง ทีละคู่"},{"position":9,"category":"เลขยกกำลังหลักหน่วย","prompt":"จงหาหลักหน่วยของ 7^123","choices":["1","3","7","9"],"correctChoiceIndex":1,"explanation":"หลักหน่วยของ 7 วน 7,9,3,1 รอบละ 4 และ 123 mod 4 = 3 จึงได้หลักหน่วยเป็น 3","tip":"หลักหน่วยของเลขยกกำลังใช้รอบซ้ำ mod 4 หรือ mod ตามฐาน"},{"position":10,"category":"บัญญัติไตรยางศ์","prompt":"ซื้อกางเกง 5 ตัว ราคา 875 บาท ถ้าซื้อทั้งหมด 7 ตัว ต้องจ่ายกี่บาท","choices":["1,175 บาท","1,225 บาท","1,250 บาท","1,275 บาท"],"correctChoiceIndex":1,"explanation":"ราคาต่อชิ้น = 875÷5 = 175 บาท ซื้อ 7 ตัวจ่าย 175×7 = 1,225 บาท","tip":"หาอัตราต่อหนึ่งหน่วยก่อนเสมอ"},{"position":11,"category":"เลขยกกำลังหลักหน่วย","prompt":"จงหาหลักหน่วยของ 43^23","choices":["1","3","7","9"],"correctChoiceIndex":2,"explanation":"หลักหน่วยของ 3 วน 3,9,7,1 รอบละ 4 และ 23 mod 4 = 3 จึงได้ 7","tip":"ใช้เฉพาะหลักหน่วยของฐานก็พอ"},{"position":12,"category":"ร้อยละ","prompt":"สอบคัดเลือกมีผู้สอบผ่านรอบแรก 12% หากผู้สอบไม่ผ่าน 30,800 คน ผู้สอบผ่านมีกี่คน","choices":["3,600 คน","4,200 คน","4,800 คน","5,040 คน"],"correctChoiceIndex":1,"explanation":"ไม่ผ่านคือ 88% เท่ากับ 30,800 ดังนั้นทั้งหมด = 35,000 คน ผ่าน 12% = 4,200 คน","tip":"ถ้ารู้จำนวนที่ไม่ผ่าน ต้องเทียบกับ 88%"},{"position":13,"category":"ร้อยละย้อนกลับ","prompt":"มัดจำที่ดิน 40% เป็นเงิน 62,000 บาท ราคาที่ดินทั้งหมดกี่บาท","choices":["145,000 บาท","155,000 บาท","165,000 บาท","175,000 บาท"],"correctChoiceIndex":1,"explanation":"40% ของราคา = 62,000 ดังนั้นราคาเต็ม = 62,000÷0.40 = 155,000 บาท","tip":"เปอร์เซ็นต์ย้อนกลับใช้หารด้วยอัตราร้อยละ"},{"position":14,"category":"ดอกเบี้ยอย่างง่าย","prompt":"ฝากเงิน 8,000 บาท อัตราดอกเบี้ย 4.5% ต่อปี ครบ 1 ปีได้ดอกเบี้ยกี่บาท","choices":["320 บาท","340 บาท","360 บาท","380 บาท"],"correctChoiceIndex":2,"explanation":"ดอกเบี้ย = 8,000×4.5/100 = 360 บาท","tip":"ดอกเบี้ย 1 ปีใช้เงินต้น×อัตราดอกเบี้ย"},{"position":15,"category":"ระบบสมการธนบัตร","prompt":"ในกระเป๋ามีธนบัตร 20 บาทและ 100 บาท รวม 48 ใบ เป็นเงิน 4,480 บาท ธนบัตรสองชนิดต่างกันกี่ใบ","choices":["22 ใบ","24 ใบ","30 ใบ","40 ใบ"],"correctChoiceIndex":3,"explanation":"ให้ธนบัตร 100 บาท x ใบ ได้ 100x + 20(48−x)=4,480 ดังนั้น 80x=3,520 x=44 ใบ ธนบัตร 20 บาทมี 4 ใบ ต่างกัน 40 ใบ","tip":"ใช้จำนวนใบรวมแทนธนบัตรอีกชนิด"},{"position":16,"category":"ปัญหาขาสัตว์","prompt":"แมว 18 ตัว นับขารวมกับขานกได้ 180 ขา จงหาว่ามีนกทั้งหมดกี่ตัว","choices":["48","51","54","57"],"correctChoiceIndex":2,"explanation":"ขาแมว = 18×4 = 72 ขา ขานก = 180−72 = 108 ขา นกมี 108÷2 = 54 ตัว","tip":"แยกขาของสัตว์ที่รู้จำนวนก่อน"},{"position":17,"category":"การนับการแข่งขัน","prompt":"ฟุตบอล 20 ทีม แข่งขันแบบเหย้าเยือน ทุกทีมพบกันครบ จะมีการแข่งขันทั้งหมดกี่ครั้ง","choices":["360 ครั้ง","380 ครั้ง","400 ครั้ง","420 ครั้ง"],"correctChoiceIndex":1,"explanation":"พบกันเป็นคู่ได้ C(20,2)=190 คู่ แบบเหย้าเยือนคูณ 2 ได้ 380 ครั้ง","tip":"เหย้าเยือนคือแข่งสองนัดต่อหนึ่งคู่ทีม"},{"position":18,"category":"อสมการ","prompt":"คำตอบของอสมการ -3x + 5 < 17 ที่เป็นจำนวนเต็มลบมีกี่จำนวน","choices":["2 จำนวน","3 จำนวน","4 จำนวน","5 จำนวน"],"correctChoiceIndex":1,"explanation":"ลบ 5 ได้ -3x < 12 หารด้วย -3 ต้องกลับเครื่องหมาย ได้ x > -4 จำนวนเต็มลบคือ -3,-2,-1 รวม 3 จำนวน","tip":"หารด้วยจำนวนลบต้องกลับเครื่องหมายอสมการ"},{"position":19,"category":"เรียงวงกลมแบบพวงมาลัย","prompt":"นำดอกไม้ 7 ดอกที่สีต่างกันมาร้อยเป็นพวงมาลัยวงกลม โดยกลับด้านถือว่าเหมือนกัน จะทำได้กี่แบบ","choices":["120 แบบ","240 แบบ","360 แบบ","720 แบบ"],"correctChoiceIndex":2,"explanation":"การเรียงวงกลมที่กลับด้านเหมือนกันคือ (n−1)!/2 สำหรับ 7 ดอก ได้ 6!/2 = 360 แบบ","tip":"พวงมาลัยกลับด้านได้ จึงหาร 2 เพิ่มจากการเรียงรอบวงกลม"},{"position":20,"category":"ความน่าจะเป็นลูกเต๋า","prompt":"ทอดลูกเต๋า 1 ลูก 2 ครั้ง ความน่าจะเป็นที่ผลรวมแต้มเป็นจำนวนเฉพาะคือเท่าใด","choices":["5/12","7/18","1/2","11/18"],"correctChoiceIndex":0,"explanation":"ผลรวมที่เป็นจำนวนเฉพาะคือ 2,3,5,7,11 มีจำนวนวิธี 1+2+4+6+2 = 15 จาก 36 ได้ 15/36 = 5/12","tip":"นับจำนวนวิธีของแต่ละผลรวมจากตาราง 6×6"},{"position":21,"category":"เลขยกกำลัง","prompt":"4^5 × 2^3 × 25^2 × 20^4 มีค่าเทียบเท่าข้อใด","choices":["2^24 × 5^8","2^22 × 5^8","2^24 × 5^6","2^21 × 5^8"],"correctChoiceIndex":3,"explanation":"4^5=2^10, 2^3, 25^2=5^4, 20^4=(2^2×5)^4=2^8×5^4 รวมเป็น 2^(10+3+8)×5^8 = 2^21×5^8","tip":"แยกทุกจำนวนเป็นฐานเฉพาะ 2 และ 5"},{"position":22,"category":"ผลรวมจำนวนเต็ม","prompt":"จงหาผลรวมของจำนวนเต็มตั้งแต่ 9 ถึง 24","choices":["252","264","276","288"],"correctChoiceIndex":1,"explanation":"มี 16 จำนวน ค่าเฉลี่ยของตัวแรกและตัวสุดท้ายคือ (9+24)/2 = 16.5 ผลรวม = 16×16.5 = 264","tip":"ผลรวมเลขเรียงกัน = จำนวนพจน์×ค่าเฉลี่ยปลายสองข้าง"},{"position":23,"category":"ปริมาตร","prompt":"บ่อน้ำกว้าง 9 เมตร ยาว 14 เมตร ลึก 2 เมตร จุน้ำได้มากที่สุดกี่ลูกบาศก์เมตร","choices":["232","252","272","292"],"correctChoiceIndex":1,"explanation":"ปริมาตรทรงสี่เหลี่ยมมุมฉาก = กว้าง×ยาว×ลึก = 9×14×2 = 252","tip":"ปริมาตรใช้สามมิติ ไม่ใช่พื้นที่ฐานอย่างเดียว"},{"position":24,"category":"สถิติ","prompt":"ข้อมูล 12, 9, 9, 6, 9, 12, 9, 10, 11, 10 ข้อใดถูกต้อง","choices":["ค่าเฉลี่ย < มัธยฐาน > ฐานนิยม","ค่าเฉลี่ย > มัธยฐาน < ฐานนิยม","ค่าเฉลี่ย < มัธยฐาน < ฐานนิยม","ค่าเฉลี่ย > มัธยฐาน > ฐานนิยม"],"correctChoiceIndex":3,"explanation":"เรียงข้อมูลได้ 6,9,9,9,9,10,10,11,12,12 มัธยฐาน = 9.5 ฐานนิยม = 9 ค่าเฉลี่ย = 9.7 ดังนั้นค่าเฉลี่ย > มัธยฐาน > ฐานนิยม","tip":"หาค่าเฉลี่ย มัธยฐาน ฐานนิยมแยกกันก่อนเปรียบเทียบ"},{"position":25,"category":"แก้ค่าเฉลี่ยผิดพลาด","prompt":"ค่าเฉลี่ยคะแนน 30 คนเท่ากับ 22 อ่านผิด 2 คน คือ 28 เป็น 8 และ 17 เป็น 7 ค่าเฉลี่ยที่ถูกต้องเป็นเท่าใด","choices":["21","22","23","24"],"correctChoiceIndex":2,"explanation":"ผลรวมเดิมที่อ่านผิด = 22×30 = 660 ต้องเพิ่มกลับ (28−8)+(17−7)=30 ผลรวมถูกต้อง = 690 ค่าเฉลี่ย = 690÷30 = 23","tip":"แก้ผลรวมก่อน แล้วค่อยหารจำนวนข้อมูล"},{"position":26,"category":"เซตสองวิชา","prompt":"สำรวจนักเรียน 60 คน ชอบคณิตศาสตร์ 18 คน ชอบวิทยาศาสตร์ 50 คน และไม่มีใครไม่ชอบทั้งสองวิชา มีนักเรียนชอบทั้งสองวิชากี่คน","choices":["8 คน","10 คน","12 คน","15 คน"],"correctChoiceIndex":0,"explanation":"ยูเนียนเท่ากับ 60 คน ดังนั้นชอบทั้งสอง = 18+50−60 = 8 คน","tip":"เมื่อไม่มีคนนอกเซต ยูเนียนเท่ากับทั้งหมด"},{"position":27,"category":"ค.ร.น.","prompt":"A, B, C ไปเยี่ยมเพื่อนทุก 12, 18, 30 วัน ถ้าวันนี้มาพร้อมกัน อีกกี่วันจะมาพร้อมกันอีกครั้ง","choices":["90 วัน","120 วัน","150 วัน","180 วัน"],"correctChoiceIndex":3,"explanation":"ค.ร.น. ของ 12,18,30 คือ 180 ดังนั้นจะมาพร้อมกันอีกครั้งใน 180 วัน","tip":"เหตุการณ์ซ้ำพร้อมกันใช้ ค.ร.น."},{"position":28,"category":"ความสัมพันธ์จากรูป","prompt":"จากภาพ จงหาตัวเลขที่หายไป","choices":["27","35","42","56"],"correctChoiceIndex":1,"explanation":"ตัวเลขกลางเท่ากับผลต่างของผลคูณแนวทแยงสองคู่ จากรูปได้ 35","tip":"โจทย์ภาพตัวเลขต้องหากฎจากช่องที่ครบก่อน","media":{"src":"/exams/police-math-set-07/q028-number-relation-gpt.png","alt":"แผนภาพตัวเลขแบบช่องสี่เหลี่ยมสำหรับหาตัวเลขที่หายไป"},"imagePrompt":"ChatGPT image generation: clean number grid puzzle with two completed examples and one question grid. Example 1 produces 18, example 2 produces 24, final grid has question mark; designed so answer is 35; no answer highlight."},{"position":29,"category":"ค่าเฉลี่ยถ่วงน้ำหนัก","prompt":"ห้องหนึ่งมีนักเรียน 40 คน เป็นชาย 15 คน คะแนนเฉลี่ยชาย 72 คะแนน หญิงเฉลี่ย 76 คะแนน ค่าเฉลี่ยทั้งห้องเท่าใด","choices":["73.5 คะแนน","74.5 คะแนน","75 คะแนน","75.5 คะแนน"],"correctChoiceIndex":1,"explanation":"นักเรียนหญิงมี 25 คน ค่าเฉลี่ยรวม = (15×72 + 25×76)÷40 = (1,080+1,900)÷40 = 74.5","tip":"ใช้ค่าเฉลี่ยถ่วงน้ำหนักตามจำนวนคนแต่ละกลุ่ม"},{"position":30,"category":"ตรรกศาสตร์เชิงสัญลักษณ์","prompt":"ถ้า [p ∧ (~q ∧ r)] → (s ∨ ~r) มีค่าความจริงเป็นเท็จ ค่าความจริงของ s และ q ตรงกับข้อใด","choices":["T, T","F, T","T, F","F, F"],"correctChoiceIndex":3,"explanation":"อิมพลิเคชันเท็จเมื่อหน้าเป็นจริงหลังเป็นเท็จ หลัง s∨~r เท็จจึง s=F และ r=T ส่วนหน้าเป็นจริงต้อง ~q=T จึง q=F","tip":"A→B เท็จเฉพาะเมื่อ A จริงและ B เท็จ"}]$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-07-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  coalesce(data->'media', '{}'::jsonb),
  jsonb_build_object('source_question_no', position, 'qa_status', 'passed', 'base_source_set', 3, 'difficulty_policy', 'same_or_harder_than_source')
from seed_police_math_set_07
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-07-q' || lpad(position::text, 2, '0'),
  (data->>'correctChoiceIndex')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 7, 'qa_status', 'passed', 'source', 'police-math-set-07-original.json', 'base_source_set', 3)
from seed_police_math_set_07
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-07',
  'police-math-set-07-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_07
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-07';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-07';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-07'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 3 then
    raise exception 'Set 7 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;

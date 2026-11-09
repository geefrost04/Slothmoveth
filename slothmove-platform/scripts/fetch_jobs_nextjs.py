#!/usr/bin/env python3
"""
Next.js OCSC jobs pipeline.

Steps:
1. Fetch active jobs from https://jobapp.ocsc.go.th/jobapi/portal/jobs
2. Load existing jobs.ts (history) and merge
3. Write jobs.ts (UTF-8, no BOM)
4. Run `next build`
5. Kill old `next start` on port 3050 and start new one

Usage:
    python3 fetch_jobs_nextjs.py [--skip-build]
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

# --- Config ---
ROOT = Path("/Users/geefrost/Desktop/SlothMove/slothmove-platform")
JOBS_TS = ROOT / "src/data/jobs.ts"
CSV_HISTORY = ROOT / "src/data/jobs_all.csv"
API_URL = "https://jobapp.ocsc.go.th/jobapi/portal/jobs"
PORT = 3050

TZ_BKK = timezone(timedelta(hours=7))


# ---------- Helpers ----------
def http_get_json(url: str, timeout: int = 60) -> list:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def load_existing_jobs() -> list[dict]:
    """Parse existing JOBS_DATA array from jobs.ts."""
    if not JOBS_TS.exists():
        return []
    content = JOBS_TS.read_text(encoding="utf-8")
    start = content.find("[")
    end = content.rfind("]")
    if start == -1 or end == -1:
        return []
    array_text = content[start:end + 1]
    return json.loads(array_text)


def fix_year(year_str: str) -> str | None:
    """Normalize year for Buddhist Era date parsing."""
    if not year_str:
        return None
    try:
        y = int(year_str)
    except ValueError:
        return None
    if y > 2500:  # Buddhist Era
        y -= 543
    if y > datetime.now().year + 5:
        y -= 100
    if y < 2000 or y > 2100:
        return None
    return f"{y:04d}"


def fmt_date(iso_date: str | None) -> str:
    if not iso_date:
        return ""
    if "T" in iso_date:
        iso_date = iso_date.split("T")[0]
    parts = iso_date.split("-")
    if len(parts) != 3:
        return ""
    y = fix_year(parts[0])
    if not y:
        return ""
    return f"{y}-{parts[1]}-{parts[2]}"


def parse_position_amount(v) -> str:
    if v is None:
        return "0"
    return str(int(v)) if str(v).strip() else "0"


# Map jobCategoryId/Other → "ประเภทงาน"
JOB_CATEGORY_NAMES = {
    1: "ข้าราชการพลเรือน",
    2: "พนักงานราชการ",
    3: "พนักงานส่วนท้องถิ่น",
    4: "ลูกจ้างประจำ",
    5: "ลูกจ้างชั่วคราว",
    6: "พนักงานรัฐวิสาหกิจ",
    7: "พนักงานมหาวิทยาลัย",
    8: "ข้าราชการทหาร/ตำรวจ",
    9: "พนักงานกระทรวง/กรม",
    99: None,  # use jobCategoryOther
}

# Map jobLevelId/Other → "ระดับ"
JOB_LEVEL_NAMES = {
    1: "ปฏิบัติการ",
    2: "ชำนาญการ",
    3: "ชำนาญการพิเศษ",
    4: "เชี่ยวชาญ",
    5: "ทรงคุณวุฒิ",
    6: "อำนวยการต้น",
    7: "อำนวยการสูง",
    99: None,  # use jobLevelOther
}

# Map jobSelectionId/Other → "วิธีการสรรหา"
JOB_SELECTION_NAMES = {
    1: "สอบแข่งขัน",
    2: "คัดเลือก",
    3: "สรรหา",
    4: "ย้าย/โอน",
    5: "บรรจุใหม่",
    6: "สอบข้อเขียน",
    7: "สอบสัมภาษณ์",
    8: "ประเมินความเหมาะสม",
    99: None,  # use jobSelectionOther
}

# Map jobConditionId/Other → "เงื่อนไข"
JOB_CONDITION_NAMES = {
    1: "ไม่รับโอน",
    2: "รับโอน",
    3: "ไม่มีเงื่อนไข",
    4: "รับสมัครทั่วประเทศ",
    5: "เฉพาะภูมิภาค",
    99: None,  # use jobConditionOther
}

# Map educationLevelIds[0] → "ระดับการศึกษา"
EDUCATION_NAMES = {
    1: "ป.ตรี",
    2: "ป.โท",
    3: "ป.เอก",
    4: "ปวช.",
    5: "ปวส.",
    6: "ม.ต้น",
    7: "ม.ปลาย",
    8: "ป.ตรีขึ้นไป",
    9: "อนุปริญญา",
    99: None,  # use educationLevelOther
}

# Map provinceIds[0] → "จังหวัด"
PROVINCE_NAMES = {
    1: "กรุงเทพมหานคร",
    2: "สมุทรปราการ",
    3: "นนทบุรี",
    4: "ปทุมธานี",
    5: "พระนครศรีอยุธยา",
    6: "อ่างทอง",
    7: "ลพบุรี",
    8: "สิงห์บุรี",
    9: "ชัยนาท",
    10: "สระบุรี",
    11: "ชลบุรี",
    12: "ระยอง",
    13: "จันทบุรี",
    14: "ตราด",
    15: "ฉะเชิงเทรา",
    16: "ปราจีนบุรี",
    17: "นครนายก",
    18: "สระแก้ว",
    19: "นครราชสีมา",
    20: "บุรีรัมย์",
    21: "สุรินทร์",
    22: "ศรีสะเกษ",
    23: "อุบลราชธานี",
    24: "ยโสธร",
    25: "ชัยภูมิ",
    26: "อำนาจเจริญ",
    27: "หนองบัวลำภู",
    28: "ขอนแก่น",
    29: "อุดรธานี",
    30: "เลย",
    31: "หนองคาย",
    32: "มหาสารคาม",
    33: "ร้อยเอ็ด",
    34: "กาฬสินธุ์",
    35: "สกลนคร",
    36: "นครพนม",
    37: "มุกดาหาร",
    38: "เชียงใหม่",
    39: "ลำพูน",
    40: "ลำปาง",
    41: "อุตรดิตถ์",
    42: "แพร่",
    43: "น่าน",
    44: "พะเยา",
    45: "เชียงราย",
    46: "แม่ฮ่องสอน",
    47: "นครสวรรค์",
    48: "อุทัยธานี",
    49: "กำแพงเพชร",
    50: "ตาก",
    51: "สุโขทัย",
    52: "พิษณุโลก",
    53: "พิจิตร",
    54: "เพชรบูรณ์",
    55: "ราชบุรี",
    56: "กาญจนบุรี",
    57: "สุพรรณบุรี",
    58: "นครปฐม",
    59: "สมุทรสาคร",
    60: "สมุทรสงคราม",
    61: "เพชรบุรี",
    62: "ประจวบคีรีขันธ์",
    63: "นครศรีธรรมราช",
    64: "กระบี่",
    65: "พังงา",
    66: "ภูเก็ต",
    67: "สุราษฎร์ธานี",
    68: "ระนอง",
    69: "ชุมพร",
    70: "สงขลา",
    71: "สตูล",
    72: "ตรัง",
    73: "พัทลุง",
    74: "ปัตตานี",
    75: "ยะลา",
    76: "นราธิวาส",
}


def lookup(map_: dict, key: int | None, fallback: str | None = None) -> str:
    if key is None:
        return ""
    name = map_.get(key)
    if name is None:
        return (fallback or "").strip() if fallback else ""
    return name


def lookup_first(map_: dict, keys: list | None, fallback: str | None = None) -> str:
    if not keys:
        return ""
    return lookup(map_, keys[0], fallback)


def normalize_record(rec: dict) -> dict:
    """Convert OCSC API record to jobs.ts format."""
    job_category = lookup(JOB_CATEGORY_NAMES, rec.get("jobCategoryId"), rec.get("jobCategoryOther")) or "ไม่มีข้อมูล"
    job_level = lookup(JOB_LEVEL_NAMES, rec.get("jobLevelId"), rec.get("jobLevelOther")) or "ไม่มีข้อมูล"
    job_selection = lookup(JOB_SELECTION_NAMES, rec.get("jobSelectionId"), rec.get("jobSelectionOther")) or "อื่น ๆ"
    job_condition = lookup(JOB_CONDITION_NAMES, rec.get("jobConditionId"), rec.get("jobConditionOther")) or "ไม่มีเงื่อนไข"
    education = lookup_first(EDUCATION_NAMES, rec.get("educationLevelIds"), rec.get("educationLevelOther")) or "ไม่มีข้อมูล"
    province = lookup_first(PROVINCE_NAMES, rec.get("provinceIds")) or "ไม่ระบุ"

    salary_min = rec.get("salaryMin") or 0
    salary_max = rec.get("salaryMax") or salary_min
    description = (
        rec.get("civilJobDescription")
        or rec.get("employeeJobDescription")
        or "รายละเอียดตามประกาศรับสมัคร"
    )
    qualification = (
        rec.get("civilJobEducation")
        or rec.get("employeeJobSpecification")
        or "รายละเอียดตามประกาศรับสมัคร"
    )

    return {
        "id": f"ocsc:{rec['id']}",
        "ตำแหน่ง": (rec.get("position") or "").strip() or "ไม่ระบุตำแหน่ง",
        "หน่วยงาน": (rec.get("department") or "").strip() or "ไม่ระบุหน่วยงาน",
        "กระทรวง": (rec.get("ministry") or "").strip() or "ไม่ระบุกระทรวง",
        "ประเภทงาน": job_category,
        "ระดับ": job_level,
        "วิธีการสรรหา": job_selection,
        "เงื่อนไข": job_condition,
        "เงินเดือนต่ำสุด": str(salary_min) if salary_min else "",
        "เงินเดือนสูงสุด": str(salary_max) if salary_max else "",
        "จำนวนรับ": parse_position_amount(rec.get("positionAmount")),
        "จังหวัด": province,
        "ระดับการศึกษา": education,
        "วันเริ่มสมัคร": fmt_date(rec.get("applicationStart")),
        "วันหมดสมัคร": fmt_date(rec.get("applicationEnd")),
        "วันสอบ": fmt_date(rec.get("examDate")),
        "วันสัมภาษณ์": fmt_date(rec.get("interviewDate")),
        "ลิงก์": rec.get("url") or "",
        "ไฟล์ประกาศ": rec.get("fileName") or "",
        "โลโก้หน่วยงาน": rec.get("seal") or "",
        "คุณสมบัติเฉพาะ": qualification,
        "รายละเอียดงาน": description,
        "แหล่งที่มา": "job.ocsc.go.th",
        "สถานะ": "เปิดรับ",
        "ยอดเข้าชม": str(rec.get("webView") or 0),
    }


def write_jobs_ts(records: list[dict]) -> None:
    """Write jobs.ts with proper UTF-8 encoding (no BOM)."""
    json_str = json.dumps(records, ensure_ascii=False, indent=2)
    # Re-indent to match existing style: 2 spaces per property
    pretty = re.sub(
        r'^(  )"([^"]+)":',
        r'\1\2:',
        json_str,
        flags=re.MULTILINE,
    )
    output = f"export const JOBS_DATA = {pretty};\n"
    JOBS_TS.write_text(output, encoding="utf-8")
    # Verify no BOM
    raw = JOBS_TS.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        JOBS_TS.write_bytes(raw[3:])
    print(f"  ✓ Wrote {len(records)} records to {JOBS_TS}")


def write_csv_history(records: list[dict]) -> None:
    """Append/update CSV history (no prune)."""
    import csv
    if not records:
        return
    fieldnames = list(records[0].keys())
    file_exists = CSV_HISTORY.exists()
    with CSV_HISTORY.open("a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for rec in records:
            writer.writerow(rec)
    print(f"  ✓ Appended {len(records)} records to {CSV_HISTORY}")


def run_step(cmd: list[str], cwd: Path, env: dict | None = None) -> int:
    print(f"  $ {' '.join(cmd)} (cwd={cwd})")
    proc = subprocess.run(
        cmd,
        cwd=cwd,
        env=env or {**__import__('os').environ, "PYTHONUNBUFFERED": "1"},
        capture_output=False,
    )
    return proc.returncode


def kill_old_server(port: int) -> None:
    """Find and kill existing next start on given port."""
    try:
        out = subprocess.run(
            ["lsof", "-ti", f":{port}"],
            capture_output=True, text=True, check=False,
        )
        pids = [p.strip() for p in out.stdout.splitlines() if p.strip()]
        for pid in pids:
            print(f"  killing pid {pid} on :{port}")
            subprocess.run(["kill", "-9", pid], check=False)
        time.sleep(1)
    except FileNotFoundError:
        pass


# ---------- Main ----------
def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-build", action="store_true")
    parser.add_argument("--skip-server", action="store_true")
    parser.add_argument("--no-history", action="store_true",
                        help="Don't append to CSV history")
    args = parser.parse_args()

    t0 = time.time()
    print("=" * 60)
    print(f"[1/4] Fetching OCSC jobs from {API_URL}")
    print("=" * 60)
    try:
        raw = http_get_json(API_URL)
    except Exception as e:
        print(f"  ✗ API fetch failed: {e}", file=sys.stderr)
        return 1
    print(f"  ✓ Fetched {len(raw)} records")

    # Convert
    api_records = [normalize_record(r) for r in raw]
    api_ids = {r["id"] for r in api_records}

    # Load existing
    print()
    print("=" * 60)
    print(f"[2/4] Merging with existing {JOBS_TS.name}")
    print("=" * 60)
    existing = load_existing_jobs()
    print(f"  ✓ Loaded {len(existing)} existing records")
    existing_by_id = {j["id"]: j for j in existing}

    # Build merged: API first (fresh), then existing not in API (history)
    merged = list(api_records)
    new_from_api = 0
    kept_history = 0
    reopened = 0
    for old_id, old_job in existing_by_id.items():
        if old_id in api_ids:
            # Already in API (api_records take precedence)
            continue
        # Mark closed if previously active
        if old_job.get("สถานะ") == "เปิดรับ":
            old_job["สถานะ"] = "ปิดรับแล้ว"
            reopened += 0  # tracker
        merged.append(old_job)
        kept_history += 1
    print(f"  ✓ {len(api_records)} from API + {kept_history} historical (closed/removed)")
    print(f"  ✓ Total in jobs.ts: {len(merged)}")

    # Sort: active first (by application end desc), then closed
    def sort_key(r):
        is_active = 1 if r.get("สถานะ") == "เปิดรับ" else 0
        end = r.get("วันหมดสมัคร") or "0000-00-00"
        return (-is_active, end)
    merged.sort(key=sort_key, reverse=True)

    # Write
    print()
    print("=" * 60)
    print(f"[3/4] Writing {JOBS_TS.name}")
    print("=" * 60)
    write_jobs_ts(merged)
    if not args.no_history:
        write_csv_history(api_records)

    if args.skip_build:
        print()
        print("=" * 60)
        print("[4/4] Skipped build + server (--skip-build)")
        print("=" * 60)
        return 0

    # Build
    print()
    print("=" * 60)
    print(f"[4/4] Building + restarting server on :{PORT}")
    print("=" * 60)
    rc = run_step(["npx", "next", "build"], cwd=ROOT)
    if rc != 0:
        print(f"  ✗ next build failed (rc={rc})", file=sys.stderr)
        return rc

    # Show new BUILD_ID
    build_id_path = ROOT / ".next/BUILD_ID"
    if build_id_path.exists():
        print(f"  ✓ BUILD_ID = {build_id_path.read_text().strip()}")

    if args.skip_server:
        return 0

    kill_old_server(PORT)
    log_dir = ROOT / "tmp"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "next-server.log"
    log_handle = log_file.open("a", encoding="utf-8")
    subprocess.Popen(
        ["npx", "next", "start", "-p", str(PORT)],
        cwd=ROOT,
        stdout=log_handle,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )
    print(f"  ✓ Server started, log → {log_file}")

    # Wait a moment then check
    time.sleep(3)
    rc = subprocess.run(
        ["curl", "-sI", f"http://localhost:{PORT}/rat-ngan"],
        capture_output=True, text=True,
    )
    print(f"  HTTP probe: {rc.stdout.splitlines()[0] if rc.stdout else 'no response'}")

    dt = time.time() - t0
    print()
    print(f"✓ Pipeline complete in {dt:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())

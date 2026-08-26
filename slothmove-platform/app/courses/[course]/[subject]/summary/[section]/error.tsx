'use client';

export default function StudySheetError({ reset }: { error: Error; reset: () => void }) {
  return <div className="study-sheet-empty" role="alert"><h1>โหลดชีทสรุปไม่สำเร็จ</h1><p>กรุณาลองใหม่อีกครั้ง</p><button type="button" onClick={reset}>ลองใหม่</button></div>;
}

'use client';

export function PrintStudySheetButton() {
  return (
    <button type="button" className="study-sheet-print-button" onClick={() => window.print()}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      พิมพ์ / บันทึก PDF
    </button>
  );
}

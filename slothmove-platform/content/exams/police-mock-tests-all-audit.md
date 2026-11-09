# Police Mock Tests 1-5 - Consolidated Audit

- **Audit Result**: ✅ PASS
- **Timestamp**: 2026-09-05T09:08:07.138Z
- **Scope**: 5 mock tests / 750 questions

## Per-set checks
- **police-mock-test-set-01.json**: 150 questions | {"math":20,"thai":20,"computer":40,"saraban":30,"law":25,"english":15} | answers 30/44/42/34 | spread 14
- **police-mock-test-set-02.json**: 150 questions | {"math":20,"thai":20,"computer":40,"saraban":30,"law":25,"english":15} | answers 30/44/42/34 | spread 14
- **police-mock-test-set-03.json**: 150 questions | {"math":20,"thai":20,"computer":40,"saraban":30,"law":25,"english":15} | answers 36/38/40/36 | spread 4
- **police-mock-test-set-04.json**: 150 questions | {"math":20,"thai":20,"computer":40,"saraban":30,"law":25,"english":15} | answers 37/37/41/35 | spread 6
- **police-mock-test-set-05.json**: 150 questions | {"math":20,"thai":20,"computer":40,"saraban":30,"law":25,"english":15} | answers 37/36/39/38 | spread 3

## Cross-set checks
- Exact duplicate prompts: 1
- Exact duplicate question fingerprints: 0
- Reused visual assets: 0
- Near-duplicate prompt pairs (>= 0.72): 2
  - police-mock-test-set-01.json Q32 ↔ police-mock-test-set-05.json Q28: 0.742
  - police-mock-test-set-01.json Q30 ↔ police-mock-test-set-05.json Q22: 0.739

## Issues
- Errors (0):
  - None
- Warnings (4):
  - police-mock-test-set-01.json: answer distribution is uneven (30/44/42/34)
  - police-mock-test-set-02.json: answer distribution is uneven (30/44/42/34)
  - reused prompt template with different answer context: police-mock-test-set-01 Q142 / police-mock-test-set-03 Q142
  - 2 near-duplicate prompt pairs require manual review (threshold >= 0.72)

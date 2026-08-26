# Mock Test Set 02 - Independent Re-audit

Date: 2026-08-26

Final status: **NEEDS_FIX - NOT READY TO PUBLISH**

This review independently checked the current 150-question JSON, Set 1 subject banks, the attached audit report, and authoritative references for flagged legal/procedural claims.

## Confirmed passes

- Total and subject allocation: 150 questions, distributed 20/20/40/30/25/15.
- Structural validity: four unique choices per question, valid zero-based answer indexes, and complete prompt/explanation/tip fields.
- No exact prompt duplicates and no suspicious prompt similarity at or above 0.72 against the current local banks.
- Math Q1-Q20 answer keys recalculate correctly.
- Thai Q21-Q40, Computer Q41-Q80, and English Q136-Q150 contain no clearly incorrect answer key on content review.
- Saraban and Law answers are generally defensible as broad subject knowledge, but several do not match the requested Set 1 mechanism DNA.

## Blocking findings

### 1. Predictable answer sequence

All 150 answers follow the exact repeating cycle `0, 3, 2, 1`. The aggregate distribution 38/37/37/38 looks balanced, but the sequence is predictable. This must be reshuffled with a seeded non-periodic order and re-audited.

### 2. Incorrect QA status

`qualityNotes.qaStatus` currently says `full_audit_passed_2026_08_26`. This is not supportable while the answer cycle and DNA mismatches remain.

### 3. DNA is validated only by label counts

The existing audit script confirms bucket totals but does not verify that each question uses a Set 1 source mechanism. Consequently, it returns PASS even when the semantic composition differs materially.

- Thai: Q35-Q40 drift from strict Set 1 mechanisms.
- Computer: the bank expands into DNS, SaaS, digital signatures, databases/SQL, least privilege, backup, encryption, PDPA, Generative AI, binary, IoT, QR security, and troubleshooting. These may be valid syllabus topics, but are not strict Set 1 DNA.
- Saraban: Q106-Q107 are not true C-mechanism items; Q108-Q110 are not Set 1 D-mechanism items.
- Law: only a small subset closely matches Set 1 mechanisms. Q111-Q133 largely require rebuilding around the original Set 1 topic mechanisms.
- English: Conversation/Vocabulary/Reading/Grammar counts are correct, but Q137-Q150 largely use mechanisms outside Set 1.

### 4. Saraban Q104 is procedurally incomplete

The current answer says to prepare the list and submit it to a committee. Under regulation item 66, the list is submitted to the head of the department-level agency for consideration and appointment of the destruction committee. The answer should name that authority and sequence explicitly.

Reference: National Archives of Thailand, regulation item 66 and records-retention guidance.

### 5. Law Q133 is too vague

The broad answer is directionally correct, but the question should state the age band. Current law distinguishes a child not over 12 years old under section 73 from a child over 12 but not over 15 under section 74.

Reference: Office of Justice Affairs, Criminal Code Amendment Act (No. 29), B.E. 2565.

### 6. Explanation and tip are duplicated

All items are generated from the same pattern: the explanation repeats the short reason and answer, while the tip repeats that same reason after `จุดจับคำตอบ:`. This does not meet the requested premium explanation standard.

Required separation:

- Explanation: principle, reasoning steps, and why the strongest distractor is wrong.
- Tip: mnemonic, signal word, trap, or exam shortcut.
- Law/Saraban/Computer security: add a verification reference.

## Additional review item

Computer Q51 uses two buildings in the same province and forces `WAN` while omitting `MAN`. The answer can be defended because the link is provider-operated, but the geography makes the item avoidably ambiguous. Change the scenario to offices in different provinces or include and distinguish MAN.

## Verdict

- Answer-key correctness: **GOOD overall**
- Structural integrity: **PASS**
- Anti-pattern quality: **FAIL**
- Strict Set 1 DNA fidelity: **FAIL**
- Premium explanation quality: **FAIL**
- Publication readiness: **NOT READY**

The attached audit's main conclusion is confirmed. The currently published Set 02 should be corrected and regression-audited before being sold.

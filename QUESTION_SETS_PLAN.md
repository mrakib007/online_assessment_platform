# Question Sets Feature - Task Plan

## Overview

Question Sets allow an employer to create multiple versions of the same exam.
Each candidate is randomly assigned one set when they start the exam.
This prevents answer sharing between candidates.

## How It Works

### Employer Flow
1. Creates test with "Question Set: 2" (means 2 versions of the exam)
2. In Step 2 (Questions), sees tabs: [Set 1] [Set 2]
3. Adds questions to Set 1, then switches to Set 2 and adds different questions
4. Submits → all sets saved to backend

### Candidate Flow
1. Clicks "Start" on a test
2. System randomly assigns them Set 1 or Set 2
3. Candidate takes exam with only their assigned set's questions
4. No two candidates necessarily get the same questions

---

## Database Changes

### Current Schema
```
Question {
  id, testId, type, text, points, options
}
```

### New Schema
```
Question {
  id, testId, setNumber, type, text, points, options
}
```

Add `setNumber Int @default(1)` to Question model.

**Migration needed:**
```bash
cd backend
npx prisma migrate dev --name add_set_number_to_question
npx prisma generate
```

---

## Backend Changes

### 1. Update Question Model (backend/models/onlineTestModel.js)
- `create()` — pass `setNumber` when creating questions
- `findById()` — already includes questions, no change needed

### 2. Update Create Controller (backend/controllers/onlineTestController.js)
- Accept `setNumber` in each question object
- Pass it through to model

### 3. New: Get Questions by Set
When candidate starts exam, assign them a random set:
```
GET /api/tests/:id/start
→ Returns: { ...test, questions: [only questions for assigned set], assignedSet: 1 }
```

---

## Frontend Changes

### 1. Redux Slice (lib/store/testCreationSlice.ts)
- Add `setNumber` to Question interface
- Questions are already stored in state, just need `setNumber` field

### 2. QuestionsStep Component (components/online-test/QuestionsStep.tsx)
- Add set tabs at the top: [Set 1] [Set 2] ... [Set N]
- `activeSet` state to track which set is being edited
- "Add Question" adds to the active set
- Questions list shows only questions for active set
- Submit sends all questions with their `setNumber`

```
┌─────────────────────────────────────┐
│  [Set 1] [Set 2]                    │  ← tabs
├─────────────────────────────────────┤
│  Question 1 (MCQ)        Edit Delete│
│  Question 2 (Text)       Edit Delete│
├─────────────────────────────────────┤
│  [+ Add Question]                   │
└─────────────────────────────────────┘
```

### 3. AddQuestionModal (components/online-test/AddQuestionModal.tsx)
- No changes needed, question type is per-question already

### 4. Exam Page (app/(dashboard)/online-test/[id]/start/page.tsx)
- On load, randomly pick a set number (1 to questionSet count)
- Filter questions by that set number
- Show only those questions to the candidate

```typescript
// Randomly assign set
const assignedSet = Math.ceil(Math.random() * (test.questionSet || 1));
const questions = test.questions.filter(q => q.setNumber === assignedSet);
```

---

## Task List

### Phase 1: Database
- [ ] Add `setNumber` field to Question model in schema.prisma
- [ ] Run `npx prisma migrate dev --name add_set_number`
- [ ] Run `npx prisma generate`

### Phase 2: Backend
- [ ] Update `onlineTestModel.create()` to pass `setNumber` per question
- [ ] Update `onlineTestController.create()` to accept `setNumber` in questions array

### Phase 3: Frontend - Creation
- [ ] Add `setNumber` to Question interface in testCreationSlice.ts
- [ ] Add set tabs to QuestionsStep component
- [ ] Filter displayed questions by active set
- [ ] Pass `setNumber` in final submit payload

### Phase 4: Frontend - Exam Taking
- [ ] Randomly assign a set number when exam starts
- [ ] Filter questions by assigned set number
- [ ] Show assigned set info in header (optional)

---

## Question Type Field

**Current behavior:** "Question Type" in basic info is just metadata/label.
**Recommended behavior:** Keep it as metadata only. Each question independently
selects its own type (MCQ/Radio/Text) in the modal. No restriction needed.

**Reason:** An exam might have a mix of MCQ and Text questions regardless of
the overall "type" label. Restricting it would reduce flexibility.

---

## Estimated Effort

| Phase | Effort |
|-------|--------|
| Database | 10 min |
| Backend | 15 min |
| Frontend - Creation | 30 min |
| Frontend - Exam | 15 min |
| **Total** | **~70 min** |

---

## Notes

- If `questionSet = 1`, behavior is same as current (no sets, all questions shown)
- If a set has 0 questions, candidate gets empty exam — employer should be warned
- Set assignment is random per session, not stored (no backend submission needed)
- This is a frontend-only random assignment for now

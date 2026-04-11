import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimeSlot {
  id: string; // local temp id
  startTime: string;
  endTime: string;
  maxCandidates: number;
}

interface BasicInfo {
  title: string;
  candidates: string;
  questionSet: string;
  questionType: string;
  negativeMarkingEnabled: boolean;
  negativeMarkingPenalty: number;
  timeSlots: TimeSlot[];
}

interface Option {
  label: string;
  correct: boolean;
}

export interface Question {
  id: number;
  type: string;
  points: number;
  text: string;
  setNumber: number;
  options?: Option[];
}

interface TestCreationState {
  basicInfo: BasicInfo;
  questions: Question[];
}

const emptyBasicInfo: BasicInfo = {
  title: '',
  candidates: '',
  questionSet: '',
  questionType: '',
  negativeMarkingEnabled: false,
  negativeMarkingPenalty: 25,
  timeSlots: [],
};

const initialState: TestCreationState = {
  basicInfo: emptyBasicInfo,
  questions: [],
};

const testCreationSlice = createSlice({
  name: 'testCreation',
  initialState,
  reducers: {
    setBasicInfo(state, action: PayloadAction<BasicInfo>) {
      state.basicInfo = action.payload;
    },
    addTimeSlot(state, action: PayloadAction<TimeSlot>) {
      state.basicInfo.timeSlots.push(action.payload);
    },
    updateTimeSlot(state, action: PayloadAction<TimeSlot>) {
      const idx = state.basicInfo.timeSlots.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.basicInfo.timeSlots[idx] = action.payload;
    },
    removeTimeSlot(state, action: PayloadAction<string>) {
      state.basicInfo.timeSlots = state.basicInfo.timeSlots.filter((s) => s.id !== action.payload);
    },
    setNegativeMarkingEnabled(state, action: PayloadAction<boolean>) {
      state.basicInfo.negativeMarkingEnabled = action.payload;
    },
    setNegativeMarkingPenalty(state, action: PayloadAction<number>) {
      state.basicInfo.negativeMarkingPenalty = action.payload;
    },
    addQuestion(state, action: PayloadAction<Question>) {
      state.questions.push(action.payload);
    },
    updateQuestion(state, action: PayloadAction<Question>) {
      const index = state.questions.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) state.questions[index] = action.payload;
    },
    deleteQuestion(state, action: PayloadAction<number>) {
      state.questions = state.questions
        .filter((q) => q.id !== action.payload)
        .map((q, i) => ({ ...q, id: i + 1 }));
    },
    resetTestCreation(state) {
      state.basicInfo = emptyBasicInfo;
      state.questions = [];
    },
  },
});

export const {
  setBasicInfo,
  addTimeSlot,
  updateTimeSlot,
  removeTimeSlot,
  setNegativeMarkingEnabled,
  setNegativeMarkingPenalty,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  resetTestCreation,
} = testCreationSlice.actions;

export default testCreationSlice.reducer;

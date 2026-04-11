import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BasicInfo {
  title: string;
  candidates: string;
  slots: string;
  questionSet: string;
  questionType: string;
  startTime: string;
  endTime: string;
  duration: string;
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
  slots: '',
  questionSet: '',
  questionType: '',
  startTime: '',
  endTime: '',
  duration: '',
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
  addQuestion,
  updateQuestion,
  deleteQuestion,
  resetTestCreation,
} = testCreationSlice.actions;

export default testCreationSlice.reducer;

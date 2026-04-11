'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addQuestion, updateQuestion, deleteQuestion, resetTestCreation } from '@/lib/store/testCreationSlice';
import { useCreateMutation } from '@/lib/api/dynamicApi';
import AddQuestionModal from './AddQuestionModal';
import QuestionCard from './QuestionCard';

export type QuestionType = 'MCQ' | 'Radio' | 'Text';

export interface Question {
  id: number;
  type: string;
  points: number;
  text: string;
  options?: { label: string; correct: boolean }[];
}

export default function QuestionsStep() {
  const dispatch = useDispatch();
  const router = useRouter();
  const basicInfo = useSelector((state: RootState) => state.testCreation.basicInfo);
  const questions = useSelector((state: RootState) => state.testCreation.questions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [createTest, { isLoading }] = useCreateMutation();

  const handleAddOrEdit = (q: { type: string; score: number; options: { text: string; correct: boolean }[]; questionText: string }) => {
    if (editingQuestion) {
      dispatch(updateQuestion({
        ...editingQuestion,
        type: q.type,
        points: q.score,
        text: q.questionText || editingQuestion.text,
        options: q.options?.map((o) => ({ label: o.text, correct: o.correct })),
      }));
      setEditingQuestion(null);
    } else {
      dispatch(addQuestion({
        id: questions.length + 1,
        type: q.type,
        points: q.score,
        text: q.questionText || 'New Question',
        options: q.options?.map((o) => ({ label: o.text, correct: o.correct })),
      }));
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteQuestion(id));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question before creating the test.');
      return;
    }

    try {
      await createTest({
        endpoint: '/api/tests',
        body: {
          title: basicInfo.title,
          candidates: parseInt(basicInfo.candidates),
          totalSlots: parseInt(basicInfo.slots),
          questionSet: basicInfo.questionSet,
          questionType: basicInfo.questionType,
          startTime: basicInfo.startTime,
          endTime: basicInfo.endTime,
          duration: basicInfo.duration,
          questions: questions.map(({ type, text, points, options }) => ({
            type, text, points, options: options ?? null,
          })),
        },
      }).unwrap();

      dispatch(resetTestCreation());
      router.push('/dashboard');
    } catch (error: any) {
      alert(error?.data?.message || 'Failed to create test. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[960px] w-full mx-auto">
      <AddQuestionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingQuestion(null); }}
        questionNumber={editingQuestion ? editingQuestion.id : questions.length + 1}
        editData={editingQuestion}
        onSave={handleAddOrEdit}
      />

      {questions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-8 py-2">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#6633FF' }}
      >
        Add Question
      </button>

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || questions.length === 0}
          className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#6633FF' }}
        >
          {isLoading ? 'Creating...' : 'Create Test'}
        </button>
      </div>
    </div>
  );
}

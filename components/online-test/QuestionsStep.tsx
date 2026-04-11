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
  setNumber: number;
  options?: { label: string; correct: boolean }[];
}

export default function QuestionsStep() {
  const dispatch = useDispatch();
  const router = useRouter();
  const basicInfo = useSelector((state: RootState) => state.testCreation.basicInfo);
  const questions = useSelector((state: RootState) => state.testCreation.questions);
  const [activeSet, setActiveSet] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [createTest, { isLoading }] = useCreateMutation();

  const totalSets = parseInt(basicInfo.questionSet) || 1;
  const setNumbers = Array.from({ length: totalSets }, (_, i) => i + 1);

  // Questions for the currently active set
  const activeQuestions = questions.filter((q) => q.setNumber === activeSet);

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
      // id is unique across all sets
      const newId = questions.length + 1;
      dispatch(addQuestion({
        id: newId,
        type: q.type,
        points: q.score,
        text: q.questionText || 'New Question',
        setNumber: activeSet,
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
    const emptySets = setNumbers.filter(
      (s) => questions.filter((q) => q.setNumber === s).length === 0
    );
    if (emptySets.length > 0) {
      setSubmitError(`Set ${emptySets.join(', ')} ${emptySets.length > 1 ? 'have' : 'has'} no questions. Please add at least one question per set.`);
      // Switch to first empty set so user can see it
      setActiveSet(emptySets[0]);
      return;
    }
    setSubmitError('');

    try {
      await createTest({
        endpoint: '/api/tests',
        body: {
          title: basicInfo.title,
          candidates: parseInt(basicInfo.candidates),
          questionSet: parseInt(basicInfo.questionSet),
          questionType: basicInfo.questionType,
          negativeMarkingEnabled: basicInfo.negativeMarkingEnabled,
          negativeMarkingPenalty: basicInfo.negativeMarkingPenalty,
          timeSlots: basicInfo.timeSlots.map(({ startTime, endTime, maxCandidates }) => ({
            startTime, endTime, maxCandidates,
          })),
          questions: questions.map(({ type, text, points, options, setNumber }) => ({
            type, text, points, options: options ?? null, setNumber,
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
        questionNumber={editingQuestion ? editingQuestion.id : activeQuestions.length + 1}
        editData={editingQuestion}
        onSave={handleAddOrEdit}
      />

      {/* Set Tabs */}
      {totalSets > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-3 flex items-center gap-2">
          <span className="text-xs text-gray-500 mr-2 font-medium">Question Set:</span>
          {setNumbers.map((s) => {
            const count = questions.filter((q) => q.setNumber === s).length;
            const isEmpty = count === 0 && submitError;
            return (
              <button
                key={s}
                onClick={() => setActiveSet(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeSet === s
                    ? 'text-white'
                    : isEmpty
                    ? 'border border-red-400 text-red-500 bg-red-50'
                    : 'border border-gray-200 text-gray-600 hover:border-[#6633FF] hover:text-[#6633FF]'
                }`}
                style={activeSet === s ? { backgroundColor: isEmpty ? '#ef4444' : '#6633FF' } : {}}
              >
                Set {s}
                {count > 0 && (
                  <span className={`ml-1.5 text-xs ${activeSet === s ? 'text-white/80' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Questions for active set */}
      {activeQuestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-8 py-2">
          {activeQuestions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={{ ...q, id: index + 1 }} // display index within set
              onEdit={() => handleEdit(q)}
              onDelete={() => handleDelete(q.id)}
            />
          ))}
        </div>
      )}

      {activeQuestions.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 px-8 py-10 flex items-center justify-center">
          <p className="text-sm text-gray-400">
            No questions in Set {activeSet} yet. Click "Add Question" to get started.
          </p>
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#6633FF' }}
      >
        Add Question {totalSets > 1 ? `to Set ${activeSet}` : ''}
      </button>

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex flex-col items-end gap-1">
          {submitError && <p className="text-xs text-red-500">{submitError}</p>}
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
    </div>
  );
}

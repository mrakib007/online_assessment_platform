import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMutation } from '@/lib/api/dynamicApi';
import AddQuestionModal from './AddQuestionModal';
import QuestionCard from './QuestionCard';
import { BasicInfo } from './BasicInfoForm';

type QuestionType = 'MCQ' | 'Checkbox' | 'Text';

interface Option {
  label: string;
  correct: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  points: number;
  text: string;
  options?: Option[];
}

interface QuestionsStepProps {
  testData: BasicInfo | null;
}

export default function QuestionsStep({ testData }: QuestionsStepProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [createTest, { isLoading }] = useCreateMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!testData) return;

    if (questions.length === 0) {
      alert('Please add at least one question before creating the test.');
      return;
    }

    try {
      const payload = {
        title: testData.title,
        candidates: parseInt(testData.candidates),
        totalSlots: parseInt(testData.slots),
        questionSet: testData.questionSet,
        questionType: testData.questionType,
        startTime: testData.startTime,
        endTime: testData.endTime,
        duration: testData.duration,
      };

      await createTest({
        endpoint: '/api/tests',
        body: payload,
      }).unwrap();

      alert('Test created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to create test:', error);
      alert(error?.data?.message || 'Failed to create test. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[960px] w-full mx-auto">
      <AddQuestionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        questionNumber={questions.length + 1}
        onSave={(q) => {
          setQuestions((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              type: q.type as QuestionType,
              points: q.score,
              text: q.questionText || 'New Question',
              options: q.options?.map((o) => ({ label: o.text, correct: false })),
            },
          ]);
        }}
      />
      {questions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-8 py-2">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
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

      {questions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6633FF' }}
          >
            {isLoading ? 'Creating Test...' : 'Create Test'}
          </button>
        </div>
      )}
    </div>
  );
}

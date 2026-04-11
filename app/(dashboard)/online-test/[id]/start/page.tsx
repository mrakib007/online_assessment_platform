'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetByIdQuery } from '@/lib/api/dynamicApi';
import ExamQuestion from '@/components/online-test/ExamQuestion';
import TimeoutModal from '@/components/online-test/TimeoutModal';
import CompletedScreen from '@/components/online-test/CompletedScreen';

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: test, isLoading } = useGetByIdQuery({ endpoint: '/api/tests', id: id as string });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<'exam' | 'completed' | 'timeout'>('exam');

  // Parse duration into seconds
  useEffect(() => {
    if (test?.duration) {
      const match = test.duration.match(/(\d+)/);
      if (match) setTimeLeft(parseInt(match[1]) * 60);
    }
  }, [test]);

  const handleComplete = useCallback((timedOut = false) => {
    setStatus(timedOut ? 'timeout' : 'completed');
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || status !== 'exam') return;
    if (timeLeft <= 0) { handleComplete(true); return; }
    const timer = setInterval(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status, handleComplete]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    const total = test?.questions?.length ?? 0;
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleComplete(false);
    }
  };

  const handleSkip = () => {
    const total = test?.questions?.length ?? 0;
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-gray-400">Loading exam...</span>
      </div>
    );
  }

  if (!test || !test.questions?.length) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-gray-400">No questions found for this exam.</span>
      </div>
    );
  }

  if (status === 'completed') return <CompletedScreen />;

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Question ({currentIndex + 1}/{questions.length})
        </span>
        {timeLeft !== null && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${
            timeLeft < 300 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
          }`}>
            {formatTime(timeLeft)} left
          </span>
        )}
      </div>

      {/* Question */}
      <ExamQuestion
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onAnswer={(ans: string | string[]) => handleAnswer(currentQuestion.id, ans)}
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          disabled={isLast}
          className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Skip this Question
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}
        >
          {isLast ? 'Submit' : 'Save & Continue'}
        </button>
      </div>

      {status === 'timeout' && (
        <TimeoutModal onBack={() => router.push('/dashboard')} />
      )}
    </div>
  );
}

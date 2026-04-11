'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetByIdQuery, useCreateMutation } from '@/lib/api/dynamicApi';
import ExamQuestion from '@/components/online-test/ExamQuestion';
import TimeoutModal from '@/components/online-test/TimeoutModal';
import CompletedScreen from '@/components/online-test/CompletedScreen';
import TabSwitchWarning from '@/components/online-test/TabSwitchWarning';

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: test, isLoading } = useGetByIdQuery({ endpoint: '/api/tests', id: id as string });
  const [submitExam] = useCreateMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<'exam' | 'completed' | 'timeout'>('exam');
  const [assignedSet, setAssignedSet] = useState<number | null>(null);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!test || status !== 'exam') return;
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
  }, [test, status]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen && status === 'exam') {
        setShowTabWarning(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [status]);

  useEffect(() => {
    if (status !== 'exam') return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => {
          const next = c + 1;
          setShowTabWarning(true);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [status]);

  // Parse duration into seconds
  useEffect(() => {
    if (test?.duration) {
      const match = test.duration.match(/(\d+)/);
      if (match) setTimeLeft(parseInt(match[1]) * 60);
    }
    // Randomly assign a set when test loads
    if (test?.questionSet && assignedSet === null) {
      const randomSet = Math.ceil(Math.random() * (test.questionSet || 1));
      setAssignedSet(randomSet);
    }
  }, [test]);

  const handleComplete = useCallback(async (timedOut = false) => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    try {
      await submitExam({ endpoint: `/api/exam/${id}/submit`, body: {} }).unwrap();
    } catch (err) { /* fail silently */ }
    setStatus(timedOut ? 'timeout' : 'completed');
  }, [id, submitExam]);

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
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  };

  const handleResumeFromWarning = () => {
    setShowTabWarning(false);
  
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
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

  // Filter questions by assigned set
  const allQuestions = test.questions;
  const questions = assignedSet && test.questionSet > 1
    ? allQuestions.filter((q: any) => q.setNumber === assignedSet)
    : allQuestions;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">
            Question ({currentIndex + 1}/{questions.length})
          </span>
          {test.questionSet > 1 && assignedSet && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-[#6633FF] font-medium">
              Set {assignedSet}
            </span>
          )}
          {tabSwitchCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-500 font-medium">
              ⚠ Tab switches: {tabSwitchCount}
            </span>
          )}
        </div>
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
          className="px-5 py-2 rounded-lg border border-[#6633FF] text-sm font-semibold text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
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

      {showTabWarning && (
        <TabSwitchWarning
          count={tabSwitchCount}
          onResume={handleResumeFromWarning}
        />
      )}
    </div>
  );
}

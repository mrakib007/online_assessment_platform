'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetByIdQuery, useGetAllQuery, useCreateMutation } from '@/lib/api/dynamicApi';
import ExamQuestion from '@/components/online-test/ExamQuestion';
import TimeoutModal from '@/components/online-test/TimeoutModal';
import CompletedScreen from '@/components/online-test/CompletedScreen';
import TabSwitchWarning from '@/components/online-test/TabSwitchWarning';

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: test, isLoading: testLoading } = useGetByIdQuery({ endpoint: '/api/tests', id: id as string });
  const { data: checkData, isLoading: checkLoading } = useGetAllQuery(`/api/exam/${id}/check`);
  const [startExam] = useCreateMutation();
  const [submitExam] = useCreateMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'exam' | 'completed' | 'timeout'>('loading');
  const [assignedSet, setAssignedSet] = useState<number>(1);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompletingRef = useRef(false); // prevents tab/fullscreen warnings during submit
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Once test + check data loaded, initialize session
  useEffect(() => {
    if (testLoading || checkLoading || !test || startedRef.current) return;
    startedRef.current = true;

    const check = checkData as any;

    // Already submitted → go to result
    if (check?.submitted) {
      router.replace(`/online-test/${id}/result`);
      return;
    }

    const durationMatch = test.duration?.match(/(\d+)/);
    const durationSeconds = durationMatch ? parseInt(durationMatch[1]) * 60 : 0;

    // If session exists (returning candidate), calculate remaining time
    if (check?.session) {
      const elapsed = Math.floor((Date.now() - new Date(check.session.startedAt).getTime()) / 1000);
      const remaining = durationSeconds - elapsed;

      if (remaining <= 0) {
        // Time already expired — auto submit
        handleComplete(true);
        return;
      }

      setAssignedSet(check.session.assignedSet);
      setTimeLeft(remaining);
      setStatus('exam');
    } else {
      // New session — pick random set and call start API
      const randomSet = Math.ceil(Math.random() * (test.questionSet || 1));
      setAssignedSet(randomSet);

      startExam({
        endpoint: `/api/exam/${id}/start`,
        body: { assignedSet: randomSet },
      }).then(() => {
        setTimeLeft(durationSeconds);
        setStatus('exam');
      }).catch(() => {
        setTimeLeft(durationSeconds);
        setStatus('exam');
      });
    }
  }, [testLoading, checkLoading, test, checkData]);

  // Fullscreen
  useEffect(() => {
    if (status !== 'exam') return;
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, [status]);

  // Fullscreen exit detection
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && status === 'exam' && !isCompletingRef.current) setShowTabWarning(true);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [status]);

  // Tab switch detection
  useEffect(() => {
    if (status !== 'exam') return;
    const handler = () => {
      if (document.hidden && !isCompletingRef.current) {
        setTabSwitchCount((c) => c + 1);
        setShowTabWarning(true);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [status]);

  const handleComplete = useCallback(async (timedOut = false) => {
    isCompletingRef.current = true; // block all tab/fullscreen warnings
    setShowTabWarning(false);
    setIsSubmitting(true);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    try {
      const answersPayload = Object.entries(answers).map(([qId, ans]) => ({
        questionId: Number(qId),
        answer: ans,
      }));
      await submitExam({
        endpoint: `/api/exam/${id}/submit`,
        body: { answers: answersPayload, assignedSet },
      }).unwrap();
    } catch (err) { /* fail silently */ }
    setIsSubmitting(false);
    if (timedOut) {
      setStatus('timeout');
    } else {
      setStatus('completed');
    }
  }, [id, submitExam, answers, assignedSet]);

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
    if (currentIndex < safeQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleComplete(false);
    }
  };

  const handleSkip = () => {
    if (currentIndex < safeQuestions.length - 1) setCurrentIndex((i) => i + 1);
  };

  if (testLoading || checkLoading || status === 'loading') {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">Loading exam...</span></div>;
  }

  if (!test || !test.questions?.length) {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">No questions found.</span></div>;
  }

  if (status === 'completed') return <CompletedScreen testId={id as string} />;

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8" style={{ color: '#6633FF' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm text-gray-500">Submitting your exam...</span>
      </div>
    );
  }

  const allQuestions: any[] = test.questions;
  const filteredQuestions = assignedSet && test.questionSet > 1
    ? allQuestions.filter((q) => q.setNumber === assignedSet)
    : allQuestions;
  const safeQuestions = filteredQuestions.length > 0 ? filteredQuestions : allQuestions;
  const currentQuestion = safeQuestions[currentIndex];
  const isLast = currentIndex === safeQuestions.length - 1;

  if (!currentQuestion) return null;

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">
            Question ({currentIndex + 1}/{safeQuestions.length})
          </span>
          {test.questionSet > 1 && (
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
          <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}>
            {formatTime(timeLeft)} left
          </span>
        )}
      </div>

      <ExamQuestion
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onAnswer={(ans: string | string[]) => handleAnswer(currentQuestion.id, ans)}
      />

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

      {status === 'timeout' && <TimeoutModal onBack={() => router.push('/dashboard')} />}
      {showTabWarning && !isSubmitting && (
        <TabSwitchWarning
          count={tabSwitchCount}
          onResume={() => {
            setShowTabWarning(false);
            document.documentElement.requestFullscreen?.().catch(() => {});
          }}
        />
      )}
    </div>
  );
}

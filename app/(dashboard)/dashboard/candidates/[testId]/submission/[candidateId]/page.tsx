'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAllQuery } from '@/lib/api/dynamicApi';
import { CheckCircle, XCircle, ArrowLeft, MinusCircle } from 'lucide-react';

export default function SubmissionDetailPage() {
  const { testId, candidateId } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetAllQuery(`/api/exam/${testId}/candidates/${candidateId}`);

  if (isLoading) {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">Loading submission...</span></div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">Submission not found.</span></div>;
  }

  const { graded = [], score, totalPoints, candidateEmail } = data as any;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Submission Review</h1>
          <p className="text-sm text-gray-400">{candidateEmail}</p>
        </div>
      </div>

      {/* Score */}
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">Total Score</p>
          <p className="text-3xl font-bold" style={{ color: '#6633FF' }}>
            {score} <span className="text-lg text-gray-400">/ {totalPoints}</span>
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle size={16} />
            <span>{graded.filter((q: any) => q.isCorrect === true).length} correct</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-500">
            <XCircle size={16} />
            <span>{graded.filter((q: any) => q.isCorrect === false).length} wrong</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <MinusCircle size={16} />
            <span>{graded.filter((q: any) => q.isCorrect === null).length} text</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {graded.map((q: any, i: number) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="text-sm font-semibold text-gray-800">Q{i + 1}. {q.text}</p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {q.isCorrect === true && <CheckCircle size={18} className="text-green-500" />}
                {q.isCorrect === false && <XCircle size={18} className="text-red-500" />}
                {q.isCorrect === null && <MinusCircle size={18} className="text-gray-400" />}
                <span className="text-xs text-gray-400">{q.points} pt</span>
              </div>
            </div>

            {(q.type === 'MCQ' || q.type === 'Radio') && q.options && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt: any, idx: number) => {
                  const submittedIndices = q.submittedAnswer
                    ? (Array.isArray(q.submittedAnswer) ? q.submittedAnswer : [q.submittedAnswer]).map(Number)
                    : [];
                  const wasSelected = submittedIndices.includes(idx);
                  const isCorrectOption = opt.correct;

                  let bg = 'border-gray-200';
                  if (isCorrectOption) bg = 'border-green-400 bg-green-50';
                  else if (wasSelected && !isCorrectOption) bg = 'border-red-400 bg-red-50';

                  return (
                    <div key={idx} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm ${bg}`}>
                      {isCorrectOption
                        ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                        : wasSelected
                        ? <XCircle size={15} className="text-red-500 flex-shrink-0" />
                        : <span className="w-4 h-4 flex-shrink-0" />
                      }
                      <span className={isCorrectOption ? 'text-green-700 font-medium' : wasSelected ? 'text-red-700' : 'text-gray-600'}>
                        {opt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === 'Text' && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs text-gray-400 mb-1">Candidate's answer:</p>
                <p className="text-sm text-gray-700">{q.submittedAnswer || <span className="text-gray-400 italic">No answer provided</span>}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

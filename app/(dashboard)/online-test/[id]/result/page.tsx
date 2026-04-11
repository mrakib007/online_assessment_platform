'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAllQuery } from '@/lib/api/dynamicApi';
import { CheckCircle, XCircle, ArrowLeft, MinusCircle } from 'lucide-react';

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetAllQuery(`/api/exam/${id}/result`);

  if (isLoading) {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">Loading results...</span></div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center py-32"><span className="text-sm text-gray-400">No result found.</span></div>;
  }

  const { graded = [], score, totalPoints } = data as any;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-8 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-gray-400 font-medium">Your Score</p>
        <p className="text-4xl font-bold" style={{ color: '#6633FF' }}>{score} <span className="text-xl text-gray-400">/ {totalPoints}</span></p>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1.5 text-green-600"><CheckCircle size={14} /> {graded.filter((q: any) => q.isCorrect === true).length} correct</span>
          <span className="flex items-center gap-1.5 text-red-500"><XCircle size={14} /> {graded.filter((q: any) => q.isCorrect === false).length} wrong</span>
          <span className="flex items-center gap-1.5 text-gray-400"><MinusCircle size={14} /> {graded.filter((q: any) => q.isCorrect === null).length} skipped</span>
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

            {/* Options for MCQ/Radio */}
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

            {/* Text answer */}
            {q.type === 'Text' && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs text-gray-400 mb-1">Your answer:</p>
                <p className="text-sm text-gray-700">{q.submittedAnswer || <span className="text-gray-400 italic">No answer provided</span>}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

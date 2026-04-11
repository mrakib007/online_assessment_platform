'use client';

import { useState } from 'react';
import { Clock, FileText, XCircle, Users, CalendarClock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useGetAllQuery, useDeleteMutation } from '@/lib/api/dynamicApi';
import ConfirmModal from '@/components/ui/ConfirmModal';

export interface TestCardProps {
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
  duration?: string | null;
  userRole?: string;
}

function CandidateActions({ id }: { id: string }) {
  const { data } = useGetAllQuery(`/api/exam/${id}/check`);
  const submitted = (data as any)?.submitted;

  if (submitted) {
    return (
      <Link
        href={`/online-test/${id}/result`}
        className="text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#6633FF' }}
      >
        View Result
      </Link>
    );
  }

  return (
    <Link
      href={`/online-test/${id}/start`}
      className="text-xs font-semibold px-4 py-2 rounded-lg border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
    >
      Start
    </Link>
  );
}

export default function TestCard({ id, title, candidates, questionSet, examSlots, duration, userRole }: TestCardProps) {
  const isEmployer = userRole === 'employer';
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTest, { isLoading: isDeleting }] = useDeleteMutation();

  const handleDelete = async () => {
    try {
      await deleteTest({ endpoint: '/api/tests', id }).unwrap();
      setShowConfirm(false);
    } catch {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <ConfirmModal
        open={showConfirm}
        title="Delete Test"
        message={`Are you sure you want to delete "${title}"? This will permanently remove the test and all its questions.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        isLoading={isDeleting}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>
          {isEmployer && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete test"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-5 text-xs text-gray-500 flex-wrap">
          {isEmployer ? (
            <>
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-gray-400" />
                Candidates: <span className="text-gray-700 font-medium">{candidates?.toLocaleString() ?? 'Not Set'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FileText size={13} className="text-gray-400" />
                Question Set: <span className="text-gray-700 font-medium">{questionSet ?? 'Not Set'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock size={13} className="text-gray-400" />
                Exam Slots: <span className="text-gray-700 font-medium">{examSlots ?? 'Not Set'}</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-gray-400" />
                Duration: <span className="text-gray-700 font-medium">{duration ?? 'N/A'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FileText size={13} className="text-gray-400" />
                Question: <span className="text-gray-700 font-medium">{questionSet ?? 'N/A'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle size={13} className="text-gray-400" />
                Negative Marking: <span className="text-gray-700 font-medium">-0.25/wrong</span>
              </span>
            </>
          )}
        </div>

        <div>
          {isEmployer ? (
            <Link
              href={`/dashboard/candidates/${id}`}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
            >
              View Candidates
            </Link>
          ) : (
            <CandidateActions id={id} />
          )}
        </div>
      </div>
    </>
  );
}

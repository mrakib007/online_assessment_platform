import { Clock, FileText, XCircle, Users, CalendarClock } from 'lucide-react';
import Link from 'next/link';

export interface TestCardProps {
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
  duration?: string | null;
  userRole?: string;
}

export default function TestCard({ id, title, candidates, questionSet, examSlots, duration, userRole }: TestCardProps) {
  const isEmployer = userRole === 'employer';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>

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
          <Link
            href={`/online-test/${id}/start`}
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
          >
            Start
          </Link>
        )}
      </div>
    </div>
  );
}

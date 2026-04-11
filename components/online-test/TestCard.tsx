import { Users, FileText, CalendarClock } from 'lucide-react';
import Link from 'next/link';

export interface TestCardProps {
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
  userRole?: string;
}

export default function TestCard({ id, title, candidates, questionSet, examSlots, userRole }: TestCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>
      <div className="flex items-center gap-5 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-gray-400" />
          Candidates: <span className="text-gray-700 font-medium">{candidates?.toLocaleString() ?? 'Not Set'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <FileText size={14} className="text-gray-400" />
          Question Set: <span className="text-gray-700 font-medium">{questionSet ?? 'Not Set'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock size={14} className="text-gray-400" />
          Exam Slots: <span className="text-gray-700 font-medium">{examSlots ?? 'Not Set'}</span>
        </span>
      </div>
      <div>
        {userRole === 'employer' ? (
          <Link
            href={`/dashboard/candidates/${id}`}
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
          >
            View Candidates
          </Link>
        ) : (
          <Link
            href={`/online-test/${id}/start`}
            className="text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6633FF' }}
          >
            Start
          </Link>
        )}
      </div>
    </div>
  );
}

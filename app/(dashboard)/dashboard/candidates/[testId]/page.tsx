'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAllQuery, useGetByIdQuery } from '@/lib/api/dynamicApi';
import { Users, ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CandidatesPage() {
  const { testId } = useParams();
  const router = useRouter();

  const { data: test } = useGetByIdQuery({ endpoint: '/api/tests', id: testId as string });
  const { data: candidates = [], isLoading } = useGetAllQuery(`/api/exam/${testId}/candidates`);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{test?.title ?? 'Test'}</h1>
          <p className="text-sm text-gray-400">Candidates who participated</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6633FF15' }}>
          <Users size={18} style={{ color: '#6633FF' }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{(candidates as any[]).length}</p>
          <p className="text-xs text-gray-400">Total Participants</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm text-gray-400">Loading candidates...</span>
          </div>
        ) : (candidates as any[]).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={40} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-500">No candidates yet</p>
            <p className="text-xs text-gray-400">Candidates will appear here once they take the exam</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Submitted At</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Submission</th>
              </tr>
            </thead>
            <tbody>
              {(candidates as any[]).map((c, i) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.candidateEmail}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" />
                      {formatDate(c.submittedAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">Completed</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/candidates/${testId}/submission/${c.candidateId}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#6633FF] hover:underline"
                    >
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

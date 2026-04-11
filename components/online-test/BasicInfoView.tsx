'use client';

import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface BasicInfoViewProps {
  onEdit: () => void;
  onContinue: () => void;
}

export default function BasicInfoView({ onEdit, onContinue }: BasicInfoViewProps) {
  const router = useRouter();
  const data = useSelector((state: RootState) => state.testCreation.basicInfo);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-7 max-w-[960px] w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Basic Information</h3>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-[#6633FF] hover:opacity-80 transition-opacity"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Online Test Title</p>
            <p className="text-sm font-semibold text-gray-800">{data.title || '—'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Candidates</p>
              <p className="text-sm font-semibold text-gray-800">
                {data.candidates ? Number(data.candidates).toLocaleString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Question Sets</p>
              <p className="text-sm font-semibold text-gray-800">{data.questionSet || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Question Type</p>
              <p className="text-sm font-semibold text-gray-800">{data.questionType || '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Negative Marking</p>
            <p className="text-sm font-semibold text-gray-800">
              {data.negativeMarkingEnabled ? `Enabled — ${data.negativeMarkingPenalty}% penalty` : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Time Slots</p>
            {data.timeSlots.length === 0 ? (
              <p className="text-sm text-gray-400">No slots defined (open access)</p>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                {data.timeSlots.map((s) => (
                  <p key={s.id} className="text-sm font-semibold text-gray-800">
                    {new Date(s.startTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    {' → '}
                    {new Date(s.endTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    <span className="text-xs text-gray-400 ml-2">({s.maxCandidates} max)</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between max-w-[960px] w-full mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onContinue}
          className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}
        >
          Save & Continue
        </button>
      </div>
    </>
  );
}

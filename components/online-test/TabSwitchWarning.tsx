'use client';

import { AlertTriangle } from 'lucide-react';

interface TabSwitchWarningProps {
  count: number;
  onResume: () => void;
}

export default function TabSwitchWarning({ count, onResume }: TabSwitchWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Warning!</h2>
        <p className="text-sm text-gray-500">
          You have switched tabs or exited fullscreen. This activity is being recorded.
        </p>
        <p className="text-xs font-semibold text-red-500">
          Tab switch count: {count}
        </p>
        <button
          onClick={onResume}
          className="mt-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}
        >
          Resume Exam
        </button>
      </div>
    </div>
  );
}

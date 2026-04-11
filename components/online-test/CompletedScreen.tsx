'use client';

import { BadgeCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompletedScreenProps {
  testId: string;
}

export default function CompletedScreen({ testId }: CompletedScreenProps) {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-16 flex flex-col items-center gap-4 text-center">
        <BadgeCheck size={80} color="#6633FF" strokeWidth={1.5} />
        <h2 className="text-xl font-bold text-gray-800">Test Completed</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Congratulations! You have completed your exam. Thank you for participating.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push(`/online-test/${testId}/result`)}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 transition-colors"
          >
            View My Result
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6633FF' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

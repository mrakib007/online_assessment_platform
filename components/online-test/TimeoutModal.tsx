'use client';

import Image from 'next/image';

interface TimeoutModalProps {
  onBack: () => void;
}

export default function TimeoutModal({ onBack }: TimeoutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-4 text-center">
        <Image src="/timeout.png" alt="Timeout" width={72} height={72} className="object-contain" />
        <h2 className="text-lg font-bold text-gray-800">Timeout!</h2>
        <p className="text-sm text-gray-500">
          Your exam time has been finished. Thank you for participating.
        </p>
        <button
          onClick={onBack}
          className="mt-2 px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

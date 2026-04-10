import Link from 'next/link';
import StepIndicator from './StepIndicator';

interface StepperBarProps {
  currentStep: number;
}

export default function StepperBar({ currentStep }: StepperBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-base font-bold text-gray-800 mr-4">Manage Online Test</h2>
        <StepIndicator step={1} current={currentStep} label="Basic Info" />
        <div className="w-16 h-px bg-gray-300" />
        <StepIndicator step={2} current={currentStep} label="Questions Sets" />
      </div>
      <Link
        href="/dashboard"
        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

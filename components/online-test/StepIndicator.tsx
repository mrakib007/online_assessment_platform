interface StepIndicatorProps {
  step: number;
  current: number;
  label: string;
}

export default function StepIndicator({ step, current, label }: StepIndicatorProps) {
  const active = current >= step;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          active ? 'bg-[#6633FF] text-white' : 'bg-gray-200 text-gray-400'
        }`}
      >
        {step}
      </span>
      <span className={`text-sm font-medium ${active ? 'text-[#6633FF]' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

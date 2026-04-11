'use client';

interface Props {
  enabled: boolean;
  penalty: number;
  onEnabledChange: (v: boolean) => void;
  onPenaltyChange: (v: number) => void;
}

export default function NegativeMarkingConfig({ enabled, penalty, onEnabledChange, onPenaltyChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-700">Negative Marking</span>
          <p className="text-xs text-gray-400 mt-0.5">Deduct points for incorrect answers</p>
        </div>
        {/* Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onEnabledChange(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6633FF]/30 ${
            enabled ? 'bg-[#6633FF]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="flex flex-col gap-2 pl-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Penalty percentage</span>
            <span className="font-semibold text-[#6633FF]">{penalty}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={penalty}
            onChange={(e) => onPenaltyChange(Number(e.target.value))}
            className="w-full accent-[#6633FF]"
          />
          <p className="text-xs text-gray-400">
            Example: wrong answer on a 4-point question = −{((4 * penalty) / 100).toFixed(2)} pts
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

interface Option {
  label: string;
  correct: boolean;
}

interface Question {
  id: number;
  type: string;
  text: string;
  points: number;
  options?: Option[];
}

interface ExamQuestionProps {
  question: Question;
  answer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
}

export default function ExamQuestion({ question, answer, onAnswer }: ExamQuestionProps) {
  // Use index-based selection to avoid duplicate label issues
  const selectedIndices: number[] = Array.isArray(answer)
    ? (answer as string[]).map(Number).filter((n) => !isNaN(n))
    : typeof answer === 'string' && answer !== ''
    ? [Number(answer)]
    : [];

  const toggleCheckbox = (index: number) => {
    const updated = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];
    onAnswer(updated.map(String));
  };

  const selectRadio = (index: number) => {
    onAnswer([String(index)]);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-8 py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">
          Q{question.id}. {question.text}
        </p>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-4">{question.points} pt</span>
      </div>

      {/* Radio — single correct answer */}
      {question.type === 'Radio' && question.options && (
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isSelected = selectedIndices.includes(i);
            return (
              <label
                key={i}
                onClick={() => selectRadio(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected ? 'border-[#6633FF] bg-[#6633FF]/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-[#6633FF]' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#6633FF]" />}
                </span>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* MCQ — multiple correct answers */}
      {question.type === 'MCQ' && question.options && (
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isChecked = selectedIndices.includes(i);
            return (
              <label
                key={i}
                onClick={() => toggleCheckbox(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  isChecked ? 'border-[#6633FF] bg-[#6633FF]/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isChecked ? 'border-[#6633FF] bg-[#6633FF]' : 'border-gray-300'
                }`}>
                  {isChecked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Text answer */}
      {question.type === 'Text' && (
        <textarea
          rows={5}
          placeholder="Type your answer here..."
          value={typeof answer === 'string' ? answer : ''}
          onChange={(e) => onAnswer(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 resize-none placeholder:text-gray-300 text-gray-700"
        />
      )}
    </div>
  );
}

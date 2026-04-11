import { Question } from './QuestionsStep';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

export default function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Question {question.id}</span>
        <span className="text-xs text-gray-400">
          {question.type} &nbsp; {question.points} pt
        </span>
      </div>

      <p className="text-sm font-medium mb-3 px-3 py-2 rounded border border-transparent text-gray-800">
        {question.text}
      </p>

      {question.options && question.options.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                opt.correct ? 'bg-gray-50' : ''
              }`}
            >
              <span className="text-gray-700">{opt.label}</span>
              {opt.correct && (
                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => onEdit(question)}
          className="text-sm text-[#6633FF] hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(question.id)}
          className="text-sm text-red-500 hover:underline"
        >
          Remove From Exam
        </button>
      </div>
    </div>
  );
}

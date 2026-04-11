'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Bold, Italic, List } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

type QuestionType = 'MCQ' | 'Radio' | 'Text';

interface Option {
  text: string;
  correct: boolean;
}

interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: { type: QuestionType; score: number; options: Option[]; questionText: string }) => void;
  questionNumber?: number;
  editData?: { type: string; points: number; text: string; options?: { label: string; correct: boolean }[] } | null;
}

const typeOptions: QuestionType[] = ['MCQ', 'Radio', 'Text'];

function MiniToolbar() {
  return (
    <div className="flex items-center gap-1 mb-1">
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><Bold size={13} /></button>
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><Italic size={13} /></button>
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><List size={13} /></button>
    </div>
  );
}

const defaultOptions = (): Option[] => [
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
];

export default function AddQuestionModal({ open, onClose, onSave, questionNumber = 1, editData }: AddQuestionModalProps) {
  const [type, setType] = useState<QuestionType>('MCQ');
  const [score, setScore] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Option[]>(defaultOptions());
  const [errors, setErrors] = useState<{ question?: string; options?: string; correct?: string }>({});

  useEffect(() => {
    if (open && editData) {
      setType(editData.type as QuestionType);
      setScore(editData.points);
      setQuestionText(editData.text);
      setOptions(
        editData.options?.map((o) => ({ text: o.label, correct: o.correct })) ||
        defaultOptions()
      );
    } else if (open && !editData) {
      setType('MCQ');
      setScore(1);
      setQuestionText('');
      setOptions(defaultOptions());
      setErrors({});
    }
  }, [open, editData]);

  if (!open) return null;

  const updateOptionText = (i: number, val: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, text: val } : o)));
  };

  const toggleCorrect = (i: number) => {
    setOptions((prev) =>
      prev.map((o, idx) => {
        if (type === 'Radio') {
          // Radio: only one correct answer
          return { ...o, correct: idx === i };
        }
        // MCQ: multiple correct answers allowed
        return idx === i ? { ...o, correct: !o.correct } : o;
      })
    );
  };

  const removeOption = (i: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addOption = () => setOptions((prev) => [...prev, { text: '', correct: false }]);

  const handleSave = (andMore = false) => {
    const newErrors: typeof errors = {};

    if (!questionText.trim()) {
      newErrors.question = 'Question text is required.';
    }

    if (type === 'MCQ' || type === 'Radio') {
      const emptyOption = options.some((o) => !o.text.trim());
      if (emptyOption) {
        newErrors.options = 'All option fields must be filled in.';
      }
      const hasCorrect = options.some((o) => o.correct);
      if (!hasCorrect) {
        newErrors.correct = 'Please mark at least one correct answer.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({ type, score, options, questionText });
    if (!andMore) {
      onClose();
    } else {
      setQuestionText('');
      setOptions(defaultOptions());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Question {questionNumber}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Score</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setScore((s) => Math.max(1, s - 1))}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">−</button>
                <span className="px-2 text-gray-700 font-medium">{score}</span>
                <button type="button" onClick={() => setScore((s) => s + 1)}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">+</button>
              </div>
            </div>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#6633FF] bg-white text-gray-700"
              >
                {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {/* Question text */}
          <div className={`border rounded-lg p-3 ${errors.question ? 'border-red-400' : 'border-gray-200'}`}>
            <MiniToolbar />
            <textarea
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => { setQuestionText(e.target.value); setErrors((p) => ({ ...p, question: undefined })); }}
              rows={2}
              className="w-full text-sm outline-none resize-none text-gray-700 placeholder:text-gray-300"
            />
          </div>
          {errors.question && <p className="text-xs text-red-500 -mt-2">{errors.question}</p>}

          {/* Options — MCQ & Radio */}
          {(type === 'MCQ' || type === 'Radio') && (
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 transition-colors ${
                    opt.correct ? 'border-[#6633FF] bg-[#6633FF]/5' : 'border-gray-200'
                  }`}
                >
                  {/* Clickable correct answer selector */}
                  <button
                    type="button"
                    onClick={() => toggleCorrect(i)}
                    className="flex-shrink-0 focus:outline-none"
                    title="Mark as correct answer"
                  >
                    {type === 'MCQ' ? (
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        opt.correct ? 'border-[#6633FF] bg-[#6633FF]' : 'border-gray-300'
                      }`}>
                        {opt.correct && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        opt.correct ? 'border-[#6633FF]' : 'border-gray-300'
                      }`}>
                        {opt.correct && (
                          <span className="w-2 h-2 rounded-full bg-[#6633FF]" />
                        )}
                      </span>
                    )}
                  </button>

                  <input
                    type="text"
                    placeholder="Enter option text"
                    value={opt.text}
                    onChange={(e) => { updateOptionText(i, e.target.value); setErrors((p) => ({ ...p, options: undefined })); }}
                    className={`flex-1 text-sm outline-none bg-transparent placeholder:text-gray-300 ${
                      errors.options && !opt.text.trim() ? 'text-red-500 placeholder:text-red-300' : 'text-gray-700'
                    }`}
                  />

                  <div className="flex items-center gap-1 text-gray-300">
                    <button type="button" className="hover:text-gray-500"><Bold size={12} /></button>
                    <button type="button" className="hover:text-gray-500"><Italic size={12} /></button>
                    <button type="button" onClick={() => removeOption(i)} className="hover:text-red-400 ml-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-1">
                {type === 'Radio' ? 'Click the circle to select the correct answer' : 'Click the checkbox to mark correct answers'}
              </p>
              {errors.options && <p className="text-xs text-red-500">{errors.options}</p>}
              {errors.correct && <p className="text-xs text-red-500">{errors.correct}</p>}
              <button type="button" onClick={addOption} className="text-xs text-[#6633FF] hover:underline text-left">
                + Another option
              </button>
            </div>
          )}

          {/* Text type */}
          {type === 'Text' && (
            <div className="border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">Candidates will type their answer in a text field.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => handleSave(false)}
            className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-6 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6633FF' }}
          >
            Save & Add More
          </button>
        </div>
      </div>
    </div>
  );
}

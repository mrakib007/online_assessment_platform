'use client';

import { useState } from 'react';
import { X, Trash2, Bold, Italic, List } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

type QuestionType = 'MCQ' | 'Radio' | 'Text';

interface Option { text: string }

interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: { type: QuestionType; score: number; options: Option[]; questionText: string }) => void;
  questionNumber?: number;
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

export default function AddQuestionModal({ open, onClose, onSave, questionNumber = 1 }: AddQuestionModalProps) {
  const [type, setType] = useState<QuestionType>('MCQ');
  const [score, setScore] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { text: '' }, { text: '' }, { text: '' }, { text: '' },
  ]);

  if (!open) return null;

  const updateOption = (i: number, val: string) => {
    setOptions(prev => prev.map((o, idx) => idx === i ? { text: val } : o));
  };

  const removeOption = (i: number) => {
    setOptions(prev => prev.filter((_, idx) => idx !== i));
  };

  const addOption = () => setOptions(prev => [...prev, { text: '' }]);

  const handleSave = (andMore = false) => {
    onSave({ type, score, options, questionText });
    if (!andMore) onClose();
    else {
      setQuestionText('');
      setOptions([{ text: '' }, { text: '' }, { text: '' }, { text: '' }]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Question {questionNumber}</span>
          <div className="flex items-center gap-3">
            {/* Score */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Score</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setScore(s => Math.max(1, s - 1))}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">−</button>
                <span className="px-2 text-gray-700 font-medium">{score}</span>
                <button type="button" onClick={() => setScore(s => s + 1)}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">+</button>
              </div>
            </div>
            {/* Type selector */}
            <div className="relative">
              <select
                value={type}
                onChange={e => setType(e.target.value as QuestionType)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#6633FF] bg-white text-gray-700"
              >
                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
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
          {/* Question text area */}
          <div className="border border-gray-200 rounded-lg p-3">
            <MiniToolbar />
            <textarea
              placeholder="Enter your question here..."
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              rows={2}
              className="w-full text-sm outline-none resize-none text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Options — MCQ & Radio */}
          {(type === 'MCQ' || type === 'Radio') && (
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                  {type === 'MCQ' ? (
                    <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                  )}
                  <input
                    type="text"
                    placeholder="Normal text"
                    value={opt.text}
                    onChange={e => updateOption(i, e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-300"
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
              <button type="button" onClick={addOption}
                className="text-xs text-[#6633FF] hover:underline text-left mt-1">
                + Another option
              </button>
            </div>
          )}

          {/* Text type — just a text area answer box */}
          {type === 'Text' && (
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Normal text"
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-300"
              />
              <div className="flex items-center gap-1 text-gray-300">
                <button type="button" className="hover:text-gray-500"><Bold size={12} /></button>
                <button type="button" className="hover:text-gray-500"><Italic size={12} /></button>
                <button type="button" className="hover:text-gray-500"><List size={12} /></button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button onClick={() => handleSave(false)}
            className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Save
          </button>
          <button onClick={() => handleSave(true)}
            className="px-6 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6633FF' }}>
            Save & Add More
          </button>
        </div>
      </div>
    </div>
  );
}

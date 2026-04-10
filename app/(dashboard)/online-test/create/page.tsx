'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Pencil } from 'lucide-react';
import AddQuestionModal from '@/components/online-test/AddQuestionModal';

type Step = 'form' | 'view' | 'questions';

interface BasicInfo {
  title: string;
  candidates: string;
  slots: string;
  questionSet: string;
  questionType: string;
  startTime: string;
  endTime: string;
  duration: string;
}

function StepIndicator({ step, current }: { step: number; current: number }) {
  const active = current >= step;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-[#6633FF] text-white' : 'bg-gray-200 text-gray-400'}`}>
        {step}
      </span>
      <span className={`text-sm font-medium ${active ? 'text-[#6633FF]' : 'text-gray-400'}`}>
        {step === 1 ? 'Basic Info' : 'Questions Sets'}
      </span>
    </div>
  );
}

function StepperBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-base font-bold text-gray-800 mr-4">Manage Online Test</h2>
        <StepIndicator step={1} current={currentStep} />
        <div className="w-16 h-px bg-gray-300" />
        <StepIndicator step={2} current={currentStep} />
      </div>
      <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
        Back to Dashboard
      </Link>
    </div>
  );
}

// ── Step 1: Form ──────────────────────────────────────────────────────────────
function BasicInfoForm({ onSave }: { onSave: (data: BasicInfo) => void }) {
  const router = useRouter();
  const [form, setForm] = useState<BasicInfo>({
    title: '', candidates: '', slots: '', questionSet: '',
    questionType: '', startTime: '', endTime: '', duration: '',
  });

  const set = (k: keyof BasicInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...form, [k]: e.target.value };
    if (k === 'startTime' || k === 'endTime') {
      const start = k === 'startTime' ? e.target.value : form.startTime;
      const end = k === 'endTime' ? e.target.value : form.endTime;
      if (start && end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const diff = (eh * 60 + em) - (sh * 60 + sm);
        updated.duration = diff > 0 ? `${diff} min` : '';
      }
    }
    setForm(updated);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-7 max-w-[960px] w-full mx-auto">
        <h3 className="text-base font-bold text-gray-800 mb-6">Basic Information</h3>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Online Test Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter online test title" value={form.title} onChange={set('title')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 placeholder:text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Total Candidates <span className="text-red-500">*</span></label>
              <input type="number" placeholder="Enter total candidates" value={form.candidates} onChange={set('candidates')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 placeholder:text-gray-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Total Slots <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.slots} onChange={set('slots')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 appearance-none bg-white text-gray-700">
                  <option value="">Select total slots</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Total Question Set <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.questionSet} onChange={set('questionSet')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 appearance-none bg-white text-gray-700">
                  <option value="">Select total question set</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Question Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.questionType} onChange={set('questionType')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 appearance-none bg-white text-gray-700">
                  <option value="">Select question type</option>
                  <option value="MCQ">MCQ</option>
                  <option value="Checkbox">Checkbox</option>
                  <option value="Text">Text</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Start Time <span className="text-red-500">*</span></label>
              <input type="time" value={form.startTime} onChange={set('startTime')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 text-gray-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">End Time <span className="text-red-500">*</span></label>
              <input type="time" value={form.endTime} onChange={set('endTime')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 text-gray-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <input type="text" readOnly value={form.duration} placeholder="Duration Time"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-gray-50 text-gray-500 placeholder:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between max-w-[960px] w-full mx-auto">
        <button onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={() => onSave(form)}
          className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}>
          Save & Continue
        </button>
      </div>
    </>
  );
}

// ── Step 1: View mode ─────────────────────────────────────────────────────────
function BasicInfoView({ data, onEdit, onContinue }: { data: BasicInfo; onEdit: () => void; onContinue: () => void }) {
  const router = useRouter();
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-7 max-w-[960px] w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Basic Information</h3>
          <button onClick={onEdit} className="flex items-center gap-1.5 text-sm text-[#6633FF] hover:opacity-80 transition-opacity">
            <Pencil size={14} /> Edit
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Online Test Title</p>
            <p className="text-sm font-semibold text-gray-800">{data.title || '—'}</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Candidates</p>
              <p className="text-sm font-semibold text-gray-800">{data.candidates ? Number(data.candidates).toLocaleString() : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Slots</p>
              <p className="text-sm font-semibold text-gray-800">{data.slots || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Question Set</p>
              <p className="text-sm font-semibold text-gray-800">{data.questionSet || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Duration Per Slots (Minutes)</p>
              <p className="text-sm font-semibold text-gray-800">{data.duration || '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Question Type</p>
            <p className="text-sm font-semibold text-gray-800">{data.questionType || '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between max-w-[960px] w-full mx-auto">
        <button onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onContinue}
          className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#6633FF' }}>
          Save & Continue
        </button>
      </div>
    </>
  );
}

// ── Step 2: Questions ─────────────────────────────────────────────────────────
type QuestionType = 'MCQ' | 'Checkbox' | 'Text';

interface Option { label: string; correct: boolean }
interface Question {
  id: number;
  type: QuestionType;
  points: number;
  text: string;
  options?: Option[];
}

const mockQuestions: Question[] = [
  {
    id: 1, type: 'MCQ', points: 1,
    text: 'What is the Capital of Bangladesh?',
    options: [
      { label: 'A. Dhaka', correct: true },
      { label: 'B. Chattogram', correct: false },
      { label: 'C. Rajshahi', correct: false },
      { label: 'D. Barishal', correct: false },
    ],
  },
  {
    id: 2, type: 'Checkbox', points: 1,
    text: 'What is the Capital of Bangladesh?',
    options: [
      { label: 'A. Dhaka', correct: true },
      { label: 'B. Chattogram', correct: false },
      { label: 'C. Rajshahi', correct: true },
      { label: 'D. Barishal', correct: false },
    ],
  },
  {
    id: 3, type: 'Text', points: 5,
    text: 'Write a brief of your capital city',
  },
];

function QuestionCard({ q }: { q: Question }) {
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Question {q.id}</span>
        <span className="text-xs text-gray-400">{q.type} &nbsp; {q.points} pt</span>
      </div>
      <p className={`text-sm font-medium mb-3 px-3 py-2 rounded border ${q.id === 1 ? 'border-red-400 text-gray-800' : 'border-transparent text-gray-800'}`}>
        {q.text}
      </p>
      {q.options && (
        <div className="flex flex-col gap-1.5 mb-3">
          {q.options.map((opt, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${opt.correct ? 'bg-gray-50' : ''}`}>
              <span className="text-gray-700">{opt.label}</span>
              {opt.correct && (
                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {q.type === 'Text' && q.text === 'Write a brief of your capital city' && (
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus...
        </p>
      )}
      <div className="flex items-center justify-between mt-1">
        <button className="text-sm text-[#6633FF] hover:underline">Edit</button>
        <button className="text-sm text-red-500 hover:underline">Remove From Exam</button>
      </div>
    </div>
  );
}

function QuestionsStep({ hasQuestions }: { hasQuestions: boolean }) {
  const [questions, setQuestions] = useState<Question[]>(hasQuestions ? mockQuestions : []);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 max-w-[960px] w-full mx-auto">
      <AddQuestionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        questionNumber={questions.length + 1}
        onSave={(q) => {
          setQuestions(prev => [...prev, {
            id: prev.length + 1,
            type: q.type as 'MCQ' | 'Checkbox' | 'Text',
            points: q.score,
            text: q.questionText || 'New Question',
            options: q.options?.map(o => ({ label: o.text, correct: false })),
          }]);
        }}
      />
      {questions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-8 py-2">
          {questions.map(q => <QuestionCard key={q.id} q={q} />)}
        </div>
      )}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#6633FF' }}
      >
        Add Question
      </button>
    </div>
  );
}

// ── Root page ─────────────────────────────────────────────────────────────────
export default function CreateOnlineTestPage() {
  const [step, setStep] = useState<Step>('form');
  const [savedData, setSavedData] = useState<BasicInfo | null>(null);

  const currentStep = step === 'form' || step === 'view' ? 1 : 2;

  return (
    <div className="flex flex-col gap-6">
      <StepperBar currentStep={currentStep} />

      {step === 'form' && (
        <BasicInfoForm onSave={(data) => { setSavedData(data); setStep('view'); }} />
      )}
      {step === 'view' && savedData && (
        <BasicInfoView data={savedData} onEdit={() => setStep('form')} onContinue={() => setStep('questions')} />
      )}
      {step === 'questions' && (
        <QuestionsStep hasQuestions={false} />
      )}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { X, Trash2, ChevronDown } from 'lucide-react';

type QuestionType = 'MCQ' | 'Radio' | 'Text';

interface Option {
  text: string;
  correct: boolean;
}

interface FormValues {
  type: QuestionType;
  score: number;
  questionText: string;
  options: Option[];
}

interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: { type: QuestionType; score: number; options: Option[]; questionText: string }) => void;
  questionNumber?: number;
  editData?: { type: string; points: number; text: string; options?: { label: string; correct: boolean }[] } | null;
}

const defaultOptions = (): Option[] => [
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
];

const buildSchema = (type: QuestionType) =>
  Yup.object({
    questionText: Yup.string().trim().required('Question text is required'),
    score: Yup.number().min(1, 'Score must be at least 1').required(),
    options: type === 'Text'
      ? Yup.array()
      : Yup.array()
          .of(
            Yup.object({
              text: Yup.string().trim().required('Option text is required'),
              correct: Yup.boolean(),
            })
          )
          .test('has-correct', 'Please mark at least one correct answer', (opts) =>
            (opts ?? []).some((o) => o.correct)
          ),
  });

function MiniToolbar() {
  return (
    <div className="flex items-center gap-1 mb-1">
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><Bold size={13} /></button>
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><Italic size={13} /></button>
      <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-400"><List size={13} /></button>
    </div>
  );
}

export default function AddQuestionModal({ open, onClose, onSave, questionNumber = 1, editData }: AddQuestionModalProps) {
  const initialValues: FormValues = {
    type: (editData?.type as QuestionType) || 'MCQ',
    score: editData?.points || 1,
    questionText: editData?.text || '',
    options: editData?.options?.map((o) => ({ text: o.label, correct: o.correct })) || defaultOptions(),
  };

  const formik = useFormik<FormValues>({
    initialValues,
    enableReinitialize: true,
    // No validationSchema prop — use validate only so it reacts to type changes
    validate: (values) => {
      const errors: any = {};
      if (!values.questionText.trim()) {
        errors.questionText = 'Question text is required';
      }
      if (values.type === 'MCQ' || values.type === 'Radio') {
        const emptyOpt = values.options.findIndex((o) => !o.text.trim());
        if (emptyOpt !== -1) {
          if (!errors.options) errors.options = [];
          errors.options[emptyOpt] = { text: 'Option text is required' };
        }
        if (!values.options.some((o) => o.correct)) {
          errors.options = errors.options || 'Please mark at least one correct answer';
          if (typeof errors.options !== 'string') {
            errors._correct = 'Please mark at least one correct answer';
          }
        }
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      onSave({ type: values.type, score: values.score, options: values.options, questionText: values.questionText });
      onClose();
      resetForm();
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      formik.resetForm({
        values: {
          type: (editData?.type as QuestionType) || 'MCQ',
          score: editData?.points || 1,
          questionText: editData?.text || '',
          options: editData?.options?.map((o) => ({ text: o.label, correct: o.correct })) || defaultOptions(),
        },
      });
    }
  }, [open, editData]);

  const handleSaveAndMore = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        onSave({ type: formik.values.type, score: formik.values.score, options: formik.values.options, questionText: formik.values.questionText });
        formik.resetForm({
          values: { type: formik.values.type, score: 1, questionText: '', options: defaultOptions() },
        });
      } else {
        formik.setTouched({ questionText: true, options: formik.values.options.map(() => ({ text: true, correct: true })) as any });
      }
    });
  };

  const toggleCorrect = (i: number) => {
    const updated = formik.values.options.map((o, idx) => {
      if (formik.values.type === 'Radio') return { ...o, correct: idx === i };
      return idx === i ? { ...o, correct: !o.correct } : o;
    });
    formik.setFieldValue('options', updated);
  };

  if (!open) return null;

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;
  const optionsError = typeof errors.options === 'string' ? errors.options : null;

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
                <button type="button" onClick={() => setFieldValue('score', Math.max(1, values.score - 1))}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">−</button>
                <span className="px-2 text-gray-700 font-medium">{values.score}</span>
                <button type="button" onClick={() => setFieldValue('score', values.score + 1)}
                  className="px-2 py-1 hover:bg-gray-50 text-gray-500">+</button>
              </div>
            </div>
            {/* Type */}
            <div className="relative">
              <select
                value={values.type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  setFieldValue('type', newType);
                  // Only reset options when switching between Text and MCQ/Radio
                  if (newType === 'Text') {
                    setFieldValue('options', []);
                  } else if (values.type === 'Text') {
                    setFieldValue('options', defaultOptions());
                  }
                }}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#6633FF] bg-white text-gray-700"
              >
                {(['MCQ', 'Radio', 'Text'] as QuestionType[]).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <FormikProvider value={formik}>
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            {/* Question text */}
            <div>
              <div className={`border rounded-lg p-3 ${touched.questionText && errors.questionText ? 'border-red-400' : 'border-gray-200'}`}>
                <MiniToolbar />
                <textarea
                  name="questionText"
                  placeholder="Enter your question here..."
                  value={values.questionText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={2}
                  className="w-full text-sm outline-none resize-none text-gray-700 placeholder:text-gray-300"
                />
              </div>
              {touched.questionText && errors.questionText && (
                <p className="text-xs text-red-500 mt-1">{errors.questionText}</p>
              )}
            </div>

            {/* Options — MCQ & Radio */}
            {(values.type === 'MCQ' || values.type === 'Radio') && (
              <FieldArray name="options">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-2">
                    {values.options.map((opt, i) => {
                      const optTouched = (touched.options as any)?.[i]?.text;
                      const optError = (errors.options as any)?.[i]?.text;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 border rounded-lg px-3 py-2 transition-colors ${
                            opt.correct ? 'border-[#6633FF] bg-[#6633FF]/5' : optTouched && optError ? 'border-red-400' : 'border-gray-200'
                          }`}
                        >
                          <button type="button" onClick={() => toggleCorrect(i)} className="flex-shrink-0 focus:outline-none">
                            {values.type === 'MCQ' ? (
                              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${opt.correct ? 'border-[#6633FF] bg-[#6633FF]' : 'border-gray-300'}`}>
                                {opt.correct && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </span>
                            ) : (
                              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${opt.correct ? 'border-[#6633FF]' : 'border-gray-300'}`}>
                                {opt.correct && <span className="w-2 h-2 rounded-full bg-[#6633FF]" />}
                              </span>
                            )}
                          </button>
                          <input
                            type="text"
                            name={`options[${i}].text`}
                            placeholder="Enter option text"
                            value={opt.text}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-300 text-gray-700"
                          />
                          <div className="flex items-center gap-1 text-gray-300">
                            <button type="button" className="hover:text-gray-500"><Bold size={12} /></button>
                            <button type="button" className="hover:text-gray-500"><Italic size={12} /></button>
                            <button type="button" onClick={() => remove(i)} className="hover:text-red-400 ml-1"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Errors */}
                    {optionsError && <p className="text-xs text-red-500">{optionsError}</p>}
                    {(errors as any)._correct && <p className="text-xs text-red-500">{(errors as any)._correct}</p>}
                    {!optionsError && !(errors as any)._correct && values.options.some((_, i) => (touched.options as any)?.[i]?.text && (errors.options as any)?.[i]?.text) && (
                      <p className="text-xs text-red-500">All option fields must be filled in.</p>
                    )}

                    <p className="text-xs text-gray-400">
                      {values.type === 'Radio' ? 'Click the circle to select the correct answer' : 'Click the checkbox to mark correct answers'}
                    </p>
                    <button type="button" onClick={() => push({ text: '', correct: false })} className="text-xs text-[#6633FF] hover:underline text-left">
                      + Another option
                    </button>
                  </div>
                )}
              </FieldArray>
            )}

            {/* Text type */}
            {values.type === 'Text' && (
              <div className="border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">Candidates will type their answer in a text field.</p>
              </div>
            )}
          </div>
        </FormikProvider>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndMore}
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

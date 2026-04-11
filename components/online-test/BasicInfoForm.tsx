'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setBasicInfo, TimeSlot } from '@/lib/store/testCreationSlice';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import TimeSlotsManager from './TimeSlotsManager';
import NegativeMarkingConfig from './NegativeMarkingConfig';

export type BasicInfo = {
  title: string;
  candidates: string;
  questionSet: string;
  questionType: string;
  negativeMarkingEnabled: boolean;
  negativeMarkingPenalty: number;
  timeSlots: TimeSlot[];
};

const basicInfoSchema = Yup.object({
  title: Yup.string()
    .required('Online test title is required')
    .min(3, 'Title must be at least 3 characters'),
  candidates: Yup.number()
    .required('Total candidates is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  questionSet: Yup.string().required('Question set is required'),
  questionType: Yup.string().required('Question type is required'),
  negativeMarkingPenalty: Yup.number().min(0).max(100),
});

interface BasicInfoFormProps {
  onSave: () => void;
}

export default function BasicInfoForm({ onSave }: BasicInfoFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const basicInfo = useSelector((state: RootState) => state.testCreation.basicInfo);

  const formik = useFormik<BasicInfo>({
    enableReinitialize: true,
    initialValues: basicInfo,
    validationSchema: basicInfoSchema,
    onSubmit: (values) => {
      dispatch(setBasicInfo(values));
      onSave();
    },
  });

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-7 max-w-[960px] w-full mx-auto">
        <h3 className="text-base font-bold text-gray-800 mb-6">Basic Information</h3>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Online Test Title"
            required
            name="title"
            placeholder="Enter online test title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Candidates"
              required
              name="candidates"
              type="number"
              placeholder="Enter total candidates"
              value={formik.values.candidates}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.candidates && formik.errors.candidates ? formik.errors.candidates : undefined}
            />
            <Select
              label="Total Question Set"
              required
              name="questionSet"
              placeholder="Select total question set"
              options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
              value={formik.values.questionSet}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.questionSet && formik.errors.questionSet ? formik.errors.questionSet : undefined}
            />
          </div>

          <Select
            label="Question Type"
            required
            name="questionType"
            placeholder="Select question type"
            options={[
              { value: 'MCQ', label: 'MCQ' },
              { value: 'Checkbox', label: 'Checkbox' },
              { value: 'Text', label: 'Text' },
            ]}
            value={formik.values.questionType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.questionType && formik.errors.questionType ? formik.errors.questionType : undefined}
          />

          <div className="border-t border-gray-100 pt-5">
            <TimeSlotsManager
              slots={formik.values.timeSlots}
              onChange={(slots) => formik.setFieldValue('timeSlots', slots)}
              totalCandidates={Number(formik.values.candidates) || 0}
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <NegativeMarkingConfig
              enabled={formik.values.negativeMarkingEnabled}
              penalty={formik.values.negativeMarkingPenalty}
              onEnabledChange={(v) => formik.setFieldValue('negativeMarkingEnabled', v)}
              onPenaltyChange={(v) => formik.setFieldValue('negativeMarkingPenalty', v)}
            />
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between max-w-[960px] w-full mx-auto">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || formik.isSubmitting}
          className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#6633FF' }}
        >
          Save & Continue
        </button>
      </div>
    </>
  );
}

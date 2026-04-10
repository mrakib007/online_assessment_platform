import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export interface BasicInfo {
  title: string;
  candidates: string;
  slots: string;
  questionSet: string;
  questionType: string;
  startTime: string;
  endTime: string;
  duration: string;
}

const basicInfoSchema = Yup.object({
  title: Yup.string()
    .required('Online test title is required')
    .min(3, 'Title must be at least 3 characters'),
  candidates: Yup.number()
    .required('Total candidates is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  slots: Yup.string().required('Total slots is required'),
  questionSet: Yup.string().required('Question set is required'),
  questionType: Yup.string().required('Question type is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string()
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
});

interface BasicInfoFormProps {
  onSave: (data: BasicInfo) => void;
}

export default function BasicInfoForm({ onSave }: BasicInfoFormProps) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: '',
      candidates: '',
      slots: '',
      questionSet: '',
      questionType: '',
      startTime: '',
      endTime: '',
      duration: '',
    },
    validationSchema: basicInfoSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  const handleTimeChange = (field: 'startTime' | 'endTime') => (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    const value = e.target.value;

    setTimeout(() => {
      const start = field === 'startTime' ? value : formik.values.startTime;
      const end = field === 'endTime' ? value : formik.values.endTime;

      if (start && end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const diff = eh * 60 + em - (sh * 60 + sm);
        formik.setFieldValue('duration', diff > 0 ? `${diff} min` : '');
      }
    }, 0);
  };

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
              label="Total Slots"
              required
              name="slots"
              placeholder="Select total slots"
              options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
              value={formik.values.slots}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.slots && formik.errors.slots ? formik.errors.slots : undefined}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Time"
              required
              name="startTime"
              type="time"
              value={formik.values.startTime}
              onChange={handleTimeChange('startTime')}
              onBlur={formik.handleBlur}
              error={formik.touched.startTime && formik.errors.startTime ? formik.errors.startTime : undefined}
            />
            <Input
              label="End Time"
              required
              name="endTime"
              type="time"
              value={formik.values.endTime}
              onChange={handleTimeChange('endTime')}
              onBlur={formik.handleBlur}
              error={formik.touched.endTime && formik.errors.endTime ? formik.errors.endTime : undefined}
            />
            <Input
              label="Duration"
              name="duration"
              readOnly
              value={formik.values.duration}
              placeholder="Duration Time"
              className="bg-gray-50 text-gray-500"
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

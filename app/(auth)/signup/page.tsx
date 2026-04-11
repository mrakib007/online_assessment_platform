'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useCreateMutation } from '@/lib/api/dynamicApi';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const validationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  role: Yup.string().oneOf(['employer', 'candidate'], 'Please select a role').required('Role is required'),
});

export default function SignupPage() {
  const router = useRouter();
  const [register] = useCreateMutation();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '', role: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const result = await register({
          endpoint: '/api/auth/register',
          body: { email: values.email, password: values.password, role: values.role },
        }).unwrap();

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        toast({
          variant: 'success',
          title: 'Account Created Successfully',
          description: 'Welcome! Redirecting to dashboard...',
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
        setErrors({ email: errorMessage });
        
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: errorMessage,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-7">Create Account</h2>
      <div className="w-full bg-white rounded-2xl" style={{ maxWidth: '571px', border: '1px solid #E5E7EB', padding: '32px 32px 40px 32px' }}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex flex-col gap-4">

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Your primary email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            />

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="flex gap-3">
                {(['employer', 'candidate'] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                      formik.values.role === r
                        ? 'border-[#6633FF] bg-[#6633FF]/5 text-[#6633FF]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio" name="role" value={r}
                      checked={formik.values.role === r}
                      onChange={formik.handleChange}
                      className="hidden"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formik.values.role === r ? 'border-[#6633FF]' : 'border-gray-300'
                    }`}>
                      {formik.values.role === r && <span className="w-2 h-2 rounded-full bg-[#6633FF]" />}
                    </span>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </label>
                ))}
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-xs text-red-500">{formik.errors.role}</p>
              )}
            </div>

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              showPasswordToggle
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
              showPasswordToggle
            />

            <button
              type="submit" disabled={formik.isSubmitting}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm mt-1 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6633FF' }}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
      <p className="mt-5 text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/" className="font-semibold hover:underline" style={{ color: '#6633FF' }}>
          Sign in
        </a>
      </p>
    </>
  );
}

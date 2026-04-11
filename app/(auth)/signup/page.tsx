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
});

export default function SignupPage() {
  const router = useRouter();
  const [register] = useCreateMutation();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Automatically set role as 'candidate' for all signups
        const result = await register({
          endpoint: '/api/auth/register',
          body: { 
            email: values.email, 
            password: values.password, 
            role: 'candidate' // Hardcoded as candidate
          },
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

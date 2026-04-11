'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMutation } from '@/lib/api/dynamicApi';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [login] = useCreateMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const result = await login({
          endpoint: '/api/auth/login',
          body: values,
        }).unwrap();

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        toast({
          variant: 'success',
          title: 'Login Successful',
          description: 'Welcome back! Redirecting to dashboard...',
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Login failed. Please try again.";
        setErrors({ password: errorMessage });
        
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: errorMessage,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-7">Sign In</h2>
      <div
        className="w-full bg-white"
        style={{ maxWidth: '571px', height: '373px', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px 32px 40px 32px', gap: '10px' }}
      >
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex flex-col gap-2.5">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your primary email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            />

            <div className="mt-1">
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                showPasswordToggle
              />
              <div className="flex justify-end mt-0.5">
                <a href="#" className="text-sm transition-colors duration-150 hover:opacity-80" style={{ color: '#334155' }}>
                  Forget Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-150 mt-10 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6633FF' }}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <p className="mt-5 text-sm text-gray-500">
        Don&apos;t have a profile?{' '}
        <a href="/signup" className="font-semibold hover:underline" style={{ color: '#6633FF' }}>
          Sign up
        </a>
      </p>
    </>
  );
}

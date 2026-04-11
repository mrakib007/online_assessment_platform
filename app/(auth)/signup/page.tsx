'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMutation } from '@/lib/api/dynamicApi';

const validationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  role: Yup.string().oneOf(['employer', 'candidate'], 'Please select a role').required('Role is required'),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const [register] = useCreateMutation();

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
        router.push('/dashboard');
      } catch (error: any) {
        setErrors({ email: error?.data?.message || 'Registration failed. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-150 placeholder:text-gray-400 text-gray-800 ${
      (formik.touched as any)[field] && (formik.errors as any)[field]
        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 bg-white focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10'
    }`;

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-7">Create Account</h2>
      <div className="w-full bg-white rounded-2xl" style={{ maxWidth: '571px', border: '1px solid #E5E7EB', padding: '32px 32px 40px 32px' }}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="Your primary email address"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                className={inputClass('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

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

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                  className={inputClass('password') + ' pr-10'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
                  className={inputClass('confirmPassword') + ' pr-10'}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-xs text-red-500">{formik.errors.confirmPassword}</p>
              )}
            </div>

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

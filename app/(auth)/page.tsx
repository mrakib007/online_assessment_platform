'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ password: data.message || "Login failed" });
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/dashboard");
      } catch {
        setErrors({ password: "Something went wrong. Please try again." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-7">Sign In</h2>
      <div
        className="w-full bg-white rounded-2xl"
        style={{ maxWidth: '571px', border: '1px solid #E5E7EB', padding: '32px 32px 40px 32px' }}
      >
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your primary email address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-150 placeholder:text-gray-400 text-gray-800 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 bg-white focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-all duration-150 placeholder:text-gray-400 text-gray-800 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 bg-white focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
              <div className="flex justify-end mt-0.5">
                <a href="#" className="text-sm text-gray-500 hover:text-[#6633FF] transition-colors duration-150">
                  Forget Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-150 mt-2 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
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
    </>
  );
}

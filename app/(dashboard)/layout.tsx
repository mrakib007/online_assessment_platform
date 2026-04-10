'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; refId: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');

    if (!token || !stored) {
      router.replace('/');
      return;
    }

    const parsed = JSON.parse(stored);
    setUser({ name: parsed.email, refId: parsed.role });
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F3F4F6' }}>
      <Navbar user={user} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

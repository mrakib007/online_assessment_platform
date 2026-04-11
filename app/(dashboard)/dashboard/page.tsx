'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import TestCard from '@/components/online-test/TestCard';
import { useGetAllQuery } from '@/lib/api/dynamicApi';

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 px-6">
      <Image src="/empty.png" alt="No tests available" width={120} height={120} className="mb-5 object-contain" />
      <p className="text-base font-semibold text-gray-700 mb-1">No Online Test Available</p>
      <p className="text-sm text-gray-400 text-center">Currently, there are no online tests available. Please check back later for updates.</p>
    </div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const { data: tests = [], isLoading, isError } = useGetAllQuery('/api/tests');

  // Get user role from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserRole(parsed.role);
    }
  }, []);

  const filtered = useMemo(() => {
    return tests
      .map((t: any) => ({
        id: String(t.id),
        title: t.title,
        candidates: t.candidates,
        questionSet: t.questionSet,
        examSlots: t.totalSlots,
        duration: t.duration,
      }))
      .filter((t: any) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tests, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-bold text-gray-800">Online Tests</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by exam title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/10 w-64"
            />
          </div>
          {userRole === 'employer' && (
            <Link
              href="/online-test/create"
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#6633FF' }}
            >
              Create Online Test
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center py-20">
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      ) : isError || filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
            {filtered.map((test: any) => (
              <TestCard key={test.id} {...test} userRole={userRole} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">‹</button>
              <span className="w-7 h-7 rounded flex items-center justify-center bg-[#6633FF] text-white text-xs font-semibold">1</span>
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">›</button>
            </div>
            <span>Online Test Per Page &nbsp; 8 ↑</span>
          </div>
        </>
      )}
    </div>
  );
}

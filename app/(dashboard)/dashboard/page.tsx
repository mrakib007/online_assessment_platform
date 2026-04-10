'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import TestCard, { TestCardProps } from '@/components/online-test/TestCard';

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
  const [tests, setTests] = useState<TestCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((t: any) => ({
          id: String(t.id),
          title: t.title,
          candidates: t.candidates,
          questionSet: t.questionSet,
          examSlots: t.totalSlots,
        }));
        setTests(mapped);
      })
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

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
          <Link
            href="/online-test/create"
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6633FF' }}
          >
            Create Online Test
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center py-20">
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((test) => (
              <TestCard key={test.id} {...test} />
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

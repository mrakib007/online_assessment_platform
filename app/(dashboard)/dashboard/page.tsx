'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import TestCard, { TestCardProps } from '@/components/online-test/TestCard';

const allTests: TestCardProps[] = [
  { id: '1', title: 'Psychometric Test for Management Trainee Officer', candidates: 10000, questionSet: 3, examSlots: 3 },
  { id: '2', title: 'Psychometric Test for Management Trainee Officer', candidates: 10000, questionSet: 3, examSlots: 3 },
  { id: '3', title: 'Psychometric Test for Management Trainee Officer', candidates: null, questionSet: null, examSlots: null },
  { id: '4', title: 'Psychometric Test for Management Trainee Officer', candidates: 10000, questionSet: 3, examSlots: 3 },
];

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 px-6">
      {/* Simple illustration using SVG */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5">
        <rect x="10" y="25" width="45" height="38" rx="4" fill="#CBD5E1" />
        <rect x="16" y="18" width="45" height="38" rx="4" fill="#94A3B8" />
        <rect x="22" y="30" width="6" height="6" rx="1" fill="#64748B" />
        <rect x="32" y="32" width="20" height="2" rx="1" fill="#64748B" />
        <rect x="22" y="42" width="30" height="2" rx="1" fill="#94A3B8" />
        <circle cx="58" cy="22" r="12" fill="#3B82F6" />
        <path d="M53 22l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="58" cy="22" r="5" fill="#EF4444" />
        <path d="M56 22h4M58 20v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <p className="text-base font-semibold text-gray-700 mb-1">No Online Test Available</p>
      <p className="text-sm text-gray-400 text-center">Currently, there are no online tests available. Please check back later for updates.</p>
    </div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  // Toggle to true to see populated state
  const [showEmpty] = useState(false);

  const tests = showEmpty ? [] : allTests.filter(t =>
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
              onChange={e => setSearch(e.target.value)}
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

      {tests.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map(test => <TestCard key={test.id} {...test} />)}
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

'use client';

import Image from 'next/image';
import { ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  user?: { name: string; refId: string };
  title?: string;
}

function getTitle(pathname: string): string {
  if (pathname.startsWith('/online-test')) return 'Online Test';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return '';
}

export default function Navbar({ user, title }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = title ?? getTitle(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Image
          src="/Resource Logo 1.png"
          alt="Akij Resource Logo"
          width={120}
          height={40}
          className="object-contain"
        />
        {pageTitle && (
          <span className="text-base font-semibold text-gray-700">{pageTitle}</span>
        )}
        {user && (
          <div className="relative" ref={ref}>
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setOpen(!open)}
            >
              <UserCircle size={32} className="text-gray-400" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                <span className="text-xs text-gray-400">Ref. ID - {user.refId}</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 ml-1" />
            </div>
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

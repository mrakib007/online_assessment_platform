'use client';

import Image from 'next/image';
import { ChevronDown, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Image
          src="/Resource Logo 1.png"
          alt="Akij Resource Logo"
          width={110}
          height={36}
          className="object-contain flex-shrink-0"
        />

        {/* Page title — hidden on small screens */}
        {pageTitle && (
          <span className="hidden sm:block text-base font-semibold text-gray-700 truncate">
            {pageTitle}
          </span>
        )}

        {/* User dropdown */}
        {user && (
          <div className="relative flex-shrink-0" ref={ref}>
            <button
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setOpen(!open)}
            >
              <UserCircle size={30} className="text-gray-400" />
              {/* Show name+refId only on md+ */}
              <div className="hidden md:flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold text-gray-800 max-w-[140px] truncate">{user.name}</span>
                <span className="text-xs text-gray-400">Ref. ID - {user.refId}</span>
              </div>
              <ChevronDown size={15} className="text-gray-400" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* Show user info in dropdown on mobile */}
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Ref. ID - {user.refId}</p>
                  {pageTitle && (
                    <p className="text-xs text-[#6633FF] mt-1 flex items-center gap-1">
                      <LayoutDashboard size={11} /> {pageTitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors"
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

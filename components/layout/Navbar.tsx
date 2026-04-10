'use client';

import Image from 'next/image';
import { ChevronDown, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user?: { name: string; refId: string };
}

function getTitle(pathname: string): string {
  if (pathname.startsWith('/online-test')) return 'Online Test';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return '';
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const title = getTitle(pathname);

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
        {title && (
          <span className="text-base font-semibold text-gray-700">{title}</span>
        )}
        {user && (
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <UserCircle size={32} className="text-gray-400" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              <span className="text-xs text-gray-400">Ref. ID - {user.refId}</span>
            </div>
            <ChevronDown size={16} className="text-gray-400 ml-1" />
          </div>
        )}
      </div>
    </header>
  );
}

import { Phone, Mail } from 'lucide-react';

function AkijLogo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-col leading-none select-none">
      <span
        className="font-black tracking-tight"
        style={{ fontSize: '1.25rem', color: light ? '#ffffff' : '#1a1a2e' }}
      >
        AKi<span className="italic">J</span>
        <span
          className="font-bold not-italic ml-1"
          style={{ fontSize: '0.85rem', color: light ? '#ffffff' : '#1a1a2e' }}
        >
          RESOURCE
        </span>
      </span>
      <span
        className="tracking-widest uppercase font-medium"
        style={{ fontSize: '0.45rem', color: light ? '#a0a0b0' : '#9ca3af', letterSpacing: '0.15em' }}
      >
        Resource Institute
      </span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-gray-400 text-sm">Powered by</span>
          <AkijLogo light />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span className="text-gray-400 mr-1">Helpline</span>
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full border"
              style={{ borderColor: '#6633FF' }}
            >
              <Phone size={13} style={{ color: '#6633FF' }} />
            </span>
            <span>+88 011020202505</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full border"
              style={{ borderColor: '#6633FF' }}
            >
              <Mail size={13} style={{ color: '#6633FF' }} />
            </span>
            <span>support@akij.work</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

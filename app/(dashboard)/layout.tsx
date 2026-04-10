import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const mockUser = { name: 'Arif Hossain', refId: '16101121' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F3F4F6' }}>
      <Navbar user={mockUser} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

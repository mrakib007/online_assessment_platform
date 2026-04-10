import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      <Navbar title="Akij Resource" />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

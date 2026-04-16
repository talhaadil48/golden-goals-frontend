import AuthGuard from '@/app/components/AuthGuard';
import Navbar from '@/app/components/Navbar';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        {children}
      </main>
    </AuthGuard>
  );
}

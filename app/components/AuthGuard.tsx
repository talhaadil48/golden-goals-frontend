'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '../lib/storage';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9F9' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#6EC1C3', borderTopColor: 'transparent' }}
          />
          <span style={{ color: '#5F6B6F', fontSize: 14 }}>Loading…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

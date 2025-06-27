'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  // Always wrap with SessionProvider since we need auth state throughout the app
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 
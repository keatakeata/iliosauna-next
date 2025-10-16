'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const isEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';

  // Only wrap in ClerkProvider if enabled
  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
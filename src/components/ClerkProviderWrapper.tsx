'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const clerkEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';
  
  // If Clerk is enabled, wrap with ClerkProvider
  // This allows authentication to work in the background
  // UI visibility is controlled separately via NEXT_PUBLIC_ECOM_UI_VISIBLE
  if (clerkEnabled) {
    return (
      <ClerkProvider
        appearance={{
          elements: {
            // Hide Clerk UI elements when e-commerce is not visible
            rootBox: process.env.NEXT_PUBLIC_ECOM_UI_VISIBLE === 'false' ? 'hidden' : undefined,
          }
        }}
      >
        {children}
      </ClerkProvider>
    );
  }
  
  // Fallback if Clerk is completely disabled
  return <>{children}</>;
}
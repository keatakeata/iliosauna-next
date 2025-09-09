'use client';

// Temporarily bypass Clerk entirely to fix loading issues
export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // Just return children without Clerk for now
  return <>{children}</>;
}
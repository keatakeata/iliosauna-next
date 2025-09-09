'use client';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // Temporarily bypass Clerk to fix deployment
  // Re-enable when environment variables are properly configured in Vercel
  return <>{children}</>;
}
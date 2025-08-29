'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase-safe';

interface SupabaseContextType {
  isConfigured: boolean;
  isOnline: boolean;
  hasError: boolean;
  errorMessage: string | null;
  retryConnection: () => void;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isConfigured: false,
  isOnline: true,
  hasError: false,
  errorMessage: null,
  retryConnection: () => {}
});

export function useSupabaseStatus() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    
    if (!configured) {
      console.warn('Supabase is not configured. Database features will be disabled.');
    }

    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true);
      setHasError(false);
      setErrorMessage(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setErrorMessage('You are currently offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retryConnection = () => {
    setHasError(false);
    setErrorMessage(null);
    window.location.reload();
  };

  return (
    <SupabaseContext.Provider 
      value={{ 
        isConfigured, 
        isOnline, 
        hasError, 
        errorMessage, 
        retryConnection 
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}
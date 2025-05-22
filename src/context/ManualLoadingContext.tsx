
'use client';

import type { PropsWithChildren } from 'react';
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ManualLoadingContextType {
  isManuallyLoading: boolean;
  triggerLoading: () => void;
}

const ManualLoadingContext = createContext<ManualLoadingContextType | undefined>(undefined);

export function ManualLoadingProvider({ children }: PropsWithChildren) {
  const [isManuallyLoading, setIsManuallyLoading] = useState(false);
  const pathname = usePathname();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return; // Don't hide on the very first render/pathname evaluation
    }
    // Any subsequent pathname change means navigation has occurred, so hide the manual indicator
    setIsManuallyLoading(false);
  }, [pathname]);

  const triggerLoading = useCallback(() => {
    setIsManuallyLoading(true);
  }, []);

  return (
    <ManualLoadingContext.Provider value={{ isManuallyLoading, triggerLoading }}>
      {children}
    </ManualLoadingContext.Provider>
  );
}

export function useManualLoading() {
  const context = useContext(ManualLoadingContext);
  if (context === undefined) {
    throw new Error('useManualLoading must be used within a ManualLoadingProvider');
  }
  return context;
}


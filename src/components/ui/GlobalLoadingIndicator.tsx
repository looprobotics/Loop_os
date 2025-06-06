
'use client';

import { useManualLoading } from '@/context/ManualLoadingContext';
import { Loader2 } from 'lucide-react';

export function GlobalLoadingIndicator() {
  const { isManuallyLoading } = useManualLoading();

  if (!isManuallyLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center space-x-3 rounded-lg bg-card p-6 shadow-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
}

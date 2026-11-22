'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl border border-amber-200 p-8 max-w-sm text-center shadow-sm space-y-4">
        <div className="p-3 rounded-full bg-amber-50 text-amber-600 w-14 h-14 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Something went wrong</h2>
          <p className="text-sm text-slate-500 mt-1">
            Unable to load the app. Please check your internet connection or try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-slate-900 text-white text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

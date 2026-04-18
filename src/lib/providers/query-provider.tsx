 'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ApiError, hasActiveSession, markAuthSessionPresent, http } from '@/lib/api-client';

/** If API HttpOnly cookies exist but this tab never ran login, restore session hint for hooks + middleware. */
function AuthSessionBootstrap() {
  useEffect(() => {
    if (hasActiveSession()) return;
      http.get<any>("/auth/me")
      .then((res) => markAuthSessionPresent(res?.role || "PATIENT"))
      .catch(() => {});
  }, []);
  return null;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a client instance inside the component
  // This ensures each request gets its own client in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.statusCode === 401) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionBootstrap />
      {children}
    </QueryClientProvider>
  );
}

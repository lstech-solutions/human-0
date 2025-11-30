/**
 * React Context Provider for PoSH SDK
 */

import React, { createContext, useContext, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PoshClient } from '../core/PoshClient';
import type { PoshConfig } from '../types';

interface PoshContextValue {
  client: PoshClient;
  config: PoshConfig;
}

const PoshContext = createContext<PoshContextValue | null>(null);

export interface PoshProviderProps {
  config: PoshConfig;
  children: React.ReactNode;
  queryClient?: QueryClient;
}

/**
 * Provider component for PoSH SDK
 * Wraps your app to provide SDK access to all components
 */
export function PoshProvider({ config, children, queryClient }: PoshProviderProps) {
  // Create client instance (memoized to prevent recreation)
  const client = useMemo(() => new PoshClient(config), [config]);

  // Create default query client if not provided
  const defaultQueryClient = useMemo(
    () =>
      queryClient ||
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000, // 1 minute
            gcTime: 300000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [queryClient]
  );

  const value = useMemo(
    () => ({
      client,
      config,
    }),
    [client, config]
  );

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <PoshContext.Provider value={value}>{children}</PoshContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * Hook to access the PoSH client
 */
export function usePoshClient(): PoshClient {
  const context = useContext(PoshContext);
  if (!context) {
    throw new Error('usePoshClient must be used within a PoshProvider');
  }
  return context.client;
}

/**
 * Hook to access the PoSH configuration
 */
export function usePoshConfig(): PoshConfig {
  const context = useContext(PoshContext);
  if (!context) {
    throw new Error('usePoshConfig must be used within a PoshProvider');
  }
  return context.config;
}

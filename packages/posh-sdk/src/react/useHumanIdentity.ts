/**
 * React hook for human identity operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePoshClient } from './PoshProvider';
import type { Address, HumanId, Identity } from '../types';

/**
 * Hook to check if an address is registered
 */
export function useIsRegistered(address?: Address) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'isRegistered', address],
    queryFn: () => {
      if (!address) throw new Error('Address is required');
      return client.identity.isRegistered(address);
    },
    enabled: !!address,
  });
}

/**
 * Hook to get humanId for an address
 */
export function useHumanId(address?: Address) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'humanId', address],
    queryFn: () => {
      if (!address) throw new Error('Address is required');
      return client.identity.getHumanId(address);
    },
    enabled: !!address,
  });
}

/**
 * Hook to get full identity information
 */
export function useHumanIdentity(address?: Address) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'identity', address],
    queryFn: async (): Promise<Identity | null> => {
      if (!address) throw new Error('Address is required');

      const humanId = await client.identity.getHumanId(address);
      if (!humanId) return null;

      const registrationTime = await client.identity.getRegistrationTime(humanId);

      return {
        humanId,
        wallet: address,
        registrationTime,
        externalProofs: [], // Will be implemented when contracts are deployed
      };
    },
    enabled: !!address,
  });
}

/**
 * Hook to register a new identity
 */
export function useRegisterIdentity() {
  const client = usePoshClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await client.identity.register();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['posh', 'isRegistered'] });
      queryClient.invalidateQueries({ queryKey: ['posh', 'humanId'] });
      queryClient.invalidateQueries({ queryKey: ['posh', 'identity'] });
    },
  });
}

/**
 * Hook to get registration time
 */
export function useRegistrationTime(humanId?: HumanId) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'registrationTime', humanId],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.identity.getRegistrationTime(humanId);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to estimate registration gas
 */
export function useEstimateRegisterGas() {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'estimateRegisterGas'],
    queryFn: () => client.identity.estimateRegisterGas(),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Combined hook with all identity operations
 */
export function useIdentity(address?: Address) {
  const identity = useHumanIdentity(address);
  const isRegistered = useIsRegistered(address);
  const register = useRegisterIdentity();
  const estimateGas = useEstimateRegisterGas();

  return {
    // Data
    identity: identity.data,
    humanId: identity.data?.humanId,
    isRegistered: isRegistered.data,

    // Loading states
    isLoading: identity.isLoading || isRegistered.isLoading,
    isRegistering: register.isPending,

    // Error states
    error: identity.error || isRegistered.error,
    registerError: register.error,

    // Actions
    register: register.mutate,
    registerAsync: register.mutateAsync,

    // Gas estimation
    estimatedGas: estimateGas.data,

    // Refetch
    refetch: identity.refetch,
  };
}

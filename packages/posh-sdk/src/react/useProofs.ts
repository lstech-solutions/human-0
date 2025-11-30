/**
 * React hook for proof operations
 */

import { useQuery } from '@tanstack/react-query';
import { usePoshClient } from './PoshProvider';
import type { HumanId, ProofQueryOptions, ImpactType } from '../types';

/**
 * Hook to get all proofs for a humanId
 */
export function useProofs(humanId?: HumanId, options?: ProofQueryOptions) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'proofs', humanId, options],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.proofs.getHumanProofs(humanId, options);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to get proof count for a humanId
 */
export function useProofCount(humanId?: HumanId) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'proofCount', humanId],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.proofs.getProofCount(humanId);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to get total impact for a humanId
 */
export function useTotalImpact(humanId?: HumanId, impactType?: ImpactType) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'totalImpact', humanId, impactType],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.proofs.getTotalImpact(humanId, impactType);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to get proofs filtered by impact type
 */
export function useProofsByType(humanId?: HumanId, impactType?: ImpactType) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'proofsByType', humanId, impactType],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.proofs.getHumanProofs(humanId, { impactType });
    },
    enabled: !!humanId && !!impactType,
  });
}

/**
 * Combined hook with all proof operations
 */
export function useProofData(humanId?: HumanId) {
  const proofs = useProofs(humanId);
  const count = useProofCount(humanId);
  const totalImpact = useTotalImpact(humanId);

  return {
    // Data
    proofs: proofs.data || [],
    count: count.data || 0,
    totalImpact: totalImpact.data || 0n,

    // Loading states
    isLoading: proofs.isLoading || count.isLoading || totalImpact.isLoading,

    // Error states
    error: proofs.error || count.error || totalImpact.error,

    // Refetch
    refetch: () => {
      proofs.refetch();
      count.refetch();
      totalImpact.refetch();
    },
  };
}

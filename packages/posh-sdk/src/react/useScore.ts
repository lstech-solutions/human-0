/**
 * React hook for score operations
 */

import { useQuery } from '@tanstack/react-query';
import { usePoshClient } from './PoshProvider';
import type { HumanId } from '../types';

/**
 * Hook to get score for a humanId
 */
export function useScore(humanId?: HumanId) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'score', humanId],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.score.getScore(humanId);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to get level for a humanId
 */
export function useLevel(humanId?: HumanId) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'level', humanId],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.score.getLevel(humanId);
    },
    enabled: !!humanId,
  });
}

/**
 * Hook to check if score meets threshold
 */
export function useMeetsThreshold(humanId?: HumanId, threshold?: number) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'meetsThreshold', humanId, threshold],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      if (threshold === undefined) throw new Error('Threshold is required');
      return client.score.meetsThreshold(humanId, threshold);
    },
    enabled: !!humanId && threshold !== undefined,
  });
}

/**
 * Hook to get tier breakdown for a humanId
 */
export function useTierBreakdown(humanId?: HumanId) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'tierBreakdown', humanId],
    queryFn: () => {
      if (!humanId) throw new Error('HumanId is required');
      return client.score.getTierBreakdown(humanId);
    },
    enabled: !!humanId,
  });
}

/**
 * Combined hook with all score operations
 */
export function useScoreData(humanId?: HumanId) {
  const score = useScore(humanId);
  const level = useLevel(humanId);
  const tierBreakdown = useTierBreakdown(humanId);

  return {
    // Data
    score: score.data || 0,
    level: level.data,
    tierBreakdown: tierBreakdown.data,

    // Loading states
    isLoading: score.isLoading || level.isLoading || tierBreakdown.isLoading,

    // Error states
    error: score.error || level.error || tierBreakdown.error,

    // Refetch
    refetch: () => {
      score.refetch();
      level.refetch();
      tierBreakdown.refetch();
    },
  };
}

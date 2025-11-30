/**
 * React hooks and components for @human-0/posh-sdk
 * 
 * @packageDocumentation
 */

// Provider
export { PoshProvider, usePoshClient, usePoshConfig } from './PoshProvider';
export type { PoshProviderProps } from './PoshProvider';

// Identity hooks
export {
  useIsRegistered,
  useHumanId,
  useHumanIdentity,
  useRegisterIdentity,
  useRegistrationTime,
  useEstimateRegisterGas,
  useIdentity,
} from './useHumanIdentity';

// Proof hooks
export {
  useProofs,
  useProofCount,
  useTotalImpact,
  useProofsByType,
  useProofData,
} from './useProofs';

// Score hooks
export {
  useScore,
  useLevel,
  useMeetsThreshold,
  useTierBreakdown,
  useScoreData,
} from './useScore';

// Event hooks
export {
  useHumanRegisteredEvents,
  useProofRegisteredEvents,
  useIdentityLinkedEvents,
  useHistoricalHumanRegisteredEvents,
  useHistoricalProofRegisteredEvents,
  useHistoricalIdentityLinkedEvents,
  useAllEvents,
} from './useEvents';

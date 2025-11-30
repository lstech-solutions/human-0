/**
 * Configuration type definitions
 */

import type { Address } from './common';

export interface PoshConfig {
  chainId: number;
  rpcUrl?: string;
  contracts: {
    humanIdentity: Address;
    proofRegistry: Address;
    poshNFT: Address;
    humanScore: Address;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  retry?: {
    enabled: boolean;
    maxAttempts: number;
    backoff: 'linear' | 'exponential';
    initialDelay: number;
  };
}

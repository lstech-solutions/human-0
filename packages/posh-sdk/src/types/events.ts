/**
 * Event type definitions
 */

import type { Address, HumanId } from './common';
import type { ImpactType, ProofTier } from './proof';

export interface HumanRegisteredEvent {
  humanId: HumanId;
  wallet: Address;
  timestamp: Date;
  blockNumber: number;
  transactionHash: string;
}

export interface ProofRegisteredEvent {
  proofId: string;
  humanId: HumanId;
  impactType: ImpactType;
  impactValue: bigint;
  tier: ProofTier;
  timestamp: Date;
  blockNumber: number;
  transactionHash: string;
}

export interface IdentityLinkedEvent {
  humanId: HumanId;
  proofHash: string;
  provider: string;
  timestamp: Date;
  blockNumber: number;
  transactionHash: string;
}

export interface EventFilter {
  fromBlock?: number;
  toBlock?: number;
  humanId?: HumanId;
}

export type Unsubscribe = () => void;

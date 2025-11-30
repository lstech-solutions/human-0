/**
 * Proof type definitions
 */

import type { HumanId } from './common';

export interface Proof {
  proofId: string;
  humanId: HumanId;
  impactType: ImpactType;
  impactValue: bigint;
  methodologyHash: string;
  verificationHash: string;
  timestamp: Date;
  tier: ProofTier;
}

export enum ProofTier {
  A = 1,
  B = 2,
  C = 3,
}

export type ImpactType =
  | 'renewable_energy'
  | 'carbon_avoidance'
  | 'sustainable_transport'
  | 'waste_reduction'
  | 'water_conservation';

export interface ProofQueryOptions {
  impactType?: ImpactType;
  tier?: ProofTier;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ProofFilter {
  impactTypes?: ImpactType[];
  tiers?: ProofTier[];
  minValue?: bigint;
  maxValue?: bigint;
  dateRange?: { start: Date; end: Date };
}

export interface ImpactSummary {
  totalImpact: bigint;
  byType: Record<ImpactType, bigint>;
  byTier: TierBreakdown;
  proofCount: number;
}

export interface TierBreakdown {
  tierA: number;
  tierB: number;
  tierC: number;
  total: number;
}

export interface AggregateOptions {
  groupBy?: 'type' | 'tier' | 'month';
  applyWeighting?: boolean;
  applyTimeDecay?: boolean;
}

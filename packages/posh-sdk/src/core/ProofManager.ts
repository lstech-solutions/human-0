/**
 * ProofManager - handles proof queries and aggregations
 */

import type { HumanId, Proof, ProofQueryOptions, ImpactType, PoshConfig } from '../types';
import type { BaseProvider } from '../providers';
import { Cache } from '../utils/cache';

export class ProofManager {
  private config: PoshConfig;
  private cache: Cache;

  constructor(config: PoshConfig, _provider?: BaseProvider) {
    this.config = config;
    // Provider will be used for future write operations
    this.cache = new Cache(
      config.cache?.ttl || 60000,
      config.cache?.maxSize || 1000
    );
  }

  /**
   * Get all proofs for a humanId
   * Note: Mock implementation - returns empty array until contracts are deployed
   */
  async getHumanProofs(
    humanId: HumanId,
    options?: ProofQueryOptions
  ): Promise<Proof[]> {
    const cacheKey = `proofs:${humanId}:${JSON.stringify(options || {})}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      return cached as Proof[];
    }

    // Mock: Return empty array
    const result: Proof[] = [];
    
    if (this.config.cache?.enabled) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Get proof count for a humanId
   * Note: Mock implementation
   */
  async getProofCount(humanId: HumanId): Promise<number> {
    const proofs = await this.getHumanProofs(humanId);
    return proofs.length;
  }

  /**
   * Get total impact for a humanId
   * Note: Mock implementation - returns 0 until contracts are deployed
   */
  async getTotalImpact(
    humanId: HumanId,
    impactType?: ImpactType
  ): Promise<bigint> {
    const proofs = await this.getHumanProofs(humanId);
    
    if (impactType) {
      return proofs
        .filter(p => p.impactType === impactType)
        .reduce((sum, p) => sum + p.impactValue, 0n);
    }

    return proofs.reduce((sum, p) => sum + p.impactValue, 0n);
  }
}

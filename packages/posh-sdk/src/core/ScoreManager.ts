/**
 * ScoreManager - handles score calculations
 */

import type { HumanId, ScoreLevel, TierBreakdown, PoshConfig } from '../types';
import type { BaseProvider } from '../providers';
import { Cache } from '../utils/cache';

export class ScoreManager {
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
   * Get score for a humanId
   * Note: Mock implementation - returns 0 until contracts are deployed
   */
  async getScore(humanId: HumanId): Promise<number> {
    const cacheKey = `score:${humanId}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      return cached as number;
    }

    // Mock: Return 0
    const result = 0;
    
    if (this.config.cache?.enabled) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Get level for a humanId
   * Note: Mock implementation
   */
  async getLevel(humanId: HumanId): Promise<ScoreLevel> {
    const score = await this.getScore(humanId);
    return this.getLevelFromScore(score);
  }

  /**
   * Check if score meets threshold
   */
  async meetsThreshold(humanId: HumanId, threshold: number): Promise<boolean> {
    const score = await this.getScore(humanId);
    return score >= threshold;
  }

  /**
   * Get tier breakdown for a humanId
   * Note: Mock implementation
   */
  async getTierBreakdown(_humanId: HumanId): Promise<TierBreakdown> {
    return {
      tierA: 0,
      tierB: 0,
      tierC: 0,
      total: 0,
    };
  }

  /**
   * Get level from score value
   */
  getLevelFromScore(score: number): ScoreLevel {
    if (score >= 1000000) {
      return { level: 5, name: 'Diamond', minScore: 1000000, maxScore: null };
    }
    if (score >= 100000) {
      return { level: 4, name: 'Platinum', minScore: 100000, maxScore: 999999 };
    }
    if (score >= 10000) {
      return { level: 3, name: 'Gold', minScore: 10000, maxScore: 99999 };
    }
    if (score >= 1000) {
      return { level: 2, name: 'Silver', minScore: 1000, maxScore: 9999 };
    }
    if (score >= 100) {
      return { level: 1, name: 'Bronze', minScore: 100, maxScore: 999 };
    }
    return { level: 0, name: 'None', minScore: 0, maxScore: 99 };
  }
}

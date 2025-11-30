/**
 * Main PoshClient class - entry point for the SDK
 */

import type { PoshConfig } from '../types';
import type { BaseProvider } from '../providers';
import { validateConfig } from '../utils/validation';
import { IdentityManager } from './IdentityManager';
import { ProofManager } from './ProofManager';
import { ScoreManager } from './ScoreManager';
import { EventManager } from './EventManager';

export interface PoshClientConfig extends PoshConfig {
  provider?: BaseProvider;
}

export class PoshClient {
  private config: PoshConfig;
  private provider?: BaseProvider;
  
  public readonly identity: IdentityManager;
  public readonly proofs: ProofManager;
  public readonly score: ScoreManager;
  public readonly events: EventManager;

  constructor(config: PoshClientConfig) {
    // Validate configuration
    validateConfig(config);
    
    this.config = config;
    this.provider = config.provider;
    
    // Initialize managers with provider
    this.identity = new IdentityManager(config, this.provider);
    this.proofs = new ProofManager(config, this.provider);
    this.score = new ScoreManager(config, this.provider);
    this.events = new EventManager(config, this.provider);
  }

  /**
   * Get current configuration
   */
  getConfig(): PoshConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   * Note: This creates a new client instance internally
   */
  updateConfig(updates: Partial<PoshConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      contracts: {
        ...this.config.contracts,
        ...updates.contracts,
      },
    };
    
    validateConfig(this.config);
  }
}

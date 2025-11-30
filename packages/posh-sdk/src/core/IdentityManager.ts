/**
 * IdentityManager - handles identity operations
 */

import type { Address, HumanId, PoshConfig } from '../types';
import type { BaseProvider } from '../providers';
import { Cache } from '../utils/cache';
import { validateAddress } from '../utils/validation';
import { HUMAN_IDENTITY_ABI } from '../contracts/abis';
import { PoshSDKError } from '../utils/errors';
import type { Hash } from 'viem';

export interface RegisterResult {
  hash: Hash;
  humanId: HumanId;
}

export interface TransactionResult {
  hash: Hash;
}

export class IdentityManager {
  private config: PoshConfig;
  private cache: Cache;
  private provider?: BaseProvider;

  constructor(config: PoshConfig, provider?: BaseProvider) {
    this.config = config;
    this.provider = provider;
    this.cache = new Cache(
      config.cache?.ttl || 60000,
      config.cache?.maxSize || 1000
    );
  }

  /**
   * Check if an address is registered
   * Note: Mock implementation - returns false until contracts are deployed
   */
  async isRegistered(address: Address): Promise<boolean> {
    validateAddress(address);
    
    const cacheKey = `isRegistered:${address}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      return cached as boolean;
    }

    // Mock: Always return false for now
    const result = false;
    
    if (this.config.cache?.enabled) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Get humanId for an address
   * Note: Mock implementation - returns null until contracts are deployed
   */
  async getHumanId(address: Address): Promise<HumanId | null> {
    validateAddress(address);
    
    const cacheKey = `humanId:${address}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      return cached as HumanId | null;
    }

    // Mock: Always return null for now
    const result = null;
    
    if (this.config.cache?.enabled) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Get wallet address for a humanId
   * Note: Mock implementation
   */
  async getWallet(_humanId: HumanId): Promise<Address> {
    // Mock: Return zero address
    return '0x0000000000000000000000000000000000000000' as Address;
  }

  /**
   * Get registration time for a humanId
   * Note: Mock implementation
   */
  async getRegistrationTime(_humanId: HumanId): Promise<Date> {
    // Mock: Return current date
    return new Date();
  }

  /**
   * Register a new identity
   * Requires a provider with write capabilities
   */
  async register(): Promise<RegisterResult> {
    if (!this.provider) {
      throw new PoshSDKError(
        'Provider required for write operations',
        'PROVIDER_REQUIRED',
        'Initialize PoshClient with a provider that supports write operations'
      );
    }

    try {
      // Call register function on HumanIdentity contract
      const hash = await this.provider.writeContract({
        address: this.config.contracts.humanIdentity,
        abi: HUMAN_IDENTITY_ABI as unknown as any[],
        functionName: 'register',
        args: [],
      });

      // Wait for transaction confirmation
      const receipt = await this.provider.waitForTransaction(hash);

      if (receipt.status !== 'success') {
        throw new PoshSDKError(
          'Registration transaction failed',
          'TRANSACTION_FAILED',
          'The registration transaction was reverted. Please try again.'
        );
      }

      // Parse humanId from logs
      // In a real implementation, we'd parse the HumanRegistered event
      // For now, we'll return a placeholder
      const humanId = '0x0000000000000000000000000000000000000000000000000000000000000000' as HumanId;

      // Invalidate cache
      this.cache.clear();

      return {
        hash,
        humanId,
      };
    } catch (error) {
      if (error instanceof PoshSDKError) {
        throw error;
      }
      throw new PoshSDKError(
        'Failed to register identity',
        'REGISTRATION_FAILED',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Link an external proof to identity
   * Requires a provider with write capabilities
   */
  async linkExternalProof(
    _proofHash: string,
    _provider: string
  ): Promise<TransactionResult> {
    if (!this.provider) {
      throw new PoshSDKError(
        'Provider required for write operations',
        'PROVIDER_REQUIRED',
        'Initialize PoshClient with a provider that supports write operations'
      );
    }

    try {
      // This would call linkExternalProof on the contract
      // For now, throw not implemented
      throw new PoshSDKError(
        'External proof linking not yet implemented',
        'NOT_IMPLEMENTED',
        'This feature will be available in a future version'
      );
    } catch (error) {
      if (error instanceof PoshSDKError) {
        throw error;
      }
      throw new PoshSDKError(
        'Failed to link external proof',
        'LINK_PROOF_FAILED',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Estimate gas for registration
   */
  async estimateRegisterGas(): Promise<bigint> {
    if (!this.provider) {
      throw new PoshSDKError(
        'Provider required for gas estimation',
        'PROVIDER_REQUIRED',
        'Initialize PoshClient with a provider'
      );
    }

    try {
      const gas = await this.provider.estimateGas({
        address: this.config.contracts.humanIdentity,
        abi: HUMAN_IDENTITY_ABI as unknown as any[],
        functionName: 'register',
        args: [],
      });

      return gas;
    } catch (error) {
      throw new PoshSDKError(
        'Failed to estimate gas',
        'GAS_ESTIMATION_FAILED',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Estimate gas for linking external proof
   */
  async estimateLinkProofGas(): Promise<bigint> {
    if (!this.provider) {
      throw new PoshSDKError(
        'Provider required for gas estimation',
        'PROVIDER_REQUIRED',
        'Initialize PoshClient with a provider'
      );
    }

    // Placeholder - would estimate actual linkExternalProof call
    return 150000n;
  }
}

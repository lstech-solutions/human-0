/**
 * Base provider interface for blockchain interactions
 * Abstracts away the underlying Ethereum library (Viem, Wagmi, ethers.js)
 */

import type { Address, Hash } from 'viem';

/**
 * Contract call parameters
 */
export interface ContractCallParams {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
}

/**
 * Transaction parameters
 */
export interface TransactionParams extends ContractCallParams {
  value?: bigint;
  gas?: bigint;
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
  transactionHash: Hash;
  blockNumber: bigint;
  status: 'success' | 'reverted';
  gasUsed: bigint;
  logs: any[];
}

/**
 * Provider event filter parameters
 */
export interface ProviderEventFilter {
  fromBlock?: bigint;
  toBlock?: bigint;
  address?: Address;
  topics?: (Hash | Hash[] | null)[];
}

/**
 * Provider event log
 */
export interface ProviderEventLog {
  address: Address;
  topics: Hash[];
  data: Hash;
  blockNumber: bigint;
  transactionHash: Hash;
  logIndex: number;
}

/**
 * Provider event subscription callback
 */
export type ProviderEventCallback = (log: ProviderEventLog) => void;

/**
 * Provider unsubscribe function
 */
export type ProviderUnsubscribe = () => void;

/**
 * Base provider interface
 * All provider adapters must implement this interface
 */
export interface BaseProvider {
  /**
   * Read from a contract (view/pure functions)
   */
  readContract<T = any>(params: ContractCallParams): Promise<T>;

  /**
   * Write to a contract (state-changing functions)
   * Returns transaction hash
   */
  writeContract(params: TransactionParams): Promise<Hash>;

  /**
   * Wait for transaction confirmation
   */
  waitForTransaction(hash: Hash): Promise<TransactionReceipt>;

  /**
   * Estimate gas for a transaction
   */
  estimateGas(params: TransactionParams): Promise<bigint>;

  /**
   * Get past events matching filter
   */
  getEvents(params: ContractCallParams & { filter: ProviderEventFilter }): Promise<ProviderEventLog[]>;

  /**
   * Subscribe to contract events
   */
  watchEvent(params: ContractCallParams & { callback: ProviderEventCallback }): ProviderUnsubscribe;

  /**
   * Get current block number
   */
  getBlockNumber(): Promise<bigint>;

  /**
   * Get chain ID
   */
  getChainId(): Promise<number>;
}

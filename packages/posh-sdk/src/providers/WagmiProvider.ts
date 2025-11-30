/**
 * Wagmi provider adapter
 * Wraps Wagmi's config to implement BaseProvider interface
 * Note: This is a thin wrapper - Wagmi uses Viem under the hood
 */

import type { Config } from '@wagmi/core';
import { 
  readContract, 
  writeContract, 
  waitForTransactionReceipt, 
  estimateGas, 
  getBlockNumber, 
  getChainId 
} from '@wagmi/core';
import type { Address, Hash } from 'viem';
import type {
  BaseProvider,
  ContractCallParams,
  TransactionParams,
  TransactionReceipt,
  ProviderEventFilter,
  ProviderEventLog,
  ProviderEventCallback,
  ProviderUnsubscribe,
} from './BaseProvider';

export interface WagmiProviderConfig {
  config: Config;
}

export class WagmiProvider implements BaseProvider {
  private config: Config;

  constructor(config: WagmiProviderConfig) {
    this.config = config.config;
  }

  async readContract<T = any>(params: ContractCallParams): Promise<T> {
    const result = await readContract(this.config, {
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    });

    return result as T;
  }

  async writeContract(params: TransactionParams): Promise<Hash> {
    const hash = await writeContract(this.config, {
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
      value: params.value,
      gas: params.gas,
    });

    return hash;
  }

  async waitForTransaction(hash: Hash): Promise<TransactionReceipt> {
    const receipt = await waitForTransactionReceipt(this.config, {
      hash,
    });

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
      gasUsed: receipt.gasUsed,
      logs: receipt.logs,
    };
  }

  async estimateGas(params: TransactionParams): Promise<bigint> {
    const gas = await estimateGas(this.config, {
      to: params.address,
      data: '0x', // Would need to encode function call
      value: params.value,
    });

    return gas;
  }

  async getEvents(
    params: ContractCallParams & { filter: ProviderEventFilter }
  ): Promise<ProviderEventLog[]> {
    // Wagmi doesn't have a direct getLogs equivalent
    // Would need to use the underlying Viem client
    throw new Error('getEvents not yet implemented for WagmiProvider - use ViemProvider instead');
  }

  watchEvent(params: ContractCallParams & { callback: ProviderEventCallback }): ProviderUnsubscribe {
    // Wagmi uses watchContractEvent from Viem
    // Would need access to the underlying client
    throw new Error('watchEvent not yet implemented for WagmiProvider - use ViemProvider instead');
  }

  async getBlockNumber(): Promise<bigint> {
    return await getBlockNumber(this.config);
  }

  async getChainId(): Promise<number> {
    return await getChainId(this.config);
  }
}

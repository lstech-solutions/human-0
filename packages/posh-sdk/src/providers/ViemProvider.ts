/**
 * Viem provider adapter
 * Implements BaseProvider using Viem's PublicClient and WalletClient
 */

import type { PublicClient, WalletClient, Hash } from 'viem';
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

export interface ViemProviderConfig {
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export class ViemProvider implements BaseProvider {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;

  constructor(config: ViemProviderConfig) {
    this.publicClient = config.publicClient;
    this.walletClient = config.walletClient;
  }

  async readContract<T = any>(params: ContractCallParams): Promise<T> {
    const result = await this.publicClient.readContract({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args || [],
    });

    return result as T;
  }

  async writeContract(params: TransactionParams): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('WalletClient is required for write operations');
    }

    const { request } = await this.publicClient.simulateContract({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args || [],
      value: params.value,
      gas: params.gas,
      account: this.walletClient.account!,
    });

    const hash = await this.walletClient.writeContract(request);
    return hash;
  }

  async waitForTransaction(hash: Hash): Promise<TransactionReceipt> {
    const receipt = await this.publicClient.waitForTransactionReceipt({
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
    if (!this.walletClient) {
      throw new Error('WalletClient is required for gas estimation');
    }

    const gas = await this.publicClient.estimateContractGas({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args || [],
      value: params.value,
      account: this.walletClient.account!,
    });

    return gas;
  }

  async getEvents(
    params: ContractCallParams & { filter: ProviderEventFilter }
  ): Promise<ProviderEventLog[]> {
    const logs = await this.publicClient.getLogs({
      address: params.address,
      fromBlock: params.filter.fromBlock,
      toBlock: params.filter.toBlock,
      // @ts-expect-error - Viem types are complex here
      event: params.abi.find((item: unknown) => (item as { name: string }).name === params.functionName),
    });

    return logs.map((log) => ({
      address: log.address,
      topics: log.topics as Hash[],
      data: log.data,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    }));
  }

  watchEvent(params: ContractCallParams & { callback: ProviderEventCallback }): ProviderUnsubscribe {
    const unwatch = this.publicClient.watchContractEvent({
      address: params.address,
      abi: params.abi,
      eventName: params.functionName,
      onLogs: (logs) => {
        logs.forEach((log) => {
          params.callback({
            address: log.address,
            topics: log.topics as Hash[],
            data: log.data,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            logIndex: log.logIndex,
          });
        });
      },
    });

    return unwatch;
  }

  async getBlockNumber(): Promise<bigint> {
    return await this.publicClient.getBlockNumber();
  }

  async getChainId(): Promise<number> {
    return await this.publicClient.getChainId();
  }
}

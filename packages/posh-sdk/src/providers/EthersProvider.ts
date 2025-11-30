/**
 * Ethers.js provider adapter
 * Implements BaseProvider using ethers.js v6
 */

import type { Provider, Signer, TransactionResponse, Log } from 'ethers';
import { ethers } from 'ethers';
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

export interface EthersProviderConfig {
  provider: Provider;
  signer?: Signer;
}

export class EthersProvider implements BaseProvider {
  private provider: Provider;
  private signer?: Signer;

  constructor(config: EthersProviderConfig) {
    this.provider = config.provider;
    this.signer = config.signer;
  }

  async readContract<T = any>(params: ContractCallParams): Promise<T> {
    const contract = new ethers.Contract(
      params.address,
      params.abi,
      this.provider
    );

    const result = await contract[params.functionName](...(params.args || []));
    return result as T;
  }

  async writeContract(params: TransactionParams): Promise<Hash> {
    if (!this.signer) {
      throw new Error('Signer is required for write operations');
    }

    const contract = new ethers.Contract(
      params.address,
      params.abi,
      this.signer
    );

    const tx: TransactionResponse = await contract[params.functionName](
      ...(params.args || []),
      {
        value: params.value,
        gasLimit: params.gas,
      }
    );

    return tx.hash as Hash;
  }

  async waitForTransaction(hash: Hash): Promise<TransactionReceipt> {
    const receipt = await this.provider.waitForTransaction(hash);
    
    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }

    return {
      transactionHash: receipt.hash as Hash,
      blockNumber: BigInt(receipt.blockNumber),
      status: receipt.status === 1 ? 'success' : 'reverted',
      gasUsed: receipt.gasUsed,
      logs: receipt.logs,
    };
  }

  async estimateGas(params: TransactionParams): Promise<bigint> {
    if (!this.signer) {
      throw new Error('Signer is required for gas estimation');
    }

    const contract = new ethers.Contract(
      params.address,
      params.abi,
      this.signer
    );

    const gas = await contract[params.functionName].estimateGas(
      ...(params.args || []),
      {
        value: params.value,
      }
    );

    return gas;
  }

  async getEvents(
    params: ContractCallParams & { filter: ProviderEventFilter }
  ): Promise<ProviderEventLog[]> {
    const contract = new ethers.Contract(
      params.address,
      params.abi,
      this.provider
    );

    const eventFilter = contract.filters[params.functionName]?.();
    
    if (!eventFilter) {
      throw new Error(`Event ${params.functionName} not found in ABI`);
    }

    const logs = await this.provider.getLogs({
      ...eventFilter,
      fromBlock: params.filter.fromBlock ? Number(params.filter.fromBlock) : undefined,
      toBlock: params.filter.toBlock ? Number(params.filter.toBlock) : undefined,
    });

    return logs.map((log) => ({
      address: log.address as Address,
      topics: log.topics as Hash[],
      data: log.data as Hash,
      blockNumber: BigInt(log.blockNumber),
      transactionHash: log.transactionHash as Hash,
      logIndex: log.index,
    }));
  }

  watchEvent(params: ContractCallParams & { callback: ProviderEventCallback }): ProviderUnsubscribe {
    const contract = new ethers.Contract(
      params.address,
      params.abi,
      this.provider
    );

    const eventFilter = contract.filters[params.functionName]?.();
    
    if (!eventFilter) {
      throw new Error(`Event ${params.functionName} not found in ABI`);
    }

    const listener = (log: Log) => {
      params.callback({
        address: log.address as Address,
        topics: log.topics as Hash[],
        data: log.data as Hash,
        blockNumber: BigInt(log.blockNumber),
        transactionHash: log.transactionHash as Hash,
        logIndex: log.index,
      });
    };

    contract.on(eventFilter, listener);

    return () => {
      contract.off(eventFilter, listener);
    };
  }

  async getBlockNumber(): Promise<bigint> {
    const blockNumber = await this.provider.getBlockNumber();
    return BigInt(blockNumber);
  }

  async getChainId(): Promise<number> {
    const network = await this.provider.getNetwork();
    return Number(network.chainId);
  }
}

/**
 * Provider abstractions for blockchain interactions
 * 
 * Core providers (always available):
 * - BaseProvider: Interface for all providers
 * - ViemProvider: Viem-based provider
 * 
 * Optional providers (require peer dependencies):
 * - WagmiProvider: Import from '@human-0/posh-sdk/providers/wagmi'
 * - EthersProvider: Import from '@human-0/posh-sdk/providers/ethers'
 */

export * from './BaseProvider';
export * from './ViemProvider';

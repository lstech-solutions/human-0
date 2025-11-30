---
sidebar_position: 2
title: PoSH SDK
description: TypeScript SDK for Proof of Sustainable Humanity
---

# PoSH SDK

The **@human-0/posh-sdk** is a TypeScript SDK that provides a clean, type-safe interface for interacting with the Proof of Sustainable Humanity (PoSH) smart contracts on Base L2.

:::info Latest Version
Current version: **0.2.0** - Now with provider abstraction and write operations support!
:::

## Features

- 🔐 **Identity Management**: Register and manage human identities on-chain
- 📊 **Proof Queries**: Retrieve and aggregate sustainability proofs
- 🏆 **Score Calculations**: Calculate reputation scores and levels
- 📡 **Event Subscriptions**: Listen to blockchain events in real-time
- ⚡ **Performance**: Built-in caching, batching, and retry logic
- 🎯 **Type Safety**: Full TypeScript support with comprehensive types
- 🔌 **Framework Agnostic**: Works with Viem, Wagmi, ethers.js, or vanilla JS
- ⚛️ **React Hooks**: Optional React integration with hooks and context
- 🔧 **Provider Abstraction**: Unified interface for multiple Ethereum libraries
- ✍️ **Write Operations**: Full support for on-chain transactions with gas estimation

## Installation

```bash
npm install @human-0/posh-sdk
```

### With React Hooks

```bash
npm install @human-0/posh-sdk react @tanstack/react-query
```

### With Wagmi

```bash
npm install @human-0/posh-sdk wagmi viem @tanstack/react-query
```

## Quick Start

### Basic Usage (Read-Only)

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Initialize the client
const client = new PoshClient({
  chainId: 84532, // Base Sepolia
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
});

// Check if an address is registered
const isRegistered = await client.identity.isRegistered('0x...');

// Get humanId for an address
const humanId = await client.identity.getHumanId('0x...');

// Get proofs for a human
const proofs = await client.proofs.getHumanProofs(humanId);

// Calculate total impact
const impact = await client.proofs.getTotalImpact(humanId);

// Get score and level
const score = await client.score.getScore(humanId);
const level = await client.score.getLevel(humanId);
```

### With Provider (Read + Write)

```typescript
import { PoshClient, ViemProvider } from '@human-0/posh-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// Create Viem clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});

// Create provider
const provider = new ViemProvider({
  publicClient,
  walletClient,
});

// Initialize SDK with provider
const client = new PoshClient({
  chainId: 84532,
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
  provider,
});

// Now you can perform write operations
const { hash, humanId } = await client.identity.register();
console.log('Registered with humanId:', humanId);

// Estimate gas before transactions
const gasEstimate = await client.identity.estimateRegisterGas();
console.log('Estimated gas:', gasEstimate);
```

### React Usage

```typescript
import { PoshProvider, useHumanIdentity, useProofs, useScore } from '@human-0/posh-sdk/react';

function App() {
  return (
    <PoshProvider config={config}>
      <IdentityCard />
    </PoshProvider>
  );
}

function IdentityCard() {
  const { data: identity, isLoading } = useHumanIdentity('0x...');
  const { data: proofs } = useProofs(identity?.humanId);
  const { data: score } = useScore(identity?.humanId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Human ID: {identity?.humanId}</h2>
      <p>Score: {score?.score}</p>
      <p>Level: {score?.level.name}</p>
      <p>Proofs: {proofs?.length}</p>
    </div>
  );
}
```

## Core Concepts

### Identity Management

Every user in the PoSH system has a unique `humanId` that is derived from their wallet address. The SDK provides methods to:

- Register new identities
- Check registration status
- Retrieve humanId from wallet address
- Link external identity proofs

### Proofs

Proofs are verified records of sustainable actions. Each proof contains:

- **Impact Type**: Type of sustainability action (renewable energy, carbon avoidance, etc.)
- **Impact Value**: Quantified impact amount
- **Tier**: Quality level (A=verified, B=partial, C=self-reported)
- **Timestamp**: When the proof was created
- **Verification Hash**: Cryptographic proof of verification

### Scores and Levels

The PoSH system calculates reputation scores based on accumulated proofs:

- **Bronze**: 100+ points
- **Silver**: 1,000+ points
- **Gold**: 10,000+ points
- **Platinum**: 100,000+ points
- **Diamond**: 1,000,000+ points

Scores are weighted by proof tier:
- Tier A (Verified): 1.0x multiplier
- Tier B (Partial): 0.5x multiplier
- Tier C (Self-reported): 0.1x multiplier

## API Reference

### PoshClient

Main entry point for the SDK.

```typescript
class PoshClient {
  constructor(config: PoshConfig);
  
  readonly identity: IdentityManager;
  readonly proofs: ProofManager;
  readonly score: ScoreManager;
  readonly events: EventManager;
}
```

### IdentityManager

```typescript
class IdentityManager {
  // Read operations
  isRegistered(address: Address): Promise<boolean>;
  getHumanId(address: Address): Promise<HumanId | null>;
  getWallet(humanId: HumanId): Promise<Address>;
  getRegistrationTime(humanId: HumanId): Promise<Date>;
  
  // Write operations (requires provider)
  register(): Promise<RegisterResult>;
  linkExternalProof(proofHash: string, provider: string): Promise<TransactionResult>;
  
  // Gas estimation
  estimateRegisterGas(): Promise<bigint>;
  estimateLinkProofGas(): Promise<bigint>;
}
```

### ProofManager

```typescript
class ProofManager {
  // Get all proofs for a human
  getHumanProofs(
    humanId: HumanId,
    options?: ProofQueryOptions
  ): Promise<Proof[]>;
  
  // Get total impact
  getTotalImpact(
    humanId: HumanId,
    impactType?: ImpactType
  ): Promise<ImpactTotal>;
  
  // Batch operations
  batchGetProofs(proofIds: string[]): Promise<Proof[]>;
}
```

### ScoreManager

```typescript
class ScoreManager {
  // Get current score
  getScore(humanId: HumanId): Promise<number>;
  
  // Get level information
  getLevel(humanId: HumanId): Promise<ScoreLevel>;
  
  // Check if meets threshold
  meetsThreshold(humanId: HumanId, threshold: number): Promise<boolean>;
}
```

### EventManager

```typescript
class EventManager {
  // Subscribe to events
  onHumanRegistered(callback: (event: HumanRegisteredEvent) => void): Unsubscribe;
  onProofRegistered(callback: (event: ProofRegisteredEvent) => void): Unsubscribe;
  onIdentityLinked(callback: (event: IdentityLinkedEvent) => void): Unsubscribe;
  
  // Query historical events
  getHumanRegisteredEvents(filter?: EventFilter): Promise<HumanRegisteredEvent[]>;
}
```

## Provider Abstraction

The SDK supports multiple Ethereum libraries through a unified provider interface.

### Available Providers

#### ViemProvider (Recommended)

```typescript
import { ViemProvider } from '@human-0/posh-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});

const provider = new ViemProvider({
  publicClient,
  walletClient,
});
```

#### WagmiProvider

```typescript
import { WagmiProvider } from '@human-0/posh-sdk';
import { useConfig } from 'wagmi';

function MyComponent() {
  const config = useConfig();
  const provider = new WagmiProvider({ config });
  
  const client = new PoshClient({
    chainId: 84532,
    contracts: { /* ... */ },
    provider,
  });
}
```

#### EthersProvider

```typescript
import { EthersProvider } from '@human-0/posh-sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const ethersProvider = new EthersProvider({
  provider,
  signer,
});
```

## Configuration

### Basic Configuration

```typescript
const client = new PoshClient({
  chainId: 84532, // Base Sepolia
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
});
```

### Advanced Configuration

```typescript
const client = new PoshClient({
  chainId: 8453, // Base Mainnet
  rpcUrl: 'https://mainnet.base.org',
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
  cache: {
    enabled: true,
    ttl: 60000, // 1 minute
    maxSize: 1000,
  },
  retry: {
    enabled: true,
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000,
  },
});
```

## Examples

### Register a New Identity

```typescript
import { PoshClient, ViemProvider } from '@human-0/posh-sdk';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

// Create clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: custom(window.ethereum),
});

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum),
});

// Create provider
const provider = new ViemProvider({
  publicClient,
  walletClient,
});

// Initialize client with provider
const client = new PoshClient({
  chainId: 84532,
  contracts: { /* ... */ },
  provider,
});

// Register identity
const result = await client.identity.register();
console.log('Human ID:', result.humanId);
console.log('Transaction hash:', result.hash);
```

### Query Proofs with Filters

```typescript
const proofs = await client.proofs.getHumanProofs(humanId, {
  impactType: 'renewable_energy',
  tier: ProofTier.A,
  startDate: new Date('2024-01-01'),
  limit: 10,
});
```

### Subscribe to Events

```typescript
const unsubscribe = client.events.onProofRegistered((event) => {
  console.log('New proof:', event.proofId);
  console.log('Impact:', event.impactValue);
});

// Cleanup
unsubscribe();
```

## React Hooks

### useHumanIdentity

```typescript
const { data, isLoading, error } = useHumanIdentity(address);
```

### useProofs

```typescript
const { data, isLoading, error } = useProofs(humanId, {
  impactType: 'renewable_energy',
});
```

### useScore

```typescript
const { data, isLoading, error } = useScore(humanId);
```

## Error Handling

The SDK provides typed errors for better error handling:

```typescript
import { ValidationError, ContractError, NetworkError } from '@human-0/posh-sdk';

try {
  await client.identity.register(signer);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof ContractError) {
    console.error('Contract error:', error.revertReason);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  PoshConfig,
  Identity,
  Proof,
  ProofTier,
  ImpactType,
  ScoreLevel,
} from '@human-0/posh-sdk';
```

## What's New in 0.2.0

- **Provider Abstraction**: Unified interface for Viem, Wagmi, and ethers.js
- **Write Operations**: Full support for on-chain transactions
- **Gas Estimation**: Estimate gas costs before transactions
- **Enhanced Type Safety**: Improved TypeScript types throughout
- **Better Error Handling**: More descriptive errors for provider operations

See the [CHANGELOG](https://github.com/lstech-solutions/human-0.com/blob/main/packages/posh-sdk/CHANGELOG.md) for full details.

## Resources

- **GitHub**: [lstech-solutions/human-0.com](https://github.com/lstech-solutions/human-0.com)
- **NPM**: [@human-0/posh-sdk](https://www.npmjs.com/package/@human-0/posh-sdk)
- **Setup Guide**: [SETUP.md](https://github.com/lstech-solutions/human-0.com/blob/main/packages/posh-sdk/SETUP.md)
- **Examples**: [examples/](https://github.com/lstech-solutions/human-0.com/tree/main/packages/posh-sdk/docs/examples)
- **Changelog**: [CHANGELOG.md](https://github.com/lstech-solutions/human-0.com/blob/main/packages/posh-sdk/CHANGELOG.md)

## Support

For questions and support:
- Open an issue on [GitHub](https://github.com/human-0/human-0.com/issues)
- Join our community Discord
- Check the [troubleshooting guide](https://github.com/human-0/human-0.com/blob/main/packages/posh-sdk/SETUP.md#troubleshooting)

## License

MIT License - see [LICENSE](https://github.com/human-0/human-0.com/blob/main/packages/posh-sdk/LICENSE) for details.

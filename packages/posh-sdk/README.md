# @human-0/posh-sdk

> TypeScript SDK for Proof of Sustainable Humanity (PoSH) identity management - Blockchain Agnostic

[![npm version](https://img.shields.io/npm/v/@human-0/posh-sdk.svg)](https://www.npmjs.com/package/@human-0/posh-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Overview

The **@human-0/posh-sdk** provides a clean, type-safe interface for interacting with the Proof of Sustainable Humanity (PoSH) smart contracts. It enables developers to integrate human identity verification and sustainability proof management into their applications.

**Blockchain Agnostic**: While initially deployed on Base L2, the SDK is designed to work with any EVM-compatible blockchain. Simply configure the appropriate chain ID and contract addresses for your target network.

**Perfect for:**
- 🌍 Sustainability-focused dApps
- 🔐 Identity verification systems
- 📊 Impact tracking applications
- 🏆 Reputation and scoring systems
- 🎯 Web3 social platforms

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

### Peer Dependencies

The SDK has optional peer dependencies based on your use case:

```bash
# For React applications
npm install react @tanstack/react-query

# For Wagmi integration
npm install wagmi viem

# For Viem integration
npm install viem

# For ethers.js integration
npm install ethers
```

## Quick Start

### Basic Usage (Read-Only)

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Initialize the client with default Base Sepolia configuration
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

## Configuration

### Default Configuration

The SDK is blockchain agnostic and can be configured for any EVM-compatible chain:

```typescript
// Example: Base Sepolia (Testnet)
const client = new PoshClient({
  chainId: 84532,
  rpcUrl: 'https://sepolia.base.org',
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
});

// Example: Ethereum Mainnet
const client = new PoshClient({
  chainId: 1,
  rpcUrl: 'https://eth.llamarpc.com',
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
});

// Example: Polygon
const client = new PoshClient({
  chainId: 137,
  rpcUrl: 'https://polygon-rpc.com',
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
  
  getConfig(): PoshConfig;
  updateConfig(config: Partial<PoshConfig>): void;
}
```

### IdentityManager

Handles identity operations.

```typescript
class IdentityManager {
  // Read operations
  isRegistered(address: Address): Promise<boolean>;
  getHumanId(address: Address): Promise<HumanId | null>;
  getWallet(humanId: HumanId): Promise<Address>;
  getRegistrationTime(humanId: HumanId): Promise<Date>;
  getExternalProofs(humanId: HumanId): Promise<ExternalProof[]>;
  
  // Write operations
  register(signer: Signer): Promise<RegisterResult>;
  linkExternalProof(signer: Signer, proofHash: string, provider: string): Promise<TransactionResult>;
  
  // Gas estimation
  estimateRegisterGas(): Promise<bigint>;
  estimateLinkProofGas(): Promise<bigint>;
}
```

### ProofManager

Handles proof queries and aggregations.

```typescript
class ProofManager {
  getProof(proofId: string): Promise<Proof>;
  getHumanProofs(humanId: HumanId, options?: ProofQueryOptions): Promise<Proof[]>;
  getProofCount(humanId: HumanId): Promise<number>;
  getTotalImpact(humanId: HumanId, impactType?: ImpactType): Promise<ImpactTotal>;
  
  batchGetProofs(proofIds: string[]): Promise<Proof[]>;
  batchGetHumanProofs(humanIds: HumanId[]): Promise<Map<HumanId, Proof[]>>;
}
```

### ScoreManager

Handles score calculations.

```typescript
class ScoreManager {
  getScore(humanId: HumanId): Promise<number>;
  getLevel(humanId: HumanId): Promise<ScoreLevel>;
  meetsThreshold(humanId: HumanId, threshold: number): Promise<boolean>;
  getTierBreakdown(humanId: HumanId): Promise<TierBreakdown>;
}
```

### EventManager

Handles blockchain event subscriptions.

```typescript
class EventManager {
  onHumanRegistered(callback: (event: HumanRegisteredEvent) => void): Unsubscribe;
  onProofRegistered(callback: (event: ProofRegisteredEvent) => void): Unsubscribe;
  onIdentityLinked(callback: (event: IdentityLinkedEvent) => void): Unsubscribe;
  
  getHumanRegisteredEvents(filter?: EventFilter): Promise<HumanRegisteredEvent[]>;
  getProofRegisteredEvents(filter?: EventFilter): Promise<ProofRegisteredEvent[]>;
  getIdentityLinkedEvents(filter?: EventFilter): Promise<IdentityLinkedEvent[]>;
}
```

## Examples

See the [examples directory](./docs/examples) for more detailed examples:

- [Vanilla JavaScript](./docs/examples/vanilla.md)
- [React with Wagmi](./docs/examples/react-wagmi.md)
- [Viem Integration](./docs/examples/viem.md)
- [ethers.js Integration](./docs/examples/ethers.md)

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Type Checking

```bash
npm run typecheck
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Links

- [Documentation](https://human-0.com/docs/posh)
- [GitHub Repository](https://github.com/human-0/human-0.com)
- [NPM Package](https://www.npmjs.com/package/@human-0/posh-sdk)

## Support

For questions and support, please open an issue on GitHub or join our community channels.

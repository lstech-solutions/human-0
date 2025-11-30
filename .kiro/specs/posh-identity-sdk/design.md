# Design Document

## Overview

The **@human-0/posh-sdk** is a standalone TypeScript SDK that provides a clean, type-safe interface for interacting with the Proof of Sustainable Humanity (PoSH) smart contracts. The SDK is designed to be framework-agnostic at its core while providing optional React-specific hooks for seamless integration with React applications.

The SDK follows a layered architecture:
- **Core Layer**: Framework-agnostic contract interaction logic
- **Provider Layer**: Abstraction over different Web3 libraries (Wagmi, Viem, ethers.js)
- **React Layer**: Optional React hooks and context providers
- **Types Layer**: Comprehensive TypeScript definitions

Key design goals:
- **Zero-config defaults**: Works out-of-the-box with Base Sepolia
- **Type safety**: Full TypeScript support with generated contract types
- **Performance**: Built-in caching, batching, and retry logic
- **Developer experience**: Clear errors, comprehensive docs, excellent IDE support
- **Compatibility**: Works with Wagmi, Viem, ethers.js, and vanilla JavaScript

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  (React App, Vue App, Node.js Script, etc.)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    @human-0/posh-sdk                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Hooks                               │    │
│  │  useHumanIdentity, useProofs, useScore, useEvents      │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                         │
│  ┌────────────────────▼───────────────────────────────────┐    │
│  │                  Core SDK                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │    │
│  │  │  Identity    │  │    Proofs    │  │    Score    │  │    │
│  │  │   Manager    │  │   Manager    │  │   Manager   │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │    │
│  │         │                 │                 │          │    │
│  │         └─────────────────┼─────────────────┘          │    │
│  │                           │                            │    │
│  │  ┌────────────────────────▼──────────────────────┐    │    │
│  │  │          Contract Abstraction Layer           │    │    │
│  │  │  (TypeChain-generated types + wrappers)       │    │    │
│  │  └────────────────────┬──────────────────────────┘    │    │
│  │                       │                                │    │
│  │  ┌────────────────────▼──────────────────────────┐    │    │
│  │  │          Provider Adapter Layer               │    │    │
│  │  │  (Wagmi / Viem / ethers.js abstraction)       │    │    │
│  │  └────────────────────┬──────────────────────────┘    │    │
│  │                       │                                │    │
│  │  ┌────────────────────▼──────────────────────────┐    │    │
│  │  │          Utilities & Helpers                  │    │    │
│  │  │  Cache, Retry, Validation, Error Handling     │    │    │
│  │  └───────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                              │
│  Base L2 (Sepolia / Mainnet)                                    │
│  HumanIdentity, ProofRegistry, PoSHNFT, HumanScore             │
└─────────────────────────────────────────────────────────────────┘
```

### Package Structure

```
packages/posh-sdk/
├── src/
│   ├── core/
│   │   ├── IdentityManager.ts       # Identity operations
│   │   ├── ProofManager.ts          # Proof queries
│   │   ├── ScoreManager.ts          # Score calculations
│   │   ├── EventManager.ts          # Event subscriptions
│   │   └── PoshClient.ts            # Main SDK client
│   │
│   ├── contracts/
│   │   ├── abis/                    # Contract ABIs
│   │   ├── addresses.ts             # Deployed addresses
│   │   └── types.ts                 # TypeChain types
│   │
│   ├── providers/
│   │   ├── BaseProvider.ts          # Provider interface
│   │   ├── WagmiProvider.ts         # Wagmi adapter
│   │   ├── ViemProvider.ts          # Viem adapter
│   │   └── EthersProvider.ts        # ethers.js adapter
│   │
│   ├── react/
│   │   ├── PoshProvider.tsx         # React context
│   │   ├── useHumanIdentity.ts      # Identity hook
│   │   ├── useProofs.ts             # Proofs hook
│   │   ├── useScore.ts              # Score hook
│   │   └── useEvents.ts             # Events hook
│   │
│   ├── utils/
│   │   ├── cache.ts                 # Caching logic
│   │   ├── retry.ts                 # Retry logic
│   │   ├── validation.ts            # Input validation
│   │   ├── errors.ts                # Custom errors
│   │   └── formatting.ts            # Data formatting
│   │
│   ├── types/
│   │   ├── config.ts                # Configuration types
│   │   ├── identity.ts              # Identity types
│   │   ├── proof.ts                 # Proof types
│   │   └── index.ts                 # Exported types
│   │
│   └── index.ts                     # Main entry point
│
├── test/
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   └── e2e/                         # E2E tests
│
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   └── examples/
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## Components and Interfaces

### Core Components

#### PoshClient

The main entry point for the SDK. Provides a unified interface for all PoSH operations.

```typescript
class PoshClient {
  constructor(config: PoshConfig);
  
  // Sub-managers
  readonly identity: IdentityManager;
  readonly proofs: ProofManager;
  readonly score: ScoreManager;
  readonly events: EventManager;
  
  // Configuration
  getConfig(): PoshConfig;
  updateConfig(config: Partial<PoshConfig>): void;
}
```

#### IdentityManager

Handles all identity-related operations.

```typescript
class IdentityManager {
  // Read operations
  async isRegistered(address: Address): Promise<boolean>;
  async getHumanId(address: Address): Promise<HumanId | null>;
  async getWallet(humanId: HumanId): Promise<Address>;
  async getRegistrationTime(humanId: HumanId): Promise<Date>;
  async getExternalProofs(humanId: HumanId): Promise<ExternalProof[]>;
  
  // Write operations
  async register(signer: Signer): Promise<RegisterResult>;
  async linkExternalProof(
    signer: Signer,
    proofHash: string,
    provider: string,
    signature?: string
  ): Promise<TransactionResult>;
  
  // Gas estimation
  async estimateRegisterGas(): Promise<bigint>;
  async estimateLinkProofGas(): Promise<bigint>;
}
```

#### ProofManager

Handles proof queries and aggregations.

```typescript
class ProofManager {
  // Query operations
  async getProof(proofId: string): Promise<Proof>;
  async getHumanProofs(humanId: HumanId, options?: ProofQueryOptions): Promise<Proof[]>;
  async getProofCount(humanId: HumanId): Promise<number>;
  async getTotalImpact(humanId: HumanId, impactType?: ImpactType): Promise<ImpactTotal>;
  
  // Batch operations
  async batchGetProofs(proofIds: string[]): Promise<Proof[]>;
  async batchGetHumanProofs(humanIds: HumanId[]): Promise<Map<HumanId, Proof[]>>;
  
  // Filtering and aggregation
  async filterProofs(humanId: HumanId, filter: ProofFilter): Promise<Proof[]>;
  async aggregateImpact(humanId: HumanId, options: AggregateOptions): Promise<ImpactSummary>;
}
```

#### ScoreManager

Handles score calculations and level queries.

```typescript
class ScoreManager {
  // Score operations
  async getScore(humanId: HumanId): Promise<number>;
  async getLevel(humanId: HumanId): Promise<ScoreLevel>;
  async meetsThreshold(humanId: HumanId, threshold: number): Promise<boolean>;
  async getTierBreakdown(humanId: HumanId): Promise<TierBreakdown>;
  
  // Calculations
  calculateWeightedScore(proofs: Proof[]): number;
  calculateTimeDecay(proof: Proof, now?: Date): number;
  getLevelFromScore(score: number): ScoreLevel;
}
```

#### EventManager

Handles blockchain event subscriptions.

```typescript
class EventManager {
  // Event subscriptions
  onHumanRegistered(callback: (event: HumanRegisteredEvent) => void): Unsubscribe;
  onProofRegistered(callback: (event: ProofRegisteredEvent) => void): Unsubscribe;
  onIdentityLinked(callback: (event: IdentityLinkedEvent) => void): Unsubscribe;
  
  // Event queries
  async getHumanRegisteredEvents(filter?: EventFilter): Promise<HumanRegisteredEvent[]>;
  async getProofRegisteredEvents(filter?: EventFilter): Promise<ProofRegisteredEvent[]>;
  async getIdentityLinkedEvents(filter?: EventFilter): Promise<IdentityLinkedEvent[]>;
}
```

### Provider Abstraction

The SDK abstracts over different Web3 libraries through a common interface:

```typescript
interface BaseProvider {
  // Read operations
  readContract<T>(params: ReadContractParams): Promise<T>;
  batchReadContracts<T>(params: ReadContractParams[]): Promise<T[]>;
  
  // Write operations
  writeContract(params: WriteContractParams): Promise<TransactionHash>;
  waitForTransaction(hash: TransactionHash): Promise<TransactionReceipt>;
  
  // Gas estimation
  estimateGas(params: WriteContractParams): Promise<bigint>;
  
  // Event operations
  watchContractEvent(params: WatchEventParams): Unsubscribe;
  getContractEvents(params: GetEventsParams): Promise<Event[]>;
  
  // Utilities
  getBlockNumber(): Promise<number>;
  getChainId(): Promise<number>;
}
```

## Data Models

### Core Types

```typescript
// Identity types
type Address = `0x${string}`;
type HumanId = `0x${string}`;

interface Identity {
  humanId: HumanId;
  wallet: Address;
  registrationTime: Date;
  externalProofs: ExternalProof[];
}

interface ExternalProof {
  hash: string;
  provider: string;
  linkedAt: Date;
}

// Proof types
interface Proof {
  proofId: string;
  humanId: HumanId;
  impactType: ImpactType;
  impactValue: bigint;
  methodologyHash: string;
  verificationHash: string;
  timestamp: Date;
  tier: ProofTier;
}

enum ProofTier {
  A = 1,  // Verified (1.0x multiplier)
  B = 2,  // Partial (0.5x multiplier)
  C = 3,  // Self-reported (0.1x multiplier)
}

type ImpactType = 
  | 'renewable_energy'
  | 'carbon_avoidance'
  | 'sustainable_transport'
  | 'waste_reduction'
  | 'water_conservation';

// Score types
interface ScoreLevel {
  level: number;
  name: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  minScore: number;
  maxScore: number | null;
}

interface TierBreakdown {
  tierA: number;
  tierB: number;
  tierC: number;
  total: number;
}

interface ImpactSummary {
  totalImpact: bigint;
  byType: Record<ImpactType, bigint>;
  byTier: TierBreakdown;
  proofCount: number;
}

// Configuration types
interface PoshConfig {
  // Network configuration
  chainId: number;
  rpcUrl?: string;
  
  // Contract addresses
  contracts: {
    humanIdentity: Address;
    proofRegistry: Address;
    poshNFT: Address;
    humanScore: Address;
  };
  
  // Provider
  provider?: BaseProvider;
  
  // Cache configuration
  cache?: {
    enabled: boolean;
    ttl: number; // milliseconds
    maxSize: number;
  };
  
  // Retry configuration
  retry?: {
    enabled: boolean;
    maxAttempts: number;
    backoff: 'linear' | 'exponential';
    initialDelay: number;
  };
}

// Transaction types
interface TransactionResult {
  hash: TransactionHash;
  wait: () => Promise<TransactionReceipt>;
}

interface RegisterResult extends TransactionResult {
  humanId: HumanId;
}

// Query options
interface ProofQueryOptions {
  impactType?: ImpactType;
  tier?: ProofTier;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

interface ProofFilter {
  impactTypes?: ImpactType[];
  tiers?: ProofTier[];
  minValue?: bigint;
  maxValue?: bigint;
  dateRange?: { start: Date; end: Date };
}

interface AggregateOptions {
  groupBy?: 'type' | 'tier' | 'month';
  applyWeighting?: boolean;
  applyTimeDecay?: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Installation completeness
*For any* npm installation of @human-0/posh-sdk, all required dependencies should be installed and TypeScript types should be available
**Validates: Requirements 1.1, 1.2**

### Property 2: Configuration validation
*For any* SDK initialization with invalid configuration parameters, the system should throw a descriptive validation error before attempting blockchain operations
**Validates: Requirements 2.5**

### Property 3: Registration status consistency
*For any* wallet address, querying registration status multiple times within the cache TTL should return the same result without additional blockchain calls
**Validates: Requirements 3.4**

### Property 4: Registration idempotency
*For any* wallet address that is already registered, attempting to register again should throw an AlreadyRegistered error without submitting a transaction
**Validates: Requirements 4.4**

### Property 5: HumanId determinism
*For any* registered wallet address, the humanId returned should be deterministic and consistent across multiple queries
**Validates: Requirements 5.1, 5.4**

### Property 6: Proof query completeness
*For any* humanId with proofs, querying without filters should return all proofs with complete data (impactType, impactValue, tier, timestamp, methodologyHash, verificationHash)
**Validates: Requirements 6.1, 6.5**

### Property 7: Impact calculation correctness
*For any* set of proofs with the same impact type, the total impact should equal the sum of all individual impact values
**Validates: Requirements 7.1**

### Property 8: Tier weighting consistency
*For any* proof set, when tier weighting is enabled, the weighted score should apply the correct multipliers (A=1.0x, B=0.5x, C=0.1x) to each proof's impact value
**Validates: Requirements 7.4**

### Property 9: External proof linking
*For any* registered humanId, linking an external proof should emit an IdentityLinked event and the proof should appear in subsequent queries
**Validates: Requirements 8.3**

### Property 10: Score level mapping
*For any* score value, the level returned should match the correct tier boundaries (Bronze=100+, Silver=1000+, Gold=10000+, Platinum=100000+, Diamond=1000000+)
**Validates: Requirements 9.2**

### Property 11: Provider compatibility
*For any* supported Web3 library (Wagmi, Viem, ethers.js), the SDK should accept compatible signers/providers and maintain consistent behavior
**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

### Property 12: Type safety
*For any* SDK function call with incorrect parameter types, the TypeScript compiler should catch the error at compile time
**Validates: Requirements 11.3**

### Property 13: Error message clarity
*For any* contract call failure, the error thrown should include the contract error name, reason, and suggested remediation
**Validates: Requirements 12.1, 12.5**

### Property 14: Event subscription cleanup
*For any* event subscription, calling the unsubscribe function should stop emitting events and clean up resources
**Validates: Requirements 13.4**

### Property 15: Gas estimation accuracy
*For any* transaction, the estimated gas should be within 20% of the actual gas used when the transaction is executed
**Validates: Requirements 14.1, 14.2**

### Property 16: Batch query efficiency
*For any* set of N read operations, batching should result in fewer than N RPC calls
**Validates: Requirements 15.1, 15.2**

### Property 17: React hook integration
*For any* React component using SDK hooks, the hooks should integrate with React Query for caching and Wagmi for wallet connection
**Validates: Requirements 16.2, 16.3**

### Property 18: Retry logic resilience
*For any* rate-limited RPC endpoint, the SDK should implement exponential backoff and successfully complete the operation after retries
**Validates: Requirements 19.1**

### Property 19: Expo Web compatibility
*For any* integration with the Expo Web application, the SDK should work with the existing Wagmi configuration and not conflict with dependencies
**Validates: Requirements 20.1, 20.4**

## Error Handling

### Error Hierarchy

```typescript
class PoshSDKError extends Error {
  code: string;
  details?: unknown;
  remediation?: string;
}

class ValidationError extends PoshSDKError {
  // Invalid input parameters
}

class ContractError extends PoshSDKError {
  // Contract call failures
  contractName: string;
  functionName: string;
  revertReason?: string;
}

class NetworkError extends PoshSDKError {
  // Network/RPC failures
  chainId: number;
  rpcUrl: string;
}

class ConfigurationError extends PoshSDKError {
  // Invalid SDK configuration
}
```

### Error Codes

```typescript
enum ErrorCode {
  // Validation errors
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_HUMAN_ID = 'INVALID_HUMAN_ID',
  INVALID_CONFIG = 'INVALID_CONFIG',
  
  // Contract errors
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  NOT_REGISTERED = 'NOT_REGISTERED',
  HUMAN_NOT_FOUND = 'HUMAN_NOT_FOUND',
  PROOF_NOT_FOUND = 'PROOF_NOT_FOUND',
  
  // Network errors
  RPC_ERROR = 'RPC_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Provider errors
  PROVIDER_NOT_CONNECTED = 'PROVIDER_NOT_CONNECTED',
  UNSUPPORTED_PROVIDER = 'UNSUPPORTED_PROVIDER',
  WALLET_DISCONNECTED = 'WALLET_DISCONNECTED',
}
```

## Testing Strategy

### Unit Testing

Unit tests will cover individual functions and classes in isolation:

- **IdentityManager**: Test registration logic, humanId generation, external proof linking
- **ProofManager**: Test proof queries, filtering, aggregation logic
- **ScoreManager**: Test score calculations, tier weighting, time decay
- **EventManager**: Test event subscription and unsubscription
- **Provider Adapters**: Test each adapter's implementation of BaseProvider
- **Utilities**: Test caching, retry logic, validation, formatting

Tools: **Vitest** for fast unit testing with TypeScript support

### Property-Based Testing

Property-based tests will verify universal properties across many inputs using **fast-check**:

- Generate random wallet addresses and verify registration status consistency
- Generate random proof sets and verify impact calculation correctness
- Generate random scores and verify level mapping accuracy
- Generate random configurations and verify validation behavior
- Generate random provider types and verify compatibility

Configuration: Each property test will run a minimum of 100 iterations

### Integration Testing

Integration tests will verify the SDK works correctly with real blockchain interactions:

- Deploy contracts to a local Hardhat network
- Test full registration flow: connect wallet → register → verify humanId
- Test proof submission and querying flow
- Test event subscriptions with real contract events
- Test batch operations and caching behavior
- Test error handling with reverted transactions

Tools: **Hardhat** for local blockchain, **Vitest** for test runner

### End-to-End Testing

E2E tests will verify the SDK works with deployed testnet contracts:

- Test against Base Sepolia testnet
- Verify SDK works with real RPC endpoints
- Test rate limiting and retry logic
- Test gas estimation accuracy
- Verify React hooks work in a real React application

Tools: **Playwright** for browser testing, **Vitest** for Node.js testing

### Test Coverage Goals

- Minimum 80% code coverage
- 100% coverage of public API methods
- All error paths tested
- All edge cases covered

### CI/CD Testing

All tests will run automatically on:
- Pull requests
- Commits to main branch
- Pre-release tags

Test matrix:
- Node.js versions: 18.x, 20.x, 22.x
- TypeScript versions: 5.0+
- React versions: 18.x, 19.x (for React hooks)

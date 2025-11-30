# Requirements Document

## Introduction

This document specifies the requirements for a standalone, framework-agnostic TypeScript SDK for identity management within the HUMΛN-Ø Proof of Sustainable Humanity (PoSH) system. The SDK will provide a clean, type-safe interface for interacting with PoSH smart contracts, managing human identities, and submitting/querying sustainability proofs. It must be publishable to npm, follow industry standards, and integrate seamlessly with the existing Expo Web application and deployed smart contracts.

## Glossary

- **PoSH**: Proof of Sustainable Humanity - a cryptographic primitive for verifying human-scale sustainability contributions
- **SDK**: Software Development Kit - a collection of tools, libraries, and documentation for developers
- **humanId**: A pseudonymous identifier (bytes32) representing a unique human in the PoSH system
- **MRV**: Measurement, Reporting, and Verification - the process of validating sustainability claims
- **Proof**: A verified record of a sustainable action stored on-chain
- **Tier**: Quality classification of proofs (A=verified, B=partial, C=self-reported)
- **Oracle**: An authorized entity that submits verified proofs to the blockchain
- **Soulbound NFT**: A non-transferable NFT representing aggregated sustainability impact
- **Base L2**: Base blockchain Layer 2 network where PoSH contracts are deployed
- **Wagmi**: React hooks library for Ethereum interactions
- **Viem**: TypeScript Ethereum library for low-level blockchain operations
- **TypeChain**: Tool for generating TypeScript bindings from Solidity contracts
- **Framework-agnostic**: Usable with any JavaScript framework (React, Vue, Angular, vanilla JS)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to install the SDK via npm, so that I can quickly integrate PoSH identity management into my application.

#### Acceptance Criteria

1. WHEN a developer runs `npm install @human-0/posh-sdk` THEN the SDK SHALL be installed with all required dependencies
2. WHEN the SDK is imported THEN the system SHALL provide TypeScript type definitions automatically
3. WHEN the SDK is used in a Node.js environment THEN the system SHALL function without browser-specific dependencies
4. WHEN the SDK is used in a browser environment THEN the system SHALL function without Node.js-specific dependencies
5. WHERE the SDK is published to npm THEN the package SHALL follow semantic versioning

### Requirement 2

**User Story:** As a developer, I want to initialize the SDK with my blockchain configuration, so that I can connect to the correct network and contracts.

#### Acceptance Criteria

1. WHEN a developer provides a network configuration THEN the SDK SHALL validate the configuration parameters
2. WHEN a developer provides contract addresses THEN the SDK SHALL store them for subsequent operations
3. WHEN a developer provides an RPC URL THEN the SDK SHALL use it for blockchain queries
4. WHEN a developer omits optional configuration THEN the SDK SHALL use sensible defaults for Base Sepolia testnet
5. WHEN invalid configuration is provided THEN the SDK SHALL throw a descriptive error

### Requirement 3

**User Story:** As a developer, I want to check if a wallet address has a registered identity, so that I can determine if a user needs to register.

#### Acceptance Criteria

1. WHEN a developer queries with a valid wallet address THEN the SDK SHALL return a boolean indicating registration status
2. WHEN a developer queries with an invalid address format THEN the SDK SHALL throw a validation error
3. WHEN the blockchain query fails THEN the SDK SHALL throw an error with the underlying reason
4. WHEN the query succeeds THEN the SDK SHALL cache the result for a configurable duration
5. WHEN a developer provides a custom RPC provider THEN the SDK SHALL use it for the query

### Requirement 4

**User Story:** As a developer, I want to register a new human identity for a wallet, so that users can participate in the PoSH system.

#### Acceptance Criteria

1. WHEN a developer calls the register function with a signer THEN the SDK SHALL submit a transaction to the HumanIdentity contract
2. WHEN the registration transaction is submitted THEN the SDK SHALL return a transaction hash
3. WHEN the registration transaction is confirmed THEN the SDK SHALL return the newly created humanId
4. WHEN a wallet is already registered THEN the SDK SHALL throw an AlreadyRegistered error
5. WHEN the transaction fails THEN the SDK SHALL throw an error with gas estimation details

### Requirement 5

**User Story:** As a developer, I want to retrieve the humanId for a wallet address, so that I can identify users in the PoSH system.

#### Acceptance Criteria

1. WHEN a developer queries with a registered wallet address THEN the SDK SHALL return the corresponding humanId as a hex string
2. WHEN a developer queries with an unregistered wallet address THEN the SDK SHALL return null
3. WHEN the blockchain is unavailable THEN the SDK SHALL throw a network error
4. WHEN multiple queries are made for the same address THEN the SDK SHALL use cached results when available
5. WHEN a developer forces a fresh query THEN the SDK SHALL bypass the cache

### Requirement 6

**User Story:** As a developer, I want to retrieve all proofs for a humanId, so that I can display a user's sustainability impact history.

#### Acceptance Criteria

1. WHEN a developer queries with a valid humanId THEN the SDK SHALL return an array of proof objects
2. WHEN a humanId has no proofs THEN the SDK SHALL return an empty array
3. WHEN a developer specifies a proof type filter THEN the SDK SHALL return only proofs matching that type
4. WHEN a developer specifies a date range THEN the SDK SHALL return only proofs within that range
5. WHEN proof data is retrieved THEN the SDK SHALL include all fields: impactType, impactValue, tier, timestamp, methodologyHash, verificationHash

### Requirement 7

**User Story:** As a developer, I want to calculate the total impact for a humanId by type, so that I can show aggregated sustainability metrics.

#### Acceptance Criteria

1. WHEN a developer queries with a humanId and impact type THEN the SDK SHALL return the sum of all impact values for that type
2. WHEN no proofs exist for the specified type THEN the SDK SHALL return zero
3. WHEN a developer queries without specifying a type THEN the SDK SHALL return totals grouped by all impact types
4. WHEN tier weighting is enabled THEN the SDK SHALL apply multipliers (A=1.0x, B=0.5x, C=0.1x) to impact values
5. WHEN the calculation completes THEN the SDK SHALL return values in canonical units with proper precision

### Requirement 8

**User Story:** As a developer, I want to link external identity proofs to a humanId, so that users can strengthen their identity verification.

#### Acceptance Criteria

1. WHEN a developer submits an external proof hash with a provider name THEN the SDK SHALL call the linkExternalProof function
2. WHEN the linking transaction is submitted THEN the SDK SHALL return a transaction hash
3. WHEN the transaction is confirmed THEN the SDK SHALL emit an IdentityLinked event
4. WHEN the wallet is not registered THEN the SDK SHALL throw a NotRegistered error
5. WHEN a signature is provided THEN the SDK SHALL include it in the transaction payload

### Requirement 9

**User Story:** As a developer, I want to retrieve a human's score and level, so that I can display reputation information in my application.

#### Acceptance Criteria

1. WHEN a developer queries with a humanId THEN the SDK SHALL return the current score as a number
2. WHEN a developer queries for the level THEN the SDK SHALL return the level name and tier (Bronze, Silver, Gold, Platinum, Diamond)
3. WHEN a humanId has no proofs THEN the SDK SHALL return a score of zero and level of "None"
4. WHEN score calculation includes time decay THEN the SDK SHALL apply the decay formula correctly
5. WHEN tier breakdown is requested THEN the SDK SHALL return counts of proofs by tier (A, B, C)

### Requirement 10

**User Story:** As a developer, I want the SDK to work with popular Ethereum libraries, so that I can integrate it with my existing Web3 stack.

#### Acceptance Criteria

1. WHEN a developer uses Wagmi hooks THEN the SDK SHALL accept Wagmi-compatible signers and providers
2. WHEN a developer uses Viem clients THEN the SDK SHALL accept Viem WalletClient and PublicClient instances
3. WHEN a developer uses ethers.js THEN the SDK SHALL accept ethers Signer and Provider instances
4. WHEN a developer switches between libraries THEN the SDK SHALL maintain consistent behavior
5. WHEN an unsupported provider type is used THEN the SDK SHALL throw a clear error message

### Requirement 11

**User Story:** As a developer, I want comprehensive TypeScript types, so that I can catch errors at compile time and have excellent IDE autocomplete.

#### Acceptance Criteria

1. WHEN a developer imports SDK functions THEN the system SHALL provide full type definitions for all parameters and return values
2. WHEN a developer uses SDK types THEN the system SHALL export all relevant interfaces and types
3. WHEN a developer makes a type error THEN the TypeScript compiler SHALL catch it before runtime
4. WHEN a developer hovers over SDK functions in their IDE THEN the system SHALL display JSDoc documentation
5. WHEN the SDK is used in a JavaScript project THEN the system SHALL still function correctly without types

### Requirement 12

**User Story:** As a developer, I want clear error messages, so that I can quickly diagnose and fix integration issues.

#### Acceptance Criteria

1. WHEN a contract call fails THEN the SDK SHALL throw an error with the contract error name and reason
2. WHEN a network error occurs THEN the SDK SHALL throw an error indicating the network issue
3. WHEN validation fails THEN the SDK SHALL throw an error specifying which parameter is invalid
4. WHEN a transaction is reverted THEN the SDK SHALL include the revert reason in the error
5. WHEN an error occurs THEN the SDK SHALL include the error code and suggested remediation steps

### Requirement 13

**User Story:** As a developer, I want to listen for blockchain events, so that I can react to identity registrations and proof submissions in real-time.

#### Acceptance Criteria

1. WHEN a developer subscribes to HumanRegistered events THEN the SDK SHALL emit events when new identities are created
2. WHEN a developer subscribes to ProofRegistered events THEN the SDK SHALL emit events when new proofs are submitted
3. WHEN a developer subscribes to IdentityLinked events THEN the SDK SHALL emit events when external proofs are linked
4. WHEN a developer unsubscribes from events THEN the SDK SHALL stop emitting those events
5. WHEN an event is emitted THEN the SDK SHALL include all relevant event data in a typed object

### Requirement 14

**User Story:** As a developer, I want to estimate gas costs before submitting transactions, so that I can inform users of transaction costs.

#### Acceptance Criteria

1. WHEN a developer requests gas estimation for registration THEN the SDK SHALL return the estimated gas units
2. WHEN a developer requests gas estimation for linking proofs THEN the SDK SHALL return the estimated gas units
3. WHEN gas estimation fails THEN the SDK SHALL throw an error with the reason
4. WHEN a developer provides gas price THEN the SDK SHALL calculate the total cost in native currency
5. WHEN network conditions change THEN the SDK SHALL provide updated gas estimates

### Requirement 15

**User Story:** As a developer, I want to batch multiple read operations, so that I can reduce RPC calls and improve performance.

#### Acceptance Criteria

1. WHEN a developer requests multiple humanIds THEN the SDK SHALL batch the queries into a single multicall
2. WHEN a developer requests multiple proof counts THEN the SDK SHALL batch the queries efficiently
3. WHEN a batch query fails partially THEN the SDK SHALL return successful results and indicate which queries failed
4. WHEN batching is not supported by the RPC THEN the SDK SHALL fall back to sequential queries
5. WHEN a batch completes THEN the SDK SHALL return results in the same order as requested

### Requirement 16

**User Story:** As a React developer, I want optional React hooks, so that I can use the SDK idiomatically in my React application.

#### Acceptance Criteria

1. WHEN a developer imports React hooks from the SDK THEN the system SHALL provide hooks like useHumanIdentity, useProofs, useScore
2. WHEN a React hook is used THEN the system SHALL integrate with React Query for caching and refetching
3. WHEN a React hook is used THEN the system SHALL integrate with Wagmi for wallet connection
4. WHEN a developer uses the SDK without React THEN the core functionality SHALL remain available
5. WHERE React hooks are used THEN the SDK SHALL mark React and Wagmi as peer dependencies

### Requirement 17

**User Story:** As a developer, I want comprehensive documentation, so that I can learn how to use the SDK effectively.

#### Acceptance Criteria

1. WHEN a developer visits the SDK documentation THEN the system SHALL provide a getting started guide
2. WHEN a developer needs API reference THEN the system SHALL provide complete documentation for all public methods
3. WHEN a developer needs examples THEN the system SHALL provide code samples for common use cases
4. WHEN a developer needs migration guides THEN the system SHALL provide version upgrade instructions
5. WHEN a developer needs troubleshooting help THEN the system SHALL provide a FAQ and common issues section

### Requirement 18

**User Story:** As a developer, I want the SDK to be tested, so that I can trust its reliability in production.

#### Acceptance Criteria

1. WHEN the SDK is released THEN the system SHALL have unit tests covering all core functions
2. WHEN the SDK is released THEN the system SHALL have integration tests against a local blockchain
3. WHEN the SDK is released THEN the system SHALL have end-to-end tests against testnet contracts
4. WHEN tests are run THEN the system SHALL achieve at least 80% code coverage
5. WHEN a pull request is submitted THEN the system SHALL run all tests in CI/CD

### Requirement 19

**User Story:** As a developer, I want the SDK to handle common edge cases, so that my application is robust.

#### Acceptance Criteria

1. WHEN the RPC endpoint is rate-limited THEN the SDK SHALL implement exponential backoff retry logic
2. WHEN a transaction is pending for a long time THEN the SDK SHALL provide a timeout mechanism
3. WHEN the wallet is disconnected during an operation THEN the SDK SHALL throw a clear error
4. WHEN contract addresses are not deployed THEN the SDK SHALL detect and report the issue
5. WHEN the SDK encounters an unknown error THEN the SDK SHALL log diagnostic information

### Requirement 20

**User Story:** As a developer, I want to use the SDK with the Expo Web application, so that I can integrate PoSH identity into the existing Human-0 platform.

#### Acceptance Criteria

1. WHEN the SDK is integrated into the Expo Web app THEN the system SHALL work with the existing Wagmi configuration
2. WHEN the SDK is used in Expo Web THEN the system SHALL work with React Native's JavaScript engine
3. WHEN the SDK is used in Expo Web THEN the system SHALL support both web and native platforms
4. WHEN the SDK is integrated THEN the system SHALL not conflict with existing dependencies
5. WHEN the SDK is integrated THEN the system SHALL provide React hooks that work with the existing Web3Provider

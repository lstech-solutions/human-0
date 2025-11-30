# Implementation Plan

- [x] 1. Set up package structure and build configuration
  - Create `packages/posh-sdk` directory with proper npm package structure
  - Configure TypeScript with strict mode and declaration generation
  - Set up build tooling (tsup or rollup) for ESM and CJS outputs
  - Configure package.json with proper exports, peer dependencies, and scripts
  - Set up Vitest for testing
  - Create README.md with basic documentation structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement core type definitions and configuration
  - [x] 2.1 Create type definitions for Identity, Proof, Score, and Events
    - Define Address, HumanId, Identity, ExternalProof types
    - Define Proof, ProofTier, ImpactType types
    - Define ScoreLevel, TierBreakdown, ImpactSummary types
    - Define event types for HumanRegistered, ProofRegistered, IdentityLinked
    - _Requirements: 11.1, 11.2_
  
  - [x] 2.2 Create configuration types and validation
    - Define PoshConfig interface with network, contracts, cache, and retry options
    - Implement configuration validation function
    - Create default configuration for Base Sepolia
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ]* 2.3 Write property test for configuration validation
    - **Property 2: Configuration validation**
    - **Validates: Requirements 2.5**

- [x] 3. Implement contract ABIs and addresses
  - [x] 3.1 Copy contract ABIs from packages/contracts
    - Extract HumanIdentity ABI
    - Extract ProofRegistry ABI
    - Extract PoSHNFT ABI
    - Extract HumanScore ABI
    - _Requirements: 2.2_
  
  - [x] 3.2 Create contract addresses configuration
    - Define addresses for Base Sepolia testnet
    - Define addresses for Base mainnet
    - Create address lookup by chainId
    - _Requirements: 2.2, 2.4_

- [x] 4. Implement provider abstraction layer
  - [x] 4.1 Create BaseProvider interface
    - Define interface for read/write operations
    - Define interface for event operations
    - Define interface for gas estimation
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 4.2 Implement ViemProvider adapter
    - Implement readContract using Viem PublicClient
    - Implement writeContract using Viem WalletClient
    - Implement event watching
    - Implement gas estimation
    - _Requirements: 10.2_
  
  - [x] 4.3 Implement WagmiProvider adapter
    - Implement readContract using Wagmi hooks
    - Implement writeContract using Wagmi hooks
    - Implement event watching
    - Implement gas estimation
    - _Requirements: 10.1_
  
  - [x] 4.4 Implement EthersProvider adapter
    - Implement readContract using ethers.js
    - Implement writeContract using ethers.js
    - Implement event watching
    - Implement gas estimation
    - _Requirements: 10.3_
  
  - [ ]* 4.5 Write property test for provider compatibility
    - **Property 11: Provider compatibility**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [x] 5. Implement utility modules
  - [x] 5.1 Create caching utility
    - Implement in-memory cache with TTL
    - Implement cache key generation
    - Implement cache invalidation
    - _Requirements: 3.4, 5.4_
  
  - [x] 5.2 Create retry utility
    - Implement exponential backoff retry logic
    - Implement rate limit detection and handling
    - Implement configurable retry attempts
    - _Requirements: 19.1_
  
  - [x] 5.3 Create validation utility
    - Implement address validation
    - Implement humanId validation
    - Implement configuration validation
    - _Requirements: 3.2, 12.3_
  
  - [x] 5.4 Create error classes and error handling
    - Implement PoshSDKError base class
    - Implement ValidationError, ContractError, NetworkError classes
    - Implement error code enum
    - Implement error formatting with remediation suggestions
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 5.5 Create formatting utility
    - Implement humanId formatting
    - Implement impact value formatting
    - Implement date formatting
    - _Requirements: 7.5_
  
  - [ ]* 5.6 Write property test for retry logic resilience
    - **Property 18: Retry logic resilience**
    - **Validates: Requirements 19.1**

- [ ] 6. Implement IdentityManager
  - [x] 6.1 Implement read operations
    - Implement isRegistered method with caching
    - Implement getHumanId method with caching
    - Implement getWallet method
    - Implement getRegistrationTime method
    - Implement getExternalProofs method
    - _Requirements: 3.1, 3.4, 5.1, 5.2, 5.3_
  
  - [x] 6.2 Implement write operations
    - Implement register method with transaction handling
    - Implement linkExternalProof method
    - Implement transaction waiting and receipt parsing
    - _Requirements: 4.1, 4.2, 4.3, 8.1, 8.2_
  
  - [x] 6.3 Implement gas estimation
    - Implement estimateRegisterGas method
    - Implement estimateLinkProofGas method
    - _Requirements: 14.1, 14.2_
  
  - [ ]* 6.4 Write property test for registration status consistency
    - **Property 3: Registration status consistency**
    - **Validates: Requirements 3.4**
  
  - [ ]* 6.5 Write property test for registration idempotency
    - **Property 4: Registration idempotency**
    - **Validates: Requirements 4.4**
  
  - [ ]* 6.6 Write property test for humanId determinism
    - **Property 5: HumanId determinism**
    - **Validates: Requirements 5.1, 5.4**
  
  - [ ]* 6.7 Write property test for external proof linking
    - **Property 9: External proof linking**
    - **Validates: Requirements 8.3**

- [ ] 7. Implement ProofManager
  - [ ] 7.1 Implement single proof queries
    - Implement getProof method
    - Implement getProofCount method
    - _Requirements: 6.1_
  
  - [ ] 7.2 Implement human proof queries
    - Implement getHumanProofs method with filtering
    - Implement proof filtering by type, tier, date range
    - Implement pagination support
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [ ] 7.3 Implement impact aggregation
    - Implement getTotalImpact method
    - Implement impact grouping by type
    - Implement tier weighting logic
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 7.4 Implement batch operations
    - Implement batchGetProofs method
    - Implement batchGetHumanProofs method
    - Implement multicall batching
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 7.5 Write property test for proof query completeness
    - **Property 6: Proof query completeness**
    - **Validates: Requirements 6.1, 6.5**
  
  - [ ]* 7.6 Write property test for impact calculation correctness
    - **Property 7: Impact calculation correctness**
    - **Validates: Requirements 7.1**
  
  - [ ]* 7.7 Write property test for tier weighting consistency
    - **Property 8: Tier weighting consistency**
    - **Validates: Requirements 7.4**
  
  - [ ]* 7.8 Write property test for batch query efficiency
    - **Property 16: Batch query efficiency**
    - **Validates: Requirements 15.1, 15.2**

- [ ] 8. Implement ScoreManager
  - [ ] 8.1 Implement score queries
    - Implement getScore method
    - Implement getLevel method
    - Implement meetsThreshold method
    - Implement getTierBreakdown method
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [ ] 8.2 Implement score calculations
    - Implement calculateWeightedScore method
    - Implement calculateTimeDecay method
    - Implement getLevelFromScore method
    - _Requirements: 9.2, 9.4_
  
  - [ ]* 8.3 Write property test for score level mapping
    - **Property 10: Score level mapping**
    - **Validates: Requirements 9.2**

- [ ] 9. Implement EventManager
  - [ ] 9.1 Implement event subscriptions
    - Implement onHumanRegistered subscription
    - Implement onProofRegistered subscription
    - Implement onIdentityLinked subscription
    - Implement unsubscribe functionality
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 9.2 Implement event queries
    - Implement getHumanRegisteredEvents method
    - Implement getProofRegisteredEvents method
    - Implement getIdentityLinkedEvents method
    - Implement event filtering
    - _Requirements: 13.5_
  
  - [ ]* 9.3 Write property test for event subscription cleanup
    - **Property 14: Event subscription cleanup**
    - **Validates: Requirements 13.4**

- [ ] 10. Implement PoshClient main class
  - Create PoshClient constructor with configuration
  - Initialize all sub-managers (identity, proofs, score, events)
  - Implement getConfig and updateConfig methods
  - Implement provider initialization and validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11. Checkpoint - Ensure all core tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement React hooks layer
  - [x] 12.1 Create PoshProvider context
    - Implement React context for PoshClient
    - Implement provider component with configuration
    - Implement usePoshClient hook
    - _Requirements: 16.1_
  
  - [x] 12.2 Implement useHumanIdentity hook
    - Integrate with React Query for caching
    - Integrate with Wagmi for wallet connection
    - Implement registration mutation
    - Implement identity queries
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [x] 12.3 Implement useProofs hook
    - Integrate with React Query for caching
    - Implement proof queries with filters
    - Implement impact aggregation
    - _Requirements: 16.1, 16.2_
  
  - [x] 12.4 Implement useScore hook
    - Integrate with React Query for caching
    - Implement score and level queries
    - _Requirements: 16.1, 16.2_
  
  - [x] 12.5 Implement useEvents hook
    - Implement event subscriptions with cleanup
    - Implement event state management
    - _Requirements: 16.1_
  
  - [ ]* 12.6 Write property test for React hook integration
    - **Property 17: React hook integration**
    - **Validates: Requirements 16.2, 16.3**

- [ ] 13. Create integration tests
  - [ ] 13.1 Set up Hardhat local network for testing
    - Configure Hardhat network
    - Deploy contracts to local network
    - Create test fixtures
    - _Requirements: 18.2_
  
  - [ ] 13.2 Write integration tests for identity flows
    - Test full registration flow
    - Test humanId retrieval
    - Test external proof linking
    - _Requirements: 18.2_
  
  - [ ] 13.3 Write integration tests for proof flows
    - Test proof queries
    - Test impact aggregation
    - Test batch operations
    - _Requirements: 18.2_
  
  - [ ] 13.4 Write integration tests for event flows
    - Test event subscriptions
    - Test event queries
    - Test unsubscribe functionality
    - _Requirements: 18.2_

- [ ] 14. Integrate SDK with Expo Web application
  - [ ] 14.1 Install SDK in apps/web
    - Add @human-0/posh-sdk to package.json
    - Configure workspace dependency
    - _Requirements: 20.1_
  
  - [ ] 14.2 Update Web3Provider to use SDK
    - Import PoshProvider from SDK
    - Wrap app with PoshProvider
    - Configure SDK with existing Wagmi setup
    - _Requirements: 20.1, 20.5_
  
  - [ ] 14.3 Refactor identity feature to use SDK hooks
    - Replace custom hooks with useHumanIdentity
    - Update IdentityCard component
    - Update identity store to use SDK
    - _Requirements: 20.2, 20.3, 20.5_
  
  - [ ] 14.4 Test SDK integration in Expo Web
    - Test registration flow in web browser
    - Test identity queries
    - Test error handling
    - _Requirements: 20.2, 20.3_
  
  - [ ]* 14.5 Write property test for Expo Web compatibility
    - **Property 19: Expo Web compatibility**
    - **Validates: Requirements 20.1, 20.4**

- [ ] 15. Create comprehensive documentation
  - [ ] 15.1 Write getting started guide
    - Installation instructions
    - Basic usage examples
    - Configuration guide
    - _Requirements: 17.1_
  
  - [ ] 15.2 Write API reference documentation
    - Document all public classes and methods
    - Include parameter descriptions
    - Include return type descriptions
    - Include code examples
    - _Requirements: 17.2_
  
  - [ ] 15.3 Write usage examples
    - Vanilla JavaScript example
    - React example
    - Wagmi integration example
    - Viem integration example
    - ethers.js integration example
    - _Requirements: 17.3_
  
  - [ ] 15.4 Write troubleshooting guide
    - Common errors and solutions
    - FAQ section
    - Network configuration issues
    - Provider compatibility issues
    - _Requirements: 17.5_

- [x] 16. Prepare package for npm publication
  - [x] 16.1 Configure package.json for publication
    - Set proper package name, version, description
    - Configure exports for ESM and CJS
    - Set peer dependencies (React, Wagmi, Viem as optional)
    - Add keywords and repository information
    - _Requirements: 1.1, 1.5_
  
  - [x] 16.2 Create npm publish workflow
    - Set up GitHub Actions for npm publish
    - Configure semantic versioning
    - Add pre-publish checks (tests, linting, build)
    - Added automated release script
    - _Requirements: 1.5_
  
  - [x] 16.3 Test package installation locally
    - Build package
    - Test npm pack
    - Test installation in a separate project
    - Verify types are working
    - Published v1.0.0 to npm
    - _Requirements: 1.1, 1.2_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

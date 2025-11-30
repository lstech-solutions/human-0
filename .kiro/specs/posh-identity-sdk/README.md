# PoSH Identity SDK Spec

## Overview

This spec defines a standalone, framework-agnostic TypeScript SDK for identity management within the HUMΛN-Ø Proof of Sustainable Humanity (PoSH) system.

## Status

- ✅ Requirements: Complete
- ✅ Design: Complete  
- ✅ Tasks: Complete
- ⏳ Implementation: Ready to start

## Quick Links

- [Requirements](./requirements.md) - User stories and acceptance criteria
- [Design](./design.md) - Architecture, components, and correctness properties
- [Tasks](./tasks.md) - Implementation plan with 17 major tasks

## Key Features

### Core SDK
- Framework-agnostic TypeScript library
- Support for Wagmi, Viem, and ethers.js
- Built-in caching, retry logic, and error handling
- Full TypeScript type safety

### Identity Management
- Register human identities
- Query humanId and registration status
- Link external identity proofs
- Gas estimation for transactions

### Proof Management
- Query proofs by humanId
- Filter by type, tier, date range
- Aggregate impact calculations
- Batch operations for efficiency

### Score Management
- Calculate weighted scores
- Determine reputation levels
- Apply tier weighting and time decay
- Query tier breakdowns

### Event Management
- Subscribe to blockchain events
- Query historical events
- Automatic cleanup on unsubscribe

### React Integration (Optional)
- React hooks for all operations
- Integration with React Query
- Integration with Wagmi
- Context provider for configuration

## Getting Started

To begin implementation, open the tasks.md file and click "Start task" next to task 1:

```
1. Set up package structure and build configuration
```

This will guide you through creating the package structure, configuring TypeScript, and setting up the build tooling.

## Architecture Highlights

### Layered Design
1. **Core Layer**: Framework-agnostic contract interaction
2. **Provider Layer**: Abstraction over Web3 libraries
3. **React Layer**: Optional React hooks
4. **Types Layer**: Comprehensive TypeScript definitions

### Key Design Decisions
- **Zero-config defaults**: Works out-of-the-box with Base Sepolia
- **Provider abstraction**: Single interface for Wagmi/Viem/ethers.js
- **Caching strategy**: Configurable TTL-based caching
- **Error handling**: Custom error classes with remediation suggestions
- **Testing**: Property-based tests for correctness guarantees

## Package Structure

```
packages/posh-sdk/
├── src/
│   ├── core/           # Core SDK logic
│   ├── contracts/      # ABIs and addresses
│   ├── providers/      # Web3 library adapters
│   ├── react/          # React hooks (optional)
│   ├── utils/          # Utilities
│   └── types/          # TypeScript types
├── test/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # E2E tests
└── docs/               # Documentation
```

## Testing Strategy

- **Unit Tests**: Vitest for fast unit testing
- **Property Tests**: fast-check for property-based testing (optional)
- **Integration Tests**: Hardhat local network
- **E2E Tests**: Base Sepolia testnet
- **Coverage Goal**: 80% minimum

## Integration with Expo Web

The SDK will integrate with the existing Expo Web application:
- Replace custom identity hooks with SDK hooks
- Use existing Wagmi configuration
- Maintain compatibility with React Native

## Next Steps

1. Review the requirements, design, and tasks
2. Start with task 1: Set up package structure
3. Follow the tasks sequentially
4. Optional tasks (marked with *) can be skipped for MVP
5. Test integration with Expo Web at task 14

## Questions?

If you have questions during implementation, refer to:
- The design document for architectural decisions
- The requirements document for acceptance criteria
- The ARCHITECTURE.md file for overall system context

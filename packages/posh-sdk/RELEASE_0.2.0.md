# Release 0.2.0 - Provider Abstraction & Write Operations

**Release Date:** November 30, 2024  
**Package:** @human-0/posh-sdk@0.2.0  
**NPM:** https://www.npmjs.com/package/@human-0/posh-sdk

## 🎯 Overview

Version 0.2.0 introduces a comprehensive provider abstraction layer that enables the SDK to work seamlessly with multiple Ethereum libraries (Viem, Wagmi, ethers.js). This release also adds full support for write operations, allowing developers to register identities and perform on-chain transactions.

## ✨ New Features

### Provider Abstraction Layer

The SDK now includes a unified provider interface that works with multiple Ethereum libraries:

- **BaseProvider Interface**: Standardized interface for all blockchain operations
- **ViemProvider**: Full implementation using Viem's PublicClient and WalletClient
- **WagmiProvider**: Basic implementation wrapping Wagmi's config
- **EthersProvider**: Full implementation using ethers.js v6

### Write Operations

IdentityManager now supports write operations:

- `register()`: Register a new human identity on-chain
- `linkExternalProof()`: Link external proofs to identity (placeholder)
- `estimateRegisterGas()`: Estimate gas for registration
- `estimateLinkProofGas()`: Estimate gas for proof linking

### Enhanced Architecture

- All managers (Identity, Proof, Score, Events) now accept optional provider parameter
- PoshClient updated to pass provider to all sub-managers
- Improved error handling for provider-related operations
- Better TypeScript type safety throughout

## 📦 Installation

```bash
npm install @human-0/posh-sdk@0.2.0
```

## 🚀 Usage Examples

### Using with Viem

```typescript
import { PoshClient, ViemProvider } from '@human-0/posh-sdk';
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

const provider = new ViemProvider({ publicClient, walletClient });

const client = new PoshClient({
  chainId: 84532,
  contracts: { /* ... */ },
  provider,
});

// Register identity
const { hash, humanId } = await client.identity.register();
```

### Using with Wagmi

```typescript
import { PoshClient, WagmiProvider } from '@human-0/posh-sdk';
import { useConfig } from 'wagmi';

function MyComponent() {
  const config = useConfig();
  const provider = new WagmiProvider({ config });
  
  const client = new PoshClient({
    chainId: 84532,
    contracts: { /* ... */ },
    provider,
  });
  
  // Use client for operations
}
```

### Using with ethers.js

```typescript
import { PoshClient, EthersProvider } from '@human-0/posh-sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const ethersProvider = new EthersProvider({
  provider,
  signer,
});

const client = new PoshClient({
  chainId: 84532,
  contracts: { /* ... */ },
  provider: ethersProvider,
});
```

## 🔧 Breaking Changes

None. This release is fully backward compatible with 0.1.0.

## 📊 Package Stats

- **Size:** 81.5 kB (compressed) - up from 66.7 kB
- **Unpacked:** 447.2 kB - up from 359.8 kB
- **Tests:** 46 passing
- **TypeScript:** Full type definitions included

## 🐛 Bug Fixes

- Fixed TypeScript type conflicts between provider and SDK event types
- Resolved readonly array type issues with contract ABIs
- Fixed unused parameter warnings in manager constructors

## 📚 Documentation Updates

- Updated README with provider usage examples
- Added CHANGELOG entry for 0.2.0
- Updated PUBLISHED.md with latest release info
- Enhanced code examples throughout documentation

## 🔜 What's Next

Future releases will focus on:
- Completing ProofManager implementation
- Completing ScoreManager implementation
- Completing EventManager implementation
- Integration with Expo Web application
- Additional provider adapters as needed

## 🙏 Acknowledgments

This release represents a significant step forward in making the PoSH SDK truly framework-agnostic and production-ready.

---

**Full Changelog:** https://github.com/lstech-solutions/human-0.com/blob/main/packages/posh-sdk/CHANGELOG.md

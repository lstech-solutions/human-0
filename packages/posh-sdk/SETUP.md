# @human-0/posh-sdk Setup Guide

Complete setup guide for integrating the PoSH SDK into your application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Quick Start Examples](#quick-start-examples)
- [Framework Integration](#framework-integration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing the SDK, ensure you have:

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, yarn, or pnpm
- **TypeScript**: Version 5.0 or higher (recommended)
- **Base L2 RPC Access**: Public RPC or your own endpoint

### Optional Dependencies

Depending on your use case, you may need:

- **React**: 18.x or 19.x (for React hooks)
- **Wagmi**: 2.x (for Wagmi integration)
- **Viem**: 2.x (for Viem integration)
- **ethers.js**: 6.x (for ethers integration)

## Installation

### Basic Installation

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

### With Viem Only

```bash
npm install @human-0/posh-sdk viem
```

### With ethers.js

```bash
npm install @human-0/posh-sdk ethers
```

## Configuration

### 1. Get Contract Addresses

The SDK requires deployed contract addresses for the PoSH system:

**Base Sepolia Testnet:**
```typescript
const contracts = {
  humanIdentity: '0x...', // HumanIdentity contract
  proofRegistry: '0x...', // ProofRegistry contract
  poshNFT: '0x...',       // PoSHNFT contract
  humanScore: '0x...',    // HumanScore contract
};
```

**Base Mainnet:**
```typescript
const contracts = {
  humanIdentity: '0x...', // HumanIdentity contract
  proofRegistry: '0x...', // ProofRegistry contract
  poshNFT: '0x...',       // PoSHNFT contract
  humanScore: '0x...',    // HumanScore contract
};
```

### 2. Basic Configuration

```typescript
import { PoshClient } from '@human-0/posh-sdk';

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

### 3. Advanced Configuration

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
    ttl: 60000, // Cache for 1 minute
    maxSize: 1000, // Max 1000 cached items
  },
  retry: {
    enabled: true,
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000, // 1 second
  },
});
```

## Quick Start Examples

### Example 1: Check Registration Status

```typescript
import { PoshClient } from '@human-0/posh-sdk';

const client = new PoshClient({ /* config */ });

async function checkRegistration(address: string) {
  try {
    const isRegistered = await client.identity.isRegistered(address);
    
    if (isRegistered) {
      const humanId = await client.identity.getHumanId(address);
      console.log('Human ID:', humanId);
    } else {
      console.log('Address not registered');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkRegistration('0x...');
```

### Example 2: Register a New Identity

```typescript
import { PoshClient } from '@human-0/posh-sdk';
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = new PoshClient({ /* config */ });

async function registerIdentity() {
  // Create a wallet client (using browser wallet)
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });

  try {
    const result = await client.identity.register(walletClient);
    console.log('Transaction hash:', result.hash);
    
    // Wait for confirmation
    const receipt = await result.wait();
    console.log('Human ID:', result.humanId);
    console.log('Block number:', receipt.blockNumber);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
```

### Example 3: Query Proofs and Impact

```typescript
async function getImpactData(humanId: string) {
  try {
    // Get all proofs
    const proofs = await client.proofs.getHumanProofs(humanId);
    console.log(`Total proofs: ${proofs.length}`);

    // Get total impact by type
    const impact = await client.proofs.getTotalImpact(humanId);
    console.log('Total impact:', impact);

    // Get impact for specific type
    const energyImpact = await client.proofs.getTotalImpact(
      humanId,
      'renewable_energy'
    );
    console.log('Renewable energy impact:', energyImpact);

    // Get score and level
    const score = await client.score.getScore(humanId);
    const level = await client.score.getLevel(humanId);
    console.log(`Score: ${score}, Level: ${level.name}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

### Example 4: Subscribe to Events

```typescript
async function subscribeToEvents() {
  // Subscribe to new registrations
  const unsubscribeRegistrations = client.events.onHumanRegistered((event) => {
    console.log('New human registered:', event.humanId);
    console.log('Wallet:', event.wallet);
    console.log('Timestamp:', event.timestamp);
  });

  // Subscribe to new proofs
  const unsubscribeProofs = client.events.onProofRegistered((event) => {
    console.log('New proof registered:', event.proofId);
    console.log('Impact type:', event.impactType);
    console.log('Impact value:', event.impactValue);
  });

  // Cleanup when done
  // unsubscribeRegistrations();
  // unsubscribeProofs();
}
```

## Framework Integration

### React with Wagmi

```typescript
import { PoshProvider, useHumanIdentity, useProofs } from '@human-0/posh-sdk/react';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PoshProvider config={poshConfig}>
          <Dashboard />
        </PoshProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Dashboard() {
  const { address } = useAccount();
  const { data: identity, isLoading } = useHumanIdentity(address);
  const { data: proofs } = useProofs(identity?.humanId);

  if (isLoading) return <div>Loading...</div>;
  if (!identity) return <div>Not registered</div>;

  return (
    <div>
      <h1>Human ID: {identity.humanId}</h1>
      <p>Proofs: {proofs?.length || 0}</p>
    </div>
  );
}
```

### Next.js App Router

```typescript
// app/providers.tsx
'use client';

import { PoshProvider } from '@human-0/posh-sdk/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PoshProvider config={poshConfig}>
          {children}
        </PoshProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Vanilla JavaScript (Node.js)

```javascript
const { PoshClient } = require('@human-0/posh-sdk');
const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const client = new PoshClient({
  chainId: 84532,
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
  provider: publicClient,
});

async function main() {
  const isRegistered = await client.identity.isRegistered('0x...');
  console.log('Is registered:', isRegistered);
}

main();
```

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors

**Problem**: TypeScript can't find the SDK modules.

**Solution**: Ensure your `tsconfig.json` has proper module resolution:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"
    "esModuleInterop": true
  }
}
```

#### 2. "Provider not connected" errors

**Problem**: The SDK can't connect to the blockchain.

**Solution**: 
- Check your RPC URL is correct
- Verify the chain ID matches your network
- Ensure you have network connectivity

#### 3. "Contract not deployed" errors

**Problem**: Contract addresses are incorrect or not deployed.

**Solution**:
- Verify contract addresses for your network
- Check you're using the correct chain ID
- Ensure contracts are deployed on that network

#### 4. React hooks not working

**Problem**: Hooks return undefined or throw errors.

**Solution**:
- Ensure `PoshProvider` wraps your components
- Verify `QueryClientProvider` is set up
- Check that Wagmi is properly configured

#### 5. Type errors with peer dependencies

**Problem**: TypeScript errors about missing types.

**Solution**:
```bash
npm install --save-dev @types/react @types/node
```

### Getting Help

- **Documentation**: [https://human-0.com/docs/posh](https://human-0.com/docs/posh)
- **GitHub Issues**: [https://github.com/human-0/human-0.com/issues](https://github.com/human-0/human-0.com/issues)
- **Discord**: Join our community for support

## Next Steps

1. **Explore Examples**: Check the [examples directory](./docs/examples) for more use cases
2. **Read API Docs**: See [API Reference](./docs/api-reference.md) for detailed documentation
3. **Build Your App**: Start integrating PoSH identity into your application
4. **Test on Testnet**: Use Base Sepolia for development and testing
5. **Deploy to Mainnet**: Move to Base Mainnet when ready for production

## Environment Variables

For production applications, store configuration in environment variables:

```bash
# .env
VITE_POSH_CHAIN_ID=84532
VITE_POSH_RPC_URL=https://sepolia.base.org
VITE_POSH_HUMAN_IDENTITY=0x...
VITE_POSH_PROOF_REGISTRY=0x...
VITE_POSH_NFT=0x...
VITE_POSH_SCORE=0x...
```

Then use them in your config:

```typescript
const client = new PoshClient({
  chainId: parseInt(import.meta.env.VITE_POSH_CHAIN_ID),
  rpcUrl: import.meta.env.VITE_POSH_RPC_URL,
  contracts: {
    humanIdentity: import.meta.env.VITE_POSH_HUMAN_IDENTITY,
    proofRegistry: import.meta.env.VITE_POSH_PROOF_REGISTRY,
    poshNFT: import.meta.env.VITE_POSH_NFT,
    humanScore: import.meta.env.VITE_POSH_SCORE,
  },
});
```

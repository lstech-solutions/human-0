# Expo Web Integration Guide

This guide explains how to integrate the @human-0/posh-sdk into the existing Expo Web application.

## Current Status

The SDK package structure is complete with:
- ✅ TypeScript configuration with strict mode
- ✅ Build tooling (tsup) for ESM and CJS outputs
- ✅ Vitest testing setup
- ✅ Type definitions for all core types
- ✅ Error classes and error handling
- ✅ Comprehensive documentation

## Next Steps for Full Integration

### 1. Implement Core Functionality (Tasks 2-10)

Before integrating with Expo Web, the following SDK functionality needs to be implemented:

#### Task 2: Core Type Definitions ✅ (Partially Complete)
- Types are defined, need configuration validation

#### Task 3: Contract ABIs and Addresses
- Copy ABIs from `packages/contracts`
- Set up contract addresses for Base Sepolia and Mainnet

#### Task 4: Provider Abstraction Layer
- Implement BaseProvider interface
- Create Wagmi, Viem, and ethers adapters

#### Task 5: Utility Modules
- Caching utility
- Retry logic
- Validation functions
- Error formatting

#### Task 6-8: Manager Classes
- IdentityManager (registration, queries)
- ProofManager (proof queries, aggregation)
- ScoreManager (score calculations)
- EventManager (event subscriptions)

#### Task 9: PoshClient Main Class
- Wire up all managers
- Configuration management

### 2. Expo Web Integration Steps

Once core functionality is implemented (Tasks 2-10), follow these steps:

#### Step 1: Install SDK in Expo Web

```bash
cd apps/web
npm install @human-0/posh-sdk
```

Or add to `apps/web/package.json`:

```json
{
  "dependencies": {
    "@human-0/posh-sdk": "workspace:*"
  }
}
```

#### Step 2: Create PoSH Configuration

Create `apps/web/lib/posh-config.ts`:

```typescript
import type { PoshConfig } from '@human-0/posh-sdk';

export const poshConfig: PoshConfig = {
  chainId: 84532, // Base Sepolia
  contracts: {
    humanIdentity: process.env.EXPO_PUBLIC_HUMAN_IDENTITY_ADDRESS!,
    proofRegistry: process.env.EXPO_PUBLIC_PROOF_REGISTRY_ADDRESS!,
    poshNFT: process.env.EXPO_PUBLIC_POSH_NFT_ADDRESS!,
    humanScore: process.env.EXPO_PUBLIC_HUMAN_SCORE_ADDRESS!,
  },
  cache: {
    enabled: true,
    ttl: 60000,
    maxSize: 1000,
  },
  retry: {
    enabled: true,
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000,
  },
};
```

#### Step 3: Update Environment Variables

Add to `apps/web/.env`:

```bash
EXPO_PUBLIC_HUMAN_IDENTITY_ADDRESS=0x...
EXPO_PUBLIC_PROOF_REGISTRY_ADDRESS=0x...
EXPO_PUBLIC_POSH_NFT_ADDRESS=0x...
EXPO_PUBLIC_HUMAN_SCORE_ADDRESS=0x...
```

#### Step 4: Integrate with Web3Provider

Update `apps/web/providers/Web3Provider.tsx`:

```typescript
import { PoshProvider } from '@human-0/posh-sdk/react';
import { poshConfig } from '../lib/posh-config';

export function Web3Provider({ children }: { children: React.ReactNode }) {
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
```

#### Step 5: Refactor Identity Feature

Update `apps/web/features/identity/hooks/useIdentity.ts`:

```typescript
import { useHumanIdentity, useProofs, useScore } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

export function useIdentity() {
  const { address } = useAccount();
  const { data: identity, isLoading, error } = useHumanIdentity(address);
  const { data: proofs } = useProofs(identity?.humanId);
  const { data: score } = useScore(identity?.humanId);

  return {
    identity,
    proofs,
    score,
    isLoading,
    error,
  };
}
```

#### Step 6: Update Identity Components

Update `apps/web/components/IdentityCard.tsx` to use SDK hooks:

```typescript
import { useIdentity } from '../features/identity/hooks/useIdentity';

export function IdentityCard() {
  const { identity, proofs, score, isLoading } = useIdentity();

  if (isLoading) return <LoadingSpinner />;
  if (!identity) return <NotRegisteredView />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your PoSH Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Human ID</Label>
          <Code>{identity.humanId}</Code>
        </div>
        <div>
          <Label>Score</Label>
          <Text>{score?.score || 0}</Text>
        </div>
        <div>
          <Label>Level</Label>
          <Badge>{score?.level.name || 'None'}</Badge>
        </div>
        <div>
          <Label>Proofs</Label>
          <Text>{proofs?.length || 0}</Text>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Testing Integration

#### Unit Tests

```typescript
// apps/web/__tests__/identity.test.tsx
import { render, screen } from '@testing-library/react';
import { IdentityCard } from '../components/IdentityCard';

test('renders identity card', () => {
  render(<IdentityCard />);
  expect(screen.getByText('Your PoSH Identity')).toBeInTheDocument();
});
```

#### Integration Tests

```typescript
// apps/web/__tests__/integration/posh-sdk.test.ts
import { PoshClient } from '@human-0/posh-sdk';
import { poshConfig } from '../../lib/posh-config';

test('SDK initializes correctly', () => {
  const client = new PoshClient(poshConfig);
  expect(client).toBeDefined();
});
```

### 4. Migration Checklist

- [ ] Implement SDK core functionality (Tasks 2-10)
- [ ] Install SDK in Expo Web
- [ ] Create PoSH configuration
- [ ] Add environment variables
- [ ] Update Web3Provider
- [ ] Refactor identity hooks
- [ ] Update identity components
- [ ] Remove old identity implementation
- [ ] Add tests
- [ ] Update documentation
- [ ] Test on testnet
- [ ] Deploy to production

## Benefits of SDK Integration

1. **Type Safety**: Full TypeScript support with comprehensive types
2. **Consistency**: Same API across all applications
3. **Maintainability**: Centralized logic, easier to update
4. **Testing**: Comprehensive test coverage
5. **Performance**: Built-in caching and batching
6. **Error Handling**: Structured error types with remediation
7. **Documentation**: Complete API documentation

## Current File Structure

```
apps/web/
├── features/
│   └── identity/
│       ├── hooks/
│       │   └── useIdentity.ts (needs refactoring)
│       ├── components/
│       │   └── IdentityCard.tsx (needs refactoring)
│       └── store/
│           └── identityStore.ts (can be removed)
├── providers/
│   └── Web3Provider.tsx (needs PoshProvider)
└── lib/
    └── posh-config.ts (needs creation)
```

## Resources

- [SDK Documentation](../../packages/posh-sdk/README.md)
- [Setup Guide](../../packages/posh-sdk/SETUP.md)
- [API Reference](../../apps/docs/docs/posh/sdk.md)
- [Examples](../../packages/posh-sdk/docs/examples/)

## Support

For questions about integration:
1. Check the [troubleshooting guide](../../packages/posh-sdk/SETUP.md#troubleshooting)
2. Review [examples](../../packages/posh-sdk/docs/examples/)
3. Open an issue on GitHub

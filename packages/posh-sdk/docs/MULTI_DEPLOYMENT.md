# Multi-Deployment Support

The PoSH SDK is designed to work with **any PoSH-compatible contract deployment**, not just a single authority's contracts. This ensures decentralization and allows multiple organizations to run their own PoSH systems.

## Why This Matters

1. **Decentralization**: No single authority controls the PoSH system
2. **Flexibility**: Organizations can deploy their own contracts
3. **Interoperability**: Same SDK works with all deployments
4. **Community**: Anyone can create a PoSH deployment

## Usage Patterns

### 1. Using Official Deployment

```typescript
import { PoshClient, createConfigFromDeployment } from '@human-0/posh-sdk';

// Use official HUMAN-0 deployment
const config = createConfigFromDeployment('human0-base-mainnet');
const client = new PoshClient(config);
```

### 2. Using Custom Deployment

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Use your own contract deployment
const client = new PoshClient({
  chainId: 8453, // Base Mainnet
  contracts: {
    humanIdentity: '0xYourIdentityContract...',
    proofRegistry: '0xYourProofRegistry...',
    poshNFT: '0xYourNFTContract...',
    humanScore: '0xYourScoreContract...',
  },
});
```

### 3. Registering Community Deployment

```typescript
import { registerDeployment } from '@human-0/posh-sdk';

// Register your deployment for others to use
registerDeployment('my-org-optimism', {
  name: 'My Organization on Optimism',
  description: 'Our PoSH deployment for sustainability tracking',
  chainId: 10, // Optimism
  addresses: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
  deployer: '0xYourAddress...',
  deployedAt: new Date('2025-01-01'),
  verified: true,
});

// Now others can use it
const config = createConfigFromDeployment('my-org-optimism');
```

### 4. Multi-Deployment Application

```typescript
// Support multiple PoSH systems in one app
const clients = {
  official: new PoshClient(createConfigFromDeployment('human0-base-mainnet')),
  community: new PoshClient(createConfigFromDeployment('community-optimism')),
  custom: new PoshClient({
    chainId: 42161, // Arbitrum
    contracts: { /* custom addresses */ },
  }),
};

// Query across multiple deployments
const officialScore = await clients.official.score.getScore(humanId);
const communityScore = await clients.community.score.getScore(humanId);
```

## Contract Compatibility

For a contract deployment to work with this SDK, it must implement the PoSH interface:

### Required Contracts

1. **HumanIdentity**: Identity registration and management
2. **ProofRegistry**: Proof submission and queries
3. **PoSHNFT**: Soulbound NFT for impact representation
4. **HumanScore**: Score calculation and level tracking

### Required Functions

Each contract must implement specific functions (see ABIs in `src/contracts/abis.ts`):

- `HumanIdentity.register()` - Register new identity
- `HumanIdentity.isRegistered(address)` - Check registration
- `HumanIdentity.getHumanId(address)` - Get humanId
- `ProofRegistry.getProofCount(humanId)` - Get proof count
- `HumanScore.getScore(humanId)` - Get score
- etc.

## Deployment Registry

The SDK maintains a registry of known deployments in `src/contracts/registry.ts`:

```typescript
export const KNOWN_DEPLOYMENTS = {
  'human0-base-sepolia': { /* testnet */ },
  'human0-base-mainnet': { /* mainnet */ },
  // Community deployments can be added here
};
```

### Adding Your Deployment

**Option 1: Pull Request**
Submit a PR to add your deployment to the registry:

```typescript
'your-org-network': {
  name: 'Your Organization',
  description: 'Description of your deployment',
  chainId: 1, // Your chain
  addresses: { /* your contracts */ },
  deployer: '0x...',
  verified: true,
}
```

**Option 2: Runtime Registration**
Register at runtime in your application:

```typescript
import { registerDeployment } from '@human-0/posh-sdk';

registerDeployment('my-deployment', {
  // ... deployment config
});
```

## Cross-Deployment Considerations

### Identity Portability

HumanIds are **deterministic** based on wallet address, so:
- Same wallet = same humanId across deployments
- Users can have presence in multiple PoSH systems
- Proofs are deployment-specific

### Proof Verification

Each deployment may have different:
- Oracle networks
- Verification standards
- Proof tiers and weights
- Impact types

### Score Calculation

Scores are calculated per-deployment:
- Different deployments = different scores
- Each deployment has its own scoring rules
- Applications can aggregate scores if desired

## Example: Multi-Chain PoSH

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Create clients for different chains
const baseClient = new PoshClient({
  chainId: 8453,
  contracts: { /* Base contracts */ },
});

const optimismClient = new PoshClient({
  chainId: 10,
  contracts: { /* Optimism contracts */ },
});

const arbitrumClient = new PoshClient({
  chainId: 42161,
  contracts: { /* Arbitrum contracts */ },
});

// Query user's impact across all chains
async function getTotalImpact(address: string) {
  const [baseId, opId, arbId] = await Promise.all([
    baseClient.identity.getHumanId(address),
    optimismClient.identity.getHumanId(address),
    arbitrumClient.identity.getHumanId(address),
  ]);

  const impacts = await Promise.all([
    baseId ? baseClient.proofs.getTotalImpact(baseId) : 0n,
    opId ? optimismClient.proofs.getTotalImpact(opId) : 0n,
    arbId ? arbitrumClient.proofs.getTotalImpact(arbId) : 0n,
  ]);

  return impacts.reduce((sum, impact) => sum + impact, 0n);
}
```

## Security Considerations

When using custom deployments:

1. **Verify Contracts**: Ensure contracts are verified on block explorers
2. **Check Deployer**: Verify who deployed the contracts
3. **Audit Status**: Check if contracts have been audited
4. **Oracle Trust**: Understand who can submit proofs
5. **Upgrade Mechanism**: Check if contracts are upgradeable

## Best Practices

1. **Use Known Deployments**: Start with official or well-known deployments
2. **Verify Addresses**: Always verify contract addresses before use
3. **Test on Testnet**: Test with testnet deployments first
4. **Document Your Deployment**: Provide clear documentation if deploying your own
5. **Community Engagement**: Share your deployment with the community

## Future: Cross-Deployment Protocol

Potential future features:
- Cross-deployment proof verification
- Identity bridging between deployments
- Aggregated scoring across deployments
- Deployment discovery protocol
- Reputation portability

## Resources

- [Contract Specifications](../contracts/abis.ts)
- [Deployment Registry](../contracts/registry.ts)
- [Configuration Guide](../SETUP.md)
- [API Reference](../../apps/docs/docs/posh/sdk.md)

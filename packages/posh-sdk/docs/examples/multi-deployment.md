# Multi-Deployment Usage Examples

## Example 1: Using Official Deployment

```typescript
import { PoshClient, createConfigFromDeployment } from '@human-0/posh-sdk';

// Simple: Use official deployment
const client = new PoshClient(
  createConfigFromDeployment('human0-base-mainnet')
);

// Query as normal
const isRegistered = await client.identity.isRegistered('0x...');
```

## Example 2: Custom Organization Deployment

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Your organization's custom deployment
const myOrgClient = new PoshClient({
  chainId: 8453, // Base Mainnet
  contracts: {
    humanIdentity: '0xMyOrg_Identity_Contract...',
    proofRegistry: '0xMyOrg_Proof_Registry...',
    poshNFT: '0xMyOrg_NFT_Contract...',
    humanScore: '0xMyOrg_Score_Contract...',
  },
});

// Works exactly the same
const humanId = await myOrgClient.identity.getHumanId('0x...');
```

## Example 3: Register Community Deployment

```typescript
import { registerDeployment, createConfigFromDeployment } from '@human-0/posh-sdk';

// Register your deployment for the community
registerDeployment('eco-dao-optimism', {
  name: 'EcoDAO on Optimism',
  description: 'Community-run PoSH for environmental DAOs',
  chainId: 10,
  addresses: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
  deployer: '0xEcoDAO...',
  deployedAt: new Date('2025-03-01'),
  verified: true,
});

// Now anyone can use it
const ecoDaoClient = new PoshClient(
  createConfigFromDeployment('eco-dao-optimism')
);
```

## Example 4: Multi-Chain Application

```typescript
import { PoshClient, createConfigFromDeployment } from '@human-0/posh-sdk';

// Support multiple chains in one app
const clients = {
  base: new PoshClient(createConfigFromDeployment('human0-base-mainnet')),
  optimism: new PoshClient({
    chainId: 10,
    contracts: { /* Optimism contracts */ },
  }),
  arbitrum: new PoshClient({
    chainId: 42161,
    contracts: { /* Arbitrum contracts */ },
  }),
};

// Query user across all chains
async function getUserProfile(address: string) {
  const [baseId, opId, arbId] = await Promise.all([
    clients.base.identity.getHumanId(address),
    clients.optimism.identity.getHumanId(address),
    clients.arbitrum.identity.getHumanId(address),
  ]);

  const profiles = await Promise.all([
    baseId ? getChainProfile(clients.base, baseId, 'Base') : null,
    opId ? getChainProfile(clients.optimism, opId, 'Optimism') : null,
    arbId ? getChainProfile(clients.arbitrum, arbId, 'Arbitrum') : null,
  ]);

  return profiles.filter(Boolean);
}

async function getChainProfile(client: PoshClient, humanId: string, chain: string) {
  const [proofs, score, level] = await Promise.all([
    client.proofs.getProofCount(humanId),
    client.score.getScore(humanId),
    client.score.getLevel(humanId),
  ]);

  return {
    chain,
    humanId,
    proofCount: proofs,
    score,
    level: level.name,
  };
}
```

## Example 5: Deployment Discovery

```typescript
import { listDeployments, getDeploymentsByChain } from '@human-0/posh-sdk';

// List all known deployments
const allDeployments = listDeployments();
console.log('Available PoSH deployments:', allDeployments);

// Find deployments on a specific chain
const baseDeployments = getDeploymentsByChain(8453);
console.log('Base Mainnet deployments:', baseDeployments);

// Let user choose
function DeploymentSelector() {
  const deployments = listDeployments();
  
  return (
    <select onChange={(e) => selectDeployment(e.target.value)}>
      {deployments.map(d => (
        <option key={d.name} value={d.name}>
          {d.name} - {d.description}
        </option>
      ))}
    </select>
  );
}
```

## Example 6: Aggregated Impact Across Deployments

```typescript
import { PoshClient } from '@human-0/posh-sdk';

// Track impact across multiple PoSH systems
async function getAggregatedImpact(address: string, clients: PoshClient[]) {
  const results = await Promise.all(
    clients.map(async (client) => {
      const humanId = await client.identity.getHumanId(address);
      if (!humanId) return { impact: 0n, proofs: 0 };

      const [impact, proofs] = await Promise.all([
        client.proofs.getTotalImpact(humanId),
        client.proofs.getProofCount(humanId),
      ]);

      return { impact, proofs };
    })
  );

  return {
    totalImpact: results.reduce((sum, r) => sum + r.impact, 0n),
    totalProofs: results.reduce((sum, r) => sum + r.proofs, 0),
    byDeployment: results,
  };
}
```

## Example 7: Deployment Verification

```typescript
import { getDeployment } from '@human-0/posh-sdk';

// Check deployment details before using
function verifyDeployment(name: string) {
  const deployment = getDeployment(name);
  
  if (!deployment) {
    throw new Error(`Unknown deployment: ${name}`);
  }

  // Check if verified
  if (!deployment.verified) {
    console.warn(`Warning: ${name} is not verified`);
  }

  // Check deployer
  console.log('Deployed by:', deployment.deployer);
  console.log('Deployed at:', deployment.deployedAt);

  return deployment;
}
```

## Example 8: React Component with Deployment Switching

```typescript
import { useState } from 'react';
import { PoshClient, listDeployments, createConfigFromDeployment } from '@human-0/posh-sdk';

function MultiDeploymentApp() {
  const [selectedDeployment, setSelectedDeployment] = useState('human0-base-mainnet');
  const [client, setClient] = useState(() => 
    new PoshClient(createConfigFromDeployment('human0-base-mainnet'))
  );

  const handleDeploymentChange = (name: string) => {
    setSelectedDeployment(name);
    setClient(new PoshClient(createConfigFromDeployment(name)));
  };

  return (
    <div>
      <select 
        value={selectedDeployment}
        onChange={(e) => handleDeploymentChange(e.target.value)}
      >
        {listDeployments().map(d => (
          <option key={d.name} value={d.name}>
            {d.description}
          </option>
        ))}
      </select>

      <UserProfile client={client} />
    </div>
  );
}
```

## Benefits of Multi-Deployment Support

1. **Decentralization**: No single point of control
2. **Flexibility**: Organizations can run their own systems
3. **Interoperability**: Same SDK, different deployments
4. **Community**: Anyone can deploy and share
5. **Resilience**: Multiple systems provide redundancy
6. **Choice**: Users can choose which system to trust

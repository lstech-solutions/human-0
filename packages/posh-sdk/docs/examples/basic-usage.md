# Basic Usage Examples

## Example 1: Check if Address is Registered

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

async function checkRegistration(address: string) {
  const isRegistered = await client.identity.isRegistered(address);
  
  if (isRegistered) {
    const humanId = await client.identity.getHumanId(address);
    console.log(`Address is registered with humanId: ${humanId}`);
  } else {
    console.log('Address is not registered');
  }
}

checkRegistration('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

## Example 2: Register New Identity

```typescript
import { PoshClient } from '@human-0/posh-sdk';
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = new PoshClient({ /* config */ });

async function registerNewIdentity() {
  // Create wallet client from browser wallet
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });

  try {
    const result = await client.identity.register(walletClient);
    console.log('Transaction hash:', result.hash);
    
    // Wait for confirmation
    const receipt = await result.wait();
    console.log('Registered! Human ID:', result.humanId);
    console.log('Block number:', receipt.blockNumber);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
```

## Example 3: Query Proofs and Calculate Impact

```typescript
async function getImpactData(humanId: string) {
  // Get all proofs
  const proofs = await client.proofs.getHumanProofs(humanId);
  console.log(`Total proofs: ${proofs.length}`);

  // Get total impact
  const totalImpact = await client.proofs.getTotalImpact(humanId);
  console.log('Total impact:', totalImpact);

  // Get impact by type
  const energyImpact = await client.proofs.getTotalImpact(
    humanId,
    'renewable_energy'
  );
  console.log('Renewable energy impact:', energyImpact);

  // Get score and level
  const score = await client.score.getScore(humanId);
  const level = await client.score.getLevel(humanId);
  console.log(`Score: ${score}`);
  console.log(`Level: ${level.name} (${level.minScore} - ${level.maxScore})`);
}
```

## Example 4: Filter Proofs

```typescript
async function getFilteredProofs(humanId: string) {
  // Get only Tier A renewable energy proofs from 2024
  const proofs = await client.proofs.getHumanProofs(humanId, {
    impactType: 'renewable_energy',
    tier: ProofTier.A,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    limit: 10,
  });

  proofs.forEach(proof => {
    console.log(`Proof ${proof.proofId}:`);
    console.log(`  Type: ${proof.impactType}`);
    console.log(`  Value: ${proof.impactValue}`);
    console.log(`  Tier: ${proof.tier}`);
    console.log(`  Date: ${proof.timestamp}`);
  });
}
```

## Example 5: Subscribe to Events

```typescript
async function subscribeToEvents() {
  // Subscribe to new registrations
  const unsubscribeRegistrations = client.events.onHumanRegistered((event) => {
    console.log('New human registered!');
    console.log('Human ID:', event.humanId);
    console.log('Wallet:', event.wallet);
    console.log('Timestamp:', event.timestamp);
  });

  // Subscribe to new proofs
  const unsubscribeProofs = client.events.onProofRegistered((event) => {
    console.log('New proof registered!');
    console.log('Proof ID:', event.proofId);
    console.log('Human ID:', event.humanId);
    console.log('Impact type:', event.impactType);
    console.log('Impact value:', event.impactValue);
    console.log('Tier:', event.tier);
  });

  // Subscribe to identity linking
  const unsubscribeLinks = client.events.onIdentityLinked((event) => {
    console.log('External proof linked!');
    console.log('Human ID:', event.humanId);
    console.log('Provider:', event.provider);
  });

  // Cleanup when done
  // unsubscribeRegistrations();
  // unsubscribeProofs();
  // unsubscribeLinks();
}
```

## Example 6: Error Handling

```typescript
import { ValidationError, ContractError, NetworkError } from '@human-0/posh-sdk';

async function safeRegister(walletClient) {
  try {
    const result = await client.identity.register(walletClient);
    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Invalid input:', error.message);
      console.error('Remediation:', error.remediation);
    } else if (error instanceof ContractError) {
      console.error('Contract error:', error.contractName, error.functionName);
      console.error('Revert reason:', error.revertReason);
    } else if (error instanceof NetworkError) {
      console.error('Network error on chain', error.chainId);
      console.error('RPC URL:', error.rpcUrl);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

## Example 7: Batch Operations

```typescript
async function batchGetProofs(proofIds: string[]) {
  // Get multiple proofs in a single call
  const proofs = await client.proofs.batchGetProofs(proofIds);
  
  proofs.forEach((proof, index) => {
    console.log(`Proof ${index + 1}:`, proof.impactType, proof.impactValue);
  });
}

async function batchGetHumanProofs(humanIds: string[]) {
  // Get proofs for multiple humans
  const proofsMap = await client.proofs.batchGetHumanProofs(humanIds);
  
  proofsMap.forEach((proofs, humanId) => {
    console.log(`Human ${humanId} has ${proofs.length} proofs`);
  });
}
```

## Example 8: Gas Estimation

```typescript
async function estimateRegistrationCost() {
  // Estimate gas for registration
  const gasUnits = await client.identity.estimateRegisterGas();
  console.log('Estimated gas units:', gasUnits);

  // Calculate cost (assuming gas price)
  const gasPrice = 1000000000n; // 1 gwei
  const costInWei = gasUnits * gasPrice;
  const costInEth = Number(costInWei) / 1e18;
  console.log(`Estimated cost: ${costInEth} ETH`);
}
```

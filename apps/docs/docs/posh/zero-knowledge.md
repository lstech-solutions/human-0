---
sidebar_position: 4
title: Zero-Knowledge Privacy Layer
description: Privacy-preserving proofs for identity and impact verification
keywords: [zero-knowledge, ZK, privacy, Semaphore, circuits, SNARK]
---

# Zero-Knowledge Privacy Layer

The PoSH protocol supports optional zero-knowledge proofs (ZKPs) to ensure privacy while maintaining verifiability. This enables users to prove sustainability impact without exposing personal data.

---

## Overview

Zero-knowledge proofs allow a prover to convince a verifier that a statement is true without revealing any information beyond the validity of the statement itself.

In PoSH, ZK proofs enable:

1. **Identity Privacy**: Prove you're a registered human without revealing which one
2. **Impact Privacy**: Prove you performed a sustainable action without exposing raw data
3. **Threshold Proofs**: Prove your score exceeds a threshold without revealing the exact value

---

## ZK Circuit Definitions

### 1. Identity Membership Circuit

Proves that the prover is a member of the human registry without revealing the corresponding leaf in the Merkle tree.

```
┌─────────────────────────────────────────────────────────────────┐
│                  IDENTITY MEMBERSHIP CIRCUIT                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Private Inputs:                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • identitySecret: bytes32                               │    │
│  │ • identityNullifier: bytes32                            │    │
│  │ • merkleProof: bytes32[]                                │    │
│  │ • pathIndices: uint256[]                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Public Inputs:                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • merkleRoot: bytes32                                   │    │
│  │ • nullifierHash: bytes32                                │    │
│  │ • externalNullifier: bytes32                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Constraints:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. identityCommitment = H(identitySecret, nullifier)    │    │
│  │ 2. MerkleProof(commitment, proof, root) == true         │    │
│  │ 3. nullifierHash = H(externalNullifier, nullifier)      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Output: proof π                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Mathematical Formulation:**

Given a Merkle tree `\mathcal{T}` with root `R` containing identity commitments:

```math
\mathsf{IdentityProof} = \pi \text{ such that } \exists \, (s, n, p) : 
```
```math
H(s \| n) \in \mathcal{T} \land \mathsf{Root}(\mathcal{T}) = R
```

Where:
- `s` is the identity secret
- `n` is the identity nullifier  
- `p` is the Merkle proof path
- `H` is the Poseidon hash function

### 2. Impact Verification Circuit

Takes raw MRV data as private input and proves correctness of impact values without exposing raw activity.

```
┌─────────────────────────────────────────────────────────────────┐
│                  IMPACT VERIFICATION CIRCUIT                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Private Inputs:                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • rawMRVData: {                                         │    │
│  │     meterId: string,                                    │    │
│  │     readings: number[],                                 │    │
│  │     timestamps: number[],                               │    │
│  │     location: {lat, lng},                               │    │
│  │     signature: bytes                                    │    │
│  │   }                                                     │    │
│  │ • conversionFactors: number[]                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Public Inputs:                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • impactType: bytes32                                   │    │
│  │ • impactValue: uint256 (e.g., 5000 Wh)                  │    │
│  │ • co2eAvoided: uint256 (e.g., 2000 grams)               │    │
│  │ • methodologyHash: bytes32                              │    │
│  │ • mrvDataHash: bytes32                                  │    │
│  │ • trustedSourcePubKey: bytes                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Constraints:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. VerifySignature(rawMRVData, signature, pubKey)       │    │
│  │ 2. H(rawMRVData) == mrvDataHash                         │    │
│  │ 3. Sum(readings) == impactValue                         │    │
│  │ 4. impactValue * factor == co2eAvoided                  │    │
│  │ 5. All readings within plausible range                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Output: proof π                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**What This Proves:**

> "I consumed exactly 5 kWh of renewable energy, avoiding 2 kg CO2e, verified by a trusted source"

**Without Revealing:**
- Meter ID or account number
- Exact timestamps
- Geographic location
- Individual reading values

### 3. Score Threshold Circuit

Proves that a user's score exceeds a threshold without revealing the exact score.

```
┌─────────────────────────────────────────────────────────────────┐
│                  SCORE THRESHOLD CIRCUIT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Private Inputs:                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • actualScore: uint256                                  │    │
│  │ • proofIds: bytes32[]                                   │    │
│  │ • proofValues: uint256[]                                │    │
│  │ • proofWeights: uint256[]                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Public Inputs:                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • humanId: bytes32                                      │    │
│  │ • threshold: uint256                                    │    │
│  │ • proofsRoot: bytes32 (Merkle root of all proofs)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Constraints:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. All proofIds belong to humanId                       │    │
│  │ 2. Sum(proofValues * proofWeights) == actualScore       │    │
│  │ 3. actualScore >= threshold                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Output: proof π (proves score >= threshold)                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Architecture

### Circuit Development Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      ZK DEVELOPMENT STACK                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Circuit Language:                                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Circom 2.0 - Domain-specific language for ZK circuits  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Proving System:                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Groth16 - Efficient SNARK with small proof size        │    │
│  │  (~200 bytes, constant verification time)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Client-side Proving:                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  snarkjs - JavaScript library for proof generation      │    │
│  │  Runs in browser via WebAssembly                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  On-chain Verification:                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Solidity Verifier - Auto-generated from circuit        │    │
│  │  ~200k gas per verification                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Semaphore Integration

For identity membership proofs, PoSH integrates with [Semaphore](https://semaphore.pse.dev/):

```typescript
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof, verifyProof } from "@semaphore-protocol/proof";

// Create identity (client-side, private)
const identity = new Identity();

// Add to group (on-chain)
const group = new Group(groupId, treeDepth);
group.addMember(identity.commitment);

// Generate proof of membership
const proof = await generateProof(
  identity,
  group,
  externalNullifier,
  signal
);

// Verify on-chain
const isValid = await semaphoreContract.verifyProof(
  groupId,
  proof.merkleTreeRoot,
  proof.signal,
  proof.nullifierHash,
  proof.externalNullifier,
  proof.proof
);
```

---

## Privacy Guarantees

### What is Hidden

| Data Type | Hidden | Visible |
|-----------|--------|---------|
| Wallet address | ✅ (with ZK identity) | ❌ |
| Meter ID | ✅ | ❌ |
| Location | ✅ | ❌ |
| Exact timestamps | ✅ | ❌ |
| Individual readings | ✅ | ❌ |
| Exact score | ✅ (threshold proof) | ❌ |
| Impact type | ❌ | ✅ |
| Aggregated value | ❌ | ✅ |
| Methodology | ❌ | ✅ |

### Privacy Levels

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRIVACY SPECTRUM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Level 0: Transparent (Phase 0)                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • humanId = hash(wallet)                                │    │
│  │ • All proof data on-chain                               │    │
│  │ • Pseudonymous but linkable                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Level 1: Hashed (Phase 1)                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Raw MRV data hashed                                   │    │
│  │ • Only aggregates on-chain                              │    │
│  │ • Off-chain data for audit                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Level 2: ZK Identity (Phase 2)                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Semaphore membership proofs                           │    │
│  │ • Unlinkable identity                                   │    │
│  │ • Nullifiers prevent double-claiming                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Level 3: Full ZK (Phase 3)                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • ZK proofs for all impact claims                       │    │
│  │ • Client-side proof generation                          │    │
│  │ • Maximum privacy                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Example: Private Impact Proof

A user wants to prove they consumed renewable energy without revealing their meter ID or location.

### Step 1: Collect MRV Data (Private)

```typescript
const mrvData = {
  meterId: "METER-12345-SECRET",
  readings: [1.2, 1.5, 1.3, 1.0], // kWh per hour
  timestamps: [1704067200, 1704070800, 1704074400, 1704078000],
  location: { lat: 4.6097, lng: -74.0817 }, // Bogotá
  signature: "0x..." // Signed by utility
};
```

### Step 2: Generate ZK Proof (Client-side)

```typescript
import { generateImpactProof } from '@human-0/zk';

const { proof, publicSignals } = await generateImpactProof({
  privateInputs: {
    mrvData,
    conversionFactor: 400 // grams CO2 per kWh
  },
  publicInputs: {
    impactType: keccak256("renewable_energy"),
    impactValue: 5000, // 5 kWh in Wh
    co2eAvoided: 2000, // 2 kg in grams
    methodologyHash: keccak256("GHG-SCOPE2-2024"),
    trustedSourcePubKey: UTILITY_PUBLIC_KEY
  }
});

// proof is ~200 bytes
// publicSignals contains only the public inputs
```

### Step 3: Submit On-chain

```typescript
await proofRegistry.submitZKProof(
  humanId,
  publicSignals.impactType,
  publicSignals.impactValue,
  publicSignals.co2eAvoided,
  publicSignals.methodologyHash,
  proof
);
```

### Step 4: Verify (On-chain)

```solidity
function submitZKProof(
    bytes32 humanId,
    bytes32 impactType,
    uint256 impactValue,
    uint256 co2eAvoided,
    bytes32 methodologyHash,
    bytes calldata proof
) external {
    // Verify ZK proof
    require(
        zkVerifier.verifyProof(proof, [
            uint256(impactType),
            impactValue,
            co2eAvoided,
            uint256(methodologyHash)
        ]),
        "Invalid ZK proof"
    );
    
    // Store proof (no raw data needed)
    _storeProof(humanId, impactType, impactValue, ...);
}
```

---

## Performance Considerations

### Proof Generation Time

| Circuit | Constraints | Proving Time (Browser) | Proving Time (Native) |
|---------|-------------|------------------------|----------------------|
| Identity Membership | ~10k | 2-3 seconds | under 1 second |
| Impact Verification | ~50k | 10-15 seconds | 2-3 seconds |
| Score Threshold | ~20k | 4-6 seconds | 1-2 seconds |

### Verification Cost

| Circuit | On-chain Gas | USD (at 10 gwei, \$2000 ETH) |
|---------|--------------|----------------------------|
| Groth16 Verifier | ~200,000 | ~$4.00 |
| On L2 (Base) | ~200,000 | ~$0.01 |

---

## Roadmap

| Phase | Privacy Features |
|-------|------------------|
| **Phase 0** | Pseudonymous humanId, hashed verification |
| **Phase 1** | Off-chain MRV storage, on-chain hashes only |
| **Phase 2** | Semaphore identity integration |
| **Phase 3** | Full ZK impact proofs, client-side proving |

---

## References

- [Semaphore Protocol](https://semaphore.pse.dev/)
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Library](https://github.com/iden3/snarkjs)
- [Groth16 Paper](https://eprint.iacr.org/2016/260)

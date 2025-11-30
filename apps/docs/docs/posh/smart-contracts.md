---
sidebar_position: 3
title: Smart Contracts
description: Complete smart contract specifications and ABI reference
keywords: [smart contracts, solidity, ABI, HumanIdentity, ProofRegistry, PoSHNFT]
---

# PoSH Smart Contracts

Complete reference documentation for the PoSH smart contract suite deployed on Base L2.

---

## Contract Overview

| Contract | Purpose | Dependencies |
|----------|---------|--------------|
| `HumanIdentity` | Identity registry: wallet → humanId | None |
| `ProofRegistry` | Stores verified sustainability proofs | HumanIdentity |
| `PoSHNFT` | Soulbound NFTs for aggregated proofs | HumanIdentity, ProofRegistry |
| `HumanScore` | Reputation scoring system | HumanIdentity, ProofRegistry |

---

## HumanIdentity

Maps wallet addresses to pseudonymous human identifiers.

### Interface

```solidity
interface IHumanIdentity {
    // Events
    event HumanRegistered(bytes32 indexed humanId, address indexed wallet, uint256 timestamp);
    event IdentityLinked(bytes32 indexed humanId, bytes32 indexed externalProofHash, string provider);
    
    // Read functions
    function getHumanId(address wallet) external view returns (bytes32);
    function isRegistered(address wallet) external view returns (bool);
    function humanExists(bytes32 humanId) external view returns (bool);
    function getWallet(bytes32 humanId) external view returns (address);
    function getRegistrationTime(bytes32 humanId) external view returns (uint256);
    function getExternalProofs(bytes32 humanId) external view returns (bytes32[] memory);
    function totalHumans() external view returns (uint256);
    
    // Write functions
    function registerHuman() external returns (bytes32 humanId);
    function linkExternalProof(bytes32 externalProofHash, string calldata provider, bytes calldata signature) external;
}
```

### Usage Examples

```typescript
import { useWriteContract, useReadContract } from 'wagmi';

// Check if registered
const { data: isRegistered } = useReadContract({
  address: HUMAN_IDENTITY_ADDRESS,
  abi: HumanIdentityABI,
  functionName: 'isRegistered',
  args: [walletAddress],
});

// Register new identity
const { writeContract } = useWriteContract();
await writeContract({
  address: HUMAN_IDENTITY_ADDRESS,
  abi: HumanIdentityABI,
  functionName: 'registerHuman',
});
```

### Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| `registerHuman()` | ~65,000 |
| `linkExternalProof()` | ~45,000 |
| `getHumanId()` | ~2,500 (view) |

---

## ProofRegistry

Stores canonical, deduplicated sustainability proofs submitted by authorized oracles.

### Structs

```solidity
struct Proof {
    bytes32 humanId;           // Owner's identity
    bytes32 impactType;        // keccak256("renewable_energy")
    uint256 impactValue;       // Value in canonical units
    bytes32 methodologyHash;   // Verification methodology
    bytes32 verificationHash;  // Links to off-chain MRV
    uint64 timestamp;          // When impact occurred
    uint8 tier;                // Quality: 1=A, 2=B, 3=C
}
```

### Interface

```solidity
interface IProofRegistry {
    // Events
    event ProofRegistered(
        bytes32 indexed humanId,
        bytes32 indexed proofId,
        bytes32 indexed impactType,
        uint256 impactValue,
        uint8 tier
    );
    event OracleAuthorized(address indexed oracle, bool authorized);
    
    // Read functions
    function proofs(bytes32 proofId) external view returns (Proof memory);
    function getHumanProofIds(bytes32 humanId) external view returns (bytes32[] memory);
    function getHumanProofCount(bytes32 humanId) external view returns (uint256);
    function getProof(bytes32 proofId) external view returns (Proof memory);
    function getTotalImpact(bytes32 humanId, bytes32 impactType) external view returns (uint256);
    function usedVerification(bytes32 hash) external view returns (bool);
    function authorizedOracles(address oracle) external view returns (bool);
    function totalProofs() external view returns (uint256);
    
    // Write functions (oracle only)
    function submitProof(
        bytes32 humanId,
        bytes32 impactType,
        uint256 impactValue,
        bytes32 methodologyHash,
        bytes32 verificationHash,
        uint64 timestamp,
        uint8 tier,
        bytes calldata oracleSignature
    ) external returns (bytes32 proofId);
    
    // Admin functions
    function setOracleAuthorization(address oracle, bool authorized) external;
}
```

### Impact Types

```solidity
// Standard impact type identifiers
bytes32 constant RENEWABLE_ENERGY = keccak256("renewable_energy");
bytes32 constant CO2E_AVOIDED = keccak256("co2e_avoided");
bytes32 constant TREES_PLANTED = keccak256("trees_planted");
bytes32 constant EV_CHARGING = keccak256("ev_charging");
bytes32 constant SUSTAINABLE_PURCHASE = keccak256("sustainable_purchase");
```

### Usage Examples

```typescript
// Get all proofs for a human
const { data: proofIds } = useReadContract({
  address: PROOF_REGISTRY_ADDRESS,
  abi: ProofRegistryABI,
  functionName: 'getHumanProofIds',
  args: [humanId],
});

// Get total renewable energy
const { data: totalEnergy } = useReadContract({
  address: PROOF_REGISTRY_ADDRESS,
  abi: ProofRegistryABI,
  functionName: 'getTotalImpact',
  args: [humanId, keccak256(toBytes('renewable_energy'))],
});
```

---

## PoSHNFT

Soulbound ERC-721 tokens representing aggregated sustainability proofs.

### Structs

```solidity
struct NFTMetadata {
    bytes32 humanId;
    bytes32[] proofIds;
    uint256 totalCO2e;        // Total CO2e avoided (grams)
    uint256 totalEnergy;      // Total renewable energy (Wh)
    uint256 mintTimestamp;
    string period;            // e.g., "2025-01"
}
```

### Interface

```solidity
interface IPoSHNFT {
    // Events
    event PoSHMinted(
        bytes32 indexed humanId,
        uint256 indexed tokenId,
        uint256 proofCount,
        uint256 totalCO2e
    );
    
    // Read functions
    function tokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory);
    function getHumanTokens(bytes32 humanId) external view returns (uint256[] memory);
    function getTotalCO2e(bytes32 humanId) external view returns (uint256);
    function hasPoSH(bytes32 humanId) external view returns (bool);
    function getTokenProofs(uint256 tokenId) external view returns (bytes32[] memory);
    function proofToToken(bytes32 proofId) external view returns (uint256);
    
    // Write functions
    function mintPoSH(
        bytes32[] calldata proofIds,
        string calldata metadataURI,
        string calldata period
    ) external returns (uint256 tokenId);
    
    // ERC-721 standard (transfers blocked - soulbound)
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
```

### Soulbound Behavior

```solidity
// Transfers are blocked
function transferFrom(address, address, uint256) public pure override {
    revert("Soulbound: non-transferable");
}

function safeTransferFrom(address, address, uint256) public pure override {
    revert("Soulbound: non-transferable");
}
```

### Usage Examples

```typescript
// Check if user has any PoSH NFTs
const { data: hasPoSH } = useReadContract({
  address: POSH_NFT_ADDRESS,
  abi: PoSHNFTABI,
  functionName: 'hasPoSH',
  args: [humanId],
});

// Mint new PoSH NFT
const { writeContract } = useWriteContract();
await writeContract({
  address: POSH_NFT_ADDRESS,
  abi: PoSHNFTABI,
  functionName: 'mintPoSH',
  args: [proofIds, metadataURI, "2025-01"],
});
```

---

## HumanScore

Aggregates proofs into weighted reputation scores.

### Constants

```solidity
// Impact type weights (basis points: 10000 = 1.0x)
bytes32 constant RENEWABLE_ENERGY = keccak256("renewable_energy");     // 10000
bytes32 constant CO2E_AVOIDED = keccak256("co2e_avoided");             // 10000
bytes32 constant TREES_PLANTED = keccak256("trees_planted");           // 15000
bytes32 constant EV_CHARGING = keccak256("ev_charging");               // 8000
bytes32 constant SUSTAINABLE_PURCHASE = keccak256("sustainable_purchase"); // 5000

// Tier multipliers
uint256 constant TIER_A_MULTIPLIER = 10000; // 1.0x
uint256 constant TIER_B_MULTIPLIER = 5000;  // 0.5x
uint256 constant TIER_C_MULTIPLIER = 1000;  // 0.1x

// Decay rate: 10% per year
uint256 constant DECAY_RATE_BPS_PER_YEAR = 1000;
```

### Interface

```solidity
interface IHumanScore {
    // Read functions
    function getHumanScore(bytes32 humanId) external view returns (uint256 score);
    function getHumanLevel(bytes32 humanId) external view returns (uint8 level);
    function meetsThreshold(bytes32 humanId, uint256 minScore) external view returns (bool);
    function getImpactBreakdown(bytes32 humanId, bytes32 impactType) 
        external view returns (uint256 totalValue, uint256 weightedValue);
    function getProofCountByTier(bytes32 humanId) 
        external view returns (uint256 tierA, uint256 tierB, uint256 tierC);
    function impactWeights(bytes32 impactType) external view returns (uint256);
}
```

### Score Calculation

```
score = Σ (impactValue × typeWeight × tierMultiplier × decayMultiplier) / 10^12
```

### Level Thresholds

| Level | Name | Threshold |
|-------|------|-----------|
| 0 | None | 0 |
| 1 | Bronze | 100 |
| 2 | Silver | 1,000 |
| 3 | Gold | 10,000 |
| 4 | Platinum | 100,000 |
| 5 | Diamond | 1,000,000 |

### Usage Examples

```typescript
// Get user's score
const { data: score } = useReadContract({
  address: HUMAN_SCORE_ADDRESS,
  abi: HumanScoreABI,
  functionName: 'getHumanScore',
  args: [humanId],
});

// Get user's level
const { data: level } = useReadContract({
  address: HUMAN_SCORE_ADDRESS,
  abi: HumanScoreABI,
  functionName: 'getHumanLevel',
  args: [humanId],
});

// Check if meets threshold for gating
const { data: meetsThreshold } = useReadContract({
  address: HUMAN_SCORE_ADDRESS,
  abi: HumanScoreABI,
  functionName: 'meetsThreshold',
  args: [humanId, 1000n], // Requires Silver level
});
```

---

## Deployment Addresses

:::caution
Contracts are not yet deployed. Addresses will be updated after deployment.
:::

### Base Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| HumanIdentity | `TBD` |
| ProofRegistry | `TBD` |
| PoSHNFT | `TBD` |
| HumanScore | `TBD` |

### Base (Mainnet)

| Contract | Address |
|----------|---------|
| HumanIdentity | `TBD` |
| ProofRegistry | `TBD` |
| PoSHNFT | `TBD` |
| HumanScore | `TBD` |

---

## Security Considerations

### Access Control

- `ProofRegistry.submitProof()` - Oracle only
- `ProofRegistry.setOracleAuthorization()` - Owner only
- `PoSHNFT.mintPoSH()` - Registered humans only

### Reentrancy Protection

All state changes occur before external calls. No callback vulnerabilities.

### Integer Overflow

Solidity 0.8+ provides built-in overflow protection.

### Deduplication

`usedVerification` mapping prevents double-counting of MRV data.

---

## ABI Downloads

ABIs will be published after deployment. Expected files:
- `HumanIdentity.json`
- `ProofRegistry.json`
- `PoSHNFT.json`
- `HumanScore.json`

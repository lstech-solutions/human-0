---
sidebar_position: 2
title: Technical Architecture
description: Deep technical analysis of the PoSH system architecture
keywords: [architecture, smart contracts, oracle, MRV, identity]
---

# PoSH Technical Architecture

This document provides a comprehensive technical analysis of the Proof of Sustainable Humanity (PoSH) system architecture, including formal specifications, data flows, and security considerations.

---

## 1. Identity Layer

The identity layer ensures the mapping of one distinct human individual to one protocol identifier, denoted as `humanId`. This does **not** require traditional KYC, biometrics, or personally identifiable information (PII).

### 1.1 Identity Generation

The `humanId` is a deterministic 32-byte value derived from the user's wallet and chain context:

```
humanId = keccak256(wallet_address || chain_id || "HUMAN0_POSH_V1")
```

**Mathematical notation:**
```math
\mathsf{humanId} = H(\mathsf{publicKey} \,\|\, \mathsf{chainId} \,\|\, \mathsf{salt})
```

Where:
- `H` is the Keccak-256 hash function
- `\|` denotes concatenation
- `\mathsf{salt}` is a protocol-specific constant

### 1.2 Supported Identity Approaches

| Approach | Description | Privacy Level | Sybil Resistance |
|----------|-------------|---------------|------------------|
| **Wallet-based** | Simple wallet → humanId mapping | Medium | Low |
| **ZK-unique Human** | Semaphore/Sismo membership proofs | High | High |
| **Passkey/WebAuthn** | Device-bound attestation | High | Medium |
| **Hybrid Trees** | Merkle commitment with periodic proofs | High | High |

### 1.3 HumanIdentity Contract

```solidity
contract HumanIdentity {
    // Storage
    mapping(address => bytes32) private _walletToHuman;
    mapping(bytes32 => address) private _humanToWallet;
    mapping(bytes32 => uint256) private _registrationTime;
    mapping(bytes32 => bytes32[]) private _externalProofs;
    
    // Events
    event HumanRegistered(bytes32 indexed humanId, address indexed wallet, uint256 timestamp);
    event IdentityLinked(bytes32 indexed humanId, bytes32 indexed externalProofHash, string provider);
    
    // Core function
    function registerHuman() external returns (bytes32 humanId) {
        require(_walletToHuman[msg.sender] == bytes32(0), "Already registered");
        
        humanId = keccak256(abi.encodePacked(
            msg.sender,
            block.chainid,
            "HUMAN0_POSH_V1"
        ));
        
        _walletToHuman[msg.sender] = humanId;
        _humanToWallet[humanId] = msg.sender;
        _registrationTime[humanId] = block.timestamp;
        
        emit HumanRegistered(humanId, msg.sender, block.timestamp);
    }
}
```

### 1.4 Identity Invariants

The following invariants must hold:

1. **Uniqueness**: `\forall w_1, w_2 \in \mathcal{W}: w_1 \neq w_2 \Rightarrow \mathsf{humanId}(w_1) \neq \mathsf{humanId}(w_2)`
2. **Determinism**: `\mathsf{humanId}(w)` is deterministic given `(w, \mathsf{chainId})`
3. **Immutability**: Once registered, `\mathsf{humanId}` cannot be changed

---

## 2. Impact Verification Layer (MRV → Oracle)

### 2.1 Measurement, Reporting, Verification (MRV)

Each sustainability action is captured by MRV adapters connected to real-world data sources:

```
┌─────────────────────────────────────────────────────────────────┐
│                        MRV DATA SOURCES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Smart Meters │  │   I-REC      │  │  EV Charging │           │
│  │              │  │ Certificates │  │   Networks   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│                           ▼                                      │
│                  ┌─────────────────┐                             │
│                  │   MRV Adapter   │                             │
│                  │                 │                             │
│                  │ • Fetch data    │                             │
│                  │ • Validate      │                             │
│                  │ • Normalize     │                             │
│                  └────────┬────────┘                             │
│                           │                                      │
│                           ▼                                      │
│                  ┌─────────────────┐                             │
│                  │  mrvReport      │                             │
│                  │  {              │                             │
│                  │    type,        │                             │
│                  │    quantity,    │                             │
│                  │    unit,        │                             │
│                  │    co2e,        │                             │
│                  │    timestamp,   │                             │
│                  │    evidenceRefs │                             │
│                  │  }              │                             │
│                  └─────────────────┘                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 MRV Report Schema

The MRV process produces a digitally signed report:

```typescript
interface MRVReport {
  // Impact classification
  type: "renewable_energy" | "co2e_avoided" | "ev_charging" | "trees_planted";
  
  // Quantitative measurement
  quantity: number;           // e.g., 5.0
  unit: "kWh" | "kg" | "km" | "count";
  
  // Carbon equivalent (normalized)
  co2e: number;               // grams CO2e avoided
  
  // Temporal data
  timestamp: number;          // Unix timestamp
  
  // Verification chain
  methodology: string;        // e.g., "GHG-SCOPE2-2024"
  evidenceRefs: string[];     // e.g., ["IREC-CO-2025-000123"]
  
  // Source metadata
  source: string;             // e.g., "unergy_solar"
  userExternalId: string;     // Partner's user ID
}
```

**Formal notation:**
```math
\mathsf{mrvReport} = \langle \mathsf{type},\, \mathsf{quantity},\, \mathsf{unit},\, \mathsf{co2e},\, \mathsf{timestamp},\, \mathsf{evidenceRefs} \rangle
```

### 2.3 Oracle Verification Process

Oracle nodes validate incoming MRV reports through a multi-step verification:

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORACLE VERIFICATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: AUTHENTICITY                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Verify digital signature from MRV source              │    │
│  │ • Check source is in authorized registry                │    │
│  │ • Validate timestamp is within acceptable window        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Step 2: DEDUPLICATION                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Hash evidence references                              │    │
│  │ • Check against usedVerification mapping                │    │
│  │ • Reject if already processed                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Step 3: PLAUSIBILITY                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Check value ranges for impact type                    │    │
│  │ • Compare against regional/device norms                 │    │
│  │ • Flag anomalies for manual review                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Step 4: CLAIM GENERATION                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ claim = H(humanId || impactType || impactValue ||       │    │
│  │           methodologyHash || mrvHash)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Claim Structure

The oracle generates a canonical on-chain claim:

```math
\mathsf{claim} = H(\mathsf{humanId} \,\|\, \mathsf{impactType} \,\|\, \mathsf{impactValue} \,\|\, \mathsf{methodologyHash} \,\|\, \mathsf{mrvHash})
```

```solidity
struct Claim {
    bytes32 humanId;
    bytes32 impactType;      // keccak256("renewable_energy")
    uint256 impactValue;     // Canonical units (Wh, grams)
    bytes32 methodologyHash; // Versioned methodology
    bytes32 verificationHash;// Ties to off-chain MRV
    uint64 timestamp;
    uint8 tier;              // 1=A, 2=B, 3=C
}
```

---

## 3. On-Chain Proof Registration

### 3.1 ProofRegistry Contract

The Proof Registry stores canonical, deduplicated proof records:

```solidity
contract ProofRegistry {
    struct Proof {
        bytes32 humanId;
        bytes32 impactType;
        uint256 impactValue;
        bytes32 methodologyHash;
        bytes32 verificationHash;
        uint64 timestamp;
        uint8 tier;
    }
    
    // Storage
    mapping(bytes32 => Proof) public proofs;           // proofId → Proof
    mapping(bytes32 => bytes32[]) public humanProofs;  // humanId → proofIds[]
    mapping(bytes32 => bool) public usedVerification;  // Deduplication
    mapping(address => bool) public authorizedOracles;
    
    // Submit verified proof
    function submitProof(
        bytes32 humanId,
        bytes32 impactType,
        uint256 impactValue,
        bytes32 methodologyHash,
        bytes32 verificationHash,
        uint64 timestamp,
        uint8 tier,
        bytes calldata oracleSignature
    ) external onlyOracle returns (bytes32 proofId) {
        require(humanIdentity.humanExists(humanId), "Human not registered");
        require(!usedVerification[verificationHash], "Already used");
        require(tier >= 1 && tier <= 3, "Invalid tier");
        
        proofId = keccak256(abi.encodePacked(
            humanId, verificationHash, block.chainid, totalProofs
        ));
        
        proofs[proofId] = Proof({
            humanId: humanId,
            impactType: impactType,
            impactValue: impactValue,
            methodologyHash: methodologyHash,
            verificationHash: verificationHash,
            timestamp: timestamp,
            tier: tier
        });
        
        humanProofs[humanId].push(proofId);
        usedVerification[verificationHash] = true;
        
        emit ProofRegistered(humanId, proofId, impactType, impactValue, tier);
    }
}
```

### 3.2 Proof Record Formal Definition

```math
\mathsf{ProofRecord} = \langle \mathsf{humanId},\, \mathsf{impactType},\, \mathsf{impactValue},\, \mathsf{methodologyHash},\, \mathsf{verificationHash},\, \mathsf{timestamp} \rangle
```

### 3.3 Verification Tiers

| Tier | Name | Description | Multiplier | Examples |
|------|------|-------------|------------|----------|
| **A** | Verified | Cryptographically signed by trusted source | 1.0x | I-REC, Smart meters, EV networks |
| **B** | Partial | Partially verified with supporting evidence | 0.5x | Utility bills, receipts |
| **C** | Self-reported | User attestation only | 0.1x | Manual entry |

---

## 4. PoSH Soulbound Tokens

### 4.1 Token Design

PoSH NFTs are **soulbound** (non-transferable) ERC-721 tokens representing aggregated impact:

```solidity
contract PoSHNFT is ERC721, ERC721URIStorage {
    struct NFTMetadata {
        bytes32 humanId;
        bytes32[] proofIds;
        uint256 totalCO2e;      // Total CO2e avoided (grams)
        uint256 totalEnergy;    // Total renewable energy (Wh)
        uint256 mintTimestamp;
        string period;          // e.g., "2025-01"
    }
    
    // Soulbound: block transfers
    function _update(address to, uint256 tokenId, address auth) 
        internal override returns (address) 
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }
    
    // Mint aggregated proofs
    function mintPoSH(
        bytes32[] calldata proofIds,
        string calldata metadataURI,
        string calldata period
    ) external returns (uint256 tokenId) {
        bytes32 humanId = humanIdentity.getHumanId(msg.sender);
        require(humanId != bytes32(0), "Not registered");
        
        // Validate and aggregate proofs
        uint256 totalCO2e = 0;
        for (uint i = 0; i < proofIds.length; i++) {
            require(proofToToken[proofIds[i]] == 0, "Already minted");
            Proof memory p = proofRegistry.getProof(proofIds[i]);
            require(p.humanId == humanId, "Not your proof");
            totalCO2e += calculateCO2e(p);
        }
        
        // Mint
        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store metadata
        tokenMetadata[tokenId] = NFTMetadata({...});
        
        emit PoSHMinted(humanId, tokenId, proofIds.length, totalCO2e);
    }
}
```

### 4.2 NFT Metadata Structure

```json
{
  "name": "PoSH Certificate - January 2025",
  "description": "Proof of Sustainable Humanity for verified environmental actions",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "Period", "value": "2025-01" },
    { "trait_type": "Total CO2e Avoided", "value": "15.8 kg" },
    { "trait_type": "Renewable Energy", "value": "42 kWh" },
    { "trait_type": "Proof Count", "value": 12 },
    { "trait_type": "Level", "value": "Silver" },
    { "trait_type": "Tier A Proofs", "value": 8 },
    { "trait_type": "Tier B Proofs", "value": 4 }
  ],
  "properties": {
    "humanId": "0x...",
    "proofIds": ["0x...", "0x..."],
    "methodology": "GHG-SCOPE2-2024"
  }
}
```

---

## 5. Reputation and Scoring

### 5.1 Score Calculation

The HumanScore contract aggregates proofs into a numerical reputation:

```math
\mathsf{score}(h) = \sum_{i \in \mathcal{P}(h)} w_{\mathsf{type}}^{(i)} \cdot w_{\mathsf{tier}}^{(i)} \cdot w_{\mathsf{decay}}^{(i)} \cdot \mathsf{impactValue}_i
```

Where:
- `P(h)`: set of proofs for human `h`
- `w_type`: impact type weight
- `w_tier`: verification tier multiplier
- `w_decay`: temporal decay factor

### 5.2 Weight Parameters

```solidity
// Impact type weights (basis points: 10000 = 1.0x)
mapping(bytes32 => uint256) public impactWeights;
// RENEWABLE_ENERGY: 10000 (1.0x)
// CO2E_AVOIDED:     10000 (1.0x)
// TREES_PLANTED:    15000 (1.5x - high impact)
// EV_CHARGING:       8000 (0.8x)
// SUSTAINABLE_PURCHASE: 5000 (0.5x)

// Tier multipliers
uint256 constant TIER_A = 10000; // 1.0x
uint256 constant TIER_B =  5000; // 0.5x
uint256 constant TIER_C =  1000; // 0.1x

// Decay: 10% per year
uint256 constant DECAY_RATE = 1000; // 10% in basis points
```

### 5.3 Score Levels

| Level | Name | Threshold | Benefits |
|-------|------|-----------|----------|
| 0 | None | 0 | Basic access |
| 1 | Bronze | 100+ | Community badge |
| 2 | Silver | 1,000+ | Enhanced features |
| 3 | Gold | 10,000+ | Priority access |
| 4 | Platinum | 100,000+ | Governance weight |
| 5 | Diamond | 1,000,000+ | Elite status |

---

## 6. Data Flow Sequence

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │   App   │     │ Oracle  │     │Contract │     │  Chain  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │ 1. Connect    │               │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │ 2. Check registration         │               │
     │               │──────────────────────────────►│               │
     │               │◄──────────────────────────────│               │
     │               │               │               │               │
     │ 3. Register   │               │               │               │
     │──────────────►│               │               │               │
     │               │ 4. registerHuman()            │               │
     │               │──────────────────────────────►│──────────────►│
     │               │◄──────────────────────────────│◄──────────────│
     │◄──────────────│               │               │               │
     │               │               │               │               │
     │═══════════════│═══════════════│═══════════════│═══════════════│
     │               │               │               │               │
     │               │ 5. MRV Event  │               │               │
     │               │──────────────►│               │               │
     │               │               │ 6. Validate   │               │
     │               │               │ 7. Sign       │               │
     │               │               │ 8. submitProof()              │
     │               │               │──────────────►│──────────────►│
     │               │               │◄──────────────│◄──────────────│
     │               │◄──────────────│               │               │
     │◄──────────────│               │               │               │
     │               │               │               │               │
     │ 9. Mint NFT   │               │               │               │
     │──────────────►│               │               │               │
     │               │ 10. mintPoSH()                │               │
     │               │──────────────────────────────►│──────────────►│
     │               │◄──────────────────────────────│◄──────────────│
     │◄──────────────│               │               │               │
```

---

## 7. Contract Deployment

### 7.1 Deployment Order

```
1. HumanIdentity (no dependencies)
2. ProofRegistry (depends on HumanIdentity)
3. PoSHNFT (depends on HumanIdentity, ProofRegistry)
4. HumanScore (depends on HumanIdentity, ProofRegistry)
```

### 7.2 Network Configuration

| Network | Chain ID | Status | Use Case |
|---------|----------|--------|----------|
| Base Sepolia | 84532 | Active | Testnet / Development |
| Base | 8453 | Planned | Production |
| Ethereum Sepolia | 11155111 | Supported | Testing |
| Ethereum | 1 | Future | High-value proofs |

---

## Next Steps

- [Smart Contract Reference](./smart-contracts) - Full ABI documentation
- [MRV Integration Guide](./mrv-integration) - Connect data sources
- [Zero-Knowledge Proofs](./zero-knowledge) - Privacy implementation

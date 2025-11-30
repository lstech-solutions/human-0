---
sidebar_position: 1
title: Proof of Sustainable Humanity (PoSH)
description: A novel cryptographic primitive for verifying human-scale sustainability contributions
keywords: [posh, proof of sustainable humanity, blockchain, sustainability, MRV, zero-knowledge]
---

# Proof of Sustainable Humanity (PoSH)

> A cryptographically verifiable, privacy-preserving mechanism for representing positive, measurable environmental actions performed by unique human individuals.

## Abstract

The accelerating climate crisis reveals a structural gap in how digital systems recognize, value, and verify human contributions to environmental sustainability. Existing blockchain consensus mechanisms—such as Proof of Work (PoW) and Proof of Stake (PoS)—are fundamentally unsuitable for representing or incentivizing human-scale sustainable action.

**Proof of Sustainable Humanity (PoSH)** is introduced as a new primitive: a cryptographically verifiable, privacy-preserving mechanism that represents the positive, measurable environmental actions performed by unique human individuals. PoSH is designed as the foundational trust layer of the HUMΛN-Ø protocol.

---

## The Problem with Current Consensus Mechanisms

| Mechanism | Fundamental Issue |
|-----------|-------------------|
| **Proof of Work (PoW)** | Externalizes environmental cost through computational waste. Bitcoin alone consumes ~150 TWh/year. |
| **Proof of Stake (PoS)** | Concentrates power among capital-rich actors; remains detached from real-world impact. |
| **Proof of Authority (PoA)** | Centralized trust; no connection to environmental outcomes. |

**PoSH addresses this gap** by creating a consensus dimension that:
- Values **human action** over computational power or capital
- Measures **real environmental impact** through MRV (Measurement, Reporting, Verification)
- Preserves **privacy** while maintaining verifiability
- Enables **global accessibility** without heavy KYC requirements

---

## Design Principles

PoSH is built upon six foundational principles:

### 1. Human-Centeredness
The unit of verification is a unique human, not a machine or capital pool. Each `humanId` represents one distinct individual.

### 2. Environmental Positivity
Each proof must correspond to a measurable positive environmental action—renewable energy consumption, carbon avoidance, sustainable mobility, etc.

### 3. Non-Extractiveness
Minting a PoSH proof requires **no protocol-level fee** beyond blockchain gas costs. The protocol does not tax impact.

### 4. Privacy Preservation
Raw sustainability event data remains off-chain and may be wrapped in zero-knowledge proofs. Users prove impact without exposing personal details.

### 5. Transparency and Verifiability
All claims must be backed by auditable, cryptographically signed MRV records. The verification chain is fully traceable.

### 6. Global Accessibility
The protocol must be usable regardless of geographical location, financial resources, or device constraints.

---

## System Architecture

The PoSH system comprises three primary layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        IDENTITY LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Wallet     │  │  ZK Unique  │  │  External   │              │
│  │  Connection │  │  Human Proof│  │  Identity   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│                   ┌─────────────┐                                │
│                   │  humanId    │                                │
│                   │  (bytes32)  │                                │
│                   └──────┬──────┘                                │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                          ▼                                       │
│              IMPACT VERIFICATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  MRV Data   │  │  Normalizer │  │   Oracle    │              │
│  │  Sources    │─►│   Service   │─►│   Network   │              │
│  └─────────────┘  └─────────────┘  └──────┬──────┘              │
│                                           │                      │
│                                    ┌──────▼──────┐               │
│                                    │ Signed Claim│               │
│                                    └──────┬──────┘               │
└───────────────────────────────────────────┼─────────────────────┘
                                            │
┌───────────────────────────────────────────┼─────────────────────┐
│                                           ▼                      │
│               ON-CHAIN PROOF LAYER (Base L2)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Proof     │  │   PoSH      │  │   Human     │              │
│  │  Registry   │  │   NFT       │  │   Score     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Links

- [**Technical Architecture**](./architecture) - Deep dive into system components
- [**Smart Contracts**](./smart-contracts) - Contract specifications and ABIs
- [**MRV Integration**](./mrv-integration) - How to integrate data sources
- [**Zero-Knowledge Proofs**](./zero-knowledge) - Privacy layer implementation
- [**Whitepaper**](./whitepaper) - Scientific analysis and formal specification

---

## Why PoSH Matters

### For Individuals
- **Prove your impact** without exposing personal data
- **Build reputation** through verified sustainable actions
- **Earn recognition** via Soulbound NFTs

### For Organizations
- **Verify employee/member sustainability** without invasive tracking
- **Gate access** to programs based on proven impact
- **Report ESG metrics** with cryptographic proof

### For the Planet
- **Align digital infrastructure** with planetary boundaries
- **Create positive-sum incentives** for sustainable behavior
- **Enable transparent carbon accounting** at individual scale

---

## Get Started

### For Users
Connect your wallet and create your identity:
- Navigate to: [https://human-0.com/identity](https://human-0.com/identity)

### For Developers

Install the PoSH SDK:

```bash
npm install @human-0/posh-sdk
```

Quick integration example:

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

// Check registration
const isRegistered = await client.identity.isRegistered('0x...');

// Get proofs and score
const humanId = await client.identity.getHumanId('0x...');
const proofs = await client.proofs.getHumanProofs(humanId);
const score = await client.score.getScore(humanId);
```

**Learn more:**
- [SDK Documentation](./sdk) - Complete SDK guide
- [API Reference](./sdk#api-reference) - Detailed API documentation
- [Setup Guide](https://github.com/human-0/human-0.com/blob/main/packages/posh-sdk/SETUP.md) - Installation and configuration


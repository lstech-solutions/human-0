# HUMΛN-Ø PoSH Implementation Planner

> Strategic planning document for Proof of Sustainable Humanity

---

## Current State Assessment

### What's Built ✅

```
packages/contracts/
├── contracts/
│   ├── IHumanIdentity.sol     ✅ Interface
│   ├── HumanIdentity.sol      ✅ Identity registry
│   ├── ProofRegistry.sol      ✅ Proof storage
│   ├── PoSHNFT.sol            ✅ Soulbound NFT
│   └── HumanScore.sol         ✅ Reputation scoring
├── scripts/deploy.ts          ✅ Deployment script
└── hardhat.config.ts          ✅ Network config

apps/web/
├── providers/Web3Provider.tsx  ✅ Wagmi + ConnectKit
├── lib/wagmi-config.ts         ✅ Chain config
├── features/
│   ├── identity/
│   │   ├── components/IdentityCard.tsx    ✅
│   │   ├── hooks/useHumanIdentity.ts      ✅
│   │   └── stores/identityStore.ts        ✅
│   └── wallet/
│       └── components/ConnectWalletButton.tsx ✅
└── app/identity.tsx            ✅ Identity screen
```

### What's Missing 🚧

```
Off-chain Services (Not Started):
├── oracle/                     ❌ Oracle service
│   ├── validator/              ❌ Claim validation
│   └── signer/                 ❌ Claim signing
├── mrv-adapters/               ❌ MRV integrations
│   ├── unergy/                 ❌ Solar partner
│   ├── i-rec/                  ❌ Certificates
│   └── normalizer/             ❌ Data normalization
└── indexer/                    ❌ Event indexing

Frontend (Partial):
├── Proof submission UI         ❌
├── NFT minting UI              ❌
├── Sustainability Passport     ❌
├── Score visualization         ❌
└── Error handling              ❌

Infrastructure:
├── Contract deployment         ❌ Not deployed yet
├── Contract verification       ❌
├── Tests                       ❌
└── CI/CD for contracts         ❌
```

---

## Sprint Planning

### Sprint 0: Foundation (Current)
**Goal**: Complete minimal viable wallet connection and identity creation

| Task | Owner | Status | Blockers |
|------|-------|--------|----------|
| Deploy contracts to Base Sepolia | Dev | 📋 | Funded wallet needed |
| Get WalletConnect Project ID | Dev | 📋 | Account creation |
| Update wagmi-config addresses | Dev | 📋 | Depends on deployment |
| Test identity creation E2E | Dev | 📋 | Depends on above |
| Basic error handling | Dev | 📋 | None |
| Install dependencies (`pnpm install`) | Dev | 📋 | None |

**Definition of Done**:
- User can connect wallet on Base Sepolia
- User can create humanId on-chain
- Transaction status shown in UI
- Errors displayed gracefully

---

### Sprint 1: Oracle & First MRV
**Goal**: Enable first verified impact proof submission

#### Week 1-2: Oracle Service

```
oracle-service/
├── src/
│   ├── index.ts              # Express server
│   ├── validator/
│   │   ├── duplicate.ts      # Check duplicate proofs
│   │   ├── plausibility.ts   # Value range checks
│   │   └── irec.ts           # I-REC verification
│   ├── signer/
│   │   └── claim-signer.ts   # Sign verified claims
│   └── submitter/
│       └── chain-submitter.ts # Submit to contract
├── package.json
└── .env.example
```

**Tasks**:
| Task | Estimate | Priority |
|------|----------|----------|
| Oracle service scaffold | 2h | HIGH |
| Claim validation logic | 4h | HIGH |
| Claim signing (single key) | 2h | HIGH |
| Chain submission | 2h | HIGH |
| API endpoints | 2h | HIGH |
| Basic rate limiting | 2h | MEDIUM |

#### Week 3-4: Unergy MRV Adapter

```
mrv-adapters/
├── common/
│   ├── types.ts              # Shared MRV types
│   └── normalizer.ts         # Normalize to internal format
├── unergy/
│   ├── client.ts             # Unergy API client
│   ├── mapper.ts             # Map to internal format
│   └── webhook.ts            # Receive events
└── package.json
```

**Tasks**:
| Task | Estimate | Priority |
|------|----------|----------|
| MRV types definition | 2h | HIGH |
| Unergy API integration | 4h | HIGH |
| Data normalization | 2h | HIGH |
| User ID mapping | 2h | HIGH |
| Webhook receiver | 2h | MEDIUM |

---

### Sprint 2: Proof & NFT UI
**Goal**: Users can view proofs and mint PoSH NFTs

#### Frontend Components

```
apps/web/features/
├── proofs/
│   ├── components/
│   │   ├── ProofList.tsx         # List of proofs
│   │   ├── ProofCard.tsx         # Individual proof
│   │   └── ProofDetail.tsx       # Proof details modal
│   ├── hooks/
│   │   └── useProofs.ts          # Fetch proofs
│   └── index.ts
├── nft/
│   ├── components/
│   │   ├── MintPoSH.tsx          # Mint NFT UI
│   │   ├── NFTGallery.tsx        # View NFTs
│   │   └── NFTCard.tsx           # Individual NFT
│   ├── hooks/
│   │   └── usePoSHNFT.ts         # NFT interactions
│   └── index.ts
└── passport/
    ├── components/
    │   ├── PassportView.tsx      # Main passport
    │   ├── ImpactSummary.tsx     # Impact cards
    │   └── ScoreDisplay.tsx      # Score visualization
    └── index.ts
```

**Tasks**:
| Task | Estimate | Priority |
|------|----------|----------|
| Proof list component | 4h | HIGH |
| Proof detail view | 2h | HIGH |
| NFT minting flow | 4h | HIGH |
| NFT gallery | 2h | MEDIUM |
| Passport overview | 4h | HIGH |
| Score display | 2h | HIGH |

---

### Sprint 3: Testing & Polish
**Goal**: Production-ready quality

#### Contract Tests

```
packages/contracts/test/
├── HumanIdentity.test.ts
├── ProofRegistry.test.ts
├── PoSHNFT.test.ts
├── HumanScore.test.ts
└── integration/
    └── full-flow.test.ts
```

**Tasks**:
| Task | Estimate | Priority |
|------|----------|----------|
| HumanIdentity tests | 4h | HIGH |
| ProofRegistry tests | 4h | HIGH |
| PoSHNFT tests | 4h | HIGH |
| HumanScore tests | 2h | HIGH |
| Integration tests | 4h | HIGH |
| Gas optimization | 4h | MEDIUM |

#### Frontend Tests

```
apps/web/__tests__/
├── features/
│   ├── identity/
│   │   └── IdentityCard.test.tsx
│   └── wallet/
│       └── ConnectWalletButton.test.tsx
└── e2e/
    └── identity-flow.spec.ts
```

---

## Architecture Decisions

### Decision Log

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| AD-001 | Base L2 as primary chain | Low gas, EVM compatible, Coinbase ecosystem | 2024-01 |
| AD-002 | Soulbound NFTs (non-transferable) | Proofs must stay with the human who earned them | 2024-01 |
| AD-003 | Centralized oracle for Phase 0 | Simplicity; decentralize in Phase 2 | 2024-01 |
| AD-004 | Wagmi + ConnectKit | Best DX, good wallet support | 2024-01 |
| AD-005 | Zustand for state | Lightweight, no boilerplate | 2024-01 |
| AD-006 | Tier-based scoring | Incentivize verified data sources | 2024-01 |
| AD-007 | Time decay on scores | Recent actions matter more | 2024-01 |

### Open Questions

| Question | Options | Decision Needed By |
|----------|---------|-------------------|
| Which identity provider first? | BrightID, Sismo, WorldID | Sprint 2 |
| NFT metadata storage? | IPFS, Arweave, on-chain | Sprint 2 |
| Oracle hosting? | AWS Lambda, Railway, Fly.io | Sprint 1 |
| Indexer solution? | The Graph, custom, Ponder | Sprint 3 |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Oracle key compromise | Medium | High | Key rotation, multi-sig (Phase 2) |
| MRV data manipulation | Medium | High | Multiple data sources, anomaly detection |
| Sybil attacks | Medium | Medium | Identity provider integration |
| Gas price spikes | Low | Medium | L2 choice, batch submissions |
| Partner API downtime | Medium | Low | Queue + retry, multiple adapters |
| Smart contract bugs | Low | Critical | Tests, audit before mainnet |

---

## Resource Allocation

### Team Roles (Suggested)

| Role | Responsibilities |
|------|------------------|
| **Smart Contract Dev** | Contracts, tests, deployment, gas optimization |
| **Backend Dev** | Oracle service, MRV adapters, API |
| **Frontend Dev** | React components, Web3 integration, UX |
| **DevOps** | CI/CD, monitoring, infrastructure |
| **Product** | Prioritization, partner relations, specs |

### Time Estimates by Phase

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 0 | 2 weeks | Wallet + Identity on testnet |
| Phase 1 | 6 weeks | Oracle + 1 MRV + Passport UI |
| Phase 2 | 8 weeks | ZK proofs + Oracle federation |
| Phase 3 | 8 weeks | Ecosystem + third-party APIs |

---

## Success Metrics

### Phase 0 (Testnet)
- [ ] 100+ test identities created
- [ ] < 2s average transaction confirmation
- [ ] Zero critical bugs

### Phase 1 (MVP)
- [ ] 1,000+ registered humans
- [ ] 10,000+ verified proofs
- [ ] 1+ MRV partner live
- [ ] 99.9% oracle uptime

### Phase 2 (Growth)
- [ ] 10,000+ registered humans
- [ ] 3+ MRV partners
- [ ] 5+ oracle operators
- [ ] ZK proofs in production

---

## Weekly Sync Template

```markdown
## Week of [DATE]

### Completed
- [ ] Task 1
- [ ] Task 2

### In Progress
- [ ] Task 3 (50%)
- [ ] Task 4 (25%)

### Blocked
- [ ] Task 5 - Waiting on X

### Next Week
- [ ] Task 6
- [ ] Task 7

### Risks/Issues
- Issue 1: Description
```

---

## Quick Commands

```bash
# Install all dependencies
pnpm install

# Build contracts
cd packages/contracts && pnpm build

# Deploy to Base Sepolia
cd packages/contracts && pnpm deploy:base-sepolia

# Run contract tests
cd packages/contracts && pnpm test

# Start web app
cd apps/web && pnpm web

# Build web app
cd apps/web && pnpm build
```

---

## References

- [PoSH Architecture](./ARCHITECTURE.md#10-posh-proof-of-sustainable-humanity-architecture)
- [Backlog](./BACKLOG.md)
- [Wagmi Documentation](https://wagmi.sh)
- [ConnectKit Documentation](https://docs.family.co/connectkit)
- [Base Documentation](https://docs.base.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)


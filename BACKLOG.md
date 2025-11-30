# HUMΛN-Ø PoSH Backlog

> Proof of Sustainable Humanity - Implementation Backlog

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Completed |
| 🚧 | In Progress |
| 📋 | Planned |
| 🔮 | Future |

---

## Phase 0: Prototype (Current)

### Smart Contracts ✅

| ID | Task | Status | Notes |
|----|------|--------|-------|
| SC-001 | HumanIdentity contract | ✅ | Wallet → humanId mapping |
| SC-002 | IHumanIdentity interface | ✅ | Contract interface |
| SC-003 | ProofRegistry contract | ✅ | MRV proof storage |
| SC-004 | PoSHNFT contract | ✅ | Soulbound NFT |
| SC-005 | HumanScore contract | ✅ | Reputation scoring |
| SC-006 | Deployment script | ✅ | Base Sepolia deployment |
| SC-007 | Hardhat configuration | ✅ | Networks configured |

### Frontend - Wallet Connection ✅

| ID | Task | Status | Notes |
|----|------|--------|-------|
| FE-001 | Web3Provider setup | ✅ | Wagmi + ConnectKit |
| FE-002 | wagmi-config | ✅ | Chain configuration |
| FE-003 | ConnectWalletButton | ✅ | Multiple variants |
| FE-004 | Identity store (Zustand) | ✅ | State management |
| FE-005 | useHumanIdentity hook | ✅ | Contract interactions |
| FE-006 | IdentityCard component | ✅ | Identity UI |
| FE-007 | Identity screen | ✅ | `/identity` route |

### Missing - Phase 0 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P0-001 | Deploy contracts to Base Sepolia | 📋 | HIGH | Requires funded wallet |
| P0-002 | Update wagmi-config with deployed addresses | 📋 | HIGH | After deployment |
| P0-003 | WalletConnect Project ID | 📋 | HIGH | Register at cloud.walletconnect.com |
| P0-004 | Contract verification on BaseScan | 📋 | MEDIUM | For transparency |
| P0-005 | Basic error handling UI | 📋 | MEDIUM | Transaction errors, network errors |
| P0-006 | Loading states for transactions | 📋 | MEDIUM | Pending TX feedback |
| P0-007 | Network switching prompt | 📋 | MEDIUM | Guide users to correct network |
| P0-008 | Mobile wallet deep linking | 📋 | LOW | For mobile browsers |

---

## Phase 1: MVP PoSH

### Identity System 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| ID-001 | External identity provider integration | 📋 | HIGH | BrightID, Sismo, or WorldID |
| ID-002 | Identity verification UI | 📋 | HIGH | Link external proofs |
| ID-003 | Identity recovery mechanism | 📋 | MEDIUM | Social recovery or backup |
| ID-004 | Multi-wallet linking | 📋 | LOW | Link multiple wallets to one humanId |

### MRV (Measurement/Reporting/Verification) 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| MRV-001 | MRV Adapter interface definition | 📋 | HIGH | Standard schema |
| MRV-002 | Unergy solar adapter | 📋 | HIGH | First partner integration |
| MRV-003 | I-REC certificate adapter | 📋 | HIGH | Renewable energy certificates |
| MRV-004 | MRV Normalizer service | 📋 | HIGH | Convert to internal format |
| MRV-005 | Smart meter adapter | 📋 | MEDIUM | Direct meter readings |
| MRV-006 | EV charging adapter | 📋 | MEDIUM | ChargePoint, Tesla, etc. |
| MRV-007 | User external ID mapping | 📋 | HIGH | Link partner IDs to humanId |

### Oracle Network 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| OR-001 | Oracle service (centralized Phase 1) | 📋 | HIGH | Single trusted oracle |
| OR-002 | Claim validation logic | 📋 | HIGH | Duplicate check, plausibility |
| OR-003 | Oracle key management | 📋 | HIGH | Secure signing keys |
| OR-004 | Claim signing service | 📋 | HIGH | Sign verified claims |
| OR-005 | Rate limiting per human | 📋 | MEDIUM | Prevent spam |
| OR-006 | Anomaly detection (basic) | 📋 | MEDIUM | Flag suspicious patterns |

### Proof & NFT System 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| PF-001 | Proof submission API | 📋 | HIGH | Oracle → contract |
| PF-002 | Proof history UI | 📋 | HIGH | View all proofs |
| PF-003 | NFT minting UI | 📋 | HIGH | Aggregate proofs → NFT |
| PF-004 | NFT metadata generation | 📋 | MEDIUM | IPFS/Arweave storage |
| PF-005 | NFT gallery view | 📋 | MEDIUM | Display PoSH NFTs |
| PF-006 | Proof detail view | 📋 | MEDIUM | Individual proof details |

### Score System 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| SC-101 | Score calculation UI | 📋 | HIGH | Display current score |
| SC-102 | Level progression UI | 📋 | HIGH | Bronze → Diamond |
| SC-103 | Score breakdown view | 📋 | MEDIUM | By impact type |
| SC-104 | Leaderboard (opt-in) | 📋 | LOW | Community rankings |
| SC-105 | Score history chart | 📋 | LOW | Score over time |

### Sustainability Passport UI 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| SP-001 | Passport overview screen | 📋 | HIGH | Main dashboard |
| SP-002 | Impact summary cards | 📋 | HIGH | CO2, energy, etc. |
| SP-003 | Achievement badges | 📋 | MEDIUM | Milestones |
| SP-004 | Share passport (public link) | 📋 | MEDIUM | Shareable profile |
| SP-005 | Export impact report (PDF) | 📋 | LOW | Downloadable report |

---

## Phase 2: ZK & Decentralization

### Zero-Knowledge Proofs 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| ZK-001 | ZK circuit for identity membership | 🔮 | HIGH | Semaphore pattern |
| ZK-002 | ZK circuit for MRV verification | 🔮 | HIGH | Prove without revealing |
| ZK-003 | Client-side ZK prover | 🔮 | MEDIUM | Browser-based proving |
| ZK-004 | ZK verifier contract | 🔮 | HIGH | On-chain verification |
| ZK-005 | Privacy-preserving aggregation | 🔮 | MEDIUM | Aggregate without exposing |

### Oracle Federation 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| OF-001 | Multi-sig oracle contract | 🔮 | HIGH | Threshold signatures |
| OF-002 | Oracle node software | 🔮 | HIGH | Run your own oracle |
| OF-003 | Oracle staking mechanism | 🔮 | MEDIUM | Stake to become oracle |
| OF-004 | Slashing for bad behavior | 🔮 | MEDIUM | Penalize malicious oracles |
| OF-005 | Oracle governance | 🔮 | LOW | DAO for oracle management |

### Open MRV Standards 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| MS-001 | MRV schema specification | 🔮 | HIGH | Open standard |
| MS-002 | Methodology registry | 🔮 | HIGH | Versioned methodologies |
| MS-003 | MRV provider onboarding | 🔮 | MEDIUM | Self-service registration |
| MS-004 | MRV audit trail | 🔮 | MEDIUM | Full traceability |

---

## Phase 3: Ecosystem & Composability

### Third-Party Integration 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| TP-001 | PoSH Query API | 🔮 | HIGH | REST/GraphQL for dApps |
| TP-002 | SDK for developers | 🔮 | HIGH | npm package |
| TP-003 | Webhook notifications | 🔮 | MEDIUM | New proof events |
| TP-004 | Embeddable widgets | 🔮 | MEDIUM | Show PoSH on any site |

### PoSH as Primitive 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| PP-001 | PoSH gating contract | 🔮 | HIGH | Require min score |
| PP-002 | PoSH-weighted voting | 🔮 | HIGH | Governance weight |
| PP-003 | PoSH discount system | 🔮 | MEDIUM | Rewards for high score |
| PP-004 | PoSH attestation service | 🔮 | MEDIUM | Third-party attestations |

### MRV Provider Marketplace 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| MP-001 | Provider registry contract | 🔮 | HIGH | On-chain registry |
| MP-002 | Provider staking | 🔮 | HIGH | Stake to register |
| MP-003 | Provider reputation | 🔮 | MEDIUM | Quality scores |
| MP-004 | Provider dashboard | 🔮 | MEDIUM | Manage integrations |

---

## Infrastructure & DevOps

### Testing 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| TS-001 | Contract unit tests | 📋 | HIGH | Hardhat tests |
| TS-002 | Contract integration tests | 📋 | HIGH | Full flow tests |
| TS-003 | Frontend component tests | 📋 | MEDIUM | React Testing Library |
| TS-004 | E2E tests (Playwright) | 📋 | MEDIUM | Critical flows |
| TS-005 | Gas optimization tests | 📋 | LOW | Measure gas usage |

### CI/CD 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| CD-001 | Contract deployment workflow | 📋 | HIGH | GitHub Actions |
| CD-002 | Contract verification workflow | 📋 | MEDIUM | Auto-verify on deploy |
| CD-003 | Testnet faucet integration | 📋 | LOW | Auto-fund test wallets |

### Monitoring 🔮

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| MO-001 | Contract event indexer | 🔮 | HIGH | The Graph or custom |
| MO-002 | Oracle health monitoring | 🔮 | HIGH | Uptime, latency |
| MO-003 | Gas price alerts | 🔮 | LOW | Notify on high gas |

---

## Documentation 📋

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| DC-001 | Contract API documentation | 📋 | HIGH | NatSpec + generated docs |
| DC-002 | Integration guide | 📋 | HIGH | For third-party devs |
| DC-003 | User guide | 📋 | MEDIUM | How to use the app |
| DC-004 | MRV provider guide | 📋 | MEDIUM | How to integrate |
| DC-005 | Security audit preparation | 📋 | HIGH | Pre-audit checklist |

---

## Technical Debt & Improvements

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| TD-001 | TypeChain types export | 📋 | HIGH | Share types with frontend |
| TD-002 | Contract upgradability pattern | 📋 | MEDIUM | Proxy pattern for upgrades |
| TD-003 | Gas optimization | 📋 | MEDIUM | Reduce transaction costs |
| TD-004 | Event indexing optimization | 📋 | LOW | Efficient queries |
| TD-005 | Mobile-first responsive design | 📋 | MEDIUM | Better mobile UX |

---

## Security Considerations

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| SE-001 | Reentrancy protection audit | 📋 | HIGH | All external calls |
| SE-002 | Access control review | 📋 | HIGH | Owner/oracle permissions |
| SE-003 | Integer overflow checks | ✅ | HIGH | Solidity 0.8+ built-in |
| SE-004 | Oracle key rotation plan | 📋 | MEDIUM | Key management |
| SE-005 | Rate limiting implementation | 📋 | MEDIUM | Prevent DoS |
| SE-006 | External audit | 🔮 | HIGH | Before mainnet |

---

## Quick Reference: Next Actions

### Immediate (This Sprint)
1. Deploy contracts to Base Sepolia
2. Get WalletConnect Project ID
3. Update wagmi-config with addresses
4. Test full identity creation flow
5. Add basic error handling

### Short-term (Next 2 Sprints)
1. First MRV adapter (Unergy)
2. Oracle service (centralized)
3. Proof submission flow
4. Sustainability Passport UI
5. Contract tests

### Medium-term (Next Quarter)
1. Additional MRV adapters
2. NFT minting flow
3. Score visualization
4. External identity integration
5. Documentation


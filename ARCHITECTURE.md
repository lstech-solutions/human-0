# HUMΛN-Ø Architecture & Delivery Plan

## 1. High-Level Overview

**HUMΛN-Ø** is a modern Web3 platform built on a **TypeScript Monorepo** architecture. It combines a high-performance **Expo Web** frontend, a dedicated **Smart Contracts** package, and a **Docusaurus** documentation site, all orchestrated via **GitHub Actions** for continuous delivery.

The platform implements **PoSH (Proof of Sustainable Humanity)** - a novel consensus mechanism that rewards verifiable sustainable actions rather than wealth or computing power.

### Core Principles
- **Monorepo First**: Single source of truth using **Turborepo** and **pnpm workspaces**.
- **Agentic Diamond Architecture**: Clear separation of concerns (Planner, Architect, Implementer, Reviewer) mapped to code structure.
- **Type Safety**: End-to-end typing from Smart Contracts (Solidity) to Frontend (React/TypeScript).
- **Automated Delivery**: CI/CD pipelines for testing, linting, and deploying to GitHub Pages.

### PoSH Design Principles
- **Action-based**: Proof based on real sustainable actions, not wealth/compute.
- **Non-extractive**: Only network gas fees; no protocol tax on impact.
- **Verifiable**: Every claim rooted in MRV (Measurement/Reporting/Verification).
- **Privacy-preserving**: Prove impact without exposing personal data.
- **Globally accessible**: Low-end devices, low bandwidth, no heavy KYC.
- **Composable**: Other dApps can consume PoSH as a primitive.

---

## 2. Monorepo Structure

We use **Turborepo** with **pnpm workspaces**.
*   **Why Turborepo?** Fast, intelligent caching, and excellent support for task pipelines (build, test, lint).
*   **Why pnpm?** Efficient disk usage and strict dependency management.

### Folder Layout

```text
/human-0
├── package.json          # Root manifest (defines workspaces)
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json            # Turborepo pipeline config
├── /apps
│   ├── /web              # Expo Router app (Web-first, Native-ready)
│   └── /docs             # Docusaurus v3 documentation site
├── /packages
│   ├── /contracts        # Hardhat/Foundry contracts + TypeChain types
│   ├── /ui               # Shared UI Design System (Tamagui or NativeWind + primitives)
│   ├── /config           # Shared configurations (ESLint, TS, Prettier)
│   └── /utils            # Shared TypeScript utilities (formatting, math, etc.)
└── /tools                # CI scripts, generators, etc.
```

### Pipeline Wiring (`turbo.json`)
- **`build`**: Depends on `^build`.
- **`test`**: Runs in parallel.
- **`lint`**: Runs in parallel.
- **`dev`**: Runs `apps` in parallel, packages in watch mode.

---

## 3. Expo Web App (`apps/web`)

**Stack**: Expo SDK 50+, Expo Router v3, React 18, TypeScript, NativeWind (Tailwind CSS).
**State**: **Zustand** (Minimalist, scalable, no boilerplate) + **TanStack Query** (Server state/Contract reads).

### Agentic Diamond Architecture Implementation

| Role | Responsibility | Code Location |
| :--- | :--- | :--- |
| **Planner** | Routes, Feature Specs | `app/` (File-system routing), `docs/specs` |
| **Architect** | Domain Modules, Interfaces | `features/*/domain`, `hooks/use*` |
| **Implementer** | UI Components, Screens | `features/*/components`, `components/ui` |
| **Reviewer** | Tests, Storybook | `__tests__`, `app.config.ts` (Config validation) |

### Directory Structure
```text
/apps/web
├── app/                  # Expo Router (Planner)
│   ├── (tabs)/           # Main tabs
│   ├── [auth]/           # Auth routes
│   └── _layout.tsx       # Root layout
├── components/           # Shared atoms/molecules (Implementer)
├── features/             # Domain-driven features (Architect)
│   ├── impact/           # e.g., "Impact" domain
│   │   ├── components/   # Feature-specific UI
│   │   ├── hooks/        # Logic & State
│   │   ├── services/     # API/Contract calls
│   │   └── types.ts      # Domain Interfaces
│   └── wallet/           # Wallet connection logic
├── hooks/                # Global hooks
└── providers/            # Context providers (Web3, Theme, Query)
```

### Web3 Injection
- Use **Wagmi** + **ConnectKit** (or RainbowKit) wrapped in a `Web3Provider`.
- **Decoupling**: Create a `useContract` hook in `packages/contracts` or `apps/web/hooks` that returns typed contract instances. The UI *never* imports `ethers.js` directly; it uses the hook.

---

## 4. Contracts Package (`packages/contracts`)

**Stack**: **Hardhat** (for robust TS integration) + **TypeChain**.
*Alternative*: Foundry is powerful, but Hardhat offers the smoothest "JS/TS Monorepo" experience for teams familiar with TS.

### Structure
```text
/packages/contracts
├── contracts/            # Solidity sources (.sol)
├── scripts/              # Deployment scripts
├── test/                 # Hardhat tests (Mocha/Chai)
├── typechain-types/      # Generated TS bindings (Auto-exported)
└── hardhat.config.ts     # Config
```

### Integration
1.  **Compile**: `pnpm build` runs `hardhat compile` -> generates `typechain-types`.
2.  **Export**: `package.json` exports `typechain-types` and deployment addresses.
3.  **Consume**: `apps/web` imports types: `import { HumanToken__factory } from '@human-0/contracts'`.

---

## 5. Documentation (`apps/docs`)

**Stack**: **Docusaurus v3** (Standard, robust).
*Note*: Docusaurus v4 is currently in beta. We recommend v3 for stability, but v4 can be used if "bleeding edge" is required.

### Information Architecture
- **`/docs/intro`**: Project vision (Net Zero / Web3).
- **`/docs/architecture`**: This document, System diagrams.
- **`/docs/contracts`**: Auto-generated from Solidity (using `solidity-docgen`).
- **`/docs/dev`**: TDD Guide, Setup, Contribution.

### Branding
- **Custom Theme**: Override `src/css/custom.css` with HUMΛN-Ø variables.
- **Font**: Import `Space Grotesk` and `Inter` in `docusaurus.config.ts`.

---

## 6. CI/CD & GitHub Pages

### Workflows
1.  **`ci.yml`**: Runs on PR.
    *   `pnpm install` (with cache).
    *   `pnpm turbo run lint test build`.
2.  **`deploy-web.yml`**: Runs on push to `main`.
    *   Builds Expo Web: `npx expo export -p web`.
    *   Deploys to `gh-pages` (root `/` or `/app`).
3.  **`deploy-docs.yml`**: Runs on push to `main`.
    *   Builds Docusaurus: `pnpm build`.
    *   Deploys to `gh-pages` (subfolder `/docs`).

### Routing Strategy
- **User Site**: `https://<org>.github.io/human-0/` (Expo Web)
- **Docs**: `https://<org>.github.io/human-0/docs/` (Docusaurus)
*Config*: Set `baseUrl: "/human-0/"` in Expo and `baseUrl: "/human-0/docs/"` in Docusaurus.

---

## 7. Design System

**Theme**: "Deep Space & Neon"
- **Background**: `#050B10`
- **Primary**: `#00FF9C` (Neon Green)
- **Accent**: `#CDA464` (Gold)
- **Text**: `#E6ECE8`

**Typography**:
- Headers: **Space Grotesk**
- Body: **Inter**
- Code: **JetBrains Mono**

**Implementation**:
- **Tailwind Config**: Shared in `packages/config/tailwind.config.js`.
- **Fonts**: Loaded via `expo-font` in `apps/web/_layout.tsx`.

---

## 8. TDD Strategy

**Cycle**:
1.  **Red**: Write a failing test in `__tests__` (e.g., "Wallet hook should return balance").
2.  **Green**: Implement the minimal logic in `features/wallet/hooks`.
3.  **Refactor**: Clean up code, ensure types are strict.

**Tools**:
- **Unit**: Jest (Logic).
- **Components**: React Testing Library (RTL).
- **Contracts**: Hardhat (Chai matchers).
- **E2E**: Playwright (Optional, for critical flows).

---

## 9. Agentic Roles in Action

- **Planner**: Creates a new Markdown file in `apps/docs/docs/specs` defining the "Minting Flow".
- **Architect**: Creates the `features/mint` folder structure and defines `MintService` interface.
- **Implementer**: Codes the `MintScreen.tsx` and `useMint.ts` hook, satisfying the interface.
- **Reviewer**: Runs `pnpm test`, checks strict linting rules, and verifies the PR.

---

## 10. PoSH (Proof of Sustainable Humanity) Architecture

### 10.1 System Diagram

```
[Human User / Wallet]
        |
        v
[Human0 App (mobile/web)]
        |
        v
[MRV Sources] ----> [MRV Normalizer Service]
(smart meter, I-REC,    |
EV, purchases, etc.)     v
                    [Oracle Network]
                        |
        (signed, verified impact claims)
                        v
              [PoSH Contracts on L2]
                |          |       |
                |          |       |
         [Proof Registry]  |   [Human Score]
                |          |
                |       [Soulbound PoSH NFT]
                |
         [Indexers / APIs / dApps]
                |
        [Partners / Employers / Govs / ESG]
```

### 10.2 Smart Contracts (`packages/contracts`)

| Contract | Purpose |
| :--- | :--- |
| **HumanIdentity** | Maps wallet → pseudonymous humanId. 1 human = 1 identity. |
| **ProofRegistry** | Stores canonical, deduplicated sustainability proofs with MRV verification. |
| **PoSHNFT** | Soulbound ERC-721 NFTs representing aggregated impact proofs. |
| **HumanScore** | Aggregates proofs into weighted, time-decayed reputation scores. |

#### Contract Structure
```text
/packages/contracts
├── contracts/
│   ├── IHumanIdentity.sol    # Interface
│   ├── HumanIdentity.sol     # Identity registry
│   ├── ProofRegistry.sol     # Impact proof storage
│   ├── PoSHNFT.sol           # Soulbound NFT
│   └── HumanScore.sol        # Reputation scoring
├── scripts/
│   └── deploy.ts             # Deployment script
├── deployments/
│   └── addresses.json        # Deployed addresses
└── hardhat.config.ts
```

### 10.3 Identity Flow

1. **Connect Wallet**: User connects via MetaMask, Coinbase, or WalletConnect
2. **Register Identity**: Calls `HumanIdentity.registerHuman()` → creates deterministic `humanId`
3. **Link External Proofs** (optional): Connect BrightID, Sismo, or other identity providers
4. **Build PoSH Score**: Accumulate verified impact proofs over time

### 10.4 Impact Event Flow (MRV)

```
1. MRV Adapter receives raw data from partner:
   { source: "unergy_solar", kWh: 5.0, timestamp: ..., evidence: {...} }

2. Normalizer converts to internal format:
   { type: "renewable_energy", quantity: 5.0, unit: "kWh", co2e: 3.8, ... }

3. Oracle validates:
   - I-REC not double-retired
   - Event not previously processed
   - Values are plausible

4. Oracle submits on-chain:
   ProofRegistry.submitProof(humanId, impactType, value, ...)

5. User can mint PoSH NFT:
   PoSHNFT.mintPoSH(proofIds[], metadataURI, period)
```

### 10.5 Verification Tiers

| Tier | Description | Score Multiplier |
| :--- | :--- | :--- |
| **A** | Verified (I-REC, smart meter, EV provider) | 1.0x |
| **B** | Partial verification | 0.5x |
| **C** | Self-reported | 0.1x |

### 10.6 Score Levels

| Level | Name | Points Required |
| :--- | :--- | :--- |
| 0 | None | 0 |
| 1 | Bronze | 100+ |
| 2 | Silver | 1,000+ |
| 3 | Gold | 10,000+ |
| 4 | Platinum | 100,000+ |
| 5 | Diamond | 1,000,000+ |

### 10.7 Frontend Integration

```text
/apps/web
├── providers/
│   └── Web3Provider.tsx      # Wagmi + ConnectKit + React Query
├── lib/
│   └── wagmi-config.ts       # Chain & connector configuration
├── features/
│   ├── identity/
│   │   ├── components/
│   │   │   └── IdentityCard.tsx
│   │   ├── hooks/
│   │   │   └── useHumanIdentity.ts
│   │   └── stores/
│   │       └── identityStore.ts
│   └── wallet/
│       └── components/
│           └── ConnectWalletButton.tsx
└── app/
    └── identity.tsx          # Identity management screen
```

### 10.8 Sybil Resistance

- **Unique Human Identity**: 1 wallet → 1 humanId
- **Rate Limiting**: Max events per type per time window
- **MRV Quality Tiers**: Tier A >> Tier B >> Tier C weighting
- **Oracle Consensus**: Multi-sig for high-value claims (Phase 2)
- **Anomaly Detection**: Off-chain ML for suspicious patterns

### 10.9 Privacy Layer

**Phase 0 (Current)**:
- `humanId` = hash of wallet + chainId + salt
- `verificationHash` = hash of MRV data
- Public: impactType, impactValue, timestamp, methodology

**Phase 2 (Future ZK)**:
- ZK proof of identity membership (Semaphore pattern)
- ZK circuits for MRV verification without exposing raw data
- Prove "I consumed 100 kWh renewable" without leaking location

### 10.10 Implementation Roadmap

| Phase | Features |
| :--- | :--- |
| **Phase 0** | Single oracle, ProofRegistry + PoSHNFT on Base Sepolia, 1 MRV partner, wallet-based identity |
| **Phase 1** | Identity protocol integration, 2-3 MRV sources, Score contract, Sustainability Passport UI |
| **Phase 2** | ZK circuits, Oracle federation, Open MRV standards |
| **Phase 3** | Third-party APIs, PoSH gating/weighting, MRV provider registry with staking |

---

## 11. Web3 Stack

### Dependencies
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript Ethereum library
- **connectkit**: Wallet connection UI
- **@tanstack/react-query**: Server state management
- **zustand**: Client state management

### Supported Networks
- **Base Sepolia** (testnet) - Primary for Phase 0
- **Base** (mainnet) - Production
- **Ethereum Sepolia/Mainnet** - Compatibility

### Wallet Support
- MetaMask (injected)
- Coinbase Wallet
- WalletConnect (all compatible wallets)

---

## 12. Complete System Architecture

### 12.1 Full Stack Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │   Browser   │    │  Mobile App │    │  Third-party│                      │
│  │  (Expo Web) │    │   (Expo)    │    │    dApps    │                      │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                      │
│         │                  │                  │                              │
│         └──────────────────┼──────────────────┘                              │
│                            │                                                 │
│                    ┌───────▼───────┐                                         │
│                    │  ConnectKit   │  ◄── Wallet Connection UI               │
│                    │    Modal      │                                         │
│                    └───────┬───────┘                                         │
│                            │                                                 │
│         ┌──────────────────┼──────────────────┐                              │
│         │                  │                  │                              │
│  ┌──────▼──────┐   ┌───────▼───────┐  ┌──────▼──────┐                       │
│  │  MetaMask   │   │   Coinbase    │  │ WalletConnect│                      │
│  │  (injected) │   │    Wallet     │  │   (QR/Deep)  │                      │
│  └─────────────┘   └───────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Wagmi / Viem
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER (apps/web)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Web3Provider                                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │    │
│  │  │WagmiProvider│  │QueryClient  │  │ConnectKit   │                  │    │
│  │  │             │  │Provider     │  │Provider     │                  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Features                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │    │
│  │  │    identity/    │  │     wallet/     │  │     proofs/     │      │    │
│  │  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │      │    │
│  │  │ │IdentityCard │ │  │ │ConnectBtn   │ │  │ │ ProofList   │ │      │    │
│  │  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │      │    │
│  │  │ ┌─────────────┐ │  │                 │  │ ┌─────────────┐ │      │    │
│  │  │ │useHumanId   │ │  │                 │  │ │ useProofs   │ │      │    │
│  │  │ └─────────────┘ │  │                 │  │ └─────────────┘ │      │    │
│  │  │ ┌─────────────┐ │  │                 │  │                 │      │    │
│  │  │ │identityStore│ │  │                 │  │                 │      │    │
│  │  │ └─────────────┘ │  │                 │  │                 │      │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JSON-RPC / Contract Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BLOCKCHAIN LAYER (Base L2)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    PoSH Smart Contracts                              │    │
│  │                                                                      │    │
│  │  ┌─────────────────┐      ┌─────────────────┐                       │    │
│  │  │  HumanIdentity  │◄────►│  ProofRegistry  │                       │    │
│  │  │                 │      │                 │                       │    │
│  │  │ • registerHuman │      │ • submitProof   │                       │    │
│  │  │ • getHumanId    │      │ • getProof      │                       │    │
│  │  │ • isRegistered  │      │ • humanProofs   │                       │    │
│  │  │ • linkExtProof  │      │ • usedVerify    │                       │    │
│  │  └────────┬────────┘      └────────┬────────┘                       │    │
│  │           │                        │                                │    │
│  │           │    ┌───────────────────┘                                │    │
│  │           │    │                                                    │    │
│  │           ▼    ▼                                                    │    │
│  │  ┌─────────────────┐      ┌─────────────────┐                       │    │
│  │  │    PoSHNFT      │      │   HumanScore    │                       │    │
│  │  │   (Soulbound)   │      │                 │                       │    │
│  │  │                 │      │ • getHumanScore │                       │    │
│  │  │ • mintPoSH      │      │ • getHumanLevel │                       │    │
│  │  │ • getHumanNFTs  │      │ • meetsThreshold│                       │    │
│  │  │ • getTotalCO2e  │      │ • tierBreakdown │                       │    │
│  │  └─────────────────┘      └─────────────────┘                       │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ Oracle Submissions
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OFF-CHAIN SERVICES (Future)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐     │
│  │  Oracle Service │      │  MRV Adapters   │      │    Indexer      │     │
│  │                 │◄────►│                 │      │                 │     │
│  │ • validateClaim │      │ • unergy/       │      │ • The Graph     │     │
│  │ • signClaim     │      │ • i-rec/        │      │ • Event sync    │     │
│  │ • submitOnChain │      │ • ev-charging/  │      │ • Query API     │     │
│  │ • rateLimit     │      │ • smart-meter/  │      │                 │     │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘     │
│           ▲                        ▲                                        │
│           │                        │                                        │
│           └────────────────────────┘                                        │
│                        │                                                    │
│                        ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MRV Data Sources                                │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Unergy  │  │  I-REC   │  │ChargePoint│  │  Smart   │            │   │
│  │  │  Solar   │  │  Certs   │  │    EV     │  │  Meters  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Data Flow Sequence

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │   App   │     │ Oracle  │     │Contract │     │  Chain  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │  Connect Wallet               │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │  Check isRegistered           │               │
     │               │──────────────────────────────►│               │
     │               │◄──────────────────────────────│               │
     │               │               │               │               │
     │  [If not registered]          │               │               │
     │  Click "Create Identity"      │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │  registerHuman()              │               │
     │               │──────────────────────────────►│               │
     │               │               │               │──────────────►│
     │               │               │               │◄──────────────│
     │               │◄──────────────────────────────│               │
     │               │               │               │               │
     │  Identity Created!            │               │               │
     │◄──────────────│               │               │               │
     │               │               │               │               │
     │═══════════════════════════════════════════════════════════════│
     │                    LATER: MRV Event                           │
     │═══════════════════════════════════════════════════════════════│
     │               │               │               │               │
     │               │  MRV Data     │               │               │
     │               │  (webhook)    │               │               │
     │               │──────────────►│               │               │
     │               │               │               │               │
     │               │               │  Validate     │               │
     │               │               │  & Sign       │               │
     │               │               │               │               │
     │               │               │  submitProof()│               │
     │               │               │──────────────►│               │
     │               │               │               │──────────────►│
     │               │               │               │◄──────────────│
     │               │               │◄──────────────│               │
     │               │               │               │               │
     │               │  New Proof Event              │               │
     │               │◄──────────────────────────────│               │
     │               │               │               │               │
     │  Proof Added! │               │               │               │
     │◄──────────────│               │               │               │
     │               │               │               │               │
```

### 12.3 Contract Relationships

```
┌────────────────────────────────────────────────────────────────────┐
│                        Contract Dependencies                        │
└────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   IHumanIdentity    │
                    │     (Interface)     │
                    └──────────┬──────────┘
                               │ implements
                               ▼
                    ┌─────────────────────┐
                    │   HumanIdentity     │
                    │                     │
                    │ Storage:            │
                    │ • walletToHuman     │
                    │ • humanToWallet     │
                    │ • registrationTime  │
                    │ • externalProofs    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
   ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
   │  ProofRegistry   │ │   PoSHNFT    │ │   HumanScore     │
   │                  │ │              │ │                  │
   │ Depends on:      │ │ Depends on:  │ │ Depends on:      │
   │ • HumanIdentity  │ │ • HumanId    │ │ • HumanIdentity  │
   │                  │ │ • ProofReg   │ │ • ProofRegistry  │
   │ Storage:         │ │              │ │                  │
   │ • proofs         │ │ Storage:     │ │ Reads:           │
   │ • humanProofs    │ │ • tokenMeta  │ │ • proofs         │
   │ • usedVerify     │ │ • proofToken │ │ • humanProofs    │
   │ • oracles        │ │ • humanTokens│ │                  │
   └──────────────────┘ └──────────────┘ └──────────────────┘
           │                    │
           │                    │
           └────────┬───────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   OpenZeppelin      │
         │   ERC-721           │
         │   (inherited)       │
         └─────────────────────┘
```

### 12.4 State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Frontend State Architecture                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              React Query                                     │
│                         (Server State / Contract Reads)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ useReadContract │  │ useReadContract │  │ useReadContract │             │
│  │ (isRegistered)  │  │ (getHumanId)    │  │ (getScore)      │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│                                ▼                                            │
│                    ┌─────────────────────┐                                  │
│                    │   Query Cache       │                                  │
│                    │   (5 min stale)     │                                  │
│                    └─────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Hydrates
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Zustand Store                                   │
│                         (Client State / UI State)                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        identityStore                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │   status    │  │  identity   │  │    score    │  │   error    │  │   │
│  │  │ "connected" │  │ {humanId,   │  │ {total,     │  │   null     │  │   │
│  │  │ "registered"│  │  wallet,    │  │  level,     │  │            │  │   │
│  │  │ "error"     │  │  regTime}   │  │  proofs}    │  │            │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Persisted to localStorage: identity, score                                 │
│  Not persisted: status, error (transient)                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Consumed by
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              React Components                                │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  IdentityCard   │  │ ConnectButton   │  │  ScoreDisplay   │             │
│  │                 │  │                 │  │                 │             │
│  │ useIdentityStore│  │ useAccount      │  │ useIdentityStore│             │
│  │ useHumanIdentity│  │ (wagmi)         │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. File Structure (Actual Implementation)

```
human-0.com/
├── ARCHITECTURE.md              # This file
├── BACKLOG.md                   # Implementation backlog
├── PLANNER.md                   # Sprint planning
├── .env.example                 # Environment variables
│
├── apps/
│   ├── web/                     # Expo Web App
│   │   ├── app/
│   │   │   ├── _layout.tsx      # Root layout + Web3Provider
│   │   │   ├── index.tsx        # Home screen
│   │   │   ├── identity.tsx     # Identity management ✅
│   │   │   ├── impact.tsx       # Impact tracking
│   │   │   ├── nfts.tsx         # NFT gallery
│   │   │   └── profile.tsx      # User profile
│   │   │
│   │   ├── providers/
│   │   │   └── Web3Provider.tsx # Wagmi + ConnectKit ✅
│   │   │
│   │   ├── lib/
│   │   │   └── wagmi-config.ts  # Chain configuration ✅
│   │   │
│   │   ├── features/
│   │   │   ├── identity/
│   │   │   │   ├── components/
│   │   │   │   │   └── IdentityCard.tsx ✅
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useHumanIdentity.ts ✅
│   │   │   │   ├── stores/
│   │   │   │   │   └── identityStore.ts ✅
│   │   │   │   └── index.ts ✅
│   │   │   │
│   │   │   ├── wallet/
│   │   │   │   ├── components/
│   │   │   │   │   └── ConnectWalletButton.tsx ✅
│   │   │   │   └── index.ts ✅
│   │   │   │
│   │   │   ├── proofs/          # 📋 Planned
│   │   │   ├── nft/             # 📋 Planned
│   │   │   └── passport/        # 📋 Planned
│   │   │
│   │   └── package.json         # Dependencies ✅
│   │
│   └── docs/                    # Docusaurus
│
├── packages/
│   ├── contracts/
│   │   ├── contracts/
│   │   │   ├── IHumanIdentity.sol ✅
│   │   │   ├── HumanIdentity.sol ✅
│   │   │   ├── ProofRegistry.sol ✅
│   │   │   ├── PoSHNFT.sol ✅
│   │   │   └── HumanScore.sol ✅
│   │   │
│   │   ├── scripts/
│   │   │   └── deploy.ts ✅
│   │   │
│   │   ├── deployments/
│   │   │   └── addresses.json ✅
│   │   │
│   │   ├── test/                # 📋 Planned
│   │   ├── hardhat.config.ts ✅
│   │   └── package.json ✅
│   │
│   ├── i18n/                    # Internationalization
│   └── config/                  # Shared configs
│
└── services/                    # 📋 Planned (Off-chain)
    ├── oracle/
    ├── mrv-adapters/
    └── indexer/
```

---

## 14. Environment Configuration

### Required Variables

```bash
# .env (apps/web)
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx  # WalletConnect Cloud

# .env (packages/contracts)
DEPLOYER_PRIVATE_KEY=xxx                   # For deployment
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### Optional Variables

```bash
# Custom RPC endpoints
EXPO_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
EXPO_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Oracle service (future)
ORACLE_PRIVATE_KEY=xxx
ORACLE_API_PORT=3001
```

---

## 15. Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Build contracts
cd packages/contracts
pnpm build

# 3. Deploy to testnet (requires funded wallet)
pnpm deploy:base-sepolia

# 4. Update contract addresses in apps/web/lib/wagmi-config.ts

# 5. Start web app
cd apps/web
pnpm web

# 6. Open http://localhost:8081
```

---

## Related Documents

- [BACKLOG.md](./BACKLOG.md) - Full implementation backlog
- [PLANNER.md](./PLANNER.md) - Sprint planning and decisions
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [SETUP.md](./SETUP.md) - Development setup


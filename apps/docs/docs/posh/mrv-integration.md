---
sidebar_position: 5
title: MRV Integration
description: Guide for integrating Measurement, Reporting, and Verification data sources
keywords: [MRV, integration, API, adapters, renewable energy, I-REC]
---

# MRV Integration Guide

This guide explains how to integrate Measurement, Reporting, and Verification (MRV) data sources with the PoSH protocol.

---

## What is MRV?

**Measurement, Reporting, and Verification (MRV)** is the process of:

1. **Measuring** sustainability actions (e.g., kWh of renewable energy)
2. **Reporting** the data in a standardized format
3. **Verifying** the accuracy and authenticity of claims

In PoSH, MRV provides the foundation for trustworthy impact proofs.

---

## Supported Data Sources

### Tier A: Verified Sources (1.0x multiplier)

| Source Type | Examples | Data Format |
|-------------|----------|-------------|
| **Renewable Energy Certificates** | I-REC, GO, REC | Certificate ID, MWh, vintage |
| **Smart Meters** | Utility APIs, IoT devices | kWh readings, timestamps |
| **EV Charging Networks** | ChargePoint, Tesla, Electrify | kWh, session data |
| **Solar Inverters** | SolarEdge, Enphase, Fronius | Generation data |

### Tier B: Partial Verification (0.5x multiplier)

| Source Type | Examples | Data Format |
|-------------|----------|-------------|
| **Utility Bills** | PDF parsing, OCR | Monthly consumption |
| **Purchase Receipts** | E-commerce APIs | Product, quantity |
| **Transit Data** | Public transit APIs | Trip records |

### Tier C: Self-Reported (0.1x multiplier)

| Source Type | Examples | Data Format |
|-------------|----------|-------------|
| **Manual Entry** | User attestation | Claimed values |
| **Photo Evidence** | Image upload | Visual proof |

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MRV INTEGRATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                                │
│  │  Data Source │  (Smart meter, I-REC registry, EV network)    │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ Raw data (API, webhook, file)                          │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │ MRV Adapter  │  (Source-specific integration)                 │
│  │              │                                                │
│  │ • Fetch data │                                                │
│  │ • Validate   │                                                │
│  │ • Transform  │                                                │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ Normalized MRV Report                                  │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │  Normalizer  │  (Common schema)                               │
│  │              │                                                │
│  │ • Validate   │                                                │
│  │ • Convert    │                                                │
│  │ • Enrich     │                                                │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ Canonical MRV Report                                   │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │   Oracle     │  (Verification & signing)                      │
│  │              │                                                │
│  │ • Verify     │                                                │
│  │ • Sign       │                                                │
│  │ • Submit     │                                                │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ On-chain proof                                         │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │ProofRegistry │  (Smart contract)                              │
│  └──────────────┘                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## MRV Report Schema

All MRV data must be normalized to this canonical schema:

```typescript
interface MRVReport {
  // === Required Fields ===
  
  // Impact classification
  type: ImpactType;
  
  // Quantitative measurement
  quantity: number;
  unit: Unit;
  
  // Carbon equivalent (always in grams)
  co2e: number;
  
  // When the impact occurred
  timestamp: number; // Unix timestamp
  
  // === Verification Fields ===
  
  // Methodology used for calculation
  methodology: string;
  methodologyVersion: string;
  
  // Evidence chain
  evidenceRefs: string[];
  
  // Source information
  source: string;
  sourceSignature?: string;
  
  // === User Mapping ===
  
  // External user identifier (from partner system)
  userExternalId: string;
  
  // === Optional Metadata ===
  
  // Geographic context
  region?: string; // ISO 3166-1 alpha-2
  gridRegion?: string;
  
  // Additional context
  metadata?: Record<string, unknown>;
}

type ImpactType = 
  | "renewable_energy"
  | "co2e_avoided"
  | "trees_planted"
  | "ev_charging"
  | "sustainable_transport"
  | "sustainable_purchase";

type Unit = 
  | "Wh"      // Watt-hours (energy)
  | "kWh"     // Kilowatt-hours
  | "MWh"     // Megawatt-hours
  | "g"       // Grams (CO2e or weight)
  | "kg"      // Kilograms
  | "km"      // Kilometers (distance)
  | "count";  // Discrete items
```

---

## Building an MRV Adapter

### Adapter Interface

```typescript
interface MRVAdapter {
  // Adapter metadata
  readonly name: string;
  readonly version: string;
  readonly supportedTypes: ImpactType[];
  readonly tier: 'A' | 'B' | 'C';
  
  // Fetch data from source
  fetchData(params: FetchParams): Promise<RawData[]>;
  
  // Transform to MRV Report
  transform(raw: RawData): MRVReport;
  
  // Validate data integrity
  validate(report: MRVReport): ValidationResult;
  
  // Map external user to humanId
  mapUser(externalId: string): Promise<bytes32 | null>;
}

interface FetchParams {
  startTime: number;
  endTime: number;
  userExternalId?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### Example: I-REC Adapter

```typescript
import { MRVAdapter, MRVReport, ImpactType } from '@human-0/mrv';

export class IRECAdapter implements MRVAdapter {
  readonly name = 'i-rec';
  readonly version = '1.0.0';
  readonly supportedTypes: ImpactType[] = ['renewable_energy'];
  readonly tier = 'A' as const;
  
  private apiClient: IRECApiClient;
  
  constructor(config: IRECConfig) {
    this.apiClient = new IRECApiClient(config);
  }
  
  async fetchData(params: FetchParams): Promise<IRECCertificate[]> {
    return this.apiClient.getCertificates({
      issuedAfter: params.startTime,
      issuedBefore: params.endTime,
      beneficiary: params.userExternalId,
      status: 'redeemed'
    });
  }
  
  transform(cert: IRECCertificate): MRVReport {
    return {
      type: 'renewable_energy',
      quantity: cert.mwh * 1000, // Convert MWh to kWh
      unit: 'kWh',
      co2e: this.calculateCO2e(cert),
      timestamp: cert.redemptionDate,
      methodology: 'GHG-SCOPE2-MARKET',
      methodologyVersion: '2024',
      evidenceRefs: [cert.certificateId],
      source: 'i-rec-registry',
      sourceSignature: cert.registrySignature,
      userExternalId: cert.beneficiaryId,
      region: cert.countryCode,
      metadata: {
        deviceType: cert.deviceType,
        vintage: cert.vintage,
        registryUrl: cert.registryUrl
      }
    };
  }
  
  validate(report: MRVReport): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check certificate hasn't been used before
    if (this.isAlreadyUsed(report.evidenceRefs[0])) {
      errors.push('Certificate already redeemed in PoSH');
    }
    
    // Check vintage is recent
    const vintage = report.metadata?.vintage as number;
    if (vintage && vintage < new Date().getFullYear() - 2) {
      warnings.push('Certificate vintage is more than 2 years old');
    }
    
    // Validate quantity range
    if (report.quantity <= 0 || report.quantity > 10000000) {
      errors.push('Quantity out of valid range');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private calculateCO2e(cert: IRECCertificate): number {
    // Grid emission factor by country (grams CO2/kWh)
    const factors: Record<string, number> = {
      'CO': 150,  // Colombia
      'BR': 80,   // Brazil
      'US': 400,  // USA average
      'DE': 350,  // Germany
      // ... more countries
    };
    
    const factor = factors[cert.countryCode] || 400;
    return cert.mwh * 1000 * factor; // kWh * grams/kWh
  }
  
  async mapUser(externalId: string): Promise<`0x${string}` | null> {
    // Look up humanId from user mapping table
    return this.userMappingService.getHumanId(externalId);
  }
}
```

### Example: Smart Meter Adapter

```typescript
export class SmartMeterAdapter implements MRVAdapter {
  readonly name = 'smart-meter';
  readonly version = '1.0.0';
  readonly supportedTypes: ImpactType[] = ['renewable_energy'];
  readonly tier = 'A' as const;
  
  async fetchData(params: FetchParams): Promise<MeterReading[]> {
    return this.meterApi.getReadings({
      meterId: params.userExternalId,
      from: params.startTime,
      to: params.endTime,
      resolution: '15min'
    });
  }
  
  transform(readings: MeterReading[]): MRVReport {
    const totalKwh = readings.reduce((sum, r) => sum + r.kwh, 0);
    const firstTimestamp = Math.min(...readings.map(r => r.timestamp));
    
    return {
      type: 'renewable_energy',
      quantity: totalKwh * 1000, // Convert to Wh
      unit: 'Wh',
      co2e: totalKwh * this.getGridFactor(readings[0].gridRegion),
      timestamp: firstTimestamp,
      methodology: 'DIRECT-METER-READING',
      methodologyVersion: '1.0',
      evidenceRefs: readings.map(r => r.readingId),
      source: 'utility-smart-meter',
      sourceSignature: this.signReadings(readings),
      userExternalId: readings[0].meterId,
      region: readings[0].countryCode,
      gridRegion: readings[0].gridRegion
    };
  }
  
  validate(report: MRVReport): ValidationResult {
    const errors: string[] = [];
    
    // Check for gaps in readings
    // Check for anomalous values
    // Verify meter is registered
    
    return { valid: errors.length === 0, errors, warnings: [] };
  }
}
```

---

## User Mapping

Users must link their external accounts to their humanId:

### Linking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER LINKING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User connects wallet and creates humanId                     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ humanId = 0x1234...abcd                             │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  2. User initiates link with MRV provider                        │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ "Link my Unergy account"                            │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  3. OAuth flow with provider                                     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ User authenticates with Unergy                      │     │
│     │ Unergy returns: externalId = "unergy_user_789"      │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  4. Store mapping (encrypted)                                    │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ userMappings[humanId]["unergy"] = "unergy_user_789" │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  5. Future MRV data automatically linked                         │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ When Unergy sends data for "unergy_user_789"        │     │
│     │ → Oracle maps to humanId 0x1234...abcd              │     │
│     │ → Proof credited to correct human                   │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mapping API

```typescript
// Link external account
POST /api/mrv/link
{
  "humanId": "0x1234...abcd",
  "provider": "unergy",
  "authCode": "oauth_code_from_provider",
  "signature": "0x..." // Signed by wallet
}

// Response
{
  "success": true,
  "externalId": "unergy_user_789",
  "linkedAt": 1704067200
}

// Get linked accounts
GET /api/mrv/links?humanId=0x1234...abcd

// Response
{
  "links": [
    {
      "provider": "unergy",
      "linkedAt": 1704067200,
      "lastSync": 1704153600,
      "proofCount": 12
    }
  ]
}
```

---

## CO2e Calculation Methodologies

### Renewable Energy

```typescript
// Market-based method (I-RECs, RECs)
co2e_avoided = energy_kwh * grid_emission_factor

// Location-based method (grid average)
co2e_avoided = energy_kwh * regional_grid_factor

// Emission factors (grams CO2/kWh)
const GRID_FACTORS = {
  'CO': 150,    // Colombia (high hydro)
  'BR': 80,     // Brazil (high hydro)
  'FR': 50,     // France (nuclear)
  'DE': 350,    // Germany
  'US-CA': 200, // California
  'US-TX': 400, // Texas
  'CN': 550,    // China
  'IN': 700,    // India
  'WORLD': 400  // Global average
};
```

### EV Charging

```typescript
// Avoided emissions vs. gasoline vehicle
co2e_avoided = (distance_km / ev_efficiency) * grid_factor 
             - (distance_km / ice_efficiency) * gasoline_factor

// Typical values
const EV_EFFICIENCY = 6; // km per kWh
const ICE_EFFICIENCY = 12; // km per liter
const GASOLINE_FACTOR = 2300; // grams CO2 per liter
```

### Trees Planted

```typescript
// Carbon sequestration over tree lifetime
co2e_sequestered = trees_count * sequestration_per_tree

// Typical values (varies by species and region)
const SEQUESTRATION_PER_TREE = 20000; // grams CO2 per year average
const TREE_LIFETIME = 40; // years
```

---

## Webhook Integration

For real-time data ingestion:

```typescript
// Webhook endpoint
POST /api/mrv/webhook/:provider

// Headers
X-Provider-Signature: sha256=abc123...
X-Provider-Timestamp: 1704067200

// Body (example: Unergy solar generation)
{
  "event": "generation_recorded",
  "data": {
    "userId": "unergy_user_789",
    "deviceId": "solar_panel_001",
    "kwhGenerated": 5.2,
    "timestamp": 1704067200,
    "gridExported": 3.1
  },
  "signature": "0x..."
}

// Response
{
  "received": true,
  "proofId": "0x9876...fedc"
}
```

---

## Testing Your Adapter

```typescript
import { testAdapter } from '@human-0/mrv-testing';

describe('IRECAdapter', () => {
  const adapter = new IRECAdapter(testConfig);
  
  it('should fetch certificates', async () => {
    const data = await adapter.fetchData({
      startTime: Date.now() - 86400000,
      endTime: Date.now()
    });
    expect(data.length).toBeGreaterThan(0);
  });
  
  it('should transform to valid MRV report', () => {
    const report = adapter.transform(mockCertificate);
    expect(report.type).toBe('renewable_energy');
    expect(report.quantity).toBeGreaterThan(0);
    expect(report.co2e).toBeGreaterThan(0);
  });
  
  it('should validate correctly', () => {
    const result = adapter.validate(validReport);
    expect(result.valid).toBe(true);
  });
  
  it('should reject duplicate certificates', () => {
    const result = adapter.validate(duplicateReport);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Certificate already redeemed');
  });
});
```

---

## Becoming an MRV Provider

To register as an official MRV provider:

1. **Develop Adapter**: Build and test your adapter
2. **Submit for Review**: Open PR to `human-0/mrv-adapters`
3. **Security Audit**: Pass security review
4. **Stake Tokens**: Stake required amount (Phase 3)
5. **Go Live**: Adapter activated in production

### Provider Requirements

- [ ] Signed data from authoritative source
- [ ] Deduplication mechanism
- [ ] Rate limiting
- [ ] Error handling
- [ ] Monitoring and alerting
- [ ] Documentation
- [ ] Test coverage > 80%

---

## Next Steps

- [Smart Contracts](./smart-contracts) - Contract integration
- [Zero-Knowledge Proofs](./zero-knowledge) - Privacy layer
- [Whitepaper](./whitepaper) - Formal specification


# React Hooks Usage Examples

## Setup

### 1. Wrap Your App with PoshProvider

```typescript
// App.tsx
import { PoshProvider } from '@human-0/posh-sdk/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const poshConfig = {
  chainId: 84532, // Base Sepolia
  contracts: {
    humanIdentity: '0x...',
    proofRegistry: '0x...',
    poshNFT: '0x...',
    humanScore: '0x...',
  },
};

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PoshProvider config={poshConfig}>
          <YourApp />
        </PoshProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Example 1: Identity Card Component

```typescript
import { useIdentity } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function IdentityCard() {
  const { address } = useAccount();
  const {
    identity,
    humanId,
    isRegistered,
    isLoading,
    register,
    isRegistering,
  } = useIdentity(address);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isRegistered) {
    return (
      <div>
        <h2>Not Registered</h2>
        <button onClick={() => register()} disabled={isRegistering}>
          {isRegistering ? 'Registering...' : 'Register Identity'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Your PoSH Identity</h2>
      <p>Human ID: {humanId}</p>
      <p>Registered: {identity?.registrationTime.toLocaleDateString()}</p>
    </div>
  );
}
```

## Example 2: Proof List Component

```typescript
import { useProofs, useProofCount } from '@human-0/posh-sdk/react';
import { useIdentity } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function ProofList() {
  const { address } = useAccount();
  const { humanId } = useIdentity(address);
  const { data: proofs, isLoading } = useProofs(humanId);
  const { data: count } = useProofCount(humanId);

  if (isLoading) return <div>Loading proofs...</div>;

  return (
    <div>
      <h2>Your Proofs ({count || 0})</h2>
      {proofs?.length === 0 ? (
        <p>No proofs yet</p>
      ) : (
        <ul>
          {proofs?.map((proof) => (
            <li key={proof.proofId}>
              <strong>{proof.impactType}</strong>: {proof.impactValue.toString()}
              <span> (Tier {proof.tier})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Example 3: Score Display Component

```typescript
import { useScoreData } from '@human-0/posh-sdk/react';
import { useIdentity } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function ScoreDisplay() {
  const { address } = useAccount();
  const { humanId } = useIdentity(address);
  const { score, level, tierBreakdown, isLoading } = useScoreData(humanId);

  if (isLoading) return <div>Loading score...</div>;

  return (
    <div>
      <h2>Your Score</h2>
      <div>
        <p>Score: {score}</p>
        <p>Level: {level?.name}</p>
      </div>

      {tierBreakdown && (
        <div>
          <h3>Tier Breakdown</h3>
          <p>Tier A: {tierBreakdown.tierA}</p>
          <p>Tier B: {tierBreakdown.tierB}</p>
          <p>Tier C: {tierBreakdown.tierC}</p>
          <p>Total: {tierBreakdown.total}</p>
        </div>
      )}
    </div>
  );
}
```

## Example 4: Impact Dashboard

```typescript
import { useProofData, useTotalImpact } from '@human-0/posh-sdk/react';
import { useIdentity } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function ImpactDashboard() {
  const { address } = useAccount();
  const { humanId } = useIdentity(address);
  const { proofs, count, totalImpact, isLoading } = useProofData(humanId);

  // Get impact by type
  const { data: energyImpact } = useTotalImpact(humanId, 'renewable_energy');
  const { data: carbonImpact } = useTotalImpact(humanId, 'carbon_avoidance');

  if (isLoading) return <div>Loading impact data...</div>;

  return (
    <div>
      <h2>Impact Dashboard</h2>
      
      <div>
        <h3>Total Impact</h3>
        <p>{totalImpact.toString()} units</p>
        <p>{count} proofs</p>
      </div>

      <div>
        <h3>By Type</h3>
        <p>Renewable Energy: {energyImpact?.toString() || '0'}</p>
        <p>Carbon Avoidance: {carbonImpact?.toString() || '0'}</p>
      </div>

      <div>
        <h3>Recent Proofs</h3>
        {proofs.slice(0, 5).map((proof) => (
          <div key={proof.proofId}>
            {proof.impactType}: {proof.impactValue.toString()}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 5: Event Feed

```typescript
import { useProofRegisteredEvents } from '@human-0/posh-sdk/react';

function EventFeed() {
  const events = useProofRegisteredEvents((event) => {
    console.log('New proof registered:', event);
    // Could show a notification here
  });

  return (
    <div>
      <h2>Recent Activity</h2>
      {events.length === 0 ? (
        <p>No recent activity</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              Proof {event.proofId} registered for {event.humanId}
              <br />
              Impact: {event.impactValue.toString()} ({event.impactType})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Example 6: Complete Profile Page

```typescript
import { useIdentity, useProofData, useScoreData } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function ProfilePage() {
  const { address } = useAccount();
  const { identity, isRegistered, isLoading: identityLoading } = useIdentity(address);
  const { proofs, count, totalImpact, isLoading: proofsLoading } = useProofData(identity?.humanId);
  const { score, level, isLoading: scoreLoading } = useScoreData(identity?.humanId);

  const isLoading = identityLoading || proofsLoading || scoreLoading;

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!isRegistered) {
    return <div>Please register first</div>;
  }

  return (
    <div>
      <h1>Your PoSH Profile</h1>

      <section>
        <h2>Identity</h2>
        <p>Human ID: {identity?.humanId}</p>
        <p>Wallet: {address}</p>
        <p>Member since: {identity?.registrationTime.toLocaleDateString()}</p>
      </section>

      <section>
        <h2>Score & Level</h2>
        <p>Score: {score}</p>
        <p>Level: {level?.name}</p>
      </section>

      <section>
        <h2>Impact</h2>
        <p>Total Impact: {totalImpact.toString()}</p>
        <p>Proofs: {count}</p>
      </section>

      <section>
        <h2>Recent Proofs</h2>
        {proofs.slice(0, 10).map((proof) => (
          <div key={proof.proofId}>
            <strong>{proof.impactType}</strong>
            <p>Value: {proof.impactValue.toString()}</p>
            <p>Tier: {proof.tier}</p>
            <p>Date: {proof.timestamp.toLocaleDateString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

## Example 7: Conditional Rendering Based on Score

```typescript
import { useMeetsThreshold } from '@human-0/posh-sdk/react';
import { useIdentity } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function PremiumFeature() {
  const { address } = useAccount();
  const { humanId } = useIdentity(address);
  const { data: meetsThreshold, isLoading } = useMeetsThreshold(humanId, 1000);

  if (isLoading) return <div>Checking access...</div>;

  if (!meetsThreshold) {
    return (
      <div>
        <p>This feature requires a score of 1000+</p>
        <p>Keep contributing to unlock!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Premium Feature</h2>
      <p>Congratulations! You have access to this feature.</p>
    </div>
  );
}
```

## Example 8: Custom Hook for Combined Data

```typescript
import { useIdentity, useProofData, useScoreData } from '@human-0/posh-sdk/react';
import { useAccount } from 'wagmi';

function useUserProfile() {
  const { address } = useAccount();
  const identity = useIdentity(address);
  const proofs = useProofData(identity.humanId);
  const score = useScoreData(identity.humanId);

  return {
    address,
    identity: identity.identity,
    humanId: identity.humanId,
    isRegistered: identity.isRegistered,
    proofs: proofs.proofs,
    proofCount: proofs.count,
    totalImpact: proofs.totalImpact,
    score: score.score,
    level: score.level,
    tierBreakdown: score.tierBreakdown,
    isLoading: identity.isLoading || proofs.isLoading || score.isLoading,
    error: identity.error || proofs.error || score.error,
  };
}

// Usage
function MyComponent() {
  const profile = useUserProfile();

  if (profile.isLoading) return <div>Loading...</div>;
  if (profile.error) return <div>Error: {profile.error.message}</div>;

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Score: {profile.score}</p>
      <p>Level: {profile.level?.name}</p>
      <p>Proofs: {profile.proofCount}</p>
    </div>
  );
}
```

## Best Practices

1. **Always check loading states**: Use `isLoading` to show loading indicators
2. **Handle errors gracefully**: Check `error` and display user-friendly messages
3. **Conditional rendering**: Check `isRegistered` before showing identity-dependent content
4. **Memoize callbacks**: Use `useCallback` for event handlers to prevent unnecessary re-renders
5. **Combine hooks**: Create custom hooks to combine multiple SDK hooks for cleaner code
6. **Query invalidation**: The SDK automatically invalidates queries after mutations
7. **Type safety**: All hooks are fully typed with TypeScript

## Performance Tips

1. **Use specific hooks**: Use `useScore` instead of `useScoreData` if you only need the score
2. **Conditional queries**: Hooks automatically disable when required params are undefined
3. **React Query caching**: Data is cached automatically, reducing unnecessary requests
4. **Batch queries**: Multiple hooks can run in parallel thanks to React Query

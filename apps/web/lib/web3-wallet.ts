// Web3 wallet utilities using native browser APIs
// No external dependencies - works with any bundler

// EIP-1193 Provider interface
interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  removeListener(event: string, callback: (...args: unknown[]) => void): void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

/**
 * Safely access the Ethereum provider
 * @returns The Ethereum provider or null if not available
 */
function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Use optional chaining and nullish coalescing for safety
  return window.ethereum ?? null;
}

/**
 * Connect to user's Web3 wallet
 * @returns Connected account address or null
 */
export async function connectWallet(): Promise<string | null> {
  const provider = getEthereumProvider();
  
  if (!provider) {
    // Use console.warn instead of alert for better UX
    console.warn('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.');
    return null;
  }

  try {
    const result = await provider.request({
      method: 'eth_requestAccounts',
    });
    
    // Type guard for the result
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    // Type-safe error handling
    if (error && typeof error === 'object' && 'code' in error) {
      const ethError = error as { code: number; message?: string };
      
      if (ethError.code === 4001) {
        // User rejected the request
        console.info('User rejected wallet connection');
        return null;
      }
    }
    
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

/**
 * Get currently connected account without prompting
 * @returns Connected account address or null
 */
export async function getConnectedAccount(): Promise<string | null> {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return null;
  }

  try {
    const result = await provider.request({
      method: 'eth_accounts',
    });
    
    // Type guard for the result
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get account:', error);
    return null;
  }
}

/**
 * Subscribe to account changes
 * @param callback Function to call when accounts change
 * @returns Cleanup function to remove the listener
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return () => {}; // No-op cleanup function
  }

  // Wrap callback with type safety
  const wrappedCallback = (accounts: unknown) => {
    if (Array.isArray(accounts)) {
      callback(accounts as string[]);
    }
  };

  provider.on('accountsChanged', wrappedCallback);
  
  return () => {
    provider.removeListener('accountsChanged', wrappedCallback);
  };
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

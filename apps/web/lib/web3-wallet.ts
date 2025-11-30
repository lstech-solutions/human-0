// Web3 wallet utilities using native browser APIs
// No external dependencies - works with any bundler

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    alert('Please install MetaMask or another Web3 wallet');
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0] || null;
  } catch (error: any) {
    console.error('Failed to connect wallet:', error);
    if (error.code === 4001) {
      // User rejected the request
      return null;
    }
    throw error;
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Failed to get account:', error);
    return null;
  }
}

export function onAccountsChanged(callback: (accounts: string[]) => void) {
  if (typeof window === 'undefined' || !window.ethereum) {
    return () => {};
  }

  window.ethereum.on('accountsChanged', callback);
  
  return () => {
    window.ethereum.removeListener('accountsChanged', callback);
  };
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

import React, { useState, useEffect } from "react";
import { Platform } from "react-native";

interface Web3ConnectButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Web3ConnectButton({ className, children }: Web3ConnectButtonProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    // Dynamically import web3 utilities only on web
    import("../lib/web3-wallet").then(({ getConnectedAccount, onAccountsChanged }) => {
      getConnectedAccount().then(setAccount);

      const cleanup = onAccountsChanged((accounts) => {
        setAccount(accounts[0] || null);
      });

      return cleanup;
    });
  }, []);

  if (Platform.OS !== "web") {
    return null;
  }

  const handleClick = async () => {
    if (account) {
      setAccount(null);
      return;
    }

    setIsConnecting(true);
    try {
      const { connectWallet } = await import("../lib/web3-wallet");
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const displayText = account
    ? formatAddress(account)
    : isConnecting
    ? "Connecting..."
    : children || "Connect Wallet";

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={className}
      style={{ borderWidth: '1px' }}
    >
      <span>{displayText}</span>
    </button>
  );
}

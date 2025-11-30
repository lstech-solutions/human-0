import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { Shield, Fingerprint, Award, Zap, Globe, Lock } from "lucide-react-native";
import { useTheme } from "../theme/ThemeProvider";
import { AppFooter } from "../components/AppFooter";

// Web3 wallet utilities - only imported on web
let connectWallet: any, getConnectedAccount: any, onAccountsChanged: any, formatAddress: any;

if (Platform.OS === "web") {
  const web3Utils = require("../lib/web3-wallet");
  connectWallet = web3Utils.connectWallet;
  getConnectedAccount = web3Utils.getConnectedAccount;
  onAccountsChanged = web3Utils.onAccountsChanged;
  formatAddress = web3Utils.formatAddress;
}

export default function IdentityScreen() {
  const { colorScheme } = useTheme();
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    // Check for existing connection
    getConnectedAccount().then(setAccount);

    // Listen for account changes
    const cleanup = onAccountsChanged((accounts: string[]) => {
      setAccount(accounts[0] || null);
    });

    return cleanup;
  }, []);

  const handleConnect = async () => {
    if (Platform.OS !== "web") return;

    if (account) {
      setAccount(null);
      return;
    }

    setIsConnecting(true);
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-white dark:bg-[#050B10]">
      <ScrollView className="flex-1">
        <View className="px-6 py-12 max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-[#0A1628] dark:text-[#00FF9C] text-4xl font-bold mb-2">
            Your Identity
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-base">
            Create your unique human identity and start building your Proof of Sustainable Humanity.
          </Text>
        </View>

        {/* Wallet Connection Card */}
        <View className="mb-8 bg-gray-50 dark:bg-[#0A1628] border-2 border-gray-200 dark:border-[#00FF9C]/20 rounded-3xl p-6">
          {Platform.OS === "web" ? (
            <>
              {!account ? (
                <View className="items-center">
                  <Fingerprint size={48} color={isDark ? "#00FF9C" : "#0A1628"} />
                  <Text className="text-[#0A1628] dark:text-white text-xl font-bold mt-4 text-center">
                    Connect Your Wallet
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 mb-6">
                    Connect your Web3 wallet to create your PoSH identity
                  </Text>
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-6 py-3 bg-[#00FF9C] hover:bg-[#00FF9C]/90 text-[#0A1628] font-mono text-sm rounded-lg transition-all disabled:opacity-50"
                  >
                    {isConnecting ? "Connecting..." : "CONNECT WALLET"}
                  </button>
                </View>
              ) : (
                <View className="items-center">
                  <Shield size={48} color="#00FF9C" />
                  <Text className="text-[#0A1628] dark:text-white text-xl font-bold mt-4 text-center">
                    Wallet Connected
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 font-mono text-sm">
                    {formatAddress(account)}
                  </Text>
                  <View className="mt-6 w-full space-y-3">
                    <button
                      className="w-full px-6 py-3 bg-[#00FF9C] hover:bg-[#00FF9C]/90 text-[#0A1628] font-mono text-sm rounded-lg transition-all"
                    >
                      CREATE IDENTITY
                    </button>
                    <button
                      onClick={handleConnect}
                      className="w-full px-6 py-3 bg-transparent border border-gray-300 dark:border-[#00FF9C]/30 text-[#0A1628] dark:text-white font-mono text-sm rounded-lg hover:border-[#00FF9C] transition-all"
                    >
                      DISCONNECT
                    </button>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View className="items-center">
              <Fingerprint size={48} color="#00FF9C" />
              <Text className="text-white text-xl font-bold mt-4 text-center">
                Identity Available on Web
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Please use the web version to create your identity.
              </Text>
            </View>
          )}
        </View>

        {/* What is PoSH Section */}
        <View className="mb-8">
          <Text className="text-[#0A1628] dark:text-white text-xl font-bold mb-4">
            What is Proof of Sustainable Humanity?
          </Text>
          
          <View className="bg-gray-50 dark:bg-[#0A1628] border border-gray-200 dark:border-[#00FF9C]/20 rounded-2xl p-5 mb-4">
            <View className="mb-4">
              <View className="flex-row items-start">
                <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                  <Zap size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                    Action-Based Proof
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    Unlike PoW or PoS, PoSH is based on your real-world sustainable actions.
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row items-start">
                <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                  <Lock size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                    Privacy-Preserving
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    Prove your impact without exposing personal data.
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row items-start">
                <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                  <Shield size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                    Sybil Resistant
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    One wallet = one identity. Verified through MRV sources.
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View className="flex-row items-start">
                <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                  <Globe size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                    Globally Accessible
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    Works on any device, low bandwidth, no heavy KYC.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View className="mb-8">
          <Text className="text-[#0A1628] dark:text-white text-xl font-bold mb-4">
            How It Works
          </Text>
          
          <View className="space-y-4">
            {[
              { step: "1", title: "Connect Wallet", desc: "Use MetaMask, Coinbase Wallet, or any Web3 wallet" },
              { step: "2", title: "Create Identity", desc: "Register your unique humanId on-chain (only gas fees)" },
              { step: "3", title: "Link MRV Sources", desc: "Connect your smart meter, EV, or renewable energy provider" },
              { step: "4", title: "Build Your Score", desc: "Earn PoSH proofs and mint Soulbound NFTs" },
            ].map((item) => (
              <View key={item.step} className="flex-row items-center mb-3">
                <View className="bg-[#00FF9C] w-8 h-8 rounded-full items-center justify-center mr-4">
                  <Text className="text-[#0A1628] font-bold">{item.step}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[#0A1628] dark:text-white font-semibold">{item.title}</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Info Footer */}
        <View className="items-center pt-4 pb-20 border-t border-gray-200 dark:border-[#00FF9C]/10">
          <Text className="text-gray-500 text-xs text-center">
            PoSH is non-extractive. Only network gas fees apply.
          </Text>
        </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute left-0 right-0 bottom-0">
        <AppFooter />
      </View>
    </View>
  );
}

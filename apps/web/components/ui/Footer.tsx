import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { useTheme } from '../../theme/ThemeProvider';

export function Footer() {
  const { currentLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  
  const isDark = colorScheme === 'dark';
  
  // Build URLs with current locale and dark mode
  const buildUrl = (path: string) => {
    const baseUrl = Platform.OS === 'web' 
      ? (process.env.NODE_ENV === 'development' ? 'http://localhost:3001/documentation' : 'https://human-0.com/documentation')
      : 'https://human-0.com/documentation';
    
    return `${baseUrl}${path}?locale=${currentLanguage}&dark=${isDark}`;
  };

  const buildMainSiteUrl = (path: string = '') => {
    const baseUrl = Platform.OS === 'web' 
      ? (process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'https://human-0.com')
      : 'https://human-0.com';
    
    return `${baseUrl}${path}?locale=${currentLanguage}&dark=${isDark}`;
  };

  const handleLinkPress = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      // For native platforms, you might want to use Linking or other navigation
      console.log('Navigate to:', url);
    }
  };

  return (
    <View className={`w-full py-8 px-4 border-t ${isDark ? 'bg-[#050B10] border-gray-800' : 'bg-white border-gray-200'}`}>
      <View className="max-w-6xl mx-auto">
        {/* Main content grid */}
        <View className="flex flex-col md:flex-row gap-8 mb-8">
          
          {/* Company section */}
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
              HUMΛN-Ø
            </Text>
            <Text className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sustainable impact through Web3 technology
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              © 2025 LSTS SAS. All rights reserved.
            </Text>
          </View>

          {/* Legal section */}
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
              Legal
            </Text>
            <Pressable onPress={() => handleLinkPress(buildUrl('/privacy'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Privacy Policy
              </Text>
            </Pressable>
            <Pressable onPress={() => handleLinkPress(buildUrl('/terms'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Terms of Service
              </Text>
            </Pressable>
          </View>

          {/* Resources section */}
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
              Resources
            </Text>
            <Pressable onPress={() => handleLinkPress(buildUrl('/docs/intro'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Documentation
              </Text>
            </Pressable>
            <Pressable onPress={() => handleLinkPress(buildUrl('/docs/architecture'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Architecture
              </Text>
            </Pressable>
            <Pressable onPress={() => handleLinkPress('https://github.com/lstech-solutions/human-0.com')}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                GitHub
              </Text>
            </Pressable>
          </View>

          {/* Connect section */}
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
              Connect
            </Text>
            <Pressable onPress={() => handleLinkPress(buildMainSiteUrl('/impact'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Impact Tracking
              </Text>
            </Pressable>
            <Pressable onPress={() => handleLinkPress(buildMainSiteUrl('/profile'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                Profile
              </Text>
            </Pressable>
            <Pressable onPress={() => handleLinkPress(buildMainSiteUrl('/nfts'))}>
              <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                NFT Collection
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom bar */}
        <View className={`pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <View className="flex flex-col sm:flex-row justify-between items-center">
            <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Built with ❤️ and Web3 technology
            </Text>
            <View className="flex flex-row items-center gap-4 mt-2 sm:mt-0">
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Language: {currentLanguage?.toUpperCase()}
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Theme: {isDark ? '🌙 Dark' : '☀️ Light'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

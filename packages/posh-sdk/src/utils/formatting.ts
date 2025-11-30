/**
 * Formatting utilities for displaying data
 */

import type { HumanId, Address } from '../types';

/**
 * Format a humanId for display (truncated)
 */
export function formatHumanId(humanId: HumanId, length: number = 8): string {
  if (humanId.length <= length + 2) {
    return humanId;
  }
  return `${humanId.slice(0, length + 2)}...${humanId.slice(-length)}`;
}

/**
 * Format an address for display (truncated)
 */
export function formatAddress(address: Address, length: number = 6): string {
  if (address.length <= length + 2) {
    return address;
  }
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

/**
 * Format a bigint value for display
 */
export function formatImpactValue(value: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmed = fractionalStr.replace(/0+$/, '');
  
  return `${integerPart}.${trimmed}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

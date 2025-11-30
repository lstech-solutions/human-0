/**
 * @human-0/posh-sdk
 * 
 * TypeScript SDK for Proof of Sustainable Humanity (PoSH) identity management
 * 
 * @packageDocumentation
 */

// Core exports
export * from './core/PoshClient';
export * from './core/IdentityManager';
export * from './core/ProofManager';
export * from './core/ScoreManager';
export * from './core/EventManager';

// Type exports
export * from './types';

// Provider exports
export * from './providers';

// Contract exports
export * from './contracts/registry';
export * from './contracts/addresses';

// Utility exports
export * from './utils/errors';
export * from './utils/validation';
export * from './utils/formatting';

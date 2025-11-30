/**
 * Contract ABIs
 * 
 * Note: These are minimal placeholder ABIs until actual contracts are available
 */

// Minimal HumanIdentity ABI
export const HUMAN_IDENTITY_ABI = [
  {
    type: 'function',
    name: 'register',
    inputs: [],
    outputs: [{ name: 'humanId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isRegistered',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getHumanId',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'HumanRegistered',
    inputs: [
      { name: 'humanId', type: 'bytes32', indexed: true },
      { name: 'wallet', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

// Minimal ProofRegistry ABI
export const PROOF_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getProofCount',
    inputs: [{ name: 'humanId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProof',
    inputs: [{ name: 'proofId', type: 'bytes32' }],
    outputs: [
      { name: 'humanId', type: 'bytes32' },
      { name: 'impactType', type: 'uint8' },
      { name: 'impactValue', type: 'uint256' },
      { name: 'tier', type: 'uint8' },
      { name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ProofRegistered',
    inputs: [
      { name: 'proofId', type: 'bytes32', indexed: true },
      { name: 'humanId', type: 'bytes32', indexed: true },
      { name: 'impactType', type: 'uint8', indexed: false },
      { name: 'impactValue', type: 'uint256', indexed: false },
      { name: 'tier', type: 'uint8', indexed: false },
    ],
  },
] as const;

// Minimal HumanScore ABI
export const HUMAN_SCORE_ABI = [
  {
    type: 'function',
    name: 'getScore',
    inputs: [{ name: 'humanId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLevel',
    inputs: [{ name: 'humanId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const;

// Minimal PoSHNFT ABI
export const POSH_NFT_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

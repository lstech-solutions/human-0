/**
 * Identity type definitions
 */

import type { Address, HumanId } from './common';

export interface Identity {
  humanId: HumanId;
  wallet: Address;
  registrationTime: Date;
  externalProofs: ExternalProof[];
}

export interface ExternalProof {
  hash: string;
  provider: string;
  linkedAt: Date;
}

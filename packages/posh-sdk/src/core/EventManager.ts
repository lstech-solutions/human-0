/**
 * EventManager - handles blockchain event subscriptions
 */

import type {
  HumanRegisteredEvent,
  ProofRegisteredEvent,
  IdentityLinkedEvent,
  EventFilter,
  Unsubscribe,
  PoshConfig,
} from '../types';
import type { BaseProvider } from '../providers';

export class EventManager {
  constructor(_config: PoshConfig, _provider?: BaseProvider) {
    // Config and provider will be used for event subscriptions
  }

  /**
   * Subscribe to HumanRegistered events
   * Note: Mock implementation - no events until contracts are deployed
   */
  onHumanRegistered(
    _callback: (event: HumanRegisteredEvent) => void
  ): Unsubscribe {
    // Mock: Return no-op unsubscribe function
    return () => {};
  }

  /**
   * Subscribe to ProofRegistered events
   * Note: Mock implementation
   */
  onProofRegistered(
    _callback: (event: ProofRegisteredEvent) => void
  ): Unsubscribe {
    // Mock: Return no-op unsubscribe function
    return () => {};
  }

  /**
   * Subscribe to IdentityLinked events
   * Note: Mock implementation
   */
  onIdentityLinked(
    _callback: (event: IdentityLinkedEvent) => void
  ): Unsubscribe {
    // Mock: Return no-op unsubscribe function
    return () => {};
  }

  /**
   * Get historical HumanRegistered events
   * Note: Mock implementation
   */
  async getHumanRegisteredEvents(
    _filter?: EventFilter
  ): Promise<HumanRegisteredEvent[]> {
    return [];
  }

  /**
   * Get historical ProofRegistered events
   * Note: Mock implementation
   */
  async getProofRegisteredEvents(
    _filter?: EventFilter
  ): Promise<ProofRegisteredEvent[]> {
    return [];
  }

  /**
   * Get historical IdentityLinked events
   * Note: Mock implementation
   */
  async getIdentityLinkedEvents(
    _filter?: EventFilter
  ): Promise<IdentityLinkedEvent[]> {
    return [];
  }
}

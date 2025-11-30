/**
 * React hook for event subscriptions
 */

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePoshClient } from './PoshProvider';
import type {
  HumanRegisteredEvent,
  ProofRegisteredEvent,
  IdentityLinkedEvent,
  EventFilter,
} from '../types';

/**
 * Hook to subscribe to HumanRegistered events
 */
export function useHumanRegisteredEvents(
  callback?: (event: HumanRegisteredEvent) => void
) {
  const client = usePoshClient();
  const [events, setEvents] = useState<HumanRegisteredEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: HumanRegisteredEvent) => {
      setEvents((prev) => [...prev, event]);
      callback?.(event);
    };

    const unsubscribe = client.events.onHumanRegistered(handleEvent);
    return unsubscribe;
  }, [client, callback]);

  return events;
}

/**
 * Hook to subscribe to ProofRegistered events
 */
export function useProofRegisteredEvents(
  callback?: (event: ProofRegisteredEvent) => void
) {
  const client = usePoshClient();
  const [events, setEvents] = useState<ProofRegisteredEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: ProofRegisteredEvent) => {
      setEvents((prev) => [...prev, event]);
      callback?.(event);
    };

    const unsubscribe = client.events.onProofRegistered(handleEvent);
    return unsubscribe;
  }, [client, callback]);

  return events;
}

/**
 * Hook to subscribe to IdentityLinked events
 */
export function useIdentityLinkedEvents(
  callback?: (event: IdentityLinkedEvent) => void
) {
  const client = usePoshClient();
  const [events, setEvents] = useState<IdentityLinkedEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: IdentityLinkedEvent) => {
      setEvents((prev) => [...prev, event]);
      callback?.(event);
    };

    const unsubscribe = client.events.onIdentityLinked(handleEvent);
    return unsubscribe;
  }, [client, callback]);

  return events;
}

/**
 * Hook to get historical HumanRegistered events
 */
export function useHistoricalHumanRegisteredEvents(filter?: EventFilter) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'events', 'humanRegistered', filter],
    queryFn: () => client.events.getHumanRegisteredEvents(filter),
  });
}

/**
 * Hook to get historical ProofRegistered events
 */
export function useHistoricalProofRegisteredEvents(filter?: EventFilter) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'events', 'proofRegistered', filter],
    queryFn: () => client.events.getProofRegisteredEvents(filter),
  });
}

/**
 * Hook to get historical IdentityLinked events
 */
export function useHistoricalIdentityLinkedEvents(filter?: EventFilter) {
  const client = usePoshClient();

  return useQuery({
    queryKey: ['posh', 'events', 'identityLinked', filter],
    queryFn: () => client.events.getIdentityLinkedEvents(filter),
  });
}

/**
 * Combined hook for all event subscriptions
 */
export function useAllEvents() {
  const humanRegistered = useHumanRegisteredEvents();
  const proofRegistered = useProofRegisteredEvents();
  const identityLinked = useIdentityLinkedEvents();

  return {
    humanRegistered,
    proofRegistered,
    identityLinked,
    all: [...humanRegistered, ...proofRegistered, ...identityLinked],
  };
}

'use client';

import { useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { getSocket } from '@/lib/socket';

export function useReviewUpdates(
  events: string[],
  onEvent: (event: string, data: unknown) => void,
) {
  const { data: session } = authClient.useSession();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const token = (session as { session?: { token?: string } } | null)?.session
      ?.token;
    if (!token) return;

    const s = getSocket(token);
    s.connect();

    const handlers = events.map((event) => {
      const handler = (data: unknown) => onEventRef.current(event, data);
      s.on(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => s.off(event, handler));
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, events.join(',')]);
}

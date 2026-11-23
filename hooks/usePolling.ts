"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UsePollingOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
}

interface UsePollingReturn {
  isPolling: boolean;
  lastUpdated: Date | null;
  startPolling: () => void;
  stopPolling: () => void;
  refreshNow: () => void;
}

export function usePolling(
  callback: () => Promise<void> | void,
  options: UsePollingOptions = {}
): UsePollingReturn {
  const { interval = 30000, enabled = true, onError } = options;
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const executePoll = useCallback(async () => {
    try {
      await callbackRef.current();
      if (isMountedRef.current) {
        setLastUpdated(new Date());
      }
    } catch (error) {
      if (isMountedRef.current && onError) {
        onError(error as Error);
      }
    }
  }, [onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPolling(true);
    executePoll(); // Immediate first poll
    intervalRef.current = setInterval(executePoll, interval);
  }, [executePoll, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const refreshNow = useCallback(() => {
    executePoll();
  }, [executePoll]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    isPolling,
    lastUpdated,
    startPolling,
    stopPolling,
    refreshNow,
  };
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Generic data-fetching hook.
 *
 * @param fetcher  Async function that returns the data (typically an apiClient method call).
 * @param deps     Dependency array -- refetches when any value changes.
 * @param options  Optional config: `immediate` (default true) to fetch on mount.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options?: { immediate?: boolean },
) {
  const { immediate = true } = options ?? {};

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  // Keep a stable reference to the latest fetcher to avoid stale closures
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ data: null, error, isLoading: false });
      throw error;
    }
  }, []); // stable -- uses ref internally

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        /* error already captured in state */
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: execute } as const;
}

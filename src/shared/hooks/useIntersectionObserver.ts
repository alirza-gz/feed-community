"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onIntersect` when the returned ref's element scrolls into view.
 * Used to drive infinite scroll via a sentinel element at the list's end.
 */
export function useIntersectionObserver<T extends Element>(
  onIntersect: () => void,
  options?: { enabled?: boolean; rootMargin?: string },
) {
  const ref = useRef<T | null>(null);
  const { enabled = true, rootMargin = "200px" } = options ?? {};

  // Keep the latest callback without re-creating the observer each render.
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}

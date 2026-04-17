"use client";

import { useSyncExternalStore } from "react";

let cachedNow = 0;
const listeners = new Set<() => void>();
let timerId: ReturnType<typeof setInterval> | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (timerId === null) {
    timerId = setInterval(() => {
      cachedNow = Date.now();
      listeners.forEach((fn) => fn());
    }, 60_000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };
}

function getSnapshot() {
  if (cachedNow === 0) cachedNow = Date.now();
  return cachedNow;
}

/**
 * Returns 0 during SSR so server output is deterministic.
 * Callers should handle `nowMs === 0` with a safe fallback.
 */
function getServerSnapshot() {
  return 0;
}

/**
 * Current time in ms. SSR-safe: returns 0 on the server, initializes
 * to Date.now() on first client render (via useSyncExternalStore).
 * Updated every minute via a shared singleton interval.
 */
export function useNowMs(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global UI state (Zustand).
 *
 * This holds cross-cutting, client-only concerns that are NOT server data and
 * do NOT belong in the URL:
 *  - `density`: a user view preference, persisted to localStorage.
 *  - `toast`: a transient app-wide notification surface.
 *
 * Server data is owned by TanStack Query; feed filters live in the URL. See
 * the README "State Management" section for the full split.
 */

export type Density = "comfortable" | "compact";

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error";
}

interface UiState {
  density: Density;
  toggleDensity: () => void;

  toasts: Toast[];
  pushToast: (message: string, variant?: Toast["variant"]) => void;
  dismissToast: (id: number) => void;
}

let toastSeq = 0;

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      density: "comfortable",
      toggleDensity: () =>
        set((s) => ({
          density: s.density === "comfortable" ? "compact" : "comfortable",
        })),

      toasts: [],
      pushToast: (message, variant = "success") =>
        set((s) => ({
          toasts: [...s.toasts, { id: ++toastSeq, message, variant }],
        })),
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "feed-community-ui",
      // Only persist the durable preference, not transient toasts.
      partialize: (state) => ({ density: state.density }),
    },
  ),
);

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "amys-hairlab-wishlist";
const CHANGE_EVENT = "amys-hairlab-wishlist-change";
const PENDING = "\u0000";

type WishlistContextValue = {
  ids: string[];
  ready: boolean;
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

function readRaw() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function serverSnapshot() {
  return PENDING;
}

function parseIds(raw: string) {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  const ready = raw !== PENDING;
  const ids = useMemo(() => (ready ? parseIds(raw) : []), [raw, ready]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      ready,
      count: ids.length,
      has: (productId) => ids.includes(productId),
      toggle: (productId) => {
        const next = ids.includes(productId)
          ? ids.filter((id) => id !== productId)
          : [...ids, productId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      },
    }),
    [ids, ready],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

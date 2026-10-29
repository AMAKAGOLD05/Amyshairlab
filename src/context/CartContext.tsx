"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useCatalog } from "@/context/CatalogContext";
import { unitPrice } from "@/lib/catalog";
import type { CartLine } from "@/types/catalog";

const STORAGE_KEY = "amys-hairlab-cart";
const CHANGE_EVENT = "amys-hairlab-cart-change";
const PENDING = "\u0000";

type AddInput = {
  productId: string;
  length: string | null;
  variations: { label: string; value: string }[];
  quantity: number;
};

type AddResult = { ok: true; message: string } | { ok: false; message: string };

type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  notice: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearNotice: () => void;
  addItem: (input: AddInput) => AddResult;
  setQuantity: (lineId: string, quantity: number) => AddResult;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

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

function writeRaw(items: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parseCart(raw: string): CartLine[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isCartLine);
  } catch {
    return [];
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.id === "string" &&
    typeof line.productId === "string" &&
    typeof line.name === "string" &&
    typeof line.unitPrice === "number" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function lineKey(
  productId: string,
  length: string | null,
  variations: { label: string; value: string }[],
) {
  const variant = variations
    .map((item) => `${item.label}:${item.value}`)
    .sort()
    .join("|");
  return `${productId}__${length ?? ""}__${variant}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products: catalogue } = useCatalog();
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  const ready = raw !== PENDING;
  const items = useMemo(() => (ready ? parseCart(raw) : []), [raw, ready]);
  const [notice, setNotice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return {
      items,
      ready,
      count,
      subtotal,
      notice,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      clearNotice: () => setNotice(null),
      addItem: (input) => {
        const product = catalogue.find((item) => item.id === input.productId);
        if (!product) return { ok: false, message: "This piece could not be found." };
        if (!Number.isInteger(input.quantity) || input.quantity < 1) {
          return { ok: false, message: "Enter a whole quantity of at least 1." };
        }
        if (product.stock <= 0) {
          return { ok: false, message: "This piece is sold out." };
        }
        if (product.lengths.length > 0) {
          const match = product.lengths.some((option) => option.label === input.length);
          if (!match) return { ok: false, message: "Choose a length before adding this piece." };
        }
        for (const group of product.variations) {
          const chosen = input.variations.find((item) => item.label === group.label);
          if (!chosen || !group.options.includes(chosen.value)) {
            return {
              ok: false,
              message: `Choose a ${group.label.toLowerCase()} before adding this piece.`,
            };
          }
        }

        const id = lineKey(product.id, input.length, input.variations);
        const existing = items.find((item) => item.id === id);
        const nextQuantity = (existing?.quantity ?? 0) + input.quantity;
        if (nextQuantity > product.stock) {
          const left = product.stock - (existing?.quantity ?? 0);
          return {
            ok: false,
            message:
              left > 0
                ? `Only ${left} more can be added. ${product.stock} are available in total.`
                : `All ${product.stock} available pieces are already in your bag.`,
          };
        }

        const nextLine: CartLine = {
          id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? "",
          unitPrice: unitPrice(product, input.length),
          length: input.length,
          variations: input.variations,
          quantity: nextQuantity,
        };
        const nextItems = existing
          ? items.map((item) => (item.id === id ? nextLine : item))
          : [...items, nextLine];
        writeRaw(nextItems);
        const message = `${product.name} was added to your bag.`;
        setNotice(message);
        setDrawerOpen(true);
        return { ok: true, message };
      },
      setQuantity: (lineId, quantity) => {
        const line = items.find((item) => item.id === lineId);
        if (!line) return { ok: false, message: "That bag item is no longer here." };
        if (!Number.isInteger(quantity) || quantity < 1) {
          return { ok: false, message: "Quantity must be a whole number of at least 1." };
        }
        const product = catalogue.find((item) => item.id === line.productId);
        if (!product || product.stock <= 0) {
          return { ok: false, message: "This piece is no longer available." };
        }
        if (quantity > product.stock) {
          return { ok: false, message: `Only ${product.stock} are available.` };
        }
        writeRaw(
          items.map((item) => (item.id === lineId ? { ...item, quantity } : item)),
        );
        return { ok: true, message: "Quantity updated." };
      },
      removeItem: (lineId) => {
        writeRaw(items.filter((item) => item.id !== lineId));
      },
      clearCart: () => {
        writeRaw([]);
        setNotice(null);
      },
    };
  }, [catalogue, drawerOpen, items, notice, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

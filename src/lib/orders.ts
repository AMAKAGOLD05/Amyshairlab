import type { StoredOrder } from "@/types/catalog";

const ORDERS_KEY = "amys-hairlab-orders";
const CHANGE_EVENT = "amys-hairlab-orders-change";
export const ORDERS_PENDING = "\u0000";

export function subscribeOrders(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

export function readOrdersRaw() {
  return localStorage.getItem(ORDERS_KEY) ?? "[]";
}

export function ordersServerSnapshot() {
  return ORDERS_PENDING;
}

export function parseOrders(raw: string): StoredOrder[] {
  if (!raw || raw === ORDERS_PENDING) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrder);
  } catch {
    return [];
  }
}

export function readOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  return parseOrders(readOrdersRaw());
}

export function saveOrder(order: StoredOrder) {
  const next = [order, ...readOrders().filter((item) => item.orderNumber !== order.orderNumber)];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(next.slice(0, 20)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function findOrder(orderNumber: string) {
  return readOrders().find((order) => order.orderNumber === orderNumber) ?? null;
}

function isOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<StoredOrder>;
  return typeof order.orderNumber === "string" && Array.isArray(order.items);
}

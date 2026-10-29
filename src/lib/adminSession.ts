const ADMIN_KEY = "amys-hairlab-admin";
const ADMIN_EVENT = "amys-hairlab-admin-change";
export const ADMIN_PENDING = "\u0000";

export function subscribeAdmin(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(ADMIN_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(ADMIN_EVENT, notify);
  };
}

export function readAdminRaw() {
  return localStorage.getItem(ADMIN_KEY) ?? "";
}

export function adminServerSnapshot() {
  return ADMIN_PENDING;
}

export function openAdminDesk() {
  localStorage.setItem(ADMIN_KEY, "open");
  window.dispatchEvent(new Event(ADMIN_EVENT));
}

export function closeAdminDesk() {
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event(ADMIN_EVENT));
}

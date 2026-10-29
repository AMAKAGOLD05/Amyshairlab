export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Nigerian mobile numbers: 080… or +23480… */
export function isNigerianPhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:\+234|0)[7-9]\d{9}$/.test(compact);
}

export function createOrderNumber() {
  const now = new Date();
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return `AH-${stamp}-${suffix}`;
}

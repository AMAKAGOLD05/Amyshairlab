import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

const COOKIE = "amys_admin";
const WEEK = 60 * 60 * 24 * 7;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const current = Buffer.from(hash, "hex");
  if (next.length !== current.length) return false;
  return timingSafeEqual(next, current);
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return value;
}

export function signSession(adminId: string) {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET is missing. Add a long random value to .env.local.");
  const body = Buffer.from(
    JSON.stringify({ sub: adminId, exp: Date.now() + WEEK * 1000 }),
  ).toString("base64url");
  const sig = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSessionToken(token: string | undefined) {
  const key = secret();
  if (!token || !key) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", key).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      sub?: string;
      exp?: number;
    };
    if (!payload.sub || !payload.exp || payload.exp < Date.now()) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export async function readSession() {
  await connection();
  const jar = await cookies();
  return readSessionToken(jar.get(COOKIE)?.value);
}

export async function writeSession(adminId: string) {
  const jar = await cookies();
  jar.set(COOKIE, signSession(adminId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

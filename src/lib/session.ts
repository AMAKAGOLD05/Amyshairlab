import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { findAdmin } from "@/lib/db";

export async function currentAdmin() {
  const session = await readSession();
  if (!session) return null;
  return (await findAdmin(session.sub)) ?? null;
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

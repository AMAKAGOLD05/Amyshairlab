import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminCount } from "@/lib/db";
import { currentAdmin } from "@/lib/session";

export const instant = false;

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  let configured = false;
  try {
    configured = (await adminCount()) > 0;
  } catch {
    configured = false;
  }
  return <LoginForm configured={configured} />;
}

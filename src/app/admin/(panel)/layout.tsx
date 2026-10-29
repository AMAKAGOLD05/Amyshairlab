import { AdminFrame } from "@/components/admin/Frame";
import { requireAdmin } from "@/lib/session";

export const instant = false;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminFrame email={admin.email}>{children}</AdminFrame>;
}

import type { Metadata } from "next";
import { CustomerDashboard } from "@/components/account/CustomerDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Amy’s Hairlab customer dashboard. Orders, saved pieces, and details stay in this browser.",
};

export default function AccountPage() {
  return <CustomerDashboard />;
}

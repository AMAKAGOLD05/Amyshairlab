import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Atelier",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

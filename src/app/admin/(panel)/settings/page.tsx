import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { PasswordForm, SettingsForm } from "@/components/admin/SettingsForms";
import { getSettings } from "@/lib/db";

export default async function SettingsPage() {
  await connection();
  const settings = await getSettings();
  return (
    <div className="space-y-16">
      <div>
        <AdminHeading title="Store settings" />
        <SettingsForm settings={settings} />
      </div>
      <div>
        <h2 className="mb-4 font-serif text-4xl">Password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}

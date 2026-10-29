import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { LibraryManager } from "@/components/admin/LibraryManager";
import { listMedia } from "@/lib/db";

export default async function LibraryPage() {
  await connection();
  const media = await listMedia();
  return (
    <div>
      <AdminHeading title="Image library" />
      <LibraryManager media={media} />
    </div>
  );
}

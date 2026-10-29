import { cacheTag } from "next/cache";
import { loadSiteBundle } from "@/lib/db";

export async function getSiteBundle() {
  "use cache";
  cacheTag("store");
  return loadSiteBundle();
}

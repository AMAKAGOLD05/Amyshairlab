import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces saved in this browser from the Amy’s Hairlab demonstration catalogue.",
};

export default function WishlistPage() {
  return (
    <div>
      <PageIntro eyebrow="Saved" title="Wishlist">
        <p>Hearts you tap are remembered on this device. They are not synced to an account.</p>
      </PageIntro>
      <WishlistView />
    </div>
  );
}

import { redirect } from "next/navigation";

/**
 * Wisp companion deferred post-launch.
 * Soft-redirect so old /wisp bookmarks do not 404 an empty pet panel.
 * Packs remain in public/assets/wisps/ for later re-enable.
 */
export default function WispPage() {
  redirect("/");
}

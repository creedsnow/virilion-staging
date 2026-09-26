import { redirect } from "next/navigation";

/**
 * Moonmarket / Shop deferred post-launch.
 * Soft-redirect so old /shop bookmarks land on Realm.
 * Dice Casting Bowl still uses moonmarket skin art; packs stay in public/assets/moonmarket/.
 */
export default function ShopPage() {
  redirect("/");
}

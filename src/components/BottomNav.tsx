"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Realm", icon: "◇" },
  { href: "/map", label: "Map", icon: "◎" },
  { href: "/dice", label: "d20", icon: "⚁", center: true },
  { href: "/scenes", label: "Scenes", icon: "◈" },
  { href: "/self", label: "Self", icon: "○" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-nav/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="Main"
    >
      <ul className="mx-auto max-w-lg grid grid-cols-5 items-end px-2 pt-1 pb-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          if ("center" in item && item.center) {
            return (
              <li key={item.href} className="flex justify-center -mt-5">
                <Link
                  href={item.href}
                  className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 shadow-lg transition ${
                    active
                      ? "border-gold bg-gold text-[#1a1408]"
                      : "border-gold/60 bg-bg-elevated text-gold-soft"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="text-[10px] font-semibold tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
                  active ? "text-gold-soft" : "text-fg-muted"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

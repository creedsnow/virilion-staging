"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Realm", icon: "◇" },
  { href: "/map", label: "Map", icon: "◎" },
  { href: "/dice", label: "d20", icon: "⚄", center: true },
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
      <ul className="mx-auto max-w-lg grid grid-cols-5 items-end px-2 pt-1.5 pb-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          if ("center" in item && item.center) {
            return (
              <li key={item.href} className="flex justify-center -mt-6">
                <Link
                  href={item.href}
                  className="nav-d20"
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  aria-label="Roll d20"
                >
                  <span className="text-xl leading-none font-semibold">{item.icon}</span>
                  <span className="text-[9px] font-semibold tracking-wider uppercase mt-0.5">
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
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-[3.25rem] min-h-[44px] justify-center text-xs transition ${
                  active ? "text-gold-soft" : "text-fg-muted hover:text-fg"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

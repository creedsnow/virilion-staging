"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UiAssetIcon } from "./UiAssetIcon";

function IconLanternFallback() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3h6M10 3v2h4V3M8 7h8l1 3v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v6"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        opacity={0.9}
      />
      <path d="M10.5 13h3" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

function IconMapFallback() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5l-6-2Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M9 4.5v13M15 6.5v13" stroke="currentColor" strokeWidth="1.55" />
    </svg>
  );
}

function IconDoorFallback() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 21V8.5A5.5 5.5 0 0 1 12.5 3h0A5.5 5.5 0 0 1 18 8.5V21"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M7 21h11" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      <path
        d="M12.5 11.2l.9 1.7 1.9.3-1.4 1.3.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3.9-1.7Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function IconSelfFallback() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.55" />
      <path
        d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconD20Fallback() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5 20.8 7.6v8.8L12 21.5 3.2 16.4V7.6L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3.2 7.6 12 11.8l8.8-4.2M12 11.8V21.5M7.4 9.6 12 2.5l4.6 7.1"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.88"
      />
      <text
        x="12"
        y="14.4"
        textAnchor="middle"
        fontSize="6.2"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui,sans-serif"
      >
        20
      </text>
    </svg>
  );
}

const ITEMS = [
  { href: "/", label: "Realm", icon: "realm", size: 22, Fallback: IconLanternFallback },
  { href: "/map", label: "Map", icon: "map", size: 22, Fallback: IconMapFallback },
  { href: "/dice", label: "d20", icon: "d20", size: 28, Fallback: IconD20Fallback, center: true },
  { href: "/scenes", label: "Scenes", icon: "scenes", size: 22, Fallback: IconDoorFallback },
  { href: "/profile", label: "Self", icon: "self", size: 22, Fallback: IconSelfFallback },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 px-3.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
      aria-label="Main"
    >
      <ul className="nav-shell pointer-events-auto mx-auto max-w-lg grid grid-cols-5 items-end px-1.5 pt-2.5 pb-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Fallback = item.Fallback;
          const iconEl = (
            <UiAssetIcon name={item.icon} size={item.size} fallback={<Fallback />} />
          );
          if ("center" in item && item.center) {
            return (
              <li key={item.href} className="flex justify-center -mt-8">
                <Link
                  href={item.href}
                  className="nav-d20"
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  aria-label="Roll d20"
                >
                  {iconEl}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-[3.35rem] min-h-[48px] justify-center transition ${
                  active ? "text-gold" : "text-fg-muted hover:text-fg"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {iconEl}
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase mt-0.5">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

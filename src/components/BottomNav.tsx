"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconLantern(_props?: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3h6M10 3v2h4V3M8 7h8l1 3v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity={0.9}
      />
      <path d="M10.5 13h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMap(_props?: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5l-6-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 4.5v13M15 6.5v13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconDoor(_props?: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 21V8.5A5.5 5.5 0 0 1 12.5 3h0A5.5 5.5 0 0 1 18 8.5V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7 21h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14.5" cy="13" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconSelf(_props?: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconD20(_props?: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.8 21 8.2v7.6L12 21.2 3 15.8V8.2L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M3 8.2 12 12l9-3.8M12 12v9.2M7.2 10.1 12 2.8l4.8 7.3" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      <text
        x="12"
        y="14.2"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        fill="currentColor"
      >
        20
      </text>
    </svg>
  );
}

const ITEMS = [
  { href: "/", label: "Realm", Icon: IconLantern },
  { href: "/map", label: "Map", Icon: IconMap },
  { href: "/dice", label: "d20", Icon: IconD20, center: true },
  { href: "/scenes", label: "Scenes", Icon: IconDoor },
  { href: "/self", label: "Self", Icon: IconSelf },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-1"
      aria-label="Main"
    >
      <ul className="nav-shell mx-auto max-w-lg grid grid-cols-5 items-end px-2 pt-2 pb-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.Icon;
          if ("center" in item && item.center) {
            return (
              <li key={item.href} className="flex justify-center -mt-7">
                <Link
                  href={item.href}
                  className="nav-d20"
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  aria-label="Roll d20"
                >
                  <Icon />
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 min-w-[3.4rem] min-h-[48px] justify-center transition ${
                  active ? "text-gold" : "text-fg-muted hover:text-fg"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon />
                <span className="text-[9px] font-semibold tracking-[0.14em] uppercase mt-0.5">
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

"use client";

import Link from "next/link";

export type MemberNavItem = {
  href: string;
  label: string;
  hint?: string;
};

export type MemberNavGroup = {
  id: string;
  label: string;
  items: MemberNavItem[];
};

/** Site Map member nav — Play · Community · World · You (Market deferred) */
export const MEMBER_NAV_GROUPS: MemberNavGroup[] = [
  {
    id: "play",
    label: "Play",
    items: [
      { href: "/scenes", label: "Scenes" },
      { href: "/events", label: "Calendar" },
      { href: "/campaigns", label: "Campaigns", hint: "Soon" },
      { href: "/dice", label: "Casting Bowl" },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      { href: "/guilds", label: "Guilds", hint: "Soon" },
      { href: "/bonds", label: "Bonds" },
      { href: "/whispers", label: "Whispers" },
      { href: "/notifs", label: "Notifications", hint: "Thin" },
    ],
  },
  {
    id: "world",
    label: "World",
    items: [
      { href: "/codex", label: "Codex" },
      { href: "/map", label: "Map" },
      { href: "/chronicle", label: "Chronicle" },
    ],
  },
  {
    id: "you",
    label: "You",
    items: [
      { href: "/profile", label: "Your character" },
      { href: "/settings", label: "Settings & safety" },
      { href: "/rules", label: "Rules" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

type Props = {
  onNavigate?: () => void;
  onLogout: () => void;
};

/** Compact overflow menu (optional fallback); SiteNav is primary. */
export function MemberNav({ onNavigate, onLogout }: Props) {
  return (
    <div
      role="menu"
      className="shell-overflow-menu card stone-panel absolute right-0 top-[calc(100%+0.35rem)] z-40 w-[min(18.5rem,calc(100vw-1.5rem))] max-h-[min(70dvh,28rem)] overflow-y-auto p-2 shadow-lg"
    >
      {MEMBER_NAV_GROUPS.map((group) => (
        <div key={group.id} className="shell-menu-group" role="group" aria-label={group.label}>
          <p className="shell-menu-group-label">{group.label}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="shell-menu-item shell-menu-item-row"
              onClick={onNavigate}
            >
              <span>{item.label}</span>
              {item.hint ? <span className="shell-menu-hint">{item.hint}</span> : null}
            </Link>
          ))}
        </div>
      ))}
      <div className="shell-menu-group shell-menu-group-last" role="group" aria-label="Session">
        <button
          type="button"
          role="menuitem"
          className="shell-menu-item w-full text-left"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

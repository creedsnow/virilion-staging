"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_NAV_GROUPS } from "./MemberNav";

type Props = {
  mode: "side" | "drawer";
  open?: boolean;
  onClose?: () => void;
  onLogout: () => void;
};

function isActive(pathname: string, href: string) {
  if (href === "/dash") return pathname === "/dash";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ mode, open = true, onClose, onLogout }: Props) {
  const pathname = usePathname();

  const body = (
    <nav
      className={mode === "side" ? "site-nav-side" : "site-nav-drawer-panel"}
      aria-label="Member"
    >
      <div className="site-nav-head">
        <Link
          href="/dash"
          className={`site-nav-home ${isActive(pathname, "/dash") ? "is-active" : ""}`}
          onClick={onClose}
        >
          <span className="site-nav-home-kicker">Home</span>
          <span className="site-nav-home-title">Dashboard</span>
        </Link>
        {mode === "drawer" ? (
          <button
            type="button"
            className="site-nav-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            ✕
          </button>
        ) : null}
      </div>

      {MEMBER_NAV_GROUPS.map((group) => (
        <div key={group.id} className="site-nav-group" role="group" aria-label={group.label}>
          <p className="site-nav-group-label">{group.label}</p>
          <ul className="site-nav-list">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`site-nav-item ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    {item.hint ? <span className="site-nav-hint">{item.hint}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="site-nav-foot">
        <button type="button" className="site-nav-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </nav>
  );

  if (mode === "side") return body;

  return (
    <div
      className={`site-nav-drawer ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="site-nav-backdrop"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      {body}
    </div>
  );
}

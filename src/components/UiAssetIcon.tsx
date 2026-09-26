"use client";

import type { ReactNode } from "react";
import { uiIcon } from "@/lib/assets";

type Props = {
  name: string;
  size?: number;
  className?: string;
  /** Rendered when no matching /assets/icons/ui file is known. */
  fallback?: ReactNode;
};

/**
 * Tints a shipped ui/*.svg via CSS mask so currentColor (active gold, muted, etc.) still works.
 * Falls back when the name is not in the first-batch map.
 */
export function UiAssetIcon({ name, size = 22, className = "", fallback = null }: Props) {
  const src = uiIcon(name);
  if (!src) return <>{fallback}</>;
  return (
    <span
      className={`ui-asset-icon ${className}`.trim()}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
      aria-hidden
    />
  );
}

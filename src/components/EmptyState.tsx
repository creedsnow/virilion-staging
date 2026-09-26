import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state card stone-panel rounded-2xl text-center py-10 px-6">
      <div className="empty-state-glow" aria-hidden />
      <p className="relative z-[1] section-kicker mb-2">Quiet for now</p>
      <h2 className="relative z-[1] font-display text-xl font-semibold text-gold-soft mb-2">
        {title}
      </h2>
      <p className="relative z-[1] text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
        {body}
      </p>
      {action ? (
        <div className="relative z-[1] mt-5 flex justify-center">{action}</div>
      ) : null}
    </div>
  );
}

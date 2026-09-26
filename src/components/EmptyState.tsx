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
    <div className="card text-center py-10 px-6">
      <h2 className="text-lg font-semibold text-fg mb-2">{title}</h2>
      <p className="text-sm text-fg-muted max-w-md mx-auto leading-relaxed">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

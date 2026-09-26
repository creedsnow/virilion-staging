export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`demo-badge ${className}`} title="Demo mode — no real auth">
      Demo
    </span>
  );
}

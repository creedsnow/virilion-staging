import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-5 py-10 text-center">
      <p className="section-kicker">404</p>
      <h1 className="font-display text-3xl font-semibold text-fg">
        This path fades into mist
      </h1>
      <p className="text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
        That address is not on the atlas. Return to the lamps, or open the Codex.
      </p>
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        <Link href="/" className="btn-gold text-sm py-2 px-4 !min-h-0">
          Landing
        </Link>
        <Link href="/dash" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Home
        </Link>
        <Link href="/codex" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Codex
        </Link>
        <Link href="/map" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Map
        </Link>
      </div>
    </div>
  );
}

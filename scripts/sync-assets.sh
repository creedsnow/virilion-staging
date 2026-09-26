#!/usr/bin/env bash
# Deploy-safe asset sync: real files under public/assets (never a symlink).
# Source of truth: /workspace/virilion-app/public/assets
#
# Usage:
#   scripts/sync-assets.sh              # first batch: icons + codex *-card-sm.webp
#   scripts/sync-assets.sh --icons-only
#   scripts/sync-assets.sh --dry-run
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${VIRILION_ASSETS_SRC:-/workspace/virilion-app/public/assets}"
DEST="$ROOT/public/assets"
DRY=0
ICONS_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --icons-only) ICONS_ONLY=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown arg: $arg" >&2
      exit 2
      ;;
  esac
done

if [[ ! -d "$SRC" ]]; then
  echo "Source missing: $SRC" >&2
  exit 1
fi

if [[ -L "$DEST" ]]; then
  echo "Removing deploy-breaking symlink: $DEST"
  if [[ $DRY -eq 0 ]]; then
    rm -f "$DEST"
  fi
elif [[ -e "$DEST" && ! -d "$DEST" ]]; then
  echo "Refusing to replace non-directory $DEST" >&2
  exit 1
fi

if [[ $DRY -eq 1 ]]; then
  echo "[dry-run] would sync icons → $DEST/icons"
  [[ $ICONS_ONLY -eq 0 ]] && echo "[dry-run] would sync codex *-card-sm.webp → $DEST/codex/"
  exit 0
fi

mkdir -p "$DEST"

if [[ -f "$SRC/README.md" ]]; then
  cp -f "$SRC/README.md" "$DEST/README.md"
fi

# icons (full tree)
rm -rf "$DEST/icons"
mkdir -p "$DEST/icons"
cp -a "$SRC/icons/." "$DEST/icons/"

if [[ $ICONS_ONLY -eq 0 ]]; then
  mkdir -p "$DEST/codex"
  # Refresh card-sm only; leave any other tracked codex files alone
  find "$DEST/codex" -maxdepth 1 -name '*-card-sm.webp' -type f -delete 2>/dev/null || true
  find "$SRC/codex" -maxdepth 1 -name '*-card-sm.webp' -type f -print0 \
    | while IFS= read -r -d '' f; do
        cp -f "$f" "$DEST/codex/"
      done
fi

echo "Synced to $DEST (real directory, not symlink)"
du -sh "$DEST"
du -sh "$DEST/icons" 2>/dev/null || true
du -sh "$DEST/codex" 2>/dev/null || true
find "$DEST" -type f | wc -l | awk '{print $1 " files"}'

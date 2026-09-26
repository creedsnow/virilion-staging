#!/usr/bin/env bash
# Deploy-safe asset sync: real files under public/assets (never a symlink).
# Source of truth: /workspace/virilion-app/public/assets
#
# Usage:
#   scripts/sync-assets.sh                 # icons + codex cards + logo + news + moonmarket + wisps
#   scripts/sync-assets.sh --icons-only
#   scripts/sync-assets.sh --moonmarket     # moonmarket UI only (also keeps prior packs)
#   scripts/sync-assets.sh --wisps          # wisps UI only
#   scripts/sync-assets.sh --dry-run
#
# Ship sizes only — never masters/raws/contact sheets/Batch B. Real files, never symlink.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${VIRILION_ASSETS_SRC:-/workspace/virilion-app/public/assets}"
DEST="$ROOT/public/assets"
DRY=0
ICONS_ONLY=0
ONLY_MOON=0
ONLY_WISP=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --icons-only) ICONS_ONLY=1 ;;
    --moonmarket) ONLY_MOON=1 ;;
    --wisps) ONLY_WISP=1 ;;
    -h|--help)
      sed -n '2,16p' "$0"
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

sync_moonmarket() {
  local src="$SRC/moonmarket"
  local dest="$DEST/moonmarket"
  if [[ ! -d "$src" ]]; then
    echo "Skip moonmarket (missing $src)"
    return 0
  fi
  echo "Sync moonmarket UI (webp + README; skip masters/contact)"
  if [[ $DRY -eq 1 ]]; then
    find "$src" -maxdepth 1 \( -name 'shop-*.webp' -o -name 'README.md' \) -type f -printf '  %f\n'
    return 0
  fi
  mkdir -p "$dest"
  find "$dest" -maxdepth 1 -name 'shop-*.webp' -type f -delete 2>/dev/null || true
  find "$src" -maxdepth 1 -name 'shop-*.webp' -type f -print0 \
    | while IFS= read -r -d '' f; do
        cp -f "$f" "$dest/"
      done
  [[ -f "$src/README.md" ]] && cp -f "$src/README.md" "$dest/README.md"
}

sync_wisps() {
  local src="$SRC/wisps"
  local dest="$DEST/wisps"
  if [[ ! -d "$src" ]]; then
    echo "Skip wisps (missing $src)"
    return 0
  fi
  echo "Sync wisps UI (webm + apng + still webp + README; skip masters/png/json/sheets)"
  if [[ $DRY -eq 1 ]]; then
    find "$src" -maxdepth 1 \( \
      -name 'wisp-*.webm' -o -name 'wisp-*.apng' -o \
      -name 'wisp-still*.webp' -o -name 'README.md' \
    \) -type f -printf '  %f\n'
    return 0
  fi
  mkdir -p "$dest"
  find "$dest" -maxdepth 1 \( \
    -name 'wisp-*.webm' -o -name 'wisp-*.apng' -o -name 'wisp-still*.webp' \
  \) -type f -delete 2>/dev/null || true
  find "$src" -maxdepth 1 \( \
    -name 'wisp-*.webm' -o -name 'wisp-*.apng' -o -name 'wisp-still*.webp' \
  \) -type f -print0 \
    | while IFS= read -r -d '' f; do
        cp -f "$f" "$dest/"
      done
  [[ -f "$src/README.md" ]] && cp -f "$src/README.md" "$dest/README.md"
}

sync_logo() {
  local src="$SRC/logo"
  local dest="$DEST/logo"
  if [[ ! -d "$src" ]]; then
    echo "Skip logo (missing $src)"
    return 0
  fi
  echo "Sync logo (Virilion-logo.png; skip extras)"
  if [[ $DRY -eq 1 ]]; then
    find "$src" -maxdepth 1 -name 'Virilion-logo.png' -type f -printf '  %f\n'
    return 0
  fi
  mkdir -p "$dest"
  if [[ -f "$src/Virilion-logo.png" ]]; then
    cp -f "$src/Virilion-logo.png" "$dest/Virilion-logo.png"
  fi
}

sync_news() {
  local src="$SRC/news"
  local dest="$DEST/news"
  if [[ ! -d "$src" ]]; then
    echo "Skip news (missing $src)"
    return 0
  fi
  echo "Sync news heroes (webp only; skip masters)"
  if [[ $DRY -eq 1 ]]; then
    find "$src" -maxdepth 1 -name '*.webp' -type f -printf '  %f\n'
    return 0
  fi
  mkdir -p "$dest"
  find "$dest" -maxdepth 1 -name '*.webp' -type f -delete 2>/dev/null || true
  find "$src" -maxdepth 1 -name '*.webp' -type f -print0 \
    | while IFS= read -r -d '' f; do
        cp -f "$f" "$dest/"
      done
}

if [[ $DRY -eq 1 ]]; then
  if [[ $ONLY_MOON -eq 1 ]]; then
    sync_moonmarket
    exit 0
  fi
  if [[ $ONLY_WISP -eq 1 ]]; then
    sync_wisps
    exit 0
  fi
  echo "[dry-run] would sync icons → $DEST/icons"
  [[ $ICONS_ONLY -eq 0 ]] && echo "[dry-run] would sync codex *-card-sm.webp + *-card.webp → $DEST/codex/"
  [[ $ICONS_ONLY -eq 0 ]] && sync_logo
  [[ $ICONS_ONLY -eq 0 ]] && sync_news
  [[ $ICONS_ONLY -eq 0 ]] && sync_moonmarket
  [[ $ICONS_ONLY -eq 0 ]] && sync_wisps
  exit 0
fi

mkdir -p "$DEST"

if [[ $ONLY_MOON -eq 1 ]]; then
  sync_moonmarket
  du -sh "$DEST/moonmarket" 2>/dev/null || true
  find "$DEST/moonmarket" -type f 2>/dev/null | wc -l | awk '{print $1 " moonmarket files"}'
  exit 0
fi

if [[ $ONLY_WISP -eq 1 ]]; then
  sync_wisps
  du -sh "$DEST/wisps" 2>/dev/null || true
  find "$DEST/wisps" -type f 2>/dev/null | wc -l | awk '{print $1 " wisps files"}'
  exit 0
fi

if [[ -f "$SRC/README.md" ]]; then
  cp -f "$SRC/README.md" "$DEST/README.md"
fi

# icons (full tree — includes app favicons)
rm -rf "$DEST/icons"
mkdir -p "$DEST/icons"
cp -a "$SRC/icons/." "$DEST/icons/"

if [[ $ICONS_ONLY -eq 0 ]]; then
  mkdir -p "$DEST/codex"
  # Refresh ship cards only (card-sm + full card); never masters/headers/desktop/mobile
  find "$DEST/codex" -maxdepth 1 \( -name '*-card-sm.webp' -o -name '*-card.webp' \) -type f -delete 2>/dev/null || true
  find "$SRC/codex" -maxdepth 1 \( -name '*-card-sm.webp' -o -name '*-card.webp' \) -type f -print0 \
    | while IFS= read -r -d '' f; do
        cp -f "$f" "$DEST/codex/"
      done

  sync_logo
  sync_news
  sync_moonmarket
  sync_wisps
fi

echo "Synced to $DEST (real directory, not symlink)"
du -sh "$DEST"
du -sh "$DEST/icons" 2>/dev/null || true
du -sh "$DEST/codex" 2>/dev/null || true
du -sh "$DEST/logo" 2>/dev/null || true
du -sh "$DEST/news" 2>/dev/null || true
du -sh "$DEST/moonmarket" 2>/dev/null || true
du -sh "$DEST/wisps" 2>/dev/null || true
find "$DEST" -type f | wc -l | awk '{print $1 " files"}'
if [[ -L "$DEST" ]]; then
  echo "ERROR: $DEST is still a symlink" >&2
  exit 1
fi

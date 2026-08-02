#!/usr/bin/env bash
set -euo pipefail

SRC_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${1:?usage: sync-pi-infra.sh <pi-infra-checkout-dir>}"
DEST="$(cd "$DEST" && pwd)"

log() { printf '[sync] %s\n' "$*"; }

# Mirror a dir (prune files removed at source). Prefer rsync (CI); cp fallback for
# local runs without rsync. Real *.env secrets are never copied nor pruned. Extra
# rsync excludes can be passed as trailing args.
mirror_dir() {
  local src="$1" dst="$2"; shift 2
  mkdir -p "$dst"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete --exclude '*.env' "$@" "$src/" "$dst/"
  else
    cp -r "$src/." "$dst/"
    find "$dst" -type f -name '*.env' ! -name '*.env.example' -delete 2>/dev/null || true
    # Honor `--exclude '<dir>/'` args by pruning them post-copy (rsync does this
    # natively). Only directory excludes are supported in the fallback.
    while [ "$#" -gt 0 ]; do
      if [ "$1" = "--exclude" ]; then
        rm -rf "$dst/${2%/}"; shift 2
      else
        shift
      fi
    done
    log "  (rsync absent: cp fallback — no stale-file pruning beyond excludes)"
  fi
}

# 1) App stack → apps/wake-lan-app/
log "app stack: infra/prod/ → apps/wake-lan-app/"
mirror_dir "$SRC_ROOT/infra/prod" "$DEST/apps/wake-lan-app"

# Wire the app into the root include (idempotent): the action manages this too,
# so a fresh pi-infra checkout needs no manual edit.
if [ -f "$DEST/docker-compose.yml" ]; then
  if ! grep -qF 'apps/wake-lan-app/compose.yml' "$DEST/docker-compose.yml"; then
    sed -i '/-[[:space:]]*core\/docker-compose.yml/a\  - apps/wake-lan-app/compose.yml' "$DEST/docker-compose.yml"
    log "added include: - apps/wake-lan-app/compose.yml to root docker-compose.yml"
  fi
else
  log "WARNING: $DEST/docker-compose.yml not found — cannot wire the include."
fi

log "done."

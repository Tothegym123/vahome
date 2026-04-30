#!/usr/bin/env bash
# VaHome RETS sync — droplet bootstrap
# Run on the DigitalOcean droplet (165.245.164.178) ONCE to set up the sync.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/Tothegym123/vahome/main/sync/setup.sh | bash
#
# Or, after `git clone`:
#   cd /root/vahome/sync && bash setup.sh

set -euo pipefail

REPO_URL="https://github.com/Tothegym123/vahome.git"
INSTALL_DIR="/root/vahome"
SYNC_DIR="$INSTALL_DIR/sync"
LOG_DIR="/var/log"
LOG_FILE="$LOG_DIR/vahome-sync.log"

echo "==> VaHome RETS sync setup"

# 1. Verify Node 20+
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node 20+ required, found $(node --version)"
  exit 1
fi
echo "Node $(node --version) OK"

# 2. Install build deps for sharp (libvips)
apt-get update -y
apt-get install -y --no-install-recommends git build-essential ca-certificates

# 3. Clone or pull repo
if [ ! -d "$INSTALL_DIR/.git" ]; then
  git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
else
  cd "$INSTALL_DIR" && git pull --ff-only
fi

# 4. Install npm deps
cd "$SYNC_DIR"
npm install --omit=dev

# 5. Ensure log file
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"
chmod 644 "$LOG_FILE"

# 6. Create .env from .env.example if missing
if [ ! -f "$SYNC_DIR/.env" ]; then
  cp "$SYNC_DIR/.env.example" "$SYNC_DIR/.env"
  chmod 600 "$SYNC_DIR/.env"
  echo ""
  echo "===================================================================="
  echo "  .env CREATED at $SYNC_DIR/.env"
  echo "  Edit it now with REIN credentials + Supabase + Vercel Blob tokens:"
  echo ""
  echo "    nano $SYNC_DIR/.env"
  echo ""
  echo "  Then run a smoke test:"
  echo "    cd $SYNC_DIR && node sync.js --test-auth"
  echo "===================================================================="
else
  echo ".env already present; not overwriting"
fi

# 7. Print cron install command (don't auto-install — user must verify .env first)
echo ""
echo "==> When ready, install the cron job with:"
echo ""
echo "    (crontab -l 2>/dev/null; echo '*/30 * * * * cd $SYNC_DIR && /usr/bin/node sync.js >> $LOG_FILE 2>&1') | crontab -"
echo ""
echo "==> Setup complete."

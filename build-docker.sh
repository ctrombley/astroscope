#!/bin/sh
set -e

# Build Docker image using a temporary context containing only astroscope + astrokit
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Create a temp dir for the build context
TMPCTX=$(mktemp -d)
trap "rm -rf $TMPCTX" EXIT

# Copy only what's needed (excluding node_modules, dist, .git)
rsync -a --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.tsbuildinfo' \
  "$PARENT_DIR/astrokit/" "$TMPCTX/astrokit/"
rsync -a --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.tsbuildinfo' \
  "$PARENT_DIR/astroscope/" "$TMPCTX/astroscope/"

docker build -t astroscope -f "$SCRIPT_DIR/Dockerfile" "$TMPCTX" "$@"

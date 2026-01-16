#!/bin/sh
set -e

MANIFEST_URL="$1"
IMAGE_URL="$2"

TMP_IMG="/tmp/sysupgrade.bin"

echo "[*] Downloading firmware..."
wget -O "$TMP_IMG" "$IMAGE_URL"

echo "[*] Syncing filesystem..."
sync

echo "[*] Starting sysupgrade..."
sysupgrade -n "$TMP_IMG"

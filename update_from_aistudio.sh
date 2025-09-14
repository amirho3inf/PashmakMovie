#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
# Replace with your Google Drive public share link
FILE_URL="https://drive.google.com/file/d/14P9VV-gU88BdJSNWZYMdM6VUi4_0bvIj/view?usp=sharing"

WORKDIR="$(pwd)"

# --- Checks ---
command -v python3 >/dev/null || { echo "python3 is required"; exit 1; }
pip3 show gdown >/dev/null 2>&1 || pip3 install --user gdown
command -v unzip >/dev/null || { echo "unzip is required (e.g., sudo apt install unzip)"; exit 1; }

# --- Download ---
TMPDIR="$(mktemp -d)"
ZIPFILE="${TMPDIR}/archive.zip"

echo "Downloading from Google Drive..."
python3 -m gdown --fuzzy "${FILE_URL}" -O "${ZIPFILE}"

# --- Extract ---
echo "Extracting into ${WORKDIR} (overwriting existing files)..."
unzip -o "${ZIPFILE}" -d "${WORKDIR}" >/dev/null

# --- Cleanup ---
rm -rf "${TMPDIR}"

echo "Done! Files extracted into: ${WORKDIR}"

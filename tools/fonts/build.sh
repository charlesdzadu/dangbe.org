#!/usr/bin/env bash
# Rebuilds the self-hosted web fonts committed under src/fonts.
#
# `next/font/google` downloads from fonts.gstatic.com during `next build`; a
# builder without egress to it fails the deployment. Self-hosting turns that
# into a file read. Each output is the UPSTREAM VARIABLE font subset to the
# union of Google Fonts' `latin` + `latin-ext` ranges (what FR/EN needs).
#
# Run from the repo root:  bash tools/fonts/build.sh
set -euo pipefail

cd "$(dirname "$0")/../.."
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

python3 -m venv "$work/venv"
"$work/venv/bin/pip" install --quiet "fonttools[woff]" brotli

ranges="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329"
ranges="$ranges,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
ranges="$ranges,U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF"
ranges="$ranges,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"

# upstream path in github.com/google/fonts | destination | optional axis pins for varLib.instancer
fonts=(
  "ofl/instrumentsans/InstrumentSans%5Bwdth,wght%5D.ttf|src/fonts/instrument-sans-latin-variable.woff2|wdth=100"
  "ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf|src/fonts/jetbrains-mono-latin-variable.woff2|"
)

for entry in "${fonts[@]}"; do
  IFS='|' read -r upstream dest pins <<<"$entry"
  src="$work/$(basename "$dest" .woff2).ttf"
  curl -fsSL -o "$src" "https://raw.githubusercontent.com/google/fonts/main/$upstream"
  if [ -n "$pins" ]; then
    # Pin the width axis so the shipped file carries one axis (weight) only.
    "$work/venv/bin/fonttools" varLib.instancer -q "$src" $pins -o "$src.pinned.ttf"
    src="$src.pinned.ttf"
  fi
  "$work/venv/bin/pyftsubset" "$src" \
    --unicodes="$ranges" \
    --layout-features='*' \
    --flavor=woff2 \
    --output-file="$dest"
  echo "$dest  ($(wc -c <"$dest" | tr -d ' ') bytes)"
done

# The Open Graph images (next/og, Satori) cannot read woff2: one static TTF
# instance of the display face, bold, latin only, for that renderer alone.
og_src="$work/instrument-sans-og.ttf"
curl -fsSL -o "$og_src" "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentsans/InstrumentSans%5Bwdth,wght%5D.ttf"
"$work/venv/bin/fonttools" varLib.instancer -q "$og_src" wdth=100 wght=700 -o "$og_src.bold.ttf"
"$work/venv/bin/pyftsubset" "$og_src.bold.ttf" --unicodes="$ranges" --layout-features='*' --output-file="src/fonts/instrument-sans-bold-og.ttf"
"$work/venv/bin/fonttools" varLib.instancer -q "$og_src" wdth=100 wght=400 -o "$og_src.regular.ttf"
"$work/venv/bin/pyftsubset" "$og_src.regular.ttf" --unicodes="$ranges" --layout-features='*' --output-file="src/fonts/instrument-sans-regular-og.ttf"
echo "src/fonts/instrument-sans-{bold,regular}-og.ttf"

#!/usr/bin/env bash
# Rebuilds public/vendor/liblouis/ (liblouis compiled to WebAssembly with the
# English UEB tables embedded) from the official liblouis release.
#
# liblouis is LGPL-2.1-or-later; this script, the unmodified source tarball
# and COPYING.LESSER let anyone rebuild or relink the library.
#
# Requires Emscripten (`brew install emscripten`). Usage:
#   scripts/build-liblouis.sh [version]
set -euo pipefail

VERSION="${1:-3.39.0}"
SHA256_3_39_0="629fa8cb0dfd9ad457c5bf47a42f0953b673e62c8ad6b1d03ddc4e2bd20008f1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/vendor/liblouis"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cd "$WORK"
curl -sSL -o "liblouis-$VERSION.tar.gz" \
  "https://github.com/liblouis/liblouis/releases/download/v$VERSION/liblouis-$VERSION.tar.gz"
if [ "$VERSION" = "3.39.0" ]; then
  echo "$SHA256_3_39_0  liblouis-$VERSION.tar.gz" | shasum -a 256 -c -
fi
tar xzf "liblouis-$VERSION.tar.gz"
cd "liblouis-$VERSION"

emconfigure ./configure --host=wasm32-unknown-emscripten \
  --build="$(./build-aux/config.guess)" \
  --disable-shared --enable-static --without-yaml >/dev/null
emmake make -C gnulib >/dev/null
emmake make -C liblouis >/dev/null

# Only the tables needed for English UEB Grade 1/2 and Unicode braille output.
mkdir -p ../tables
for t in unicode.dis en-ueb-g1.ctb en-ueb-g2.ctb en-ueb-chardefs.uti \
  en-ueb-math.ctb braille-patterns.cti latinLetterDef6Dots.uti \
  latinUppercaseComp6.uti spaces.uti text_nabcc.dis; do
  cp "tables/$t" ../tables/
done

# liblouis keeps several 4 KB string buffers on the stack while compiling
# tables; Emscripten's 64 KB default stack overflows into static data.
mkdir -p "$OUT"
emcc liblouis/.libs/liblouis.a gnulib/.libs/libgnu.a -O3 \
  -sSTACK_SIZE=2MB -sMODULARIZE=1 -sEXPORT_ES6=1 \
  -sENVIRONMENT=web,worker,node -sALLOW_MEMORY_GROWTH=1 -sFILESYSTEM=1 \
  -sEXPORTED_FUNCTIONS=_lou_translateString,_lou_backTranslateString,_lou_version,_lou_free,_malloc,_free \
  -sEXPORTED_RUNTIME_METHODS=UTF8ToString,HEAPU8,HEAPU16,HEAP32 \
  --embed-file ../tables@/tables \
  -o "$OUT/liblouis.mjs"
cp COPYING.LESSER "$OUT/"
echo "Built liblouis $VERSION into $OUT"

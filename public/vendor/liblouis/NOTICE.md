# liblouis (WebAssembly build)

`liblouis.mjs` and `liblouis.wasm` are liblouis 3.39.0
(https://liblouis.io, source: https://github.com/liblouis/liblouis/releases/tag/v3.39.0)
compiled to WebAssembly with Emscripten, with the English UEB Grade 1/2 tables
and the Unicode braille display table embedded. The library is unmodified.

liblouis is free software licensed under the GNU Lesser General Public License,
version 2.1 or later — see `COPYING.LESSER`. You can rebuild or relink it with
`scripts/build-liblouis.sh` in the Emojar repository.

Emojar loads it only on the Braille Translator page when Grade 2 is selected.

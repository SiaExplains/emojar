# LibRaw (WebAssembly build)

The files in this folder come unmodified from the npm package
[libraw-wasm](https://github.com/ybouane/LibRaw-Wasm) 1.6.0 (ISC licence,
© ybouane and contributors). They contain:

- **LibRaw 0.22.1** (https://www.libraw.org, source:
  https://github.com/LibRaw/LibRaw/tree/0.22.1), © LibRaw LLC, used under the
  GNU Lesser General Public License version 2.1 — see `COPYING.LESSER`. LibRaw
  is also available under the CDDL 1.0.
- **Little CMS 2.19.1** (https://www.littlecms.com), © Marti Maria Saguer,
  MIT licence.

The WebAssembly module is served as a separate file and can be replaced with
your own build of LibRaw: rebuild libraw-wasm from its source repository and
run `npm run vendor:libraw` in the Emojar repository.

Emojar loads these files only on the ARW Converter pages, and only after you
choose a file. Your photos are decoded on your device and never uploaded.

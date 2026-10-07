# Changelog

All notable changes to Emojar are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [0.2.1] — 2026-10-07

### Changed

- The About, Terms of Service and Privacy pages now describe Emojar as an
  online-tools platform and state that files and text used with the tools are
  processed in the browser and never uploaded.
- Rewrote the README (setup, scripts, project structure, how to add a tool) and
  updated the feature reference and backlog documents.

## [0.2.0] — 2026-10-07

### Added

- **Online Tools** at `/online-tool`: 110+ free tools in nine categories —
  image, PDF, developer, text, color, calculators, unit converters, security &
  generators, and date & time. Every tool runs in the browser; files and text
  are never uploaded.
- An Image Converter with dedicated pages for popular conversions such as
  JPG to PNG, PNG to WebP and PDF to JPG.
- A new `/emoji` page that keeps the full emoji search, categories and
  collections in one place.
- `llms.txt`, plus structured data (WebApplication, FAQ, HowTo, breadcrumbs and
  item lists) on every tool and category page.

### Changed

- The homepage now leads with the online tools; emoji search, games and emoji
  tools are still one click away.
- The main menu is now “Online Tools” and “Emoji”.
- Site title, description and search box schema describe the tools platform.
- New Emojar logo in the header and a new favicon / app icon set (browser,
  Apple touch, Android and Windows tile icons).

### Fixed

- The web app manifest (`/manifest.webmanifest`) returned an error because two
  files claimed the same address; it now loads and lists the new icons.

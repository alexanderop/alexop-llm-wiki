---
name: wiki-validate
description: Validate authored wiki notes and links after capture or before requested publication.
---

# Validate wiki changes

Compare changed notes with source evidence. Check exact quotes, evidence locations, stated limitations and explained connections. These editorial checks are not proved by a successful compiler.

Run `pnpm content` from the repository root to validate metadata, duplicate IDs and unresolved links in the single collection. It does not change authored Markdown. Use the source inspector again to check for duplicate sources with different note IDs.

Inspect `git diff` and log actual changes once in `docs/wiki-log.md`. Keep raw evidence in ignored `raw/`.

For application or workflow changes, run `pnpm verify` and `pnpm test:compat` as required by AGENTS.md. Notes-only captures require content checks and evidence review. Commit, push or deploy only when requested.

Finish with saved paths/IDs, source coverage, meaningful connections, checks actually run and unresolved gaps. A missing transcript is an honest pending capture, not a verified summary.

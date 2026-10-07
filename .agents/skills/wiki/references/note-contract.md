# Authored note contract

The authoritative fields and allowed relation kinds live in [shared/wiki.ts](../../../../apps/wiki/shared/wiki.ts); the supported components and Markdown checks live in [compile-wiki.ts](../../../../apps/wiki/scripts/compile-wiki.ts). Read them before adding metadata or components. Do not introduce fields that the compiler silently strips.

A new real source uses this shape (replace the example values):

```yaml
---
noteId: example-source
title: Example source
description: A concise supported claim, or an explicit pending-capture description.
kind: source
resourceType: youtube
sourceUrl: https://www.youtube.com/watch?v=VIDEO_ID
author: Known creator
updated: 2026-10-04
tags: []
demo: false
relations: []
---
```

Use the current date for a real change. Omit unknown author/sourceUrl fields. Keep filenames equal to stable note IDs; do not rename an existing note from a changed source title. `resourceType` applies only to source notes. Use `repository` for code repositories, recording the inspected revision and paths in the body. Use `social` for social posts and threads, keeping platform and handle in the source account. Use `podcast` for an episode even if its URL is YouTube, and `other` for unsupported/uncertain media. Concepts and insights have their own `kind` and cite supporting source notes.

In the body record:

- **Evidence and coverage:** what was inspected, its source URL and locations, and whether coverage is complete, partial or metadata-only.
- **Source account:** supported claims and reasoning. For metadata-only capture, say analysis is pending and omit takeaways.
- **Interpretation:** clearly attributed user observations or agent synthesis, if useful.
- **Connections:** explained links to existing notes, when justified.
- **Limitations:** unavailable transcript, excerpts only, unclear attribution or conflicting evidence.

These are content requirements, not mandatory identical headings for every medium. Store acquisition details in ignored raw provenance. Notes must not contain local raw file paths. Use `[Topic](/notes/stable-id)` links. Preserve useful Comark components already supported by the renderer; do not invent new tags during ingestion.

### Author identity

Keep `author` when attribution is known. Source notes link this name to a derived
resource overview. Reuse `authorId` (a lowercase hyphenated ID) across an author's
sources when supplied; this keeps links stable across display-name changes and
separates namesakes. Optional `authorUrl` must be an evidenced HTTP(S) profile or
website. Keep name and website consistent for an ID; never invent attribution.
Authors and counts are derived from the collection.

For multiple contributors use `contributors: [{ id, name, roles, url }]` instead
of legacy author fields. Valid roles are `author`, `host`, `guest`, `editor`,
`translator`, `director`, `speaker`, `organization`. A role applies to the source,
not globally to the person. Reuse stable IDs, separate namesakes, and combine
multiple roles in one entry. Only credit roles supported by the inspected source.

Reusable bios, portraits, websites, social links and evidence belong in separate author profiles. Follow [author discovery and profiles](author-profiles.md); source metadata retains only identity and source-specific roles.

### Diagrams

Use a fenced `mermaid` block when it clarifies a supported process, decision,
sequence or relationship. Do not add diagrams to meet a quota or repeat a simple
list. Keep labels concise and include `accTitle` and `accDescr` for an accessible
text explanation. Explain the diagram in nearby prose and identify synthesis as
interpretation; arrows must not invent causality or source agreement.

The wiki supplies its paper/ink/terracotta theme automatically, including dark
mode. Use standard Mermaid syntax without frontmatter, initialization directives,
`style`, `classDef`, `linkStyle` or `click` commands. Never hardcode colors or embed
HTML. Prefer small flowcharts and sequence diagrams; split crowded diagrams into
separate explanations. Check the rendered result in both themes and at a narrow
viewport. Diagram source remains available if rendering fails or JavaScript is off.

# Discover and enrich source contributors

Apply during source capture when identity or profile information is missing. Start with the source byline, description, credits or publisher page. Distinguish authors, hosts, guests, speakers and organizations; mentioning a person is not authorship. A concept or synthesis does not acquire the authorship of the sources it cites.

Search existing source contributors and `content/public/authors` and `content/private/authors` before creating a profile. Reuse stable contributor IDs. Confirm namesakes using the source and linked official sites; never infer a social handle from a name alone. When identity remains unclear, keep supported source metadata and report the gap rather than inventing a person.

Prefer the person's website and linked professional profiles. Inspect them to write a short factual English bio and collect useful website/social links. Omit unknown details. Avoid asserting current employment from an old biography; record sources and the review date. Reuse a verified profile when no new evidence changes it instead of rewriting it on every capture.

Profiles are Markdown frontmatter at `apps/wiki/content/<audience>/authors/<id>.md`. Follow the validated `authorProfileSchema` in `apps/wiki/shared/wiki.ts`. They enrich the derived author catalog; do not maintain resource lists by hand. Match the source contributor's ID and display name. The body is not rendered; put the short biography in `bio`.

```yaml
---
id: example-author
name: Example Author
bio: A brief biography supported by the inspected sources.
url: https://example.com/
links:
  - label: GitHub
    url: https://github.com/example
sources:
  - label: Official biography
    url: https://example.com/about
updated: 2026-10-05
---
```

Try to obtain a recognizable portrait from an official website or confirmed professional profile. Save a small PNG, JPEG or WebP beside the profile, then set `avatar: example-author.png` and `avatarSource` to the original image URL. The filename must contain lowercase letters, numbers and hyphens, with a png/jpg/webp extension; keep files under 100 KB. Preserve provenance and any licensing/credit requirements. Do not generate a likeness or substitute an unrelated image. If retrieval or reuse is unsuitable, omit the portrait; the app shows initials. The compiler embeds only portraits of contributors in the selected audience, so they remain available offline without exposing private image files.

New capture remains private unless publication was requested. Reuse an existing public profile during private capture without editing it just to add private discoveries. Do not create duplicate private/public profile IDs; keep proposed private updates in raw provenance until publication is authorized. Public source notes must never gain private profile details. When making a source public, review its profiles and portraits as part of the same boundary check.

Run personal and public content compilation. Verify one profile per identity, source-specific contributor roles, evidence links, and visible fallbacks for missing information. Public UI delivery also needs the repository's build and browser checks. Log public profile changes in `docs/wiki-log.md`, private research only in `raw/wiki-log.md`. Report unknown identities or unavailable portraits without blocking an otherwise useful capture.

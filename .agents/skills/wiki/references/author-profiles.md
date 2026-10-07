# Discover and enrich source contributors

Apply during every source capture and when asked to create or enrich author profiles or fill missing avatars. Check each source contributor for a matching profile; create one when missing and identity is supported, or fill missing information in the existing profile. For a collection-wide request, include contributors whose source metadata exists but whose profile file does not. Start with the source byline, description, credits or publisher page. Distinguish authors, hosts, guests, speakers and organizations; mentioning a person is not authorship. A concept or synthesis does not acquire the authorship of the sources it cites.

Search existing source contributors and `content/public/authors` before creating a profile. Reuse stable contributor IDs. Confirm namesakes using the source and linked official sites; never infer a social handle from a name alone. When identity remains unclear, keep supported source metadata and report the gap rather than inventing a person.

Prefer the person's website and linked professional profiles. Inspect them to write a short factual English bio and collect useful website/social links. Omit unknown details. Avoid asserting current employment from an old biography; record sources and the review date. Reuse a verified profile when no new evidence changes it instead of rewriting it on every capture.

Profiles are Markdown frontmatter at `apps/wiki/content/public/authors/<id>.md`. Follow the validated `authorProfileSchema` in `apps/wiki/shared/wiki.ts`. They enrich the derived author catalog; do not maintain resource lists by hand. Match the source contributor's ID and display name. The body is not rendered; put the short biography in `bio`.

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

## Retrieve missing avatars

Try to obtain an avatar for every new profile and every existing profile missing one. Prefer the contributor's confirmed X profile, then another confirmed social or professional profile such as GitHub, then their official website. Use a recognizable portrait for a person or the official logo/avatar for an organization. Keep an existing valid image unless the user asks to refresh or replace it.

If direct X access fails, public profile metadata from a service such as `https://api.fxtwitter.com/<handle>` can provide an image URL. Treat this as third-party evidence: confirm the identity against the source, known handle and linked official website, record the retrieval service in `sources`, and retain its response and retrieval date in ignored `raw/`. Download the image from the original image host and record that URL in `avatarSource`. A mirror response does not establish that the X page was directly inspected. If this route fails or identity remains uncertain, try another confirmed profile rather than guessing an image URL or repeatedly retrying.

Save a small PNG, JPEG or WebP beside the profile, then set `avatar: example-author.png` and `avatarSource` to the original image URL. The filename must contain lowercase letters, numbers and hyphens, with a png/jpg/webp extension; keep files under 100 KB. Inspect the downloaded image and verify its format and size before saving the reference. Preserve provenance and any licensing/credit requirements. Do not generate a likeness or substitute an unrelated image. If retrieval or reuse is unsuitable, omit the portrait and report the gap; the app shows initials. The compiler embeds portraits of referenced contributors so they remain available offline.

Run `pnpm content`. Verify one profile per identity, source-specific contributor roles, evidence links, and visible fallbacks for missing information. Public UI delivery also needs the repository's build and browser checks. Log profile changes in `docs/wiki-log.md`; keep acquisition records in `raw/`. Report unknown identities or unavailable portraits without blocking an otherwise useful capture.

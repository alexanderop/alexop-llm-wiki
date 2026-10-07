---
noteId: claude-plugins-community
title: Claude Plugins Community
description: Anthropic's community plugin catalog offers a starting point for finding Claude workflows and tracing them to their source repositories.
kind: source
resourceType: repository
sourceUrl: https://github.com/anthropics/claude-plugins-community
contributors:
  - id: anthropic
    name: Anthropic
    roles: [organization]
    url: https://anthropic.com
updated: 2026-10-07
tags: [agents, skills, plugins, developer-workflows]
demo: false
relations: []
---

This repository is a place to find community plugins for Claude Code and Cowork. The useful entry point is the catalog: it connects plugin descriptions to the repositories that supply them. It isn't the implementation of every plugin it lists.

## What to look at

The [README](https://github.com/anthropics/claude-plugins-community/blob/f60f0454df3045f724c43c6346ec80bdcc3472b2/README.md) describes the repository as a read-only mirror. Anthropic says it syncs nightly from an internal review pipeline, and that listed plugins have passed automated security scanning and distribution approval. Those are publisher claims, not checks performed for this note. Submissions go through the linked submission form rather than pull requests to this mirror.

The [.claude-plugin/marketplace.json catalog](https://github.com/anthropics/claude-plugins-community/blob/f60f0454df3045f724c43c6346ec80bdcc3472b2/.claude-plugin/marketplace.json) names the marketplace `claude-community`. At the inspected revision it contains 2,284 plugin entries. Sampled entries include descriptions, homepages and source locations; some point at a Git repository and commit, while others select a subdirectory. These fields give you a concrete place to continue reading before deciding whether a plugin fits your work.

For example, the `10x-team` entry points to a plugin whose [README at the catalog's pinned revision](https://github.com/Jaan-Mustafa/10x-Team/blob/ea01f8262495e99a66ca292739b0517314e6914e/README.md) describes role-specific skills and shared project files under `.10x/`. That is one example of a packaged workflow. Its claims about team coverage or effectiveness haven't been tested here.

## Connection to existing knowledge

Agent interpretation: this catalog complements [learning agent workflows from past chats](/notes/learning-agent-workflows-from-chats). That note starts with repeated friction in your own work; a catalog gives you existing approaches to inspect once you know what problem you're trying to solve. A listed plugin is a candidate to study, not evidence that its process fits your project.

The [Poteto interview](/notes/poteto-pstack-agent-workflows) discusses turning repeatable processes into tools and skills. A marketplace shows how such processes can be packaged for distribution. This is a connection between ideas, not a claim that the interview endorses this catalog or any plugin in it.

## Evidence and limits

Reviewed on 2026-10-07 at repository commit `f60f0454df3045f724c43c6346ec80bdcc3472b2`. Coverage includes the complete short repository README, parsed catalog structure and entry count, sampled catalog descriptions, and the opening sections of the linked 10x-Team README through its project-state layout. The GitHub organization profile identifies the catalog owner as Anthropic and links its website.

The catalog was downloaded in full but its 2,284 entries were not individually reviewed. No plugins were installed or run, and their source implementations were not audited. The count and descriptions belong to this snapshot and can change. The catalog is useful for discovery; it doesn't establish compatibility, safety or usefulness for a particular project.

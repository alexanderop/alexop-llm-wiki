---
noteId: poteto-pstack-agent-workflows
title: "Poteto on scaling agent work through verification and better environments"
description: Lauren Tan and Matt Pocock discuss verification, deterministic tooling, coordination, and extracting reusable workflows from agent chats.
kind: source
resourceType: podcast
sourceUrl: https://www.youtube.com/watch?v=MN9dGgmLyso
contributors:
  - id: matt-pocock
    name: Matt Pocock
    roles: [host]
  - id: lauren-tan
    name: Lauren Tan (Poteto)
    roles: [guest]
updated: 2026-10-05
tags: [agents, verification, skills, developer-workflows]
demo: false
relations: []
---

## Source and coverage

[Interview on YouTube](https://www.youtube.com/watch?v=MN9dGgmLyso), published on Matt Pocock's channel on 2026-10-03. Original title: “LIVE: Poteto (creator of pstack) on shipping 1,000's of PR's a month at SpaceX.” The metadata identifies Lauren Tan as the guest. This is a podcast-style interview hosted on YouTube.

The complete available English automatic-caption track was inspected, from 00:00:00 through 01:05:34; the listed video duration is 01:05:36. This account is based on captions and metadata, not independent viewing or verification of the systems described.

The supplied [bookmark at 01:00:53](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3653s) falls within the discussion of mining previous agent conversations for reusable process improvements.

## Main argument

Tan argues that scaling agent-assisted development depends on improving the environment in which agents work: give them ways to observe results, automate mechanical steps, constrain recurring mistakes, and obtain relevant context. Greater autonomy follows investment in these capabilities; adding more agents alone does not establish quality. Her kitchen analogy keeps human responsibility for the final product visible even when agents perform much of the execution.

## The discussion in sequence

- **00:01:58–00:06:20 — From micromanagement to tools.** Tan describes becoming the bottleneck between an agent and performance-debugging evidence. Her early skill work sought to transfer her own workflow to agents and make the correct action easier to take.
- **00:06:51–00:10:23 — Expertise and precise language.** She argues that domain expertise remains valuable because people need to articulate intent. Both speakers discuss how concise terms can carry substantial meaning, including directing agents away from tests that merely repeat their implementation.
- **00:11:20–00:15:10 — The kitchen metaphor.** The engineer increasingly organizes tools, preparation, roles, and quality expectations. Delegating execution does not remove responsibility for the result.
- **00:16:14–00:19:22 — Verification closes the loop.** An agent should run the application, interact with it, and collect debugging evidence. Tan describes using measurable performance feedback to support repeated improvements. See [Agent verification loops](/notes/agent-verification-loops) for the reusable mechanism behind this account.
- **00:19:39–00:24:50 — Put deterministic work into tools.** Tan describes moving repeatable browser and debugging operations into a CLI so each agent does not rebuild and discard its own tooling. Scripts and code transformations handle mechanical work; the agent supplies judgment where it is actually needed.
- **00:25:00–00:32:57 — Improve the codebase around observed failures.** The speakers discuss type constraints, lint rules, feature directories, and conventions as ways to narrow the space of possible mistakes. Tan's internal framework is an example from her workplace, not a publicly inspected implementation. Repeated failures should prompt changes to the environment rather than endless reminders to individual agents.
- **00:33:34–00:45:26 — Connect context gathering to execution.** Tan distinguishes an outer loop that gathers reports and context from an inner loop that implements changes. Coordinators group related work and delegate execution. Viewing several related reports together can reveal a shared cause and avoid duplicate fixes.
- **00:45:51–00:49:02 — Maintenance and buffering.** She clarifies that thousands of PRs do not mean thousands of features: much of the work is maintenance. One routine collects problematic patterns in a document before fixing them, providing a buffer in which recurring causes become visible.
- **00:49:34–00:55:42 — Sampling, verification, and autonomous merging.** Tan describes sampling code quality, correcting systemic failures, and allowing agents to merge after verification, with subsequent human inspection. She emphasizes that establishing this environment takes effort and that multiple verifier agents consume substantial tokens. These are reports of her practice, not evidence that any repository can safely use the same merge policy.
- **00:55:44–00:59:26 — Limits of verifiability.** Pocock raises irreversible changes and sensitive domains. Tan acknowledges that hard-to-verify work makes this approach difficult and that she does not have a complete answer. Their discussion of proof-oriented languages is exploratory, not a verified comparison of language capabilities.
- **00:59:49–01:05:06 — Skills as personal workflows.** Both speakers treat skills as processes expressed in language that can be adapted and combined. Tan recommends studying past conversations for repeated interventions, then encoding the underlying process in a skill or lint rule. Her recollection workflow grew from repeatedly needing earlier context while investigating related bugs.

## The bookmarked idea: learn from actual interventions

At **01:00:35–01:01:00**, Tan discusses examining previous prompts and moments where a person repeatedly corrected an agent. At **01:02:23–01:03:45**, she develops this into a method for finding recurring patterns and recovering useful context from earlier work. At **01:03:45–01:04:42**, she presents skills as adaptable workflow descriptions and predicts that they may become more compact as models improve.

[Learning agent workflows from past chats](/notes/learning-agent-workflows-from-chats) captures this idea as an independent topic. The connection is direct: the note explains how the interview's transcript-mining advice can turn observed friction into a reusable process, without assuming every intervention should become a permanent rule.

## Interpretation and limitations

My synthesis: the durable lesson is to examine where human intervention repeatedly becomes necessary, then decide whether the missing piece is evidence, context, a deterministic tool, an enforceable constraint, or a workflow. This combines several parts of the conversation; it is not a quoted framework supplied by the speakers.

Automatic captions contain obvious recognition errors, especially in product and skill names. No exact code or visual demonstrations were extracted. The title's PR volume and Tan's reported throughput, quality, organizational practices, and autonomy are not independently audited. PR count does not by itself establish delivered value or defect rates. Verification can increase confidence but does not make an irreversible action reversible; that remains an unresolved limitation of the discussion.

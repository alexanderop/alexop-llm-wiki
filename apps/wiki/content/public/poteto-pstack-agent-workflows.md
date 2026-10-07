---
noteId: poteto-pstack-agent-workflows
title: "Poteto on scaling agent work through verification and better environments"
description: Lauren Tan explains how verification, repeatable tools, and lessons from past chats help agents work with less hand-holding.
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
updated: 2026-10-07
tags: [agents, verification, skills, developer-workflows]
demo: false
relations: []
---

Lauren Tan describes a familiar problem with coding agents: they can do the work, but you still end up passing context and debugging results back to them. In her interview with Matt Pocock, she explains how she tried to remove those bottlenecks.

Her approach is to improve the environment around the agent. Give it a way to see what happened. Put repeatable work into tools. Use rules to catch recurring mistakes and make useful context easier to find. Adding more agents alone doesn't establish that the work is good.

## What they discuss

- **00:01:58–00:06:20 — Stop being the messenger.** Tan describes becoming the bottleneck between an agent and the evidence it needed to debug performance. Her early skills aimed to pass on her workflow and make the right action easier to take.
- **00:06:51–00:10:23 — Expertise still helps.** You need enough knowledge to explain what you want. Both speakers discuss how precise terms can communicate a lot, including how to steer agents away from tests that just repeat the implementation.
- **00:11:20–00:15:10 — Organize the kitchen.** Tan compares the engineer's role to organizing tools, preparation, roles, and quality expectations in a kitchen. Agents may do much of the work, but the engineer still owns the result.
- **00:16:14–00:19:22 — Let the agent check the result.** Tan describes agents running the app, interacting with it, and collecting debugging evidence. Performance measurements give them feedback for another attempt. [Agent verification loops](/notes/agent-verification-loops) develops that idea into a separate concept.
- **00:19:39–00:24:50 — Keep repeatable work in tools.** Tan moved recurring browser and debugging operations into a CLI. That saved agents from rebuilding and throwing away their own tools. Scripts and code transformations handle the mechanical work; the agent makes decisions where judgment is needed.
- **00:25:00–00:32:57 — Learn from recurring mistakes.** The speakers discuss types, lint rules, feature directories, and conventions as ways to limit mistakes. Tan describes an internal framework from her workplace, but its implementation wasn't inspected for this note. The idea is to change the environment when a problem keeps coming back.
- **00:33:34–00:45:26 — Gather context before handing out work.** Tan separates an outer loop that gathers reports and context from an inner loop that implements changes. Coordinators group related work and delegate it. Looking at related reports together can reveal one shared cause and avoid fixing the same problem several times.
- **00:45:51–00:49:02 — Give patterns time to appear.** Thousands of PRs don't mean thousands of features; Tan says much of the work is maintenance. She describes collecting problematic patterns in a document before fixing them. That buffer helps recurring causes become visible.
- **00:49:34–00:55:42 — Verification takes work too.** Tan describes sampling code quality, addressing recurring failures, and letting agents merge after verification, followed by human inspection. Setting up that environment takes effort, and multiple verifier agents use substantial tokens. This is her account of her workplace, not evidence that any repo can use the same merge policy.
- **00:55:44–00:59:26 — Some work is hard to verify.** Pocock asks about irreversible changes and sensitive domains. Tan acknowledges the difficulty and doesn't offer a complete answer. Their discussion of proof-oriented languages is exploratory, not a checked comparison of what those languages can do.
- **00:59:49–01:05:06 — Learn workflows from past chats.** Both speakers describe skills as processes written in language that can be adapted and combined. Tan suggests looking for repeated human corrections and turning the underlying lesson into a skill or lint rule. Her way of recalling earlier chats grew from needing old context while investigating related bugs.

## The bookmarked idea

The supplied [bookmark at 01:00:53](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3653s) points to the discussion about learning from previous agent conversations.

At **01:00:35–01:01:00**, Tan talks about looking at prompts and repeated corrections. At **01:02:23–01:03:45**, she explains how those chats can reveal patterns and recover context. At **01:03:45–01:04:42**, she describes skills as adaptable workflows and predicts they may become shorter as models improve.

[Learning agent workflows from past chats](/notes/learning-agent-workflows-from-chats) turns this into a practical approach. The point is to find what keeps slowing the work down and decide what would help. A correction doesn't automatically deserve a permanent rule.

## A way to apply this

As a synthesis of the discussion, look at where a human repeatedly has to step in. Is the agent missing evidence, context, a repeatable tool, a rule it can check, or a workflow to follow?

That question is an interpretation that brings several parts of the interview together, rather than a framework quoted from the speakers.

## Source and limits

The [interview on YouTube](https://www.youtube.com/watch?v=MN9dGgmLyso) was published on Matt Pocock's channel on 2026-10-03. Its original title is “LIVE: Poteto (creator of pstack) on shipping 1,000's of PR's a month at SpaceX.” The metadata identifies Lauren Tan as the guest. It's a podcast-style interview hosted on YouTube.

The original capture inspected the complete available English automatic-caption track, from 00:00:00 through 01:05:34. The listed video duration is 01:05:36. This note is based on those captions and metadata; it doesn't claim independent viewing or verification of the systems described.

The captions contain recognition errors, especially in product and skill names. No exact code or visual demonstrations were extracted. The title's PR volume and Tan's claims about throughput, quality, workplace practices, and autonomy haven't been independently audited. PR count alone doesn't tell you how much value was delivered or how many defects remained.

Verification can give you more confidence. It still can't make an irreversible action reversible, and that question remains open in the discussion.

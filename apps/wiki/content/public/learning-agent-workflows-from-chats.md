---
noteId: learning-agent-workflows-from-chats
title: Learning agent workflows from past chats
description: Use repeated interventions in real agent conversations to identify reusable skills, deterministic tools, and enforceable rules.
kind: concept
updated: 2026-10-05
tags: [agents, skills, developer-workflows]
demo: false
relations: []
---

Past agent conversations record how work actually unfolded: what context was missing, where a person intervened, and which instructions had to be repeated. That makes them evidence for improving a workflow rather than merely a history of completed tasks.

The direct source is [Lauren Tan's interview with Matt Pocock](/notes/poteto-pstack-agent-workflows), particularly 01:00:35–01:04:42. The supplied bookmark at 01:00:53 points into this discussion. Tan recommends extracting recurring corrections into skills or lint rules and describes using earlier chats to recover context for related debugging work.

## A practical interpretation

The following is a suggested application of the source, not a verbatim procedure:

1. Find several interventions concerning the same problem and inspect the surrounding context.
2. Identify what was missing: information, a repeatable operation, a checkable constraint, or judgment about the next step.
3. Choose a suitable mechanism. Supply missing context; script mechanical work; enforce a structural constraint with a check; describe a judgment-dependent workflow in a skill.
4. Try the change on later work and check whether the original problem recurs.
5. Keep exceptions explicit and revise rules that do not generalize.

The distinction between scripts and judgment comes from the interview's earlier 00:19:39–00:24:50 discussion. Connecting it to transcript mining helps avoid turning every repeated command into more prose instructions.

## Limits

One correction may be local to a task. A historical workaround may be stale. The interview does not provide controlled evidence that transcript-derived skills improve outcomes across projects; this is a practitioner method to evaluate in context.

If conversations repeatedly show a human acting as the only observer of application behavior, the missing capability may be an [agent verification loop](/notes/agent-verification-loops). In that case, improving access to evidence can address the underlying dependency more directly than adding reminders to verify.

---
noteId: goal-oriented-prompting
title: Goal-oriented prompting
description: Frame an agent task around an intended outcome, an effort budget, and observable checks while preserving necessary constraints.
kind: concept
updated: 2026-10-07
tags: [prompting, agents, verification, effort]
demo: false
relations: []
---

Goal-oriented prompting describes what a successful result should accomplish and lets the agent choose suitable steps within stated constraints. This note synthesizes two screenshot-backed Boris Cherny posts; it is a practical interpretation, not an experimentally established rule for every model or task.

## A delegation brief

[Cherny's prompting advice](/notes/boris-cherny-goals-effort-verification) emphasizes three questions:

1. **Outcome:** What should the agent deliver, and for whom?
2. **Effort:** How much investigation, iteration, or time is appropriate?
3. **Verification:** What observable evidence would show that the result meets the goal?

Necessary constraints still belong in the brief: scope, compatibility, privacy, and actions requiring human approval. Flexibility about implementation does not remove these boundaries. This qualification is our synthesis, not a further claim from the post.

## An example and its limit

The [Home Depot artifact prompt](/notes/boris-cherny-home-depot-prompt) requests an interactive explanation of an episode's business lessons, gives visual references, and encourages substantial iteration. It illustrates outcome, quality, and effort language in a concrete request.

Its visible text does not define a concrete verification method. A request to iterate until the result feels good is different from checking evidence, readability, or working interactions. The finished artifact was not available for evaluation, so the source cannot establish the prompt's effectiveness.

## Connecting prompting to execution

[Agent verification loops](/notes/agent-verification-loops) supplies the operational complement: execute the relevant behavior, observe it, compare it with the goal, and revise. The prompt establishes the checks; the environment must make the evidence available.

[Learning agent workflows from past chats](/notes/learning-agent-workflows-from-chats) addresses what to do when the same missing context or correction recurs. These approaches can complement each other: a concise task brief can rely on reusable tools or workflow guidance developed from observed failures. Neither source establishes that all scaffolding is unnecessary.

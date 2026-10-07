---
noteId: goal-oriented-prompting
title: Goal-oriented prompting
description: Tell an agent what a good result looks like, how much effort to spend, and how to check its work.
kind: concept
updated: 2026-10-07
tags: [prompting, agents, verification, effort]
demo: false
relations: []
---

When you give an agent a task, start with what you want to get back. Explain what a good result looks like, then give it room to choose the steps within your constraints.

That's the idea behind goal-oriented prompting. This note draws on two Boris Cherny posts captured in screenshots. It's a practical interpretation of his advice, not a rule proven to work for every model or task.

## What does the agent need to know?

[Cherny's prompting advice](/notes/boris-cherny-goals-effort-verification) comes down to three questions:

1. **What should it deliver?** Describe the result and who it's for.
2. **How much effort should it spend?** Make clear how much investigation or iteration the task deserves.
3. **How should it check the work?** Describe what would show that the result meets the goal.

Scope, compatibility, privacy, and actions that need human approval still belong in the prompt when they matter. Letting an agent choose its approach doesn't remove those limits. This is an added qualification in this note, not another claim from Cherny's post.

## What that looks like in a prompt

The [Home Depot example](/notes/boris-cherny-home-depot-prompt) asks for an interactive explanation of an episode's business lessons. It names visual references and encourages the agent to keep iterating. You can see the intended result, the desired style, and the effort expectation.

The verification step is less clear. Asking an agent to keep going until it likes the result doesn't specify how to check facts, readability, or interactions. And because the finished artifact wasn't available, this example doesn't establish how well the prompt worked.

## The prompt is one part of the process

An agent also needs access to the evidence you're asking it to check. [Agent verification loops](/notes/agent-verification-loops) explains how it can run the work, inspect the result, and use that feedback for another attempt.

If the same context is missing or you keep making the same correction, [past chats can help improve the workflow](/notes/learning-agent-workflows-from-chats). A short task brief can work alongside reusable tools and guidance built from those problems. These sources don't establish that agents no longer need that support.

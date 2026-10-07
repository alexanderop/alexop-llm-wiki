---
noteId: learning-agent-workflows-from-chats
title: Learning agent workflows from past chats
description: Look at repeated corrections in agent chats to find missing context, useful tools, and workflows worth keeping.
kind: concept
updated: 2026-10-07
tags: [agents, skills, developer-workflows]
demo: false
relations: []
---

If you keep making the same correction in agent chats, there's something worth looking at. The conversation shows where the agent got stuck, what it didn't know, and what you had to explain again.

In [Lauren Tan's interview with Matt Pocock](/notes/poteto-pstack-agent-workflows), especially 01:00:35–01:04:42, Tan recommends using those repeated interventions to improve skills or lint rules. She also describes returning to older chats to recover context for related debugging work. The supplied bookmark at 01:00:53 points into this discussion.

## Turn a repeated correction into a useful change

The following is a suggested way to apply the idea, not a procedure quoted from the interview:

1. Find several corrections about the same problem. Read the surrounding conversation so you understand why they were needed.
2. Work out what was missing. Was it context, a repeatable operation, a rule the agent could check, or help deciding what to do next?
3. Choose a way to address it. Supply the context, write a script for mechanical work, add a check for a structural rule, or describe the workflow in a skill.
4. Try the change on later work. Does the same problem still happen?
5. Keep exceptions visible and revise rules that don't work outside the original task.

The interview's earlier discussion at 00:19:39–00:24:50 helps with the third step. Tan describes moving repeatable operations into tools and leaving the agent to make decisions where judgment is needed. Applied to chat history, that suggests you don't need to turn every repeated command into another written instruction.

## Check whether the lesson still applies

An implementation question follows from the third step: how should those tools work together? [Armin Ronacher's Codemode article](/notes/armin-ronacher-what-is-codemode) provides a concrete example. As an agent synthesis, the connection is between discovering a useful workflow in chats and giving the agent a way to compose its operations. Neither step establishes that the resulting workflow works; it still needs the fourth step's check.

One correction might belong to one task. An old workaround might no longer be needed. The interview describes a method from practice; it doesn't provide controlled evidence that skills extracted from chats improve results across projects.

For example, you might notice that a person always has to run the app and tell the agent what happened. The missing piece could be an [agent verification loop](/notes/agent-verification-loops). Giving the agent access to that evidence may help more than repeatedly telling it to verify its work.

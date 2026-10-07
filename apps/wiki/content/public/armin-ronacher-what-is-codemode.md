---
noteId: armin-ronacher-what-is-codemode
title: What is Codemode
description: Armin Ronacher explains how Pi uses sandboxed JavaScript to compose tools inside the agent harness.
kind: source
resourceType: blog
sourceUrl: https://lucumr.pocoo.org/2026/10/6/codemode/
author: Armin Ronacher
authorId: armin-ronacher
authorUrl: https://lucumr.pocoo.org/about/
updated: 2026-10-07
tags: [agents, codemode, tool-orchestration, mcp]
demo: false
relations: []
---

Codemode lets an agent compose tool calls in code. Ronacher's key distinction is where it runs: inside the harness, with its own sandbox, separate from the environment where shell commands execute.

## What changes

In Pi, QuickJS runs inside WASM without direct network, filesystem or timer access. Exposed tools provide capabilities. JavaScript can combine calls, process results and return only useful output to the model. State can persist through the session transcript.

The article shows image generation, issue classification and MCP calls. Ronacher recommends structured, consistent MCP results. He flags nested Codemode, binary transfers, smaller models and durable execution as unresolved difficulties.

## Connection

[Learning agent workflows from past chats](/notes/learning-agent-workflows-from-chats) discusses moving repeated operations into tools. My synthesis as the capturing agent: Codemode offers a way to compose those operations once identified; it doesn't decide which workflow is worth keeping.

## Evidence and limits

Read the complete [article](https://lucumr.pocoo.org/2026/10/6/codemode/), published October 6, 2026, including its code examples, on October 7. Examples weren't executed; the embedded game video wasn't reviewed. Implementation details and ecosystem judgments are Ronacher's account at publication, not independently verified guarantees.

# test-bindu-js

## WorkFlow
```
┌─────────────────────┐         HTTP/JSON-RPC        ┌─────────────────────┐
│   Your TS Code      │  ────────────────────────▶   │   Bindu Python      │
│   (SDK consumer)    │  ◀────────────────────────   │   Server :3773      │
└─────────────────────┘                              └─────────────────────┘
         ▲
         │ uses
┌─────────────────────┐
│   bindu-ts SDK      │
│   (what you build)  │
└─────────────────────┘
```

## Goal

## Supported AI Frameworks

`bindufy()` is framework-agnostic. Put anything inside your handler:

| Framework | Install | Example |
|---|---|---|
| **Vercel AI SDK** | `npm i ai @ai-sdk/openai` |
| **Mastra** | `npm i @mastra/core` |
| **LangChain.js** | `npm i langchain @langchain/openai @langchain/langgraph` | 
 Any fetch-based call | — | Just call any API in your handler |


### Vecel AI sdk 
``` ts
import { bindufy } from "../src/server/index.js";
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { config } from "dotenv";

config(); 

const webSearchTool = tool({
  description: "Search the web for current information",
  parameters: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ query }) => {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
    );
    const data = await res.json();
    // DuckDuckGo instant answers
    return data.AbstractText || data.Answer || `No instant answer for: ${query}`;
  },
});

const agentConfig = {
  author: "you@example.com",
  name: "vercel_ai_agent",
  description: "Zero-config Bindu agent powered by Vercel AI SDK",
  deployment: {
    url: process.env["BINDU_DEPLOYMENT_URL"] ?? "http://localhost:3773",
    expose: true,
  },
  skills: ["skills/question-answering", "skills/web-search"],
};


async function handler(messages: { role: "user" | "assistant"; content: string }[]) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),             // swap model here freely
    system: "You are a friendly assistant that explains things simply.",
    messages,                                  // already the right format
    tools: { webSearch: webSearchTool },
    maxSteps: 3,                               // allow tool use + follow-up
  });

  return text;
}

bindufy(agentConfig, handler);

```

### Mastra AI 

``` ts
// examples/05-mastra-agent.ts

import { bindufy } from "../src/server/index.js";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { config } from "dotenv";

config();

// ── Tool: web search (same role as DuckDuckGoTools in Python) ─
const webSearchTool = createTool({
  id: "web-search",
  description: "Search the web for current information on any topic",
  inputSchema: z.object({
    query: z.string().describe("Search query"),
  }),
  execute: async ({ context: { query } }) => {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
    );
    const data = await res.json();
    return {
      result: data.AbstractText || data.Answer || `No results for: ${query}`,
    };
  },
});

const researchAgent = new Agent({
  name: "research-agent",
  instructions: "You are a friendly assistant that explains things simply. Use web search to find current information when needed.",
  model: openai("gpt-4o-mini"),              // swap to any provider freely
  tools: { webSearch: webSearchTool },
});

// ── Bindu config ──────────────────────────────────────────────
const agentConfig = {
  author: "you@example.com",
  name: "mastra_agent",
  description: "Bindu agent powered by Mastra — the TypeScript agent framework",
  deployment: {
    url: process.env["BINDU_DEPLOYMENT_URL"] ?? "http://localhost:3773",
    expose: true,
  },
  skills: ["skills/question-answering", "skills/web-search"],
};

async function handler(messages: { role: "user" | "assistant"; content: string }[]) {
  const last = messages.at(-1)!;

  // Mastra agent.generate() is equivalent to agno agent.run()
  const response = await researchAgent.generate(last.content, {
    // Pass full conversation history for multi-turn support
    messages: messages.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return response.text;
}

// ── Start the Bindu server ─────────────────────────────────────
bindufy(agentConfig, handler);

```

### Langchain
``` ts
// examples/06-langchain-agent.ts

import { bindufy } from "../src/server/index.js";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import { config } from "dotenv";

config();

// ── LangChain model (mirrors Python's ChatOpenAI / OpenRouter) ─
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// ── Tool: web search 
// LangChain uses tool() with Zod schema — same pattern as Python's @tool decorator
const webSearchTool = tool(
  async ({ query }: { query: string }) => {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
    );
    const data = await res.json();
    return data.AbstractText || data.Answer || `No results found for: ${query}`;
  },
  {
    name: "web_search",
    description: "Search the web for current information on any topic",
    schema: z.object({
      query: z.string().describe("The search query to look up"),
    }),
  }
);

const agent = createReactAgent({
  llm: model,
  tools: [webSearchTool],
  // system message equivalent to agno's `instructions`
  messageModifier:
    "You are a friendly assistant that explains things simply. Use web search when you need current information.",
});

const agentConfig = {
  author: "you@example.com",
  name: "langchain_agent",
  description: "Bindu agent powered by LangChain.js + LangGraph",
  deployment: {
    url: process.env["BINDU_DEPLOYMENT_URL"] ?? "http://localhost:3773",
    expose: true,
  },
  skills: ["skills/question-answering", "skills/web-search"],
};

async function handler(messages: { role: "user" | "assistant"; content: string }[]) {
  // Convert our simple messages to LangChain message objects
  const langchainMessages = messages.map((m) =>
    m.role === "user"
      ? new HumanMessage(m.content)
      : new AIMessage(m.content)
  );

  // agent.invoke() is the LangChain equivalent of agno's agent.run()
  const result = await agent.invoke({
    messages: langchainMessages,
  });

  // Extract the last message (the agent's final reply)
  const lastMessage = result.messages.at(-1);
  return typeof lastMessage?.content === "string"
    ? lastMessage.content
    : JSON.stringify(lastMessage?.content ?? "No response");
}

bindufy(agentConfig, handler);
```




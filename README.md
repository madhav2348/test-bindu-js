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
Build a TypeScript SDK 
What is built:

- `JsonRpcClient` -  JSON-RPC methods i.e `message/send`, `tasks/`, and `contexts/`
- `AgentClient` - `/.well-known/agent.json`
- `DidClient` - `/did/resolve`
- `MonitoringClient` - `/health` and `/metrics`
- `NegotiationClient` - `/agent/negotiation`
- `PaymentClient` - payment session, payment status, and payment capture 
- `SkillsClient` - skill listing, skill details, and skill documentation

Simple example:

```ts
import { BinduClient } from "@bindu/core";

const client = new BinduClient({
  apiKey: "<token>",
  baseUrl: "http://localhost:3773/",
});

const agent = await client.agent.getAgent();
```

JSON-RPC :

```ts
const response = await client.jsonRpc.sendMessage(
  {
    id: "550e8400-e29b-41d4-a716-446655440024",
    message: {
      role: "user",
      kind: "message",
      messageId: "550e8400-e29b-41d4-a716-446655440038",
      contextId: "550e8400-e29b-41d4-a716-446655440038",
      taskId: "550e8400-e29b-41d4-a716-446655440078",
      parts: [{ kind: "text", text: "provide sunset quote" }],
    },
    configuration: {
      acceptedOutputModes: ["application/json"],
    },
  },
);

const task = await client.jsonRpc.getTask({
  id: "550e8400-e29b-41d4-a716-446655440014",
  taskId: "550e8400-e29b-41d4-a716-446655440013",
});

const tasks = await client.jsonRpc.listTasks({
  id: "550e8400-e29b-41d4-a716-446655440099",
});

await client.jsonRpc.cancelTask({
  id: "550e8400-e29b-41d4-a716-446655440042",
  taskId: "550e8400-e29b-41d4-a716-446655440042",
});

await client.jsonRpc.submitTaskFeedback({
  id: "550e8400-e29b-41d4-a716-446655440024",
  taskId: "550e8400-e29b-41d4-a716-446655440045",
  feedback: "Great job! The response was very helpful and accurate.",
  rating: 5,
  metadata: {
    category: "quality",
    source: "user",
    helpful: true,
  },
});

const contexts = await client.jsonRpc.listContexts({
  id: "550e8400-e29b-41d4-a716-446655440025",
  length: 10,
});

await client.jsonRpc.clearContext({
  id: "550e8400-e29b-41d4-a716-446655440025",
  contextId: "550e8400-e29b-41d4-a716-446655440037",
});
```

Monitoring :

```ts
const health = await client.monitoring.health();
const metrics = await client.monitoring.metrics();

```

Negotiation :

```ts
const negotiation = await client.negotiation.negotiate({
  task_summary: "Extract tables and text from PDF invoices",
  task_details:
    "Need structured data including vendor details, totals, and line items",
  input_mime_types: ["application/pdf"],
  output_mime_types: ["application/json"],
  max_latency_ms: 5000,
  max_cost_amount: "0.001",
  required_tools: [],
  forbidden_tools: [],
  min_score: 0.7,
  weights: {
    skill_match: 0.6,
    io_compatibility: 0.2,
    performance: 0.1,
    load: 0.05,
    cost: 0.05,
  },
});
```

Payment :

```ts
const session = await client.payment.startPaymentSession();

const status = await client.payment.getPaymentStatus({
  sessionId: session.sessionId,
});

const capture = await client.payment.capture();
```

Skills :

```ts
const skills = await client.skills.listSkills();
const skill = await client.skills.getSkill({ skillId: "pdf-processing-v1" });
const docs = await client.skills.getSkillDocumentation({
  skillId: "question-answering-v1",
});

```

DID :

```ts
const didDocument = await client.did.resolveDid({
  did: "did:bindu:gaurikasethi88_at_gmail_com:echo_agent:352c17d030fb4bf1ab33d04b102aef3d",
});
```

Agent :

```ts
const agent = await client.agent.getAgent();

```
<!-- 
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


 -->

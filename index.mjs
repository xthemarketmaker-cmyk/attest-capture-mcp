#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import { captureUrl } from "./client.mjs";

export function createServer({
  apiBase = process.env.ATTEST_CAPTURE_API || "https://getattest.com.au",
  apiKey = process.env.ATTEST_CAPTURE_KEY,
  fetcher = fetch,
} = {}) {
  const server = new McpServer(
    { name: "attest-capture-mcp", version: "0.1.0" },
    {
      // resources/prompts are declared so directory crawlers that probe the full
      // introspection set get an empty list instead of -32601 Method not found.
      capabilities: { tools: {}, resources: {}, prompts: {} },
      instructions: "Use capture_url when a workflow needs screenshot, PDF or HTML evidence from a public web page. Treat the evidence page as proof of what the Attest renderer saw, not a forensic chain of custody.",
    },
  );

  server.registerTool(
    "capture_url",
    {
      title: "Capture public URL",
      description: "Capture a public HTTP(S) page as PNG, PDF or rendered HTML and return a signed artifact URL, SHA-256 digest, timestamp and optional public evidence receipt.",
      inputSchema: z.object({
        url: z.url().describe("Public HTTP or HTTPS page to render"),
        format: z.enum(["png", "pdf", "html"]).default("png"),
        full_page: z.boolean().optional().default(false),
        viewport: z.object({ width: z.number().int().min(320).max(2560), height: z.number().int().min(240).max(2000) }).optional(),
        attest: z.boolean().optional().default(true),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (input) => {
      try {
        const result = await captureUrl({ apiBase, apiKey, input, fetcher });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
      } catch (error) {
        return { isError: true, content: [{ type: "text", text: error.message }] };
      }
    },
  );

  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  void serveStdio(createServer);
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "JamesAI",
    version: "1.0.0",
  });

  // Outil 1 : Bonjour
  server.tool(
    "james_hello",
    "JamesAI se présente et salue l'utilisateur",
    { name: z.string().describe("Le prénom de l'utilisateur") },
    async ({ name }) => ({
      content: [{
        type: "text",
        text: `👋 Bonjour ${name} ! Je suis JamesAI, votre assistant personnel. Comment puis-je vous aider ?`
      }]
    })
  );

  // Outil 2 : Résumer
  server.tool(
    "james_summarize",
    "JamesAI résume un texte",
    { text: z.string().describe("Le texte à résumer") },
    async ({ text }) => ({
      content: [{
        type: "text",
        text: `📝 Résumé JamesAI :\n${text.substring(0, 200)}...`
      }]
    })
  );

  // Outil 3 : Idées
  server.tool(
    "james_ideas",
    "JamesAI génère des idées créatives sur un sujet",
    { topic: z.string().describe("Le sujet") },
    async ({ topic }) => ({
      content: [{
        type: "text",
        text: `💡 Idées JamesAI pour "${topic}" :\n1. Idée innovante A\n2. Idée innovante B\n3. Idée innovante C`
      }]
    })
  );

  return server;
}

export default async function handler(req, res) {
  // CORS — obligatoire pour ChatGPT
  res.setHeader("Access-Control-Allow-Origin", "https://chatgpt.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id");
  res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}

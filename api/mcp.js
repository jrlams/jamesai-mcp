import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';

const handler = createMcpHandler(
  (server) => {

    // Outil 1 : JamesAI se présente
    server.tool(
      'james_hello',
      'JamesAI se présente et dit bonjour à l'utilisateur',
      { name: z.string().describe("Le prénom de l'utilisateur") },
      async ({ name }) => {
        return {
          content: [{
            type: 'text',
            text: `👋 Bonjour ${name} ! Je suis **JamesAI**, votre assistant personnel. Comment puis-je vous aider aujourd'hui ?`
          }],
          structuredContent: { greeting: `Bonjour ${name}`, agent: 'JamesAI' }
        };
      }
    );

    // Outil 2 : Résumer un texte
    server.tool(
      'james_summarize',
      'JamesAI résume un texte fourni par l\'utilisateur',
      { text: z.string().describe("Le texte à résumer") },
      async ({ text }) => {
        const words = text.split(' ').length;
        return {
          content: [{
            type: 'text',
            text: `📝 **JamesAI — Résumé**\n\nTexte analysé : ${words} mots.\nRésumé : ${text.substring(0, 150)}...`
          }],
          structuredContent: { wordCount: words, preview: text.substring(0, 150) }
        };
      }
    );

    // Outil 3 : Générer des idées
    server.tool(
      'james_ideas',
      'JamesAI génère des idées créatives sur un sujet',
      { topic: z.string().describe("Le sujet pour lequel générer des idées") },
      async ({ topic }) => {
        return {
          content: [{
            type: 'text',
            text: `💡 **JamesAI — Idées pour : ${topic}**\n\n1. Approche innovante A\n2. Approche innovante B\n3. Approche innovante C\n\n*(JamesAI est prêt à développer chaque idée !)*`
          }],
          structuredContent: { topic, ideasCount: 3 }
        };
      }
    );

  },
  {
    name: 'JamesAI',
    version: '1.0.0',
  },
  {
    basePath: '/api',
  }
);

export { handler as GET, handler as POST, handler as DELETE };

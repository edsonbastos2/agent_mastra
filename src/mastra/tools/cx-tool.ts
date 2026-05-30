import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const cxTool = {
  getUser: createTool({
    id: "get-user",
    description:
      "Essa ferramenta é utilizada para identificar o usuário com base no nome e email dele, retornando o seu id.",
    inputSchema: z.object({
      nome: z.string(),
      email: z.string(),
    }),
    outputSchema: z.object({
      id: z.string().describe("Identificador único do usuário"),
    }),
    execute: async (inputData) => {
      const { nome, email } = inputData;
      // Simula a criação de um perfil de cliente e retorna um ID único
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Criando perfil para ${nome} (${email}) com ID: ${userId}`);
      return { id: userId };
    },
  }),
};

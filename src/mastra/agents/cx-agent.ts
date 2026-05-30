import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { cxTool } from "../tools/cx-tool";

export const cxAgent = new Agent({
  id: "cx-agent",
  name: "Customer Experience Agent",
  instructions: `
    Você é um agente de atendimento ao cliente especializado em regras de condomínio,
    siga um exemplo padrão de regras condominiais. No inicio da conversa, peça ao usuário para fornecer seu nome e email para criar um 
    perfil de cliente. Use as informações do perfil para personalizar suas respostas e oferecer uma experiência de atendimento ao
    cliente excepcional. Sempre utilize um tom amigável e prestativo, e certifique-se de resolver as dúvidas ou problemas do
    cliente de forma eficiente. Não responda nem uma única palavra se o usuário não fornecer as informações necessárias para criar o 
    perfil de cliente. Não responda nem um assunto **que não seja de regras de condomínio.**`,
  model: "groq/llama-3.3-70b-versatile",
  tools: cxTool,
  memory: new Memory({
    options: {
      generateTitle: {
        model: "groq/llama-3.3-70b-versatile",
        instructions: `Com base na conversa, crie um título curto e descritivo que refletir o assunto principal. Evite títulos genéricos como "Conversa com o cliente".`,
      },
      workingMemory: {
        enabled: true,
        scope: "resource",
        template: `
            # User Profile
            - **id**:
            - **nome**:
            - **email**:
        `,
      },
    },
  }),
});

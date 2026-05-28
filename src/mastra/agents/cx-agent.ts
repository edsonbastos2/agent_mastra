import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

export const cxAgent = new Agent({
  id: "cx-agent",
  name: "Customer Experience Agent",
  instructions: "",
  model: "groq/llama-3.3-70b-versatile",
  memory: new Memory(),
});

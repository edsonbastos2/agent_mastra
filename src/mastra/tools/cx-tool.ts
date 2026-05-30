import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import pgp from "pg-promise";

const db = pgp()("postgres://postgres:123456@localhost:5432/app");

type Invoice = {
  id: string;
  description: string;
  amount: number;
  amount_paid: number;
};

export const cxTool = {
  getUser: createTool({
    id: "get-user",
    description:
      "Essa ferramenta é utilizada para identificar o usuário com base no nome e email dele, retornando o seu id. Caso o usuário não seja encontrado na base de dados, retorne um erro informando que o usuário não foi encontrado.",
    inputSchema: z.object({
      name: z.string(),
      email: z.string(),
    }),
    outputSchema: z.object({
      id: z.string().describe("Identificador único do usuário"),
    }),
    execute: async (inputData) => {
      const { name, email } = inputData;
      const connection = await db.connect();
      const [user] = await connection.query(
        "SELECT * FROM users WHERE name = $1 and email = $2",
        [name, email],
      );
      if (!user) {
        console.log(
          "Usuário com esse nome:",
          name,
          "e email:",
          email,
          "não encontrado.",
        );
        throw new Error("User not found");
      }
      console.log("User found:", user);
      return { id: user.id };
    },
  }),
  getInvoices: createTool({
    id: "get-invoices",
    description:
      "Essa ferramenta é utilizada para buscar as faturas de um usuário com base no id dele.",
    inputSchema: z.object({
      userId: z.string().describe("Identificador único do usuário"),
    }),
    outputSchema: z.object({
      invoices: z.array(
        z.object({
          id: z.string().describe("Identificador único da fatura"),
          description: z.string().describe("Descrição da fatura"),
          amount: z.number().describe("Valor total da fatura"),
          amount_paid: z.number().describe("Valor pago da fatura"),
        }),
      ),
    }),
    execute: async (inputData) => {
      const { userId } = inputData;
      const connection = await db.connect();
      const invoices = await connection.query(
        `SELECT
          id::text AS id,
          description,
          amount::float8 AS amount,
          amount_paid::float8 AS amount_paid
        FROM invoices
        WHERE user_id = $1`,
        [userId],
      );
      console.log("Invoices found:", invoices);
      return { invoices };
    },
  }),
};

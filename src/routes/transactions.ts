import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import crypto, { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-sessionID-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    "/transactions",
    {
      preHandler: checkSessionIdExists,
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return { transactions };
    }
  );

  app.get(
    "/transactions/:id",
    {
      preHandler: checkSessionIdExists,
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { sessionId } = request.cookies;
      const { id } = getTransactionParamsSchema.parse(request.params);
      const transaction = await knex("transactions")
        .where("id", id)
        .andWhere("session_id", sessionId)
        .first();

      return { transaction };
    }
  );

  app.get(
    "/transactions/summary",
    {
      preHandler: checkSessionIdExists,
    },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "Amount" })
        .first();
      return summary;
    }
  );

  app.post("/transactions", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, //7 days
      });
    }

    const transaction = await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}

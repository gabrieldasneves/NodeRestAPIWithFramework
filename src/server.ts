import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();
app.register(cookie);
app.register(transactionsRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log("HTTP server running");
});

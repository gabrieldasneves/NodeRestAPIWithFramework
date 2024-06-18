import { knex as setupKnex, Knex } from "knex";
import "dotenv/config";
import { error } from "console";

if (!process.env.DATABASE_URL) {
  throw new Error("");
}

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./database/migrations",
  },
};
export const knex = setupKnex(config);

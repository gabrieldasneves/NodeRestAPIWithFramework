import { expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("user can create new transaction", async () => {
  const response = await request(app.server).post("/transactions").send({
    title: "new transaction",
    amount: 4044,
    type: "credit",
  });

  expect(response.statusCode).toEqual(201);
});
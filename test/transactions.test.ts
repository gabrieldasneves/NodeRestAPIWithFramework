import { expect, test, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
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

  test("user can list all transactions", async () => {
    const createTransactonResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 4044,
        type: "credit",
      });

    const cookies = createTransactonResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    expect(listTransactionsResponse.statusCode).toEqual(200);
  });

  test("user can list an specific transaction", async () => {
    const createTransactonResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 4044,
        type: "credit",
      });

    const cookies = createTransactonResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies);

    expect(getTransactionResponse.statusCode).toEqual(200);
  });

  test("user can get the summary", async () => {
    const createTransactonResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "credit transaction",
        amount: 4000,
        type: "credit",
      });

    const cookies = createTransactonResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "debit transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 });
  });
});

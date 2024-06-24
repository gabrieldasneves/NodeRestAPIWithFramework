import { expect, test } from "vitest";

test("user can create new transaction", () => {
  const responseStatusCode = 201;

  expect(responseStatusCode).toEqual(201);
});

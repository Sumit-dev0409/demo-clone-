import assert from "node:assert/strict";
import test from "node:test";
import { isAuthorized } from "../lib/auth.ts";

test("authorizes request with valid bearer token", () => {
  process.env.ADMIN_API_KEY = "test_secret_key_123";

  const req = new Request("http://localhost/api/v1/inquiries", {
    headers: {
      authorization: "Bearer test_secret_key_123",
    },
  });

  assert.equal(isAuthorized(req), true);
});

test("authorizes request with x-admin-key header", () => {
  process.env.ADMIN_API_KEY = "test_secret_key_123";

  const req = new Request("http://localhost/api/v1/inquiries", {
    headers: {
      "x-admin-key": "test_secret_key_123",
    },
  });

  assert.equal(isAuthorized(req), true);
});

test("authorizes request with admin cookie", () => {
  process.env.ADMIN_API_KEY = "test_secret_key_123";

  const req = new Request("http://localhost/api/v1/inquiries", {
    headers: {
      cookie: "session=xyz; teddy_admin_token=test_secret_key_123; other=123",
    },
  });

  assert.equal(isAuthorized(req), true);
});

test("rejects request with invalid or missing credentials", () => {
  process.env.ADMIN_API_KEY = "test_secret_key_123";

  const reqWithoutAuth = new Request("http://localhost/api/v1/inquiries");
  assert.equal(isAuthorized(reqWithoutAuth), false);

  const reqWithWrongToken = new Request("http://localhost/api/v1/inquiries", {
    headers: { authorization: "Bearer wrong_key" },
  });
  assert.equal(isAuthorized(reqWithWrongToken), false);
});

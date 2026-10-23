import assert from "node:assert/strict";
import test from "node:test";
import { validateInquiry } from "../lib/inquiries.ts";

const validInquiry = {
  name: "Alex",
  phone: "+971 50 123 4567",
  email: "alex@example.com",
  location: "Dubai",
  curious: "Maltipoo",
  interest: "Max",
  message: "Please share more details.",
  website: "",
};

test("accepts a valid inquiry and trims its fields", () => {
  const result = validateInquiry({ ...validInquiry, name: " Alex " });

  assert.deepEqual(result.errors, {});
  assert.equal(result.value?.name, "Alex");
  assert.equal(result.value?.email, "alex@example.com");
  assert.equal(result.honeypotFilled, false);
});

test("rejects a missing name and malformed contact details", () => {
  const result = validateInquiry({
    ...validInquiry,
    name: " ",
    phone: "letters only",
    email: "not-an-email",
  });

  assert.equal(result.value, undefined);
  assert.ok(result.errors.name);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.email);
});

test("rejects field values that exceed their limits", () => {
  const result = validateInquiry({ ...validInquiry, message: "x".repeat(2001) });

  assert.equal(result.value, undefined);
  assert.match(result.errors.message, /2000/);
});

test("identifies a filled honeypot", () => {
  const result = validateInquiry({ ...validInquiry, website: "spam.example" });

  assert.equal(result.honeypotFilled, true);
  assert.ok(result.value);
});

test("rejects non-object request bodies", () => {
  assert.ok(validateInquiry(null).errors.form);
  assert.ok(validateInquiry([]).errors.form);
});

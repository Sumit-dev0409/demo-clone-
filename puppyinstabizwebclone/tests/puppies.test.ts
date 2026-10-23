import assert from "node:assert/strict";
import test from "node:test";
import { validatePuppyInput } from "../lib/puppies.ts";

const validPuppy = {
  name: "Mochi",
  breed: "Maltipoo",
  meta: "boy, 2 months",
  media: "/media/example.jpg",
  origin: "local",
  status: "available",
  price_aed: 9500,
  description: "A playful teacup pup.",
};

test("accepts valid puppy input with slug generation", () => {
  const result = validatePuppyInput(validPuppy);

  assert.deepEqual(result.errors, {});
  assert.equal(result.value?.name, "Mochi");
  assert.equal(result.value?.breed, "Maltipoo");
  assert.equal(result.value?.origin, "local");
  assert.equal(result.value?.status, "available");
  assert.equal(result.value?.price_aed, 9500);
  assert.ok(result.value?.slug.includes("maltipoo-mochi"));
});

test("rejects missing required puppy fields", () => {
  const result = validatePuppyInput({ name: "", breed: "", meta: "" });

  assert.equal(result.value, undefined);
  assert.ok(result.errors.name);
  assert.ok(result.errors.breed);
  assert.ok(result.errors.meta);
  assert.ok(result.errors.media);
});

test("validates price as positive numeric value", () => {
  const negative = validatePuppyInput({ ...validPuppy, price_aed: -100 });
  assert.ok(negative.errors.price_aed);

  const invalid = validatePuppyInput({ ...validPuppy, price_aed: "not-a-number" });
  assert.ok(invalid.errors.price_aed);
});

test("accepts imported origin and reserved/gone_home status", () => {
  const result = validatePuppyInput({
    ...validPuppy,
    origin: "imported",
    status: "gone_home",
  });

  assert.equal(result.value?.origin, "imported");
  assert.equal(result.value?.status, "gone_home");
});

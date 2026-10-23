import assert from "node:assert/strict";
import test from "node:test";
import { getPuppies, getPuppyBySlug } from "../lib/puppies.ts";
import { listInquiries } from "../lib/inquiries.ts";

test("getPuppies returns list of available puppies with fallback", async () => {
  const puppies = await getPuppies({ origin: "local" });
  assert.ok(Array.isArray(puppies));
  assert.ok(puppies.length > 0);
  assert.equal(puppies[0].origin, "local");
});

test("getPuppies filters by breed correctly", async () => {
  const maltipoos = await getPuppies({ breed: "maltipoo" });
  assert.ok(Array.isArray(maltipoos));
  assert.ok(maltipoos.length > 0);
  for (const p of maltipoos) {
    const haystack = `${p.breed} ${p.name} ${p.meta}`.toLowerCase();
    assert.ok(haystack.includes("maltipoo"));
  }
});

test("getPuppyBySlug returns puppy details", async () => {
  const pup = await getPuppyBySlug("maltipoo-max-male");
  assert.ok(pup);
  assert.equal(pup?.name, "Max");
  assert.equal(pup?.origin, "local");
});

test("getPuppyBySlug handles gone_home puppies", async () => {
  const gone = await getPuppyBySlug("blue-marle-pomeranian");
  assert.ok(gone);
  assert.equal(gone?.status, "gone_home");
});

test("getPuppyBySlug returns null for nonexistent slug", async () => {
  const nonexistent = await getPuppyBySlug("nonexistent-slug-xyz");
  assert.equal(nonexistent, null);
});

test("listInquiries returns empty list gracefully when DB unconfigured", async () => {
  const savedUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const result = await listInquiries();
  assert.deepEqual(result, { inquiries: [], total: 0 });
  if (savedUrl) process.env.DATABASE_URL = savedUrl;
});

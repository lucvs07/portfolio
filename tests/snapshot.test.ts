import { test } from "node:test";
import assert from "node:assert/strict";
import { keepCover } from "../src/lib/github/snapshot.ts";

test("a failed download keeps the cover saved by the previous snapshot when its file still exists", () => {
  assert.equal(keepCover(null, "a.png", true), "a.png");
  assert.equal(keepCover(null, "a.png", false), null);
  assert.equal(keepCover("b.png", "a.png", true), "b.png");
  assert.equal(keepCover(null, null, false), null);
});

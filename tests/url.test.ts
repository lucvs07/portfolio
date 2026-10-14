import { test } from "node:test";
import assert from "node:assert/strict";
import { joinBase } from "../src/lib/url.ts";

test("joinBase adds the base once, with exactly one slash", () => {
  assert.equal(joinBase("/portfolio", "logo.svg"), "/portfolio/logo.svg");
  assert.equal(joinBase("/portfolio", "/logo.svg"), "/portfolio/logo.svg");
  assert.equal(joinBase("/portfolio/", "/og.png"), "/portfolio/og.png");
  assert.equal(joinBase("/", "/og.png"), "/og.png");
  assert.equal(joinBase("", "og.png"), "/og.png");
});

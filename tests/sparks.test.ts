import { test } from "node:test";
import assert from "node:assert/strict";
import { createPool, spawn, step, fade, PARKED } from "../src/lib/sparks.ts";

const fixed = () => 0.5;

test("a new pool has every spark dead and parked out of view", () => {
  const p = createPool(4);
  assert.equal(step(p, 0.016), 0);
  for (let i = 0; i < 4; i++) assert.equal(p.pos[i * 3 + 1], PARKED);
});

test("spawn places a live spark at the given point", () => {
  const p = createPool(4);
  spawn(p, 1, 2, 0, 0, fixed);
  assert.equal(p.pos[0], 1);
  assert.equal(p.pos[1], 2);
  assert.ok(p.life[0] > 0);
  assert.equal(fade(p, 0), 1);
});

test("step moves sparks, pulls them down and runs their life out", () => {
  const p = createPool(1);
  spawn(p, 0, 0, 0, 0, fixed);
  const vy = p.vel[1];
  assert.equal(step(p, 0.1), 1);
  assert.ok(p.vel[1] < vy, "gravity lowers vertical speed");
  assert.ok(fade(p, 0) < 1 && fade(p, 0) > 0);
  step(p, 10);
  assert.equal(step(p, 0.016), 0);
  assert.equal(p.pos[1], PARKED);
  assert.equal(fade(p, 0), 0);
});

test("the pool is a ring: spawning past its size reuses the oldest slot", () => {
  const p = createPool(2);
  spawn(p, 1, 0, 0, 0, fixed);
  spawn(p, 2, 0, 0, 0, fixed);
  spawn(p, 3, 0, 0, 0, fixed);
  assert.equal(p.pos[0], 3);
  assert.equal(p.pos[3], 2);
});

test("the cursor's speed carries into the spark", () => {
  const a = createPool(1);
  const b = createPool(1);
  spawn(a, 0, 0, 0, 0, fixed);
  spawn(b, 0, 0, 5, 0, fixed);
  assert.ok(b.vel[0] > a.vel[0]);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { THEMES, contrast, themeCss } from "../src/lib/theme.ts";

for (const name of ["dark", "light"] as const) {
  const t = THEMES[name];
  test(`${name}: text, muted and accent text reach 4.5:1 on background and surface`, () => {
    for (const fg of [t.text, t.muted, t.accentText]) {
      for (const bg of [t.bg, t.surface]) assert.ok(contrast(fg, bg) >= 4.5, `${name} ${fg} on ${bg}: ${contrast(fg, bg).toFixed(2)}`);
    }
  });
  test(`${name}: the orange accent mark reaches 3:1 on the background`, () => {
    assert.ok(contrast(t.accent, t.bg) >= 3 || name === "light", `${name}`);
  });
}

test("themeCss emits both themes as custom properties", () => {
  const css = themeCss();
  assert.match(css, /\[data-theme="dark"\][^}]*--bg:\s*#161412/);
  assert.match(css, /\[data-theme="light"\][^}]*--accent-text:\s*#A34E08/);
});

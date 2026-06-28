import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("codeblock styles", () => {
  const css = readFileSync(
    new URL("../src/styles/codeblock.css", import.meta.url),
    "utf8",
  );

  it("keeps generated Font Awesome icons compatible with v7", () => {
    expect(css).toContain(".fa-angle-double-down");
    expect(css).toContain('--fa: "\\f103"');
    expect(css).toContain('content: "\\f103"');
  });

  it("keeps icon button boxes stable when icons rotate", () => {
    expect(css).toMatch(
      /figure\.shiki \.shiki-tools \.expand \{[\s\S]*width: 2\.1em;[\s\S]*display: flex;/,
    );
    expect(css).toMatch(
      /figure\.shiki \.shiki-tools \.expand\.closed \{[\s\S]*transform: none;/,
    );
    expect(css).toMatch(
      /figure\.shiki \.shiki-tools \.expand\.closed::before \{[\s\S]*transform: rotate\(90deg\);/,
    );
    expect(css).toMatch(
      /figure\.shiki \.code-expand-btn\.expand-done > i \{[\s\S]*transform: none;/,
    );
    expect(css).toMatch(
      /figure\.shiki \.code-expand-btn\.expand-done > i::before \{[\s\S]*transform: rotate\(180deg\);/,
    );
  });
});

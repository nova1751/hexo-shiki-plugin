import { describe, expect, it, vi } from "vitest";
import { resolvePluginConfig } from "../src/core/config";
import { renderMarkdownCodeBlocks } from "../src/core/render";
import { buildRuntimeConfigScript } from "../src/core/runtime";
import { resolveThemeStyle } from "../src/themes";

describe("renderMarkdownCodeBlocks", () => {
  it("renders fenced blocks with line numbers", async () => {
    const html = await renderMarkdownCodeBlocks(
      "```ts\nconst value = 1;\n```\n",
      { lineNumber: true },
      {
        codeToHtml: vi
          .fn()
          .mockResolvedValue(
            '<pre style="color:red" tabindex="0"><code>highlighted</code></pre>',
          ),
      },
    );

    expect(html).toContain('<figure class="shiki ts">');
    expect(html).toContain(
      '<div class="gutter"><pre><span class="line">1</span><br></pre></div>',
    );
    expect(html).toContain("<pre><code>highlighted</code></pre>");
  });

  it("strips quote prefixes before highlighting", async () => {
    const highlighter = vi.fn().mockResolvedValue("<pre><code>ok</code></pre>");

    await renderMarkdownCodeBlocks(
      "> ```js\n> console.log('test')\n> ```",
      { lineNumber: false },
      { codeToHtml: highlighter },
    );

    expect(highlighter).toHaveBeenCalledWith("console.log('test')", {
      lang: "js",
    });
  });

  it("falls back to escaped html when highlighting fails", async () => {
    const html = await renderMarkdownCodeBlocks(
      "```html\n<div>\n```\n",
      { lineNumber: false },
      {
        codeToHtml() {
          throw new Error("boom");
        },
      },
    );

    expect(html).toContain("&lt;div&gt;");
  });
});

describe("config helpers", () => {
  it("resolves defaults from hexo config", () => {
    expect(
      resolvePluginConfig({
        theme: "github-dark",
      }),
    ).toMatchObject({
      theme: "github-dark",
      beautify: false,
      lineNumber: false,
      colorizedBrackets: undefined,
      copy: {
        success: "",
        error: "",
        noSupport: "",
      },
    });
  });

  it("keeps colorized bracket config", () => {
    expect(
      resolvePluginConfig({
        colorized_brackets: true,
      }),
    ).toMatchObject({
      colorizedBrackets: true,
    });
  });

  it("serializes the runtime config safely", () => {
    const script = buildRuntimeConfigScript("1.2.3", {
      theme: "github-dark",
      lineNumber: true,
      beautify: true,
      highlightCopy: true,
      highlightLang: false,
      highlightHeightLimit: 300,
      isHighlightShrink: false,
      cssCdn: undefined,
      jsCdn: undefined,
      copy: {
        success: "ok",
        error: "no",
        noSupport: "skip",
      },
    });

    expect(script).toContain('"highlightCopy":true');
    expect(script).toContain("v1.2.3");
  });

  it("falls back to the default theme style", () => {
    expect(resolveThemeStyle("unknown-theme")).toContain("--hl-bg:#282c34");
  });
});

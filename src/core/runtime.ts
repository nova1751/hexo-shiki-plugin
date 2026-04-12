import type { ResolvedShikiPluginConfig } from "./config";

export const PACKAGE_CDN_ROOT =
  "https://cdn.jsdelivr.net/npm/hexo-shiki-plugin@latest";

export function buildRuntimeConfigScript(
  version: string,
  config: ResolvedShikiPluginConfig,
): string {
  const runtimeConfig = {
    beautify: config.beautify,
    highlightCopy: config.highlightCopy,
    highlightLang: config.highlightLang,
    highlightHeightLimit: config.highlightHeightLimit,
    isHighlightShrink: config.isHighlightShrink,
    copy: config.copy,
  };

  return `
  <script>
  window.CODE_CONFIG = ${JSON.stringify(runtimeConfig)};
  console.log(
    "%c hexo-shiki-plugin %c v${version} %c https://github.com/nova1751/hexo-shiki-plugin",
    "color: #fff; background: #5f5f5f",
    "color: #fff; background: #80c8f8",
    ""
  );
  </script>
  `;
}

export function buildHeightLimitStyle(highlightHeightLimit: number): string {
  return `
    <style>
    .code-expand-btn:not(.expand-done) ~ div.codeblock,
    .code-expand-btn:not(.expand-done) ~ * div.codeblock {
      overflow: hidden;
      height: ${highlightHeightLimit}px;
    }
    </style>
  `;
}

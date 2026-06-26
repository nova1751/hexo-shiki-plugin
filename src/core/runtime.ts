import type { ResolvedShikiPluginConfig } from "./config";

export const PACKAGE_CDN_ROOT =
  "https://cdn.jsdelivr.net/npm/hexo-shiki-plugin@latest";

const RAW_TEXT_TAGS = ["script", "style", "textarea", "title"] as const;

function isTagNameBoundary(value: string, index: number): boolean {
  const char = value[index];

  return char === undefined || /\s|\/|>/.test(char);
}

function findTagEnd(value: string, startIndex: number): number {
  let quote: string | null = null;

  for (let index = startIndex; index < value.length; index += 1) {
    const char = value[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === ">") {
      return index;
    }
  }

  return -1;
}

function startsWithTag(
  lowerValue: string,
  index: number,
  tagName: string,
  closing: boolean,
): boolean {
  const prefix = closing ? `</${tagName}` : `<${tagName}`;

  return (
    lowerValue.startsWith(prefix, index) &&
    isTagNameBoundary(lowerValue, index + prefix.length)
  );
}

function findRawTextEnd(
  value: string,
  lowerValue: string,
  startIndex: number,
  tagName: string,
): number {
  let index = startIndex;

  while (index < value.length) {
    const closeIndex = lowerValue.indexOf(`</${tagName}`, index);

    if (closeIndex === -1) {
      return value.length;
    }

    if (isTagNameBoundary(lowerValue, closeIndex + tagName.length + 2)) {
      const closeTagEnd = findTagEnd(value, closeIndex);

      return closeTagEnd === -1 ? value.length : closeTagEnd + 1;
    }

    index = closeIndex + tagName.length + 2;
  }

  return value.length;
}

function findBodyEndTag(value: string): number {
  const lowerValue = value.toLowerCase();
  let index = 0;

  while (index < value.length) {
    const tagStart = lowerValue.indexOf("<", index);

    if (tagStart === -1) {
      return -1;
    }

    if (lowerValue.startsWith("<!--", tagStart)) {
      const commentEnd = lowerValue.indexOf("-->", tagStart + 4);
      index = commentEnd === -1 ? value.length : commentEnd + 3;
      continue;
    }

    if (startsWithTag(lowerValue, tagStart, "body", true)) {
      return tagStart;
    }

    const rawTextTag = RAW_TEXT_TAGS.find((tagName) =>
      startsWithTag(lowerValue, tagStart, tagName, false),
    );

    if (rawTextTag) {
      const openTagEnd = findTagEnd(value, tagStart);
      index =
        openTagEnd === -1
          ? value.length
          : findRawTextEnd(value, lowerValue, openTagEnd + 1, rawTextTag);
      continue;
    }

    const tagEnd = findTagEnd(value, tagStart);
    index = tagEnd === -1 ? tagStart + 1 : tagEnd + 1;
  }

  return -1;
}

export function injectBeforeBodyEnd(html: string, injection: string): string {
  if (!injection) {
    return html;
  }

  const bodyEndIndex = findBodyEndTag(html);

  if (bodyEndIndex === -1) {
    return html;
  }

  return `${html.slice(0, bodyEndIndex)}${injection}${html.slice(bodyEndIndex)}`;
}

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

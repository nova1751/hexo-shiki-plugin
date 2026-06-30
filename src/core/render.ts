import stripIndent from "strip-indent";

const CODE_BLOCK_PATTERN =
  /(?<quote>[> ]*)(?<ul>(-|\d+\.)?)(?<start>\s*)(?<tick>~{3,}|`{3,}) *(?<args>.*)\n(?<code>[\s\S]*?)\k<quote>\s*\k<tick>(?<end>\s*)$/gm;

export interface HtmlHighlighter {
  codeToHtml(
    code: string,
    options: { lang?: string; meta?: string },
  ): Promise<string> | string;
}

export interface RenderMarkdownOptions {
  lineNumber: boolean;
  skipLanguages?: string[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHighlighterPreAttributes(html: string): string {
  return html.replace(/<pre([^>]*)>/, (_match, attrs: string) => {
    const nextAttrs = attrs
      .replace(/\sstyle\s*=\s*\"[^\"]*\"/g, "")
      .replace(/\stabindex\s*=\s*\"[^\"]*\"/g, "");

    return `<pre${nextAttrs}>`;
  });
}

interface CodeBlockArgs {
  language: string | undefined;
  meta: string | undefined;
}

function resolveCodeBlockArgs(args: string): CodeBlockArgs {
  const trimmed = args.trim();
  const parts = trimmed.split(/\s+/);
  const language = parts[0] || undefined;
  const meta = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
  return { language, meta };
}

function shouldSkipHighlight(
  language: string | undefined,
  skipLanguages: string[] | undefined,
): boolean {
  if (!language || !skipLanguages?.length) {
    return false;
  }

  return skipLanguages.includes(language.toLowerCase());
}

function renderSkippedCodeBlock(language: string | undefined, code: string) {
  if (language?.toLowerCase() === "mermaid") {
    return `<div class="mermaid-wrap"><pre class="mermaid-src" hidden>\n${escapeHtml(code)}\n</pre></div>`;
  }

  return null;
}

function protectRenderedCodeBlock(html: string) {
  return `<hexoPostRenderCodeBlock>${html}</hexoPostRenderCodeBlock>`;
}

export async function renderMarkdownCodeBlocks(
  content: string,
  options: RenderMarkdownOptions,
  highlighter: HtmlHighlighter,
): Promise<string> {
  const matches = [...content.matchAll(CODE_BLOCK_PATTERN)];

  if (matches.length === 0) {
    return content;
  }

  let output = "";
  let lastIndex = 0;

  for (const match of matches) {
    const groups = match.groups as {
      quote: string;
      ul: string;
      start: string;
      end: string;
      args: string;
      code: string;
    };
    const { quote, ul, start, end, args } = groups;
    const matchIndex = match.index ?? 0;
    output += content.slice(lastIndex, matchIndex);

    const quotePrefix = quote.trimEnd();
    const quoteMatcher = quotePrefix
      ? new RegExp(`^${quotePrefix}`, "gm")
      : null;
    const code = stripIndent(
      (quoteMatcher
        ? groups.code.replace(quoteMatcher, "")
        : groups.code
      ).trimEnd(),
    );
    const lineCount = code.length === 0 ? 1 : code.split("\n").length;
    const { language, meta } = resolveCodeBlockArgs(args);
    let html = "";

    if (shouldSkipHighlight(language, options.skipLanguages)) {
      const skippedHtml = renderSkippedCodeBlock(language, code);
      output += skippedHtml
        ? `${quote}${ul}${start}${protectRenderedCodeBlock(skippedHtml)}${end}`
        : match[0];
      lastIndex = matchIndex + match[0].length;
      continue;
    }

    try {
      html = stripHighlighterPreAttributes(
        await highlighter.codeToHtml(code, { lang: language, meta }),
      );
    } catch (error) {
      console.warn(error);
      html = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }

    const metaAttr = meta ? ` data-meta="${escapeHtml(meta)}"` : "";
    let codeBlockHtml = `<figure class="shiki${language ? ` ${language}` : ""}"${metaAttr}>`;
    if (meta) {
      codeBlockHtml += `<div class="code-meta">${escapeHtml(meta)}</div>`;
    }
    codeBlockHtml += "<div class='codeblock'>";

    if (options.lineNumber) {
      const numbers = Array.from({ length: lineCount }, (_value, index) => {
        return `<span class="line">${index + 1}</span><br>`;
      }).join("");
      codeBlockHtml += `<div class="gutter"><pre>${numbers}</pre></div>`;
    }

    codeBlockHtml += `<div class="code">${html}</div>`;
    codeBlockHtml += "</div></figure>";

    output += `${quote}${ul}${start}${protectRenderedCodeBlock(codeBlockHtml)}${end}`;
    lastIndex = matchIndex + match[0].length;
  }

  output += content.slice(lastIndex);

  return output;
}

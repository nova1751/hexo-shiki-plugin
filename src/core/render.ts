import stripIndent from "strip-indent";

const CODE_BLOCK_PATTERN =
  /(?<quote>[> ]*)(?<ul>(-|\d+\.)?)(?<start>\s*)(?<tick>~{3,}|`{3,}) *(?<args>.*)\n(?<code>[\s\S]*?)\k<quote>\s*\k<tick>(?<end>\s*)$/gm;

export interface HtmlHighlighter {
  codeToHtml(
    code: string,
    options: { lang?: string },
  ): Promise<string> | string;
}

export interface RenderMarkdownOptions {
  lineNumber: boolean;
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

function resolveLanguage(args: string): string | undefined {
  const [language] = args.trim().split(/\s+/, 1);
  return language || undefined;
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
    const language = resolveLanguage(args);
    let html = "";

    try {
      html = stripHighlighterPreAttributes(
        await highlighter.codeToHtml(code, { lang: language }),
      );
    } catch (error) {
      console.warn(error);
      html = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }

    let codeBlockHtml = `<figure class="shiki${language ? ` ${language}` : ""}">`;
    codeBlockHtml += "<div class='codeblock'>";

    if (options.lineNumber) {
      const numbers = Array.from({ length: lineCount }, (_value, index) => {
        return `<span class="line">${index + 1}</span><br>`;
      }).join("");
      codeBlockHtml += `<div class="gutter"><pre>${numbers}</pre></div>`;
    }

    codeBlockHtml += `<div class="code">${html}</div>`;
    codeBlockHtml += "</div></figure>";

    output += `${quote}${ul}${start}<hexoPostRenderCodeBlock>${codeBlockHtml}</hexoPostRenderCodeBlock>${end}`;
    lastIndex = matchIndex + match[0].length;
  }

  output += content.slice(lastIndex);

  return output;
}

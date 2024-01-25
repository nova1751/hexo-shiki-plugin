const shiki = require("shiki-nova1751");
const stripIndent = require("strip-indent");
const themes = require("./lib/themes");
const { version } = require("./package.json");
const codeMatch =
  /(?<quote>[> ]*)(?<ul>(-|\d+\.)?)(?<start>\s*)(?<tick>~{3,}|`{3,}) *(?<args>.*)\n(?<code>[\s\S]*?)\k<quote>\s*\k<tick>(?<end>\s*)$/gm;
const config = hexo.config.shiki;
if (!config) return;
const {
  theme,
  line_number,
  beautify,
  highlight_copy,
  highlight_lang,
  highlight_height_limit,
  is_highlight_shrink,
  css_cdn,
  js_cdn,
  copy: { success, error, no_support } = {},
} = config;
const codeblockTheme = themes.has(theme) ? theme : "one-dark-pro";
const css = hexo.extend.helper.get("css").bind(hexo);
const js = hexo.extend.helper.get("js").bind(hexo);
hexo.extend.injector.register("head_end", () => {
  return css(
    css_cdn ||
      "https://cdn.jsdelivr.net/npm/hexo-shiki-plugin@latest/lib/codeblock.css"
  );
});
hexo.extend.injector.register("head_end", () => {
  return themes.get(codeblockTheme);
});
if (config.highlight_height_limit) {
  hexo.extend.injector.register("head_end", () => {
    return `
    <style>
    .code-expand-btn:not(.expand-done) ~ div.codeblock,
    .code-expand-btn:not(.expand-done) ~ * div.codeblock {
      overflow: hidden;
      height: ${config.highlight_height_limit}px;
    }
    </style>
  `;
  });
}

if (beautify) {
  hexo.extend.injector.register("body_end", () => {
    return js(
      js_cdn ||
        "https://cdn.jsdelivr.net/npm/hexo-shiki-plugin@latest/lib/codeblock.js"
    );
  });
}
hexo.extend.injector.register("body_end", () => {
  return `
  <script>
  const CODE_CONFIG = {
    beautify: ${beautify},
    highlightCopy: ${highlight_copy},
    highlightLang: ${highlight_lang},
    highlightHeightLimit: ${highlight_height_limit},
    isHighlightShrink: ${is_highlight_shrink},
    copy: {
      success: '${success}',
      error: '${error}',
      noSupport: '${no_support}',
    }
  };
  console.log(
    \`%c hexo-shiki-plugin %c ${
      "v" + version
    } %c https://github.com/nova1751/hexo-shiki-plugin\`,
    "color: #fff; background: #5f5f5f",
    "color: #fff; background: #80c8f8",
    ""
  );
  </script>
  `;
});
return shiki
  .getHighlighter({
    theme,
  })
  .then((hl) => {
    hexo.extend.filter.register("before_post_render", (post) => {
      post.content = post.content.replace(codeMatch, (...argv) => {
        let { quote, ul, start, end, args, code } = argv.pop();
        let result;
        const match = new RegExp(`^${quote.trimEnd()}`, "gm");
        code = code.replace(match, "");
        code = stripIndent(code.trimEnd());
        const arr = code.split("\n");
        let numbers = "";
        let pre = "";
        try {
          pre = hl.codeToHtml(code, { lang: args });
          pre = pre.replace(/<pre[^>]*>/, (match) => {
            return match.replace(/\s*style\s*=\s*"[^"]*"\s*tabindex="0"/, "");
          });
        } catch (error) {
          console.warn(error);
          pre = `<pre><code>${code}</code></pre>`;
        }
        result = `<figure class="shiki${args ? ` ${args}` : ""}">`;
        result += "<div class='codeblock'>";
        if (line_number) {
          for (let i = 0, len = arr.length; i < len; i++) {
            numbers += `<span class="line">${1 + i}</span><br>`;
          }
          result += `<div class="gutter"><pre>${numbers}</pre></div>`;
        }
        result += `<div class="code">${pre}</div>`;
        result += "</div></figure>";
        return `${
          quote + ul + start
        }<hexoPostRenderCodeBlock>${result}</hexoPostRenderCodeBlock>${end}`;
      });
    });
  });

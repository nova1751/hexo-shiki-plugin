const rBacktick =
  /^(?<start>\s*)(?<tick>~{3,}|`{3,})(?<args>.*)\n(?<code>[\s\S]*?)^\s*\k<tick>(?<end>\s*)$/gm;
const shiki = require("shiki");
const stripIndent = require("strip-indent");
const config = hexo.config.shiki;
const css = hexo.extend.helper.get("css").bind(hexo);
const js = hexo.extend.helper.get("js").bind(hexo);
hexo.extend.injector.register("head_end", () => {
  return css("http://127.0.0.1:5501/lib/codeblock.css");
});

hexo.extend.injector.register("body_end", () => {
  return js("htt1://127.0.0.1:5501/lib/codeblock.js");
});
return shiki
  .getHighlighter({
    theme: config.theme,
  })
  .then((hl) => {
    hexo.extend.filter.register("before_post_render", (post) => {
      post.content = post.content.replace(rBacktick, (...argv) => {
        let { start, end, args, code } = argv.pop();
        let result;
        try {
          code = stripIndent(code.trimEnd());
          const arr = code.split("\n");
          let numbers = "";
          for (let i = 0, len = arr.length; i < len; i++) {
            numbers += `<span class="line">${1 + i}</span><br>`;
          }
          const pre = hl.codeToHtml(code, { lang: args });
          result = `<figure class="shiki${args ? ` ${args}` : ""}"${
            args ? ` data-language="${args}"` : ""
          }>`;

          result += "<table><tr>";

          result += `<td class="gutter"><pre>${numbers}</pre></td>`;

          result += `<td class="code">${pre}</td>`;
          result += "</tr></table></figure>";

          return `${start}<hexoPostRenderCodeBlock>${result}</hexoPostRenderCodeBlock>${end}`;
        } catch (e) {
          console.error(e);
          return result;
        }
      });
    });
  });

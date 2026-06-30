import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import { codeToHtml } from "shiki";
import { version } from "../package.json";
import { resolvePluginConfig } from "./core/config";
import { renderMarkdownCodeBlocks } from "./core/render";
import {
  buildHeightLimitStyle,
  buildRuntimeConfigScript,
  injectBeforeBodyEnd,
  PACKAGE_CDN_ROOT,
} from "./core/runtime";
import { resolveThemeStyle } from "./themes";
import type { HexoGlobal, HexoPost } from "./types/hexo";
import type { ResolvedShikiPluginConfig } from "./core/config";

type ShikiCodeToHtmlOptions = Parameters<typeof codeToHtml>[1];

declare const hexo: HexoGlobal | undefined;

function resolveGlobalHexo(): HexoGlobal | undefined {
  return typeof hexo === "undefined" ? undefined : hexo;
}

async function highlightCode(
  code: string,
  theme: string,
  colorizedBrackets?: ResolvedShikiPluginConfig["colorizedBrackets"],
  lang?: string,
  meta?: string,
): Promise<string> {
  const transformers = colorizedBrackets
    ? [
        transformerColorizedBrackets(
          colorizedBrackets === true ? undefined : colorizedBrackets,
        ),
      ]
    : undefined;
  const options: Record<string, unknown> = {
    lang: lang ?? "text",
    theme,
    transformers,
  };

  if (meta) {
    options.meta = { __raw: meta };
  }

  const optionsTyped = options as unknown as ShikiCodeToHtmlOptions;

  try {
    return await codeToHtml(code, optionsTyped);
  } catch {
    return codeToHtml(code, {
      lang: "text",
      theme,
      transformers,
    } as unknown as ShikiCodeToHtmlOptions);
  }
}

export async function initializePlugin(hexo: HexoGlobal): Promise<void> {
  const config = resolvePluginConfig(hexo.config.shiki);

  if (!config) {
    return;
  }

  const css = hexo.extend.helper.get("css").bind(hexo);
  const js = hexo.extend.helper.get("js").bind(hexo);
  const highlightTheme = config.theme ?? "one-dark-pro";
  const bodyEndHandlers: Array<() => string> = [];

  hexo.extend.injector.register("head_end", () => {
    return css(config.cssCdn ?? `${PACKAGE_CDN_ROOT}/dist/lib/codeblock.css`);
  });

  hexo.extend.injector.register("head_end", () => {
    return resolveThemeStyle(config.theme);
  });

  if (config.highlightHeightLimit !== undefined) {
    const highlightHeightLimit = config.highlightHeightLimit;

    hexo.extend.injector.register("head_end", () => {
      return buildHeightLimitStyle(highlightHeightLimit);
    });
  }

  if (config.beautify) {
    bodyEndHandlers.push(() =>
      js(config.jsCdn ?? `${PACKAGE_CDN_ROOT}/dist/lib/codeblock.js`),
    );
  }

  bodyEndHandlers.push(() => buildRuntimeConfigScript(version, config));

  hexo.extend.filter.register("after_render:html", (html: string) => {
    return injectBeforeBodyEnd(
      html,
      bodyEndHandlers.map((fn) => fn()).join(""),
    );
  });

  hexo.extend.filter.register("before_post_render", async (post: HexoPost) => {
    post.content = await renderMarkdownCodeBlocks(
      post.content,
      { lineNumber: config.lineNumber, skipLanguages: config.skipLanguages },
      {
        codeToHtml(source, { lang, meta }) {
          return highlightCode(
            source,
            highlightTheme,
            config.colorizedBrackets,
            lang,
            meta,
          );
        },
      },
    );
  });
}

const runtimeHexo = resolveGlobalHexo();

if (runtimeHexo) {
  void initializePlugin(runtimeHexo);
}

export { renderMarkdownCodeBlocks } from "./core/render";
export { resolvePluginConfig } from "./core/config";
export { resolveThemeStyle } from "./themes";

import type { transformerColorizedBrackets } from "@shikijs/colorized-brackets";

type ColorizedBracketsOptions = Parameters<
  typeof transformerColorizedBrackets
>[0];

export interface ShikiPluginConfig {
  theme?: string;
  line_number?: boolean;
  beautify?: boolean;
  highlight_copy?: boolean;
  highlight_lang?: boolean;
  highlight_height_limit?: number;
  is_highlight_shrink?: boolean;
  colorized_brackets?: boolean | ColorizedBracketsOptions;
  css_cdn?: string;
  js_cdn?: string;
  copy?: {
    success?: string;
    error?: string;
    no_support?: string;
  };
}

export interface ResolvedShikiPluginConfig {
  theme?: string;
  lineNumber: boolean;
  beautify: boolean;
  highlightCopy: boolean;
  highlightLang: boolean;
  highlightHeightLimit?: number;
  isHighlightShrink?: boolean;
  colorizedBrackets?: boolean | ColorizedBracketsOptions;
  cssCdn?: string;
  jsCdn?: string;
  copy: {
    success: string;
    error: string;
    noSupport: string;
  };
}

export function resolvePluginConfig(
  config?: ShikiPluginConfig,
): ResolvedShikiPluginConfig | null {
  if (!config) {
    return null;
  }

  return {
    theme: config.theme,
    lineNumber: config.line_number ?? false,
    beautify: config.beautify ?? false,
    highlightCopy: config.highlight_copy ?? false,
    highlightLang: config.highlight_lang ?? false,
    highlightHeightLimit: config.highlight_height_limit,
    isHighlightShrink: config.is_highlight_shrink,
    colorizedBrackets: config.colorized_brackets,
    cssCdn: config.css_cdn,
    jsCdn: config.js_cdn,
    copy: {
      success: config.copy?.success ?? "",
      error: config.copy?.error ?? "",
      noSupport: config.copy?.no_support ?? "",
    },
  };
}

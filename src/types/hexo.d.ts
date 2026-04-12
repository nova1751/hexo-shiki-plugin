import type { ShikiPluginConfig } from "../core/config";

export interface HexoPost {
  content: string;
}

export interface HexoGlobal {
  config: {
    shiki?: ShikiPluginConfig;
  };
  extend: {
    helper: {
      get(name: "css" | "js"): (path: string) => string;
    };
    injector: {
      register(position: "head_end" | "body_end", handler: () => string): void;
    };
    filter: {
      register(
        name: "before_post_render",
        handler: (post: HexoPost) => void | Promise<void>,
      ): void;
    };
  };
}

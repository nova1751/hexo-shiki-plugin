import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(rootDir, "src/client/codeblock.ts"),
      formats: ["iife"],
      name: "HexoShikiPluginCodeblock",
      fileName: () => "lib/codeblock.js",
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: { name?: string | undefined }) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "lib/codeblock.css";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
    sourcemap: false,
    target: "es2020",
  },
});

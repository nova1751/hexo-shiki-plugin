import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(rootDir, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format: string) =>
        format === "es" ? "index.js" : "index.cjs",
    },
    outDir: "dist",
    sourcemap: false,
    target: "esnext",
  },
  plugins: [
    dts({
      entryRoot: "src",
      include: ["src"],
    }),
  ],
});

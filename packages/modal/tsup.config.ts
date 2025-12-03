import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "zustand"],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  minify: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});

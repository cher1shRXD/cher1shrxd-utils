import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["axios", "next", "next/headers", "next/navigation"],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  minify: true,
});

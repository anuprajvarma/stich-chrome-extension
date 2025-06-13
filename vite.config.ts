import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    rollupOptions: {
      external: ["chrome"],
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content.ts"), // include this
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     target: "esnext",
//     rollupOptions: {
//       external: ["chrome"],
//       input: {
//         main: resolve(__dirname, "index.html"),
//         content: resolve(__dirname, "src/content.ts"), // include this
//         background: "src/background.ts",
//       },
//       output: {
//         entryFileNames: "[name].js",
//       },
//     },
//     outDir: "dist",
//     emptyOutDir: true,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import tailwindcss from "@tailwindcss/vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

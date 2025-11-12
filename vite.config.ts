import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // ✅ Always output same CSS filename (no hash)
        assetFileNames: (assetInfo) => {
          const fileName = Array.isArray(assetInfo.names)
            ? assetInfo.names[0]
            : assetInfo.name;

          if (fileName && fileName.endsWith(".css")) {
            return "assets/index.css"; // fixed output name
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});

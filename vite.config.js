import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In production (build), use the GitHub Pages base path.
  // In development (dev), use / so localhost:5175 works normally.
  base: command === "build" ? "/DrinkQuest/" : "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
}));

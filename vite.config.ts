// vite.config.ts  (works on macOS, Windows, WSL, Docker)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",          // <— open browser at http://127.0.0.1:5173
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "", // strip Domain= so cookie sticks
      },
    },
  },
});

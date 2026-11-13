import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Alamat backend Express. Ubah lewat env BACKEND_URL kalau port-nya beda.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Semua request ke /api/* diteruskan ke backend Express,
    // jadi tidak perlu setting CORS di backend saat development.
    proxy: {
      "/api": BACKEND_URL,
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'https://server.msg-min.xyz',
        ws: true,
        changeOrigin: true
      }
    },
  },
});
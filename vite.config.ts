import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Sprite",
        short_name: "Sprite",
        description: "A simple PWA built with React, TypeScript, and Vite",
        theme_color: "#3c944a",
        background_color: "#3c944a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/sprite.svg",
            sizes: "192x192",
            type: "image/svg",
          },
          {
            src: "/sprite.svg",
            sizes: "512x512",
            type: "image/svg",
          },
          {
            src: "/sprite.svg",
            sizes: "512x512",
            type: "image/svg",
            purpose: "maskable any",
          },
        ],
      },
    }),
  ],
});

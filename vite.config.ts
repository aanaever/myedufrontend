import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "manifest.json",
      devOptions: {
        enabled: false
      },
      manifest: {
        name: "MyEdu",
        short_name: "MyEdu",
        id: "/",
        description: "Web application for online courses",
        start_url: "/",
        scope: "/",
       /* icons: [
          {
            src: "",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ], */ 
        theme_color: "#5943be",
        background_color: "#ffffff",
        display: "standalone"
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2500
  }
});

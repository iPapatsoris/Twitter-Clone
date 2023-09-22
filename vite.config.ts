import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";
import path from "path";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

const pathSrc = path.resolve(__dirname, "./src");

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as common; @use "${pathSrc}/util/breakpoints/breakpoints" as media ;`,
        importer(...args) {
          if (args[0] !== "@/styles") {
            return;
          }

          return {
            file: `${pathSrc}`,
          };
        },
      },
    },
  },
  plugins: [
    svgr({ svgrOptions: { titleProp: true } }),
    react(),
    sassDts({
      enabledMode: ["development", "production"],
      global: {
        generate: true,
        outFile: `${pathSrc}/style.d.ts`,
      },
    }),
    eslint({
      // failOnWarning: true,
    }),
  ],
});

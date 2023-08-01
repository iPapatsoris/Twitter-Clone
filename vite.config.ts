import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";
import path from "path";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as common;`,
        importer(...args) {
          if (args[0] !== "@/styles") {
            return;
          }

          return {
            file: `${path.resolve(__dirname, "./src")}`,
          };
        },
      },
    },
  },
  plugins: [
    svgr(),
    react(),
    sassDts({
      enabledMode: ["development", "production"],
      global: {
        generate: true,
        outFile: path.resolve(__dirname, "./src/style.d.ts"),
      },
      // typeName: {
      //   replacement: (fileName) => {
      //     const spilittedFileName = fileName.split(".");
      //     return `${spilittedFileName[0]}Names`;
      //   },
      // },
    }),
    eslint({
      // failOnWarning: true,
    }),
  ],
});

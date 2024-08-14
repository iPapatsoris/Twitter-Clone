import { defineConfig, loadEnv } from "vite";
import type { UserConfig as VitestUserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";
import path from "path";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

declare module "vite" {
  export interface UserConfig {
    test: VitestUserConfig["test"];
  }
}

const pathSrc = path.resolve(__dirname, "./src");
const commonStylesPath = pathSrc + "/assets/styles/common";
const globalStylesPath = pathSrc + "/assets/styles/global";
const setupTestsPath = path.resolve(__dirname, "./src/tests/setupTests");

const viteConfig = ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return defineConfig({
    css: {
      modules: {
        exportGlobals: true,
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
             @use "${commonStylesPath}.scss" as common; 
          `,
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
          outputFilePath: `${commonStylesPath}.d.ts`,
        },
      }),
      eslint(),
    ],
    test: {
      setupFiles: [setupTestsPath, `${globalStylesPath}.scss`],
      environment: "jsdom",
      css: true,
      mockReset: true,
    },
    server: {
      host: true,
      port: parseInt(process.env.VITE_CLIENT_PORT_DEV!),
    },
    preview: {
      host: true,
      port: parseInt(process.env.VITE_CLIENT_PORT_PROD!),
    },
  });
};

export default viteConfig;

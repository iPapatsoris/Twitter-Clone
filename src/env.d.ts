/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

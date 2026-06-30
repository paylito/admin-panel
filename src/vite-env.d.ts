/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cross-origin API base URL. Empty → relative `/admin/*` (dev proxy / same origin). */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

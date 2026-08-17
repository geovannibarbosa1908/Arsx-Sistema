/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENNETWORKING_API_URL: string
  readonly VITE_OPENNETWORKING_PORTAL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

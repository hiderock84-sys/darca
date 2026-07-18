/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages では https://<user>.github.io/darca/ で配信するため、
// 本番ビルド時のみ base をリポジトリ名（/darca/）にする。開発時は '/'。
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/darca/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
}))

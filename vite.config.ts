/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 本番ビルドは相対パス（'./'）にして、GitHub Pages・raw.githack など
// 配信先のパスに依存せずアセットを解決できるようにする。開発時は '/'。
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? './' : '/',
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

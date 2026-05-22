// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 判断是否为 GitHub Pages 部署
const isGitHubPages = process.env.DEPLOY_ENV === 'github'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 关键：改成你的仓库名 FireBird
  base: isGitHubPages ? '/FireBird/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    host: '0.0.0.0',
    port: 5189
  }
})
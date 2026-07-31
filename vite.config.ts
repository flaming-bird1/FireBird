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
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心框架
          'vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus UI 库（体积较大，单独拆包）
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          // Markdown 相关库（marked + highlight.js + DOMPurify）
          'markdown': ['marked', 'highlight.js', 'dompurify'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5189
  }
})
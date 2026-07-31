<template>
  <div class="resume-page">
    <Header></Header>

    <!-- 页面横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>📄 个人简历</h1>
        <p class="subtitle">烈焰飞鸟 · 全栈开发 · AI应用探索者</p>
      </div>
    </div>

    <!-- Markdown 简历内容 -->
    <div class="resume-content">
      <div class="container">
        <div class="markdown-card">
          <MarkdownViewer :file-path="resumePath" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from "@/components/Header.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

// 动态拼接 base 路径，兼容 GitHub Pages 部署（/FireBird/）和本地开发
const resumePath = computed(() => `${import.meta.env.BASE_URL}articles/resume.md`)
</script>

<style scoped lang="scss">
.resume-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(126, 107, 143, 0.06) 0%,
    rgba(255, 255, 255, 1) 30%
  );
}

/* 页面横幅 */
.banner {
  margin-top: 67px;
  padding: 3rem 20px 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  background: linear-gradient(
    135deg,
    rgba(110, 95, 125, 0.6) 0%,
    rgba(126, 107, 143, 0.5) 50%,
    rgba(150, 135, 165, 0.3) 100%
  );

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    font-family: "STKaiti", "KaiTi", serif;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

/* 简历内容 */
.resume-content {
  padding: 2rem 0 4rem;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
}

.markdown-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 1rem;
  min-height: 60vh;
}

/* 重写 MarkdownViewer 内部样式使其更好看 */
:deep(.markdown-container) {
  padding: 30px 40px;
  max-width: 100%;
  min-height: auto;
}

:deep(.markdown-content h1) {
  font-size: 2rem;
  margin: 1.5rem 0 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #7E6B8F;
  padding-bottom: 0.5rem;
}

:deep(.markdown-content h2) {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.8rem;
  color: #2c3e50;
  border-left: 4px solid #7E6B8F;
  padding-left: 12px;
}

:deep(.markdown-content h3) {
  font-size: 1.2rem;
  margin: 1.2rem 0 0.6rem;
  color: #2c3e50;
}

:deep(.markdown-content h4) {
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
}

:deep(.markdown-content p) {
  margin-bottom: 0.8rem;
  line-height: 1.8;
  color: #444;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #7E6B8F;
  padding: 0.8rem 1.2rem;
  margin: 1rem 0;
  background: rgba(126, 107, 143, 0.05);
  border-radius: 0 8px 8px 0;
  color: #555;
}

:deep(.markdown-content code) {
  background: rgba(126, 107, 143, 0.08);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #7E6B8F;
  font-family: 'Consolas', 'Monaco', monospace;
}

:deep(.markdown-content pre) {
  background: #f5f3f8;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border-left: 3px solid #7E6B8F;
}

:deep(.markdown-content pre code) {
  background: transparent;
  padding: 0;
  color: #2c3e50;
}

:deep(.markdown-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}

:deep(.markdown-content th) {
  background: rgba(126, 107, 143, 0.1);
  color: #2c3e50;
  font-weight: 600;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(126, 107, 143, 0.2);
}

:deep(.markdown-content td) {
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(126, 107, 143, 0.15);
  color: #555;
}

:deep(.markdown-content tr:nth-child(even)) {
  background: rgba(126, 107, 143, 0.03);
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 0.8rem 0;
  padding-left: 1.8rem;
}

:deep(.markdown-content li) {
  margin: 0.4rem 0;
  line-height: 1.6;
}

:deep(.markdown-content hr) {
  border: none;
  border-top: 2px solid rgba(126, 107, 143, 0.15);
  margin: 1.5rem 0;
}

:deep(.markdown-content a) {
  color: #7E6B8F;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

:deep(.markdown-content img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .banner h1 {
    font-size: 2rem;
  }

  :deep(.markdown-container) {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  :deep(.markdown-container) {
    padding: 15px;
  }
}
</style>

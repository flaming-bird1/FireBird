<!-- PDFViewer.vue -->
<template>
  <div class="simple-pdf-viewer">
    <div class="pdf-controls">
      <button @click="downloadPDF" class="download-btn">📥 下载PDF</button>
      <button @click="openInNewTab" class="open-btn">🔗 在新窗口打开</button>
    </div>

    <div class="pdf-frame-container">
      <iframe
          :src="pdfSrc"
          width="100%"
          height="800px"
          frameborder="0"
          class="pdf-frame"
          @load="onIframeLoad"
          @error="onIframeError"
      ></iframe>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载PDF...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state">
      <p>⚠️ PDF加载失败</p>
      <a :href="props.filePath" target="_blank" class="pdf-link">
        请点击这里下载查看
      </a>
    </div>

    <!-- 备用下载链接 -->
    <div class="pdf-fallback">
      <a :href="props.filePath" target="_blank" class="pdf-link">
        📄 如果无法显示PDF，请点击这里下载查看
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  filePath: string
}

const props = defineProps<Props>()

const loading = ref(true)
const error = ref(false)

// 计算PDF源路径，添加查看参数
const pdfSrc = computed(() => {
  return `${props.filePath}#view=FitH&toolbar=1&navpanes=1`
})

const onIframeLoad = () => {
  loading.value = false
  error.value = false
  console.log('PDF加载成功')
}

const onIframeError = () => {
  loading.value = false
  error.value = true
  console.error('PDF加载失败')
}

const downloadPDF = () => {
  const link = document.createElement('a')
  link.href = props.filePath
  link.download = props.filePath.split('/').pop() || 'document.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const openInNewTab = () => {
  window.open(props.filePath, '_blank')
}
</script>

<style scoped>
.simple-pdf-viewer {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  position: relative;
}

.pdf-controls {
  background: #f5f5f5;
  padding: 12px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #eaeaea;
}

button {
  background: #7E6B8F;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

button:hover {
  background: #6D8B74;
  transform: translateY(-1px);
}

.download-btn {
  background: #6D8B74;
}

.open-btn {
  background: #7E6B8F;
}

.pdf-frame-container {
  background: #f9f9f9;
  padding: 0;
  min-height: 600px;
  position: relative;
}

.pdf-frame {
  display: block;
  border: none;
  width: 100%;
  height: 800px;
}

/* 加载状态样式 */
.loading-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7E6B8F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #7E6B8F;
  font-weight: 500;
  margin: 0;
}

/* 错误状态样式 */
.error-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.error-state p {
  color: #f56c6c;
  margin-bottom: 12px;
  font-weight: 500;
}

.pdf-fallback {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #eaeaea;
  background: #fff8e1;
}

.pdf-link {
  color: #7E6B8F;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.pdf-link:hover {
  color: #6D8B74;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pdf-frame {
    height: 500px;
  }

  .pdf-controls {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    text-align: center;
  }
}
</style>
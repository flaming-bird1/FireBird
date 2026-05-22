<template>
  <div class="markdown-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else class="markdown-content" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import DOMPurify from 'dompurify'

// 定义 props 类型
interface Props {
  filePath: string
}

const props = defineProps<Props>()

// 定义 emits
const emit = defineEmits<{
  headingsUpdated: [headings: Array<{id: string, text: string, level: number}>]
}>()

// 响应式数据
const renderedMarkdown: Ref<string> = ref('')
const loading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)

// 配置 marked - 使用类型断言解决类型错误
marked.setOptions({
  highlight: function(code: string, lang: string): string {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-'
} as any) // 使用类型断言忽略类型检查

// 提取标题函数
const extractHeadings = (html: string): Array<{id: string, text: string, level: number}> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const headings: Array<{id: string, text: string, level: number}> = []

  headingElements.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1))
    const text = heading.textContent || ''
    let id = heading.id

    // 如果没有id，根据文本内容生成一个
    if (!id) {
      id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')
      heading.id = id
    }

    headings.push({ id, text, level })
  })

  return headings
}

// 渲染 Markdown 函数
const renderMarkdown = async (path: string): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    // 从 public 目录加载 Markdown 文件
    const response = await fetch(path)
    if (!response.ok) throw new Error('文件加载失败')

    const markdownText = await response.text()

    // 渲染并净化 Markdown
    const rawHtml = await marked.parse(markdownText)
    const cleanHtml = DOMPurify.sanitize(rawHtml)
    renderedMarkdown.value = cleanHtml

    // 提取标题并发送给父组件
    const headings = extractHeadings(cleanHtml)
    emit('headingsUpdated', headings)
  } catch (err) {
    error.value = (err as Error).message
    console.error('加载 Markdown 失败:', err)
  } finally {
    loading.value = false
  }
}

// 生命周期和监听
onMounted(() => {
  if (props.filePath) {
    renderMarkdown(props.filePath)
  }
})

watch(() => props.filePath, (newPath: string) => {
  if (newPath) {
    renderMarkdown(newPath)
  }
})
</script>

<style scoped>
.markdown-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 80vh;
}

.markdown-content {
  line-height: 1.6;
}

:deep(.markdown-content pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  margin: 1rem 0;
}

:deep(.markdown-content code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: #f6f8fa;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.9em;
}

:deep(.markdown-content pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.markdown-content img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 1rem 0;
}

:deep(.markdown-content h1) {
  font-size: 2rem;
  margin: 2rem 0 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #7E6B8F;
  padding-bottom: 0.5rem;
  scroll-margin-top: 100px; /* 为目录跳转添加偏移 */
}

:deep(.markdown-content h2) {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: #2c3e50;
  scroll-margin-top: 100px;
}

:deep(.markdown-content h3) {
  font-size: 1.25rem;
  margin: 1.25rem 0 0.75rem;
  color: #2c3e50;
  scroll-margin-top: 100px;
}

:deep(.markdown-content h4) {
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
  scroll-margin-top: 100px;
}

:deep(.markdown-content h5) {
  font-size: 1rem;
  margin: 0.8rem 0 0.4rem;
  color: #2c3e50;
  scroll-margin-top: 100px;
}

:deep(.markdown-content h6) {
  font-size: 0.9rem;
  margin: 0.6rem 0 0.3rem;
  color: #2c3e50;
  scroll-margin-top: 100px;
}

:deep(.markdown-content p) {
  margin-bottom: 1rem;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #7E6B8F;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
  background: rgba(126, 107, 143, 0.05);
  padding: 0.5rem 1rem;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

:deep(.markdown-content li) {
  margin: 0.5rem 0;
}

:deep(.markdown-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

:deep(.markdown-content th),
:deep(.markdown-content td) {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

:deep(.markdown-content th) {
  background-color: #f8f9fa;
  font-weight: bold;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #f56c6c;
}

.loading {
  color: #7E6B8F;
}



</style>
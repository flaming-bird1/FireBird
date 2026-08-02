<template>
  <div class="markdown-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else class="markdown-content" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type Ref } from 'vue'
import { marked, type Tokens, type Token } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import DOMPurify from 'dompurify'

// 定义 props 类型
interface Props {
  /** Markdown 文件路径（public 目录下） */
  filePath?: string
  /** 直接传入的 Markdown 原文（优先于 filePath） */
  markdownContent?: string
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

// HTML 转义（用于 mermaid 代码安全嵌入 DOM）
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// 配置 marked：v5+ 已移除 setOptions 的 highlight 选项，改用自定义 renderer 实现代码高亮
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: Tokens.Code): string => {
  // mermaid 图表：输出专用容器，待 DOM 挂载后由 mermaid 渲染成 SVG
  if (lang === 'mermaid') {
    return `<div class="mermaid">${escapeHtml(text)}</div>`
  }
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language }).value
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
}
marked.use({ renderer })

// marked 自定义扩展：==荧光高亮== → <mark>
const markExtension = {
  name: 'mark',
  level: 'inline',
  start(src: string): number | void {
    return src.indexOf('==')
  },
  tokenizer(src: string) {
    const rule = /^==([^=]+)==/
    const match = rule.exec(src)
    if (match) {
      return {
        type: 'mark',
        raw: match[0],
        text: match[1],
      } as unknown as Token
    }
    return undefined
  },
  renderer(token: Token) {
    const text = (token as { text?: string }).text ?? ''
    return `<mark>${text}</mark>`
  },
}
marked.use({ extensions: [markExtension] })

// 解析文章内图片路径：外链不动，本地路径补上部署 base 前缀 / 基于 md 所在目录解析
const resolveImageUrl = (src: string): string => {
  // 外链或内联资源不处理
  if (/^(https?:|data:|blob:)/i.test(src)) return src

  // 以 / 开头的绝对路径：拼上部署 base 前缀（如 GitHub Pages 的 /FireBird/）
  if (src.startsWith('/')) {
    const base = import.meta.env.BASE_URL
    return `${base.replace(/\/?$/, '/')}${src.replace(/^\//, '')}`
  }

  // 相对路径（如 images/xxx.png、./images/xxx.png）：基于当前 md 文件所在目录解析
  const mdUrl = props.filePath ? new URL(props.filePath, window.location.href) : window.location.href
  return new URL(src, mdUrl).href
}

// 渲染 mermaid 图表：动态加载 mermaid 库（按需加载，避免增大主包体积）
const renderMermaidDiagrams = async (): Promise<void> => {
  const mermaidEls = document.querySelectorAll<HTMLElement>('.markdown-content .mermaid')
  if (mermaidEls.length === 0) return

  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
  })

  let index = 0
  for (const el of mermaidEls) {
    try {
      const { svg } = await mermaid.render(`mermaid-diagram-${index++}`, el.textContent || '')
      el.innerHTML = svg
    } catch (err) {
      el.textContent = `⚠️ Mermaid 渲染失败：${(err as Error).message}`
      console.error('Mermaid 渲染失败:', err)
    }
  }
}

// 渲染 Markdown 函数：source 为内容或路径，isContent 为 true 时直接使用传入内容（不 fetch）
const renderMarkdown = async (source: string, isContent = false): Promise<void> => {
  let hasMermaid = false
  try {
    loading.value = true
    error.value = null

    let markdownText = source
    if (!isContent) {
      // 从 public 目录加载 Markdown 文件
      const response = await fetch(source)
      if (!response.ok) throw new Error('文件加载失败')
      markdownText = await response.text()
    }

    // 渲染并净化 Markdown
    const rawHtml = await marked.parse(markdownText)
    const cleanHtml = DOMPurify.sanitize(rawHtml)

    // 提取标题（同时为缺失 id 的标题生成并注入 id）
    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanHtml, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headings: Array<{id: string, text: string, level: number}> = []

    headingElements.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1))
      const text = heading.textContent || ''
      let id = heading.id

      // 如果没有id，根据文本内容生成一个，并写回 DOM
      if (!id) {
        id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')
        heading.setAttribute('id', id)
      }

      headings.push({ id, text, level })
    })

    // 使用注入 id 后的 HTML 作为实际渲染内容
    // 同时重写图片路径，保证本地图片能正确加载
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (src) {
        img.setAttribute('src', resolveImageUrl(src))
      }
    })

    // 记录是否包含 mermaid 图表
    hasMermaid = doc.querySelectorAll('.mermaid').length > 0

    renderedMarkdown.value = doc.body.innerHTML

    // 发送标题列表给父组件
    emit('headingsUpdated', headings)
  } catch (err) {
    error.value = (err as Error).message
    console.error('加载 Markdown 失败:', err)
  } finally {
    loading.value = false
  }

  // 等待 DOM 挂载完成后再渲染 mermaid 图表
  if (hasMermaid) {
    await nextTick()
    await renderMermaidDiagrams()
  }
}

// 生命周期和监听
onMounted(() => {
  if (props.markdownContent !== undefined) {
    renderMarkdown(props.markdownContent, true)
  } else if (props.filePath) {
    renderMarkdown(props.filePath)
  }
})

watch(() => props.filePath, (newPath: string | undefined) => {
  if (newPath) {
    renderMarkdown(newPath)
  }
})

watch(() => props.markdownContent, (newContent: string | undefined) => {
  if (newContent !== undefined) {
    renderMarkdown(newContent, true)
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

/* mermaid 图表容器 */
:deep(.markdown-content .mermaid) {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0;
  padding: 1rem 0;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

:deep(.markdown-content .mermaid svg) {
  max-width: 100%;
  height: auto;
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

/* 荧光高亮标记（==文字==） */
:deep(.markdown-content mark) {
  background: linear-gradient(transparent 55%, rgba(255, 214, 64, 0.6) 55%);
  color: inherit;
  padding: 0 0.15em;
  border-radius: 2px;
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
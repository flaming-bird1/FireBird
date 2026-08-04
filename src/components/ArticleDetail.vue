<!-- ArticleDetail.vue -->
<template>
  <div class="article-detail-page app-page">
    <Header></Header>
    <!--    <header-tech-vision></header-tech-vision>-->

    <div class="app-main" ref="mainRef">
    <!-- 文章内容 -->
    <div class="content">
      <div class="article-container">
        <!-- 左侧博客内容 -->
        <div class="article-left">
          <!-- 返回按钮 -->
          <button class="back-button" @click="goBack">
            ← 返回首页
          </button>

          <!-- 文章标题 -->
          <h1 class="article-title">{{ article?.title }}</h1>

          <!-- 文章元信息 -->
          <div class="article-meta">
            <time class="article-date">{{ formatDate(article?.date) }}</time>
            <div class="article-tags">
              <span
                  v-for="tag in article?.tags"
                  :key="tag"
                  class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 使用 MarkdownViewer 组件 -->
          <div class="article-content">
            <!-- PDF 文件 -->
            <PDFViewer
                v-if="article?.fileType === 'pdf' && article?.fileName"
                :file-path="getFilePath(article)"
            />

            <!-- 或者使用简单版本 -->
            <!-- <SimplePDFViewer
              v-if="article?.fileType === 'pdf' && article?.fileName"
              :file-path="getFilePath(article)"
            /> -->

            <!-- Markdown 文件 -->
            <MarkdownViewer
                v-else-if="article && article.fileName"
                :file-path="getFilePath(article)"
                @headings-updated="handleHeadingsUpdate"
            />
          </div>

          <!-- 文章底部 -->
          <div class="article-footer">
            <div class="action-buttons">
              <button class="like-button" :class="{ liked: isLiked }" @click="likeArticle">
                {{ isLiked ? '💜 已点赞' : '👍 点赞' }}
              </button>
              <button class="share-button" @click="shareArticle">🔗 分享</button>
            </div>
            <!-- 点赞爱心飞出层 -->
            <div class="like-burst" v-if="burstHearts.length > 0">
              <span
                  v-for="heart in burstHearts"
                  :key="heart.id"
                  class="burst-heart"
                  :style="{
                    left: heart.left + '%',
                    animationDelay: heart.delay + 'ms',
                    fontSize: heart.size + 'px',
                  }"
              >{{ heart.symbol }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 个人简介 -->
          <section class="widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="@/assets/images/logo.png" alt="作者头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">心怀热爱，永远是当打之年！</p>
              <div class="author-stats">
                <div class="stat-item">
                  <span class="stat-number">{{total}}</span>
                  <span class="stat-label">文章</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">8</span>
                  <span class="stat-label">标签</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">4</span>
                  <span class="stat-label">分类</span>
                </div>
              </div>
              <!-- 社交连接-->
              <div class="social-links">
                <a href="https://github.com/flaming-bird1" target="_blank" class="social-link">GitHub</a>
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">Gitee</a>
                <a href="https://blog.csdn.net/lieyanfeiniao_?spm=1000.2115.3001.10640" target="_blank"
                   class="social-link">CSDN</a>
              </div>
            </div>
          </section>

          <!-- 文章目录 -->
          <section class="widget toc-widget" v-if="headings.length > 0">
            <div class="toc-container">
              <h3 class="toc-title">📑 文章目录</h3>
              <nav class="toc-nav">
                <ul class="toc-list">
                  <li
                      v-for="heading in headings"
                      :key="heading.id"
                      :class="['toc-item', `toc-level-${heading.level}`]"
                  >
                    <a
                        :href="`#${heading.id}`"
                        class="toc-link"
                        :class="{ active: activeHeadingId === heading.id }"
                        @click.prevent="scrollToHeading(heading.id)"
                    >
                      {{ heading.text }}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './Header.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getArticleById, getAllArticles } from '@/data/articles'
import type { Article } from '@/types/article'
import PDFViewer from "@/components/PDFViewer.vue";

const route = useRoute()
const router = useRouter()

// 获取 base 路径（GitHub Pages 需要 /FireBird/）
const baseUrl = import.meta.env.BASE_URL

// 响应式数据
const article = ref<Article | null>(null)
const headings = ref<Array<{id: string, text: string, level: number}>>([])
const activeHeadingId = ref<string>('')
const total = ref(0)
// 主体滚动容器引用
const mainRef = ref<HTMLElement | null>(null)

// 滚动处理：高亮当前激活的目录项
const handleScroll = () => {
  if (headings.value.length === 0) return
  const container = mainRef.value
  if (!container) return

  const containerTop = container.getBoundingClientRect().top
  const scrollPosition = containerTop + 120 // 提前激活的偏移量

  // 找到当前激活的标题
  let currentActiveId = ''
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)
    if (element && element.getBoundingClientRect().top <= scrollPosition) {
      currentActiveId = heading.id
      break
    }
  }

  if (currentActiveId) {
    activeHeadingId.value = currentActiveId
  }
}

// 获取文件路径（添加 base 路径）
const getFilePath = (article: Article) => {
  if (!article.fileName) return ''

  // 去掉开头的 /（如果有）
  const cleanPath = article.fileName.startsWith('/') ? article.fileName.slice(1) : article.fileName

  if (article.fileType === 'pdf') {
    return `${baseUrl}articles/${cleanPath}.pdf`
  }
  return `${baseUrl}articles/${cleanPath}.md`
}

// 加载文章元数据
const loadArticle = () => {
  const articleId = route.params.id as string
  if (!articleId) return

  const articleResponse = getArticleById(articleId)
  if (articleResponse.success && articleResponse.article) {
    article.value = articleResponse.article
  }
}

// 处理标题更新
const handleHeadingsUpdate = (newHeadings: Array<{id: string, text: string, level: number}>) => {
  headings.value = newHeadings
  // 设置第一个标题为默认激活
  if (newHeadings.length > 0) {
    activeHeadingId.value = newHeadings[0].id
  }
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  const container = mainRef.value
  if (element && container) {
    const top = element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 100 // 考虑固定头部的高度
    container.scrollTo({
      top,
      behavior: 'smooth'
    })
    activeHeadingId.value = id
  }
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 点赞文章（带爱心飞出效果）
const isLiked = ref(false)
const burstHearts = ref<Array<{id: number, left: number, delay: number, size: number, symbol: string}>>([])
let heartId = 0

const likeArticle = () => {
  isLiked.value = !isLiked.value
  console.log('点赞文章:', article.value?.id)

  // 生成飞出的爱心
  const symbols = ['❤', '💜', '✨', '💖', '⭐']
  const hearts = Array.from({length: 8}, () => ({
    id: heartId++,
    left: 30 + Math.random() * 40,
    delay: Math.random() * 180,
    size: 14 + Math.random() * 14,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
  }))
  burstHearts.value = hearts
  setTimeout(() => {
    burstHearts.value = []
  }, 1500)
}

// 分享文章
const shareArticle = () => {
  console.log('分享文章:', article.value?.id)
}

// 组件挂载时加载文章
onMounted(() => {
  loadArticle()
  total.value = getAllArticles().total
  mainRef.value?.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  mainRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
}

.content {
  min-height: calc(100vh - 67px);
  padding: 2rem 0 4rem;
}

.article-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  /* 左右固定 3:1 比例：任何设备下比例一致，右侧栏始终在右侧 */
  grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  gap: 2rem;
  /* 默认 stretch：让侧边栏与文章列等高，目录 sticky 才有足够空间吸顶 */
}

/* 左侧文章内容样式 */
.article-left {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 0; /* 防止宽代码块/表格撑破 grid 轨道而挤压侧栏 */
}

.back-button {
  background: #7E6B8F;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: #6D8B74;
}

.article-title {
  font-size: 2.2rem;
  color: #bb95dd;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-date {
  color: #7E6B8F;
  font-weight: 500;
  font-size: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7E6B8F;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-content {
  margin: 2rem 0;
  min-height: 400px;
}

.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.like-button, .share-button {
  background: #7E6B8F;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.like-button:hover, .share-button:hover {
  background: #9D8DB0;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(126, 107, 143, 0.35);
}

.like-button:active, .share-button:active {
  transform: translateY(-1px) scale(0.97);
}

/* 点赞后状态 */
.like-button.liked {
  background: linear-gradient(135deg, #e77fb0, #b06ab3);
  box-shadow: 0 6px 18px rgba(231, 127, 176, 0.45);
}

/* 点赞爱心飞出 */
.like-burst {
  position: relative;
  height: 0;
  pointer-events: none;
  z-index: 10;
}

.burst-heart {
  position: absolute;
  bottom: 24px;
  animation: heart-float 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  color: #e77fb0;
  text-shadow: 0 0 8px rgba(231, 127, 176, 0.6);
  opacity: 0;
}

@keyframes heart-float {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.4);
  }
  20% {
    opacity: 1;
    transform: translate(0, -16px) scale(1.15);
  }
  100% {
    opacity: 0;
    transform: translate(0, -120px) scale(0.85);
  }
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0; /* 防止被 grid 轨道压缩时内容溢出 */
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 3px solid #7E6B8F;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.author-bio {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
  line-height: 1.5;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #7E6B8F;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* 社交链接 */
.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.social-link {
  color: #7E6B8F;
  text-decoration: none;
  padding: 0.8rem;
  border: 1px solid rgba(126, 107, 143, 0.3);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  font-weight: 500;
}

.social-link:hover {
  background: #7E6B8F;
  color: white;
  border-color: #7E6B8F;
  transform: translateY(-1px);
}

/* 目录卡片：随滚动吸顶固定在 Header 下方 */
.toc-widget {
  position: sticky;
  top: 90px;
}

.toc-container {
  max-height: 400px;
  overflow-y: auto;
}

.toc-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7E6B8F;
  font-weight: 600;
}

.toc-nav {
  padding: 0.5rem 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.3rem 0;
  line-height: 1.4;
}

.toc-level-1 {
  margin-left: 0;
  font-weight: 600;
}

.toc-level-2 {
  margin-left: 0.8rem;
  font-weight: 500;
}

.toc-level-3 {
  margin-left: 1.6rem;
  font-size: 0.9rem;
}

.toc-level-4 {
  margin-left: 2.4rem;
  font-size: 0.85rem;
}

.toc-level-5 {
  margin-left: 3.2rem;
  font-size: 0.8rem;
}

.toc-level-6 {
  margin-left: 4rem;
  font-size: 0.75rem;
}

.toc-link {
  color: #666;
  text-decoration: none;
  display: block;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.toc-link:hover {
  color: #7E6B8F;
  background: rgba(126, 107, 143, 0.05);
  border-left-color: #7E6B8F;
}

.toc-link.active {
  color: #7E6B8F;
  background: rgba(126, 107, 143, 0.1);
  border-left-color: #7E6B8F;
  font-weight: 500;
}

/* 大屏：间距更宽松（比例不变） */
@media (min-width: 1367px) {
  .article-container {
    gap: 3rem;
  }
}

/* 小屏：收紧间距与内边距，左右 3:1 比例保持一致 */
@media (max-width: 768px) {
  .article-container {
    padding: 0 12px;
    gap: 1rem;
  }

  .article-left {
    padding: 1.25rem;
  }

  .widget {
    padding: 1rem;
  }
}

</style>
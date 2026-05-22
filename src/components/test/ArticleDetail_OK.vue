<!-- ArticleDetail.vue -->
<template>
  <div class="article-detail-page">
    <Header></Header>

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
            <MarkdownViewer
                v-if="article && article.fileName"
                :file-path="`/articles/${article.fileName}.md`"
                @headings-updated="handleHeadingsUpdate"
            />
          </div>

          <!-- 文章底部 -->
          <div class="article-footer">
            <div class="action-buttons">
              <button class="like-button" @click="likeArticle">👍 点赞</button>
              <button class="share-button" @click="shareArticle">🔗 分享</button>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 个人简介 -->
          <section class="widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="../../assets/images/logo.png" alt="作者头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">心怀热爱，永远是当打之年！</p>
              <div class="author-stats">
                <div class="stat-item">
                  <span class="stat-number">25</span>
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
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">GitHub</a>
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">Gitee</a>
                <a href="https://blog.csdn.net/lieyanfeiniao_?spm=1000.2115.3001.10640" target="_blank"
                   class="social-link">CSDN</a>
              </div>
            </div>
          </section>

          <!-- 文章目录 -->
          <section class="widget" v-if="headings.length > 0">
            <div
                class="toc-container"
                :class="{fixed: isTocFixed}"
            >
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
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../Header.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getArticleById } from '@/data/articles.ts'
import type { Article } from '@/types/article.ts'

const route = useRoute()
const router = useRouter()

// 响应式数据
const article = ref<Article | null>(null)
const headings = ref<Array<{id: string, text: string, level: number}>>([])
const activeHeadingId = ref<string>('')
// 控制目录固定
const isTocFixed = ref(false)
const tocOffsetTop = ref(0)

// 计算目录的初始位置
const calculateTocPosition = () => {
  const tocElement = document.querySelector('.toc-container') as HTMLElement
  if (tocElement) {
    const rect = tocElement.getBoundingClientRect()
    tocOffsetTop.value = rect.top + window.scrollY
  }
}
// 修改滚动处理函数
const handleScroll = () => {
  if (headings.value.length === 0) return

  const scrollPosition = window.scrollY + 120 // 提前激活的偏移量

  // 找到当前激活的标题
  let currentActiveId = ''
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)
    if (element && element.offsetTop <= scrollPosition) {
      currentActiveId = heading.id
      break
    }
  }

  if (currentActiveId) {
    activeHeadingId.value = currentActiveId
  }

  // 处理目录固定
  const scrollY = window.scrollY
  const headerHeight = 67 // Header的高度
  const fixedThreshold = tocOffsetTop.value - headerHeight - 20

  isTocFixed.value = scrollY > fixedThreshold
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
  if (element) {
    const offsetTop = element.offsetTop - 100 // 考虑固定头部的高度
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    activeHeadingId.value = id
  }
}

// // 监听滚动，更新激活的标题
// const handleScroll = () => {
//   if (headings.value.length === 0) return
//
//   const scrollPosition = window.scrollY + 120 // 提前激活的偏移量
//
//   // 找到当前激活的标题
//   let currentActiveId = ''
//   for (let i = headings.value.length - 1; i >= 0; i--) {
//     const heading = headings.value[i]
//     const element = document.getElementById(heading.id)
//     if (element && element.offsetTop <= scrollPosition) {
//       currentActiveId = heading.id
//       break
//     }
//   }
//
//   if (currentActiveId) {
//     activeHeadingId.value = currentActiveId
//   }
// }

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

// 点赞文章
const likeArticle = () => {
  console.log('点赞文章:', article.value?.id)
}

// 分享文章
const shareArticle = () => {
  console.log('分享文章:', article.value?.id)
}

// 组件挂载时加载文章
onMounted(() => {
  loadArticle()
  window.addEventListener('scroll', handleScroll)

  // 在下一个tick计算位置，确保DOM已渲染
  nextTick(() => {
    setTimeout(() => {
      calculateTocPosition()
    }, 100)
  })
})
// 监听窗口大小变化，重新计算位置
onMounted(() => {
  window.addEventListener('resize', calculateTocPosition)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
}

.content {
  min-height: 100vh;
  margin-top: 20px ;
  padding: 4rem 0;
}

.article-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

/* 左侧文章内容样式 */
.article-left {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  color: #7a5c95;
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
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.like-button:hover, .share-button:hover {
  background: #6D8B74;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(126, 107, 143, 0.3);
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

/* 目录样式 */
.toc-container {
  max-height: 400px;
  overflow-y: auto;
  position: sticky; /* 添加粘性定位 */
  top: 90px; /* Header高度 + 一些间距 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}
/* 当目录固定时的样式 */
.toc-container.fixed {
  position: fixed; /* 添加固定定位 */
  top: 87px; /* 固定时的顶部间距 */
  max-height: calc(100vh - 107px); /* 视口高度减去顶部和底部间距 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100;
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

/* 滚动条样式 */
.toc-container::-webkit-scrollbar {
  width: 4px;
}

.toc-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.toc-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.toc-container::-webkit-scrollbar-thumb:hover {
  background: #7E6B8F;
}
</style>
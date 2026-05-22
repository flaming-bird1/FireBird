<template>
  <div class="home-page">
    <Header></Header>
    <!--    <header-tech-vision></header-tech-vision>-->
    <!--   横幅-->
    <div class="banner">
      <!-- 国风背景元素 -->
      <div class="chinese-bg-elements">
        <div class="mountain-left"></div>
        <div class="mountain-right"></div>
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="bamboo bamboo-1"></div>
        <div class="bamboo bamboo-2"></div>
      </div>

      <div class="banner-content">
        <h1>烈焰飞鸟的个人博客</h1>
        <p class="typing-text">不负青春 不负韶华</p>
        <div class="chinese-border"></div>
      </div>
    </div>
    <!--    内容-->
    <div class="content">
      <div class="container">
        <!--        左侧主要内容-->
        <div class="main-content">
          <section class="section animate-on-scroll">
            <div class="section-header">
              <div class="chinese-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M3,18H21V16H3V18M3,13H21V11H3V13M3,6V8H21V6H3Z"/>
                </svg>
              </div>
              <h2 class="section-title">最新文章</h2>
            </div>
            <div class="articles-list">
              <article
                  class="article-item animate-on-scroll"
                  v-for="article in recentArticles"
                  :key="article.id"
                  @click="goToArticle(article.id)"
              >
                <!-- 文章封面 -->
                <div class="article-cover">
                  <div class="chinese-corner tl"></div>
                  <div class="chinese-corner tr"></div>
                  <div class="chinese-corner bl"></div>
                  <div class="chinese-corner br"></div>
                  <img :src="getImageUrl(article.cover)"
                       :alt="article.title"
                       class="cover-image">
                </div>
                <div class="article-card">
                  <!--   包裹所有元信息（日期、标签等），便于统一控制样式或布局。-->
                  <div class="article-meta">
                    <time class="article-date">
                      <span class="date-icon">📅</span> {{ formatDate(article.date) }}
                    </time>
                    <span class="article-tags">
                      <span
                          class="tag"
                          v-for="tag in article.tags"
                          :key="tag"
                      >
                        <span class="tag-icon">🏷️</span> {{ tag }}
                      </span>
                    </span>
                  </div>
                  <h3 class="article-title">
                    <span class="title-decoration">「</span>
                    {{ article.title }}
                    <span class="title-decoration">」</span>
                  </h3>
                  <p class="article-description">{{ article.description }}</p>
                  <div class="article-footer">
                    <span class="read-more">
                      阅读更多
                      <span class="arrow-icon">→</span>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
        <!--       右侧边栏  -->
        <div class="sidebar">
          <!-- 个人简介 -->
          <section class="widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="@/assets/images/logo.png" alt="作者头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">追求·奋斗·拼搏·热爱</p>
              <div class="author-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ total }}</span>
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

          <!-- 新增：国风名言组件 -->
          <section class="widget chinese-quote">
            <div class="quote-content">
              <div class="quote-icon">「</div>
              <p class="quote-text">博观而约取，厚积而薄发</p>
              <div class="quote-icon">」</div>
              <p class="quote-author">—— 苏轼</p>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="wave"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import Header from '@/components/Header.vue'
import {getAllArticles} from '@/data/articles.ts'
import type {Article} from '@/types/article'
import {useScrollAnimation} from "@/utils/animations.ts";

const router = useRouter()
const {initScrollAnimation, destroy} = useScrollAnimation()

// 获取 base 路径（GitHub Pages 需要 /FireBird/）
const baseUrl = import.meta.env.BASE_URL


// 处理图片路径（支持 undefined）
const getImageUrl = (path: string | undefined) => {
  // 如果路径为空或未定义，返回默认图片
  if (!path) {
    return `${baseUrl}images/default-cover.jpg`
  }
  // 如果已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // 如果以 @ 开头，直接返回（由 Vite 处理）
  if (path.startsWith('@')) {
    return path
  }
  // 去掉开头的 /（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // 添加 base 路径
  return `${baseUrl}${cleanPath}`
}

// 响应式数据
const recentArticles = ref<Article[]>([])
let total = ref(0)

// 初始化数据
onMounted(() => {
  const articlesData = getAllArticles()
  recentArticles.value = articlesData.articles
  total.value = articlesData.total

  // 添加滚动动画 - 使用异步确保数据渲染完成
  setTimeout(() => {
    initScrollAnimation()
  }, 200)
})

onUnmounted(() => {
  destroy()
})

// 跳转到文章详情
const goToArticle = (id: string) => {
  router.push(`/article/${id}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.home-page {
  background: transparent;
  min-height: 100vh;
}

/* 国风横幅样式 */
.banner {
  margin-top: 67px;
  padding: 0 20px;
  height: calc(100vh - 67px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
      135deg,
      rgba(110, 95, 125, 0.4) 0%, /* 深紫色变体 */ rgba(126, 107, 143, 0.3) 50%, /* 主色调 #7E6B8F */ rgba(150, 135, 165, 0.2) 100% /* 浅紫色变体 */
  );
}

/* 国风背景元素 */
.chinese-bg-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.mountain-left {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 200px;
  background: linear-gradient(to top, rgba(126, 107, 143, 0.6) 0%, transparent 100%);
  clip-path: polygon(0% 100%, 100% 100%, 50% 0%);
  opacity: 0.4;
}

.mountain-right {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 250px;
  height: 180px;
  background: linear-gradient(to top, rgba(126, 107, 143, 0.5) 0%, transparent 100%);
  clip-path: polygon(0% 100%, 100% 100%, 60% 0%);
  opacity: 0.4;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 20%;
  left: 10%;
  animation: float 20s infinite linear;
}

.cloud-2 {
  width: 150px;
  height: 50px;
  top: 30%;
  right: 15%;
  animation: float 25s infinite linear reverse;
}

.cloud-3 {
  width: 80px;
  height: 30px;
  top: 40%;
  left: 20%;
  animation: float 18s infinite linear;
}

.bamboo {
  position: absolute;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to top, rgba(126, 107, 143, 0.8), rgba(161, 145, 178, 0.6));
}

.bamboo-1 {
  left: 20%;
  height: 150px;
  transform: rotate(5deg);
}

.bamboo-2 {
  right: 25%;
  height: 120px;
  transform: rotate(-5deg);
}

@keyframes float {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(20px) translateY(-10px);
  }
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}


.banner h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-family: "STKaiti", "KaiTi", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 3px;
}

.typing-text {
  font-size: 1.8rem;
  min-height: 2.5rem;
  overflow: hidden;
  border-right: 4px solid rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  width: 240px;
  margin: 1.5rem auto 0;
  animation: typing 3.5s steps(7, end), blink-caret 0.75s step-end infinite;
  font-family: "STKaiti", "KaiTi", serif;
  color: rgba(255, 255, 255, 0.95);
}

.chinese-border {
  width: 300px;
  height: 4px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9), transparent);
  margin: 2rem auto 0;
  position: relative;
}

.chinese-border::before,
.chinese-border::after {
  content: '卍';
  position: absolute;
  top: -15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
}

.chinese-border::before {
  left: 0;
}

.chinese-border::after {
  right: 0;
}

@keyframes typing {
  from {
    width: 0
  }
  to {
    width: 240px
  }
}

@keyframes blink-caret {
  from, to {
    border-color: transparent
  }
  50% {
    border-color: rgba(255, 255, 255, 0.9)
  }
}

/* 内容区域 */
.content {
  min-height: 100vh;
  padding: 4rem 0;
  background: transparent;
}

.container {
  max-width: 1170px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

/* 文章列表样式 */
.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chinese-icon {
  color: #7E6B8F;
  font-size: 1.5rem;
}

.section-title {
  font-size: 1.8rem;
  color: #7E6B8F;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7E6B8F;
  font-family: "STKaiti", "KaiTi", serif;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60px;
  height: 3px;
  background: #7E6B8F;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-item {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(126, 107, 143, 0.2);
  position: relative;
}

.article-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(126, 107, 143, 0.25);
  border-color: #7E6B8F;
}

.article-cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(245, 245, 245, 0.8);
}

.chinese-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #7E6B8F;
  z-index: 2;
}

.tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-item:hover .cover-image {
  transform: scale(1.05);
}

.article-card {
  padding: 1.5rem;
  position: relative;
}

.article-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #7E6B8F, #9D8DB0);
  border-radius: 2px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.date-icon, .tag-icon {
  margin-right: 5px;
}

.article-date {
  display: flex;
  align-items: center;
  color: #7E6B8F;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7E6B8F;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid rgba(126, 107, 143, 0.2);
  display: flex;
  align-items: center;
}

.article-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  font-family: "STKaiti", "KaiTi", serif;
}

.title-decoration {
  color: #7E6B8F;
  font-family: "SimSun", serif;
}

.article-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  color: #7E6B8F;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: "STKaiti", "KaiTi", serif;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.article-item:hover .read-more {
  color: #9D8DB0;
}

.article-item:hover .arrow-icon {
  transform: translateX(5px);
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.widget {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.15);
  border: 1px solid rgba(126, 107, 143, 0.2);
}

.author-card {
  text-align: center;
}


.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.95);
  margin: 0 auto;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 1.3rem;
  color: #7E6B8F;
  margin-bottom: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.author-bio {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
  border-left: 3px solid #7E6B8F;
  padding-left: 10px;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  color: #7E6B8F;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #7E6B8F;
  font-family: "STKaiti", "KaiTi", serif;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "STKaiti", "KaiTi", serif;
}

.social-link:hover {
  background: #7E6B8F;
  color: white;
  border-color: #7E6B8F;
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.2rem;
}

/* 国风名言组件 */
.chinese-quote {
  background: linear-gradient(135deg, rgba(126, 107, 143, 0.1), rgba(126, 107, 143, 0.05));
  border-left: 5px solid #7E6B8F;
}

.quote-content {
  text-align: center;
}

.quote-icon {
  font-size: 2rem;
  color: #7E6B8F;
  font-family: "SimSun", serif;
  line-height: 1;
}

.quote-text {
  font-size: 1.2rem;
  color: #7E6B8F;
  margin: 1rem 0;
  font-family: "STKaiti", "KaiTi", serif;
  line-height: 1.6;
}

.quote-author {
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

/* 底部装饰 */
.bottom-decoration {
  position: relative;
  height: 100px;
  overflow: hidden;
  margin-top: -50px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(transparent, rgba(126, 107, 143, 0.8));
  clip-path: ellipse(50% 100% at 50% 100%);
}

/* 滚动动画样式 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.9s ease-out;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.animate-on-scroll.animate-out {
  opacity: 0;
  transform: translateY(30px);
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  .article-item {
    grid-template-columns: 250px 1fr;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 50vh;
    margin-top: 60px;
  }

  .banner h1 {
    font-size: 2.5rem;
  }

  .banner p {
    font-size: 1.4rem;
    width: 180px;
    animation: typing 2.5s steps(7, end), blink-caret 0.75s step-end infinite;
  }

  .chinese-seal {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    top: -30px;
  }

  @keyframes typing {
    from {
      width: 0
    }
    to {
      width: 180px
    }
  }

  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 15px;
  }

  .sidebar {
    order: -1;
  }

  .article-item {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .article-cover {
    height: 200px;
  }

  .cover-image {
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 480px) {
  .banner {
    height: 40vh;
    margin-top: 55px;
    padding: 0 15px;
  }

  .banner h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .banner p {
    font-size: 1.2rem;
    width: 150px;
    animation: typing 2s steps(7, end), blink-caret 0.75s step-end infinite;
  }

  .chinese-seal {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
    top: -25px;
  }

  @keyframes typing {
    from {
      width: 0
    }
    to {
      width: 150px
    }
  }

  .content {
    padding: 2rem 0;
  }

  .container {
    padding: 0 10px;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .article-card {
    padding: 1rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .article-title {
    font-size: 1.2rem;
  }

  .author-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .social-links {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .social-link {
    flex: 1;
    min-width: 80px;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .banner h1 {
    font-size: 1.8rem;
  }

  .banner p {
    font-size: 1rem;
    width: 130px;
  }

  @keyframes typing {
    from {
      width: 0
    }
    to {
      width: 130px
    }
  }

  .widget {
    padding: 1rem;
  }

  .article-cover {
    height: 150px;
  }
}
</style>
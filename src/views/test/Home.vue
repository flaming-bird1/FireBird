<template>
  <div class="home-page">
    <Header></Header>
    <!--   横幅-->
    <div class="banner">
      <div class="banner-content">
        <h1>烈焰飞鸟的个人博客</h1>
        <p class="typing-text">不负青春 不负韶华</p>
      </div>
    </div>
    <!--    内容-->
    <div class="content">
      <div class="container">
        <!--        左侧主要内容-->
        <div class="main-content">
          <section class="section animate-on-scroll">
            <h2 class="section-title">最新文章</h2>
            <div class="articles-list">
              <article
                  class="article-item animate-on-scroll"
                  v-for="article in recentArticles"
                  :key="article.id"
                  @click="goToArticle(article.id)"
              >
                <!--              文章封面-->
                <div class="article-cover">
                  <img :src="article.cover"
                       :alt="article.title"
                       class="cover-image">
                  <!--  <div class="cover-image">dd</div>-->
                </div>
                <div class="article-card">
                  <!--   包裹所有元信息（日期、标签等），便于统一控制样式或布局。-->
                  <div class="article-meta">
                    <time class="article-date">{{ formatDate(article.date) }}</time>
                    <span class="article-tags">
                      <span
                          class="tag"
                          v-for="tag in article.tags"
                          :key="tag"
                      >{{ tag }}</span>
                    </span>
                  </div>
                  <h3 class="article-title"> {{ article.title }}</h3>
                  <p class="article-description">{{ article.description }}</p>
                  <div class="article-footer">
                    <span class="read-more">阅读更多 →</span>
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
              <p class="author-bio">心怀热爱，永远是当打之年！</p>
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
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import Header from '@/components/Header.vue'
import {getAllArticles, getAllTags} from '@/data/articles.ts'
import type {Article} from '@/types/article'
import {useScrollAnimation} from "@/utils/animations.ts";

const router = useRouter()
const {initScrollAnimation, destroy} = useScrollAnimation()

// 响应式数据
const recentArticles = ref<Article[]>([])
let total = ref(0)

// 初始化数据
onMounted(() => {
  const articlesData = getAllArticles()
  recentArticles.value = articlesData.articles
  // 获取总数据
  total.value = articlesData.total
  // console.log(recentArticles.value)

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

.banner {
  margin-top: 67px; /* 头部固定高度 */
  /*padding: 67px 20px 0;*/
  /*margin-top: 67px; /* 头部高度，但会遮挡头部 */
  padding: 0 20px;
  height: calc(100vh - 67px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /*弹性项目将沿垂直方向（从上到下）排列*/
  text-align: center;
  color: white;

  position: relative;
  overflow: hidden;
  /*  background: rgba(75, 0, 130, 0.3);*/
  /* 渐变遮罩背景 */
  background: linear-gradient(
      135deg,
      rgba(110, 95, 125, 0.4) 0%, /* 深紫色变体 */
      rgba(126, 107, 143, 0.3) 50%, /* 主色调 #7E6B8F */
      rgba(150, 135, 165, 0.2) 100% /* 浅紫色变体 */
  );
}

.banner::before {
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  /*background: rgba(0, 0, 0, 0.3); /* 只在内容区域添加遮罩 */
  /*backdrop-filter: blur(5px); /* 毛玻璃效果 */
}

.banner h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px; /* 字符间距 */
}

/**
 * 创建一个名为 typing 的动画，它将元素从左到右显示。
 * margin-top: 1.5rem;设置 <p> 标签顶部的外边距为 1.5rem，用于与上方元素拉开距离。
 * min-height: 2.5rem;设置 <p> 标签的最小高度为 2.5rem，确保即使文本内容较少，也能保持一定高度（避免布局抖动）。
 * overflow: hidden;隐藏超出 <p> 标签范围的内容，配合后续的打字效果，让未显示的文字暂时隐藏。
 * border-right: 2px solid rgba(255, 255, 255, 0.75);在 <p> 标签右侧添加一个 2px 宽的白色半透明边框，模拟打字时的光标。
 * white-space: nowrap;强制文本在一行内显示，不换行（确保打字效果是横向逐字展开，而非换行）。
 * animation: typing 3.5s steps(7, end), blink-caret 0.75s step-end infinite;同时应用两个动画：
    * typing：时长 3.5 秒，通过 steps(7, end) 定义 “7 步完成动画”（即逐字显示 7 个字符），实现打字机逐字输出的效果。
    * blink-caret：时长 0.75 秒，通过 step-end infinite 定义 “步进式闪烁且无限循环”，实现光标闪烁的效果。
 */
.banner p {
  font-size: 1.8rem;
  /*margin-top: 1.5rem;*/
  min-height: 2.5rem;
  overflow: hidden;
  border-right: 4px solid rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  width: 240px; /* 根据文字实际宽度设置 */
  margin: 1.5rem auto 0; /* 水平居中 */
  animation: typing 3.5s steps(7, end), blink-caret 0.75s step-end infinite;
}

/*打字机逐字显示动画*/
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
    border-color: rgba(255, 255, 255, 0.75)
  }
}

/* 内容区域 */
.content {
  min-height: 100vh;
  padding: 4rem 0;
}

.container {
  max-width: 1170px; /* 最大宽度为1200px（在大屏幕上限制内容宽度） */
  margin: 0 auto; /* 水平居中（左右外边距自动） */
  padding: 0 20px; /* 左右内边距20px（防止内容紧贴屏幕边缘） */
  display: grid; /* 启用CSS Grid布局 */
  grid-template-columns: 1fr 350px; /* 定义两列：第一列占剩余空间(1fr)，第二列固定350px */
  gap: 3rem; /* 网格间隙为3rem（列与列之间的间距） */
  align-items: start; /* 网格项顶部对齐（避免内容拉伸对齐） */
}

/* 文章列表样式 */
.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  color: #c5a7df;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7E6B8F;
}

.articles-list {
  display: flex; /* 启用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列（纵向布局） */
  gap: 1.5rem; /* 子元素之间的间距为 1.5rem */
}

.article-item {
  display: grid; /* 启用Grid布局 */
  grid-template-columns: 300px 1fr; /* 两列布局：封面固定300px，内容占剩余空间 */
  gap: 1.5rem; /* 列间距1.5rem */
  background: white; /* 白色背景 */
  border-radius: 12px; /* 圆角12px */
  overflow: hidden; /* 隐藏子元素超出圆角的部分 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
  transition: all 0.3s ease; /* 所有属性变化时添加0.3秒过渡动画 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
}

.article-item:hover {
  transform: translateY(-2px); /* 悬停时向上移动2像素*/
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.2); /* 悬停时阴影变浅 */
}

/* 文章封面样式 */
.article-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f5f5f5; /* 可选：添加背景色便于调试 */
}

.cover-image {
  /*margin-left: 2rem;*/
  width: 100%;
  object-fit: contain; /* 保持图片比例，完整显示在容器中 */
}

.article-card {
  background: #e1d8e8; /* 背景色 */
  border-radius: 12px; /* 圆角12像素（柔和的边角） */
  padding: 1.5rem; /* 内边距1.5rem（内容与边框的间距） */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 轻微阴影（提升立体感） */
  transition: all 0.3s ease; /* 所有属性变化时启用0.3秒平滑过渡 */
  cursor: pointer; /* 鼠标悬停时显示手型指针（暗示可点击） */
}


.article-meta {
  display: flex; /* 启用 Flexbox 布局 */
  justify-content: space-between; /* 子元素两端对齐，中间自动分配空间 */
  align-items: center; /* 子元素垂直居中 */
  margin-bottom: 1rem; /* 底部外边距 1rem（与下方内容间隔） */
  font-size: 0.9rem; /* 字体大小缩小为 0.9rem */
}

.article-date {
  color: black;
  font-size: 1rem; /* 字体大小与根元素相同 */
}

.article-tags {
  display: flex;
  gap: 0.5rem; /* 标签之间的间距为 0.5rem */
}

.tag {
  background: rgba(126, 107, 143, 0.1); /* 半透明淡紫色背景 */
  color: black; /* 黑色文字 */
  padding: 0.2rem 0.6rem; /* 上下0.2rem，左右0.6rem的内边距 */
  border-radius: 12px; /* 圆角效果 */
  font-size: 1rem; /* 字体大小与根元素相同 */
}

.article-title {
  font-size: 1.3rem; /* 字体大小为1.3倍根元素（通常约20.8px） */
  color: #2c3e50; /* 深蓝灰色文字 */
  margin-bottom: 0.8rem; /* 底部外边距0.8rem（与下方内容间隔） */
  line-height: 1.4; /* 行高为字体的1.4倍，增强可读性 */
}

.article-description {
  color: #666; /* 中灰色文字 */
  line-height: 1.6; /* 行高为字体的1.6倍 */
  margin-bottom: 1rem; /* 底部外边距1rem */
}

.article-footer {
  display: flex; /* 启用Flexbox布局 */
  justify-content: flex-end; /* 子元素靠右对齐 */
}

.read-more {
  color: #7E6B8F;
  font-weight: 500;
  transition: color 0.3s ease;
}

.article-card:hover .read-more {
  color: #6D8B74;
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
}

.author-bio {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.author-stats {
  display: flex;
  justify-content: space-around; /* 均等分 */
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
}

.social-link:hover {
  background: #7E6B8F;
  color: white;
  border-color: #7E6B8F;
}


/* 添加滚动动画样式 */
.animate-on-scroll {
  opacity: 0; /* 初始透明度为0，素初始状态是隐藏的 */
  /**
    * all：对所有可过渡的 CSS 属性应用动画效果
    * ease-out：缓动函数，动画开始时快，结束时慢
   */
  transform: translateY(30px); /* 添加初始位置  */
  transition: all 0.9s ease-out;
}

/* 进入视口时的动画状态 */
.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 离开视口时的动画状态（向上滚动） */
.animate-on-scroll.animate-out {
  opacity: 0;
  transform: translateY(30px);
}


/* 在现有样式后添加响应式样式 */

/* 大屏幕平板 (1024px 及以下) */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr 300px; /* 侧边栏稍微变窄 */
    gap: 2rem;
  }

  .article-item {
    grid-template-columns: 250px 1fr; /* 封面图片变窄 */
  }
}

/* 平板设备 (768px 及以下) */
@media (max-width: 768px) {
  .banner {
    height: 50vh; /* 降低横幅高度 */
    margin-top: 60px; /* 对应Header的响应式高度 */
  }

  .banner h1 {
    font-size: 2.5rem;
  }

  .banner p {
    font-size: 1.4rem;
    width: 180px;
    animation: typing 2.5s steps(7, end), blink-caret 0.75s step-end infinite;
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
    grid-template-columns: 1fr; /* 单列布局 */
    gap: 2rem;
    padding: 0 15px;
  }

  .sidebar {
    order: -1; /* 侧边栏移到主内容前面 */
  }

  .article-item {
    grid-template-columns: 1fr; /* 单列布局 */
    gap: 0;
  }

  .article-cover {
    height: 200px; /* 固定封面高度 */
  }

  .cover-image {
    height: 100%;
    object-fit: cover; /* 保持图片比例并填充容器 */
  }
}

/* 手机设备 (480px 及以下) */
@media (max-width: 480px) {
  .banner {
    height: 40vh;
    margin-top: 55px; /* 对应Header的响应式高度 */
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
    flex-direction: column; /* 垂直排列 */
    align-items: flex-start;
    gap: 0.5rem;
  }

  .article-title {
    font-size: 1.2rem;
  }

  .author-stats {
    flex-direction: column; /* 垂直排列统计信息 */
    gap: 1rem;
  }

  .social-links {
    flex-direction: row; /* 水平排列社交链接 */
    flex-wrap: wrap; /* 允许换行 */
    justify-content: center;
  }

  .social-link {
    flex: 1; /* 平均分配宽度 */
    min-width: 80px; /* 最小宽度 */
    padding: 0.6rem;
  }
}

/* 小屏幕手机 (360px 及以下) */
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
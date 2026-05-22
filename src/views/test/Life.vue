<template>
  <div class="life-page">
    <Header></Header>

    <!-- 页面横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>我的生活</h1>
        <p class="typing-text">记录生活中的每一个精彩瞬间</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="life-content">
      <div class="container">
        <!-- 左侧内容区 - 朋友圈时间线 -->
        <div class="main-content">
          <!-- 动态时间线 -->
          <section class="timeline-section">
            <h2 class="section-title">生活动态</h2>
            <div class="timeline">
              <div
                  class="moment-card"
                  v-for="moment in lifeMoments"
                  :key="moment.id"
              >
                <!-- 用户信息 -->
                <div class="moment-header">
                  <div class="user-avatar">
                    <img src="@/assets/images/logo.png" alt="头像">
                  </div>
                  <div class="user-info">
                    <h3 class="username">烈焰飞鸟</h3>
                    <div class="moment-meta">
                      <time class="time">{{ formatTime(moment.createTime) }}</time>
                      <span class="location" v-if="moment.location">{{ moment.location }}</span>
                    </div>
                  </div>
                </div>

                <!-- 动态内容 -->
                <div class="moment-content">
                  <!-- 描述行文字 -->
                  <div class="content-text">
                    <p v-for="(paragraph, idx) in moment.content.split('\n').filter(p => p.trim())" :key="idx">
                      {{ paragraph }}
                    </p>
                  </div>

                  <!--   图片展示区域-->
                  <div class="image-grid">
                    <div
                        class="image-item"
                        v-for="(image, index) in moment.images"
                        :key="index"
                        @click="viewImage(moment.images, index)"
                    >
                      <img :src="image" :alt="'动态图片'+(index+1)">
                    </div>
                  </div>
                </div>


              </div>

            </div>

          </section>
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
              <p class="author-bio">追求·奋斗·拼搏·热爱</p>
              <div class="author-stats">
                <div class="stat-item">
                  <!--                  <span class="stat-number">{{ total }}</span>-->
                  <!--                  <span class="stat-label">文章</span>-->
                  <span class="stat-number">{{ lifeStats.totalMoments }}</span>
                  <span class="stat-label">动态</span>
                </div>
                <div class="stat-item">
                  <!--                  <span class="stat-number">4</span>-->
                  <!--                  <span class="stat-label">分类</span>-->
                  <span class="stat-number">{{ lifeStats.totalPhotos }}</span>
                  <span class="stat-label">照片</span>
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

    <!-- 图片查看器 -->
    <div class="image-viewer" v-if="showImageViewer" @click="closeImageViewer">
      <div class="viewer-content">
        <button class="viewer-close" @click="closeImageViewer">×</button>
        <img :src="currentImage" alt="查看图片">
        <button class="nav-btn prev" @click.stop="prevImage">‹</button>
        <button class="nav-btn next" @click.stop="nextImage">›</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import Header from '@/components/Header.vue'
import {
  getLifeMoments,
  getLifeAlbums,
  getLifeStats,
  getLifeMomentsSorted,
} from '@/data/life'
import type {LifeMoment} from '@/types/life'

// 响应式数据
const lifeMoments = ref<LifeMoment[]>([])
const lifeAlbums = ref(getLifeAlbums())
const lifeStats = ref(getLifeStats())
const showImageViewer = ref(false)
const currentImages = ref<string[]>([])
const currentImageIndex = ref(0)

// 计算属性
const currentImage = computed(() => {
  return currentImages.value[currentImageIndex.value]
})

// 初始化数据
onMounted(() => {
  // 为每个动态添加显示评论的状态
  /**
   * .map()：数组方法，遍历原数组并返回新数组
   * ...moment：展开运算符，复制原动态对象的所有属性
   * showComments: false：为每个动态对象添加一个新属性
   */
  lifeMoments.value = getLifeMomentsSorted().map(moment => ({
    // id: moment.id,
    // location: moment.location,
    // content: moment.content,
    // images: moment.images,
    // createTime: moment.createTime,
    ...moment, // 浅拷贝
    showComments: false
  }))
})

const viewImage = (images: string[], index: number) => {
  currentImages.value = images
  currentImageIndex.value = index
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
  currentImages.value = []
  currentImageIndex.value = 0
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value > 0
      ? currentImageIndex.value - 1
      : currentImages.value.length - 1
}

const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value < currentImages.value.length - 1
      ? currentImageIndex.value + 1
      : 0
}

const formatTime = (timeString: string) => {
  const time = new Date(timeString)
  const now = new Date()
  const diff = now.getTime() - time.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  return time.toLocaleDateString('zh-CN', {
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
      rgba(110, 95, 125, 0.4) 0%, /* 深紫色变体 */ rgba(126, 107, 143, 0.3) 50%, /* 主色调 #7E6B8F */ rgba(150, 135, 165, 0.2) 100% /* 浅紫色变体 */
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
  /* 设置字体大小为 1.8rem（相对于根元素的字体大小） */
  font-size: 1.8rem;

  /* 设置最小高度为 2.5rem，确保元素有足够的空间显示内容 */
  min-height: 2.5rem;

  /* 隐藏超出元素尺寸的内容（用于动画中逐步显示文字） */
  overflow: hidden;

  /* 添加一个右侧边框，模拟打字机光标效果 */
  /* 4px 宽的实线边框，颜色为半透明白色（RGBA: 红255, 绿255, 蓝255, 透明度0.75） */
  border-right: 4px solid rgba(255, 255, 255, 0.75);

  /* 禁止文字换行，确保文字在同一行显示（动画需要单行滚动） */
  white-space: nowrap;

  /* 动态计算宽度：字体大小（1.8rem） × 13.3（约24个字符的宽度） */
  /* 用于限制文字的显示区域，配合动画实现逐步显示的效果 */
  width: calc(1.8rem * 13.3);

  /* 设置外边距：上1.5rem，左右自动（水平居中），下0 */
  margin: 1.5rem auto 0;

  /* 应用名为 typingCycle 的动画，持续10秒，无限循环播放 */
  animation: typingLoop 9s steps(13, end) infinite;
}

/*打字机逐字显示动画*/
@keyframes typingLoop {
  0% {
    width: 0; /* 开始打字 */
  }
  40% {
    width: calc(1.8rem * 13.3); /* 打字完成 */
  }
  60% {
    width: calc(1.8rem * 13.3); /* 保持显示 */
  }
  100% {
    width: 0; /* 重新开始 */
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

/* 主内容区样式 */
.life-content {
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

.section-title {
  font-size: 1.8rem;
  color: #c5a7df;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7E6B8F;
}

/* 动态卡片样式 */
.moment-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.moment-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden; /*内容超出其指定的宽度和高度时，将隐藏超出的部分，不显示滚动条。*/
  flex-shrink: 0; /* 设置 flex-shrink 属性为 0，表示该元素不会因为 flex-basis 的值而缩小。*/
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填充整个容器，并保持其原始比例。*/
}

.user-info {
  flex: 1; /* 设置 flex: 1，表示该元素会填充剩余空间，但前提是该元素有剩余空间。*/
}

.username {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.3rem 0;
}

.moment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.moment-content {
  margin-bottom: 1rem;
}

.content-text {
  margin: 0 0 1rem 0;

  p {
    margin: 0 0 0.8rem 0;
    line-height: 1.6;
    color: #333;
    text-indent: 2em;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 图片展示区样式 */
.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 关键：创建两个等宽的列 */
  gap: 8px; /* 图片间距 */
  margin-top: 1rem; /* 与上方文字的间距 */
}

.image-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.image-item img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.image-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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


/* 图片查看器样式 */
.image-viewer {
  position: fixed; /* 固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex; /* 弹性布局 */
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px); /* 模糊效果 */
}

.viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 确保图片填充整个容器，并保持其原始比例。*/
  border-radius: 8px;
}

.viewer-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.viewer-close:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #c5a7df;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease; /* 添加过渡效果 */
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.nav-btn.prev {
  left: 20px;
}

.nav-btn.next {
  right: 20px;
}


/* 在现有样式后添加响应式样式 */

/* 大屏幕平板 (1024px 及以下) */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  .banner h1 {
    font-size: 3rem;
  }

  .banner p {
    font-size: 1.6rem;
    width: calc(1.6rem * 13.3);
  }
}

/* 平板设备 (768px 及以下) */
@media (max-width: 768px) {
  .banner {
    height: 50vh;
    margin-top: 60px;
  }

  .banner h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .banner p {
    font-size: 1.4rem;
    width: calc(1.4rem * 13.3);
    animation: typingLoop 7s steps(13, end) infinite;
  }

  @keyframes typingLoop {
    0% {
      width: 0;
    }
    40% {
      width: calc(1.4rem * 13.3);
    }
    60% {
      width: calc(1.4rem * 13.3);
    }
    100% {
      width: 0;
    }
  }

  .life-content {
    padding: 2rem 0;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 15px;
  }

  .sidebar {
    order: -1;
  }

  .moment-card {
    padding: 1.2rem;
    margin-bottom: 1rem;
  }

  .moment-header {
    gap: 0.8rem;
  }

  .user-avatar {
    width: 45px;
    height: 45px;
  }

  .username {
    font-size: 1rem;
  }

  .moment-meta {
    flex-direction: column;
    gap: 0.3rem;
  }
}

/* 手机设备 (480px 及以下) */
@media (max-width: 480px) {
  .banner {
    height: 40vh;
    margin-top: 55px;
    padding: 0 15px;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: 1.2rem;
    width: calc(1.2rem * 13.3);
    border-right: 3px solid rgba(255, 255, 255, 0.75);
    animation: typingLoop 6s steps(13, end) infinite;
  }

  @keyframes typingLoop {
    0% {
      width: 0;
    }
    40% {
      width: calc(1.2rem * 13.3);
    }
    60% {
      width: calc(1.2rem * 13.3);
    }
    100% {
      width: 0;
    }
  }

  .life-content {
    padding: 1.5rem 0;
  }

  .container {
    padding: 0 10px;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .moment-card {
    padding: 1rem;
    border-radius: 8px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
  }

  .content-text {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  /* 图片网格响应式 */
  .image-grid {
    grid-template-columns: 1fr; /* 单列布局 */
    gap: 6px;
  }

  .image-item:hover {
    transform: none; /* 移动端移除悬停效果 */
  }

  /* 图片查看器移动端优化 */
  .viewer-content {
    max-width: 95%;
    max-height: 95%;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .nav-btn.prev {
    left: 10px;
  }

  .nav-btn.next {
    right: 10px;
  }

  .viewer-close {
    top: -50px;
    right: -10px;
    font-size: 1.8rem;
  }
}

/* 小屏幕手机 (360px 及以下) */
@media (max-width: 360px) {
  .banner h1 {
    font-size: 1.8rem;
  }

  .banner p {
    font-size: 1rem;
    width: calc(1rem * 13.3);
    min-height: 2rem;
  }

  @keyframes typingLoop {
    0% {
      width: 0;
    }
    40% {
      width: calc(1rem * 13.3);
    }
    60% {
      width: calc(1rem * 13.3);
    }
    100% {
      width: 0;
    }
  }

  .widget {
    padding: 1rem;
  }

  .author-avatar {
    width: 60px;
    height: 60px;
  }

  .author-name {
    font-size: 1.1rem;
  }

  .author-bio {
    font-size: 0.9rem;
  }
}
</style>
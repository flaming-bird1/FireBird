<template>
  <div class="life-page app-page">
    <Header></Header>

    <div class="app-main">
    <!-- 页面横幅（与首页统一风格） -->
    <div class="banner">
      <!-- 光晕背景 -->
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
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
        <h1 class="banner-title">我的生活</h1>
        <p class="typing-text">记录生活中的每一个精彩瞬间</p>
        <div class="chinese-border"></div>
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

                  <!-- 图片展示区域 -->
                  <div class="image-grid">
                    <div
                        class="image-item"
                        v-for="(image, index) in moment.images"
                        :key="index"
                        @click="viewImage(moment.images, index)"
                    >
                      <img :src="getImageUrl(image)" :alt="'动态图片'+(index+1)">
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
                  <span class="stat-number">{{ lifeStats.totalMoments }}</span>
                  <span class="stat-label">动态</span>
                </div>
                <div class="stat-item">
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

const lifeMoments = ref<LifeMoment[]>([])
const lifeAlbums = ref(getLifeAlbums())
const lifeStats = ref(getLifeStats())
const showImageViewer = ref(false)
const currentImages = ref<string[]>([])
const currentImageIndex = ref(0)

// 获取 base 路径（GitHub Pages 需要 /FireBird/）
const baseUrl = import.meta.env.BASE_URL

// 处理图片路径
const getImageUrl = (path: string) => {
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

// 计算属性
const currentImage = computed(() => {
  return currentImages.value[currentImageIndex.value]
})

// 初始化数据
onMounted(() => {
  lifeMoments.value = getLifeMomentsSorted().map(moment => ({
    ...moment,
    showComments: false
  }))
})

const viewImage = (images: string[], index: number) => {
  // 处理图片路径
  const processedImages = images.map(img => getImageUrl(img))
  currentImages.value = processedImages
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

/* 国风横幅（与首页统一风格） */
.banner {
  padding: 0 20px;
  height: calc(100vh - 67px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  /* 渐变流动背景 */
  background: linear-gradient(
      135deg,
      rgba(110, 95, 125, 0.55) 0%,
      rgba(126, 107, 143, 0.4) 30%,
      rgba(150, 135, 165, 0.3) 65%,
      rgba(126, 107, 143, 0.5) 100%
  );
  background-size: 300% 300%;
  animation: fb-gradient-flow 16s ease infinite;
}

/* 光晕背景 */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  width: 440px;
  height: 440px;
  top: -140px;
  left: -100px;
  background: rgba(196, 181, 214, 0.35);
  animation: fb-breathe 7s ease-in-out infinite;
}

.glow-2 {
  width: 380px;
  height: 380px;
  bottom: -120px;
  right: -80px;
  background: rgba(155, 138, 174, 0.3);
  animation: fb-breathe 9s ease-in-out 2s infinite;
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

/* 标题：与首页统一为楷体 */
.banner h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-family: "STKaiti", "KaiTi", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 3px;
}

/* 标题入场动画（与首页统一） */
.banner-title {
  opacity: 0;
  animation: fb-fade-up 1s ease 0.2s forwards;
}

/* 副标题：与关于笔者页统一的循环打字效果与楷体 */
.banner p {
  font-size: 1.8rem;
  min-height: 2.5rem;
  overflow: hidden;
  border-right: 3px solid rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  width: 0;
  margin: 1.5rem auto 0;
  animation: typingLoop 6s steps(13, end) infinite;
  font-family: "STKaiti", "KaiTi", serif;
  color: rgba(255, 255, 255, 0.95);
}

/* 循环打字动画（与关于笔者页一致） */
@keyframes typingLoop {
  0% {
    width: 0;
  }
  40% {
    width: 100%;
  }
  60% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}

/* 装饰线（与首页统一） */
.chinese-border {
  width: 300px;
  height: 4px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9), transparent);
  margin: 2rem auto 0;
  position: relative;
  opacity: 0;
  animation: fb-fade-up 0.9s ease 1s forwards;
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

/* 主内容区样式 */
.life-content {
  min-height: calc(100vh - 67px);
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
.timeline {
  position: relative;
  padding-left: 26px;
}

/* 时间线装饰竖线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #7E6B8F, rgba(126, 107, 143, 0.15));
}

/* 时间线圆点 */
.moment-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  border: 1px solid rgba(126, 107, 143, 0.12);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease;
}

.moment-card::before {
  content: '';
  position: absolute;
  left: -25px;
  top: 26px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #7E6B8F;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px rgba(126, 107, 143, 0.2), 0 0 10px rgba(126, 107, 143, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.moment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(126, 107, 143, 0.22);
  border-color: rgba(126, 107, 143, 0.35);
}

.moment-card:hover::before {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(126, 107, 143, 0.25), 0 0 16px rgba(126, 107, 143, 0.6);
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
  border-radius: 6px;
}

.image-item img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.4s ease-in-out;
}

/* 图片 hover 遮罩 + 放大提示 */
.image-item::after {
  content: '⤢';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  background: rgba(126, 107, 143, 0.35);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.image-item:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 16px rgba(126, 107, 143, 0.35);
  z-index: 1;
}

.image-item:hover img {
  transform: scale(1.08);
}

.image-item:hover::after {
  opacity: 1;
}


/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 卡片外壳：与首页统一 */
.widget {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.15);
  border: 1px solid rgba(126, 107, 143, 0.2);
}

/* 个人简介：与首页统一的样式 */
.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  transition: transform 0.5s ease;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 14px rgba(126, 107, 143, 0.35);
  transition: transform 0.6s ease;
}

/* 头像外圈旋转装饰环 */
.author-avatar::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px dashed rgba(126, 107, 143, 0.45);
  animation: fb-spin 18s linear infinite;
  pointer-events: none;
}

.author-card:hover .author-avatar {
  transform: scale(1.06);
}

.author-card:hover .author-avatar img {
  transform: scale(1.1) rotate(5deg);
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
  animation: viewer-fade-in 0.3s ease;
}

@keyframes viewer-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: viewer-zoom-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes viewer-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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
    animation: typingLoop 5.5s steps(13, end) infinite;
  }

  /* 个人简介响应式（与首页一致） */
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

/* 平板设备 (768px 及以下) */
@media (max-width: 768px) {
  .banner {
    height: 50vh;
  }

  .banner h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .banner p {
    font-size: 1.4rem;
    animation: typingLoop 5s steps(13, end) infinite;
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
    padding: 0 15px;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: 1.2rem;
    animation: typingLoop 4.5s steps(13, end) infinite;
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
    min-height: 2rem;
    animation: typingLoop 4s steps(13, end) infinite;
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
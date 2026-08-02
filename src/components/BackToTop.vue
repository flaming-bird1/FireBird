<!-- 全局悬浮"返回顶部"按钮：紫灰渐变毛玻璃 + 进度环 + 悬停弹跳 + 点击涟漪 -->
<template>
  <button
    class="back-to-top"
    :class="{ visible: isVisible }"
    :title="progressText"
    :aria-label="progressText"
    @click="handleClick"
  >
    <!-- 进度环（渐变描边 + 发光） -->
    <svg class="progress-ring" viewBox="0 0 56 56" width="56" height="56">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a98fb8" />
          <stop offset="100%" stop-color="#7E6B8F" />
        </linearGradient>
      </defs>
      <circle class="ring-track" cx="28" cy="28" r="25" />
      <circle
        class="ring-bar"
        cx="28"
        cy="28"
        r="25"
        :style="{ strokeDashoffset: ringOffset }"
        :stroke="`url(#${gradientId})`"
      />
    </svg>

    <!-- 箭头图标（SVG 折线箭头，渲染统一） -->
    <span class="arrow-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path
          d="M12 19V5m-7 7 7-7 7 7"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <!-- 点击涟漪 -->
    <span v-if="rippleKey" :key="rippleKey" class="ripple"></span>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const isVisible = ref(false)
const progress = ref(0) // 0 ~ 1
const rippleKey = ref(0)

// SVG 渐变唯一 id（避免与页面其他元素冲突）
const gradientId = `fb-ring-grad-${Math.random().toString(36).slice(2, 8)}`

// 滚动容器：页面主体（.app-main 内部滚动）
let scrollTarget: HTMLElement | null = null
let observer: MutationObserver | null = null

const RING_CIRCUMFERENCE = 2 * Math.PI * 25

// 进度环偏移量
const ringOffset = computed(() =>
  RING_CIRCUMFERENCE * (1 - progress.value)
)

const progressText = computed(() =>
  `已阅读 ${Math.round(progress.value * 100)}%`
)

// 获取当前滚动容器
const findScrollTarget = (): HTMLElement | null => {
  const main = document.querySelector<HTMLElement>('.app-main')
  return main ?? document.documentElement
}

// 更新滚动进度
const handleScroll = () => {
  if (!scrollTarget) return
  const el = scrollTarget
  const scrollTop = el.scrollTop ?? 0
  const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
  progress.value = Math.min(1, scrollTop / maxScroll)
  isVisible.value = scrollTop > 300
}

// 平滑回到顶部
const scrollToTop = () => {
  if (!scrollTarget) return
  scrollTarget.scrollTo({ top: 0, behavior: 'smooth' })
}

// 点击：回顶 + 触发涟漪
const handleClick = () => {
  rippleKey.value = Date.now()
  scrollToTop()
}

// 绑定当前滚动容器（路由切换后 .app-main 会重新出现，需重绑）
const bindScroll = () => {
  scrollTarget?.removeEventListener('scroll', handleScroll)
  scrollTarget = findScrollTarget()
  scrollTarget?.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

onMounted(() => {
  bindScroll()
  // 监听 DOM 变化，路由切换后重新绑定新的滚动容器
  observer = new MutationObserver(() => {
    const main = document.querySelector('.app-main')
    if (main && main !== scrollTarget) {
      bindScroll()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  scrollTarget?.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 28px;
  bottom: 32px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 4px 16px rgba(126, 107, 143, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.85);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.back-to-top:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow:
    0 12px 30px rgba(126, 107, 143, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.back-to-top:active {
  transform: scale(0.94);
}

.back-to-top:focus-visible {
  outline: 2px solid #7E6B8F;
  outline-offset: 3px;
}

/* 悬停时的紫灰渐变底 */
.back-to-top::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #8f7ba3, #7E6B8F 60%, #6d5a80);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.back-to-top:hover::before {
  opacity: 1;
}

/* 进度环 */
.progress-ring {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(126, 107, 143, 0.18);
  stroke-width: 3.5;
}

.ring-bar {
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 3px rgba(126, 107, 143, 0.55));
  transition: stroke-dashoffset 0.25s ease, stroke 0.3s ease;
}

.back-to-top:hover .ring-bar {
  stroke: #ffffff;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
}

/* 箭头图标 */
.arrow-icon {
  z-index: 1;
  color: #7E6B8F;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.back-to-top:hover .arrow-icon {
  color: #ffffff;
  animation: arrow-bounce 0.8s ease infinite;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 点击涟漪 */
.ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(126, 107, 143, 0.35) 0%, transparent 70%);
  animation: back-top-ripple 0.6s ease-out forwards;
  transform: scale(0);
  z-index: 2;
}

@keyframes back-top-ripple {
  from { transform: scale(0.4); opacity: 0.9; }
  to { transform: scale(1.8); opacity: 0; }
}
</style>

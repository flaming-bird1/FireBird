<template>
  <div class="header" :class="{ scrolled: isScrolled }">
    <!-- 顶部阅读进度条 -->
    <div class="scroll-progress" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- 网站 Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <div class="logo-img">
            <img src="@/assets/images/logo.png" alt="logo">
          </div>
          <span class="logo-text">烈焰飞鸟的个人博客</span>
        </router-link>
      </div>

      <!-- 主导航（桌面端） -->
      <nav class="nav">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :active-class="item.exact ? '' : 'active'"
            :exact-active-class="item.exact ? 'active' : ''"
            @click="handleRipple"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- 移动端汉堡菜单按钮 -->
      <button
          class="menu-toggle"
          :class="{ open: menuOpen }"
          @click="toggleMenu"
          aria-label="菜单"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 移动端下拉菜单面板 -->
    <transition name="menu-fade">
      <div class="mobile-menu" v-if="menuOpen">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-menu-item"
            :active-class="item.exact ? '' : 'active'"
            :exact-active-class="item.exact ? 'active' : ''"
            @click="closeMenu"
        >
          {{ item.label }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'

// 导航配置
const navItems = [
  {label: '首页', path: '/', exact: true},
  {label: '生活', path: '/life', exact: false},
  {label: '考研痕迹', path: '/study', exact: false},
  {label: '函数绘图', path: '/math-graph', exact: false},
  {label: '简历', path: '/resume', exact: false},
  {label: '关于笔者', path: '/about', exact: false},
]

const isScrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

let scrollTarget: HTMLElement | null = null
let domObserver: MutationObserver | null = null

// 监听主体滚动：毛玻璃 + 阅读进度
const handleScroll = () => {
  if (!scrollTarget) return
  const el = scrollTarget
  isScrolled.value = el.scrollTop > 10
  const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
  progress.value = Math.min(100, (el.scrollTop / maxScroll) * 100)
}

// 绑定滚动容器（兼容路由懒加载）
const bindScroll = () => {
  scrollTarget?.removeEventListener('scroll', handleScroll)
  scrollTarget = document.querySelector('.app-main')
  scrollTarget?.addEventListener('scroll', handleScroll, {passive: true})
  handleScroll()
}

// 导航点击涟漪效果
const handleRipple = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`
  target.appendChild(ripple)
  setTimeout(() => ripple.remove(), 650)
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

onMounted(() => {
  bindScroll()
  // 路由切换后 .app-main 会重建，重新绑定
  domObserver = new MutationObserver(() => {
    const main = document.querySelector('.app-main')
    if (main && main !== scrollTarget) {
      bindScroll()
    }
  })
  domObserver.observe(document.body, {childList: true, subtree: true})
})

onUnmounted(() => {
  domObserver?.disconnect()
  scrollTarget?.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 67px;
  background-color: #7E6B8F;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: background-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease;
  /* 显式声明字体，避免继承宿主页面的字体导致风格不一致 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 滚动后毛玻璃效果 */
.header.scrolled {
  background-color: rgba(126, 107, 143, 0.86);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}

/* 顶部阅读进度条 */
.scroll-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #C4B5D6, #F0E6FF, #C4B5D6);
  box-shadow: 0 0 8px rgba(240, 230, 255, 0.6);
  transition: width 0.15s ease-out;
  z-index: 1002;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

/* Logo 样式 */
.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-link:hover {
  transform: scale(1.03);
}

.logo-img {
  display: flex;
  align-items: center;
}

.logo-img img {
  width: 42px;
  height: 42px;
  object-fit: contain;
  border-radius: 50%;
  transition: transform 0.6s ease, box-shadow 0.6s ease;
}

.logo-link:hover .logo-img img {
  transform: rotate(360deg);
  box-shadow: 0 0 14px rgba(240, 230, 255, 0.7);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* 导航栏样式 */
.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 4px;
  font-size: 1.15rem;
  font-weight: 500;
  color: #FFFFFF;
  text-decoration: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: color 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 4px;
}

.nav-item:hover {
  color: #F0E6FF;
  transform: translateY(-1px);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background-color: #F0E6FF;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(240, 230, 255, 0.8);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

.nav-item.active {
  color: #F0E6FF;
}

/* 点击涟漪（由 JS 动态创建，无 scoped 属性，必须使用全局样式） */
:global(.ripple) {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0);
  animation: fb-ripple 0.65s ease-out forwards;
  pointer-events: none;
}

/* 汉堡按钮（仅移动端显示） */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 2.5px;
  border-radius: 2px;
  background: #FFFFFF;
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.menu-toggle.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.menu-toggle.open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* 移动端菜单面板 */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px;
  background: rgba(126, 107, 143, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.mobile-menu-item {
  padding: 14px 12px;
  color: #FFFFFF;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s ease, padding-left 0.3s ease;
  text-align: center;
}

.mobile-menu-item:hover,
.mobile-menu-item.active {
  background: rgba(255, 255, 255, 0.15);
  padding-left: 18px;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .nav {
    gap: 20px;
  }

  .logo-text {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .header {
    height: 60px;
  }

  .container {
    padding: 0 16px;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  /* 桌面导航隐藏，显示汉堡菜单 */
  .nav {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 576px) {
  .header {
    height: 56px;
  }

  .container {
    padding: 0 12px;
  }

  .logo-text {
    font-size: 1.1rem;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logo-img img {
    width: 34px;
    height: 34px;
  }
}

@media (max-width: 400px) {
  .logo-text {
    font-size: 1rem;
    max-width: 140px;
  }
}
</style>

<template>
  <div class="header">
    <div class="container">
      <!-- 网站 Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <!-- 可以在此处启用 logo 图片 -->
          <!-- <div class="logo-img">
            <img src="@/assets/images/logo.png" alt="logo">
          </div> -->
          <span class="logo-text">烈焰飞鸟的个人博客</span>
        </router-link>
      </div>

      <!-- 主导航 -->
      <nav class="nav">
        <router-link to="/" class="nav-item" exact-active-class="active">
          首页
        </router-link>
        <router-link to="/life" class="nav-item" active-class="active">
          生活
        </router-link>
        <router-link to="/study" class="nav-item" active-class="active">
          考研痕迹
        </router-link>
        <router-link to="/about" class="nav-item" active-class="active">
          关于笔者
        </router-link>

        <!-- 下拉菜单（已注释，需要时启用） -->
        <!--
        <div class="dropdown">
          <router-link to="/life" class="nav-item dropdown-trigger" active-class="active">
            生活
            <span class="dropdown-arrow">▼</span>
          </router-link>
          <div class="dropdown-menu">
            <router-link to="/life/album" class="dropdown-item">
              📷 相册
            </router-link>
            <router-link to="/life/essay" class="dropdown-item">
              ✍️ 随笔
            </router-link>
          </div>
        </div>
        -->
      </nav>

      <!-- 移动端汉堡菜单按钮（可选扩展） -->
      <!-- <button class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 可以在这里添加响应式菜单的逻辑
// import { ref } from 'vue'
// const menuOpen = ref(false)
// const toggleMenu = () => menuOpen.value = !menuOpen.value
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
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.logo-img {
  display: flex;
  align-items: center;
}

.logo-img img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

/* 导航栏样式 */
.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-item {
  position: relative;
  padding: 6px 4px;
  font-size: 1.15rem;
  font-weight: 500;
  color: #FFFFFF;
  text-decoration: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: color 0.3s ease;
  white-space: nowrap;
}

.nav-item:hover {
  color: #F0E6FF;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background-color: #C4B5D6;
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

.nav-item.active {
  color: #F0E6FF;
}

/* 下拉菜单样式（优化后） */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 140px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  overflow: hidden;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  color: #333333;
  font-size: 0.95rem;
  text-decoration: none;
  border-bottom: 1px solid #F0F0F0;
  transition: all 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #7E6B8F;
  color: #FFFFFF;
  padding-left: 20px;
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

/* 平板设备 */
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

  .nav {
    gap: 16px;
  }

  .nav-item {
    font-size: 1.05rem;
  }
}

/* 手机设备 */
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

  .nav {
    gap: 12px;
  }

  .nav-item {
    font-size: 1rem;
    padding: 6px 2px;
  }

  /* 在小屏时可以考虑隐藏部分非关键导航项 */
  /* .nav-item:nth-last-child(2) {
    display: none;
  } */
}

/* 超小屏设备 */
@media (max-width: 400px) {
  .logo-text {
    font-size: 1rem;
    max-width: 140px;
  }

  .nav {
    gap: 10px;
  }

  .nav-item {
    font-size: 0.95rem;
  }
}
</style>
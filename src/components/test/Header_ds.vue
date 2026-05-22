<template>
  <div class="header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <!--          <div class="logo-img">-->
          <!--            <img src="@/assets/images/logo.png" alt="logo">-->
          <!--          </div>-->
          <span>烈焰飞鸟的个人博客</span>
        </router-link>
      </div>
      <div class="header-item">
        <router-link to="/" class="nav-item">
          首页
        </router-link>
        <!--        <router-link to="/blog" class="nav-item">-->
        <!--          博文-->
        <!--        </router-link>-->
        <router-link to="/life" class="nav-item">
          生活
        </router-link>
        <router-link to="/test" class="nav-item">
          烟花
        </router-link>
        <!-- 生活下拉菜单 -->
        <!--        <div class="dropdown">-->
        <!--          <router-link to="/life" class="nav-item dropdown-trigger">-->
        <!--            生活-->
        <!--            <span class="dropdown-arrow">▼</span>-->
        <!--          </router-link>-->
        <!--          <div class="dropdown-menu">-->
        <!--            <router-link to="/life/album" class="dropdown-item">-->
        <!--              📷 相册-->
        <!--            </router-link>-->
        <!--            <router-link to="/life/essay" class="dropdown-item">-->
        <!--              ✍️ 随笔-->
        <!--            </router-link>-->
        <!--          </div>-->
        <!--        </div>-->
        <router-link to="/about" class="nav-item">
          关于笔者
        </router-link>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">

</script>


<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 67px;
  background: #7E6B8F;
  /*background: #D5C3FA;*/

  z-index: 999;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  display: flex;
  align-items: center;
}

.logo a {
  gap: 1rem; /* 元素之间的间距 */
}

.logo img {
  width: 67px;
}

.logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.header-item {
  flex: 1; /* 占满剩余空间 */
  display: flex;
  justify-content: flex-end; /* 居右 */
  align-items: center;
  gap: 1rem; /* 元素之间的间距 */
  color: white;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-decoration: none;
}

.header-item a {
  position: relative; /* 为伪元素定位做准备 */
  padding-bottom: 3px; /* 给下划线留出空间 */
}

.header-item a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 3px;
  background-color: #C4B5D6; /* 柔和的浅紫色 */
  transition: width 0.3s ease; /* 动画效果 */
  /**
  transition: width 0.3s ease; 是 CSS 中的一个属性，用于设置元素属性的过渡效果。
  width 0.3s 是过渡效果的持续时间和 timing-function（过渡效果的曲线）。
  ease 是过渡效果的曲线，表示元素过渡效果会以缓速开始、加速结束。
   */
}

.header-item a:hover::after {
  width: 100%;
}

/* 下拉菜单样式 */
.dropdown {
  position: relative; /* 如果没有相对定位，下拉菜单会相对于整个页面定位，位置会错乱*/
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

/* 悬停时旋转180度 */
.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/*
  * 相对定位：建立定位上下文，让绝对定位的子元素以它为基准
  * 绝对定位：下拉菜单脱离文档流，精确定位在触发器下方
 */
.dropdown-menu {
  position: absolute; /*子绝父相*/
  top: 100%;
  left: 0;
  width: 100px;
  background: #d7c2ea;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0; /* 完全透明 */
  visibility: hidden; /* 不可见且不占用空间 */
  transform: translateY(-10px); /* 向上偏移10px */
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.dropdown:hover .dropdown-menu {
  opacity: 0.8;
  visibility: visible; /* 可见 */
  transform: translateY(0); /* 回到原始位置 */
}

.dropdown-item {
  display: block; /* 块级元素，占满宽度 */
  padding: 0.8rem 1rem; /* 内边距 */
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  border-bottom: 1px solid #f0f0f0; /* 分隔线 */
  transition: all 0.3s ease;
  text-shadow: none;
}

.dropdown-item:last-child {
  border-bottom: none; /* 最后一项无分隔线 */
}

.dropdown-item:hover {
  background: #7E6B8F;
  color: white;
}

.dropdown-item::after {
  display: none; /* 移除导航的下划线动画 */
}


/* 响应式样设计*/
/* 平板设备 (768px 及以下) */
@media (max-width: 768px) {
  .header {
    height: 60px;
  }

  .container {
    padding: 0 20px;
    max-width: 100%;
  }

  .logo span {
    font-size: 1.2rem;
  }

  .header-item {
    font-size: 1rem;
    gap: 0.8rem;
  }
}

/* 手机设备 (480px 及以下) */
@media (max-width: 480px) {
  .header {
    height: 55px;
  }

  .logo span {
    font-size: 1rem;
    white-space: nowrap; /* 防止文字换行 */
  }

  .header-item {
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  .container {
    padding: 0 15px;
  }
}
</style>
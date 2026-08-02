<script setup lang="ts">
import ParticlesEffect from "@/components/ParticlesEffect.vue";
import BackToTop from "@/components/BackToTop.vue";
</script>

<template>
  <ParticlesEffect>
    <router-view></router-view>
  </ParticlesEffect>

  <!-- 全局悬浮返回顶部按钮 -->
  <BackToTop/>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

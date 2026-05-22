<template>
  <div class="particles-container">
    <!-- 页面其他内容 -->
    <slot></slot>

    <!-- 粒子画布 -->
    <canvas
        ref="canvas"
        class="particles-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  life: number
  maxLife: number
  update: () => void
  draw: () => void
  isDead: () => boolean
}

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const particles = ref<Particle[]>([])
const animationFrame = ref<number>(0)

// 粒子类
class ParticleImpl implements Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  life: number
  maxLife: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.size = Math.random() * 8 + 8
    this.speedX = Math.random() * 6 - 3
    this.speedY = Math.random() * 6 - 3
    this.color = getRandomColor()
    this.life = 0
    this.maxLife = Math.random() * 50 + 50
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.life++
    this.size *= 0.97
  }

  draw() {
    if (!ctx.value) return

    const alpha = 1 - (this.life / this.maxLife)
    ctx.value.save()
    ctx.value.globalAlpha = alpha
    ctx.value.fillStyle = this.color
    ctx.value.beginPath()
    ctx.value.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.value.fill()
    ctx.value.restore()
  }

  isDead() {
    return this.life >= this.maxLife
  }
}

// 随机颜色生成
function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 创建粒子
function createParticles(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY

  // console.log('点击位置:', x, y)

  // 创建多个粒子
  for (let i = 0; i < 20; i++) {
    particles.value.push(new ParticleImpl(x, y))
  }
}

// 动画循环
function animate() {
  if (!ctx.value || !canvas.value) return

  // 完全透明清空
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // 更新和绘制粒子
  for (let i = particles.value.length - 1; i >= 0; i--) {
    const particle = particles.value[i]
    particle.update()
    particle.draw()

    if (particle.isDead()) {
      particles.value.splice(i, 1)
    }
  }

  animationFrame.value = requestAnimationFrame(animate)
}

// 初始化画布
function initCanvas() {
  if (!canvas.value) return

  const context = canvas.value.getContext('2d')
  if (!context) return

  ctx.value = context
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  // 使用文档点击事件，而不是画布点击事件
  document.addEventListener('click', createParticles)
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  // 移除文档事件监听
  document.removeEventListener('click', createParticles)
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.particles-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* pointer-events: none */
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: transparent;
  pointer-events: none; /* 让点击事件穿透 */
}
</style>
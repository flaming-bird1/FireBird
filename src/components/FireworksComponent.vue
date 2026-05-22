<template>
  <div class="fireworks-container">
    <!-- 页面其他内容 -->
    <slot></slot>

    <!-- 烟花画布 -->
    <canvas
        ref="canvas"
        class="fireworks-canvas"
        @click="launchFirework"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 烟花粒子接口
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  life: number
  maxLife: number
  gravity: number
  update: () => void
  draw: () => void
  isDead: () => boolean
}

// 上升阶段的烟花接口
interface Rocket {
  x: number
  y: number
  speedY: number
  color: string
  trail: { x: number, y: number, life: number }[]
  reachedTop: boolean
  explosionParticles: Particle[]
  update: () => void
  draw: () => void
  explode: () => void
  isDead: () => boolean
}

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const rockets = ref<Rocket[]>([])
const particles = ref<Particle[]>([])
const animationFrame = ref<number>(0)

// 随机颜色生成
function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#FFA500', '#FF1493', '#00FF00', '#00BFFF', '#FFD700'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 粒子类（爆炸后的粒子）
class ParticleImpl implements Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  life: number
  maxLife: number
  gravity: number

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 8 - 4
    this.speedY = Math.random() * 8 - 4
    this.color = color
    this.life = 0
    this.maxLife = Math.random() * 60 + 60 // 更长的生命周期
    this.gravity = 0.05
  }

  update() {
    this.speedY += this.gravity // 重力效果
    this.x += this.speedX
    this.y += this.speedY
    this.life++
    this.size *= 0.985 // 缓慢缩小
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

// 上升阶段的烟花类
class RocketImpl implements Rocket {
  x: number
  y: number
  speedY: number
  color: string
  trail: { x: number, y: number, life: number }[]
  reachedTop: boolean
  explosionParticles: Particle[]
  targetY: number

  constructor(x: number) {
    this.x = x
    this.y = window.innerHeight // 从底部发射
    this.speedY = -12 // 上升速度
    this.color = getRandomColor()
    this.trail = []
    this.reachedTop = false
    this.explosionParticles = []
    this.targetY = Math.random() * (window.innerHeight * 0.3) + (window.innerHeight * 0.2) // 随机爆炸高度
  }

  update() {
    if (!this.reachedTop) {
      // 上升阶段
      this.y += this.speedY
      this.speedY *= 0.98 // 空气阻力

      // 添加轨迹粒子
      this.trail.push({
        x: this.x,
        y: this.y,
        life: 10
      })

      // 更新轨迹粒子生命周期
      for (let i = this.trail.length - 1; i >= 0; i--) {
        this.trail[i].life--
        if (this.trail[i].life <= 0) {
          this.trail.splice(i, 1)
        }
      }

      // 检查是否到达爆炸高度
      if (this.y <= this.targetY || this.speedY > -1) {
        this.reachedTop = true
        this.explode()
      }
    } else {
      // 爆炸后更新爆炸粒子
      for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
        const particle = this.explosionParticles[i]
        particle.update()
        if (particle.isDead()) {
          this.explosionParticles.splice(i, 1)
        }
      }
    }
  }

  draw() {
    if (!ctx.value) return

    if (!this.reachedTop) {
      // 绘制上升的烟花
      ctx.value.save()
      ctx.value.fillStyle = this.color
      ctx.value.beginPath()
      ctx.value.arc(this.x, this.y, 3, 0, Math.PI * 2)
      ctx.value.fill()

      // 绘制轨迹
      for (const trail of this.trail) {
        const alpha = trail.life / 10
        ctx.value.save()
        ctx.value.globalAlpha = alpha
        ctx.value.fillStyle = this.color
        ctx.value.beginPath()
        ctx.value.arc(trail.x, trail.y, 2, 0, Math.PI * 2)
        ctx.value.fill()
        ctx.value.restore()
      }
      ctx.value.restore()
    } else {
      // 绘制爆炸粒子
      for (const particle of this.explosionParticles) {
        particle.draw()
      }
    }
  }

  explode() {
    // 创建爆炸粒子
    const particleCount = Math.random() * 100 + 150 // 150-250个粒子
    for (let i = 0; i < particleCount; i++) {
      this.explosionParticles.push(new ParticleImpl(this.x, this.y, this.color))
    }

    // 30%几率创建第二种颜色的粒子
    if (Math.random() < 0.3) {
      const secondColor = getRandomColor()
      for (let i = 0; i < particleCount * 0.5; i++) {
        this.explosionParticles.push(new ParticleImpl(this.x, this.y, secondColor))
      }
    }
  }

  isDead() {
    return this.reachedTop && this.explosionParticles.length === 0
  }
}

// 发射烟花
function launchFirework(event?: MouseEvent) {
  const x = event ? event.clientX : Math.random() * window.innerWidth
  rockets.value.push(new RocketImpl(x))
}

// 自动发射烟花
function autoLaunch() {
  if (Math.random() < 0.1) { // 10%的几率每帧发射
    launchFirework()
  }
}

// 动画循环
function animate() {
  if (!ctx.value || !canvas.value) return

  // 半透明清空，产生拖尾效果
  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // 自动发射烟花
  autoLaunch()

  // 更新和绘制火箭
  for (let i = rockets.value.length - 1; i >= 0; i--) {
    const rocket = rockets.value[i]
    rocket.update()
    rocket.draw()

    if (rocket.isDead()) {
      rockets.value.splice(i, 1)
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
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.fireworks-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.fireworks-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: transparent; /* 透明背景 */
  pointer-events: none;
}
</style>
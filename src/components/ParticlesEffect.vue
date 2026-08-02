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

// 背景漂浮粒子（常驻星空氛围）
interface FloatParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  alpha: number
  twinkleSpeed: number
  twinklePhase: number
  update: () => void
  draw: () => void
}

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const particles = ref<Particle[]>([])
const floatParticles = ref<FloatParticle[]>([])
const animationFrame = ref<number>(0)
const lastMouseEmit = ref(0)
const dpr = window.devicePixelRatio || 1

// 点击爆裂/鼠标拖尾粒子颜色（保持原版多彩主题色）
function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 点击爆裂粒子类
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
    this.size = Math.random() * 6 + 3
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
    this.size *= 0.96
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

// 背景漂浮粒子（缓慢上升 + 呼吸闪烁）
class FloatParticleImpl implements FloatParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  alpha: number
  twinkleSpeed: number
  twinklePhase: number

  constructor() {
    this.x = Math.random() * window.innerWidth
    this.y = Math.random() * window.innerHeight
    this.size = Math.random() * 2.2 + 0.6
    this.speedX = (Math.random() - 0.5) * 0.35
    this.speedY = -(Math.random() * 0.4 + 0.1)
    this.alpha = Math.random() * 0.4 + 0.15
    this.twinkleSpeed = Math.random() * 0.02 + 0.008
    this.twinklePhase = Math.random() * Math.PI * 2
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.twinklePhase += this.twinkleSpeed
    // 出界后重置到底部
    if (this.y < -10) {
      this.y = window.innerHeight + 10
      this.x = Math.random() * window.innerWidth
    }
    if (this.x < -10) this.x = window.innerWidth + 10
    if (this.x > window.innerWidth + 10) this.x = -10
  }

  draw() {
    if (!ctx.value) return
    const twinkle = 0.6 + 0.4 * Math.sin(this.twinklePhase)
    ctx.value.save()
    ctx.value.globalAlpha = this.alpha * twinkle
    ctx.value.fillStyle = '#B8A9C9'
    ctx.value.beginPath()
    ctx.value.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.value.fill()
    ctx.value.restore()
  }
}

// 点击创建爆裂粒子
function createBurst(x: number, y: number) {
  for (let i = 0; i < 18; i++) {
    particles.value.push(new ParticleImpl(x, y))
  }
}

// 鼠标移动拖尾粒子
function createTrail(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    const p = new ParticleImpl(x + Math.random() * 8 - 4, y + Math.random() * 8 - 4)
    p.size = Math.random() * 3.5 + 1
    p.maxLife = Math.random() * 30 + 20
    p.speedX = Math.random() * 4 - 2
    p.speedY = Math.random() * 4 - 2
    particles.value.push(p)
  }
}

// 点击事件
function handleClick(event: MouseEvent) {
  createBurst(event.clientX, event.clientY)
}

// 鼠标移动事件（节流）
function handleMouseMove(event: MouseEvent) {
  const now = Date.now()
  if (now - lastMouseEmit.value < 80) return
  lastMouseEmit.value = now
  createTrail(event.clientX, event.clientY)
}

// 动画循环
function animate() {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // 更新和绘制背景漂浮粒子
  for (const fp of floatParticles.value) {
    fp.update()
    fp.draw()
  }

  // 更新和绘制爆裂/拖尾粒子
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
  canvas.value.width = window.innerWidth * dpr
  canvas.value.height = window.innerHeight * dpr
  ctx.value.scale(dpr, dpr)
}

onMounted(() => {
  initCanvas()

  // 生成背景漂浮粒子（数量随屏幕大小）
  const count = Math.min(80, Math.floor(window.innerWidth / 18))
  floatParticles.value = Array.from({length: count}, () => new FloatParticleImpl())

  animate()
  document.addEventListener('click', handleClick)
  document.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', () => {
    initCanvas()
    const newCount = Math.min(80, Math.floor(window.innerWidth / 18))
    while (floatParticles.value.length < newCount) {
      floatParticles.value.push(new FloatParticleImpl())
    }
  })
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  document.removeEventListener('click', handleClick)
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.particles-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* pointer-events: none，让点击/移动事件穿透到页面 */
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: transparent;
  pointer-events: none;
}
</style>

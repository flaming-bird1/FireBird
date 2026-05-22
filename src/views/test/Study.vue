<!-- views/Study.vue -->
<template>
  <div class="study-page">
    <Header />

    <!-- 页面横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>考研痕迹</h1>
        <p class="typing-text">星光不问赶路人 · 时光不负有心人</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="study-content">
      <div class="container">
        <!-- 左侧：每日记录 -->
        <div class="main-content">
          <!-- 日期切换 -->
          <div class="date-tabs">
            <button
                v-for="(record, index) in dailyRecords"
                :key="record.id"
                class="date-tab"
                :class="{ active: currentIndex === index }"
                @click="currentIndex = index"
            >
              <span class="date-day">{{ record.weekday.slice(0, 2) }}</span>
              <span class="date-num">{{ formatDay(record.date) }}</span>
            </button>
          </div>

          <!-- 当前日期的记录 -->
          <div class="daily-card" v-if="currentRecord">
            <div class="card-header">
              <div class="date-info">
                <h2>{{ currentRecord.weekday }}</h2>
                <p>{{ formatFullDate(currentRecord.date) }}</p>
              </div>
              <div class="hours-badge" v-if="currentRecord.studyHours">
                📚 学习 {{ currentRecord.studyHours }} 小时
              </div>
            </div>

            <!-- 今日总结 -->
            <div class="section">
              <h3 class="section-title">
                <span class="title-icon">📝</span>
                今日总结
              </h3>
              <ul class="point-list">
                <li v-for="(item, idx) in currentRecord.summary" :key="idx">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- 明日安排 -->
            <div class="section">
              <h3 class="section-title">
                <span class="title-icon">🎯</span>
                明日安排
              </h3>
              <ul class="point-list">
                <li v-for="(item, idx) in currentRecord.tomorrowTasks" :key="idx">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 每周总结 -->
          <div class="weekly-card">
            <h3 class="section-title">
              <span class="title-icon">📊</span>
              每周总结
            </h3>
            <div class="weekly-list">
              <div
                  v-for="week in weeklySummaries"
                  :key="week.id"
                  class="week-item"
              >
                <div class="week-header">
                  <span class="week-range">
                    {{ formatShortDate(week.weekStart) }} - {{ formatShortDate(week.weekEnd) }}
                  </span>
                </div>
                <ul class="point-list">
                  <li v-for="(item, idx) in week.summary" :key="idx">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 考研倒计时 -->
          <div class="widget">
            <h3 class="widget-title">⏰ 考研倒计时</h3>
            <div class="countdown">{{ examDaysLeft }}</div>
            <p class="countdown-label">距离2027考研</p>
          </div>

          <!-- 本周统计 -->
          <div class="widget">
            <h3 class="widget-title">📈 本周统计</h3>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-value">{{ weekTotalHours }}</span>
                <span class="stat-label">总学习时长(h)</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ weekAvgHours }}</span>
                <span class="stat-label">日均学习(h)</span>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="@/assets/images/logo.png" alt="头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">心怀热爱，永远是当打之年！</p>
              <div class="social-links">
                <a href="https://github.com/flaming-bird1" target="_blank">GitHub</a>
                <a href="https://gitee.com/flaming-bird" target="_blank">Gitee</a>
                <a href="https://blog.csdn.net/lieyanfeiniao_" target="_blank">CSDN</a>
              </div>
            </div>
          </div>

          <!-- 国风名言 -->
          <div class="widget quote-widget">
            <div class="quote-icon">「</div>
            <p class="quote-text">博观而约取，厚积而薄发</p>
            <div class="quote-icon">」</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import { getDailyRecords, getWeeklySummaries } from '@/data/study'

const dailyRecords = ref(getDailyRecords())
const weeklySummaries = ref(getWeeklySummaries())
const currentIndex = ref(6) // 默认显示最新一天（周日）

const currentRecord = computed(() => dailyRecords.value[currentIndex.value])

// 本周统计
const weekTotalHours = computed(() => {
  return dailyRecords.value.reduce((sum, r) => sum + (r.studyHours || 0), 0)
})

const weekAvgHours = computed(() => {
  return (weekTotalHours.value / dailyRecords.value.length).toFixed(1)
})

// 考研倒计时
const examDaysLeft = computed(() => {
  const examDate = new Date('2026-12-26')
  const today = new Date()
  const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

// 工具函数
const formatDay = (date: string) => new Date(date).getDate().toString()
const formatFullDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
const formatShortDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<style scoped lang="scss">
.study-page {
  width: 100%;
}

/* 横幅 */
.banner {
  margin-top: 67px;
  height: calc(100vh - 67px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, rgba(110, 95, 125, 0.4) 0%, rgba(126, 107, 143, 0.3) 50%, rgba(150, 135, 165, 0.2) 100%);

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-family: "STKaiti", "KaiTi", serif;
  }

  .typing-text {
    font-size: 1.5rem;
    border-right: 3px solid rgba(255, 255, 255, 0.75);
    white-space: nowrap;
    width: 0;
    margin: 1rem auto 0;
    animation: typing 4s steps(15, end) infinite;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

@keyframes typing {
  0% { width: 0; }
  40% { width: 100%; }
  60% { width: 100%; }
  100% { width: 0; }
}

/* 内容区域 */
.study-content {
  min-height: 100vh;
  padding: 2rem 0 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 2rem;
}

.main-content {
  flex: 7;
}

.sidebar {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 日期切换标签 */
.date-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.date-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 55px;
  padding: 0.6rem 0.8rem;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .date-day {
    font-size: 0.7rem;
    color: #888;
  }

  .date-num {
    font-size: 1.2rem;
    font-weight: bold;
    color: #5a4a6b;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(126, 107, 143, 0.15);
  }

  &.active {
    background: #7e6b8f;
    .date-day, .date-num { color: white; }
  }
}

/* 每日卡片 */
.daily-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(126, 107, 143, 0.15);

  .date-info {
    h2 { font-size: 1.5rem; color: #2c3e50; font-family: "STKaiti", "KaiTi", serif; margin-bottom: 0.2rem; }
    p { color: #888; font-size: 0.85rem; }
  }

  .hours-badge {
    background: rgba(126, 107, 143, 0.1);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    color: #7e6b8f;
    font-size: 0.85rem;
  }
}

/* 每周总结卡片 */
.weekly-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.week-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed rgba(126, 107, 143, 0.15);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.week-header {
  margin-bottom: 0.8rem;
  .week-range {
    background: rgba(126, 107, 143, 0.1);
    padding: 0.2rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    color: #7e6b8f;
  }
}

/* 通用样式 */
.section {
  margin-bottom: 1.5rem;

  &:last-child { margin-bottom: 0; }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-family: "STKaiti", "KaiTi", serif;

  .title-icon { font-size: 1.2rem; }
}

.point-list {
  list-style: none;
  padding: 0;

  li {
    padding: 0.6rem 0;
    padding-left: 1.2rem;
    position: relative;
    color: #444;
    line-height: 1.5;
    border-bottom: 1px dashed rgba(126, 107, 143, 0.1);

    &::before {
      content: "●";
      position: absolute;
      left: 0;
      color: #7e6b8f;
      font-size: 0.7rem;
    }

    &:last-child { border-bottom: none; }
  }
}

/* 侧边栏 */
.widget {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.widget-title {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.countdown {
  font-size: 2.5rem;
  font-weight: bold;
  color: #7e6b8f;
  font-family: monospace;
}

.countdown-label {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.3rem;
}

.stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  .stat-value { display: block; font-size: 1.5rem; font-weight: bold; color: #7e6b8f; }
  .stat-label { font-size: 0.7rem; color: #888; }
}

.author-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.8rem;
  border: 3px solid #7e6b8f;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.author-name {
  font-size: 1.2rem;
  color: #2c3e50;
  font-family: "STKaiti", "KaiTi", serif;
}

.author-bio {
  font-size: 0.8rem;
  color: #888;
  margin: 0.5rem 0;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  a {
    color: #7e6b8f;
    text-decoration: none;
    font-size: 0.8rem;
    &:hover { text-decoration: underline; }
  }
}

.quote-widget {
  .quote-icon { font-size: 1.2rem; color: #7e6b8f; font-family: "SimSun", serif; }
  .quote-text { font-size: 0.9rem; color: #7e6b8f; margin: 0.5rem 0; font-family: "STKaiti", "KaiTi", serif; }
}

/* 响应式 */
@media (max-width: 768px) {
  .container { flex-direction: column; }
  .banner { height: 40vh; h1 { font-size: 2rem; } .typing-text { font-size: 1rem; } }
  .date-tab { min-width: 45px; .date-num { font-size: 1rem; } }
  .card-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
}
</style>
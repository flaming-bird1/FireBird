<!-- views/Study.vue -->
<template>
  <div class="study-page">
    <Header/>

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
        <!-- 左侧：导航容器 -->
        <div class="nav-container">
          <div class="nav-tabs-wrapper">
            <!-- 顶部导航栏 -->
            <div class="tabs-header">
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'daily' }"
                  @click="activeTab = 'daily'"
              >
                📅 每日记录
                <span class="tab-count">{{ dailyRecords.length }}</span>
              </button>
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'weekly' }"
                  @click="activeTab = 'weekly'"
              >
                📊 每周总结
                <span class="tab-count">{{ weeklySummaries.length }}</span>
              </button>
            </div>

            <!-- 内容区域 -->
            <div class="tab-content-wrapper">
              <!-- 每日记录 -->
              <div v-show="activeTab === 'daily'" class="tab-pane">
                <!-- 搜索栏 -->
                <div class="search-bar">
                  <div class="search-input-wrapper">
                    <span class="search-icon">🔍</span>
                    <input
                        type="text"
                        v-model="searchKeyword"
                        placeholder="搜索日期（如 2026-04-01 或 04-01）或内容..."
                        class="search-input"
                    />
                    <button v-if="searchKeyword" class="search-clear" @click="clearSearch">×</button>
                  </div>
                </div>

                <!-- 日期切换标签（搜索结果中显示匹配的日期） -->
                <div class="date-tabs" v-if="filteredDailyRecords.length > 0">
                  <button
                      v-for="(record, index) in filteredDailyRecords"
                      :key="record.id"
                      class="date-tab"
                      :class="{ active: currentIndex === getOriginalIndex(record.id) }"
                      @click="setCurrentRecord(record.id)"
                  >
                    <span class="date-num">{{ formatDay(record.date) }}</span>
                    <span class="date-day">{{ formatMonth(record.date) }}</span>
                    <span class="date-year">{{ formatYear(record.date) }}</span>
                  </button>
                  <div v-if="searchKeyword && filteredDailyRecords.length === 0" class="no-result">
                    未找到相关记录
                  </div>
                </div>

                <!-- 当前日期的记录 -->
                <div class="daily-card" v-if="currentRecord">
                  <div class="card-header">
                    <div class="date-info">
                      <h2>{{ currentRecord.weekday }}</h2>
                      <p>{{ formatFullDateTime(currentRecord.date) }}</p>
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
                        <span class="bullet-point"></span>
                        {{ item }}
                      </li>
                    </ul>
                  </div>

                  <!-- 学习感受-->
                  <div class="section" v-if="currentRecord.feeling">
                    <h3 class="section-title">
                      <span class="title-icon">💭</span>
                      学习感受
                    </h3>
                    <div class="feeling-content">
                      <p
                          v-for="(paragraph, idx) in getParagraphs(currentRecord.feeling)"
                          :key="idx"
                      >
                        {{ paragraph }}
                      </p>
                    </div>
                  </div>

                  <!-- 明日安排 -->
                  <div class="section">
                    <h3 class="section-title">
                      <span class="title-icon">🎯</span>
                      明日安排
                    </h3>
                    <ul class="point-list">
                      <li v-for="(item, idx) in currentRecord.tomorrowTasks" :key="idx">
                        <span class="bullet-point"></span>
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 无数据提示 -->
                <div v-if="!currentRecord && filteredDailyRecords.length === 0 && !searchKeyword" class="empty-tip">
                  暂无每日记录
                </div>
              </div>

              <!-- 每周总结 -->
              <div v-show="activeTab === 'weekly'" class="tab-pane">
                <!-- 搜索栏 -->
                <div class="search-bar">
                  <div class="search-input-wrapper">
                    <span class="search-icon">🔍</span>
                    <input
                        type="text"
                        v-model="weeklySearchKeyword"
                        placeholder="搜索日期（如 2026-05-18 或 05-18）或周总结内容..."
                        class="search-input"
                    />
                    <button v-if="weeklySearchKeyword" class="search-clear" @click="clearWeeklySearch">×</button>
                  </div>
                </div>

                <div class="weekly-list">
                  <div
                      v-for="week in filteredWeeklySummaries"
                      :key="week.id"
                      class="week-item"
                  >
                    <div class="week-header">
                      <span class="week-range">
                        {{ formatFullDateTime(week.weekStart) }} - {{ formatFullDateTime(week.weekEnd) }}
                      </span>
                    </div>

                    <!-- 本周总结 -->
                    <div class="week-section">
                      <h4 class="week-section-title">
                        <span class="section-icon">📋</span>
                        本周总结
                      </h4>
                      <ul class="point-list">
                        <li v-for="(item, idx) in week.summary" :key="idx">
                          <span class="bullet-point"></span>
                          {{ item }}
                        </li>
                      </ul>
                    </div>

                    <!-- 下周安排 -->
                    <div class="week-section" v-if="week.nextWeekTasks && week.nextWeekTasks.length > 0">
                      <h4 class="week-section-title next-week-title">
                        <span class="section-icon">📌</span>
                        下周安排
                      </h4>
                      <ul class="point-list next-week-list">
                        <li v-for="(item, idx) in week.nextWeekTasks" :key="idx">
                          <span class="bullet-point next-week-bullet"></span>
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div v-if="weeklySearchKeyword && filteredWeeklySummaries.length === 0" class="no-result">
                    未找到相关周总结
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="right-content">
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
              <div class="stat-item">
                <span class="stat-value">{{ weekCompletedTasks }}</span>
                <span class="stat-label">完成任务</span>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="widget author-widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="@/assets/images/logo.png" alt="头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">追求·奋斗·拼搏·热爱</p>
              <div class="social-links">
                <a href="https://github.com/flaming-bird1" target="_blank" class="social-link">
                  <span class="social-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">
                  <span class="social-icon">📦</span>
                  Gitee
                </a>
                <a href="https://blog.csdn.net/lieyanfeiniao_" target="_blank" class="social-link">
                  <span class="social-icon">📝</span>
                  CSDN
                </a>
              </div>
            </div>
          </div>

          <!-- 国风名言 -->
          <div class="widget chinese-quote">
            <div class="quote-content">
              <div class="quote-icon">「</div>
              <p class="quote-text">博观而约取，厚积而薄发</p>
              <div class="quote-icon">」</div>
              <p class="quote-author">—— 苏轼</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import Header from '@/components/Header.vue'
import {getDailyRecords, getWeeklySummaries} from '@/data/study'
import type {DailyRecord, WeeklySummary} from '@/types/study'

// 数据
const dailyRecords = ref<DailyRecord[]>(getDailyRecords())
const weeklySummaries = ref<WeeklySummary[]>(getWeeklySummaries())

// 当前选中的标签页
const activeTab = ref('daily')

// 每日记录搜索
const searchKeyword = ref('')
const currentRecordId = ref(dailyRecords.value[dailyRecords.value.length - 1]?.id || '')

// 每周总结搜索
const weeklySearchKeyword = ref('')

// 过滤后的每日记录（只显示最近一周，搜索时显示所有匹配结果）
const filteredDailyRecords = computed(() => {
  // 如果有搜索关键词，返回所有匹配的结果
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    return dailyRecords.value.filter(record => {
      // 搜索日期（支持 2026-04-01、04-01、4月1日、2026年4月1日 等格式）
      const fullDateStr = formatFullDateTime(record.date).toLowerCase()
      const shortDate = record.date.slice(5).toLowerCase() // MM-DD
      const year = record.date.slice(0, 4) // YYYY
      // 搜索今日总结内容
      const summaryMatch = record.summary.some(item => item.toLowerCase().includes(keyword))
      // 搜索明日安排内容
      const tasksMatch = record.tomorrowTasks.some(item => item.toLowerCase().includes(keyword))

      return fullDateStr.includes(keyword) || shortDate.includes(keyword) || year.includes(keyword) || summaryMatch || tasksMatch
    })
  }

  // 没有搜索时，只显示最近一周的数据
  return dailyRecords.value.slice(-7)
})

// 过滤后的每周总结（支持日期搜索，并按时间倒序排列）
const filteredWeeklySummaries = computed(() => {
  // 先排序（按周结束日期倒序，最近的在前）
  const sortedSummaries = [...weeklySummaries.value].sort((a, b) => {
    return new Date(b.weekEnd).getTime() - new Date(a.weekEnd).getTime()
  })

  if (!weeklySearchKeyword.value.trim()) {
    return sortedSummaries
  }

  const keyword = weeklySearchKeyword.value.toLowerCase().trim()

  const filtered = sortedSummaries.filter(week => {
    // 搜索周范围日期（支持多种格式）
    const startFull = formatFullDateTime(week.weekStart).toLowerCase()
    const startShort = week.weekStart.slice(5).toLowerCase() // MM-DD
    const startYear = week.weekStart.slice(0, 4) // YYYY

    const endFull = formatFullDateTime(week.weekEnd).toLowerCase()
    const endShort = week.weekEnd.slice(5).toLowerCase()
    const endYear = week.weekEnd.slice(0, 4)

    // 组合成周范围字符串
    const rangeFull = `${startFull} - ${endFull}`
    const rangeShort = `${formatShortDate(week.weekStart)} - ${formatShortDate(week.weekEnd)}`

    // 检查是否匹配日期
    const dateMatch =
        rangeFull.includes(keyword) ||
        rangeShort.includes(keyword) ||
        startFull.includes(keyword) ||
        startShort.includes(keyword) ||
        startYear.includes(keyword) ||
        endFull.includes(keyword) ||
        endShort.includes(keyword) ||
        endYear.includes(keyword)

    // 搜索本周总结内容
    const summaryMatch = week.summary.some(item => item.toLowerCase().includes(keyword))
    // 搜索下周安排内容
    const tasksMatch = week.nextWeekTasks?.some(item => item.toLowerCase().includes(keyword)) || false

    return dateMatch || summaryMatch || tasksMatch
  })

  return filtered
})

// 当前选中的记录
const currentRecord = computed(() => {
  return dailyRecords.value.find(r => r.id === currentRecordId.value)
})

// 当前索引（用于高亮）
const currentIndex = computed(() => {
  return dailyRecords.value.findIndex(r => r.id === currentRecordId.value)
})

// 根据id获取原始索引
const getOriginalIndex = (id: string) => {
  return dailyRecords.value.findIndex(r => r.id === id)
}

// 设置当前记录
const setCurrentRecord = (id: string) => {
  currentRecordId.value = id
}

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
}

const clearWeeklySearch = () => {
  weeklySearchKeyword.value = ''
}

// 当搜索结果变化时，自动选中第一个结果
watch(filteredDailyRecords, (newRecords) => {
  if (newRecords.length > 0 && !newRecords.find(r => r.id === currentRecordId.value)) {
    currentRecordId.value = newRecords[0].id
  }
})

// 本周统计
const weekTotalHours = computed(() => {
  return dailyRecords.value.reduce((sum, r) => sum + (r.studyHours || 0), 0)
})

const weekAvgHours = computed(() => {
  return (weekTotalHours.value / dailyRecords.value.length).toFixed(1)
})

const weekCompletedTasks = computed(() => {
  // 假设每个任务完成度按比例计算，这里简单统计
  return Math.round(weekTotalHours.value / 8 * 7)
})

// 考研倒计时
const examDaysLeft = computed(() => {
  const examDate = new Date('2026-12-19')
  const today = new Date()
  const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

// 工具函数
const formatYear = (date: string) => {
  return new Date(date).getFullYear().toString()
}
const formatDay = (date: string) => new Date(date).getDate().toString()
const formatMonth = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月`
}
const formatFullDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
// 完整日期时间格式（带年份）
const formatFullDateTime = (date: string) => {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
const formatShortDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
// 将文本按换行符分割成段落，并过滤掉空行
const getParagraphs = (text: string) => {
  if (!text) return []
  return text.split('\n').filter(p => p.trim() !== '')
}
</script>

<style scoped lang="scss">
.study-page {
  width: 100%;
}

/* 页面横幅 */
/* 页面横幅 */
.banner {
  margin-top: 67px;
  padding: 0 20px;
  height: calc(100vh - 67px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  background: linear-gradient(
          135deg,
          rgba(110, 95, 125, 0.4) 0%,
          rgba(126, 107, 143, 0.3) 50%,
          rgba(150, 135, 165, 0.2) 100%
  );

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    font-family: "STKaiti", "KaiTi", serif;
  }

  .typing-text {
    font-size: 1.5rem;
    min-height: 2.5rem;
    overflow: hidden;
    border-right: 3px solid rgba(255, 255, 255, 0.75);
    white-space: nowrap;
    width: 0;
    margin: 1rem auto 0;
    animation: typingLoop 6s steps(18, end) infinite;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

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

/* 主要内容区域 */
.study-content {
  height: calc(100vh - 67px);
  padding: 1rem 0;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 2rem;
  align-items: stretch;
  height: 100%;
}

/* 导航容器 */
.nav-container {
  flex: 7;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-tabs-wrapper {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid rgba(126, 107, 143, 0.2);
  background: #f8f6fa;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  font-family: "STKaiti", "KaiTi", serif;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    color: #7e6b8f;
    background: rgba(126, 107, 143, 0.05);
  }

  &.active {
    color: #7e6b8f;
    background: white;
  }

  &.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #7e6b8f;
  }
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(126, 107, 143, 0.2);
  color: #7e6b8f;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  font-family: monospace;
}

.tab-btn.active .tab-count {
  background: #7e6b8f;
  color: white;
}

.tab-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* 滚动条样式 */
.tab-content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.tab-content-wrapper::-webkit-scrollbar-track {
  background: rgba(126, 107, 143, 0.1);
  border-radius: 3px;
}

.tab-content-wrapper::-webkit-scrollbar-thumb {
  background: rgba(126, 107, 143, 0.4);
  border-radius: 3px;
}

.tab-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(126, 107, 143, 0.6);
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2.2rem 0.7rem 2.5rem;
  border: 1px solid rgba(126, 107, 143, 0.2);
  border-radius: 30px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #7e6b8f;
    box-shadow: 0 0 0 2px rgba(126, 107, 143, 0.1);
  }
}

.search-clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  padding: 0 4px;

  &:hover {
    color: #666;
  }
}

.no-result {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.9rem;
}

.empty-tip {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 0.9rem;
}

/* 日期切换标签 */
.date-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(126, 107, 143, 0.1);
}

.date-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  padding: 0.5rem 0.6rem;
  background: #f5f0f8;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  .date-year {
    font-size: 0.6rem;
    color: #aaa;
    margin-top: 2px;
  }

  .date-day {
    font-size: 0.7rem;
    color: #888;
  }

  .date-num {
    font-size: 1.1rem;
    font-weight: bold;
    color: #5a4a6b;
  }

  &:hover {
    transform: translateY(-2px);
    background: #ede5f5;
  }

  &.active {
    background: #7e6b8f;

    .date-year, .date-day, .date-num {
      color: white;
    }
  }
}

/* 每日卡片 */
.daily-card {
  background: rgba(126, 107, 143, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(126, 107, 143, 0.15);

  .date-info {
    h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      font-family: "STKaiti", "KaiTi", serif;
      margin-bottom: 0.2rem;
    }

    p {
      color: #888;
      font-size: 0.85rem;
    }
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
.weekly-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.week-item {
  background: rgba(126, 107, 143, 0.03);
  border-radius: 16px;
  padding: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(126, 107, 143, 0.06);
  }
}

.week-header {
  margin-bottom: 1rem;

  .week-range {
    background: rgba(126, 107, 143, 0.1);
    padding: 0.2rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    color: #7e6b8f;
    display: inline-block;
  }
}

/* 每周总结中的分区样式 */
.week-section {
  margin-top: 1rem;

  &:first-of-type {
    margin-top: 0;
  }
}

.week-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #7e6b8f;
  margin-bottom: 0.6rem;
  font-family: "STKaiti", "KaiTi", serif;
  font-weight: 500;

  .section-icon {
    font-size: 1rem;
  }
}

.next-week-title {
  color: #e67e22;
  border-left: 3px solid #e67e22;
  padding-left: 10px;
  margin-top: 0.8rem;
  padding-top: 0.4rem;
  border-top: 1px dashed rgba(230, 126, 34, 0.2);
}

.next-week-list {
  li {
    border-bottom-color: rgba(230, 126, 34, 0.1);

    .next-week-bullet {
      background: #e67e22;
    }
  }
}

/* 学习感受样式 */
.feeling-content {
  background: rgba(126, 107, 143, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;

  p {
    color: #5a4a6b;
    line-height: 1.6;
    word-break: break-word;
    font-style: italic;
    margin: 0 0 0.8rem 0;
    text-indent: 2em;      /* 首行缩进2个字符 */

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 通用样式 */
.section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-family: "STKaiti", "KaiTi", serif;
  border-left: 3px solid #7e6b8f;
  padding-left: 12px;

  .title-icon {
    font-size: 1.2rem;
  }
}

.point-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 0.6rem 0;
    color: #444;
    line-height: 1.5;
    border-bottom: 1px dashed rgba(126, 107, 143, 0.1);

    .bullet-point {
      width: 6px;
      height: 6px;
      background: #7e6b8f;
      border-radius: 50%;
      margin-top: 0.6rem;
      flex-shrink: 0;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

/* 右侧内容区域 */
.right-content {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.right-content::-webkit-scrollbar {
  width: 6px;
}

.right-content::-webkit-scrollbar-track {
  background: rgba(126, 107, 143, 0.1);
  border-radius: 3px;
}

.right-content::-webkit-scrollbar-thumb {
  background: rgba(126, 107, 143, 0.4);
  border-radius: 3px;
}

.right-content::-webkit-scrollbar-thumb:hover {
  background: rgba(126, 107, 143, 0.6);
}

/* 侧边栏组件 */
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
  border-left: 3px solid #7e6b8f;
  padding-left: 12px;
  display: inline-block;
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
  gap: 0.5rem;
}

.stat-item {
  text-align: center;

  .stat-value {
    display: block;
    font-size: 1.3rem;
    font-weight: bold;
    color: #7e6b8f;
  }

  .stat-label {
    font-size: 0.7rem;
    color: #888;
  }
}

/* 个人简介 */
.author-widget {
  background: white;
}

.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.8rem;
  border: 3px solid #7e6b8f;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  font-style: italic;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.6rem;
  background: rgba(126, 107, 143, 0.05);
  border: 1px solid rgba(126, 107, 143, 0.2);
  border-radius: 10px;
  color: #7e6b8f;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.85rem;

  &:hover {
    background: #7e6b8f;
    color: white;
    transform: translateY(-2px);
  }
}

/* 国风名言 */
.chinese-quote {
  background: linear-gradient(135deg, rgba(126, 107, 143, 0.08), rgba(126, 107, 143, 0.03));
  border-left: 5px solid #7e6b8f;
}

.quote-content {
  text-align: center;
}

.quote-icon {
  font-size: 1.5rem;
  color: #7e6b8f;
  font-family: "SimSun", serif;
  line-height: 1;
}

.quote-text {
  font-size: 0.95rem;
  color: #7e6b8f;
  margin: 0.5rem 0;
  font-family: "STKaiti", "KaiTi", serif;
  line-height: 1.5;
}

.quote-author {
  color: #999;
  font-style: italic;
  margin-top: 0.3rem;
  font-size: 0.8rem;
}

/* 响应式 */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    height: auto;
  }

  .study-content {
    height: auto;
    overflow: visible;
  }

  .right-content {
    flex-direction: row;
    flex-wrap: wrap;
    overflow: visible;
  }

  .right-content .widget {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 40vh;
    margin-top: 60px;

    h1 {
      font-size: 2rem;
    }

    .typing-text {
      font-size: 1rem;
    }
  }

  .tab-btn {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .date-tab {
    min-width: 55px;

    .date-num {
      font-size: 1rem;
    }

    .date-year {
      font-size: 0.5rem;
    }
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .right-content {
    flex-direction: column;
  }
}
</style>
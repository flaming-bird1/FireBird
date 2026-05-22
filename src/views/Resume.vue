<template>
  <div class="resume-page">
    <Header></Header>

    <!--    页面横幅（包含基本信息卡片）-->
    <div class="banner">
      <div class="banner-content">
        <h1>成长足迹</h1>
        <!--        <h1>个人简历</h1>-->
        <p class="typing-text">全栈开发者 · 热爱技术 · 追求卓越</p>
      </div>
      <!-- 基本信息卡片放在横幅底部 -->
      <div class="basic-card-wrapper">
        <div class="basic-card">
          <div class="avatar-section">
            <div class="avatar">
              <img src="@/assets/images/logo.png" alt="头像">
            </div>
            <div class="basic-info">
              <h2>{{ resumeBaseInfo.name }}</h2>
              <p class="title">全栈开发</p>
              <div class="contact-info">
                <div class="contact-item">
                  <span class="icon">📱</span>
                  <span>{{ resumeBaseInfo.phone }}</span>
                </div>
                <div class="contact-item">
                  <span class="icon">📧</span>
                  <span>{{ resumeBaseInfo.email }}</span>
                </div>
                <div class="contact-item">
                  <span class="icon">🎓</span>
                  <span>{{ resumeBaseInfo.school }} · {{ resumeBaseInfo.major }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    主要内容（只有导航容器和右侧边栏）-->
    <div class="resume-content">
      <div class="container">
        <!--        左侧：导航容器-->
        <div class="nav-container">
          <!-- 自定义导航栏，替代 el-tabs -->
          <div class="nav-tabs-wrapper">
            <div class="tabs-header">
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'education' }"
                  @click="activeTab = 'education'"
              >
                🎓 教育背景
              </button>
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'skills' }"
                  @click="activeTab = 'skills'"
              >
                💻 技能专长
              </button>
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'projects' }"
                  @click="activeTab = 'projects'"
              >
                🚀 项目经验
                <span class="tab-count">{{ resumeProjects.length }}</span>
              </button>
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'honors' }"
                  @click="activeTab = 'honors'"
              >
                🏆 荣誉奖项
              </button>
            </div>

            <!--            内容区域-->
            <div class="tab-content-wrapper">
              <!-- 教育背景 -->
              <div v-show="activeTab === 'education'" class="tab-pane">
                <section class="section">
                  <h3 class="section-title">
                    <span class="icon">🎓</span>
                    教育背景
                  </h3>
                  <div class="education-item">
                    <div class="edu-header">
                      <div class="edu-title">
                        <h4>{{ resumeEducation.school }}</h4>
                        <div class="edu-badges">
                          <span class="degree-badge">{{ resumeEducation.degree }}</span>
                          <span v-if="resumeEducation.status" class="status-badge">{{ resumeEducation.status }}</span>
                        </div>
                      </div>
                    </div>
                    <p class="period">{{ resumeEducation.period }}</p>

                    <!-- 学院和专业信息行 -->
                    <div class="major-college">
                      <span class="major">{{ resumeEducation.major }}</span>
                      <span v-if="resumeEducation.college" class="college">（{{ resumeEducation.college }}）</span>
                    </div>

                    <!-- 绩点 -->
                    <div v-if="resumeEducation.gpa" class="gpa-info">
                      <span class="gpa-label">📊 综合绩点：</span>
                      <span class="gpa-value">{{ resumeEducation.gpa }}</span>
                    </div>

                    <div class="courses">
                      <h5>📚 主修课程：</h5>
                      <div class="tags">
          <span class="course-tag" v-for="course in resumeEducation.courses" :key="course">
            {{ course }}
          </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- 技能专长 -->
              <div v-show="activeTab === 'skills'" class="tab-pane">
                <section class="section">
                  <h3 class="section-title">
                    <span class="icon">💻</span>
                    技能专长
                  </h3>
                  <div class="skills-grid">
                    <div class="skill-category">
                      <h4>前端技术</h4>
                      <div class="skill-tags">
                        <span class="skill-tag" v-for="skill in resumeSkills.frontend" :key="skill">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                    <div class="skill-category">
                      <h4>后端技术</h4>
                      <div class="skill-tags">
                        <span class="skill-tag" v-for="skill in resumeSkills.backend" :key="skill">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                    <div class="skill-category">
                      <h4>其他技能</h4>
                      <div class="skill-tags">
                        <span class="skill-tag" v-for="skill in resumeSkills.other" :key="skill">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- 项目经验 -->
              <div v-show="activeTab === 'projects'" class="tab-pane">
                <section class="section">
                  <h3 class="section-title">
                    <span class="icon">🚀</span>
                    项目经验
                  </h3>
                  <div class="projects-list">
                    <div class="project-item" v-for="project in resumeProjects" :key="project.id">
                      <div class="project-header">
                        <h4>
                          <span class="project-id-badge">#{{ project.id }}</span>
                          {{ project.name }}
                        </h4>
                        <div class="project-links" v-if="project.giteeUrl || project.projectUrl">
                          <a v-if="project.giteeUrl" :href="project.giteeUrl" target="_blank" class="project-link">
                            <span class="link-icon">🐙</span> Gitee
                          </a>
                          <a v-if="project.projectUrl && project.projectUrl !== '#'" :href="project.projectUrl"
                             target="_blank" class="project-link">
                            <span class="link-icon">🔗</span> 项目地址
                          </a>
                        </div>
                      </div>
                      <p class="project-description">
                        <span class="label">项目概述：</span>{{ project.description }}
                      </p>
                      <p class="project-description">
                        <span class="label">详细内容：</span>{{ project.detail }}
                      </p>
                      <div class="project-tags">
                        <span class="project-tag" v-for="tag in project.tags" :key="tag">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- 荣誉奖项 -->
              <div v-show="activeTab === 'honors'" class="tab-pane">
                <section class="section honors-section">
                  <h3 class="section-title">
                    <span class="icon">🏆</span>
                    荣誉奖项
                  </h3>
                  <div class="honors-layout">
                    <div class="honors-sidebar">
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'all' }"
                           @click="activeHonorCategory = 'all'">
                        <span class="category-name">全部</span>
                        <span class="category-count">{{ allHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'national' }"
                           @click="activeHonorCategory = 'national'">
                        <span class="category-name">国赛</span>
                        <span class="category-count">{{ nationalHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'provincial' }"
                           @click="activeHonorCategory = 'provincial'">
                        <span class="category-name">省赛</span>
                        <span class="category-count">{{ provincialHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'school' }"
                           @click="activeHonorCategory = 'school'">
                        <span class="category-name">校赛</span>
                        <span class="category-count">{{ schoolHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'cert' }"
                           @click="activeHonorCategory = 'cert'">
                        <span class="category-name">证书</span>
                        <span class="category-count">{{ certHonors.length }}</span>
                      </div>
                    </div>

                    <div class="honors-content">
                      <!-- 全部：按年级分组展示 -->
                      <div v-if="activeHonorCategory === 'all'">
                        <div v-for="grade in gradeOrder" :key="grade" class="honor-grade-group">
                          <div class="honor-grade-title" v-if="groupedByGrade[grade] && groupedByGrade[grade].length">
                            <span class="grade-icon" :class="getGradeIconClass(grade)"></span>
                            {{ grade }}
                            <span class="grade-count">{{ groupedByGrade[grade].length }}</span>
                          </div>
                          <div class="honors-grid" v-if="groupedByGrade[grade] && groupedByGrade[grade].length">
                            <div class="honor-card" v-for="honor in groupedByGrade[grade]" :key="honor.id">
                              <div class="honor-level" :class="getHonorLevelClass(honor.level)">
                                {{ honor.level || '荣誉' }}
                              </div>
                              <div class="honor-name">{{ honor.name }}</div>
                              <div class="honor-year" v-if="honor.year">{{ honor.year }}</div>
                            </div>
                          </div>
                        </div>
                        <div v-if="allHonors.length === 0" class="no-honors">
                          暂无荣誉奖项
                        </div>
                      </div>

                      <!-- 其他分类：原有展示方式 -->
                      <div v-else>
                        <div class="honors-grid">
                          <div class="honor-card" v-for="honor in filteredHonors" :key="honor.id">
                            <div class="honor-level" :class="getHonorLevelClass(honor.level)">
                              {{ honor.level || '荣誉' }}
                            </div>
                            <div class="honor-name">{{ honor.name }}</div>
                            <div class="honor-year" v-if="honor.year">{{ honor.year }}</div>
                          </div>
                        </div>
                        <div v-if="filteredHonors.length === 0" class="no-honors">
                          暂无该分类奖项
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <!--        右侧：个人简介和国风名言-->
        <div class="right-content">
          <!-- 个人简介卡片 -->
          <div class="widget author-widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="@/assets/images/logo.png" alt="头像">
              </div>
              <h3 class="author-name">{{ resumeBaseInfo.name }}</h3>
              <p class="author-bio">追求·奋斗·拼搏·热爱</p>
              <div class="author-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ resumeProjects.length }}</span>
                  <span class="stat-label">项目</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{
                      resumeSkills.frontend.length + resumeSkills.backend.length + resumeSkills.other.length
                    }}</span>
                  <span class="stat-label">技能</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ allHonors.length }}</span>
                  <span class="stat-label">荣誉</span>
                </div>
              </div>
              <div class="social-links">
                <a href="https://github.com/flaming-bird1" target="_blank" class="social-link">
                  <span class="social-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">
                  <span class="social-icon">📦</span>
                  Gitee
                </a>
                <a href="https://blog.csdn.net/lieyanfeiniao_?spm=1000.2115.3001.10640" target="_blank"
                   class="social-link">
                  <span class="social-icon">📝</span>
                  CSDN
                </a>
              </div>
            </div>
          </div>

          <!-- 国风名言卡片 -->
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
import {ref, computed} from 'vue'
import Header from "@/components/Header.vue";
import {
  getResumeBaseInfo,
  getResumeEducation,
  getResumeSkills,
  getResumeHonors,
  getResumeProjects
} from '@/data/resume'
import type {ResumeBaseInfo, ResumeEducation, ResumeProject, ResumeHonor} from '@/types/resume'

const resumeBaseInfo = getResumeBaseInfo() as ResumeBaseInfo
const resumeEducation = getResumeEducation() as ResumeEducation
const resumeSkills = getResumeSkills()
const resumeHonors = ref<ResumeHonor[]>(getResumeHonors())
const resumeProjects = ref<ResumeProject[]>(getResumeProjects())

const activeTab = ref('education')

// 荣誉奖项分类
const activeHonorCategory = ref('all')

const allHonors = computed(() => resumeHonors.value)
const nationalHonors = computed(() => resumeHonors.value.filter(h => h.level === '国赛'))
const provincialHonors = computed(() => resumeHonors.value.filter(h => h.level === '省赛'))
const schoolHonors = computed(() => resumeHonors.value.filter(h => h.level === '校赛'))
const certHonors = computed(() => resumeHonors.value.filter(h => h.level === '证书'))

const filteredHonors = computed(() => {
  switch (activeHonorCategory.value) {
    case 'national':
      return nationalHonors.value
    case 'provincial':
      return provincialHonors.value
    case 'school':
      return schoolHonors.value
    case 'cert':
      return certHonors.value
    default:
      return allHonors.value
  }
})

// 年级顺序
const gradeOrder = ['大一', '大二', '大三']

// 按年级分组
const groupedByGrade = computed(() => {
  const grouped: Record<string, ResumeHonor[]> = {
    '大一': [],
    '大二': [],
    '大三': []
  }

  allHonors.value.forEach(honor => {
    if (honor.grade && grouped[honor.grade]) {
      grouped[honor.grade].push(honor)
    } else if (honor.grade) {
      // 处理其他年级（如果有）
      grouped[honor.grade] = grouped[honor.grade] || []
      grouped[honor.grade].push(honor)
    }
  })

  return grouped
})

const getHonorLevelClass = (level?: string) => {
  if (!level) return 'honor-default'
  const levelMap: Record<string, string> = {
    '国赛': 'honor-national',
    '省赛': 'honor-provincial',
    '校赛': 'honor-school',
    '证书': 'honor-cert'
  }
  return levelMap[level] || 'honor-default'
}

const getGradeIconClass = (grade: string) => {
  const iconMap: Record<string, string> = {
    '大一': '🍃',
    '大二': '🌿',
    '大三': '🍂'
  }
  return iconMap[grade] || '📌'
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.resume-page {
  width: 100%;
}

/* 页面横幅 */
.banner {
  margin-top: 67px;
  padding: 0 20px 2rem;
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
    font-size: 1.8rem;
    min-height: 2.5rem;
    overflow: hidden;
    border-right: 3px solid rgba(255, 255, 255, 0.75);
    white-space: nowrap;
    width: 0;
    margin: 1rem auto 0;
    animation: typingLoop 6s steps(15, end) infinite;
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

/* 基本信息卡片包装器 */
.basic-card-wrapper {
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
}

.basic-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: #333;
  text-align: left;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #7e6b8f;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.basic-info {
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-family: "STKaiti", "KaiTi", serif;
  }

  .title {
    font-size: 1rem;
    color: #7e6b8f;
    margin-bottom: 0.8rem;
    font-weight: 500;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.9rem;

    .icon {
      font-size: 1rem;
    }
  }
}

/* 主要内容区域 - 占据剩余视口高度 */
.resume-content {
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

/* 导航容器 - 占据剩余全部空间 */
.nav-container {
  flex: 7;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 自定义导航栏样式 */
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

.tab-btn:hover {
  color: #7e6b8f;
  background: rgba(126, 107, 143, 0.05);
}

.tab-btn.active {
  color: #7e6b8f;
  background: white;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #7e6b8f;
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

/* 右侧内容区域 - 30% */
.right-content {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

/* 右侧内容区域滚动条样式 */
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

/* 右侧卡片通用样式 */
.widget {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 个人简介卡片 */
.author-widget {
  flex-shrink: 0;
}

.author-card {
  text-align: center;
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #7e6b8f;
  margin: 0 auto 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author-name {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.author-bio {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
  border-left: 3px solid #7e6b8f;
  padding-left: 10px;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #7e6b8f;
  font-family: "STKaiti", "KaiTi", serif;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

/* 社交链接 */
.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.8rem;
  background: rgba(126, 107, 143, 0.05);
  border: 1px solid rgba(126, 107, 143, 0.2);
  border-radius: 10px;
  color: #7e6b8f;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: "STKaiti", "KaiTi", serif;

  &:hover {
    background: #7e6b8f;
    color: white;
    transform: translateY(-2px);
  }
}

.social-icon {
  font-size: 1.2rem;
}

/* 国风名言卡片 */
.chinese-quote {
  background: linear-gradient(135deg, rgba(126, 107, 143, 0.08), rgba(126, 107, 143, 0.03));
  border-left: 5px solid #7e6b8f;
  flex-shrink: 0;
}

.quote-content {
  text-align: center;
}

.quote-icon {
  font-size: 2rem;
  color: #7e6b8f;
  font-family: "SimSun", serif;
  line-height: 1;
}

.quote-text {
  font-size: 1.1rem;
  color: #7e6b8f;
  margin: 0.8rem 0;
  font-family: "STKaiti", "KaiTi", serif;
  line-height: 1.6;
}

.quote-author {
  color: #999;
  font-style: italic;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* 通用卡片样式 */
.section {
  background: transparent;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
  border-left: 3px solid #7e6b8f;
  padding-left: 12px;
}

/* 教育背景样式增强 */
.education-item {
  padding: 0.5rem 0;
}

.edu-header {
  margin-bottom: 0.5rem;
}

.edu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.edu-title h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.edu-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.degree-badge {
  background: #7e6b8f;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge {
  background: linear-gradient(135deg, #6b8f7e, #5a7c6b);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.period {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  background: rgba(126, 107, 143, 0.08);
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
}

.major-college {
  margin-bottom: 0.75rem;
}

.major {
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
}

.college {
  color: #888;
  font-size: 0.9rem;
}

.gpa-info {
  background: linear-gradient(135deg, rgba(126, 107, 143, 0.08), rgba(126, 107, 143, 0.03));
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 3px solid #7e6b8f;
}

.gpa-label {
  color: #7e6b8f;
  font-weight: 500;
  font-size: 0.9rem;
}

.gpa-value {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: monospace;
}

.courses h5 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.95rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.course-tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7e6b8f;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.course-tag:hover {
  background: rgba(126, 107, 143, 0.2);
  transform: translateY(-1px);
}

/* 技能专长 */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-category h4 {
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: rgba(126, 107, 143, 0.08);
  color: #2c3e50;
  border: 1px solid rgba(126, 107, 143, 0.2);
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: rgba(126, 107, 143, 0.15);
  transform: translateY(-2px);
}

/* 项目经验 */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-item {
  padding: 1rem;
  border-left: 4px solid #7e6b8f;
  background: rgba(126, 107, 143, 0.05);
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;
}

.project-item:hover {
  background: rgba(126, 107, 143, 0.08);
  transform: translateX(5px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.project-header h4 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.project-id-badge {
  display: inline-block;
  background: linear-gradient(135deg, #7e6b8f, #9b8aae);
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  letter-spacing: 0.5px;
  font-family: monospace;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #7e6b8f;
  text-decoration: none;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #5a4a6b;
  text-decoration: underline;
}

.link-icon {
  font-size: 0.9rem;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;

  .label {
    font-weight: 600;
    color: #7e6b8f;
    margin-right: 0.5rem;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7e6b8f;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

/* 荣誉奖项 */
.honors-section {
  margin-bottom: 0;
}

.honors-layout {
  display: flex;
  gap: 1.5rem;
}

.honors-sidebar {
  width: 120px;
  flex-shrink: 0;
  background: rgba(126, 107, 143, 0.05);
  border-radius: 12px;
  padding: 0.75rem;
  height: fit-content;
}

.honor-category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
  margin-bottom: 4px;
}

.honor-category-item:hover {
  background: rgba(126, 107, 143, 0.1);
}

.honor-category-item.active {
  background: #7e6b8f;
  color: white;
}

.honor-category-item.active .category-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.category-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.category-count {
  background: rgba(126, 107, 143, 0.15);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #7e6b8f;
}

.honors-content {
  flex: 1;
  min-width: 0;
}

/* 年级分组标题样式 */
.honor-grade-group {
  margin-bottom: 1.5rem;
}

.honor-grade-group:last-child {
  margin-bottom: 0;
}

.honor-grade-title {
  font-size: 1rem;
  font-weight: 600;
  color: #7e6b8f;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid rgba(126, 107, 143, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.grade-icon {
  font-size: 1rem;
}

.grade-count {
  background: rgba(126, 107, 143, 0.15);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #7e6b8f;
  margin-left: 0.5rem;
}

.honors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.honor-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(126, 107, 143, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.honor-card:hover {
  background: rgba(126, 107, 143, 0.1);
  transform: translateX(5px);
}

.honor-level {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.honor-national {
  background: #ffd700;
  color: #8b6914;
}

.honor-provincial {
  background: #c0c0c0;
  color: #4a4a4a;
}

.honor-school {
  background: #cd7f32;
  color: white;
}

.honor-cert {
  background: #7e6b8f;
  color: white;
}

.honor-default {
  background: #e0e0e0;
  color: #666;
}

.honor-name {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
}

.honor-year {
  font-size: 0.7rem;
  color: #999;
  white-space: nowrap;
}

.no-honors {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.9rem;
}
</style>
<template>
  <div class="resume-page">
    <Header></Header>

    <!-- 页面横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>个人简历</h1>
        <p class="typing-text">全栈开发者 · 热爱技术 · 追求卓越</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="resume-content">
      <div class="container">
        <!-- 左侧主要内容区域 -->
        <div class="main-content">
          <!-- 基本信息卡片 -->
          <section class="info-card">
            <div class="avatar-section">
              <div class="avatar">
                <img src="../../assets/images/logo.png" alt="头像">
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
          </section>

          <!-- 导航栏容器 -->
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
              </button>
              <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'honors' }"
                  @click="activeTab = 'honors'"
              >
                🏆 荣誉奖项
              </button>
            </div>

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
                      <h4>{{ resumeEducation.school }}</h4>
                      <span class="time">{{ resumeEducation.degree }}</span>
                    </div>
                    <p class="period">{{ resumeEducation.period }}</p>
                    <p class="major">{{ resumeEducation.major }}</p>
                    <div class="courses">
                      <h5>主修课程：</h5>
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
                        <h4>{{ project.name }}</h4>
                        <div class="project-links" v-if="project.giteeUrl || project.projectUrl">
                          <a v-if="project.giteeUrl" :href="project.giteeUrl" target="_blank" class="project-link">
                            <span class="link-icon">🐙</span> GitHub
                          </a>
                          <a v-if="project.projectUrl && project.projectUrl !== '#'" :href="project.projectUrl" target="_blank" class="project-link">
                            <span class="link-icon">🔗</span> 项目地址
                          </a>
                        </div>
                      </div>
                      <p class="project-description">{{ project.description }}</p>
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
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'all' }" @click="activeHonorCategory = 'all'">
                        <span class="category-name">全部</span>
                        <span class="category-count">{{ allHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'national' }" @click="activeHonorCategory = 'national'">
                        <span class="category-name">国家级</span>
                        <span class="category-count">{{ nationalHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'provincial' }" @click="activeHonorCategory = 'provincial'">
                        <span class="category-name">省级</span>
                        <span class="category-count">{{ provincialHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'school' }" @click="activeHonorCategory = 'school'">
                        <span class="category-name">校级</span>
                        <span class="category-count">{{ schoolHonors.length }}</span>
                      </div>
                      <div class="honor-category-item" :class="{ active: activeHonorCategory === 'cert' }" @click="activeHonorCategory = 'cert'">
                        <span class="category-name">证书</span>
                        <span class="category-count">{{ certHonors.length }}</span>
                      </div>
                    </div>
                    <div class="honors-content">
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
                </section>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <section class="widget">
            <div class="author-card">
              <div class="author-avatar">
                <img src="../../assets/images/logo.png" alt="作者头像">
              </div>
              <h3 class="author-name">烈焰飞鸟</h3>
              <p class="author-bio">心怀热爱，永远是当打之年！</p>
              <div class="author-stats">
                <div class="stat-item">
                  <span class="stat-number">5+</span>
                  <span class="stat-label">项目</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">10+</span>
                  <span class="stat-label">技术栈</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">8+</span>
                  <span class="stat-label">证书</span>
                </div>
              </div>
              <div class="social-links">
                <a href="https://github.com/flaming-bird1" target="_blank" class="social-link">GitHub</a>
                <a href="https://gitee.com/flaming-bird" target="_blank" class="social-link">Gitee</a>
                <a href="https://blog.csdn.net/lieyanfeiniao_?spm=1000.2115.3001.10640" target="_blank" class="social-link">CSDN</a>
              </div>
            </div>
          </section>

          <section class="widget chinese-quote">
            <div class="quote-content">
              <div class="quote-icon">「</div>
              <p class="quote-text">博观而约取，厚积而薄发</p>
              <div class="quote-icon">」</div>
              <p class="quote-author">—— 苏轼</p>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="floating-actions">
      <button class="action-btn download-btn" @click="downloadResume">
        📄 下载简历
      </button>
      <button class="action-btn contact-btn" @click="showContact">
        📧 联系我
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/Header.vue'
import {
  getResumeBaseInfo,
  getResumeEducation,
  getResumeSkills,
  getResumeHonors,
  getResumeProjects
} from '@/data/resume.ts'
import type { ResumeBaseInfo, ResumeEducation, ResumeProject, ResumeHonor } from '@/types/resume.ts'

const resumeBaseInfo = ref<ResumeBaseInfo>(getResumeBaseInfo())
const resumeEducation = ref<ResumeEducation>(getResumeEducation())
const resumeSkills = ref(getResumeSkills())
const resumeHonors = ref<ResumeHonor[]>(getResumeHonors())
const resumeProjects = ref<ResumeProject[]>(getResumeProjects())

const activeTab = ref('education')

// 荣誉奖项分类
const activeHonorCategory = ref('all')

const allHonors = computed(() => resumeHonors.value)
const nationalHonors = computed(() => resumeHonors.value.filter(h => h.level === '国家级'))
const provincialHonors = computed(() => resumeHonors.value.filter(h => h.level === '省级'))
const schoolHonors = computed(() => resumeHonors.value.filter(h => h.level === '校级'))
const certHonors = computed(() => resumeHonors.value.filter(h => h.level === '证书'))

const filteredHonors = computed(() => {
  switch (activeHonorCategory.value) {
    case 'national': return nationalHonors.value
    case 'provincial': return provincialHonors.value
    case 'school': return schoolHonors.value
    case 'cert': return certHonors.value
    default: return allHonors.value
  }
})

const getHonorLevelClass = (level?: string) => {
  if (!level) return 'honor-default'
  const levelMap: Record<string, string> = {
    '国家级': 'honor-national',
    '省级': 'honor-provincial',
    '校级': 'honor-school',
    '证书': 'honor-cert'
  }
  return levelMap[level] || 'honor-default'
}

const downloadResume = () => {
  window.print()
}

const showContact = () => {
  const contactInfo = `电话：${resumeBaseInfo.value.phone}\n邮箱：${resumeBaseInfo.value.email}`
  alert(contactInfo)
}
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  background: transparent;
}

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
  position: relative;
  overflow: hidden;
  background: linear-gradient(
      135deg,
      rgba(110, 95, 125, 0.4) 0%,
      rgba(126, 107, 143, 0.3) 50%,
      rgba(150, 135, 165, 0.2) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.banner h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-family: "STKaiti", "KaiTi", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 3px;
}

.typing-text {
  font-size: 1.8rem;
  min-height: 2.5rem;
  overflow: hidden;
  border-right: 4px solid rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  width: 420px;
  margin: 1.5rem auto 0;
  animation: typing 3.5s steps(13, end), blink-caret 0.75s step-end infinite;
  font-family: "STKaiti", "KaiTi", serif;
  color: rgba(255, 255, 255, 0.95);
}

@keyframes typing {
  from { width: 0; }
  to { width: 420px; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: rgba(255, 255, 255, 0.9); }
}

/* 主内容区样式 */
.resume-content {
  min-height: 100vh;
  padding: 4rem 0;
}

.container {
  max-width: 1170px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

/* 左侧主要内容 */
.main-content {
  min-width: 0;
}

/* 基本信息卡片 */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.15);
  margin-bottom: 2rem;
  border: 1px solid rgba(126, 107, 143, 0.2);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #7E6B8F;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-info h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.title {
  font-size: 1.2rem;
  color: #7E6B8F;
  margin-bottom: 1rem;
  font-weight: 500;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

/* 导航栏样式 */
.nav-tabs-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(126, 107, 143, 0.2);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid rgba(126, 107, 143, 0.2);
  background: #f8f6fa;
  flex-wrap: wrap;
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
}

.tab-btn:hover {
  color: #7E6B8F;
  background: rgba(126, 107, 143, 0.05);
}

.tab-btn.active {
  color: #7E6B8F;
  background: white;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #7E6B8F;
}

.tab-content-wrapper {
  padding: 1.5rem;
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

/* 通用卡片样式 */
.section {
  background: transparent;
  border-radius: 12px;
  padding: 0;
}

.section-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
  border-left: 3px solid #7E6B8F;
  padding-left: 12px;
}

/* 教育背景 */
.education-item {
  padding: 0.5rem 0;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.edu-header h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
}

.time {
  background: #7E6B8F;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.period {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.major {
  color: #666;
  margin-bottom: 1rem;
}

.courses h5 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.course-tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7E6B8F;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
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
  border-left: 4px solid #7E6B8F;
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
  color: #2c3e50;
  margin: 0;
  font-size: 1.1rem;
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
  color: #7E6B8F;
  text-decoration: none;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #5a4a6b;
  text-decoration: underline;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tag {
  background: rgba(126, 107, 143, 0.1);
  color: #7E6B8F;
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
  background: #7E6B8F;
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
  color: #7E6B8F;
}

.honors-content {
  flex: 1;
  min-width: 0;
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
  background: #7E6B8F;
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

/* 右侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.widget {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(126, 107, 143, 0.15);
  border: 1px solid rgba(126, 107, 143, 0.2);
}

.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 3px solid #7E6B8F;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 1.3rem;
  color: #7E6B8F;
  margin-bottom: 0.5rem;
  font-family: "STKaiti", "KaiTi", serif;
}

.author-bio {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
  border-left: 3px solid #7E6B8F;
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
  color: #7E6B8F;
  font-family: "STKaiti", "KaiTi", serif;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.social-link {
  color: #7E6B8F;
  text-decoration: none;
  padding: 0.8rem;
  border: 1px solid rgba(126, 107, 143, 0.3);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "STKaiti", "KaiTi", serif;
}

.social-link:hover {
  background: #7E6B8F;
  color: white;
  border-color: #7E6B8F;
  transform: translateY(-2px);
}

/* 国风名言组件 */
.chinese-quote {
  background: linear-gradient(135deg, rgba(126, 107, 143, 0.1), rgba(126, 107, 143, 0.05));
  border-left: 5px solid #7E6B8F;
}

.quote-content {
  text-align: center;
}

.quote-icon {
  font-size: 2rem;
  color: #7E6B8F;
  font-family: "SimSun", serif;
  line-height: 1;
}

.quote-text {
  font-size: 1.2rem;
  color: #7E6B8F;
  margin: 1rem 0;
  font-family: "STKaiti", "KaiTi", serif;
  line-height: 1.6;
}

.quote-author {
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

/* 浮动操作按钮 */
.floating-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1000;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  font-family: "STKaiti", "KaiTi", serif;
}

.download-btn {
  background: #7E6B8F;
  color: white;
}

.contact-btn {
  background: white;
  color: #7E6B8F;
  border: 2px solid #7E6B8F;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  .banner h1 {
    font-size: 3rem;
  }

  .typing-text {
    font-size: 1.6rem;
    width: 380px;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 380px; }
  }
}

@media (max-width: 768px) {
  .banner {
    height: 50vh;
    margin-top: 60px;
  }

  .banner h1 {
    font-size: 2.5rem;
  }

  .typing-text {
    font-size: 1.4rem;
    width: 340px;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 340px; }
  }

  .resume-content {
    padding: 2rem 0;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 15px;
  }

  .sidebar {
    order: -1;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .honors-layout {
    flex-direction: column;
  }

  .honors-sidebar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .honor-category-item {
    flex: 1;
    min-width: 80px;
    justify-content: center;
  }

  .tabs-header {
    flex-direction: column;
  }

  .tab-btn {
    text-align: center;
  }

  .tab-btn.active::after {
    display: none;
  }
}

@media (max-width: 480px) {
  .banner {
    height: 40vh;
    margin-top: 55px;
    padding: 0 15px;
  }

  .banner h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .typing-text {
    font-size: 1.2rem;
    width: 280px;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 280px; }
  }

  .container {
    padding: 0 10px;
    gap: 1.5rem;
  }

  .info-card {
    padding: 1rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .basic-info h2 {
    font-size: 1.5rem;
  }

  .tab-content-wrapper {
    padding: 1rem;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .honors-grid {
    grid-template-columns: 1fr;
  }

  .floating-actions {
    bottom: 1rem;
    right: 1rem;
  }

  .action-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .widget {
    padding: 1rem;
  }
}

@media (max-width: 360px) {
  .banner h1 {
    font-size: 1.8rem;
  }

  .typing-text {
    font-size: 1rem;
    width: 240px;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 240px; }
  }

  .tab-btn {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
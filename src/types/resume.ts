// 基础信息
export interface ResumeBaseInfo {
    name: string      // 姓名
    phone: string     // 电话
    email: string     // 邮箱
    education: string // 学历
    school: string    // 学校
    major: string     // 专业
    blog: string      // 博客
}

// 教育背景（包含主修课程）
export interface ResumeEducation {
    school: string      // 学校
    college?: string    // 学院
    major: string       // 专业
    degree: string      // 学历：本科/硕士/博士
    period: string      // 就读时间
    status?: string     // 当前状态：在读/应届毕业生/已毕业
    gpa?: string        // 绩点：3.8/4.0 或 87.6/100
    courses: string[]   // 主修课程
}

// 项目经验
export interface ResumeProject {
    id: string
    name: string
    description: string  // 项目概述
    detail: string       // 详细内容
    tags: string[]       // 技能标签
    projectUrl?: string  // 项目地址（可选）
    giteeUrl?: string    // Gitee地址（可选）
}

// 荣誉奖项
export interface ResumeHonor {
    id: string
    name: string
    year?: string       // 获奖年份
    level?: string      // 奖项级别（国家级/省级/校级）
    grade?: string      // 年级
}
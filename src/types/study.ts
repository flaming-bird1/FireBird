// types/study.ts

// 每日记录
export interface DailyRecord {
    id: string
    date: string           // 日期
    weekday: string        // 星期几
    summary: string[]      // 今日总结（分点）
    tomorrowTasks: string[] // 明日安排（分点）
    feeling?: string       // 感受（可选字段）
    studyHours?: number    // 学习时长
}

// 每周总结（带可选的下周安排）
export interface WeeklySummary {
    id: string
    weekStart: string      // 周开始日期
    weekEnd: string        // 周结束日期
    summary: string[]      // 本周总结（分点）
    nextWeekTasks?: string[] // 下周安排（分点，可选）
}
// src/utils/articleLoader.ts
import type { ArticleDetail } from '@/types/article'

/**
 * 加载文章内容
 */
export async function loadArticleContent(id: string): Promise<ArticleDetail | null> {
    try {
        const { getArticleById } = await import('@/data/articles')
        const articleResponse = getArticleById(id)

        if (!articleResponse.success || !articleResponse.article) {
            return null
        }

        // 使用 fileName 字段
        const fileName = articleResponse.article.fileName

        // 动态导入 Markdown 文件
        const module = await import(`../content/articles/${fileName}.md?raw`)
        const content = module.default

        return {
            ...articleResponse.article,
            content: content,
            readingTime: calculateReadingTime(content),
            wordCount: content.length
        }
    } catch (error) {
        console.error(`加载文章 ${id} 失败:`, error)
        return null
    }
}

/**
 * 计算阅读时间（按每分钟400字计算）
 */
function calculateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / 400)
}
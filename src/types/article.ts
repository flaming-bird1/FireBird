// 文章详情接口（包含内容）
export interface ArticleDetail extends Article {
    content: string
    readingTime?: number
    wordCount?: number
}

// 文章接口定义
export interface Article {
    id: string
    title: string
    date: string
    description: string
    tags: string[]
    cover?: string
    content?: string
    fileName: string // 添加文件名字段
    fileType?: 'md' | 'pdf'  // 添加文件类型
}

// 文章列表响应类型
export interface ArticleListResponse {
    articles: Article[]
    total: number
}

// 文章详情响应类型
export interface ArticleDetailResponse {
    article: Article | null
    success: boolean
    message?: string
}
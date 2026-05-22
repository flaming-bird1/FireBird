import type {Article, ArticleListResponse, ArticleDetailResponse} from '@/types/article.ts'

// 文章数据
export const articles: Article[] = [
    {
        id: '1',
        title: 'Java网络编程入门指南：从基础到实战',
        date: '2025-08-29',
        description: '文章深入解析了IP地址、端口号和协议三大通信要素，对比了TCP的可靠连接与UDP的高效传输特性，并通过实际代码演示了Socket编程、多线程服务端开发以及WebSocket实时通信技术。最后，巧妙地将网络连接比作七夕鹊桥，为技术内容增添了人文浪漫色彩，是一份兼顾理论基础与实践应用的综合性教程。',
        tags: ['Java', '网络编程', '后端'],
        // 使用公共目录（public目录）
        // cover: '/images/cover/Java网络编程.png',
        cover: '/images/article_cover/Java网络编程.png',
        fileName: 'java-network-programming', // 对应的Markdown文件名
        fileType: 'md'  // 明确指定文件类型
    },
    {
        id: '2',
        title: '数据库原理与应用期末复习资料',
        date: '2025-07-23',
        description: '概述了数据库系统的核心概念，如数据、DB、DBMS及DBS，并介绍了其三级模式结构和两级映像机制以确保数据独立性。探讨了关系模型特性，包括实体与参照完整性，以及SQL语言的基础功能。此外，还有事务的ACID特性、并发控制中的锁机制、故障恢复策略和关系数据库规范化理论，从第一范式到BCNF，旨在消除不适当的函数依赖，确保数据一致性和减少冗余。',
        tags: ['数据库', 'MySQL', '后端'],
        cover: '/images/article_cover/数据库原理与应用.png',
        fileName: '数据库原理与应用期末复习资料', // 对应的Markdown文件名
        fileType: 'md'  // 明确指定文件类型
    },
    {
        id: '3',
        title: '基于随机森林的20Newsgroups文本分类实战',
        date: '2025-08-24',
        description: '本文详细介绍了使用随机森林算法对20Newsgroups数据集进行文本分类的完整流程。这个数据集包含20个不同主题的新闻组，涵盖了从计算机技术到宗教信仰的广泛话题。通过TF-IDF特征提取、模型训练、评估和优化，实现了84.14%的分类准确率。',
        tags: ['机器学习', 'python', '随机森林'],
        // cover: '/covers/typescript.jpg'
        cover: '/images/article_cover/基于随机森林的20Newsgroups文本分类实战.png',
        fileName: '基于随机森林的20Newsgroups文本分类实战', // 对应的Markdown文件名
        fileType: 'md'  // 明确指定文件类型
    },
    {
        id: '4',
        title: '在Spring Boot项目中集成讯飞星火大模型',
        date: '2025-05-05',
        description: '本文将介绍如何通过Spring Boot后端调用讯飞星火大模型API，并将结果返回给Vue3 + Element Plus前端页面进行交互式展示。',
        tags: ['大模型', 'spring boot'],
        // cover: '/covers/typescript.jpg'
        cover: '/images/article_cover/Spring Boot 与讯飞 API 集成及前后端交互.png',
        fileName: '在Spring Boot项目中集成讯飞星火大模型', // 对应的Markdown文件名
        fileType: 'md'  // 明确指定文件类型
    },
    {
        id: '5',
        title: '华为云部署前后端服务',
        date: '2026-01-06',
        description: '本文提供了华为云服务器部署前后端服务的完整指南。主要内容包括：1)配置安全组和防火墙开放端口；2)通过Nginx部署前端Vue项目，包括目录配置、反向代理设置和性能优化；3)使用Systemd管理SpringBoot后端服务，实现开机自启和进程监控；4)提供常用的服务管理命令和日志查看方法。文章采用实战操作方式，包含详细的代码片段和配置示例，适合开发者快速将项目部署到云端，并附有安全提示和性能优化建议。',
        tags: ['华为云', '前端', '后端'],
        cover: '/images/article_cover/华为云部署前后端服务.png',
        fileName: '华为云部署前后端服务', // 对应的Markdown文件名
        fileType: 'md'  // 明确指定文件类型
    },

]

// 获取所有文章
export function getAllArticles(): ArticleListResponse {
    const sortedArticles = [...articles].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return {
        articles: sortedArticles,
        total: sortedArticles.length
    }
}

// 根据ID获取文章
export function getArticleById(id: string): ArticleDetailResponse {
    const article = articles.find(article => article.id === id)

    if (!article) {
        return {
            article: null,
            success: false,
            message: '文章不存在'
        }
    }

    return {
        article,
        success: true
    }
}

// 根据标签筛选文章
export function getArticlesByTag(tag: string): ArticleListResponse {
    const filteredArticles = articles.filter(article =>
        article.tags.includes(tag)
    )

    return {
        articles: filteredArticles,
        total: filteredArticles.length
    }
}

// 获取所有标签
export function getAllTags(): string[] {
    const tagSet = new Set<string>()
    articles.forEach(article => {
        article.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
}
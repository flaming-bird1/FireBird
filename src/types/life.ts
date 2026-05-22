export interface LifeMoment {
    id: string // 朋友圈ID
    content: string // 朋友圈内容
    images: string[] // 朋友圈图片
    createTime: string // 朋友圈创建时间
    location?: string // 朋友圈位置
}


export interface LifeAlbum {
    id: string
    name: string
    cover: string
    count: number
    description: string
    createTime: string
}

export interface FriendSuggestion {
    id: string
    name: string
    avatar: string
    desc: string
}
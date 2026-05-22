// import {createRouter, createWebHistory} from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'  // 改用 createWebHashHistory
import HomeView from '../views/Home.vue'

const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(import.meta.env.BASE_URL),  // 改为 Hash 模式
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        // 文章详情
        {
            path: '/article/:id',
            name: 'ArticleDetail',
            component: () => import('@/components/ArticleDetail.vue')
        },
        // 生活，部署的时候，把这部分注释掉
        {
            path: '/life',
            name: 'Life',
            component: () => import('@/views/Life.vue')
        },
        // 考研痕迹
        {
            path: '/study',
            name: 'Study',
            component: () => import('@/views/Study.vue')
        },
        // 测试
        {
            path: '/test',
            name: 'Test',
            component: () => import('@/views/test/Resume02.vue')
        },
        // 关于
        {
            path: '/about',
            name: 'About',
            component: () => import('@/views/Resume.vue')
        }
        // {
        //     path: '/life',
        //     component: LifeLayout, // 生活页面的布局组件
        //     children: [
        //         {
        //             path: '',
        //             component: LifeMain, // 生活主页
        //             name: 'life'
        //         },
        //         {
        //             path: 'album',
        //             component: LifeAlbum, // 相册页面
        //             name: 'life-album'
        //         },
        //         {
        //             path: 'essay',
        //             component: LifeEssay, // 随笔页面
        //             name: 'life-essay'
        //         }
        //     ]
        // }
    ],
})

export default router

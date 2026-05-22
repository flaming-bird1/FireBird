// 动画工具函数
import {ref} from "vue";

/**
 * 为所有需要滚动动画的元素添加类：.animate-on-scroll，然后自己设置进入、离开视口动画：animate-in、animate-out。
 */
export const useScrollAnimation = () => {
    /*
    * 创建一个IntersectionObserver实例，并返回一个ref对象，用于存储该实例。
    * observer这个响应式变量的值只能是两种类型之一：
    * IntersectionObserver：一个有效的 Intersection Observer 实例
    * null：空值（初始状态或重置后的状态）
    * 一开始 observer的值是 null
     */
    const observer = ref<IntersectionObserver | null>(null)

    const initScrollAnimation = () => {
        observer.value = new IntersectionObserver(entries => { // 创建观察者实例
                entries.forEach(entry => {
                    // 进入视口时添加动画类
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in')
                        entry.target.classList.remove('animate-out')
                    } else {
                        // 离开视口时移除动画类（用于向上滚动）
                        entry.target.classList.remove('animate-in')
                        entry.target.classList.add('animate-out')
                    }
                })
            },
            {
                threshold: 0.1, // 配置选项：10%可见时触发
                rootMargin: '0px 0px -50px 0px'// 配置：底部内缩50px
            }
        )

        // 获取所有具有滚动动画的元素
        const scrollElements = document.querySelectorAll('.animate-on-scroll')
        scrollElements.forEach(el => {
            /**
             * observer.value?.observe(el)
             * 这是最关键的一行，使用了 可选链操作符（?.）：
             * observer.value：获取 Vue ref 的实际值（IntersectionObserver 实例）
             * ?.：可选链操作符。如果 observer.value为 null或 undefined，整个表达式直接返回 undefined，不会报错
             * observe(el)：IntersectionObserver 的方法，开始观察指定的 DOM 元素
             * // 如果没有可选链，可能会这样写：
             * if (observer.value) {
             *     observer.value.observe(el)
             * }
             */
            observer.value?.observe(el) // 观察元素
        })
    }

    /**
     * 定义了一个清理函数，用于在不需要时安全地停止和销毁 Intersection Observer。
     */
    const destroy =()=>{
        observer.value?.disconnect()
    }

    return {
        initScrollAnimation,
        destroy
    }
}
import { createRouter, createWebHistory } from 'vue-router'
import forum from '@/views/forum/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      name: 'home',
      component: forum,
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('@/views/card/index.vue'),
      meta: { title: '财务' }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/calendar-demo',
      name: 'calendar-demo',
      component: () => import('@/views/calendar-demo.vue'),
      meta: { title: 'Calendar 组件示例' }
    },
  ],
})

export default router

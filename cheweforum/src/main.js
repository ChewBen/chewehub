import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/styles/tailwind.css' // Tailwind CSS

import App from './App.vue'
import router from './router'

// 路由守卫
import './permission'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

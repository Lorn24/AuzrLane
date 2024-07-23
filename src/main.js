import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import Particles from 'vue3-particles'
import App from './App.vue'
import router from './router'

import './styles/base.css' // css 样式重置
import './styles/common.css' // 公共全局样式

const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)
app.use(Particles)
app.mount('#app')

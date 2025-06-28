import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { useActiveBeasts } from '@/stores/activeBeasts'; // 👈

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

/* preload så listen er klar fra første render */
useActiveBeasts()

app.mount('#app')

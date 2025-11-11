import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 1. Importamos nuestro router
const app = createApp(App)

app.use(router) // 2. Le decimos a la app que use el router

app.mount('#app')

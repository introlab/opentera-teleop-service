import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import StatusBar from '@/components/StatusBar.vue'

const app = createApp(App)

// Add components
app.component('StatusBar', StatusBar)

// Modules
app.use(store)
app.use(router)
app.mount('#app')

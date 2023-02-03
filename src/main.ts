import { createApp } from 'vue'
import store from './store/store'
import router from './router/router'
import App from './App.vue'
import 'easymde/dist/easymde.min.css'

createApp(App).use(store).use(router).mount('#app')

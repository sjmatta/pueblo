import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'

import '@/assets/index.css'

const store = createPinia()
store.use(piniaPluginPersistedstate)

createApp(App).use(store).mount('#app')

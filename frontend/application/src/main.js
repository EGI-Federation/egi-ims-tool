import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { store } from "./store"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .use(router)
    .use(i18n)
    .use(store)
    .mount('#app')

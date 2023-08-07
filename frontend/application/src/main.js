import App from './App.vue'
import { createApp } from 'vue'
import { store } from "./store"
import router from './router'
import i18n from './locales'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .mount('#app');

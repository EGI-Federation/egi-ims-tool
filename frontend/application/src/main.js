import App from './App.vue'
import { createApp } from 'vue'
import { store } from "./store"
import router from './router'
import i18n from './locales'
import VueMarkdownIt from 'vue3-markdown-it'
import VueDatePicker from '@vuepic/vue-datepicker'

import "gridjs/dist/theme/mermaid.css"
import '@vuepic/vue-datepicker/dist/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .use(VueMarkdownIt)
    .component('VueDatePicker', VueDatePicker)
    .mount('#app');

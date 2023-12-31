import App from './App.vue'
import { createApp } from 'vue'
import { store } from "./store"
import { tooltip } from './tooltip'
import router from './router'
import i18n from './locales'
import VueMarkdownIt from 'vue3-markdown-it'
import VueDatePicker from '@vuepic/vue-datepicker'

import "gridjs/dist/theme/mermaid.css"
import '@vuepic/vue-datepicker/dist/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "json.date-extensions"

JSON.useDateParser();

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .use(VueMarkdownIt)
    .component('VueDatePicker', VueDatePicker)
    .directive('tooltip', tooltip)
    .mount('#app');

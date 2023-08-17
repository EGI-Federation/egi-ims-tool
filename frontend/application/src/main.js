import App from './App.vue'
import { createApp } from 'vue'
import { store } from "./store"
import router from './router'
import i18n from './locales'
import VueMarkdownIt from 'vue3-markdown-it';

import "gridjs/dist/theme/mermaid.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .use(VueMarkdownIt)
    .mount('#app');

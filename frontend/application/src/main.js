import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

// Create a store for shared data across pages
export const store = createStore({
    state () {
        return {
            loggedIn: true,
            userId: 10,
            userFullName: 'John Doe',
            userEmail: 'john.doe@abc.com',
        }
    },
    mutations: {
        logIn (state) {
            state.loggedIn = true;
        },
        logOut (state) {
            state.loggedIn = false;
            state.userId = 0;
            state.userFullName = null;
            state.userEmail = null;
        }
    }
})

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')

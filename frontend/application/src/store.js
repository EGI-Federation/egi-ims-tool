import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
import i18n, { languageNames } from './locales'

var sls = new SecureLS({ isCompression: false });

// Create a store for shared data across pages
export const store = createStore({
    state() {
        return {
            language: null,
            loggedIn: true,
            accessToken: null,
            isAdmin: true,
            userId: 10,
            userFullName: 'Jonathan Wick',
            userEmail: 'john.wick@egi.eu',
            notifications: [{ isNew: false },{ isNew: true }],
        }
    },
    getters: {
        language(state) { return state.language; },
        languageName(state) { return languageNames[state.language]; },
        unreadNotifications(state) { return state.notifications.filter(msg => msg.isNew).length; },
    },
    mutations: {
        updateLocale(state, newLocale) {
            state.language = newLocale;
        },
        logIn(state, token) {
            state.loggedIn = true;
            state.accessToken = token;
        },
        logOut(state) {
            state.loggedIn = false;
            state.accessToken = null;
            state.userId = 0;
            state.userFullName = null;
            state.userEmail = null;
        }
    },
    actions: {
        changeLocale({ commit }, newLocale) {
            console.log("Switch language to: " + newLocale);
            i18n.global.locale = newLocale; // important!
            commit('updateLocale', newLocale)
        },
        signOut({ commit }) {
            console.log("Signed out");
            commit('logOut');
        }
    },
    plugins: [createPersistedState(
    // {
    //     storage: {
    //         getItem: (key) => sls.get(key),
    //         setItem: (key, value) => sls.set(key, value),
    //         removeItem: (key) => sls.remove(key),
    //     }
    // }
    )]
})

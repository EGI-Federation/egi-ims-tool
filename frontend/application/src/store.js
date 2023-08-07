import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
import i18n, { languageNames } from './locales'
import {isValid} from "@/utils";

var sls = new SecureLS({ isCompression: false });

// Create a store for shared data across pages
export const store = createStore({
    state() {
        return {
            language: null,
            loggedIn: false,
            accessToken: null,
            userId: 10,
            userFullName: 'John Doe',
            userEmail: 'john.doe@abc.com',
        }
    },
    computed: {
        languageName() {
            return languageNames[this.language];
        }
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

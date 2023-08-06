import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import i18n, { selectedLocale, languages } from './locales'

// Create a store for shared data across pages
export const store = createStore({
    state () {
        return {
            locale: selectedLocale,
            localeName: languages[selectedLocale],
            loggedIn: true,
            userId: 10,
            userFullName: 'John Doe',
            userEmail: 'john.doe@abc.com',
        }
    },
    mutations: {
        updateLocale(state, newLocale) {
            state.locale = newLocale;
            state.localeName = languages[newLocale];
        },
        logIn(state) {
            state.loggedIn = true;
        },
        logOut(state) {
            state.loggedIn = false;
            state.userId = 0;
            state.userFullName = null;
            state.userEmail = null;
        }
    },
    actions: {
        changeLocale({ commit }, newLocale, newLocaleName) {
            i18n.locale = newLocale // important!
            commit('updateLocale', newLocale)
        }
    },
    plugins: [createPersistedState()]
})

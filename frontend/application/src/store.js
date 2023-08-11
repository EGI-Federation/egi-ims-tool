import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
import { vuexOidcCreateStoreModule } from 'vuex-oidc'
import { oidcSettings } from '@/config/oidc'
import i18n, { languageNames } from './locales'

var sls = new SecureLS({ isCompression: false });

// Create a store for shared data across pages
export const store = createStore({
    modules: {
        ims: {
            namespaced: true,
            state() {
                return {
                    language: null,
                    loggedIn: true,
                    accessToken: null,
                    isAdmin: true,
                    userId: 10,
                    userFullName: 'Jonathan Wick',
                    userEmail: 'john.wick@egi.eu',
                    notifications: [{isNew: false}, {isNew: true}],
                }
            },
            getters: {
                language(state) {
                    return state.language;
                },
                languageName(state) {
                    return languageNames[state.language];
                },
                unreadNotifications(state) {
                    return state.notifications.filter(msg => msg.isNew).length;
                },
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
                changeLocale({commit}, newLocale) {
                    console.log("Switch language to: " + newLocale);
                    i18n.global.locale = newLocale; // important!
                    commit('updateLocale', newLocale)
                },
                signOut({commit}) {
                    console.log("Signed out");
                    commit('logOut');
                }
            },
        },
        oidc: vuexOidcCreateStoreModule(
            oidcSettings,
            // NOTE: If you do not want to use localStorage for tokens, in stead of just passing oidcSettings, you can
            // spread your oidcSettings and define a userStore of your choice
            // {
            //   ...oidcSettings,
            //   userStore: new WebStorageStateStore({ store: window.sessionStorage })
            // },
            // Optional OIDC store settings
            {
                namespaced: true,
                isAuthenticatedBy: 'access_token',
                removeUserWhenTokensExpire: false,
                dispatchEventsOnWindow: true
            },
            // Optional OIDC event listeners
            {
                userLoaded: (user) => console.log('OIDC user is loaded:', user),
                userUnloaded: () => console.log('OIDC user is unloaded'),
                accessTokenExpiring: () => console.log('Access token will expire'),
                accessTokenExpired: () => console.log('Access token expired'),
                silentRenewError: () => console.log('OIDC user is unloaded'),
                userSignedOut: () => console.log('OIDC user is signed out'),
                oidcError: (payload) => console.log('OIDC error', payload),
                automaticSilentRenewError: (payload) => console.log('OIDC silent renew error', payload)
            }
        )
    },
    plugins: [createPersistedState(
        // {
        //     storage: {
        //         getItem: (key) => sls.get(key),
        //         setItem: (key, value) => sls.set(key, value),
        //         removeItem: (key) => sls.remove(key),
        //     }
        // }
    )],
})

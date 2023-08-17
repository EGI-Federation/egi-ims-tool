import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
import {vuexOidcCreateStoreModule} from 'vuex-oidc'
import {oidcSettings} from '@/config/oidc'
import i18n, {languageNames} from './locales'
import {isValid} from "@/utils";
import {getRoleByName, hasRole, Roles} from "@/roles";

var sls = new SecureLS({ isCompression: false });

// Create a store for shared data across pages
export const store = createStore({
    modules: {
        // Contains volatile root state (does not get persisted)
        temp: {
           namespaced: false,
            state() {
                return {
                    roles: new Map(), // roles of current user Map<Symbol, { name:String, assigned:boolean, ownedEntities:Set<String> }>
                    users: new Map(), // users holding roles Map<Symbol, Map<checkinUserId, User>>
                }
            },
            mutations: {
                updateRoles(state, roles) {
                    console.log(`Store ${roles.size} roles`);
                    state.roles = roles;
                },
                updateUsers(state, users) {
                    console.log(`Store ${users.size} users`);
                    state.users = users;
                },
                logOut(state) {
                    state.roles = null;
                    console.log("Signed out");
                }
            },
            actions: {
                signOut({commit}) {
                    commit('logOut');
                }
            },
        },
        // Contains IMS state
        ims: {
            namespaced: true,
            state() {
                return {
                    language: null,
                    notifications: [{isNew: false}, {isNew: true}],
                    slm: {
                        processInfo: null, // Version<Process>
                    }
                }
            },
            getters: {
                language(state) {
                    return state.language;
                },
                languageName(state) {
                    return languageNames[state.language];
                },
                userFullName(state, getters, rootState) {
                    if(isValid(rootState.oidc.user.name))
                        return rootState.oidc.user.name;
                    let name = "";
                    if(isValid(rootState.oidc.user.given_name))
                        name = rootState.oidc.user.given_name;
                    if(isValid(rootState.oidc.user.family_name)) {
                        if(name.length > 0)
                            name += " ";
                        name += rootState.oidc.user.family_name;
                    }
                    return name;
                },
                assignedRoles(state, getters, rootState) {
                    if(!isValid(rootState.roles))
                        return null;

                    const assigned = [...rootState.roles].filter(([k, v]) => v.assigned && "member" !== k.description);
                    const ar = [];
                    for(const role of assigned)
                        ar.push(role[0]);
                    return ar;
                },
                isAdmin(state, getters, rootState) {
                    return isValid(rootState.roles) &&
                          (hasRole(rootState.roles, Roles.IMS.IMS_OWNER) ||
                           hasRole(rootState.roles, Roles.IMS.IMS_MANAGER) ||
                           hasRole(rootState.roles, Roles.IMS.IMS_COORDINATOR));
                },
                memberInGroups(state, getters, rootState) {
                    if(!isValid(rootState.roles))
                        return null;

                    const members = [...rootState.roles].filter(([k, v]) => v.assigned && "member" === k.description);
                    const groups = [];
                    for(const role of members)
                        groups.push(role[1].group);
                    return groups;
                },
                allNotifications(state) {
                    return state.notifications;
                },
                unreadNotifications(state) {
                    return state.notifications.filter(msg => msg.isNew);
                },
                unreadNotificationCount(state) {
                    const unread = state.notifications.filter(msg => msg.isNew);
                    return unread.length;
                },
            },
            mutations: {
                updateLocale(state, newLocale) {
                    console.log("Store language: " + newLocale);
                    state.language = newLocale;
                },
                slmProcessInfo(state, info) {
                    console.log("Store SLM process info v" + info.version.version);
                    state.slm.processInfo = info.version;
                    state.slm.error = info.error;
                },
                slmUsers(state, info) {
                    console.log("Store SLM users");
                    store.commit("updateUsers", info.users);
                    state.slm.error = info.error;
                },
            },
            actions: {
                changeLocale({commit}, newLocale) {
                    console.log("Switching language to: " + newLocale);
                    i18n.global.locale = newLocale; // important!
                    commit('updateLocale', newLocale)
                },
            },
        },
        // Contains OIDC state
        oidc: vuexOidcCreateStoreModule(
            oidcSettings,
            // Optional OIDC store settings
            {
                namespaced: true,
                isAuthenticatedBy: 'access_token',
                removeUserWhenTokensExpire: false,
                dispatchEventsOnWindow: true
            },
            // Optional OIDC event listeners
            {
                userLoaded: (user) => console.log('OIDC user is loaded'),
                userUnloaded: () => console.log('OIDC user is unloaded'),
                accessTokenExpiring: () => console.log('Access token will expire'),
                accessTokenExpired: () => console.log('Access token expired'),
                silentRenewError: () => console.log('OIDC user is unloaded'),
                userSignedOut: () => console.log('OIDC user is signed out'),
                oidcError: (payload) => console.log('OIDC error', payload),
                automaticSilentRenewError: (payload) => console.log('OIDC silent renew error', payload)
            }
        ),
    },
    plugins: [createPersistedState(
        {
            paths: ["ims", "oidc"],
            // storage: {
            //     getItem: (key) => sls.get(key),
            //     setItem: (key, value) => sls.set(key, value),
            //     removeItem: (key) => sls.remove(key),
            // }
        }
    )],
})

// Extract the process information then call a mutation on the store to save it
export const storeProcessInfo = function(mutation, piResult) {
    let latest = {};
    if(isValid(piResult.processInfo)) {
        const pi = piResult.processInfo.value;
        latest.version = pi.version;
        latest.changeAt = pi.changeAt;
        latest.changeBy = pi.changeBy;
        latest.changeDescription = pi.changeDescription;
        latest.entity = pi;
    }
    store.commit(mutation, { version: latest, error: piResult.error.value });
}

// Extract the users then call a mutation on the store to save them
export const storeUsersByRole = function(mutation, urResult) {
    let users = new Map();
    if(isValid(urResult.page)) {
        const page = urResult.page.value;
        if(isValid(page.elements)) {
            for(let user of page.elements) {
                for(let roleName of user.roles) {
                    const roleInfo = getRoleByName(Roles.SLM, roleName);
                    if(isValid(roleInfo) && roleInfo.assigned) {
                        // Check if there is a map for this role
                        let roleUserMap = users.get(roleInfo.role);
                        if(null == roleUserMap) {
                            roleUserMap = new Map();
                            users.set(roleInfo.role, roleUserMap);
                        }

                        roleUserMap.set(user.checkinUserId, user);
                    }
                }
            }
        }
    }
    store.commit(mutation, { users: users, error: urResult.error.value });
}

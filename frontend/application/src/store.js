import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
import { vuexOidcCreateStoreModule } from 'vuex-oidc'
import { oidcSettings } from '@/config/oidc'
import i18n, { languageNames } from './locales'
import { isValid } from "@/utils";
import { Roles, getRoleByName, hasRole } from "@/roles";

var sls = new SecureLS({ isCompression: false });

// Create a store for shared data across pages
export const store = createStore({
    modules: {
        // Contains volatile root state (does not get persisted)
        temp: {
           namespaced: false,
            state() {
                return {
                    roles: new Map(),           // Roles of current user Map<Symbol, { name:String, assigned:boolean, ownedEntities:Set<String> }>
                    rolesByProcess: new Map(),  // Role definitions for all processes Map<String, Map<String, Role>>
                    users: new Map(),           // Users in the VO Map<checkinUserId, User>
                    usersByProcess: new Map(),  // Users that are members of processes Map<String, Map<checkinUserId, User>>
                    usersByRole: new Map(),     // Users holding roles (including pseudo roles) in any process Map<String, Map<checkinUserId, User>>
                }
            },
            mutations: {
                updateRoles(state, roles) {
                    console.log(`Store ${roles.size} roles of current user`);
                    state.roles = roles;
                },
                updateRolesByProcess(state, info) {
                    console.log(`Store ${info.roles.size} role definitions of process ${info.processCode}`);
                    state.rolesByProcess.set(info.processCode, info.roles);
                },
                updateVoUsers(state, info) {
                    console.log(`Store ${info.users.size} users in VO`);
                    state.users = info.users;
                },
                updateUsersByProcess(state, info) {
                    console.log(`Store ${info.users.size} users of process ${info.processCode}`);
                    state.usersByProcess.set(info.processCode, info.users);

                    // Add process members to the usersByRole map with pseudo-role 'process-staff'
                    const rolesEnum = Roles[info.processCode];
                    const role = rolesEnum.PROCESS_STAFF;
                    const roleKey = `${info.processCode}.${role.description}`;
                    let roleUsers = state.usersByRole.get(roleKey);
                    if(!isValid(roleUsers)) {
                        roleUsers = new Map();
                        state.usersByRole.set(roleKey, roleUsers);
                    }

                    for(let user of info.users.values())
                        roleUsers.set(user.checkinUserId, user);
                },
                updateUsersByRole(state, info) {
                    console.log(`Store ${info.users.size} users with ${info.processCode} roles and ownerships`);
                    state.usersByRole = info.users;

                    // Add process members to the usersByRole map with pseudo-role 'process-staff'
                    const rolesEnum = Roles[info.processCode];
                    const role = rolesEnum.PROCESS_STAFF;
                    const roleKey = `${info.processCode}.${role.description}`;
                    let roleUsers = state.usersByRole.get(roleKey);
                    if(!isValid(roleUsers)) {
                        roleUsers = new Map();
                        state.usersByRole.set(roleKey, roleUsers);
                    }

                    const processUsers = state.usersByProcess?.get(info.processCode);
                    if(isValid(processUsers))
                        for(let user of processUsers.values())
                            roleUsers.set(user.checkinUserId, user);
                },
                updateUserRole(state, info) {
                    const user = state.users.get(info.checkinUserId);
                    if(!isValid(user))
                        return false;

                    // Update usersByRole immediately, before an API call getUsers/getUsersWithRole
                    // (which in turn calls updateUsersByProcess/updateUsersByRole) has a chance to finish
                    const roleKey = `${info.processCode}.${info.roleCode}`;
                    let roleUsers = state.usersByRole.get(roleKey);
                    if(!isValid(roleUsers) && isValid(info.assign) && info.assign) {
                        roleUsers = new Map();
                        state.usersByRole.set(roleKey, roleUsers);
                    }

                    if(isValid(roleUsers)) {
                        if(isValid(info.assign) && info.assign)
                            roleUsers.set(user.checkinUserId, user);
                        else
                            roleUsers.delete(user.checkinUserId);
                    }
                },
                logOut(state) {
                    state.roles = null;
                    state.rolesByProcess = null;
                    state.users = null;
                    state.usersByProcess = null;
                    state.usersByRole = null;
                    console.log("Signed out");
                }
            },
            actions: {
                logOut({commit}) {
                    commit('logOut');
                },
            }
        },
        // Contains IMS state
        ims: {
            namespaced: true,
            state() {
                return {
                    language: null,
                    notifications: [{isNew: false}, {isNew: true}],
                    processInfo: null,  // Process
                    roleInfo: null,     // Role
                    slm: {
                    },
                    error: null,
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
                    if(isValid(rootState.oidc?.user?.name))
                        return rootState.oidc?.user?.name;
                    let name = "";
                    if(isValid(rootState.oidc?.user?.given_name))
                        name = rootState.oidc?.user?.given_name;
                    if(isValid(rootState.oidc?.user?.family_name)) {
                        if(name.length > 0)
                            name += " ";
                        name += rootState.oidc?.user?.family_name;
                    }
                    return name;
                },
                isAdmin(state, getters, rootState) {
                    return isValid(rootState.roles) &&
                          (hasRole(rootState.roles, Roles.IMS.IMS_OWNER) ||
                           hasRole(rootState.roles, Roles.IMS.IMS_MANAGER) ||
                           hasRole(rootState.roles, Roles.IMS.IMS_COORDINATOR));
                },
                allNotifications(state) {
                    return state.notifications;
                },
                unreadNotifications(state) {
                    return state.notifications?.filter(msg => msg.isNew);
                },
                unreadNotificationCount(state) {
                    const unread = state.notifications?.filter(msg => msg.isNew);
                    return unread?.length;
                },
            },
            mutations: {
                updateLocale(state, newLocale) {
                    console.log("Store language: " + newLocale);
                    state.language = newLocale;
                },
                updateProcessInfo(state, info) {
                    console.log(`Store ${info.processCode} process info v${info.processInfo.version}`);
                    state.processInfo = info.processInfo;
                    state.error = info.error;
                },
                updateProcessRoles(state, info) {
                    store.commit("updateRolesByProcess", info);
                    state.error = info.error;
                    if(info.roles?.size > 0) {
                        const roleInfo = info.roles.values().next().value;
                        state.roleInfo = roleInfo;
                    }
                },
                updateProcessUsers(state, info) {
                    store.commit("updateUsersByProcess", info);
                    state.error = info.error;
                },
                updateProcessUsersByRole(state, info) {
                    store.commit("updateUsersByRole", info);
                    state.error = info.error;
                },
                clearState(state, newLocale) {
                    state.processInfo = null;
                    state.roleInfo = null;
                },
            },
            actions: {
                changeLocale({commit}, newLocale) {
                    console.log("Switching language to: " + newLocale);
                    i18n.global.locale = newLocale; // important!
                    commit('updateLocale', newLocale)
                },
                signOut({dispatch, commit}) {
                    commit('clearState');
                    dispatch('logOut', null, { root: true });
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
export const storeProcessInfo = function(piResult) {
    let latest = {};
    if(isValid(piResult?.processInfo?.value))
        latest = piResult.processInfo.value;

    store.commit('ims/updateProcessInfo', {
        processInfo: latest,
        processCode: piResult.processCode,
        error: piResult.error.value
    });
}

// Extract the users then call a mutation on the store to save them
export const storeUsers = function(mutation, upResult) {
    let users = new Map();
    if(isValid(upResult.page)) {
        const page = upResult.page.value;
        if(isValid(page) && isValid(page.elements)) {
            for(let user of page.elements) {
                users.set(user.checkinUserId, user);
            }
        }
    }
    store.commit(mutation, {
        users: users,
        processCode: upResult.processCode,
        error: upResult.error.value
    });
}

// Extract the users then call a mutation on the store to save them
export const storeUsersByRole = function(urResult) {
    let users = new Map();
    if(isValid(urResult.page)) {
        const page = urResult.page.value;
        if(isValid(page) && isValid(page.elements)) {
            for(let user of page.elements) {
                for(let roleCode of user.roles) {
                    const roleInfo = getRoleByName(urResult.processCode, roleCode);
                    if(isValid(roleInfo) && roleInfo.assigned) {
                        // Check if there is a map for this role
                        let roleUserMap = users.get(roleInfo.roleKey);
                        if(null == roleUserMap) {
                            roleUserMap = new Map();
                            users.set(roleInfo.roleKey, roleUserMap);
                        }

                        roleUserMap.set(user.checkinUserId, user);
                    }
                }
            }
        }
    }
    store.commit('ims/updateProcessUsersByRole', {
        users: users,
        processCode: urResult.processCode,
        error: urResult.error.value
    });
}

// Extract the role definitions then call a mutation on the store to save it
export const extractProcessRoles = function(prResult) {
    let roles = new Map();
    if(isValid(prResult.page)) {
        const page = prResult.page.value;
        if(isValid(page) && isValid(page.elements)) {
            for(let role of page.elements) {
                const roleInfo = getRoleByName(prResult.processCode, role.role);
                if(isValid(roleInfo)) {
                    role.roleCode = roleInfo.roleCode;
                    if(isValid(roleInfo.role))
                        role.role = roleInfo.role; // Change String to Symbol
                    roles.set(roleInfo.roleCode, role);
                }
            }
        }
    }
    return roles;
}

// Extract the role definitions then call a mutation on the store to save it
export const storeProcessRoles = function(prResult) {
    let roles = extractProcessRoles(prResult);
    store.commit('ims/updateProcessRoles', {
        roles: roles,
        processCode: prResult.processCode,
        error: prResult.error.value
    });
}

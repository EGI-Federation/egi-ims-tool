<template>
<div class="role-info">
    <h3><router-link :to="`/${processCode.toLowerCase()}/roles/${role.role.description}`">{{ role.name }}</router-link></h3>
    <div class="d-flex flex-nowrap justify-content-between">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t('ims.status') }} :</div>
                <div>{{ $t('role.assignedTo') }} :</div>
            </div>
            <div>
                <div><span :class="status.pillClass">{{ status.label }}</span></div>
                <div>{{ assigneeNames }}</div>
            </div>
        </div>
        <div v-if="assignable && (isProcessManager || isProcessOwner)" class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ $t('role.assign') }}
            </button>
            <ul class="dropdown-menu user-list">
                <li v-for="[checkinUserId, user] in users" class="dropdown-item check-item">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="role.role?.description + '-' + checkinUserId"
                               :data-checkinUserId="checkinUserId"
                               :data-user="user.fullName"
                               :checked="assignees.has(checkinUserId)"
                               @change="toggleAssignment($event)">
                        <label class="form-check-label" :for="role.role?.description + '-' + checkinUserId">
                            {{ user.fullName }}
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <h6>{{ $t('role.tasks') }}</h6>
    <div class="underline fade-top-border"/>
    <vue3-markdown-it :source="role.tasks ? role.tasks : $t('ims.notDef')" />
</div>
</template>

<script>
// @ is an alias to /src
import MarkdownIt from "markdown-it";
import {findEntityWithStatus, isValid, statusPill, userNames} from "@/utils";
import { Roles, hasRole } from "@/roles";
import { store, storeUsers, storeUsersByRole } from "@/store";
import { assignRole } from "@/api/assignRole";
import { revokeRole } from "@/api/revokeRole";
import { includeInProcess } from "@/api/includeInProcess";
import { excludeFromProcess } from "@/api/excludeFromProcess";
import { getUsers } from "@/api/getUsers";
import { getUsersWithRole } from "@/api/getUsersWithRole";

var mdRender = new MarkdownIt();

export default {
    name: 'roleSummary',
    components: { },
    props: {
        processCode: String,
        apiBaseUrl: String,
        role: { // Role
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            accessToken: store.state.oidc.access_token,
        }
    },
    computed: {
        status() {
            return statusPill(this.$props.role.status, this.$t);
        },
        usersByRole() {
            return store.state.temp?.usersByRole;
        },
        usersByProcess() {
            return store.state.temp?.usersByProcess;
        },
        users() {
            let users = null;
            if(isValid(this.$props.role)) {
                if(this.$props.role.role.description === "process-staff")
                    users = store.state.temp.users;
                else
                    users = this.usersByProcess?.get(this.$props.role.processCode);
            }

            return isValid(users) ? users : new Map();
        },
        assignable() {
            if(this.$props.role.status === "DEPRECATED")
                return false;

            let implementedRole = findEntityWithStatus(this.$props.role, "IMPLEMENTED");
            return isValid(implementedRole);
        },
        assignees() {
            const roleSymbol = this.$props.role.role;
            let usersWithRole = this.usersByRole?.get(roleSymbol);
            return isValid(usersWithRole) ? usersWithRole : new Map();
        },
        assigneeNames() {
            return userNames(this.assignees.values(), " ", this.$t('role.nobody'));
        },
        roles() { return store.state.temp?.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
    },
    methods: {
        toggleAssignment(event) {
            if(this.$props.role.role.description === "process-staff")
                this.toggleProcessMembership(event);
            else
                this.toggleRoleAssignment(event);
        },
        toggleRoleAssignment(event) {
            let t = this;
            let el = event.target;
            const checkinUserId = Number(el.getAttribute("data-checkinUserId"));
            const userFullName = el.getAttribute("data-user");
            const processCode = this.$props.processCode;
            if(el.checked) {
                // Update UI immediately
                let info = { role: this.$props.role.role, checkinUserId: checkinUserId, assign: true };
                store.commit('updateUserRole', info);

                // Call API to assign role to user
                const arResult = assignRole(this.accessToken, processCode,
                                            this.$props.role.role.description, checkinUserId,
                                            this.$props.apiBaseUrl);
                arResult.logMessage = `Assigned ${processCode}.${this.$props.role.role.description} to ${userFullName}`;
                arResult.toastTitle = t.$t('ims.success');
                arResult.errorTitle = t.$t('ims.error');
                arResult.toastMessage = t.$t('role.assignedRole', {
                    processCode: processCode,
                    roleName: this.$props.role.name,
                    userFullName: userFullName
                });
                arResult.toasts = t.$root.$refs.toasts;
                arResult.assign().then(() => {
                    if(isValid(arResult.error?.value)) {
                        el.checked = !el.checked;
                        info.assign = false;
                        store.commit('updateUserRole', info);
                        arResult.toasts.showError(arResult.errorTitle, arResult.error.value);
                    }
                    else {
                        // Fetch the users with roles in this process from the API
                        const urResult = getUsersWithRole(t.accessToken, processCode, null, t.$props.apiBaseUrl);
                        urResult.load().then(() => {
                            storeUsersByRole(urResult);
                        });

                        console.log(arResult.logMessage);
                        arResult.toasts.showSuccess(arResult.toastTitle, arResult.toastMessage);
                    }
                });
            }
            else {
                // Update UI immediately
                let info = { role: this.$props.role.role, checkinUserId: checkinUserId, assign: false };
                store.commit('updateUserRole', info);

                // Call API to revoke role from user
                const rrResult = revokeRole(this.accessToken, processCode,
                                            this.$props.role.role.description, checkinUserId,
                                            this.$props.apiBaseUrl);
                rrResult.logMessage = `Revoked ${processCode}.${t.$props.role.role.description} from ${userFullName}`;
                rrResult.successTitle = t.$t('ims.success');
                rrResult.errorTitle = t.$t('ims.error');
                rrResult.toastMessage = t.$t('role.revokedRole', {
                    processCode: processCode,
                    roleName: t.$props.role.name,
                    userFullName: userFullName
                });
                rrResult.toasts = t.$root.$refs.toasts;
                rrResult.revoke().then(() => {
                    if(isValid(rrResult.error?.value)) {
                        el.checked = !el.checked;
                        info.assign = true;
                        store.commit('updateUserRole', info);
                        rrResult.toasts.showError(rrResult.errorTitle, rrResult.error.value);
                    }
                    else {
                        // Fetch the users with roles in this process from the API
                        const urResult = getUsersWithRole(this.accessToken, processCode, null, t.$props.apiBaseUrl);
                        urResult.load().then(() => {
                            storeUsersByRole(urResult);
                        });

                        console.log(rrResult.logMessage);
                        rrResult.toasts.showSuccess(rrResult.successTitle, rrResult.toastMessage);
                    }
                });
            }
        },
        toggleProcessMembership(event) {
            let t = this;
            let el = event.target;
            const checkinUserId = Number(el.getAttribute("data-checkinUserId"));
            const userFullName = el.getAttribute("data-user");
            const processCode = this.$props.processCode;
            if(el.checked) {
                // Update UI immediately
                let info = { role: this.$props.role.role, checkinUserId: checkinUserId, assign: true };
                store.commit('updateUserRole', info);

                // Call API to include user in process
                const irResult = includeInProcess(this.accessToken, processCode, checkinUserId, this.$props.apiBaseUrl);
                irResult.logMessage = `Included ${userFullName} in process ${processCode}`;
                irResult.successTitle = t.$t('ims.success');
                irResult.errorTitle = t.$t('ims.error');
                irResult.toastMessage = t.$t('role.includedInProcess', {
                    processCode: processCode,
                    userFullName: userFullName
                });
                irResult.toasts = t.$root.$refs.toasts;
                irResult.include().then(() => {
                    if(isValid(irResult.error?.value)) {
                        el.checked = !el.checked;
                        info.assign = false;
                        store.commit('updateUserRole', info);
                        irResult.toasts.showError(irResult.errorTitle, irResult.error.value);
                    }
                    else {
                        // Fetch the users participating in this process from the API
                        const upResult = getUsers(t.accessToken, processCode, true, t.$props.apiBaseUrl);
                        upResult.load().then(() => {
                            storeUsers('ims/updateProcessUsers', upResult);
                        });

                        console.log(irResult.logMessage);
                        irResult.toasts.showSuccess(irResult.successTitle, irResult.toastMessage);
                    }
                });
            }
            else {
                // Update UI immediately
                let info = { role: this.$props.role.role, checkinUserId: checkinUserId, assign: false };
                store.commit('updateUserRole', info);

                // Call API to exclude user from process
                const erResult = excludeFromProcess(this.accessToken, processCode, checkinUserId, this.$props.apiBaseUrl);
                erResult.logMessage = `Excluded ${userFullName} from ${processCode} process`;
                erResult.successTitle = t.$t('ims.success');
                erResult.errorTitle = t.$t('ims.error');
                erResult.toastMessage = t.$t('role.excludedFromProcess', {
                    processCode: processCode,
                    userFullName: userFullName
                });
                erResult.toasts = t.$root.$refs.toasts;
                erResult.exclude().then(() => {
                    if(isValid(erResult.error?.value)) {
                        el.checked = !el.checked;
                        info.assign = true;
                        store.commit('updateUserRole', info);
                        erResult.toasts.showError(erResult.errorTitle, erResult.error.value);
                    }
                    else {
                        // Fetch the users participating in this process from the API
                        const upResult = getUsers(t.accessToken, processCode, true, t.$props.apiBaseUrl);
                        upResult.load().then(() => {
                            storeUsers('ims/updateProcessUsers', upResult);
                        });

                        console.log(erResult.logMessage);
                        erResult.toasts.showSuccess(erResult.successTitle, erResult.toastMessage);
                    }
                });
            }
        },
        mounted() {
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.role-info {
    text-align: left;
    padding: 0 1rem;
}
.role-info h3 {
    margin-top: 0.5rem;
    border-bottom: 1px solid var(--bs-secondary-bg);
}
.role-info h3 a {
    text-decoration: none;
    color: unset;
}
.role-info h3 a:hover {
    color: var(--bs-link-color);
}
.role-info h6 {
    margin: .7rem 0 .25rem;
    font-weight: bolder;
}
.underline {
    height: 1px;
    width: 40%;
    margin-bottom: .25rem;
}
.info {
    justify-content: flex-start;
    margin-right: 0.5rem;
}
.info > div {
    flex-direction: column;
    flex-wrap: nowrap;
}
.info > div:nth-child(1) > div {
    color: grey;
    text-align: right;
    margin-right: .2rem;
}
.info > div:nth-child(2) > div {
    text-align: left;
    margin-left: .2rem;
}
.info > div > div {
    white-space: nowrap;
    font-size: smaller;
}
.info > div:nth-child(2) > div:last-of-type {
    white-space: unset;
}
.info .badge {
    padding-bottom: 2px!important;
}
button.btn {
    max-height: 2.35rem;
}
label.form-check-label {
    position: relative;
    top: 2px;
}
.check-item .form-check-input,
.check-item .form-check-label {
    cursor: pointer;
}
.user-list {
    max-height: 25rem;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
</style>

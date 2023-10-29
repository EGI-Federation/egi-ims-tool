<template>
<div class="role-info">
    <h3><router-link :to="`${baseUrl}/${roleCode}`">{{ role.name }}</router-link></h3>
    <div class="d-flex flex-nowrap justify-content-between">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t('ims.status') }} :</div>
                <div>{{ $t('role.assignable') }} :</div>
                <div v-if="assignable.assignable">{{ $t('role.assignedTo') }} :</div>
            </div>
            <div>
                <div><span :class="status.pillClass">{{ status.label }}</span></div>
                <div>{{ assignable.explain }}</div>
                <div v-if="assignable.assignable">{{ assigneeNames }}</div>
            </div>
        </div>
        <div v-if="assignable.assignable && (isImsOwner || isImsManager || isProcessManager || isProcessOwner)" class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ $t('role.assign') }}
            </button>
            <ul class="dropdown-menu user-list">
                <li v-for="user in users" class="dropdown-item check-item">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="role.roleCode + '-' + user.checkinUserId"
                               :data-checkinUserId="user.checkinUserId"
                               :data-user="user.fullName"
                               :data-email="user.email"
                               :checked="assignedTo(user.checkinUserId)"
                               @change="toggleAssignment($event)">
                        <label class="form-check-label" :for="role.roleCode + '-' + user.checkinUserId">
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
import {findEntityWithStatus, isValid, Status, statusPill, userNames} from "@/utils";
import {Roles, hasRole, findUsersWithRole, findUserWithEmail} from "@/roles";
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
        pageBaseUrl: String,
        apiBaseUrl: String,
        role: { // Role
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
        }
    },
    computed: {
        baseUrl() {
            return isValid(this.$props.pageBaseUrl) ?
                   this.$props.pageBaseUrl :
                   `/${this.$props.processCode.toLowerCase()}/roles`;
        },
        status() {
            return statusPill(this.$props.role.status, this.$t);
        },
        roleCode() {
            return this.$props.role.roleCode;
        },
        roleProcessStaff() {
            const roleEnum = Roles[this.$props.processCode];
            return this.roleCode === roleEnum.PROCESS_STAFF.description;
        },
        usersByProcess() {
            return store.state.temp?.usersByProcess;
        },
        users() {
            let users = null;
            if(isValid(this.$props.role)) {
                if(this.roleProcessStaff)
                    // Any VO user can be included in the process
                    users = store.state.temp.users;
                else
                    users = this.usersByProcess?.get(this.$props.processCode);
            }

            return isValid(users) ? Array.from(users.values()) : [];
        },
        assignable() {
            if(this.roleProcessStaff)
                return { assignable: true, explain: this.$t('ims.yes') };

            if(isValid(this.$props.role.assignable)) {
                // IMS process
                if(true !== this.$props.role?.assignable)
                    return { assignable: false, explain: this.$t('role.notAssignable') };
            }

            // All other processes
            if(this.$props.role.status === Status.DEPRECATED.description)
                return { assignable: false, explain: this.$t('role.notAssignableAnymore') };

            const implementedRole = findEntityWithStatus(this.$props.role, Status.IMPLEMENTED.description);
            return { assignable: isValid(implementedRole),
                     explain: isValid(implementedRole) ? this.$t('ims.yes') : this.$t('role.notAssignableYet') };
        },
        assignees() {
            const usersWithRole = findUsersWithRole(this.$props.processCode, this.$props.role.role);
            return isValid(usersWithRole) ? usersWithRole : new Array();
        },
        assigneeNames() {
            return userNames(this.assignees, " ", this.$t('role.nobody'));
        },
        roles() { return store.state.temp?.roles; },
        isImsOwner() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_OWNER);
        },
        isImsManager() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_MANAGER);
        },
        isProcessOwner() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_OWNER);
        },
        isProcessManager() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_MANAGER);
        },
    },
    methods: {
        assignedTo(checkinUserId) {
            for(const user of this.assignees) {
                if(checkinUserId === user.checkinUserId)
                    return true;
            }
            return false;
        },
        toggleAssignment(event) {
            if(this.roleProcessStaff)
                this.toggleProcessMembership(event);
            else
                this.toggleRoleAssignment(event);
        },
        toggleRoleAssignment(event) {
            let t = this;
            let el = event.target;
            const processCode = this.$props.processCode;
            const checkinUserId = el.getAttribute("data-checkinUserId");
            const roleHolder = {
                checkinUserId: checkinUserId,
                fullName: el.getAttribute("data-user"),
                email: el.getAttribute("data-email")
            };
            if(el.checked) {
                // Update UI immediately
                let info = { processCode: processCode, roleCode: t.roleCode, checkinUserId: checkinUserId, assign: true };
                store.commit('updateUserRole', info);

                // Call API to assign role to user
                const arResult = assignRole(t.accessToken, processCode, t.roleCode, roleHolder, t.$props.apiBaseUrl);
                arResult.logMessage = `Assigned ${processCode}.${t.roleCode} to ${roleHolder.fullName}`;
                arResult.toastTitle = t.$t('ims.success');
                arResult.errorTitle = t.$t('ims.error');
                arResult.toastMessage = t.$t('role.assignedRole', {
                    processCode: processCode,
                    roleName: t.$props.role.name,
                    userFullName: roleHolder.fullName
                });
                arResult.toasts = t.$root.$refs.toasts;
                arResult.assign().then(() => {
                    if(isValid(arResult.error?.value)) {
                        el.checked = false;
                        info.assign = false;
                        store.commit('updateUserRole', info);

                        let message = isValid(arResult.error.value.data?.description) ?
                            arResult.error.value.data.description :
                            arResult.error.value.message;
                        t.$root.$refs.toasts.showError(arResult.errorTitle, message);
                    }
                    else {
                        // Success
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
                let info = { processCode: processCode, roleCode: t.roleCode, checkinUserId: checkinUserId, assign: false };
                store.commit('updateUserRole', info);

                // Call API to revoke role from user
                const rrResult = revokeRole(t.accessToken, processCode, t.roleCode, roleHolder, t.$props.apiBaseUrl);
                rrResult.logMessage = `Revoked ${processCode}.${t.roleCode} from ${roleHolder.fullName}`;
                rrResult.successTitle = t.$t('ims.success');
                rrResult.errorTitle = t.$t('ims.error');
                rrResult.toastMessage = t.$t('role.revokedRole', {
                    processCode: processCode,
                    roleName: t.$props.role.name,
                    userFullName: roleHolder.fullName
                });
                rrResult.toasts = t.$root.$refs.toasts;
                rrResult.revoke().then(() => {
                    if(isValid(rrResult.error?.value)) {
                        el.checked = true;
                        info.assign = true;
                        store.commit('updateUserRole', info);

                        let message = isValid(rrResult.error.value.data?.description) ?
                            rrResult.error.value.data.description :
                            rrResult.error.value.message;
                        t.$root.$refs.toasts.showError(rrResult.errorTitle, message);
                    }
                    else {
                        // Success
                        // Fetch the users with roles in this process from the API
                        const urResult = getUsersWithRole(t.accessToken, processCode, null, t.$props.apiBaseUrl);
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
            const processCode = this.$props.processCode;
            const checkinUserId = el.getAttribute("data-checkinUserId");
            const roleHolder = {
                checkinUserId: checkinUserId,
                fullName: el.getAttribute("data-user"),
                email: el.getAttribute("data-email")
            };
            if(el.checked) {
                // Update UI immediately
                let info = { processCode: processCode, roleCode: t.roleCode, checkinUserId: checkinUserId, assign: true };
                store.commit('updateUserRole', info);

                // Call API to include user in process
                const irResult = includeInProcess(t.accessToken, processCode, roleHolder, t.$props.apiBaseUrl);
                irResult.logMessage = `Included ${roleHolder.fullName} in process ${processCode}`;
                irResult.successTitle = t.$t('ims.success');
                irResult.errorTitle = t.$t('ims.error');
                irResult.toastMessage = t.$t('role.includedInProcess', {
                    processCode: processCode,
                    userFullName: roleHolder.fullName
                });
                irResult.toasts = t.$root.$refs.toasts;
                irResult.include().then(() => {
                    if(isValid(irResult.error?.value)) {
                        el.checked = false;
                        info.assign = false;
                        store.commit('updateUserRole', info);

                        let message = isValid(irResult.error.value.data?.description) ?
                            irResult.error.value.data.description :
                            irResult.error.value.message;
                        t.$root.$refs.toasts.showError(irResult.errorTitle, message);
                    }
                    else {
                        // Success
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
                let info = { processCode: processCode, roleCode: t.roleCode, checkinUserId: checkinUserId, assign: false };
                store.commit('updateUserRole', info);

                // Call API to exclude user from process
                const erResult = excludeFromProcess(t.accessToken, processCode, roleHolder, t.$props.apiBaseUrl);
                erResult.logMessage = `Excluded ${roleHolder.fullName} from ${processCode} process`;
                erResult.successTitle = t.$t('ims.success');
                erResult.errorTitle = t.$t('ims.error');
                erResult.toastMessage = t.$t('role.excludedFromProcess', {
                    processCode: processCode,
                    userFullName: roleHolder.fullName
                });
                erResult.toasts = t.$root.$refs.toasts;
                erResult.exclude().then(() => {
                    if(isValid(erResult.error?.value)) {
                        el.checked = true;
                        info.assign = true;
                        store.commit('updateUserRole', info);

                        let message = isValid(erResult.error.value.data?.description) ?
                            erResult.error.value.data.description :
                            erResult.error.value.message;
                        t.$root.$refs.toasts.showError(erResult.errorTitle, message);
                    }
                    else {
                        // Success
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
    padding-bottom: 1px!important;
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
.dropdown-menu {
    background-color: var(--menu-background-color);
}
.dropdown-menu > li:hover,
.dropdown-menu > li:focus {
    background-color: var(--menu-item-color);
}
</style>

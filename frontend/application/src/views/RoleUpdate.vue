<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
    <role-edit ref="roleEdit"
                  :info="{ current: currentRole, implemented: implementedRole }"
                  :state="editState" :page-base-url="baseUrl"
                  :api-base-url="processApi" :process-code="processCode"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { store, storeProcessRoles } from "@/store"
import { Status, isValid, isSuccess, findEntityWithStatus } from '@/utils'
import { Roles, hasRole } from "@/roles";
import { getRoles } from "@/api/getRoles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleEdit from "@/components/roleEdit.vue";

export default {
    name: 'RoleUpdate',
    components:  { RolesLoader, BreadCrumb, RoleEdit },
    props: {
        processCode: String,
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentRole: store.state.ims?.roleInfo,   // Role
            implementedRole: null,                    // Role
            editState: reactive({ hasUnsavedChanges: false }),
        }
    },
    computed: {
        baseUrl() { return `/${this.$props.processCode.toLowerCase()}/roles`; },
        roles() { return store.state.temp.roles; },
        isNew() { return 'new' === this.$route.params.role; },
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
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` },
            { text: this.$t("navbar.roles"), link: this.baseUrl },
            { text: this.currentRole.name, link: this.isNew ? null : `${this.baseUrl}/${this.$route.params.role}` },
            { text: this.$t("ims.edit") },
        ]},
    },
    created() {
        if(this.isNew) {
            this.currentRole = {
                version: 1,
                name: this.$t("role.newRole"),
                role: 'new-role',
                tasks: '',
                status: 'DRAFT'
            };
        }
        else {
            // Fetch the role details from the API
            let t = this;
            const rrResult = getRoles(this.accessToken, this.$props.processCode, this.$route.params.role, this.$props.processApi);
            rrResult.load().then(() => {
                const redirectOnError = [{ statusCode: 404, redirectToUrl: t.baseUrl }];
                if(isSuccess(t, rrResult, redirectOnError)) {
                    // Success
                    storeProcessRoles(rrResult);

                    this.currentRole = store.state.ims.roleInfo;
                    if(isValid(t.currentRole)) {
                        // Make sure we know which is the implemented version (if any)
                        this.implementedRole = findEntityWithStatus(t.currentRole, Status.IMPLEMENTED.description);
                        console.log(`Editing role ${this.$props.processCode}.${t.$route.params.role} v${t.currentRole.version}`);
                    }
                    this.$refs.breadCrumb.update(t.locationSegments);
                }
            });
        }
    },
    mounted() {
        if(!this.isImsOwner && !this.isImsManager &&
           !this.isProcessOwner && !this.isProcessManager)
            this.$router.push(`/${this.$props.processCode.toLowerCase()}`);
    },
    beforeRouteLeave(to, from, next) {
        // Navigating away from this view
        if(this.editState.hasUnsavedChanges) {
            console.log("Leaving page with unsaved changes");
            this.editState.navigateTo = to;
            this.$refs.roleEdit.warnUnsavedChanges();
            next(false);
        }
        else
            next(true);
    },
}
</script>

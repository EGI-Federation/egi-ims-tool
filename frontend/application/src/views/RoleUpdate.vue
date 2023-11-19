<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
        <role-edit v-if="currentRole" ref="roleEdit"
                  :info="{ current: currentRole, implemented: implementedRole }"
                  :state="editState" :page-base-url="baseUrl"
                  :api-base-url="processApi" :process-code="processCode"/>
    </div>
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
            currentRole: null,      // Role
            implementedRole: null,  // Role
            editState: reactive({ hasUnsavedChanges: false }),
        }
    },
    computed: {
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        baseUrl() {
            return `/${this.$props.processCode.toLowerCase()}${this.systemProcess ? '/plan' : ''}/roles`;
        },
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
        locationSegments() {
            let segments = [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` }];

            if(this.systemProcess)
                segments.push({ text: this.$t("navbar.plan"), link:"/ims/plan" });

            return segments.concat([
                { text: this.$t("navbar.roles"), link: this.baseUrl },
                { text: this.currentRole?.name || '', link: this.isNew ? null : `${this.baseUrl}/${this.$route.params.role}` },
                { text: this.$t("ims.edit") }]);
        },
    },
    created() {
        if(this.isNew) {
            this.currentRole = {
                version: 1,
                name: this.$t("role.newRole"),
                role: 'new-role',
                tasks: '',
                status: 'DRAFT',
                category: 'IMS',
                handover: false
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

                    t.currentRole = store.state.ims.roleInfo;
                    if(isValid(t.currentRole)) {
                        // Make sure we know which is the implemented version (if any)
                        t.implementedRole = findEntityWithStatus(t.currentRole, Status.IMPLEMENTED.description);
                        console.log(`Editing role ${t.$props.processCode}.${t.$route.params.role} v${t.currentRole.version}`);
                    }

                    // Update the breadcrumb
                    // The ref to the breadcrumb might not be ready yet, so we wait
                    const delayedBreadcrumbUpdate = setTimeout(function() {
                        let breadcrumb = t.$refs.breadCrumb;
                        if(isValid(breadcrumb)) {
                            clearTimeout(delayedBreadcrumbUpdate);
                            breadcrumb.update(t.locationSegments);
                        }
                    }, 100);
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

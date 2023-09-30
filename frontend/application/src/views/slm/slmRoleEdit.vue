<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"/>
    <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
    <role-edit ref="roleEdit"
                  :info="{ current: currentRole, implemented: implementedRole }"
                  :state="editState" :api-base-url="slmApi" process-code="SLM"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { isValid, findEntityWithStatus } from '@/utils'
import { store, storeProcessRoles } from "@/store"
import { Roles, hasRole } from "@/roles";
import { getRoles } from "@/api/getRoles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleEdit from "@/components/roleEdit.vue";

export default {
    name: 'slmRoleEdit',
    components:  { RolesLoader, BreadCrumb, RoleEdit },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentRole: store.state.ims?.roleInfo,   // Role
            implementedRole: null,                    // Role
            editState: reactive({ hasUnsavedChanges: false }),
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t("home.SLM"), link: "/slm" },
            { text: this.$t("navbar.roles"), link: "/slm/roles" },
            { text: this.currentRole.name, link: `/slm/roles/${this.$route.params.role}` },
            { text: this.$t("ims.edit") },
        ]},
    },
    created() {
        // Fetch the role details from the API
        const prResult = getRoles(this.accessToken, 'SLM', this.$route.params.role, this.slmApi);
        prResult.load().then(() => {
            storeProcessRoles(prResult);

            this.currentRole = store.state.ims.roleInfo;
            if(isValid(this.currentRole)) {
                // Make sure we know which is the implemented version (if any)
                this.implementedRole = findEntityWithStatus(this.currentRole, "IMPLEMENTED");
                console.log(`Editing SLM role ${this.$route.params.role} v${this.currentRole.version}`);
            }
            this.$refs.breadCrumb.update(this.locationSegments);
        });
    },
    mounted() {
        if(!this.isProcessOwner && !this.isProcessManager)
            this.$router.push('/slm/roles');
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

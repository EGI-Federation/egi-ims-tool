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
import { store, storeProcessRoles } from "@/store"
import { Status, isValid, findEntityWithStatus } from '@/utils'
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
        slmApi() { return process.env.SLM_API; },
        roles() { return store.state.temp.roles; },
        isNew() { return 'new' === this.$route.params.role; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t("home.SLM"), link: "/slm" },
            { text: this.$t("navbar.roles"), link: "/slm/roles" },
            { text: this.currentRole.name, link: this.isNew ? null : `/slm/roles/${this.$route.params.role}` },
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
            const rrResult = getRoles(this.accessToken, 'SLM', this.$route.params.role, this.slmApi);
            rrResult.load().then(() => {
                if(isValid(rrResult.error?.value)) {
                    if(404 === rrResult.error?.value.status)
                        t.$router.push('/slm/roles');
                }
                else {
                    storeProcessRoles(rrResult);

                    this.currentRole = store.state.ims.roleInfo;
                    if(isValid(t.currentRole)) {
                        // Make sure we know which is the implemented version (if any)
                        this.implementedRole = findEntityWithStatus(t.currentRole, Status.IMPLEMENTED.description);
                        console.log(`Editing role SLM.${t.$route.params.role} v${t.currentRole.version}`);
                    }
                    this.$refs.breadCrumb.update(t.locationSegments);
                }
            });
        }
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

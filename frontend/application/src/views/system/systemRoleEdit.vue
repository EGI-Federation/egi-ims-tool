<template>
    <roles-loader process-code="IMS" :api-base-url="imsApi"/>
    <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
    <role-edit ref="roleEdit"
                  :info="{ current: currentRole, implemented: implementedRole }"
                  :state="editState" process-code="IMS"
                  :page-base-url="baseUrl" :api-base-url="imsApi"/>
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
import RoleInfo from "@/components/roleInfo.vue";

export default {
    name: 'systemRoleEdit',
    components: {RoleInfo, RolesLoader, BreadCrumb, RoleEdit },
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
        baseUrl() { return "/ims/plan/roles"; },
        imsApi() { return process.env.VUE_APP_IMS_IMS_API; },
        roles() { return store.state.temp.roles; },
        isNew() { return 'new' === this.$route.params.role; },
        isImsOwner() { return hasRole(this.roles, Roles.IMS.IMS_OWNER); },
        isImsManager() { return hasRole(this.roles, Roles.IMS.IMS_MANAGER); },
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t("home.IMS"), link: "/ims" },
            { text: this.$t("navbar.plan"), link: "/ims/plan" },
            { text: this.$t("navbar.roles"), link: "/ims/plan/roles" },
            { text: this.currentRole.name, link: this.isNew ? null : `/ims/plan/roles/${this.$route.params.role}` },
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
            const rrResult = getRoles(this.accessToken, 'IMS', this.$route.params.role, this.imsApi);
            rrResult.load().then(() => {
                if(isValid(rrResult.error?.value)) {
                    if(404 === rrResult.error?.value.status)
                        t.$router.push(this.baseUrl);
                }
                else {
                    storeProcessRoles(rrResult);

                    this.currentRole = store.state.ims.roleInfo;
                    if(isValid(t.currentRole)) {
                        // Make sure we know which is the implemented version (if any)
                        this.implementedRole = findEntityWithStatus(t.currentRole, Status.IMPLEMENTED.description);
                        console.log(`Editing role IMS.${t.$route.params.role} v${t.currentRole.version}`);
                    }
                    this.$refs.breadCrumb.update(t.locationSegments);
                }
            });
        }
    },
    mounted() {
        if(!this.isImsOwner && !this.isImsManager)
            this.$router.push('/ims/plan/roles');
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

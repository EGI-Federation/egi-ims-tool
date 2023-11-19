<template>
    <roles-loader process-code="IMS" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments"/>
        <responsibility-edit v-if="info.current" ref="responsibilityEdit" :info="info"
                             :state="editState" :process-code="processCode" :api-base-url="processApi"/>
    </div>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { getResponsibility } from "@/api/getResponsibility";
import { isSuccess } from '@/utils'
import { store, storeProcessResponsibilities } from "@/store"
import { Roles, hasRole } from "@/roles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import ResponsibilityEdit from "@/components/responsibilityEdit.vue";

export default {
    name: 'ResponsibilitiesUpdate',
    components:  { RolesLoader, BreadCrumb, ResponsibilityEdit },
    props: {
        processCode: String, // Unused
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            info: reactive({
                current: null, // Responsibility
            }),
            editState: reactive({ hasUnsavedChanges: false }),
        }
    },
    computed: {
        roles() { return store.state.temp.roles; },
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
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        baseUrl() {
            return `/${this.$props.processCode.toLowerCase()}${this.systemProcess ? '/plan' : ''}/roles`;
        },
        locationSegments() {
            let segments = [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` }];

            if(this.systemProcess)
                segments.push({ text: this.$t("navbar.plan"), link:"/ims/plan" });

            return segments.concat([
                { text: this.$t("navbar.roles"), link: this.baseUrl },
                { text: this.$t("ims.edit") }]);
        },
    },
    created() {
        // Fetch process responsibilities from the API
        let t = this;
        const riResult = getResponsibility(this.accessToken, this.$props.processCode, true, this.$props.processApi);
        riResult.load().then(() => {
            if(isSuccess(t, riResult)) {
                // Success
                storeProcessResponsibilities(riResult);

                t.info.current = store.state.ims.responsibilityInfo;
            }
        });
    },
    mounted() {
        if(!this.isImsOwner && !this.isImsManager && !this.isProcessOwner && !this.isProcessManager)
            this.$router.push(this.baseUrl);
    },
    beforeRouteLeave(to, from, next) {
        // Navigating away from this view
        if(this.editState.hasUnsavedChanges) {
            console.log("Leaving page with unsaved changes");
            this.editState.navigateTo = to;
            this.$refs.responsibilityEdit.warnUnsavedChanges();
            next(false);
        }
        else
            next(true);
    },
}
</script>

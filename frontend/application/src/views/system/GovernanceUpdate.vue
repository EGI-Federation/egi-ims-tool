<template>
    <roles-loader process-code="IMS" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <governance-edit v-if="currentGovernance" ref="governanceEdit" :info="info"
                     :state="editState" :api-base-url="processApi"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { getGovernance } from "@/api/getGovernance";
import { isSuccess } from '@/utils'
import { store, storeGovernanceInfo } from "@/store"
import { Roles, hasRole } from "@/roles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import GovernanceEdit from "@/components/governanceEdit.vue";

export default {
    name: 'GovernanceUpdate',
    components:  { RolesLoader, BreadCrumb, GovernanceEdit },
    props: {
        processCode: String, // Unused
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentGovernance: store.state.ims?.governanceInfo, // Governance
            info: reactive({ current: this.currentGovernance }),
            editState: reactive({ hasUnsavedChanges: false }),
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.IMS"), link: "/ims" },
                { text: this.$t("navbar.governance"), link: "/ims/plan" },
                { text: this.$t("ims.update") },
            ],
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
    },
    created() {
        // Fetch the governance information from the API
        let t = this;
        const giResult = getGovernance(this.accessToken, true, this.$props.processApi);
        giResult.load().then(() => {
            if(isSuccess(t, giResult)) {
                // Success
                storeGovernanceInfo(giResult);

                this.currentGovernance = store.state.ims.governanceInfo;
                this.info.current = this.currentGovernance;
                this.$refs.governanceEdit.setupTables();
            }
        });
    },
    mounted() {
        if(!this.isImsOwner && !this.isImsManager)
            this.$router.push("/ims/plan");
    },
    beforeRouteLeave(to, from, next) {
        // Navigating away from this view
        if(this.editState.hasUnsavedChanges) {
            console.log("Leaving page with unsaved changes");
            this.editState.navigateTo = to;
            this.$refs.governanceEdit.warnUnsavedChanges();
            next(false);
        }
        else
            next(true);
    },
}
</script>

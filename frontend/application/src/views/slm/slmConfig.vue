<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"/>
    <bread-crumb :segments="locationSegments"/>
    <process-edit v-if="currentProcess" ref="processEdit"
                  :info="{ current: currentProcess, approved: approvedProcess }"
                  :state="editState" :api-base-url="slmApi" process-code="SLM"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { isValid, findEntityWithStatus } from '@/utils'
import { store } from "@/store"
import { Roles, hasRole } from "@/roles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import ProcessEdit from "@/components/processEdit.vue";

export default {
    name: 'slmConfig',
    components:  { RolesLoader, BreadCrumb, ProcessEdit },
    data() {
        return {
            accessToken: store.state.oidc.access_token,
            currentProcess: store.state.ims?.processInfo,   // Process
            approvedProcess: null,                          // Process
            editState: reactive({ hasUnsavedChanges: false }),
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM"), link: "/slm" },
                { text: this.$t("ims.config") },
            ],
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
    },
    created() {
        // Process information is already stored in ims/slm/processInfo
        if(isValid(this.currentProcess)) {
            // Make sure we know which is the approved version (if any)
            this.approvedProcess = findEntityWithStatus(this.currentProcess, "APPROVED");
            console.log("Editing SLM process info v" + this.currentProcess.version);
        }
    },
    mounted() {
        if(!this.isProcessOwner && !this.isProcessManager)
            this.$router.push('/slm');
    },
    beforeRouteLeave(to, from, next) {
        // Navigating away from this view
        if(this.editState.hasUnsavedChanges) {
            console.log("Leaving page with unsaved changes");
            this.editState.navigateTo = to;
            this.$refs.processEdit.warnUnsavedChanges();
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

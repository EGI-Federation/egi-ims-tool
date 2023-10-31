<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <process-edit v-if="currentProcess" ref="processEdit" :info="info"
                  :state="editState" :api-base-url="processApi" :process-code="processCode"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { Status, isValid, findEntityWithStatus } from '@/utils'
import { store } from "@/store"
import { Roles, hasRole } from "@/roles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import ProcessEdit from "@/components/processEdit.vue";

export default {
    name: 'ProcessUpdate',
    components:  { RolesLoader, BreadCrumb, ProcessEdit },
    props: {
        processCode: String,
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentProcess: store.state.ims?.processInfo,   // Process
            approvedProcess: null,                          // Process
            info: reactive({ current: this.currentProcess, approved: this.approvedProcess }),
            editState: reactive({ hasUnsavedChanges: false }),
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` },
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
        updateProcessInfo() {
            // Called by parent after process info is available (was loaded)
            this.currentProcess = store.state.ims.processInfo;
            if(isValid(this.currentProcess)) {
                // Make sure we know which is the approved version (if any)
                this.approvedProcess = findEntityWithStatus(this.currentProcess, Status.APPROVED.description);
                console.log(`Editing ${this.$props.processCode} process v${this.currentProcess.version}`);
            }

            this.info.current = this.currentProcess;
            this.info.approved = this.approvedProcess;
            this.$refs.processEdit.setupTables();
        },
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
            this.$refs.processEdit.warnUnsavedChanges();
            next(false);
        }
        else
            next(true);
    },
}
</script>
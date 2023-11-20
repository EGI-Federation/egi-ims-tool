<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments"/>
        <process-edit v-if="info.current?.version" ref="processEdit" :info="info"
                      :state="editState" :api-base-url="processApi" :process-code="processCode"/>
    </div>
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
            info: reactive({
                current: {},    // Process
                approved: null  // Process
            }),
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
            let current = store.state.ims?.processInfo;
            if(isValid(current)) {
                // Make sure we know which is the approved version (if any)
                this.info.approved = findEntityWithStatus(current, Status.APPROVED.description);
                console.log(`Editing ${this.$props.processCode} process v${current.version}`);
            }

            this.info.current = current;

            // The ref to the process editor might not be ready yet, so we wait
            if(isValid(this.$refs.processEdit))
                this.$refs.processEdit?.setupTables();
            else {
                let t = this;
                const delayedUpdate = setTimeout(function() {
                    let processEdit = t.$refs.processEdit;
                    if(isValid(processEdit)) {
                        clearTimeout(delayedUpdate);
                        if(isValid(processEdit.setupTables))
                            processEdit.setupTables();
                    }
                }, 100);
            }
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

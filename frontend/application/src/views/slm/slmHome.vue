<template>
    <bread-crumb :segments="locationSegments"/>
    <ims-process-info :info="{ current: currentProcess, approved: approvedProcess }"/>
</template>

<script>
// @ is an alias to /src
import { isValid, findEntityWithStatus, findEntityWithVersion } from '@/utils'
import { store } from "@/store"
import { Roles, hasRole } from "@/roles";
import BreadCrumb from "@/components/breadCrumb.vue"
import ImsProcessInfo from "@/components/imsProcess.vue"

export default {
    name: 'slmHome',
    components: { BreadCrumb, ImsProcessInfo },
    props: {
        version: String,
    },
    data() {
        return {
            userInfo: store.state.oidc.user,
            accessToken: store.state.oidc.access_token,
            currentProcess: store.state.ims.slm.processInfo,    // Version<Process>
            approvedProcess: null,                              // Version<Process>
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM") },
            ],
        }
    },
    computed: {
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        isReportOwner() { return hasRole(this.roles, Roles.SLM.REPORT_OWNER); },
        isCatalogManager() { return hasRole(this.roles, Roles.SLM.CATALOG_MANAGER); },
        isSLAOwner() { return hasRole(this.roles, Roles.SLM.SLA_OWNER); },
        isOLAOwner() { return hasRole(this.roles, Roles.SLM.OLA_OWNER); },
        isUAOwner() { return hasRole(this.roles, Roles.SLM.UA_OWNER); },
        isMember() {
            if(!isValid(this.roles))
                return false;

            const groups = store.getters["ims/memberInGroups"];
            const member = groups.filter(group => "SLM" === group);
            return member.length > 0;
        },
    },
    methods: {
        test() {
            return false;
        }
    },
    created() {
        // Process information is already stored in ims/slm/processInfo
        let current = store.state.ims.slm.processInfo;
        if(isValid(current) && isValid(current.entity)) {
            // Make sure we know which is the approved version (if any)
            this.approvedProcess = findEntityWithStatus(current, "APPROVED");

            const requested = this.$props.version;
            if(isValid(requested) && requested.length > 0) {
                // Make sure we show the correct version
                let requestedVersion = findEntityWithVersion(current, requested);
                if(isValid(requestedVersion))
                    current = requestedVersion;
                else
                    console.log(`Cannot find SLM process v${requested}`);
            }

            console.log("Showing SLM process info v" + current.version);
        }
        this.currentProcess = current;
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

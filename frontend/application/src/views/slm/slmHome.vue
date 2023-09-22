<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"
                  mutation-store-users="ims/slmUsers" mutation-store-users-by-role="ims/slmUsersByRole" />
    <bread-crumb :segments="locationSegments"/>
    <process-info :info="{ current: currentProcess, approved: approvedProcess }"
                  :api-base-url="slmApi" process-code="SLM"/>
</template>

<script>
// @ is an alias to /src
import { isValid, findEntityWithStatus, findEntityWithVersion } from '@/utils'
import { getProcessInfo } from "@/api/getProcessInfo";
import { store, storeProcessInfo } from "@/store"
import { Roles, hasRole } from "@/roles";
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue"
import ProcessInfo from "@/components/processInfo.vue"

export default {
    name: 'slmHome',
    components: { RolesLoader, BreadCrumb, ProcessInfo },
    props: {
        version: String,
    },
    data() {
        return {
            userInfo: store.state.oidc?.user,
            accessToken: store.state.oidc?.access_token,
            currentProcess: store.state.ims?.slm?.processInfo,  // Process
            approvedProcess: null,                              // Process
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM") },
            ],
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        isReportOwner() { return hasRole(this.roles, Roles.SLM.REPORT_OWNER); },
        isCatalogOwner() { return hasRole(this.roles, Roles.SLM.CATALOG_OWNER); },
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
    },
    created() {
        // Fetch the process information from the API
        const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
        piResult.load().then(() => {
            storeProcessInfo('ims/slmProcessInfo', piResult);

            // Process information is already stored in ims/slm/processInfo
            let current = store.state.ims.slm.processInfo;
            if(isValid(current)) {
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
        });
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

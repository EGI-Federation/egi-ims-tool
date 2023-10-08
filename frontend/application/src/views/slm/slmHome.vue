<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"/>
    <bread-crumb :segments="locationSegments"/>
    <process-info v-if="currentProcess" :info="{ current: currentProcess, approved: approvedProcess }"
                  :api-base-url="slmApi" process-code="SLM"/>
</template>

<script>
// @ is an alias to /src
import {isValid, findEntityWithStatus, findEntityWithVersion, Status} from '@/utils'
import { getProcessInfo } from "@/api/getProcessInfo";
import { store, storeProcessInfo } from "@/store"
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
            accessToken: store.state.oidc?.access_token,
            currentProcess: store.state.ims?.processInfo,  // Process
            approvedProcess: null,                         // Process
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM") },
            ],
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
    },
    methods: {
    },
    created() {
        // Fetch the process information from the API
        const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
        piResult.load().then(() => {
            storeProcessInfo(piResult);

            let current = store.state.ims.processInfo;
            if(isValid(current)) {
                // Make sure we know which is the approved version (if any)
                this.approvedProcess = findEntityWithStatus(current, Status.APPROVED.description);

                const requested = this.$props.version;
                if(isValid(requested) && requested.length > 0) {
                    // Make sure we show the correct version
                    let requestedVersion = findEntityWithVersion(current, requested);
                    if(isValid(requestedVersion))
                        current = requestedVersion;
                    else
                        console.log(`Cannot find SLM process v${requested}`);
                }

                console.log("Showing SLM process v" + current.version);
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

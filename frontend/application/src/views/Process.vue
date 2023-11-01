<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <process-info v-if="currentProcess" ref="processInfo" :info="info"
                  :api-base-url="processApi" :process-code="processCode"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { Status, isValid, findEntityWithStatus, findEntityWithVersion } from '@/utils'
import { store } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue"
import BreadCrumb from "@/components/breadCrumb.vue"
import ProcessInfo from "@/components/processInfo.vue"

export default {
    name: 'Process',
    components: { RolesLoader, BreadCrumb, ProcessInfo },
    props: {
        processCode: String,
        processApi: String,
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentProcess: store.state.ims?.processInfo,  // Process
            approvedProcess: null,                         // Process
            info: reactive({ current: this.currentProcess, approved: this.approvedProcess }),
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`) },
            ],
        }
    },
    methods: {
        updateProcessInfo() {
            // Called by parent after process info is available (was loaded)
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
                        console.log(`Cannot find ${this.$props.processCode} process v${requested}`);
                }

                console.log(`Showing ${this.$props.processCode} process v${current.version}`);
            }
            this.currentProcess = current;
            this.info.current = this.currentProcess;
            this.info.approved = this.approvedProcess;

            // The ref to the process info might not be ready yet, so we wait
            if(isValid(this.$refs.processInfo))
                this.$refs.processInfo?.setupTables();
            else {
                let t = this;
                const delayedUpdate = setTimeout(function() {
                    let processInfo = t.$refs.processInfo;
                    if(isValid(processInfo)) {
                        clearTimeout(delayedUpdate);
                        if(isValid(processInfo.setupTables))
                            processInfo.setupTables();
                    }
                }, 100);
            }
        },
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

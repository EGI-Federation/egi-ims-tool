<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments"/>
        <process-info v-if="info.current" :info="info" ref="processInfo"
                      :api-base-url="processApi" :process-code="processCode"/>
    </div>
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
            info: reactive({
                current: store.state.ims?.processInfo, // Process
                approved: null                         // Process
            }),
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`) },
            ],
        }
    },
    methods: {
        updateProcessInfo() {
            // Called by parent after process info is available (was loaded)
            let current = store.state.ims?.processInfo;
            if(isValid(current)) {
                // Make sure we know which is the approved version (if any)
                this.info.approved = findEntityWithStatus(current, Status.APPROVED.description);

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

            this.info.current = current;

            // The ref to the process info might not be ready yet, so we wait
            if(isValid(this.$refs.processInfo))
                this.$refs.processInfo.setupTables();
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

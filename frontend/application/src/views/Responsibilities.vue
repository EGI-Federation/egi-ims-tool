<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <responsibility-info v-if="info.current" :process-code="processCode" :api-base-url="processApi" :info="info"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { isValid, isSuccess, findEntityWithVersion } from '@/utils'
import { getResponsibility } from "@/api/getResponsibility";
import { getRoles } from "@/api/getRoles";
import { store, storeProcessResponsibilities, storeProcessRoles } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import ResponsibilityInfo from "@/components/responsibilityInfo.vue";

export default {
    name: 'Responsibilities',
    components: { RolesLoader, BreadCrumb, ResponsibilityInfo },
    props: {
        processCode: String,
        processApi: String,
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            info: reactive({
                current: store.state.ims?.responsibilityInfo, // Responsibility
                implemented: null,                            // Responsibility
            }),
        }
    },
    computed: {
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        locationSegments() {
            let segments = [
                { text: this.$t("home.home"), link: "/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` }];

            if(this.systemProcess)
                segments.push({ text: this.$t("navbar.plan"), link: "/ims/plan" });

            return segments.concat([{ text: this.$t("navbar.roles") }]);
        },
    },
    created() {
        // Fetch the process responsibilities from the API
        let t = this;
        const respResult = getResponsibility(this.accessToken, this.$props.processCode, true, this.processApi);
        respResult.load().then(() => {
            if(isSuccess(t, respResult)) {
                // Success
                storeProcessResponsibilities(respResult);

                let current = store.state.ims.responsibilityInfo;
                if(isValid(current)) {
                    const requested = this.$props.version;
                    if(isValid(requested) && requested.length > 0) {
                        // Make sure we show the correct version
                        let requestedVersion = findEntityWithVersion(current, requested);
                        if(isValid(requestedVersion))
                            current = requestedVersion;
                        else
                            console.log(`Cannot find process responsibilities v${requested}`);
                    }

                    console.log(`Showing process responsibilities v${current.version}`);
                }
                t.info.current = current;
            }
        });

        // Fetch the process roles from the API
        const rolesResult = getRoles(this.accessToken, this.$props.processCode, null, this.processApi);
        rolesResult.load().then(() => {
            if(isSuccess(t, rolesResult))
                // Success
                storeProcessRoles(rolesResult);
        });
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

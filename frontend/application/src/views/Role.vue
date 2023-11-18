<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
        <role-info v-if="info.current" :info="info" :page-base-url="baseUrl"
                   :api-base-url="processApi" :process-code="processCode"/>
    </div>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { getRoles } from "@/api/getRoles";
import {Status, isValid, findEntityWithStatus, findEntityWithVersion, isSuccess} from '@/utils'
import { store, storeProcessRoles } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleInfo from "@/components/roleInfo.vue";

export default {
    name: 'Role',
    components: { RolesLoader, BreadCrumb, RoleInfo },
    props: {
        processCode: String,
        processApi: String,
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            info: reactive({
                current: null,      // Role
                implemented: null,  // Role
            }),
        }
    },
    computed: {
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        baseUrl() {
            return `/${this.$props.processCode.toLowerCase()}${this.systemProcess ? '/plan' : ''}/roles`;
        },
        locationSegments() {
            let segments = [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` }];

            if(this.systemProcess)
                segments.push({ text: this.$t("navbar.plan"), link:"/ims/plan" });

            return segments.concat([
                { text: this.$t("navbar.roles"), link: this.baseUrl },
                { text: isValid(this.info?.current) ? this.info.current.name : this.$route.params.role }]);
        },
    },
    created() {
        // Fetch the role details from the API
        let t = this;
        const rrResult = getRoles(this.accessToken, this.$props.processCode, this.$route.params.role, this.processApi);
        rrResult.load().then(() => {
            const redirectOnError = [{ statusCode: 404, redirectToUrl: t.baseUrl }];
            if(isSuccess(t, rrResult, redirectOnError)) {
                // Success
                storeProcessRoles(rrResult);

                let current = store.state.ims.roleInfo;
                if(isValid(current)) {
                    // Make sure we know which is the implemented version (if any)
                    t.info.implemented = findEntityWithStatus(current, Status.IMPLEMENTED.description);

                    const requested = this.$props.version;
                    if(isValid(requested) && requested.length > 0) {
                        // Make sure we show the correct version
                        let requestedVersion = findEntityWithVersion(current, requested);
                        if(isValid(requestedVersion))
                            current = requestedVersion;
                        else
                            console.log(`Cannot find role ${this.$props.processCode}.${t.$route.params.role} v${requested}`);
                    }

                    console.log(`Showing role ${this.$props.processCode}.${t.$route.params.role} v${current.version}`);
                }
                t.info.current = current;
                t.$refs.breadCrumb.update(t.locationSegments);
            }
        });
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

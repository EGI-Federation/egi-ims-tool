<template>
    <roles-loader process-code="IMS" :api-base-url="imsApi"/>
    <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
    <role-info v-if="role.current" :info="role" process-code="IMS"
               :page-base-url="baseUrl" :api-base-url="imsApi"/>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { Status, isValid, findEntityWithStatus, findEntityWithVersion } from '@/utils'
import { getRoles } from "@/api/getRoles";
import { store, storeProcessRoles } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleInfo from "@/components/roleInfo.vue";
import RoleSummary from "@/components/roleSummary.vue";

export default {
    name: 'systemRole',
    components: {RoleSummary, RolesLoader, BreadCrumb, RoleInfo },
    props: {
        processCode: String,
        processApi: String,
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            role: reactive({
                current: null,      // Role
                implemented: null,  // Role
            }),
        }
    },
    computed: {
        baseUrl() { return "/ims/plan/roles"; },
        imsApi() { return process.env.VUE_APP_IMS_IMS_API; },
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t("home.IMS"), link: "/ims" },
            { text: this.$t("navbar.plan"), link: "/ims/plan" },
            { text: this.$t("navbar.roles"), link: "/ims/plan/roles" },
            { text: isValid(this.role?.current) ? this.role.current.name : this.$route.params.role },
        ]},
    },
    methods: {
    },
    created() {
        // Fetch the role details from the API
        let t = this;
        const rrResult = getRoles(this.accessToken, 'IMS', this.$route.params.role, this.imsApi);
        rrResult.load().then(() => {
            if(isValid(rrResult.error?.value)) {
                if(404 === rrResult.error?.value.status)
                    t.$router.push(this.baseUrl);
            }
            else {
                storeProcessRoles(rrResult);

                let current = store.state.ims.roleInfo;
                if(isValid(current)) {
                    // Make sure we know which is the implemented version (if any)
                    t.role.implemented = findEntityWithStatus(current, Status.IMPLEMENTED.description);

                    const requested = this.$props.version;
                    if(isValid(requested) && requested.length > 0) {
                        // Make sure we show the correct version
                        let requestedVersion = findEntityWithVersion(current, requested);
                        if(isValid(requestedVersion))
                            current = requestedVersion;
                        else
                            console.log(`Cannot find role IMS.${t.$route.params.role} v${requested}`);
                    }

                    console.log(`Showing role IMS.${t.$route.params.role} v${current.version}`);
                }
                t.role.current = current;
                t.$refs.breadCrumb.update(t.locationSegments);
            }
        });
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

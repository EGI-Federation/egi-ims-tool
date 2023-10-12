<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"/>
    <bread-crumb :segments="locationSegments" ref="breadCrumb"/>
    <role-info v-if="currentRole" :info="{ current: currentRole, implemented: implementedRole }"
               :api-base-url="slmApi" process-code="SLM"/>
</template>

<script>
// @ is an alias to /src
import { Status, isValid, findEntityWithStatus, findEntityWithVersion } from '@/utils'
import { getRoles } from "@/api/getRoles";
import { store, storeProcessRoles } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleInfo from "@/components/roleInfo.vue";

export default {
    name: 'slmRole',
    components: { RolesLoader, BreadCrumb, RoleInfo },
    props: {
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentRole: store.state.ims?.roleInfo,  // Role
            implementedRole: null,                   // Role
        }
    },
    computed: {
        slmApi() { return process.env.SLM_API; },
        locationSegments() { return [
            { text: this.$t("home.home"), link:"/" },
            { text: this.$t("home.SLM"), link: "/slm" },
            { text: this.$t("navbar.roles"), link: "/slm/roles" },
            { text: isValid(this.currentRole) ? this.currentRole.name : this.$route.params.role },
        ]},
    },
    methods: {
    },
    created() {
        // Fetch the role details from the API
        let t = this;
        const rrResult = getRoles(this.accessToken, 'SLM', this.$route.params.role, this.slmApi);
        rrResult.load().then(() => {
            if(isValid(rrResult.error?.value)) {
                if(404 === rrResult.error?.value.status)
                    t.$router.push('/slm/roles');
            }
            else {
                storeProcessRoles(rrResult);

                let current = store.state.ims.roleInfo;
                if(isValid(current)) {
                    // Make sure we know which is the implemented version (if any)
                    this.implementedRole = findEntityWithStatus(current, Status.IMPLEMENTED.description);

                    const requested = this.$props.version;
                    if(isValid(requested) && requested.length > 0) {
                        // Make sure we show the correct version
                        let requestedVersion = findEntityWithVersion(current, requested);
                        if(isValid(requestedVersion))
                            current = requestedVersion;
                        else
                            console.log(`Cannot find role SLM.${t.$route.params.role} v${requested}`);
                    }

                    console.log(`Showing role SLM.${t.$route.params.role} v${current.version}`);
                }
                this.currentRole = current;
                this.$refs.breadCrumb.update(t.locationSegments);
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

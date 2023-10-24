<template>
    <roles-loader process-code="IMS" :api-base-url="imsApi"/>
    <bread-crumb :segments="locationSegments"/>
    <p>{{ $t('role.systemRoles') }}.</p>
    <div><button type="button" class="btn btn-primary" @click="addRole">{{ $t('role.addRole') }}</button></div>
    <div v-if="roleList" class="d-flex flex-nowrap content">
        <div class="section">
            <role-summary v-for="role in roleList" :role="role" process-code="IMS"
                          :page-base-url="baseUrl" :api-base-url="imsApi"/>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { getRoles } from "@/api/getRoles";
import { store, storeProcessRoles  } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleSummary from "@/components/roleSummary.vue";
import ProcessEdit from "@/components/processEdit.vue";

export default {
    name: 'systemRoles',
    components: { ProcessEdit, RolesLoader, BreadCrumb, RoleSummary },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("navbar.manageSys"), link: "/ims" },
                { text: this.$t("navbar.plan"), link: "/ims/plan" },
                { text: this.$t("navbar.roles") },
            ],
        }
    },
    computed: {
        baseUrl() { return "/ims/plan/roles"; },
        imsApi() { return process.env.VUE_APP_IMS_IMS_API; },
        roles() { return store.state.temp.rolesByProcess?.get('IMS'); },
        roleList() {
            const roleMap = this.roles;
            return isValid(roleMap) ? Array.from(roleMap.values()) : [];
        }
    },
    methods: {
        addRole() {
            this.$router.push(`${this.baseUrl}/new/edit`);
        },
    },
    created() {
        // Fetch the process roles from the API
        const rrResult = getRoles(this.accessToken, 'IMS', null, this.imsApi);
        rrResult.load().then(() => {
            storeProcessRoles(rrResult);
        });
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    flex-direction: column;
    justify-content: center;
}
.content .section {
    width: 100%;
    max-width: var(--max-content-width);
    margin: 0 auto 2rem;
}
</style>

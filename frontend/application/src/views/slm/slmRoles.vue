<template>
    <roles-loader process-code="SLM" :api-base-url="slmApi"/>
    <bread-crumb :segments="locationSegments"/>
    <p>{{ $t('role.processRoles') }} {{ $t('home.SLM') }}.</p>
    <div><button type="button" class="btn btn-primary" @click="addRole">{{ $t('role.addRole') }}</button></div>
    <div v-if="roleList" class="d-flex flex-nowrap content">
        <div class="section">
            <role-summary v-for="role in roleList" :role="role" :api-base-url="slmApi" process-code="SLM"/>
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
    name: 'slmRoles',
    components: { ProcessEdit, RolesLoader, BreadCrumb, RoleSummary },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM"), link: "/slm" },
                { text: this.$t("navbar.roles") },
            ],
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        roles() { return store.state.temp.rolesByProcess?.get('SLM'); },
        roleList() {
            const roleMap = this.roles;
            return isValid(roleMap) ? Array.from(roleMap.values()) : [];
        }
    },
    methods: {
        addRole() {
            this.$router.push('/slm/roles/new/edit');
        },
    },
    created() {
        // Fetch the process roles from the API
        const rrResult = getRoles(this.accessToken, 'SLM', null, this.slmApi);
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
    max-width: 60rem;
    margin: 0 auto 2rem;
}
</style>

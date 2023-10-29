<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <p>{{ $t('role.processRoles', { process: $t(`home.${processCode}`) }) }}.</p>
    <div><button type="button" class="btn btn-primary" @click="addRole">{{ $t('role.addRole') }}</button></div>
    <div v-if="roleList" class="d-flex flex-nowrap content">
        <div class="section">
            <role-summary v-for="role in roleList" :role="role" :process-code="processCode" :api-base-url="processApi"/>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid, isSuccess } from '@/utils'
import { getRoles } from "@/api/getRoles";
import { store, storeProcessRoles  } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue";
import BreadCrumb from "@/components/breadCrumb.vue";
import RoleSummary from "@/components/roleSummary.vue";
import ProcessEdit from "@/components/processEdit.vue";

export default {
    name: 'Roles',
    components: { ProcessEdit, RolesLoader, BreadCrumb, RoleSummary },
    props: {
        processCode: String,
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` },
                { text: this.$t("navbar.roles") },
            ],
        }
    },
    computed: {
        roles() { return store.state.temp.rolesByProcess?.get(this.$props.processCode); },
        roleList() {
            const roleMap = this.roles;
            return isValid(roleMap) ? Array.from(roleMap.values()) : [];
        }
    },
    methods: {
        addRole() {
            this.$router.push(`/${this.$props.processCode.toLowerCase()}/roles/new/edit`);
        },
    },
    created() {
        // Fetch the process roles from the API
        let t = this;
        const rrResult = getRoles(this.accessToken, this.$props.processCode, null, this.processApi);
        rrResult.load().then(() => {
            if(isSuccess(t, rrResult))
                // Success
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

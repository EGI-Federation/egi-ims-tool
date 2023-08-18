<template>
    <ism-navbar module-name="SLM"/>
    <router-view/>
    <ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles, getRoleByName, Roles } from "@/roles";
import { getProcessInfo } from "@/api/getProcessInfo";
import { getUsersWithRole } from "@/api/getUsersWithRole";
import { store, storeProcessInfo, storeUsersByRole } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";


export default {
    name: 'ServiceLevelManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            isAuthenticated: store.state.oidc.is_checked,
            accessToken: store.state.oidc.access_token,
            processInfo: store.state.ims.slm.processInfo,
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        slmVersion() { return this.processInfo && this.processInfo.entity ? this.processInfo.entity.apiVersion : "1.0.0" },
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
    },
    created() {
        // Fetch the process information from the API
        const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
        piResult.load().then(() => {
            storeProcessInfo('ims/slmProcessInfo', piResult);
        });

        // Fetch the users from the API
        const urResult = getUsersWithRole(this.accessToken, 'SLM', null, this.slmApi);
        urResult.load().then(() => {
            storeUsersByRole('ims/slmUsers', urResult);
        });

        if(!isValid(store.state.temp.roles) || 0 === store.state.temp.roles.size)
            parseRoles();
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

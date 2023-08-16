<template>
    <ism-navbar module-name="SLM"/>
    <router-view/>
    <ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { getProcessInfo } from "@/api/getProcessInfo";
import { store } from "@/store";
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
            slmError: store.state.ims.slm.error,
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        slmVersion() { return this.processInfo ? this.processInfo.apiVersion : "1.0.0" },
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
    },
    created() {
        const { processInfo, error, load } = getProcessInfo(this.accessToken, 'SLM', false, this.slmApi);
        load().then(() => {
            store.commit('ims/slmProcessInfo', { processInfo, error });
        });
    },
    mounted() {
        if(!isValid(store.state.roles))
            parseRoles();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

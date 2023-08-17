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
        }
    },
    computed: {
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        slmVersion() { return this.processInfo.entity ? this.processInfo.entity.apiVersion : "1.0.0" },
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
    },
    created() {
        if(!isValid(store.state.roles))
            parseRoles();

        const { processInfo, error, load } = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
        load().then(() => {
            let version = {};
            if(isValid(processInfo)) {
                const pi = processInfo.value;
                version.version = pi.version;
                version.changedOn = pi.changedOn;
                version.changeBy = pi.changeBy;
                version.changeDescription = pi.changeDescription;
                version.entity = pi;
            }
            store.commit('ims/slmProcessInfo', { version: version, error: error.value });
        });
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

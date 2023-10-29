<template>
    <ims-navbar module-name="SLM"/>
    <router-view v-slot="{ Component }">
        <component ref="page" :is="Component" process-code="SLM" :process-api="slmApi"/>
    </router-view>
    <ims-footer ref="footer" module-name="SLM"/>
</template>

<script>
// @ is an alias to /src
import { isValid, isSuccess } from "@/utils";
import { getProcessInfo } from "@/api/getProcessInfo";
import { store, storeProcessInfo } from "@/store";
import imsNavbar from "@/components/navbar.vue";
import imsFooter from "@/components/footer.vue";

export default {
    name: 'ServiceLevelManagement',
    components: { imsNavbar, imsFooter },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            processInfo: store.state.ims?.processInfo,
        }
    },
    computed: {
        slmApi() { return process.env.VUE_APP_IMS_SLM_API; },
    },
    created() {
        let t = this;
        let again = false;
        if(!isValid(this.processInfo) || !isValid(this.processInfo.code) || this.processInfo.code !== 'SLM') {
            // Fetch the process information from the API
            const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
            piResult.load().then(() => {
                if(isSuccess(t, piResult)) {
                    // Success
                    storeProcessInfo(piResult);

                    // Tell the footer to update the process name and version
                    t.$refs.footer.switchProcess();

                    // Tell the SLM page that the process info was loaded
                    // The ref to the page might not be ready yet, so we wait
                    const delayedUpdate = setTimeout(function() {
                        let page = t.$refs.page;
                        if(isValid(page)) {
                            if(again)
                                clearTimeout(delayedUpdate);
                            again = true;
                            if(isValid(page.updateProcessInfo))
                                page.updateProcessInfo();
                        }
                    }, 100);
                }
            });
        }
        else {
            // Tell the SLM page about the requested process version
            // The ref to the page might not be ready yet, so we wait
            const delayedUpdate = setTimeout(function() {
                let page = t.$refs.page;
                if(isValid(page)) {
                    if(again)
                        clearTimeout(delayedUpdate);
                    again = true;
                    if(isValid(page.updateProcessInfo))
                        page.updateProcessInfo();
                }
            }, 100);
        }
    },
    mounted() {
        let page = this.$refs.page;
        if(isValid(page) && isValid(page.updateProcessInfo))
            page.updateProcessInfo();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

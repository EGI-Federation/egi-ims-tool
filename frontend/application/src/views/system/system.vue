<template>
    <ims-navbar module-name="IMS"/>
    <router-view v-slot="{ Component }" :key="cacheKey">
        <component ref="page" :is="Component" process-code="IMS" :process-api="imsApi"/>
    </router-view>
    <ims-footer ref="footer" module-name="IMS"/>
</template>

<script>
// @ is an alias to /src
import { isValid, isSuccess, removeUrlAnchor } from "@/utils";
import { getProcess } from "@/api/getProcess";
import { store, storeProcessInfo } from "@/store";
import imsNavbar from "@/components/navbar.vue";
import imsFooter from "@/components/footer.vue";

export default {
    name: 'ManagementSystem',
    components: { imsNavbar, imsFooter },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            processInfo: store.state.ims?.processInfo,
        }
    },
    computed: {
        imsApi() { return process.env.VUE_APP_IMS_IMS_API; },
        cacheKey() {
            // Include the query params in the route key, but not the anchors
            return removeUrlAnchor(this.$route.fullPath);
        },
    },
    created() {
        let t = this;
        if(!isValid(this.processInfo) || !isValid(this.processInfo.code) || this.processInfo.code !== 'IMS') {
            // Fetch the process information from the API
            const piResult = getProcess(this.accessToken, 'IMS', true, this.imsApi);
            piResult.load().then(() => {
                if(isSuccess(t, piResult)) {
                    // Success
                    storeProcessInfo(piResult);

                    // Tell the footer to update the process name and version
                    if(isValid(t.$refs.footer.switchProcess))
                        t.$refs.footer.switchProcess();

                    // Tell the IMS page that the process info was loaded
                    // The ref to the page might not be ready yet, so we wait
                    const delayedUpdate = setTimeout(function() {
                        let page = t.$refs.page;
                        if(isValid(page)) {
                            clearTimeout(delayedUpdate);
                            if(isValid(page.updateProcessInfo))
                                page.updateProcessInfo();
                        }
                    }, 100);
                }
            });
        }
        else {
            // Tell the IMS page about the requested process version
            // The ref to the page might not be ready yet, so we wait
            const delayedUpdate = setTimeout(function() {
                let page = t.$refs.page;
                if(isValid(page)) {
                    clearTimeout(delayedUpdate);
                    if(isValid(page.updateProcessInfo))
                        page.updateProcessInfo();
                }
            }, 100);
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

<template>
    <ims-navbar module-name="SLM"/>
    <div class="page-container">
        <router-view v-slot="{ Component }" :key="cacheKey">
            <component ref="page" :is="Component" process-code="SLM" :process-api="slmApi"/>
        </router-view>
        <ims-footer ref="footer" module-name="SLM"/>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid, isSuccess, removeUrlAnchor } from "@/utils";
import { getProcess } from "@/api/getProcess";
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
        cacheKey() {
            // Include the query params in the route key, but not the anchors
            return removeUrlAnchor(this.$route.fullPath);
        },
    },
    created() {
        // Fetch the process information from the API
        let t = this;
        const piResult = getProcess(this.accessToken, 'SLM', true, this.slmApi);
        piResult.load().then(() => {
            if(isSuccess(t, piResult)) {
                // Success
                storeProcessInfo(piResult);

                // Tell the footer to update the process name and version
                // The ref to the footer might not be ready yet, so we wait
                const delayedFooterUpdate = setTimeout(function() {
                    let footer = t.$refs.footer;
                    if(isValid(footer)) {
                        clearTimeout(delayedFooterUpdate);
                        footer.switchProcess();
                    }
                }, 100);

                // Tell the page that the process info was loaded
                // The ref to the page might not be ready yet, so we wait
                const delayedPageUpdate = setTimeout(function() {
                    let page = t.$refs.page;
                    if(isValid(page)) {
                        clearTimeout(delayedPageUpdate);
                        if(isValid(page.updateProcessInfo))
                            page.updateProcessInfo();
                    }
                }, 100);
            }
        });
    },
}
</script>

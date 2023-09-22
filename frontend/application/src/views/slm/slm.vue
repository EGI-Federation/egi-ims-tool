<template>
    <ism-navbar module-name="SLM"/>
    <router-view :key="$route.fullPath"/>
    <ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { store, storeUsers, storeUsersByRole } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";


export default {
    name: 'ServiceLevelManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            processInfo: store.state.ims.slm.processInfo,
        }
    },
    computed: {
        slmVersion() { return this.processInfo ? this.processInfo.apiVersion : "1.0.0" },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

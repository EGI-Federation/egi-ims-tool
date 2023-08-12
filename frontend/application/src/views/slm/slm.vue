<template>
    <ism-navbar module-name="SLM"/>
    <router-view/>
    <ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ServiceLevelManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            slmVersion: "1.0.0",
        }
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

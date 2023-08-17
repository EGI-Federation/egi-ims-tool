<template>
    <ism-navbar module-name="SPM"/>
    <router-view/>
    <ism-footer module-name="SPM" :module-version="spmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ServicePortfolioManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            spmVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.temp.roles))
            parseRoles();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

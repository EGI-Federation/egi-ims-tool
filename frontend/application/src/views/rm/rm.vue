<template>
    <ism-navbar module-name="RM"/>
    <router-view/>
    <ism-footer module-name="RM" :module-version="rmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'RiskManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            rmVersion: "1.0.0",
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

<template>
    <ism-navbar module-name="HR"/>
    <router-view/>
    <ism-footer module-name="HR" :module-version="hrVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'HumanResources',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            hrVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.roles))
            parseRoles();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

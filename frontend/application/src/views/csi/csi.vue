<template>
    <ism-navbar module-name="CSI"/>
    <router-view/>
    <ism-footer module-name="CSI" :module-version="csiVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ContinualServiceImprovement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            csiVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.temp.roles) || 0 === store.state.temp.roles.size)
            parseRoles();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

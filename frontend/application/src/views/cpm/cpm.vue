<template>
    <ism-navbar module-name="CPM"/>
    <router-view/>
    <ism-footer module-name="CPM" :module-version="cpmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'CoordinatedProjectManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            cpmVersion: "1.0.1",
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

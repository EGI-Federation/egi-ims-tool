<template>
    <ism-navbar module-name="PPC"/>
    <router-view/>
    <ism-footer module-name="PPC" :module-version="ppcVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ParticipatedProjectCoordination',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            ppcVersion: "1.0.2",
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

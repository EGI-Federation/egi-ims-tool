<template>
    <ism-navbar module-name="PKM"/>
    <router-view/>
    <ism-footer module-name="PKM" :module-version="pkmVersion"/>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ProjectKnowledgeManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            pkmVersion: "1.0.11",
            loggedIn: store.state.loggedIn,
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

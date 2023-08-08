<template>
    <ism-navbar/>
    <router-view/>
    <ism-footer/>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'systemHome',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            loggedIn: store.state.loggedIn,
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

<template>
    <ism-navbar module-name="PM"/>
    <router-view/>
    <ism-footer module-name="PM" :module-version="pmVersion"/>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ProblemManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            pmVersion: "1.0.0",
            loggedIn: store.state.oidc.oidcIsAuthenticated && null != store.state.oidc.oidcAccessToken,
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

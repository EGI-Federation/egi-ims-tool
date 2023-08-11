<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the RDM roles page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'rdmRoles',
    components: { BreadCrumb },
    data() {
        return {
            loggedIn: store.state.oidc.oidcIsAuthenticated && null != store.state.oidc.oidcAccessToken,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.RDM"), link: "/rdm" },
                { text: this.$t("navbar.roles") },
            ],
        }
    },
    methods: {
        processMenu() {
            return false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

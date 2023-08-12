<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the SUPPM home page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";
import {parseRoles} from "@/roles";

export default {
    name: 'suppmHome',
    components: { BreadCrumb },
    data() {
        return {
            loggedIn: store.state.oidc.oidcIsAuthenticated && null != store.state.oidc.oidcAccessToken,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SUPPM") },
            ],
        }
    },
    methods: {
        test() {
            return false;
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

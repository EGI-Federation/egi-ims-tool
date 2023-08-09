<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the SRM procedures page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'srmProcedures',
    components: { BreadCrumb },
    data() {
        return {
            loggedIn: store.state.loggedIn,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SRM"), link: "/srm" },
                { text: this.$t("navbar.procedures") },
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

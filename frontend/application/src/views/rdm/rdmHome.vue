<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the RDM home page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'rdmHome',
    components: { BreadCrumb },
    data() {
        return {
            loggedIn: store.state.loggedIn,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.RDM") },
            ],
        }
    },
    methods: {
        test() {
            return false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

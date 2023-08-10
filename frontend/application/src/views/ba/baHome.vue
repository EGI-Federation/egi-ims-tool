<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the BA home page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'baHome',
    components: { BreadCrumb },
    data() {
        return {
            loggedIn: store.state.ims.loggedIn,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.BA") },
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

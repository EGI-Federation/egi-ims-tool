<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="page">
        <div class="about">
            <br/>
            <h1>This is the Projects page</h1>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'systemProjects',
    components: { BreadCrumb },
    props: {
        processCode: String,
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.IMS"), link:"/ims" },
                { text: this.$t("navbar.projects") },
            ],
        }
    },
    methods: {
        test() {
            return false;
        }
    },
    created() {
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

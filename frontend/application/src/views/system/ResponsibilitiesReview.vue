<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>New review of the {{ processCode }} process responsibilities</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'ResponsibilitiesReview',
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
                { text: this.$t("home.IMS"), link: "/ims" },
                { text: this.$t("navbar.plan"), link: "/ims/plan" },
                { text: this.$t("navbar.roles"), link: "/ims/plan/roles" },
                { text: this.$t("ims.review") },
            ],
        }
    },
    computed: {
        something() {
            return "";
        },
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

<template>
    <roles-loader :process-code="processCode" :api-base-url="processApi"/>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the {{ processCode }} KPIs page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import RolesLoader from "@/components/rolesLoader.vue"
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'KPIs',
    components: { RolesLoader, BreadCrumb },
    props: {
        processCode: String,
        processApi: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t(`home.${this.$props.processCode}`), link: `/${this.$props.processCode.toLowerCase()}` },
                { text: this.$t("navbar.kpis") },
            ],
        }
    },
    methods: {
        processMenu() {
            return false;
        }
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

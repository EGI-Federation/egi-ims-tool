<template>
    <roles-loader process-code="IMS" :api-base-url="processApi"/>
    <div class="page">
        <bread-crumb :segments="locationSegments"/>
        <governance-info :version="version" :api-base-url="processApi"/>
    </div>
</template>

<script>
// @ is an alias to /src
import BreadCrumb from "@/components/breadCrumb.vue";
import RolesLoader from "@/components/rolesLoader.vue";
import GovernanceInfo from "@/components/governanceInfo.vue"

export default {
    name: 'Governance',
    components: { RolesLoader, BreadCrumb, GovernanceInfo },
    props: {
        processCode: String, // Unused
        processApi: String,
        version: String,
    },
    data() {
        return {
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.IMS"), link:"/ims" },
                { text: this.$t("navbar.plan") },
            ],
        }
    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

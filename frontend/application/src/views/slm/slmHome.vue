<template>
    <bread-crumb :segments="locationSegments"/>
    <div class="about">
        <br/>
        <h1>This is the SLM home page</h1>
        {{ roles }}
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import {Roles, hasRole, parseRoles} from "@/roles";
import BreadCrumb from "@/components/breadCrumb.vue"

export default {
    name: 'slmHome',
    components: { BreadCrumb },
    data() {
        return {
            userInfo: store.state.oidc.user,
            accessToken: store.state.oidc.access_token,
            roles: store.state.roles,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM") },
            ],
        }
    },
    computed: {
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        isReportOwner() { return hasRole(this.roles, Roles.SLM.REPORT_OWNER); },
        isCatalogManager() { return hasRole(this.roles, Roles.SLM.CATALOG_MANAGER); },
        isSLAOwner() { return hasRole(this.roles, Roles.SLM.SLA_OWNER); },
        isOLAOwner() { return hasRole(this.roles, Roles.SLM.OLA_OWNER); },
        isUAOwner() { return hasRole(this.roles, Roles.SLM.UA_OWNER); },
        isMember() {
            if(!isValid(this.roles))
                return false;

            const groups = store.getters["ims/memberInGroups"];
            const member = groups.filter(group => "SLM" === group);
            return member.length > 0;
        },
    },
    methods: {
        test() {
            return false;
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

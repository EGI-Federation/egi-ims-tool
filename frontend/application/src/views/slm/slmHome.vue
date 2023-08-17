<template>
    <bread-crumb :segments="locationSegments"/>
    <ims-process-info :info="{ current: currentProcess, approved: approvedProcess, manager: processManager }"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import { Roles, hasRole } from "@/roles";
import BreadCrumb from "@/components/breadCrumb.vue"
import ImsProcessInfo from "@/components/imsProcess.vue"

export default {
    name: 'slmHome',
    components: { BreadCrumb, ImsProcessInfo },
    data() {
        return {
            userInfo: store.state.oidc.user,
            accessToken: store.state.oidc.access_token,
            currentProcess: store.state.ims.slm.processInfo, // Version<Process>
            approvedProcess: null,                           // Version<Process>
            processManager: null,
            locationSegments: [
                { text: this.$t("home.home"), link:"/" },
                { text: this.$t("home.SLM") },
            ],
        }
    },
    computed: {
        roles() { return store.state.roles; },
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
    created() {
        if(isValid(this.currentProcess) && isValid(this.currentProcess.entity)) {
            if("APPROVED" === this.currentProcess.entity.status) {
                this.approvedProcess = this.currentProcess;
            }
            else {
                const history = this.currentProcess.entity.history;
                if(isValid(history) && isValid(history.versions)) {
                    for(let version of history.versions) {
                        const pi = version.entity;
                        if("APPROVED" === pi.status) {
                            this.approvedProcess = version;
                            break;
                        }
                    }
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

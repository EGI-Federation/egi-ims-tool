<template>
    <ism-navbar module-name="RDM"/>
    <router-view/>
    <ism-footer module-name="RDM" :module-version="rdmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { Roles, parseRoles, hasRole } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ReleaseDeploymentManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            rdmVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.temp.roles) || 0 === store.state.temp.roles.size) {
            parseRoles();
            if(!hasRole(this.roles, Roles.VO.MEMBER))
                this.$router.replace('/');
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

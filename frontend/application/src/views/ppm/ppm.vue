<template>
    <ism-navbar module-name="PPM"/>
    <router-view/>
    <ism-footer module-name="PPM" :module-version="ppmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { Roles, parseRoles, hasRole } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'ProjectPortfolioManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            ppmVersion: "1.0.1",
        }
    },
    created() {
        if(!isValid(store.state.temp.roles) || 0 === store.state.temp.roles.size) {
            parseRoles();

            let router = this.$router;
            const delayedRoleCheck = setTimeout(function() {
                clearTimeout(delayedRoleCheck);
                if(!hasRole(store.state.temp.roles, Roles.VO.MEMBER))
                    // Non VO members to the homepage
                    router.replace('/');
            }, 500);
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

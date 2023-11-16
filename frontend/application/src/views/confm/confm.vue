<template>
    <ims-navbar module-name="CONFM"/>
    <div class="page-container">
        <div class="page">
            <router-view/>
        </div>
        <ims-footer module-name="CONFM" :module-version="confmVersion"/>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { Roles, parseRoles, hasRole } from "@/roles";
import { store } from "@/store";
import imsNavbar from "@/components/navbar.vue";
import imsFooter from "@/components/footer.vue";

export default {
    name: 'ConfigurationManagement',
    components: { imsNavbar, imsFooter },
    data() {
        return {
            confmVersion: "1.0.0",
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
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

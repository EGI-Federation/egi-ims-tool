<template>
    <ims-navbar module-name="CHM"/>
    <div class="page-container">
        <div class="page">
            <router-view/>
        </div>
        <ims-footer module-name="CHM" :module-version="chmVersion"/>
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
    name: 'ChangeManagement',
    components: { imsNavbar, imsFooter },
    data() {
        return {
            chmVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.temp.roles) || 0 === store.state.temp.roles.size) {
            parseRoles();
            i
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

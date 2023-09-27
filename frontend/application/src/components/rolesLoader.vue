<template>
</template>

<script>
// @ is an alias to /src
import { store, storeUsers, storeUsersByRole } from "@/store";
import { isValid } from "@/utils";
import { hasRole, parseRoles, Roles } from "@/roles";
import { getUsers } from "@/api/getUsers";
import { getUsersWithRole } from "@/api/getUsersWithRole";

export default {
    name: 'rolesLoader',
    props: {
        processCode: String,
        apiBaseUrl: String,
    },
    emits: ['loadedVoUsers', 'loadedProcessUsers', 'loadedUsersWithRoles'],
    data() {
        return {
            accessToken: store.state.oidc.access_token,
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

        // Fetch all IMS users from the API
        const uvResult = getUsers(this.accessToken, null, false, this.$props.apiBaseUrl);
        uvResult.load().then(() => {
            storeUsers('updateVoUsers', uvResult);
            this.$emit('loadedVoUsers');
        });

        // Fetch the users participating in this process from the API
        const upResult = getUsers(this.accessToken, this.$props.processCode, true, this.$props.apiBaseUrl);
        upResult.load().then(() => {
            storeUsers('ims/updateProcessUsers', upResult);
            this.$emit('loadedProcessUsers');
        });

        // Fetch the users with roles in this process from the API
        const urResult = getUsersWithRole(this.accessToken, this.$props.processCode, null, this.$props.apiBaseUrl);
        urResult.load().then(() => {
            storeUsersByRole(urResult);
            this.$emit('loadedUsersWithRoles');
        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

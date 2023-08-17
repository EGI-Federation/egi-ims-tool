<template>
    <router-link v-if="canConfig" to="/rm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/rm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/rm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/rm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'rmMenu',
    data() {
        return {
            roles: store.state.temp.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.RM.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.RM.PROCESS_MANAGER)); },
    },
}
</script>

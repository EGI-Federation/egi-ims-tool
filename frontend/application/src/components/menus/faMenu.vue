<template>
    <router-link v-if="canConfig" to="/fa/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/fa/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/fa/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/fa/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'faMenu',
    data() {
        return {
            roles: store.state.temp.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.FA.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.FA.PROCESS_MANAGER)); },
    },
}
</script>

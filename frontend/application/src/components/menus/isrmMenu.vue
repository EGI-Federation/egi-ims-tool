<template>
    <router-link v-if="canConfig" to="/isrm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/isrm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/isrm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/isrm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'isrmMenu',
    data() {
        return {
            roles: store.state.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.ISRM.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.ISRM.PROCESS_MANAGER)); },
    },
}
</script>

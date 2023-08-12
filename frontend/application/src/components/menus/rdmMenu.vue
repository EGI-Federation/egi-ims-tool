<template>
    <router-link v-if="canConfig" to="/rdm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/rdm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/rdm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/rdm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'rdmMenu',
    data() {
        return {
            roles: store.state.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.RDM.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.RDM.PROCESS_MANAGER)); },
    },
}
</script>

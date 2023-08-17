<template>
    <router-link v-if="canConfig" to="/ba/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/ba/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ba/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ba/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'baMenu',
    data() {
        return {
            roles: store.state.temp.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.BA.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.BA.PROCESS_MANAGER)); },
    },
}
</script>

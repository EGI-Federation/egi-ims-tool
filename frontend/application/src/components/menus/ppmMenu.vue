<template>
    <router-link v-if="canConfig" to="/ppm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/ppm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ppm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ppm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'ppmMenu',
    data() {
        return {
            roles: store.state.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.PPM.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.PPM.PROCESS_MANAGER)); },
    },
}
</script>

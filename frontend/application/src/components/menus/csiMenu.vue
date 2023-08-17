<template>
    <router-link v-if="canConfig" to="/csi/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/csi/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/csi/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/csi/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
import { store } from "@/store";
import { Roles, hasRole } from "@/roles";
import { isValid } from "@/utils";

export default {
    name: 'csiMenu',
    data() {
        return {
            roles: store.state.temp.roles,
        }
    },
    computed: {
        canConfig() { return isValid(this.roles) &&
                            (hasRole(this.roles, Roles.CSI.PROCESS_OWNER) ||
                             hasRole(this.roles, Roles.CSI.PROCESS_MANAGER)); },
    },
}
</script>

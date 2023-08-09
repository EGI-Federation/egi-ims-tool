<template>
    <router-link to="/csi/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/csi/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/csi/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/csi/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'csiMenu'
}
</script>

<template>
    <router-link to="/ppc/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/ppc/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ppc/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ppc/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'ppcMenu'
}
</script>

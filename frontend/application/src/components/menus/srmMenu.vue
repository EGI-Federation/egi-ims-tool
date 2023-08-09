<template>
    <router-link to="/srm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/srm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/srm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/srm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'srmMenu'
}
</script>

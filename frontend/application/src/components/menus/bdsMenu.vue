<template>
    <li><router-link to="/bds" class='dropdown-item'>{{ $t('navbar.process') }}</router-link></li>
    <li><router-link to="/bds/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link></li>
    <li><router-link to="/bds/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link></li>
    <li><router-link to="/bds/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link></li>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'bdsMenu',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>

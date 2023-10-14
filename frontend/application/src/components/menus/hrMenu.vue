<template>
    <li><router-link to="/hr" class='dropdown-item'>{{ $t('navbar.process') }}</router-link></li>
    <li><router-link to="/hr/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link></li>
    <li><router-link to="/hr/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link></li>
    <li><router-link to="/hr/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link></li>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'hrMenu',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>

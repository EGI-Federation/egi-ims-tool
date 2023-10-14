<template>
    <li><router-link to="/slm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link></li>
    <li><router-link to="/slm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link></li>
    <li><router-link to="/slm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link></li>
    <li><router-link to="/slm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link></li>
    <hr class='dropdown-divider'/>
    <li><router-link to="/slm/catalogs" class='dropdown-item'>{{ $t('slm.navbar.catalogs') }}</router-link></li>
    <li><router-link to="/slm/slas" class='dropdown-item'>{{ $t('slm.navbar.slas') }}</router-link></li>
    <li><router-link to="/slm/olas" class='dropdown-item'>{{ $t('slm.navbar.olas') }}</router-link></li>
    <li><router-link to="/slm/uas" class='dropdown-item'>{{ $t('slm.navbar.uas') }}</router-link></li>
    <li><router-link to="/slm/reports" class='dropdown-item'>{{ $t('navbar.reports') }}</router-link></li>
</template>

<script>
export default {
    name: 'slmMenu',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>

<template>
    <router-link to="/slm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/slm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/slm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/slm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>
    <router-link to="/slm/catalogs" class='dropdown-item'>{{ $t('slm.navbar.catalogs') }}</router-link>
    <router-link to="/slm/slas" class='dropdown-item'>{{ $t('slm.navbar.slas') }}</router-link>
    <router-link to="/slm/olas" class='dropdown-item'>{{ $t('slm.navbar.olas') }}</router-link>
    <router-link to="/slm/uas" class='dropdown-item'>{{ $t('slm.navbar.uas') }}</router-link>
    <router-link to="/slm/reports" class='dropdown-item'>{{ $t('slm.navbar.reports') }}</router-link>
</template>

<script>
export default {
    name: 'slmMenu'
}
</script>

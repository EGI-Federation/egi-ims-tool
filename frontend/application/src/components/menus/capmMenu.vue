<template>
    <router-link to="/capm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/capm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/capm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/capm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'capmMenu'
}
</script>

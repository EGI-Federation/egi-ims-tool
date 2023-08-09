<template>
    <router-link to="/ppm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/ppm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ppm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ppm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'ppmMenu'
}
</script>

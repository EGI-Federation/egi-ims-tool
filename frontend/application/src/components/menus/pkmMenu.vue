<template>
    <router-link to="/pkm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/pkm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/pkm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/pkm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'pkmMenu'
}
</script>

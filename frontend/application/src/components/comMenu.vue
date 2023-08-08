<template>
    <router-link to="/com/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/com/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/com/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/com/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'comMenu'
}
</script>

<template>
    <router-link to="/rm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/rm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/rm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/rm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'rmMenu',
}
</script>

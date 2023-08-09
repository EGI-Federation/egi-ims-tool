<template>
    <router-link to="/isrm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/isrm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/isrm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/isrm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'isrmMenu'
}
</script>

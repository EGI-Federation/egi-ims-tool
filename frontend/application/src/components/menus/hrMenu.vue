<template>
    <router-link to="/hr" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/hr/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/hr/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/hr/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'hrMenu',
}
</script>

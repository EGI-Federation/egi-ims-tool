<template>
    <router-link to="/bds" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/bds/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/bds/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/bds/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'bdsMenu',
}
</script>

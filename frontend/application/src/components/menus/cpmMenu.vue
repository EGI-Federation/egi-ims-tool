<template>
    <router-link to="/cpm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/cpm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/cpm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/cpm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'cpmMenu',
}
</script>

<template>
    <router-link to="/suppm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/suppm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/suppm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/suppm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'suppmMenu',
}
</script>

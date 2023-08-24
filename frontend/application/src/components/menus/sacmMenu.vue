<template>
    <router-link to="/sacm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/sacm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/sacm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/sacm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'sacmMenu',
}
</script>

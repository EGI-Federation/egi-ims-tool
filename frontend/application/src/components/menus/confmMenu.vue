<template>
    <router-link to="/confm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/confm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/confm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/confm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'confmMenu',
}
</script>

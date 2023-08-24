<template>
    <router-link to="/fa" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/fa/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/fa/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/fa/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'faMenu',
}
</script>

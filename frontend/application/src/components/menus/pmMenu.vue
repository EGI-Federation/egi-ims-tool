<template>
    <router-link to="/pm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/pm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/pm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/pm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'pmMenu',
}
</script>

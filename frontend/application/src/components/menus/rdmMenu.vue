<template>
    <router-link to="/rdm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/rdm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/rdm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/rdm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'rdmMenu',
}
</script>

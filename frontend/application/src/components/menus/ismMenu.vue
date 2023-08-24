<template>
    <router-link to="/ism" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/ism/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ism/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ism/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'ismMenu',
}
</script>
